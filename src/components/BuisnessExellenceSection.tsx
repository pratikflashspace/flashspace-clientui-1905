import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle, TrendingUp, Users, Zap, MapPin, Shield, Building2, ArrowRight } from "lucide-react";
import { BarPatternChart } from "@/components/ui/bar-pattern-chart";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const Card3D = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = ({ currentTarget, clientX, clientY }: React.MouseEvent) => {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set((clientX - left) / width - 0.5);

    y.set((clientY - top) / height - 0.5);
  };

  const handleMouseLeave = () => {
    
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative active:scale-95 transition-transform duration-200 ease-out ${className}`}
    >
      {children}
    </motion.div>
  );
};

const BusinessExcellenceSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once visible, we can stop observing to keep it visible
          if (entry.target) observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 } // Lower threshold for better mobile detection
    );

    const section = document.getElementById("business-excellence");
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const reasons = [
    {
      icon: TrendingUp,
      title: "Instant Setup",
      description: "Get your business address activated in less than 24 hours with our streamlined onboarding process.",
      bgColor: "bg-blue-50 dark:bg-blue-900/10",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop&auto=format"
    },
    {
      icon: MapPin,
      title: "Prime Locations",
      description: "Establish your presence in India's most prestigious business districts across 100+ cities.",
      bgColor: "bg-purple-50 dark:bg-purple-900/10",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop&auto=format"
    },
    {
      icon: Shield,
      title: "Reliable Compliance ",
      description: "GST ready addresses with full legal documentation and compliance support included.",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/10",
      image: "https://plus.unsplash.com/premium_photo-1664475876634-246925214655?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c2lnbmF0dXJlJTVDfGVufDB8fDB8fHww"
    },
    {
      icon: Users,
      title: "98% Satisfaction",
      description: "Join thousands of happy businesses who trust FlashSpace for their virtual office needs.",
      bgColor: "bg-[#EDB003]/10 dark:bg-[#EDB003]/5",
      image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=300&fit=crop&auto=format"
    }
  ];

  return (
    <section id="business-excellence" className="py-20 px-4 relative overflow-hidden bg-transparent dark:bg-[#0a0a0a] transition-colors duration-300">
      <div className="container mx-auto relative z-10 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#172A3A] dark:text-white" style={{ fontFamily: 'poppins' }}>
            Why Choose <span className="text-[#EDB003]">FlashSpace</span>?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            India's most trusted workspace solution with premium quality and service
          </p>
        </div>

        {/* Cards Grid - 4 cards in a row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, index) => {
            const IconComponent = reason.icon;
            return (
              <Card
                key={index}
                className={`
                  group relative overflow-hidden cursor-pointer
                  ${reason.bgColor} border-0 rounded-3xl
                  transition-all duration-500
                  hover:shadow-xl hover:-translate-y-1
                  ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}
                  ${activeCard === index ? 'shadow-xl -translate-y-1' : 'shadow-md'}
                `}
                style={{
                  transitionDelay: `${index * 80}ms`
                }}
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
              >
                {/* Card Content */}
                <div className="flex flex-col h-full">
                  {/* Image */}
                  <div className="relative w-full h-48 overflow-hidden rounded-t-3xl mb-6">
                    <img
                      src={reason.image}
                      alt={reason.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>

                  <div className="px-8 pb-8 flex flex-col flex-grow">
                    {/* Title */}
                    <h3 className="text-2xl font-bold text-[#172A3A] dark:text-white mb-4" style={{ fontFamily: 'poppins' }}>
                      {reason.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 text-base">
                      {reason.description}
                    </p>

                    {/* Learn More Link */}
                    <button className="text-[#172A3A] dark:text-gray-200 text-left underline hover:text-[#EDB003] dark:hover:text-[#EDB003] transition-colors duration-300 mt-auto">
                      Learn More →
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Interactive Stats Visualization Section - Orange Theme */}
        <div className="mt-20 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Beautiful Bar Graph with Orange Theme */}
            <div className="space-y-8">
              {/* Section Title */}
              <div className="mb-10">
                <h3 className="text-4xl font-bold text-[#172A3A] dark:text-white mb-4" style={{ fontFamily: 'Poppins' }}>
                  Performance <span className="text-[#EDB003]">Analytics</span>
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                  Data-driven insights showcasing our commitment to excellence and continuous growth across all metrics.
                </p>
              </div>

              {/* Attractive Visual Banner */}
              <div className="relative mb-8 overflow-hidden rounded-2xl shadow-xl group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#172A3A]/85 to-[#EDB003]/85 z-10"></div>
                <img
                  src="https://images.unsplash.com/photo-1535957998253-26ae1ef29506?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fG9mZmljZXxlbnwwfHwwfHx8MA%3D%3D"
                  alt="FlashSpace Office"
                  className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 z-20 flex items-center justify-between px-8">
                  <div className="text-white">
                    <div className="text-3xl font-bold mb-1" style={{ fontFamily: 'Poppins' }}>10,000+</div>
                    <div className="text-sm opacity-90">Happy Clients Nationwide</div>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <TrendingUp className="w-5 h-5 text-white" />
                    <span className="text-white font-semibold text-sm">Growing Fast</span>
                  </div>
                </div>
              </div>

              {/* Professional Bar Chart replaced with BarPatternChart */}
              <BarPatternChart />
            </div>

            {/* Right: Beautiful Pie Chart & Stats - 3D Enabled */}
            <div className="space-y-8 perspective-1000">
              {/* Pie Chart Visualization */}
              <Card3D className="bg-gradient-to-br from-[#EDB003]/5 via-white to-[#EDB003]/10 dark:from-[#EDB003]/10 dark:via-[#1a1a1a] dark:to-[#EDB003]/5 p-8 rounded-3xl border-2 border-[#EDB003]/20 shadow-lg">
                <div style={{ transform: "translateZ(20px)" }}>
                  <h4 className="text-lg font-semibold text-[#172A3A] dark:text-white mb-6 text-center" style={{ fontFamily: 'Poppins' }}>
                    Service Distribution
                  </h4>

                  {/* Pie Chart (CSS-based) */}
                  <div className="flex items-center justify-center mb-8">
                    <div className="relative w-48 h-48" style={{ transformStyle: "preserve-3d" }}>
                      {/* Pie Chart Circle */}
                      <svg className="w-full h-full transform -rotate-90 text-[#EDB003]" viewBox="0 0 100 100" style={{ transform: "translateZ(30px)" }}>
                        {/* Virtual Office - 35% */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="20"
                          strokeDasharray="87.96 251.2"
                          strokeDashoffset="0"
                          className="transition-all duration-500 hover:stroke-[#EDB003]/80 drop-shadow-xl"
                        />
                        {/* Coworking - 30% */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="20"
                          strokeDasharray="75.36 251.2"
                          strokeDashoffset="-87.96"
                          opacity="0.75"
                          className="transition-all duration-500 hover:opacity-90"
                        />
                        {/* On Demand - 25% */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="20"
                          strokeDasharray="62.8 251.2"
                          strokeDashoffset="-163.32"
                          opacity="0.5"
                          className="transition-all duration-500 hover:opacity-70"
                        />
                        {/* Business Setup - 10% */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="20"
                          strokeDasharray="25.12 251.2"
                          strokeDashoffset="-226.12"
                          opacity="0.25"
                          className="transition-all duration-500 hover:opacity-40"
                        />
                      </svg>

                      {/* Center Label */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ transform: "translateZ(50px)" }}>
                        <div className="text-3xl font-bold text-[#172A3A] dark:text-white drop-shadow-md" style={{ fontFamily: 'Poppins' }}>100%</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Coverage</div>
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="space-y-3" style={{ transform: "translateZ(10px)" }}>
                    <div className="flex items-center justify-between p-3 bg-white/80 dark:bg-[#1f1f1f]/80 rounded-lg hover:shadow-md transition-shadow duration-300 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-[#EDB003]"></div>
                        <span className="text-sm font-medium text-[#172A3A] dark:text-gray-200">Virtual Office</span>
                      </div>
                      <span className="text-sm font-bold text-[#EDB003]">35%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/80 dark:bg-[#1f1f1f]/80 rounded-lg hover:shadow-md transition-shadow duration-300 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-[#EDB003] opacity-75"></div>
                        <span className="text-sm font-medium text-[#172A3A] dark:text-gray-200">Coworking Space</span>
                      </div>
                      <span className="text-sm font-bold text-[#EDB003]">30%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/80 dark:bg-[#1f1f1f]/80 rounded-lg hover:shadow-md transition-shadow duration-300 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-[#EDB003] opacity-50"></div>
                        <span className="text-sm font-medium text-[#172A3A] dark:text-gray-200">On Demand</span>
                      </div>
                      <span className="text-sm font-bold text-[#EDB003]">25%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/80 dark:bg-[#1f1f1f]/80 rounded-lg hover:shadow-md transition-shadow duration-300 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-[#EDB003] opacity-25"></div>
                        <span className="text-sm font-medium text-[#172A3A] dark:text-gray-200">Business Setup</span>
                      </div>
                      <span className="text-sm font-bold text-[#EDB003]">10%</span>
                    </div>
                  </div>
                </div>
              </Card3D>

              {/* Key Stats Cards - Compact with Background Images */}
              <div className="grid grid-cols-2 gap-3 perspective-1000">
                {/* Workspaces Card */}
                <Card3D className="relative overflow-hidden bg-white dark:bg-[#1f1f1f] p-4 rounded-xl border-2 border-[#EDB003]/20 hover:border-[#EDB003] transition-all duration-300 hover:shadow-lg group">
                  <div className="absolute top-0 right-0 w-20 h-20 opacity-10 group-hover:opacity-20 transition-opacity duration-300" style={{ transform: "translateZ(10px)" }}>
                    <MapPin className="w-full h-full text-[#EDB003]" />
                  </div>
                  <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
                    <MapPin className="w-7 h-7 text-[#EDB003] mb-2 group-hover:scale-110 transition-transform duration-300" />
                    <div className="text-2xl font-bold text-[#172A3A] dark:text-white mb-1" style={{ fontFamily: 'Poppins' }}>100+</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Workspaces</div>
                  </div>
                </Card3D>

                {/* Locations Card */}
                <Card3D className="relative overflow-hidden bg-white dark:bg-[#1f1f1f] p-4 rounded-xl border-2 border-[#EDB003]/20 hover:border-[#EDB003] transition-all duration-300 hover:shadow-lg group">
                  <div className="absolute top-0 right-0 w-20 h-20 opacity-10 group-hover:opacity-20 transition-opacity duration-300" style={{ transform: "translateZ(10px)" }}>
                    <Users className="w-full h-full text-[#EDB003]" />
                  </div>
                  <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
                    <Users className="w-7 h-7 text-[#EDB003] mb-2 group-hover:scale-110 transition-transform duration-300" />
                    <div className="text-2xl font-bold text-[#172A3A] dark:text-white mb-1" style={{ fontFamily: 'Poppins' }}>48+</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Locations</div>
                  </div>
                </Card3D>

                {/* Satisfaction Card */}
                <Card3D className="relative overflow-hidden bg-white dark:bg-[#1f1f1f] p-4 rounded-xl border-2 border-[#EDB003]/20 hover:border-[#EDB003] transition-all duration-300 hover:shadow-lg group">
                  <div className="absolute top-0 right-0 w-20 h-20 opacity-10 group-hover:opacity-20 transition-opacity duration-300" style={{ transform: "translateZ(10px)" }}>
                    <CheckCircle className="w-full h-full text-[#EDB003]" />
                  </div>
                  <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
                    <CheckCircle className="w-7 h-7 text-[#EDB003] mb-2 group-hover:scale-110 transition-transform duration-300" />
                    <div className="text-2xl font-bold text-[#172A3A] dark:text-white mb-1" style={{ fontFamily: 'Poppins' }}>98%</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Satisfaction</div>
                  </div>
                </Card3D>

                {/* Response Time Card */}
                <Card3D className="relative overflow-hidden bg-white dark:bg-[#1f1f1f] p-4 rounded-xl border-2 border-[#EDB003]/20 hover:border-[#EDB003] transition-all duration-300 hover:shadow-lg group">
                  <div className="absolute top-0 right-0 w-20 h-20 opacity-10 group-hover:opacity-20 transition-opacity duration-300" style={{ transform: "translateZ(10px)" }}>
                    <Zap className="w-full h-full text-[#EDB003]" />
                  </div>
                  <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
                    <Zap className="w-7 h-7 text-[#EDB003] mb-2 group-hover:scale-110 transition-transform duration-300" />
                    <div className="text-2xl font-bold text-[#172A3A] dark:text-white mb-1" style={{ fontFamily: 'Poppins' }}>&lt;3days</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Avg Documentation</div>
                  </div>
                </Card3D>
              </div>

              {/* Explore Workspaces Section */}
              <div
                className="relative mt-6 overflow-hidden rounded-2xl shadow-xl group cursor-pointer"
                onClick={() => window.location.href = 'https://sales-portal-url.com'}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#172A3A]/90 to-[#EDB003]/80 z-10"></div>
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000"
                  alt="Explore Workspaces"
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white p-6">
                  <Building2 className="w-12 h-12 mb-3 opacity-90 group-hover:scale-110 transition-transform duration-300" />
                  <h4 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Poppins' }}>
                    Explore WorkSpaces
                  </h4>
                  <p className="text-sm text-center opacity-90 mb-4">
                    Discover premium workspaces across India
                  </p>
                  <button className="flex items-center gap-2 px-6 py-2.5 bg-[#EDB003] text-white rounded-lg font-semibold hover:bg-white hover:text-[#172A3A] transition-all duration-300 shadow-lg group-hover:scale-105">
                    View All Spaces
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Badge */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-white dark:bg-[#1f1f1f] rounded-full shadow-lg border-2 border-gray-200 dark:border-white/10">
            <CheckCircle className="w-5 h-5 text-[#EDB003]" />
            <span className="text-[#172A3A] dark:text-white font-semibold text-xl" style={{ fontFamily: 'poppins' }}>
              Trusted by <span className="text-[#EDB003]">10,000+</span> businesses across India
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessExcellenceSection;