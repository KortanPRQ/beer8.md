import { Router } from 'express';
import { 
  createReservation, 
  getReservation, 
  getUserReservations,
  getZones 
} from '../controllers/reservationController';
import { authenticateToken } from '../middleware/auth';
import { reservationValidation, validateRequest } from '../middleware/validation';

const router = Router();

router.get('/zones', getZones);
router.post('/', reservationValidation, validateRequest, createReservation);
router.get('/:id', getReservation);
router.get('/user/my-reservations', authenticateToken, getUserReservations);

export default router;
