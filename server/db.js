import { DatabaseSync } from 'node:sqlite';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, 'knl_restaurant.db');

// Ensure parent directory exists (critical for Render persistent disks such as /var/data)
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// If DATABASE_PATH is a new persistent volume file that doesn't exist yet,
// seed it from the pre-populated seed file if available to preserve accounts and orders!
const localSeedPath = path.join(__dirname, 'knl_restaurant.db');
if (!fs.existsSync(DB_PATH) && fs.existsSync(localSeedPath) && path.resolve(DB_PATH) !== path.resolve(localSeedPath)) {
  try {
    fs.copyFileSync(localSeedPath, DB_PATH);
    console.log(`📦 Seeded persistent database to ${DB_PATH}`);
  } catch (seedErr) {
    console.warn('Could not copy local seed database:', seedErr.message);
  }
}

export const db = new DatabaseSync(DB_PATH);

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON;');

export function initDatabase() {
  // Create core tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'customer',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS addresses (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      label TEXT NOT NULL DEFAULT 'Home',
      house_flat TEXT,
      street_locality TEXT,
      address_line TEXT NOT NULL,
      city TEXT NOT NULL DEFAULT 'Kurnool',
      state TEXT NOT NULL DEFAULT 'Andhra Pradesh',
      pincode TEXT,
      landmark TEXT,
      delivery_instructions TEXT,
      is_default INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_email TEXT,
      order_type TEXT NOT NULL,
      delivery_address TEXT,
      table_number TEXT,
      notes TEXT,
      subtotal REAL NOT NULL,
      packaging_fee REAL NOT NULL,
      delivery_fee REAL NOT NULL,
      tax_amount REAL NOT NULL DEFAULT 0,
      total REAL NOT NULL,
      payment_method TEXT NOT NULL,
      payment_status TEXT NOT NULL DEFAULT 'pending',
      payment_reference TEXT,
      status TEXT NOT NULL DEFAULT 'confirmed',
      cancellation_reason TEXT,
      cancelled_by TEXT,
      estimated_time_mins INTEGER NOT NULL DEFAULT 25,
      items_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS order_status_history (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      status TEXT NOT NULL,
      notes TEXT,
      updated_by TEXT NOT NULL DEFAULT 'system',
      created_at TEXT NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS menu_inventory (
      dish_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      base_price REAL,
      is_available INTEGER NOT NULL DEFAULT 1,
      description TEXT,
      is_veg INTEGER NOT NULL DEFAULT 1,
      image_url TEXT,
      featured INTEGER NOT NULL DEFAULT 0,
      spicy_level TEXT,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS password_resets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token_hash TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      used INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS restaurant_settings (
      id INTEGER PRIMARY KEY DEFAULT 1,
      restaurant_name TEXT NOT NULL DEFAULT 'FINE DINE KNL RESTAURANT',
      phone TEXT NOT NULL DEFAULT '+91 94900 12345',
      email TEXT NOT NULL DEFAULT 'contact@finedineknl.com',
      address TEXT NOT NULL DEFAULT 'Near Collector Office Road, Kurnool, Andhra Pradesh',
      city TEXT NOT NULL DEFAULT 'Kurnool',
      opening_time TEXT NOT NULL DEFAULT '11:00 AM',
      closing_time TEXT NOT NULL DEFAULT '11:00 PM',
      is_open_for_orders INTEGER NOT NULL DEFAULT 1,
      delivery_enabled INTEGER NOT NULL DEFAULT 1,
      pickup_enabled INTEGER NOT NULL DEFAULT 1,
      delivery_fee REAL NOT NULL DEFAULT 30,
      free_delivery_threshold REAL NOT NULL DEFAULT 500,
      min_order_amount REAL NOT NULL DEFAULT 150,
      packaging_fee REAL NOT NULL DEFAULT 15,
      tax_percent REAL NOT NULL DEFAULT 5.0,
      cancellation_window_mins INTEGER NOT NULL DEFAULT 5,
      upi_id TEXT NOT NULL DEFAULT 'finedineknl@upi',
      razorpay_key_id TEXT DEFAULT '',
      razorpay_enabled INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      admin_id TEXT NOT NULL,
      action TEXT NOT NULL,
      details TEXT,
      created_at TEXT NOT NULL
    );
  `);

  // Safe column migrations for existing tables
  const safeAddColumn = (table, column, def) => {
    try {
      db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${def};`);
    } catch {
      // Column already exists
    }
  };

  safeAddColumn('addresses', 'house_flat', 'TEXT');
  safeAddColumn('addresses', 'street_locality', 'TEXT');
  safeAddColumn('addresses', 'state', "TEXT NOT NULL DEFAULT 'Andhra Pradesh'");
  safeAddColumn('addresses', 'delivery_instructions', 'TEXT');
  safeAddColumn('orders', 'tax_amount', 'REAL NOT NULL DEFAULT 0');
  safeAddColumn('orders', 'payment_reference', 'TEXT');
  safeAddColumn('menu_inventory', 'description', 'TEXT');
  safeAddColumn('menu_inventory', 'is_veg', 'INTEGER NOT NULL DEFAULT 1');
  safeAddColumn('menu_inventory', 'image_url', 'TEXT');
  safeAddColumn('menu_inventory', 'featured', 'INTEGER NOT NULL DEFAULT 0');
  safeAddColumn('menu_inventory', 'spicy_level', 'TEXT');

  // Seed default admin account if not exists
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@finedineknl.com';
  const adminCheckStmt = db.prepare('SELECT id FROM users WHERE email = ?');
  const existingAdmin = adminCheckStmt.get(adminEmail);

  if (!existingAdmin) {
    const adminId = 'user_admin_001';
    const salt = crypto.randomBytes(16).toString('hex');
    const adminPass = process.env.ADMIN_INITIAL_PASSWORD || 'Admin@KNL2026!';
    const passwordHash = crypto.scryptSync(adminPass, salt, 64).toString('hex');
    const now = new Date().toISOString();

    const insertAdminStmt = db.prepare(`
      INSERT INTO users (id, name, email, phone, password_hash, salt, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertAdminStmt.run(
      adminId,
      'Restaurant Operations Manager',
      adminEmail,
      process.env.ADMIN_PHONE || '9490012345',
      passwordHash,
      salt,
      'admin',
      now,
      now
    );
    console.log(`✅ Default admin account verified: ${adminEmail}`);
  }

  // Seed default restaurant settings if not exists
  const settingsCheck = db.prepare('SELECT id FROM restaurant_settings WHERE id = 1').get();
  if (!settingsCheck) {
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO restaurant_settings (
        id, restaurant_name, phone, email, address, city,
        opening_time, closing_time, is_open_for_orders,
        delivery_enabled, pickup_enabled, delivery_fee,
        free_delivery_threshold, min_order_amount, packaging_fee,
        tax_percent, cancellation_window_mins, upi_id, updated_at
      ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, 1, 1, 1, 30, 500, 150, 15, 5.0, 5, 'finedineknl@upi', ?)
    `).run(
      'FINE DINE KNL RESTAURANT',
      '+91 94900 12345',
      'contact@finedineknl.com',
      'Near Collector Office Road, Kurnool, Andhra Pradesh 518002',
      'Kurnool',
      '11:00 AM',
      '11:00 PM',
      now
    );
    console.log('✅ Default restaurant settings initialized.');
  }

  // Seed / sync menu inventory from menuCatalog.json
  try {
    const catalogPath = path.join(__dirname, 'menuCatalog.json');
    if (fs.existsSync(catalogPath)) {
      const items = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
      const countCheck = db.prepare('SELECT COUNT(*) as cnt FROM menu_inventory').get();
      const now = new Date().toISOString();

      if (countCheck.cnt === 0) {
        const insertItem = db.prepare(`
          INSERT INTO menu_inventory (
            dish_id, name, category, base_price, is_available,
            description, is_veg, image_url, featured, spicy_level, updated_at
          ) VALUES (?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?)
        `);
        for (const item of items) {
          const basePrice = item.price !== null ? item.price : (item.priceVariants ? item.priceVariants[item.priceVariants.length - 1].price : 180);
          insertItem.run(
            item.id,
            item.name,
            item.category,
            basePrice,
            item.description || '',
            item.isVeg ? 1 : 0,
            item.imageUrl || '',
            item.featured ? 1 : 0,
            item.spicyLevel || 'Mild',
            now
          );
        }
        console.log(`✅ Seeded ${items.length} dishes into menu_inventory table.`);
      } else {
        // Update metadata fields to match catalog
        const updateMeta = db.prepare(`
          UPDATE menu_inventory
          SET description = ?,
              image_url = ?,
              is_veg = ?,
              featured = ?
          WHERE dish_id = ?
        `);
        for (const item of items) {
          updateMeta.run(
            item.description || '',
            item.imageUrl || '',
            item.isVeg ? 1 : 0,
            item.featured ? 1 : 0,
            item.id
          );
        }
      }
    }
  } catch (err) {
    console.warn('Could not sync menu_inventory:', err.message);
  }
}
