import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

import { useAuthStore } from '../store/auth.store';

// Auth middleware hook (fixed group detection)
// NOTE: expo-router strips "(group)" names from segments, so we cannot rely on segment[0] === '(auth)' etc.
// We'll determine auth routes by explicit first segment matching and allow navigation to other stacks when authenticated.
export const useAuthMiddleware = () => {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, token } = useAuthStore();

  useEffect(() => {
    // First segment of current route (groups removed by expo-router)
  const first = segments[0];

    // Define which top-level route names belong to the auth flow
  const authRoutes = new Set(['login', 'register', 'forgot-password']);
  const publicRoutes = new Set(['welcome', '_sitemap', '']);
  const inAuthRoutes = authRoutes.has(first);
  const inPublicRoutes = publicRoutes.has(first ?? '');

    // Debug logging (only in development)
    if (__DEV__) {
      console.log('[AuthMiddleware] segments=', segments, 'first=', first, 'inAuthRoutes=', inAuthRoutes, 'inPublicRoutes=', inPublicRoutes, 'isAuthenticated=', isAuthenticated);
    }

    // If not authenticated and NOT on an auth or public route, send to login
    if (!isAuthenticated && !inAuthRoutes && !inPublicRoutes) {
      if (__DEV__) {console.log('[AuthMiddleware] Redirect -> /(auth)/login');}
      router.replace('/(auth)/login');
      return;
    }

    // If authenticated and on an auth or welcome route, redirect to tabs home
    if (isAuthenticated && (inAuthRoutes || inPublicRoutes)) {
      if (__DEV__) {console.log('[AuthMiddleware] Redirect -> /(tabs)');}
      router.replace('/(tabs)');
      return;
    }

    // Otherwise allow navigation (including stack screens like scan/camera)
    // Removed previous forced redirect that broke stack navigation.
    if (__DEV__) {
      console.log('[AuthMiddleware] Navigation allowed for route', segments.join('/'));
    }
  }, [isAuthenticated, segments, router, token]);
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
