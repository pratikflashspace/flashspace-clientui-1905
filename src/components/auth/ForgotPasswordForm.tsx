import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '@/services/auth.service';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, Mail, ArrowLeft, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ForgotPasswordForm = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    try {
      setIsLoading(true);
      const response = await authService.forgotPassword({ email });

      if (response.success) {
        setIsSuccess(true);
        toast({
          title: 'Email Sent',
          description: response.message || 'Password reset link has been sent to your email.',
        });
      } else {
        throw new Error(response.message || 'Failed to send reset email');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send reset email';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-6 text-center" style={{ fontFamily: 'Poppins' }}>
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-50 to-green-100 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20 animate-in zoom-in duration-300">
            <CheckCircle className="h-12 w-12 text-green-600" strokeWidth={2.5} />
          </div>
        </div>

        {/* Success Message */}
        <div>
          <h3 className="text-2xl font-bold text-[#172A3A] mb-3" style={{ fontFamily: 'Poppins' }}>
            Check Your Email
          </h3>
          <p className="text-slate-600 mb-2">
            We've sent password reset instructions to
          </p>
          <p className="font-bold text-[#4DA1FF] text-lg">{email}</p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-5 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-[#4DA1FF]">
              <Mail size={20} />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-[#172A3A] mb-1">
                What's next?
              </p>
              <p className="text-xs text-slate-600">
                Click the link in your email to reset your password. Didn't receive it? Check your spam folder or try sending it again.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Login Button */}
        <div className="pt-2">
          <Link to="/login">
            <Button
              variant="outline"
              className="w-full py-6 rounded-xl border-2 border-slate-200 hover:border-[#4DA1FF] hover:bg-[#4DA1FF]/5 transition-all duration-300 font-semibold text-[#172A3A]"
              style={{ fontFamily: 'Poppins' }}
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" style={{ fontFamily: 'Poppins' }}>
      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-semibold text-[#172A3A]" style={{ fontFamily: 'Poppins' }}>
          Email Address
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <Mail size={20} />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
            disabled={isLoading}
            className={`w-full pl-12 pr-4 py-3.5 border rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#4DA1FF]/50 focus:border-[#4DA1FF] focus:bg-white placeholder:text-slate-400 text-[#172A3A] font-medium ${error ? 'border-red-400 bg-red-50/50 focus:ring-red-400/50' : 'border-slate-200 hover:border-slate-300'}`}
          />
        </div>
        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1.5 font-medium">
            <span className="text-xs">⚠</span> {error}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-[#4DA1FF] to-[#3B82F6] hover:from-[#4DA1FF]/90 hover:to-[#3B82F6]/90 text-white font-bold py-6 rounded-xl shadow-lg shadow-[#4DA1FF]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#4DA1FF]/40 hover:-translate-y-0.5 text-base"
        style={{ fontFamily: 'Poppins' }}
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

      {/* Back to Login Link */}
      <div className="text-center pt-2">
        <Link
          to="/login"
          className="text-sm text-slate-600 hover:text-[#4DA1FF] font-semibold inline-flex items-center gap-2 transition-colors duration-200"
          style={{ fontFamily: 'Poppins' }}
        >
          <ArrowLeft size={16} />
          Back to Login
        </Link>
      </div>
    </form>
  );
};
