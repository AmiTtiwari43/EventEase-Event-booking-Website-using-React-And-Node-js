import axios from './axios';


// Get reviews for a service
export const getServiceReviews = async (serviceId) => {
  try {
    const response = await axios.get(`/reviews/${serviceId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch reviews');
  }
};

// Add a review to a service
export const addReview = async (serviceId, reviewData) => {
  try {
    const response = await axios.post(`/reviews/${serviceId}`, reviewData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add review');
  }
};

// Update a review
export const updateReview = async (reviewId, reviewData) => {
  try {
    const response = await axios.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update review');
  }
};

// Delete a review
export const deleteReview = async (reviewId) => {
  try {
    const response = await axios.delete(`/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete review');
  }
};

// Get user's reviews
export const getUserReviews = async () => {
  try {
    const response = await axios.get('/reviews/user');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user reviews');
  }
}; 
