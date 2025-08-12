import { networkUtils } from '../utils/network.utils';

// Mock React Native Platform
jest.mock('react-native', () => ({
  Platform: {
    OS: 'android',
  },
}));

describe('NetworkUtils', () => {
  describe('getBestBaseURL', () => {
    it('should return correct URL for development environment', () => {
      const baseURL = networkUtils.getBestBaseURL();

      // In development, should return local network IP for Android
      if (__DEV__) {
        expect(baseURL).toContain('192.168.18.78:3000');
      } else {
        expect(baseURL).toBe('https://api.cropdisease.com/v1');
      }
    });

    it('should return production URL for non-development environment', () => {
      // Mock __DEV__ to false
      const originalDev = (global as any).__DEV__;
      (global as any).__DEV__ = false;

      const baseURL = networkUtils.getBestBaseURL();
      expect(baseURL).toBe('https://api.cropdisease.com/v1');

      // Restore original value
      (global as any).__DEV__ = originalDev;
    });
  });

  describe('getNetworkInfo', () => {
    it('should return network information object', () => {
      const networkInfo = networkUtils.getNetworkInfo();

      expect(networkInfo).toHaveProperty('platform');
      expect(networkInfo).toHaveProperty('isDevelopment');
      expect(networkInfo).toHaveProperty('currentBaseURL');
      expect(networkInfo).toHaveProperty('nodeEnv');

      expect(typeof (networkInfo as any).platform).toBe('string');
      expect(typeof (networkInfo as any).isDevelopment).toBe('boolean');
      expect(typeof (networkInfo as any).currentBaseURL).toBe('string');
    });
  });
});
