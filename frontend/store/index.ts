import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { ScanResult, Theme, User } from '../types';

interface AppStore {
  // State
  user: User | null;
  theme: Theme;
  isFirstLaunch: boolean;
  scanHistory: ScanResult[];
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setFirstLaunch: (isFirstLaunch: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  addScanToHistory: (scan: ScanResult) => void;
  clearScanHistory: () => void;
  logout: () => void;
  clearAllData: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      theme: 'light',
      isFirstLaunch: true,
      scanHistory: [],
      isLoading: false,

      // Actions
      setUser: (user: User | null) => set({ user }),

      setTheme: (theme: Theme) => set({ theme }),

      toggleTheme: () => {
        const currentTheme = get().theme;
        set({ theme: currentTheme === 'light' ? 'dark' : 'light' });
      },

      setFirstLaunch: (isFirstLaunch: boolean) => set({ isFirstLaunch }),

      setLoading: (isLoading: boolean) => set({ isLoading }),

      addScanToHistory: (scan: ScanResult) => {
        const currentHistory = get().scanHistory;
        set({ scanHistory: [scan, ...currentHistory] });
      },

      clearScanHistory: () => set({ scanHistory: [] }),

      logout: () => set({
        user: null,
        scanHistory: [],
        isFirstLaunch: false
      }),

      clearAllData: () => set({
        user: null,
        theme: 'light',
        isFirstLaunch: true,
        scanHistory: [],
        isLoading: false
      }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        theme: state.theme,
        isFirstLaunch: state.isFirstLaunch,
        scanHistory: state.scanHistory,
      }),
    }
  )
);
