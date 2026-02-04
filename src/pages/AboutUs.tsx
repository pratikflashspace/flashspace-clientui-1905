import React, { useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Splash3dButton from "@/components/ui/3d-splash-button";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, useInView, useMotionValue, useSpring, Variants } from "framer-motion";
import { MapPin, Users, Clock, FileText, Sparkles, ShieldCheck, TrendingUp, Lightbulb, Heart, Phone, Mail } from "lucide-react";

const Counter = ({ value, suffix = "", decimals = 0 }: { value: number; suffix?: string; decimals?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 2500 });

  useEffect(() => {
    if (inView) {
      motionValue.set(value);
    }
  }, [inView, value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = latest.toFixed(decimals) + suffix;
      }
    });
  }, [springValue, suffix, decimals]);

  return <span ref={ref} />;
};

export default function AboutUs() {
  useEffect(() => {
    document.title = "About — FlashSpace";
  }, []);

  const ACCENT = "#FFD400";
  const ACCENT_DARK = "#FFB300";

  const pageVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

  // Updated 'Why Choose Us' data with images (Card Photos)
  const whyCards = [
    {
      title: "Virtual Office",
      desc: "Professional business address with mail handling and call forwarding services to establish your presence.",
      img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Coworking Space",
      desc: "Flexible workspaces with high-speed internet, meeting rooms, and a vibrant community of professionals.",
      img: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "On Demand Services",
      desc: "Book meeting rooms, conference halls, and private cabins as per your business needs.",
      img: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Business Setup",
      desc: "Complete assistance with company registration, GST, and all legal documentation for your business.",
      img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800"
    },
  ];

  const timeline = [
    { year: "2019", title: "The Beginning", details: "Opened the first FlashSpace center in a small garage, validating the hybrid-first model.", img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800" },
    { year: "2021", title: "Regional Expansion", details: "Expanded to 5 major cities with improved operations and tech integrations.", img: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&q=80&w=800" },
    { year: "2023", title: "Enterprise Solutions", details: "Launched tailored enterprise suites and managed-office programs for large teams.", img: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=800" },
    { year: "2025", title: "Nationwide Network", details: "Scaled presence across 20+ states, becoming India's favorite workspace network.", img: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&q=80&w=800" },
  ];

  const gallery = [
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1556761175-129418cb2dfe?auto=format&fit=crop&q=80&w=1600",
  ];

  const values = [
    { title: "Simplicity", desc: "We believe in creating simple and seamless experiences." },
    { title: "Integrity", desc: "We are completely transparent and upfront." },
    { title: "Progressive", desc: "We are smart and forward looking." },
    { title: "Innovative", desc: "We are always curious to explore uncharted territories." },
    { title: "Collaborative", desc: "We believe in the power of a team over an individual." },
    { title: "User Centric", desc: "We are always around to help." },
  ];

  const team = [
    { name: "Pranav Bhatia", role: "CEO at FlashSpace", img: "https://cdn.prod.website-files.com/664330484432dcdd6519a8fd/6644a86a1f2d7d473188297a_Untitled%20design%20(6).png" },
    { name: "Pratik Dey", role: "Business Head", img: "https://images.unsplash.com/photo-1545996124-45af2cf0b0b9?auto=format&fit=crop&q=80&w=400" },
    { name: "Aditya Rao", role: "Head of Product", img: "https://images.unsplash.com/photo-1544005315-7fdf6a9402c9?auto=format&fit=crop&q=80&w=400" },
  ];

  const locations = [
    { city: "Mumbai", count: 45 },
    { city: "Bengaluru", count: 60 },
    { city: "Delhi NCR", count: 70 },
    { city: "Chennai", count: 25 },
  ];

  const testimonials = [
    { quote: "FlashSpace transformed our hybrid strategy with measurable results.", author: "Priya — Founder, RetailCo" },
    { quote: "Their team delivered a flawless rollout across 3 cities.", author: "Rahul — Head of Ops, TechScale" },
    { quote: "Employees report better focus and collaboration after moving in.", author: "Anita — HR Lead, FinServ" },
  ];

  const stats = [
    { value: 250, suffix: "+", label: "Locations" },
    { value: 35, suffix: "k+", label: "Happy Members" },
    { value: 20, suffix: "+", label: "States & UTs" },
    { value: 99.9, suffix: "%", label: "Uptime SLA", decimals: 1 },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white font-sans antialiased transition-colors duration-300">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <Header loginBlack forceWhiteBackground />

      <main>
        {/* SECTION 1: ABOUT US HERO - Premium Redesign */}
        <section className="relative overflow-hidden w-full min-h-[90vh] flex items-center bg-gradient-to-br from-[#FFFBEB] via-white to-[#F0F9FF] dark:from-[#0a0a0a] dark:via-[#111] dark:to-[#1a1a1a] transition-colors duration-300">

          {/* Dynamic Background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-yellow-300/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 opacity-80" />
            <div className="absolute bottom-0 left-0 w-[50rem] h-[50rem] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3 opacity-80" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
          </div>

          <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left Content */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              variants={stagger}
              className="space-y-8 relative z-10"
            >
              <motion.div variants={pageVariants}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 bg-yellow-400/10 text-yellow-700 dark:text-yellow-400 border border-yellow-400/20 backdrop-blur-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                  </span>
                  Welcome to FlashSpace
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-slate-900 dark:text-white tracking-tight">
                  Redefining <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 relative">
                    Workspace
                    <svg className="absolute w-full h-3 -bottom-1 left-0 text-yellow-300 opacity-40 -z-10" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.00025 6.99997C25.7501 2.49994 132.5 -3.50004 198 4.99997" stroke="currentColor" strokeWidth="3" /></svg>
                  </span> Experiences
                </h1>
              </motion.div>

              <motion.p variants={pageVariants} className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                We're not just renting desks; we're building ecosystems. FlashSpace empowers businesses to thrive with flexible, tech-enabled offices designed for the modern workforce.
              </motion.p>

              <motion.div variants={pageVariants} className="flex flex-wrap gap-4 pt-4">
                <Button className="h-14 px-8 rounded-full text-base font-bold bg-yellow-400 hover:bg-yellow-500 text-black shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/30 transition-all hover:-translate-y-1">
                  Start Your Journey
                </Button>
                <Button variant="outline" onClick={() => document.getElementById('location-section')?.scrollIntoView({ behavior: 'smooth' })} className="h-14 px-8 rounded-full text-base font-semibold border-2 hover:bg-slate-50 dark:hover:bg-white/10 dark:text-white dark:border-white/20">
                  Explore Locations
                </Button>
              </motion.div>

              <motion.div variants={pageVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 border-t border-slate-200 dark:border-white/10 mt-8">
                {stats.map((s, i) => (
                  <div key={i} className="text-center sm:text-left group cursor-default">
                    <div className="text-3xl lg:text-4xl font-extrabold mb-1 text-slate-900 dark:text-white group-hover:text-yellow-500 transition-colors duration-300">
                      <Counter value={s.value} suffix={s.suffix} decimals={s.decimals} />
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Visuals - Bento Grid Style */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0, transition: { duration: 0.8, ease: "circOut" } }}
              viewport={{ once: true }}
              className="relative h-full min-h-[500px] hidden lg:block"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-yellow-200/20 via-transparent to-blue-200/20 rounded-[3rem] blur-2xl -z-10" />

              <div className="grid grid-cols-2 gap-4 h-full relative p-4">
                {/* Large Main Image */}
                <div className="col-span-2 row-span-2 relative rounded-[2rem] overflow-hidden shadow-2xl border border-white/20 group">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <img src={gallery[0]} alt="FlashSpace Interior" className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-1000" />

                  <div className="absolute bottom-6 left-6 z-20 backdrop-blur-md bg-white/10 border border-white/20 p-4 rounded-xl text-white">
                    <p className="font-bold">Premium Workspace</p>
                    <p className="text-xs opacity-80">Designed for productivity</p>
                  </div>
                </div>

                {/* Floating Elements / Secondary Images - Absolute Positioned to break grid slightly */}
                <motion.div
                  className="absolute -right-8 top-1/4 w-48 h-48 rounded-[1.5rem] overflow-hidden shadow-xl border-4 border-white dark:border-[#333] z-30"
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <img src={gallery[1]} alt="Meeting" className="w-full h-full object-cover" />
                </motion.div>

                <motion.div
                  className="absolute -left-8 bottom-1/4 w-40 h-40 rounded-[1.5rem] overflow-hidden shadow-xl border-4 border-white dark:border-[#333] z-30 flex items-center justify-center bg-white dark:bg-[#1a1a1a]"
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <div className="text-center p-4">
                    <span className="text-4xl block mb-2">⭐</span>
                    <p className="text-xs font-bold text-slate-800 dark:text-white">World Class Service</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 2: WHY CHOOSE US - Premium Image Cards */}
        <section className="relative py-24 bg-slate-50 dark:bg-[#050505] overflow-hidden transition-colors duration-300">
          {/* Background decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-300/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-[80px]" />
          </div>

          <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-20">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 pb-2"
              >
                Why Choose <span className="text-yellow-400">FlashSpace?</span>
              </motion.h2>
              <div className="w-24 h-1.5 bg-yellow-400 mx-auto rounded-full mt-4 shadow-lg shadow-yellow-400/40" />
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-6 text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
              >
                We deliver more than just space. We provide the ecosystem for your success, designed for the future of work.
              </motion.p>
            </div>



            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {whyCards.map((card, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group relative h-[480px] rounded-[2rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-yellow-400/10 transition-all duration-500"
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img src={card.img} alt={card.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end items-start text-white z-10">
                    {/* Floating Number */}
                    <div className="absolute top-6 right-6 text-7xl font-bold text-white/5 group-hover:text-yellow-400/20 transition-colors duration-500 font-serif select-none">
                      0{idx + 1}
                    </div>

                    <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out w-full">
                      <div className="w-14 h-14 mb-5 rounded-2xl bg-yellow-400 flex items-center justify-center text-black shadow-lg shadow-yellow-400/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        {/* Icons based on index - Professional & Clean */}
                        {idx === 0 && <MapPin className="w-8 h-8" strokeWidth={1.5} />}
                        {idx === 1 && <Users className="w-8 h-8" strokeWidth={1.5} />}
                        {idx === 2 && <Clock className="w-8 h-8" strokeWidth={1.5} />}
                        {idx === 3 && <FileText className="w-8 h-8" strokeWidth={1.5} />}
                      </div>

                      <h3 className="text-2xl font-bold mb-3 group-hover:text-yellow-300 transition-colors">{card.title}</h3>

                      {/* Hidden Text Revealed on Hover */}
                      <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500">
                        <p className="text-slate-300 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100 mb-6">
                          {card.desc}
                        </p>

                        {/* Learn More Button */}
                        <div className="flex items-center gap-2 text-yellow-400 text-sm font-bold tracking-wide uppercase opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-200">
                          Explore <span className="text-xl transition-transform group-hover:translate-x-1">→</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Border Gradient on Hover */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-yellow-400/50 rounded-[2rem] transition-colors duration-500 pointer-events-none" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: GROWTH TIMELINE - Best Visuals */}
        {/* SECTION 3: GROWTH TIMELINE - Amazing Redesign */}
        <section className="bg-white dark:bg-black py-24 transition-colors duration-300 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={pageVariants} className="text-center mb-24">
              <h2 className="text-4xl md:text-5xl font-bold dark:text-white mb-6">Our Journey</h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">From a single desk to a nationwide revolution. Here is how we grew.</p>
            </motion.div>

            <div className="relative">
              {/* Central Glowing Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-transparent via-yellow-400 to-transparent opacity-30 lg:block hidden" />

              <div className="space-y-24">
                {timeline.map((t, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className={`flex flex-col lg:flex-row items-center gap-12 ${i % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}
                  >
                    {/* Image Side */}
                    <div className="flex-1 w-full group">
                      <div className="relative h-[300px] md:h-[400px] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white dark:border-[#222]">
                        <img src={t.img} alt={t.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-yellow-400/10 group-hover:bg-transparent transition-colors duration-500" />
                      </div>
                    </div>

                    {/* Timeline Center Marker (Desktop) */}
                    <div className="relative hidden lg:flex items-center justify-center w-16">
                      <div className="w-12 h-12 rounded-full bg-yellow-400 border-4 border-white dark:border-black shadow-[0_0_20px_rgba(250,204,21,0.5)] z-10 flex items-center justify-center font-bold text-xs" >
                        {i + 1}
                      </div>
                    </div>

                    {/* Content Side */}
                    <div className="flex-1 w-full text-center lg:text-left">
                      <div className={`relative flex flex-col ${i % 2 === 0 ? 'lg:items-start' : 'lg:items-end'}`}>
                        <span className="absolute -top-12 md:-top-20 text-8xl md:text-9xl font-black text-yellow-500/20 dark:text-yellow-500/10 z-0 select-none pointer-events-none">{t.year}</span>
                        <div className="relative z-10 bg-white/95 dark:bg-[#111]/95 backdrop-blur-sm p-8 rounded-2xl border border-slate-100 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 mt-6 md:mt-10">
                          <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">{t.title}</h3>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{t.details}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Existing Sections: Gallery, Team, Locations, Testimonials, CTA */}

        {/* SECTION 4: OUR SPACES - Bento Grid Gallery */}
        <section className="bg-slate-50 dark:bg-[#080808] py-24 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={pageVariants} className="max-w-xl">
                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 mb-4">
                  Designed for Inspiration
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                  Step into workspaces that blend aesthetics with functionality. Every corner at FlashSpace is crafted to boost your productivity.
                </p>
              </motion.div>
              <div className="hidden md:block">
                <Button variant="outline" className="rounded-full border-slate-300 dark:border-white/20 hover:bg-slate-100 dark:hover:bg-white/10">
                  View All Spaces
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[250px]">
              {[
                { label: "Premium Suites", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200", span: "md:col-span-2 md:row-span-2" },
                { label: "Open Desk", img: "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&q=80&w=800", span: "" },
                { label: "Meeting Pods", img: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&q=80&w=800", span: "" },
                { label: "Breakout Zones", img: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&q=80&w=800", span: "md:col-span-2" },
                { label: "Conference Hall", img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800", span: "" },
                { label: "Cafeteria", img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800", span: "" },
                { label: "Event Space", img: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800", span: "md:col-span-2" }
              ].map((space, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className={`group relative rounded-2xl overflow-hidden shadow-lg ${space.span}`}
                >
                  <img
                    src={space.img}
                    alt={space.label}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white font-bold text-lg">{space.label}</p>
                      <p className="text-white/80 text-sm">Explore space &rarr;</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 md:hidden text-center">
              <Button variant="outline" className="rounded-full w-full">View All Spaces</Button>
            </div>
          </div>
        </section>

        {/* SECTION 5: OUR VALUES - Amazing Redesign */}
        <section className="relative py-24 bg-white dark:bg-[#0a0a0a] overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-yellow-400/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={pageVariants} className="text-center mb-20">
              <h2 className="text-4xl font-bold mb-6 dark:text-white">Our Core <span className="text-yellow-400">Values</span></h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Principles that guide our decisions and shape our culture.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {[
                { icon: Sparkles, color: "text-amber-400", bg: "bg-amber-400/10", ...values[0] },
                { icon: ShieldCheck, color: "text-blue-500", bg: "bg-blue-500/10", ...values[1] },
                { icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10", ...values[2] },
                { icon: Lightbulb, color: "text-yellow-500", bg: "bg-yellow-500/10", ...values[3] },
                { icon: Users, color: "text-purple-500", bg: "bg-purple-500/10", ...values[4] },
                { icon: Heart, color: "text-red-500", bg: "bg-red-500/10", ...values[5] },
              ].map((v, i) => (
                <motion.div
                  key={i}
                  variants={pageVariants}
                  className="p-8 rounded-[2rem] bg-slate-50 dark:bg-[#111] border border-slate-100 dark:border-white/5 hover:border-yellow-400/30 dark:hover:border-yellow-400/20 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
                >
                  <div className={`w-14 h-14 rounded-2xl ${v.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <v.icon className={`w-7 h-7 ${v.color}`} strokeWidth={1.5} />
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-yellow-500 transition-colors">
                    {v.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {v.desc}
                  </p>

                  {/* Gradient Overlay Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="bg-gray-50 dark:bg-[#111] py-16 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true }} variants={pageVariants} className="text-3xl font-bold text-center dark:text-white">Meet the team</motion.h2>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {team.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.06 } }} viewport={{ once: true }} className="p-6 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm text-center hover:shadow-lg hover:bg-gradient-to-t hover:from-yellow-200 hover:to-yellow-50 dark:hover:from-[#333] dark:hover:to-[#222] transition-all duration-300">
                  <img src={m.img} alt={m.name} className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-gray-50 dark:border-[#333]" />
                  <div className="mt-4 font-semibold dark:text-white">{m.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{m.role}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 7: LOCATION - Premium Map & Contact */}
        <section id="location-section" className="relative bg-slate-50 dark:bg-black py-24 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={pageVariants} className="mb-16">
              <h2 className="text-4xl md:text-5xl font-bold dark:text-white mb-6">Find <span className="text-yellow-400">Us</span></h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl">
                Located in the heart of the city, our flagship center is designed to be your perfect base of operations.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
              {/* Left Content - Contact Card */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-2 bg-white dark:bg-[#111] p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-white/10"
              >
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Contact Information</h3>

                <div className="space-y-8">
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-400 group-hover:text-black transition-all duration-300">
                      <MapPin className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-lg mb-1">Visit Us</p>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Kundan Mansion, 2-A/3, Asaf Ali Rd,<br /> Turkman Gate, New Delhi
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                      <Clock className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-lg mb-1">Working Hours</p>
                      <p className="text-slate-600 dark:text-slate-400">Mon - Sat: 9:00 AM - 8:00 PM</p>
                      <p className="text-slate-600 dark:text-slate-400">Sun: Closed</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
                      <Phone className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-lg mb-1">Get in Touch</p>
                      <p className="text-slate-600 dark:text-slate-400">+91 98765 43210</p>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">support@flashspace.com</p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-slate-100 dark:border-white/10">
                  <Button className="w-full h-12 rounded-full font-bold text-base bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors">
                    Get Directions
                  </Button>
                </div>
              </motion.div>

              {/* Right Map */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="lg:col-span-3 h-full min-h-[500px] relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white dark:border-[#222]"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.0!2d77.2315!3d28.6448!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM4JzQxLjMiTiA3N8KwMTMnNTMuNCJF!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'grayscale(0%) contrast(1.1)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                />
                {/* Decorative corner */}
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold border border-slate-200 dark:border-white/10 shadow-lg">
                  📍 New Delhi HQ
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}