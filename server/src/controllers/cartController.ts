import { Response } from 'express';
import pool from '../database/connection';
import { AuthRequest } from '../middleware/auth';

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.sessionID || req.cookies?.sessionId;

    let cart;
    
    if (userId) {
      [cart] = await pool.query(
        'SELECT id FROM carts WHERE user_id = ?',
        [userId]
      );
    } else if (sessionId) {
      [cart] = await pool.query(
        'SELECT id FROM carts WHERE session_id = ?',
        [sessionId]
      );
    }

    if ((cart as any[]).length === 0) {
      return res.json({ items: [], total: 0 });
    }

    const cartId = (cart as any[])[0].id;

    const [items] = await pool.query(
      `SELECT 
        ci.id,
        ci.item_id,
        ci.quantity,
        ci.notes,
        mi.price,
        mit.name,
        mi.image_url
       FROM cart_items ci
       JOIN menu_items mi ON ci.item_id = mi.id
       LEFT JOIN menu_item_translations mit ON mi.id = mit.item_id AND mit.language = ?
       WHERE ci.cart_id = ?`,
      [req.query.language || 'ru', cartId]
    );

    const total = (items as any[]).reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.json({ items, total });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch cart', status: 500 } });
  }
};

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const { itemId, quantity = 1, notes } = req.body;
    const userId = req.user?.id;
    const sessionId = req.sessionID || req.cookies?.sessionId;

    if (!userId && !sessionId) {
      return res.status(400).json({ error: { message: 'Session required', status: 400 } });
    }

    // Get or create cart
    let cart;
    
    if (userId) {
      [cart] = await pool.query(
        'SELECT id FROM carts WHERE user_id = ?',
        [userId]
      );
      
      if ((cart as any[]).length === 0) {
        const [result] = await pool.query(
          'INSERT INTO carts (user_id) VALUES (?)',
          [userId]
        );
        cart = [{ id: (result as any).insertId }];
      }
    } else {
      [cart] = await pool.query(
        'SELECT id FROM carts WHERE session_id = ?',
        [sessionId]
      );
      
      if ((cart as any[]).length === 0) {
        const [result] = await pool.query(
          'INSERT INTO carts (session_id) VALUES (?)',
          [sessionId]
        );
        cart = [{ id: (result as any).insertId }];
      }
    }

    const cartId = (cart as any[])[0].id;

    // Check if item already in cart
    const [existing] = await pool.query(
      'SELECT id, quantity FROM cart_items WHERE cart_id = ? AND item_id = ?',
      [cartId, itemId]
    );

    if ((existing as any[]).length > 0) {
      // Update quantity
      await pool.query(
        'UPDATE cart_items SET quantity = quantity + ? WHERE id = ?',
        [quantity, (existing as any[])[0].id]
      );
    } else {
      // Add new item
      await pool.query(
        'INSERT INTO cart_items (cart_id, item_id, quantity, notes) VALUES (?, ?, ?, ?)',
        [cartId, itemId, quantity, notes || null]
      );
    }

    res.json({ message: 'Item added to cart' });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: { message: 'Failed to add item to cart', status: 500 } });
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ error: { message: 'Quantity must be at least 1', status: 400 } });
    }

    await pool.query(
      'UPDATE cart_items SET quantity = ? WHERE id = ?',
      [quantity, id]
    );

    res.json({ message: 'Cart item updated' });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ error: { message: 'Failed to update cart item', status: 500 } });
  }
};

export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM cart_items WHERE id = ?', [id]);

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: { message: 'Failed to remove item from cart', status: 500 } });
  }
};

export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.sessionID || req.cookies?.sessionId;

    if (userId) {
      await pool.query(
        'DELETE ci FROM cart_items ci JOIN carts c ON ci.cart_id = c.id WHERE c.user_id = ?',
        [userId]
      );
    } else if (sessionId) {
      await pool.query(
        'DELETE ci FROM cart_items ci JOIN carts c ON ci.cart_id = c.id WHERE c.session_id = ?',
        [sessionId]
      );
    }

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: { message: 'Failed to clear cart', status: 500 } });
  }
};
