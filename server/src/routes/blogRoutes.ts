import { Router } from 'express';
import { getBlogPosts, getBlogPost, getBlogCategories, createComment } from '../controllers/blogController';

const router = Router();

router.get('/posts', getBlogPosts);
router.get('/posts/:slug', getBlogPost);
router.get('/categories', getBlogCategories);
router.post('/comments', createComment);

export default router;
