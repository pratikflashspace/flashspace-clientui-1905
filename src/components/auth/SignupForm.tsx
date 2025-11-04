import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Loader2, User, Mail, Phone, Lock, Sparkles } from 'lucide-react';

export const SignupForm = () => {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await signup(formData);
      navigate(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const inputClass = (hasError: boolean) => `w-full pl-12 pr-4 py-3.5 border rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#4DA1FF]/50 focus:border-[#4DA1FF] focus:bg-white placeholder:text-slate-400 text-[#172A3A] font-medium ${hasError ? 'border-red-400 bg-red-50/50 focus:ring-red-400/50' : 'border-slate-200 hover:border-slate-300'}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5" style={{ fontFamily: 'Poppins' }}>
      {/* Full Name Field */}
      <div className="space-y-2">
        <label htmlFor="fullName" className="block text-sm font-semibold text-[#172A3A]" style={{ fontFamily: 'Poppins' }}>
          Full Name
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <User size={20} />
          </div>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleChange}
            disabled={isLoading}
            className={inputClass(!!errors.fullName)}
          />
        </div>
        {errors.fullName && (
          <p className="text-sm text-red-600 flex items-center gap-1.5 mt-1 font-medium">
            <span className="text-xs">⚠</span> {errors.fullName}
          </p>
        )}
      </div>

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
            className={inputClass(!!errors.email)}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-600 flex items-center gap-1.5 mt-1 font-medium">
            <span className="text-xs">⚠</span> {errors.email}
          </p>
        )}
      </div>

      {/* Phone Number Field */}
      <div className="space-y-2">
        <label htmlFor="phoneNumber" className="block text-sm font-semibold text-[#172A3A]" style={{ fontFamily: 'Poppins' }}>
          Phone Number <span className="text-slate-400 font-normal text-xs">(Optional)</span>
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <Phone size={20} />
          </div>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            placeholder="+91 9876543210"
            value={formData.phoneNumber}
            onChange={handleChange}
            disabled={isLoading}
            className={inputClass(false)}
          />
        </div>
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
            className={inputClass(!!errors.password)}
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

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#172A3A]" style={{ fontFamily: 'Poppins' }}>
          Confirm Password
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <Lock size={20} />
          </div>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isLoading}
            className={inputClass(!!errors.confirmPassword)}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#4DA1FF] transition-colors duration-200"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-600 flex items-center gap-1.5 mt-1 font-medium">
            <span className="text-xs">⚠</span> {errors.confirmPassword}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-[#4DA1FF] to-[#3B82F6] hover:from-[#4DA1FF]/90 hover:to-[#3B82F6]/90 text-white font-bold py-6 rounded-xl shadow-lg shadow-[#4DA1FF]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#4DA1FF]/40 hover:-translate-y-0.5 mt-6 text-base" 
        style={{ fontFamily: 'Poppins' }}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Creating account...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-5 w-5" />
            Create Account
          </>
        )}
      </Button>
    </form>
  );
};
