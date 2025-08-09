import { API_CONFIG, API_ENDPOINTS, ERROR_MESSAGES, STATUS_CODES } from '../../constants';

// Re-export constants for backward compatibility
export { API_CONFIG, API_ENDPOINTS, ERROR_MESSAGES, STATUS_CODES };

// Environment-specific configuration
export const getApiConfig = () => {
  const isDevelopment = __DEV__;

  return {
    ...API_CONFIG,
    BASE_URL: isDevelopment
      ? 'http://localhost:3000/api' // Development - backend runs on port 3000
      : API_CONFIG.BASE_URL, // Production
    TIMEOUT: isDevelopment ? 10000 : API_CONFIG.TIMEOUT,
  };
};
