import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Mail, Briefcase, Users, Clock, 
  IndianRupee, PhoneForwarded, Landmark, ArrowRight, Quote, Star, Check, ShieldCheck, Loader2
} from 'lucide-react';

const testimonials = [
  {
    id: 1,
    text: "Everything was arranged swiftly by FlashSpace and all my requests were adhered to within a day\n\nI greatly appreciate FlashSpace's quick response in helping me secure a virtual address. Everything was arranged swiftly and all my requests were adhered to within a day. I've received all the documents and the support has been extraordinary. Great work, keep it up!",
    name: "Ashutosh Mishra",
    role: "Founders Office, Growth school",
    image: "https://ui-avatars.com/api/?name=Ashutosh+Mishra&background=36503F&color=fff", 
  },
  {
    id: 2,
    text: "I've been using FlashSpace as a virtual office for my startup for the last four year's. I strongly recommend Virtual Office in delhi for your workspace requirements. Excellent range of office spaces and a quick, professional support team.",
    name: "Manoj Gusain",
    role: "Director, Black Seas",
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
  { name: "Rishi", role: "VO Expert", image: "/to_cloudinary/rishi.png" },
  { name: "Premjeet", role: "VO Expert", image: "/to_cloudinary/premjeet.png" },
  { name: "Shubham", role: "VO Expert", image: "/to_cloudinary/shubham.png" },
];

export const TestimonialSection = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: ''
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Form submitted:", formData);
    setIsSubmitting(false);
    setFormData({ name: '', phone: '', email: '', city: '' });
  };

  return (
    <>
      {/* SECTION 1: REVIEWS & ADDITIONAL SERVICES */}
      <section className="py-20 lg:py-24 bg-[#36503F] border-t border-[#2A4031] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Testimonial */}
            <div className="flex flex-col h-full">
              <h2 className="text-xl sm:text-2xl text-white leading-relaxed mb-8">
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Claim Your Address</h3>
                  <p className="text-gray-500 text-sm">Our experts will connect with you in 15 mins.</p>
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

                  <div className="group relative">
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-transparent focus:border-[#36503F] focus:ring-1 focus:ring-[#36503F] outline-none transition-all peer"
                      placeholder="City"
                    />
                    <label className="absolute left-4 top-3.5 text-sm text-gray-500 transition-all duration-300 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#36503F] peer-focus:bg-white peer-focus:px-1 peer-valid:-top-2 peer-valid:text-xs peer-valid:text-gray-500 peer-valid:bg-white peer-valid:px-1 pointer-events-none">
                      Required City
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-6 bg-[#36503F] hover:bg-[#2A4031] text-[#FEF8C5] font-extrabold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>Get Pricing Now <ArrowRight className="w-5 h-5" /></>
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

export const ExpertsSection = () => {
  return (
    <>
      {/* SECTION 2: EXPERTS */}
      <section className="py-20 lg:py-24 bg-white border-t border-gray-200/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">
            
            {/* Left side: Text & Bullets */}
            <div className="flex flex-col">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Our Experts are eager to help you
              </h2>
              <p className="text-gray-600 text-lg mb-10 max-w-lg">
                Our team has helped 600+ companies find their virtual offices spaces. Our experts will help you with:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8 mb-10">
                <div className="flex items-center gap-3">
                  <div className="bg-[#36503F] rounded-full p-1.5 shrink-0">
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />
                  </div>
                  <span className="text-gray-900 font-medium">Space Selection</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-[#36503F] rounded-full p-1.5 shrink-0">
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />
                  </div>
                  <span className="text-gray-900 font-medium flex items-center gap-2">
                    Price Negotiation 
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-[#36503F] rounded-full p-1.5 shrink-0">
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />
                  </div>
                  <span className="text-gray-900 font-medium">KYC verification</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-[#36503F] rounded-full p-1.5 shrink-0">
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />
                  </div>
                  <span className="text-gray-900 font-medium">Documents as per your need</span>
                </div>
              </div>

              <a 
                href="tel:+919888687898" 
                className="text-[#36503F] font-bold text-lg flex items-center gap-2 hover:gap-3 transition-all w-max"
              >
                Request Callback <ArrowRight className="w-5 h-5" />
              </a>
            </div>

            {/* Right side: Expert Photos */}
            <div className="flex items-end justify-center gap-4 lg:gap-6 mt-12 lg:mt-0 w-full pt-10">
              {experts.map((expert, index) => (
                <div 
                  key={index} 
                  className={`bg-white p-2.5 border border-gray-200 shadow-md relative flex flex-col items-center ${
                    index === 1 ? "-translate-y-8 z-10 scale-110 shadow-lg" : "z-0"
                  }`}
                >
                  <div className="w-24 h-28 sm:w-32 sm:h-36 mb-3 overflow-hidden">
                    <img 
                      src={expert.image} 
                      alt={expert.name} 
                      className={`w-full h-full object-cover object-top ${expert.name === "Shubham" ? "scale-125 origin-top" : ""}`}
                    />
                  </div>
                  <div className="text-center w-full bg-white pb-1">
                    <p className="text-sm font-bold text-gray-900 leading-tight">{expert.name}</p>
                    <p className="text-[11px] text-gray-500 uppercase tracking-wider font-medium mt-1">{expert.role}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>
    </>
  );
};
