// App constants
export const APP_NAME = 'Crop Disease Detection System';
export const APP_VERSION = '1.0.0';

// Route names
export const ROUTES = {
  WELCOME: '/welcome',
  HOME: '/(tabs)/',
  FEED: '/(tabs)/feed',
  SCAN: '/(tabs)/scan',
  HISTORY: '/(tabs)/history',
  SETTINGS: '/(tabs)/settings',
  RESULT: '/result',
} as const;

// Colors
export const COLORS = {
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  secondary: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#eab308',
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
  },
  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
} as const;

// Font sizes
export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const;

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

// Border radius
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
} as const;

// Screen dimensions
export const SCREEN = {
  width: 375, // Default iPhone width
  height: 812, // Default iPhone height
} as const;

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

// Disease severity levels
export const DISEASE_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

// User types
export const USER_TYPES = {
  FARMER: 'farmer',
  EXPERT: 'expert',
} as const;

// Scan status
export const SCAN_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

// Image quality settings
export const IMAGE_SETTINGS = {
  MAX_WIDTH: 1024,
  MAX_HEIGHT: 1024,
  QUALITY: 0.8,
  FORMAT: 'jpeg',
} as const;
