import { useMutation, UseMutationOptions, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { Crop, Disease, User } from '../interfaces';
import {
  ApiResponse,
  AuthResponse,
  BatchUploadRequest,
  ChangePasswordRequest,
  CropSearchRequest,
  DashboardStats,
  DiseaseSearchRequest,
  ForgotPasswordRequest,
  LoginRequest,
  MUTATION_KEYS,
  PaginationParams,
  QUERY_KEYS,
  RegisterRequest,
  ResetPasswordRequest,
  ScanResultResponse,
  ScanStats,
  UpdateProfileRequest,
  UploadImageRequest,
} from '../interfaces/api.types';
import { apiService } from '../services/api.service';
import { httpClient } from '../services/http.client';

// Authentication Hooks
export const useLogin = (options?: UseMutationOptions<ApiResponse<AuthResponse>, Error, LoginRequest>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.AUTH.LOGIN,
    mutationFn: (credentials: LoginRequest) => apiService.login(credentials),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Set auth tokens
        httpClient.setAuthTokens(response.data.token, response.data.refreshToken);

        // Invalidate and refetch user data
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.USER });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.PROFILE });
      }
    },
    ...options,
  });
};

export const useRegister = (options?: UseMutationOptions<ApiResponse<AuthResponse>, Error, RegisterRequest>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.AUTH.REGISTER,
    mutationFn: (userData: RegisterRequest) => apiService.register(userData),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Set auth tokens
        httpClient.setAuthTokens(response.data.token, response.data.refreshToken);

        // Invalidate and refetch user data
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.USER });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.PROFILE });
      }
    },
    ...options,
  });
};

export const useLogout = (options?: UseMutationOptions<ApiResponse<void>, Error, void>) => {
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

export const useForgotPassword = (options?: UseMutationOptions<ApiResponse<void>, Error, ForgotPasswordRequest>) => {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => apiService.forgotPassword(data),
    ...options,
  });
};

export const useResetPassword = (options?: UseMutationOptions<ApiResponse<void>, Error, ResetPasswordRequest>) => {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => apiService.resetPassword(data),
    ...options,
  });
};

// User Hooks
export const useUserProfile = (options?: UseQueryOptions<ApiResponse<User>, Error>) => {
  return useQuery({
    queryKey: QUERY_KEYS.AUTH.PROFILE,
    queryFn: () => apiService.getUserProfile(),
    enabled: !!httpClient, // Only run if httpClient is available
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

export const useUpdateProfile = (options?: UseMutationOptions<ApiResponse<User>, Error, UpdateProfileRequest>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.AUTH.UPDATE_PROFILE,
    mutationFn: (data: UpdateProfileRequest) => apiService.updateProfile(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Update user profile in cache
        queryClient.setQueryData(QUERY_KEYS.AUTH.PROFILE, response);
      }
    },
    ...options,
  });
};

export const useChangePassword = (options?: UseMutationOptions<ApiResponse<void>, Error, ChangePasswordRequest>) => {
  return useMutation({
    mutationKey: MUTATION_KEYS.AUTH.CHANGE_PASSWORD,
    mutationFn: (data: ChangePasswordRequest) => apiService.changePassword(data),
    ...options,
  });
};

// Scan Hooks
export const useUploadImage = (options?: UseMutationOptions<ApiResponse<ScanResultResponse>, Error, UploadImageRequest>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.SCAN.UPLOAD,
    mutationFn: (data: UploadImageRequest) => apiService.uploadImage(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Invalidate scan history
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SCAN.HISTORY });

        // Add to scan history cache
        queryClient.setQueryData(
          QUERY_KEYS.SCAN.HISTORY,
          (oldData: any) => {
            if (oldData?.data) {
              return {
                ...oldData,
                data: [response.data, ...oldData.data],
              };
            }
            return oldData;
          }
        );
      }
    },
    ...options,
  });
};

export const useBatchUpload = (options?: UseMutationOptions<ApiResponse<ScanResultResponse[]>, Error, BatchUploadRequest>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.SCAN.BATCH_UPLOAD,
    mutationFn: (data: BatchUploadRequest) => apiService.batchUpload(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Invalidate scan history
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SCAN.HISTORY });
      }
    },
    ...options,
  });
};

export const useScanResult = (scanId: string, options?: UseQueryOptions<ApiResponse<ScanResultResponse>, Error>) => {
  return useQuery({
    queryKey: QUERY_KEYS.SCAN.RESULT(scanId),
    queryFn: () => apiService.getScanResult(scanId),
    enabled: !!scanId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

export const useScanHistory = (params?: PaginationParams, options?: UseQueryOptions<ApiResponse<any>, Error>) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.SCAN.HISTORY, params],
    queryFn: () => apiService.getScanHistory(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
};

export const useDeleteScan = (options?: UseMutationOptions<ApiResponse<void>, Error, string>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.SCAN.DELETE,
    mutationFn: (scanId: string) => apiService.deleteScan(scanId),
    onSuccess: (_, scanId) => {
      // Remove from scan history cache
      queryClient.setQueryData(
        QUERY_KEYS.SCAN.HISTORY,
        (oldData: any) => {
          if (oldData?.data) {
            return {
              ...oldData,
              data: oldData.data.filter((scan: any) => scan.id !== scanId),
            };
          }
          return oldData;
        }
      );

      // Remove scan result from cache
      queryClient.removeQueries({ queryKey: QUERY_KEYS.SCAN.RESULT(scanId) });
    },
    ...options,
  });
};

// Crop Hooks
export const useCrops = (params?: PaginationParams, options?: UseQueryOptions<ApiResponse<any>, Error>) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.CROPS.LIST, params],
    queryFn: () => apiService.getCrops(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

export const useCropDetail = (cropId: string, options?: UseQueryOptions<ApiResponse<Crop>, Error>) => {
  return useQuery({
    queryKey: QUERY_KEYS.CROPS.DETAIL(cropId),
    queryFn: () => apiService.getCropDetail(cropId),
    enabled: !!cropId,
    staleTime: 15 * 60 * 1000, // 15 minutes
    ...options,
  });
};

export const useSearchCrops = (params: CropSearchRequest, options?: UseQueryOptions<ApiResponse<any>, Error>) => {
  return useQuery({
    queryKey: QUERY_KEYS.CROPS.SEARCH(params),
    queryFn: () => apiService.searchCrops(params),
    enabled: !!params.query || !!params.category,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// Disease Hooks
export const useDiseases = (params?: PaginationParams, options?: UseQueryOptions<ApiResponse<any>, Error>) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.DISEASES.LIST, params],
    queryFn: () => apiService.getDiseases(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

export const useDiseaseDetail = (diseaseId: string, options?: UseQueryOptions<ApiResponse<Disease>, Error>) => {
  return useQuery({
    queryKey: QUERY_KEYS.DISEASES.DETAIL(diseaseId),
    queryFn: () => apiService.getDiseaseDetail(diseaseId),
    enabled: !!diseaseId,
    staleTime: 15 * 60 * 1000, // 15 minutes
    ...options,
  });
};

export const useDiseasesByCrop = (cropId: string, params?: PaginationParams, options?: UseQueryOptions<ApiResponse<any>, Error>) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.DISEASES.BY_CROP(cropId), params],
    queryFn: () => apiService.getDiseasesByCrop(cropId, params),
    enabled: !!cropId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

export const useSearchDiseases = (params: DiseaseSearchRequest, options?: UseQueryOptions<ApiResponse<any>, Error>) => {
  return useQuery({
    queryKey: QUERY_KEYS.DISEASES.SEARCH(params),
    queryFn: () => apiService.searchDiseases(params),
    enabled: !!params.query || !!params.cropId || !!params.severity,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// Analytics Hooks
export const useDashboardStats = (options?: UseQueryOptions<ApiResponse<DashboardStats>, Error>) => {
  return useQuery({
    queryKey: QUERY_KEYS.ANALYTICS.DASHBOARD,
    queryFn: () => apiService.getDashboardStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

export const useScanStats = (options?: UseQueryOptions<ApiResponse<ScanStats>, Error>) => {
  return useQuery({
    queryKey: QUERY_KEYS.ANALYTICS.SCAN_STATS,
    queryFn: () => apiService.getScanStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

export const useCropStats = (options?: UseQueryOptions<ApiResponse<any>, Error>) => {
  return useQuery({
    queryKey: QUERY_KEYS.ANALYTICS.CROP_STATS,
    queryFn: () => apiService.getCropStats(),
    staleTime: 15 * 60 * 1000, // 15 minutes
    ...options,
  });
};
