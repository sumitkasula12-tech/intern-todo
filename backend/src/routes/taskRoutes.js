const express = require('express');
const taskController = require('../controllers/taskController');
const { authenticate } = require('../middleware/authMiddleware');
const { taskBaseValidators, taskStatusValidator, taskIdValidator, taskQueryValidator } = require('../validators/taskValidator');

const router = express.Router();
router.use(authenticate);
router.post('/', taskBaseValidators, taskController.createTask);
router.get('/', taskQueryValidator, taskController.getTasks);
router.get('/:id', taskIdValidator, taskController.getTaskById);
router.put('/:id', taskIdValidator.concat(taskBaseValidators), taskController.updateTask);
router.patch('/:id/status', taskStatusValidator, taskController.updateTaskStatus);
router.delete('/:id', taskIdValidator, taskController.deleteTask);

module.exports = router;
