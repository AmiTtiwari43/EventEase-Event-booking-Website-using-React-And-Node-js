const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Payment = require('../models/Payment');

// Create payment intent
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { amount, currency, serviceId, bookingId } = req.body;

    // In a real app, you would integrate with Stripe here
    // For now, we'll simulate the payment intent creation
    const paymentIntent = {
      id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount,
      currency,
      status: 'requires_payment_method'
    };

    // Create payment record
    const payment = new Payment({
      userId: req.user.id,
      serviceId,
      bookingId,
      amount,
      currency,
      status: 'pending',
      paymentIntentId: paymentIntent.id
    });

    await payment.save();

    res.json({
      clientSecret: paymentIntent.id,
      id: paymentIntent.id
    });
  } catch (error) {
    res.status(500).json({ message: 'Payment intent creation failed' });
  }
});

// Confirm payment
router.post('/confirm', auth, async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    // Find and update payment
    const payment = await Payment.findOne({ paymentIntentId });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    payment.status = 'completed';
    payment.completedAt = new Date();
    await payment.save();

    res.json({ message: 'Payment confirmed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Payment confirmation failed' });
  }
});

// Get payment history
router.get('/history', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id })
      .populate('serviceId', 'title')
      .populate('bookingId', 'date time')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch payment history' });
  }
});

module.exports = router; 