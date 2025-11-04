import { VerifyOTPForm } from '@/components/auth/VerifyOTPForm';
import { Link } from 'react-router-dom';
import { Building2, ArrowLeft, Mail, Shield, Sparkles } from 'lucide-react';

const VerifyOTP = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50/30 relative overflow-hidden" style={{ fontFamily: 'Poppins' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      
      {/* Animated Circles */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-[#4DA1FF]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Top Navigation */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
        <Link to="/signup" className="flex items-center gap-2 text-[#172A3A] hover:text-[#4DA1FF] transition-colors duration-300 font-semibold">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Signup</span>
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
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-500/10 to-transparent rounded-full blur-2xl -z-0" />
            
            {/* Content */}
            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#4DA1FF] to-[#3B82F6] rounded-2xl mb-6 shadow-lg shadow-[#4DA1FF]/30 relative animate-in zoom-in duration-300">
                  <Mail className="w-12 h-12 text-white" strokeWidth={2.5} />
                  <div className="absolute -top-2 -right-2 w-9 h-9 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-[#EDB003] rounded-full flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                  </div>
                </div>
                <h1 className="text-4xl font-bold mb-3 text-[#172A3A]" style={{ fontFamily: 'Poppins' }}>
                  Verify Your Email
                </h1>
                <p className="text-slate-600 text-base font-medium">
                  We've sent a 6-digit code to your email address
                </p>
              </div>

              {/* Form */}
              <VerifyOTPForm />
            </div>
          </div>

          {/* Bottom Text */}
          <p className="text-center text-sm text-slate-500 mt-8 font-medium">
            🔒 Didn't receive the code? Check your spam folder
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
