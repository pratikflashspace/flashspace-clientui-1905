import { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Loader2,
  Mail,
  Send,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ForgotPasswordForm = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    try {
      setIsLoading(true);
      const response = await authService.forgotPassword({ email });

      if (response.success) {
        setIsSuccess(true);
        toast({
          title: "Email Sent",
          description:
            response.message || "Password reset link has been sent to your email.",
        });
      } else {
        throw new Error(response.message || "Failed to send reset email");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to send reset email";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div
        className="space-y-6 text-center"
        style={{ fontFamily: '"Inner Tight", system-ui, sans-serif' }}
      >
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-2xl bg-[#EAF6EF] text-[#1FA463] flex items-center justify-center shadow-[0_14px_30px_rgba(31,164,99,0.16)] animate-in zoom-in duration-300">
            <CheckCircle className="h-10 w-10" strokeWidth={2.5} />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#1F2E26] mb-2">
            Check Your Email
          </h2>
          <p className="text-sm font-medium text-[#677E73] mb-2">
            We've sent password reset instructions to
          </p>
          <p className="break-words font-bold text-[#35503F] text-base">
            {email}
          </p>
        </div>

        <div className="bg-[#F8FAF7] border border-[#DDE5DA] rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#35503F] border border-[#E5E9E3]">
              <Mail size={18} />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-[#1F2E26] mb-1">
                What's next?
              </p>
              <p className="text-xs leading-5 text-[#677E73]">
                Click the link in your email to reset your password. Didn't
                receive it? Check your spam folder or try sending it again.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Link to="/login">
            <Button
              variant="outline"
              className="w-full h-12 rounded-xl border-[#DDE5DA] hover:border-[#35503F] hover:bg-[#35503F]/5 transition-all duration-200 font-semibold text-[#1F2E26]"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
      style={{ fontFamily: '"Inner Tight", system-ui, sans-serif' }}
    >
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-bold text-[#1F2E26]">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#93A59B]">
            <Mail size={19} />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            disabled={isLoading}
            className={`w-full pl-12 pr-4 py-3.5 border rounded-xl bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#35503F]/15 focus:border-[#35503F] placeholder:text-[#A2AEA8] text-[#1F2E26] font-medium ${
              error
                ? "border-red-400 bg-red-50/50 focus:ring-red-400/20"
                : "border-[#DDE5DA] hover:border-[#B8C6BD]"
            }`}
          />
        </div>
        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1.5 font-medium">
            <AlertCircle className="h-4 w-4" /> {error}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full h-12 bg-[#35503F] hover:bg-[#1F2E26] text-[#FEF8C3] font-bold rounded-xl shadow-lg shadow-[#35503F]/15 transition-all duration-200 text-base"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="mr-2 h-5 w-5" />
            Send Reset Link
          </>
        )}
      </Button>

      <div className="text-center pt-2">
        <Link
          to="/login"
          className="text-sm text-[#677E73] hover:text-[#1F2E26] font-semibold inline-flex items-center gap-2 transition-colors duration-200"
        >
          <ArrowLeft size={16} />
          Back to Login
        </Link>
      </div>
    </form>
  );
};
