import React, { useEffect } from 'react';
import { useAuthMiddleware, useNetworkMiddleware, useTokenValidation } from '../middleware/auth.middleware';
import { httpClient } from '../services/http.client';
import { useAppStore } from '../store/app.store';
import { useAuthStore } from '../store/auth.store';
import { QueryProvider } from './query.provider';

// App Provider Component
interface AppProviderProps {
  children: React.ReactNode;
}

// Auth Initializer Component
const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { initializeAuth } = useAuthStore();
  const { setLoading } = useAppStore();

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        // Initialize auth state from secure storage
        await initializeAuth();

        // Set tokens in HTTP client if available
        const { token, refreshToken } = useAuthStore.getState();
        if (token && refreshToken) {
          httpClient.setAuthTokens(token, refreshToken);
        }

      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [initializeAuth, setLoading]);

  return <>{children}</>;
};

// Middleware Component
const AppMiddleware: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize all middleware
  useAuthMiddleware();
  useTokenValidation();
  useNetworkMiddleware();

  return <>{children}</>;
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <QueryProvider>
      <AuthInitializer>
        <AppMiddleware>
          {children}
        </AppMiddleware>
      </AuthInitializer>
    </QueryProvider>
  );
};
