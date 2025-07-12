const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { auth } = require('../middleware/auth');
const admin = require('../middleware/admin');

// Public routes
router.get('/:serviceId', reviewController.getServiceReviews);

// User routes (require authentication)
router.post('/:serviceId', auth, reviewController.addReview);
router.put('/:reviewId', auth, reviewController.updateReview);
router.delete('/:reviewId', auth, reviewController.deleteReview);
router.get('/user', auth, reviewController.getUserReviews);

module.exports = router; 