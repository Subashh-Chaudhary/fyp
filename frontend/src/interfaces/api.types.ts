import { User } from './entities.types';

// Base API Response Interface - matches your backend response structure
export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string | string[]; // Backend can return string or array of strings
  data: T | null;
  error?: string; // Optional error field for some responses
  meta: {
    timestamp: string;
    path: string;
    method: string;
  };
}

// News item and list response types
export interface NewsItem {
  id: string;
  title: string;
  content?: string;
  source?: string;
  publish_date?: string | null;
  category?: string;
  url?: string;
  is_active?: boolean;
  created_at?: string;
  last_updated?: string;
}

export interface NewsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface NewsListResponse {
  items: NewsItem[];
  pagination: NewsPagination;
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
  details?: unknown;
  timestamp: string;
}

export interface ApiErrorResponse extends ApiResponse<unknown> {
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

// Note: Types are already exported above, no need to re-export
