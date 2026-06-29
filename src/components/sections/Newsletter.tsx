import React, { useState } from 'react';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast.success("Subscribed successfully! You'll hear from us soon.");
    setEmail('');
  };

  return (
    <section className="py-20 lg:py-24 bg-white border-t border-b border-[#D4E0D0]">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="bg-[#36503F] rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
          {/* Decorative background shapes */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-[#FEF8C5]/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 text-center">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-[#FEF8C5]" />
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
              Stay in the loop
            </h2>
            <p className="text-[#D4E0D0] text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Join 5,000+ businesses receiving our weekly newsletter on compliance, tax savings, and growth strategies.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <div className="relative flex-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-5 py-4 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/60 focus:bg-white/20 focus:border-[#FEF8C5] focus:ring-1 focus:ring-[#FEF8C5] outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-4 bg-[#FEF8C5] hover:bg-white text-[#36503F] font-bold rounded-xl transition-colors flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Subscribe <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
            <p className="text-white/50 text-xs mt-4">We care about your data in our privacy policy.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
