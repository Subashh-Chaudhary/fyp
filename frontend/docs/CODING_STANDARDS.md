# Coding Standards

## Overview

This document outlines the coding standards and best practices for the Crop Disease Detection System frontend application. Following these standards ensures code consistency, maintainability, and quality across the project.

## 🎯 General Principles

### 1. Code Quality

- **Readability**: Code should be self-documenting and easy to understand
- **Maintainability**: Code should be easy to modify and extend
- **Testability**: Code should be designed for easy testing
- **Performance**: Code should be efficient and optimized

### 2. Consistency

- **Naming Conventions**: Consistent naming across the codebase
- **Code Style**: Uniform formatting and structure
- **Patterns**: Consistent use of design patterns
- **Architecture**: Uniform architectural decisions

## 📝 TypeScript Standards

### 1. Type Safety

```typescript
// ✅ Good: Explicit typing
interface User {
  id: string;
  name: string;
  email: string;
}

const getUser = async (id: string): Promise<User> => {
  // Implementation
};

// ❌ Bad: Implicit any
const getUser = async (id) => {
  // Implementation
};
```

### 2. Interface Design

```typescript
// ✅ Good: Specific interfaces
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

// ❌ Bad: Generic interfaces
interface ApiRequest {
  [key: string]: unknown;
}
```

### 3. Type Guards

```typescript
// ✅ Good: Type guards for runtime type checking
const isUser = (obj: unknown): obj is User => {
  return (
    obj !== null && typeof obj === "object" && "id" in obj && "name" in obj
  );
};

// ❌ Bad: Type assertions without validation
const user = obj as User;
```

### 4. Generic Types

```typescript
// ✅ Good: Generic types for reusability
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

// ❌ Bad: Duplicate interfaces
interface UserResponse {
  success: boolean;
  data: User;
  message: string;
}
```

## 🏗️ React Component Standards

### 1. Component Structure

```typescript
// ✅ Good: Organized component structure
import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = useCallback(() => {
    setIsPressed(true);
    onPress();
    setTimeout(() => setIsPressed(false), 100);
  }, [onPress]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      style={[styles.button, disabled && styles.disabled]}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#007AFF",
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
```

### 2. Props Interface

```typescript
// ✅ Good: Comprehensive props interface
interface CardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onPress?: () => void;
  variant?: "default" | "elevated" | "outlined";
  disabled?: boolean;
}

// ❌ Bad: Incomplete props interface
interface CardProps {
  title: string;
  children: ReactNode;
}
```

### 3. Component Naming

```typescript
// ✅ Good: Descriptive component names
export const UserProfileCard = () => {};
export const DiseaseDetectionButton = () => {};
export const ScanResultItem = () => {};

// ❌ Bad: Generic component names
export const Card = () => {};
export const Button = () => {};
export const Item = () => {};
```

## 🎣 Custom Hooks Standards

### 1. Hook Structure

```typescript
// ✅ Good: Well-structured custom hook
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.login(credentials);
      setUser(response.user);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  }, []);

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated: user !== null,
  };
};
```

### 2. Hook Naming

```typescript
// ✅ Good: Descriptive hook names
export const useUserAuthentication = () => {};
export const useDiseaseDetection = () => {};
export const useScanHistory = () => {};

// ❌ Bad: Generic hook names
export const useAuth = () => {};
export const useData = () => {};
export const useState = () => {};
```

### 3. Hook Dependencies

```typescript
// ✅ Good: Proper dependency management
const login = useCallback(async (credentials: LoginRequest) => {
  // Implementation
}, []); // Empty dependency array for stable reference

const handleSubmit = useCallback(() => {
  login(formData);
}, [login, formData]); // Include all dependencies
```

## 🔌 Service Layer Standards

### 1. Service Structure

```typescript
// ✅ Good: Well-structured service class
export class AuthService {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await this.httpClient.post<AuthApiResponse>(
        "/auth/login",
        credentials
      );

      return this.transformResponse(response);
    } catch (error) {
      throw this.handleError(error, "login");
    }
  }

  private transformResponse(response: AuthApiResponse): AuthResponse {
    return {
      user: this.transformUser(response.data.user),
      token: response.data.access_token,
    };
  }

  private handleError(error: unknown, operation: string): Error {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Error(`Auth service ${operation} failed: ${message}`);
  }
}
```

### 2. Error Handling

```typescript
// ✅ Good: Comprehensive error handling
private handleError(error: unknown, context: string): never {
  if (error instanceof NetworkError) {
    throw new Error(`Network error in ${context}: ${error.message}`);
  }

  if (error instanceof ValidationError) {
    throw new Error(`Validation error in ${context}: ${error.message}`);
  }

  if (error instanceof ApiError) {
    throw new Error(`API error in ${context}: ${error.message}`);
  }

  // Fallback for unknown errors
  const message = error instanceof Error ? error.message : 'Unknown error';
  throw new Error(`Unexpected error in ${context}: ${message}`);
}
```

## 🗄️ State Management Standards

### 1. Store Structure

```typescript
// ✅ Good: Well-organized Zustand store
export const useAuthStore = create<AuthState>((set, get) => ({
  // State
  user: null,
  token: null,
  isLoading: false,
  error: null,

  // Actions
  setAuth: async (authData: AuthResponse) => {
    try {
      await secureStorage.storeTokens(authData.token);
      set({
        user: authData.user,
        token: authData.token,
        error: null,
      });
    } catch (error) {
      set({ error: "Failed to store authentication data" });
    }
  },

  clearAuth: async () => {
    try {
      await secureStorage.clearTokens();
      set({
        user: null,
        token: null,
        error: null,
      });
    } catch (error) {
      console.error("Failed to clear auth data:", error);
    }
  },

  // Computed values
  isAuthenticated: (state) => state.user !== null && state.token !== null,
}));
```

### 2. State Updates

```typescript
// ✅ Good: Immutable state updates
set((state) => ({
  ...state,
  user: newUser,
  lastUpdated: new Date().toISOString(),
}));

// ❌ Bad: Mutable state updates
set((state) => {
  state.user = newUser; // Mutating state directly
  return state;
});
```

## 📝 Naming Conventions

### 1. Files and Directories

```typescript
// ✅ Good: Descriptive file names
components / ui / Button.tsx;
Card.tsx;
Input.tsx;
forms / LoginForm.tsx;
RegistrationForm.tsx;
layout / Header.tsx;
Footer.tsx;

// ❌ Bad: Generic file names
components / ui / btn.tsx;
card.tsx;
input.tsx;
```

### 2. Variables and Functions

```typescript
// ✅ Good: Descriptive names
const userAuthenticationToken = "jwt_token";
const handleUserLogin = () => {};
const isUserAuthenticated = user !== null;

// ❌ Bad: Abbreviated names
const token = "jwt_token";
const login = () => {};
const auth = user !== null;
```

### 3. Constants

```typescript
// ✅ Good: Uppercase constants
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },
} as const;

export const STORAGE_KEYS = {
  USER_TOKEN: "user_token",
  USER_DATA: "user_data",
} as const;

// ❌ Bad: Lowercase constants
export const apiEndpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },
};
```

## 🧪 Testing Standards

### 1. Test Structure

```typescript
// ✅ Good: Well-organized test structure
describe("AuthService", () => {
  let authService: AuthService;
  let mockHttpClient: jest.Mocked<HttpClient>;

  beforeEach(() => {
    mockHttpClient = createMockHttpClient();
    authService = new AuthService(mockHttpClient);
  });

  describe("login", () => {
    it("should successfully authenticate user with valid credentials", async () => {
      // Arrange
      const credentials: LoginRequest = {
        email: "test@example.com",
        password: "password123",
      };
      const expectedResponse: AuthResponse = {
        user: mockUser,
        token: "jwt_token",
      };
      mockHttpClient.post.mockResolvedValue(expectedResponse);

      // Act
      const result = await authService.login(credentials);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        "/auth/login",
        credentials
      );
    });

    it("should throw error for invalid credentials", async () => {
      // Arrange
      const credentials: LoginRequest = {
        email: "invalid@example.com",
        password: "wrongpassword",
      };
      const error = new Error("Invalid credentials");
      mockHttpClient.post.mockRejectedValue(error);

      // Act & Assert
      await expect(authService.login(credentials)).rejects.toThrow(
        "Invalid credentials"
      );
    });
  });
});
```

### 2. Test Naming

```typescript
// ✅ Good: Descriptive test names
it("should return user data when authentication is successful");
it("should throw validation error when email is invalid");
it("should update loading state during API call");

// ❌ Bad: Generic test names
it("should work");
it("should handle error");
it("should update state");
```

## 🔧 Code Organization

### 1. Import Order

```typescript
// ✅ Good: Organized imports
// 1. React and React Native
import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";

// 2. Third-party libraries
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// 3. Local imports
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { LoginForm } from "@/types/auth.types";

// 4. Styles
import { styles } from "./styles";
```

### 2. Function Organization

```typescript
// ✅ Good: Logical function organization
export const LoginScreen: React.FC = () => {
  // 1. Hooks and state
  const { login, isLoading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  // 2. Form setup
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(loginSchema),
  });

  // 3. Event handlers
  const onSubmit = useCallback(
    async (data: LoginForm) => {
      try {
        await login(data);
      } catch (error) {
        console.error("Login failed:", error);
      }
    },
    [login]
  );

  // 4. Render
  return <View style={styles.container}>{/* Component JSX */}</View>;
};
```

## 📚 Documentation Standards

### 1. JSDoc Comments

```typescript
/**
 * Authenticates a user with email and password
 * @param credentials - User login credentials
 * @returns Promise resolving to authentication response
 * @throws {ValidationError} When credentials are invalid
 * @throws {NetworkError} When network request fails
 * @throws {ApiError} When API returns an error
 */
async login(credentials: LoginRequest): Promise<AuthResponse> {
  // Implementation
}
```

### 2. README Files

````markdown
# Component Name

Brief description of what this component does.

## Props

| Prop    | Type       | Required | Default | Description           |
| ------- | ---------- | -------- | ------- | --------------------- |
| title   | string     | Yes      | -       | The title to display  |
| onPress | () => void | No       | -       | Callback when pressed |

## Usage

```tsx
import { ComponentName } from "@/components/ComponentName";

<ComponentName title="Hello World" onPress={() => console.log("Pressed!")} />;
```
````

## Examples

- Basic usage
- With custom styling
- With event handling

````

## 🚫 Anti-Patterns to Avoid

### 1. Type Safety
```typescript
// ❌ Bad: Using any type
const handleData = (data: any) => {
  console.log(data.someProperty);
};

// ✅ Good: Proper typing
const handleData = (data: UserData) => {
  console.log(data.someProperty);
};
````

### 2. Error Handling

```typescript
// ❌ Bad: Swallowing errors
try {
  await apiCall();
} catch (error) {
  // Silent failure
}

// ✅ Good: Proper error handling
try {
  await apiCall();
} catch (error) {
  console.error("API call failed:", error);
  setError("Failed to complete operation");
}
```

### 3. Performance

```typescript
// ❌ Bad: Creating functions in render
const Component = () => {
  const handleClick = () => {
    // This creates a new function on every render
  };

  return <Button onPress={handleClick} />;
};

// ✅ Good: Using useCallback
const Component = () => {
  const handleClick = useCallback(() => {
    // Function is memoized
  }, []);

  return <Button onPress={handleClick} />;
};
```

## 🔍 Code Review Checklist

### 1. Functionality

- [ ] Does the code work as intended?
- [ ] Are edge cases handled?
- [ ] Is error handling appropriate?
- [ ] Are performance considerations addressed?

### 2. Code Quality

- [ ] Is the code readable and self-documenting?
- [ ] Are naming conventions followed?
- [ ] Is the code DRY (Don't Repeat Yourself)?
- [ ] Are functions and components focused and single-purpose?

### 3. Testing

- [ ] Are tests written for new functionality?
- [ ] Do tests cover edge cases?
- [ ] Are tests readable and maintainable?
- [ ] Do tests follow naming conventions?

### 4. Documentation

- [ ] Is the code self-documenting?
- [ ] Are complex algorithms documented?
- [ ] Are API interfaces documented?
- [ ] Are examples provided where helpful?

---

Following these coding standards ensures that our codebase remains maintainable, readable, and of high quality. All team members should familiarize themselves with these standards and apply them consistently in their work.
