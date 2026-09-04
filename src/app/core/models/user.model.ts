export interface User {
  id: string;
  name: string;
  email: string;
  avatarInitials?: string;
  themePreference?: {
    themeId: string;
    mode: 'light' | 'dark';
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
