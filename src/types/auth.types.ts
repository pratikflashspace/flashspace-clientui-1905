// Auth Types and Interfaces

export interface User {
  _id: string; // CHANGED FROM 'id' TO '_id'
  id?: string; // Optional for backward compatibility
  email: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  alternatePhone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  role: 'user' | 'super_admin' | 'admin' | 'vendor' | 'partner' | 'space_manager' | 'sales' | 'affiliate_manager' | 'space_partner_manager' | 'support' | 'affiliate';
  isEmailVerified: boolean;
  kycVerified?: boolean;
  profilePicture?: string;
  authProvider?: "local" | "google";
  isTwoFactorEnabled?: boolean;
  lastLogin?: string;
  createdAt?: string; // ADDED: For Profile.tsx
  updatedAt?: string;
  preferences?: {
    language: string;
    currency: string;
    defaultCity: string;
    timeZone: string;
    darkMode: boolean;
    compactView: boolean;
  };
  notifications?: {
    email: boolean;
    push: boolean;
    promotional: boolean;
    reminders: boolean;
    loginAlerts: boolean;
  };
  securityPreferences?: {
    sessionManagement: boolean;
    dataSharing: boolean;
  };
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
  role?: 'user' | 'partner' | 'affiliate';
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
  user?: User;
  tokens?: AuthTokens;
  requiresTwoFactor?: boolean;
  email?: string;
}

export interface SignupResponse {
  user: User;
  tokens?: AuthTokens;
}

export interface VerifyOTPResponse {
  user: User;
  tokens: AuthTokens;
}

export interface VerifyLoginOTPRequest {
  email: string;
  otp: string;
}
