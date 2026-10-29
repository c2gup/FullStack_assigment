import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const crmApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatic Authorization header injection for authenticated requests
crmApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('crm_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for centralized error handling and 401 token expiration
crmApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If we got 401 and were on an authenticated route, clear stored auth data
      const token = localStorage.getItem('crm_token');
      if (token) {
        localStorage.removeItem('crm_token');
        localStorage.removeItem('crm_user');
        window.dispatchEvent(new Event('crm-auth-expired'));
      }
    }
    return Promise.reject(error);
  }
);

// Helper to format API errors cleanly
export const getErrorMessage = (error) => {
  if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    return error.response.data.errors.map((e) => e.message).join(', ');
  }
  return error.response?.data?.message || error.message || 'An unexpected error occurred. Please try again.';
};

// Authentication endpoints
export const authApi = {
  login: async (credentials) => {
    const response = await crmApi.post('/auth/login', credentials);
    return response.data;
  },
  register: async (data) => {
    const response = await crmApi.post('/auth/register', data);
    return response.data;
  },
  getMe: async () => {
    const response = await crmApi.get('/auth/me');
    return response.data;
  },
};

// Public enquiry endpoint
export const publicApi = {
  submitEnquiry: async (enquiryData) => {
    const response = await crmApi.post('/public/enquiries', enquiryData);
    return response.data;
  },
};

// Lead management endpoints
export const leadsApi = {
  getPublic: async (params = {}) => {
    const response = await crmApi.get('/leads/public', { params });
    return response.data;
  },
  getMy: async (params = {}) => {
    const response = await crmApi.get('/leads/my', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await crmApi.get(`/leads/${id}`);
    return response.data;
  },
  claim: async (id) => {
    const response = await crmApi.patch(`/leads/${id}/claim`);
    return response.data;
  },
  updateStatus: async (id, status) => {
    const response = await crmApi.patch(`/leads/${id}/status`, { status });
    return response.data;
  },
  getStats: async () => {
    const response = await crmApi.get('/leads/stats');
    return response.data;
  },
};
