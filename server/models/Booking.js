const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  mobile: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  durationHours: {
    type: Number,
    required: true,
    min: 1,
    max: 24
  },
  status: {
    type: String,
    enum: ['pending_admin_approval', 'pending_partner_approval', 'approved_pending_payment', 'payment_verifying', 'confirmed', 'completed', 'cancelled', 'rejected', 'reschedule_requested'],
    default: 'pending_admin_approval'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  },
  reschedule: {
    isRescheduled: { type: Boolean, default: false },
    status: { type: String, enum: ['none', 'requested', 'accepted', 'rejected'], default: 'none' },
    proposedDate: Date,
    proposedTimeSlot: String,
    originalDate: Date,
    originalTimeSlot: String,
    reason: String
  },
  refund: {
    status: {
      type: String,
      enum: ['none', 'requested', 'pending', 'processed'],
      default: 'none'
    },
    amount: {
      type: Number,
      default: 0
    },
    date: {
      type: Date
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema); 
