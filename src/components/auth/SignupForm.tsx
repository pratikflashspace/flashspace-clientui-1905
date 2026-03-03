import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Loader2, User, Mail, Phone, Lock, ArrowRight, Building2 } from 'lucide-react';
import { GoogleLoginButton } from './GoogleLoginButton';
import { toast } from 'sonner';

export const SignupForm = ({ initialRole = 'user' }: { initialRole?: 'user' | 'partner' | 'affiliate' }) => {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();

  // Steps: 1 = Phone, 2 = OTP, 3 = Details
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: initialRole,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validatePhone = () => {
    if (!formData.phoneNumber) return 'Phone number is required';
    if (!/^\+?[0-9]{10,15}$/.test(formData.phoneNumber)) return 'Invalid phone number';
    return '';
  };

  const handleSendOtp = () => {
    const phoneError = validatePhone();
    if (phoneError) {
      setErrors({ phoneNumber: phoneError });
      return;
    }
    // Simulate sending OTP
    // console.log('Sending OTP to', formData.phoneNumber);
    toast.success('OTP sent successfully: 123456'); // [NEW] Show OTP in toast
    // Move to next step
    setStep(2);
    setErrors({});
  };

  const handleVerifyOtp = () => {
    if (otp === '123456') {
      setStep(3);
      setErrors({});
    } else {
      setErrors({ otp: 'Invalid OTP. Try 123456' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    else if (!/[A-Z]/.test(formData.password)) newErrors.password = 'Password must contain at least one uppercase letter';
    else if (!/[a-z]/.test(formData.password)) newErrors.password = 'Password must contain at least one lowercase letter';
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) newErrors.password = 'Password must contain at least one special character';

    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

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
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const inputClass = () => `w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4DA1FF]/20 focus:border-[#4DA1FF] placeholder:text-slate-400 text-[#172A3A]`;

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4" style={{ fontFamily: 'Poppins' }}>


      {/* Step 1 & 2: Phone Number */}
      {(step === 1 || step === 2) && (
        <div className="space-y-2">
          <label htmlFor="phoneNumber" className="block text-sm font-semibold text-[#586A7E]">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10">
              <Phone size={20} />
            </div>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              placeholder="+91 9876543210"
              value={formData.phoneNumber}
              onChange={handleChange}
              disabled={step === 2}
              className={inputClass()}
            />
          </div>
          {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}

          {step === 1 && (
            <Button
              type="button"
              onClick={handleSendOtp}
              className="w-full bg-[#EDB003] hover:bg-[#d99f03] text-white font-bold py-3.5 rounded-xl mt-4"
            >
              Send OTP
            </Button>
          )}
        </div>
      )}

      {/* Step 2: OTP Verification */}
      {step === 2 && (
        <div className="space-y-2">
          <label htmlFor="otp" className="block text-sm font-semibold text-[#586A7E]">
            Enter OTP
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10">
              <Lock size={20} />
            </div>
            <input
              id="otp"
              name="otp"
              type="text"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className={inputClass()}
            />
          </div>
          {errors.otp && <p className="text-red-500 text-xs mt-1">{errors.otp}</p>}

          <div className="flex gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              className="flex-1 py-3.5 rounded-xl border-slate-200"
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={handleVerifyOtp}
              className="flex-1 bg-[#EDB003] hover:bg-[#d99f03] text-white font-bold py-3.5 rounded-xl"
            >
              Verify OTP
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Detailed Form */}
      {step === 3 && (
        <>
          <div className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#586A7E]">Full Name</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10"><User size={20} /></div>
                <input name="fullName" type="text" placeholder="John Doe" value={formData.fullName} onChange={handleChange} className={inputClass()} />
              </div>
              {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#586A7E]">Email Address</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10"><Mail size={20} /></div>
                <input name="email" type="email" placeholder="your@email.com" value={formData.email} onChange={handleChange} className={inputClass()} />
              </div>
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#586A7E]">Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10"><Lock size={20} /></div>
                <input name="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={formData.password} onChange={handleChange} className={inputClass()} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 z-10">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
            </div>
            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#586A7E]">Confirm Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10"><Lock size={20} /></div>
                <input name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} className={inputClass()} />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 z-10">
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
            </div>
          </div>

          <Button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-[#EDB003] hover:bg-[#d99f03] text-white font-bold py-3.5 rounded-xl shadow-md transition-all duration-200 mt-6"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Creating account...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>Create Account</span>
                <ArrowRight className="h-5 w-5" />
              </div>
            )}
          </Button>
        </>
      )}

      {/* Social Login - only show on step 1 to keep it clean, or step 3? Let's keep it on step 1 */}
      {step === 1 && (
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">or continue with</span>
            </div>
          </div>
          <div className="mt-6">
            <GoogleLoginButton onSuccess={() => navigate('/dashboard')} role={formData.role} />
          </div>
        </div>
      )}
    </form>
  );
};
