import { Request, Response } from 'express';
import pool from '../database/connection';
import { AuthRequest } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

export const createReservation = async (req: AuthRequest, res: Response) => {
  try {
    const {
      zoneId,
      guestName,
      guestEmail,
      guestPhone,
      reservationDate,
      reservationTime,
      numberOfGuests,
      specialRequests
    } = req.body;

    const userId = req.user?.id || null;

    // Generate reservation number
    const reservationNumber = `RES-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Check zone capacity
    const [zones] = await pool.query(
      'SELECT capacity FROM reservation_zones WHERE id = ? AND is_active = 1',
      [zoneId]
    );

    if ((zones as any[]).length === 0) {
      return res.status(400).json({ 
        error: { message: 'Invalid zone selected', status: 400 } 
      });
    }

    const zone = (zones as any[])[0];

    if (numberOfGuests > zone.capacity) {
      return res.status(400).json({ 
        error: { message: `Zone capacity is ${zone.capacity} guests`, status: 400 } 
      });
    }

    // Check if time slot is available (simplified - check existing reservations)
    const [existing] = await pool.query(
      `SELECT COUNT(*) as count FROM reservations 
       WHERE zone_id = ? 
       AND reservation_date = ? 
       AND reservation_time = ? 
       AND status NOT IN ('cancelled', 'no_show')`,
      [zoneId, reservationDate, reservationTime]
    );

    if ((existing as any[])[0].count >= 3) { // Max 3 concurrent reservations per slot
      return res.status(400).json({ 
        error: { message: 'Time slot is not available', status: 400 } 
      });
    }

    // Create reservation
    const [result] = await pool.query(
      `INSERT INTO reservations 
       (user_id, zone_id, reservation_number, guest_name, guest_email, guest_phone, 
        reservation_date, reservation_time, number_of_guests, special_requests, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, zoneId, reservationNumber, guestName, guestEmail, guestPhone,
       reservationDate, reservationTime, numberOfGuests, specialRequests || null, 'pending']
    );

    const reservationId = (result as any).insertId;

    // TODO: Send confirmation email

    res.status(201).json({
      reservation: {
        id: reservationId,
        reservationNumber,
        zoneId,
        guestName,
        guestEmail,
        reservationDate,
        reservationTime,
        numberOfGuests,
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Create reservation error:', error);
    res.status(500).json({ 
      error: { message: 'Failed to create reservation', status: 500 } 
    });
  }
};

export const getReservation = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const [reservations] = await pool.query(
      `SELECT 
        r.*,
        rz.name_key as zone_name
       FROM reservations r
       JOIN reservation_zones rz ON r.zone_id = rz.id
       WHERE r.id = ?`,
      [id]
    );

    const reservation = (reservations as any[])[0];

    if (!reservation) {
      return res.status(404).json({ 
        error: { message: 'Reservation not found', status: 404 } 
      });
    }

    // Check if user has access to this reservation
    if (req.user && reservation.user_id !== req.user.id && 
        !['owner', 'administrator', 'manager'].includes(req.user.role)) {
      return res.status(403).json({ 
        error: { message: 'Access denied', status: 403 } 
      });
    }

    res.json({ reservation });
  } catch (error) {
    console.error('Get reservation error:', error);
    res.status(500).json({ 
      error: { message: 'Failed to fetch reservation', status: 500 } 
    });
  }
};

export const getUserReservations = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        error: { message: 'Authentication required', status: 401 } 
      });
    }

    const [reservations] = await pool.query(
      `SELECT 
        r.*,
        rz.name_key as zone_name
       FROM reservations r
       JOIN reservation_zones rz ON r.zone_id = rz.id
       WHERE r.user_id = ?
       ORDER BY r.reservation_date DESC, r.reservation_time DESC`,
      [req.user.id]
    );

    res.json({ reservations });
  } catch (error) {
    console.error('Get user reservations error:', error);
    res.status(500).json({ 
      error: { message: 'Failed to fetch reservations', status: 500 } 
    });
  }
};

export const getZones = async (req: Request, res: Response) => {
  try {
    const [zones] = await pool.query(
      'SELECT id, name_key, capacity, display_order FROM reservation_zones WHERE is_active = 1 ORDER BY display_order'
    );

    res.json({ zones });
  } catch (error) {
    console.error('Get zones error:', error);
    res.status(500).json({ 
      error: { message: 'Failed to fetch zones', status: 500 } 
    });
  }
};
