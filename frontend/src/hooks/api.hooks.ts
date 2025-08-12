import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';

import {
  AuthResponse,
  LoginRequest,
  MUTATION_KEYS,
  QUERY_KEYS,
  RegisterRequest,
} from '../interfaces/api.types';
import { apiService } from '../services/api.service';
import { httpClient } from '../services/http.client';

// Authentication Hooks
export const useLogin = (options?: UseMutationOptions<AuthResponse, Error, LoginRequest>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.AUTH.LOGIN,
    mutationFn: async (credentials: LoginRequest) => {
      try {
        return await apiService.login(credentials);
      } catch (error: any) {
        // Ensure the error message is properly set
        if (error.message) {
          error.message = error.message;
        }
        throw error;
      }
    },
    onSuccess: (response) => {
      // Set auth token
      httpClient.setAuthToken(response.access_token);

      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.USER });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.PROFILE });
    },
    ...options,
  });
};

export const useRegister = (options?: UseMutationOptions<AuthResponse, Error, RegisterRequest>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: MUTATION_KEYS.AUTH.REGISTER,
    mutationFn: async (userData: RegisterRequest) => {
      try {
        return await apiService.register(userData);
      } catch (error: any) {
        // Ensure the error message is properly set
        if (error.message) {
          error.message = error.message;
        }
        throw error;
      }
    },
    onSuccess: (response) => {
      // Set auth token
      httpClient.setAuthToken(response.access_token);

      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.USER });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.PROFILE });
    },
    ...options,
  });
};

export const useLogout = (options?: UseMutationOptions<void, Error, void>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.AUTH.LOGOUT,
    mutationFn: () => apiService.logout(),
    onSuccess: () => {
      // Clear all queries from cache
      queryClient.clear();
    },
    ...options,
  });
};
