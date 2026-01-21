import { Building, MapPin, Mail, Phone, FileText, CheckCircle, Star, Users, Award, ChevronDown, Search, ArrowRight, Sparkles, TrendingUp, Shield, Briefcase, Clock, Package, Zap, HeartHandshake, DollarSign, Headphones, FileCheck, Scale, IndianRupee } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { useRef, useEffect } from "react";

const BusinessSetup = () => {
  // Refs for interactive background
  const bgRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const bg = bgRef.current;
    if (!container || !bg) return;

    const handleMove = (e: MouseEvent | globalThis.MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const translateX = x * 14;
      const translateY = y * 10;
      bg.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(1.03)`;
    };

    const handleLeave = () => {
      if (bg) bg.style.transform = `translate3d(0, 0, 0) scale(1.03)`;
    };

    container.addEventListener('mousemove', handleMove);
    container.addEventListener('mouseleave', handleLeave);

    return () => {
      container.removeEventListener('mousemove', handleMove);
      container.removeEventListener('mouseleave', handleLeave);
    };
  }, []);
  const [selectedCity, setSelectedCity] = useState("Delhi");
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const cities = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
    "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Surat",
    "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane"
  ];

  const whatIsBusinessSetupCards = [
    {
      icon: Building,
      title: "Company Registration",
      description: "Register Pvt Ltd, LLP, OPC, Partnership, or Sole Proprietorship with complete MCA compliance and documentation support"
    },
    {
      icon: FileText,
      title: "GST & Tax Filing",
      description: "GST registration, PAN, TAN, and professional guidance for timely tax filings and compliance management"
    },
    {
      icon: Shield,
      title: "Business Licenses",
      description: "Obtain trade licenses, FSSAI, IEC (Import-Export Code), Shop & Establishment, MSME/Udyam, Professional Tax, Drug License, Trademark Registration, ISO Certification, and all industry-specific permits"
    },
    {
      icon: Headphones,
      title: "Business Setup — Worldwide",
      description: "Comprehensive global business registration and incorporation services across multiple countries. Expert guidance for international expansion, cross-border compliance, and worldwide entity formation"
    }
  ];

  const howItWorksSteps = [
    {
      number: "01",
      title: "Free Consultation",
      description: "Connect with our expert CAs and lawyers to understand the best entity type for your business",
      icon: Phone
    },
    {
      number: "02",
      title: "Document Collection & Filing",
      description: "We collect necessary documents and file applications with MCA, GST portal, and other authorities",
      icon: FileCheck
    },
    {
      number: "03",
      title: "Make Payment",
      description: "Complete secure payment through our transparent pricing system with no hidden charges",
      icon: IndianRupee
    },
    {
      number: "04",
      title: "Registration Complete",
      description: "Receive your Certificate of Incorporation, PAN, TAN, GST, and all business licenses within 7-10 days",
      icon: CheckCircle
    }
  ];

  const whyChooseReasons = [
    {
      icon: Scale,
      title: "Expert Guidance",
      description: "Certified CAs & experienced lawyers guiding you through every step",
      gradient: "from-[#EDB003] to-[#f5c242]"
    },
    {
      icon: Package,
      title: "All-in-One Solution",
      description: "Complete registration, GST, licenses, and compliance in one package",
      gradient: "from-[#172A3A] to-[#2a4a5a]"
    },
    {
      icon: DollarSign,
      title: "Transparent Pricing",
      description: "No hidden costs, clear pricing with detailed breakdowns",
      gradient: "from-[#EDB003] to-[#f5c242]"
    },
    {
      icon: Zap,
      title: "Fast Turnaround",
      description: "Complete registration in just 7-10 working days",
      gradient: "from-[#172A3A] to-[#2a4a5a]"
    },
    {
      icon: HeartHandshake,
      title: "Post-Setup Support",
      description: "Annual filings, compliance management, and ongoing assistance",
      gradient: "from-[#EDB003] to-[#f5c242]"
    },
    {
      icon: Building,
      title: "Multiple Entity Types",
      description: "Support for Pvt Ltd, LLP, OPC, Partnership, and Proprietorship",
      gradient: "from-[#172A3A] to-[#2a4a5a]"
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Founder, TechStart Solutions",
      company: "Bangalore",
      content: "FlashSpace made registering my Pvt Ltd company incredibly smooth. The team handled everything from documentation to GST registration in just 8 days. Their post-setup support has been invaluable!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
    },
    {
      name: "Rajesh Patel",
      role: "Co-founder, GreenLeaf Organics",
      company: "Mumbai",
      content: "The team guided us through LLP formation, FSSAI license, and GST compliance with exceptional professionalism. Transparent pricing and expert advice made the entire process stress-free.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
    },
    {
      name: "Anita Desai",
      role: "Director, StyleHub Fashion",
      company: "Delhi",
      content: "From OPC registration to trademark filing, FlashSpace delivered everything they promised. Their CA team is highly responsive and helped us stay compliant from day one. Highly recommended!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
    }
  ];

  const faqs = [
    {
      question: "How long does it take to register a company in India?",
      answer: "Typically, company registration takes 7-10 working days with FlashSpace. The timeline depends on the type of entity (Pvt Ltd, LLP, OPC) and document completeness. We provide fast-track processing for urgent requirements."
    },
    {
      question: "What is the difference between Pvt Ltd, LLP, and OPC?",
      answer: "Private Limited (Pvt Ltd) requires 2+ directors and offers limited liability protection. Limited Liability Partnership (LLP) combines partnership flexibility with corporate benefits. One Person Company (OPC) is ideal for solo entrepreneurs with limited liability protection. Our experts help you choose the right structure."
    },
    {
      question: "What documents are required for company registration?",
      answer: "You'll need PAN cards, Aadhaar cards, address proofs, and passport-size photos of directors/partners. For registered office, you need a rent agreement or property deed. We provide a complete checklist after the initial consultation."
    },
    {
      question: "Do I need GST registration for my business?",
      answer: "GST registration is mandatory if your annual turnover exceeds ₹40 lakhs (₹20 lakhs for service providers). It's also required for interstate business, e-commerce, and certain business types. Our CA team assesses your needs and handles the registration."
    },
    {
      question: "What is included in post-setup support?",
      answer: "Our post-setup support includes annual ROC filings, GST return assistance, compliance calendar management, board meeting support, and statutory record maintenance. You get dedicated CA and legal expert access for consultation."
    },
    {
      question: "Can I change my business structure later?",
      answer: "Yes, you can convert from one entity type to another (e.g., OPC to Pvt Ltd, Partnership to LLP). The process involves MCA/ROC approvals and documentation. We handle the entire conversion process with minimal hassle."
    },
    {
      question: "What licenses do I need for my specific business?",
      answer: "License requirements vary by industry. Common licenses include trade license, FSSAI (food), professional tax, shop & establishment, import-export code, and industry-specific permits. We assess your business and obtain all necessary licenses."
    },
    {
      question: "Is virtual office address acceptable for company registration?",
      answer: "Yes, virtual office addresses are accepted for company registration if they provide proper documentation (NOC, rent agreement). FlashSpace offers verified virtual office solutions across 68+ locations, ensuring MCA/GST compliance."
    }
  ];

  const cityLocations = [
    {
      city: "Bangalore",
      centers: 5,
      image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&q=80",
      description: "Startup hub with streamlined registrations"
    },
    {
      city: "Delhi NCR",
      centers: 15,
      image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80",
      description: "Capital region business setup experts"
    },
    {
      city: "Mumbai",
      centers: 4,
      image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80",
      description: "Financial capital registration services"
    },
    {
      city: "Kolkata",
      centers: 8,
      image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80",
      description: "Complete business incorporation support"
    },
    {
      city: "Hyderabad",
      centers: 4,
      image: "https://images.unsplash.com/photo-1609619385002-f40f7eb3b755?w=800&q=80",
      description: "Tech startup registration specialists"
    },
    {
      city: "Chennai",
      centers: 2,
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80",
      description: "Southern region setup assistance"
    }
  ];

  const stats = [
    { number: "5000+", label: "Companies Registered", icon: Building },
    { number: "68+", label: "Centers Pan India", icon: MapPin },
    { number: "8", label: "Major Cities", icon: TrendingUp },
    { number: "7-10 Days", label: "Setup Time", icon: Clock }
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300" style={{ fontFamily: 'Geist, Poppins, sans-serif' }}>
      {/* Header */}
      <Header />

      {/* Hero Section (MindTrip Style - Floating Cluster) */}
      <section ref={containerRef} className="relative min-h-[90vh] flex items-center bg-slate-50 dark:bg-[#0B1120] transition-colors duration-300 z-30 pt-20 overflow-hidden">

        {/* Clean Background with subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-amber-50 dark:from-[#0B1120] dark:via-[#111] dark:to-[#1a1a1a]" />

        {/* Animated Gradient Orbs (Subtle) */}
        <div className="absolute top-20 left-20 w-[500px] h-[500px] bg-[#EDB003]/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] animate-pulse delay-1000" />

        <div className="container mx-auto px-4 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* LEFT COLUMN: Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.8 }}
              className="text-left relative z-20"
            >
              <motion.div
                className="inline-flex items-center gap-2 bg-white dark:bg-white/5 border border-amber-200 dark:border-white/10 px-4 py-2 rounded-full mb-8 shadow-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles className="w-4 h-4 text-[#EDB003]" />
                <span className="text-sm font-bold tracking-wide text-slate-800 dark:text-white">Complete Business Setup Solutions</span>
              </motion.div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] text-slate-900 dark:text-white tracking-tight">
                Business Setup <br />
                <span className="text-[#EDB003]">Made Simple.</span>
              </h1>

              <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-lg leading-relaxed">
                Complete end-to-end support for company registration, GST filing, licenses, and legal compliance - launch your business in 7-10 days.
              </p>

              {/* Search Container (Relative Parent) */}
              <div className="relative max-w-md w-full">

                {/* Compact Search Bar */}
                <div className="bg-white dark:bg-white/5 p-2 rounded-2xl shadow-xl border border-slate-100 dark:border-white/10 w-full relative z-20">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => setIsLocationOpen(!isLocationOpen)}
                      className="flex-1 justify-between h-12 px-4 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl text-slate-700 dark:text-white"
                    >
                      <span className="truncate mr-2">{selectedCity || "Select City"}</span>
                      <ChevronDown className="w-4 h-4 opacity-50" />
                    </Button>
                    <Button className="bg-[#EDB003] hover:bg-[#d69f03] text-black font-bold h-12 px-6 rounded-xl">
                      Get Started
                    </Button>
                  </div>
                </div>

                {/* Horizontal City Selector Overlay (Anchored to Parent) */}
                {isLocationOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: 10, scale: 0.95, filter: "blur(10px)" }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className="absolute bottom-full left-0 mb-3 z-30 w-full bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-2xl rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-white/20 ring-1 ring-black/5 overflow-hidden"
                  >
                    {/* Decorative Top Gradient Line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#EDB003] to-transparent opacity-50" />
                    <div className="p-5">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg dark:text-white flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-[#EDB003]" /> Select Location
                        </h3>
                        <button onClick={() => setIsLocationOpen(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors">
                          <Check className="w-5 h-5 text-slate-400" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                        {cities.map(c => (
                          <button
                            key={c}
                            onClick={() => { setSelectedCity(c); setIsLocationOpen(false); }}
                            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${selectedCity === c
                              ? 'bg-[#EDB003] text-black border-[#EDB003] shadow-md shadow-[#EDB003]/20'
                              : 'bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 border-transparent hover:bg-slate-100 dark:hover:bg-white/10 hover:scale-[1.02]'
                              }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="flex items-center gap-6 mt-10 text-sm font-medium text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#EDB003]" /> <span>Free Consultation</span></div>
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#EDB003]" /> <span>100% Online Process</span></div>
              </div>
            </motion.div>

            {/* RIGHT COLUMN: Floating Cluster */}
            <div className="relative h-[600px] w-full hidden lg:block perspective-1000">
              {/* Center Image (Main - Signing/Contract) */}
              <motion.div
                animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
              >
                <div className="w-64 h-80 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-[#333]">
                  <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80" alt="Signing Contract" className="w-full h-full object-cover" />
                </div>
              </motion.div>

              {/* Center Gap Image (Handshake) */}
              <motion.div
                animate={{ y: [0, -25, 0] }} transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 0.8 }}
                className="absolute top-[50%] left-[22%] transform -translate-x-1/2 -translate-y-1/2 z-10"
              >
                <div className="w-40 h-40 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white dark:border-[#333]">
                  <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80" alt="Success Deal" className="w-full h-full object-cover" />
                </div>
              </motion.div>

              {/* Upper Center Filler Image (Legal/Scales) */}
              <motion.div
                animate={{ y: [0, -18, 0] }} transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 0.2 }}
                className="absolute top-[28%] left-[45%] transform -translate-x-1/2 -translate-y-1/2 z-0"
              >
                <div className="w-36 h-36 rounded-[2rem] overflow-hidden shadow-xl border-4 border-white dark:border-[#333]">
                  <img src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=400&q=80" alt="Legal Compliance" className="w-full h-full object-cover" />
                </div>
              </motion.div>

              {/* Floating Image 1 (Top Right - Office) */}
              <motion.div
                animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
                className="absolute top-[5%] right-[5%] z-10"
              >
                <div className="w-40 h-40 rounded-[2rem] overflow-hidden shadow-xl border-4 border-white dark:border-[#333]">
                  <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80" alt="Corporate Office" className="w-full h-full object-cover" />
                </div>
              </motion.div>

              {/* Floating Image 2 (Bottom Left - Finance) */}
              <motion.div
                animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-[20%] left-[0%] z-20"
              >
                <div className="w-48 h-32 rounded-[2rem] overflow-hidden shadow-xl border-4 border-white dark:border-[#333]">
                  <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=400&q=80" alt="Financial Growth" className="w-full h-full object-cover" />
                </div>
              </motion.div>

              {/* Floating Image 3 (Top Left - Meeting) */}
              <motion.div
                animate={{ y: [0, -18, 0] }} transition={{ repeat: Infinity, duration: 7.5, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-[12%] left-[5%] z-10"
              >
                <div className="w-32 h-40 rounded-[2rem] overflow-hidden shadow-lg border-4 border-white dark:border-[#333]">
                  <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=400&q=80" alt="Consultation" className="w-full h-full object-cover" />
                </div>
              </motion.div>

              {/* Floating Image 4 (Bottom Right - Stamp/Work) */}
              <motion.div
                animate={{ y: [0, -14, 0] }} transition={{ repeat: Infinity, duration: 6.5, ease: "easeInOut", delay: 1.5 }}
                className="absolute bottom-[10%] right-[10%] z-20"
              >
                <div className="w-44 h-44 rounded-[2rem] overflow-hidden shadow-xl border-4 border-white dark:border-[#333]">
                  <img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=80" alt="Team Work" className="w-full h-full object-cover" />
                </div>
              </motion.div>


              {/* Pill 1 */}
              <motion.div
                animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-[35%] left-[-5%] bg-white dark:bg-[#1f1f1f] px-5 py-2.5 rounded-full shadow-lg flex items-center gap-3 z-30 border border-slate-100 dark:border-white/5"
              >
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-sm">⚡</div>
                <span className="font-bold text-slate-800 dark:text-white text-xs">Fast Setup</span>
              </motion.div>

              {/* Pill 2 */}
              <motion.div
                animate={{ y: [0, -14, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1.5 }}
                className="absolute bottom-[28%] right-[-2%] bg-white dark:bg-[#1f1f1f] px-5 py-2.5 rounded-full shadow-lg flex items-center gap-3 z-30 border border-slate-100 dark:border-white/5"
              >
                <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-sm">🛡️</div>
                <span className="font-bold text-slate-800 dark:text-white text-xs">Legal Proof</span>
              </motion.div>

              {/* Pill 3 */}
              <motion.div
                animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 3 }}
                className="absolute top-[5%] left-[30%] bg-white dark:bg-[#1f1f1f] px-5 py-2.5 rounded-full shadow-lg flex items-center gap-3 z-30 border border-slate-100 dark:border-white/5"
              >
                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-sm">👨‍💼</div>
                <span className="font-bold text-slate-800 dark:text-white text-xs">Expert CAs</span>
              </motion.div>

              {/* Pill 4 */}
              <motion.div
                animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 6.2, ease: "easeInOut", delay: 2.2 }}
                className="absolute bottom-[5%] left-[40%] bg-white dark:bg-[#1f1f1f] px-5 py-2.5 rounded-full shadow-lg flex items-center gap-3 z-30 border border-slate-100 dark:border-white/5"
              >
                <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-sm">🌐</div>
                <span className="font-bold text-slate-800 dark:text-white text-xs">100% Online</span>
              </motion.div>

              {/* Decorative Circle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#EDB003]/5 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section (Redesigned - Clean & Premium) */}
      <section className="py-10 border-y border-slate-100 dark:border-white/10 bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-md relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100 dark:divide-white/5">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="mb-2 flex justify-center">
                  <div className="w-12 h-12 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-[#EDB003]/10 transition-colors duration-300">
                    <stat.icon className="w-6 h-6 text-slate-400 dark:text-slate-500 group-hover:text-[#EDB003] transition-colors" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1" style={{ fontFamily: 'Poppins' }}>
                  {stat.number}
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-sm font-medium tracking-wide">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What is Business Setup Section - Floating MindTrip Style */}
      <section className="py-24 bg-slate-50 dark:bg-[#0f172a] transition-colors duration-300 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-5 py-2 bg-[#EDB003]/10 text-[#EDB003] rounded-full text-sm font-bold mb-6 border border-[#EDB003]/20 tracking-wider">
              OUR SERVICES
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-slate-900 dark:text-white tracking-tight" >
              What is <span className="text-[#EDB003]">Business Setup?</span>
            </h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
              FlashSpace Business Setup provides comprehensive end-to-end support for legally establishing your business in India.
              From company registration to compliance management, we handle everything.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {whatIsBusinessSetupCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="group flex flex-col items-center text-center relative"
              >
                {/* Floating Icon Bubble */}
                <div className="relative mb-6">
                  {/* Glow */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 scale-125"></div>

                  {/* Main Container */}
                  <div className="w-24 h-24 bg-white dark:bg-[#1E293B] rounded-[2rem] shadow-[0_15px_30px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.5)] flex items-center justify-center transform group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300 border-2 border-slate-50 dark:border-white/5 relative z-10">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md bg-gradient-to-br ${index === 0 ? "from-[#EDB003] to-[#FFD700]" : // Company Reg (Gold)
                      index === 1 ? "from-emerald-500 to-teal-400" : // GST (Green)
                        index === 2 ? "from-blue-500 to-cyan-400" :   // Licenses (Blue)
                          "from-purple-500 to-indigo-400" // Worldwide (Purple)
                      }`}>
                      <card.icon className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <div className="relative z-10 px-4">
                  <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-[#EDB003] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Connected Process Timeline */}
      <section className="py-24 bg-white dark:bg-[#0a0a0a] transition-colors duration-300 overflow-hidden relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent"></div>
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 mb-6 uppercase tracking-wider">
              <div className="w-2 h-2 rounded-full bg-[#EDB003]"></div> Simple Process
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
              How It <span className="text-[#EDB003]">Works</span>
            </h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-light">
              Launch your business in three simple steps with FlashSpace. We handle the complexity so you don't have to.
            </p>
          </motion.div>

          <div className="relative max-w-6xl mx-auto">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 border-t-2 border-dashed border-slate-200 dark:border-slate-800 md:z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
              {howItWorksSteps.map((step, index) => (
                <motion.div
                  key={index}
                  className="relative flex flex-col items-center text-center group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  {/* Number Bubble - Glossy Effect */}
                  <div className="w-24 h-24 mb-8 relative cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-full shadow-lg group-hover:shadow-[#EDB003]/20 transition-all duration-300 border-4 border-white dark:border-[#0a0a0a] z-10 flex items-center justify-center group-hover:-translate-y-2">
                      <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-slate-800 to-slate-600 dark:from-white dark:to-slate-400 group-hover:from-[#EDB003] group-hover:to-amber-500 transition-all duration-300">
                        {step.number}
                      </span>
                    </div>
                    {/* Floating Small Icon */}
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-[#EDB003] rounded-full flex items-center justify-center shadow-md z-20 group-hover:scale-110 transition-transform duration-300">
                      <step.icon className="w-5 h-5 text-black" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-[#EDB003] transition-colors">{step.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose FlashSpace - Floating MindTrip Style */}
      <section className="py-24 bg-slate-50 dark:bg-[#0f172a] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-5 py-2 bg-[#EDB003]/10 text-[#EDB003] rounded-full text-sm font-bold mb-6 border border-[#EDB003]/20 tracking-wider">
              WHY CHOOSE US
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-slate-900 dark:text-white tracking-tight">
              Why Choose <span className="text-[#EDB003]">FlashSpace?</span>
            </h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
              We combine legal expertise with technology to provide the fastest, most reliable business setup experience in India.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 max-w-7xl mx-auto">
            {whyChooseReasons.map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="bg-white dark:bg-[#1E293B] rounded-[2.5rem] p-8 h-full shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 dark:border-white/5 relative z-10 group-hover:-translate-y-2">
                  {/* Floating Icon */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg bg-gradient-to-br ${index % 2 === 0 ? "from-[#EDB003] to-[#f5c242]" : "from-slate-800 to-slate-600 dark:from-slate-700 dark:to-slate-900"
                    } group-hover:scale-110 transition-transform duration-500`}>
                    <reason.icon className="w-8 h-8" />
                  </div>

                  <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white group-hover:text-[#EDB003] transition-colors">
                    {reason.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-lg">
                    {reason.description}
                  </p>
                </div>

                {/* Decorative Blob */}
                <div className={`absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r ${index % 2 === 0 ? "from-[#EDB003]/20 via-[#f5c242]/20 to-transparent" : "from-slate-400/20 via-slate-500/20 to-transparent"
                  } blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-[#111] dark:to-[#0a0a0a] transition-colors duration-300">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 bg-[#EDB003]/10 text-[#EDB003] rounded-full text-sm font-semibold mb-4">
              Success Stories
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#172A3A] dark:text-white" style={{ fontFamily: 'Poppins' }}>
              What Our <span className="text-[#EDB003]">Clients Say</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto" style={{ fontFamily: 'Geist, sans-serif' }}>
              Hear from entrepreneurs who successfully launched their businesses with FlashSpace
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 h-full bg-white dark:bg-[#1f1f1f]">
                  <CardContent className="p-8">
                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-[#EDB003] text-[#EDB003]" />
                      ))}
                    </div>

                    {/* Content */}
                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed italic" style={{ fontFamily: 'Geist, sans-serif' }}>
                      "{testimonial.content}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-[#172A3A] dark:text-white">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                        <p className="text-xs text-[#EDB003]">{testimonial.company}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Grid Section */}
      <section className="py-20 bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 bg-[#EDB003]/10 text-[#EDB003] rounded-full text-sm font-semibold mb-4">
              Our Locations
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#172A3A] dark:text-white" style={{ fontFamily: 'Poppins' }}>
              <span className="text-[#EDB003]">68+</span> Centers Across <span className="text-[#EDB003]">8</span> Cities
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300" style={{ fontFamily: 'Geist, sans-serif' }}>Register your business from anywhere in India</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {cityLocations.map((location, index) => (
              <motion.div
                key={index}
                className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={location.image}
                    alt={location.city}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-[#172A3A]/95 via-[#172A3A]/60 to-transparent"></div>

                <div className="absolute inset-0 bg-gradient-to-t from-[#EDB003]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform transition-transform duration-500 group-hover:translate-y-0">
                  <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Poppins' }}>{location.city}</h3>
                  <p className="text-white/90 mb-4 text-lg">{location.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                      <Building className="w-5 h-5" />
                      <span className="font-semibold text-lg">{location.centers} Centers</span>
                    </div>

                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform">
                      <ArrowRight className="w-6 h-6 text-[#EDB003]" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-[#111] dark:to-[#0a0a0a] transition-colors duration-300">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 bg-[#EDB003]/10 text-[#EDB003] rounded-full text-sm font-semibold mb-4">
              Have Questions?
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#172A3A] dark:text-white" style={{ fontFamily: 'Poppins' }}>
              Frequently Asked <span className="text-[#EDB003]">Questions</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto" style={{ fontFamily: 'Geist, sans-serif' }}>
              Everything you need to know about business registration and setup
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-white dark:bg-[#1f1f1f] rounded-xl shadow-lg overflow-hidden border-2 border-gray-100 dark:border-white/10 hover:border-[#EDB003] dark:hover:border-[#EDB003] transition-all duration-300">
                  <button
                    className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-black/20 transition-colors"
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  >
                    <h3 className="text-lg font-bold text-[#172A3A] dark:text-white pr-8">
                      {faq.question}
                    </h3>
                    <ChevronDown
                      className={`w-6 h-6 text-[#EDB003] flex-shrink-0 transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180' : ''
                        }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${openFaqIndex === index ? 'max-h-96' : 'max-h-0'
                      }`}
                  >
                    <div className="px-8 py-6 bg-gray-50 dark:bg-black/20 border-t border-gray-200 dark:border-white/10">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed" style={{ fontFamily: 'Geist, sans-serif' }}>{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#172A3A] via-[#172A3A] to-[#2a4a5a] relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#EDB003] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#EDB003] rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Poppins' }}>
              Ready to Launch Your
              <br />
              <span className="text-[#EDB003]">Business Journey?</span>
            </h2>

            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Join 5000+ entrepreneurs who successfully registered their business with FlashSpace.
              Get started in just 7-10 days!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-[#EDB003] hover:bg-[#f5c242] text-[#172A3A] text-lg px-10 py-7 rounded-full font-bold shadow-2xl hover:shadow-[#EDB003]/50 transition-all duration-300 transform hover:scale-105">
                <Sparkles className="w-5 h-5 mr-2" />
                Register Your Business
              </Button>

              <Button className="bg-white text-black border-2 border-gray-300 hover:bg-[#FFD43B] hover:text-black hover:border-[#FFD43B] text-lg px-10 py-7 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-xl">
                <Phone className="w-5 h-5 mr-2" />
                Talk to Expert
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default BusinessSetup;
