import { Router } from 'express';
import { db } from '../db.js';

export const menuRouter = Router();

// Public route: Get availability status for all dishes
menuRouter.get('/status', (req, res) => {
  try {
    const items = db.prepare('SELECT dish_id, is_available, base_price FROM menu_inventory').all();
    const statusMap = {};
    for (const item of items) {
      statusMap[item.dish_id] = {
        isAvailable: item.is_available === 1,
        basePrice: item.base_price
      };
    }
    res.json({ statusMap });
  } catch (err) {
    console.error('Menu status error:', err);
    res.status(500).json({ error: 'Failed to retrieve menu status.' });
  }
});
