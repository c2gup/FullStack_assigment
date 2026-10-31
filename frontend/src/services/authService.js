import apiClient from './api';

/**
 * Register / Send OTP to user phone number
 * @param {string} phone 10-digit mobile number
 * @param {string} dialCode Dial code (e.g., '+91')
 * @returns {Promise<any>}
 */
export const registerUser = async (phone, dialCode = '+91') => {
  const params = new URLSearchParams();
  params.append('phone', phone.trim());
  params.append('dial_code', dialCode.trim());

  const response = await apiClient.post('/pwa/user/register', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data;
};

/**
 * Login / Verify OTP
 * @param {string} phone 10-digit mobile number
 * @param {string} dialCode Dial code (e.g., '+91')
 * @param {string} otp 6-digit OTP code
 * @returns {Promise<any>}
 */
export const loginUser = async (phone, dialCode = '+91', otp = '123456') => {
  const params = new URLSearchParams();
  params.append('phone', phone.trim());
  params.append('dial_code', dialCode.trim());
  params.append('otp', otp.trim());

  const response = await apiClient.post('/pwa/user/login', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data;
};
