import { ImageInfo } from '../types';

// Image utility functions
export const imageUtils = {
  // Validate image file
  isValidImage: (file: ImageInfo): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    return (
      validTypes.includes(file.type) &&
      file.size <= maxSize &&
      file.width > 0 &&
      file.height > 0
    );
  },

  // Get image dimensions
  getImageDimensions: (uri: string): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = reject;
      img.src = uri;
    });
  },

  // Format file size
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Generate unique ID
  generateId: (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },
};

// Date utility functions
export const dateUtils = {
  // Format date for display
  formatDate: (date: Date | string): string => {
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) {
        return 'Invalid date';
      }
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(dateObj);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  },

  // Get relative time (e.g., "2 hours ago")
  getRelativeTime: (date: Date | string): string => {
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) {
        return 'Invalid date';
      }
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

      if (diffInSeconds < 60) return 'Just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;

      return dateUtils.formatDate(dateObj);
    } catch (error) {
      console.error('Error getting relative time:', error);
      return 'Invalid date';
    }
  },

  // Check if date is today
  isToday: (date: Date | string): boolean => {
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) {
        return false;
      }
      const today = new Date();
      return (
        dateObj.getDate() === today.getDate() &&
        dateObj.getMonth() === today.getMonth() &&
        dateObj.getFullYear() === today.getFullYear()
      );
    } catch (error) {
      console.error('Error checking if date is today:', error);
      return false;
    }
  },
};

// Validation utility functions
export const validationUtils = {
  // Validate email format
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate password strength
  isStrongPassword: (password: string): boolean => {
    return password.length >= 8;
  },

  // Validate required fields
  isRequired: (value: any): boolean => {
    return value !== null && value !== undefined && value !== '';
  },

  // Validate phone number
  isValidPhone: (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  },
};

// String utility functions
export const stringUtils = {
  // Capitalize first letter
  capitalize: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  // Truncate text with ellipsis
  truncate: (str: string, maxLength: number): string => {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength) + '...';
  },

  // Convert to title case
  toTitleCase: (str: string): string => {
    return str.replace(/\w\S*/g, (txt) =>
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  },

  // Remove special characters
  removeSpecialChars: (str: string): string => {
    return str.replace(/[^a-zA-Z0-9\s]/g, '');
  },
};

// Number utility functions
export const numberUtils = {
  // Format percentage
  formatPercentage: (value: number, decimals: number = 1): string => {
    return `${(value * 100).toFixed(decimals)}%`;
  },

  // Format currency
  formatCurrency: (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  },

  // Clamp number between min and max
  clamp: (value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max);
  },

  // Round to specified decimal places
  round: (value: number, decimals: number = 2): number => {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  },
};

// Color utility functions
export const colorUtils = {
  // Get severity color based on confidence level
  getSeverityColor: (confidence: number): string => {
    if (confidence >= 0.8) return '#ef4444'; // Red for high confidence
    if (confidence >= 0.6) return '#f59e0b'; // Yellow for medium confidence
    if (confidence >= 0.4) return '#3b82f6'; // Blue for low confidence
    return '#6b7280'; // Gray for very low confidence
  },

  // Get severity label
  getSeverityLabel: (confidence: number): string => {
    if (confidence >= 0.8) return 'Critical';
    if (confidence >= 0.6) return 'High';
    if (confidence >= 0.4) return 'Medium';
    return 'Low';
  },

  // Convert hex to rgba
  hexToRgba: (hex: string, alpha: number = 1): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },
};

// Storage utility functions
export const storageUtils = {
  // Save data to AsyncStorage
  saveData: async (key: string, value: any): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(value);
      // Note: This would need AsyncStorage import in actual implementation
      // await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  },

  // Load data from AsyncStorage
  loadData: async (key: string): Promise<any> => {
    try {
      // Note: This would need AsyncStorage import in actual implementation
      // const jsonValue = await AsyncStorage.getItem(key);
      // return jsonValue != null ? JSON.parse(jsonValue) : null;
      return null;
    } catch (error) {
      console.error('Error loading data:', error);
      return null;
    }
  },

  // Remove data from AsyncStorage
  removeData: async (key: string): Promise<void> => {
    try {
      // Note: This would need AsyncStorage import in actual implementation
      // await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data:', error);
    }
  },
};
