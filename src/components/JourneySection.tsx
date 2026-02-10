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
    <section id="journey" className="py-20 px-4 bg-transparent dark:bg-[#0a0a0a] overflow-hidden relative transition-colors duration-300">
      {/* Background Elements - Removed for clean white background */}

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#172A3A] dark:text-white mb-4 animate-fade-in" style={{ fontFamily: 'Poppins' }}>
            Your Success Story Begins Here
            <br />
            <span className="text-[#EDB003]">The FlashSpace Journey</span>
          </h2>
          <div className="flex items-center justify-center gap-2 text-xl text-gray-600 dark:text-gray-400 font-medium animate-fade-in font-content" style={{ animationDelay: '200ms' }}>
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
                    w-32 h-32 rounded-full border-4 border-gray-200 dark:border-white/10 bg-white dark:bg-[#1f1f1f]
                    flex flex-col items-center justify-center mb-6 relative group shadow-md
                    transform transition-all duration-700 hover:scale-110 hover:border-[#EDB003] dark:hover:border-[#EDB003] hover:shadow-xl
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
                  <div className="relative z-10 mb-2 text-[#172A3A] dark:text-white group-hover:text-[#EDB003] dark:group-hover:text-[#EDB003] transition-colors duration-300">
                    {step.icon}
                  </div>

                  {/* Step Number */}
                  <span className="text-[#EDB003] font-bold text-sm relative z-10 group-hover:text-[#172A3A] dark:group-hover:text-white transition-colors duration-300">
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
                    text-center text-[#172A3A] dark:text-white font-semibold text-lg max-w-32
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
          <div className="md:hidden space-y-0 text-left">
            {journeySteps.map((step, index) => (
              <div key={index} className="flex gap-6 relative pb-12 last:pb-0">
                {/* Mobile Straight Connector Line - Positioned absolute relative to the row to span full height */}
                {index < journeySteps.length - 1 && (
                  <div className="absolute left-10 top-20 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 -ml-[1px]">
                    {/* Animated overlay */}
                    <div
                      className="absolute top-0 left-0 w-full bg-[#EDB003] transition-all duration-1000"
                      style={{
                        height: isVisible ? '100%' : '0%',
                        opacity: isVisible ? 1 : 0
                      }}
                    ></div>
                  </div>
                )}

                {/* Step Circle Container */}
                <div className="flex flex-col items-center flex-shrink-0 w-20 relative z-10">
                  <div className="w-20 h-20 rounded-full border-3 border-gray-200 dark:border-white/10 bg-white dark:bg-[#1f1f1f] flex flex-col items-center justify-center shadow-md">
                    <div className="mb-1 text-[#172A3A] dark:text-white">
                      {step.icon}
                    </div>
                    <span className="text-[#EDB003] font-bold text-xs">
                      {step.step}
                    </span>
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex items-center pt-2">
                  <div className="text-[#172A3A] dark:text-white font-semibold text-xl">
                    {step.title}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center mt-8">
            <Button
              className={`
                bg-[#EDB003] hover:bg-[#172A3A] text-white w-full sm:w-auto px-8 py-6 rounded-xl font-bold text-lg
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