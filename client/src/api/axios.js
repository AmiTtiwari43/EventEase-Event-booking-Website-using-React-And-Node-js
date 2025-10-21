import axios from 'axios';

const API = axios.create({
  baseURL: 'https://event-ease-event-booking-website-us-nine.vercel.app/api', // It will be changed to backend URL when in production
});

// Attach JWT token from localStorage if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API; 
