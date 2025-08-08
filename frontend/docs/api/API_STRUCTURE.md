# API Structure Documentation

## Overview

This document describes the comprehensive API calling structure implemented in the Crop Disease Detection System frontend. The architecture uses TanStack Query for data fetching, Zustand for state management, and a robust HTTP client with middleware for seamless API interactions.

## Architecture Components

### 1. Configuration Layer (`src/config/`)

#### `api.config.ts`

- **Purpose**: Centralized API configuration
- **Features**:
  - Environment-specific base URLs
  - Request timeouts and retry settings
  - Endpoint definitions
  - Error message constants
  - HTTP status codes

```typescript
// Example usage
import { getApiConfig } from "../config/api.config";
const config = getApiConfig();
```

### 2. Type Definitions (`src/interfaces/`)

#### `api.types.ts`

- **Purpose**: Comprehensive TypeScript interfaces for API operations
- **Includes**:
  - Request/Response interfaces
  - Pagination types
  - Error handling types
  - Query and mutation keys for TanStack Query

```typescript
// Example interfaces
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string | ApiError;
  message?: string;
  statusCode?: number;
  timestamp?: string;
}
```

### 3. HTTP Client (`src/services/`)

#### `http.client.ts`

- **Purpose**: Robust HTTP client with axios
- **Features**:
  - Automatic token management
  - Request/response interceptors
  - Token refresh logic
  - Retry mechanism with exponential backoff
  - Error transformation
  - Request queuing during token refresh

```typescript
// Example usage
import { httpClient } from "../services/http.client";

// Set auth tokens
httpClient.setAuthTokens(token, refreshToken);

// Make requests
const response = await httpClient.get<User>("/user/profile");
```

#### `api.service.ts`

- **Purpose**: High-level API service methods
- **Features**:
  - Organized by domain (auth, user, scan, crops, diseases, analytics)
  - FormData handling for file uploads
  - Query parameter management
  - Consistent error handling

```typescript
// Example usage
import { apiService } from "../services/api.service";

// Authentication
const authResponse = await apiService.login(credentials);

// File upload
const scanResult = await apiService.uploadImage(imageData);
```

### 4. State Management (`src/store/`)

#### `auth.store.ts`

- **Purpose**: Authentication state management with Zustand
- **Features**:
  - Persistent storage with AsyncStorage
  - User, token, and authentication state
  - Loading and error states
  - Automatic state synchronization

```typescript
// Example usage
import { useAuthStore } from "../store/auth.store";

const { user, isAuthenticated, setAuth, logout } = useAuthStore();
```

#### `app.store.ts`

- **Purpose**: General application state
- **Features**:
  - Theme management
  - Scan history
  - Network status
  - App preferences
  - Persistent storage

```typescript
// Example usage
import { useAppStore } from "../store/app.store";

const { theme, scanHistory, setTheme, addScanToHistory } = useAppStore();
```

### 5. Data Fetching Hooks (`src/hooks/`)

#### `api.hooks.ts`

- **Purpose**: TanStack Query hooks for all API operations
- **Features**:
  - Automatic caching and invalidation
  - Optimistic updates
  - Error handling
  - Loading states
  - Background refetching

```typescript
// Example usage
import { useLogin, useUserProfile, useScanHistory } from "../hooks/api.hooks";

// Authentication
const loginMutation = useLogin({
  onSuccess: (response) => {
    // Handle successful login
  },
});

// Data fetching
const { data: user, isLoading, error } = useUserProfile();
const { data: scans } = useScanHistory({ page: 1, limit: 10 });
```

### 6. Middleware (`src/middleware/`)

#### `auth.middleware.ts`

- **Purpose**: Route protection and authentication logic
- **Features**:
  - Automatic route redirection
  - Token validation
  - Network status monitoring
  - Authentication state management

```typescript
// Example usage
import { useAuthMiddleware } from "../middleware/auth.middleware";

// In your app component
useAuthMiddleware(); // Automatically handles auth routing
```

### 7. Providers (`src/providers/`)

#### `query.provider.tsx`

- **Purpose**: TanStack Query configuration
- **Features**:
  - Global query settings
  - Retry logic
  - Cache management
  - Development tools

#### `app.provider.tsx`

- **Purpose**: Main app provider combining all providers
- **Features**:
  - Provider composition
  - Authentication initialization
  - Middleware integration

## Usage Examples

### 1. Authentication Flow

```typescript
import { useLogin } from "../hooks/api.hooks";
import { useAuthStore } from "../store/auth.store";

const LoginComponent = () => {
  const { setAuth } = useAuthStore();
  const loginMutation = useLogin({
    onSuccess: (response) => {
      if (response.success && response.data) {
        setAuth(response.data);
      }
    },
  });

  const handleLogin = (credentials) => {
    loginMutation.mutate(credentials);
  };
};
```

### 2. Data Fetching with Caching

```typescript
import { useCrops, useDiseasesByCrop } from "../hooks/api.hooks";

const CropsComponent = () => {
  const { data: crops, isLoading } = useCrops({ page: 1, limit: 20 });
  const { data: diseases } = useDiseasesByCrop(cropId, { page: 1, limit: 10 });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      {crops?.data?.map((crop) => (
        <CropCard key={crop.id} crop={crop} />
      ))}
    </div>
  );
};
```

### 3. File Upload with Progress

```typescript
import { useUploadImage } from "../hooks/api.hooks";

const ScanComponent = () => {
  const uploadMutation = useUploadImage({
    onSuccess: (response) => {
      if (response.success) {
        // Handle successful upload
        router.push(`/result/${response.data.id}`);
      }
    },
  });

  const handleImageUpload = (imageUri) => {
    const uploadData = {
      image: {
        uri: imageUri,
        type: "image/jpeg",
        name: "crop_image.jpg",
      },
      cropType: "tomato",
    };

    uploadMutation.mutate(uploadData);
  };
};
```

## Error Handling

### 1. Global Error Handling

The HTTP client automatically handles common errors:

- Network errors with retry logic
- Authentication errors with token refresh
- Server errors with appropriate error messages

### 2. Component-Level Error Handling

```typescript
const { data, error, isLoading } = useUserProfile();

if (error) {
  return <ErrorMessage message={error.message} />;
}

if (isLoading) {
  return <LoadingSpinner />;
}
```

### 3. Mutation Error Handling

```typescript
const mutation = useLogin({
  onError: (error) => {
    // Handle specific error
    showToast(error.message);
  },
  onSuccess: (response) => {
    // Handle success
  },
});
```

## Best Practices

### 1. Query Keys

- Use consistent query key patterns
- Include parameters in query keys for proper cache management
- Use array format for complex keys

### 2. Cache Management

- Set appropriate stale times for different data types
- Invalidate related queries when data changes
- Use optimistic updates for better UX

### 3. Error Handling

- Always handle loading and error states
- Provide meaningful error messages
- Implement retry logic for transient failures

### 4. Performance

- Use pagination for large datasets
- Implement infinite scrolling where appropriate
- Optimize bundle size with code splitting

## Configuration

### Environment Variables

```typescript
// Development
BASE_URL: "http://localhost:3000/api/v1";
TIMEOUT: 10000;

// Production
BASE_URL: "https://api.cropdisease.com/v1";
TIMEOUT: 30000;
```

### Query Client Configuration

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      retryDelay: exponentialBackoff,
    },
  },
});
```

## Testing

### 1. Unit Testing

- Test individual hooks in isolation
- Mock API responses
- Test error scenarios

### 2. Integration Testing

- Test complete authentication flow
- Test data fetching and caching
- Test error handling

### 3. E2E Testing

- Test complete user journeys
- Test offline scenarios
- Test performance under load

## Troubleshooting

### Common Issues

1. **Token Refresh Loops**

   - Check token expiration logic
   - Verify refresh token validity
   - Monitor network requests

2. **Cache Inconsistencies**

   - Verify query key patterns
   - Check invalidation logic
   - Monitor cache updates

3. **Performance Issues**
   - Monitor query execution times
   - Check cache hit rates
   - Optimize query patterns

### Debug Tools

1. **React Query DevTools**

   - Available in development mode
   - Monitor query states
   - Inspect cache contents

2. **Network Tab**

   - Monitor API requests
   - Check request/response headers
   - Verify authentication tokens

3. **Console Logging**
   - Enable debug logging
   - Monitor error messages
   - Track state changes

## Conclusion

This API structure provides a robust, scalable, and maintainable foundation for the Crop Disease Detection System. It handles authentication, data fetching, caching, and error handling in a consistent and efficient manner, ensuring a smooth user experience across all application features.
