import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { useAuthStore } from '../../src/store/auth.store';

/**
 * Tab navigation layout
 * Defines the 5 main tabs: Home, Feed, Scan, History, Settings
 */
export default function TabLayout() {
  const user = useAuthStore((s) => s.user);
  const userType = (user?.userType ?? (user as any)?.user_type ?? '').toLowerCase();

  const isExpertOrAdmin = userType === 'expert' || userType === 'admin';
  const isFarmer = userType === 'farmer';

  // Debug logging
  console.log('TabLayout - User:', user);
  console.log('TabLayout - UserType:', userType);
  console.log('TabLayout - isExpertOrAdmin:', isExpertOrAdmin);
  console.log('TabLayout - isFarmer:', isFarmer);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#22c55e',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e5e5e5',
          borderTopWidth: 1,
          paddingBottom: 15,
          paddingTop: 10,
          height: 80,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#171717',
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="home" size={focused ? 26 : 24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="feed"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="newspaper" size={focused ? 26 : 24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="scan"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? '#22c55e' : '#f0fdf4',
              width: 70,
              height: 70,
              borderRadius: 30,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: -10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 4,
            }}>
              <Ionicons
                name="camera"
                size={focused ? 40 : 35}
                color={focused ? '#ffffff' : '#22c55e'}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="detections"
        options={{
          title: 'Detections',
          ...(isExpertOrAdmin ? {} : { href: null }),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="images" size={focused ? 26 : 24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          ...(isFarmer ? {} : { href: null }),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="time" size={focused ? 26 : 24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="settings" size={focused ? 26 : 24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
