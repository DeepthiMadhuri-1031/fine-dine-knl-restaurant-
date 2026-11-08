const path = require('path');
const assert = require('assert');

async function runTests() {
  console.log('🧪 Starting Ajwa Exotica Backend & Database Verification...\n');

  const { db } = await import('./server/db.js');

  // Test 1: Check database tables
  console.log('Test 1: Verifying SQLite Tables...');
  const tables = db.prepare(`SELECT name FROM sqlite_master WHERE type='table'`).all().map(t => t.name);
  console.log('Existing tables:', tables.join(', '));
  assert(tables.includes('reservations'), 'reservations table must exist');
  assert(tables.includes('restaurant_settings'), 'restaurant_settings table must exist');
  console.log('✅ Tables verified successfully.\n');

  // Test 2: Check Ajwa Exotica restaurant settings
  console.log('Test 2: Verifying Restaurant Settings...');
  const settings = db.prepare('SELECT * FROM restaurant_settings WHERE id = 1').get();
  assert.strictEqual(settings.restaurant_name, 'Ajwa Exotica', 'Restaurant name must be Ajwa Exotica');
  assert.strictEqual(settings.phone, '085182 53599', 'Phone must be 085182 53599');
  assert(settings.address.includes('Vishal Mart'), 'Address must mention Vishal Mart');
  assert(settings.address.includes('Kurnool'), 'Address must mention Kurnool');
  assert.strictEqual(settings.closing_time, '11:30 PM', 'Closing time must be 11:30 PM');
  console.log('Verified settings:', {
    name: settings.restaurant_name,
    phone: settings.phone,
    closing_time: settings.closing_time,
    address: settings.address
  });
  console.log('✅ Restaurant settings verified successfully.\n');

  // Test 3: Test Table Reservation insertion
  console.log('Test 3: Testing Table Reservation Logic...');
  const testBookingCode = 'AJWA-TEST-' + Math.floor(1000 + Math.random() * 9000);
  const now = new Date().toISOString();
  const insertStmt = db.prepare(`
    INSERT INTO reservations (
      id, booking_code, customer_name, customer_phone, customer_email,
      reservation_date, reservation_time, guests, seating_preference,
      special_requests, status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', ?, ?)
  `);

  insertStmt.run(
    'res_test_001',
    testBookingCode,
    'Suresh Reddy',
    '+919849012345',
    'suresh@example.com',
    '2026-10-25',
    '08:00 PM',
    6,
    'outdoor_terrace',
    'Anniversary celebration table on 3rd floor terrace',
    now,
    now
  );

  const fetchRes = db.prepare('SELECT * FROM reservations WHERE booking_code = ?').get(testBookingCode);
  assert(fetchRes, 'Reservation must be persisted and retrievable');
  assert.strictEqual(fetchRes.customer_name, 'Suresh Reddy');
  assert.strictEqual(fetchRes.guests, 6);
  assert.strictEqual(fetchRes.seating_preference, 'outdoor_terrace');
  console.log('Persisted Reservation:', {
    code: fetchRes.booking_code,
    name: fetchRes.customer_name,
    phone: fetchRes.customer_phone,
    date: fetchRes.reservation_date,
    time: fetchRes.reservation_time,
    guests: fetchRes.guests,
    seating: fetchRes.seating_preference
  });
  console.log('✅ Table Reservation insertion verified successfully.\n');

  // Test 4: Status update
  console.log('Test 4: Testing Reservation Status Transition...');
  db.prepare(`UPDATE reservations SET status = 'seated' WHERE id = 'res_test_001'`).run();
  const updatedRes = db.prepare('SELECT status FROM reservations WHERE id = ?').get('res_test_001');
  assert.strictEqual(updatedRes.status, 'seated');
  console.log('Updated status:', updatedRes.status);
  console.log('✅ Reservation Status update verified successfully.\n');

  // Cleanup test entry
  db.prepare(`DELETE FROM reservations WHERE id = 'res_test_001'`).run();
  console.log('🧹 Cleaned up test record.');

  console.log('\n🎉 ALL BACKEND & DATABASE TESTS PASSED WITH 100% SUCCESS!');
  process.exit(0);
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
