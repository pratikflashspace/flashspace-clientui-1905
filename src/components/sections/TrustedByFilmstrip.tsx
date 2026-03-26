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
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out"
        style={{
          background: "linear-gradient(135deg, hsla(142, 20%, 50%, 0.04), hsla(54, 96%, 88%, 0.06))",
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
      className="relative py-6 sm:py-8 lg:py-10 overflow-hidden"
      style={{ background: "linear-gradient(180deg, hsl(60, 30%, 97%) 0%, hsl(60, 25%, 95%) 50%, hsl(60, 30%, 97%) 100%)" }}
    >
      {/* Subtle decorative gradient orbs */}
      <div
        className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsla(142, 25%, 50%, 0.04) 0%, transparent 70%)",
          transform: "translate(-50%, -60%)",
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsla(54, 96%, 60%, 0.05) 0%, transparent 70%)",
          transform: "translate(50%, 50%)",
        }}
      />

      {/* Header */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 mb-4 sm:mb-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col items-center gap-2.5"
        >
          {/* Decorative line + badge */}
          <div className="flex items-center gap-3">
            <div
              className="h-[1px] w-8 sm:w-12"
              style={{ background: "linear-gradient(90deg, transparent, hsl(142, 20%, 60%))" }}
            />
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.18em]"
              style={{
                background: "linear-gradient(135deg, hsla(142, 20%, 50%, 0.08), hsla(54, 96%, 88%, 0.12))",
                color: "hsl(142, 20%, 35%)",
                border: "1px solid hsla(142, 20%, 50%, 0.12)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: "hsl(142, 40%, 45%)" }}
              />
              Trusted by 5000+ Businesses
            </span>
            <div
              className="h-[1px] w-8 sm:w-12"
              style={{ background: "linear-gradient(90deg, hsl(142, 20%, 60%), transparent)" }}
            />
          </div>
        </motion.div>
      </div>

      {/* Logo scroll rows */}
      <div className="relative z-10 space-y-2 sm:space-y-3">
        {/* Smooth gradient fades on edges */}
        <div
          className="absolute top-0 left-0 w-20 sm:w-36 lg:w-48 h-full z-20 pointer-events-none"
          style={{ background: "linear-gradient(to right, hsl(60, 30%, 97%), transparent)" }}
        />
        <div
          className="absolute top-0 right-0 w-20 sm:w-36 lg:w-48 h-full z-20 pointer-events-none"
          style={{ background: "linear-gradient(to left, hsl(60, 30%, 97%), transparent)" }}
        />

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


    </section>
  );
};
