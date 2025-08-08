import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { apiClient } from '../lib/api';
import { validationUtils } from '../lib/utils';
import { LoginForm, RegisterForm, User } from '../src/interfaces';
import { useAuthStore } from '../src/store/auth.store';

/**
 * Custom hook for authentication management
 * Handles login, register, logout, and user state
 */
export const useAuth = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logoutUser = useAuthStore((state) => state.logout);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login function
  const login = useCallback(async (credentials: LoginForm) => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate email
      if (!validationUtils.isValidEmail(credentials.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Validate password
      if (!validationUtils.isRequired(credentials.password)) {
        throw new Error('Password is required');
      }

      const response = await apiClient.login(credentials.email, credentials.password);

      if (!response.success || !response.data) {
        throw new Error(typeof response.error === 'string' ? response.error : 'Login failed');
      }

      // Set user data and token
      const userData = response.data.user as User;
      const token = response.data.token as string;

      setUser(userData);
      apiClient.setToken(token);

      // Navigate to main app
      router.replace('/(tabs)');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setUser, router]);

  // Register function
  const register = useCallback(async (userData: RegisterForm) => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate form data
      if (!validationUtils.isRequired(userData.name)) {
        throw new Error('Name is required');
      }

      if (!validationUtils.isValidEmail(userData.email)) {
        throw new Error('Please enter a valid email address');
      }

      if (!validationUtils.isStrongPassword(userData.password)) {
        throw new Error('Password must be at least 8 characters long');
      }

      if (!['farmer', 'expert'].includes(userData.userType)) {
        throw new Error('Please select a valid user type');
      }

      const response = await apiClient.register(
        userData.name,
        userData.email,
        userData.password,
        userData.userType
      );

      if (!response.success || !response.data) {
        throw new Error(typeof response.error === 'string' ? response.error : 'Registration failed');
      }

      // Set user data and token
      const newUser = response.data.user as User;
      const token = response.data.token as string;

      setUser(newUser);
      apiClient.setToken(token);

      // Navigate to main app
      router.replace('/(tabs)');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setUser, router]);

  // Logout function
  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Call logout API
      await apiClient.logout();
    } catch (err) {
      console.error('Logout API error:', err);
    } finally {
      // Clear local state regardless of API response
      logoutUser();
      apiClient.setToken(null);

      // Navigate to welcome screen
      router.replace('/welcome');
      setIsLoading(false);
    }
  }, [logoutUser, router]);

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    return user !== null;
  }, [user]);

  // Check if user is a farmer
  const isFarmer = useCallback(() => {
    return user?.userType === 'farmer';
  }, [user]);

  // Check if user is an expert
  const isExpert = useCallback(() => {
    return user?.userType === 'expert';
  }, [user]);

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
    isFarmer,
    isExpert,
  };
};
