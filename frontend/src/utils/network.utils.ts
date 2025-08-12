import { Platform } from 'react-native';

import { NETWORK_CONFIG, getTimeout } from '../config/network.config';

// Simple network configuration for physical devices
export class NetworkUtils {
  private static instance: NetworkUtils;
  private currentBaseURL: string = '';

  private constructor() {}

  static getInstance(): NetworkUtils {
    if (!NetworkUtils.instance) {
      NetworkUtils.instance = new NetworkUtils();
    }
    return NetworkUtils.instance;
  }

  // Get the best base URL for the current platform and setup
  getBestBaseURL(): string {
    const isDevelopment = __DEV__;

    if (!isDevelopment) {
      return NETWORK_CONFIG.PRODUCTION_URL;
    }

    switch (Platform.OS) {
      case 'android':
        // For physical devices, use local network IP
        // For emulators, use 10.0.2.2
        return NETWORK_CONFIG.DEVELOPMENT_URLS.PHYSICAL_DEVICE;
      case 'ios':
        // iOS simulator can use localhost
        return NETWORK_CONFIG.DEVELOPMENT_URLS.IOS_SIMULATOR;
      case 'web':
        // Web can use localhost
        return NETWORK_CONFIG.DEVELOPMENT_URLS.WEB;
      default:
        return NETWORK_CONFIG.DEVELOPMENT_URLS.PHYSICAL_DEVICE;
    }
  }

  // Test if the current base URL is working
  async testCurrentURL(): Promise<boolean> {
    const url = this.getBestBaseURL();

    try {
      const response = await fetch(`${url}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'test',
          email: `test.${Date.now()}@example.com`,
          password: 'password123',
          confirm_password: 'password123',
          user_type: 'farmer',
        }),
      });

      // If we get any response (even an error), the endpoint is reachable
      return response.status > 0;
    } catch (error) {
      console.log(`❌ Network test failed for ${url}:`, error);
      return false;
    }
  }

  // Get network info for debugging
  getNetworkInfo(): object {
    return {
      platform: Platform.OS,
      isDevelopment: __DEV__,
      currentBaseURL: this.getBestBaseURL(),
      nodeEnv: process.env.NODE_ENV,
      networkConfig: NETWORK_CONFIG,
    };
  }

  // Get timeout for current environment
  getTimeout(): number {
    return getTimeout();
  }
}

// Export singleton instance
export const networkUtils = NetworkUtils.getInstance();
