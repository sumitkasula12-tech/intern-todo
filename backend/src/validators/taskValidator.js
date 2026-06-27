const { body, param, query } = require('express-validator');

const taskBaseValidators = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 100 }).withMessage('Title must be max 100 characters'),
  body('description').optional().trim(),
  body('priority').notEmpty().withMessage('Priority is required').isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
  body('status').optional().isIn(['pending', 'in_progress', 'completed', 'cancelled']).withMessage('Status must be valid'),
  body('dueDate').notEmpty().withMessage('Due date is required').isISO8601().toDate().withMessage('Due date must be valid'),
];

const taskStatusValidator = [
  param('id').isMongoId().withMessage('Invalid task id'),
  body('status').notEmpty().withMessage('Status is required').isIn(['pending', 'in_progress', 'completed', 'cancelled']).withMessage('Status must be valid'),
];

const taskIdValidator = [param('id').isMongoId().withMessage('Invalid task id')];

const taskQueryValidator = [
  query('status').optional().isIn(['pending', 'in_progress', 'completed', 'cancelled']).withMessage('Invalid status filter'),
  query('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority filter'),
  query('search').optional().trim(),
  query('sortByDueDate').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be 1 or greater'),
  query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be 1 or greater'),
];

module.exports = { taskBaseValidators, taskStatusValidator, taskIdValidator, taskQueryValidator };
