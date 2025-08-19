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
  const user: User = {
    id: backendUser.id as string,
    name: backendUser.name as string,
    email: backendUser.email as string,
  };

  // Only set optional properties if they exist in the backend response
  if (backendUser.user_type) {
    user.userType = backendUser.user_type as 'farmer' | 'expert';
  }
  if (backendUser.phone) {
    user.phone = backendUser.phone as string;
  }
  if (backendUser.address) {
    user.address = backendUser.address as string;
  }
  if (backendUser.avatar_url) {
    user.avatar_url = backendUser.avatar_url as string;
  }
  if (backendUser.is_verified !== undefined) {
    user.is_verified = backendUser.is_verified as boolean;
  }
  if (backendUser.is_active !== undefined) {
    user.is_active = backendUser.is_active as boolean;
  }
  if (backendUser.is_admin !== undefined) {
    user.is_admin = backendUser.is_admin as boolean;
  }
  if (backendUser.created_at) {
    user.created_at = backendUser.created_at as string;
  }
  if (backendUser.updated_at) {
    user.updated_at = backendUser.updated_at as string;
  }
  if (backendUser.verification_token) {
    user.verification_token = backendUser.verification_token as string;
  }
  if (backendUser.verification_expires_at) {
    user.verification_expires_at = backendUser.verification_expires_at as string;
  }
  if (backendUser.password_reset_token) {
    user.password_reset_token = backendUser.password_reset_token as string;
  }
  if (backendUser.reset_token_expires_at) {
    user.reset_token_expires_at = backendUser.reset_token_expires_at as string;
  }
  if (backendUser.refresh_token) {
    user.refresh_token = backendUser.refresh_token as string;
  }
  if (backendUser.refresh_token_expires_at) {
    user.refresh_token_expires_at = backendUser.refresh_token_expires_at as string;
  }
  if (backendUser.last_login_at) {
    user.last_login_at = backendUser.last_login_at as string;
  }
  if (backendUser.auth_provider) {
    user.auth_provider = backendUser.auth_provider as string;
  }
  if (backendUser.provider_id) {
    user.provider_id = backendUser.provider_id as string;
  }

  return user;
};

// Validate API response structure and extract error messages
const validateApiResponse = (response: unknown, endpoint: string): void => {
  if (!response || typeof response !== 'object') {
    throw new Error(`Invalid response from ${endpoint}: Response is not an object`);
  }

  const apiResponse = response as Record<string, unknown>;

  // Check if the response indicates an error (success: false or statusCode >= 400)
  if (apiResponse.success === false || (apiResponse.statusCode as number) >= 400) {
    // Extract the user-friendly error message from the API response
    let errorMessage = 'Unknown error occurred';

    if (apiResponse.message) {
      if (Array.isArray(apiResponse.message)) {
        // Handle array of error messages
        errorMessage = (apiResponse.message as string[]).join(', ');
      } else {
        // Handle single error message
        errorMessage = apiResponse.message as string;
      }
    } else if (apiResponse.error) {
      errorMessage = apiResponse.error as string;
    }

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
      user: transformUserData(apiResponse.data!.user as unknown as Record<string, unknown>),
      access_token: apiResponse.data!.access_token,
    };
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await httpClient.post<AuthApiResponse>(API_ENDPOINTS.AUTH.REGISTER, userData);

    // Validate response structure
    validateApiResponse(response, 'register');

    // Transform the user data to match frontend interface
    const apiResponse = response as AuthApiResponse;
    return {
      user: transformUserData(apiResponse.data!.user as unknown as Record<string, unknown>),
      access_token: apiResponse.data!.access_token,
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
