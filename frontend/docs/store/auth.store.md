# Auth Store Documentation

## Overview

The Auth Store is a Zustand-based state management solution for handling authentication state in the Crop Disease Detection System. It provides secure token storage using `expo-secure-store` and manages user authentication state throughout the application.

## Features

### 🔐 **Secure Storage**

- **Encrypted token storage** using `expo-secure-store`
- **Platform-specific security** (Keychain on iOS, Keystore on Android)
- **Automatic encryption/decryption** of sensitive data
- **Protected from unauthorized access**

### 🔄 **State Management**

- **Persistent authentication state**
- **Automatic token management**
- **User session handling**
- **Loading and error states**

### 🛡️ **Security Features**

- **JWT token storage**
- **Refresh token management**
- **Secure logout functionality**
- **Token validation**

## Architecture

### File Structure

```
src/
├── store/
│   └── auth.store.ts          # Auth store implementation
├── interfaces/
│   └── auth.types.ts          # Auth state interface
└── utils/
    └── secureStorage.ts       # Secure storage utilities
```

### Dependencies

- **Zustand**: State management
- **expo-secure-store**: Secure storage
- **TypeScript**: Type safety

## State Interface

```typescript
interface AuthState {
  // State
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setAuth: (authData: AuthResponse) => Promise<void>;
  setUser: (user: User) => Promise<void>;
  setToken: (token: string) => Promise<void>;
  setRefreshToken: (refreshToken: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => Promise<void>;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
}
```

## State Properties

### **user: User | null**

- Current authenticated user data
- `null` when not authenticated

### **token: string | null**

- JWT access token for API requests
- Stored securely in device keychain

### **refreshToken: string | null**

- Refresh token for obtaining new access tokens
- Stored securely in device keychain

### **isAuthenticated: boolean**

- Authentication status flag
- `true` when user is logged in

### **isLoading: boolean**

- Loading state for async operations
- Used for UI loading indicators

### **error: string | null**

- Error message for failed operations
- `null` when no errors

## Actions

### **setAuth(authData: AuthResponse): Promise<void>**

Stores complete authentication data securely.

```typescript
const { setAuth } = useAuthStore();

await setAuth({
  user: { id: "1", name: "John Doe", email: "john@example.com" },
  token: "jwt-access-token",
  refreshToken: "jwt-refresh-token",
  expiresIn: 3600,
});
```

**What it does:**

- Stores tokens in secure storage
- Stores user data in secure storage
- Updates state with authentication data
- Sets `isAuthenticated` to `true`

### **setUser(user: User): Promise<void>**

Updates user data securely.

```typescript
const { setUser } = useAuthStore();

await setUser({
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  userType: "farmer",
});
```

### **setToken(token: string): Promise<void>**

Updates access token securely.

```typescript
const { setToken } = useAuthStore();

await setToken("new-jwt-access-token");
```

### **setRefreshToken(refreshToken: string): Promise<void>**

Updates refresh token securely.

```typescript
const { setRefreshToken } = useAuthStore();

await setRefreshToken("new-jwt-refresh-token");
```

### **setLoading(loading: boolean): void**

Updates loading state.

```typescript
const { setLoading } = useAuthStore();

setLoading(true); // Show loading indicator
setLoading(false); // Hide loading indicator
```

### **setError(error: string | null): void**

Sets error message.

```typescript
const { setError } = useAuthStore();

setError("Authentication failed");
setError(null); // Clear error
```

### **logout(): Promise<void>**

Securely clears all authentication data.

```typescript
const { logout } = useAuthStore();

await logout();
```

**What it does:**

- Clears tokens from secure storage
- Clears user data from secure storage
- Resets state to unauthenticated
- Sets `isAuthenticated` to `false`

### **clearError(): void**

Clears error state.

```typescript
const { clearError } = useAuthStore();

clearError();
```

### **initializeAuth(): Promise<void>**

Initializes auth state from secure storage on app startup.

```typescript
const { initializeAuth } = useAuthStore();

await initializeAuth();
```

**What it does:**

- Loads tokens from secure storage
- Loads user data from secure storage
- Restores authentication state
- Sets loading state during initialization

## Usage Examples

### 1. **Login Flow**

```typescript
import { useAuthStore } from "../src/store/auth.store";
import { useLogin } from "../src/hooks/api.hooks";

const LoginComponent = () => {
  const { setAuth, setLoading, setError } = useAuthStore();
  const loginMutation = useLogin();

  const handleLogin = async (credentials: LoginRequest) => {
    try {
      setLoading(true);
      setError(null);

      const response = await loginMutation.mutateAsync(credentials);

      if (response.success && response.data) {
        await setAuth(response.data);
        // Navigate to main app
      } else {
        setError(response.error || "Login failed");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return <Button onPress={() => handleLogin(credentials)}>Login</Button>;
};
```

### 2. **Logout Flow**

```typescript
import { useAuthStore } from "../src/store/auth.store";

const ProfileScreen = () => {
  const { user, logout, isLoading } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      // Navigate to login screen
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <View>
      <Text>Welcome, {user?.name}</Text>
      <Button onPress={handleLogout} disabled={isLoading}>
        {isLoading ? "Logging out..." : "Logout"}
      </Button>
    </View>
  );
};
```

### 3. **Token Refresh**

```typescript
import { useAuthStore } from "../src/store/auth.store";

const TokenRefreshComponent = () => {
  const { setToken, setRefreshToken, token, refreshToken } = useAuthStore();

  const refreshTokens = async () => {
    try {
      const response = await apiService.refreshToken();

      if (response.success && response.data) {
        await setToken(response.data.token);
        await setRefreshToken(response.data.refreshToken);
      }
    } catch (error) {
      // Handle refresh failure
      await logout();
    }
  };

  return null; // This would be used in interceptors
};
```

### 4. **App Initialization**

```typescript
import { useAuthStore } from "../src/store/auth.store";

const AppInitializer = () => {
  const { initializeAuth, isLoading, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      await initializeAuth();
    };

    init();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? <MainApp /> : <AuthScreen />;
};
```

## Security Implementation

### **Secure Storage Keys**

```typescript
export const SECURE_STORAGE_KEYS = {
  USER_TOKEN: "user_token",
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
} as const;
```

### **Platform-Specific Security**

- **iOS**: Uses Keychain Services for encrypted storage
- **Android**: Uses EncryptedSharedPreferences
- **Web**: Falls back to localStorage (less secure)

### **Token Storage Flow**

1. **Store**: Tokens encrypted and stored in device keychain
2. **Retrieve**: Tokens decrypted and loaded into memory
3. **Clear**: Tokens securely deleted from keychain

## Error Handling

### **Storage Errors**

```typescript
try {
  await setAuth(authData);
} catch (error) {
  console.error("Failed to store auth data:", error);
  setError("Failed to store authentication data securely");
}
```

### **Initialization Errors**

```typescript
try {
  await initializeAuth();
} catch (error) {
  console.error("Failed to initialize auth:", error);
  setError("Failed to load authentication data");
}
```

## Best Practices

### 1. **Always Handle Async Operations**

```typescript
// ✅ Good
const handleLogin = async () => {
  try {
    await setAuth(authData);
  } catch (error) {
    // Handle error
  }
};

// ❌ Bad
const handleLogin = () => {
  setAuth(authData); // Missing await and error handling
};
```

### 2. **Check Authentication Status**

```typescript
const { isAuthenticated, user } = useAuthStore();

if (!isAuthenticated || !user) {
  // Redirect to login
  return <LoginScreen />;
}
```

### 3. **Handle Loading States**

```typescript
const { isLoading } = useAuthStore();

if (isLoading) {
  return <LoadingSpinner />;
}
```

### 4. **Clear Errors Appropriately**

```typescript
const { error, clearError } = useAuthStore();

useEffect(() => {
  if (error) {
    // Show error message
    setTimeout(clearError, 5000); // Auto-clear after 5 seconds
  }
}, [error]);
```

## Integration with HTTP Client

The auth store integrates with the HTTP client for automatic token management:

```typescript
// HTTP client automatically uses tokens from auth store
const { token, refreshToken } = useAuthStore.getState();

if (token) {
  // HTTP client adds Authorization header
  const response = await httpClient.get("/api/user/profile");
}
```

## Testing

### **Unit Testing**

```typescript
import { renderHook, act } from "@testing-library/react-hooks";
import { useAuthStore } from "../src/store/auth.store";

test("should set auth data", async () => {
  const { result } = renderHook(() => useAuthStore());

  await act(async () => {
    await result.current.setAuth(mockAuthData);
  });

  expect(result.current.isAuthenticated).toBe(true);
  expect(result.current.user).toEqual(mockAuthData.user);
});
```

### **Integration Testing**

```typescript
test("should persist auth data across app restarts", async () => {
  // Set auth data
  await useAuthStore.getState().setAuth(mockAuthData);

  // Simulate app restart
  // Re-initialize store
  await useAuthStore.getState().initializeAuth();

  // Verify data persisted
  const state = useAuthStore.getState();
  expect(state.isAuthenticated).toBe(true);
});
```

## Troubleshooting

### **Common Issues**

1. **Tokens not persisting**

   - Check if secure storage is available
   - Verify platform permissions
   - Check for storage errors

2. **Authentication state not restoring**

   - Ensure `initializeAuth()` is called on app startup
   - Check secure storage availability
   - Verify token format and validity

3. **Security errors**
   - Check device security settings
   - Verify app permissions
   - Test on different platforms

### **Debug Mode**

```typescript
// Enable debug logging
if (__DEV__) {
  console.log("Auth State:", useAuthStore.getState());
}
```

## Migration from AsyncStorage

If migrating from AsyncStorage to secure storage:

1. **Install expo-secure-store**
2. **Update store implementation**
3. **Test on all platforms**
4. **Clear old AsyncStorage data**

## Conclusion

The Auth Store provides a secure, reliable, and easy-to-use solution for managing authentication state in React Native applications. It ensures sensitive data is protected while maintaining a clean API for developers.

For more information, see:

- [App Store Documentation](./app.store.md)
- [Secure Storage Documentation](../utils/secureStorage.md)
- [API Structure Documentation](../module/API_STRUCTURE.md)
