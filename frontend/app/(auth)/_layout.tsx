import { Stack } from 'expo-router';

/**
 * Auth layout component
 * Handles authentication screens (login, register, forgot password, etc.)
 */
export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
