const { body, param, query } = require('express-validator');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
const phoneRegex = /^\+?[0-9\s\-]+$/;

const userRegistrationValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('username').trim().notEmpty().matches(usernameRegex),
  body('email').trim().notEmpty().matches(emailRegex),
  body('phone').optional().trim().matches(phoneRegex),
  body('password').trim().notEmpty().matches(passwordRegex),
];

const userUpdateValidation = [
  body('id').isInt().withMessage('User ID must be an integer'),
  body('name').optional().trim().isLength({ max: 100 }),
  body('username').optional().trim().matches(usernameRegex),
  body('email').optional().trim().matches(emailRegex),
  body('phone').optional().trim().matches(phoneRegex),
  body('password').optional().trim().matches(passwordRegex),
  body('balance').optional().isInt({ min: 0 }).withMessage('Balance must be a non-negative integer'),
];

const transactionCreationValidation = [
  body('user_id').isInt().withMessage('User ID must be an integer'),
  body('item_id').isInt().withMessage('Item ID must be an integer'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  body('description').optional().trim().isLength({ max: 500 }),
];

const transactionIdValidation = [
  param('id').isInt().withMessage('Transaction ID must be an integer'),
];

const reportTopUsersValidation = [
  query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
];

const reportMonthlySalesValidation = [
  query('year').optional().isInt({ min: 2000, max: 2100 }).withMessage('Year must be a valid 4-digit year'),
];

const validate = (req, res, next) => {
  const { validationResult } = require('express-validator');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(err => err.msg);
    return res.status(400).json({
      success: false,
      message: messages.join('. '),
      payload: null,
    });
  }
  next();
};

module.exports = {
  userRegistrationValidation,
  userUpdateValidation,
  transactionCreationValidation,
  transactionIdValidation,
  reportTopUsersValidation,
  reportMonthlySalesValidation,
  validate,
};