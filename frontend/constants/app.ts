// App constants
export const APP_NAME = 'Crop Disease Detection System';
export const APP_VERSION = '1.0.0';

// Extended app/company info for informational screens
export const COMPANY_NAME = 'AgriVision Labs';
export const COMPANY_LOCATION = 'Kathmandu, Nepal';
export const SUPPORT_EMAIL = 'support@agrivision.example';
export const SUPPORT_PHONE = '+977-1-5551234';
export const COPYRIGHT_NOTICE = `© ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.`;
export const APP_TAGLINE = 'Early crop disease detection powered by AI.';
export const DATA_RETENTION_DAYS = 30; // Default temporary image retention window

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
