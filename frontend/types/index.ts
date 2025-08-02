// User types
export interface User {
  id: string;
  name: string;
  email: string;
  userType: 'farmer' | 'expert';
  createdAt: Date;
  updatedAt: Date;
}

// Crop and disease types
export interface Crop {
  id: string;
  name: string;
  scientificName: string;
  category: string;
  imageUrl?: string;
}

export interface Disease {
  id: string;
  name: string;
  scientificName: string;
  cropId: string;
  symptoms: string[];
  treatments: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  imageUrl?: string;
}

// Scan result types
export interface ScanResult {
  id: string;
  imageUrl: string;
  cropId: string;
  confidence: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  analysis?: {
    detectedDiseases: {
      name: string;
      confidence: number;
      severity: string;
    }[];
    recommendations: string[];
  };
}

// Navigation types
export type RootStackParamList = {
  welcome: undefined;
  '(tabs)': undefined;
  scan: undefined;
  result: { scanId: string };
  history: undefined;
  settings: undefined;
};

export type TabParamList = {
  home: undefined;
  feed: undefined;
  scan: undefined;
  history: undefined;
  settings: undefined;
};

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Theme types
export type Theme = 'light' | 'dark';

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  userType: 'farmer' | 'expert';
}

// Camera and image types
export interface ImageInfo {
  uri: string;
  width: number;
  height: number;
  type: string;
  size: number;
}

// Store types
export interface AppState {
  user: User | null;
  theme: Theme;
  isFirstLaunch: boolean;
  scanHistory: ScanResult[];
  isLoading: boolean;
}
