import React, { useEffect } from 'react';

import { useAuthMiddleware } from '../middleware/auth.middleware';
import { useAuthStore } from '../store/auth.store';

import { QueryProvider } from './query.provider';

// App Provider Component
interface AppProviderProps {
  children: React.ReactNode;
}

// Middleware Component
const AppMiddleware: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { initializeAuth } = useAuthStore();

  // Initialize auth state when app starts
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Initialize auth middleware
  useAuthMiddleware();

  return <>{children}</>;
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <QueryProvider>
      <AppMiddleware>
        {children}
      </AppMiddleware>
    </QueryProvider>
  );
};
