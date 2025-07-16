import axios from './axios';


// Get all services (public - active only)
export const getServices = async () => {
  try {
    const response = await axios.get('/services');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch services');
  }
};

// Get all services (admin only - includes deleted)
export const getAllServices = async () => {
  try {
    const response = await axios.get('/services/admin/all');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch all services');
  }
};

// Get featured services (for homepage)
export const getFeaturedServices = async () => {
  try {
    const response = await axios.get('/services/featured');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch featured services');
  }
};

// Get service by ID
export const getServiceById = async (id) => {
  try {
    const response = await axios.get(`/services/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch service');
  }
};

// Create new service (admin only)
export const createService = async (serviceData) => {
  try {
    const response = await axios.post('/services', serviceData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create service');
  }
};

// Update service (admin only)
export const updateService = async (id, serviceData) => {
  try {
    const response = await axios.put(`/services/${id}`, serviceData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update service');
  }
};

// Delete service (admin only - soft delete)
export const deleteService = async (id) => {
  try {
    const response = await axios.delete(`/services/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete service');
  }
};

// Restore deleted service (admin only)
export const restoreService = async (id) => {
  try {
    const response = await axios.patch(`/services/${id}/restore`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to restore service');
  }
};

export const getCategories = async () => {
  try {
    const response = await axios.get('/services/categories');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}; 
