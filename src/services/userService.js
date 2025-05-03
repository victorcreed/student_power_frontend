import api from './api';
import { API_ENDPOINTS } from './api/config';

export const userService = {
  getUsers: () => {
    return api.get(API_ENDPOINTS.USERS.LIST);
  },
  
  createUser: (userData) => {
    return api.post(API_ENDPOINTS.USERS.CREATE, userData);
  },
  
  updateUser: (id, userData) => {
    return api.put(API_ENDPOINTS.USERS.UPDATE(id), userData);
  },
  
  deleteUser: (id) => {
    return api.delete(API_ENDPOINTS.USERS.DELETE(id));
  }
};
