import { Building, MapPin, Mail, Phone, Calendar, Video, CheckCircle, Star, Users, Award, ChevronDown, Search, ArrowRight, Sparkles, Clock, Presentation, Coffee, Shield, DoorOpen, GraduationCap, PartyPopper, Zap, CreditCard, Globe, Headphones } from "lucide-react";
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

const OnDemand = () => {
  const [selectedCity, setSelectedCity] = useState("Delhi");
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const cities = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
    "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Surat",
    "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane"
  ];

  const features = [
    {
      icon: Clock,
      title: "Book by the Hour",
      description: "Flexible hourly booking for meeting rooms and conference halls - pay only for what you use",
      gradient: "from-[#EDB003] to-[#f5c242]"
    },
    {
      icon: Video,
      title: "AV Equipment Included",
      description: "Professional audio-visual setup with projectors, screens, and video conferencing included",
      gradient: "from-[#172A3A] to-[#2a4a5a]"
    },
    {
      icon: Calendar,
      title: "Instant Booking",
      description: "Easy online booking system - reserve your space in minutes, available 24/7",
      gradient: "from-[#EDB003] to-[#f5c242]"
    },
    {
      icon: Presentation,
      title: "Presentation Tools",
      description: "Whiteboards, flip charts, and modern presentation equipment ready for your use",
      gradient: "from-[#172A3A] to-[#2a4a5a]"
    },
    {
      icon: Coffee,
      title: "Refreshments",
      description: "Complimentary tea, coffee, and optional catering services available on request",
      gradient: "from-[#EDB003] to-[#f5c242]"
    },
    {
      icon: Award,
      title: "Professional Setup",
      description: "Clean, well-maintained spaces with ergonomic furniture and climate control",
      gradient: "from-[#172A3A] to-[#2a4a5a]"
    }
  ];

  const spaceTypes = [
    {
      icon: Users,
      title: "Meeting Rooms",
      description: "Perfect for client meetings, team discussions, and presentations",
      capacity: "4-10 people",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
    },
    {
      icon: Building,
      title: "Conference Halls",
      description: "Large spaces for seminars, workshops, and corporate events",
      capacity: "20-50 people",
      image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80"
    },
    {
      icon: Calendar,
      title: "Day Pass",
      description: "Ideal for freelancers or remote professionals needing a flexible workspae for a single day.",
      capacity: "1 person",
      image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80"
    },
    {
      icon: PartyPopper,
      title: "Event Spaces",
      description: "Versatile venues for product launches, networking events, and celebrations",
      capacity: "30-100 people",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80"
    }
  ];

  const howItWorks = [
    {
      step: "01",
      icon: Search,
      title: "Search & Select",
      description: "Browse available spaces by location, capacity, and amenities. Filter by your specific requirements and view real-time availability."
    },
    {
      step: "02",
      icon: CreditCard,
      title: "Book & Pay Online",
      description: "Choose your time slot, add any extras, and complete secure payment online. Instant confirmation sent to your email."
    },
    {
      step: "03",
      icon: DoorOpen,
      title: "Show Up & Meet",
      description: "Simply arrive at your scheduled time. Our team will have everything ready - just walk in and start your meeting."
    }
  ];

  const whyChoose = [
    {
      icon: Clock,
      title: "No Commitment",
      description: "Book by the hour with no long-term contracts or memberships required"
    },
    {
      icon: Globe,
      title: "Prime Locations",
      description: "68+ centers in prestigious business districts across 8 major cities"
    },
    {
      icon: CreditCard,
      title: "All-Inclusive Pricing",
      description: "Transparent pricing with WiFi, refreshments, and AV equipment included"
    },
    {
      icon: Users,
      title: "Multiple Capacity Options",
      description: "From intimate 4-person rooms to 100+ capacity event spaces"
    },
    {
      icon: Zap,
      title: "Instant Availability",
      description: "Real-time booking system with immediate confirmation"
    },
    {
      icon: Headphones,
      title: "Professional Support",
      description: "On-site team available to assist with setup and technical needs"
    }
  ];

  const pricingPlans = [
    {
      title: "Small Meeting Room",
      capacity: "4 People",
      price: "799",
      features: [
        "High-speed WiFi",
        "Tea & Coffee",
        "Power Backup",
        "AC & Comfortable Seating"
      ],
      popular: false
    },
    {
      title: "Conference Hall",
      capacity: "10–15 People",
      price: "1,999/hour",
      features: [
        "Premium AV Setup",
        "Video Conferencing",
        "Multiple Screens",
        "Catering Available",
        "Whiteboard",
        "LED Projector",
        "Professional Support"
      ],
      popular: true
    },
    {
      title: "Event Space",
      capacity: "30–200 People",
      price: "Customisable",
      features: [
        "Classroom Style Setup",
        "Projector & Screen",
        "Sound System",
        "Flipcharts & Markers",
        "Breakout Areas",
        "All-Day Access"
      ],
      popular: false
    }
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      company: "TechStart Solutions",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
      rating: 5,
      text: "FlashSpace on-demand rooms have been a game-changer for our client meetings. Professional setup, great locations, and incredibly easy booking process. Highly recommend!"
    },
    {
      name: "Priya Sharma",
      company: "Digital Marketing Pro",
      role: "Marketing Director",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
      rating: 5,
      text: "We host monthly training sessions for our team, and FlashSpace's training rooms are perfect. Everything is always ready when we arrive, and the support staff is excellent."
    },
    {
      name: "Amit Patel",
      company: "Startup Hub India",
      role: "Community Manager",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
      rating: 5,
      text: "The flexibility to book spaces by the hour without any long-term commitment is exactly what we needed. Perfect for our networking events and workshops."
    }
  ];

  const faqs = [
    {
      question: "How far in advance can I book a space?",
      answer: "You can book our on-demand spaces up to 3 months in advance. For same-day bookings, spaces are available if they show as open in our real-time booking system."
    },
    {
      question: "What is included in the hourly rate?",
      answer: "Our hourly rates include high-speed WiFi, AV equipment (projector/TV), whiteboard, comfortable seating, air conditioning, tea/coffee, and professional support. Additional catering can be arranged at extra cost."
    },
    {
      question: "Can I cancel or reschedule my booking?",
      answer: "Yes, you can cancel or reschedule up to 24 hours before your booking time for a full refund. Cancellations within 24 hours are subject to a 50% charge."
    },
    {
      question: "Is there a minimum booking duration?",
      answer: "Yes, the minimum booking is 2 hours for meeting rooms and conference halls. For event spaces and training rooms, the minimum is 4 hours."
    },
    {
      question: "Do you provide technical support during meetings?",
      answer: "Absolutely! Our on-site team is available throughout your booking to assist with any technical setup, AV equipment, or other requirements you may have."
    },
    {
      question: "Can I visit the space before booking?",
      answer: "Yes, we offer virtual tours on our website and you can schedule a physical tour of any of our locations. Contact our team to arrange a visit."
    },
    {
      question: "Are parking facilities available?",
      answer: "Most of our centers have parking facilities or are located in buildings with dedicated parking. Parking details are mentioned on each location page."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, UPI, net banking, and digital wallets. Corporate clients can also request invoice-based payments."
    }
  ];

  const cityLocations = [
    {
      city: "Bangalore",
      centers: 5,
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80",
      description: "Professional meeting spaces on-demand"
    },
    {
      city: "Delhi NCR",
      centers: 15,
      image: "https://images.unsplash.com/photo-1570939274717-7eda259b50ed?w=800&q=80",
      description: "Premium conference rooms by the hour"
    },
    {
      city: "Mumbai",
      centers: 4,
      image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80",
      description: "Business meeting spaces available"
    },
    {
      city: "Kolkata",
      centers: 8,
      image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80",
      description: "Flexible workspace solutions"
    },
    {
      city: "Hyderabad",
      centers: 4,
      image: "https://images.unsplash.com/photo-1551161242-b5af797b7233?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8SHlkZXJhYmFkfGVufDB8fDB8fHww",
      description: "On-demand meeting facilities"
    },
    {
      city: "Chennai",
      centers: 2,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
      description: "Professional event spaces"
    }
  ];

  const stats = [
    { number: "2000+", label: "Bookings Made", icon: Users },
    { number: "68+", label: "Centers Pan India", icon: Building },
    { number: "50+", label: "Major Cities", icon: MapPin },
    { number: "Instant", label: "Booking Available", icon: Shield }
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-white" >
      {/* Header Component */}
      <Header />

      {/* Hero Section */}
      <section className="relative h-[93vh] overflow-hidden mt-16">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=1920&q=80"
            alt="On-Demand Meeting Spaces"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#172A3A]/95 via-[#172A3A]/80 to-[#EDB003]/20"></div>

          {/* Animated Gradient Orbs */}
          <div className="absolute top-20 left-20 w-96 h-96 bg-[#EDB003]/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#172A3A]/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-center">
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

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight" >
              On-Demand Business Solutions
              <br />
              <span className="text-[#EDB003]">On Your Schedule</span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed" >
              Book professional meeting rooms, day pass and conference halls by the hour -
              whenever and wherever you need them
            </p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link to="/start-chatting">
                <Button className="bg-black hover:bg-gray-900 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto">
                  Start Chat
                </Button>
              </Link>
              <Link to="/solutions/on-demand">
                <Button className="bg-[#FFD43B] text-black px-8 py-4 text-lg font-semibold rounded-lg shadow-lg w-full sm:w-auto hover:bg-[#FFD43B] active:bg-[#FFD43B] focus:bg-[#FFD43B] focus:ring-0 focus:outline-none">
                  Explore Spaces</Button>

              </Link>
            </motion.div>

            {/* Hero Search Bar */}
            <motion.div
              className="bg-white rounded-2xl p-2 shadow-2xl max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
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
              className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-0 mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-[#EDB003] to-[#f5c242] border-2 border-white"></div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="font-bold">2000+ Bookings</div>
                  <div className="text-gray-300 text-xs">On FlashSpace</div>
                </div>
              </div>

              {/* Divider - only visible on desktop */}
              <div className="hidden md:block w-px h-12 bg-white/30 mx-8"></div>

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
      
      {/* What is On-Demand Workspace Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 bg-[#EDB003]/10 text-[#EDB003] rounded-full text-sm font-semibold mb-4">
              What We Offer
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#172A3A]" >
              What is <span className="text-[#EDB003]">On-Demand Workspace?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" >
              Book professional meeting spaces by the hour without any long-term commitments.
              Perfect for client meetings, training sessions, events, and collaborative work.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {spaceTypes.map((space, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 h-full bg-white overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={space.image}
                      alt={space.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#172A3A]/80 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <div className="w-12 h-12 bg-[#EDB003] rounded-xl flex items-center justify-center">
                        <space.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-[#172A3A] group-hover:text-[#EDB003] transition-colors duration-300">
                      {space.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">{space.description}</p>
                    <div className="flex items-center gap-2 text-[#EDB003] font-semibold">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{space.capacity}</span>
                    </div>
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#172A3A]" >
              How <span className="text-[#EDB003]">It Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" >
              Book your perfect meeting space in three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 h-full bg-white overflow-hidden relative">
                  <CardContent className="p-8 text-center">
                    {/* Step Number */}
                    <div className="absolute top-4 right-4 text-6xl font-bold text-[#EDB003]/10" >
                      {step.step}
                    </div>

                    {/* Icon */}
                    <div className="w-20 h-20 bg-gradient-to-br from-[#EDB003] to-[#f5c242] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <step.icon className="w-10 h-10 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold mb-3 text-[#172A3A] group-hover:text-[#EDB003] transition-colors duration-300">
                      {step.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed" >
                      {step.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Arrow between steps */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
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
              Why Choose Us
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#172A3A]" >
              Why Choose <span className="text-[#EDB003]">FlashSpace On-Demand</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" >
              Everything you need for successful meetings without any hassle
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {whyChoose.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 h-full bg-white overflow-hidden">
                  <CardContent className="p-8 relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#EDB003] to-[#f5c242] rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <benefit.icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold mb-3 text-[#172A3A] group-hover:text-[#EDB003] transition-colors duration-300">
                      {benefit.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed" >
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
              Transparent Pricing
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#172A3A]" >
              Hourly <span className="text-[#EDB003]">Pricing Plans</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" >
              Pay only for what you use - no hidden charges, all-inclusive rates
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 h-full overflow-hidden relative ${plan.popular ? 'ring-4 ring-[#EDB003]' : ''}`}>
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-[#EDB003] text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
                      POPULAR
                    </div>
                  )}
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-2 text-[#172A3A]">{plan.title}</h3>
                    <p className="text-gray-600 mb-4">{plan.capacity}</p>

                    <div className="mb-6">
                      {plan.price === "Customisable" ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-[#EDB003]" >
                            Customisable Pricing
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl font-bold text-[#EDB003]" >
                            ₹{plan.price}
                          </span>
                          <span className="text-gray-600">/hour</span>
                        </div>
                      )}
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-[#EDB003] flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`w-full py-6 text-lg font-bold rounded-xl transition-all duration-300 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-[#EDB003] to-[#f5c242] hover:from-[#d69f03] hover:to-[#EDB003] text-white shadow-lg'
                          : 'bg-white hover:bg-[#EDB003] text-[#172A3A] hover:text-white border-2 border-[#EDB003]'
                      }`}
                    >
                      Book Now
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
              Premium Features
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#172A3A]" >
              Premium On-Demand Benefits
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" >
              Everything you need for professional meetings without long-term commitments
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

                    <p className="text-gray-600 leading-relaxed" >
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
              Client Success Stories
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#172A3A]" >
              What Our <span className="text-[#EDB003]">Clients Say</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" >
              Hear from businesses who trust FlashSpace for their on-demand space needs
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
                  <CardContent className="p-8">
                    {/* Rating Stars */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-[#EDB003] text-[#EDB003]" />
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-gray-600 mb-6 leading-relaxed italic" >
                      "{testimonial.text}"
                    </p>

                    {/* Author Info */}
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-[#172A3A]">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                        <p className="text-sm text-[#EDB003] font-semibold">{testimonial.company}</p>
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#172A3A]" >
              <span className="text-[#EDB003]">68+</span> Centers Across <span className="text-[#EDB003]">8</span> Cities
            </h2>
            <p className="text-xl text-gray-600">Find your perfect meeting space location</p>
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
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" >
              Everything you need to know about our on-demand booking service
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
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-[#EDB003] rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold">Q</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-3 text-[#172A3A]">{faq.question}</h3>
                        <p className="text-gray-600 leading-relaxed" >{faq.answer}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
              Ready to Book Your
              <br />
              <span className="text-[#EDB003]">Perfect Meeting Space?</span>
            </h2>

            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto" >
              Join 2000+ businesses who trust FlashSpace for their meeting needs.
              Book your space in minutes!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-[#EDB003] hover:bg-[#f5c242] text-[#172A3A] text-lg px-10 py-7 rounded-full font-bold shadow-2xl hover:shadow-[#EDB003]/50 transition-all duration-300 transform hover:scale-105">
                <Sparkles className="w-5 h-5 mr-2" />
                Book Now
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

export default OnDemand;

