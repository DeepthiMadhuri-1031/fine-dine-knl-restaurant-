import { Router } from 'express';
import crypto from 'node:crypto';
import { db } from '../db.js';
import { requireAdmin } from '../auth.js';

export const adminRouter = Router();

// Apply requireAdmin to all admin routes
adminRouter.use(requireAdmin);

// Dashboard Overview Statistics
adminRouter.get('/stats', (req, res) => {
  try {
    const todayStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    const totalOrdersRow = db.prepare('SELECT COUNT(*) as cnt FROM orders').get();
    const ordersTodayRow = db.prepare(`SELECT COUNT(*) as cnt FROM orders WHERE created_at LIKE ?`).get(`${todayStr}%`);
    const revenueRow = db.prepare(`SELECT COALESCE(SUM(total), 0) as rev FROM orders WHERE status != 'cancelled'`).get();
    const revenueTodayRow = db.prepare(`SELECT COALESCE(SUM(total), 0) as rev FROM orders WHERE status != 'cancelled' AND created_at LIKE ?`).get(`${todayStr}%`);
    const confirmedRow = db.prepare(`SELECT COUNT(*) as cnt FROM orders WHERE status = 'confirmed'`).get();
    const preparingRow = db.prepare(`SELECT COUNT(*) as cnt FROM orders WHERE status = 'preparing'`).get();
    const readyRow = db.prepare(`SELECT COUNT(*) as cnt FROM orders WHERE status IN ('ready', 'out_for_delivery')`).get();
    const deliveredRow = db.prepare(`SELECT COUNT(*) as cnt FROM orders WHERE status = 'delivered'`).get();
    const cancelledRow = db.prepare(`SELECT COUNT(*) as cnt FROM orders WHERE status = 'cancelled'`).get();
    const customerCountRow = db.prepare(`SELECT COUNT(*) as cnt FROM users WHERE role = 'customer'`).get();

    // Calculate top-selling dishes from real orders
    const allOrderItems = db.prepare(`SELECT items_json FROM orders WHERE status != 'cancelled'`).all();
    const dishSalesMap = new Map();

    for (const row of allOrderItems) {
      try {
        const items = JSON.parse(row.items_json || '[]');
        for (const i of items) {
          const key = i.name || i.dishId;
          const current = dishSalesMap.get(key) || { name: key, quantity: 0, revenue: 0 };
          current.quantity += (i.quantity || 1);
          current.revenue += (i.totalPrice || (i.unitPrice * i.quantity) || 0);
          dishSalesMap.set(key, current);
        }
      } catch {}
    }

    const topSellingDishes = Array.from(dishSalesMap.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // Recent 5 orders
    const recentOrdersRows = db.prepare(`
      SELECT id, customer_name, customer_phone, order_type, total, status, created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 5
    `).all();

    res.json({
      metrics: {
        totalOrders: totalOrdersRow.cnt,
        ordersToday: ordersTodayRow.cnt,
        totalRevenue: Math.round(revenueRow.rev),
        revenueToday: Math.round(revenueTodayRow.rev),
        confirmedOrders: confirmedRow.cnt,
        preparingOrders: preparingRow.cnt,
        readyOrders: readyRow.cnt,
        deliveredOrders: deliveredRow.cnt,
        cancelledOrders: cancelledRow.cnt,
        totalCustomers: customerCountRow.cnt,
        topSellingDishes
      },
      recentOrders: recentOrdersRows
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: 'Failed to retrieve admin dashboard stats.' });
  }
});

// Get all orders with filtering and search
adminRouter.get('/orders', (req, res) => {
  try {
    const { status, search, date } = req.query;

    let query = `
      SELECT id, user_id, customer_name, customer_phone, customer_email,
             order_type, delivery_address, table_number, notes,
             subtotal, packaging_fee, delivery_fee, tax_amount, total,
             payment_method, payment_status, status, cancellation_reason, cancelled_by,
             estimated_time_mins, items_json, created_at, updated_at
      FROM orders
    `;

    const conditions = [];
    const params = [];

    if (status && status !== 'all') {
      conditions.push('status = ?');
      params.push(status);
    }

    if (date && date.trim()) {
      conditions.push('created_at LIKE ?');
      params.push(`${date.trim()}%`);
    }

    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      conditions.push('(id LIKE ? OR customer_name LIKE ? OR customer_phone LIKE ?)');
      params.push(term, term, term);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const rows = db.prepare(query).all(...params);

    const orders = rows.map(r => ({
      ...r,
      orderId: r.id,
      items: JSON.parse(r.items_json || '[]')
    }));

    res.json({ orders });
  } catch (err) {
    console.error('Admin get orders error:', err);
    res.status(500).json({ error: 'Failed to retrieve orders.' });
  }
});

// Update order status (confirmed -> preparing -> ready -> out_for_delivery -> delivered)
adminRouter.patch('/orders/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus, note } = req.body;

    const validStatuses = ['placed', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const order = db.prepare('SELECT id, payment_method, payment_status, status FROM orders WHERE id = ?').get(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const now = new Date().toISOString();
    let newPaymentStatus = paymentStatus || order.payment_status;

    // Automatically mark payment as paid if delivered and paid via COD or Counter
    if (status === 'delivered' && newPaymentStatus === 'pending') {
      newPaymentStatus = 'paid';
    }

    db.prepare(`
      UPDATE orders
      SET status = ?, payment_status = ?, updated_at = ?
      WHERE id = ?
    `).run(status, newPaymentStatus, now, id);

    // Record in order status history
    const histId = `hist_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const statusNote = note || `Status advanced to ${status} by management`;
    db.prepare(`
      INSERT INTO order_status_history (id, order_id, status, notes, updated_by, created_at)
      VALUES (?, ?, ?, ?, 'admin', ?)
    `).run(histId, id, status, statusNote, now);

    res.json({
      message: `Order #${id} status updated to ${status}.`,
      orderId: id,
      status,
      paymentStatus: newPaymentStatus
    });
  } catch (err) {
    console.error('Update order status error:', err);
    res.status(500).json({ error: 'Failed to update order status.' });
  }
});

// Admin Cancellation
adminRouter.post('/orders/:id/cancel', (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = db.prepare('SELECT id, status FROM orders WHERE id = ?').get(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const now = new Date().toISOString();
    const cancellationReason = reason && reason.trim() ? reason.trim() : 'Cancelled by restaurant management';

    db.prepare(`
      UPDATE orders
      SET status = 'cancelled', cancellation_reason = ?, cancelled_by = 'admin', updated_at = ?
      WHERE id = ?
    `).run(cancellationReason, now, id);

    // Record cancellation in history
    const histId = `hist_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    db.prepare(`
      INSERT INTO order_status_history (id, order_id, status, notes, updated_by, created_at)
      VALUES (?, ?, 'cancelled', ?, 'admin', ?)
    `).run(histId, id, cancellationReason, now);

    res.json({
      message: `Order #${id} has been cancelled by admin.`,
      orderId: id,
      status: 'cancelled',
      cancellationReason
    });
  } catch (err) {
    console.error('Admin cancel order error:', err);
    res.status(500).json({ error: 'Failed to cancel order.' });
  }
});

// Menu Inventory: Get all items
adminRouter.get('/menu', (req, res) => {
  try {
    const items = db.prepare(`
      SELECT dish_id, name, category, base_price, is_available,
             description, is_veg, image_url, featured, spicy_level, updated_at
      FROM menu_inventory
      ORDER BY category, name
    `).all();
    res.json({ items });
  } catch (err) {
    console.error('Admin get menu error:', err);
    res.status(500).json({ error: 'Failed to retrieve menu inventory.' });
  }
});

// Menu Inventory: Add new dish
adminRouter.post('/menu', (req, res) => {
  try {
    const { dish_id, name, category, base_price, description, is_veg, image_url, featured, spicy_level } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'Dish name must be at least 2 characters.' });
    }

    const id = dish_id && dish_id.trim() ? dish_id.trim().toLowerCase().replace(/\s+/g, '-') : `dish_${Date.now()}`;
    const price = parseFloat(base_price) || 180;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO menu_inventory (
        dish_id, name, category, base_price, is_available,
        description, is_veg, image_url, featured, spicy_level, updated_at
      ) VALUES (?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      name.trim(),
      category || 'Main Course',
      price,
      description || '',
      is_veg ? 1 : 0,
      image_url || '/images/dishes/hyderabad-veg-biryani-hq.webp',
      featured ? 1 : 0,
      spicy_level || 'Mild',
      now
    );

    res.status(201).json({
      message: `Dish "${name}" added to menu catalog.`,
      dish: { dish_id: id, name: name.trim(), category, base_price: price, is_available: 1 }
    });
  } catch (err) {
    console.error('Add dish error:', err);
    res.status(500).json({ error: 'Failed to create menu item. Dish ID may already exist.' });
  }
});

// Menu Inventory: Update existing dish
adminRouter.put('/menu/:dishId', (req, res) => {
  try {
    const { dishId } = req.params;
    const { name, category, base_price, description, is_veg, image_url, featured, spicy_level, is_available } = req.body;

    const existing = db.prepare('SELECT dish_id FROM menu_inventory WHERE dish_id = ?').get(dishId);
    if (!existing) {
      return res.status(404).json({ error: 'Dish not found in menu inventory.' });
    }

    const now = new Date().toISOString();

    db.prepare(`
      UPDATE menu_inventory
      SET name = COALESCE(?, name),
          category = COALESCE(?, category),
          base_price = COALESCE(?, base_price),
          description = COALESCE(?, description),
          is_veg = COALESCE(?, is_veg),
          image_url = COALESCE(?, image_url),
          featured = COALESCE(?, featured),
          spicy_level = COALESCE(?, spicy_level),
          is_available = COALESCE(?, is_available),
          updated_at = ?
      WHERE dish_id = ?
    `).run(
      name,
      category,
      base_price !== undefined ? parseFloat(base_price) : null,
      description,
      is_veg !== undefined ? (is_veg ? 1 : 0) : null,
      image_url,
      featured !== undefined ? (featured ? 1 : 0) : null,
      spicy_level,
      is_available !== undefined ? (is_available ? 1 : 0) : null,
      now,
      dishId
    );

    res.json({ message: `Dish updated successfully.`, dishId });
  } catch (err) {
    console.error('Update dish error:', err);
    res.status(500).json({ error: 'Failed to update menu item.' });
  }
});

// Menu Inventory: Toggle availability
adminRouter.patch('/menu/:dishId/toggle', (req, res) => {
  try {
    const { dishId } = req.params;
    const item = db.prepare('SELECT dish_id, is_available, name FROM menu_inventory WHERE dish_id = ?').get(dishId);
    if (!item) {
      return res.status(404).json({ error: 'Dish not found in inventory.' });
    }

    const newStatus = item.is_available === 1 ? 0 : 1;
    const now = new Date().toISOString();

    db.prepare('UPDATE menu_inventory SET is_available = ?, updated_at = ? WHERE dish_id = ?').run(newStatus, now, dishId);

    res.json({
      message: `${item.name} is now ${newStatus === 1 ? 'Available' : 'Marked Out of Stock'}`,
      dishId,
      isAvailable: newStatus === 1
    });
  } catch (err) {
    console.error('Toggle dish error:', err);
    res.status(500).json({ error: 'Failed to toggle dish availability.' });
  }
});

// Customer Management: List registered customers
adminRouter.get('/customers', (req, res) => {
  try {
    const customers = db.prepare(`
      SELECT u.id, u.name, u.email, u.phone, u.created_at,
             COUNT(o.id) as order_count,
             COALESCE(SUM(CASE WHEN o.status != 'cancelled' THEN o.total ELSE 0 END), 0) as total_spend
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      WHERE u.role = 'customer'
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `).all();

    res.json({ customers });
  } catch (err) {
    console.error('Admin get customers error:', err);
    res.status(500).json({ error: 'Failed to retrieve customer accounts.' });
  }
});

// Restaurant Settings: Get settings
adminRouter.get('/settings', (req, res) => {
  try {
    const settings = db.prepare('SELECT * FROM restaurant_settings WHERE id = 1').get();
    res.json({ settings });
  } catch (err) {
    console.error('Admin get settings error:', err);
    res.status(500).json({ error: 'Failed to retrieve restaurant settings.' });
  }
});

// Restaurant Settings: Update settings
adminRouter.put('/settings', (req, res) => {
  try {
    const {
      restaurant_name,
      phone,
      contact_phone,
      email,
      contact_email,
      address,
      city,
      opening_time,
      closing_time,
      is_open_for_orders,
      is_open,
      delivery_enabled,
      pickup_enabled,
      delivery_fee,
      free_delivery_threshold,
      min_order_amount,
      min_order_value,
      packaging_fee,
      tax_percent,
      tax_percentage,
      cancellation_window_mins,
      upi_id,
      razorpay_key_id,
      razorpay_enabled
    } = req.body;

    const effectivePhone = phone ?? contact_phone;
    const effectiveEmail = email ?? contact_email;
    const effectiveIsOpen = is_open_for_orders !== undefined ? (is_open_for_orders ? 1 : 0) : (is_open !== undefined ? (is_open ? 1 : 0) : null);
    const effectiveMinOrder = min_order_amount !== undefined ? parseFloat(min_order_amount) : (min_order_value !== undefined ? parseFloat(min_order_value) : null);
    const effectiveTax = tax_percent !== undefined ? parseFloat(tax_percent) : (tax_percentage !== undefined ? parseFloat(tax_percentage) : null);

    const now = new Date().toISOString();

    db.prepare(`
      UPDATE restaurant_settings
      SET restaurant_name = COALESCE(?, restaurant_name),
          phone = COALESCE(?, phone),
          email = COALESCE(?, email),
          address = COALESCE(?, address),
          city = COALESCE(?, city),
          opening_time = COALESCE(?, opening_time),
          closing_time = COALESCE(?, closing_time),
          is_open_for_orders = COALESCE(?, is_open_for_orders),
          delivery_enabled = COALESCE(?, delivery_enabled),
          pickup_enabled = COALESCE(?, pickup_enabled),
          delivery_fee = COALESCE(?, delivery_fee),
          free_delivery_threshold = COALESCE(?, free_delivery_threshold),
          min_order_amount = COALESCE(?, min_order_amount),
          packaging_fee = COALESCE(?, packaging_fee),
          tax_percent = COALESCE(?, tax_percent),
          cancellation_window_mins = COALESCE(?, cancellation_window_mins),
          upi_id = COALESCE(?, upi_id),
          razorpay_key_id = COALESCE(?, razorpay_key_id),
          razorpay_enabled = COALESCE(?, razorpay_enabled),
          updated_at = ?
      WHERE id = 1
    `).run(
      restaurant_name ?? null,
      effectivePhone ?? null,
      effectiveEmail ?? null,
      address ?? null,
      city ?? null,
      opening_time ?? null,
      closing_time ?? null,
      effectiveIsOpen !== undefined && effectiveIsOpen !== null ? effectiveIsOpen : null,
      delivery_enabled !== undefined && delivery_enabled !== null ? (delivery_enabled ? 1 : 0) : null,
      pickup_enabled !== undefined && pickup_enabled !== null ? (pickup_enabled ? 1 : 0) : null,
      delivery_fee !== undefined && delivery_fee !== null ? parseFloat(delivery_fee) : null,
      free_delivery_threshold !== undefined && free_delivery_threshold !== null ? parseFloat(free_delivery_threshold) : null,
      effectiveMinOrder !== undefined && effectiveMinOrder !== null ? parseFloat(effectiveMinOrder) : null,
      packaging_fee !== undefined && packaging_fee !== null ? parseFloat(packaging_fee) : null,
      effectiveTax !== undefined && effectiveTax !== null ? parseFloat(effectiveTax) : null,
      cancellation_window_mins !== undefined && cancellation_window_mins !== null ? parseInt(cancellation_window_mins, 10) : null,
      upi_id ?? null,
      razorpay_key_id ?? null,
      razorpay_enabled !== undefined && razorpay_enabled !== null ? (razorpay_enabled ? 1 : 0) : null,
      now
    );

    const updated = db.prepare('SELECT * FROM restaurant_settings WHERE id = 1').get();
    // Attach compatible aliases
    const responseSettings = {
      ...updated,
      is_open: updated.is_open_for_orders,
      min_order_value: updated.min_order_amount,
      tax_percentage: updated.tax_percent,
      contact_phone: updated.phone,
      contact_email: updated.email
    };

    res.json({ message: 'Restaurant settings updated successfully.', settings: responseSettings });
  } catch (err) {
    console.error('Update settings error:', err);
    res.status(500).json({ error: 'Failed to update restaurant settings.' });
  }
});
