import * as SecureStore from 'expo-secure-store';

// Secure Storage Keys
export const SECURE_STORAGE_KEYS = {
  USER_TOKEN: 'user_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
} as const;

// Secure Storage Utility Class
export class SecureStorage {
  // Store a value securely
  static async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(`Failed to store ${key} securely:`, error);
      throw error;
    }
  }

  // Retrieve a value securely
  static async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(`Failed to retrieve ${key} securely:`, error);
      return null;
    }
  }

  // Delete a value securely
  static async deleteItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`Failed to delete ${key} securely:`, error);
      throw error;
    }
  }

  // Store multiple items securely
  static async setMultipleItems(items: Record<string, string>): Promise<void> {
    try {
      const promises = Object.entries(items).map(([key, value]) =>
        SecureStore.setItemAsync(key, value)
      );
      await Promise.all(promises);
    } catch (error) {
      console.error('Failed to store multiple items securely:', error);
      throw error;
    }
  }

  // Retrieve multiple items securely
  static async getMultipleItems(keys: string[]): Promise<Record<string, string | null>> {
    try {
      const promises = keys.map(key => SecureStore.getItemAsync(key));
      const values = await Promise.all(promises);

      const result: Record<string, string | null> = {};
      keys.forEach((key, index) => {
        result[key] = values[index];
      });

      return result;
    } catch (error) {
      console.error('Failed to retrieve multiple items securely:', error);
      return {};
    }
  }

  // Delete multiple items securely
  static async deleteMultipleItems(keys: string[]): Promise<void> {
    try {
      const promises = keys.map(key => SecureStore.deleteItemAsync(key));
      await Promise.all(promises);
    } catch (error) {
      console.error('Failed to delete multiple items securely:', error);
      throw error;
    }
  }

  // Clear all secure storage
  static async clearAll(): Promise<void> {
    try {
      const allKeys = Object.values(SECURE_STORAGE_KEYS);
      await this.deleteMultipleItems(allKeys);
    } catch (error) {
      console.error('Failed to clear secure storage:', error);
      throw error;
    }
  }

  // Check if secure storage is available
  static async isAvailable(): Promise<boolean> {
    try {
      const testKey = 'test_availability';
      const testValue = 'test';

      await SecureStore.setItemAsync(testKey, testValue);
      const retrieved = await SecureStore.getItemAsync(testKey);
      await SecureStore.deleteItemAsync(testKey);

      return retrieved === testValue;
    } catch (error) {
      console.error('Secure storage is not available:', error);
      return false;
    }
  }
}

// Auth-specific secure storage methods
export class AuthSecureStorage {
  // Store authentication tokens
  static async storeTokens(token: string, refreshToken: string): Promise<void> {
    try {
      await SecureStorage.setMultipleItems({
        [SECURE_STORAGE_KEYS.USER_TOKEN]: token,
        [SECURE_STORAGE_KEYS.REFRESH_TOKEN]: refreshToken,
      });
    } catch (error) {
      console.error('Failed to store auth tokens:', error);
      throw error;
    }
  }

  // Retrieve authentication tokens
  static async getTokens(): Promise<{ token: string | null; refreshToken: string | null }> {
    try {
      const items = await SecureStorage.getMultipleItems([
        SECURE_STORAGE_KEYS.USER_TOKEN,
        SECURE_STORAGE_KEYS.REFRESH_TOKEN,
      ]);

      return {
        token: items[SECURE_STORAGE_KEYS.USER_TOKEN],
        refreshToken: items[SECURE_STORAGE_KEYS.REFRESH_TOKEN],
      };
    } catch (error) {
      console.error('Failed to retrieve auth tokens:', error);
      return { token: null, refreshToken: null };
    }
  }

  // Store user data
  static async storeUserData(userData: string): Promise<void> {
    try {
      await SecureStorage.setItem(SECURE_STORAGE_KEYS.USER_DATA, userData);
    } catch (error) {
      console.error('Failed to store user data:', error);
      throw error;
    }
  }

  // Retrieve user data
  static async getUserData(): Promise<string | null> {
    try {
      return await SecureStorage.getItem(SECURE_STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error('Failed to retrieve user data:', error);
      return null;
    }
  }

  // Clear all auth data
  static async clearAuthData(): Promise<void> {
    try {
      await SecureStorage.deleteMultipleItems([
        SECURE_STORAGE_KEYS.USER_TOKEN,
        SECURE_STORAGE_KEYS.REFRESH_TOKEN,
        SECURE_STORAGE_KEYS.USER_DATA,
      ]);
    } catch (error) {
      console.error('Failed to clear auth data:', error);
      throw error;
    }
  }
}
