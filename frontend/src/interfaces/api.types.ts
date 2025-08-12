import { Crop, Disease, ScanResult, User } from './entities.types';

// Base API Response Interface
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string | ApiError;
  message?: string;
  statusCode?: number;
  timestamp?: string;
}

// Pagination Interface
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  user_type: 'farmer' | 'expert';
  phone?: string;
  address?: string;
  profile_image?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirm_password: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
}

// Backend API Response Structure
export interface BackendApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta: {
    timestamp: string;
    path: string;
    method: string;
  };
}

// User Types
export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  userType?: 'farmer' | 'expert';
  avatar?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Scan Types
export interface UploadImageRequest {
  image: {
    uri: string;
    type: string;
    name: string;
  };
  cropType?: string;
  description?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface BatchUploadRequest {
  images: UploadImageRequest[];
  cropType?: string;
}

export interface ScanResultResponse {
  id: string;
  imageUrl: string;
  cropId: string;
  confidence: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  analysis: {
    detectedDiseases: {
      id: string;
      name: string;
      scientificName: string;
      confidence: number;
      severity: 'low' | 'medium' | 'high' | 'critical';
      symptoms: string[];
      treatments: string[];
    }[];
    recommendations: {
      immediate: string[];
      longTerm: string[];
      preventive: string[];
    };
    cropInfo: {
      id: string;
      name: string;
      scientificName: string;
      healthScore: number;
    };
  };
}

// Crop and Disease Types
export interface CropSearchRequest extends PaginationParams {
  query?: string;
  category?: string;
}

export interface DiseaseSearchRequest extends PaginationParams {
  query?: string;
  cropId?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

// Analytics Types
export interface DashboardStats {
  totalScans: number;
  totalCrops: number;
  totalDiseases: number;
  recentScans: ScanResult[];
  topCrops: {
    crop: Crop;
    scanCount: number;
  }[];
  topDiseases: {
    disease: Disease;
    detectionCount: number;
  }[];
}

export interface ScanStats {
  daily: {
    date: string;
    count: number;
  }[];
  weekly: {
    week: string;
    count: number;
  }[];
  monthly: {
    month: string;
    count: number;
  }[];
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ApiErrorResponse extends ApiResponse {
  error: ApiError;
  validationErrors?: ValidationError[];
}

// Request Options
export interface RequestOptions {
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

// Query Keys for TanStack Query
export const QUERY_KEYS = {
  AUTH: {
    USER: ['auth', 'user'],
    PROFILE: ['auth', 'profile'],
  },
  SCAN: {
    ALL: ['scan'],
    HISTORY: ['scan', 'history'],
    RESULT: (id: string) => ['scan', 'result', id],
    UPLOAD: ['scan', 'upload'],
  },
  CROPS: {
    ALL: ['crops'],
    LIST: ['crops', 'list'],
    DETAIL: (id: string) => ['crops', 'detail', id],
    SEARCH: (params: CropSearchRequest) => ['crops', 'search', params],
  },
  DISEASES: {
    ALL: ['diseases'],
    LIST: ['diseases', 'list'],
    DETAIL: (id: string) => ['diseases', 'detail', id],
    BY_CROP: (cropId: string) => ['diseases', 'crop', cropId],
    SEARCH: (params: DiseaseSearchRequest) => ['diseases', 'search', params],
  },
  ANALYTICS: {
    DASHBOARD: ['analytics', 'dashboard'],
    SCAN_STATS: ['analytics', 'scan-stats'],
    CROP_STATS: ['analytics', 'crop-stats'],
  },
} as const;

// Mutation Keys for TanStack Query
export const MUTATION_KEYS = {
  AUTH: {
    LOGIN: ['auth', 'login'],
    REGISTER: ['auth', 'register'],
    LOGOUT: ['auth', 'logout'],
    UPDATE_PROFILE: ['auth', 'update-profile'],
    CHANGE_PASSWORD: ['auth', 'change-password'],
  },
  SCAN: {
    UPLOAD: ['scan', 'upload'],
    DELETE: ['scan', 'delete'],
    BATCH_UPLOAD: ['scan', 'batch-upload'],
  },
} as const;
