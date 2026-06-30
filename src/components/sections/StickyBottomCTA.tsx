import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { GetInTouchModal } from "@/components/modals/GetInTouchModal";

export const StickyBottomCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", city: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Hide if near the bottom (e.g., within 400px of the footer)
      const isNearBottom = scrollPosition + windowHeight >= documentHeight - 400;

      // Show when scrolled past the hero section (roughly 500px) and not near the footer
      if (scrollPosition > 500 && !isNearBottom) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsSubmitting(true);
    try {
      const rawBase = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5000" : window.location.origin);
      const base = rawBase.replace(/\/$/, "");

      const res = await fetch(`${base}/api/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "flashspace123",
          "x-flashspace-csrf": "true",
        },
        body: JSON.stringify({
          ...formData,
          source: "Virtual Office Sticky Bottom CTA",
          page: window.location.href,
        }),
      });

      const data = await res.json();

      if (data.ok || res.ok) {
        toast.success("Thank you! Our workspace expert will call you within 15 minutes.");
        setFormData({ name: "", phone: "", email: "", city: "" });
        setIsVisible(false); // Optionally hide it after success
      } else {
        toast.error(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="fixed bottom-0 left-0 right-0 z-[60] p-3 sm:p-4 bg-[#111A15] border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] backdrop-blur-md"
        >
          {/* Desktop View */}
          <div className="hidden md:flex max-w-6xl mx-auto items-center justify-center gap-6 md:pr-24 lg:pr-32">
            
            <div className="text-[#FEF8C5] font-extrabold text-lg shrink-0">
              Get a Callback
            </div>

            <form onSubmit={handleFormSubmit} className="flex items-center justify-center gap-3">
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full name"
                className="w-[180px] px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#FEF8C5] focus:ring-2 focus:ring-[#FEF8C5] focus:ring-offset-2 focus:ring-offset-[#111A15] focus:bg-white/10 transition-all duration-200 shadow-sm"
              />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Work email"
                className="w-[200px] px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#FEF8C5] focus:ring-2 focus:ring-[#FEF8C5] focus:ring-offset-2 focus:ring-offset-[#111A15] focus:bg-white/10 transition-all duration-200 shadow-sm"
              />
              <input
                type="tel"
                required
                maxLength={10}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                placeholder="Mobile"
                className="w-[160px] px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#FEF8C5] focus:ring-2 focus:ring-[#FEF8C5] focus:ring-offset-2 focus:ring-offset-[#111A15] focus:bg-white/10 transition-all duration-200 shadow-sm"
              />
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="City or state"
                className="w-[160px] px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#FEF8C5] focus:ring-2 focus:ring-[#FEF8C5] focus:ring-offset-2 focus:ring-offset-[#111A15] focus:bg-white/10 transition-all duration-200 shadow-sm"
              />
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="shrink-0 bg-[#FEF8C5] hover:bg-white text-[#111A15] px-6 py-2.5 rounded-xl text-sm font-extrabold transition-all disabled:opacity-70 flex items-center justify-center min-w-[150px] shadow-sm"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Request Callback"
                )}
              </button>
            </form>
          </div>

          {/* Mobile View */}
          <div className="md:hidden flex items-center justify-center px-1">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-[#FEF8C5] hover:bg-white text-[#111A15] py-3.5 rounded-xl text-[16px] font-extrabold shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              Claim Your Address <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
      <GetInTouchModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </AnimatePresence>
  );
};
