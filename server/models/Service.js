const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Wedding', 'Corporate', 'Birthday', 'Anniversary', 'Graduation', 'Baby Shower', 'Cultural', 'Other'],
    default: 'Other'
  },
  description: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true,
    default: 'EventEase'
  },
  companyContact: {
    type: String,
    required: true,
    default: '9999999999'
  },
  address: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  duration: {
    type: String,
    required: true,
    default: '1 Day'
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  isCustom: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  features: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema); 