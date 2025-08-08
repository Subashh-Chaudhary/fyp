import { create } from 'zustand';
import { User } from '../interfaces';
import { AuthResponse } from '../interfaces/api.types';
import { AuthState } from '../interfaces/auth.types';
import { AuthSecureStorage } from '../utils/secureStorage';

// Create Auth Store
export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial State
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Actions
  setAuth: async (authData: AuthResponse) => {
    try {
      // Store tokens securely
      await AuthSecureStorage.storeTokens(authData.token, authData.refreshToken);

      // Store user data securely
      await AuthSecureStorage.storeUserData(JSON.stringify(authData.user));

      // Update state
      set({
        user: authData.user,
        token: authData.token,
        refreshToken: authData.refreshToken,
        isAuthenticated: true,
        error: null,
      });
    } catch (error) {
      console.error('Failed to store auth data securely:', error);
      set({ error: 'Failed to store authentication data securely' });
    }
  },

  setUser: async (user: User) => {
    try {
      // Store user data securely
      await AuthSecureStorage.storeUserData(JSON.stringify(user));

      // Update state
      set({ user });
    } catch (error) {
      console.error('Failed to store user data securely:', error);
      set({ error: 'Failed to store user data securely' });
    }
  },

  setToken: async (token: string) => {
    try {
      const { refreshToken } = get();
      if (refreshToken) {
        // Store tokens securely
        await AuthSecureStorage.storeTokens(token, refreshToken);
      }

      // Update state
      set({ token });
    } catch (error) {
      console.error('Failed to store token securely:', error);
      set({ error: 'Failed to store token securely' });
    }
  },

  setRefreshToken: async (refreshToken: string) => {
    try {
      const { token } = get();
      if (token) {
        // Store tokens securely
        await AuthSecureStorage.storeTokens(token, refreshToken);
      }

      // Update state
      set({ refreshToken });
    } catch (error) {
      console.error('Failed to store refresh token securely:', error);
      set({ error: 'Failed to store refresh token securely' });
    }
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  logout: async () => {
    try {
      // Clear all auth data from secure storage
      await AuthSecureStorage.clearAuthData();

      // Update state
      set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        error: null,
      });
    } catch (error) {
      console.error('Failed to clear auth data securely:', error);
      // Still update state even if secure storage fails
      set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        error: null,
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  // Initialize auth state from secure storage
  initializeAuth: async () => {
    try {
      set({ isLoading: true });

      // Get tokens from secure storage
      const { token, refreshToken } = await AuthSecureStorage.getTokens();

      // Get user data from secure storage
      const userDataString = await AuthSecureStorage.getUserData();
      const user = userDataString ? JSON.parse(userDataString) : null;

      // Update state if we have valid data
      if (token && refreshToken && user) {
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('Failed to initialize auth from secure storage:', error);
      set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Failed to load authentication data',
      });
    }
  },
}));
