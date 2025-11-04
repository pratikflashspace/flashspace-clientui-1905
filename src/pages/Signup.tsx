import { SignupForm } from '@/components/auth/SignupForm';
import { Link } from 'react-router-dom';
import { Building2, ArrowLeft, CheckCircle2, Sparkles, Zap, Shield, TrendingUp } from 'lucide-react';

const Signup = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50/30 relative overflow-hidden" style={{ fontFamily: 'Poppins' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      
      {/* Animated Gradient Circles */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-[#4DA1FF]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-[#EDB003]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      
      {/* Top Navigation */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
        <Link to="/" className="flex items-center gap-2 text-[#172A3A] hover:text-[#4DA1FF] transition-colors duration-300 font-semibold">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
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
        <div className="max-w-5xl w-full grid md:grid-cols-2 gap-10 items-center">
          {/* Left Side - Benefits */}
          <div className="hidden md:block space-y-8">
            <div>
              <h2 className="text-5xl font-bold mb-4 text-[#172A3A]" style={{ fontFamily: 'Poppins' }}>
                Start Your Journey
              </h2>
              <p className="text-lg text-slate-600 mb-8 font-medium">
                Join thousands of businesses transforming their workspace
              </p>
            </div>
            
            <div className="space-y-5">
              {[
                { text: 'Access premium coworking spaces', icon: Building2 },
                { text: 'Virtual office solutions', icon: Zap },
                { text: 'On-demand meeting rooms', icon: Shield },
                { text: 'Exclusive community benefits', icon: TrendingUp },
              ].map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#4DA1FF] to-[#3B82F6] rounded-xl flex items-center justify-center shadow-lg shadow-[#4DA1FF]/30 group-hover:shadow-xl group-hover:shadow-[#4DA1FF]/40 transition-all duration-300 group-hover:-translate-y-1">
                    <benefit.icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-[#172A3A] text-lg font-semibold">{benefit.text}</p>
                    <p className="text-slate-500 text-sm mt-0.5">Get started in minutes</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#4DA1FF]">10K+</div>
                <div className="text-sm text-slate-600 mt-1">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#EDB003]">100+</div>
                <div className="text-sm text-slate-600 mt-1">Locations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-500">98%</div>
                <div className="text-sm text-slate-600 mt-1">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div>
            <div className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-2xl shadow-slate-300/50 p-8 md:p-10 relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#4DA1FF]/10 to-transparent rounded-full blur-2xl -z-0" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#EDB003]/10 to-transparent rounded-full blur-2xl -z-0" />
              
              {/* Content */}
              <div className="relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#4DA1FF] to-[#3B82F6] rounded-2xl mb-5 shadow-lg shadow-[#4DA1FF]/30 relative">
                    <Building2 className="w-10 h-10 text-white" strokeWidth={2.5} />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#EDB003] rounded-full flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                    </div>
                  </div>
                  <h1 className="text-4xl font-bold mb-3 text-[#172A3A]" style={{ fontFamily: 'Poppins' }}>
                    Create Account
                  </h1>
                  <p className="text-slate-600 text-base font-medium">
                    Get started with FlashSpace today
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
            </div>

            {/* Bottom Text */}
            <p className="text-center text-sm text-slate-500 mt-6 font-medium">
              By signing up, you agree to our Terms and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
