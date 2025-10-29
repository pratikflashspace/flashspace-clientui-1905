// ✅ src/components/ui/ContactModal.tsx
import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ContactModal({ isOpen, onClose }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  // 🧠 Close modal on ESC key press
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

  // 🚫 If modal not open, don’t render anything
  if (!isOpen) return null;

  // 🌟 Modal structure with glassmorphism design
  const modal = (
    <div
      ref={ref}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
      aria-modal="true"
      role="dialog"
    >
      {/* 🌫️ Background overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 🧊 Glassmorphic modal card */}
      <div
        className="
          relative w-full max-w-2xl 
          bg-white/10 
          backdrop-blur-2xl 
          border border-white/20 
          rounded-2xl 
          shadow-2xl 
          ring-1 ring-white/10 
          overflow-hidden
        "
      >
        {/* 🏷️ Modal Header */}
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-white flex items-center gap-3">
                <span className="text-yellow-400 text-xl">✨</span>
                Get in Touch
              </h3>
              <p className="text-sm text-white/70 mt-1">
                Fill out the form and we’ll get back to you within 24 hours.
              </p>
            </div>
            {/* ❌ Close button */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="ml-4 rounded-md p-2 hover:bg-white/10 text-white/80"
            >
              ✕
            </button>
          </div>

          {/* 📝 Form Section */}
          <form className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-white/80">
                Full Name *
              </label>
              <input
                className="mt-2 w-full rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter your full name"
                type="text"
                name="name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white/80">
                Email Address *
              </label>
              <input
                className="mt-2 w-full rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="your@email.com"
                type="email"
                name="email"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-white/80">
                Phone Number
              </label>
              <input
                className="mt-2 w-full rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="+91 98765 43210"
                type="tel"
                name="phone"
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-white/80">
                Company Name
              </label>
              <input
                className="mt-2 w-full rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Your Company"
                type="text"
                name="company"
              />
            </div>

            {/* Service Interest */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white/80">
                Service Interest
              </label>
              <select
                className="mt-2 w-full rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option className="bg-black text-white">Select a service</option>
                <option className="bg-black text-white">AI & Automation</option>
                <option className="bg-black text-white">Product Development</option>
                <option className="bg-black text-white">Design</option>
                <option className="bg-black text-white">Consulting</option>
              </select>
            </div>

            {/* Message */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white/80">
                Message
              </label>
              <textarea
                className="mt-2 w-full rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/50 px-4 py-3 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Tell us about your business needs..."
                name="message"
              />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 rounded-full bg-yellow-400 text-black font-semibold py-3 shadow-md hover:brightness-95 transition"
              >
                <span>🚀</span> Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  // 🪟 Render modal into body
  return ReactDOM.createPortal(modal, document.body);
}
