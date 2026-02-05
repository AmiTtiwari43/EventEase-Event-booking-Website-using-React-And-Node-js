const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true
  },
  contactPerson: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  phone: {
    type: String,
    required: true
  },
  website: {
    type: String
  },
  address: {
    type: String,
    required: true,
    default: "Not Provided"
  },
  eventType: {
    type: String,
    required: true
  },
  eventDetails: {
    type: String,
    required: true
  },
  serviceDescription: {
    type: String,
    required: true
  },
  pricing: {
    type: String,
    required: true
  },
  margin: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  experience: {
    type: Number,
    required: true,
    min: 0
  },
  portfolio: {
    type: String,
    required: true
  },
  additionalInfo: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'negotiating'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  },
  reviewNotes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Partner', partnerSchema); 