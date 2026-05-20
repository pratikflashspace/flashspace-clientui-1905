import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "FlashSpace gave us the infrastructure to scale across 12 cities without a single long-term lease. It's the backbone of our hybrid strategy.",
    name: "Ananya Mehta",
    role: "CEO, NovaBridge Technologies",
  },
  {
    quote:
      "We opened GST-ready addresses across India without chasing landlords or paperwork. The process felt clean, fast, and properly managed.",
    name: "Priya Nair",
    role: "Founder, Bengaluru",
  },
  {
    quote:
      "Our operations team can book desks, meeting rooms, and business addresses in minutes. FlashSpace understands how Indian teams actually work.",
    name: "Rohit Malhotra",
    role: "Operations Head, Gurugram",
  },
];

export const FounderTestimonial = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = testimonials[activeIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#1F2E26] px-6 py-24 text-center text-white sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto flex min-h-[430px] max-w-[1180px] flex-col items-center justify-center">
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="mb-16 text-xs font-extrabold uppercase tracking-[0.35em] text-[#FEF8C5]/45"
        >
          Trusted by founders
        </motion.p>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.name}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col items-center"
          >
            <blockquote className="max-w-[980px] text-balance text-lg font-medium leading-[1.28] tracking-normal text-white sm:text-xl lg:text-2xl">
              "{active.quote}"
            </blockquote>

            <div className="mt-20">
              <p className="text-sm font-extrabold text-white sm:text-base">
                {active.name}
              </p>
              <p className="mt-2 text-[11px] text-[#FEF8C5]/45 sm:text-xs">
                {active.role}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-16 flex items-center justify-center gap-4">
          {testimonials.map((item, index) => (
            <button
              key={item.name}
              type="button"
              aria-label={`Show testimonial ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={`h-3 rounded-full transition-all duration-300 ${activeIndex === index
                ? "w-8 bg-[#EDB003]"
                : "w-3 bg-white/20 hover:bg-white/35"
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
