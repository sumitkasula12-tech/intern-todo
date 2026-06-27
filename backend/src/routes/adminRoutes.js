const express = require('express');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

const router = express.Router();
router.use(authenticate, authorizeAdmin);
router.get('/stats', adminController.getStats);

module.exports = router;
