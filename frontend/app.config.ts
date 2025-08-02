import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Crop Disease Detection System',
  slug: 'crop-disease-detection-system',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'crop-disease-detection',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.cropdisease.app',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#4ade80',
    },
    edgeToEdgeEnabled: true,
    package: 'com.cropdisease.app',
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#4ade80',
      },
    ],
    [
      'expo-camera',
      {
        cameraPermission: 'Allow Crop Disease Detection System to access your camera to scan crop images.',
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission: 'Allow Crop Disease Detection System to access your photo library to select crop images.',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: 'your-project-id',
    },
  },
});
