import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Loader2, Mail, Lock, LogIn } from 'lucide-react';

export const LoginForm = () => {
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
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
      // AuthContext will set isAuthenticated to true on success
      if (isAuthenticated) {
        navigate('/');
      }
    } catch (error) {
      // Errors are already handled by AuthContext
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
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            className={`w-full pl-12 pr-4 py-3.5 border rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#4DA1FF]/50 focus:border-[#4DA1FF] focus:bg-white placeholder:text-slate-400 text-[#172A3A] font-medium ${errors.email ? 'border-red-400 bg-red-50/50 focus:ring-red-400/50' : 'border-slate-200 hover:border-slate-300'}`}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-600 flex items-center gap-1.5 mt-1 font-medium">
            <span className="text-xs">⚠</span> {errors.email}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-semibold text-[#172A3A]" style={{ fontFamily: 'Poppins' }}>
          Password
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
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
            className={`w-full pl-12 pr-12 py-3.5 border rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#4DA1FF]/50 focus:border-[#4DA1FF] focus:bg-white placeholder:text-slate-400 text-[#172A3A] font-medium ${errors.password ? 'border-red-400 bg-red-50/50 focus:ring-red-400/50' : 'border-slate-200 hover:border-slate-300'}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#4DA1FF] transition-colors duration-200"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-600 flex items-center gap-1.5 mt-1 font-medium">
            <span className="text-xs">⚠</span> {errors.password}
          </p>
        )}
      </div>

      {/* Forgot Password Link */}
      <div className="flex items-center justify-end">
        <Link
          to="/forgot-password"
          className="text-sm font-semibold text-[#4DA1FF] hover:text-[#3B82F6] transition-colors duration-200"
          style={{ fontFamily: 'Poppins' }}
        >
          Forgot Password?
        </Link>
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
            Signing in...
          </>
        ) : (
          <>
            <LogIn className="mr-2 h-5 w-5" />
            Sign In
          </>
        )}
      </Button>
    </form>
  );
};
