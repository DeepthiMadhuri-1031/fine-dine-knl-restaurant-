/**
 * Comprehensive 26-Point Automated Verification Suite
 * FINE DINE KNL RESTAURANT Full-Stack Platform
 */

const BASE_URL = process.env.BASE_URL || process.argv[2] || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, data };
}

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`✅ PASSED: ${message}`);
}

async function runTestSuite() {
  console.log('================================================================');
  console.log('🧪 FINE DINE KNL RESTAURANT — 26-POINT AUTOMATED TEST SUITE');
  console.log('================================================================\n');

  const timestamp = Date.now();
  const testEmail = `patron.${timestamp}@example.com`;
  const initialPassword = 'InitialPassword123!';
  const updatedPassword = 'NewSecretPass2026!';
  let customerToken = '';
  let customerId = '';
  let addressId = '';
  let orderId1 = '';
  let orderId2 = '';
  let adminToken = '';
  let resetToken = '';

  // 1. Health check & DB connection
  console.log('--- TEST 1: System Health & Database Connection ---');
  const health = await request('/health');
  assert(health.status === 200 && health.data.status === 'healthy', 'API server is running and SQLite is connected');
  assert(health.data.database === 'connected', 'Database reports healthy active status');

  // 2. Customer Registration
  console.log('\n--- TEST 2: Customer Registration with Complete Data ---');
  const regRes = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Ravi Teja Kurnool',
      email: testEmail,
      password: initialPassword,
      phone: '9848022338',
      house_flat: 'Flat 302, Sai Residency',
      street_locality: '18, Khadakpura Street',
      landmark: 'Near Old Mosque',
      city: 'Kurnool',
      pincode: '518001'
    })
  });
  assert(regRes.status === 201, 'Customer registration returns 201 Created');
  assert(regRes.data.user.role === 'customer', 'Public registration strictly enforces customer role');
  assert(typeof regRes.data.token === 'string', 'Registration returns JWT session token');
  customerToken = regRes.data.token;
  customerId = regRes.data.user.id;

  // 3. Indian Phone Format Validation (10 digits starting with 6-9)
  console.log('\n--- TEST 3: Phone Number Format Validation ---');
  const invalidPhoneRes = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Invalid Phone User',
      email: `badphone.${timestamp}@example.com`,
      password: 'SomePassword123!',
      phone: '123456' // invalid phone
    })
  });
  assert(invalidPhoneRes.status === 400, 'Invalid phone number rejected with 400 Bad Request');
  assert(invalidPhoneRes.data.error.includes('10-digit'), 'Error specifically notes 10-digit Indian mobile requirement');

  // 4. Duplicate Email Validation
  console.log('\n--- TEST 4: Duplicate Email Rejection ---');
  const dupRes = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Duplicate Attempt',
      email: testEmail,
      password: 'AnotherPassword123!',
      phone: '9848099999'
    })
  });
  assert(dupRes.status === 400, 'Duplicate email registration rejected with 400 Bad Request');
  assert(dupRes.data.error.includes('already exists'), 'Rejection clearly explains account exists');

  // 5. Scrypt Password Hashing (Direct DB Inspection)
  console.log('\n--- TEST 5: Password Hashing Verification (scrypt) ---');
  const dbModule = await import('./db.js');
  const rawUser = dbModule.db.prepare('SELECT password_hash, salt FROM users WHERE id = ?').get(customerId);
  assert(rawUser && rawUser.password_hash && rawUser.password_hash.length === 128, 'Password stored as scrypt hash (128-char hex output of 64-byte scrypt)');
  assert(rawUser.salt && rawUser.salt.length === 32, 'Per-user random cryptographic salt (32-char hex) stored');
  assert(!rawUser.password_hash.includes(initialPassword), 'Plaintext password is NEVER stored');
  dbModule.db.close();

  // 6. Forgot Password Token & Anti-Enumeration
  console.log('\n--- TEST 6: Forgot Password Flow & Anti-Enumeration ---');
  const forgotRes = await request('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email: testEmail })
  });
  assert(forgotRes.status === 200, 'POST /auth/forgot-password returns 200 OK');
  assert(typeof forgotRes.data.devResetToken === 'string', 'Development environment generates single-use reset token');
  resetToken = forgotRes.data.devResetToken;

  // Non-existent email must return identical generic message (prevent enumeration)
  const fakeForgotRes = await request('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email: 'nonexistent.person@example.com' })
  });
  assert(fakeForgotRes.status === 200, 'Non-existent email returns identical 200 OK');
  assert(fakeForgotRes.data.message.includes('If an account with that email address is registered'), 'Neutral message prevents email enumeration');

  // 7. Password Reset Execution
  console.log('\n--- TEST 7: Password Reset Execution ---');
  const resetRes = await request('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({
      token: resetToken,
      newPassword: updatedPassword
    })
  });
  assert(resetRes.status === 200, 'POST /auth/reset-password succeeds with 200 OK');

  // Token reuse should fail
  const reuseTokenRes = await request('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({
      token: resetToken,
      newPassword: 'AnotherPassword123!'
    })
  });
  assert(reuseTokenRes.status === 400, 'Used reset token cannot be reused');

  // 8. Login with New Password
  console.log('\n--- TEST 8: Customer Login with Updated Credentials ---');
  const loginRes = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: testEmail,
      password: updatedPassword
    })
  });
  assert(loginRes.status === 200, 'Login with new password succeeds');
  assert(loginRes.data.user.email === testEmail, 'Authenticated user profile matches');
  customerToken = loginRes.data.token;

  // 9. Protected Profile Route
  console.log('\n--- TEST 9: Protected Profile Endpoint (requireAuth) ---');
  const meRes = await request('/auth/me', {
    headers: { Authorization: `Bearer ${customerToken}` }
  });
  assert(meRes.status === 200, 'GET /auth/me returns 200 OK');
  assert(meRes.data.user.id === customerId, 'Profile matches authenticated user ID');

  // 10. Saved Delivery Addresses Creation
  console.log('\n--- TEST 10: Address Creation with Detailed Fields ---');
  const addAddrRes = await request('/addresses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${customerToken}` },
    body: JSON.stringify({
      label: 'Home',
      house_flat: 'Flat 402, Royal Palms',
      street_locality: 'Near Birla Mandir Road',
      landmark: 'Opposite Park',
      city: 'Kurnool',
      state: 'Andhra Pradesh',
      pincode: '518002',
      delivery_instructions: 'Ring doorbell twice',
      is_default: true
    })
  });
  assert(addAddrRes.status === 201, 'POST /addresses creates address with 201 Created');
  assert(addAddrRes.data.address.house_flat === 'Flat 402, Royal Palms', 'Detailed house/flat preserved');
  addressId = addAddrRes.data.address.id;

  // 11. Address Update
  console.log('\n--- TEST 11: Address Update ---');
  const updateAddrRes = await request(`/addresses/${addressId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${customerToken}` },
    body: JSON.stringify({
      label: 'Home',
      house_flat: 'Flat 402, Block B, Royal Palms',
      street_locality: 'Near Birla Mandir Road',
      landmark: 'Opposite Municipal Park',
      city: 'Kurnool',
      state: 'Andhra Pradesh',
      pincode: '518002',
      delivery_instructions: 'Please call before arrival',
      is_default: true
    })
  });
  assert(updateAddrRes.status === 200, 'PUT /addresses/:id updates address with 200 OK');
  assert(updateAddrRes.data.address.house_flat.includes('Block B'), 'Updated fields saved');

  // 12. Address Default Toggle
  console.log('\n--- TEST 12: Default Address Management ---');
  const setDefaultRes = await request(`/addresses/${addressId}/default`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${customerToken}` }
  });
  assert(setDefaultRes.status === 200, 'PATCH /addresses/:id/default sets default flag');

  // 13. Public Settings Retrieval
  console.log('\n--- TEST 13: Public Settings Endpoint ---');
  const pubSettings = await request('/settings');
  assert(pubSettings.status === 200, 'GET /settings returns 200 OK');
  assert(pubSettings.data.settings.restaurant_name === 'FINE DINE KNL RESTAURANT', 'Settings reflect correct restaurant name');
  assert(pubSettings.data.settings.free_delivery_threshold === 500, 'Free delivery threshold configured at 500');

  // 14. Server-Side Price Calculation & Order Creation
  console.log('\n--- TEST 14: Server Price Recalculation & Order 1 (Free Delivery) ---');
  const orderRes1 = await request('/orders', {
    method: 'POST',
    headers: { Authorization: `Bearer ${customerToken}` },
    body: JSON.stringify({
      customerName: 'Ravi Teja Kurnool',
      customerPhone: '9848022338',
      orderType: 'delivery',
      deliveryAddress: 'Flat 402, Block B, Royal Palms, Kurnool',
      paymentMethod: 'cod',
      items: [
        { dishId: 'sig-hyd-biryani', quantity: 2, selectedVariantLabel: 'Edition 3 (Revised)' }, // 180 * 2 = 360
        { dishId: 'sig-paneer-65', quantity: 1 } // 180 * 1 = 180
      ]
    })
  });
  assert(orderRes1.status === 201, 'POST /orders creates order with 201 Created');
  assert(orderRes1.data.order.subtotal === 570, 'Subtotal correctly verified from server database (570)');
  assert(orderRes1.data.order.deliveryFee === 0, 'Delivery fee waived automatically for order >= 500');
  assert(orderRes1.data.order.packagingFee === 15, 'Packaging fee applied (15)');
  assert(orderRes1.data.order.total === 585, 'Authoritative total verified (585)');
  assert(orderRes1.data.order.status === 'confirmed', 'Initial status is confirmed');
  orderId1 = orderRes1.data.order.orderId;

  // 15. Minimum Order Enforcement
  console.log('\n--- TEST 15: Minimum Order Enforcement ---');
  const smallOrderRes = await request('/orders', {
    method: 'POST',
    headers: { Authorization: `Bearer ${customerToken}` },
    body: JSON.stringify({
      customerName: 'Ravi Teja Kurnool',
      customerPhone: '9848022338',
      orderType: 'delivery',
      deliveryAddress: 'Khadak Pura, Kurnool',
      paymentMethod: 'cod',
      items: [
        { dishId: 'tandoori-roti', quantity: 1 } // ₹30 < ₹100
      ]
    })
  });
  assert(smallOrderRes.status === 400, 'Order below minimum threshold rejected with 400 Bad Request');
  assert(smallOrderRes.data.error.includes('Minimum order'), 'Error specifies minimum order value requirement');

  // 16. Duplicate Order Rapid-Submission Prevention (15s Window)
  console.log('\n--- TEST 16: Rapid Duplicate Order Prevention ---');
  const dupOrderRes = await request('/orders', {
    method: 'POST',
    headers: { Authorization: `Bearer ${customerToken}` },
    body: JSON.stringify({
      customerName: 'Ravi Teja Kurnool',
      customerPhone: '9848022338',
      orderType: 'delivery',
      deliveryAddress: 'Flat 402, Block B, Royal Palms, Kurnool',
      paymentMethod: 'cod',
      items: [
        { dishId: 'sig-hyd-biryani', quantity: 2, selectedVariantLabel: 'Edition 3 (Revised)' },
        { dishId: 'sig-paneer-65', quantity: 1 }
      ]
    })
  });
  assert(dupOrderRes.status === 429, 'Immediate duplicate order rejected with 429 Too Many Requests');

  // 17. Customer Order History & Tracking Details
  console.log('\n--- TEST 17: Customer Order History & Tracker ---');
  const myOrdersRes = await request('/orders/my-orders', {
    headers: { Authorization: `Bearer ${customerToken}` }
  });
  assert(myOrdersRes.status === 200, 'GET /orders/my-orders succeeds with 200 OK');
  assert(myOrdersRes.data.orders.some(o => o.orderId === orderId1), 'My Orders feed includes order 1');

  const trackRes = await request(`/orders/${orderId1}`, {
    headers: { Authorization: `Bearer ${customerToken}` }
  });
  assert(trackRes.status === 200, 'GET /orders/:id returns order tracking details');
  assert(trackRes.data.order.orderId === orderId1, 'Tracked order ID matches');

  // 18. Order Status History Audit Trail
  console.log('\n--- TEST 18: Order Status History Audit Logging ---');
  assert(trackRes.data.history && trackRes.data.history.length >= 1, 'Order has status history log');
  assert(trackRes.data.history[0].status === 'confirmed', 'Initial status logged in audit trail');

  // 19. Reorder Items Endpoint
  console.log('\n--- TEST 19: Reorder Items Endpoint ---');
  const reorderRes = await request(`/orders/${orderId1}/reorder`, {
    headers: { Authorization: `Bearer ${customerToken}` }
  });
  assert(reorderRes.status === 200 && reorderRes.data.success === true, 'GET /orders/:id/reorder returns 200 OK');
  assert(reorderRes.data.items.length === 2, 'Reorder returns all previous order items');

  // 20. Customer Order Cancellation While Confirmed
  console.log('\n--- TEST 20: Customer Order Cancellation While Confirmed ---');
  const cancelRes = await request(`/orders/${orderId1}/cancel`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${customerToken}` },
    body: JSON.stringify({ reason: 'Incorrect items ordered, replacing order' })
  });
  assert(cancelRes.status === 200, 'Customer order cancellation succeeded');
  assert(cancelRes.data.status === 'cancelled', 'Order status updated to cancelled');

  // 21. Security Role Isolation (Customer Blocked from Admin Routes)
  console.log('\n--- TEST 21: Security Role Isolation ---');
  const custAdminAttempt = await request('/admin/stats', {
    headers: { Authorization: `Bearer ${customerToken}` }
  });
  assert(custAdminAttempt.status === 403, 'Regular customer denied access to /api/admin/* (403 Forbidden)');

  // 22. Admin Authentication & Overview Stats
  console.log('\n--- TEST 22: Admin Authentication & Dashboard Stats ---');
  const adminLoginRes = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'admin@finedineknl.com',
      password: 'Admin@KNL2026!'
    })
  });
  assert(adminLoginRes.status === 200, 'Admin login succeeds with 200 OK');
  assert(adminLoginRes.data.user.role === 'admin', 'Admin user verified with admin role');
  adminToken = adminLoginRes.data.token;

  const adminStatsRes = await request('/admin/stats', {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert(adminStatsRes.status === 200, 'GET /admin/stats succeeds with 200 OK');
  assert(typeof adminStatsRes.data.metrics.totalOrders === 'number', 'Metrics contain live database order count');

  // 23. Create Order 2 and Progress Through Statuses
  console.log('\n--- TEST 23: Order 2 Status Progression (Kitchen Workflow) ---');
  const orderRes2 = await request('/orders', {
    method: 'POST',
    headers: { Authorization: `Bearer ${customerToken}` },
    body: JSON.stringify({
      customerName: 'Ravi Teja Kurnool',
      customerPhone: '9490112233',
      orderType: 'pickup',
      paymentMethod: 'counter',
      items: [
        { dishId: 'veg-curry-rayalaseema', quantity: 1 } // 180
      ]
    })
  });
  assert(orderRes2.status === 201, 'Order 2 created for kitchen status test');
  orderId2 = orderRes2.data.order.orderId;

  // Advance to preparing
  const advanceToPrep = await request(`/admin/orders/${orderId2}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({ status: 'preparing' })
  });
  assert(advanceToPrep.status === 200 && advanceToPrep.data.status === 'preparing', 'Status advanced to preparing');

  // Advance to ready
  const advanceToReady = await request(`/admin/orders/${orderId2}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({ status: 'ready' })
  });
  assert(advanceToReady.status === 200 && advanceToReady.data.status === 'ready', 'Status advanced to ready');

  // Advance to delivered
  const advanceToDelivered = await request(`/admin/orders/${orderId2}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({ status: 'delivered' })
  });
  assert(advanceToDelivered.status === 200 && advanceToDelivered.data.status === 'delivered', 'Status advanced to delivered');
  assert(advanceToDelivered.data.paymentStatus === 'paid', 'Delivered counter order marked as paid');

  // 24. Cancellation Rejection Once Kitchen Starts Preparing
  console.log('\n--- TEST 24: Customer Cancellation Rejection Once in Preparation ---');
  // Create an order and immediately advance to preparing
  const orderRes3 = await request('/orders', {
    method: 'POST',
    headers: { Authorization: `Bearer ${customerToken}` },
    body: JSON.stringify({
      customerName: 'Ravi Teja Kurnool',
      customerPhone: '9490112244',
      orderType: 'delivery',
      deliveryAddress: 'B-Camp, Kurnool',
      paymentMethod: 'cod',
      items: [{ dishId: 'sig-paneer-butter-masala', quantity: 1 }]
    })
  });
  const orderId3 = orderRes3.data.order.orderId;

  await request(`/admin/orders/${orderId3}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({ status: 'preparing' })
  });

  const rejectedCancel = await request(`/orders/${orderId3}/cancel`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${customerToken}` },
    body: JSON.stringify({ reason: 'Changed mind' })
  });
  assert(rejectedCancel.status === 400, 'Customer cancellation rejected once order status is preparing');
  assert(rejectedCancel.data.error.includes('started preparing'), 'Helpful error explaining kitchen is actively cooking');

  // 25. Menu Inventory Stock Toggle (Sold-Out Protection)
  console.log('\n--- TEST 25: Menu Inventory Stock Toggle & Sold-Out Protection ---');
  const toggleOff = await request('/admin/menu/sig-paneer-65/toggle', {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert(toggleOff.status === 200 && toggleOff.data.isAvailable === false, 'Dish successfully marked as Sold Out');

  // Attempting to order sold-out dish must be rejected
  const soldOutOrder = await request('/orders', {
    method: 'POST',
    headers: { Authorization: `Bearer ${customerToken}` },
    body: JSON.stringify({
      customerName: 'Ravi Teja Kurnool',
      customerPhone: '9490112255',
      orderType: 'delivery',
      deliveryAddress: 'Bellary Chowrasta, Kurnool',
      paymentMethod: 'cod',
      items: [{ dishId: 'sig-paneer-65', quantity: 1 }]
    })
  });
  assert(soldOutOrder.status === 400, 'Ordering sold-out dish is strictly rejected with 400');
  assert(soldOutOrder.data.error.includes('sold out'), 'Error explicitly informs customer that dish is sold out');

  // Toggle back to available
  const toggleOn = await request('/admin/menu/sig-paneer-65/toggle', {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert(toggleOn.status === 200 && toggleOn.data.isAvailable === true, 'Dish returned to available stock');

  // 26. Admin Restaurant Settings Management
  console.log('\n--- TEST 26: Admin Restaurant Settings Management ---');
  const updateSettingsRes = await request('/admin/settings', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({
      is_open: 1,
      opening_time: '11:00 AM',
      closing_time: '11:00 PM',
      delivery_enabled: 1,
      pickup_enabled: 1,
      delivery_fee: 30,
      free_delivery_threshold: 500,
      packaging_fee: 15,
      tax_percentage: 0,
      min_order_value: 100,
      cancellation_window_mins: 5,
      upi_id: 'finedineknl@upi',
      upi_qr_url: '/images/upi-qr-placeholder.png',
      contact_phone: '9876543210',
      contact_email: 'support@finedineknl.com',
      address: '18, Khadakpura Street, Khadak Pura, Kurnool, Andhra Pradesh 518001'
    })
  });
  console.log('Update settings response:', updateSettingsRes.status, updateSettingsRes.data);
  assert(updateSettingsRes.status === 200, 'PUT /admin/settings updates settings successfully');
  assert(updateSettingsRes.data.settings.min_order_value === 100, 'Settings verified from database response');

  console.log('\n================================================================');
  console.log('🎉 ALL 26 COMPREHENSIVE VERIFICATION TESTS PASSED SUCCESSFULLY!');
  console.log('================================================================\n');
}

runTestSuite().catch(err => {
  console.error('\n❌ TEST SUITE FAILED:', err);
  process.exit(1);
});
