import { Router } from 'express';
import { 
  generateCoupon, 
  getUserCoupons, 
  validateCoupon,
  applyCoupon
} from '../controllers/couponController';
import { authenticateToken } from '../middleware/auth';
import { couponValidation, validateRequest } from '../middleware/validation';

const router = Router();

router.post('/generate', authenticateToken, couponValidation, validateRequest, generateCoupon);
router.get('/my-coupons', authenticateToken, getUserCoupons);
router.get('/validate/:code', validateCoupon);
router.post('/apply', authenticateToken, applyCoupon);

export default router;
