import { API_ENDPOINTS } from '../constants';
import { ApiResponse, User } from '../types';

// Authentication response type
interface AuthResponse {
  user: User;
  token: string;
}

// Base API configuration
const API_BASE_URL = API_ENDPOINTS.BASE_URL;

// API client class for making HTTP requests
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  // Set authentication token
  setToken(token: string | null) {
    this.token = token;
  }

  // Get headers for requests
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: this.getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Authentication methods
  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name: string, email: string, password: string, userType: 'farmer' | 'expert'): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify({ name, email, password, userType }),
    });
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.request<void>(API_ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST',
    });
  }

  // Scan methods
  async uploadImage(imageUri: string, cropType?: string) {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'crop_image.jpg',
    } as any);

    if (cropType) {
      formData.append('cropType', cropType);
    }

    return this.request(API_ENDPOINTS.SCAN.UPLOAD, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async getScanResult(scanId: string) {
    return this.request(`${API_ENDPOINTS.SCAN.RESULT}/${scanId}`);
  }

  async getScanHistory() {
    return this.request(API_ENDPOINTS.SCAN.HISTORY);
  }

  // Crop and disease methods
  async getCrops() {
    return this.request(API_ENDPOINTS.CROPS);
  }

  async getDiseases(cropId?: string) {
    const endpoint = cropId ? `${API_ENDPOINTS.DISEASES}?cropId=${cropId}` : API_ENDPOINTS.DISEASES;
    return this.request(endpoint);
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export individual methods for convenience
export const {
  login,
  register,
  logout,
  uploadImage,
  getScanResult,
  getScanHistory,
  getCrops,
  getDiseases,
} = apiClient;
