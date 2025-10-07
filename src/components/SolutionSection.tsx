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
    <section id="solutions" className="py-20 px-4 bg-[#ffffff] relative overflow-hidden">
      {/* Removed gradient & decorative blobs for pure white background */}

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 font-header ${getAnimationClasses(isVisible, 'fadeInUp', 0)}`} style={{ fontFamily: 'Poppins' }}>
            Complete Business Ecosystem
            <br />
            <span className="text-[#EDB003]">at Your Fingertips</span>
          </h2>
          <p className={`text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-content font-geist ${getAnimationClasses(isVisible, 'fadeInUp', 200)}`}>
            Transform your business operations with our comprehensive suite of virtual office solutions 
            designed to scale with your ambitions.
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 max-w-7xl mx-auto">
          {solutions.map((solution, index) => (
            <Link
              key={index}
              to={solution.path}
              className="block h-full"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Card
                className={`
                  bg-white border-2 border-gray-200 hover:border-[#EDB003] shadow-md hover:shadow-xl
                  group cursor-pointer transition-all duration-500 hover:scale-105
                  relative overflow-hidden h-full flex flex-col rounded-xl ${getAnimationClasses(isVisible, 'fadeInUp', index * 150)}
                `}
              >
                {/* Dynamic Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#172A3A]/5 to-[#EDB003]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -top-10 -right-10 w-16 h-16 bg-[#EDB003]/10 rounded-full blur-xl group-hover:bg-[#EDB003]/20 transition-colors duration-500"></div>
                <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-[#172A3A]/10 rounded-full blur-xl group-hover:bg-[#172A3A]/20 transition-colors duration-500"></div>

                <CardHeader className="space-y-4 p-5 relative z-10 flex-grow ">
                  <motion.div
                    className="flex items-center justify-center"
                    animate={hoveredIndex === index ? { scale: 1.05 } : { scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <motion.div
                      className="w-14 h-14 bg-gradient-to-br from-[#172A3A]/15 to-[#EDB003]/15 rounded-2xl flex items-center justify-center group-hover:from-[#172A3A]/25 group-hover:to-[#EDB003]/25 transition-all duration-500"
                      animate={hoveredIndex === index ? {
                        rotate: [0, -10, 10, -10, 0],
                        scale: 1.15
                      } : {
                        rotate: 0,
                        scale: 1
                      }}
                      transition={{
                        rotate: { duration: 0.6 },
                        scale: { duration: 0.3 }
                      }}
                    >
                      <span className="text-[#172A3A] group-hover:text-[#EDB003] transition-colors duration-300">
                        {solution.icon(hoveredIndex === index)}
                      </span>
                    </motion.div>
                  </motion.div>
                  <div className="text-center flex-grow flex flex-col">
                    <CardTitle className="text-lg mb-2 text-[#172A3A] group-hover:text-[#EDB003] transition-colors duration-300 font-bold font-header">
                      {solution.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 leading-snug text-sm font-content">
                      {solution.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4 p-5 pt-0 relative z-10">
                  {/* Features List */}
                  <div className="space-y-2.5">
                    {solution.features.map((feature, featureIndex) => (
                      <div 
                        key={featureIndex} 
                        className="flex items-center space-x-2 transform transition-all duration-300 group-hover:translate-x-1"
                        style={{ transitionDelay: `${featureIndex * 50}ms` }}
                      >
                        <div className="w-1.5 h-1.5 bg-[#EDB003] rounded-full group-hover:bg-[#172A3A] transition-colors duration-300 flex-shrink-0"></div>
                        <span className="text-gray-600 group-hover:text-gray-900 transition-colors duration-300 font-medium font-content text-xs">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                    <Button 
                      variant="outline" 
                      className="w-full border-2 border-[#172A3A] text-[#172A3A] hover:bg-[#EDB003] hover:text-white hover:border-[#EDB003] transition-all duration-300 py-2.5 font-semibold text-sm transform group-hover:scale-105 mt-auto"
                    >
                      Explore Now
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
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