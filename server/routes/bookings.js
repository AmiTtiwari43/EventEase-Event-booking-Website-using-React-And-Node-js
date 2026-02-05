const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { auth } = require('../middleware/auth');
const admin = require('../middleware/admin');

// Admin routes
router.get('/stats', auth, admin, bookingController.getDashboardStats);
router.get('/', auth, admin, bookingController.getAllBookings);
router.put('/:bookingId/status', auth, bookingController.updateBookingStatus);
router.post('/:bookingId/refund', auth, admin, bookingController.refundBooking);

// Partner routes
const partnerMiddleware = require('../middleware/partner');
router.get('/partner', auth, partnerMiddleware, bookingController.getPartnerBookings);

// User routes (require authentication)
router.get('/slots', auth, bookingController.getBookedSlots);
router.post('/', auth, bookingController.createBooking);
router.get('/my', auth, bookingController.getUserBookings);
router.put('/:bookingId/cancel', auth, bookingController.cancelBooking);
router.get('/:bookingId', auth, bookingController.getBookingById);
router.put('/:bookingId/mark-paid', auth, bookingController.markBookingPaid);
router.put('/:bookingId/request-refund', auth, bookingController.requestRefund);
router.put('/:bookingId/reschedule-response', auth, bookingController.respondToReschedule);

// Partner action routes
router.put('/:bookingId/reschedule', auth, partnerMiddleware, bookingController.proposeReschedule);
router.put('/:bookingId/partner-cancel', auth, partnerMiddleware, bookingController.cancelBookingByPartner);

module.exports = router; 
