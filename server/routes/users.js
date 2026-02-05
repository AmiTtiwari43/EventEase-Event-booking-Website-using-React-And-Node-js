const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get all users (admin only)
router.get('/', auth, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, phone },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error updating profile' });
  }
});

// Upload avatar
router.post('/avatar', auth, async (req, res) => {
  try {
    // In a real app, you would handle file upload here
    // For now, we'll just return a success message
    res.json({ message: 'Avatar uploaded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading avatar' });
  }
});

module.exports = router; 