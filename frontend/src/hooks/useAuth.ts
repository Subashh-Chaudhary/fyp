import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { validationUtils } from '../../lib/utils';
import { LoginForm, RegisterForm } from '../interfaces';
import { httpClient } from '../services/http.client';
import { useAuthStore } from '../store/auth.store';
import { useLogin, useLogout, useRegister } from './api.hooks';

/**
 * Custom hook for authentication management
 * Handles login, register, and logout using React Query
 */
export const useAuth = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logoutUser = useAuthStore((state) => state.logout);

  // Get auth store actions
  const setAuth = useAuthStore((state) => state.setAuth);

  // React Query hooks
  const loginMutation = useLogin({
    onSuccess: (response) => {
      setAuth(response);
      router.replace('/(tabs)');
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });

  const registerMutation = useRegister({
    onSuccess: (response) => {
      setAuth(response);
      router.replace('/(tabs)');
    },
    onError: (error: any) => {
      console.error('Registration error:', error);
      // Extract user-friendly error message
      const errorMessage = error.message || error.apiError?.message || 'Registration failed. Please try again.';
      console.error('User-friendly error message:', errorMessage);
    },
  });

  const logoutMutation = useLogout({
    onSuccess: () => {
      logoutUser();
      httpClient.clearAuthToken();
      router.replace('/welcome');
    },
    onError: (error) => {
      console.error('Logout error:', error);
      // Still logout locally even if API fails
      logoutUser();
      httpClient.clearAuthToken();
      router.replace('/welcome');
    },
  });

  // Login function with validation
  const login = useCallback(async (credentials: LoginForm) => {
    // Validate email
    if (!validationUtils.isValidEmail(credentials.email)) {
      throw new Error('Please enter a valid email address');
    }

    // Validate password
    if (!validationUtils.isRequired(credentials.password)) {
      throw new Error('Password is required');
    }

    try {
      return await loginMutation.mutateAsync({
        email: credentials.email,
        password: credentials.password,
      });
    } catch (error: any) {
      // Handle specific error cases
      if (error.message?.includes('invalid credentials') || error.message?.includes('wrong password')) {
        throw new Error('Invalid email or password. Please check your credentials and try again.');
      } else if (error.message?.includes('user not found')) {
        throw new Error('No account found with this email. Please check your email or create a new account.');
      } else if (error.message?.includes('network') || error.message?.includes('connection')) {
        throw new Error('Network connection error. Please check your internet connection and try again.');
      } else if (error.message?.includes('timeout')) {
        throw new Error('Request timed out. Please try again.');
      }
      // Re-throw the error with the original message
      throw error;
    }
  }, [loginMutation]);

  // Register function with validation
  const register = useCallback(async (userData: RegisterForm) => {
    console.log("userData", userData);
    console.log("registerMutation");
    try {
      return await registerMutation.mutateAsync({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        confirm_password: userData.confirm_password,
        user_type: userData.user_type,
      });
    } catch (error: any) {
      // Handle specific error cases
      if (error.message?.includes('already exists')) {
        throw new Error(`A user with this email already exists. Please try with a different email address.`);
      } else if (error.message?.includes('validation') || error.message?.includes('invalid')) {
        throw new Error(`Please check your input and try again. ${error.message}`);
      } else if (error.message?.includes('network') || error.message?.includes('connection')) {
        throw new Error(`Network connection error. Please check your internet connection and try again.`);
      } else if (error.message?.includes('timeout')) {
        throw new Error(`Request timed out. Please try again.`);
      }
      // Re-throw the error with the original message
      throw error;
    }
  }, [registerMutation]);

  // Logout function
  const logout = useCallback(async () => {
    return logoutMutation.mutateAsync();
  }, [logoutMutation]);

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

  // Helper function to extract user-friendly error message
  const getErrorMessage = useCallback((mutation: any) => {
    if (!mutation.error) return null;

    // Try to get the most user-friendly error message
    const error = mutation.error as any;
    return error.message || error.apiError?.message || 'An error occurred. Please try again.';
  }, []);

  return {
    user,
    isLoading: loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
    error: getErrorMessage(loginMutation) || getErrorMessage(registerMutation) || getErrorMessage(logoutMutation),
    login,
    register,
    logout,
    isAuthenticated,
    isFarmer,
    isExpert,
  };
};
