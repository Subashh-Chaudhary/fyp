import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { ScanResult, Theme } from '../interfaces';
import { AppState } from '../interfaces/app.types';

// Create App Store
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      theme: 'light',
      isFirstLaunch: true,
      scanHistory: [],
      isLoading: false,
      networkStatus: 'online',
      lastSyncTime: null,
      notifications: true,
      locationEnabled: false,
      language: 'en',

      // Actions
      setTheme: (theme: Theme) => {
        set({ theme });
      },

      setFirstLaunch: (isFirst: boolean) => {
        set({ isFirstLaunch: isFirst });
      },

      addScanToHistory: (scan: ScanResult) => {
        const { scanHistory } = get();
        const updatedHistory = [scan, ...scanHistory];
        // Keep only last 100 scans
        const limitedHistory = updatedHistory.slice(0, 100);
        set({ scanHistory: limitedHistory });
      },

      removeScanFromHistory: (scanId: string) => {
        const { scanHistory } = get();
        const updatedHistory = scanHistory.filter(scan => scan.id !== scanId);
        set({ scanHistory: updatedHistory });
      },

      clearScanHistory: () => {
        set({ scanHistory: [] });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setNetworkStatus: (status: 'online' | 'offline') => {
        set({ networkStatus: status });
      },

      setLastSyncTime: (time: Date) => {
        set({ lastSyncTime: time });
      },

      setNotifications: (enabled: boolean) => {
        set({ notifications: enabled });
      },

      setLocationEnabled: (enabled: boolean) => {
        set({ locationEnabled: enabled });
      },

      setLanguage: (language: string) => {
        set({ language });
      },

      resetApp: () => {
        set({
          theme: 'light',
          isFirstLaunch: true,
          scanHistory: [],
          isLoading: false,
          networkStatus: 'online',
          lastSyncTime: null,
          notifications: true,
          locationEnabled: false,
          language: 'en',
        });
      },
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        theme: state.theme,
        isFirstLaunch: state.isFirstLaunch,
        scanHistory: state.scanHistory,
        notifications: state.notifications,
        locationEnabled: state.locationEnabled,
        language: state.language,
      }),
    }
  )
);
