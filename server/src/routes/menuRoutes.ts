import { Router } from 'express';
import { getCategories, getMenuItems, getMenuItem } from '../controllers/menuController';

const router = Router();

router.get('/categories', getCategories);
router.get('/items', getMenuItems);
router.get('/items/:id', getMenuItem);

export default router;
