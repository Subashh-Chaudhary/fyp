import { API_CONFIG, API_ENDPOINTS, ERROR_MESSAGES, STATUS_CODES } from '../../constants';
import { networkUtils } from '../utils/network.utils';

// Re-export constants for backward compatibility
export { API_CONFIG, API_ENDPOINTS, ERROR_MESSAGES, STATUS_CODES };

// Environment-specific configuration
export const getApiConfig = () => {
  const isDevelopment = __DEV__;

  // Use network utility to get the best base URL
  const baseURL = networkUtils.getBestBaseURL();
  const timeout = networkUtils.getTimeout();

  // Debug logging for development
  if (isDevelopment) {
    console.log('🔧 API Config:', networkUtils.getNetworkInfo());
  }

  return {
    ...API_CONFIG,
    BASE_URL: baseURL,
    TIMEOUT: timeout,
  };
};
