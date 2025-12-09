import { Request, Response } from 'express';
import pool from '../database/connection';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const [categories] = await pool.query(
      'SELECT id, name_key, display_order, icon, is_active FROM menu_categories WHERE is_active = 1 ORDER BY display_order'
    );

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ 
      error: { message: 'Failed to fetch categories', status: 500 } 
    });
  }
};

export const getMenuItems = async (req: Request, res: Response) => {
  try {
    const { 
      categoryId, 
      language = 'ru', 
      search, 
      sortBy = 'display_order',
      isPopular 
    } = req.query;

    let query = `
      SELECT 
        mi.id,
        mi.category_id,
        mi.name_key,
        mi.price,
        mi.image_url,
        mi.is_available,
        mi.is_popular,
        mi.preparation_time,
        mi.calories,
        mit.name,
        mit.description
      FROM menu_items mi
      LEFT JOIN menu_item_translations mit ON mi.id = mit.item_id AND mit.language = ?
      WHERE mi.is_available = 1
    `;

    const params: any[] = [language];

    if (categoryId) {
      query += ' AND mi.category_id = ?';
      params.push(categoryId);
    }

    if (isPopular === 'true') {
      query += ' AND mi.is_popular = 1';
    }

    if (search) {
      query += ' AND (mit.name LIKE ? OR mit.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Sort
    if (sortBy === 'price') {
      query += ' ORDER BY mi.price ASC';
    } else if (sortBy === 'name') {
      query += ' ORDER BY mit.name ASC';
    } else if (sortBy === 'popular') {
      query += ' ORDER BY mi.is_popular DESC, mi.id DESC';
    } else {
      query += ' ORDER BY mi.id DESC';
    }

    const [items] = await pool.query(query, params);

    res.json({ items });
  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({ 
      error: { message: 'Failed to fetch menu items', status: 500 } 
    });
  }
};

export const getMenuItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { language = 'ru' } = req.query;

    const [items] = await pool.query(
      `
      SELECT 
        mi.id,
        mi.category_id,
        mi.name_key,
        mi.price,
        mi.image_url,
        mi.is_available,
        mi.is_popular,
        mi.preparation_time,
        mi.calories,
        mit.name,
        mit.description,
        mc.name_key as category_name
      FROM menu_items mi
      LEFT JOIN menu_item_translations mit ON mi.id = mit.item_id AND mit.language = ?
      LEFT JOIN menu_categories mc ON mi.category_id = mc.id
      WHERE mi.id = ?
      `,
      [language, id]
    );

    const item = (items as any[])[0];

    if (!item) {
      return res.status(404).json({ 
        error: { message: 'Menu item not found', status: 404 } 
      });
    }

    // Get allergens
    const [allergens] = await pool.query(
      'SELECT allergen_type FROM allergens WHERE item_id = ?',
      [id]
    );

    // Get beer pairings
    const [pairings] = await pool.query(
      `
      SELECT 
        mi.id,
        mi.name_key,
        mi.price,
        mit.name
      FROM beer_pairings bp
      JOIN menu_items mi ON bp.beer_item_id = mi.id
      LEFT JOIN menu_item_translations mit ON mi.id = mit.item_id AND mit.language = ?
      WHERE bp.food_item_id = ?
      ORDER BY bp.pairing_score DESC
      LIMIT 5
      `,
      [language, id]
    );

    res.json({ 
      item,
      allergens: (allergens as any[]).map(a => a.allergen_type),
      pairings
    });
  } catch (error) {
    console.error('Get menu item error:', error);
    res.status(500).json({ 
      error: { message: 'Failed to fetch menu item', status: 500 } 
    });
  }
};
