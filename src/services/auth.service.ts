import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/config/api.config';
import {
  SignupRequest,
  LoginRequest,
  VerifyOTPRequest,
  ResendOTPRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  AuthResponse,
  LoginResponse,
  SignupResponse,
  VerifyOTPResponse,
  User,
} from '@/types/auth.types';

class AuthService {
  /**
   * Register new user
   */
  async signup(data: SignupRequest): Promise<AuthResponse<SignupResponse>> {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.SIGNUP, data);
      return response.data as AuthResponse<SignupResponse>;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Signup failed',
      } as AuthResponse<SignupResponse>;
    }
  }

  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<AuthResponse<LoginResponse>> {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, data);
      const result = response.data as AuthResponse<LoginResponse>;

      // Tokens are automatically stored in HttpOnly cookies by the server
      // No need to manually store tokens - more secure!

      return result;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Login failed',
      } as AuthResponse<LoginResponse>;
    }
  }

  /**
   * Verify email with OTP
   */
  async verifyOTP(data: VerifyOTPRequest): Promise<AuthResponse<VerifyOTPResponse>> {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.VERIFY_OTP, data);
      const result = response.data as AuthResponse<VerifyOTPResponse>;

      // Tokens are automatically stored in HttpOnly cookies by the server
      // No need to manually store tokens - more secure!

      return result;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'OTP verification failed',
      } as AuthResponse<VerifyOTPResponse>;
    }
  }

  /**
   * Resend OTP
   */
  async resendOTP(data: ResendOTPRequest): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.RESEND_OTP, data);
      return response.data as AuthResponse;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to resend OTP',
      };
    }
  }

  /**
   * Forgot password
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
      return response.data as AuthResponse;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to process forgot password',
      };
    }
  }

  /**
   * Reset password
   */
  async resetPassword(data: ResetPasswordRequest): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
      return response.data as AuthResponse;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to reset password',
      };
    }
  }

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordRequest): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
      return response.data as AuthResponse;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to change password',
      };
    }
  }

  /**
   * Logout from current device
   */
  async logout(): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);

      // Cookies are cleared by the server
      // No need to manually clear tokens

      return response.data as AuthResponse;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to logout',
      };
    }
  }

  /**
   * Logout from all devices
   */
  async logoutAll(): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT_ALL);

      // Cookies are cleared by the server
      // No need to manually clear tokens

      return response.data as AuthResponse;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to logout from all devices',
      };
    }
  }

  /**
   * Check authentication status
   */
  async checkAuth(): Promise<AuthResponse<{ isAuthenticated: boolean; user?: User }>> {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.AUTH.CHECK_AUTH);
      return response.data as AuthResponse<{ isAuthenticated: boolean; user?: User }>;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to check authentication',
        data: { isAuthenticated: false },
      };
    }
  }

  /**
   * Get user profile
   */
  async getProfile(): Promise<AuthResponse<User>> {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.AUTH.GET_PROFILE);
      return response.data as AuthResponse<User>;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to get profile',
      } as AuthResponse<User>;
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<AuthResponse<{ accessToken: string; refreshToken: string }>> {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN);
      return response.data as AuthResponse<{ accessToken: string; refreshToken: string }>;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to refresh token',
      } as AuthResponse<{ accessToken: string; refreshToken: string }>;
    }
  }

  /**
   * Google OAuth - Authenticate with Google ID token
   */
  async googleLogin(idToken: string, role?: string): Promise<AuthResponse<LoginResponse>> {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.GOOGLE, { idToken, role });
      const result = response.data as AuthResponse<LoginResponse>;

      // Tokens are automatically stored in HttpOnly cookies by the server
      // No need to manually store tokens - more secure!

      return result;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Google login failed',
      } as AuthResponse<LoginResponse>;
    }
  }
}

export const authService = new AuthService();
export default authService;
