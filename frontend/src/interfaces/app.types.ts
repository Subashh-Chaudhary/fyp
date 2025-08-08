import { ScanResult, Theme } from '../../types';

// App State Interface
export interface AppState {
  // State
  theme: Theme;
  isFirstLaunch: boolean;
  scanHistory: ScanResult[];
  isLoading: boolean;
  networkStatus: 'online' | 'offline';
  lastSyncTime: Date | null;
  notifications: boolean;
  locationEnabled: boolean;
  language: string;

  // Actions
  setTheme: (theme: Theme) => void;
  setFirstLaunch: (isFirst: boolean) => void;
  addScanToHistory: (scan: ScanResult) => void;
  removeScanFromHistory: (scanId: string) => void;
  clearScanHistory: () => void;
  setLoading: (loading: boolean) => void;
  setNetworkStatus: (status: 'online' | 'offline') => void;
  setLastSyncTime: (time: Date) => void;
  setNotifications: (enabled: boolean) => void;
  setLocationEnabled: (enabled: boolean) => void;
  setLanguage: (language: string) => void;
  resetApp: () => void;
}
