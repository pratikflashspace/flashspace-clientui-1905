import { VerifyOTPForm } from '@/components/auth/VerifyOTPForm';
import { Link } from 'react-router-dom';

const VerifyOTP = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center px-4 py-12" style={{ fontFamily: 'Poppins' }}>
      <div className="w-full max-w-lg">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              <span className="text-[#172A3A]">FLASH</span>
              <span className="text-[#EDB003]">Space</span>
            </h1>
            <h2 className="text-3xl font-bold text-[#172A3A] mb-2">
              Verify Your Email
            </h2>
            <p className="text-slate-600 text-base font-medium">
              We've sent a 6-digit code to your email address
            </p>
          </div>

          {/* Form */}
          <VerifyOTPForm />
        </div>

        {/* Bottom Text */}
        <p className="text-center text-sm text-slate-500 mt-8 font-medium">
          📧 Didn't receive the code? Check your spam folder
        </p>
      </div>
    </div>
  );
};

export default VerifyOTP;