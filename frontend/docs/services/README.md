# Services Documentation

## Overview

This directory contains comprehensive documentation for the service layer used in the Crop Disease Detection System. The service layer provides a clean abstraction for HTTP communication with two main components:

- **HTTP Client**: Low-level HTTP client with authentication, retry logic, and error handling
- **API Service**: High-level service layer that organizes API endpoints by feature

## Service Architecture

### **Technology Stack**

- **Axios**: HTTP client library
- **TypeScript**: Type safety and interfaces
- **Zustand Integration**: Token management with auth store
- **Expo Secure Store**: Secure token storage
- **Retry Logic**: Exponential backoff for failed requests

### **File Structure**

```
src/
├── services/
│   ├── http.client.ts         # HTTP client with auth & retry logic
│   └── api.service.ts         # High-level API service methods
├── config/
│   └── api.config.ts          # API configuration and endpoints
├── interfaces/
│   └── api.types.ts           # Service interfaces and types
└── utils/
    └── secureStorage.ts       # Secure storage utilities
```

## Service Comparison

| Feature              | HTTP Client                     | API Service                           |
| -------------------- | ------------------------------- | ------------------------------------- |
| **Purpose**          | Low-level HTTP communication    | High-level business logic             |
| **Responsibilities** | Auth, retry, error handling     | Endpoint organization, data mapping   |
| **Complexity**       | High (infrastructure concerns)  | Low (business logic only)             |
| **Usage**            | Internal (used by API Service)  | External (used by components)         |
| **Testing**          | Unit tests for HTTP logic       | Integration tests for API calls       |
| **Configuration**    | Timeouts, retries, interceptors | Endpoint mapping, data transformation |

## Quick Start

### **1. Basic Usage**

```typescript
import { apiService } from "../src/services/api.service";
import { httpClient } from "../src/services/http.client";

// High-level API calls (recommended)
const loginResponse = await apiService.login(credentials);
const crops = await apiService.getCrops();

// Low-level HTTP calls (when needed)
const customResponse = await httpClient.get<CustomType>("/custom-endpoint");
```

### **2. Authentication Integration**

```typescript
import { useAuthStore } from "../src/store/auth.store";

const LoginComponent = () => {
  const { setAuth } = useAuthStore();

  const handleLogin = async (credentials) => {
    const response = await apiService.login(credentials);
    if (response.success) {
      await setAuth(response.data);
      // Tokens automatically available for subsequent requests
    }
  };
};
```

### **3. Error Handling**

```typescript
const ScanComponent = () => {
  const handleUpload = async (imageData) => {
    try {
      const response = await apiService.uploadImage(imageData);
      if (response.success) {
        // Handle success
        console.log("Scan result:", response.data);
      } else {
        // Handle API error
        console.error("API error:", response.error);
      }
    } catch (error) {
      // Handle network/unexpected errors
      console.error("Network error:", error);
    }
  };
};
```

## Service Integration

### **Automatic Token Management**

```typescript
// Tokens are automatically:
// 1. Loaded from secure storage on app start
// 2. Added to request headers
// 3. Refreshed when expired
// 4. Cleared on logout

const response = await apiService.getUserProfile();
// No need to manually handle tokens
```

### **Response Format Standardization**

All API responses follow a consistent format [[memory:4265797]]:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string | ApiError;
  message?: string;
  statusCode?: number;
  timestamp?: string;
}
```

## Common Patterns

### **Data Fetching**

```typescript
// List data with pagination
const crops = await apiService.getCrops({ page: 1, limit: 20 });

// Search with parameters
const diseases = await apiService.searchDiseases({
  query: "rust",
  severity: "high",
  page: 1,
});

// Get specific item
const crop = await apiService.getCropDetail("crop-id");
```

### **File Uploads**

```typescript
// Single image upload
const scanResult = await apiService.uploadImage({
  image: { uri: "file://image.jpg", type: "image/jpeg", name: "scan.jpg" },
  cropType: "tomato",
  location: { latitude: 40.7128, longitude: -74.006 },
});

// Batch upload
const batchResults = await apiService.batchUpload({
  images: [imageData1, imageData2],
  cropType: "wheat",
});
```

### **Request Customization**

```typescript
// Custom timeout and retry
const response = await httpClient.post(
  "/api/slow-endpoint",
  data,
  {},
  {
    timeout: 30000,
    retryAttempts: 5,
    retryDelay: 2000,
  }
);

// Request cancellation
const controller = new AbortController();
const response = await apiService.getCrops({}, { signal: controller.signal });

// Cancel if needed
controller.abort();
```

## Security Features

### **Token Security**

- ✅ **Automatic token injection** in request headers
- ✅ **Secure token storage** using device keychain
- ✅ **Token refresh** when expired
- ✅ **Token cleanup** on logout

### **Request Security**

- ✅ **HTTPS enforcement** in production
- ✅ **Request timeouts** to prevent hanging
- ✅ **Request validation** with TypeScript
- ✅ **Error sanitization** to prevent data leaks

## Performance Optimization

### **Request Optimization**

```typescript
// Automatic retry with exponential backoff
// Failed requests retry: 1s, 2s, 4s, 8s intervals

// Request deduplication (implement with TanStack Query)
const { data } = useQuery({
  queryKey: QUERY_KEYS.CROPS.LIST,
  queryFn: () => apiService.getCrops(),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### **Memory Management**

```typescript
// Automatic cleanup of failed request queues
// Token refresh queuing prevents duplicate requests
// Response transformation reduces memory footprint
```

## Error Handling Strategy

### **Error Types**

1. **Network Errors**: No internet, server down
2. **Authentication Errors**: Invalid tokens, expired sessions
3. **Validation Errors**: Invalid request data
4. **Business Logic Errors**: Application-specific errors

### **Error Handling Flow**

```typescript
const handleApiCall = async () => {
  try {
    const response = await apiService.someMethod();

    if (response.success) {
      // Success path
      return response.data;
    } else {
      // API error (400, 500, etc.)
      throw new Error(response.error?.message || "API Error");
    }
  } catch (error) {
    // Network error, timeout, etc.
    console.error("Request failed:", error);
    throw error;
  }
};
```

## Testing Strategy

### **Unit Testing**

```typescript
// Test HTTP client functionality
test("should retry failed requests", async () => {
  const mockFailThenSucceed = jest
    .fn()
    .mockRejectedValueOnce(new Error("Network error"))
    .mockResolvedValue({ data: "success" });

  // Test retry logic
});

// Test API service methods
test("should format upload request correctly", async () => {
  const mockHttpClient = jest.mocked(httpClient);

  await apiService.uploadImage(mockImageData);

  expect(mockHttpClient.post).toHaveBeenCalledWith(
    expect.stringContaining("/upload"),
    expect.any(FormData),
    expect.objectContaining({
      headers: { "Content-Type": "multipart/form-data" },
    })
  );
});
```

### **Integration Testing**

```typescript
// Test service integration with stores
test("should update auth store on login", async () => {
  const { result } = renderHook(() => useAuthStore());

  const response = await apiService.login(credentials);

  await act(async () => {
    await result.current.setAuth(response.data);
  });

  expect(result.current.isAuthenticated).toBe(true);
});
```

## Best Practices

### **1. Use High-Level API Service**

```typescript
// ✅ Good - Use API service for business logic
const crops = await apiService.getCrops();

// ❌ Bad - Direct HTTP client usage in components
const response = await httpClient.get("/api/crops");
```

### **2. Handle All Response Cases**

```typescript
// ✅ Good - Handle both success and error cases
const response = await apiService.login(credentials);
if (response.success) {
  // Handle success
} else {
  // Handle API error
}

// ❌ Bad - Only handle success case
const data = response.data; // Might be undefined
```

### **3. Use TypeScript Types**

```typescript
// ✅ Good - Use proper types
const response: ApiResponse<Crop[]> = await apiService.getCrops();

// ❌ Bad - Any types
const response: any = await apiService.getCrops();
```

### **4. Implement Proper Error Boundaries**

```typescript
// Component-level error handling
const Component = () => {
  const [error, setError] = useState<string | null>(null);

  const handleApiCall = async () => {
    try {
      setError(null);
      const response = await apiService.someMethod();
      // Handle response
    } catch (err) {
      setError(err.message);
    }
  };
};
```

## Troubleshooting

### **Common Issues**

1. **Requests failing silently**

   - Check network connectivity
   - Verify API endpoint URLs
   - Check authentication tokens

2. **Authentication errors**

   - Verify token storage
   - Check token expiration
   - Test token refresh flow

3. **Slow requests**
   - Check timeout configurations
   - Monitor network conditions
   - Implement request caching

### **Debug Mode**

```typescript
// Enable debug logging
if (__DEV__) {
  // Log all requests
  httpClient.instance.interceptors.request.use((config) => {
    console.log("Request:", config);
    return config;
  });

  // Log all responses
  httpClient.instance.interceptors.response.use((response) => {
    console.log("Response:", response);
    return response;
  });
}
```

## Documentation Index

### **Service Documentation**

- [HTTP Client](./http.client.md) - Complete HTTP client documentation
- [API Service](./api.service.md) - Complete API service documentation

### **Related Documentation**

- [Auth Store](../store/auth.store.md) - Authentication state management
- [App Store](../store/app.store.md) - Application state management
- [API Structure](../api/API_STRUCTURE.md) - API endpoint documentation

## Migration Guide

### **From Fetch API**

1. Replace fetch calls with apiService methods
2. Update error handling to use ApiResponse format
3. Remove manual token management
4. Update TypeScript types

### **From Other HTTP Libraries**

1. Update import statements
2. Convert request/response formats
3. Update error handling patterns
4. Test authentication flow

## Support

For issues and questions:

1. Check the troubleshooting sections
2. Review the service method documentation
3. Check the TypeScript interfaces
4. Test with debug logging enabled

## Contributing

When contributing to services:

1. Follow established patterns
2. Add proper TypeScript types
3. Include comprehensive error handling
4. Write tests for new methods
5. Update documentation

---

**Built with ❤️ for the Crop Disease Detection System**
