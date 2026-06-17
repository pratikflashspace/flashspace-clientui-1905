import { motion } from "framer-motion";
import { 
  User, 
  ShieldCheck, 
  Headset, 
  ChevronRight,
  Code,
  LineChart,
  Settings,
  PieChart,
  Headphones,
  ShieldAlert,
  Palette,
  Lightbulb
} from "lucide-react";
import { Link } from "react-router-dom";

const topBadges = [
  {
    icon: <User className="w-4 h-4 text-[#B89B5E]" />,
    title: "Tailored for Your Success",
    subtitle: "Solutions customized to your goals.",
  },
  {
    icon: <ShieldCheck className="w-4 h-4 text-[#B89B5E]" />,
    title: "Quality You Can Trust",
    subtitle: "Excellence in every deliverable.",
  },
  {
    icon: <Headset className="w-4 h-4 text-[#B89B5E]" />,
    title: "Support That Cares",
    subtitle: "We're with you, every step.",
  },
];

const services = [
  {
    id: "01",
    title: "Strategy & Consulting",
    description: "Smart strategies tailored to your goals. We plan, you grow.",
    icon: <Lightbulb className="w-6 h-6 text-[#B89B5E]" />,
  },
  {
    id: "02",
    title: "Design & Branding",
    description: "Eye-catching designs that build your brand identity.",
    icon: <Palette className="w-6 h-6 text-[#B89B5E]" />,
  },
  {
    id: "03",
    title: "Development",
    description: "High-performance solutions built with clean, scalable code.",
    icon: <Code className="w-6 h-6 text-[#B89B5E]" />,
  },
  {
    id: "04",
    title: "Marketing & Growth",
    description: "Data-driven marketing that brings leads and maximizes growth.",
    icon: <LineChart className="w-6 h-6 text-[#B89B5E]" />,
  },
  {
    id: "05",
    title: "Automation",
    description: "Streamline workflows and save time with smart automation.",
    icon: <Settings className="w-6 h-6 text-[#B89B5E]" />,
  },
  {
    id: "06",
    title: "Analytics & Insights",
    description: "Turn data into insights and make smarter, faster decisions.",
    icon: <PieChart className="w-6 h-6 text-[#B89B5E]" />,
  },
  {
    id: "07",
    title: "Support & Maintenance",
    description: "Reliable support and ongoing maintenance, always.",
    icon: <Headphones className="w-6 h-6 text-[#B89B5E]" />,
  },
  {
    id: "08",
    title: "Security & Reliability",
    description: "Top-notch security to protect your data and your business.",
    icon: <ShieldAlert className="w-6 h-6 text-[#B89B5E]" />,
  },
];

export const PremiumServices = () => {
  return (
    <section className="py-20 bg-[#FAFAF8] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-8 bg-[#B89B5E]"></div>
            <span className="text-[#B89B5E] text-sm font-bold tracking-[0.2em] uppercase">
              What We Do Best
            </span>
            <div className="h-px w-8 bg-[#B89B5E]"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-['Inter']">
            <span className="text-[#2A3B2C]">Premium Services. </span>
            <span className="text-[#B89B5E]">Real Impact.</span>
          </h2>
          
          <p className="text-gray-600 max-w-3xl mx-auto text-lg mb-12">
            End-to-end solutions designed to elevate your brand, streamline operations,
            and accelerate growth.
          </p>

          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
            {topBadges.map((badge, index) => (
              <div key={index} className="flex items-start gap-4 text-left">
                <div className="w-12 h-12 rounded-full bg-[#1E2A22] flex items-center justify-center shrink-0">
                  {badge.icon}
                </div>
                <div>
                  <h4 className="font-bold text-[#1a2d1d] text-sm mb-1">{badge.title}</h4>
                  <p className="text-gray-500 text-xs">{badge.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex border border-gray-100 group cursor-pointer"
            >
              {/* Left Colored Bar */}
              <div className="w-20 bg-[#1E2A22] flex flex-col items-center justify-center relative overflow-hidden shrink-0">
                {/* Decorative shape */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-white/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
              </div>
              
              {/* Right Content */}
              <div className="p-6 flex-1 flex flex-col relative">
                <div className="text-[#B89B5E] text-2xl font-serif mb-2">
                  {service.id}
                </div>
                <h3 className="font-bold text-[#2A3B2C] text-lg mb-3 leading-tight">
                  {service.title}
                </h3>
                <p className="text-gray-500 text-sm mb-6 flex-1">
                  {service.description}
                </p>
                <Link 
                  to="#" 
                  className="inline-flex items-center text-[#B89B5E] text-sm font-semibold group-hover:text-[#9e834d] transition-colors"
                >
                  Learn More 
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
