import { Card, CardContent } from "@/components/ui/card";
import {
  useScrollAnimation,
  getAnimationClasses,
} from "@/hooks/use-scroll-animation";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { useEffect, useState } from "react";

const Counter = ({ end, prefix = "", suffix = "", duration = 2000, isVisible }: { end: number, prefix?: string, suffix?: string, duration?: number, isVisible: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    
    let startTimestamp: number;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * end));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [end, duration, isVisible]);

  return <>{prefix}{count}{suffix}</>;
};

const TestimonialsSection = () => {
  const isVisible = useScrollAnimation("testimonials");

  const companies = [
    { name: "Adda247", logo: "/Logo/Adda247.png", needsInvert: false },
    { name: "Study IQ", logo: "/Logo/StudyIQ.png", needsInvert: false },
    {
      name: "Flipkart",
      logo: "/newLogo/flipkart-logo-png_seeklogo-284422.png",
      needsInvert: false,
    },
    {
      name: "Truly Madly",
      logo: "https://cdni.trulymadly.com/tm-static-assets-production/web/logo.webp",
      needsInvert: false,
    },
    { name: "Stage OTT", logo: "/Logo/Stage2.png", needsInvert: false },
    { name: "LUV Films", logo: "/Logo/luv.png", needsInvert: false },
    {
      name: "Callerdesk",
      logo: "https://callerdesk.io/img/images/caller_logo.svg",
      needsInvert: false,
    },
    {
      name: "Konsalidon",
      logo: "https://www.konsalidon.com/cdn/shop/files/Logo_-_Full_Height_-_Mono_White_copy_90x@2x.png?v=1642424736",
      needsInvert: true,
    },
    {
      name: "CareerGuide",
      logo: "https://www.careerguide.com/career/wp-content/uploads/2020/02/logo.png",
      needsInvert: false,
    },
    {
      name: "Meritink",
      logo: "https://www.meritink.com/static/media/logo.png",
      needsInvert: false,
    },
    {
      name: "Anarock",
      logo: "https://cdn.anarock.com/v2/images/anarock-logo.svg",
      needsInvert: false,
    },
  ];

  // Duplicate the array for seamless infinite scroll
  const duplicatedCompanies = [...companies, ...companies];

  const testimonials = [
    {
      text: "FlashSpace transformed our expansion strategy. With their virtual offices across 20+ states, we established presence in key markets without the overhead costs.",
      author: "Rajesh Kumar",
      position: "CEO, TechStart Solutions",
      company: "Mumbai",
    },
    {
      text: "The seamless mail management and professional address gave our startup the credibility we needed to secure major clients from day one.",
      author: "Priya Sharma",
      position: "Founder, Digital Innovations",
      company: "Bangalore",
    },
    {
      text: "24/7 support and lightning-fast setup helped us launch our business operations in just one day. Truly exceptional service!",
      author: "Amit Patel",
      position: "Director, Global Ventures",
      company: "Delhi",
    },
  ];

  return (
    <section
      id="testimonials"
      className="py-10 px-4 relative bg-transparent dark:bg-[#0a0a0a] transition-colors duration-300"
    >
      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            {...getAnimationClasses(isVisible, "fadeInUp", 0)}
            className={`text-3xl md:text-4xl font-bold mb-6 ${getAnimationClasses(isVisible, "fadeInUp", 0).className}`}
            style={{
              ...getAnimationClasses(isVisible, "fadeInUp", 0).style,
              fontFamily: "Poppins",
            }}
          >
            <span className="text-[#172A3A] dark:text-white">
              Trusted by Industry Leaders
            </span>
            <br />
            <span className="text-[#EDB003] text-2xl md:text-3xl">
              Across India
            </span>
          </h2>
          <p
            {...getAnimationClasses(isVisible, "fadeInUp", 200)}
            className={`text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed font-content ${getAnimationClasses(isVisible, "fadeInUp", 200).className}`}
          >
            Join thousands of successful businesses who chose FlashSpace to
            accelerate their growth and establish their market presence with
            confidence.
          </p>
        </div>

        {/* Company Logos Carousel & Grid */}
        <div
          {...getAnimationClasses(isVisible, "fadeIn", 300)}
          className={`mb-12 ${getAnimationClasses(isVisible, "fadeIn", 300).className}`}
        >
          <div className="relative">
            {/* Desktop Scrolling Logos */}
            <div className="hidden md:block overflow-hidden relative">
              {/* Gradient Overlays */}
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white dark:from-[#0a0a0a] to-transparent z-10"></div>
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white dark:from-[#0a0a0a] to-transparent z-10"></div>

              {/* Scrolling Logos */}
              <div className="infinite-scroll">
                {duplicatedCompanies.map((company, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 mx-4 flex items-center justify-center w-52 h-32"
                  >
                    <div
                      className={`${company.needsInvert ? "bg-[#172A3A]" : "bg-white"} border-2 border-gray-200 dark:border-white/10 p-6 w-full h-full flex items-center justify-center hover:shadow-xl transition-all duration-300 rounded-xl group hover:border-[#EDB003] relative overflow-hidden`}
                    >
                      <img
                        src={company.logo}
                        alt={company.name}
                        className="max-w-full max-h-full object-contain transition-all duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            parent.innerHTML = `<span class="text-sm font-bold ${company.needsInvert ? "text-white" : "text-[#172A3A]"} group-hover:text-[#EDB003] tracking-wider transition-colors duration-300 text-center">${company.name}</span>`;
                          }
                        }}
                      />
                      {/* Subtle corner accent */}
                      <div className="absolute top-0 right-0 w-3 h-3 bg-[#EDB003]/20 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Grid Logos (Static) */}
            <div className="md:hidden grid grid-cols-3 gap-3 px-2">
              {companies.map((company, index) => (
                <div
                  key={index}
                  className={`${company.needsInvert ? "bg-[#172A3A]" : "bg-white"} border border-gray-200 dark:border-white/10 p-3 w-full aspect-[3/2] flex items-center justify-center rounded-lg relative overflow-hidden`}
                >
                  <img
                    src={company.logo}
                    alt={company.name}
                    className={`max-w-full max-h-full object-contain ${company.name === 'Flipkart' ? 'scale-[2]' : ''}`}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = `<span class="text-[10px] leading-tight font-bold ${company.needsInvert ? "text-white" : "text-[#172A3A]"} text-center">${company.name}</span>`;
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Client Testimonials */}
        <div className="text-center mb-0 mt-16">
          <h3
            {...getAnimationClasses(isVisible, "fadeInUp", 400)}
            className={`text-3xl md:text-4xl font-bold mb-4 text-[#172A3A] dark:text-white ${getAnimationClasses(isVisible, "fadeInUp", 400).className}`}
            style={{
              ...getAnimationClasses(isVisible, "fadeInUp", 400).style,
              fontFamily: "Poppins",
            }}
          >
            Great People <span className="text-[#EDB003]">Trust Us</span>
          </h3>
          <p
            {...getAnimationClasses(isVisible, "fadeInUp", 500)}
            className={`text-gray-600 dark:text-gray-400 font-content ${getAnimationClasses(isVisible, "fadeInUp", 500).className}`}
          >
            Real stories from real businesses who transformed their operations
            with FlashSpace
          </p>
        </div>

        <div
          {...getAnimationClasses(isVisible, "fadeInUp", 600)}
          className={getAnimationClasses(isVisible, "fadeInUp", 600).className}
        >
          <AnimatedTestimonials
            testimonials={testimonials.map((t) => ({
              quote: t.text,
              name: t.author,
              designation: `${t.position}, ${t.company}`,
              // Using placeholder images as original data didn't have images
              src: `https://ui-avatars.com/api/?name=${encodeURIComponent(t.author)}&background=random&size=200`,
            }))}
          />
        </div>

        {/* Stats */}
        <Card
          {...getAnimationClasses(isVisible, "fadeInUp", 900)}
          className={`bg-white dark:bg-[#1f1f1f] border-2 border-gray-200 dark:border-white/10 shadow-lg  ${getAnimationClasses(isVisible, "fadeInUp", 900).className}`}
        >
          <CardContent className="p-3 md:p-8">
            <div className="flex justify-between md:grid md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-8 text-center items-start md:items-center px-1">
              <div className="group flex-1">
                <div
                  className="text-[13px] sm:text-base md:text-4xl font-bold text-[#EDB003] mb-0.5 md:mb-2 md:group-hover:scale-110 transition-transform duration-300"
                  style={{ fontFamily: "Poppins" }}
                >
                  <Counter end={5000} suffix="+" isVisible={isVisible} />
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-content text-[9px] sm:text-[11px] md:text-sm leading-tight block md:hidden">
                  Happy clients
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-content text-[9px] sm:text-[11px] md:text-sm leading-tight hidden md:block">
                  Happy Clients
                </div>
              </div>
              <div className="group flex-1">
                <div
                  className="text-[13px] sm:text-base md:text-4xl font-bold text-[#EDB003] mb-0.5 md:mb-2 md:group-hover:scale-110 transition-transform duration-300"
                  style={{ fontFamily: "Poppins" }}
                >
                  <Counter end={100} suffix="+" isVisible={isVisible} />
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-content text-[9px] sm:text-[11px] md:text-sm leading-tight block md:hidden">
                  Partner spaces
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-content text-[9px] sm:text-[11px] md:text-sm leading-tight hidden md:block">
                  Partner Spaces
                </div>
              </div>
              <div className="group flex-1">
                <div
                  className="text-[13px] sm:text-base md:text-4xl font-bold text-[#EDB003] mb-0.5 md:mb-2 md:group-hover:scale-110 transition-transform duration-300"
                  style={{ fontFamily: "Poppins" }}
                >
                  <Counter end={20} suffix="+" isVisible={isVisible} />
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-content text-[9px] sm:text-[11px] md:text-sm leading-tight block md:hidden">
                  States
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-content text-[9px] sm:text-[11px] md:text-sm leading-tight hidden md:block">
                  States Covered
                </div>
              </div>
              <div className="group flex-1">
                <div
                  className="text-[13px] sm:text-base md:text-4xl font-bold text-[#EDB003] mb-0.5 md:mb-2 md:group-hover:scale-110 transition-transform duration-300"
                  style={{ fontFamily: "Poppins" }}
                >
                  <Counter end={98} suffix="%" isVisible={isVisible} />
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-content text-[9px] sm:text-[11px] md:text-sm leading-tight block md:hidden">
                  Satisfaction rate
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-content text-[9px] sm:text-[11px] md:text-sm leading-tight hidden md:block">
                  Satisfaction Rate
                </div>
              </div>
              {/* This 5th item is completely hidden on mobile but remains perfectly visible on desktop */}
              <div className="group hidden md:block flex-1">
                <div
                  className="text-[13px] sm:text-base md:text-4xl font-bold text-[#EDB003] mb-0.5 md:mb-2 md:group-hover:scale-110 transition-transform duration-300"
                  style={{ fontFamily: "Poppins" }}
                >
                  &lt;3d
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-content text-[9px] sm:text-[11px] md:text-sm leading-tight">
                  Avg Delivery Time
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TestimonialsSection;
