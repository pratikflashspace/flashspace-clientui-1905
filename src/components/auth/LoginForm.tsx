import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Loader2, Mail, Lock, ArrowRight } from 'lucide-react';
import { GoogleLoginButton } from './GoogleLoginButton';

export const LoginForm = () => {
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await login(formData.email, formData.password);
      // navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" style={{ fontFamily: 'Poppins' }}>
      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-semibold text-[#586A7E]">
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
            disabled={isLoading}
            className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4DA1FF]/20 focus:border-[#4DA1FF] placeholder:text-slate-400 text-[#172A3A]"
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-semibold text-[#586A7E]">
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
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full pl-12 pr-12 py-3.5 border border-slate-200 rounded-xl bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4DA1FF]/20 focus:border-[#4DA1FF] placeholder:text-slate-400 text-[#172A3A]"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#172A3A] transition-colors duration-200 z-10"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-[#4DA1FF] focus:ring-[#4DA1FF]/20"
          />
          <span className="text-sm text-[#586A7E]">Remember me</span>
        </label>
        <Link
          to="/forgot-password"
          className="text-sm font-semibold text-[#EDB003] hover:text-[#d99f03] transition-colors duration-200"
        >
          Forgot Password?
        </Link>
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full bg-[#EDB003] hover:bg-[#d99f03] text-white font-bold py-3.5 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg text-base border-0" 
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Signing in...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <span>Sign In</span>
            <ArrowRight className="h-5 w-5" />
          </div>
        )}
      </Button>

      {/* Social Login */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-slate-500">or continue with</span>
          </div>
        </div>

        <div className="mt-6 ">
          <GoogleLoginButton onSuccess={() => navigate('/dashboard')} />
        </div>
      </div>
    </form>
  );
};
