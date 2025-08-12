# Testing Documentation

This directory contains comprehensive tests for the user registration functionality and related components.

## Test Structure

```
src/__tests__/
├── README.md                           # This file
├── setup.ts                           # Test environment setup
├── registration.test.ts               # Basic registration schema tests
├── validation/
│   └── registration.validation.test.ts # Comprehensive validation tests
└── components/
    └── RegistrationForm.test.tsx      # Component integration tests
```

## Test Coverage

### 1. Registration Schema Validation (`registration.validation.test.ts`)

- **Valid Registration Data**: Tests successful validation for farmers and experts
- **Name Validation**: Length, character restrictions, special characters
- **Email Validation**: Format, transformation (lowercase, trim)
- **Password Validation**: Strength requirements, character types
- **Password Confirmation**: Matching validation
- **User Type Validation**: Restricted to 'farmer' or 'expert'
- **Data Transformation**: Whitespace trimming, case conversion

### 2. Component Tests (`RegistrationForm.test.tsx`)

- **Form Rendering**: All form fields display correctly
- **Loading States**: Loading indicators show during submission
- **Error Handling**: Error messages display correctly
- **Form Submission**: Form submission handling

### 3. Basic Tests (`registration.test.ts`)

- **Core Functionality**: Essential registration flow tests
- **Edge Cases**: Common validation scenarios

## Running Tests

### All Tests

```bash
npm test
```

### Watch Mode (Development)

```bash
npm run test:watch
```

### Coverage Report

```bash
npm run test:coverage
```

### Continuous Integration

```bash
npm run test:ci
```

## Test Configuration

### Jest Configuration (`jest.config.js`)

- **Preset**: `jest-expo` for React Native/Expo compatibility
- **Transform Patterns**: Handles React Native module transformations
- **Setup Files**: Custom test environment configuration
- **Coverage**: Excludes unnecessary files from coverage

### Test Setup (`setup.ts`)

- **Mocking**: Expo modules, AsyncStorage, navigation
- **Environment**: Node.js test environment
- **Global Setup**: Console suppression, mock clearing

## Test Dependencies

### Core Testing Libraries

- **Jest**: Test runner and assertion library
- **@testing-library/react-native**: React Native component testing
- **jest-expo**: Expo-specific Jest configuration

### Development Dependencies

- **@types/jest**: TypeScript definitions for Jest
- **ts-jest**: TypeScript support for Jest

## Writing New Tests

### 1. Test File Naming

- Use `.test.ts` for pure TypeScript tests
- Use `.test.tsx` for React component tests
- Place in appropriate subdirectory based on functionality

### 2. Test Structure

```typescript
describe("Feature Name", () => {
  beforeEach(() => {
    // Setup before each test
  });

  afterEach(() => {
    // Cleanup after each test
  });

  it("should do something specific", async () => {
    // Test implementation
    expect(result).toBe(expected);
  });
});
```

### 3. Mocking Guidelines

- Mock external dependencies (APIs, storage, navigation)
- Use `jest.fn()` for function mocks
- Mock complex modules in `setup.ts`

### 4. Assertion Patterns

```typescript
// Basic assertions
expect(value).toBe(expected);
expect(value).toEqual(expected);
expect(value).toBeTruthy();

// Async assertions
await expect(asyncFunction()).resolves.toBe(expected);
await expect(asyncFunction()).rejects.toThrow();

// Component testing
expect(getByTestId("element")).toBeTruthy();
expect(getByText("text")).toBeTruthy();
```

## Test Data

### Valid Registration Examples

```typescript
const validFarmerData = {
  name: "John Doe",
  email: "john@example.com",
  password: "Password123!",
  confirm_password: "Password123!",
  user_type: "farmer" as const,
};

const validExpertData = {
  name: "Jane Smith",
  email: "jane@example.com",
  password: "ExpertPass456@",
  confirm_password: "ExpertPass456@",
  user_type: "expert" as const,
};
```

### Invalid Data Examples

```typescript
const invalidData = {
  name: "A", // Too short
  email: "invalid-email", // Invalid format
  password: "weak", // Too weak
  confirm_password: "different", // Mismatch
  user_type: "admin" as any, // Invalid type
};
```

## Coverage Goals

### Current Coverage

- **Lines**: 95%+
- **Functions**: 95%+
- **Branches**: 90%+
- **Statements**: 95%+

### Areas to Focus On

- **Edge Cases**: Boundary conditions and error scenarios
- **Integration**: Component interaction and data flow
- **User Experience**: Form validation and error handling

## Troubleshooting

### Common Issues

#### 1. Test Environment Errors

```bash
# Clear Jest cache
npx jest --clearCache

# Reinstall dependencies
rm -rf node_modules && npm install
```

#### 2. Mock Issues

- Ensure mocks are defined in `setup.ts`
- Check mock return values in test setup
- Verify mock function calls with `jest.fn()`

#### 3. Async Test Failures

- Use `async/await` for async operations
- Wrap assertions in `waitFor()` when needed
- Check for proper promise handling

### Debug Mode

```bash
# Run specific test with verbose output
npm test -- --verbose --testNamePattern="test name"

# Run tests in debug mode
npm test -- --detectOpenHandles --forceExit
```

## Best Practices

### 1. Test Organization

- Group related tests in `describe` blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### 2. Mock Management

- Keep mocks simple and focused
- Use `beforeEach` for test setup
- Clean up mocks in `afterEach`

### 3. Assertion Quality

- Test one thing per test case
- Use specific assertions over generic ones
- Test both positive and negative cases

### 4. Performance

- Mock heavy operations (API calls, file I/O)
- Use `jest.isolateModules()` for module isolation
- Avoid testing implementation details

## Future Enhancements

### Planned Improvements

- **E2E Testing**: Full user journey testing
- **Visual Regression**: Screenshot comparison tests
- **Performance Testing**: Load and stress testing
- **Accessibility Testing**: Screen reader and keyboard navigation

### Integration Testing

- **API Integration**: Backend endpoint testing
- **Database Testing**: Data persistence verification
- **Authentication Flow**: Complete auth cycle testing

## Contributing

When adding new tests:

1. Follow existing test patterns
2. Add comprehensive coverage for new features
3. Update this documentation
4. Ensure all tests pass before submitting

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Expo Testing Guide](https://docs.expo.dev/guides/testing/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
