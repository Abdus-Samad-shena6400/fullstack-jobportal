import axios from 'axios';

/**
 * API Configuration
 * 
 * VITE_API_URL is loaded from environment variables (set in Vercel Dashboard)
 * - Production (Vercel): https://fullstack-jobportal-1.onrender.com/api
 * - Development (Local): Uses /api proxy via vite.config.js → http://localhost:5000/api
 * 
 * The proxy in vite.config.js rewrites /api to http://localhost:5000 during development,
 * allowing seamless local testing without CORS issues.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Enhanced console logging for debugging deployment issues
console.log('🌐 API Configuration:', {
  baseURL: API_BASE_URL,
  environment: import.meta.env.MODE,
  viteApiUrl: import.meta.env.VITE_API_URL,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
});

/**
 * Axios Instance
 * - Automatically includes JWT token in Authorization header
 * - Handles request/response interceptors for consistent error handling
 * - Timeout set to 30 seconds for slow connections (Render free tier)
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout for Render free tier
});

/**
 * Request Interceptor
 * Automatically adds JWT token from localStorage to all requests
 * This ensures authenticated routes receive proper authorization header
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 Token attached to request:', config.url);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor
 * Handles common errors and provides better error messages
 * - 401: Unauthorized (token expired/invalid)
 * - 404: Not found (job deleted, etc)
 * - 500: Server error
 */
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      url: response.config.url,
      status: response.status,
      dataKeys: Object.keys(response.data),
    });
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

// ============================================
// AUTH API
// ============================================
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

// ============================================
// JOBS API
// ============================================
export const jobsAPI = {
  /**
   * Fetch all jobs with pagination and filtering
   * Handles cases where no jobs are found in database
   */
  getJobs: async (params) => {
    try {
      console.log('📋 Fetching jobs with params:', params);
      const response = await api.get('/jobs', { params });
      console.log('✅ Jobs fetched:', {
        count: response.data?.jobs?.length || 0,
        page: response.data?.page,
        totalPages: response.data?.pages,
      });
      return response;
    } catch (error) {
      console.error('❌ Failed to fetch jobs:', error.message);
      throw error;
    }
  },

  /**
   * Fetch single job by ID
   * Returns 404 if job doesn't exist or is inactive
   * IMPORTANT: On page refresh, vercel.json handles routing to /index.html
   * so the React Router can properly load the job ID
   */
  getJob: async (id) => {
    try {
      console.log('🔍 Fetching job with ID:', id);
      if (!id) {
        throw new Error('Job ID is required');
      }
      const response = await api.get(`/jobs/${id}`);
      console.log('✅ Single job fetched:', response.data?.title);
      return response;
    } catch (error) {
      if (error.response?.status === 404) {
        console.error('❌ Job not found or inactive:', id);
      } else {
        console.error('❌ Error fetching job:', error.message);
      }
      throw error;
    }
  },

  createJob: (jobData) => api.post('/jobs', jobData),
  updateJob: (id, jobData) => api.put(`/jobs/${id}`, jobData),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  getEmployerJobs: () => api.get('/jobs/employer/jobs'),
};

// ============================================
// APPLICATIONS API
// ============================================
export const applicationsAPI = {
  /**
   * Submit job application
   * resume is optional - can be a file upload or URL string
   */
  apply: (applicationData) => api.post('/applications', applicationData),
  getMyApplications: () => api.get('/applications/my'),
  getEmployerApplications: () => api.get('/applications/employer'),
  updateStatus: (id, status) => api.put(`/applications/${id}`, { status }),
};

export default api;