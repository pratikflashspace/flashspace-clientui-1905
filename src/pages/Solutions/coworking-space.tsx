import { Building, MapPin, Mail, Phone, Wifi, Coffee, CheckCircle, Star, Users, Award, ChevronDown, Search, ArrowRight, Sparkles, Calendar, Shield, Zap, TrendingUp, DollarSign, Network, Maximize, Target, Quote } from "lucide-react";
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

const CoworkingSpace = () => {
  const [selectedCity, setSelectedCity] = useState("Delhi");
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const cities = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
    "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Surat",
    "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane"
  ];

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
      icon: CheckCircle,
      gradient: "from-[#172A3A] to-[#2a4a5a]"
    },
    {
      step: "03",
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
      centers: 18,
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
      description: "Silicon Valley coworking hubs"
    },
    {
      city: "Delhi NCR",
      centers: 24,
      image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
      description: "Premium coworking in capital region"
    },
    {
      city: "Mumbai",
      centers: 22,
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80",
      description: "Business district workspace solutions"
    },
    {
      city: "Pune",
      centers: 12,
      image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80",
      description: "Tech corridor collaborative spaces"
    },
    {
      city: "Hyderabad",
      centers: 15,
      image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80",
      description: "Innovation district workspaces"
    },
    {
      city: "Chennai",
      centers: 10,
      image: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800&q=80",
      description: "Southern hub coworking centers"
    }
  ];

  const stats = [
    { number: "3000+", label: "Happy Members", icon: Users },
    { number: "68+", label: "Centers Pan India", icon: Building },
    { number: "8", label: "Major Cities", icon: MapPin },
    { number: "24/7", label: "Access Available", icon: Shield }
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative h-[85vh] overflow-hidden mt-16">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
            alt="Coworking Space"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#172A3A]/95 via-[#172A3A]/80 to-[#EDB003]/20"></div>

          {/* Animated Gradient Orbs */}
          <div className="absolute top-20 left-20 w-96 h-96 bg-[#EDB003]/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#172A3A]/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <motion.div
            className="max-w-3xl text-white"
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
              <span className="text-sm font-semibold text-[#EDB003]">Premium Coworking Solutions</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Poppins' }}>
              Collaborative Workspaces
              <br />
              <span className="text-[#EDB003]">For Modern Teams</span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
              Join a vibrant community of professionals in premium coworking spaces designed for productivity and growth
            </p>

            {/* Hero Search Bar */}
            <motion.div
              className="bg-white rounded-2xl p-2 shadow-2xl max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Popover open={isLocationOpen} onOpenChange={setIsLocationOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        role="combobox"
                        className="w-full justify-between h-16 text-gray-900 hover:bg-gray-50 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-[#EDB003]/10 rounded-lg flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-[#EDB003]" />
                          </div>
                          <div className="text-left">
                            <div className="text-xs text-gray-500 font-medium">Location</div>
                            <div className="text-base font-semibold">{selectedCity || "Select City"}</div>
                          </div>
                        </div>
                        <ChevronDown className="ml-2 h-5 w-5 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0 bg-white shadow-xl border-2 border-gray-100">
                      <Command className="bg-white">
                        <CommandInput placeholder="Search city..." className="bg-white" />
                        <CommandList className="bg-white">
                          <CommandEmpty>No city found.</CommandEmpty>
                          <CommandGroup>
                            {cities.map((city) => (
                              <CommandItem
                                key={city}
                                value={city}
                                onSelect={() => {
                                  setSelectedCity(city);
                                  setIsLocationOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedCity === city ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {city}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <Button className="bg-gradient-to-r from-[#EDB003] to-[#f5c242] hover:from-[#d69f03] hover:to-[#EDB003] text-white h-16 px-10 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <Search className="w-5 h-5 mr-2" />
                  Find Spaces
                </Button>
              </div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="flex items-center gap-8 mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-[#EDB003] to-[#f5c242] border-2 border-white"></div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="font-bold">3000+ Members</div>
                  <div className="text-gray-300 text-xs">Trust FlashSpace</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-[#EDB003] text-[#EDB003]" />
                  ))}
                </div>
                <div className="text-sm">
                  <div className="font-bold">4.9/5 Rating</div>
                  <div className="text-gray-300 text-xs">From 800+ Reviews</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white rounded-full"></div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gradient-to-r from-[#EDB003] to-[#f5c242] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <stat.icon className="w-8 h-8 text-white mx-auto mb-3" />
                <div className="text-4xl md:text-5xl font-bold text-white mb-2" style={{ fontFamily: 'Poppins' }}>
                  {stat.number}
                </div>
                <div className="text-white/90 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 bg-[#EDB003]/10 text-[#EDB003] rounded-full text-sm font-semibold mb-4">
              Why Choose Us
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#172A3A]" style={{ fontFamily: 'Poppins' }}>
              Premium Coworking Benefits
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need for a productive and collaborative work experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 h-full bg-white overflow-hidden">
                  <CardContent className="p-8 relative">
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold mb-3 text-[#172A3A] group-hover:text-[#EDB003] transition-colors duration-300">
                      {feature.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What is Coworking Space Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 bg-[#EDB003]/10 text-[#EDB003] rounded-full text-sm font-semibold mb-4">
              Understanding Coworking
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#172A3A]" style={{ fontFamily: 'Poppins' }}>
              What is Coworking Space?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Coworking spaces are shared work environments where individuals and teams from different companies work side-by-side.
              It's a modern alternative to traditional offices, offering flexibility, community, and cost savings.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {coworkingTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 h-full bg-white overflow-hidden">
                  <CardContent className="p-8 relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${type.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                    <div className={`w-16 h-16 bg-gradient-to-br ${type.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <type.icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold mb-3 text-[#172A3A] group-hover:text-[#EDB003] transition-colors duration-300">
                      {type.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed">
                      {type.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 bg-[#EDB003]/10 text-[#EDB003] rounded-full text-sm font-semibold mb-4">
              Simple Process
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#172A3A]" style={{ fontFamily: 'Poppins' }}>
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started with FlashSpace coworking in three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 h-full bg-white overflow-hidden">
                  <CardContent className="p-8 relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                    <div className="absolute -top-6 -right-6 text-8xl font-bold text-[#EDB003]/10" style={{ fontFamily: 'Poppins' }}>
                      {step.step}
                    </div>

                    <div className={`w-16 h-16 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold mb-3 text-[#172A3A] group-hover:text-[#EDB003] transition-colors duration-300 relative z-10">
                      {step.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed relative z-10">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Connector Arrow */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                    <ArrowRight className="w-8 h-8 text-[#EDB003]" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose FlashSpace Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 bg-[#EDB003]/10 text-[#EDB003] rounded-full text-sm font-semibold mb-4">
              Our Advantages
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#172A3A]" style={{ fontFamily: 'Poppins' }}>
              Why Choose <span className="text-[#EDB003]">FlashSpace</span> Coworking
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the difference with India's fastest-growing coworking community
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {whyChoose.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 h-full bg-white overflow-hidden">
                  <CardContent className="p-8 relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                    <div className={`w-16 h-16 bg-gradient-to-br ${benefit.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <benefit.icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold mb-3 text-[#172A3A] group-hover:text-[#EDB003] transition-colors duration-300">
                      {benefit.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Plans Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#172A3A]" style={{ fontFamily: 'Poppins' }}>
              Membership Plans
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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

                <Card className={`border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 h-full bg-white overflow-hidden ${plan.popular ? 'ring-2 ring-[#EDB003]' : ''}`}>
                  <CardContent className="p-8 relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                    <h3 className="text-3xl font-bold mb-2 text-[#172A3A]" style={{ fontFamily: 'Poppins' }}>
                      {plan.name}
                    </h3>

                    <p className="text-gray-600 mb-6">{plan.description}</p>

                    <div className="mb-8">
                      <span className="text-5xl font-bold text-[#172A3A]" style={{ fontFamily: 'Poppins' }}>
                        ₹{plan.price}
                      </span>
                      <span className="text-gray-600 ml-2">/{plan.period}</span>
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
      <section className="py-20 bg-white">
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#172A3A]" style={{ fontFamily: 'Poppins' }}>
              What Our Members Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 h-full bg-white overflow-hidden">
                  <CardContent className="p-8 relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                    <Quote className="w-12 h-12 text-[#EDB003]/20 mb-4" />

                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-[#EDB003] text-[#EDB003]" />
                      ))}
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-6 italic">
                      "{testimonial.text}"
                    </p>

                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#172A3A]">{testimonial.name}</h4>
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
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#172A3A]" style={{ fontFamily: 'Poppins' }}>
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#EDB003] to-[#f5c242] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">Q</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-3 text-[#172A3A]">
                          {faq.question}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
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
      <section className="py-20 bg-white">
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#172A3A]" style={{ fontFamily: 'Poppins' }}>
              <span className="text-[#EDB003]">68+</span> Centers Across <span className="text-[#EDB003]">8</span> Cities
            </h2>
            <p className="text-xl text-gray-600">Find your perfect coworking space location</p>
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

              <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-[#172A3A] text-lg px-10 py-7 rounded-full font-bold transition-all duration-300">
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
