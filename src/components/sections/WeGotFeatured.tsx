import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface LogoItem {
  name: string;
  styleClass?: string;
  src?: string;
  customImageClass?: string;
}

const pressLogos: LogoItem[] = [
  { name: "BBC", src: "/newLogo/bbb.png", customImageClass: "h-14 sm:h-16" },
  { name: "Hindustan Times", src: "/newLogo/Hindustan_Times_Logo.png", customImageClass: "h-4 sm:h-12 lg:h-10" },
  { name: "BW Businessworld", src: "/newLogo/businessworld.png", customImageClass: "h-4 sm:h-18 lg:h-8" },
  { name: "Entrepreneur", styleClass: "font-sans font-medium text-sm md:text-xl tracking-widest uppercase" },
  { name: "Inc42", src: "/newLogo/inc42.png", customImageClass: "h-6 sm:h-16 lg:h-8" },
  { name: "The Guardian", src: "/newLogo/theGuardian.png" , customImageClass: "h-6 sm:h-6 lg:h-8"},
  { name: "Times of India", styleClass: "font-serif font-bold text-base md:text-2xl" },
  { name: "YourStory", styleClass: "font-sans font-bold text-lg md:text-3xl tracking-tighter", src: "/newLogo/YourStory-Logo.png", customImageClass: "h-10 sm:h-16" },
  { name: "Zee News", styleClass: "font-sans font-black text-lg md:text-3xl" , src:"/newLogo/zeeNews.jpg", customImageClass: "h-14 sm:h-16"},
  { name: "Business Standard", src: "/newLogo/business-standard-logo.png", customImageClass: "h-12 sm:h-12 lg:h-18" },
];

const LogoTextCard = ({ logo, index }: { logo: LogoItem; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group relative flex items-center justify-center p-2 sm:p-4 rounded-xl hover:bg-[#F0F4EE]/50 transition-colors"
    >
      <div className="relative z-10 flex items-center justify-center transition-all duration-300">
        {logo.src ? (
          <img
            src={logo.src}
            alt={logo.name}
            className={`${logo.customImageClass || "h-7 sm:h-12"} w-auto object-contain md:grayscale opacity-100 md:opacity-70 md:group-hover:grayscale-0 md:group-hover:opacity-100 group-hover:scale-110 transition-all duration-300`}
          />
        ) : (
          <span className={`${logo.styleClass} text-[#1A1A1A] md:text-gray-400 md:group-hover:text-[#1A1A1A] group-hover:scale-110 transition-all duration-300 whitespace-nowrap`}>
            {logo.name}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export const WeGotFeatured = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });

  return (
    <section
      ref={sectionRef}
      className="relative py-12 lg:py-16 overflow-hidden bg-white"
    >
      {/* Section Heading */}
      <div className="text-center mb-10 px-4 relative z-10">
        <h2 className="text-[28px] md:text-[36px] font-extrabold tracking-[-0.03em] text-[#1A1A1A]">
          We Got Featured
        </h2>
        <p className="text-[#6B8F78] mt-2 text-sm md:text-base">
          Recognized by top media publications
        </p>
      </div>

      <div className="relative z-10 fs-container px-4">
        {/* Static Grid Layout for Logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-wrap justify-center items-center gap-x-4 gap-y-6 md:gap-x-12 md:gap-y-10"
        >
          {pressLogos.map((logo, index) => (
            <LogoTextCard key={`${logo.name}-${index}`} logo={logo} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};
