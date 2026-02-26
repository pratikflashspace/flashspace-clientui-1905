// ✅ src/components/ui/ContactModal.tsx
import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ContactModal({ isOpen, onClose }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  // Close modal on ESC key press
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden"; // Prevent scroll
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // If modal not open, don’t render anything
  if (!isOpen) return null;

  const modal = (
    <div
      ref={ref}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      aria-modal="true"
      role="dialog"
      style={{ fontFamily: '"Inner Tight", system-ui, sans-serif' }}
    >
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal card */}
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row z-10 max-h-[90vh] overflow-y-auto"
      >
        {/* Left Column - Contact Info */}
        <div className="w-full md:w-[45%] p-4 md:p-6 flex flex-col gap-3 bg-white border-b md:border-b-0 md:border-r border-slate-100">

          {/* Support */}
          <div className="bg-[#F1F3F5] rounded-xl p-4 border border-slate-200">
            <h4 className="text-[#1F2E26] text-lg font-bold mb-1.5">Support</h4>
            <p className="text-[#677E73] text-sm leading-relaxed mb-2">
              Need technical help or facing issues with our platform? Our support team is here 24×7.
            </p>
            <p className="text-[#1F2E26] text-sm">
              <span className="font-bold">Support Mail:</span> <a href="mailto:support@flashspace.co" className="text-[#35503F] underline underline-offset-2">support@flashspace.co</a>
            </p>
          </div>

          {/* Sales */}
          <div className="bg-[#F1F3F5] rounded-xl p-4 border border-slate-200">
            <h4 className="text-[#1F2E26] text-lg font-bold mb-1.5">Sales</h4>
            <p className="text-[#677E73] text-sm leading-relaxed mb-2">
              Want to explore FlashSpace solutions? Our sales experts will help you find the right plan.
            </p>
            <p className="text-[#1F2E26] text-sm mb-1">
              <span className="font-bold">Sales Mail:</span> <a href="mailto:sales@flashspace.co" className="text-[#35503F] underline underline-offset-2">sales@flashspace.co</a>
            </p>
            <p className="text-[#1F2E26] text-sm">
              <span className="font-bold">Contact:</span> <span className="text-[#1F2E26]">8100888777</span>
            </p>
          </div>

          {/* Partnership */}
          <div className="bg-[#F1F3F5] rounded-xl p-4 border border-slate-200">
            <h4 className="text-[#1F2E26] text-lg font-bold mb-1.5">Partnership</h4>
            <p className="text-[#677E73] text-sm leading-relaxed mb-2">
              Interested in collaborating or becoming a partner? Let's build future-ready solutions.
            </p>
            <p className="text-[#1F2E26] text-sm">
              <span className="font-bold">Partnership Mail:</span> <a href="mailto:partner@flashspace.co" className="text-[#35503F] underline underline-offset-2">partner@flashspace.co</a>
            </p>
          </div>

        </div>

        {/* Right Column - Form */}
        <div className="w-full md:w-[55%] p-4 md:p-6 lg:p-8 relative bg-white flex flex-col justify-center">

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 text-gray-500 hover:text-black transition-colors rounded-full hover:bg-gray-100 z-10"
          >
            <X className="w-4 h-4" />
          </button>

          <h3 className="text-2xl font-bold text-[#1F2E26] mb-5 text-center">
            Get in <span className="text-[#35503F]">Touch</span>
          </h3>

          <form className="flex flex-col gap-3">
            {/* Full Name */}
            <div>
              <label className="block text-[13px] font-bold text-[#1F2E26] mb-1">
                Full Name
              </label>
              <input
                className="w-full rounded-xl border border-slate-200 bg-[#FCFCFC] text-[#1F2E26] placeholder:text-[#677E73] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#35503F]/20 focus:border-[#35503F] transition-all"
                placeholder="Your Name"
                type="text"
                name="name"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-[13px] font-bold text-[#1F2E26] mb-1">
                Phone Number
              </label>
              <input
                className="w-full rounded-xl border border-slate-200 bg-[#FCFCFC] text-[#1F2E26] placeholder:text-[#677E73] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#35503F]/20 focus:border-[#35503F] transition-all"
                placeholder="+91 9876543210"
                type="tel"
                name="phone"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[13px] font-bold text-[#1F2E26] mb-1">
                Email
              </label>
              <input
                className="w-full rounded-xl border border-slate-200 bg-[#FCFCFC] text-[#1F2E26] placeholder:text-[#677E73] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#35503F]/20 focus:border-[#35503F] transition-all"
                placeholder="you@example.com"
                type="email"
                name="email"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-[13px] font-bold text-[#1F2E26] mb-1">
                Message
              </label>
              <textarea
                className="w-full rounded-xl border border-slate-200 bg-[#FCFCFC] text-[#1F2E26] placeholder:text-[#677E73] px-3 py-2.5 h-20 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#35503F]/20 focus:border-[#35503F] transition-all"
                placeholder="How can we help?"
                name="message"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-2 rounded-xl bg-[#35503F] hover:bg-[#2A4032] text-[#FEF8C3] font-semibold text-sm py-3 transition-all shadow-sm"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  // 🪟 Render modal into body
  return ReactDOM.createPortal(modal, document.body);
}
