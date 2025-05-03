import apiClient from './client';
import { API_ENDPOINTS } from './config';

export const authService = {
  signup: (userData) => {
    return apiClient.post(API_ENDPOINTS.AUTH.SIGNUP, userData);
  },
  
  login: (credentials) => {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  },
  
  logout: () => {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },
  
  forgotPassword: (email) => {
    return apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  },
  
  resetPassword: (token, newPassword) => {
    return apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { 
      token, 
      newPassword 
    });
  }
};
