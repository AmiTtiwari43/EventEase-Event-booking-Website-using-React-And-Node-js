const Service = require('../models/Service');

// Get all active services with search and filtering
exports.getServices = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    let query = { isActive: true };
    
    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const services = await Service.find(query).populate('createdBy', 'name email').sort(sortOptions);
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services' });
  }
};

// Get all services (admin only - includes deleted)
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().populate('createdBy', 'name email').sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all services' });
  }
};

// Get service by ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('createdBy', 'name email');
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service' });
  }
};

// Create new service (admin only)
exports.createService = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can create services' });
    }

    const { title, description, category, price, duration, features, address, images } = req.body;
    
    const service = new Service({
      title,
      description,
      category,
      price,
      duration,
      features: features || [],
      address,
      images: images || [],
      createdBy: req.user.id,
      isCustom: true
    });

    await service.save();
    
    const populatedService = await Service.findById(service._id).populate('createdBy', 'name email');
    res.status(201).json(populatedService);
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ message: 'Error creating service' });
  }
};

// Update service (admin only)
exports.updateService = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can update services' });
    }

    const { title, description, category, price, duration, features, address, images, isActive } = req.body;
    
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        category,
        price,
        duration,
        features: features || [],
        address,
        images: images || [],
        isActive
      },
      { new: true }
    ).populate('createdBy', 'name email');

    res.json(updatedService);
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ message: 'Error updating service' });
  }
};

// Delete service (admin only - soft delete)
exports.deleteService = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can delete services' });
    }

    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Soft delete - set isActive to false
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).populate('createdBy', 'name email');

    res.json({ message: 'Service deleted successfully', service: updatedService });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ message: 'Error deleting service' });
  }
};

// Restore deleted service (admin only)
exports.restoreService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Only admin can restore services
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    ).populate('createdBy', 'name email');

    res.json({ message: 'Service restored successfully', service: updatedService });
  } catch (error) {
    console.error('Restore service error:', error);
    res.status(500).json({ message: 'Error restoring service' });
  }
};

// Get service categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Service.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

// Get featured services
exports.getFeaturedServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).populate('createdBy', 'name email').sort({ createdAt: -1 }).limit(6);
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching featured services' });
  }
}; 
