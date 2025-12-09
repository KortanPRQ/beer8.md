import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: { 
        message: 'Validation failed', 
        status: 400,
        errors: errors.array() 
      } 
    });
  }
  next();
};

// Validation rules
export const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and number'),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('phone').optional().isMobilePhone('any').withMessage('Invalid phone number'),
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const reservationValidation = [
  body('guestName').trim().notEmpty().withMessage('Guest name is required'),
  body('guestEmail').isEmail().normalizeEmail().withMessage('Invalid email address'),
  body('guestPhone').isMobilePhone('any').withMessage('Invalid phone number'),
  body('reservationDate').isISO8601().withMessage('Invalid date format'),
  body('reservationTime').matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format'),
  body('numberOfGuests').isInt({ min: 1, max: 20 }).withMessage('Number of guests must be between 1 and 20'),
  body('zoneId').isInt().withMessage('Zone ID must be a number'),
];

export const menuItemValidation = [
  body('categoryId').isInt().withMessage('Category ID must be a number'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('nameKey').trim().notEmpty().withMessage('Name key is required'),
];

export const couponValidation = [
  body('code').trim().notEmpty().withMessage('Coupon code is required'),
  body('type').isIn(['percentage', 'fixed_amount', 'free_item']).withMessage('Invalid coupon type'),
  body('value').isFloat({ min: 0 }).withMessage('Value must be a positive number'),
];
