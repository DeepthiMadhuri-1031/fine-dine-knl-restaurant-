import { Router } from 'express';
import crypto from 'node:crypto';
import { db } from '../db.js';
import { hashPassword, verifyPassword, generateToken, requireAuth } from '../auth.js';
import { sendPasswordResetEmail } from '../mailer.js';

export const authRouter = Router();

// In-memory rate limiting store for failed login attempts to prevent brute-force attacks
const loginAttempts = new Map();
const MAX_FAILED_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes window
const BLOCK_DURATION_MS = 2 * 60 * 1000; // 2 minutes block

function checkLoginThrottle(key) {
  const record = loginAttempts.get(key);
  if (!record) return { allowed: true };

  const now = Date.now();
  if (record.blockedUntil && now < record.blockedUntil) {
    const remainingSeconds = Math.ceil((record.blockedUntil - now) / 1000);
    return { allowed: false, remainingSeconds };
  }

  // If outside the attempt window, reset
  if (now - record.lastAttempt > ATTEMPT_WINDOW_MS) {
    loginAttempts.delete(key);
    return { allowed: true };
  }

  return { allowed: true };
}

function recordFailedLogin(key) {
  const now = Date.now();
  const record = loginAttempts.get(key) || { attempts: 0, lastAttempt: now, blockedUntil: 0 };
  
  if (now - record.lastAttempt > ATTEMPT_WINDOW_MS) {
    record.attempts = 1;
  } else {
    record.attempts += 1;
  }
  record.lastAttempt = now;

  if (record.attempts >= MAX_FAILED_ATTEMPTS) {
    record.blockedUntil = now + BLOCK_DURATION_MS;
  }
  loginAttempts.set(key, record);
}

function clearFailedLogin(key) {
  loginAttempts.delete(key);
}

// Customer Registration
authRouter.post('/register', (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      phone,
      houseFlat,
      streetLocality,
      city,
      state,
      pincode,
      landmark,
      deliveryInstructions
    } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'Please enter a valid full name (minimum 2 characters).' });
    }

    if (!email || !email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Indian mobile number validation (10 digits starting with 6, 7, 8, or 9)
    const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
    if (!cleanPhone || cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit Indian mobile number (starts with 6, 7, 8, or 9).' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    // Check duplicate email
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email address already exists. Please log in.' });
    }

    // Enforce role: ALWAYS customer for public registration
    const role = 'customer';
    const userId = `usr_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const { hash, salt } = hashPassword(password);
    const now = new Date().toISOString();

    const insertStmt = db.prepare(`
      INSERT INTO users (id, name, email, phone, password_hash, salt, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertStmt.run(userId, name.trim(), cleanEmail, cleanPhone, hash, salt, role, now, now);

    // Save initial delivery address if provided during registration
    if (houseFlat || streetLocality || req.body.address_line) {
      const cleanPincode = pincode ? pincode.replace(/\D/g, '') : '';
      if (cleanPincode && cleanPincode.length !== 6) {
        // Warning or default
      }
      const addrLine = req.body.address_line || `${houseFlat ? houseFlat + ', ' : ''}${streetLocality || ''}`.trim() || 'Kurnool';
      const addrId = `addr_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;

      db.prepare(`
        INSERT INTO addresses (
          id, user_id, label, house_flat, street_locality, address_line,
          city, state, pincode, landmark, delivery_instructions, is_default, created_at
        ) VALUES (?, ?, 'Home', ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
      `).run(
        addrId,
        userId,
        houseFlat || null,
        streetLocality || null,
        addrLine,
        city || 'Kurnool',
        state || 'Andhra Pradesh',
        cleanPincode || '518002',
        landmark || null,
        deliveryInstructions || null,
        now
      );
    }

    const userPayload = {
      id: userId,
      name: name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      role,
    };

    const token = generateToken({ id: userId, role });

    return res.status(201).json({
      message: 'Account created successfully!',
      user: userPayload,
      token,
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Server error during registration. Please try again.' });
  }
});

// Customer & Admin Login
authRouter.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide both email and password.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const throttleKey = `${cleanEmail}_${req.ip || 'req'}`;
    const throttle = checkLoginThrottle(throttleKey);

    if (!throttle.allowed) {
      return res.status(429).json({
        error: `Too many failed login attempts. Please wait ${throttle.remainingSeconds} seconds before trying again.`
      });
    }

    const user = db.prepare(`
      SELECT id, name, email, phone, password_hash, salt, role
      FROM users
      WHERE email = ?
    `).get(cleanEmail);

    if (!user) {
      recordFailedLogin(throttleKey);
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isValid = verifyPassword(password, user.password_hash, user.salt);
    if (!isValid) {
      recordFailedLogin(throttleKey);
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Login successful — clear any failed attempts
    clearFailedLogin(throttleKey);

    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    const token = generateToken({ id: user.id, role: user.role });

    return res.json({
      message: 'Logged in successfully!',
      user: userPayload,
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error during login. Please try again.' });
  }
});

// Forgot Password — Request Single-Use Reset Token
authRouter.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = db.prepare('SELECT id, name, email FROM users WHERE email = ?').get(cleanEmail);

    let resetToken = null;
    let dispatchResult = null;

    if (user) {
      // Invalidate existing unused tokens for this user
      db.prepare('UPDATE password_resets SET used = 1 WHERE user_id = ? AND used = 0').run(user.id);

      // Generate cryptographically secure reset token
      resetToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
      const resetId = `rst_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour
      const now = new Date().toISOString();

      db.prepare(`
        INSERT INTO password_resets (id, user_id, token_hash, expires_at, used, created_at)
        VALUES (?, ?, ?, ?, 0, ?)
      `).run(resetId, user.id, tokenHash, expiresAt, now);

      dispatchResult = await sendPasswordResetEmail(user.email, resetToken, user.name);
    }

    // Always return neutral response to prevent account enumeration
    const responsePayload = {
      message: 'If an account with that email address is registered, password reset instructions have been dispatched.'
    };

    // If running in development/local mode and SMTP credentials are not configured,
    // surface the token in response to allow frictionless testing (NEVER in production)
    if (process.env.NODE_ENV !== 'production' && resetToken && dispatchResult && dispatchResult.mode === 'local-log') {
      responsePayload.devResetToken = resetToken;
      responsePayload.devResetUrl = dispatchResult.resetUrl;
    }

    return res.json(responsePayload);
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ error: 'Failed to process password reset request.' });
  }
});

// Reset Password with Single-Use Token
authRouter.post('/reset-password', (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Password reset token is required.' });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
    }

    const tokenHash = crypto.createHash('sha256').update(token.trim()).digest('hex');
    const resetRecord = db.prepare(`
      SELECT id, user_id, expires_at, used
      FROM password_resets
      WHERE token_hash = ?
    `).get(tokenHash);

    if (!resetRecord) {
      return res.status(400).json({ error: 'Invalid or expired password reset link. Please request a new one.' });
    }

    if (resetRecord.used === 1) {
      return res.status(400).json({ error: 'This password reset link has already been used. Please request a new one.' });
    }

    const now = new Date();
    const expiry = new Date(resetRecord.expires_at);
    if (now > expiry) {
      return res.status(400).json({ error: 'This password reset link has expired. Please request a new one.' });
    }

    // Update user password
    const { hash, salt } = hashPassword(newPassword);
    const nowIso = now.toISOString();

    db.prepare(`
      UPDATE users
      SET password_hash = ?, salt = ?, updated_at = ?
      WHERE id = ?
    `).run(hash, salt, nowIso, resetRecord.user_id);

    // Invalidate reset token
    db.prepare('UPDATE password_resets SET used = 1 WHERE id = ?').run(resetRecord.id);

    return res.json({
      message: 'Your password has been successfully reset. You can now log in with your new password.'
    });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ error: 'Failed to reset password. Please try again.' });
  }
});

// Get Current User Profile with Account Stats
authRouter.get('/me', requireAuth, (req, res) => {
  try {
    const addressCount = db.prepare('SELECT COUNT(*) as count FROM addresses WHERE user_id = ?').get(req.user.id).count;
    const orderCount = db.prepare('SELECT COUNT(*) as count FROM orders WHERE user_id = ?').get(req.user.id).count;

    res.json({
      user: {
        ...req.user,
        savedAddressesCount: addressCount,
        ordersCount: orderCount
      }
    });
  } catch (err) {
    res.json({ user: req.user });
  }
});

// Update Profile Details
authRouter.put('/profile', requireAuth, (req, res) => {
  try {
    const { name, phone } = req.body;
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'Full name must have at least 2 characters.' });
    }

    const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
    if (cleanPhone && (cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone))) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit Indian mobile number.' });
    }

    const now = new Date().toISOString();

    db.prepare(`
      UPDATE users
      SET name = ?, phone = ?, updated_at = ?
      WHERE id = ?
    `).run(name.trim(), cleanPhone, now, req.user.id);

    const updatedUser = db.prepare('SELECT id, name, email, phone, role FROM users WHERE id = ?').get(req.user.id);
    return res.json({
      message: 'Profile updated successfully!',
      user: updatedUser,
    });
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// Change Password
authRouter.put('/change-password', requireAuth, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Please supply current and new passwords.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters.' });
    }

    const user = db.prepare('SELECT password_hash, salt FROM users WHERE id = ?').get(req.user.id);
    const isValid = verifyPassword(currentPassword, user.password_hash, user.salt);
    if (!isValid) {
      return res.status(400).json({ error: 'Current password does not match.' });
    }

    const { hash, salt } = hashPassword(newPassword);
    const now = new Date().toISOString();

    db.prepare('UPDATE users SET password_hash = ?, salt = ?, updated_at = ? WHERE id = ?').run(hash, salt, now, req.user.id);

    return res.json({ message: 'Password changed successfully!' });
  } catch (err) {
    console.error('Change password error:', err);
    return res.status(500).json({ error: 'Failed to change password.' });
  }
});
