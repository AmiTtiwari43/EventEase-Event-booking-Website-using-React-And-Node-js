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

    // Check for slot conflict (exclude cancelled/rejected)
    const slotConflict = await Booking.findOne({
      serviceId,
      date: bookingDate,
      timeSlot,
      status: { $nin: ['cancelled', 'rejected'] }
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

// Get booked slots for a specific date and service
exports.getBookedSlots = async (req, res) => {
  try {
    const { serviceId, date } = req.query;
    
    if (!serviceId || !date) {
      return res.status(400).json({ message: 'Service ID and date are required' });
    }

    const queryDate = new Date(date);
    
    // Find all active bookings for this service and date
    const bookings = await Booking.find({
      serviceId,
      date: queryDate,
      status: { $nin: ['cancelled', 'rejected'] }
    });

    // Extract time slots
    const bookedSlots = bookings.map(booking => booking.timeSlot);
    
    res.json(bookedSlots);
  } catch (error) {
    console.error('Get booked slots error:', error);
    res.status(500).json({ message: 'Error fetching booked slots' });
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
// Update booking status (admin & partner)
// Update booking status (admin & partner)
// Update booking status (admin & partner)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { bookingId } = req.params;

    const validStatuses = ['pending_admin_approval', 'pending_partner_approval', 'approved_pending_payment', 'payment_verifying', 'confirmed', 'completed', 'cancelled', 'rejected', 'reschedule_requested'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findById(bookingId).populate('serviceId');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Role-based State Transitions
    if (req.user.role === 'admin') {
      // Admin Actions
      if (booking.status === 'pending_admin_approval' && status === 'pending_partner_approval') {
        // Admin approves new booking -> Send to Partner
        booking.status = status;
      } else if (booking.status === 'payment_verifying' && status === 'confirmed') {
        // Admin verifies payment -> Confirmed
        booking.status = status;
      } else if (status === 'rejected' || status === 'cancelled') {
         // Admin can always reject/cancel
         booking.status = status;
      } else {
         return res.status(400).json({ message: 'Invalid status transition for Admin' });
      }
    } else if (req.user.role === 'partner') {
      // Partner Actions
      // Check ownership
      if (booking.serviceId.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      if (booking.status === 'pending_partner_approval' && status === 'approved_pending_payment') {
        // Partner approves -> Ready for Payment
        booking.status = status;
      } else if (booking.status === 'confirmed' && status === 'completed') {
        // Partner marks as completed
        booking.status = status;
      } else if (status === 'rejected' || status === 'cancelled') {
        // Partner can reject/cancel
        booking.status = status;
        if (booking.paymentStatus === 'paid' && status === 'cancelled') {
             // Use refund object for pending refund
             booking.refund = {
                 status: 'pending',
                 amount: booking.serviceId.price, // Assuming full refund
                 date: new Date()
             };
        }
      } else {
        return res.status(400).json({ message: 'Invalid status transition for Partner' });
      }
    } else {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await booking.save();
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

// Get dashboard statistics (admin only)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending_admin_approval' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const rejectedBookings = await Booking.countDocuments({ status: 'rejected' });
    
    // Calculate total revenue from confirmed and completed bookings
    // We need to aggregate because price is in the Service model, not Booking
    const revenueAggregation = await Booking.aggregate([
      {
        $match: {
          status: 'completed'
        }
      },
      {
        $lookup: {
          from: 'services',
          localField: 'serviceId',
          foreignField: '_id',
          as: 'service'
        }
      },
      {
        $unwind: '$service'
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$service.price' }
        }
      }
    ]);

    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].total : 0;

    // Monthly revenue aggregation
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Booking.aggregate([
      {
        $match: {
          status: 'completed',
          date: { $gte: sixMonthsAgo }
        }
      },
      {
        $lookup: {
          from: 'services',
          localField: 'serviceId',
          foreignField: '_id',
          as: 'service'
        }
      },
      {
        $unwind: '$service'
      },
      {
        $group: {
          _id: {
            month: { $month: '$date' },
            year: { $year: '$date' }
          },
          revenue: { $sum: '$service.price' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);
    
    // Format monthly data for frontend
    const formatMonth = (month) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months[month - 1];
    };

    const monthlyData = monthlyRevenue.map(item => ({
      month: `${formatMonth(item._id.month)} ${item._id.year}`,
      revenue: item.revenue
    }));

    // Popular Services Aggregation
    const popularServices = await Booking.aggregate([
        { $match: { status: { $ne: 'cancelled' } } }, // Exclude cancelled
        { $group: { _id: '$serviceId', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
            $lookup: {
                from: 'services',
                localField: '_id',
                foreignField: '_id',
                as: 'service'
            }
        },
        { $unwind: '$service' },
        { $project: { name: '$service.title', value: '$count' } }
    ]);

    // Category Stats Aggregation
    const categoryStats = await Booking.aggregate([
        { $match: { status: 'completed' } },
        {
            $lookup: {
                from: 'services',
                localField: 'serviceId',
                foreignField: '_id',
                as: 'service'
            }
        },
        { $unwind: '$service' },
        {
            $group: {
                _id: '$service.category',
                value: { $sum: '$service.price' } // Revenue by category
            }
        },
        { $project: { name: '$_id', value: 1, _id: 0 } }
    ]);

    res.json({
      counts: {
        total: totalBookings,
        pending: pendingBookings,
        confirmed: confirmedBookings,
        cancelled: cancelledBookings,
        completed: completedBookings,
        rejected: rejectedBookings
      },
      totalRevenue,
      monthlyData,
      popularServices,
      categoryStats
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Error fetching dashboard statistics', error: error.message, stack: error.stack });
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

// Mark booking as paid (User action)
exports.markBookingPaid = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify user owns the booking
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    booking.paymentStatus = 'paid';
    booking.status = 'payment_verifying'; // Logic: Paid -> Verifying
    
    await booking.save();

    res.json(booking);
  } catch (error) {
    console.error('Mark booking paid error:', error);
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

// Get partner's received bookings
exports.getPartnerBookings = async (req, res) => {
  try {
    // 1. Find all services created by this partner
    const Service = require('../models/Service');
    const services = await Service.find({ createdBy: req.user._id });
    const serviceIds = services.map(s => s._id);

    // 2. Find bookings for these service IDs
    const bookings = await Booking.find({ serviceId: { $in: serviceIds } })
      .populate('serviceId')
      .populate('userId', 'name email mobile')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    console.error('Get partner bookings error:', error);
    res.status(500).json({ message: 'Error fetching partner bookings' });
  }
};

// Propose Reschedule (Partner action)
exports.proposeReschedule = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { proposedDate, proposedTimeSlot, reason } = req.body;

    const booking = await Booking.findById(bookingId).populate('serviceId');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Verify ownership
    if (booking.serviceId.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.reschedule = {
      isRescheduled: false,
      status: 'requested',
      proposedDate: new Date(proposedDate),
      proposedTimeSlot,
      originalDate: booking.date,
      originalTimeSlot: booking.timeSlot,
      reason
    };
    booking.status = 'reschedule_requested';

    await booking.save();
    res.json(booking);
  } catch (error) {
    console.error('Propose reschedule error:', error);
    res.status(500).json({ message: 'Error proposing reschedule' });
  }
};

// Respond to Reschedule (User action)
exports.respondToReschedule = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { action } = req.body; // 'accept' or 'reject'

    const booking = await Booking.findById(bookingId).populate('serviceId');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (action === 'accept') {
      booking.date = booking.reschedule.proposedDate;
      booking.timeSlot = booking.reschedule.proposedTimeSlot;
      booking.reschedule.status = 'accepted';
      booking.reschedule.isRescheduled = true;
      booking.status = 'confirmed'; // Resume normal status
    } else if (action === 'reject') {
      booking.reschedule.status = 'rejected';
      booking.status = 'cancelled';
      
      // Auto-request refund if paid
      if (booking.paymentStatus === 'paid') {
           booking.refund = {
               status: 'requested',
               amount: booking.serviceId.price,
               date: new Date()
           };
      }
    } else {
        return res.status(400).json({ message: 'Invalid action' });
    }

    await booking.save();
    res.json(booking);
  } catch (error) {
    console.error('Respond to reschedule error:', error);
    res.status(500).json({ message: 'Error responding to reschedule' });
  }
};

// Cancel by Partner (With Refund Logic)
exports.cancelBookingByPartner = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findById(bookingId).populate('serviceId');
        
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        
        // Check ownership
        if (booking.serviceId.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        booking.status = 'cancelled';
        
        if (booking.paymentStatus === 'paid') {
             booking.refund = {
                 status: 'pending', // Waiting for Admin to process
                 amount: booking.serviceId.price,
                 date: new Date()
             };
        }

        await booking.save();
        res.json(booking);
    } catch (error) {
        console.error('Partner cancel error:', error);
        res.status(500).json({ message: 'Error cancelling booking' });
    }
}; 
