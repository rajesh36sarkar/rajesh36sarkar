import axios from 'axios';

// 1. Resolve API Route Base URLs once during initial runtime execution
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000, // Optional: 15s timeout protects application state from hanging permanently on down networks
});

// 2. Request Interceptor: Secure token insertion with proper error handling boundaries
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // Prevents application pipeline stalls on configuration drop issues
  }
);

// 3. Response Interceptor: Centralized Token Expiry / Global Error Handling (Highly Recommended)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Automatically clear local credentials if backend flags authentication drops (401 Unauthorized)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Optional: Redirect to login or trigger global state reset if needed
    }
    return Promise.reject(error);
  }
);

/* ==========================================================================
   Public Endpoints
   ========================================================================== */
export const getProjects = () => api.get('/projects');
export const getSiteInfo = () => api.get('/site-info');

/* ==========================================================================
   Admin Endpoints
   ========================================================================== */
export const adminLogin = (credentials) => api.post('/admin/login', credentials);
export const verifyToken = () => api.get('/admin/verify');

export const createProject = (projectData) => api.post('/projects', projectData);
export const updateProject = (id, projectData) => api.put(`/projects/${id}`, projectData);
export const deleteProject = (id) => api.delete(`/projects/${id}`);

export const updateSiteInfo = (data) => api.put('/site-info', data);

/* ==========================================================================
   Asset Management Endpoints (Optimized)
   ========================================================================== */

// Single Image Upload (Axios automatically handles multipart boundary settings when passed FormData)
export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return api.post('/upload', formData);
};

// Multiple Images Upload (Synchronized with your Dashboard Gallery logic)
export const uploadMultipleImages = (filesArray) => {
  const formData = new FormData();
  filesArray.forEach((file) => formData.append('images', file));
  return api.post('/upload/multiple', formData);
};

export default api;