import React from 'react';
import { useAuthMiddleware } from '../middleware/auth.middleware';
import { QueryProvider } from './query.provider';

// App Provider Component
interface AppProviderProps {
  children: React.ReactNode;
}

// Middleware Component
const AppMiddleware: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
