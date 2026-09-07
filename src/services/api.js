import axios from 'axios';

const API_BASE_URL = 'https://mss-backend-production.up.railway.app/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  register: (email, full_name, password) => 
    api.post('/auth/register', { email, full_name, password }),
};

export const dashboardAPI = {
  getStats: () => 
    api.get('/dashboard/stats'),
  
  getByIndustry: () => 
    api.get('/dashboard/by-industry'),
  
  getRecentActivity: (limit = 10) => 
    api.get('/dashboard/recent-activity', { params: { limit } }),
};

export const productsAPI = {
  getAll: () => 
    api.get('/products/'),
  
  create: (productData) => 
    api.post('/products/', productData),
};

export const customersAPI = {
  getAll: () => 
    api.get('/customers/'),
  
  create: (customerData) => 
    api.post('/customers/', customerData),
};

export const ordersAPI = {
  getAll: () => 
    api.get('/orders/'),
  
  create: (orderData) => 
    api.post('/orders/', orderData),
};

export default api;