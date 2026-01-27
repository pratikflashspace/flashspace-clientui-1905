import { MapPin, Search, ChevronDown, Check, ArrowRight, Video } from "lucide-react";
import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import VideoBackground from "./VideoBackground";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center bg-slate-50 dark:bg-[#0B1120] transition-colors duration-300 overflow-hidden pt-20 pb-20">

      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-amber-50 dark:from-[#0B1120] dark:via-[#111] dark:to-[#1a1a1a]" />

      {/* Static Gradient Orbs (Optimized for Performance - No Animation) */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#EFAD1A]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />



      <div className="container mx-auto px-4 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT COLUMN: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-left relative z-20"
          >
            {/* Eyebrow */}
            <p className="text-sm font-medium tracking-widest text-slate-500 uppercase mb-4 font-grotesk">
              AI-Enabled Coworking & Virtual Offices
            </p>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-extrabold mb-6 leading-[1.1] text-slate-900 dark:text-white font-grotesk tracking-tight">
              <span className="whitespace-nowrap">India’s First <span className="text-[#EFAD1A]">AI-Powered</span></span> <br />
              Workspaces
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl leading-relaxed font-grotesk font-medium">
              Flexible workspaces and virtual offices with built-in compliance, security, and smart workspace management.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button
                onClick={() => navigate("/start-chatting")}
                className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium flex items-center justify-center gap-3 hover:bg-gray-900 dark:hover:bg-gray-100 transition-all active:scale-95 shadow-lg"
              >
                Start Chatting
                <span className="w-3 h-3 bg-[#EFAD1A] rounded-full"></span>
              </button>

              <button
                onClick={() => navigate("/services/virtual-office")}
                className="group px-8 py-4 bg-white dark:bg-white/10 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-full font-medium flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-white/20 transition-all active:scale-95 shadow-sm"
              >
                <Video className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                Explore Workspaces
              </button>
            </div>

            {/* Trust Signals */}
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">✓ AI Compliance</div>
              <div className="flex items-center gap-2">✓ Prime Locations</div>
              <div className="flex items-center gap-2">✓ Enterprise-Ready</div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Floating Cluster */}
          <div className="relative h-[600px] w-full hidden lg:block perspective-1000 lg:translate-x-4">
            {/* Center Image (Main - Tech Office) */}
            <motion.div
              animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
            >
              <div className="w-72 h-96 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-[#333]">
                <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80" alt="AI Workspace" className="w-full h-full object-cover" />
              </div>
            </motion.div>

            {/* Center Gap Image (People) */}
            <motion.div
              animate={{ y: [0, -25, 0] }} transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 0.8 }}
              className="absolute top-[50%] left-[15%] transform -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <div className="w-44 h-44 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white dark:border-[#333]">
                <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=500&q=80" alt="Team Work" className="w-full h-full object-cover" />
              </div>
            </motion.div>

            {/* Upper Center Filler Image (Abstract/Tech) */}
            <motion.div
              animate={{ y: [0, -18, 0] }} transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 0.2 }}
              className="absolute top-[25%] left-[45%] transform -translate-x-1/2 -translate-y-1/2 z-0"
            >
              <div className="w-40 h-40 rounded-[2rem] overflow-hidden shadow-xl border-4 border-white dark:border-[#333]">
                <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=500&q=80" alt="Tech" className="w-full h-full object-cover" />
              </div>
            </motion.div>

            {/* Floating Image 1 (Top Right - Meeting) */}
            <motion.div
              animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
              className="absolute top-[5%] right-[5%] z-10"
            >
              <div className="w-40 h-40 rounded-[2rem] overflow-hidden shadow-xl border-4 border-white dark:border-[#333]">
                <img src="https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&w=500&q=80" alt="Meeting" className="w-full h-full object-cover" />
              </div>
            </motion.div>

            {/* Floating Image 2 (Bottom Left - Focus) */}
            <motion.div
              animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 2 }}
              className="absolute bottom-[15%] left-[5%] z-20"
            >
              <div className="w-48 h-32 rounded-[2rem] overflow-hidden shadow-xl border-4 border-white dark:border-[#333]">
                <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&q=80" alt="Focus" className="w-full h-full object-cover" />
              </div>
            </motion.div>

            {/* Floating Image 3 (Top Left - Interior) */}
            <motion.div
              animate={{ y: [0, -18, 0] }} transition={{ repeat: Infinity, duration: 7.5, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-[10%] left-[8%] z-10"
            >
              <div className="w-32 h-40 rounded-[2rem] overflow-hidden shadow-lg border-4 border-white dark:border-[#333]">
                <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=500&q=80" alt="Modern" className="w-full h-full object-cover" />
              </div>
            </motion.div>

            {/* Floating Image 4 (Bottom Right - Lounge) */}
            <motion.div
              animate={{ y: [0, -14, 0] }} transition={{ repeat: Infinity, duration: 6.5, ease: "easeInOut", delay: 1.5 }}
              className="absolute bottom-[10%] right-[12%] z-20"
            >
              <div className="w-44 h-44 rounded-[2rem] overflow-hidden shadow-xl border-4 border-white dark:border-[#333]">
                <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=500&q=80" alt="Lounge" className="w-full h-full object-cover" />
              </div>
            </motion.div>


            {/* Feature Pill 1 */}
            <motion.div
              animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-[35%] left-[-2%] bg-white dark:bg-[#1f1f1f] px-5 py-2.5 rounded-full shadow-lg flex items-center gap-3 z-30 border border-slate-100 dark:border-white/5"
            >
              <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-sm"></div>
              <span className="font-bold text-slate-800 dark:text-white text-xs">AI Powered</span>
            </motion.div>

            {/* Feature Pill 2 */}
            <motion.div
              animate={{ y: [0, -14, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1.5 }}
              className="absolute bottom-[28%] right-[-5%] bg-white dark:bg-[#1f1f1f] px-5 py-2.5 rounded-full shadow-lg flex items-center gap-3 z-30 border border-slate-100 dark:border-white/5"
            >
              <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-sm"></div>
              <span className="font-bold text-slate-800 dark:text-white text-xs">Smart Access</span>
            </motion.div>

            {/* Feature Pill 3 */}
            <motion.div
              animate={{ y: [0, -9, 0] }} transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 2.5 }}
              className="absolute top-[10%] right-[30%] bg-white dark:bg-[#1f1f1f] px-5 py-2.5 rounded-full shadow-lg flex items-center gap-3 z-30 border border-slate-100 dark:border-white/5"
            >
              <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-sm"></div>
              <span className="font-bold text-slate-800 dark:text-white text-xs">Global Network</span>
            </motion.div>

            {/* Decorative Circle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#EFAD1A]/5 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-6 h-10 border-2 border-slate-300 dark:border-slate-700 rounded-full flex items-start justify-center p-2 opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <div className="w-1.5 h-3 bg-slate-400 dark:bg-slate-500 rounded-full"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;