import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createService } from '../api/services';
import { useAuth } from '../context/AuthContext';

const CreateService = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    'Wedding', 'Corporate', 'Birthday', 'Anniversary', 
    'Graduation', 'Baby Shower', 'Cultural', 'Other'
  ];

  const handleCreateService = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Strict Validation
    if (!formData.title.trim() || formData.title.length < 3) {
      setError('Title must be at least 3 characters long');
      setLoading(false);
      return;
    }

    if (!formData.description.trim() || formData.description.length < 10) {
      setError('Description must be at least 10 characters long');
      setLoading(false);
      return;
    }

    if (Number(formData.price) <= 0) {
      setError('Price must be greater than 0');
      setLoading(false);
      return;
    }

    if (formData.discount && (Number(formData.discount) < 0 || Number(formData.discount) > 100)) {
      setError('Discount must be between 0 and 100');
      setLoading(false);
      return;
    }

    try {
      await createService(formData);
      navigate('/partner-dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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

  if (!user || (user.role !== 'admin' && user.role !== 'partner')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
         <div className="text-center">
           <h2 className="text-4xl font-black text-red-600 dark:text-red-400 mb-4 uppercase tracking-tight">Access Denied</h2>
           <p className="text-gray-600 dark:text-gray-400 font-medium">You are not authorized to view this page.</p>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900 pb-20 transition-colors duration-500">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-white/20 dark:border-white/10 p-10 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <div className="mb-12 relative z-10">
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Create New Service</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Configure your premium event offering</p>
          </div>
          {error && (
            <div className="alert alert-error mb-8 flex items-center gap-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
              <span className="font-bold">{error}</span>
            </div>
          )}

          <form onSubmit={handleCreateService} className="space-y-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="form-label ml-1 mb-2">Service Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="form-input"
                  required
                  placeholder="e.g. Grand Ballroom Wedding"
                />
              </div>
              <div>
                <label className="form-label ml-1 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="form-input"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="form-label ml-1 mb-2">Service Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="form-input"
                rows="4"
                required
                placeholder="Describe what makes this service special..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="form-label ml-1 mb-2">Internal Vendor Identity</label>
                <input
                  type="text"
                  value={formData.companyName || ''}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  className="form-input"
                  required
                  placeholder="e.g. Dream Weddings Co."
                />
              </div>
              <div>
                <label className="form-label ml-1 mb-2">Direct Contact Number</label>
                <input
                  type="text"
                  value={formData.companyContact || ''}
                  onChange={(e) => {
                    const re = /^[0-9\b]+$/;
                    if (e.target.value === '' || re.test(e.target.value)) {
                      setFormData({...formData, companyContact: e.target.value})
                    }
                  }}
                  maxLength="10"
                  className="form-input"
                  required
                  placeholder="10-digit mobile number"
               />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="col-span-1">
                <label className="form-label ml-1 mb-2">Investment & Discount</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="form-input pl-8"
                      required
                      placeholder="Price"
                    />
                  </div>
                   <div className="relative w-24">
                     <input
                      type="number"
                      value={formData.discount || ''}
                      onChange={(e) => setFormData({...formData, discount: e.target.value})}
                      className="form-input pr-8 text-center"
                      placeholder="%"
                      min="0"
                      max="100"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                   </div>
                </div>
              </div>
              <div>
                <label className="form-label ml-1 mb-2">Standard Duration</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="form-input"
                  required
                  placeholder="e.g. 1 Day / 6 Hours"
                />
              </div>
              <div>
                <label className="form-label ml-1 mb-2">Operational Venue</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="form-input"
                  required
                  placeholder="City, State"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 block">Included Features</label>
              <div className="space-y-4">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-3 group/item">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className="form-input text-sm py-2.5"
                      placeholder="Add a standout feature..."
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200 transition-colors px-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeature}
                  className="inline-flex items-center gap-2 text-xs font-black text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 uppercase tracking-widest bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-xl border border-purple-100 dark:border-purple-800/50 transition-all active:scale-95"
                >
                  <span className="text-lg">+</span> Add Offering
                </button>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 block">Visual Presentation (Image URLs)</label>
              <div className="space-y-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="flex gap-3 group/item">
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      className="form-input text-sm py-2.5"
                      placeholder="https://example.com/image.jpg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200 transition-colors px-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addImage}
                  className="inline-flex items-center gap-2 text-xs font-black text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 uppercase tracking-widest bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-xl border border-purple-100 dark:border-purple-800/50 transition-all active:scale-95"
                >
                  <span className="text-lg">+</span> Add Media Connection
                </button>
              </div>
            </div>

            <div className="flex gap-6 pt-10 border-t dark:border-gray-700">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-secondary flex-1"
              >
                Discard Changes
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Finalizing...
                  </span>
                ) : 'Publish Service'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateService;
