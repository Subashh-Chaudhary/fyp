// User types
export interface User {
  id: string;
  name: string;
  email: string;
  userType: 'farmer' | 'expert';
  phone?: string;
  address?: string;
  avatar_url?: string;
  is_verified: boolean;
  is_active: boolean;
  is_admin?: boolean;
  created_at: Date;
  updated_at: Date;
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
