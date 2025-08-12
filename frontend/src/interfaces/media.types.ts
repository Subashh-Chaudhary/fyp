// Camera and image types
export interface ImageInfo {
  uri: string;
  width: number;
  height: number;
  type: string;
  size: number;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  user_type: 'farmer' | 'expert';
}
