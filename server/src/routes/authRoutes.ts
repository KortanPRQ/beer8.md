import { Router } from 'express';
import { register, login, logout, getCurrentUser } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';
import { registerValidation, loginValidation, validateRequest } from '../middleware/validation';

const router = Router();

// Public routes
router.post('/register', authLimiter, registerValidation, validateRequest, register);
router.post('/login', authLimiter, loginValidation, validateRequest, login);
router.post('/logout', logout);

// Protected routes
router.get('/me', authenticateToken, getCurrentUser);

export default router;
