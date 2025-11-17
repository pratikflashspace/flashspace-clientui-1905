import { SignupForm } from '@/components/auth/SignupForm';
import { Link } from 'react-router-dom';

const Signup = () => {
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
              Create Account
            </h2>
            <p className="text-slate-600 text-base font-medium">
              Join thousands of businesses transforming their workspace
            </p>
          </div>

          {/* Form */}
          <SignupForm />

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[#4DA1FF] hover:text-[#3B82F6] transition-colors duration-200">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom Text */}
        <p className="text-center text-sm text-slate-500 mt-8 font-medium">
          🔒 Your data is secure with FlashSpace
        </p>
      </div>
    </div>
  );
};

export default Signup;