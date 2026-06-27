const { body } = require('express-validator');

const updateProfileValidator = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('phone').optional().trim(),
  body('avatarUrl').optional().trim().isURL().withMessage('Avatar URL must be valid'),
];

const changePasswordValidator = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').notEmpty().withMessage('New password is required').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
];

module.exports = { updateProfileValidator, changePasswordValidator };
