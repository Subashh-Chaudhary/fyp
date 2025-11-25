import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { AnimatedSplashScreen } from '../components/AnimatedSplashScreen';
import { AppProvider } from '../src/providers/app.provider';

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

        // Show animated splash screen for 2.5 seconds
        await new Promise(resolve => setTimeout(resolve, 2500));

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
    return <AnimatedSplashScreen />;
  }

  return (
    <AppProvider>
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
        <Stack.Screen
          name="(stack)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </AppProvider>
  );
}
