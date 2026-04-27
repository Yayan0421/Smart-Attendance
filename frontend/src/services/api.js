import axios from 'axios';

// Determine API base URL based on environment
const getApiBaseUrl = () => {
  // Check for explicit API URL from environment variables
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // In development, use localhost
  if (import.meta.env.MODE === 'development') {
    return import.meta.env.VITE_API_URL || 'http://localhost:5000';
  }
  
  // In production, try to use relative paths (if frontend and backend on same origin)
  // Otherwise, must set VITE_API_BASE_URL in production environment
  return '';
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Mark local network requests if targeting localhost/private IPs
    if (config.baseURL?.includes('localhost') || config.baseURL?.includes('127.0.0.1')) {
      config.headers['X-Local-Network-Request'] = 'true';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
};

export const userService = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export const eventService = {
  getAll: () => api.get('/events'),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
};

export const attendanceService = {
  scan: (rfid_uid, event_id) => api.post('/attendance/scan', { rfid_uid, event_id }),
  getLogs: (filters) => api.get('/attendance/logs', { params: filters }),
  getStats: () => api.get('/attendance/stats'),
  getByEvent: (event_id) => api.get(`/attendance/event/${event_id}`),
};

export default api;
