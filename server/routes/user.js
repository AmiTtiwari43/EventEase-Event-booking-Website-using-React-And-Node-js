const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');
const admin = require('../middleware/admin');

// User routes (require authentication)
router.get('/profile', auth, userController.getUserProfile);
router.put('/profile', auth, userController.updateUserProfile);
router.post('/avatar', auth, userController.uploadAvatar);
router.put('/password', auth, userController.changePassword);
router.delete('/account', auth, userController.deleteAccount);

// Admin routes
router.get('/', auth, admin, userController.getAllUsers);
router.get('/:userId', auth, admin, userController.getUserById);

module.exports = router; 