import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  Users,
  TrendingUp,
  Globe,
  CheckCircle2,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Handshake,
  Award,
  Target,
  Zap,
  Star,
  Briefcase,
  Shield,
  Clock,
  Rocket,
  DollarSign,
  HeartHandshake,
  TrendingUpIcon,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const PartnerWithUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    partnershipType: "",
    message: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you for your interest! Our partnership team will contact you within 24 hours.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      partnershipType: "",
      message: "",
    });
  };

  const partnershipTypes = [
    {
      icon: Building2,
      title: "Property Partners",
      description: "List your commercial space with us and earn consistent revenue",
      benefits: ["Guaranteed occupancy", "Professional management", "Marketing support", "Revenue sharing"],
      color: "from-yellow-500/20 to-orange-500/20",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"
    },
    {
      icon: Users,
      title: "Corporate Partners",
      description: "Provide flexible workspace solutions for your employees",
      benefits: ["Custom solutions", "Dedicated support", "Volume discounts", "Pan-India access"],
      color: "from-blue-500/20 to-purple-500/20",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
    },
    {
      icon: Handshake,
      title: "Business Associates",
      description: "Join our network and help us expand our reach",
      benefits: ["Attractive commissions", "Training & support", "Exclusive leads", "Growth opportunities"],
      color: "from-green-500/20 to-teal-500/20",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80"
    },
    {
      icon: Globe,
      title: "Strategic Alliance",
      description: "Collaborate with us to create innovative workspace solutions",
      benefits: ["Co-branding opportunities", "Technology integration", "Joint marketing", "Revenue sharing"],
      color: "from-pink-500/20 to-red-500/20",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80"
    }
  ];

  const stats = [
    { number: "500+", label: "Partner Spaces", icon: Building2 },
    { number: "50+", label: "Cities Covered", icon: Globe },
    { number: "10,000+", label: "Happy Clients", icon: Users },
    { number: "98%", label: "Partner Satisfaction", icon: Award }
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: "Revenue Growth",
      description: "Increase your property's revenue by up to 40% with our proven business model",
      gradient: "from-yellow-400 to-orange-500"
    },
    {
      icon: Target,
      title: "Zero Hassle",
      description: "We handle operations, marketing, and customer service - you just earn",
      gradient: "from-blue-400 to-purple-500"
    },
    {
      icon: Zap,
      title: "Quick Setup",
      description: "Get your space listed and operational within 7 days",
      gradient: "from-green-400 to-teal-500"
    },
    {
      icon: Star,
      title: "Premium Branding",
      description: "Leverage our strong brand presence and marketing expertise",
      gradient: "from-pink-400 to-red-500"
    }
  ];

  const successStories = [
    {
      name: "Rajesh Kumar",
      role: "Property Owner, Mumbai",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      quote: "FlashSpace transformed my vacant office space into a profitable asset. Revenue increased by 45% in just 3 months!",
      rating: 5
    },
    {
      name: "Priya Sharma",
      role: "Corporate Partner, Bangalore",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      quote: "The flexibility and pan-India coverage have been game-changers for our remote workforce. Highly recommended!",
      rating: 5
    },
    {
      name: "Amit Patel",
      role: "Business Associate, Delhi",
      image: "https://randomuser.me/api/portraits/men/52.jpg",
      quote: "The commission structure is excellent, and the support team is always there to help. Best partnership decision ever!",
      rating: 5
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Submit Inquiry",
      description: "Fill out our partnership form with your details and requirements",
      icon: Mail,
      color: "bg-yellow-500"
    },
    {
      step: "02",
      title: "Initial Discussion",
      description: "Our team schedules a call to understand your goals and opportunities",
      icon: Phone,
      color: "bg-blue-500"
    },
    {
      step: "03",
      title: "Site Visit & Assessment",
      description: "We evaluate your space or business model for partnership fit",
      icon: MapPin,
      color: "bg-green-500"
    },
    {
      step: "04",
      title: "Agreement & Onboarding",
      description: "Sign partnership agreement and begin onboarding process",
      icon: CheckCircle,
      color: "bg-purple-500"
    },
    {
      step: "05",
      title: "Launch & Grow",
      description: "Go live and start earning with our full support",
      icon: Rocket,
      color: "bg-pink-500"
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Header forceWhiteBackground={true} />

      {/* Hero Section with Background Image */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
            alt="Partnership Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-amber-900/50"></div>
        </div>

        {/* Animated floating elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * 600,
                opacity: 0
              }}
              animate={{
                y: [null, Math.random() * -100],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto max-w-7xl relative z-20">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-6"
            >
              <span className="px-6 py-2 bg-yellow-400/20 border border-yellow-400/50 rounded-full text-yellow-400 font-semibold text-sm backdrop-blur-sm">
                🤝 Join Our Growing Network
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'Poppins' }}>
              Partner with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-600">
                FlashSpace
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Geist' }}>
              Join India's fastest-growing workspace network and unlock limitless revenue opportunities
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="group bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black px-10 py-7 text-lg rounded-full font-bold shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-105"
                style={{ fontFamily: 'Poppins' }}
              >
                Become a Partner
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                className="border-2 border-white/80 text-white hover:bg-white hover:text-black px-10 py-7 text-lg rounded-full backdrop-blur-sm font-semibold transition-all duration-300 hover:scale-105"
                style={{ fontFamily: 'Poppins' }}
                onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore Benefits
              </Button>
            </div>
          </motion.div>

          {/* Stats Section with Glass Morphism */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card className="bg-white/10 backdrop-blur-md border-2 border-white/20 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full mb-4 group-hover:scale-110 transition-transform">
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Poppins' }}>{stat.number}</h3>
                    <p className="text-gray-200 text-sm font-medium" style={{ fontFamily: 'Geist' }}>{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Types Section with Images */}
      <section className="py-24 px-4 bg-gradient-to-br from-gray-50 via-white to-amber-50/30 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, black 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-black mb-4" style={{ fontFamily: 'Poppins' }}>
              Partnership <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-amber-500">Opportunities</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: 'Geist' }}>
              Choose the partnership model that aligns with your business vision
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {partnershipTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-2xl transition-all duration-500 border-2 hover:border-yellow-400 overflow-hidden h-full">
                  {/* Image Section */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={type.image}
                      alt={type.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${type.color} group-hover:opacity-80 transition-opacity`}></div>
                    <div className="absolute top-4 right-4 p-4 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
                      <type.icon className="w-8 h-8 text-yellow-600" />
                    </div>
                  </div>

                  <CardContent className="p-8 relative">
                    <h3 className="text-2xl font-bold text-black mb-3 group-hover:text-yellow-600 transition-colors" style={{ fontFamily: 'Poppins' }}>
                      {type.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed" style={{ fontFamily: 'Geist' }}>
                      {type.description}
                    </p>

                    <div className="space-y-3 mb-6">
                      {type.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="text-gray-700" style={{ fontFamily: 'Geist' }}>{benefit}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={() => {
                        handleInputChange('partnershipType', type.title);
                        document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full bg-gradient-to-r from-black to-gray-800 hover:from-yellow-500 hover:to-amber-600 text-white rounded-full py-6 group-hover:shadow-xl transition-all duration-300"
                      style={{ fontFamily: 'Poppins' }}
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section with Enhanced Visuals */}
      <section id="benefits" className="py-24 px-4 bg-white relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-black mb-4" style={{ fontFamily: 'Poppins' }}>
              Why Partner with <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-amber-500">Us?</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: 'Geist' }}>
              Experience the FlashSpace advantage and accelerate your business growth
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="group text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br ${benefit.gradient} rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                  <benefit.icon className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-bold text-black mb-3 group-hover:text-yellow-600 transition-colors" style={{ fontFamily: 'Poppins' }}>
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Geist' }}>
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories / Testimonials */}
      <section className="py-24 px-4 bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: 'Poppins' }}>
              Success <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">Stories</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto" style={{ fontFamily: 'Geist' }}>
              Hear from our partners who are thriving with FlashSpace
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <Card className="bg-white/10 backdrop-blur-md border-2 border-white/20 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 h-full">
                  <CardContent className="p-8">
                    {/* Rating Stars */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(story.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-gray-200 mb-6 italic leading-relaxed" style={{ fontFamily: 'Geist' }}>
                      "{story.quote}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-4 pt-4 border-t border-white/20">
                      <img
                        src={story.image}
                        alt={story.name}
                        className="w-14 h-14 rounded-full border-2 border-yellow-400"
                      />
                      <div>
                        <h4 className="font-bold text-white" style={{ fontFamily: 'Poppins' }}>{story.name}</h4>
                        <p className="text-sm text-gray-400" style={{ fontFamily: 'Geist' }}>{story.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Timeline Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-amber-50 via-white to-yellow-50/30 relative">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-black mb-4" style={{ fontFamily: 'Poppins' }}>
              Partnership <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-amber-500">Process</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: 'Geist' }}>
              Your journey to becoming a FlashSpace partner in 5 simple steps
            </p>
          </motion.div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 transform -translate-y-1/2"></div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
              {processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Icon Circle */}
                  <div className="relative inline-block mb-6">
                    <div className={`${step.color} w-20 h-20 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300 relative z-10`}>
                      <step.icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-3 -right-3 bg-white border-4 border-yellow-400 rounded-full w-10 h-10 flex items-center justify-center font-bold text-black z-20">
                      {step.step}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-black mb-2" style={{ fontFamily: 'Poppins' }}>
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Geist' }}>
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-black mb-4" style={{ fontFamily: 'Poppins' }}>
              Let's Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-amber-500">Together</span>
            </h2>
            <p className="text-lg text-gray-600" style={{ fontFamily: 'Geist' }}>
              Fill out the form below and our partnership team will reach out to you within 24 hours
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="border-2 border-gray-100 shadow-2xl hover:shadow-yellow-400/20 transition-shadow duration-300">
              <CardContent className="p-8 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700 font-medium flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="John Doe"
                        className="border-gray-300 focus:border-yellow-400 focus:ring-yellow-400/20 h-12"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 font-medium flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="john@example.com"
                        className="border-gray-300 focus:border-yellow-400 focus:ring-yellow-400/20 h-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-700 font-medium flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                        className="border-gray-300 focus:border-yellow-400 focus:ring-yellow-400/20 h-12"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-gray-700 font-medium flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Company Name
                      </Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        placeholder="Your Company"
                        className="border-gray-300 focus:border-yellow-400 focus:ring-yellow-400/20 h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="partnershipType" className="text-gray-700 font-medium flex items-center gap-2">
                      <Handshake className="w-4 h-4" />
                      Partnership Type *
                    </Label>
                    <select
                      id="partnershipType"
                      value={formData.partnershipType}
                      onChange={(e) => handleInputChange("partnershipType", e.target.value)}
                      className="w-full h-12 px-4 border border-gray-300 rounded-md focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20"
                      required
                    >
                      <option value="">Select partnership type</option>
                      <option value="Property Partners">Property Partners</option>
                      <option value="Corporate Partners">Corporate Partners</option>
                      <option value="Business Associates">Business Associates</option>
                      <option value="Strategic Alliance">Strategic Alliance</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-gray-700 font-medium">Tell us more about your requirements</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Share your goals, property details, or any questions you have..."
                      className="border-gray-300 focus:border-yellow-400 focus:ring-yellow-400/20 min-h-[140px]"
                      rows={5}
                    />
                  </div>

                  <div className="flex justify-center pt-6">
                    <Button
                      type="submit"
                      className="group bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black px-12 py-7 text-lg rounded-full font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                      style={{ fontFamily: 'Poppins' }}
                    >
                      Submit Partnership Request
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info Cards */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Phone, label: "Call Us", value: "+91 XXX XXX XXXX", gradient: "from-blue-500 to-blue-600" },
                { icon: Mail, label: "Email Us", value: "partners@flashspace.com", gradient: "from-purple-500 to-purple-600" },
                { icon: MapPin, label: "Visit Us", value: "Pan India Presence", gradient: "from-pink-500 to-pink-600" }
              ].map((contact, index) => (
                <motion.div
                  key={index}
                  className="group flex items-center gap-4 p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-yellow-400"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className={`p-4 bg-gradient-to-br ${contact.gradient} rounded-lg shadow-lg group-hover:scale-110 transition-transform`}>
                    <contact.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">{contact.label}</p>
                    <p className="font-bold text-black">{contact.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section with Background */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920&q=80"
            alt="CTA Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-yellow-900/70"></div>
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <HeartHandshake className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6" style={{ fontFamily: 'Poppins' }}>
              Ready to Grow Together?
            </h2>
            <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto" style={{ fontFamily: 'Geist' }}>
              Join hundreds of successful partners who are transforming the workspace industry with FlashSpace
            </p>
            <Button
              onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black px-12 py-7 text-lg rounded-full font-bold shadow-2xl hover:shadow-yellow-500/50 hover:scale-110 transition-all duration-300"
              style={{ fontFamily: 'Poppins' }}
            >
              Start Your Partnership Journey
              <Rocket className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PartnerWithUs;
