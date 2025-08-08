import { Crop, Disease, User } from '../../types';
import { API_CONFIG } from '../config/api.config';
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
    PaginatedResponse,
    PaginationParams,
    RegisterRequest,
    ResetPasswordRequest,
    ScanResultResponse,
    ScanStats,
    UpdateProfileRequest,
    UploadImageRequest,
} from '../interfaces/api.types';
import { httpClient } from './http.client';

// Main API Service Class
export class ApiService {
  // Authentication Services
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return httpClient.post<AuthResponse>(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return httpClient.post<AuthResponse>(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData);
  }

  async logout(): Promise<ApiResponse<void>> {
    const response = await httpClient.post<void>(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    if (response.success) {
      httpClient.clearAuthTokens();
    }
    return response;
  }

  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    return httpClient.post<AuthResponse>(API_CONFIG.ENDPOINTS.AUTH.REFRESH);
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<void>> {
    return httpClient.post<void>(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
  }

  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<void>> {
    return httpClient.post<void>(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD, data);
  }

  async verifyEmail(token: string): Promise<ApiResponse<void>> {
    return httpClient.post<void>(API_CONFIG.ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
  }

  // User Services
  async getUserProfile(): Promise<ApiResponse<User>> {
    return httpClient.get<User>(API_CONFIG.ENDPOINTS.USER.PROFILE);
  }

  async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<User>> {
    return httpClient.put<User>(API_CONFIG.ENDPOINTS.USER.UPDATE_PROFILE, data);
  }

  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<void>> {
    return httpClient.post<void>(API_CONFIG.ENDPOINTS.USER.CHANGE_PASSWORD, data);
  }

  async deleteAccount(): Promise<ApiResponse<void>> {
    return httpClient.delete<void>(API_CONFIG.ENDPOINTS.USER.DELETE_ACCOUNT);
  }

  // Scan Services
  async uploadImage(data: UploadImageRequest): Promise<ApiResponse<ScanResultResponse>> {
    const formData = new FormData();

    // Add image file
    formData.append('image', {
      uri: data.image.uri,
      type: data.image.type,
      name: data.image.name,
    } as any);

    // Add optional fields
    if (data.cropType) {
      formData.append('cropType', data.cropType);
    }
    if (data.description) {
      formData.append('description', data.description);
    }
    if (data.location) {
      formData.append('location', JSON.stringify(data.location));
    }

    return httpClient.post<ScanResultResponse>(
      API_CONFIG.ENDPOINTS.SCAN.UPLOAD,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }

  async batchUpload(data: BatchUploadRequest): Promise<ApiResponse<ScanResultResponse[]>> {
    const formData = new FormData();

    // Add multiple images
    data.images.forEach((imageData, index) => {
      formData.append(`images[${index}]`, {
        uri: imageData.image.uri,
        type: imageData.image.type,
        name: imageData.image.name,
      } as any);

      if (imageData.cropType) {
        formData.append(`cropTypes[${index}]`, imageData.cropType);
      }
      if (imageData.description) {
        formData.append(`descriptions[${index}]`, imageData.description);
      }
      if (imageData.location) {
        formData.append(`locations[${index}]`, JSON.stringify(imageData.location));
      }
    });

    if (data.cropType) {
      formData.append('defaultCropType', data.cropType);
    }

    return httpClient.post<ScanResultResponse[]>(
      API_CONFIG.ENDPOINTS.SCAN.BATCH_UPLOAD,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }

  async getScanResult(scanId: string): Promise<ApiResponse<ScanResultResponse>> {
    const url = API_CONFIG.ENDPOINTS.SCAN.RESULT.replace(':id', scanId);
    return httpClient.get<ScanResultResponse>(url);
  }

  async getScanHistory(params?: PaginationParams): Promise<PaginatedResponse<ScanResultResponse>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `${API_CONFIG.ENDPOINTS.SCAN.HISTORY}?${queryParams.toString()}`;
    return httpClient.get<ScanResultResponse[]>(url) as Promise<PaginatedResponse<ScanResultResponse>>;
  }

  async deleteScan(scanId: string): Promise<ApiResponse<void>> {
    const url = API_CONFIG.ENDPOINTS.SCAN.DELETE.replace(':id', scanId);
    return httpClient.delete<void>(url);
  }

  // Crop Services
  async getCrops(params?: PaginationParams): Promise<PaginatedResponse<Crop>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `${API_CONFIG.ENDPOINTS.CROPS.LIST}?${queryParams.toString()}`;
    return httpClient.get<Crop[]>(url) as Promise<PaginatedResponse<Crop>>;
  }

  async getCropDetail(cropId: string): Promise<ApiResponse<Crop>> {
    const url = API_CONFIG.ENDPOINTS.CROPS.DETAIL.replace(':id', cropId);
    return httpClient.get<Crop>(url);
  }

  async searchCrops(params: CropSearchRequest): Promise<PaginatedResponse<Crop>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${API_CONFIG.ENDPOINTS.CROPS.SEARCH}?${queryParams.toString()}`;
    return httpClient.get<Crop[]>(url) as Promise<PaginatedResponse<Crop>>;
  }

  // Disease Services
  async getDiseases(params?: PaginationParams): Promise<PaginatedResponse<Disease>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `${API_CONFIG.ENDPOINTS.DISEASES.LIST}?${queryParams.toString()}`;
    return httpClient.get<Disease[]>(url) as Promise<PaginatedResponse<Disease>>;
  }

  async getDiseaseDetail(diseaseId: string): Promise<ApiResponse<Disease>> {
    const url = API_CONFIG.ENDPOINTS.DISEASES.DETAIL.replace(':id', diseaseId);
    return httpClient.get<Disease>(url);
  }

  async getDiseasesByCrop(cropId: string, params?: PaginationParams): Promise<PaginatedResponse<Disease>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `${API_CONFIG.ENDPOINTS.DISEASES.BY_CROP.replace(':cropId', cropId)}?${queryParams.toString()}`;
    return httpClient.get<Disease[]>(url) as Promise<PaginatedResponse<Disease>>;
  }

  async searchDiseases(params: DiseaseSearchRequest): Promise<PaginatedResponse<Disease>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${API_CONFIG.ENDPOINTS.DISEASES.SEARCH}?${queryParams.toString()}`;
    return httpClient.get<Disease[]>(url) as Promise<PaginatedResponse<Disease>>;
  }

  // Analytics Services
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return httpClient.get<DashboardStats>(API_CONFIG.ENDPOINTS.ANALYTICS.DASHBOARD);
  }

  async getScanStats(): Promise<ApiResponse<ScanStats>> {
    return httpClient.get<ScanStats>(API_CONFIG.ENDPOINTS.ANALYTICS.SCAN_STATS);
  }

  async getCropStats(): Promise<ApiResponse<any>> {
    return httpClient.get<any>(API_CONFIG.ENDPOINTS.ANALYTICS.CROP_STATS);
  }
}

// Create and export singleton instance
export const apiService = new ApiService();
