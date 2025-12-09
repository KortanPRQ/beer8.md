import { Request, Response } from 'express';
import pool from '../database/connection';
import { AuthRequest } from '../middleware/auth';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

export const generateCoupon = async (req: AuthRequest, res: Response) => {
  try {
    const { type, value, minOrderAmount, categoryId, comboDescription } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: { message: 'Authentication required', status: 401 } });
    }

    // Generate unique coupon code
    const code = `BEER8-${uuidv4().substring(0, 8).toUpperCase()}`;

    // Create coupon
    const [couponResult] = await pool.query(
      `INSERT INTO coupons (code, type, value, min_order_amount, category_id, usage_limit, valid_until)
       VALUES (?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))`,
      [code, type, value, minOrderAmount || 0, categoryId || null, 1]
    );

    const couponId = (couponResult as any).insertId;

    // Generate QR code
    const qrCodeData = JSON.stringify({ code, type, value });
    const qrCodeUrl = await QRCode.toDataURL(qrCodeData);

    // Link coupon to user
    await pool.query(
      'INSERT INTO user_coupons (user_id, coupon_id, qr_code_url, combo_description) VALUES (?, ?, ?, ?)',
      [userId, couponId, qrCodeUrl, comboDescription || null]
    );

    res.status(201).json({
      coupon: {
        id: couponId,
        code,
        type,
        value,
        qrCodeUrl,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });
  } catch (error) {
    console.error('Generate coupon error:', error);
    res.status(500).json({ error: { message: 'Failed to generate coupon', status: 500 } });
  }
};

export const getUserCoupons = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: { message: 'Authentication required', status: 401 } });
    }

    const [coupons] = await pool.query(
      `SELECT 
        uc.id as user_coupon_id,
        uc.qr_code_url,
        uc.combo_description,
        uc.created_at,
        uc.used_at,
        c.id as coupon_id,
        c.code,
        c.type,
        c.value,
        c.min_order_amount,
        c.valid_until
       FROM user_coupons uc
       JOIN coupons c ON uc.coupon_id = c.id
       WHERE uc.user_id = ?
       ORDER BY uc.created_at DESC`,
      [req.user.id]
    );

    res.json({ coupons });
  } catch (error) {
    console.error('Get user coupons error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch coupons', status: 500 } });
  }
};

export const validateCoupon = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;

    const [coupons] = await pool.query(
      `SELECT * FROM coupons 
       WHERE code = ? 
       AND is_active = 1 
       AND (valid_until IS NULL OR valid_until > NOW())
       AND times_used < usage_limit`,
      [code]
    );

    const coupon = (coupons as any[])[0];

    if (!coupon) {
      return res.status(404).json({ 
        error: { message: 'Invalid or expired coupon', status: 404 } 
      });
    }

    res.json({ 
      valid: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        minOrderAmount: coupon.min_order_amount
      }
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({ error: { message: 'Failed to validate coupon', status: 500 } });
  }
};

export const applyCoupon = async (req: AuthRequest, res: Response) => {
  try {
    const { code, orderTotal } = req.body;
    const userId = req.user?.id;

    const [coupons] = await pool.query(
      `SELECT * FROM coupons 
       WHERE code = ? 
       AND is_active = 1 
       AND (valid_until IS NULL OR valid_until > NOW())
       AND times_used < usage_limit`,
      [code]
    );

    const coupon = (coupons as any[])[0];

    if (!coupon) {
      return res.status(404).json({ 
        error: { message: 'Invalid or expired coupon', status: 404 } 
      });
    }

    if (orderTotal < coupon.min_order_amount) {
      return res.status(400).json({ 
        error: { message: `Minimum order amount is ${coupon.min_order_amount} MDL`, status: 400 } 
      });
    }

    let discountAmount = 0;
    
    if (coupon.type === 'percentage') {
      discountAmount = (orderTotal * coupon.value) / 100;
      if (coupon.max_discount && discountAmount > coupon.max_discount) {
        discountAmount = coupon.max_discount;
      }
    } else if (coupon.type === 'fixed_amount') {
      discountAmount = coupon.value;
    }

    res.json({
      discountAmount,
      finalTotal: orderTotal - discountAmount,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value
      }
    });
  } catch (error) {
    console.error('Apply coupon error:', error);
    res.status(500).json({ error: { message: 'Failed to apply coupon', status: 500 } });
  }
};
