/**
 * API Client - Centralized API calls
 * Uses VITE_API_URL from environment variables
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiClient = {
  // Get token from localStorage
  getToken: () => localStorage.getItem('token'),

  // Get headers with auth
  getHeaders: (includeAuth = true) => {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (includeAuth) {
      const token = apiClient.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  },

  // Make request
  async request(endpoint, options = {}) {
    const {
      method = 'GET',
      body = null,
      includeAuth = true,
      ...restOptions
    } = options;

    const url = `${API_URL}${endpoint}`;
    const headers = apiClient.getHeaders(includeAuth);

    const config = {
      method,
      headers,
      ...restOptions,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Unauthorized - clear token and redirect
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Shortcut methods
  get: (endpoint) => apiClient.request(endpoint, { method: 'GET' }),
  post: (endpoint, body) => apiClient.request(endpoint, { method: 'POST', body }),
  put: (endpoint, body) => apiClient.request(endpoint, { method: 'PUT', body }),
  delete: (endpoint) => apiClient.request(endpoint, { method: 'DELETE' }),
};

export default apiClient;
