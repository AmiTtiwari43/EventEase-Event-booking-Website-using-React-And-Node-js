const Booking = require('../models/Booking');
const Service = require('../models/Service');

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { serviceId, name, mobile, date, durationHours, timeSlot } = req.body;
    
    // Check if service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if date is in the future
    const bookingDate = new Date(date);
    if (bookingDate < new Date()) {
      return res.status(400).json({ message: 'Booking date must be in the future' });
    }

    // Check for slot conflict
    const slotConflict = await Booking.findOne({
      serviceId,
      date: bookingDate,
      timeSlot
    });
    if (slotConflict) {
      return res.status(409).json({ message: 'This time slot is already booked. Please choose another.' });
    }

    const booking = new Booking({
      userId: req.user._id,
      serviceId,
      name,
      mobile,
      date: bookingDate,
      durationHours,
      timeSlot
    });

    await booking.save();
    
    // Populate service details
    await booking.populate('serviceId');
    
    res.status(201).json(booking);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Error creating booking' });
  }
};

// Get user's bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('serviceId')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};

// Get all bookings (admin only)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('serviceId')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};

// Update booking status (admin only)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { bookingId } = req.params;

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    ).populate('serviceId');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Error updating booking status' });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns the booking or is admin
    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    booking.status = 'cancelled';
    await booking.save();
    
    await booking.populate('serviceId');
    
    res.json(booking);
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Error cancelling booking' });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    const booking = await Booking.findById(bookingId)
      .populate('serviceId')
      .populate('userId', 'name email');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns the booking or is admin
    if (booking.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Error fetching booking' });
  }
};

// Get booking statistics
exports.getBookingStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const rejectedBookings = await Booking.countDocuments({ status: 'rejected' });
    
    res.json({
      totalBookings,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      completedBookings,
      rejectedBookings
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking statistics' });
  }
}; 

// Refund booking (admin only)
exports.refundBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { amount } = req.body;

    const booking = await Booking.findById(bookingId).populate('serviceId');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (booking.status !== 'cancelled') {
      return res.status(400).json({ message: 'Only cancelled bookings can be refunded' });
    }
    if (booking.refund.status === 'processed') {
      return res.status(400).json({ message: 'Booking already refunded' });
    }
    // Default to full refund if amount not provided
    const refundAmount = typeof amount === 'number' ? amount : (booking.serviceId?.price || 0);
    // TODO: Integrate with payment gateway here if needed
    booking.refund = {
      status: 'processed',
      amount: refundAmount,
      date: new Date()
    };
    await booking.save();
    res.json(booking);
  } catch (error) {
    console.error('Refund booking error:', error);
    res.status(500).json({ message: 'Error processing refund' });
  }
}; 

// Mark booking as paid
exports.markBookingPaid = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { paymentStatus: 'paid' },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error marking booking as paid' });
  }
}; 

// User requests a refund for a cancelled, paid booking
exports.requestRefund = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (booking.status !== 'cancelled') {
      return res.status(400).json({ message: 'Refund can only be requested for cancelled bookings' });
    }
    if (booking.refund && (booking.refund.status === 'requested' || booking.refund.status === 'processed')) {
      return res.status(400).json({ message: 'Refund already requested or processed' });
    }
    booking.refund = { status: 'requested', amount: 0 };
    await booking.save();
    res.json({ message: 'Refund requested', booking });
  } catch (error) {
    console.error('Request refund error:', error);
    res.status(500).json({ message: 'Error requesting refund' });
  }
}; 
