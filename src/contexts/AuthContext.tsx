import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types/auth.types';
import { authService } from '@/services/auth.service';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
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

  const { toast } = useToast();

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
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } catch (error: any) {
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

        toast({
          title: 'Login Successful',
          description: response.message || 'Welcome back!',
        });
      } else {
        const errorMsg = response.message || 'Login failed';
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMsg,
        }));

        toast({
          title: 'Login Failed',
          description: errorMsg,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });
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

        toast({
          title: 'Registration Successful',
          description: response.message || 'Please check your email for OTP verification.',
        });
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

      toast({
        title: 'Registration Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
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

        toast({
          title: 'Verification Successful',
          description: response.message || 'Your email has been verified!',
        });
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

      toast({
        title: 'Verification Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });

      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
    } catch (error: any) {
      // Even if logout fails on server, clear local state
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });

      toast({
        title: 'Logged Out',
        description: 'You have been logged out.',
      });
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

  const googleLogin = async (idToken: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      const response = await authService.googleLogin(idToken);
      
      if (response.success && response.data?.user) {
        setState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        toast({
          title: 'Login Successful',
          description: response.message || 'Welcome!',
        });
      } else {
        const errorMsg = response.message || 'Google login failed';
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMsg,
        }));

        toast({
          title: 'Login Failed',
          description: errorMsg,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Google login failed';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });
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
