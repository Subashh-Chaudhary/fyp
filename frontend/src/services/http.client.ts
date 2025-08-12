import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { getApiConfig } from '../config/api.config';

// Simple HTTP Client Class
export class HttpClient {
  private instance: AxiosInstance;
  private token: string | null = null;

  constructor() {
    const config = getApiConfig();

    // Debug logging for development
    if (__DEV__) {
      console.log('HTTP Client initialized with config:', config);
    }

    this.instance = axios.create({
      baseURL: config.BASE_URL,
      timeout: config.TIMEOUT,
      headers: config.DEFAULT_HEADERS,
    });

    this.setupInterceptors();
  }

  // Setup request interceptor to add auth token
  private setupInterceptors(): void {
    this.instance.interceptors.request.use(
      (config) => {
        if (__DEV__) {
          console.log('Making request to:', (config.baseURL || '') + (config.url || ''));
        }

        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        if (__DEV__) {
          console.error('Request interceptor error:', error);
        }
        return Promise.reject(error);
      }
    );

    // Add response interceptor for debugging
    this.instance.interceptors.response.use(
      (response) => {
        if (__DEV__) {
          console.log('Response received:', response.status, response.config.url);
          console.log('Response data structure:', {
            hasSuccess: 'success' in response.data,
            hasData: 'data' in response.data,
            hasStatusCode: 'statusCode' in response.data,
            hasMessage: 'message' in response.data,
            successValue: response.data.success,
            statusCode: response.data.statusCode,
            message: response.data.message,
            dataKeys: response.data.data ? Object.keys(response.data.data) : 'No data field'
          });
        }
        return response;
      },
      (error) => {
        if (__DEV__) {
          console.error('Response error:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            url: error.config?.url,
            message: error.message,
            code: error.code,
            isNetworkError: !error.response,
            responseData: error.response?.data
          });
        }

        // If we have a response with error data, enhance the error message
        if (error.response?.data) {
          const apiError = error.response.data;
          // Create a more user-friendly error message
          if (apiError.message) {
            error.message = apiError.message;
          } else if (apiError.error) {
            error.message = apiError.error;
          }
          // Store the full API error data for debugging
          error.apiError = apiError;
        }

        return Promise.reject(error);
      }
    );
  }

  // Set authentication token
  public setAuthToken(token: string): void {
    this.token = token;
  }

  // Clear authentication token
  public clearAuthToken(): void {
    this.token = null;
  }

  // HTTP method shortcuts - return raw axios responses
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }

  // Generic request method for custom requests
  public async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.request<T>(config);
    return response.data;
  }
}

// Create and export singleton instance
export const httpClient = new HttpClient();
