import { useRouter } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { validationUtils } from '../../lib/utils';
import { LoginForm, RegisterForm, User } from '../interfaces';
import { httpClient } from '../services/http.client';
import { useAuthStore } from '../store/auth.store';
import { useLogin, useLogout, useRegister, useUserProfile } from './api.hooks';

/**
 * Custom hook for authentication management
 * Handles login, register, logout, and user state using React Query
 */
export const useAuth = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logoutUser = useAuthStore((state) => state.logout);

  // React Query hooks
  const loginMutation = useLogin({
    onSuccess: (response) => {
      if (response.success && response.data) {
        const userData = response.data.user as User;
        setUser(userData);
        router.replace('/(tabs)');
      }
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });

  const registerMutation = useRegister({
    onSuccess: (response) => {
      if (response.success && response.data) {
        const userData = response.data.user as User;
        setUser(userData);
        router.replace('/(tabs)');
      }
    },
    onError: (error) => {
      console.error('Registration error:', error);
    },
  });

  const logoutMutation = useLogout({
    onSuccess: () => {
      logoutUser();
      httpClient.clearAuthTokens();
      router.replace('/welcome');
    },
    onError: (error) => {
      console.error('Logout error:', error);
      // Still logout locally even if API fails
      logoutUser();
      httpClient.clearAuthTokens();
      router.replace('/welcome');
    },
  });

  // Get user profile
  const { data: profileData, isLoading: isLoadingProfile } = useUserProfile();

  // Update user when profile data changes
  useEffect(() => {
    if (profileData?.success && profileData.data) {
      setUser(profileData.data);
    }
  }, [profileData, setUser]);

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

    return loginMutation.mutateAsync({
      email: credentials.email,
      password: credentials.password,
    });
  }, [loginMutation]);

  // Register function with validation
  const register = useCallback(async (userData: RegisterForm) => {
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

    if (userData.password !== userData.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (!userData.agreeToTerms) {
      throw new Error('You must agree to the terms and conditions');
    }

    return registerMutation.mutateAsync({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      confirmPassword: userData.confirmPassword,
      userType: userData.userType,
      agreeToTerms: userData.agreeToTerms,
    });
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

  return {
    user,
    isLoading: loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending || isLoadingProfile,
    error: loginMutation.error?.message || registerMutation.error?.message || logoutMutation.error?.message,
    login,
    register,
    logout,
    isAuthenticated,
    isFarmer,
    isExpert,
  };
};
