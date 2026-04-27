import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!token) {
      setError("This reset link is missing a valid token.");
      return;
    }

    if (passwords.password !== passwords.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (passwords.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await authService.resetPassword({
        token,
        password: passwords.password,
        confirmPassword: passwords.confirmPassword,
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to reset password.");
      }

      setIsSuccess(true);
      toast({
        title: "Password Updated",
        description: "You can now sign in with your new password.",
      });

      window.setTimeout(() => navigate("/login"), 1600);
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to reset password.";
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center px-4 py-12"
      style={{ fontFamily: "Poppins" }}
    >
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              <span className="text-[#172A3A]">FLASH</span>
              <span className="text-[#EDB003]">Space</span>
            </h1>
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-2xl bg-[#172A3A] text-white flex items-center justify-center shadow-lg shadow-slate-900/10">
                {isSuccess ? (
                  <CheckCircle className="h-8 w-8" />
                ) : (
                  <KeyRound className="h-8 w-8" />
                )}
              </div>
            </div>
            <h2 className="text-3xl font-bold text-[#172A3A] mb-2">
              {isSuccess ? "Password Updated" : "Reset Password"}
            </h2>
            <p className="text-slate-600 text-base font-medium">
              {isSuccess
                ? "Redirecting you to sign in."
                : "Choose a new password for your account."}
            </p>
          </div>

          {!token && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              This reset link is invalid or incomplete.
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-[#172A3A]"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={passwords.password}
                  onChange={(event) =>
                    setPasswords((prev) => ({
                      ...prev,
                      password: event.target.value,
                    }))
                  }
                  disabled={isLoading || isSuccess || !token}
                  minLength={8}
                  required
                  className="w-full pl-4 pr-12 py-3.5 border rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#4DA1FF]/50 focus:border-[#4DA1FF] focus:bg-white placeholder:text-slate-400 text-[#172A3A] font-medium border-slate-200 hover:border-slate-300"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#172A3A]"
                  disabled={isLoading || isSuccess || !token}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-[#172A3A]"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwords.confirmPassword}
                  onChange={(event) =>
                    setPasswords((prev) => ({
                      ...prev,
                      confirmPassword: event.target.value,
                    }))
                  }
                  disabled={isLoading || isSuccess || !token}
                  minLength={8}
                  required
                  className="w-full pl-4 pr-12 py-3.5 border rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#4DA1FF]/50 focus:border-[#4DA1FF] focus:bg-white placeholder:text-slate-400 text-[#172A3A] font-medium border-slate-200 hover:border-slate-300"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#172A3A]"
                  disabled={isLoading || isSuccess || !token}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#172A3A] hover:bg-[#22394c] text-white font-bold py-6 rounded-xl shadow-lg shadow-slate-900/20 transition-all duration-300 text-base"
              disabled={isLoading || isSuccess || !token}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-slate-600 hover:text-[#4DA1FF] font-semibold inline-flex items-center gap-2 transition-colors duration-200"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
