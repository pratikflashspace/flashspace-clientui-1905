import { Building, MapPin, Mail, Phone, Wifi, Coffee, CheckCircle, Star, Users, Award, ChevronDown, Search, ArrowRight, Sparkles, Calendar, Shield, Zap, TrendingUp, DollarSign, Network, Maximize, Target, Quote, X, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CoworkingSpace = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState("Delhi");
  const [isLocationOpen, setIsLocationOpen] = useState(false);

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

  // City data with famous landmark images
  const cityData = [
    { name: "Ahmedabad", image: "https://images.unsplash.com/photo-1569596082827-c5c81c9e3898?w=400&q=80", landmark: "Sabarmati Ashram" },
    { name: "Bangalore", image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&q=80", landmark: "Tech Hub" },
    { name: "Chennai", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&q=80", landmark: "Marina Beach" },
    { name: "Delhi", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&q=80", landmark: "India Gate" },
    { name: "Dharamshala", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&q=80", landmark: "Himalayas" },
    { name: "Gurgaon", image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&q=80", landmark: "Cyber City" },
    { name: "Hyderabad", image: "https://images.unsplash.com/photo-1572638001012-c342e59c4d56?w=400&q=80", landmark: "Charminar" },
    { name: "Jaipur", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&q=80", landmark: "Hawa Mahal" },
    { name: "Jammu", image: "https://images.unsplash.com/photo-1623070573483-65a6c3e79c98?w=400&q=80", landmark: "Vaishno Devi" },
  ];

  // Handle search navigation
  const handleSearch = () => {
    navigate(`/services/coworking-space?city=${encodeURIComponent(selectedCity)}&service=coworking-space`);
  };

  const features = [
    {
      icon: Wifi,
      title: "High-Speed Internet",
      description: "Lightning-fast fiber optic connectivity with backup internet for uninterrupted work",
      gradient: "from-[#EDB003] to-[#f5c242]"
    },
    {
      icon: Coffee,
      title: "Premium Amenities",
      description: "Complimentary tea, coffee, refreshments, and modern pantry facilities",
      gradient: "from-[#172A3A] to-[#2a4a5a]"
    },
    {
      icon: Calendar,
      title: "Flexible Plans",
      description: "Daily, weekly, or monthly passes - choose what works best for you",
      gradient: "from-[#EDB003] to-[#f5c242]"
    },
    {
      icon: Users,
      title: "Community Events",
      description: "Regular networking events, workshops, and community meetups",
      gradient: "from-[#172A3A] to-[#2a4a5a]"
    },
    {
      icon: Shield,
      title: "24/7 Access",
      description: "Round-the-clock access with secure biometric entry and CCTV surveillance",
      gradient: "from-[#EDB003] to-[#f5c242]"
    },
    {
      icon: Award,
      title: "Professional Environment",
      description: "Ergonomic furniture, natural lighting, and collaborative work zones",
      gradient: "from-[#172A3A] to-[#2a4a5a]"
    }
  ];

  const coworkingTypes = [
    {
      icon: Users,
      title: "Hot Desks",
      description: "Flexible first-come, first-served seating in open coworking areas. Perfect for freelancers and remote workers.",
      gradient: "from-[#EDB003] to-[#f5c242]"
    },
    {
      icon: Building,
      title: "Dedicated Desks",
      description: "Your own personal desk in a shared workspace. Same spot every day with storage space.",
      gradient: "from-[#172A3A] to-[#2a4a5a]"
    },
    {
      icon: Shield,
      title: "Private Cabins",
      description: "Fully furnished private offices for teams. Secure, customizable, and professional spaces.",
      gradient: "from-[#EDB003] to-[#f5c242]"
    },
    {
      icon: Award,
      title: "Meeting Rooms",
      description: "On-demand conference rooms equipped with projectors, whiteboards, and video conferencing.",
      gradient: "from-[#172A3A] to-[#2a4a5a]"
    }
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Visit & Tour",
      description: "Schedule a free tour of our coworking spaces. Explore the facilities, meet the community, and find the perfect spot.",
      icon: MapPin,
      gradient: "from-[#EDB003] to-[#f5c242]"
    },
    {
      step: "02",
      title: "Choose Your Plan",
      description: "Select from hot desk, dedicated desk, or private cabin options. Pick daily, weekly, or monthly plans that suit your needs.",
      icon: Target,
      gradient: "from-[#172A3A] to-[#2a4a5a]"
    },
    {
      step: "03",
      title: "Payment",
      description: "Complete secure online payment with flexible payment options. Get instant confirmation and receipt for your booking.",
      icon: DollarSign,
      gradient: "from-[#EDB003] to-[#f5c242]"
    },
    {
      step: "04",
      title: "Complete Documentation",
      description: "Submit your KYC documents and complete the onboarding process. Our team will verify and activate your membership.",
      icon: CheckCircle,
      gradient: "from-[#172A3A] to-[#2a4a5a]"
    },
    {
      step: "05",
      title: "Start Working",
      description: "Get your access card and start working immediately. Enjoy all amenities, networking events, and community benefits.",
      icon: Zap,
      gradient: "from-[#EDB003] to-[#f5c242]"
    }
  ];

  const whyChoose = [
    {
      icon: MapPin,
      title: "Prime Locations",
      description: "Strategic locations in business districts with excellent connectivity and nearby amenities",
      gradient: "from-[#EDB003] to-[#f5c242]"
    },
    {
      icon: DollarSign,
      title: "Cost Effective",
      description: "Save up to 70% compared to traditional office rentals. No security deposits or long-term commitments",
      gradient: "from-[#172A3A] to-[#2a4a5a]"
    },
    {
      icon: Network,
      title: "Networking Opportunities",
      description: "Connect with entrepreneurs, startups, and professionals from diverse industries",
      gradient: "from-[#EDB003] to-[#f5c242]"
    },
    {
      icon: Maximize,
      title: "Scalable Solutions",
      description: "Easily scale up or down as your team grows. Add or remove seats without hassle",
      gradient: "from-[#172A3A] to-[#2a4a5a]"
    },
    {
      icon: Target,
      title: "Productivity Boost",
      description: "Designed workspaces that enhance focus, creativity, and collaboration",
      gradient: "from-[#EDB003] to-[#f5c242]"
    },
    {
      icon: Star,
      title: "All-Inclusive",
      description: "Internet, electricity, housekeeping, pantry, and admin support - all included",
      gradient: "from-[#172A3A] to-[#2a4a5a]"
    }
  ];

  const membershipPlans = [
    {
      name: "Hot Desk",
      price: "6,999",
      period: "per month",
      description: "Perfect for freelancers and remote workers",
      features: [
        "Access to any hot desk",
        "High-speed internet",
        "Tea, coffee & refreshments",
        "Community events access",
        "Locker facility",
        "Business hours access (9 AM - 7 PM)"
      ],
      gradient: "from-[#EDB003] to-[#f5c242]",
      popular: false
    },
    {
      name: "Dedicated Desk",
      price: "11,999",
      period: "per month",
      description: "Best for regular professionals",
      features: [
        "Your own dedicated desk",
        "Storage drawer & locker",
        "High-speed internet",
        "All-day refreshments",
        "Priority booking for meeting rooms",
        "24/7 access available",
        "Mail handling services"
      ],
      gradient: "from-[#172A3A] to-[#2a4a5a]",
      popular: true
    },
    {
      name: "Private Cabin",
      price: "24,999",
      period: "per month",
      description: "Ideal for teams and small businesses",
      features: [
        "Private lockable cabin (2-6 seats)",
        "Fully furnished workspace",
        "Customizable interiors",
        "Dedicated receptionist support",
        "Unlimited meeting room hours",
        "24/7 access",
        "Virtual office services included",
        "Priority support"
      ],
      gradient: "from-[#EDB003] to-[#f5c242]",
      popular: false
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Freelance Designer",
      company: "Mumbai",
      avatar: "PS",
      rating: 5,
      text: "FlashSpace coworking has transformed my work life! The creative environment and networking opportunities have helped me grow my freelance business significantly. The amenities are top-notch and the community is incredibly supportive.",
      gradient: "from-[#EDB003] to-[#f5c242]"
    },
    {
      name: "Rahul Mehta",
      role: "Startup Founder",
      company: "Bangalore",
      avatar: "RM",
      rating: 5,
      text: "We started with a hot desk and now have our own private cabin. The scalability is amazing! The location is prime, costs are reasonable, and the professional environment helped us close several important deals. Highly recommend!",
      gradient: "from-[#172A3A] to-[#2a4a5a]"
    },
    {
      name: "Sneha Patel",
      role: "Content Creator",
      company: "Delhi",
      avatar: "SP",
      rating: 5,
      text: "Best decision I made for my business! The flexibility of the hot desk plan allows me to work on my schedule. I've met amazing collaborators here, and the energy is always positive. The 24/7 access is a game-changer.",
      gradient: "from-[#EDB003] to-[#f5c242]"
    }
  ];

  const faqs = [
    {
      question: "What is a coworking space?",
      answer: "A coworking space is a shared workspace where professionals, freelancers, startups, and remote workers can work in a collaborative environment. It offers flexible desk options, meeting rooms, high-speed internet, and various amenities without the commitment of a traditional office lease."
    },
    {
      question: "What's the difference between hot desk and dedicated desk?",
      answer: "A hot desk is a flexible, first-come-first-served seating arrangement in the open area - you can use any available desk. A dedicated desk is your own personal workspace in the shared area that's reserved for you every day, including storage space for your belongings."
    },
    {
      question: "Can I try before committing to a membership?",
      answer: "Absolutely! We offer free tours of all our locations. You can also purchase a day pass to experience the space before committing to a monthly membership. This helps you understand if our coworking environment suits your needs."
    },
    {
      question: "Are meeting rooms included in the membership?",
      answer: "Meeting room access varies by plan. Hot desk members get discounted hourly rates, dedicated desk members receive priority booking with some free hours, and private cabin members get unlimited access to meeting rooms."
    },
    {
      question: "Is there 24/7 access available?",
      answer: "Yes! Dedicated desk and private cabin members have 24/7 access to the space with secure biometric entry. Hot desk members have access during business hours (9 AM - 7 PM), with optional 24/7 upgrade available."
    },
    {
      question: "What amenities are included?",
      answer: "All memberships include high-speed internet, electricity, tea/coffee, printing services, housekeeping, air conditioning, locker facility, and access to community events. Private cabin members also get virtual office services and receptionist support."
    },
    {
      question: "Can I scale my membership as my team grows?",
      answer: "Yes! Our plans are highly scalable. You can start with a hot desk, upgrade to a dedicated desk, and eventually move to a private cabin as your team expands. We make the transition smooth and hassle-free."
    },
    {
      question: "What is your cancellation policy?",
      answer: "We require a 30-day notice for cancellation. Monthly memberships are flexible with no long-term commitment. For private cabins, we typically have a 3-month minimum commitment period. No hidden fees or penalties apply."
    }
  ];

  const cityLocations = [
    {
      city: "Bangalore",
      centers: 5,
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
      description: "Silicon Valley coworking hubs"
    },
    {
      city: "Delhi NCR",
      centers: 15,
      image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
      description: "Premium coworking in capital region"
    },
    {
      city: "Mumbai",
      centers: 4,
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80",
      description: "Business district workspace solutions"
    },
    {
      city: "Kolkata",
      centers: 8,
      image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80",
      description: "Cultural capital workspace hubs"
    },
    {
      city: "Hyderabad",
      centers: 4,
      image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80",
      description: "Innovation district workspaces"
    },
    {
      city: "Chennai",
      centers: 2,
      image: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800&q=80",
      description: "Southern hub coworking centers"
    }
  ];

  const stats = [
    { number: "500+", label: "Clients", icon: Users },
    { number: "68+", label: "Centers Pan India", icon: Building },
    { number: "50+", label: "Cities", icon: MapPin },
    { number: "24/7", label: "Access Available", icon: Shield }
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      {/* Header */}
      <Header />

      {/* Hero Section */}
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
                <span className="text-sm font-bold tracking-wide text-slate-800 dark:text-white">Premium Coworking Spaces</span>
              </motion.div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] text-slate-900 dark:text-white tracking-tight">
                Collaborative <br />
                workspaces <span className="text-[#EDB003]">for teams.</span>
              </h1>

              <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-lg leading-relaxed">
                Join a vibrant community of professionals in premium spaces designed for productivity, networking, and growth.
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
                    <Button onClick={handleSearch} className="bg-[#EDB003] hover:bg-[#d69f03] text-black font-bold h-12 px-6 rounded-xl">
                      Find Desk
                    </Button>
                  </div>
                </div>

                {/* Horizontal City Selector Overlay (Anchored to Parent) */}
                <AnimatePresence>
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
                            <X className="w-5 h-5 text-slate-400" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                          {cityData.map(c => (
                            <button
                              key={c.name}
                              onClick={() => { setSelectedCity(c.name); setIsLocationOpen(false); }}
                              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${selectedCity === c.name
                                ? 'bg-[#EDB003] text-black border-[#EDB003] shadow-md shadow-[#EDB003]/20'
                                : 'bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 border-transparent hover:bg-slate-100 dark:hover:bg-white/10 hover:scale-[1.02]'
                                }`}
                            >
                              {c.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-6 mt-10 text-sm font-medium text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#EDB003]" /> <span>High-Speed Wifi</span></div>
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#EDB003]" /> <span>Community Events</span></div>
              </div>
            </motion.div>

            {/* RIGHT COLUMN: Floating Cluster */}
            <div className="relative h-[600px] w-full hidden lg:block perspective-1000">
              {/* Center Image (Main - Vibrant Open Space) */}
              <motion.div
                animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
              >
                <div className="w-64 h-80 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-[#333]">
                  <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80" alt="Vibrant Coworking Space" className="w-full h-full object-cover" />
                </div>
              </motion.div>

              {/* Center Gap Image (Collaboration) */}
              <motion.div
                animate={{ y: [0, -25, 0] }} transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 0.8 }}
                className="absolute top-[50%] left-[22%] transform -translate-x-1/2 -translate-y-1/2 z-10"
              >
                <div className="w-40 h-40 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white dark:border-[#333]">
                  <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80" alt="Team Collaboration" className="w-full h-full object-cover" />
                </div>
              </motion.div>

              {/* Upper Center Filler Image (Coffee/Casual) */}
              <motion.div
                animate={{ y: [0, -18, 0] }} transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 0.2 }}
                className="absolute top-[28%] left-[45%] transform -translate-x-1/2 -translate-y-1/2 z-0"
              >
                <div className="w-36 h-36 rounded-[2rem] overflow-hidden shadow-xl border-4 border-white dark:border-[#333]">
                  <img src="https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=400&q=80" alt="Office Coffee" className="w-full h-full object-cover" />
                </div>
              </motion.div>

              {/* Floating Image 1 (Top Right - Meeting) */}
              <motion.div
                animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
                className="absolute top-[5%] right-[5%] z-10"
              >
                <div className="w-40 h-40 rounded-[2rem] overflow-hidden shadow-xl border-4 border-white dark:border-[#333]">
                  <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=400&q=80" alt="Meeting Room" className="w-full h-full object-cover" />
                </div>
              </motion.div>

              {/* Floating Image 2 (Bottom Left - Focus) */}
              <motion.div
                animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-[20%] left-[0%] z-20"
              >
                <div className="w-48 h-32 rounded-[2rem] overflow-hidden shadow-xl border-4 border-white dark:border-[#333]">
                  <img src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=400&q=80" alt="Focused Work" className="w-full h-full object-cover" />
                </div>
              </motion.div>

              {/* Floating Image 3 (Top Left - Interior) */}
              <motion.div
                animate={{ y: [0, -18, 0] }} transition={{ repeat: Infinity, duration: 7.5, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-[12%] left-[5%] z-10"
              >
                <div className="w-32 h-40 rounded-[2rem] overflow-hidden shadow-lg border-4 border-white dark:border-[#333]">
                  <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80" alt="Modern Interior" className="w-full h-full object-cover" />
                </div>
              </motion.div>

              {/* Floating Image 4 (Bottom Right - Lounge) */}
              <motion.div
                animate={{ y: [0, -14, 0] }} transition={{ repeat: Infinity, duration: 6.5, ease: "easeInOut", delay: 1.5 }}
                className="absolute bottom-[10%] right-[10%] z-20"
              >
                <div className="w-44 h-44 rounded-[2rem] overflow-hidden shadow-xl border-4 border-white dark:border-[#333]">
                  <img src="https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&w=400&q=80" alt="Office Lounge" className="w-full h-full object-cover" />
                </div>
              </motion.div>


              {/* Pill 1: Wifi */}
              <motion.div
                animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-[35%] left-[-5%] bg-white dark:bg-[#1f1f1f] px-5 py-2.5 rounded-full shadow-lg flex items-center gap-3 z-30 border border-slate-100 dark:border-white/5"
              >
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-sm">📶</div>
                <span className="font-bold text-slate-800 dark:text-white text-xs">Fast Wifi</span>
              </motion.div>

              {/* Pill 2: Location */}
              <motion.div
                animate={{ y: [0, -14, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1.5 }}
                className="absolute bottom-[28%] right-[-2%] bg-white dark:bg-[#1f1f1f] px-5 py-2.5 rounded-full shadow-lg flex items-center gap-3 z-30 border border-slate-100 dark:border-white/5"
              >
                <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-sm">📍</div>
                <span className="font-bold text-slate-800 dark:text-white text-xs">Prime Spots</span>
              </motion.div>

              {/* Pill 3: Support */}
              <motion.div
                animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 3 }}
                className="absolute top-[5%] left-[30%] bg-white dark:bg-[#1f1f1f] px-5 py-2.5 rounded-full shadow-lg flex items-center gap-3 z-30 border border-slate-100 dark:border-white/5"
              >
                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-sm">☕</div>
                <span className="font-bold text-slate-800 dark:text-white text-xs">Premium Coffee</span>
              </motion.div>

              {/* Pill 4: Community */}
              <motion.div
                animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 6.2, ease: "easeInOut", delay: 2.2 }}
                className="absolute bottom-[5%] left-[40%] bg-white dark:bg-[#1f1f1f] px-5 py-2.5 rounded-full shadow-lg flex items-center gap-3 z-30 border border-slate-100 dark:border-white/5"
              >
                <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-sm">🤝</div>
                <span className="font-bold text-slate-800 dark:text-white text-xs">Community</span>
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

      {/* Premium Coworking Benefits Section - Floating MindTrip Style */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50 dark:from-[#0a0a0a] dark:to-[#111] transition-colors duration-300 relative overflow-hidden">
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
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-slate-900 dark:text-white tracking-tight" >
              Premium <span className="text-[#EDB003]">Coworking Benefits</span>
            </h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
              Everything you need for a productive and collaborative work experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 max-w-7xl mx-auto">
            {features.map((feature, index) => (
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
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md bg-gradient-to-br ${index === 0 ? "from-[#EDB003] to-[#FFD700]" : // Wifi (Gold)
                      index === 1 ? "from-emerald-500 to-teal-400" : // Coffee (Green)
                        index === 2 ? "from-blue-500 to-cyan-400" :   // Flexible (Blue)
                          index === 3 ? "from-purple-500 to-indigo-400" : // Community (Purple)
                            index === 4 ? "from-rose-500 to-orange-400" :   // 24/7 (Rose)
                              "from-indigo-500 to-sky-500" // Professional (Indigo)
                      }`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <div className="relative z-10 px-4">
                  <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-[#EDB003] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What is Coworking Space Section - Floating MindTrip Style */}
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
              UNDERSTANDING COWORKING
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-slate-900 dark:text-white tracking-tight" >
              What is <span className="text-[#EDB003] relative inline-block">Coworking Space?
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#EDB003] opacity-40" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.00025 6.99997C25.8077 4.00844 57.0722 2.05308 97.4608 2.00085C138.694 1.94753 171.758 4.79326 198.001 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
              </span>
            </h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
              Coworking spaces are shared work environments where individuals and teams from different companies work side-by-side.
              It's a modern alternative to traditional offices, offering flexibility, community, and cost savings.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {coworkingTypes.map((type, index) => (
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
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md bg-gradient-to-br ${index === 0 ? "from-[#EDB003] to-[#FFD700]" : // Hot Desks (Gold)
                      index === 1 ? "from-blue-500 to-cyan-400" :   // Dedicated Desks (Blue)
                        index === 2 ? "from-purple-500 to-indigo-400" : // Private Cabins (Purple)
                          "from-rose-500 to-orange-400" // Meeting Rooms (Rose)
                      }`}>
                      <type.icon className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <div className="relative z-10 px-4">
                  <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-[#EDB003] transition-colors">
                    {type.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {type.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section - Connected Process Timeline */}
      <section className="py-24 bg-white dark:bg-[#0a0a0a] transition-colors duration-300 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-5 py-2 bg-[#EDB003]/10 text-[#EDB003] rounded-full text-sm font-bold mb-6 border border-[#EDB003]/20 tracking-wider">
              SIMPLE PROCESS
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-slate-900 dark:text-white tracking-tight" >
              How It <span className="text-[#EDB003]">Works</span>
            </h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
              Get started with FlashSpace coworking in five simple steps
            </p>
          </motion.div>

          <div className="relative max-w-7xl mx-auto">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-[45px] left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#EDB003]/50 to-transparent border-t-2 border-dashed border-[#EDB003]/30 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-y-16 gap-x-4 relative z-10">
              {howItWorks.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="group flex flex-col items-center text-center"
                >
                  {/* Step Number & Icon Bubble */}
                  <div className="relative mb-8">
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-[#EDB003] rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>

                    {/* Number Bubble */}
                    <div className="w-24 h-24 bg-white dark:bg-[#1f1f1f] rounded-full border-4 border-slate-50 dark:border-[#2a2a2a] shadow-xl flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-300">
                      <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${step.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>

                      <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-[#EDB003] to-[#FFD700] rounded-full flex items-center justify-center text-black font-bold text-sm shadow-md border-2 border-white dark:border-[#0a0a0a]">
                        {step.step}
                      </div>

                      <step.icon className="w-8 h-8 text-slate-700 dark:text-white group-hover:text-[#EDB003] transition-colors duration-300" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-2">
                    <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-[#EDB003] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose FlashSpace Section - Floating MindTrip Style */}
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
              OUR ADVANTAGES
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-slate-900 dark:text-white tracking-tight" >
              Why Choose <span className="text-[#EDB003] relative inline-block">FlashSpace?
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#EDB003] opacity-40" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.00025 6.99997C25.8077 4.00844 57.0722 2.05308 97.4608 2.00085C138.694 1.94753 171.758 4.79326 198.001 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
              </span>
            </h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
              Experience the difference with India's fastest-growing coworking community
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 max-w-7xl mx-auto">
            {whyChoose.map((benefit, index) => (
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
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md bg-gradient-to-br ${index === 0 ? "from-[#EDB003] to-[#FFD700]" : // Prime Locations (Gold)
                      index === 1 ? "from-emerald-500 to-teal-400" : // Cost Effective (Green)
                        index === 2 ? "from-blue-500 to-cyan-400" :   // Networking (Blue)
                          index === 3 ? "from-purple-500 to-indigo-400" : // Scalable (Purple)
                            index === 4 ? "from-rose-500 to-orange-400" :   // Productivity (Rose)
                              "from-indigo-500 to-sky-500" // All Inclusive (Indigo/Sky)
                      }`}>
                      <benefit.icon className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <div className="relative z-10 px-4">
                  <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-[#EDB003] transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Plans Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-[#111] dark:to-[#0a0a0a] transition-colors duration-300">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 bg-[#EDB003]/10 text-[#EDB003] rounded-full text-sm font-semibold mb-4">
              Flexible Pricing
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#172A3A] dark:text-white" style={{ fontFamily: 'Poppins' }}>
              Membership Plans
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose the plan that fits your work style and budget
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {membershipPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-[#EDB003] to-[#f5c242] text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <Card className={`border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 h-full bg-white dark:bg-[#1f1f1f] overflow-hidden ${plan.popular ? 'ring-2 ring-[#EDB003]' : ''}`}>
                  <CardContent className="p-8 relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                    <h3 className="text-3xl font-bold mb-2 text-[#172A3A] dark:text-white" style={{ fontFamily: 'Poppins' }}>
                      {plan.name}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 mb-6">{plan.description}</p>

                    <div className="mb-8">
                      <span className="text-5xl font-bold text-[#172A3A] dark:text-white" style={{ fontFamily: 'Poppins' }}>
                        ₹{plan.price}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 ml-2">/{plan.period}</span>
                    </div>

                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-[#EDB003] flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button className={`w-full py-6 text-lg font-semibold ${plan.popular ? 'bg-gradient-to-r from-[#EDB003] to-[#f5c242] hover:from-[#d69f03] hover:to-[#EDB003] text-white' : 'bg-[#172A3A] hover:bg-[#2a4a5a] text-white'} shadow-lg hover:shadow-xl transition-all duration-300`}>
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-600 mb-4">Need a custom plan for your team?</p>
            <Button variant="outline" className="border-2 border-[#EDB003] text-[#EDB003] hover:bg-[#EDB003] hover:text-white font-semibold px-8 py-6">
              Contact Sales for Enterprise Plans
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
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
              What Our Members Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join thousands of satisfied professionals who've transformed their work life with FlashSpace
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 h-full bg-white dark:bg-[#1f1f1f] overflow-hidden">
                  <CardContent className="p-8 relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                    <Quote className="w-12 h-12 text-[#EDB003]/20 mb-4" />

                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-[#EDB003] text-[#EDB003]" />
                      ))}
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 italic">
                      "{testimonial.text}"
                    </p>

                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#172A3A] dark:text-white">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                        <p className="text-xs text-gray-500">{testimonial.company}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
              Got Questions?
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#172A3A] dark:text-white" style={{ fontFamily: 'Poppins' }}>
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to know about coworking at FlashSpace
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-[#1f1f1f]">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#EDB003] to-[#f5c242] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">Q</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-3 text-[#172A3A] dark:text-white">
                          {faq.question}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <Button className="bg-gradient-to-r from-[#EDB003] to-[#f5c242] hover:from-[#d69f03] hover:to-[#EDB003] text-white font-semibold px-8 py-6">
              <Phone className="w-5 h-5 mr-2" />
              Talk to Our Team
            </Button>
          </motion.div>
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
              Across <span className="text-[#EDB003]">28+</span> States
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Find your perfect coworking space location</p>
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
              Ready to Join Our
              <br />
              <span className="text-[#EDB003]">Vibrant Community?</span>
            </h2>

            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Join 3000+ professionals who choose FlashSpace for their coworking needs.
              Book your free tour today!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-[#EDB003] hover:bg-[#f5c242] text-[#172A3A] text-lg px-10 py-7 rounded-full font-bold shadow-2xl hover:shadow-[#EDB003]/50 transition-all duration-300 transform hover:scale-105">
                <Sparkles className="w-5 h-5 mr-2" />
                Book Free Tour
              </Button>

              <Button className="bg-white hover:bg-[#EDB003] text-black hover:text-white text-lg px-10 py-7 rounded-full font-bold transition-all duration-300">
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

export default CoworkingSpace;
