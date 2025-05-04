import axios from 'axios';
import { API_ENDPOINTS } from './api/config';

const getAuthToken = () => localStorage.getItem('auth_token');

const api = axios.create({
  baseURL: process.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorResponse = error.response;
    if (errorResponse && errorResponse.status === 401) {
      if (errorResponse.config.url !== API_ENDPOINTS.AUTH.LOGIN) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_type');
        localStorage.removeItem('user_data');
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  signUp: (data) => api.post(API_ENDPOINTS.AUTH.SIGNUP, data),
  signIn: (credentials) => api.post(API_ENDPOINTS.AUTH.LOGIN, credentials),
  logout: () => {
    const token = getAuthToken();
    if (!token) return Promise.resolve();
    return api.post(API_ENDPOINTS.AUTH.LOGOUT)
      .finally(() => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_type');
        localStorage.removeItem('user_data');
      });
  },
  getMe: () => {
    const token = getAuthToken();
    if (!token) return Promise.reject(new Error('No token found'));
    
    return api.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(response => {
      const userData = response.data;
      const storedData = localStorage.getItem('user_data');
      
      try {
        if (storedData) {
          const parsedStoredData = JSON.parse(storedData);
          const storedRole = parsedStoredData.user?.role;
          const currentRole = userData.user?.role;
          const storedUserId = parsedStoredData.user?.id;
          const currentUserId = userData.user?.id;
          
          if ((storedRole && currentRole && storedRole !== currentRole) || 
              (storedUserId && currentUserId && storedUserId !== currentUserId)) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_type');
            localStorage.removeItem('user_data');
            debugger
            window.location.href = '/signin';
          }
        }
      } catch (e) {
        console.error('Error parsing stored user data');
      }
      
      return response;
    });
  },
  validateToken: () => {
    return authService.getMe();
  }
};

export default api;
