const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { auth } = require('../middleware/auth');
const admin = require('../middleware/admin');

// User routes (require authentication)
router.post('/', auth, bookingController.createBooking);
router.get('/my', auth, bookingController.getUserBookings);
router.put('/:bookingId/cancel', auth, bookingController.cancelBooking);
router.get('/:bookingId', auth, bookingController.getBookingById);

// Admin routes
router.get('/', auth, admin, bookingController.getAllBookings);
router.put('/:bookingId/status', auth, admin, bookingController.updateBookingStatus);

module.exports = router; 