import React, { useRef } from "react";
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
    className: "h-[72px] sm:h-[64px]", // Increased heights for mobile
  },
  {
    name: "Adda247",
    src: "https://res.cloudinary.com/dpowv0tmd/image/upload/v1774528434/Adda247_bbmaft.png",
    className: "h-[64px] sm:h-[72px]",
  },
  {
    name: "Flipkart",
    src: "/newLogo/flipkart-logo-png_seeklogo-284422.png",
    className: "h-[86px] sm:h-[72px]",
  },
  {
    name: "Growth School",
    src: "https://res.cloudinary.com/dpowv0tmd/image/upload/v1774528435/growthschool_-_Copy_iip2zr.png",
    className: "h-[40px] sm:h-[48px]",
  },
  {
    name: "Plum",
    src: "https://res.cloudinary.com/dpowv0tmd/image/upload/v1774528434/plum_logo_lstdop.png",
    className: "h-[48px] sm:h-[56px]",
  },
  {
    name: "Study IQ",
    src: "https://res.cloudinary.com/dpowv0tmd/image/upload/v1774528435/study_iq_xdxdkd.png",
    className: "h-[56px] sm:h-[56px]",
  },
  {
    name: "Truly Madly",
    src: "https://res.cloudinary.com/dpowv0tmd/image/upload/v1774528435/truly_madly_b78smk.png",
    className: "h-[64px] sm:h-[64px]",
  },
];

export const TrustedByFilmstripMobile = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });

  return (
    <section
      ref={sectionRef}
      className="relative py-12 overflow-hidden bg-[#FAFAF7] block lg:hidden"
    >
      <div className="relative z-10 fs-container">
        {/* Mobile Static Collage */}
        <div className="grid grid-cols-2 justify-items-center items-center gap-x-8 gap-y-12 px-6">
          {clientLogos.map((logo, index) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
              className={`flex items-center justify-center w-full ${
                index === clientLogos.length - 1 && clientLogos.length % 2 !== 0 ? 'col-span-2' : ''
              }`}
            >
              <img
                src={logo.src}
                alt={logo.name}
                className={`${logo.className} w-auto max-w-full object-contain brightness-105 contrast-[1.1] transition-all duration-300`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
