import { Router } from 'express';
import crypto from 'node:crypto';
import { db } from '../db.js';
import { requireAdmin, optionalAuth } from '../auth.js';

export const reservationRouter = Router();

/**
 * Generate unique human-friendly booking code: AJWA-RES-XXXX
 */
function generateBookingCode() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let random = '';
  for (let i = 0; i < 4; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `AJWA-${random}`;
}

/**
 * Helper to normalize and validate Indian phone numbers
 */
function validateIndianPhone(phone) {
  if (!phone || typeof phone !== 'string') return null;
  // Remove spaces, hyphens, parentheses, plus
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  
  // If 12 digits starting with 91
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    const core = cleaned.slice(2);
    if (/^[6-9]\d{9}$/.test(core)) return `+91${core}`;
  }
  
  // If 10 digits starting with 6, 7, 8, or 9
  if (cleaned.length === 10 && /^[6-9]\d{9}$/.test(cleaned)) {
    return `+91${cleaned}`;
  }

  // If local landline e.g. 08518253599
  if (/^08518\d{6}$/.test(cleaned)) {
    return cleaned;
  }

  return null;
}

/**
 * POST /api/reservations
 * Book a table at Ajwa Exotica
 */
reservationRouter.post('/', optionalAuth, (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      reservationDate,
      reservationTime,
      guests,
      seatingPreference,
      specialRequests
    } = req.body;

    // Validate customer name
    if (!customerName || typeof customerName !== 'string' || customerName.trim().length < 2) {
      return res.status(400).json({ error: 'Please enter a valid guest name (at least 2 characters).' });
    }

    // Validate customer phone
    const normalizedPhone = validateIndianPhone(customerPhone);
    if (!normalizedPhone) {
      return res.status(400).json({
        error: 'Please enter a valid 10-digit Indian mobile number (e.g., 9876543210).'
      });
    }

    // Validate date (must not be past date)
    if (!reservationDate || !/^\d{4}-\d{2}-\d{2}$/.test(reservationDate)) {
      return res.status(400).json({ error: 'Please select a valid reservation date (YYYY-MM-DD).' });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    if (reservationDate < todayStr) {
      return res.status(400).json({ error: 'Reservation date cannot be in the past.' });
    }

    // Validate time
    if (!reservationTime || typeof reservationTime !== 'string') {
      return res.status(400).json({ error: 'Please select a reservation time slot.' });
    }

    // Validate guests
    const guestNum = parseInt(guests, 10);
    if (isNaN(guestNum) || guestNum < 1 || guestNum > 30) {
      return res.status(400).json({ error: 'Party size must be between 1 and 30 guests.' });
    }

    // Valid seating preferences
    const validSeating = ['standard', 'outdoor_terrace', 'private_dining'];
    const selectedSeating = validSeating.includes(seatingPreference) ? seatingPreference : 'standard';

    // Generate unique ID and booking code
    const id = `res_${crypto.randomUUID()}`;
    let bookingCode = generateBookingCode();
    let collisionCheck = db.prepare('SELECT id FROM reservations WHERE booking_code = ?').get(bookingCode);
    while (collisionCheck) {
      bookingCode = generateBookingCode();
      collisionCheck = db.prepare('SELECT id FROM reservations WHERE booking_code = ?').get(bookingCode);
    }

    const now = new Date().toISOString();

    const insertStmt = db.prepare(`
      INSERT INTO reservations (
        id, booking_code, customer_name, customer_phone, customer_email,
        reservation_date, reservation_time, guests, seating_preference,
        special_requests, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', ?, ?)
    `);

    insertStmt.run(
      id,
      bookingCode,
      customerName.trim(),
      normalizedPhone,
      customerEmail ? customerEmail.trim() : null,
      reservationDate,
      reservationTime,
      guestNum,
      selectedSeating,
      specialRequests ? specialRequests.trim().slice(0, 300) : '',
      now,
      now
    );

    return res.status(201).json({
      success: true,
      message: 'Table reservation successfully confirmed at Ajwa Exotica!',
      booking: {
        id,
        bookingCode,
        customerName: customerName.trim(),
        customerPhone: normalizedPhone,
        reservationDate,
        reservationTime,
        guests: guestNum,
        seatingPreference: selectedSeating,
        specialRequests: specialRequests ? specialRequests.trim() : '',
        status: 'confirmed',
        restaurant: 'Ajwa Exotica, Kurnool',
        address: '3rd Floor, above Vishal Mart, Venkata Ramana Colony, Ameen Abbas Nagar, Kurnool, Andhra Pradesh 518003',
        phone: '085182 53599'
      }
    });
  } catch (err) {
    console.error('Error creating reservation:', err);
    return res.status(500).json({ error: 'Failed to process table reservation. Please call 085182 53599 for direct booking.' });
  }
});

/**
 * GET /api/reservations/:bookingCode
 * Check reservation status by booking code
 */
reservationRouter.get('/code/:bookingCode', (req, res) => {
  try {
    const code = req.params.bookingCode.toUpperCase().trim();
    const reservation = db.prepare(`
      SELECT * FROM reservations WHERE booking_code = ?
    `).get(code);

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation code not found. Please check your booking code.' });
    }

    return res.json({ success: true, reservation });
  } catch (err) {
    console.error('Error querying reservation:', err);
    return res.status(500).json({ error: 'Database error fetching reservation.' });
  }
});

/**
 * GET /api/reservations
 * Admin route to list all reservations
 */
reservationRouter.get('/', requireAdmin, (req, res) => {
  try {
    const { date, status } = req.query;
    let query = 'SELECT * FROM reservations';
    const params = [];
    const conditions = [];

    if (date) {
      conditions.push('reservation_date = ?');
      params.push(date);
    }
    if (status && status !== 'all') {
      conditions.push('status = ?');
      params.push(status);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY reservation_date DESC, reservation_time ASC';

    const rows = db.prepare(query).all(...params);
    return res.json({ success: true, count: rows.length, reservations: rows });
  } catch (err) {
    console.error('Error fetching admin reservations:', err);
    return res.status(500).json({ error: 'Failed to retrieve reservations.' });
  }
});

/**
 * PATCH /api/reservations/:id/status
 * Admin route to update reservation status
 */
reservationRouter.patch('/:id/status', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['confirmed', 'seated', 'cancelled', 'completed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const now = new Date().toISOString();
    const update = db.prepare(`
      UPDATE reservations
      SET status = ?, updated_at = ?
      WHERE id = ?
    `);
    const result = update.run(status, now, id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Reservation not found.' });
    }

    return res.json({ success: true, message: `Reservation status updated to ${status}.` });
  } catch (err) {
    console.error('Error updating reservation status:', err);
    return res.status(500).json({ error: 'Failed to update reservation status.' });
  }
});
