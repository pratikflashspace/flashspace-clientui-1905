import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const scaleStats = [
  { value: "98%", label: "Satisfaction rate" },
  { value: "5K+", label: "Happy clients" },
  { value: "80+", label: "Cities" },
];

export const ScaleSection = () => {
  return (
    <section className="relative overflow-hidden bg-[#1F2E26] py-20 text-white sm:py-24 lg:py-28">
      <motion.div
        className="pointer-events-none absolute inset-y-0 left-8 hidden w-16 border-x border-[#FEF8C5]/5 lg:block"
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <motion.div
          className="absolute left-3 top-0 border-l border-[#FEF8C5]/5"
          initial={{ height: 0 }}
          whileInView={{ height: "70%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.15, ease: "easeOut" }}
        />
        <motion.div
          className="absolute right-5 top-0 border-l border-[#FEF8C5]/5"
          initial={{ height: 0 }}
          whileInView={{ height: "56%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.3, ease: "easeOut" }}
        />
      </motion.div>

      <div className="relative mx-auto grid max-w-[1320px] gap-14 px-6 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-16 lg:px-12 xl:px-16">
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, y: 42 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.75, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <motion.p
            className="mb-8 text-xs font-extrabold uppercase tracking-[0.2em] text-[#FEF8C5]"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08 }}
          >
            Unprecedented Scale
          </motion.p>
          <motion.h2
            className="text-4xl font-semibold leading-[1.12] tracking-normal text-[#FEF8C5] sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.16 }}
          >
            FlashSpace is built for modern businesses.
          </motion.h2>
          <motion.p
            className="mt-8 max-w-xl text-lg leading-8 text-white/75 sm:text-xl"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.24 }}
          >
            Traditional business management can't keep up with today's demands.
            FlashSpace simplifies workspace bookings, compliance tracking and
            more, across every location, worldwide. Do in minutes what once took
            a day.
          </motion.p>
          <motion.a
            href="/about"
            className="mt-10 inline-flex h-14 items-center gap-8 rounded-2xl border border-[#FEF8C5]/35 px-8 text-sm font-bold text-[#FEF8C5] transition-colors hover:border-[#FEF8C5] hover:bg-[#FEF8C5] hover:text-[#1F2E26] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FEF8C5]"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.32 }}
          >
            Learn more
            <ArrowUpRight className="h-4 w-4" />
          </motion.a>
        </motion.div>

        <motion.div
          className="mx-auto w-full max-w-3xl"
          initial={{ opacity: 0, x: 52 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="mb-10 flex flex-wrap items-end gap-3">
            <motion.span
              className="text-6xl font-black leading-none text-white sm:text-7xl"
              initial={{ opacity: 0, scale: 0.88 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.35, ease: "easeOut" }}
            >
              24x
            </motion.span>
            <motion.span
              className="pb-2 text-2xl font-bold text-white/75 sm:text-3xl"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.45 }}
            >
              faster booking
            </motion.span>
          </div>

          <div className="space-y-7">
            <div className="grid grid-cols-[8rem_1fr_5rem] items-center gap-5 sm:grid-cols-[9rem_1fr_6rem]">
              <span className="text-xs uppercase tracking-[0.12em] text-white/55">
                FlashSpace
              </span>
              <motion.div
                className="h-4 w-full max-w-24 origin-left rounded-full bg-[#FEF8C5]"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.75, delay: 0.55, ease: "easeOut" }}
              />
              <span className="font-mono text-sm font-bold text-[#FEF8C5]">
                5 min
              </span>
            </div>

            <div className="grid grid-cols-[8rem_1fr_5rem] items-center gap-5 sm:grid-cols-[9rem_1fr_6rem]">
              <span className="text-xs uppercase tracking-[0.12em] text-white/55">
                Traditional
              </span>
              <motion.div
                className="h-4 origin-left overflow-hidden rounded-full bg-white/15"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.68, ease: "easeOut" }}
              >
                <motion.div
                  className="h-full w-full bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.16)_0_3px,transparent_3px_7px)]"
                  animate={{ x: [0, 14] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
              <span className="text-sm text-white/55">120+ hrs</span>
            </div>
          </div>

          <motion.div
            className="mt-12 border-t border-white/10 pt-9"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.78 }}
          >
            <div className="grid max-w-lg grid-cols-3">
              {scaleStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className={index === 0 ? "pr-6" : "border-l border-white/10 px-6"}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.86 + index * 0.1 }}
                >
                  <div className="text-3xl font-black text-white">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-white/55 sm:text-base">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
