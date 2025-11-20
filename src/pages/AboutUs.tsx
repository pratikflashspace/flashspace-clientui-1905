// AboutUs.tsx
import React, { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Splash3dButton from "@/components/ui/3d-splash-button";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function AboutUs() {
  useEffect(() => {
    document.title = "About — FlashSpace";
  }, []);

  const electric = "#FFD400";
  const electricDark = "#FFB300";

  const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.6 } },
  };

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  };

  return (
    <>
      {/* Import Poppins Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen flex flex-col bg-white text-foreground font-[Poppins]"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <Header loginBlack />

        {/* HERO */}
        <section
          className="relative overflow-hidden"
          aria-label="Hero - Empowering Growth"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,212,0,1) 0%, rgba(255,199,0,0.95) 40%, rgba(255,179,0,0.85) 100%)",
            }}
          />
          <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              variants={stagger}
              className="space-y-6"
            >
              <motion.h1
                variants={fadeUp}
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-black max-w-xl"
              >
                Empowering Growth
                <span className="block text-white md:text-white">
                  Through Modern Workspaces
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-lg md:text-xl text-black/80 max-w-2xl"
              >
                We design flexible virtual and physical workspaces that help
                teams collaborate, innovate, and scale — backed with human-first
                consultancy and smart workplace technology.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                <Splash3dButton
                  className="px-6 py-3 bg-black text-white shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5 transition font-medium"
                  aria-label="Get in touch"
                >
                  Get in touch
                </Splash3dButton>

                <Splash3dButton
                  className="px-6 py-3 bg-white text-black border border-black/10 shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition font-medium"
                  aria-label="Explore spaces"
                >
                  Explore spaces
                </Splash3dButton>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              variants={fadeUp}
              className="w-full flex justify-center lg:justify-end"
            >
              <div className="w-full max-w-md lg:max-w-lg rounded-2xl overflow-hidden shadow-2xl ring-4 ring-black/10">
                <img
                  src="/card-andheri.avif"
                  alt="FlashSpace workspace"
                  className="w-full h-72 md:h-96 object-cover"
                />
              </div>
            </motion.div>
          </div>
        </section>

        <main className="flex-1">
          {/* OUR MISSION + WHAT WE DO */}
          <section className="bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
              {/* Mission */}
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                className="text-center lg:text-left"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-amber-700 mb-4">
                  Our Mission
                </h2>
                <p className="text-lg text-foreground/80 leading-relaxed max-w-4xl mx-auto lg:mx-0">
                  At FlashSpace, we craft high-impact, scalable workplace
                  strategies that maximize employee efficiency and collaboration
                  — remote-first or hybrid. We unlock growth through modern
                  workplace design, digital-first operations, and attentive
                  consultancy that matches your business objectives.
                </p>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto lg:mx-0">
                  <div className="p-6 bg-white rounded-2xl shadow-sm border border-amber-100 hover:shadow-md transition">
                    <h4 className="font-semibold text-black text-lg">
                      People-first Design
                    </h4>
                    <p className="mt-2 text-foreground/70 text-base leading-relaxed">
                      Workspaces that prioritize comfort, collaboration, and
                      productivity.
                    </p>
                  </div>
                  <div className="p-6 bg-white rounded-2xl shadow-sm border border-amber-100 hover:shadow-md transition">
                    <h4 className="font-semibold text-black text-lg">
                      Technology-enabled
                    </h4>
                    <p className="mt-2 text-foreground/70 text-base leading-relaxed">
                      Smart decisions using data, connectivity, and immersive
                      tools.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* What We Do */}
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                className="text-center lg:text-left"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-amber-700 mb-4">
                  What We Do
                </h2>
                <p className="text-lg text-foreground/80 leading-relaxed max-w-4xl mx-auto lg:mx-0">
                  We combine workplace strategy, technology, and operations to
                  deliver flexible solutions — from virtual offices to full-scale
                  coworking spaces.
                </p>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto lg:mx-0">
                  {[
                    {
                      title: "Immersive Experiences",
                      desc: "Digital tools and spaces designed to enhance connectivity and productivity.",
                      icon: (
                        <svg
                          className="w-8 h-8"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden
                        >
                          <path
                            d="M3 12h18"
                            stroke="#FFB300"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                          <circle
                            cx="12"
                            cy="8"
                            r="3"
                            stroke="#FFB300"
                            strokeWidth="1.6"
                          />
                        </svg>
                      ),
                    },
                    {
                      title: "Modern Workplace",
                      desc: "Ready-to-use virtual and physical workspaces that enable focus-driven success.",
                      icon: (
                        <svg
                          className="w-8 h-8"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden
                        >
                          <rect
                            x="3"
                            y="6"
                            width="18"
                            height="12"
                            rx="2"
                            stroke="#FFB300"
                            strokeWidth="1.6"
                          />
                          <path
                            d="M8 12h8"
                            stroke="#FFB300"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                        </svg>
                      ),
                    },
                    {
                      title: "Expert Support",
                      desc: "Consultants who help assess readiness, embrace new trends, and create tailored plans.",
                      icon: (
                        <svg
                          className="w-8 h-8"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden
                        >
                          <path
                            d="M12 3v4"
                            stroke="#FFB300"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                          <path
                            d="M12 17v4"
                            stroke="#FFB300"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                          <circle cx="12" cy="11" r="1.5" fill="#FFB300" />
                        </svg>
                      ),
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="p-6 rounded-2xl border-2 shadow-sm hover:shadow-lg transition bg-white border-amber-100 flex flex-col items-start"
                    >
                      <div className="rounded-full bg-amber-50 p-3 mb-4">
                        {item.icon}
                      </div>
                      <h4 className="font-semibold text-black text-lg">
                        {item.title}
                      </h4>
                      <p className="mt-2 text-foreground/70 text-base leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          {/* STATS + IMAGES */}
          <section className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-12 font-[Poppins]">
            <div className="flex-1">
              <motion.h2
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                className="text-4xl md:text-5xl font-extrabold mb-4"
              >
                <span className="text-black">Work your way, </span>
                <span style={{ color: electric }} className="block">
                  with fixed desks and open-plan coworking spaces
                </span>
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="text-lg text-gray-700 mb-6 max-w-xl"
              >
                Whether you’re an established enterprise or a growing startup,
                discover spaces that inspire your most impactful work.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-xl"
              >
                {[
                  ["250+", "PAN India", "Locations"],
                  ["35K+", "Happy Clients", "served so far"],
                  ["29", "Presence in all", "29 states & 7 UTs"],
                  ["24/7", "Support", "Always available"],
                ].map(([num, title, sub], i) => (
                  <div key={i}>
                    <div
                      className="text-4xl font-extrabold"
                      style={{ color: electric }}
                    >
                      {num}
                    </div>
                    <div className="font-semibold text-black mt-2">{title}</div>
                    <div className="text-sm text-gray-600">{sub}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* 3D Tilt Images */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              className="flex-1 flex justify-center"
            >
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    src: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=600",
                    alt: "Modern Office Interior",
                  },
                  {
                    src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=600",
                    alt: "Workspace 2",
                  },
                  {
                    src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=600",
                    alt: "Workspace 3",
                  },
                  {
                    src: "https://archieapp.co/blog/wp-content/uploads/2022/05/Coworking-Space-Financial-Model-Cover-image.jpg",
                    alt: "Workspace 4",
                  },
                ].map((img, i) => (
                  <div
                    key={i}
                    className="relative rounded-xl shadow-lg w-48 h-48 overflow-hidden transform-gpu transition-transform duration-300"
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      const rotateX = ((y - rect.height / 2) / 15).toFixed(2);
                      const rotateY = ((rect.width / 2 - x) / 15).toFixed(2);
                      e.currentTarget.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform =
                        "rotateX(0deg) rotateY(0deg) scale(1)";
                    }}
                    style={{
                      perspective: "1000px",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover rounded-xl transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity rounded-xl"></div>
                  </div>
                ))}
              </div>
            </motion.div>
          </section>

          {/* TESTIMONIALS */}
          <section className="bg-gray-50 py-12 font-[Poppins]">
            <div className="max-w-7xl mx-auto px-6 text-center">
              <motion.h3
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                className="text-2xl font-bold"
              >
                What customers say
              </motion.h3>

              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={stagger}
                className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {[
                  {
                    quote:
                      "FlashSpace made our move to multiple cities effortless.",
                    author: "— Priya, Founder",
                  },
                  {
                    quote:
                      "Support is fast and the booking flow is delightful.",
                    author: "— Rahul, Operations",
                  },
                  {
                    quote: "Great value and flexible options for our team.",
                    author: "— Anita, HR",
                  },
                ].map((t, i) => (
                  <motion.blockquote
                    key={i}
                    variants={fadeUp}
                    className="p-6 rounded-2xl bg-white shadow-sm border border-amber-100 text-left"
                  >
                    <p className="text-foreground/80">“{t.quote}”</p>
                    <div className="mt-3 text-sm font-semibold text-foreground/70">
                      {t.author}
                    </div>
                  </motion.blockquote>
                ))}
              </motion.div>
            </div>
          </section>

          {/* NEWSLETTER CTA */}
          <section className="max-w-7xl mx-auto px-6 py-12 font-[Poppins]">
            <div
              className="rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-4"
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,212,0,0.08), rgba(255,179,0,0.06))",
                border: "2px solid rgba(255,179,0,0.12)",
              }}
            >
              <div>
                <h4 className="font-bold" style={{ color: electricDark }}>
                  Join the newsletter
                </h4>
                <p className="mt-1 text-sm text-foreground/70">
                  Monthly updates on products, spaces, and community stories.
                </p>
              </div>

              <div className="w-full md:w-auto flex items-center gap-3">
                <Input placeholder="you@company.com" className="min-w-0" />
                <Splash3dButton className="px-5 py-2 bg-gradient-to-r from-[#FFD400] to-[#FFB300] text-black shadow-md">
                  Subscribe
                </Splash3dButton>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
