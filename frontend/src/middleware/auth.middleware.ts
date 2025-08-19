import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

import { useAuthStore } from '../store/auth.store';

// Auth middleware hook
export const useAuthMiddleware = () => {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, user, token } = useAuthStore();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';

    // If user is not authenticated and not in auth group, redirect to login
    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
      return;
    }

    // If user is authenticated and in auth group, redirect to home
    if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
      return;
    }

    // If user is authenticated and has a token, ensure they're in the right place
    if (isAuthenticated && token && !inTabsGroup && !inAuthGroup) {
      router.replace('/(tabs)');
      return;
    }
  }, [isAuthenticated, segments, router, user, token]);
};

// Route protection hook
export const useRouteProtection = (requiredAuth: boolean = true) => {
  const { isAuthenticated, isLoading, token } = useAuthStore();

  if (requiredAuth && !isAuthenticated && !isLoading) {
    throw new Error('Authentication required');
  }

  // Additional check for token validity
  if (requiredAuth && isAuthenticated && !token) {
    throw new Error('Invalid authentication token');
  }

  return { isAuthenticated, isLoading, hasValidToken: !!token };
};
