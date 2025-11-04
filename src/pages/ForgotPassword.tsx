import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { Link } from 'react-router-dom';
import { Building2, ArrowLeft, KeyRound, Info, Sparkles } from 'lucide-react';

const ForgotPassword = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50/30 relative overflow-hidden" style={{ fontFamily: 'Poppins' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      
      {/* Animated Circles */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-[#4DA1FF]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#EDB003]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.2s' }} />
      
      {/* Top Navigation */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
        <Link to="/login" className="flex items-center gap-2 text-[#172A3A] hover:text-[#4DA1FF] transition-colors duration-300 font-semibold">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Login</span>
        </Link>
        <Link to="/" className="flex items-center gap-2 font-bold text-2xl">
          <Building2 className="w-8 h-8 text-[#4DA1FF]" />
          <span className="bg-gradient-to-r from-[#4DA1FF] to-[#3B82F6] bg-clip-text text-transparent">
            FlashSpace
          </span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12">
        <div className="max-w-lg w-full">
          {/* Card */}
          <div className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-2xl shadow-slate-300/50 p-8 md:p-10 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#4DA1FF]/10 to-transparent rounded-full blur-2xl -z-0" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#EDB003]/10 to-transparent rounded-full blur-2xl -z-0" />
            
            {/* Content */}
            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#4DA1FF] to-[#3B82F6] rounded-2xl mb-5 shadow-lg shadow-[#4DA1FF]/30 relative">
                  <KeyRound className="w-10 h-10 text-white" strokeWidth={2.5} />
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#EDB003] rounded-full flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                  </div>
                </div>
                <h1 className="text-4xl font-bold mb-3 text-[#172A3A]" style={{ fontFamily: 'Poppins' }}>
                  Forgot Password?
                </h1>
                <p className="text-slate-600 text-base font-medium">
                  No worries, we'll send you reset instructions
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-5 mb-6 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-amber-600">
                    <Info size={20} />
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-[#172A3A] mb-1">Password Reset</p>
                    <p className="text-slate-600">Enter your email and we'll send you a link to reset your password</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <ForgotPasswordForm />

              {/* Footer Links */}
              <div className="mt-6 text-center">
                <p className="text-sm text-slate-600">
                  Remember your password?{' '}
                  <Link to="/login" className="font-bold text-[#4DA1FF] hover:text-[#3B82F6] transition-colors duration-200">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Text */}
          <p className="text-center text-sm text-slate-500 mt-8 font-medium">
            🔒 Protected by FlashSpace Security
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
