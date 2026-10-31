import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://staging.fastor.ai/v1';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
  },
});

// Request interceptor to attach JWT token if present
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fastor_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to format errors and handle 401 unauth
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or unauthorized
      localStorage.removeItem('fastor_token');
      localStorage.removeItem('fastor_user');
      if (window.location.pathname !== '/register' && window.location.pathname !== '/verify-otp') {
        window.location.href = '/register';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Extracts user-friendly error message from Fastor API response
 */
export const extractErrorMessage = (error, defaultMsg = 'Something went wrong. Please try again.') => {
  if (error.response?.data) {
    const data = error.response.data;
    if (data.error_message) return data.error_message;
    if (Array.isArray(data.error) && data.error[0]?.error) return data.error[0].error;
    if (typeof data.error === 'string') return data.error;
    if (data.message) return data.message;
  }
  if (error.message) return error.message;
  return defaultMsg;
};

export default apiClient;
