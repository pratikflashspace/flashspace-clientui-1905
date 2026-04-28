import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  return (
    <div
      className="min-h-screen bg-[#F8FAF7] flex items-center justify-center px-4 py-10"
      style={{ fontFamily: '"Inner Tight", system-ui, sans-serif' }}
    >
      <div className="w-full max-w-[520px]">
        <div className="bg-white rounded-2xl border border-[#E5E9E3] shadow-[0_18px_50px_rgba(31,46,38,0.10)] p-6 sm:p-8 md:p-10">
          <div className="text-center mb-8">
            <img
              src="/Logo/Flashspace Logo.png"
              alt="FlashSpace"
              className="mx-auto mb-5 h-14 w-auto object-contain"
            />
            <h1 className="text-3xl font-bold text-[#1F2E26] mb-2">
              Forgot Password?
            </h1>
            <p className="text-[#677E73] text-sm font-medium">
              Enter your email and we'll send a secure reset link.
            </p>
          </div>

          <ForgotPasswordForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-[#677E73]">
              Remember your password?{" "}
              <Link
                to="/login"
                className="font-bold text-[#35503F] hover:text-[#1F2E26] transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-[#677E73] mt-6 font-medium">
          Your account stays protected while we verify the reset request.
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
