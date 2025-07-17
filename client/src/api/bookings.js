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

// Refund booking (admin only)
export const refundBooking = async (bookingId, amount) => {
  try {
    const response = await axios.post(`/bookings/${bookingId}/refund`, { amount });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to process refund');
  }
};

// Mark booking as paid
export const markBookingPaid = async (bookingId) => {
  try {
    const response = await axios.put(`/bookings/${bookingId}/mark-paid`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to mark booking as paid');
  }
};

// Request refund (user)
export const requestRefund = async (bookingId) => {
  try {
    const response = await axios.put(`/bookings/${bookingId}/request-refund`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to request refund');
  }
}; 
