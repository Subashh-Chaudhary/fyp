// Network configuration for different development environments
// Modify these values based on your setup

export const NETWORK_CONFIG = {
  // Your computer's local IP address on your network
  // Find this by running: ip route get 1.1.1.1 | awk '{print $7}' | head -1
  LOCAL_IP: '192.168.18.78',

  // Backend port
  BACKEND_PORT: 3000,

  // Development URLs for different platforms
  DEVELOPMENT_URLS: {
    // For physical devices using Expo Go
    PHYSICAL_DEVICE: 'http://192.168.18.78:3000',

    // For Android emulator
    ANDROID_EMULATOR: 'http://10.0.2.2:3000',

    // For iOS simulator
    IOS_SIMULATOR: 'http://localhost:3000',

    // For web development
    WEB: 'http://localhost:3000',
  },

  // Production URL
  PRODUCTION_URL: 'https://api.cropdisease.com/v1',

  // Timeout settings
  TIMEOUTS: {
    DEVELOPMENT: 10000, // 10 seconds
    PRODUCTION: 30000,  // 30 seconds
  },
} as const;

// Helper function to get the full backend URL
export const getBackendURL = (): string => {
  const isDevelopment = __DEV__;

  if (!isDevelopment) {
    return NETWORK_CONFIG.PRODUCTION_URL;
  }

  // You can modify this logic based on your needs
  // For now, it returns the physical device URL for Android
  return NETWORK_CONFIG.DEVELOPMENT_URLS.PHYSICAL_DEVICE;
};

// Helper function to get timeout
export const getTimeout = (): number => {
  const isDevelopment = __DEV__;
  return isDevelopment ? NETWORK_CONFIG.TIMEOUTS.DEVELOPMENT : NETWORK_CONFIG.TIMEOUTS.PRODUCTION;
};
