const express = require('express');
const profileController = require('../controllers/profileController');
const { authenticate } = require('../middleware/authMiddleware');
const { updateProfileValidator, changePasswordValidator } = require('../validators/profileValidator');

const router = express.Router();
router.use(authenticate);
router.get('/', profileController.getProfile);
router.put('/', updateProfileValidator, profileController.updateProfile);
router.put('/password', changePasswordValidator, profileController.changePassword);

module.exports = router;
