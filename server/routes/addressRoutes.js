import { Router } from 'express';
import crypto from 'node:crypto';
import { db } from '../db.js';
import { requireAuth } from '../auth.js';

export const addressRouter = Router();

// Get all saved addresses for current customer
addressRouter.get('/', requireAuth, (req, res) => {
  try {
    const addresses = db.prepare(`
      SELECT id, label, house_flat, street_locality, address_line,
             city, state, pincode, landmark, delivery_instructions, is_default, created_at
      FROM addresses
      WHERE user_id = ?
      ORDER BY is_default DESC, created_at DESC
    `).all(req.user.id);

    res.json({ addresses });
  } catch (err) {
    console.error('Fetch addresses error:', err);
    res.status(500).json({ error: 'Failed to retrieve addresses.' });
  }
});

// Add new delivery address
addressRouter.post('/', requireAuth, (req, res) => {
  try {
    const { 
      label, 
      house_flat,
      street_locality,
      address_line, 
      city, 
      state,
      pincode, 
      landmark, 
      delivery_instructions,
      is_default 
    } = req.body;

    const fullAddress = address_line || `${house_flat ? house_flat + ', ' : ''}${streetLocalityText(street_locality, landmark)}`.trim();

    if (!fullAddress || fullAddress.length < 5) {
      return res.status(400).json({ error: 'Please enter a complete address (minimum 5 characters).' });
    }

    const addrId = `addr_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const cleanLabel = label && label.trim() ? label.trim() : 'Home';
    const cleanCity = city && city.trim() ? city.trim() : 'Kurnool';
    const cleanState = state && state.trim() ? state.trim() : 'Andhra Pradesh';
    const cleanPincode = pincode ? pincode.replace(/\D/g, '') : '518002';
    const cleanLandmark = landmark ? landmark.trim() : null;
    const cleanInstructions = delivery_instructions ? delivery_instructions.trim() : null;
    const defaultFlag = is_default ? 1 : 0;
    const now = new Date().toISOString();

    // If setting default, unset existing defaults for this user
    if (defaultFlag === 1) {
      db.prepare('UPDATE addresses SET is_default = 0 WHERE user_id = ?').run(req.user.id);
    } else {
      // If user has no addresses yet, make this first one default
      const countCheck = db.prepare('SELECT COUNT(*) as cnt FROM addresses WHERE user_id = ?').get(req.user.id);
      if (countCheck.cnt === 0) {
        db.prepare(`
          INSERT INTO addresses (
            id, user_id, label, house_flat, street_locality, address_line,
            city, state, pincode, landmark, delivery_instructions, is_default, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
        `).run(
          addrId,
          req.user.id,
          cleanLabel,
          house_flat || null,
          street_locality || null,
          fullAddress,
          cleanCity,
          cleanState,
          cleanPincode,
          cleanLandmark,
          cleanInstructions,
          now
        );
        return res.status(201).json({
          message: 'Address saved successfully!',
          address: {
            id: addrId,
            label: cleanLabel,
            house_flat: house_flat || null,
            street_locality: street_locality || null,
            address_line: fullAddress,
            city: cleanCity,
            state: cleanState,
            pincode: cleanPincode,
            landmark: cleanLandmark,
            delivery_instructions: cleanInstructions,
            is_default: 1,
            created_at: now
          }
        });
      }
    }

    db.prepare(`
      INSERT INTO addresses (
        id, user_id, label, house_flat, street_locality, address_line,
        city, state, pincode, landmark, delivery_instructions, is_default, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      addrId,
      req.user.id,
      cleanLabel,
      house_flat || null,
      street_locality || null,
      fullAddress,
      cleanCity,
      cleanState,
      cleanPincode,
      cleanLandmark,
      cleanInstructions,
      defaultFlag,
      now
    );

    res.status(201).json({
      message: 'Address saved successfully!',
      address: {
        id: addrId,
        label: cleanLabel,
        house_flat: house_flat || null,
        street_locality: street_locality || null,
        address_line: fullAddress,
        city: cleanCity,
        state: cleanState,
        pincode: cleanPincode,
        landmark: cleanLandmark,
        delivery_instructions: cleanInstructions,
        is_default: defaultFlag,
        created_at: now
      }
    });
  } catch (err) {
    console.error('Save address error:', err);
    res.status(500).json({ error: 'Failed to save address.' });
  }
});

function streetLocalityText(street, landmark) {
  let s = street || '';
  if (landmark) s += (s ? ', ' : '') + `Near ${landmark}`;
  return s;
}

// Update saved address
addressRouter.put('/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const {
      label,
      house_flat,
      street_locality,
      landmark,
      city,
      state,
      pincode,
      delivery_instructions,
      is_default
    } = req.body;

    const existing = db.prepare('SELECT id FROM addresses WHERE id = ? AND user_id = ?').get(id, req.user.id);
    if (!existing) {
      return res.status(404).json({ error: 'Address not found or unauthorized.' });
    }

    const cleanLabel = (label && label.trim()) || 'Home';
    const cleanCity = (city && city.trim()) || 'Kurnool';
    const cleanState = (state && state.trim()) || 'Andhra Pradesh';
    const cleanPincode = (pincode && pincode.trim()) || '518001';
    const cleanLandmark = landmark ? landmark.trim() : null;
    const cleanInstructions = delivery_instructions ? delivery_instructions.trim() : null;

    const addressParts = [
      house_flat ? house_flat.trim() : null,
      street_locality ? street_locality.trim() : null,
      cleanLandmark ? `Near ${cleanLandmark}` : null,
      `${cleanCity} - ${cleanPincode}`,
      cleanState
    ].filter(Boolean);

    const fullAddress = addressParts.join(', ');

    if (is_default) {
      db.prepare('UPDATE addresses SET is_default = 0 WHERE user_id = ?').run(req.user.id);
    }

    db.prepare(`
      UPDATE addresses
      SET label = ?, house_flat = ?, street_locality = ?, address_line = ?,
          city = ?, state = ?, pincode = ?, landmark = ?, delivery_instructions = ?,
          is_default = CASE WHEN ? = 1 THEN 1 ELSE is_default END
      WHERE id = ? AND user_id = ?
    `).run(
      cleanLabel,
      house_flat || null,
      street_locality || null,
      fullAddress,
      cleanCity,
      cleanState,
      cleanPincode,
      cleanLandmark,
      cleanInstructions,
      is_default ? 1 : 0,
      id,
      req.user.id
    );

    const updated = db.prepare('SELECT * FROM addresses WHERE id = ?').get(id);
    res.json({ message: 'Address updated successfully.', address: updated });
  } catch (err) {
    console.error('Update address error:', err);
    res.status(500).json({ error: 'Failed to update address.' });
  }
});

// Delete saved address
addressRouter.delete('/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const result = db.prepare('DELETE FROM addresses WHERE id = ? AND user_id = ?').run(id, req.user.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Address not found or unauthorized.' });
    }
    res.json({ message: 'Address removed successfully.' });
  } catch (err) {
    console.error('Delete address error:', err);
    res.status(500).json({ error: 'Failed to delete address.' });
  }
});

// Set default address
addressRouter.patch('/:id/default', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT id FROM addresses WHERE id = ? AND user_id = ?').get(id, req.user.id);
    if (!existing) {
      return res.status(404).json({ error: 'Address not found.' });
    }

    db.prepare('UPDATE addresses SET is_default = 0 WHERE user_id = ?').run(req.user.id);
    db.prepare('UPDATE addresses SET is_default = 1 WHERE id = ? AND user_id = ?').run(id, req.user.id);

    res.json({ message: 'Default address updated successfully.' });
  } catch (err) {
    console.error('Set default address error:', err);
    res.status(500).json({ error: 'Failed to set default address.' });
  }
});
