import axios from 'axios';
import { API_BASE_URL } from './config';

// Professional pattern: Create a centralized Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: You can easily add interceptors here later for auth tokens or global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error logging for your Cyber-Architect UI
    console.error('[API ARCHIVE ERROR]', error.message);
    if (error.response?.data?.message) {
      console.log('Server Error Detail:', error.response.data.message);
    }
    return Promise.reject(error);
  }
);

export default api;
