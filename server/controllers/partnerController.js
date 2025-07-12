const Partner = require('../models/Partner');

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
    const { status, reviewNotes } = req.body;
    
    if (!['accepted', 'declined'].includes(status)) {
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

    await application.save();

    res.json({ 
      message: `Application ${status} successfully`,
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