import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import pool from '../database/connection';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check for token in cookies or Authorization header
    const token = req.cookies?.token || 
                  req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: { message: 'Authentication required', status: 401 } });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      id: number;
      email: string;
      role: string;
    };

    // Check if session exists and is valid
    const [sessions] = await pool.query(
      'SELECT * FROM user_sessions WHERE user_id = ? AND token = ? AND expires_at > NOW()',
      [decoded.id, token]
    );

    if ((sessions as any[]).length === 0) {
      return res.status(401).json({ error: { message: 'Invalid or expired session', status: 401 } });
    }

    // Attach user to request
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: { message: 'Invalid token', status: 401 } });
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: { message: 'Authentication required', status: 401 } });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: { message: 'Insufficient permissions', status: 403 } });
    }

    next();
  };
};
