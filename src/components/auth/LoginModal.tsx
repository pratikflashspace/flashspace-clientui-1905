import { useEffect } from "react";
import { X } from "lucide-react";
import { LoginForm } from "./LoginForm";
import { Link } from "react-router-dom";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignupClick?: () => void;
  onLoginSuccess?: () => void;
}

export const LoginModal = ({
  isOpen,
  onClose,
  onSignupClick,
  onLoginSuccess,
}: LoginModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200]">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-all animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Center Container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-[460px] bg-white rounded-2xl border border-[#E5E9E3] shadow-[0_24px_70px_rgba(0,0,0,0.22)] p-6 sm:p-8 animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh] scrollbar-hide"
          onClick={(e) => e.stopPropagation()}
          style={{ fontFamily: '"Inner Tight", system-ui, sans-serif' }}
          data-lenis-prevent
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content of the Login Card */}
          <div className="text-center mb-6">
            <img
              src="/Logo/Flashspace Logo.png"
              alt="FlashSpace"
              className="mx-auto mb-4 h-12 w-auto object-contain"
            />
            <h2 className="text-2xl font-bold text-[#1F2E26] mb-1.5">
              Welcome Back
            </h2>
            <p className="text-[#677E73] text-sm font-medium">
              Sign in to access your virtual office
            </p>
          </div>

          <LoginForm onSuccess={onLoginSuccess} />

          <div className="mt-6 text-center">
            <p className="text-sm text-[#677E73]">
              Don't have an account?{" "}
              {onSignupClick ? (
                <button
                  onClick={onSignupClick}
                  className="font-bold text-[#35503F] hover:text-[#1F2E26] transition-colors duration-200"
                >
                  Sign up for free
                </button>
              ) : (
                <Link
                  to="/signup"
                  onClick={onClose}
                  className="font-bold text-[#35503F] hover:text-[#1F2E26] transition-colors duration-200"
                >
                  Sign up for free
                </Link>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
