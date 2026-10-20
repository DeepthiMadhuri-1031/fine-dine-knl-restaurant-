import { Router } from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { db } from '../db.js';
import { requireAuth } from '../auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const orderRouter = Router();

// Load verified menu catalog for authoritative pricing
const catalogPath = path.join(__dirname, '..', 'menuCatalog.json');
let menuCatalogMap = new Map();
if (fs.existsSync(catalogPath)) {
  const items = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  for (const item of items) {
    menuCatalogMap.set(item.id, item);
  }
}

/**
 * Helper to generate order ID: KNL-YYMMDD-XXXX
 */
function generateOrderId() {
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `KNL-${year}${month}${day}-${randomSuffix}`;
}

// Create New Order (Server-Validated)
orderRouter.post('/', requireAuth, (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      orderType,
      deliveryAddress,
      tableNumber,
      notes,
      items,
      paymentMethod
    } = req.body;

    // Fetch restaurant settings
    const settings = db.prepare('SELECT * FROM restaurant_settings WHERE id = 1').get() || {
      is_open_for_orders: 1,
      delivery_enabled: 1,
      pickup_enabled: 1,
      delivery_fee: 30,
      free_delivery_threshold: 500,
      min_order_amount: 150,
      packaging_fee: 15,
      tax_percent: 5.0,
      opening_time: '11:00 AM',
      closing_time: '11:00 PM'
    };

    // Check if restaurant is currently open for online orders
    if (settings.is_open_for_orders === 0) {
      return res.status(400).json({
        error: `FINE DINE KNL is currently closed for online ordering. Kitchen operational hours are ${settings.opening_time} to ${settings.closing_time}.`
      });
    }

    // Validate customer contact
    if (!customerName || customerName.trim().length < 2) {
      return res.status(400).json({ error: 'Please enter a valid customer name.' });
    }

    const cleanPhone = (customerPhone || req.user.phone || '').replace(/\D/g, '');
    if (cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit Indian mobile number.' });
    }

    if (!['delivery', 'pickup', 'dine-in'].includes(orderType)) {
      return res.status(400).json({ error: 'Invalid order type. Choose delivery, pickup, or dine-in.' });
    }

    if (orderType === 'delivery' && settings.delivery_enabled === 0) {
      return res.status(400).json({ error: 'Home delivery service is temporarily paused by restaurant management.' });
    }

    if (orderType === 'pickup' && settings.pickup_enabled === 0) {
      return res.status(400).json({ error: 'Takeaway pickup service is temporarily paused.' });
    }

    if (orderType === 'delivery' && (!deliveryAddress || deliveryAddress.trim().length < 5)) {
      return res.status(400).json({ error: 'Please provide a complete delivery address in Kurnool.' });
    }

    if (orderType === 'dine-in' && (!tableNumber || tableNumber.trim().length === 0)) {
      return res.status(400).json({ error: 'Please enter your table number for dine-in service.' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one menu item.' });
    }

    if (!['cod', 'upi', 'counter', 'online'].includes(paymentMethod)) {
      return res.status(400).json({ error: 'Invalid payment method selected.' });
    }

    // Server-Side Recalculation & Menu Integrity Verification
    let computedSubtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const dishId = item.dish?.id || item.dishId;
      if (!dishId) {
        return res.status(400).json({ error: 'Invalid item in order list.' });
      }

      // Check inventory availability in DB
      const inventory = db.prepare('SELECT is_available, base_price, name FROM menu_inventory WHERE dish_id = ?').get(dishId);
      if (inventory && inventory.is_available === 0) {
        return res.status(400).json({ error: `Sorry, "${inventory.name}" is currently sold out.` });
      }

      // Look up catalog item
      const catalogItem = menuCatalogMap.get(dishId);
      const dishName = catalogItem ? catalogItem.name : (inventory ? inventory.name : 'Food Item');

      const qty = parseInt(item.quantity, 10);
      if (isNaN(qty) || qty <= 0 || qty > 50) {
        return res.status(400).json({ error: `Invalid quantity for ${dishName}.` });
      }

      // Authoritative Price Calculation (snapshot at time of purchase)
      let unitPrice = 0;
      if (catalogItem) {
        if (catalogItem.price !== null) {
          unitPrice = catalogItem.price;
        } else if (catalogItem.priceVariants && catalogItem.priceVariants.length > 0) {
          const matchVar = item.selectedVariantLabel
            ? catalogItem.priceVariants.find(v => v.label === item.selectedVariantLabel)
            : null;
          unitPrice = matchVar ? matchVar.price : catalogItem.priceVariants[catalogItem.priceVariants.length - 1].price;
        } else {
          unitPrice = 180;
        }
      } else if (inventory && inventory.base_price) {
        unitPrice = inventory.base_price;
      } else {
        unitPrice = 180;
      }

      computedSubtotal += unitPrice * qty;

      validatedItems.push({
        dishId,
        name: dishName,
        category: catalogItem?.category || 'Main Course',
        quantity: qty,
        unitPrice,
        totalPrice: unitPrice * qty,
        variantLabel: item.selectedVariantLabel || undefined,
        notes: item.notes ? String(item.notes).slice(0, 100) : '',
        imageUrl: catalogItem?.imageUrl || '/images/dishes/hyderabad-veg-biryani-hq.webp'
      });
    }

    // Minimum order amount check
    const minOrderVal = settings.min_order_value ?? settings.min_order_amount ?? 100;
    if (computedSubtotal < minOrderVal) {
      return res.status(400).json({
        error: `Minimum order value is ₹${minOrderVal}. Your current food subtotal is ₹${computedSubtotal}.`
      });
    }

    const packagingFee = validatedItems.length > 0 ? (settings.packaging_fee ?? 15) : 0;
    const deliveryFee = orderType === 'delivery' 
      ? (computedSubtotal >= (settings.free_delivery_threshold ?? 500) ? 0 : (settings.delivery_fee ?? 30))
      : 0;

    const taxAmount = 0; // Tax included in menu prices per Indian restaurant standard
    const computedTotal = computedSubtotal + packagingFee + deliveryFee + taxAmount;

    // Duplicate Order Prevention: check if user placed an identical order within last 15 seconds
    const recentOrder = db.prepare(`
      SELECT id, created_at FROM orders
      WHERE user_id = ? AND total = ? AND status = 'confirmed'
      ORDER BY created_at DESC LIMIT 1
    `).get(req.user.id, computedTotal);

    if (recentOrder) {
      const orderTime = new Date(recentOrder.created_at).getTime();
      const nowTime = Date.now();
      if (nowTime - orderTime < 15000) {
        return res.status(429).json({
          error: 'Duplicate order detected. An identical order was placed a few moments ago.',
          orderId: recentOrder.id
        });
      }
    }

    const orderId = generateOrderId();
    const now = new Date().toISOString();
    const itemsJson = JSON.stringify(validatedItems);

    const insertOrderStmt = db.prepare(`
      INSERT INTO orders (
        id, user_id, customer_name, customer_phone, customer_email,
        order_type, delivery_address, table_number, notes,
        subtotal, packaging_fee, delivery_fee, tax_amount, total,
        payment_method, payment_status, status,
        estimated_time_mins, items_json, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertOrderStmt.run(
      orderId,
      req.user.id,
      customerName.trim(),
      cleanPhone,
      req.user.email,
      orderType,
      orderType === 'delivery' ? deliveryAddress.trim() : null,
      orderType === 'dine-in' ? tableNumber.trim() : null,
      notes ? notes.trim() : null,
      computedSubtotal,
      packagingFee,
      deliveryFee,
      taxAmount,
      computedTotal,
      paymentMethod,
      'pending',
      'confirmed',
      25,
      itemsJson,
      now,
      now
    );

    // Record initial status history
    const histId = `hist_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    db.prepare(`
      INSERT INTO order_status_history (id, order_id, status, notes, updated_by, created_at)
      VALUES (?, ?, 'confirmed', 'Order placed and confirmed by customer', 'customer', ?)
    `).run(histId, orderId, now);

    const createdOrder = {
      orderId,
      userId: req.user.id,
      customerName: customerName.trim(),
      customerPhone: cleanPhone,
      customerEmail: req.user.email,
      orderType,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress.trim() : null,
      tableNumber: orderType === 'dine-in' ? tableNumber.trim() : null,
      notes: notes ? notes.trim() : null,
      items: validatedItems,
      subtotal: computedSubtotal,
      packagingFee,
      deliveryFee,
      taxAmount,
      total: computedTotal,
      paymentMethod,
      paymentStatus: 'pending',
      status: 'confirmed',
      estimatedTimeMins: 25,
      createdAt: now,
    };

    return res.status(201).json({
      message: 'Order placed successfully!',
      order: createdOrder,
    });
  } catch (err) {
    console.error('Order creation error:', err);
    return res.status(500).json({ error: 'Failed to process order. Please try again.' });
  }
});

// Get Current Customer's Orders
orderRouter.get('/my-orders', requireAuth, (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT id, user_id, customer_name, customer_phone, order_type, delivery_address,
             table_number, notes, subtotal, packaging_fee, delivery_fee, tax_amount, total,
             payment_method, payment_status, status, cancellation_reason,
             estimated_time_mins, items_json, created_at, updated_at
      FROM orders
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).all(req.user.id);

    const orders = rows.map(r => ({
      ...r,
      orderId: r.id,
      items: JSON.parse(r.items_json || '[]')
    }));

    res.json({ orders });
  } catch (err) {
    console.error('Fetch customer orders error:', err);
    res.status(500).json({ error: 'Failed to retrieve order history.' });
  }
});

// Get Specific Order Details & Real-Time Tracking with Status History
orderRouter.get('/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const row = db.prepare(`
      SELECT id, user_id, customer_name, customer_phone, customer_email,
             order_type, delivery_address, table_number, notes,
             subtotal, packaging_fee, delivery_fee, tax_amount, total,
             payment_method, payment_status, payment_reference, status,
             cancellation_reason, cancelled_by,
             estimated_time_mins, items_json, created_at, updated_at
      FROM orders
      WHERE id = ?
    `).get(id);

    if (!row) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    // Role check: Only order owner or admin can view
    if (row.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. You do not own this order.' });
    }

    // Fetch status history timeline
    const history = db.prepare(`
      SELECT status, notes, updated_by, created_at
      FROM order_status_history
      WHERE order_id = ?
      ORDER BY created_at ASC
    `).all(id);

    const order = {
      ...row,
      orderId: row.id,
      items: JSON.parse(row.items_json || '[]'),
      statusHistory: history
    };

    res.json({ order, history });
  } catch (err) {
    console.error('Fetch order error:', err);
    res.status(500).json({ error: 'Failed to retrieve order details.' });
  }
});

// Reorder Items: Verify availability of historical items
orderRouter.get(['/:id/reorder', '/:id/reorder-items'], requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const row = db.prepare('SELECT id, user_id, items_json FROM orders WHERE id = ?').get(id);

    if (!row) return res.status(404).json({ error: 'Order not found.' });
    if (row.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const items = JSON.parse(row.items_json || '[]');
    const reorderPayload = [];

    for (const item of items) {
      const inventory = db.prepare('SELECT is_available, base_price, name FROM menu_inventory WHERE dish_id = ?').get(item.dishId);
      const catalogItem = menuCatalogMap.get(item.dishId);
      reorderPayload.push({
        dishId: item.dishId,
        name: item.name,
        quantity: item.quantity,
        isAvailable: inventory ? inventory.is_available === 1 : true,
        currentPrice: inventory?.base_price || item.unitPrice,
        unitPrice: item.unitPrice,
        variantLabel: item.variantLabel,
        notes: item.notes,
        dish: catalogItem || null
      });
    }

    res.json({ success: true, items: reorderPayload });
  } catch (err) {
    console.error('Reorder items error:', err);
    res.status(500).json({ error: 'Failed to prepare reorder items.' });
  }
});

// Cancel Order
orderRouter.post('/:id/cancel', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const row = db.prepare('SELECT id, user_id, status FROM orders WHERE id = ?').get(id);
    if (!row) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const isCustomerOwner = row.user_id === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isCustomerOwner && !isAdmin) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    if (row.status === 'cancelled') {
      return res.status(400).json({ error: 'This order is already cancelled.' });
    }

    if (row.status === 'delivered') {
      return res.status(400).json({ error: 'Delivered orders cannot be cancelled.' });
    }

    // If customer is cancelling, check if kitchen already started cooking
    const allowedCustomerStatuses = ['placed', 'confirmed'];
    if (!isAdmin && !allowedCustomerStatuses.includes(row.status)) {
      return res.status(400).json({
        error: 'Order cancellation is not permitted. The kitchen has already started preparing your food.'
      });
    }

    const cancellationReason = reason && reason.trim() ? reason.trim() : (isAdmin ? 'Cancelled by restaurant management' : 'Cancelled by customer');
    const cancelledBy = isAdmin ? 'admin' : 'customer';
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE orders
      SET status = 'cancelled', cancellation_reason = ?, cancelled_by = ?, updated_at = ?
      WHERE id = ?
    `).run(cancellationReason, cancelledBy, now, id);

    // Record cancellation in history
    const histId = `hist_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    db.prepare(`
      INSERT INTO order_status_history (id, order_id, status, notes, updated_by, created_at)
      VALUES (?, ?, 'cancelled', ?, ?, ?)
    `).run(histId, id, cancellationReason, cancelledBy, now);

    res.json({
      message: 'Order cancelled successfully.',
      orderId: id,
      status: 'cancelled',
      cancellationReason
    });
  } catch (err) {
    console.error('Order cancellation error:', err);
    res.status(500).json({ error: 'Failed to cancel order.' });
  }
});
