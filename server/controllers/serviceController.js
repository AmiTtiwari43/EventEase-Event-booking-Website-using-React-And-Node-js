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
    const { title, description, category, price, discount, duration, features, address, images, companyName, companyContact } = req.body;

    // Upload images to Cloudinary (if needed) - skipped for now as we use URLs
    
    const service = new Service({
      title,
      description,
      category,
      price,
      discount: discount || 0,
      duration,
      features,
      address,
      images,
      companyName: companyName || 'EventEase',
      companyContact: companyContact || '9999999999',
      createdBy: req.user._id
    });

    await service.save();
    res.status(201).json(service);
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ message: 'Error creating service' });
  }
};

// Update service (admin only)
exports.updateService = async (req, res) => {
  try {
    const { title, description, category, price, discount, duration, features, address, images, isActive, companyName, companyContact } = req.body;
    
    // Check if service exists
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check ownership (admin can edit all)
    if (service.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this service' });
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        category,
        price,
        discount: discount || 0,
        duration,
        features,
        address,
        images,
        isActive,
        companyName,
        companyContact
      },
      { new: true }
    );

    res.json(updatedService);
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ message: 'Error updating service' });
  }
};

// Delete service (admin only - soft delete)
exports.deleteService = async (req, res) => {
  try {
    // Check authorization
    if (req.user.role !== 'admin' && req.user.role !== 'partner') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check ownership for partners
    if (req.user.role === 'partner' && service.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own services' });
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
