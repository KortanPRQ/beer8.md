import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../database/connection';
import { AuthRequest } from '../middleware/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_change_in_production';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

export const register = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // Check if user already exists
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if ((existing as any[]).length > 0) {
      return res.status(400).json({ 
        error: { message: 'Email already registered', status: 400 } 
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Insert user
    const [result] = await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
      [email, passwordHash, firstName, lastName, phone || null, 'customer']
    );

    const userId = (result as any).insertId;

    // Create user preferences
    await pool.query(
      'INSERT INTO user_preferences (user_id, language, theme) VALUES (?, ?, ?)',
      [userId, 'ru', 'auto']
    );

    // Generate JWT token
    const token = jwt.sign(
      { id: userId, email, role: 'customer' },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    // Create session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await pool.query(
      'INSERT INTO user_sessions (user_id, token, expires_at, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)',
      [userId, token, expiresAt, req.ip, req.headers['user-agent'] || null]
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax'
    });

    // Return user data
    res.status(201).json({
      user: {
        id: userId,
        email,
        firstName,
        lastName,
        role: 'customer'
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: { message: 'Registration failed', status: 500 } 
    });
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    // Get user
    const [users] = await pool.query(
      'SELECT id, email, password_hash, first_name, last_name, role, account_status FROM users WHERE email = ?',
      [email]
    );

    const user = (users as any[])[0];

    if (!user) {
      return res.status(401).json({ 
        error: { message: 'Invalid credentials', status: 401 } 
      });
    }

    // Check account status
    if (user.account_status !== 'active') {
      return res.status(403).json({ 
        error: { message: 'Account is suspended or deleted', status: 403 } 
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ 
        error: { message: 'Invalid credentials', status: 401 } 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    // Create session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await pool.query(
      'INSERT INTO user_sessions (user_id, token, expires_at, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)',
      [user.id, token, expiresAt, req.ip, req.headers['user-agent'] || null]
    );

    // Update last login
    await pool.query(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    });

    // Return user data
    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: { message: 'Login failed', status: 500 } 
    });
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (token) {
      // Delete session
      await pool.query('DELETE FROM user_sessions WHERE token = ?', [token]);
    }

    // Clear cookie
    res.clearCookie('token');

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      error: { message: 'Logout failed', status: 500 } 
    });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        error: { message: 'Not authenticated', status: 401 } 
      });
    }

    // Get full user data
    const [users] = await pool.query(
      'SELECT id, email, first_name, last_name, phone, role FROM users WHERE id = ?',
      [req.user.id]
    );

    const user = (users as any[])[0];

    if (!user) {
      return res.status(404).json({ 
        error: { message: 'User not found', status: 404 } 
      });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ 
      error: { message: 'Failed to get user data', status: 500 } 
    });
  }
};
