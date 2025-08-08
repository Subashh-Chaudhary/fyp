// API Configuration
export const API_CONFIG = {
  // Base configuration
  BASE_URL: 'https://api.cropdisease.com/v1',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second

  // Headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
} as const;

// API endpoints
export const API_ENDPOINTS = {
  BASE_URL: API_CONFIG.BASE_URL,
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
} as const;

// Storage keys
export const STORAGE_KEYS = {
  USER_TOKEN: 'user_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  FIRST_LAUNCH: 'first_launch',
  SCAN_HISTORY: 'scan_history',
} as const;
