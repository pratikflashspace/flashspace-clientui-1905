import { Building, MapPin, Mail, Phone, FileText, CheckCircle, Star, Users, Award, ChevronDown, Search, ArrowRight, Sparkles, TrendingUp, Shield, Briefcase, Clock, Package, Zap, HeartHandshake, DollarSign, Headphones, FileCheck, Scale } from "lucide-react";
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

const BusinessSetup = () => {
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
      icon: FileText,
      title: "Company Registration",
      description: "Complete support for Pvt Ltd, LLP, OPC, Partnership & Sole Proprietorship registration",
      gradient: "from-[#EDB003] to-[#f5c242]"
    },
    {
      icon: Shield,
      title: "GST & Tax Registration",
      description: "Hassle-free GST, PAN, TAN registration with expert CA guidance and compliance support",
      gradient: "from-[#172A3A] to-[#2a4a5a]"
    },
    {
      icon: Briefcase,
      title: "Business Licenses",
      description: "Assistance with trade licenses, FSSAI, import-export codes, and industry-specific permits",
      gradient: "from-[#EDB003] to-[#f5c242]"
    },
    {
      icon: Users,
      title: "Expert Consultation",
      description: "Dedicated legal and CA experts to guide you through the entire business setup process",
      gradient: "from-[#172A3A] to-[#2a4a5a]"
    },
    {
      icon: Clock,
      title: "Fast-Track Processing",
      description: "Launch your business in just 7-10 working days with our streamlined registration process",
      gradient: "from-[#EDB003] to-[#f5c242]"
    },
    {
      icon: Award,
      title: "Post-Setup Support",
      description: "Ongoing compliance support for annual filings, ROC requirements, and statutory obligations",
      gradient: "from-[#172A3A] to-[#2a4a5a]"
    }
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
      description: "Obtain trade licenses, FSSAI, import-export codes, professional tax, and all industry-specific permits"
    },
    {
      icon: Headphones,
      title: "Compliance Support",
      description: "Annual ROC filings, board meetings, maintenance of statutory records, and ongoing compliance assistance"
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
      title: "Registration Complete",
      description: "Receive your Certificate of Incorporation, PAN, TAN, GST, and all business licenses",
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

  const servicePackages = [
    {
      name: "Startup Package",
      price: "₹14,999",
      period: "One-time",
      description: "Perfect for solo entrepreneurs and small startups",
      features: [
        "OPC/Proprietorship Registration",
        "PAN & TAN Application",
        "GST Registration",
        "Basic Business License",
        "Digital Signature Certificate",
        "1 Year Post-Setup Support"
      ],
      gradient: "from-white to-gray-50",
      popular: false
    },
    {
      name: "Professional Package",
      price: "₹24,999",
      period: "One-time",
      description: "Ideal for growing businesses and partnerships",
      features: [
        "Pvt Ltd/LLP Registration",
        "PAN, TAN & GST Registration",
        "Trade License & FSSAI (if applicable)",
        "Director DSC & DIN",
        "MOA & AOA Drafting",
        "2 Years Post-Setup Support",
        "Annual ROC Filing Assistance"
      ],
      gradient: "from-[#EDB003]/10 to-[#f5c242]/5",
      popular: true
    },
    {
      name: "Enterprise Package",
      price: "₹44,999",
      period: "One-time",
      description: "Complete solution for established businesses",
      features: [
        "All Professional Package Features",
        "Import-Export Code (IEC)",
        "Professional Tax Registration",
        "MSME/Udyam Registration",
        "Trademark Registration (1 Class)",
        "3 Years Compliance Support",
        "Dedicated CA & Legal Expert",
        "Priority Processing"
      ],
      gradient: "from-[#172A3A]/5 to-[#2a4a5a]/5",
      popular: false
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
      centers: 18,
      image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&q=80",
      description: "Startup hub with streamlined registrations"
    },
    {
      city: "Delhi NCR",
      centers: 24,
      image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80",
      description: "Capital region business setup experts"
    },
    {
      city: "Mumbai",
      centers: 22,
      image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80",
      description: "Financial capital registration services"
    },
    {
      city: "Pune",
      centers: 12,
      image: "https://images.unsplash.com/photo-1595659919839-67e5e0e6f47f?w=800&q=80",
      description: "Complete business incorporation support"
    },
    {
      city: "Hyderabad",
      centers: 15,
      image: "https://images.unsplash.com/photo-1609619385002-f40f7eb3b755?w=800&q=80",
      description: "Tech startup registration specialists"
    },
    {
      city: "Chennai",
      centers: 10,
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative h-[85vh] overflow-hidden mt-16">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=80"
            alt="Business Setup Services"
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
              <span className="text-sm font-semibold text-[#EDB003]">Complete Business Setup Solutions</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Poppins' }}>
              Business Setup
              <br />
              <span className="text-[#EDB003]">Made Simple</span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
              Complete end-to-end support for company registration, GST filing, licenses, and legal compliance - launch your business in 7-10 days
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
                  Get Started
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
                  <div className="font-bold">5000+ Companies</div>
                  <div className="text-gray-300 text-xs">Registered Successfully</div>
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
                <div className="text-4xl md:text-5xl font-bold text-white mb-2" style={{ fontFamily: 'Poppins' }}>
                  {stat.number}
                </div>
                <div className="text-white/90 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What is Business Setup Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 bg-[#EDB003]/10 text-[#EDB003] rounded-full text-sm font-semibold mb-4">
              Our Services
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#172A3A]" style={{ fontFamily: 'Poppins' }}>
              What is <span className="text-[#EDB003]">Business Setup</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              FlashSpace Business Setup provides comprehensive end-to-end support for legally establishing your business in India. From company registration to compliance management, we handle everything so you can focus on growing your venture.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {whatIsBusinessSetupCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-2 border-gray-100 hover:border-[#EDB003] transition-all duration-500 group hover:shadow-xl h-full">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#EDB003] to-[#f5c242] rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <card.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-[#172A3A] group-hover:text-[#EDB003] transition-colors duration-300">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {card.description}
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
              How It <span className="text-[#EDB003]">Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Launch your business in three simple steps with FlashSpace
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            {howItWorksSteps.map((step, index) => (
              <motion.div
                key={index}
                className="relative flex items-start gap-8 mb-12 last:mb-0"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                {/* Step Number Circle */}
                <div className="flex-shrink-0 relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#EDB003] to-[#f5c242] rounded-full flex items-center justify-center shadow-xl">
                    <span className="text-3xl font-bold text-white" style={{ fontFamily: 'Poppins' }}>
                      {step.number}
                    </span>
                  </div>
                  {/* Connector Line */}
                  {index < howItWorksSteps.length - 1 && (
                    <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-1 h-12 bg-gradient-to-b from-[#EDB003] to-transparent"></div>
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-gray-100 hover:border-[#EDB003]">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#EDB003]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <step.icon className="w-6 h-6 text-[#EDB003]" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3 text-[#172A3A]" style={{ fontFamily: 'Poppins' }}>
                        {step.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-lg">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
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
              Why Choose Us
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#172A3A]" style={{ fontFamily: 'Poppins' }}>
              Why Choose <span className="text-[#EDB003]">FlashSpace</span> Business Setup
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trusted by 5000+ entrepreneurs for comprehensive business registration and compliance solutions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {whyChooseReasons.map((reason, index) => (
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
                    <div className={`absolute inset-0 bg-gradient-to-br ${reason.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                    <div className={`w-16 h-16 bg-gradient-to-br ${reason.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <reason.icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold mb-3 text-[#172A3A] group-hover:text-[#EDB003] transition-colors duration-300">
                      {reason.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed">
                      {reason.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Packages Section */}
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#172A3A]" style={{ fontFamily: 'Poppins' }}>
              Service <span className="text-[#EDB003]">Packages</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect package for your business needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {servicePackages.map((pkg, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                viewport={{ once: true }}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-[#EDB003] to-[#f5c242] text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                <Card className={`border-2 ${pkg.popular ? 'border-[#EDB003] shadow-2xl' : 'border-gray-200 shadow-lg'} hover:shadow-2xl transition-all duration-500 h-full bg-gradient-to-br ${pkg.gradient}`}>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-2 text-[#172A3A]" style={{ fontFamily: 'Poppins' }}>
                      {pkg.name}
                    </h3>
                    <p className="text-gray-600 mb-6 text-sm">
                      {pkg.description}
                    </p>
                    <div className="mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-[#172A3A]" style={{ fontFamily: 'Poppins' }}>
                          {pkg.price}
                        </span>
                        <span className="text-gray-500 text-sm">/{pkg.period}</span>
                      </div>
                    </div>

                    <ul className="space-y-4 mb-8">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-[#EDB003] flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button className={`w-full ${pkg.popular ? 'bg-gradient-to-r from-[#EDB003] to-[#f5c242] hover:from-[#d69f03] hover:to-[#EDB003]' : 'bg-[#172A3A] hover:bg-[#2a4a5a]'} text-white py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}>
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 bg-[#EDB003]/10 text-[#EDB003] rounded-full text-sm font-semibold mb-4">
              Our Features
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#172A3A]" style={{ fontFamily: 'Poppins' }}>
              Complete Business Setup Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to launch and legally establish your business with expert guidance
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

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
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
              What Our <span className="text-[#EDB003]">Clients Say</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 h-full">
                  <CardContent className="p-8">
                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-[#EDB003] text-[#EDB003]" />
                      ))}
                    </div>

                    {/* Content */}
                    <p className="text-gray-700 mb-6 leading-relaxed italic">
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
                        <h4 className="font-bold text-[#172A3A]">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
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
            <p className="text-xl text-gray-600">Register your business from anywhere in India</p>
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
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#172A3A]" style={{ fontFamily: 'Poppins' }}>
              Frequently Asked <span className="text-[#EDB003]">Questions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-100 hover:border-[#EDB003] transition-all duration-300">
                  <button
                    className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  >
                    <h3 className="text-lg font-bold text-[#172A3A] pr-8">
                      {faq.question}
                    </h3>
                    <ChevronDown
                      className={`w-6 h-6 text-[#EDB003] flex-shrink-0 transition-transform duration-300 ${
                        openFaqIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openFaqIndex === index ? 'max-h-96' : 'max-h-0'
                    }`}
                  >
                    <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
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

export default BusinessSetup;
