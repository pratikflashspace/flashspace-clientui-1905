import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Link } from "react-router-dom";
import {
  Building,
  FileText,
  Mail,
  MapPin,
  Users,
  Briefcase,
  ChevronRight,
  Zap,
  Check,
  ArrowRight
} from "lucide-react";
import { useScrollAnimation, getAnimationClasses } from "@/hooks/use-scroll-animation";
import { motion } from "framer-motion";
import React from "react";

const SolutionsSection = () => {
  const isVisible = useScrollAnimation('solutions');
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  const solutions = [
    {
      icon: (isHovered: boolean) => (
        <motion.svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.rect
            x="6" y="12" width="36" height="28" rx="4"
            className="fill-[#E6F0FA] dark:fill-[#1f1f1f]"
            animate={isHovered ? { scale: 1.05, rotate: -2 } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.rect
            x="12" y="18" width="24" height="16" rx="2" fill="#EDB003"
            animate={isHovered ? { y: 16 } : { y: 18 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
          <motion.rect
            x="18" y="24" width="12" height="6" rx="1"
            className="fill-[#fff] dark:fill-[#2a2a2a]"
            animate={isHovered ? { opacity: 0.8, scale: 1.1 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          />
          <motion.rect
            x="22" y="28" width="4" height="2" rx="1" fill="#EDB003"
            animate={isHovered ? { scaleX: 1.2 } : { scaleX: 1 }}
            transition={{ duration: 0.3, repeat: isHovered ? Infinity : 0, repeatType: "reverse" }}
          />
        </motion.svg>
      ),
      title: "Virtual Office",
      description: "Professional business address with mail handling and call forwarding services",
      features: ["Prime Location Address", "GST Registration Support", "Mail Forwarding", "Call Management"],
      path: "/Solutions/virtual-office",
      gradient: "from-[#EFAD1A] to-[#F59E0B]", // Gold
      iconColor: "text-white"
    },
    {
      icon: (isHovered: boolean) => (
        <motion.svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.rect
            x="8" y="18" width="32" height="18" rx="4"
            className="fill-[#E6F0FA] dark:fill-[#1f1f1f]"
            animate={isHovered ? { scale: 1.08 } : { scale: 1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
          <motion.rect
            x="14" y="24" width="20" height="8" rx="2" fill="#EDB003"
            animate={isHovered ? { scale: 1.05, rotate: 3 } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.rect
            x="20" y="28" width="8" height="2" rx="1"
            className="fill-[#fff] dark:fill-[#2a2a2a]"
            animate={isHovered ? { scaleY: 1.3 } : { scaleY: 1 }}
            transition={{ duration: 0.2, repeat: isHovered ? Infinity : 0, repeatType: "reverse" }}
          />
          <motion.rect
            x="18" y="14" width="12" height="6" rx="2"
            className="fill-[#172A3A] dark:fill-[#333]"
            animate={isHovered ? { y: 12 } : { y: 14 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          />
        </motion.svg>
      ),
      title: "Coworking Space",
      description: "Flexible workspace options with networking opportunities and premium amenities",
      features: ["Flexible Workspace", "Networking Events", "Premium Amenities", "24/7 Access"],
      path: "/Solutions/coworking-space",
      gradient: "from-[#EFAD1A] to-[#F59E0B]", // Gold
      iconColor: "text-white"
    },
    {
      icon: (isHovered: boolean) => (
        <motion.svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.circle
            cx="16" cy="20" r="6" fill="#EDB003"
            animate={isHovered ? { scale: 1.15, y: -2 } : { scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
          <motion.circle
            cx="32" cy="20" r="6"
            className="fill-[#E6F0FA] dark:fill-[#1f1f1f]"
            animate={isHovered ? { scale: 1.15, y: -2 } : { scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
          />
          <motion.ellipse
            cx="16" cy="32" rx="10" ry="6"
            className="fill-[#E6F0FA] dark:fill-[#1f1f1f]"
            animate={isHovered ? { scaleX: 1.1 } : { scaleX: 1 }}
            transition={{ duration: 0.3 }}
          />
          <motion.ellipse
            cx="32" cy="32" rx="10" ry="6" fill="#EDB003" fillOpacity="0.5"
            animate={isHovered ? { scaleX: 1.1 } : { scaleX: 1 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          />
        </motion.svg>
      ),
      title: "On Demand",
      description: "On-demand meeting spaces and services with video conferencing facilities",
      features: ["Meeting Rooms", "Video Conferencing", "Presentation Tools", "Flexible Booking"],
      path: "/Solutions/on-demand",
      gradient: "from-[#EFAD1A] to-[#F59E0B]", // Gold
      iconColor: "text-white"
    },
    {
      icon: (isHovered: boolean) => (
        <motion.svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.rect
            x="14" y="18" width="20" height="16" rx="4"
            className="fill-[#E6F0FA] dark:fill-[#1f1f1f]"
            animate={isHovered ? { rotate: 5, scale: 1.05 } : { rotate: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
          <motion.rect
            x="18" y="22" width="12" height="8" rx="2" fill="#EDB003"
            animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          />
          <motion.circle
            cx="24" cy="26" r="2"
            className="fill-[#fff] dark:fill-[#2a2a2a]"
            animate={isHovered ? { scale: 1.3 } : { scale: 1 }}
            transition={{ duration: 0.2, repeat: isHovered ? Infinity : 0, repeatType: "reverse" }}
          />
          <motion.rect
            x="22" y="30" width="4" height="2" rx="1" fill="#EDB003"
            animate={isHovered ? { y: 28 } : { y: 30 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          />
        </motion.svg>
      ),
      title: "Business Setup",
      description: "Complete business setup solutions including legal documentation and compliance support",
      features: ["Legal Documentation", "Business Registration", "Compliance Support", "Tax Advisory"],
      path: "/Solutions/business-setup",
      gradient: "from-[#EFAD1A] to-[#F59E0B]", // Gold
      iconColor: "text-white"
    },
  ];

  return (
    <section id="solutions" className="py-24 px-4 bg-transparent dark:bg-[#0B1120] relative overflow-hidden transition-colors duration-300">
      <div className="container mx-auto relative z-10 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fade-in-up">
          <p className="text-sm font-medium tracking-widest text-slate-500 uppercase mb-4 font-grotesk">
            OUR SOLUTIONS
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-slate-900 dark:text-white font-grotesk tracking-tight leading-tight">
            Complete Business Ecosystem <br />
            <span className="text-[#EFAD1A]">at Your Fingertips</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed font-grotesk font-normal">
            Transform your business operations with our comprehensive suite of virtual office solutions designed to scale with your ambitions.
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {solutions.map((solution, index) => (
            <Link
              key={index}
              to={solution.path}
              className="block group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className={`
                  h-full bg-white dark:bg-[#1E293B] rounded-[2rem] p-8
                  border border-slate-100 dark:border-white/5
                  shadow-xl hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-none
                  transition-all duration-300 transform hover:-translate-y-2
                  flex flex-col relative overflow-hidden
                `}
              >
                {/* Gradient Glow */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${solution.gradient} opacity-10 rounded-bl-[4rem] -mr-8 -mt-8 transition-opacity group-hover:opacity-20`}></div>

                {/* Icon Bubble */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${solution.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>

                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-[#EFAD1A] transition-colors font-grotesk">
                  {solution.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-medium">
                  {solution.description}
                </p>

                {/* Features List */}
                <div className="space-y-3 mt-auto mb-8">
                  {solution.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
                      <div className={`mt-0.5 w-4 h-4 rounded-full bg-gradient-to-br ${solution.gradient} flex items-center justify-center flex-shrink-0`}>
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Arrow Button */}
                <div className="flex items-center text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#EFAD1A] transition-colors mt-auto">
                  Explore Now <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Link to="/services/virtual-office">
            <button className="px-10 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-lg hover:bg-gray-900 dark:hover:bg-gray-100 transition-all active:scale-95 shadow-xl flex items-center mx-auto gap-3">
              View All Solutions
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;