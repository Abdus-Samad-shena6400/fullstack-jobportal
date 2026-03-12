import axios from 'axios';

// base URL is taken from an environment variable in order to
// point the frontend at the Render backend once deployed.  Vite
// exposes variables prefixed with `VITE_` to client code.
// During local development we proxy `/api` to the server (see
// `vite.config.js`), so the default remains `/api`.
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Debug log
console.log('API_BASE_URL:', API_BASE_URL);
console.log('VITE_API_URL env:', import.meta.env.VITE_API_URL);
console.log('Environment:', import.meta.env.MODE);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

// Jobs API
export const jobsAPI = {
  getJobs: async (params) => {
    try {
      const response = await api.get('/jobs', { params });
      console.log('Jobs API Response:', response.data);
      console.log('Jobs fetched:', response.data?.jobs?.length || 0);
      return response;
    } catch (error) {
      console.error('Jobs API Error:', error.response?.data || error.message);
      throw error;
    }
  },
  getJob: (id) => api.get(`/jobs/${id}`),
  createJob: (jobData) => api.post('/jobs', jobData),
  updateJob: (id, jobData) => api.put(`/jobs/${id}`, jobData),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  getEmployerJobs: () => api.get('/jobs/employer/jobs'),
};

// Applications API
export const applicationsAPI = {
  apply: (applicationData) => api.post('/applications', applicationData),
  getMyApplications: () => api.get('/applications/my'),
  getEmployerApplications: () => api.get('/applications/employer'),
  updateStatus: (id, status) => api.put(`/applications/${id}`, { status }),
};

export default api;