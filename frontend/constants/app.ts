// App constants
export const APP_NAME = 'Crop Disease Detection System';
export const APP_VERSION = '1.0.0';

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
