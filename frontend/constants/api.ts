// API endpoints
export const API_ENDPOINTS = {
  BASE_URL: 'https://api.cropdisease.com/v1',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  SCAN: {
    UPLOAD: '/scan/upload',
    RESULT: '/scan/result',
    HISTORY: '/scan/history',
  },
  CROPS: '/crops',
  DISEASES: '/diseases',
} as const;

// Storage keys
export const STORAGE_KEYS = {
  USER_TOKEN: 'user_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  FIRST_LAUNCH: 'first_launch',
  SCAN_HISTORY: 'scan_history',
} as const;
