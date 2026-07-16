import axios from "axios";

// Set global axios defaults for security headers
axios.defaults.headers.common["x-flashspace-csrf"] = "true";

/**
 * Central API Service Configuration
 * Handles all HTTP requests with centralized error handling and base URL management
 */

// Ensure base URL always includes the '/api' prefix expected by the backend
const RAW_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:5001" : window.location.origin);
const API_BASE_URL = RAW_BASE_URL.endsWith("/api")
  ? RAW_BASE_URL
  : `${RAW_BASE_URL.replace(/\/$/, "")}/api`;

// console.log('🌍 API Base URL:', API_BASE_URL);

import { axiosInstance } from "@/lib/axios";

// Export the generic error handlers
export const handleApiError = (error: any): never => {
  let errorMessage = "An unexpected error occurred";

  if (error.response?.status === 500) {
    errorMessage = `Server Error (500): ${error.response?.data?.message || "Internal Server Error"}`;
  } else if (error.response?.status === 404) {
    errorMessage = `Not Found (404): ${error.response?.data?.message || "Resource not found"}`;
  } else if (error.response?.status === 400) {
    errorMessage = `Bad Request (400): ${error.response?.data?.message || "Invalid request"}`;
  } else if (error.response?.data?.message) {
    errorMessage = error.response.data.message;
  } else if (error.message) {
    errorMessage = error.message;
  }

  console.error("🚨 Handled Error:", errorMessage);
  throw new Error(errorMessage);
};

/**
 * Generic success response handler
 */
export const isSuccessResponse = (response: any): boolean => {
  return response.status === 200 && response.data.success;
};

export default axiosInstance;
