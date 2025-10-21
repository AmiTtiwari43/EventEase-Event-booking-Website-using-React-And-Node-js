import axios from 'axios';

// Allow overriding backend URL in different environments (Vite uses VITE_ prefix)
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API = axios.create({
  baseURL,
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
