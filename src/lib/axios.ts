import axios from 'axios';
import { API_CONFIG } from '@/config/api.config';

// Create axios instance with default config
export const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: any) => {
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: any) => {
    const originalRequest = error.config as any & { _retry?: boolean };

    // Don't try to refresh token on login/signup/forgot-password endpoints
    const isAuthEndpoint = 
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/signup') ||
      originalRequest.url?.includes('/auth/forgot-password') ||
      originalRequest.url?.includes('/auth/reset-password') ||
      originalRequest.url?.includes('/auth/verify-otp');

    // Handle token refresh for other 401 errors
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        await axiosInstance.post('/api/auth/refresh-token');
        // Retry original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
