import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { 
  MapPin, 
  Building2, 
  CreditCard, 
  FileCheck, 
  CheckCircle2,
  Sparkles
} from "lucide-react";

const JourneySection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );

    const section = document.getElementById("journey");
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const journeySteps = [
    {
      icon: <MapPin className="w-8 h-8 text-primary" />,
      title: "Select Location",
      step: "STEP 1",
      delay: 0
    },
    {
      icon: <Building2 className="w-8 h-8 text-primary" />,
      title: "Choose Your Space",
      step: "STEP 2", 
      delay: 200
    },
    {
      icon: <CreditCard className="w-8 h-8 text-primary" />,
      title: "Make the Payment",
      step: "STEP 3",
      delay: 400
    },
    {
      icon: <FileCheck className="w-8 h-8 text-primary" />,
      title: "Submit KYC",
      step: "STEP 4",
      delay: 600
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-primary" />,
      title: "Space is Yours",
      step: "STEP 5",
      delay: 800
    },
  ];

  return (
    <section id="journey" className="py-20 px-4 bg-[#ffffff] overflow-hidden relative">
      {/* Background Elements - Removed for clean white background */}

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#172A3A] mb-4 animate-fade-in" style={{ fontFamily: 'Poppins' }}>
            Your Success Story Begins Here
            <br />
            <span className="text-[#EDB003]">The FlashSpace Journey</span>
          </h2>
          <div className="flex items-center justify-center gap-2 text-xl text-gray-600 font-medium animate-fade-in font-content" style={{ animationDelay: '200ms' }}>
            <Sparkles className="w-6 h-6 text-[#EDB003] animate-pulse" />
          </div>
        </div>

        {/* Journey Steps */}
        <div className="max-w-6xl mx-auto">
          {/* Desktop Layout */}
          <div className="hidden md:flex justify-between items-center mb-16 relative">
            {journeySteps.map((step, index) => (
              <div key={index} className="flex flex-col items-center relative">
                {/* Step Circle */}
                <div
                  className={`
                    w-32 h-32 rounded-full border-4 border-gray-200 bg-white
                    flex flex-col items-center justify-center mb-6 relative group shadow-md
                    transform transition-all duration-700 hover:scale-110 hover:border-[#EDB003] hover:shadow-xl
                    ${isVisible
                      ? 'translate-y-0 opacity-100 scale-100'
                      : 'translate-y-10 opacity-0 scale-95'
                    }
                  `}
                  style={{
                    transitionDelay: isVisible ? `${step.delay}ms` : '0ms',
                    animationDelay: `${step.delay}ms`
                  }}
                >
                  {/* Glow Effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#EDB003]/10 to-[#172A3A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Icon */}
                  <div className="relative z-10 mb-2 text-[#172A3A] group-hover:text-[#EDB003] transition-colors duration-300">
                    {step.icon}
                  </div>

                  {/* Step Number */}
                  <span className="text-[#EDB003] font-bold text-sm relative z-10 group-hover:text-[#172A3A] transition-colors duration-300">
                    {step.step}
                  </span>
                  
                  {/* Curved Arrow Connection */}
                  {index < journeySteps.length - 1 && (
                    <div className="absolute top-1/2 left-full w-20 h-16 transform -translate-y-1/2 z-0 flex items-center justify-center">
                      <svg 
                        width="80" 
                        height="64" 
                        viewBox="0 0 80 64" 
                        className="absolute inset-0"
                      >
                        {/* Base curved path */}
                        <path
                          d="M 0 32 Q 20 16, 40 32 T 80 32"
                          stroke="#E5E7EB"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                        />

                        {/* Animated curved path */}
                        <path
                          d="M 0 32 Q 20 16, 40 32 T 80 32"
                          stroke="url(#arrowGradient)"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray="100"
                          strokeDashoffset={isVisible ? "0" : "100"}
                          className="transition-all duration-1000"
                          style={{ transitionDelay: `${step.delay + 300}ms` }}
                        />

                        {/* Arrow Head */}
                        <polygon
                          points="72,28 80,32 72,36 74,32"
                          fill="#EDB003"
                          className={`
                            transform transition-all duration-1000 origin-center
                            ${isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
                          `}
                          style={{ transitionDelay: `${step.delay + 800}ms` }}
                        />

                        {/* Gradient Definition */}
                        <defs>
                          <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#172A3A" />
                            <stop offset="100%" stopColor="#EDB003" />
                          </linearGradient>
                        </defs>
                      </svg>
                      
                      {/* Sparkle Effects */}
                      <div
                        className={`
                          absolute top-4 left-6 w-2 h-2 bg-[#EDB003] rounded-full animate-pulse
                          transform transition-all duration-1000
                          ${isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
                        `}
                        style={{
                          transitionDelay: `${step.delay + 600}ms`,
                          animationDelay: `${step.delay + 1000}ms`
                        }}
                      ></div>
                      <div
                        className={`
                          absolute bottom-6 right-8 w-1.5 h-1.5 bg-[#172A3A] rounded-full animate-pulse
                          transform transition-all duration-1000
                          ${isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
                        `}
                        style={{
                          transitionDelay: `${step.delay + 700}ms`,
                          animationDelay: `${step.delay + 1200}ms`
                        }}
                      ></div>
                    </div>
                  )}
                </div>

                {/* Step Title */}
                <div
                  className={`
                    text-center text-[#172A3A] font-semibold text-lg max-w-32
                    transform transition-all duration-700
                    ${isVisible
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-5 opacity-0'
                    }
                  `}
                  style={{ transitionDelay: `${step.delay + 200}ms` }}
                >
                  {step.title}
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden space-y-8 mb-12">
            {journeySteps.map((step, index) => (
              <div key={index} className="flex items-center gap-6 relative">
                <div className="w-20 h-20 rounded-full border-3 border-gray-200 bg-white flex flex-col items-center justify-center flex-shrink-0 shadow-md">
                  <div className="mb-1 text-[#172A3A]">
                    {step.icon}
                  </div>
                  <span className="text-[#EDB003] font-bold text-xs">
                    {step.step}
                  </span>
                </div>
                <div className="text-[#172A3A] font-semibold text-lg">
                  {step.title}
                </div>
                
                {/* Mobile Curved Arrow */}
                {index < journeySteps.length - 1 && (
                  <div className="absolute left-10 top-full w-8 h-16 transform translate-y-2">
                    <svg 
                      width="32" 
                      height="64" 
                      viewBox="0 0 32 64" 
                      className="absolute inset-0"
                    >
                      {/* Base curved path */}
                      <path
                        d="M 16 0 Q 8 20, 16 32 T 16 64"
                        stroke="#E5E7EB"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                      />

                      {/* Animated curved path */}
                      <path
                        d="M 16 0 Q 8 20, 16 32 T 16 64"
                        stroke="url(#mobileArrowGradient)"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray="80"
                        strokeDashoffset="0"
                        className="animate-pulse"
                      />

                      {/* Arrow Head */}
                      <polygon
                        points="12,56 16,64 20,56 16,60"
                        fill="#EDB003"
                        className="animate-pulse"
                      />

                      {/* Gradient Definition */}
                      <defs>
                        <linearGradient id="mobileArrowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#172A3A" />
                          <stop offset="100%" stopColor="#EDB003" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Button
              className={`
                bg-[#EDB003] hover:bg-[#172A3A] text-white px-12 py-4 rounded-lg font-bold text-lg
                transform hover:scale-105 transition-all duration-300
                shadow-lg hover:shadow-xl animate-fade-in
              `}
              style={{ animationDelay: '1000ms', fontFamily: 'Poppins' }}
            >
              START YOUR JOURNEY TODAY
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JourneySection;