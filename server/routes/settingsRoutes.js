import { Router } from 'express';
import { db } from '../db.js';

export const settingsRouter = Router();

// Public: Get operational restaurant settings
settingsRouter.get('/', (req, res) => {
  try {
    const s = db.prepare(`
      SELECT restaurant_name, phone, email, address, city,
             opening_time, closing_time, is_open_for_orders,
             delivery_enabled, pickup_enabled, delivery_fee,
             free_delivery_threshold, min_order_amount, packaging_fee,
             tax_percent, upi_id, razorpay_enabled
      FROM restaurant_settings
      WHERE id = 1
    `).get() || {
      restaurant_name: 'FINE DINE KNL RESTAURANT',
      phone: '+91 94900 12345',
      email: 'contact@finedineknl.com',
      address: 'Near Collector Office Road, Kurnool, Andhra Pradesh 518002',
      city: 'Kurnool',
      opening_time: '11:00 AM',
      closing_time: '11:00 PM',
      is_open_for_orders: 1,
      delivery_enabled: 1,
      pickup_enabled: 1,
      delivery_fee: 30,
      free_delivery_threshold: 500,
      min_order_amount: 150,
      packaging_fee: 15,
      tax_percent: 5.0,
      upi_id: 'finedineknl@upi',
      razorpay_enabled: 0
    };

    res.json({ settings: s });
  } catch (err) {
    console.error('Fetch public settings error:', err);
    res.status(500).json({ error: 'Failed to retrieve restaurant settings.' });
  }
});
