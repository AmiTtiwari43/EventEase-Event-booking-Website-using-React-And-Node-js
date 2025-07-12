const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partnerController');
const { auth } = require('../middleware/auth');
const admin = require('../middleware/admin');

// Submit partner application (public)
router.post('/apply', partnerController.submitApplication);

// Get all applications (admin only)
router.get('/applications', auth, admin, partnerController.getAllApplications);

// Get application by ID (admin only)
router.get('/applications/:id', auth, admin, partnerController.getApplicationById);

// Update application status (admin only)
router.put('/applications/:id/status', auth, admin, partnerController.updateApplicationStatus);

module.exports = router; 