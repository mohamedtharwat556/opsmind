/**
 * API Client - Centralized API calls
 * Uses VITE_API_URL from environment variables
 * Includes retry logic for failed requests
 */

const API_URL = import.meta.env.VITE_API_URL || 'https://opsmind-production-d78a.up.railway.app';

// Helper function to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Check if a request should be retried
 * @param {Error} error - The error from the request
 * @param {number} attempt - Current attempt number
 * @param {number} maxRetries - Maximum number of retries
 * @returns {boolean} Whether to retry the request
 */
const shouldRetry = (error, attempt, maxRetries) => {
  // Don't retry if we've exceeded max retries
  if (attempt >= maxRetries) return false;

  // Retry on network errors or 5xx status codes
  const isNetworkError = !error.response;
  const isServerError = error.response && error.response.status >= 500;
  const isRetryableStatus = error.response && [429, 500, 502, 503, 504].includes(error.response.status);

  return isNetworkError || isServerError || isRetryableStatus;
};

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

  /**
   * Make a request to the API
   * @param {string} endpoint - The API endpoint
   * @param {object} options - Request options
   * @param {string} options.method - HTTP method
   * @param {any} options.body - Request body
   * @param {boolean} options.includeAuth - Whether to include auth token
   * @param {number} options.maxRetries - Maximum number of retries (default: 3)
   * @param {number} options.retryDelay - Delay between retries in ms (default: 1000)
   * @returns {Promise<any>} The response data
   */
  async request(endpoint, options = {}) {
    const {
      method = 'GET',
      body = null,
      includeAuth = true,
      maxRetries = 3,
      retryDelay = 1000,
      ...restOptions
    } = options;

    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
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

        const response = await fetch(url, config);
        
        if (!response.ok) {
          if (response.status === 401) {
            // Unauthorized - clear token and redirect
            localStorage.removeItem('token');
            window.location.href = '/login';
          }
          // Create error with response info
          const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
          error.response = response;
          throw error;
        }

        return await response.json();
      } catch (error) {
        lastError = error;
        console.error(`API Error (attempt ${attempt + 1}/${maxRetries + 1}):`, error);

        // Check if we should retry
        if (shouldRetry(error, attempt, maxRetries)) {
          // Exponential backoff
          const delayMs = retryDelay * Math.pow(2, attempt);
          console.log(`Retrying in ${delayMs}ms...`);
          await delay(delayMs);
          continue;
        }

        // If we shouldn't retry, throw the error
        break;
      }
    }

    // If we've exhausted all retries, throw the last error
    throw lastError;
  },

  // Shortcut methods
  get: (endpoint, options = {}) => apiClient.request(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body, options = {}) => apiClient.request(endpoint, { method: 'POST', body, ...options }),
  put: (endpoint, body, options = {}) => apiClient.request(endpoint, { method: 'PUT', body, ...options }),
  delete: (endpoint, options = {}) => apiClient.request(endpoint, { method: 'DELETE', ...options }),
};

export default apiClient;
