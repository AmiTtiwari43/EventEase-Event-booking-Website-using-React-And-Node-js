import axios from './axios';


export const createPaymentIntent = async (bookingData) => {
  try {
    const response = await axios.post('/api/payments/create-payment-intent', bookingData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const confirmPayment = async (paymentIntentId) => {
  try {
    const response = await axios.post('/api/payments/confirm', { paymentIntentId });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getPaymentHistory = async () => {
  try {
    const response = await axios.get('/api/payments/history');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}; 
