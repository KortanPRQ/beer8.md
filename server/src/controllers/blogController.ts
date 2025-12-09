import { Request, Response } from 'express';
import pool from '../database/connection';
import { AuthRequest } from '../middleware/auth';

export const getBlogPosts = async (req: Request, res: Response) => {
  try {
    const { categoryId, page = 1, perPage = 10, search } = req.query;
    const offset = (Number(page) - 1) * Number(perPage);

    let query = `
      SELECT 
        bp.id,
        bp.title,
        bp.slug,
        bp.excerpt,
        bp.featured_image,
        bp.is_featured,
        bp.views_count,
        bp.published_at,
        bp.created_at,
        bc.name_key as category_name,
        u.first_name,
        u.last_name
      FROM blog_posts bp
      LEFT JOIN blog_categories bc ON bp.category_id = bc.id
      LEFT JOIN users u ON bp.author_id = u.id
      WHERE bp.is_published = 1
    `;

    const params: any[] = [];

    if (categoryId) {
      query += ' AND bp.category_id = ?';
      params.push(categoryId);
    }

    if (search) {
      query += ' AND (bp.title LIKE ? OR bp.excerpt LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY bp.published_at DESC LIMIT ? OFFSET ?';
    params.push(Number(perPage), offset);

    const [posts] = await pool.query(query, params);

    res.json({ posts });
  } catch (error) {
    console.error('Get blog posts error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch blog posts', status: 500 } });
  }
};

export const getBlogPost = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const [posts] = await pool.query(
      `SELECT 
        bp.*,
        bc.name_key as category_name,
        u.first_name,
        u.last_name
       FROM blog_posts bp
       LEFT JOIN blog_categories bc ON bp.category_id = bc.id
       LEFT JOIN users u ON bp.author_id = u.id
       WHERE bp.slug = ? AND bp.is_published = 1`,
      [slug]
    );

    const post = (posts as any[])[0];

    if (!post) {
      return res.status(404).json({ error: { message: 'Post not found', status: 404 } });
    }

    // Increment views
    await pool.query(
      'UPDATE blog_posts SET views_count = views_count + 1 WHERE id = ?',
      [post.id]
    );

    // Get comments
    const [comments] = await pool.query(
      `SELECT * FROM blog_comments 
       WHERE post_id = ? AND is_approved = 1 
       ORDER BY created_at DESC`,
      [post.id]
    );

    res.json({ post, comments });
  } catch (error) {
    console.error('Get blog post error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch blog post', status: 500 } });
  }
};

export const getBlogCategories = async (req: Request, res: Response) => {
  try {
    const [categories] = await pool.query(
      'SELECT * FROM blog_categories ORDER BY display_order'
    );

    res.json({ categories });
  } catch (error) {
    console.error('Get blog categories error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch blog categories', status: 500 } });
  }
};

export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    const { postId, content, authorName, authorEmail } = req.body;
    const userId = req.user?.id;

    await pool.query(
      'INSERT INTO blog_comments (post_id, user_id, author_name, author_email, content) VALUES (?, ?, ?, ?, ?)',
      [postId, userId || null, authorName, authorEmail || null, content]
    );

    res.status(201).json({ message: 'Comment submitted for moderation' });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ error: { message: 'Failed to create comment', status: 500 } });
  }
};
