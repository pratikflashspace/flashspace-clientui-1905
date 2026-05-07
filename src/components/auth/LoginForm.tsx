import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Loader2, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { GoogleLoginButton } from './GoogleLoginButton';
import { getDefaultDashboard } from '@/utils/roleRedirection';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const navigate = useNavigate();
  const { login, verifyLoginOTP, isLoading, isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !isLoading && user) {
      if (onSuccess) {
        onSuccess();
      } else {
        navigate(getDefaultDashboard(user.role), { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, navigate, onSuccess, user]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (twoFactorRequired) {
      if (!/^\d{6}$/.test(otp)) {
        newErrors.otp = 'Enter the 6-digit OTP sent to your email';
      }
    } else if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      if (twoFactorRequired) {
        await verifyLoginOTP(formData.email, otp);
        return;
      }

      const response = await login(formData.email, formData.password);
      if (response.success && response.data?.requiresTwoFactor) {
        setTwoFactorRequired(true);
        setOtp('');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" style={{ fontFamily: '"Inner Tight", system-ui, sans-serif' }}>
      {twoFactorRequired && (
        <div className="rounded-2xl border border-[#DDE5DA] bg-[#F8FAF7] p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF6EF] text-[#35503F]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#1F2E26]">Two-factor authentication</p>
              <p className="mt-1 text-xs leading-5 font-medium text-[#677E73]">
                We sent a 6-digit OTP to {formData.email}. This browser will be trusted after verification.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-bold text-[#1F2E26]">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10">
            <Mail size={20} />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading || twoFactorRequired}
            className="w-full pl-12 pr-4 py-3 border border-[#DDE5DA] rounded-xl bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#35503F]/15 focus:border-[#35503F] placeholder:text-[#A2AEA8] text-[#1F2E26]"
          />
        </div>
        {errors.email && <p className="text-xs font-medium text-red-600">{errors.email}</p>}
      </div>

      {twoFactorRequired ? (
        <div className="space-y-2">
          <label htmlFor="otp" className="block text-sm font-bold text-[#1F2E26]">
            Login OTP
          </label>
          <input
            id="otp"
            name="otp"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(event) => {
              setOtp(event.target.value.replace(/\D/g, '').slice(0, 6));
              if (errors.otp) setErrors((prev) => ({ ...prev, otp: '' }));
            }}
            disabled={isLoading}
            className="w-full px-4 py-3 border border-[#DDE5DA] rounded-xl bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#35503F]/15 focus:border-[#35503F] placeholder:text-[#A2AEA8] text-[#1F2E26] tracking-[0.35em] font-bold text-center"
          />
          {errors.otp && <p className="text-xs font-medium text-red-600">{errors.otp}</p>}
        </div>
      ) : (
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-bold text-[#1F2E26]">
            Password
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10">
              <Lock size={20} />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full pl-12 pr-12 py-3 border border-[#DDE5DA] rounded-xl bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#35503F]/15 focus:border-[#35503F] placeholder:text-[#A2AEA8] text-[#1F2E26]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#172A3A] transition-colors duration-200 z-10"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <p className="text-xs font-medium text-red-600">{errors.password}</p>}
        </div>
      )}

      {!twoFactorRequired && (
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="w-4 h-4 rounded border-[#B8C6BD] text-[#35503F] focus:ring-[#35503F]/20"
            />
            <span className="text-sm font-medium text-[#172A3A]">Remember me</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-[#172A3A] hover:text-black transition-colors duration-200"
          >
            Forgot Password?
          </Link>
        </div>
      )}

      <Button
        type="submit"
        className="w-full h-12 bg-[#FEF8C3] hover:bg-[#FDF4A6] text-[#1F2E26] font-bold rounded-xl transition-all duration-200 text-[15px] border-0 shadow-sm"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>{twoFactorRequired ? 'Verifying...' : 'Signing in...'}</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <span>{twoFactorRequired ? 'Verify & Sign In' : 'Sign In'}</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        )}
      </Button>

      {twoFactorRequired && (
        <button
          type="button"
          onClick={() => {
            setTwoFactorRequired(false);
            setOtp('');
            setErrors({});
          }}
          className="w-full text-center text-sm font-semibold text-[#35503F] hover:text-[#1F2E26]"
        >
          Use a different account
        </button>
      )}

      {!twoFactorRequired && (
        <>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500">or continue with</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <GoogleLoginButton
              onSuccess={() => {
                if (onSuccess) {
                  onSuccess();
                }
              }}
              onTwoFactorRequired={(email) => {
                setFormData((prev) => ({ ...prev, email, password: '' }));
                setTwoFactorRequired(true);
                setOtp('');
                setErrors({});
              }}
            />
          </div>
        </>
      )}
    </form>
  );
};
