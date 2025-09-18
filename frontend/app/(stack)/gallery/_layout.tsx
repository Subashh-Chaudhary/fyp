import { Stack } from 'expo-router';
import React from 'react';

export default function ScanLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: 'card',
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="picker" />
    </Stack>
  );
}