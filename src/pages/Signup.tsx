import { SignupForm } from "@/components/auth/SignupForm";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const Signup = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center px-4 py-12"
      style={{ fontFamily: "Poppins" }}
    >
      <div className="w-full max-w-lg">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <img
              src="https://cdn.prod.website-files.com/664330484432dcdd6519a8fd/665dd8e0007de68a44f3750b_Black%20and%20White%20Bold%20Typography%20Clothing%20Brand%20Logo%20(940%20x%20400%20px)%20(940%20x%20200%20px)%20(940%20x%20150%20px).png"
              alt="FlashSpace Logo"
              className="h-12 mx-auto mb-3"
            />
            <h2 className="text-2xl font-bold text-[#172A3A] mb-2">
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
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-[#4DA1FF] hover:text-[#3B82F6] transition-colors duration-200"
              >
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
