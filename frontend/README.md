# Crop Disease Detection System - Frontend

A modern, well-structured React Native/Expo application for detecting crop diseases using AI-powered image analysis.

## 🚀 Features

- **Modern Architecture**: Built with React Native, Expo, and TypeScript
- **Clean Code Structure**: Follows industry best practices and modern patterns
- **Type Safety**: Full TypeScript implementation with strict mode
- **State Management**: Zustand for lightweight, performant state management
- **API Integration**: React Query for efficient data fetching and caching
- **Form Validation**: Yup schema validation with React Hook Form
- **Secure Storage**: Expo SecureStore for sensitive data
- **Error Handling**: Comprehensive error boundaries and user-friendly error messages
- **Testing**: Jest and React Native Testing Library setup
- **Code Quality**: ESLint with modern React/TypeScript rules

## 🏗️ Project Structure

```
frontend/
├── app/                    # Expo Router app directory
│   ├── (auth)/            # Authentication routes
│   ├── (tabs)/            # Main app tabs
│   └── _layout.tsx        # Root layout
├── components/             # Reusable UI components
│   ├── ui/                # Base UI components
│   └── ErrorBoundary.tsx  # Error boundary component
├── constants/              # App constants and configuration
│   ├── Colors.ts          # Color system
│   ├── api.ts             # API configuration
│   └── index.ts           # Constants index
├── src/                    # Source code
│   ├── config/            # App configuration
│   ├── hooks/             # Custom React hooks
│   ├── interfaces/        # TypeScript interfaces
│   ├── middleware/        # App middleware
│   ├── providers/         # React context providers
│   ├── services/          # API and business logic services
│   ├── store/             # Zustand stores
│   ├── utils/             # Utility functions
│   └── validation/        # Form validation schemas
├── styles/                 # Global styles
├── docs/                   # Documentation
└── tests/                  # Test files
```

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript (strict mode)
- **Navigation**: Expo Router
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Yup
- **Storage**: Expo SecureStore
- **Testing**: Jest + React Native Testing Library
- **Linting**: ESLint with modern rules
- **Code Quality**: Prettier (recommended)

## 📱 Key Components

### Authentication System

- Secure login/registration with validation
- JWT token management
- Secure storage for sensitive data
- User role management (farmer/expert)

### API Layer

- Centralized HTTP client with Axios
- Request/response interceptors
- Error handling and retry logic
- Type-safe API responses

### State Management

- Zustand stores for auth and app state
- Persistent state with secure storage
- Optimistic updates and error handling

### Form Handling

- React Hook Form for performance
- Yup validation schemas
- Real-time validation feedback
- Error handling and user feedback

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**

   ```bash
   npm start
   # or
   yarn start
   ```

4. **Run on device/simulator**
   ```bash
   npm run ios     # iOS Simulator
   npm run android # Android Emulator
   npm run web     # Web browser
   ```

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

### Test Structure

- Unit tests for utilities and services
- Integration tests for API calls
- Component tests for UI components
- Test utilities and mocks

## 📝 Code Quality

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npx tsc --noEmit
```

### Code Formatting

We recommend using Prettier for consistent code formatting:

```bash
npx prettier --write .
```

## 🏗️ Architecture Principles

### 1. Separation of Concerns

- Clear separation between UI, business logic, and data layers
- Single responsibility principle for components and functions
- Modular architecture for easy maintenance

### 2. Type Safety

- Full TypeScript implementation
- Strict mode enabled
- Comprehensive interface definitions
- No `any` types allowed

### 3. Error Handling

- Error boundaries for component errors
- User-friendly error messages
- Comprehensive error logging
- Graceful degradation

### 4. Performance

- React Query for efficient data fetching
- Optimized re-renders with proper hooks
- Lazy loading where appropriate
- Memory leak prevention

### 5. Security

- Secure storage for sensitive data
- Input validation and sanitization
- Secure API communication
- Token-based authentication

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
EXPO_PUBLIC_ENVIRONMENT=development
```

### API Configuration

API endpoints and configuration are centralized in `constants/api.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  // ... more config
};
```

## 📚 Documentation

- [API Documentation](./docs/api/README.md)
- [Component Library](./docs/components/README.md)
- [State Management](./docs/store/README.md)
- [Testing Guide](./docs/testing/README.md)

## 🤝 Contributing

1. Follow the established code structure
2. Write tests for new features
3. Ensure TypeScript compilation passes
4. Follow the linting rules
5. Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Check the documentation
- Review existing issues
- Create a new issue with detailed information

---

**Built with ❤️ using modern React Native best practices**
