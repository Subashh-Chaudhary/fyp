# API Structure Implementation

## 🚀 Overview

This implementation provides a comprehensive, production-ready API calling structure for the Crop Disease Detection System. It uses modern React patterns with TanStack Query for data fetching, Zustand for state management, and a robust HTTP client with middleware.

## 📁 Project Structure

```
src/
├── config/
│   └── api.config.ts          # API configuration and endpoints
├── interfaces/
│   └── api.types.ts           # TypeScript interfaces and types
├── services/
│   ├── http.client.ts         # HTTP client with axios
│   └── api.service.ts         # High-level API service methods
├── hooks/
│   └── api.hooks.ts           # TanStack Query hooks
├── store/
│   ├── auth.store.ts          # Authentication state (Zustand)
│   └── app.store.ts           # App state (Zustand)
├── middleware/
│   └── auth.middleware.ts     # Authentication and route middleware
├── providers/
│   ├── query.provider.tsx     # TanStack Query provider
│   └── app.provider.tsx       # Main app provider
└── index.ts                   # Main exports

docs/api/
├── API_STRUCTURE.md           # Detailed API documentation
├── SETUP_GUIDE.md            # Quick setup guide
└── README.md                 # This file
```

## 🛠️ Technologies Used

- **TanStack Query**: Data fetching, caching, and synchronization
- **Zustand**: Lightweight state management with persistence
- **Axios**: HTTP client with interceptors and retry logic
- **TypeScript**: Type safety and better developer experience
- **AsyncStorage**: Persistent storage for React Native

## ✨ Key Features

### 🔐 Authentication

- JWT token management with automatic refresh
- Persistent authentication state
- Route protection middleware
- Token validation and expiration handling

### 📡 API Communication

- Centralized HTTP client with interceptors
- Automatic retry logic with exponential backoff
- Request/response transformation
- Error handling and logging

### 💾 State Management

- Persistent authentication state
- App-wide state management
- Optimistic updates
- Background synchronization

### 🎯 Data Fetching

- Automatic caching and invalidation
- Background refetching
- Optimistic updates
- Error boundaries and retry logic

### 🛡️ Error Handling

- Global error handling
- Component-level error states
- Network error recovery
- User-friendly error messages

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools axios zustand
```

### 2. Wrap Your App

```typescript
// app/_layout.tsx
import { AppProvider } from "../src/providers/app.provider";

export default function RootLayout() {
  return <AppProvider>{/* Your app content */}</AppProvider>;
}
```

### 3. Use in Components

```typescript
import { useLogin, useUserProfile } from "../src/hooks/api.hooks";
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

  return (
    <Button onPress={() => loginMutation.mutate(credentials)}>Login</Button>
  );
}
```

## 📚 Available Hooks

### Authentication

- `useLogin()` - User login
- `useRegister()` - User registration
- `useLogout()` - User logout
- `useForgotPassword()` - Password reset request
- `useResetPassword()` - Password reset
- `useUserProfile()` - Get user profile

### Data Management

- `useCrops()` - Get crops list
- `useDiseases()` - Get diseases list
- `useScanHistory()` - Get scan history
- `useScanResult()` - Get specific scan result
- `useUploadImage()` - Upload image for scanning
- `useBatchUpload()` - Upload multiple images

### Analytics

- `useDashboardStats()` - Dashboard statistics
- `useScanStats()` - Scan statistics
- `useCropStats()` - Crop statistics

## 🏪 State Stores

### Auth Store

```typescript
const { user, isAuthenticated, setAuth, logout } = useAuthStore();
```

### App Store

```typescript
const { theme, scanHistory, setTheme, addScanToHistory } = useAppStore();
```

## 🔧 Configuration

### API Configuration

```typescript
// src/config/api.config.ts
export const API_CONFIG = {
  BASE_URL: "https://api.cropdisease.com/v1",
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  // ... more config
};
```

### Environment-Specific Settings

```typescript
const config = getApiConfig(); // Automatically detects environment
```

## 🧪 Testing

### Unit Testing

```typescript
import { renderHook } from "@testing-library/react-hooks";
import { useLogin } from "../src/hooks/api.hooks";

test("useLogin should handle authentication", async () => {
  const { result } = renderHook(() => useLogin());
  // Test implementation
});
```

### Integration Testing

- Test complete authentication flow
- Test data fetching and caching
- Test error scenarios

## 🔍 Debugging

### Development Tools

- React Query DevTools (available in development)
- Network tab monitoring
- Console logging for debugging

### Common Issues

1. **Token refresh loops** - Check token expiration logic
2. **Cache inconsistencies** - Verify query key patterns
3. **Network errors** - Check API endpoints and connectivity

## 📈 Performance

### Optimizations

- Automatic caching with configurable stale times
- Background refetching
- Optimistic updates
- Request deduplication
- Exponential backoff for retries

### Best Practices

- Use appropriate stale times for different data types
- Implement pagination for large datasets
- Use query keys consistently
- Handle loading and error states

## 🔒 Security

### Features

- JWT token management
- Automatic token refresh
- Secure token storage
- Route protection
- Network security

### Best Practices

- Validate tokens on app startup
- Clear sensitive data on logout
- Use HTTPS in production
- Implement proper error handling

## 📖 Documentation

- [API Structure Documentation](./API_STRUCTURE.md) - Detailed technical documentation
- [Setup Guide](./SETUP_GUIDE.md) - Quick start and implementation guide

## 🤝 Contributing

1. Follow the established patterns
2. Add proper TypeScript types
3. Include error handling
4. Write tests for new features
5. Update documentation

## 📄 License

This implementation is part of the Crop Disease Detection System project.

## 🆘 Support

For issues and questions:

1. Check the troubleshooting section in the documentation
2. Review the example implementations
3. Check the TypeScript types for guidance
4. Refer to the TanStack Query and Zustand documentation

---

**Built with ❤️ for the Crop Disease Detection System**
