import axios from './axios';

// Create a new booking
export const createBooking = async (bookingData) => {
  try {
    const response = await axios.post('/bookings', bookingData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create booking');
  }
};

// Get user's bookings
export const getUserBookings = async () => {
  try {
    const response = await axios.get('/bookings/my');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch bookings');
  }
};

// Get all bookings (admin only)
export const getAllBookings = async () => {
  try {
    const response = await axios.get('/bookings');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch all bookings');
  }
};

// Update booking status (admin only)
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const response = await axios.put(`/bookings/${bookingId}/status`, { status });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update booking status');
  }
};

// Cancel booking
export const cancelBooking = async (bookingId) => {
  try {
    const response = await axios.put(`/bookings/${bookingId}/cancel`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to cancel booking');
  }
};

// Get booking by ID
export const getBookingById = async (bookingId) => {
  try {
    const response = await axios.get(`/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch booking');
  }
}; 