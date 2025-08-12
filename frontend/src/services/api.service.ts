import { API_ENDPOINTS } from '../config/api.config';
import {
  AuthApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from '../interfaces/api.types';
import { User } from '../interfaces/entities.types';

import { httpClient } from './http.client';

// Transform backend user data to frontend interface
const transformUserData = (backendUser: Record<string, unknown>): User => {
  return {
    id: backendUser.id as string,
    name: backendUser.name as string,
    email: backendUser.email as string,
    userType: backendUser.user_type as 'farmer' | 'expert', // Map user_type to userType
    phone: backendUser.phone as string,
    address: backendUser.address as string,
    avatar_url: backendUser.avatar_url as string,
    is_verified: backendUser.is_verified as boolean,
    is_active: backendUser.is_active as boolean,
    is_admin: backendUser.is_admin as boolean,
    created_at: backendUser.created_at as string,
    updated_at: backendUser.updated_at as string,
    verification_token: backendUser.verification_token as string,
    verification_expires_at: backendUser.verification_expires_at as string,
    password_reset_token: backendUser.password_reset_token as string,
    reset_token_expires_at: backendUser.reset_token_expires_at as string,
    refresh_token: backendUser.refresh_token as string,
    refresh_token_expires_at: backendUser.refresh_token_expires_at as string,
    last_login_at: backendUser.last_login_at as string,
    auth_provider: backendUser.auth_provider as string,
    provider_id: backendUser.provider_id as string,
  };
};

// Validate API response structure
const validateApiResponse = (response: unknown, endpoint: string): void => {
  if (!response || typeof response !== 'object') {
    throw new Error(`Invalid response from ${endpoint}: Response is not an object`);
  }

  const apiResponse = response as Record<string, unknown>;

  // Check if the response indicates an error (success: false or statusCode >= 400)
  if (apiResponse.success === false || (apiResponse.statusCode as number) >= 400) {
    // Extract the user-friendly error message from the API response
    const errorMessage = (apiResponse.message as string) || (apiResponse.error as string) || 'Unknown error occurred';
    throw new Error(errorMessage);
  }

  if (!apiResponse.data) {
    throw new Error(`Invalid response from ${endpoint}: Missing data field`);
  }
};

// Main API Service Class
export class ApiService {
  // Test endpoint to verify connectivity
  async testConnection(): Promise<{ message: string; timestamp: string }> {
    return httpClient.get<{ message: string; timestamp: string }>('/health');
  }

  // Authentication Services
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await httpClient.post<AuthApiResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);

    // Validate response structure
    validateApiResponse(response, 'login');

    // Transform the user data to match frontend interface
    const apiResponse = response as AuthApiResponse;
    return {
      user: transformUserData(apiResponse.data.user as unknown as Record<string, unknown>),
      access_token: apiResponse.data.access_token,
    };
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await httpClient.post<AuthApiResponse>(API_ENDPOINTS.AUTH.REGISTER, userData);

    // Validate response structure
    validateApiResponse(response, 'register');

    // Transform the user data to match frontend interface
    const apiResponse = response as AuthApiResponse;
    return {
      user: transformUserData(apiResponse.data.user as unknown as Record<string, unknown>),
      access_token: apiResponse.data.access_token,
    };
  }

  async logout(): Promise<void> {
    try {
      await httpClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
      httpClient.clearAuthToken();
    } catch (error) {
      // Even if logout fails, clear the token locally
      httpClient.clearAuthToken();
      throw error;
    }
  }
}

// Create and export singleton instance
export const apiService = new ApiService();
