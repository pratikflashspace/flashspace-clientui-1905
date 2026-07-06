import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  Building2, Mail, Briefcase, Users, Clock, 
  IndianRupee, PhoneForwarded, Landmark, ArrowRight, Quote, Star, Check, ShieldCheck, Loader2
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const testimonials = [
  {
    id: 1,
    text: "Everything was arranged swiftly by FlashSpace and all my requests were adhered to within a day. I've received all the documents and the support has been extraordinary.",
    name: "Ashutosh Mishra",
    role: "Founders Office, Growth school",
    image: "https://ui-avatars.com/api/?name=Ashutosh+Mishra&background=36503F&color=fff", 
  },
  {
    id: 2,
    text: "I've been using a virtual office from FlashSpace for four years. I strongly recommend them for your workspace requirements. They offer great spaces and a professional support team.",
    name: "Manoj Gusain",
    role: "Manager, Black Seas",
    image: "https://ui-avatars.com/api/?name=manoj+gusain&background=9c27b0&color=fff",
  },
  {
    id: 3,
    text: "Getting a virtual office for my e-commerce business was incredibly smooth. The team handled all the paperwork and the GST registration was approved without any hassle.\n\nHighly recommended for anyone looking to expand their business footprint without physical office costs.",
    name: "Priya Sharma",
    role: "E-commerce Founder",
    image: "https://ui-avatars.com/api/?name=Priya+Sharma&background=36503F&color=fff",
  }
];

const additionalServices = [
  {
    icon: <Building2 className="w-6 h-6 text-[#36503F]" strokeWidth={1.5} />,
    title: "Premium business address across India"
  },
  {
    icon: <Mail className="w-6 h-6 text-[#36503F]" strokeWidth={1.5} />,
    title: "Handling of mail and correspondence"
  },
  {
    icon: <Briefcase className="w-6 h-6 text-[#36503F]" strokeWidth={1.5} />,
    title: "Business representation and reception"
  },
  {
    icon: <Users className="w-6 h-6 text-[#36503F]" strokeWidth={1.5} />,
    title: "Client engagement and meeting rooms"
  },
  {
    icon: <Clock className="w-6 h-6 text-[#36503F]" strokeWidth={1.5} />,
    title: "72-hours document turnaround"
  },
  {
    icon: <IndianRupee className="w-6 h-6 text-[#36503F]" strokeWidth={1.5} />,
    title: "Affordable customized plans"
  },
  {
    icon: <PhoneForwarded className="w-6 h-6 text-[#36503F]" strokeWidth={1.5} />,
    title: "Business call forwarding"
  },
  {
    icon: <Landmark className="w-6 h-6 text-[#36503F]" strokeWidth={1.5} />,
    title: "Bank account opening assistance"
  }
];

const experts = [
  { name: "Rishi", role: "VO Expert", image: "/to_cloudinary/rishi.webp" },
  { name: "Premjeet", role: "VO Expert", image: "/to_cloudinary/premjeet.png" },
  { name: "Shubham", role: "VO Expert", image: "/to_cloudinary/shubham.png" },
];

export const PackageTestimonial = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { planId } = useParams();
  const plan = planId?.toLowerCase() || "";

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveTestimonial((current) => (current + 1) % testimonials.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    plan: plan || ''
  });

  const navigate = useNavigate();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Contact');
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
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
          plan: formData.plan,
          source: "Package Detail Testimonial Section",
          page: window.location.href,
        }),
      });

      const data = await res.json();

      if (data.ok || res.ok) {
        toast.success("Thank you! Our workspace expert will call you within 15 minutes.");
        setFormData({ name: "", phone: "", email: "", city: "", plan: plan });
        navigate("/thank-you");
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
    <>
      {/* SECTION 1: REVIEWS & ADDITIONAL SERVICES */}
      <section className="py-20 lg:py-24 bg-[#36503F] border-t border-[#2A4031] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Testimonial */}
            <div className="flex flex-col h-full">
              <h2 className="text-xl sm:text-2xl text-white leading-relaxed mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
                FlashSpace has helped <span className="text-[#FEF8C5] font-bold">5,000+ clients</span> get their Virtual Office, boosting productivity and driving business growth.
              </h2>

              <div className="bg-white border border-gray-200 shadow-sm p-8 relative flex flex-col w-full flex-1">
                <Quote className="w-10 h-10 text-[#36503F] mb-6 fill-current" />
                
                <div className="flex-1">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTestimonial}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="text-gray-700 leading-relaxed text-[15px] space-y-4">
                        {testimonials[activeTestimonial].text.split('\n\n').map((paragraph, idx) => (
                          <p key={idx} className={idx === 0 ? "font-bold text-gray-900 text-lg mb-3" : ""}>{paragraph}</p>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Author */}
                <div className="mt-8 flex items-center gap-4 border-t border-gray-100 pt-6">
                  <img 
                    src={testimonials[activeTestimonial].image} 
                    alt={testimonials[activeTestimonial].name} 
                    className="w-12 h-12 rounded-full object-cover bg-gray-200"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonials[activeTestimonial].name}</h4>
                    <p className="text-gray-500 text-sm">{testimonials[activeTestimonial].role}</p>
                  </div>
                </div>

                {/* Slider Dots */}
                <div className="flex items-center justify-center gap-2 mt-6">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTestimonial(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        activeTestimonial === idx ? "bg-[#36503F] scale-125" : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Hero Form */}
            <div className="w-full max-w-md mx-auto lg:ml-auto relative lg:mt-[76px]">
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden relative z-10 border border-gray-100">
                {/* Form Header */}
                <div className="pt-8 px-8 pb-4 text-center relative z-10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight capitalize" style={{ fontFamily: "'Inter', sans-serif" }}>Get Your {plan} Package</h3>
                  <p className="text-gray-500 text-sm">Please confirm your contact details to proceed.</p>
                </div>

                {/* Form Body */}
                <form onSubmit={handleFormSubmit} className="px-8 pb-8 space-y-4 relative z-10">
                  <div className="group relative">
                    <input
                      id="testimonials-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-transparent focus:border-[#36503F] focus:ring-1 focus:ring-[#36503F] outline-none transition-all peer"
                      placeholder="Full Name"
                    />
                    <label className="absolute left-4 top-3.5 text-sm text-gray-500 transition-all duration-300 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#36503F] peer-focus:bg-white peer-focus:px-1 peer-valid:-top-2 peer-valid:text-xs peer-valid:text-gray-500 peer-valid:bg-white peer-valid:px-1 pointer-events-none">
                      Full Name
                    </label>
                  </div>

                  <div className="group relative">
                    <div className="flex">
                      <span className="inline-flex items-center justify-center px-4 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-gray-500 font-medium">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                        className="w-full px-4 py-3.5 rounded-r-xl border border-gray-200 bg-white text-gray-900 placeholder-transparent focus:border-[#36503F] focus:ring-1 focus:ring-[#36503F] outline-none transition-all peer"
                        placeholder="Mobile Number"
                      />
                      <label className="absolute left-[70px] top-3.5 text-sm text-gray-500 transition-all duration-300 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#36503F] peer-focus:bg-white peer-focus:px-1 peer-valid:-top-2 peer-valid:text-xs peer-valid:text-gray-500 peer-valid:bg-white peer-valid:px-1 pointer-events-none">
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
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-transparent focus:border-[#36503F] focus:ring-1 focus:ring-[#36503F] outline-none transition-all peer"
                      placeholder="Email Address"
                    />
                    <label className="absolute left-4 top-3.5 text-sm text-gray-500 transition-all duration-300 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#36503F] peer-focus:bg-white peer-focus:px-1 peer-valid:-top-2 peer-valid:text-xs peer-valid:text-gray-500 peer-valid:bg-white peer-valid:px-1 pointer-events-none">
                      Email Address
                    </label>
                  </div>

                  <div className="group relative z-30">
                    <Select
                      value={formData.plan}
                      onValueChange={(val) => setFormData({ ...formData, plan: val })}
                      required
                    >
                      <SelectTrigger className="w-full px-4 py-3.5 h-[52px] rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-[#36503F] focus:ring-1 focus:ring-[#36503F] outline-none transition-all data-[placeholder]:text-gray-500">
                        <SelectValue placeholder="Select Package" />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        <SelectItem value="basic">Basic Package</SelectItem>
                        <SelectItem value="pro">Pro Package</SelectItem>
                        <SelectItem value="premium">Premium Package</SelectItem>
                        <SelectItem value="elite">Elite Package</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="group relative z-20">
                    <Select
                      value={formData.city}
                      onValueChange={(val) => setFormData({ ...formData, city: val })}
                      required
                    >
                      <SelectTrigger className="w-full px-4 py-3.5 h-[52px] rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-[#36503F] focus:ring-1 focus:ring-[#36503F] outline-none transition-all data-[placeholder]:text-gray-500">
                        <SelectValue placeholder="Select your city" />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        <SelectItem value="Delhi">Delhi</SelectItem>
                        <SelectItem value="Noida">Noida</SelectItem>
                        <SelectItem value="Gurgaon">Gurgaon</SelectItem>
                        <SelectItem value="Bangalore">Bangalore</SelectItem>
                        <SelectItem value="Others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-6 bg-[#FEF8C3] hover:bg-[#FDF4A6] text-[#1F2E26] font-bold text-lg py-4 rounded-xl shadow-md transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>Get in Touch <ArrowRight className="w-5 h-5" /></>
                    )}
                  </button>
                  <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1.5 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" /> 100% secure. No spam.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
