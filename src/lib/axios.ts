import axios from 'axios';
import { API_CONFIG } from '@/config/api.config';

// No longer need localStorage - tokens are managed via HttpOnly cookies
// This is more secure as cookies are not accessible to JavaScript (XSS protection)

// Create axios instance with default config
export const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true, // Critical: enables sending cookies with cross-origin requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - cookies are automatically included by the browser
axiosInstance.interceptors.request.use(
  (config: any) => {
    // Automatically prepend /api to relative URLs if not already present
    if (config.url && config.url.startsWith('/') && !config.url.startsWith('/api')) {
      config.url = `/api${config.url}`;
    }
    
    // Cookies are automatically sent by the browser when withCredentials is true
    
    // Add region header for global expansion (except for auth endpoints)
    const isAuthRequest = config.url?.includes('/auth/');
    if (!isAuthRequest) {
      const region = typeof window !== 'undefined' ? localStorage.getItem('user-region') || 'IN' : 'IN';
      config.headers['x-region'] = region;
    }

    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle token refresh
let isRefreshing = false;
let failedQueue: Array<{resolve: (value?: any) => void; reject: (reason?: any) => void}> = [];

const processQueue = (error: any) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: any) => {
    const originalRequest = error.config as any & { _retry?: boolean };

    // Don't try to refresh token on auth endpoints
    const isAuthEndpoint = 
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/signup') ||
      originalRequest.url?.includes('/auth/forgot-password') ||
      originalRequest.url?.includes('/auth/reset-password') ||
      originalRequest.url?.includes('/auth/verify-otp') ||
      originalRequest.url?.includes('/auth/refresh-token') ||
      originalRequest.url?.includes('/auth/google');

    // Handle token refresh for 401 errors
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh token - refresh token is in HttpOnly cookie
        const response = await axiosInstance.post('/api/auth/refresh-token');

        const responseData = response.data as any;
        if (responseData.success) {
          // New tokens are set in cookies by the server
          processQueue(null);
          isRefreshing = false;
          
          // Retry original request
          return axiosInstance(originalRequest);
        } else {
          throw new Error('Token refresh failed');
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        processQueue(refreshError);
        isRefreshing = false;
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
