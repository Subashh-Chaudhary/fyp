import { AuthResponse } from './api.types';
import { User } from './entities.types';

// Auth State Interface
export interface AuthState {
  // State
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setAuth: (authData: AuthResponse) => Promise<void>;
  setUser: (user: User) => Promise<void>;
  setToken: (token: string) => Promise<void>;
  setRefreshToken: (refreshToken: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => Promise<void>;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
}
