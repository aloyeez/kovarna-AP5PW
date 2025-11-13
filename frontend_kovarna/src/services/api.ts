import axios, { type AxiosInstance } from 'axios';
import { handleSessionExpired } from '../utils/sessionManager';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Check if user was authenticated (token expired) vs just unauthorized
      const wasAuthenticated = !!localStorage.getItem('auth_token');

      if (wasAuthenticated) {
        // Session expired - handle with toast notification and proper cleanup
        handleSessionExpired();
      } else {
        // User was never authenticated, just redirect
        window.location.href = '/login';
      }
    }

    // Handle 403 Forbidden - user doesn't have required permissions
    if (error.response?.status === 403) {
      // Clear auth data and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Provide better error messages
    const errorMessage = error.response?.data?.message ||
                        error.response?.data?.error ||
                        error.message ||
                        'An unexpected error occurred';

    error.message = errorMessage;
    return Promise.reject(error);
  }
);

export default api;