import axios from 'axios';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: 'https://dev.travelogger.info/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false,
  timeout: 500000,
  retry: 3,
  retryDelay: 1000
});

// Add retry interceptor
axiosInstance.interceptors.response.use(null, async error => {
  const { config, response } = error;

  // If config not found or retries not set, reject
  if (!config || !config.retry) {
    return Promise.reject(error);
  }

  // If response is present and status is not 5xx, reject immediately
  if (response && (response.status < 500 || response.status >= 600)) {
    return Promise.reject(error);
  }

  config.retryCount = config.retryCount || 0;

  if (config.retryCount >= config.retry) {
    // If max retries exceeded
    if (!response) {
      return Promise.reject(new Error(
        'Unable to connect to the server. Please check if the server is running and try again.'
      ));
    }
    return Promise.reject(error);
  }

  config.retryCount += 1;
  console.log(`Retrying request (${config.retryCount}/${config.retry})...`);

  // Wait before retrying
  await new Promise(resolve => setTimeout(resolve, config.retryDelay));
  return axiosInstance(config);
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
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
    console.log('Response:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Response Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        message: 'Unable to connect to the server. Please check if the server is running and try again.'
      });
    }

    // Return full error data for 4XX client errors
    if (error.response.status >= 400 && error.response.status < 500) {
      return Promise.reject(error.response);
    }

    // Return full error data for 5XX errors (non-retriable or after retries exhausted)
    return Promise.reject({
      message:
        error.response.data?.message ||
        'An unexpected server error occurred. Please try again later.',
      status: error.response.status,
      data: error.response.data
    });
  }
);


export default axiosInstance;
