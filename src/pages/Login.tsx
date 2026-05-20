import { LoginForm } from "@/components/auth/LoginForm";
import { useCallback } from "react";
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { isCheckoutReturnPath } from "@/utils/checkoutSession";

const Login = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const stateRedirectTo = (location.state as { redirectTo?: string } | null)
    ?.redirectTo;
  const requestedRedirect =
    stateRedirectTo ||
    searchParams.get("redirectTo") ||
    searchParams.get("redirect") ||
    "/";
  
  const isDefaultRedirect = requestedRedirect === "/";
  
  const redirectTo = isCheckoutReturnPath(requestedRedirect)
    ? requestedRedirect
    : requestedRedirect;

  const handleLoginSuccess = useCallback(() => {
    navigate(isDefaultRedirect ? "/" : redirectTo, { replace: true });
  }, [navigate, redirectTo, isDefaultRedirect]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAF7] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#35503F]" />
      </div>
    );
  }

  if (isAuthenticated && user) {
    const finalDest = isDefaultRedirect ? "/" : redirectTo;
    return <Navigate to={finalDest} replace />;
  }

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
              Welcome Back
            </h1>
            <p className="text-[#677E73] text-sm font-medium">
              Sign in to access your virtual office
            </p>
          </div>

          <LoginForm onSuccess={handleLoginSuccess} />

          <div className="mt-6 text-center">
            <p className="text-sm text-[#677E73]">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="font-bold text-[#35503F] hover:text-[#1F2E26] transition-colors duration-200"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-[#677E73] mt-6 font-medium">
          Secure login powered by FlashSpace
        </p>
      </div>
    </div>
  );
};

export default Login;
