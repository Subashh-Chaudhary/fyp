import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

/**
 * Root layout component
 * Handles splash screen and main navigation structure
 */
export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize app and hide splash screen
    const initializeApp = async () => {
      try {
        // Wait for store to be hydrated
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Hide splash screen
        await SplashScreen.hideAsync();

        // Mark app as ready
        setIsReady(true);
      } catch (error) {
        console.warn('Error during app initialization:', error);
        setIsReady(true);
      }
    };

    initializeApp();
  }, []);

  // Don't render anything until app is ready
  if (!isReady) {
    return null;
  }

  return (
    <>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen
          name="welcome"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}
