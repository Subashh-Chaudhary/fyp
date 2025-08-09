import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useAppStore } from '../store/app.store';
import { useAuthStore } from '../store/auth.store';

// Auth middleware hook
export const useAuthMiddleware = () => {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, token, user } = useAuthStore();

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

    // If user is authenticated but no user data, try to fetch profile
    if (isAuthenticated && !user && token) {
      // This will be handled by the auth store or a separate effect
      console.log('User authenticated but no profile data, fetching...');
    }
  }, [isAuthenticated, segments, router, token, user]);
};

// Route protection hook
export const useRouteProtection = (requiredAuth: boolean = true) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (requiredAuth && !isAuthenticated && !isLoading) {
    throw new Error('Authentication required');
  }

  return { isAuthenticated, isLoading };
};

// Token validation middleware
export const useTokenValidation = () => {
  const { token, logout } = useAuthStore();

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        logout();
        return;
      }

      try {
        // You can add token validation logic here
        // For example, decode JWT and check expiration
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;

        if (tokenData.exp < currentTime) {
          // Token expired
          logout();
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        logout();
      }
    };

    validateToken();
  }, [token, logout]);
};

// Network status middleware
export const useNetworkMiddleware = () => {
  const { setNetworkStatus } = useAppStore();

  useEffect(() => {
    const handleOnline = () => {
      setNetworkStatus('online');
    };

    const handleOffline = () => {
      setNetworkStatus('offline');
    };

    // Add event listeners for network status
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial status
    setNetworkStatus(navigator.onLine ? 'online' : 'offline');

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setNetworkStatus]);
};
