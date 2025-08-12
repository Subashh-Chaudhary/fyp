// Color system for the app
export const colors = {
  // Primary colors
  primary: '#007AFF',
  primaryDark: '#0056CC',
  primaryLight: '#4DA3FF',

  // Secondary colors
  secondary: '#5856D6',
  secondaryDark: '#3634A3',
  secondaryLight: '#7A79E0',

  // Success colors
  success: '#34C759',
  successDark: '#28A745',
  successLight: '#5CDB7F',

  // Warning colors
  warning: '#FF9500',
  warningDark: '#E6850E',
  warningLight: '#FFB340',

  // Error colors
  error: '#FF3B30',
  errorDark: '#DC3545',
  errorLight: '#FF6B6B',

  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Semantic colors
  background: '#FFFFFF',
  backgroundSecondary: '#F9FAFB',
  text: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  border: '#E5E7EB',
  borderSecondary: '#F3F4F6',

  // Status colors
  info: '#007AFF',
  infoBackground: '#E3F2FD',
  successBackground: '#E8F5E8',
  warningBackground: '#FFF3E0',
  errorBackground: '#FFEBEE',

  // Overlay colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.1)',

  // Shadow colors
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowLight: 'rgba(0, 0, 0, 0.05)',
} as const;

// Dark theme colors
export const darkColors = {
  ...colors,
  background: '#111827',
  backgroundSecondary: '#1F2937',
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textTertiary: '#9CA3AF',
  border: '#374151',
  borderSecondary: '#4B5563',
} as const;

// Export color types
export type ColorScheme = typeof colors;
export type ColorKey = keyof typeof colors;
