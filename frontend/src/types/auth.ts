// Type definitions for authentication-related entities

export interface UserSession {
  id: string;
  email: string;
  name: string;
  isAuthenticated: boolean;
  token: string;
  expiresAt: string; // ISO string format
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

export interface LoginResponse {
  user: UserSession;
  token: string;
}

export interface SignupResponse {
  user: UserSession;
  token: string;
}

export interface AuthState {
  user: UserSession | null;
  loading: boolean;
  error: string | null;
}