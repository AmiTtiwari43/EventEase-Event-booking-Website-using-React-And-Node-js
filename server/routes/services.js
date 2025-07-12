const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { auth } = require('../middleware/auth');
const admin = require('../middleware/admin');

// Public routes
router.get('/', serviceController.getServices);
router.get('/categories', serviceController.getCategories);
router.get('/featured', serviceController.getFeaturedServices);
router.get('/:id', serviceController.getServiceById);

// Admin routes
router.get('/admin/all', auth, admin, serviceController.getAllServices);
router.post('/', auth, admin, serviceController.createService);
router.put('/:id', auth, admin, serviceController.updateService);
router.delete('/:id', auth, admin, serviceController.deleteService);
router.patch('/:id/restore', auth, admin, serviceController.restoreService);

module.exports = router; 