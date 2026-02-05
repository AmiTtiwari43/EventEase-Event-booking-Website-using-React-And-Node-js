const Partner = require('../models/Partner');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Submit partner application
exports.submitApplication = async (req, res) => {
  try {
    const partnerData = req.body;
    const partner = new Partner(partnerData);
    await partner.save();
    
    res.status(201).json({ 
      message: 'Partner application submitted successfully',
      partner 
    });
  } catch (error) {
    console.error('Error submitting partner application:', error);
    res.status(500).json({ message: 'Failed to submit application' });
  }
};

// Get all partner applications (admin only)
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Partner.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    console.error('Error fetching partner applications:', error);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
};

// Update application status (accept/decline)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewNotes, margin } = req.body;
    
    if (!['accepted', 'declined', 'negotiating'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await Partner.findById(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;
    application.reviewedBy = req.user._id;
    application.reviewedAt = new Date();
    application.reviewNotes = reviewNotes || '';

    if (margin !== undefined && margin !== null) {
      application.margin = margin;
    }

    // Auto-create/Upgrade User account if accepted
    if (status === 'accepted') {
      let user = await User.findOne({ email: application.email.toLowerCase() });
      
      if (user) {
        // Upgrade existing user
        user.role = 'partner';
        await user.save();
      } else {
        // Create new user with temp password
        // Limit phone/mobile length to 10 chars to satisfy validator if exists
        const mobile = application.phone ? application.phone.substring(0, 10) : '0000000000';
        user = new User({
          name: application.contactPerson,
          email: application.email,
          password: 'Password123!', // Default password
          role: 'partner',
          mobile: mobile 
        });
        await user.save();
      }
      application.userId = user._id;
    }

    await application.save();

    res.json({ 
      message: `Application ${status} successfully. ${status === 'accepted' ? 'User account created/updated.' : ''}`,
      application 
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ message: 'Failed to update application status' });
  }
};

// Get application by ID
exports.getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await Partner.findById(id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ message: 'Failed to fetch application' });
  }
}; 
