import axios from 'axios';

// Separate Axios client for the external Postman collection APIs
const FASTOR_BASE_URL = 'https://staging.fastor.ai/v1';

const fastorClient = axios.create({
  baseURL: FASTOR_BASE_URL,
});

export const fastorApi = {
  // 1. Register and get OTP
  registerUser: async ({ phone = '9818979450', dial_code = '+91' }) => {
    const params = new URLSearchParams();
    params.append('phone', phone);
    params.append('dial_code', dial_code);

    const response = await fastorClient.post('/pwa/user/register', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data;
  },

  // 2. Login with OTP
  loginWithOtp: async ({ phone = '9818979450', otp = '123456', dial_code = '+91' }) => {
    const params = new URLSearchParams();
    params.append('phone', phone);
    params.append('otp', otp);
    params.append('dial_code', dial_code);

    const response = await fastorClient.post('/pwa/user/login', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data;
  },

  // 3. Fetch restaurants with Bearer token
  fetchRestaurants: async (token, cityId = '118') => {
    const response = await fastorClient.get(`/m/restaurant?city_id=${cityId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
