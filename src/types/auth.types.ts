// Auth Types and Interfaces

export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: 'user' | 'admin' | 'vendor';
  isEmailVerified: boolean;
  profilePicture?: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phoneNumber?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface ResendOTPRequest {
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export interface SignupResponse {
  user: User;
}

export interface VerifyOTPResponse {
  user: User;
  tokens: AuthTokens;
}
