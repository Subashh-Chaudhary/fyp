import { API_ENDPOINTS } from '../../constants';

// API Configuration
export const API_CONFIG = {
  // Base configuration
  BASE_URL: API_ENDPOINTS.BASE_URL,
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second

  // Headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },

  // Endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      VERIFY_EMAIL: '/auth/verify-email',
    },
    USER: {
      PROFILE: '/user/profile',
      UPDATE_PROFILE: '/user/profile',
      CHANGE_PASSWORD: '/user/change-password',
      DELETE_ACCOUNT: '/user/delete-account',
    },
    SCAN: {
      UPLOAD: '/scan/upload',
      RESULT: '/scan/result',
      HISTORY: '/scan/history',
      DELETE: '/scan/delete',
      BATCH_UPLOAD: '/scan/batch-upload',
    },
    CROPS: {
      LIST: '/crops',
      DETAIL: '/crops/:id',
      SEARCH: '/crops/search',
    },
    DISEASES: {
      LIST: '/diseases',
      DETAIL: '/diseases/:id',
      BY_CROP: '/diseases/crop/:cropId',
      SEARCH: '/diseases/search',
    },
    ANALYTICS: {
      DASHBOARD: '/analytics/dashboard',
      SCAN_STATS: '/analytics/scan-stats',
      CROP_STATS: '/analytics/crop-stats',
    },
  },

  // Response codes
  STATUS_CODES: {
    SUCCESS: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
  },

  // Error messages
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    TIMEOUT_ERROR: 'Request timeout. Please try again.',
    UNAUTHORIZED: 'Unauthorized access. Please login again.',
    FORBIDDEN: 'Access forbidden. You don\'t have permission.',
    NOT_FOUND: 'Resource not found.',
    SERVER_ERROR: 'Server error. Please try again later.',
    UNKNOWN_ERROR: 'An unknown error occurred.',
  },
} as const;

// Environment-specific configuration
export const getApiConfig = () => {
  const isDevelopment = __DEV__;

  return {
    ...API_CONFIG,
    BASE_URL: isDevelopment
      ? 'http://localhost:3000/api/v1' // Development
      : API_CONFIG.BASE_URL, // Production
    TIMEOUT: isDevelopment ? 10000 : API_CONFIG.TIMEOUT,
  };
};
