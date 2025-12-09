import { Router } from 'express';
import { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart,
  clearCart
} from '../controllers/cartController';

const router = Router();

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/items/:id', updateCartItem);
router.delete('/items/:id', removeFromCart);
router.delete('/clear', clearCart);

export default router;
