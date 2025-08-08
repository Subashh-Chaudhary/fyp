# Store Documentation

## Overview

This directory contains comprehensive documentation for the state management stores used in the Crop Disease Detection System. The application uses Zustand for state management with two main stores:

- **Auth Store**: Handles authentication state with secure storage
- **App Store**: Manages general application state with persistence

## Store Architecture

### **Technology Stack**

- **Zustand**: Lightweight state management
- **expo-secure-store**: Secure storage for sensitive data
- **AsyncStorage**: Persistent storage for app data
- **TypeScript**: Type safety and interfaces

### **File Structure**

```
src/
├── store/
│   ├── auth.store.ts          # Authentication state
│   └── app.store.ts           # Application state
├── interfaces/
│   ├── auth.types.ts          # Auth state interface
│   └── app.types.ts           # App state interface
└── utils/
    └── secureStorage.ts       # Secure storage utilities
```

## Store Comparison

| Feature         | Auth Store                         | App Store                         |
| --------------- | ---------------------------------- | --------------------------------- |
| **Purpose**     | Authentication & user data         | App settings & preferences        |
| **Storage**     | Secure storage (Keychain/Keystore) | AsyncStorage                      |
| **Data Type**   | Sensitive (tokens, user info)      | Non-sensitive (settings, history) |
| **Persistence** | Encrypted                          | Standard                          |
| **Security**    | High (platform-specific)           | Standard                          |
| **Performance** | Optimized for security             | Optimized for speed               |

## Quick Start

### **1. Install Dependencies**

```bash
npm install zustand expo-secure-store @react-native-async-storage/async-storage
```

### **2. Import Stores**

```typescript
import { useAuthStore } from "../src/store/auth.store";
import { useAppStore } from "../src/store/app.store";
```

### **3. Basic Usage**

```typescript
// Auth Store
const { user, isAuthenticated, setAuth, logout } = useAuthStore();

// App Store
const { theme, setTheme, scanHistory, addScanToHistory } = useAppStore();
```

## Store Integration

### **Provider Setup**

```typescript
// app/_layout.tsx
import { AppProvider } from "../src/providers/app.provider";

export default function RootLayout() {
  return <AppProvider>{/* Your app content */}</AppProvider>;
}
```

### **Store Initialization**

```typescript
// Auth store initializes automatically with secure storage
const { initializeAuth } = useAuthStore();

// App store initializes automatically with AsyncStorage
const { theme, isFirstLaunch } = useAppStore();
```

## Common Patterns

### **Authentication Flow**

```typescript
const LoginComponent = () => {
  const { setAuth } = useAuthStore();

  const handleLogin = async (credentials) => {
    const response = await apiService.login(credentials);
    if (response.success) {
      await setAuth(response.data);
    }
  };
};
```

### **Theme Management**

```typescript
const ThemeToggle = () => {
  const { theme, setTheme } = useAppStore();

  return (
    <Button onPress={() => setTheme(theme === "light" ? "dark" : "light")}>
      Toggle Theme
    </Button>
  );
};
```

### **Data Persistence**

```typescript
// Auth data persists securely
const { user } = useAuthStore(); // Automatically loaded from secure storage

// App data persists in AsyncStorage
const { scanHistory } = useAppStore(); // Automatically loaded from AsyncStorage
```

## Security Considerations

### **Auth Store Security**

- ✅ **Encrypted storage** using platform keychains
- ✅ **Token validation** and expiration handling
- ✅ **Secure logout** with data clearing
- ✅ **Protected from unauthorized access**

### **App Store Security**

- ✅ **Non-sensitive data** only
- ✅ **Standard persistence** with AsyncStorage
- ✅ **Data validation** and cleanup
- ✅ **Performance optimized**

## Performance Optimization

### **Selective State Access**

```typescript
// ✅ Good - Only re-renders when needed
const theme = useAppStore((state) => state.theme);
const user = useAuthStore((state) => state.user);

// ❌ Bad - Re-renders on any state change
const { theme, user } = useAppStore();
```

### **Batch Updates**

```typescript
// Update multiple properties at once
useAppStore.setState({
  theme: "dark",
  notifications: false,
  language: "es",
});
```

## Error Handling

### **Auth Store Errors**

```typescript
const { error, setError, clearError } = useAuthStore();

if (error) {
  // Handle authentication errors
  setTimeout(clearError, 5000); // Auto-clear after 5 seconds
}
```

### **App Store Errors**

```typescript
// Handle storage errors gracefully
try {
  await addScanToHistory(scanData);
} catch (error) {
  console.error("Failed to save scan:", error);
  // Fallback handling
}
```

## Testing

### **Unit Testing**

```typescript
import { renderHook, act } from "@testing-library/react-hooks";

test("auth store should handle login", async () => {
  const { result } = renderHook(() => useAuthStore());

  await act(async () => {
    await result.current.setAuth(mockAuthData);
  });

  expect(result.current.isAuthenticated).toBe(true);
});
```

### **Integration Testing**

```typescript
test("stores should work together", () => {
  // Test interaction between auth and app stores
  const authState = useAuthStore.getState();
  const appState = useAppStore.getState();

  // Verify state consistency
  expect(authState.isAuthenticated).toBeDefined();
  expect(appState.theme).toBeDefined();
});
```

## Migration Guide

### **From Redux**

1. Replace Redux store with Zustand stores
2. Update component imports and hooks
3. Convert reducers to actions
4. Update persistence configuration

### **From Context API**

1. Replace Context providers with Zustand stores
2. Remove Context wrapper components
3. Update component state access
4. Test state persistence

### **From AsyncStorage Only**

1. Install expo-secure-store
2. Update auth store to use secure storage
3. Keep app store with AsyncStorage
4. Test on all platforms

## Best Practices

### **1. Use Appropriate Storage**

- **Auth Store**: For sensitive data (tokens, user info)
- **App Store**: For non-sensitive data (settings, history)

### **2. Handle Async Operations**

```typescript
// Always await auth store operations
await setAuth(authData);
await logout();

// App store operations are synchronous
setTheme("dark");
addScanToHistory(scan);
```

### **3. Validate Data**

```typescript
// Validate before storing
if (scan && scan.id) {
  addScanToHistory(scan);
}
```

### **4. Clean Up Data**

```typescript
// Regular cleanup for app store
useEffect(() => {
  const cleanup = setInterval(cleanupOldData, 24 * 60 * 60 * 1000);
  return () => clearInterval(cleanup);
}, []);
```

## Troubleshooting

### **Common Issues**

1. **Auth data not persisting**

   - Check secure storage availability
   - Verify platform permissions
   - Test on different devices

2. **App data not persisting**

   - Check AsyncStorage permissions
   - Verify storage configuration
   - Clear and reinstall app

3. **Performance issues**
   - Use selective state access
   - Avoid unnecessary re-renders
   - Implement data cleanup

### **Debug Mode**

```typescript
if (__DEV__) {
  console.log("Auth State:", useAuthStore.getState());
  console.log("App State:", useAppStore.getState());
}
```

## Documentation Index

### **Store Documentation**

- [Auth Store](./auth.store.md) - Complete auth store documentation
- [App Store](./app.store.md) - Complete app store documentation

### **Related Documentation**

- [API Structure](../module/API_STRUCTURE.md) - API and data fetching
- [Secure Storage](../utils/secureStorage.md) - Secure storage utilities
- [Setup Guide](../module/SETUP_GUIDE.md) - Quick start guide

## Support

For issues and questions:

1. Check the troubleshooting sections in individual store docs
2. Review the example implementations
3. Check the TypeScript interfaces for guidance
4. Refer to the Zustand documentation

## Contributing

When contributing to the stores:

1. Follow the established patterns
2. Add proper TypeScript types
3. Include error handling
4. Write tests for new features
5. Update documentation

---

**Built with ❤️ for the Crop Disease Detection System**
