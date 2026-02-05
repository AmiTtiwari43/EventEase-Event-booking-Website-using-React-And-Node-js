import { useState, useEffect } from 'react';

const EditServiceModal = ({ service, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Other',
    price: 0,
    duration: '',
    features: [],
    address: '',
    images: [],
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title,
        description: service.description,
        category: service.category,
        price: service.price,
        discount: service.discount || 0,
        duration: service.duration,
        features: service.features || [],
        address: service.address,
        companyName: service.companyName || '',
        companyContact: service.companyContact || '',
        images: service.images || [],
        isActive: service.isActive
      });
    }
  }, [service]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayChange = (e, field, index) => {
    const newArray = [...formData[field]];
    newArray[index] = e.target.value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addItem = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Strict Validation
    if (formData.price <= 0) {
      setError('Price must be greater than 0');
      setLoading(false);
      return;
    }

    if (formData.discount < 0 || formData.discount > 100) {
      setError('Discount must be between 0 and 100');
      setLoading(false);
      return;
    }

    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and Description cannot be empty or just whitespace');
      setLoading(false);
      return;
    }

    // specific validation for fake entries
    if (formData.title.length < 3) {
      setError('Title must be at least 3 characters long');
      setLoading(false);
      return;
    }

    // Validate Image URLs
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)?\/?$/;
    const invalidImages = formData.images.filter(img => img && !urlPattern.test(img));
    if (invalidImages.length > 0) {
       setError('One or more image URLs are invalid');
       setLoading(false);
       return;
    }

    try {
      await onUpdate(service._id, formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content !max-w-2xl max-h-[90vh] overflow-y-auto !p-0 animate-fade-in">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Service</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="alert alert-error mb-8 flex items-center gap-3">
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
              <span className="font-bold">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                <label className="form-label ml-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

               <div>
                <label className="form-label ml-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-input"
                >
                  {['Wedding', 'Corporate', 'Birthday', 'Anniversary', 'Graduation', 'Baby Shower', 'Cultural', 'Other'].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

               <div>
                <label className="form-label ml-1">Price & Discount</label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      className="form-input"
                      placeholder="Original Price"
                    />
                  </div>
                   <div className="w-1/3">
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount || 0}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      className="form-input"
                      placeholder="%"
                    />
                  </div>
                </div>
              </div>

               <div>
                <label className="form-label ml-1">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName || ''}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

                <div>
                <label className="form-label ml-1">Company Contact</label>
                <input
                  type="text"
                  name="companyContact"
                  value={formData.companyContact || ''}
                  onChange={handleChange}
                  maxLength="10"
                  pattern="\d{10}"
                  required
                  className="form-input"
                />
              </div>

               <div>
                <label className="form-label ml-1">Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

             <div>
              <label className="form-label ml-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="3"
                className="form-input"
              />
            </div>

             <div>
              <label className="form-label ml-1">Address/Location</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

             {/* Features Dynamic List */}
            <div>
              <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Features</label>
              <div className="space-y-3 mb-4">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleArrayChange(e, 'features', index)}
                      className="form-input text-sm py-2"
                    />
                   <button
                      type="button"
                      onClick={() => removeItem('features', index)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
               <button
                type="button"
                onClick={() => addItem('features')}
                className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
              >
                <span>+</span> Add Feature
              </button>
            </div>

             {/* Images Dynamic List */}
            <div>
              <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Image URLs</label>
              <div className="space-y-6 mb-6">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group/img bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
                   <div className="flex gap-2 mb-2">
                     <input
                        type="text"
                        value={img}
                        onChange={(e) => handleArrayChange(e, 'images', index)}
                        className="form-input text-sm py-2"
                        placeholder="https://example.com/image.jpg"
                    />
                      <button
                          type="button"
                          onClick={() => removeItem('images', index)}
                          className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 p-2 rounded-lg transition-colors"
                          title="Remove Image"
                      >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                      </button>
                    </div>
                  
                    {/* Image Preview */}
                   <div className="relative h-40 w-full bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center border border-gray-100 dark:border-gray-700">
                     {img ? (
                         <img
                             key={img}
                             src={img}
                             alt={`Preview ${index + 1}`}
                             className="h-full w-full object-cover transition-transform duration-500 group-hover/img:scale-110"
                             onError={(e) => {
                                 e.target.onerror = null; 
                                 e.target.src = "https://via.placeholder.com/400x300?text=Invalid+Image+URL";
                             }}
                         />
                     ) : (
                         <div className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-xs font-bold uppercase tracking-wider">No Preview Available</span>
                         </div>
                     )}
                   </div>
                  </div>
                ))}
              </div>
               <button
                type="button"
                onClick={() => addItem('images')}
                className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
              >
                <span>+</span> Add Image URL
              </button>
            </div>

             <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-700">
               <input
                 type="checkbox"
                 name="isActive"
                 id="isActive"
                 checked={formData.isActive}
                 onChange={handleChange}
                 className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800 transition-all cursor-pointer"
               />
               <label htmlFor="isActive" className="ml-3 block text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                 Active (Visible to users)
               </label>
             </div>

             <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
               <button
                 type="button"
                 onClick={onClose}
                 className="btn-secondary md:w-auto"
               >
                 Cancel
               </button>
               <button
                 type="submit"
                 disabled={loading}
                 className="btn-primary md:w-auto"
               >
                 {loading ? 'Saving...' : 'Save Changes'}
               </button>
             </div>
         </form>
        </div>
      </div>
    </div>
  );
};

export default EditServiceModal;
