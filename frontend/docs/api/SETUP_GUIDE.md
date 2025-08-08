# API Structure Setup Guide

## Quick Start

This guide will help you integrate the API structure into your existing React Native app.

## 1. Install Dependencies

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools axios zustand
```

## 2. Update App Entry Point

Update your `app/_layout.tsx` to include the providers:

```typescript
import { AppProvider } from "../src/providers/app.provider";

export default function RootLayout() {
  return <AppProvider>{/* Your existing app content */}</AppProvider>;
}
```

## 3. Configure Environment

Update your `constants/index.ts` with your API endpoints:

```typescript
export const API_ENDPOINTS = {
  BASE_URL: "https://your-api-domain.com/v1",
  // ... other endpoints
};
```

## 4. Usage Examples

### Authentication

```typescript
import { useLogin } from "../src/hooks/api.hooks";
import { useAuthStore } from "../src/store/auth.store";

export default function LoginScreen() {
  const { setAuth } = useAuthStore();
  const loginMutation = useLogin({
    onSuccess: (response) => {
      if (response.success && response.data) {
        setAuth(response.data);
      }
    },
  });

  const handleLogin = () => {
    loginMutation.mutate({
      email: "user@example.com",
      password: "password",
    });
  };

  return (
    <Button onPress={handleLogin} disabled={loginMutation.isPending}>
      {loginMutation.isPending ? "Logging in..." : "Login"}
    </Button>
  );
}
```

### Data Fetching

```typescript
import { useCrops, useScanHistory } from "../src/hooks/api.hooks";

export default function HomeScreen() {
  const { data: crops, isLoading: cropsLoading } = useCrops();
  const { data: scans, isLoading: scansLoading } = useScanHistory();

  if (cropsLoading || scansLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View>
      <Text>Crops: {crops?.data?.length || 0}</Text>
      <Text>Recent Scans: {scans?.data?.length || 0}</Text>
    </View>
  );
}
```

### File Upload

```typescript
import { useUploadImage } from "../src/hooks/api.hooks";
import { useAppStore } from "../src/store/app.store";

export default function ScanScreen() {
  const { addScanToHistory } = useAppStore();
  const uploadMutation = useUploadImage({
    onSuccess: (response) => {
      if (response.success && response.data) {
        addScanToHistory(response.data);
      }
    },
  });

  const handleImageCapture = (imageUri: string) => {
    uploadMutation.mutate({
      image: {
        uri: imageUri,
        type: "image/jpeg",
        name: "crop_image.jpg",
      },
    });
  };

  return (
    <View>
      <Button
        onPress={() => handleImageCapture("file://image.jpg")}
        disabled={uploadMutation.isPending}
      >
        {uploadMutation.isPending ? "Uploading..." : "Upload Image"}
      </Button>
    </View>
  );
}
```

## 5. State Management

### Using Auth Store

```typescript
import { useAuthStore } from "../src/store/auth.store";

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  return (
    <View>
      <Text>Welcome, {user?.name}</Text>
      <Button onPress={logout}>Logout</Button>
    </View>
  );
}
```

### Using App Store

```typescript
import { useAppStore } from "../src/store/app.store";

export default function SettingsScreen() {
  const { theme, setTheme, notifications, setNotifications } = useAppStore();

  return (
    <View>
      <Switch
        value={theme === "dark"}
        onValueChange={(value) => setTheme(value ? "dark" : "light")}
      />
      <Switch value={notifications} onValueChange={setNotifications} />
    </View>
  );
}
```

## 6. Error Handling

```typescript
import { useUserProfile } from "../src/hooks/api.hooks";

export default function ProfileScreen() {
  const { data, error, isLoading } = useUserProfile();

  if (error) {
    return (
      <View>
        <Text>Error: {error.message}</Text>
        <Button onPress={() => window.location.reload()}>Retry</Button>
      </View>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View>
      <Text>Name: {data?.data?.name}</Text>
      <Text>Email: {data?.data?.email}</Text>
    </View>
  );
}
```

## 7. Custom Hooks

Create custom hooks for complex logic:

```typescript
// src/hooks/useAuth.ts
import { useLogin, useRegister, useLogout } from "./api.hooks";
import { useAuthStore } from "../store/auth.store";

export const useAuth = () => {
  const { setAuth, logout: logoutStore } = useAuthStore();

  const login = useLogin({
    onSuccess: (response) => {
      if (response.success && response.data) {
        setAuth(response.data);
      }
    },
  });

  const register = useRegister({
    onSuccess: (response) => {
      if (response.success && response.data) {
        setAuth(response.data);
      }
    },
  });

  const logout = useLogout({
    onSuccess: () => {
      logoutStore();
    },
  });

  return { login, register, logout };
};
```

## 8. Testing

### Mock API Responses

```typescript
// __mocks__/api.service.ts
export const apiService = {
  login: jest.fn().mockResolvedValue({
    success: true,
    data: {
      user: { id: "1", name: "Test User", email: "test@example.com" },
      token: "mock-token",
      refreshToken: "mock-refresh-token",
    },
  }),
  // ... other methods
};
```

### Test Hooks

```typescript
import { renderHook, waitFor } from "@testing-library/react-hooks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLogin } from "../src/hooks/api.hooks";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

test("useLogin should handle successful login", async () => {
  const { result } = renderHook(() => useLogin(), { wrapper });

  result.current.mutate({ email: "test@example.com", password: "password" });

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });
});
```

## 9. Environment Configuration

Create environment-specific configs:

```typescript
// src/config/environment.ts
export const ENV = {
  development: {
    API_BASE_URL: "http://localhost:3000/api/v1",
    TIMEOUT: 10000,
  },
  production: {
    API_BASE_URL: "https://api.cropdisease.com/v1",
    TIMEOUT: 30000,
  },
};

export const getEnvironmentConfig = () => {
  return ENV[__DEV__ ? "development" : "production"];
};
```

## 10. Performance Optimization

### Query Optimization

```typescript
// Use select to transform data
const { data: user } = useUserProfile({
  select: (response) => response.data,
});

// Use enabled to conditionally fetch
const { data: crops } = useCrops({
  enabled: !!category,
});

// Use staleTime for caching
const { data: diseases } = useDiseases({
  staleTime: 10 * 60 * 1000, // 10 minutes
});
```

### Bundle Optimization

```typescript
// Lazy load components
const ScanScreen = lazy(() => import("./ScanScreen"));

// Code split by feature
const AuthModule = lazy(() => import("../features/auth"));
```

## Troubleshooting

### Common Issues

1. **Provider not found**: Ensure `AppProvider` wraps your app
2. **Token not persisting**: Check AsyncStorage permissions
3. **Network errors**: Verify API endpoints and network connectivity
4. **Cache issues**: Clear query cache or adjust stale times

### Debug Mode

Enable debug logging in development:

```typescript
// src/config/api.config.ts
export const DEBUG = __DEV__;

if (DEBUG) {
  console.log("API Config:", getApiConfig());
}
```

## Next Steps

1. Implement your specific API endpoints
2. Add error boundaries for better error handling
3. Implement offline support with React Query's offline capabilities
4. Add analytics and monitoring
5. Set up automated testing

This setup provides a solid foundation for your API interactions. The structure is scalable and maintainable, allowing you to easily add new features and endpoints as your application grows.
