const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { auth } = require('../middleware/auth');
const admin = require('../middleware/admin');

// Public routes
router.get('/:serviceId', reviewController.getServiceReviews);

// User routes (require authentication)
router.get('/user', auth, reviewController.getUserReviews);
router.post('/:serviceId', auth, reviewController.addReview);
router.put('/:reviewId', auth, reviewController.updateReview);
router.delete('/:reviewId', auth, reviewController.deleteReview);

// Reply routes
router.post('/:reviewId/reply', auth, reviewController.addReply);
router.delete('/:reviewId/reply/:replyId', auth, reviewController.deleteReply);
router.put('/:reviewId/reply/:replyId/update', auth, reviewController.updateReply);
router.put('/:reviewId/reply/:replyId/like', auth, reviewController.toggleReplyLike);
router.put('/:reviewId/reply/:replyId/dislike', auth, reviewController.toggleReplyDislike);

// Interaction routes
router.put('/:reviewId/like', auth, reviewController.toggleLike);
router.put('/:reviewId/dislike', auth, reviewController.toggleDislike);

module.exports = router; 