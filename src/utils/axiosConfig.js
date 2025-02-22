import axios from 'axios';

// Create axios instance with default config
const axiosInstance = axios.create({
  // baseURL: 'http://travelogger-backend.eba-2i3kpbc5.us-east-1.elasticbeanstalk.com/api', // Base URL for all requests
  baseURL: 'http://localhost:5051/api', // Base URL for all requests
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false, // Disable CORS credentials
  timeout: 10000,
  // Add retry configuration
  retry: 3,
  retryDelay: 1000
});

// Add retry interceptor
axiosInstance.interceptors.response.use(null, async error => {
  const { config } = error;
  if (!config || !config.retry) {
    return Promise.reject(error);
  }

  config.retryCount = config.retryCount || 0;

  if (config.retryCount >= config.retry) {
    // If we've maxed out retries, check if it's a network error
    if (!error.response) {
      return Promise.reject(new Error(
        'Unable to connect to the server. Please check if the server is running and try again.'
      ));
    }
    return Promise.reject(error);
  }

  config.retryCount += 1;
  console.log(`Retrying request (${config.retryCount}/${config.retry})...`);

  // Delay before retrying
  await new Promise(resolve => setTimeout(resolve, config.retryDelay));
  return axiosInstance(config);
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Log outgoing requests for debugging
    console.log('Request:', {
      method: config.method,
      url: config.url,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful responses for debugging
    console.log('Response:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    // Log error responses with full details
    console.error('Response Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    // Handle network errors with a user-friendly message
    if (!error.response) {
      return Promise.reject(new Error(
        'Unable to connect to the server. Please check if the server is running and try again.'
      ));
    }

    // Handle specific error cases
    switch (error.response.status) {
      case 400:
        return Promise.reject(new Error(error.response.data.message || 'Invalid request. Please check your data.'));
      
      case 401:
        localStorage.removeItem('user');
        return Promise.reject(new Error('Authentication failed. Please sign in again.'));
      
      case 403:
        return Promise.reject(new Error('You do not have permission to perform this action.'));
      
      case 404:
        return Promise.reject(new Error('The requested resource was not found.'));
      
      case 409:
        return Promise.reject(new Error('This email is already registered.'));
      
      case 422:
        const errors = error.response.data.errors;
        if (errors) {
          const errorMessage = Object.entries(errors)
            .map(([key, value]) => `${key} ${value.join(', ')}`)
            .join('; ');
          return Promise.reject(new Error(errorMessage));
        }
        return Promise.reject(new Error('Invalid data provided. Please check your input.'));
      
      case 500:
        return Promise.reject(new Error('Server error. Please try again later.'));
      
      case 502:
      case 503:
      case 504:
        return Promise.reject(new Error('Server is temporarily unavailable. Please try again later.'));
      
      default:
        return Promise.reject(new Error(error.response.data.message || 'An error occurred. Please try again.'));
    }
  }
);

export default axiosInstance;