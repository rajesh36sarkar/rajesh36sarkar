import axios from 'axios';

// Base URL already includes /api now
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(err);
  }
);

// PUBLIC
export const getProjects = () => api.get('/projects');
export const getSiteInfo = () => api.get('/site-info');

// ADMIN
export const adminLogin = (data) => api.post('/admin/login', data);
export const verifyToken = () => api.get('/admin/verify');

// CRUD
export const createProject = (data) => api.post('/projects', data);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);

export const updateSiteInfo = (data) => api.put('/site-info', data);

// UPLOAD
export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return api.post('/upload', formData);
};

export const uploadMultipleImages = (files) => {
  const formData = new FormData();
  files.forEach((f) => formData.append('images', f));
  return api.post('/upload/multiple', formData);
};

export default api;