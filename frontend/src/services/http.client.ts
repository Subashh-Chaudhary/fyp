import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse
} from 'axios';
import { API_CONFIG, getApiConfig } from '../config/api.config';
import { ApiError, ApiResponse, RequestOptions } from '../interfaces/api.types';
import { AuthSecureStorage } from '../utils/secureStorage';

// HTTP Client Class
export class HttpClient {
  private instance: AxiosInstance;
  private token: string | null = null;
  private refreshToken: string | null = null;
  private isRefreshing = false;
  private failedQueue: {
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }[] = [];

  constructor() {
    const config = getApiConfig();

    this.instance = axios.create({
      baseURL: config.BASE_URL,
      timeout: config.TIMEOUT,
      headers: config.DEFAULT_HEADERS,
    });

    this.setupInterceptors();
    this.loadTokens();
  }

  // Setup request and response interceptors
  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Add auth token if available
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }

        // Add request timestamp
        config.headers['X-Request-Timestamp'] = new Date().toISOString();

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Wait for the refresh to complete
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(() => {
              return this.instance(originalRequest);
            }).catch((err) => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const newTokens = await this.refreshAuthToken();
            if (newTokens) {
              this.processQueue(null, newTokens);
              return this.instance(originalRequest);
            }
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            await this.logout();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Process failed requests queue
  private processQueue(error: any, token: any): void {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });

    this.failedQueue = [];
  }

    // Load tokens from storage
  private async loadTokens(): Promise<void> {
    try {
      const { token, refreshToken } = await AuthSecureStorage.getTokens();
      this.token = token;
      this.refreshToken = refreshToken;
    } catch (error) {
      console.error('Failed to load tokens:', error);
    }
  }

  // Save tokens to storage
  private async saveTokens(token: string, refreshToken: string): Promise<void> {
    try {
      await AuthSecureStorage.storeTokens(token, refreshToken);
      this.token = token;
      this.refreshToken = refreshToken;
    } catch (error) {
      console.error('Failed to save tokens:', error);
    }
  }

  // Refresh authentication token
  private async refreshAuthToken(): Promise<{ token: string; refreshToken: string } | null> {
    if (!this.refreshToken) {
      return null;
    }

    try {
      const response = await axios.post(`${getApiConfig().BASE_URL}/auth/refresh`, {
        refreshToken: this.refreshToken,
      });

      const { token, refreshToken } = response.data.data;
      await this.saveTokens(token, refreshToken);

      return { token, refreshToken };
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
    }
  }

    // Logout and clear tokens
  private async logout(): Promise<void> {
    try {
      await AuthSecureStorage.clearAuthData();

      this.token = null;
      this.refreshToken = null;
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }

  // Set authentication tokens
  public setAuthTokens(token: string, refreshToken: string): void {
    this.token = token;
    this.refreshToken = refreshToken;
    this.saveTokens(token, refreshToken);
  }

  // Clear authentication tokens
  public clearAuthTokens(): void {
    this.token = null;
    this.refreshToken = null;
    this.logout();
  }

  // Generic request method with retry logic
  public async request<T>(
    config: AxiosRequestConfig,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      timeout = API_CONFIG.TIMEOUT,
      retryAttempts = API_CONFIG.RETRY_ATTEMPTS,
      retryDelay = API_CONFIG.RETRY_DELAY,
      headers = {},
      signal,
    } = options;

    let lastError: AxiosError;

    for (let attempt = 0; attempt <= retryAttempts; attempt++) {
      try {
        const response = await this.instance.request({
          ...config,
          timeout,
          headers: { ...config.headers, ...headers },
          signal,
        });

        return this.transformResponse<T>(response);
      } catch (error) {
        lastError = error as AxiosError;

        // Don't retry on certain errors
        if (this.shouldNotRetry(error as AxiosError)) {
          break;
        }

        // Wait before retrying (except on last attempt)
        if (attempt < retryAttempts) {
          await this.delay(retryDelay * Math.pow(2, attempt)); // Exponential backoff
        }
      }
    }

    return this.transformError<T>(lastError!);
  }

  // Transform successful response
  private transformResponse<T>(response: AxiosResponse): ApiResponse<T> {
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message,
      statusCode: response.status,
      timestamp: new Date().toISOString(),
    };
  }

  // Transform error response
  private transformError<T>(error: AxiosError): ApiResponse<T> {
    const apiError: ApiError = {
      code: this.getErrorCode(error),
      message: this.getErrorMessage(error),
      details: error.response?.data,
      timestamp: new Date().toISOString(),
    };

    return {
      success: false,
      error: apiError,
      statusCode: error.response?.status,
      timestamp: new Date().toISOString(),
    };
  }

  // Get error code from response
  private getErrorCode(error: AxiosError): string {
    const responseData = error.response?.data as any;
    if (responseData?.code) {
      return responseData.code;
    }

    if (error.code) {
      return error.code;
    }

    return 'UNKNOWN_ERROR';
  }

  // Get error message from response
  private getErrorMessage(error: AxiosError): string {
    const responseData = error.response?.data as any;
    if (responseData?.message) {
      return responseData.message;
    }

    if (responseData?.error) {
      return responseData.error;
    }

    if (error.message) {
      return error.message;
    }

    return API_CONFIG.ERROR_MESSAGES.UNKNOWN_ERROR;
  }

  // Check if error should not be retried
  private shouldNotRetry(error: AxiosError): boolean {
    const status = error.response?.status;

    // Don't retry on client errors (4xx) except 408, 429
    if (status && status >= 400 && status < 500 && ![408, 429].includes(status)) {
      return true;
    }

    // Don't retry on network errors
    if (!error.response && !error.request) {
      return true;
    }

    return false;
  }

  // Utility delay function
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // HTTP method shortcuts
  public async get<T>(url: string, config?: AxiosRequestConfig, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url }, options);
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data }, options);
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data }, options);
  }

  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PATCH', url, data }, options);
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url }, options);
  }
}

// Create and export singleton instance
export const httpClient = new HttpClient();
