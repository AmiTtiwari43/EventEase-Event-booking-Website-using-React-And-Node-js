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

// Add reply
export const addReply = async (reviewId, comment) => {
  try {
    const response = await axios.post(`/reviews/${reviewId}/reply`, { comment });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add reply');
  }
};

// Delete reply
export const deleteReply = async (reviewId, replyId) => {
  try {
    const response = await axios.delete(`/reviews/${reviewId}/reply/${replyId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete reply');
  }
};

// Toggle Like
export const toggleLike = async (reviewId) => {
  try {
    const response = await axios.put(`/reviews/${reviewId}/like`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to toggle like');
  }
};

// Toggle Dislike
export const toggleDislike = async (reviewId) => {
  try {
    const response = await axios.put(`/reviews/${reviewId}/dislike`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to toggle dislike');
  }
};

// Update a reply
export const updateReply = async (reviewId, replyId, comment) => {
  try {
    const response = await axios.put(`/reviews/${reviewId}/reply/${replyId}/update`, { comment });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update reply');
  }
};

// Toggle Reply Like
export const toggleReplyLike = async (reviewId, replyId) => {
  try {
    const response = await axios.put(`/reviews/${reviewId}/reply/${replyId}/like`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to toggle reply like');
  }
};

// Toggle Reply Dislike
export const toggleReplyDislike = async (reviewId, replyId) => {
  try {
    const response = await axios.put(`/reviews/${reviewId}/reply/${replyId}/dislike`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to toggle reply dislike');
  }
}; 
