import { Stack } from 'expo-router';
import React from 'react';

export default function RootStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Scan Stack */}
      <Stack.Screen
        name="scan"
        options={{
          headerShown: false,
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
      
      {/* Gallery Stack */}
      <Stack.Screen
        name="gallery"
        options={{
          headerShown: false,
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
    </Stack>
  );
}