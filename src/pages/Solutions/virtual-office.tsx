import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Building, MapPin, Mail, Phone, FileText, CheckCircle, Star, Users, Award, ChevronDown, Search, ArrowRight, Sparkles, TrendingUp, Shield, Clock, Zap, Target, Package, HeadphonesIcon, Briefcase, Home, Check, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const VirtualOffice = () => {
  const [selectedCity, setSelectedCity] = useState("Delhi");
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const cities = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
    "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Surat",
    "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane"
  ];

  const features = [
    {
      icon: Building,
      title: "Prime Business Address",
      description: "Get a prestigious business address in prime locations across major cities in India",
      gradient: "from-[#EDB003] to-[#f5c242]"
    },
    {
      icon: Star,
      title: "Flexible Terms",
      description: "No long-term commitments. Choose plans that fit your business needs with month-to-month flexibility",
      gradient: "from-[#172A3A] to-[#2a4a5a]"
    },
    {
      icon: Users,
      title: "Scalable Solutions",
      description: "Perfect for solopreneurs to enterprises. Scale up or down as your business grows",
      gradient: "from-[#EDB003] to-[#f5c242]"
    },
    {
      icon: Mail,
      title: "Mail & Call Handling",
      description: "Professional mail forwarding and dedicated call management services included",
      gradient: "from-[#172A3A] to-[#2a4a5a]"
    },
    {
      icon: FileText,
      title: "GST Registration",
      description: "Complete support for GST registration and business compliance requirements",
      gradient: "from-[#EDB003] to-[#f5c242]"
    },
    {
      icon: Award,
      title: "Premium Amenities",
      description: "Access to meeting rooms and business facilities whenever you need them",
      gradient: "from-[#172A3A] to-[#2a4a5a]"
    }
  ];

  const whatIsVirtualOffice = [
    {
      icon: Building,
      title: "Professional Address",
      description: "Get a prestigious business address in prime commercial locations without renting physical space"
    },
    {
      icon: Mail,
      title: "Mail Handling",
      description: "Professional mail receiving, scanning, and forwarding services at your convenience"
    },
    {
      icon: FileText,
      title: "GST Support",
      description: "Complete assistance with GST registration and business compliance documentation"
    },
    {
      icon: Briefcase,
      title: "Meeting Room Access",
      description: "Book meeting rooms and conference facilities whenever you need professional space"
    }
  ];

  const howItWorksSteps = [
    {
      number: "1",
      title: "Choose Your Plan",
      description: "Select a virtual office plan that matches your business needs and budget. From basic address services to premium packages.",
      icon: Package
    },
    {
      number: "2",
      title: "Submit Documents",
      description: "Upload required documents online. Our team will verify and process your application within 24 hours.",
      icon: FileText
    },
    {
      number: "3",
      title: "Get Started",
      description: "Receive your business address, start using mail services, and access meeting rooms instantly.",
      icon: Zap
    }
  ];

  const whyChooseFlashSpace = [
    {
      emoji: "💰",
      title: "Save Up to 90%",
      description: "Eliminate expensive office rent, utilities, and maintenance costs while maintaining professional presence"
    },
    {
      emoji: "🚀",
      title: "Instant Flexibility",
      description: "Scale up or down instantly. Work from anywhere while your business address stays permanent"
    },
    {
      emoji: "⭐",
      title: "Professional Credibility",
      description: "Impress clients with premium business addresses in prime locations across India"
    },
    {
      emoji: "⚡",
      title: "Setup in 24 Hours",
      description: "Get your virtual office ready within 24 hours. No lengthy paperwork or waiting periods"
    },
    {
      emoji: "📋",
      title: "GST Registration",
      description: "Complete support for GST registration and business compliance with expert guidance"
    },
    {
      emoji: "🎯",
      title: "Expert Support",
      description: "Dedicated account manager and 24/7 customer support for all your business needs"
    }
  ];

  const pricingPlans = [
    {
      name: "Basic",
      price: "2,999",
      period: "month",
      description: "Perfect for startups and freelancers",
      features: [
        "Premium Business Address",
        "Mail Receiving & Notification",
        "GST Registration Support",
        "Business Phone Number",
        "2 Hours Meeting Room/month"
      ],
      notIncluded: [
        "Call Handling Service",
        "Dedicated Phone Support"
      ],
      highlighted: false,
      gradient: "from-gray-50 to-gray-100"
    },
    {
      name: "Professional",
      price: "5,999",
      period: "month",
      description: "Most popular for growing businesses",
      features: [
        "Everything in Basic",
        "Mail Forwarding Service",
        "Professional Call Handling",
        "Dedicated Phone Support",
        "5 Hours Meeting Room/month",
        "Business Registration Support"
      ],
      notIncluded: [],
      highlighted: true,
      gradient: "from-[#EDB003] to-[#f5c242]"
    },
    {
      name: "Enterprise",
      price: "9,999",
      period: "month",
      description: "For established businesses",
      features: [
        "Everything in Professional",
        "Priority Mail & Call Service",
        "10 Hours Meeting Room/month",
        "Dedicated Account Manager",
        "Legal Documentation Support",
        "Custom Business Address"
      ],
      notIncluded: [],
      highlighted: false,
      gradient: "from-[#172A3A] to-[#2a4a5a]"
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      company: "Digital Marketing Agency",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
      rating: 5,
      text: "FlashSpace virtual office helped me establish my business presence in Mumbai without the massive overhead costs. The GST registration support was seamless!"
    },
    {
      name: "Rahul Verma",
      company: "Tech Startup Founder",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
      rating: 5,
      text: "Best decision for our startup! We got a prestigious Bangalore address, professional mail handling, and meeting rooms when needed. Saved us lakhs in office rent."
    },
    {
      name: "Anjali Patel",
      company: "E-commerce Business",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
      rating: 5,
      text: "The 24-hour setup was incredible! I had my virtual office address ready the next day and completed my GST registration within a week. Highly recommend!"
    }
  ];

  const faqs = [
    {
      question: "What is a Virtual Office?",
      answer: "A virtual office provides you with a professional business address, mail handling services, and access to meeting rooms without the need for physical office space. It's perfect for remote businesses, startups, and entrepreneurs who want a professional presence without high overhead costs."
    },
    {
      question: "Can I use the virtual office address for GST registration?",
      answer: "Yes! All our virtual office addresses are verified and can be used for GST registration, business registration, and other legal compliances. We provide complete documentation support for GST registration."
    },
    {
      question: "How quickly can I get started?",
      answer: "You can get your virtual office set up within 24 hours! Once you choose your plan and submit the required documents, we'll process your application and activate your services immediately."
    },
    {
      question: "What documents do I need?",
      answer: "You'll need basic identity proof (Aadhaar/PAN), business proof (if applicable), and a passport-size photograph. Our team will guide you through the complete documentation process."
    },
    {
      question: "Do I get access to physical meeting rooms?",
      answer: "Yes! All plans include complimentary meeting room hours per month. You can book professional meeting spaces whenever you need to meet clients or conduct business meetings."
    },
    {
      question: "How does mail handling work?",
      answer: "We receive all your business mail at your virtual office address. You'll get instant notifications, and we can scan, forward, or store your mail based on your preference. Mail forwarding is available in Professional and Enterprise plans."
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer: "Absolutely! We offer flexible plans with no long-term lock-in. You can upgrade or downgrade your plan anytime based on your business needs."
    },
    {
      question: "Is there a setup fee?",
      answer: "No hidden charges! The price you see is what you pay. We believe in transparent pricing with no surprise fees or setup charges."
    }
  ];

  const cityLocations = [
    {
      city: "Bangalore",
      centers: 18,
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80",
      description: "Tech hub with premium business addresses"
    },
    {
      city: "Delhi NCR",
      centers: 24,
      image: "https://images.unsplash.com/photo-1570939274717-7eda259b50ed?w=800&q=80",
      description: "Capital region with prestigious locations"
    },
    {
      city: "Mumbai",
      centers: 22,
      image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80",
      description: "Financial capital business addresses"
    },
    {
      city: "Pune",
      centers: 12,
      image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80",
      description: "IT corridor and startup ecosystem"
    },
    {
      city: "Hyderabad",
      centers: 15,
      image: "https://images.unsplash.com/photo-1563656353898-febc9270a0f5?w=800&q=80",
      description: "Emerging tech city premium spaces"
    },
    {
      city: "Chennai",
      centers: 10,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
      description: "Southern business hub locations"
    }
  ];

  const stats = [
    { number: "1000+", label: "Happy Clients", icon: Users },
    { number: "68+", label: "Centers Pan India", icon: Building },
    { number: "8", label: "Major Cities", icon: MapPin },
    { number: "24/7", label: "Support Available", icon: Shield }
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Component */}
      <Header />

      {/* Hero Section */}
      <section className="relative h-[85vh] overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80"
            alt="Virtual Office Space"
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
              <span className="text-sm font-semibold text-[#EDB003]">Premium Virtual Office Solutions</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" >
              Your Business
              <br />
              <span className="text-[#EDB003]">Without Boundaries</span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
              Establish your professional presence with a prestigious business address,
              GST registration support, and premium amenities - all without physical office costs
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
                  <div className="font-bold">1000+ Clients</div>
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
                  <div className="text-gray-300 text-xs">From 500+ Reviews</div>
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
                <div className="text-4xl md:text-5xl font-bold text-white mb-2" >
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#172A3A]" >
              Premium Virtual Office Benefits
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to establish a professional business presence without the overhead costs
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

      {/* What is Virtual Office Section */}
      <section className="py-20 bg-gradient-to-br from-[#EDB003]/5 via-white to-[#172A3A]/5">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 bg-[#EDB003]/10 text-[#EDB003] rounded-full text-sm font-semibold mb-4">
              Understanding Virtual Office
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#172A3A]" >
              What is a <span className="text-[#EDB003]">Virtual Office?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A virtual office gives your business a professional identity without the cost of physical office space.
              Get a prestigious business address, mail handling, GST support, and meeting room access - all without renting an actual office!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {whatIsVirtualOffice.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-2 border-[#EDB003]/20 hover:border-[#EDB003] transition-all duration-300 h-full bg-white shadow-lg hover:shadow-xl group">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#EDB003] to-[#f5c242] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-[#172A3A]">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#172A3A]" >
              How It <span className="text-[#EDB003]">Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get your virtual office up and running in just 3 simple steps
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connection Lines */}
              <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-1 bg-gradient-to-r from-[#EDB003] to-[#f5c242] -translate-y-1/2"></div>

              {howItWorksSteps.map((step, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white h-full">
                    <CardContent className="p-8 text-center relative">
                      {/* Step Number Circle */}
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#EDB003] to-[#f5c242] rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                          <span className="text-2xl font-bold text-white" >
                            {step.number}
                          </span>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="w-16 h-16 bg-[#172A3A]/5 rounded-xl flex items-center justify-center mx-auto mb-6">
                          <step.icon className="w-8 h-8 text-[#172A3A]" />
                        </div>

                        <h3 className="text-2xl font-bold mb-4 text-[#172A3A]">
                          {step.title}
                        </h3>

                        <p className="text-gray-600 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose FlashSpace Section */}
      <section className="py-20 bg-gradient-to-br from-[#172A3A] via-[#172A3A] to-[#2a4a5a] relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#EDB003] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#EDB003] rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 bg-[#EDB003]/20 text-[#EDB003] rounded-full text-sm font-semibold mb-4 border border-[#EDB003]/30">
              Why FlashSpace
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white" >
              Why Choose <span className="text-[#EDB003]">FlashSpace</span> Virtual Office?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join thousands of successful businesses who trust FlashSpace for their virtual office needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {whyChooseFlashSpace.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-2 border-white/10 hover:border-[#EDB003]/50 transition-all duration-300 bg-white/5 backdrop-blur-sm hover:bg-white/10 h-full group">
                  <CardContent className="p-6">
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {benefit.emoji}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 bg-[#EDB003]/10 text-[#EDB003] rounded-full text-sm font-semibold mb-4">
              Pricing Plans
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#172A3A]" >
              Choose Your <span className="text-[#EDB003]">Perfect Plan</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transparent pricing with no hidden fees. All plans include GST registration support
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={plan.highlighted ? "md:-translate-y-4" : ""}
              >
                <Card className={`border-2 ${plan.highlighted ? 'border-[#EDB003] shadow-2xl' : 'border-gray-200'} hover:shadow-2xl transition-all duration-300 h-full relative overflow-hidden`}>
                  {plan.highlighted && (
                    <div className="absolute top-0 right-0 bg-[#EDB003] text-white px-4 py-1 text-sm font-bold">
                      POPULAR
                    </div>
                  )}

                  <CardContent className="p-8">
                    <div className={`w-16 h-16 bg-gradient-to-br ${plan.gradient} rounded-2xl flex items-center justify-center mb-6 ${plan.highlighted ? 'shadow-xl' : 'shadow-lg'}`}>
                      <Package className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold mb-2 text-[#172A3A]">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 mb-6 text-sm">
                      {plan.description}
                    </p>

                    <div className="mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold text-[#172A3A]" >
                          ₹{plan.price}
                        </span>
                        <span className="text-gray-500">/{plan.period}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">+ GST as applicable</p>
                    </div>

                    <div className="space-y-3 mb-8">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                          </div>
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </div>
                      ))}
                      {plan.notIncluded.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3 opacity-50">
                          <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <X className="w-3.5 h-3.5 text-gray-400" />
                          </div>
                          <span className="text-gray-500 text-sm line-through">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      className={`w-full py-6 text-lg font-semibold rounded-xl transition-all duration-300 ${
                        plan.highlighted
                          ? 'bg-gradient-to-r from-[#EDB003] to-[#f5c242] hover:from-[#d69f03] hover:to-[#EDB003] text-white shadow-lg hover:shadow-xl'
                          : 'bg-[#172A3A] hover:bg-[#2a4a5a] text-white'
                      }`}
                    >
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
            <p className="text-gray-600 mb-4">Need a custom plan for your business?</p>
            <Button variant="outline" className="border-2 border-[#EDB003] text-[#EDB003] hover:bg-[#EDB003] hover:text-white px-8 py-6 rounded-xl font-semibold transition-all duration-300">
              <Phone className="w-5 h-5 mr-2" />
              Contact Sales
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
              Customer Stories
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#172A3A]" >
              What Our <span className="text-[#EDB003]">Clients Say</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real experiences from businesses who chose FlashSpace
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
                <Card className="border-2 border-gray-100 hover:border-[#EDB003]/30 transition-all duration-300 h-full shadow-lg hover:shadow-xl">
                  <CardContent className="p-8">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-[#EDB003] text-[#EDB003]" />
                      ))}
                    </div>

                    <p className="text-gray-700 mb-6 leading-relaxed italic">
                      "{testimonial.text}"
                    </p>

                    <div className="flex items-center gap-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-[#EDB003]"
                      />
                      <div>
                        <h4 className="font-bold text-[#172A3A]">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.company}</p>
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#172A3A]" >
              Frequently Asked <span className="text-[#EDB003]">Questions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about our virtual office services
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Card
                  className={`border-2 transition-all duration-300 cursor-pointer ${
                    openFaqIndex === index
                      ? 'border-[#EDB003] shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-lg font-bold text-[#172A3A]">
                        {faq.question}
                      </h3>
                      <ChevronDown
                        className={`w-5 h-5 text-[#EDB003] flex-shrink-0 transition-transform duration-300 ${
                          openFaqIndex === index ? 'rotate-180' : ''
                        }`}
                      />
                    </div>

                    {openFaqIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-4 border-t border-gray-200"
                      >
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
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
            <Button className="bg-[#EDB003] hover:bg-[#d69f03] text-white px-8 py-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              <HeadphonesIcon className="w-5 h-5 mr-2" />
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#172A3A]" >
              <span className="text-[#EDB003]">68+</span> Centers Across <span className="text-[#EDB003]">8</span> Cities
            </h2>
            <p className="text-xl text-gray-600">Find your perfect virtual office location</p>
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
                  <h3 className="text-3xl font-bold mb-2" >{location.city}</h3>
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
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" >
              Ready to Establish Your
              <br />
              <span className="text-[#EDB003]">Business Presence?</span>
            </h2>

            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Join 1000+ businesses who trust FlashSpace for their virtual office needs.
              Get started in less than 24 hours!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-[#EDB003] hover:bg-[#f5c242] text-[#172A3A] text-lg px-10 py-7 rounded-full font-bold shadow-2xl hover:shadow-[#EDB003]/50 transition-all duration-300 transform hover:scale-105">
                <Sparkles className="w-5 h-5 mr-2" />
                Get Started Today
              </Button>

              <Button className="bg-white text-black border-2 border-gray-300 hover:bg-[#FFD43B] hover:text-black hover:border-[#FFD43B] text-lg px-10 py-7 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-xl">
                <Phone className="w-5 h-5 mr-2" />
                Talk to Expert
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default VirtualOffice;

