# API Service Documentation

## Overview

The API Service is a high-level service layer that provides organized, typed methods for interacting with the Crop Disease Detection System's backend API. It acts as a business logic layer on top of the HTTP Client, organizing endpoints by feature and handling data transformation, file uploads, and query parameter management.

## Features

### 🏗️ **Service Organization**

- **Feature-based grouping** (Auth, User, Scan, Crop, Disease, Analytics)
- **Consistent method patterns** across all services
- **Type-safe API calls** with TypeScript interfaces
- **Centralized endpoint management**

### 📤 **File Upload Handling**

- **Single image uploads** with metadata
- **Batch image processing** for multiple scans
- **FormData preparation** and multipart handling
- **Progress tracking** support (when needed)

### 🔍 **Query Management**

- **Pagination support** across list endpoints
- **Search parameter handling** with type safety
- **URL parameter encoding** and validation
- **Dynamic endpoint generation** with parameter replacement

### 📊 **Data Transformation**

- **Request data formatting** (FormData, JSON)
- **Response data extraction** from API responses
- **Type casting** and validation
- **Error response handling**

## Architecture

### File Structure

```
src/
├── services/
│   ├── api.service.ts          # Main API service implementation
│   └── http.client.ts          # HTTP client dependency
├── config/
│   └── api.config.ts           # API endpoints configuration
├── interfaces/
│   ├── api.types.ts            # API request/response types
│   └── entities.types.ts       # Business entity types
└── constants/
    └── index.ts                # API endpoints constants
```

### Dependencies

- **HTTP Client**: Low-level HTTP communication
- **API Config**: Endpoint URLs and configuration
- **TypeScript Interfaces**: Type safety and validation
- **Form Data**: File upload handling

## Service Structure

### **Service Categories**

```typescript
export class ApiService {
  // Authentication Services (6 methods)
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>>;
  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>>;
  async logout(): Promise<ApiResponse<void>>;
  async refreshToken(): Promise<ApiResponse<AuthResponse>>;
  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<void>>;
  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<void>>;

  // User Services (4 methods)
  async getUserProfile(): Promise<ApiResponse<User>>;
  async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<User>>;
  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<void>>;
  async deleteAccount(): Promise<ApiResponse<void>>;

  // Scan Services (5 methods)
  async uploadImage(
    data: UploadImageRequest
  ): Promise<ApiResponse<ScanResultResponse>>;
  async batchUpload(
    data: BatchUploadRequest
  ): Promise<ApiResponse<ScanResultResponse[]>>;
  async getScanResult(scanId: string): Promise<ApiResponse<ScanResultResponse>>;
  async getScanHistory(
    params?: PaginationParams
  ): Promise<PaginatedResponse<ScanResultResponse>>;
  async deleteScan(scanId: string): Promise<ApiResponse<void>>;

  // Crop Services (3 methods)
  async getCrops(params?: PaginationParams): Promise<PaginatedResponse<Crop>>;
  async getCropDetail(cropId: string): Promise<ApiResponse<Crop>>;
  async searchCrops(
    params: CropSearchRequest
  ): Promise<PaginatedResponse<Crop>>;

  // Disease Services (4 methods)
  async getDiseases(
    params?: PaginationParams
  ): Promise<PaginatedResponse<Disease>>;
  async getDiseaseDetail(diseaseId: string): Promise<ApiResponse<Disease>>;
  async getDiseasesByCrop(
    cropId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<Disease>>;
  async searchDiseases(
    params: DiseaseSearchRequest
  ): Promise<PaginatedResponse<Disease>>;

  // Analytics Services (3 methods)
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>>;
  async getScanStats(): Promise<ApiResponse<ScanStats>>;
  async getCropStats(): Promise<ApiResponse<any>>;
}
```

## Authentication Services

### **login(credentials: LoginRequest)**

Authenticates user and returns auth tokens.

```typescript
async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
  return httpClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
}
```

**Parameters:**

```typescript
interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}
```

**Response:**

```typescript
interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}
```

**Usage Example:**

```typescript
const loginUser = async () => {
  try {
    const response = await apiService.login({
      email: "user@example.com",
      password: "securePassword123",
      rememberMe: true,
    });

    if (response.success) {
      const { user, token, refreshToken } = response.data;
      // Store auth data in auth store
      await setAuth(response.data);
      // Navigate to main app
    } else {
      // Handle login error
      setError(response.error?.message || "Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);
  }
};
```

### **register(userData: RegisterRequest)**

Creates new user account.

```typescript
async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
  return httpClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, userData);
}
```kikk
  
**Parameters:**

```typescript
interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: "farmer" | "expert";
  agreeToTerms: boolean;
}
```

**Usage Example:**

```typescript
const registerUser = async (formData) => {
  const response = await apiService.register({
    name: formData.name,
    email: formData.email,
    password: formData.password,
    confirmPassword: formData.confirmPassword,
    userType: formData.userType,
    agreeToTerms: formData.agreeToTerms,
  });

  if (response.success) {
    // Auto-login after registration
    await setAuth(response.data);
  }
};
```

### **logout()**

Logs out user and clears tokens.

```typescript
async logout(): Promise<ApiResponse<void>> {
  const response = await httpClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
  if (response.success) {
    httpClient.clearAuthTokens();
  }
  return response;
}
```

**Features:**

- Notifies backend of logout
- Clears HTTP client tokens
- Returns success/failure status

## User Services

### **getUserProfile()**

Fetches current user profile data.

```typescript
async getUserProfile(): Promise<ApiResponse<User>> {
  return httpClient.get<User>(API_ENDPOINTS.USER.PROFILE);
}
```

**Usage Example:**

```typescript
const ProfileScreen = () => {
  const [profile, setProfile] = useState<User | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const response = await apiService.getUserProfile();
      if (response.success) {
        setProfile(response.data);
      }
    };

    loadProfile();
  }, []);

  return (
    <View>
      <Text>Name: {profile?.name}</Text>
      <Text>Email: {profile?.email}</Text>
      <Text>Type: {profile?.userType}</Text>
    </View>
  );
};
```

### **updateProfile(data: UpdateProfileRequest)**

Updates user profile information.

```typescript
async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<User>> {
  return httpClient.put<User>(API_ENDPOINTS.USER.UPDATE_PROFILE, data);
}
```

**Parameters:**

```typescript
interface UpdateProfileRequest {
  name?: string;
  email?: string;
  userType?: "farmer" | "expert";
  avatar?: string;
}
```

**Usage Example:**

```typescript
const updateUserProfile = async (updates) => {
  const response = await apiService.updateProfile({
    name: updates.name,
    email: updates.email,
    avatar: updates.avatarUri,
  });

  if (response.success) {
    // Update local state
    setUser(response.data);
    showSuccess("Profile updated successfully");
  }
};
```

## Scan Services

### **uploadImage(data: UploadImageRequest)**

Uploads single image for disease detection.

```typescript
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
    API_ENDPOINTS.SCAN.UPLOAD,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
}
```

**Parameters:**

```typescript
interface UploadImageRequest {
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
```

**Usage Example:**

```typescript
const uploadScanImage = async (imageUri: string) => {
  try {
    const response = await apiService.uploadImage({
      image: {
        uri: imageUri,
        type: "image/jpeg",
        name: "scan.jpg",
      },
      cropType: "tomato",
      description: "Spotted leaves on tomato plant",
      location: {
        latitude: 40.7128,
        longitude: -74.006,
      },
    });

    if (response.success) {
      const scanResult = response.data;
      // Navigate to results screen
      navigation.navigate("ScanResult", { scanId: scanResult.id });
    }
  } catch (error) {
    showError("Upload failed. Please try again.");
  }
};
```

### **batchUpload(data: BatchUploadRequest)**

Uploads multiple images for batch processing.

```typescript
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
    API_ENDPOINTS.SCAN.BATCH_UPLOAD,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
}
```

**Features:**

- Handles multiple images in single request
- Individual metadata per image
- Default crop type for all images
- Efficient batch processing

### **getScanHistory(params?: PaginationParams)**

Retrieves user's scan history with pagination.

```typescript
async getScanHistory(params?: PaginationParams): Promise<PaginatedResponse<ScanResultResponse>> {
  const queryParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
  }

  const url = `${API_ENDPOINTS.SCAN.HISTORY}?${queryParams.toString()}`;
  return httpClient.get<ScanResultResponse[]>(url) as Promise<PaginatedResponse<ScanResultResponse>>;
}
```

**Usage Example:**

```typescript
const ScanHistoryScreen = () => {
  const [scans, setScans] = useState<ScanResultResponse[]>([]);
  const [pagination, setPagination] = useState(null);

  const loadHistory = async (page = 1) => {
    const response = await apiService.getScanHistory({
      page,
      limit: 20,
      sortBy: "createdAt",
      sortOrder: "desc",
    });

    if (response.success) {
      setScans(response.data);
      setPagination(response.pagination);
    }
  };

  const handleLoadMore = () => {
    if (pagination.hasNext) {
      loadHistory(pagination.page + 1);
    }
  };

  return (
    <FlatList
      data={scans}
      renderItem={({ item }) => <ScanCard scan={item} />}
      onEndReached={handleLoadMore}
    />
  );
};
```

## Crop Services

### **getCrops(params?: PaginationParams)**

Retrieves list of available crops.

```typescript
async getCrops(params?: PaginationParams): Promise<PaginatedResponse<Crop>> {
  const queryParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
  }

  const url = `${API_ENDPOINTS.CROPS.LIST}?${queryParams.toString()}`;
  return httpClient.get<Crop[]>(url) as Promise<PaginatedResponse<Crop>>;
}
```

### **searchCrops(params: CropSearchRequest)**

Searches crops with filters and pagination.

```typescript
async searchCrops(params: CropSearchRequest): Promise<PaginatedResponse<Crop>> {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, value.toString());
    }
  });

  const url = `${API_ENDPOINTS.CROPS.SEARCH}?${queryParams.toString()}`;
  return httpClient.get<Crop[]>(url) as Promise<PaginatedResponse<Crop>>;
}
```

**Parameters:**

```typescript
interface CropSearchRequest extends PaginationParams {
  query?: string;
  category?: string;
}
```

**Usage Example:**

```typescript
const CropSearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [crops, setCrops] = useState<Crop[]>([]);

  const searchCrops = async (query: string) => {
    const response = await apiService.searchCrops({
      query,
      page: 1,
      limit: 20,
      category: "vegetables",
    });

    if (response.success) {
      setCrops(response.data);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.length > 2) {
      searchCrops(text);
    }
  };

  return (
    <View>
      <TextInput
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Search crops..."
      />
      <FlatList
        data={crops}
        renderItem={({ item }) => <CropCard crop={item} />}
      />
    </View>
  );
};
```

## Disease Services

### **getDiseases(params?: PaginationParams)**

Retrieves list of diseases with pagination.

```typescript
async getDiseases(params?: PaginationParams): Promise<PaginatedResponse<Disease>> {
  const queryParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
  }

  const url = `${API_ENDPOINTS.DISEASES.LIST}?${queryParams.toString()}`;
  return httpClient.get<Disease[]>(url) as Promise<PaginatedResponse<Disease>>;
}
```

### **getDiseasesByCrop(cropId: string, params?: PaginationParams)**

Gets diseases that affect a specific crop.

```typescript
async getDiseasesByCrop(cropId: string, params?: PaginationParams): Promise<PaginatedResponse<Disease>> {
  const queryParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
  }

  const url = `${API_ENDPOINTS.DISEASES.BY_CROP.replace(':cropId', cropId)}?${queryParams.toString()}`;
  return httpClient.get<Disease[]>(url) as Promise<PaginatedResponse<Disease>>;
}
```

**Usage Example:**

```typescript
const CropDiseaseScreen = ({ cropId }: { cropId: string }) => {
  const [diseases, setDiseases] = useState<Disease[]>([]);

  useEffect(() => {
    const loadDiseases = async () => {
      const response = await apiService.getDiseasesByCrop(cropId, {
        page: 1,
        limit: 50,
        sortBy: "severity",
        sortOrder: "desc",
      });

      if (response.success) {
        setDiseases(response.data);
      }
    };

    loadDiseases();
  }, [cropId]);

  return (
    <View>
      <Text>Diseases affecting this crop:</Text>
      {diseases.map((disease) => (
        <DiseaseCard key={disease.id} disease={disease} />
      ))}
    </View>
  );
};
```

### **searchDiseases(params: DiseaseSearchRequest)**

Searches diseases with advanced filters.

```typescript
async searchDiseases(params: DiseaseSearchRequest): Promise<PaginatedResponse<Disease>> {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, value.toString());
    }
  });

  const url = `${API_ENDPOINTS.DISEASES.SEARCH}?${queryParams.toString()}`;
  return httpClient.get<Disease[]>(url) as Promise<PaginatedResponse<Disease>>;
}
```

**Parameters:**

```typescript
interface DiseaseSearchRequest extends PaginationParams {
  query?: string;
  cropId?: string;
  severity?: "low" | "medium" | "high" | "critical";
}
```

## Analytics Services

### **getDashboardStats()**

Retrieves dashboard statistics and overview data.

```typescript
async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
  return httpClient.get<DashboardStats>(API_ENDPOINTS.ANALYTICS.DASHBOARD);
}
```

**Response:**

```typescript
interface DashboardStats {
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
```

**Usage Example:**

```typescript
const DashboardScreen = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      const response = await apiService.getDashboardStats();
      if (response.success) {
        setStats(response.data);
      }
    };

    loadDashboard();
  }, []);

  if (!stats) return <LoadingScreen />;

  return (
    <ScrollView>
      <StatCard title="Total Scans" value={stats.totalScans} />
      <StatCard title="Crops Tracked" value={stats.totalCrops} />
      <StatCard title="Diseases Detected" value={stats.totalDiseases} />

      <RecentScansSection scans={stats.recentScans} />
      <TopCropsChart data={stats.topCrops} />
      <DiseaseDistributionChart data={stats.topDiseases} />
    </ScrollView>
  );
};
```

## URL Parameter Handling

### **Dynamic Endpoint Generation**

```typescript
// Template endpoints with parameters
const API_ENDPOINTS = {
  SCAN: {
    RESULT: '/scans/:id',
    DELETE: '/scans/:id',
  },
  CROPS: {
    DETAIL: '/crops/:id',
  },
  DISEASES: {
    DETAIL: '/diseases/:id',
    BY_CROP: '/diseases/crop/:cropId',
  },
};

// Parameter replacement in service methods
async getScanResult(scanId: string): Promise<ApiResponse<ScanResultResponse>> {
  const url = API_ENDPOINTS.SCAN.RESULT.replace(':id', scanId);
  return httpClient.get<ScanResultResponse>(url);
}

async getDiseasesByCrop(cropId: string, params?: PaginationParams): Promise<PaginatedResponse<Disease>> {
  // Handle URL parameters
  const baseUrl = API_ENDPOINTS.DISEASES.BY_CROP.replace(':cropId', cropId);

  // Handle query parameters
  const queryParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
  }

  const url = `${baseUrl}?${queryParams.toString()}`;
  return httpClient.get<Disease[]>(url) as Promise<PaginatedResponse<Disease>>;
}
```

### **Query Parameter Management**

```typescript
// Reusable query parameter builder
private buildQueryParams(params: Record<string, any>): URLSearchParams {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value.toString());
    }
  });

  return queryParams;
}

// Usage in service methods
async searchWithFilters(filters: SearchFilters) {
  const queryParams = this.buildQueryParams(filters);
  const url = `${API_ENDPOINTS.SEARCH}?${queryParams.toString()}`;
  return httpClient.get(url);
}
```

## Error Handling Patterns

### **Service-Level Error Handling**

```typescript
// Consistent error handling across all service methods
const handleServiceCall = async <T>(
  serviceCall: () => Promise<ApiResponse<T>>
): Promise<T> => {
  try {
    const response = await serviceCall();

    if (response.success) {
      return response.data!;
    } else {
      // Log API errors
      console.error("API Error:", response.error);
      throw new Error(response.error?.message || "API call failed");
    }
  } catch (error) {
    // Log network errors
    console.error("Network Error:", error);
    throw error;
  }
};

// Usage in components
const Component = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setError(null);
      const result = await handleServiceCall(() => apiService.getCrops());
      setData(result);
    } catch (err) {
      setError(err.message);
    }
  };
};
```

## Type Safety and Validation

### **Request Type Validation**

```typescript
// Strong typing for all request parameters
interface LoginRequest {
  email: string; // Required
  password: string; // Required
  rememberMe?: boolean; // Optional
}

// Compile-time validation
const login = async (credentials: LoginRequest) => {
  // TypeScript ensures all required fields are present
  return apiService.login(credentials);
};

// Runtime validation (if needed)
const validateLoginRequest = (data: any): data is LoginRequest => {
  return (
    typeof data.email === "string" &&
    typeof data.password === "string" &&
    (data.rememberMe === undefined || typeof data.rememberMe === "boolean")
  );
};
```

### **Response Type Safety**

```typescript
// Generic response handling with proper typing
const fetchTypedData = async <T>(
  endpoint: string,
  validator?: (data: any) => data is T
): Promise<T> => {
  const response = await httpClient.get<T>(endpoint);

  if (response.success) {
    const data = response.data!;

    // Optional runtime validation
    if (validator && !validator(data)) {
      throw new Error("Invalid response data format");
    }

    return data;
  } else {
    throw new Error(response.error?.message || "Request failed");
  }
};
```

## Performance Optimization

### **Request Caching Integration**

```typescript
// Integration with TanStack Query for caching
import { useQuery, useMutation } from "@tanstack/react-query";
import { QUERY_KEYS } from "../interfaces/api.types";

// Cached data fetching
const useCrops = (params?: PaginationParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.CROPS.LIST,
    queryFn: () => apiService.getCrops(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Optimistic updates for mutations
const useUploadImage = () => {
  return useMutation({
    mutationFn: apiService.uploadImage,
    onSuccess: (data) => {
      // Invalidate scan history to refresh
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SCAN.HISTORY });
    },
  });
};
```

### **Request Deduplication**

```typescript
// Prevent duplicate requests for same data
const requestCache = new Map<string, Promise<any>>();

const getCachedRequest = <T>(key: string, requestFn: () => Promise<T>): Promise<T> => {
  if (requestCache.has(key)) {
    return requestCache.get(key)!;
  }

  const request = requestFn().finally(() => {
    // Clean up cache after request completes
    requestCache.delete(key);
  });

  requestCache.set(key, request);
  return request;
};

// Usage in service methods
async getCropDetail(cropId: string): Promise<ApiResponse<Crop>> {
  const cacheKey = `crop-detail-${cropId}`;
  return getCachedRequest(cacheKey, () => {
    const url = API_ENDPOINTS.CROPS.DETAIL.replace(':id', cropId);
    return httpClient.get<Crop>(url);
  });
}
```

## Testing Strategies

### **Unit Testing Service Methods**

```typescript
import { ApiService } from "../services/api.service";
import { httpClient } from "../services/http.client";

// Mock HTTP client
jest.mock("../services/http.client");
const mockHttpClient = jest.mocked(httpClient);

describe("ApiService", () => {
  let apiService: ApiService;

  beforeEach(() => {
    apiService = new ApiService();
    jest.clearAllMocks();
  });

  describe("Authentication", () => {
    test("should login user successfully", async () => {
      const mockResponse = {
        success: true,
        data: {
          user: { id: "1", name: "John", email: "john@test.com" },
          token: "mock-token",
          refreshToken: "mock-refresh-token",
          expiresIn: 3600,
        },
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const credentials = {
        email: "john@test.com",
        password: "password123",
      };

      const result = await apiService.login(credentials);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        "/auth/login",
        credentials
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("File Upload", () => {
    test("should format upload request correctly", async () => {
      const mockImageData = {
        image: {
          uri: "file://test.jpg",
          type: "image/jpeg",
          name: "test.jpg",
        },
        cropType: "tomato",
        description: "Test scan",
      };

      const mockResponse = {
        success: true,
        data: { id: "scan-123", status: "processing" },
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      await apiService.uploadImage(mockImageData);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        "/scan/upload",
        expect.any(FormData),
        expect.objectContaining({
          headers: { "Content-Type": "multipart/form-data" },
        })
      );
    });
  });

  describe("Query Parameters", () => {
    test("should build query parameters correctly", async () => {
      const params = {
        page: 2,
        limit: 20,
        sortBy: "name",
        sortOrder: "asc",
      };

      await apiService.getCrops(params);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        expect.stringContaining("page=2&limit=20&sortBy=name&sortOrder=asc")
      );
    });
  });
});
```

### **Integration Testing**

```typescript
describe("ApiService Integration", () => {
  test("should handle authentication flow", async () => {
    // Test login -> get profile -> logout flow
    const loginResponse = await apiService.login(credentials);
    expect(loginResponse.success).toBe(true);

    const profileResponse = await apiService.getUserProfile();
    expect(profileResponse.success).toBe(true);

    const logoutResponse = await apiService.logout();
    expect(logoutResponse.success).toBe(true);
  });

  test("should handle file upload workflow", async () => {
    // Test upload -> get result -> view history flow
    const uploadResponse = await apiService.uploadImage(imageData);
    expect(uploadResponse.success).toBe(true);

    const scanId = uploadResponse.data.id;
    const resultResponse = await apiService.getScanResult(scanId);
    expect(resultResponse.success).toBe(true);

    const historyResponse = await apiService.getScanHistory();
    expect(historyResponse.data.some((scan) => scan.id === scanId)).toBe(true);
  });
});
```

## Best Practices

### **1. Use Proper Type Annotations**

```typescript
// ✅ Good - Explicit typing
const uploadImage = async (
  data: UploadImageRequest
): Promise<ApiResponse<ScanResultResponse>> => {
  return apiService.uploadImage(data);
};

// ❌ Bad - Any types
const uploadImage = async (data: any): Promise<any> => {
  return apiService.uploadImage(data);
};
```

### **2. Handle All Response States**

```typescript
// ✅ Good - Complete error handling
const handleLogin = async (credentials: LoginRequest) => {
  try {
    const response = await apiService.login(credentials);

    if (response.success) {
      await setAuth(response.data);
      navigation.navigate("Dashboard");
    } else {
      // Handle API errors
      const errorMessage = response.error?.message || "Login failed";
      setError(errorMessage);

      if (response.statusCode === 429) {
        setError("Too many attempts. Please try again later.");
      }
    }
  } catch (error) {
    // Handle network errors
    setError("Network error. Please check your connection.");
    console.error("Login error:", error);
  }
};

// ❌ Bad - Incomplete error handling
const handleLogin = async (credentials: LoginRequest) => {
  const response = await apiService.login(credentials);
  setAuth(response.data); // Assumes success
};
```

### **3. Use Query Parameters Efficiently**

```typescript
// ✅ Good - Clean parameter handling
const searchCrops = async (query: string, filters: CropFilters) => {
  const params: CropSearchRequest = {
    query,
    category: filters.category,
    page: 1,
    limit: 20,
    sortBy: "name",
    sortOrder: "asc",
  };

  return apiService.searchCrops(params);
};

// ❌ Bad - Manual URL building
const searchCrops = async (query: string) => {
  const url = `/crops/search?query=${encodeURIComponent(
    query
  )}&page=1&limit=20`;
  return httpClient.get(url);
};
```

### **4. Implement Loading States**

```typescript
// ✅ Good - Loading state management
const Component = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await apiService.getCrops();
      if (response.success) {
        setData(response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  return <DataView data={data} />;
};
```

## Troubleshooting

### **Common Issues**

1. **FormData upload failing**

   - Verify Content-Type is set to 'multipart/form-data'
   - Check file URI format and permissions
   - Ensure file exists and is accessible

2. **Query parameters not working**

   - Check parameter encoding with URLSearchParams
   - Verify parameter names match API expectations
   - Test with simple parameters first

3. **Type errors in responses**
   - Verify API response structure matches interfaces
   - Check for optional vs required fields
   - Use runtime validation for critical data

### **Debug Utilities**

```typescript
// Request/response logging
const debugApiCall = async <T>(
  method: string,
  endpoint: string,
  data?: any
): Promise<ApiResponse<T>> => {
  console.log(`🚀 API Call: ${method} ${endpoint}`, data);

  const start = Date.now();
  const response = await httpClient.request<T>({ method, url: endpoint, data });
  const duration = Date.now() - start;

  console.log(`✅ API Response: ${method} ${endpoint} (${duration}ms)`, {
    success: response.success,
    statusCode: response.statusCode,
    data: response.data,
  });

  return response;
};

// Type validation helper
const validateApiResponse = <T>(
  response: ApiResponse<T>,
  validator: (data: any) => data is T
): T => {
  if (!response.success) {
    throw new Error(response.error?.message || "API call failed");
  }

  if (!validator(response.data)) {
    throw new Error("Invalid response data structure");
  }

  return response.data!;
};
```

## Conclusion

The API Service provides a clean, typed, and organized interface for all backend communication. It abstracts away HTTP complexities while maintaining flexibility for custom requirements. The service layer ensures consistent error handling, proper data formatting, and type safety across the entire application.

For more information, see:

- [HTTP Client Documentation](./http.client.md)
- [Services Overview](./README.md)
- [Auth Store Documentation](../store/auth.store.md)
