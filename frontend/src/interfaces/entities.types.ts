// User types
export interface User {
  id: string;
  name: string;
  email: string;
  userType?: 'farmer' | 'expert'; // Optional since login response doesn't include this
  phone?: string | null;
  address?: string | null;
  avatar_url?: string | null;
  is_verified?: boolean;
  is_active?: boolean;
  is_admin?: boolean;
  created_at?: string; // Backend returns ISO string
  updated_at?: string; // Backend returns ISO string

  // Additional fields from backend response (optional)
  verification_token?: string | null;
  verification_expires_at?: string | null;
  password_reset_token?: string | null;
  reset_token_expires_at?: string | null;
  refresh_token?: string | null;
  refresh_token_expires_at?: string | null;
  last_login_at?: string | null;
  auth_provider?: string | null;
  provider_id?: string | null;
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

// Theme types
export type Theme = 'light' | 'dark';
