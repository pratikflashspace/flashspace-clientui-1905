import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface GoogleLoginButtonProps {
  onSuccess?: () => void;
  onError?: () => void;
  onTwoFactorRequired?: (email: string) => void;
  role?: string;
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  onSuccess,
  onError,
  onTwoFactorRequired,
  role
}) => {
  const { googleLogin, isLoading } = useAuth();
  const { toast } = useToast();

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error('No credential received from Google');
      }

      const response = await googleLogin(credentialResponse.credential, role);

      if (response.success && response.data?.requiresTwoFactor) {
        const email = response.data.email;
        if (email) {
          onTwoFactorRequired?.(email);
        }
        return;
      }

      if (!response.success || !response.data?.user) {
        throw new Error(response.message || 'Google sign-in did not complete');
      }

      toast({
        title: 'Success',
        description: 'Successfully signed in with Google',
      });

      onSuccess?.();
    } catch (error: any) {
      console.error('Google login error:', error);

      toast({
        title: 'Login Failed',
        description: error.message || 'Failed to sign in with Google',
        variant: 'destructive',
      });

      onError?.();
    }
  };

  const handleGoogleError = () => {
    console.error('Google Login Failed');

    toast({
      title: 'Login Failed',
      description: 'Failed to sign in with Google. Please try again.',
      variant: 'destructive',
    });

    onError?.();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-sm font-medium text-[#172A3A]">
        <Loader2 className="h-5 w-5 animate-spin text-[#4DA1FF]" />
        <span>Signing in...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[300px] sm:max-w-full mx-auto">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        theme="outline"
        size="large"
        text="signin_with"
        width="400"
        logo_alignment="left"
      />
      <style>{`
        /* Make Google button larger and full width */
        .nsm7Bb-HzV7m-LgbsSe {
          width: 100% !important;
          height: 52px !important;
          border-radius: 12px !important;
          border: 1.5px solid #e2e8f0 !important;
          box-shadow: none !important;
          font-family: 'Inter', sans-serif !important;
          transition: all 0.2s ease !important;
        }
        
        .nsm7Bb-HzV7m-LgbsSe:hover {
          border-color: #cbd5e1 !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
          background-color: #f8fafc !important;
        }
        
        /* Google logo size */
        .nsm7Bb-HzV7m-LgbsSe .nsm7Bb-HzV7m-LgbsSe-Bz112c {
          width: 24px !important;
          height: 24px !important;
          margin-right: 16px !important;
        }
        
        /* Text styling */
        .nsm7Bb-HzV7m-LgbsSe .nsm7Bb-HzV7m-LgbsSe-BPrWId {
          font-size: 16px !important;
          font-weight: 500 !important;
          color: #172A3A !important;
          font-family: 'Inter', sans-serif !important;
        }
        
        /* Center content */
        .nsm7Bb-HzV7m-LgbsSe-MJoBVe {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 0 24px !important;
        }
      `}</style>
    </div>
  );
};

export default GoogleLoginButton;
