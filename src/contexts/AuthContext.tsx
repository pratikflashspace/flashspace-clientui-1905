import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';
import { User, AuthState } from '@/types/auth.types';
import { authService } from '@/services/auth.service';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateUser: (user: User) => void;
  googleLogin: (idToken: string, role?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const response = await authService.checkAuth();

      if (response.success && response.data.isAuthenticated && response.data.user) {
        setState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        // Not authenticated - cookies will be cleared by backend
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } catch (error: any) {
      // Auth check failed - cookies are invalid or expired

      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error.message || 'Failed to check authentication',
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await authService.login({ email, password });

      if (response.success && response.data?.user) {
        setState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        toast.success('Logged in successfully');
      } else {
        const errorMsg = response.message || 'Login failed';
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMsg,
        }));

        toast.error(errorMsg);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      toast.error(errorMessage);
    }
  };

  const signup = async (data: any) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await authService.signup(data);

      if (response.success) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: null,
        }));

        toast.success('Signed up successfully');
      } else {
        throw new Error(response.message || 'Signup failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Signup failed';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      toast.error(errorMessage);

      throw error;
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await authService.verifyOTP({ email, otp });

      if (response.success && response.data.user) {
        setState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        toast.success('Email verified successfully');
      } else {
        throw new Error(response.message || 'OTP verification failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'OTP verification failed';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      toast.error(errorMessage);

      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();

      // Backend clears cookies, just update state
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });

      toast.success('Logged out successfully');
    } catch (error: any) {
      // Even if logout fails on server, clear local state
      // Cookies will be invalid anyway
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });

      toast.success('Logged out successfully');
    }
  };

  const refreshProfile = async () => {
    try {
      const response = await authService.getProfile();
      if (response.success && response.data) {
        setState((prev) => ({
          ...prev,
          user: response.data,
        }));
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  const updateUser = (updatedUser: User) => {
    setState((prev) => ({
      ...prev,
      user: updatedUser,
    }));
  };

  const googleLogin = async (idToken: string, role?: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await authService.googleLogin(idToken, role);

      if (response.success && response.data?.user) {
        setState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        toast.success('Logged in successfully');
      } else {
        const errorMsg = response.message || 'Google login failed';
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMsg,
        }));

        toast.error(errorMsg);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Google login failed';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      toast.error(errorMessage);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
        verifyOTP,
        checkAuthStatus,
        refreshProfile,
        updateUser,
        googleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
