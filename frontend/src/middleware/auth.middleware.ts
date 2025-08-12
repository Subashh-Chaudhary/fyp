import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '../store/auth.store';

// Auth middleware hook
export const useAuthMiddleware = () => {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    // If user is not authenticated and not in auth group, redirect to login
    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/login');
      return;
    }

    // If user is authenticated and in auth group, redirect to home
    if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
      return;
    }
  }, [isAuthenticated, segments, router, user]);
};

// Route protection hook
export const useRouteProtection = (requiredAuth: boolean = true) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (requiredAuth && !isAuthenticated && !isLoading) {
    throw new Error('Authentication required');
  }

  return { isAuthenticated, isLoading };
};
