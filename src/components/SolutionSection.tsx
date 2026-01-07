import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Splash3dButton from "@/components/ui/3d-splash-button";
import { Link } from "react-router-dom";
import {
  Building,
  FileText,
  Mail,
  MapPin,
  Users,
  Briefcase,
  ChevronRight,
  Zap
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
            x="6" y="12" width="36" height="28" rx="4" fill="#E6F0FA"
            animate={isHovered ? { scale: 1.05, rotate: -2 } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.rect
            x="12" y="18" width="24" height="16" rx="2" fill="#EDB003"
            animate={isHovered ? { y: 16 } : { y: 18 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
          <motion.rect
            x="18" y="24" width="12" height="6" rx="1" fill="#fff"
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
      path: "/Solutions/virtual-office"
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
            x="8" y="18" width="32" height="18" rx="4" fill="#E6F0FA"
            animate={isHovered ? { scale: 1.08 } : { scale: 1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
          <motion.rect
            x="14" y="24" width="20" height="8" rx="2" fill="#EDB003"
            animate={isHovered ? { scale: 1.05, rotate: 3 } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.rect
            x="20" y="28" width="8" height="2" rx="1" fill="#fff"
            animate={isHovered ? { scaleY: 1.3 } : { scaleY: 1 }}
            transition={{ duration: 0.2, repeat: isHovered ? Infinity : 0, repeatType: "reverse" }}
          />
          <motion.rect
            x="18" y="14" width="12" height="6" rx="2" fill="#172A3A"
            animate={isHovered ? { y: 12 } : { y: 14 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          />
        </motion.svg>
      ),
      title: "Coworking Space",
      description: "Flexible workspace options with networking opportunities and premium amenities",
      features: ["Flexible Workspace", "Networking Events", "Premium Amenities", "24/7 Access"],
      path: "/Solutions/coworking-space"
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
            cx="32" cy="20" r="6" fill="#E6F0FA"
            animate={isHovered ? { scale: 1.15, y: -2 } : { scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
          />
          <motion.ellipse
            cx="16" cy="32" rx="10" ry="6" fill="#E6F0FA"
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
      path: "/Solutions/on-demand"
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
            x="14" y="18" width="20" height="16" rx="4" fill="#E6F0FA"
            animate={isHovered ? { rotate: 5, scale: 1.05 } : { rotate: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
          <motion.rect
            x="18" y="22" width="12" height="8" rx="2" fill="#EDB003"
            animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          />
          <motion.circle
            cx="24" cy="26" r="2" fill="#fff"
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
      path: "/Solutions/business-setup"
    },
  ];

  return (
    <section id="solutions" className="py-20 px-4 bg-[#ffffff] dark:bg-[#0a0a0a] relative overflow-hidden transition-colors duration-300">
      {/* Removed gradient & decorative blobs for pure white background */}

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 font-header ${getAnimationClasses(isVisible, 'fadeInUp', 0)}`} style={{ fontFamily: 'Poppins' }}>
            Complete Business Ecosystem
            <br />
            <span className="text-[#EDB003]">at Your Fingertips</span>
          </h2>
          <p className={`text-xl text-muted-foreground dark:text-gray-400 max-w-4xl mx-auto leading-relaxed font-content font-geist ${getAnimationClasses(isVisible, 'fadeInUp', 200)}`}>
            Transform your business operations with our comprehensive suite of virtual office solutions
            designed to scale with your ambitions.
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 max-w-7xl mx-auto">
          {solutions.map((solution, index) => (
            <Link
              key={index}
              to={solution.path}
              className="block"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Card
                className={`
                  bg-gradient-to-br from-white via-white to-gray-50 border border-gray-200
                  dark:from-[#171717] dark:via-[#171717] dark:to-[#1a1a1a] dark:border-white/10
                  hover:border-[#EDB003] dark:hover:border-[#EDB003] hover:shadow-2xl shadow-lg
                  group cursor-pointer transition-all duration-500 hover:-translate-y-2
                  relative overflow-hidden rounded-2xl h-full
                  ${getAnimationClasses(isVisible, 'fadeInUp', index * 150)}
                `}
              >
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#EDB003]/0 via-[#EDB003]/0 to-[#EDB003]/0 group-hover:from-[#EDB003]/5 group-hover:via-[#EDB003]/3 group-hover:to-transparent transition-all duration-700"></div>

                {/* Decorative Elements */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-[#EDB003]/10 to-transparent rounded-full blur-2xl group-hover:from-[#EDB003]/20 transition-all duration-500"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-[#172A3A]/5 to-transparent rounded-full blur-2xl group-hover:from-[#172A3A]/10 transition-all duration-500"></div>

                <CardContent className="p-6 relative z-10 flex flex-col h-full">
                  {/* Icon Section */}
                  <motion.div
                    className="mb-5 flex justify-center"
                    animate={hoveredIndex === index ? { scale: 1.1 } : { scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <motion.div
                      className="w-20 h-20 bg-gradient-to-br from-[#EDB003] to-[#f5c242] rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-[#EDB003]/30 transition-all duration-500 relative"
                      animate={hoveredIndex === index ? {
                        rotate: [0, -5, 5, -5, 0],
                        scale: 1.05
                      } : {
                        rotate: 0,
                        scale: 1
                      }}
                      transition={{
                        rotate: { duration: 0.6 },
                        scale: { duration: 0.3 }
                      }}
                    >
                      {/* Glow effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#EDB003] to-[#f5c242] rounded-2xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                      <span className="relative z-10">
                        {solution.icon(hoveredIndex === index)}
                      </span>
                    </motion.div>
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-center mb-3 text-[#172A3A] dark:text-white group-hover:text-[#EDB003] transition-colors duration-300 font-header" style={{ fontFamily: 'Poppins' }}>
                    {solution.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-5 leading-relaxed font-content min-h-[40px]">
                    {solution.description}
                  </p>

                  {/* Features List - Compact */}
                  <div className="space-y-2 mb-5 flex-grow">
                    {solution.features.map((feature, featureIndex) => (
                      <motion.div
                        key={featureIndex}
                        className="flex items-center gap-2.5 text-xs"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: hoveredIndex === index ? featureIndex * 0.05 : 0 }}
                      >
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#EDB003]/20 to-[#EDB003]/10 flex items-center justify-center flex-shrink-0 group-hover:from-[#EDB003]/30 group-hover:to-[#EDB003]/20 transition-all duration-300">
                          <div className="w-1.5 h-1.5 bg-[#EDB003] rounded-full"></div>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white font-medium transition-colors duration-300">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Button - More Prominent */}
                  <Button
                    className="w-full bg-[#172A3A] hover:bg-[#EDB003] text-white transition-all duration-300 py-5 font-semibold text-sm rounded-xl shadow-md hover:shadow-lg group/btn relative overflow-hidden"
                  >
                    {/* Button Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-700"></div>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Explore Now
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </span>
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Splash3dButton
            className={`bg-[#EDB003] hover:bg-[#172A3A] text-white px-8 py-3 font-semibold text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-lg font-[Poppins] ${getAnimationClasses(isVisible, 'fadeInUp', 600)}`}
          >
            View All Solutions
          </Splash3dButton>
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;