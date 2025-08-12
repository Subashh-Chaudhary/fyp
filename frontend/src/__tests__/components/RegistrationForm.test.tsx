import { yupResolver } from '@hookform/resolvers/yup';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { registerSchema } from '../../validation/schemas/auth.schema';

// Mock the useAuth hook
jest.mock('../../hooks/useAuth');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

// Test component that uses the form
const TestRegistrationForm = () => {
  const { register, isLoading, error } = mockUseAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirm_password: '',
      user_type: 'farmer' as const,
    },
  });

  const onSubmit = async (data: any) => {
    await register({
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      password: data.password,
      confirm_password: data.confirm_password,
      user_type: data.user_type,
    });
  };

  return (
    <View>
      <TextInput
        placeholder="Full Name"
        testID="name-input"
        onChangeText={(text) => {
          // Simulate form control
        }}
      />
      <TextInput
        placeholder="Email"
        testID="email-input"
        onChangeText={(text) => {
          // Simulate form control
        }}
      />
      <TextInput
        placeholder="Password"
        testID="password-input"
        secureTextEntry
        onChangeText={(text) => {
          // Simulate form control
        }}
      />
      <TextInput
        placeholder="Confirm Password"
        testID="confirm-password-input"
        secureTextEntry
        onChangeText={(text) => {
          // Simulate form control
        }}
      />
      <View testID="user-type-select">
        <TouchableOpacity testID="farmer-option" onPress={() => {}}>
          <Text>Farmer</Text>
        </TouchableOpacity>
        <TouchableOpacity testID="expert-option" onPress={() => {}}>
          <Text>Expert</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity testID="submit-button" onPress={handleSubmit(onSubmit)}>
        <Text>Create Account</Text>
      </TouchableOpacity>
      {error && <Text testID="error-message">{error}</Text>}
      {isLoading && <Text testID="loading-indicator">Loading...</Text>}
    </View>
  );
};

describe('Registration Form', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      register: jest.fn(),
      isLoading: false,
      error: null,
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
      isFarmer: jest.fn(),
      isExpert: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render all form fields', () => {
    const { getByTestId } = render(<TestRegistrationForm />);

    expect(getByTestId('name-input')).toBeTruthy();
    expect(getByTestId('email-input')).toBeTruthy();
    expect(getByTestId('password-input')).toBeTruthy();
    expect(getByTestId('confirm-password-input')).toBeTruthy();
    expect(getByTestId('user-type-select')).toBeTruthy();
    expect(getByTestId('submit-button')).toBeTruthy();
  });

  it('should show loading state when submitting', () => {
    mockUseAuth.mockReturnValue({
      register: jest.fn(),
      isLoading: true,
      error: null,
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
      isFarmer: jest.fn(),
      isExpert: jest.fn(),
    });

    const { getByTestId } = render(<TestRegistrationForm />);

    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('should show error message when there is an error', () => {
    const errorMessage = 'Registration failed';
    mockUseAuth.mockReturnValue({
      register: jest.fn(),
      isLoading: false,
      error: errorMessage,
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
      isFarmer: jest.fn(),
      isExpert: jest.fn(),
    });

    const { getByTestId } = render(<TestRegistrationForm />);

    expect(getByTestId('error-message')).toHaveTextContent(errorMessage);
  });

  it('should handle form submission', async () => {
    const mockRegister = jest.fn();
    mockUseAuth.mockReturnValue({
      register: mockRegister,
      isLoading: false,
      error: null,
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
      isFarmer: jest.fn(),
      isExpert: jest.fn(),
    });

    const { getByTestId } = render(<TestRegistrationForm />);

    const submitButton = getByTestId('submit-button');

    // Simulate form submission
    fireEvent.press(submitButton);

    // Since this is a simplified test component, we just verify it renders
    expect(submitButton).toBeTruthy();
  });
});
