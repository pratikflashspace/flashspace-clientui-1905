import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface LogoItem {
  name: string;
  src: string;
  className?: string;
}

const clientLogos: LogoItem[] = [
  {
    name: "Agrizy",
    src: "https://res.cloudinary.com/dpowv0tmd/image/upload/v1774528434/agrizy_vpn5mj.png",
    className: "h-16 sm:h-24",
  },
  {
    name: "Adda247",
    src: "https://res.cloudinary.com/dpowv0tmd/image/upload/v1774528434/Adda247_bbmaft.png",
    className: "h-12 sm:h-16",
  },
  {
    name: "Flipkart",
    src: "https://res.cloudinary.com/dpowv0tmd/image/upload/v1774528435/Flipkart-Logo_uzked4.png",
    className: "h-12 sm:h-20",
  },
  {
    name: "Growth School",
    src: "https://res.cloudinary.com/dpowv0tmd/image/upload/v1774528435/growthschool_-_Copy_iip2zr.png",
    className: "h-10 sm:h-12",
  },
  {
    name: "Plum",
    src: "https://res.cloudinary.com/dpowv0tmd/image/upload/v1774528434/plum_logo_lstdop.png",
    className: "h-10 sm:h-14",
  },
  {
    name: "Study IQ",
    src: "https://res.cloudinary.com/dpowv0tmd/image/upload/v1774528435/study_iq_xdxdkd.png",
    className: "h-14 sm:h-18",
  },
  {
    name: "Truly Madly",
    src: "https://res.cloudinary.com/dpowv0tmd/image/upload/v1774528435/truly_madly_b78smk.png",
    className: "h-16 sm:h-20",
  },
];

// Split logos into two rows for dual-row display
const row1Logos = clientLogos.slice(0, 4);
const row2Logos = clientLogos.slice(4);

const LogoCard = ({ logo, index }: { logo: LogoItem; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group relative flex items-center justify-center cursor-pointer"
      style={{ minWidth: "220px", padding: "0 40px" }}
    >
      {/* Glassmorphic background card */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out"
        style={{
          background: "#F0F4EE",
          backdropFilter: "blur(8px)",
        }}
      />

      <div className="relative z-10 flex items-center justify-center py-6 px-4 transition-all duration-500">
        <img
          src={logo.src}
          alt={logo.name}
          className={`${logo.className || "h-10 sm:h-14"
            } w-auto object-contain grayscale opacity-80 brightness-110 contrast-125 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500`}
        />
      </div>
    </motion.div>
  );
};

const ScrollRow = ({
  logos,
  speed,
  reverse = false,
}: {
  logos: LogoItem[];
  speed: number;
  reverse?: boolean;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationId: number;
    let position = 0;
    const totalWidth = el.scrollWidth / 2;

    const animate = () => {
      if (!isPaused) {
        position += reverse ? speed : -speed;
        if (!reverse && position <= -totalWidth) position = 0;
        if (reverse && position >= 0) position = -totalWidth;
        el.style.transform = `translateX(${position}px)`;
      }
      animationId = requestAnimationFrame(animate);
    };

    // Start reversed rows at offset
    if (reverse) position = -totalWidth;

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused, speed, reverse]);

  // Triple the logos for seamless looping
  const tripled = [...logos, ...logos, ...logos, ...logos];

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        ref={scrollRef}
        className="flex items-center will-change-transform"
        style={{ width: "max-content" }}
      >
        {tripled.map((logo, i) => (
          <LogoCard key={`${logo.name}-${i}`} logo={logo} index={i % logos.length} />
        ))}
      </div>
    </div>
  );
};

export const TrustedByFilmstrip = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });

  return (
    <section
      ref={sectionRef}
      className="relative py-8 overflow-hidden bg-[#FAFAF7]"
    >


      {/* Logo scroll rows */}
      <div className="relative z-10 fs-container space-y-2 sm:space-y-3 overflow-hidden">
        {/* Smooth gradient fades on edges */}
        <div
          className="absolute top-0 left-0 w-20 sm:w-36 lg:w-48 h-full z-20 pointer-events-none"
          style={{ background: "linear-gradient(to right, #FAFAF7, transparent)" }}
        />
        <div
          className="absolute top-0 right-0 w-20 sm:w-36 lg:w-48 h-full z-20 pointer-events-none"
          style={{ background: "linear-gradient(to left, #FAFAF7, transparent)" }}
        />

        {/* Desktop Scrolling Animation */}
        <div className="hidden md:block">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <ScrollRow logos={row1Logos} speed={0.4} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <ScrollRow logos={row2Logos} speed={0.4} reverse />
          </motion.div>
        </div>

        {/* Mobile Static Collage */}
        <div className="md:hidden text-center mb-6 px-4">
          <h2 className="inline-block text-[12px] font-bold text-[#228B22] uppercase tracking-[0.05em] border border-[#228B22] rounded-full px-5 py-2 bg-[#228B22]/5">
            Trusted by top companies
          </h2>
        </div>
        <div className="md:hidden flex flex-wrap justify-center items-center gap-x-8 gap-y-8 px-4 py-2">
          {clientLogos.map((logo, index) => {
            // Individually tune mobile heights to perfectly balance wide vs square logos
            let mobileHeight = "h-[28px]";
            if (logo.name === "Agrizy") mobileHeight = "h-[44px]";
            if (logo.name === "Adda247") mobileHeight = "h-[36px]";
            if (logo.name === "Flipkart") mobileHeight = "h-[36px]";
            if (logo.name === "Growth School") mobileHeight = "h-[22px]";
            if (logo.name === "Plum") mobileHeight = "h-[26px]";
            if (logo.name === "Study IQ") mobileHeight = "h-[38px]";
            if (logo.name === "Truly Madly") mobileHeight = "h-[28px]";

            return (
              <motion.div
                key={logo.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
                className="flex items-center justify-center"
              >
                <img
                  src={logo.src}
                  alt={logo.name}
                  className={`${mobileHeight} w-auto object-contain brightness-105 contrast-[1.1] transition-all duration-300`}
                />
              </motion.div>
            );
          })}
        </div>
      </div>


    </section>
  );
};
