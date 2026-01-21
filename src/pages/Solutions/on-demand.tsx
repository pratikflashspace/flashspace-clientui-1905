import { Building, MapPin, Mail, Phone, Calendar, Video, CheckCircle, Star, Users, Award, ChevronDown, Search, ArrowRight, Sparkles, Clock, Presentation, Coffee, Shield, DoorOpen, GraduationCap, PartyPopper, Zap, CreditCard, Globe, Headphones, X, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const OnDemand = () => {
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

  const handleSearch = () => {
    navigate(`/services/on-demand?city=${encodeURIComponent(selectedCity)}`);
  };

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

  const stats = [
    { number: "10k+", label: "Bookings", icon: CheckCircle },
    { number: "500+", label: "Spaces", icon: MapPin },
    { number: "15+", label: "Cities", icon: Globe },
    { number: "4.9/5", label: "Rating", icon: Star }
  ];

  const spaceTypes = [
    {
      title: "Meeting Rooms",
      icon: Users,
      description: "Professional rooms for client meetings and team collaboration",
      gradient: "from-[#EDB003] to-[#f5c242]"
    },
    {
      title: "Day Pass",
      icon: Zap,
      description: "Access premium coworking spaces for a single day",
      gradient: "from-[#172A3A] to-[#2a4a5a]"
    },
    {
      title: "Training Rooms",
      icon: Presentation,
      description: "Equipped spaces for workshops and training sessions",
      gradient: "from-[#EDB003] to-[#f5c242]"
    },
    {
      title: "Event Spaces",
      icon: PartyPopper,
      description: "Venues for corporate events and networking",
      gradient: "from-[#172A3A] to-[#2a4a5a]"
    }
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Search",
      description: "Find the perfect workspace near you based on your needs.",
      icon: Search,
      gradient: "from-[#EDB003] to-[#f5c242]"
    },
    {
      step: "02",
      title: "Book Instantly",
      description: "Choose your time slot and book instantly.",
      icon: Calendar,
      gradient: "from-[#172A3A] to-[#2a4a5a]"
    },
    {
      step: "03",
      title: "Get to Work",
      description: "Show up and start working. We handle the rest.",
      icon: CheckCircle,
      gradient: "from-[#EDB003] to-[#f5c242]"
    }
  ];

  const whyChoose = [
    {
      icon: Clock,
      title: "Pay Per Use",
      description: "No contracts. Pay only for the time you use.",
      gradient: "from-[#EDB003] to-[#f5c242]"
    },
    {
      icon: MapPin,
      title: "Prime Locations",
      description: "Access premium workspaces in top business districts.",
      gradient: "from-[#172A3A] to-[#2a4a5a]"
    },
    {
      icon: Zap,
      title: "Instant Confirmation",
      description: "Real-time availability and immediate booking confirmation.",
      gradient: "from-[#EDB003] to-[#f5c242]"
    }
  ];

  const testimonials = [
    {
      name: "Rahul M.",
      role: "Freelancer",
      content: "FlashSpace is a lifesaver for my client meetings. Easy to book and great locations.",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      rating: 5,
      company: "Freelance Designer"
    },
    {
      name: "Priya S.",
      role: "Startup Founder",
      content: "The day passes are perfect for my team when we need to meet up properly.",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      rating: 5,
      company: "Tech Start"
    },
    {
      name: "Amit K.",
      role: "Consultant",
      content: "Excellent facilities and seamless booking process. Highly recommended.",
      image: "https://randomuser.me/api/portraits/men/3.jpg",
      rating: 5,
      company: "Consulting Co"
    }
  ];

  const faqs = [
    {
      question: "Can I book for just one hour?",
      answer: "Yes, our on-demand meeting rooms can be booked by the hour."
    },
    {
      question: "Is internet included?",
      answer: "Yes, high-speed WiFi is included with all bookings."
    },
    {
      question: "Do I need a membership?",
      answer: "No, on-demand bookings are open to everyone without a subscription."
    }
  ];

  const cityLocations = [
    {
      city: "Delhi",
      centers: 12,
      image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80",
      description: "Capital region hubs"
    },
    {
      city: "Mumbai",
      centers: 8,
      image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80",
      description: "Financial district spaces"
    },
    {
      city: "Bangalore",
      centers: 15,
      image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&q=80",
      description: "Startup ecosystem"
    }
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      <Header />

      {/* Hero Section */}
      <section ref={containerRef} className="relative min-h-[90vh] h-auto overflow-hidden mt-16 flex items-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div
            ref={bgRef}
            className="absolute inset-0 w-full h-full"
            style={{
              transition: 'transform 0.5s ease-out',
              transform: 'scale(1.03)'
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=1920&q=80"
              alt="On-Demand Meeting Spaces"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#172A3A]/95 via-[#172A3A]/80 to-[#EDB003]/20"></div>

          {/* Animated Gradient Orbs */}
          <div className="absolute top-20 left-20 w-96 h-96 bg-[#EDB003]/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#172A3A]/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20 flex items-center justify-center">
          <motion.div
            className="max-w-3xl text-white text-center mx-auto"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-[#EDB003]/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-[#EDB003]/30"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4 text-[#EDB003]" />
              <span className="text-sm font-semibold text-[#EDB003]">Instant Booking Available</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              On-Demand Business Solutions
              <br />
              <span className="text-[#EDB003]">On Your Schedule</span>
            </h1>

            <p className="text-lg md:text-2xl mb-8 text-gray-200 leading-relaxed">
              Book workspaces, meeting rooms, and event spaces instantly. No contracts, no commitments.
            </p>

            {/* City Search Bar */}
            <motion.div
              className="bg-white dark:bg-[#1f1f1f] rounded-2xl p-3 shadow-2xl max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex flex-col md:flex-row items-center gap-3">
                <div className="w-full md:flex-1 relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    className="w-full h-14 pl-12 pr-4 rounded-xl bg-gray-50 dark:bg-zinc-800 border-none outline-none text-black dark:text-white appearance-none cursor-pointer"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                  >
                    {cityData.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>
                <Button onClick={handleSearch} className="w-full md:w-auto h-14 px-8 rounded-xl bg-[#EDB003] hover:bg-[#d69f03] text-black font-bold text-lg">
                  Search
                </Button>
              </div>
              </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 mx-auto bg-[#EDB003]/10 rounded-full flex items-center justify-center mb-4">
                  <stat.icon className="w-6 h-6 text-[#EDB003]" />
                </div>
                <h3 className="text-3xl font-bold text-black dark:text-white mb-2">{stat.number}</h3>
                <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Space Types */}
      <section className="py-20 bg-gray-50 dark:bg-[#111]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 text-black dark:text-white">
            Choose Your <span className="text-[#EDB003]">Space</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {spaceTypes.map((space, index) => (
              <div key={index} className="bg-white dark:bg-[#1f1f1f] p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 border border-gray-100 dark:border-white/5 group">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${space.gradient} flex items-center justify-center mb-6`}>
                  <space.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-black dark:text-white">{space.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{space.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white dark:bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 text-black dark:text-white">
            How It <span className="text-[#EDB003]">Works</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {howItWorks.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="relative mb-8">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.gradient} rotate-3 flex items-center justify-center shadow-lg z-10 relative`}>
                    <span className="text-3xl font-bold text-white">{step.step}</span>
                  </div>
                  <div className="absolute inset-0 bg-black/10 rounded-2xl -rotate-3 blur-sm"></div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-black dark:text-white">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50 dark:bg-[#111]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 text-black dark:text-white">
            Client <span className="text-[#EDB003]">Stories</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <Card key={i} className="bg-white dark:bg-[#1f1f1f] border-none shadow-lg">
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, idx) => (
                      <Star key={idx} className="w-5 h-5 text-[#EDB003] fill-[#EDB003]" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 italic mb-6">"{t.content}"</p>
                  <div className="flex items-center gap-4">
                    <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full" />
                    <div>
                      <h4 className="font-bold text-black dark:text-white">{t.name}</h4>
                      <p className="text-sm text-gray-500">{t.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white dark:bg-[#0a0a0a]">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 text-black dark:text-white">
            Frequently Asked <span className="text-[#EDB003]">Questions</span>
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-gray-50 dark:bg-[#1f1f1f] rounded-xl p-6 hover:shadow-md transition">
                <h3 className="text-lg font-bold mb-2 text-black dark:text-white">{faq.question}</h3>
                <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OnDemand;
