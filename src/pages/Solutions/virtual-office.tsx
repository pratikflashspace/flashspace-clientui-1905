import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  FileText,
  Mail,
  Phone,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Building2,
  ChevronDown,
  Loader2,
  X,
  Check
} from "lucide-react";
import { toast } from "sonner";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Stats } from "@/components/sections/Stats";
import { VirtualOfficesLocations } from "@/components/sections/VirtualOfficesLocations";
import { WhyFlashSpace } from "@/components/sections/WhyFlashSpace";
import { BusinessSetupPlans } from "@/components/sections/BusinessSetupPlans";
import { AddOnsSection } from "@/components/sections/AddOnsSection";
import { WeGotFeatured } from "@/components/sections/WeGotFeatured";
import { PartneredSpaces } from "@/components/sections/PartneredSpaces";
import { TrustedByFilmstrip } from "@/components/sections/TrustedByFilmstrip";
import { TrustedByFilmstripMobile } from "@/components/sections/TrustedByFilmstripMobile";
import { StickyBottomCTA } from "@/components/sections/StickyBottomCTA";
import { TestimonialSection, ExpertsSection } from "@/components/sections/TestimonialAndExperts";
import { PlanComparison } from "@/components/sections/PlanComparison";
import { Newsletter } from "@/components/sections/Newsletter";
import { GetInTouchModal } from "@/components/modals/GetInTouchModal";

const features = [
  { icon: MapPin, title: "Premium Business Address", desc: "Get a prestigious address in top commercial districts across 20+ states." },
  { icon: FileText, title: "GST Registration Ready", desc: "100% compliant documents (NOC, Rent Agreement) provided within 48 hours." },
  { icon: Mail, title: "Mail & Courier Handling", desc: "Never miss a delivery. We receive, scan, and forward your physical mail." },
  { icon: Phone, title: "Dedicated Phone Line", desc: "Get a local landline number with professional call answering and forwarding." },
];

const faqs = [
  { q: "What is a virtual office and who needs it?", a: "A virtual office provides a premium business address without the high costs of physical office space. It is perfect for startups, freelancers, remote teams, and businesses expanding to new cities, offering benefits like GST registration, mail handling, and a professional image." },
  { q: "Is a Virtual Office legal for GST Registration?", a: "Yes, 100% legal. We provide the mandatory NOC, Utility Bill, and Rent Agreement required by the GST authorities." },
  { q: "How long does it take to set up?", a: "Once your KYC documents are verified, your virtual office address and documentation are ready within 24-48 hours." },
  { q: "Can I use the address on my website and business cards?", a: "Absolutely! You can use the premium commercial address on all your marketing materials, website, business cards, and social media." },
  { q: "What happens if a GST inspector visits the location?", a: "Our trained community managers at the location will handle the inspection, show your company signage, and provide the necessary verification documentation." },
];

function Typewriter({ words, delay = 2000, className = "", style = {} }: { words: string[]; delay?: number; className?: string; style?: React.CSSProperties }) {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const handleType = () => {
      const i = loopNum % words.length;
      const fullText = words[i];

      setText(isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1));

      setTypingSpeed(isDeleting ? 50 : 150);

      if (!isDeleting && text === fullText) {
        timer = setTimeout(() => setIsDeleting(true), delay);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(500);
      } else {
        timer = setTimeout(handleType, typingSpeed);
      }
    };

    timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed, words, delay]);

  return <span className={className} style={style}>{text}</span>;
}

const VirtualOfficeAds = () => {
  const [isGetStartedOpen, setIsGetStartedOpen] = useState(false);

  useEffect(() => {
    document.title = "Virtual Office & GST Registration | FlashSpace";
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const timer1 = setTimeout(() => {
      setIsGetStartedOpen(true);
    }, 30000);

    const timer2 = setTimeout(() => {
      setIsGetStartedOpen(true);
    }, 60000);

    const timer3 = setTimeout(() => {
      setIsGetStartedOpen(true);
      
      intervalId = setInterval(() => {
        setIsGetStartedOpen(true);
      }, 120000);
    }, 120000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const formRef = useRef<HTMLDivElement>(null);

  const cities = ["Delhi", "Mumbai", "Noida", "Gurgaon", "Bangalore"];

  // Form State
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", city: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    // Focus the first input slightly after scrolling
    setTimeout(() => {
      const nameInput = document.getElementById("hero-name") as HTMLInputElement;
      if (nameInput) nameInput.focus();
    }, 500);
  };

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
          source: "Virtual Office Landing Page",
          page: window.location.href,
        }),
      });

      const data = await res.json();

      if (data.ok || res.ok) {
        toast.success("Thank you! Our workspace expert will call you within 15 minutes.");
        setFormData({ name: "", phone: "", email: "", city: "" });
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
    <div id="virtual-office-page" className="min-h-screen" style={{ backgroundColor: "#FAFAF7", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        #virtual-office-page,
        #virtual-office-page h1, 
        #virtual-office-page h2, 
        #virtual-office-page h3, 
        #virtual-office-page h4, 
        #virtual-office-page h5, 
        #virtual-office-page h6,
        #virtual-office-page p,
        #virtual-office-page span,
        #virtual-office-page button,
        #virtual-office-page input,
        #virtual-office-page label,
        #virtual-office-page a {
          font-family: 'Inter', sans-serif !important;
        }
      `}</style>
      {/* We keep the header for routing consistency as requested, but you might want to hide nav links via CSS or a special prop in production if strict LP is needed */}
      <Header />

      {/* 1. HERO SECTION */}
      <section className="relative pt-[88px] pb-12 lg:pt-32 lg:pb-20 overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[600px] h-[600px] rounded-full bg-[#D4E0D0]/40 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[500px] h-[500px] rounded-full bg-[#FEF8C5]/40 blur-[80px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-8 items-center">

            {/* Left Copy */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1F1F1F] leading-[1.1] mb-4 sm:mb-6 tracking-tight">
                Secure a GST & ROC-Ready <span className="text-[#36503F] italic">Business Address</span>
                <br />
                <span className="inline-block mt-2 sm:mt-0 mr-2">in</span>
                <span className="bg-[#FEF8C5] px-2 rounded-md leading-none inline-block pb-1">
                  <Typewriter 
                    words={cities} 
                    delay={2000} 
                    className="text-[#36503F]" 
                  />
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-lg">
                Register your GST, receive company mail, and build trust with clients
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-6 sm:mb-10">
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-green-600" /> NOC & Rent Agreement
                </div>
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-green-600" /> Mail Forwarding
                </div>
              </div>
            </motion.div>

            {/* Right Form Card */}
            <motion.div
              ref={formRef}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              className="w-full max-w-md mx-auto lg:ml-auto relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FEF8C5] to-[#36503F] rounded-3xl blur opacity-25" />
              <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden relative z-10 p-1">
                <div className="bg-[#36503F] rounded-2xl overflow-hidden shadow-inner relative">
                  {/* Subtle noise/pattern overlay for premium feel */}
                  <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] mix-blend-overlay" />

                  {/* Form Header */}
                  <div className="pt-8 px-8 pb-4 text-center relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Claim Your Address</h3>
                    <p className="text-[#D4E0D0] text-sm">Our experts will connect with you in 15 mins.</p>
                  </div>

                  {/* Form Body */}
                  <form onSubmit={handleFormSubmit} className="px-8 pb-8 space-y-4 relative z-10">
                    <div className="group relative">
                      <input
                        id="hero-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-transparent focus:bg-white/10 focus:border-[#FEF8C5]/50 focus:ring-1 focus:ring-[#FEF8C5]/50 outline-none transition-all peer"
                        placeholder="Full Name"
                      />
                      <label className="absolute left-4 top-3.5 text-sm text-gray-400 transition-all duration-300 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#FEF8C5] peer-focus:bg-[#36503F] peer-focus:px-1 peer-valid:-top-2 peer-valid:text-xs peer-valid:text-gray-300 peer-valid:bg-[#36503F] peer-valid:px-1 pointer-events-none">
                        Full Name
                      </label>
                    </div>

                    <div className="group relative">
                      <div className="flex">
                        <span className="inline-flex items-center justify-center px-4 rounded-l-xl border border-r-0 border-white/10 bg-white/5 text-gray-400 font-medium">
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                          className="w-full px-4 py-3.5 rounded-r-xl border border-white/10 bg-white/5 text-white placeholder-transparent focus:bg-white/10 focus:border-[#FEF8C5]/50 focus:ring-1 focus:ring-[#FEF8C5]/50 outline-none transition-all peer"
                          placeholder="Mobile Number"
                        />
                        <label className="absolute left-[70px] top-3.5 text-sm text-gray-400 transition-all duration-300 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#FEF8C5] peer-focus:bg-[#36503F] peer-focus:px-1 peer-valid:-top-2 peer-valid:text-xs peer-valid:text-gray-300 peer-valid:bg-[#36503F] peer-valid:px-1 pointer-events-none">
                          Mobile Number
                        </label>
                      </div>
                    </div>

                    <div className="group relative">
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-transparent focus:bg-white/10 focus:border-[#FEF8C5]/50 focus:ring-1 focus:ring-[#FEF8C5]/50 outline-none transition-all peer"
                        placeholder="Email Address"
                      />
                      <label className="absolute left-4 top-3.5 text-sm text-gray-400 transition-all duration-300 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#FEF8C5] peer-focus:bg-[#36503F] peer-focus:px-1 peer-valid:-top-2 peer-valid:text-xs peer-valid:text-gray-300 peer-valid:bg-[#36503F] peer-valid:px-1 pointer-events-none">
                        Email Address
                      </label>
                    </div>

                    <div className="group relative">
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-transparent focus:bg-white/10 focus:border-[#FEF8C5]/50 focus:ring-1 focus:ring-[#FEF8C5]/50 outline-none transition-all peer"
                        placeholder="City"
                      />
                      <label className="absolute left-4 top-3.5 text-sm text-gray-400 transition-all duration-300 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#FEF8C5] peer-focus:bg-[#36503F] peer-focus:px-1 peer-valid:-top-2 peer-valid:text-xs peer-valid:text-gray-300 peer-valid:bg-[#36503F] peer-valid:px-1 pointer-events-none">
                        Required City
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-6 bg-[#FEF8C5] hover:bg-white text-[#36503F] font-extrabold text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(254,248,197,0.3)] hover:shadow-[0_0_30px_rgba(254,248,197,0.5)] transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>Get Pricing Now <ArrowRight className="w-5 h-5" /></>
                      )}
                    </button>
                    <p className="text-center text-xs text-white/40 mt-4 flex items-center justify-center gap-1.5 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" /> 100% secure. No spam.
                    </p>
                  </form>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. STATS & SOCIAL PROOF */}
      <div className="border-y border-[#D4E0D0] bg-white">
        <Stats />
      </div>

      {/* NEW: VIRTUAL OFFICES PAN INDIA */}
      <VirtualOfficesLocations />

      {/* 7. EXPERTS (Moved here per user request) */}
      <ExpertsSection />

      {/* REFUND GUARANTEE BANNER */}
      <section className="py-6 bg-[#36503F] w-full">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
            <div className="flex items-center gap-6 flex-1">
              <ShieldCheck className="w-12 h-12 text-[#FEF8C5] shrink-0" strokeWidth={1.5} />
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-white mb-1 tracking-tight">
                  Money back guarantee !
                </h3>
                <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-3xl font-medium">
                  Full refund within 30 days of receiving final documents. Partner liable for document errors causing registration rejection.
                  <span className="block mt-1 sm:mt-2">
                    <a href="/refund-policy" className="text-[#FEF8C5] hover:text-white underline underline-offset-4 transition-colors">
                      *Terms and conditions 
                    </a>
                  </span>
                </p>
              </div>
            </div>
            <div className="shrink-0 mt-4 md:mt-0 md:ml-auto">
              <button 
                onClick={() => document.getElementById('hero-name')?.focus()}
                className="bg-[#FEF8C5] hover:bg-white text-[#36503F] font-bold py-2.5 px-6 rounded-lg transition-colors whitespace-nowrap"
              >
                Get in touch
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE BENEFITS / FEATURES */}
      <section className="py-20 lg:py-28 bg-[#FAFAF7] relative border-b border-[#D4E0D0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1F1F] mb-6 tracking-tight leading-[1.1] " >
              Everything a physical office has <br className="hidden sm:block" />{' '}
              <span className="relative inline-block whitespace-nowrap mt-2 sm:mt-0">
                <span className="relative z-10 text-[#36503F]">Minus the rent</span>
                <svg className="absolute w-[110%] h-[12px] sm:h-[16px] -bottom-1 sm:-bottom-2 -left-[5%] text-[#EDB003] opacity-90" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M2 15 Q 40 5 98 12" stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none" />
                </svg>
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 font-medium">
              FlashSpace provides end-to-end virtual office solutions to keep your business compliant and professional
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#E5F0E8] overflow-hidden">
            <div className="w-full">
              <div className="grid grid-cols-[1.2fr_1fr_1.1fr] sm:grid-cols-3 border-b border-gray-100">
                <div className="p-3 sm:p-6 lg:p-8 bg-gray-50 flex items-center">
                  <span className="font-bold text-gray-500 text-[10px] sm:text-sm uppercase tracking-wider">Features</span>
                </div>
                <div className="p-2 sm:p-6 lg:p-8 text-center border-l border-gray-100 flex flex-col items-center justify-center">
                  <span className="font-bold bg-[#FEF8C5] text-[#36503F] px-2 py-0.5 rounded-md text-[9px] sm:text-sm uppercase tracking-wider mb-1 sm:mb-2">Physical Office</span>
                  <span className="text-gray-900 font-bold text-[11px] sm:text-lg">₹50k+/mo</span>
                </div>
                <div className="p-2 sm:p-6 lg:p-8 text-center bg-[#36503F] border-l border-[#36503F] flex flex-col items-center justify-center">
                  <span className="font-bold text-[#FEF8C5] text-[9px] sm:text-sm uppercase tracking-wider mb-1 sm:mb-2">FlashSpace</span>
                  <span className="text-white font-bold text-[11px] sm:text-lg">₹8,999/yr</span>
                </div>
              </div>

              {[
                { name: "Premium Business Address", physical: true, flashspace: true },
                { name: "Mail & Package Handling", physical: true, flashspace: true },
                { name: "GST/Company Registration", physical: true, flashspace: true },
                { name: "Dedicated Local Phone Number", physical: true, flashspace: true },
                { name: "Zero Security Deposit", physical: false, flashspace: true },
                { name: "Setup within 48 Hours", physical: false, flashspace: true },
                { name: "No Maintenance/Utility Bills", physical: false, flashspace: true },
              ].map((row, index) => (
                <div key={index} className="grid grid-cols-[1.2fr_1fr_1.1fr] sm:grid-cols-3 border-b border-gray-50 hover:bg-[#FAFAF7] transition-colors">
                  <div className="p-3 sm:p-5 lg:p-6 flex items-center">
                    <span className="font-medium text-gray-800 text-[11px] sm:text-base leading-snug">{row.name}</span>
                  </div>
                  <div className="p-3 sm:p-5 lg:p-6 border-l border-gray-100 flex items-center justify-center">
                    {row.physical ? (
                      <Check className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400" />
                    ) : (
                      <X className="w-4 h-4 sm:w-6 sm:h-6 text-red-400" />
                    )}
                  </div>
                  <div className="p-3 sm:p-5 lg:p-6 border-l border-[#E5F0E8] bg-[#F0F4EE]/30 flex items-center justify-center">
                    {row.flashspace ? (
                      <Check className="w-4 h-4 sm:w-6 sm:h-6 text-[#36503F]" strokeWidth={3} />
                    ) : (
                      <X className="w-4 h-4 sm:w-6 sm:h-6 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-5 sm:p-8 text-center bg-gray-50 border-t border-gray-100">
              <button onClick={() => document.getElementById("hero-name")?.focus()} className="inline-flex items-center gap-1.5 sm:gap-2 bg-transparent text-[#36503F] font-bold text-sm sm:text-lg hover:underline underline-offset-4">
                Save 90% on overhead costs <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ONE CRM SECTION */}
      <div className="bg-white px-6 lg:px-8 border-b border-[#D4E0D0]">
        <div className="max-w-5xl mx-auto py-16 lg:py-24">
          <div className="text-center mb-10">
             <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F1F1F] tracking-tight mb-4">
               OneCRM{' '}
               <span className="relative inline-block whitespace-nowrap">
                 <span className="relative z-10 text-[#36503F]">for free</span>
                 <svg className="absolute w-[110%] h-[12px] sm:h-[16px] -bottom-1 sm:-bottom-2 -left-[5%] text-[#EDB003] opacity-90" viewBox="0 0 100 20" preserveAspectRatio="none">
                   <path d="M2 15 Q 40 5 98 12" stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none" />
                 </svg>
               </span>
             </h2>
             <p className="text-xl sm:text-2xl text-gray-600 font-medium mt-6">One Platform Unlimited Possibilities</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mt-12">
            {[
              "Lead Management", "Contact Management", "Sales Pipeline Tracking", "Email Automation",
              "WhatsApp Automation", "SMS Marketing", "Appointment Booking", "Landing Pages",
              "Forms & Surveys", "Review Management", "Reporting & Analytics", "Team Collaboration",
              "Workflow Automation", "Customer Communication", "Campaign Tracking", "Business Growth Tools"
            ].map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl border border-[#D4E0D0]/50 bg-[#FAFAF7] hover:border-[#36503F]/30 hover:shadow-sm transition-all">
                <div className="mt-0.5 shrink-0 bg-[#E5F0E8] p-1 rounded-full text-[#36503F]">
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={3} />
                </div>
                <span className="text-[#1F1F1F] font-semibold text-[13px] sm:text-[15px] leading-tight">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WHY FLASHSPACE BENTO SECTION */}
      <WhyFlashSpace />

      {/* BUSINESS SETUP PLANS */}
      <BusinessSetupPlans />

      {/* ADD-ONS SECTION */}
      <AddOnsSection />

      {/* WE GOT FEATURED */}
      <WeGotFeatured />

      {/* PARTNERED SPACES */}
      <PartneredSpaces />

      {/* CLIENTS SLIDER */}
      <div className="hidden lg:block">
        <TrustedByFilmstrip />
      </div>
      <div className="block lg:hidden">
        <TrustedByFilmstripMobile />
      </div>

      {/* 6. FAQ SECTION */}
      <section className="py-20 lg:py-28 bg-[#FAFAF7] border-t border-gray-200/60">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 text-lg">Clear your doubts before getting started.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="font-bold text-lg text-gray-900 pr-8">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${openFaq === index ? "rotate-180 text-[#36503F]" : ""}`} />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6 text-gray-600 leading-relaxed"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. REVIEWS & TESTIMONIALS (Restored back to bottom) */}
      <TestimonialSection />

      {/* 8. NEWSLETTER */}
      <Newsletter />
      
      <Footer />
      <StickyBottomCTA />
      <GetInTouchModal open={isGetStartedOpen} onClose={() => setIsGetStartedOpen(false)} />
    </div>
  );
};

export default VirtualOfficeAds;
