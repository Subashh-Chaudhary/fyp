import { API_ENDPOINTS } from '../constants';
import { getApiConfig } from '../src/config/api.config';
import { ApiResponse, NewsListResponse, User } from '../src/interfaces';

// Authentication response type
interface AuthResponse {
  user: User;
  token: string;
}

// Base API configuration - use dynamic config (handles emulator/device URLs)
const API_BASE_URL = getApiConfig().BASE_URL;

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
      const message = error instanceof Error ? error.message : 'Unknown error';
      const fallbackResponse: ApiResponse<T> = {
        success: false,
        statusCode: 500,
        message,
        data: null as unknown as T,
        meta: null as any,
      };
      return fallbackResponse;
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
    return this.request(API_ENDPOINTS.CROPS.LIST);
  }

  async getDiseases(cropId?: string) {
    const endpoint = cropId ? API_ENDPOINTS.DISEASES.BY_CROP.replace(':cropId', cropId) : API_ENDPOINTS.DISEASES.LIST;
    return this.request(endpoint);
  }

  // News methods
  // Fetch news page-by-page; when `all=true` it will aggregate pages until there are no more.
  async getNews(options?: { page?: number; limit?: number; all?: boolean }): Promise<ApiResponse<NewsListResponse>> {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 10;
    const fetchAll = options?.all ?? false;

    if (!fetchAll) {
      return this.request<NewsListResponse>(`/news?page=${page}&limit=${limit}`);
    }

    // fetch all pages
    let currentPage = 1;
    const aggregatedItems: any[] = [];
    let lastResponse: any = null;

    while (true) {
      // request page
      // eslint-disable-next-line no-await-in-loop
      const res = await this.request<NewsListResponse>(`/news?page=${currentPage}&limit=${limit}`);
      lastResponse = res;

      if (res && res.success && res.data && Array.isArray(res.data.items)) {
        aggregatedItems.push(...(res.data.items as any));
      }

      const pagination = (res as ApiResponse<NewsListResponse>)?.data?.pagination;
      if (!pagination || pagination.hasNext === false) {
        break;
      }

      currentPage += 1;
    }

    // If the last page request failed, propagate that error response instead of forcing success
    if (lastResponse && lastResponse.success === false) {
      return lastResponse as ApiResponse<NewsListResponse>;
    }

    // return a consolidated response preserving top-level shape
    return {
      success: true,
      statusCode: lastResponse?.statusCode ?? 200,
      message: lastResponse?.message ?? 'News retrieved',
      data: {
        items: aggregatedItems,
        pagination: {
          page: 1,
          limit,
          total: aggregatedItems.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      },
      meta: lastResponse?.meta ?? null,
    };
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export individual methods bound to the apiClient instance so `this` is preserved when imported separately.
export const login = (...args: any[]) => (apiClient as any).login(...args);
export const register = (...args: any[]) => (apiClient as any).register(...args);
export const logout = (...args: any[]) => (apiClient as any).logout(...args);
export const uploadImage = (...args: any[]) => (apiClient as any).uploadImage(...args);
export const getScanResult = (...args: any[]) => (apiClient as any).getScanResult(...args);
export const getScanHistory = (...args: any[]) => (apiClient as any).getScanHistory(...args);
export const getCrops = (...args: any[]) => (apiClient as any).getCrops(...args);
export const getDiseases = (...args: any[]) => (apiClient as any).getDiseases(...args);
export const getNews = (...args: any[]) => (apiClient as any).getNews(...args);
