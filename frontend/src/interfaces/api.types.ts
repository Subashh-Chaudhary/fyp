import { User } from './entities.types';

// Base API Response Interface - matches your backend response structure
export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta: {
    timestamp: string;
    path: string;
    method: string;
  };
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  user_type: 'farmer' | 'expert';
}

export interface AuthResponse {
  user: User;
  access_token: string;
}

// Wrapper for auth responses from the backend
export interface AuthApiResponse extends ApiResponse<AuthResponse> {}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

export interface ApiErrorResponse extends ApiResponse {
  error: ApiError;
}

// Request Options
export interface RequestOptions {
  timeout?: number;
  headers?: Record<string, string>;
}

// Query Keys for TanStack Query
export const QUERY_KEYS = {
  AUTH: {
    USER: ['auth', 'user'],
    PROFILE: ['auth', 'profile'],
  },
} as const;

// Mutation Keys for TanStack Query
export const MUTATION_KEYS = {
  AUTH: {
    LOGIN: ['auth', 'login'],
    REGISTER: ['auth', 'register'],
    LOGOUT: ['auth', 'logout'],
  },
} as const;
