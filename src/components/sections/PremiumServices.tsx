import { motion } from "framer-motion";
import {
  Building2,
  Building,
  Rocket,
  Calculator,
  HeartHandshake,
  Code,
  ArrowRight,
  Handshake,
  User,
  ShieldCheck,
  Headset
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const services = [
  {
    id: "01",
    title: "Virtual Offices",
    link: "/solutions/virtual-office",
    description: "Professional business addresses and mail handling services to establish your presence.",
    icon: <Building2 className="w-6 h-6" />,
    theme: "dark"
  },
  {
    id: "02",
    title: "Coworking Spaces",
    link: "/services/coworking-space",
    description: "Flexible, fully-equipped shared workspaces designed for collaboration and productivity.",
    icon: <Building className="w-6 h-6" />,
    theme: "light"
  },
  {
    id: "03",
    title: "Business Setup",
    link: "/services/business-setup",
    description: "End-to-end assistance in company registration, licensing, and legal structuring.",
    icon: <Rocket className="w-6 h-6" />,
    theme: "dark"
  },
  {
    id: "04",
    title: "Taxation and Filing",
    link: "#",
    description: "Expert guidance on corporate tax, VAT, and seamless regulatory compliance.",
    icon: <Calculator className="w-6 h-6" />,
    theme: "light"
  },
  {
    id: "05",
    title: "One CRM",
    link: "#",
    description: "An all-in-one customer relationship management system to streamline your sales pipeline.",
    icon: <HeartHandshake className="w-6 h-6" />,
    theme: "dark"
  },
  {
    id: "06",
    title: "Website Development",
    link: "#",
    description: "Custom, high-performance AI-powered websites and digital solutions tailored for your business.",
    icon: <Code className="w-6 h-6" />,
    theme: "light"
  },
];

export const PremiumServices = () => {
  const navigate = useNavigate();
  return (
    <section className="py-20 bg-[#F0F4EE] overflow-hidden premium-services-section" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style dangerouslySetInnerHTML={{__html: `
        .premium-services-section, 
        .premium-services-section * {
          font-family: 'Inter', sans-serif !important;
        }
      `}} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-24">
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="text-[#36503F] text-xs font-bold tracking-[0.2em] uppercase">
              What We Do Best
            </span>
          </div>

          {/* Main Title with decorative diamond line */}
          <div className="relative mb-6">


            <h2 className="text-[56px] leading-[1.1] font-bold mt-10 mb-6 tracking-tight">
              <span className="text-black">Premium Services. </span>
              <span className="text-[#36503F]">Real Impact.</span>
            </h2>
          </div>

          <p className="text-gray-600 max-w-2xl mx-auto text-[1rem] leading-relaxed mb-12">
            End-to-end solutions designed to elevate your brand, streamline operations, <br className="hidden md:block" /> and accelerate growth.
          </p>

        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {services.map((service, index) => {
            const isDark = service.theme === "dark";
            return (
              <motion.div
                onClick={() => service.link && service.link !== "#" && navigate(service.link)}
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`group cursor-pointer relative rounded-sm overflow-hidden p-8 flex flex-col transition-all duration-300 hover:scale-105 ${isDark
                  ? "bg-[#36503F] text-white"
                  : "bg-[#FDFCF9] text-[#36503F] border border-gray-100 shadow-sm"
                  }`}
              >
                {/* Top Row: Number & Icon */}
                <div className="flex justify-between items-start mb-6">
                  <span className={`text-2xl font-bold ${isDark ? 'text-[#FEF8CF]' : 'text-[#36503F]'}`}>
                    {service.id}
                  </span>

                  {/* Icon centered conceptually, but positioned relative to the card */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-8">
                    <div className={`w-12 h-12 rounded-full border flex items-center justify-center ${isDark
                      ? 'border-[#FEF8CF] text-[#FEF8CF]'
                      : 'border-[#36503F] text-[#36503F]'
                      }`}>
                      {service.icon}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="mt-8 flex flex-col flex-1">
                  <h3 className={`text-center font-bold text-[1.1rem] mb-4 ${isDark ? 'text-white' : 'text-[#36503F]'}`}>
                    {service.title}
                  </h3>

                  <div className={`w-full h-[1px] mb-5 ${isDark ? 'bg-[#FEF8CF]/30' : 'bg-[#36503F]/30'}`}></div>

                  <p className={`text-[0.8rem] leading-relaxed text-center flex-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {service.description}
                  </p>
                </div>

                  <div className="flex justify-end mt-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 ${isDark ? "bg-[#FEF8CF] text-[#36503F]" : "bg-[#36503F] text-white"}`}>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

              </motion.div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#FDFCF9] border border-gray-200 rounded-sm p-6 lg:p-8 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden"
        >
          {/* Subtle Background Pattern/Image placeholder for right side */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" style={{ maskImage: 'linear-gradient(to right, transparent, black)' }}></div>

          <div className="flex flex-col md:flex-row items-center gap-6 lg:gap-10 z-10 w-full lg:w-auto">
            {/* Left Icon */}
            <div className="w-16 h-16 rounded-full bg-[#36503F] flex items-center justify-center shrink-0">
              <Handshake className="w-8 h-8 text-[#FEF8CF]" />
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-16 bg-[#FEF8CF]/50"></div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl text-center md:text-left text-black font-bold leading-snug">
              Let's Build Something <br className="hidden md:block" />
              <span className="text-[#36503F]">
                <span className="italic">Extraordinary</span> Together.
              </span>
            </h2>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 z-10">
            {/* Description */}
            <p className="text-sm text-gray-600 text-center md:text-left max-w-xs">
              Partner with us to unlock new opportunities and achieve sustainable growth.
            </p>

            {/* Button */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-contact-modal'))}
              className="bg-[#36503F] text-[#FEF8CF] text-xs font-semibold tracking-wider uppercase px-8 py-4 rounded-sm flex items-center gap-2 hover:bg-[#1a261e] transition-colors whitespace-nowrap"
            >
              GET IN TOUCH <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
