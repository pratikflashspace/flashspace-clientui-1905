import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/auth.service';
import { Button } from '@/components/ui/button';
import { Loader2, Mail, ShieldCheck, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getDefaultDashboard } from '@/utils/roleRedirection';

export const VerifyOTPForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { verifyOTP, isLoading, user } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!isLoading && user && user.isEmailVerified) {
       navigate(getDefaultDashboard(user.role), { replace: true });
    }
  }, [isLoading, user, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      await verifyOTP(email, otp);
      // user object will be updated in AuthContext by verifyOTP
    } catch (error) {
      console.error('OTP verification error:', error);
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }

    if (countdown > 0) return;

    try {
      setResending(true);
      setError('');
      
      const response = await authService.resendOTP({ email });
      
      if (response.success) {
        toast({
          title: 'OTP Resent',
          description: response.message || 'A new OTP has been sent to your email.',
        });
        setCountdown(60);
      } else {
        throw new Error(response.message || 'Failed to resend OTP');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to resend OTP';
      toast({
        title: 'Resend Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" style={{ fontFamily: 'Poppins' }}>
      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-semibold text-[#172A3A]" style={{ fontFamily: 'Poppins' }}>
          Email Address
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <Mail size={20} />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading || !!searchParams.get('email')}
            className="w-full pl-12 pr-4 py-3.5 border rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#4DA1FF]/50 focus:border-[#4DA1FF] focus:bg-white placeholder:text-slate-400 text-[#172A3A] font-medium border-slate-200 hover:border-slate-300 disabled:bg-slate-100 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-4 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 text-[#4DA1FF]">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-[#172A3A]" style={{ fontFamily: 'Poppins' }}>
              Check your email for the verification code
            </p>
            <p className="text-xs text-slate-600 mt-1">
              We've sent a 6-digit code to <span className="font-semibold text-[#4DA1FF]">{email}</span>
            </p>
          </div>
        </div>
      </div>

      {/* OTP Input */}
      <div className="space-y-3">
        <label htmlFor="otp" className="block text-sm font-semibold text-[#172A3A]" style={{ fontFamily: 'Poppins' }}>
          Verification Code
        </label>
        <input
          id="otp"
          name="otp"
          type="text"
          placeholder="000000"
          maxLength={6}
          value={otp}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            setOtp(value);
            if (error) setError('');
          }}
          disabled={isLoading}
          className={`w-full px-6 py-5 border rounded-xl text-center text-3xl tracking-[0.5em] font-bold bg-white/80 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#4DA1FF]/50 focus:border-[#4DA1FF] focus:bg-white ${error ? 'border-red-400 bg-red-50/50 focus:ring-red-400/50' : 'border-slate-200 hover:border-slate-300'}`}
          style={{ fontFamily: 'Poppins' }}
        />
        {error && (
          <p className="text-sm text-red-600 flex items-center justify-center gap-1.5 font-medium">
            <span className="text-xs">⚠</span> {error}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-[#4DA1FF] to-[#3B82F6] hover:from-[#4DA1FF]/90 hover:to-[#3B82F6]/90 text-white font-bold py-6 rounded-xl shadow-lg shadow-[#4DA1FF]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#4DA1FF]/40 hover:-translate-y-0.5 text-base" 
        style={{ fontFamily: 'Poppins' }}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Verifying...
          </>
        ) : (
          <>
            <ShieldCheck className="mr-2 h-5 w-5" />
            Verify Email
          </>
        )}
      </Button>

      {/* Resend OTP */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={handleResendOTP}
          disabled={resending || countdown > 0}
          className="text-sm font-semibold text-slate-600 hover:text-[#4DA1FF] transition-colors duration-200 disabled:text-slate-400 disabled:cursor-not-allowed inline-flex items-center gap-2"
          style={{ fontFamily: 'Poppins' }}
        >
          {resending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending new code...
            </>
          ) : countdown > 0 ? (
            <>
              <Clock className="h-4 w-4" />
              Resend code in {countdown}s
            </>
          ) : (
            "Didn't receive code? Resend"
          )}
        </button>
      </div>
    </form>
  );
};
