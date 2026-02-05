import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getServices, createService, deleteService, restoreService } from '../api/services';
import { useAuth } from '../context/AuthContext';

const Services = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popularity'); // Default sort by popularity
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Other',
    price: '',
    duration: '1 Day',
    address: '',
    features: [],
    images: []
  });

  const categories = [
    'all', 'Wedding', 'Corporate', 'Birthday', 'Anniversary', 
    'Graduation', 'Baby Shower', 'Cultural', 'Other'
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        // Filter out Graduation services
        const filtered = data.filter(service => service.category !== 'Graduation');
        setServices(filtered);
        // Initial sorting will happen in the text effect
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    let filtered = [...services]; // Create a copy

    // 1. Filter by Category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    // 2. Filter by Search
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 3. Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return (b.averageRating || 0) - (a.averageRating || 0) || (b.reviewCount || 0) - (a.reviewCount || 0);
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        default:
          return 0;
      }
    });

    setFilteredServices(filtered);
  }, [services, selectedCategory, searchTerm, sortBy]);

  const handleCreateService = async (e) => {
    e.preventDefault();
    try {
      const newService = await createService(formData);
      setServices([...services, newService]);
      setShowCreateForm(false);
      setFormData({
        title: '',
        description: '',
        category: 'Other',
        price: '',
        duration: '1 Day',
        address: '',
        features: [],
        images: []
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, '']
    });
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImage = () => {
    setFormData({
      ...formData,
      images: [...formData.images, '']
    });
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      await deleteService(serviceId);
      setServices(services.map(service => 
        service._id === serviceId 
          ? { ...service, isActive: false }
          : service
      ));
    } catch (err) {
      setError('Failed to delete service');
    }
  };

  const handleRestoreService = async (serviceId) => {
    try {
      await restoreService(serviceId);
      setServices(services.map(service => 
        service._id === serviceId 
          ? { ...service, isActive: true }
          : service
      ));
    } catch (err) {
      setError('Failed to restore service');
    }
  };

  const ServiceCard = ({ service, index }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = service.images && service.images.length > 0 
      ? service.images 
      : [
          "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&h=600&fit=crop"
        ];

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // 5 seconds

      return () => clearInterval(interval);
    }, [images.length]);

    return (
      <div className={`card-hover animate-fade-in ${!service.isActive ? 'opacity-60' : ''}`} 
           style={{animationDelay: `${index * 0.1}s`}}>
        <div className="relative h-64 overflow-hidden rounded-t-2xl">
          {images.map((image, imgIndex) => (
            <img
              key={imgIndex}
              src={image}
              alt={`${service.title} ${imgIndex + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
                imgIndex === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
              }`}
            />
          ))}
          <div className="absolute top-4 right-4 flex gap-2">
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
              {service.category}
            </span>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex space-x-1">
              {images.map((_, imgIndex) => (
                <button
                  key={imgIndex}
                  onClick={() => setCurrentImageIndex(imgIndex)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                    imgIndex === currentImageIndex 
                      ? 'bg-white shadow-lg shadow-white/50' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          </div>
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300">
            {service.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
            {service.description}
          </p>
          
          {service.features && service.features.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Features:</h4>
              <div className="flex flex-wrap gap-1">
                {service.features.slice(0, 3).map((feature, featureIndex) => (
                  <span key={featureIndex} className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full text-xs font-medium">
                    {feature}
                  </span>
                ))}
                {service.features.length > 3 && (
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                    +{service.features.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              {service.discount > 0 ? (
                <>
                  <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                    ₹{service.price.toLocaleString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gradient">
                      ₹{Math.round(service.price * (1 - service.discount / 100)).toLocaleString()}
                    </span>
                    <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-bold">
                      {service.discount}% OFF
                    </span>
                  </div>
                   {/* Rating */}
                   <div className="flex items-center gap-1 mt-1">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-3 h-3 ${i < Math.round(service.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">({service.reviewCount})</span>
                   </div>
                </>
              ) : (
                <span className="text-2xl font-bold text-gradient">
                  ₹{service.price.toLocaleString()}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {user && user.role === 'admin' && (
                <>
                  {!service.isActive ? (
                    <button
                      onClick={() => handleRestoreService(service._id)}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-3 py-2 rounded-xl text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    >
                      Restore
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDeleteService(service._id)}
                      className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-3 py-2 rounded-xl text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    >
                      Delete
                    </button>
                  )}
                </>
              )}
            <Link
              to={`/services/${service._id}`}
                className="btn-primary text-sm px-4 py-2"
            >
              View Details
            </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
        <div className="container mx-auto px-6 py-8">
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading services...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
      <div className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            Our Services
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover our comprehensive range of event management services designed to make your special occasions truly memorable.
          </p>
            </div>
            
        {/* Search and Filter Section */}
        <div className="mb-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl border border-white/20 dark:border-white/10 shadow-xl animate-fade-in" style={{animationDelay: '0.1s'}}>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input w-full"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-input"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-input"
              >
                <option value="popularity">Popularity</option>
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              {user && user.role === 'admin' && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="btn-primary"
                >
                  Add Service
                </button>
              )}
          </div>
        </div>
      </div>

      {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service, index) => (
            <ServiceCard key={service._id} service={service} index={index} />
          ))}
            </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No services found</h3>
            <p className="text-gray-600 dark:text-gray-300">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {/* Create Service Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 dark:border-white/10">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gradient">Create New Service</h2>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-300"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {error && (
                  <div className="alert alert-error mb-4">
                    {error}
                  </div>
                )}

                <form onSubmit={handleCreateService} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label">Service Title</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="form-input"
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="form-input"
                      >
                        {categories.filter(cat => cat !== 'all').map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="form-input"
                      rows="4"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="form-label">Price (₹)</label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="form-input"
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label">Duration</label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) => setFormData({...formData, duration: e.target.value})}
                        className="form-input"
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label">Address</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="form-input"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Features</label>
                    <div className="space-y-2">
                      {formData.features.map((feature, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => handleFeatureChange(index, e.target.value)}
                            className="form-input flex-1"
                            placeholder="Enter feature"
                          />
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-xl transition-colors duration-300"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addFeature}
                        className="btn-secondary"
                      >
                        Add Feature
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Image URLs</label>
                    <div className="space-y-2">
                      {formData.images.map((image, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="url"
                            value={image}
                            onChange={(e) => handleImageChange(index, e.target.value)}
                            className="form-input flex-1"
                            placeholder="Enter image URL"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-xl transition-colors duration-300"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addImage}
                        className="btn-secondary"
                      >
                        Add Image
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="btn-primary flex-1"
                    >
                      Create Service
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services; 
