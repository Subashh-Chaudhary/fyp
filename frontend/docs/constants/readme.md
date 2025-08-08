# Constants Directory Documentation

## Overview

The `constants/` directory contains all application constants organized by concern to maintain clean separation of responsibilities and improve maintainability.

## Directory Structure

```
constants/
├── index.ts          # Barrel export file - re-exports all constants
├── api.ts            # API configuration and endpoints
├── app.ts            # App-specific constants
├── routes.ts         # Route definitions
├── ui.ts             # UI design tokens and styling
├── status.ts         # HTTP status codes
├── errors.ts         # Error messages
└── Colors.ts         # Legacy color definitions (Expo Router)
```

## File Descriptions

### 📁 `index.ts` - Barrel Export

**Purpose**: Central export point for all constants
**Usage**: Import multiple constants from a single location

```typescript
// Import everything (backward compatible)
import { ROUTES, API_ENDPOINTS, COLORS, STATUS_CODES } from "../constants";

// Or import specific concerns
import { API_ENDPOINTS } from "../constants/api";
import { COLORS } from "../constants/ui";
```

### 🔌 `api.ts` - API Configuration & Endpoints

**Purpose**: All API-related constants including configuration, endpoints, and storage keys

#### `API_CONFIG`

Base configuration for HTTP client:

```typescript
export const API_CONFIG = {
  BASE_URL: "https://api.cropdisease.com/v1",
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};
```

#### `API_ENDPOINTS`

Complete endpoint definitions organized by feature:

```typescript
export const API_ENDPOINTS = {
  BASE_URL: API_CONFIG.BASE_URL,
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/auth/verify-email",
  },
  USER: {
    PROFILE: "/user/profile",
    UPDATE_PROFILE: "/user/profile",
    CHANGE_PASSWORD: "/user/change-password",
    DELETE_ACCOUNT: "/user/delete-account",
  },
  SCAN: {
    UPLOAD: "/scan/upload",
    RESULT: "/scan/result",
    HISTORY: "/scan/history",
    DELETE: "/scan/delete",
    BATCH_UPLOAD: "/scan/batch-upload",
  },
  CROPS: {
    LIST: "/crops",
    DETAIL: "/crops/:id",
    SEARCH: "/crops/search",
  },
  DISEASES: {
    LIST: "/diseases",
    DETAIL: "/diseases/:id",
    BY_CROP: "/diseases/crop/:cropId",
    SEARCH: "/diseases/search",
  },
  ANALYTICS: {
    DASHBOARD: "/analytics/dashboard",
    SCAN_STATS: "/analytics/scan-stats",
    CROP_STATS: "/analytics/crop-stats",
  },
};
```

#### `STORAGE_KEYS`

Local storage key definitions:

```typescript
export const STORAGE_KEYS = {
  USER_TOKEN: "user_token",
  USER_DATA: "user_data",
  THEME: "theme",
  FIRST_LAUNCH: "first_launch",
  SCAN_HISTORY: "scan_history",
};
```

### 🎯 `app.ts` - Application Constants

**Purpose**: App-specific constants and business logic enums

```typescript
// App metadata
export const APP_NAME = "Crop Disease Detection System";
export const APP_VERSION = "1.0.0";

// Disease severity levels
export const DISEASE_SEVERITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
} as const;

// User types
export const USER_TYPES = {
  FARMER: "farmer",
  EXPERT: "expert",
} as const;

// Scan status
export const SCAN_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

// Image quality settings
export const IMAGE_SETTINGS = {
  MAX_WIDTH: 1024,
  MAX_HEIGHT: 1024,
  QUALITY: 0.8,
  FORMAT: "jpeg",
} as const;
```

### 🛣️ `routes.ts` - Route Definitions

**Purpose**: Application navigation routes

```typescript
export const ROUTES = {
  WELCOME: "/welcome",
  HOME: "/(tabs)/",
  FEED: "/(tabs)/feed",
  SCAN: "/(tabs)/scan",
  HISTORY: "/(tabs)/history",
  SETTINGS: "/(tabs)/settings",
  RESULT: "/result",
} as const;
```

### 🎨 `ui.ts` - UI Design Tokens

**Purpose**: Design system constants for consistent UI

#### `COLORS` - Color Palette

```typescript
export const COLORS = {
  primary: { 50: '#f0fdf4', /* ... */, 900: '#14532d' },
  secondary: { 50: '#fefce8', /* ... */, 900: '#713f12' },
  danger: { 50: '#fef2f2', /* ... */, 900: '#7f1d1d' },
  neutral: { 50: '#fafafa', /* ... */, 900: '#171717' },
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
}
```

#### `FONT_SIZES` - Typography Scale

```typescript
export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
};
```

#### `SPACING` - Layout Spacing

```typescript
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
  "3xl": 64,
};
```

#### `BORDER_RADIUS` - Component Styling

```typescript
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 24,
  full: 9999,
};
```

#### `SCREEN` - Screen Dimensions

```typescript
export const SCREEN = {
  width: 375, // Default iPhone width
  height: 812, // Default iPhone height
};
```

### 📊 `status.ts` - HTTP Status Codes

**Purpose**: HTTP response status codes

```typescript
export const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};
```

### ❌ `errors.ts` - Error Messages

**Purpose**: Standardized error messages

```typescript
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  TIMEOUT_ERROR: "Request timeout. Please try again.",
  UNAUTHORIZED: "Unauthorized access. Please login again.",
  FORBIDDEN: "Access forbidden. You don't have permission.",
  NOT_FOUND: "Resource not found.",
  SERVER_ERROR: "Server error. Please try again later.",
  UNKNOWN_ERROR: "An unknown error occurred.",
};
```

### 🎨 `Colors.ts` - Legacy Color System

**Purpose**: Expo Router theme colors (legacy)
**Note**: Consider migrating to `ui.ts` COLORS for consistency

```typescript
export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: "#0a7ea4",
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: "#0a7ea4",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: "#fff",
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#fff",
  },
};
```

## Usage Examples

### API Service Usage

```typescript
import { API_ENDPOINTS, STATUS_CODES, ERROR_MESSAGES } from "../constants";

// Make API call
const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(credentials),
});

// Handle response
if (response.status === STATUS_CODES.UNAUTHORIZED) {
  throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
}
```

### UI Component Usage

```typescript
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from "../constants";

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary[50],
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.neutral[900],
  },
});
```

### Navigation Usage

```typescript
import { ROUTES } from "../constants";

navigation.navigate(ROUTES.SCAN);
```

### App Logic Usage

```typescript
import { DISEASE_SEVERITY, SCAN_STATUS, USER_TYPES } from "../constants";

if (user.type === USER_TYPES.FARMER) {
  // Handle farmer-specific logic
}

if (scan.status === SCAN_STATUS.COMPLETED) {
  // Handle completed scan
}
```

## Best Practices

### ✅ Do's

- Import specific constants from their respective files for better tree-shaking
- Use TypeScript's `as const` for type safety
- Group related constants together
- Use descriptive, consistent naming conventions
- Document complex constants with comments

### ❌ Don'ts

- Don't duplicate constants across files
- Don't import entire constants directory when you only need specific values
- Don't hardcode values that should be constants
- Don't mix concerns in a single constants file

## Migration Guide

### From Monolithic Constants

If migrating from a single constants file:

1. **Identify concerns**: Group constants by their purpose
2. **Create separate files**: Move constants to appropriate files
3. **Update imports**: Change import statements to use specific files
4. **Update barrel export**: Ensure `index.ts` re-exports everything
5. **Test thoroughly**: Verify all imports work correctly

### Example Migration

```typescript
// Before (monolithic)
import { ROUTES, API_ENDPOINTS, COLORS } from "../constants";

// After (concern-based)
import { ROUTES } from "../constants/routes";
import { API_ENDPOINTS } from "../constants/api";
import { COLORS } from "../constants/ui";
```

## TypeScript Benefits

All constants use `as const` for:

- **Type Safety**: Prevents accidental mutations
- **IntelliSense**: Better IDE autocomplete
- **Compile-time Checks**: Catches errors early
- **Narrow Types**: More precise type inference

```typescript
// With 'as const'
const STATUS = { SUCCESS: 200, ERROR: 400 } as const;
// Type: { readonly SUCCESS: 200; readonly ERROR: 400 }

// Without 'as const'
const STATUS = { SUCCESS: 200, ERROR: 400 };
// Type: { SUCCESS: number; ERROR: number }
```

## Contributing

When adding new constants:

1. **Choose the right file**: Place constants in the appropriate concern-based file
2. **Follow naming conventions**: Use UPPER_SNAKE_CASE for constants
3. **Add TypeScript types**: Use `as const` for type safety
4. **Update documentation**: Add examples and usage notes
5. **Test imports**: Verify the constant can be imported correctly

---

_This documentation is maintained alongside the constants directory. Update this file when adding new constants or changing the structure._
