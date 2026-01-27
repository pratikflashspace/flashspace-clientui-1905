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
import { submitPartnerInquiry } from "@/services/partnerInquiry.service";

const PartnerWithUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    partnershipType: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitPartnerInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        partnershipType: formData.partnershipType,
        message: formData.message,
      });

      toast.success("Thank you for your interest! Our partnership team will contact you within 24 hours.");

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        partnershipType: "",
        message: "",
      });
    } catch (error: any) {
      console.error('Partnership submission error:', error);
      toast.error(error.message || "Failed to submit partnership request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      <Header />

      {/* Hero Section (Clean 2-Column Layout) */}
      <section className="relative min-h-[90vh] flex items-center bg-slate-50 dark:bg-[#0B1120] overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-amber-50/30 to-white dark:from-[#0B1120] dark:via-[#111] dark:to-[#1a1a1a]" />

        {/* Decorative Blob */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#EFAD1A]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 w-full pt-20 pb-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* LEFT COLUMN: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left relative z-20"
            >
              <div className="inline-flex items-center gap-2 bg-white dark:bg-white/5 border border-amber-200 dark:border-white/10 px-4 py-2 rounded-full mb-8 shadow-sm">
                <Handshake className="w-4 h-4 text-[#EFAD1A]" />
                <span className="text-sm font-bold tracking-wide text-slate-800 dark:text-white">Join Our Network</span>
              </div>

              <h1 className="font-grotesk text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] text-slate-900 dark:text-white tracking-tight">
                Partner with <br />
                <span className="text-[#EFAD1A]">FlashSpace</span>
              </h1>

              <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-lg leading-relaxed font-medium">
                Monetize your commercial real estate and unlock consistent revenue streams by joining India's fastest-growing workspace network.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-6 bg-[#EFAD1A] hover:bg-[#d69f03] text-slate-900 text-lg rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Become a Partner
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })}
                  variant="outline"
                  className="px-8 py-6 border-2 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 text-lg rounded-full font-bold transition-all duration-300"
                >
                  Explore Benefits
                </Button>
              </div>
            </motion.div>

            {/* RIGHT COLUMN: Floating Cluster */}
            {/* RIGHT COLUMN: Complex Floating Cluster */}
            <div className="relative h-[650px] w-full hidden lg:block perspective-1000">

              {/* 1. Top Left - Tall w/ Brick Wall */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: [0, -15, 0] }} transition={{ opacity: { delay: 0.2 }, y: { repeat: Infinity, duration: 6, ease: "easeInOut" } }}
                className="absolute top-[0%] left-[5%] z-20"
              >
                <div className="w-44 h-64 rounded-[2rem] overflow-hidden shadow-2xl border-[6px] border-white dark:border-[#222]">
                  <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=500&q=80" alt="Meeting" className="w-full h-full object-cover" />
                </div>
                {/* Pill: Verified */}
                <div className="absolute -bottom-4 -left-8 bg-white dark:bg-[#222] px-4 py-2 rounded-full shadow-xl flex items-center gap-2 z-30 animate-bounce-slow">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Shield className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-slate-800 dark:text-white text-xs">Verified Partner</span>
                </div>
              </motion.div>

              {/* 2. Top Right - Bright Office */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: [0, -10, 0] }} transition={{ opacity: { delay: 0.4 }, y: { repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 } }}
                className="absolute top-[5%] right-[5%] z-10"
              >
                <div className="w-56 h-56 rounded-[2.5rem] overflow-hidden shadow-2xl border-[6px] border-white dark:border-[#222]">
                  <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80" alt="Office" className="w-full h-full object-cover" />
                </div>
                {/* Pill: Support */}
                <div className="absolute top-8 -left-20 bg-white dark:bg-[#222] px-4 py-2 rounded-full shadow-xl flex items-center gap-2 z-30">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-slate-800 dark:text-white text-xs">24/7 Support</span>
                </div>
              </motion.div>

              {/* 3. Center - Industrial */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1, y: [0, -18, 0] }} transition={{ opacity: { delay: 0.6 }, scale: { delay: 0.6 }, y: { repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 0.5 } }}
                className="absolute top-[28%] left-[32%] z-30"
              >
                <div className="w-48 h-48 rounded-[2rem] overflow-hidden shadow-2xl border-[6px] border-white dark:border-[#222]">
                  <img src="https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=500&q=80" alt="Coworking" className="w-full h-full object-cover" />
                </div>
              </motion.div>

              {/* 4. Center Right - Laptop Small */}
              <motion.div
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0, y: [0, -12, 0] }} transition={{ opacity: { delay: 0.8 }, x: { delay: 0.8 }, y: { repeat: Infinity, duration: 6.5, ease: "easeInOut", delay: 1.5 } }}
                className="absolute top-[45%] right-[2%] z-20"
              >
                <div className="w-32 h-32 rounded-[1.5rem] overflow-hidden shadow-xl border-[5px] border-white dark:border-[#222]">
                  <img src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&q=80" alt="Laptop" className="w-full h-full object-cover" />
                </div>
              </motion.div>

              {/* 5. Bottom Left - Wide City */}
              <motion.div
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0, y: [0, -20, 0] }} transition={{ opacity: { delay: 1.0 }, x: { delay: 1.0 }, y: { repeat: Infinity, duration: 8, ease: "easeInOut", delay: 2 } }}
                className="absolute bottom-[20%] left-[-5%] z-20"
              >
                <div className="w-64 h-36 rounded-[2rem] overflow-hidden shadow-2xl border-[6px] border-white dark:border-[#222]">
                  <img src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80" alt="City" className="w-full h-full object-cover" />
                </div>
              </motion.div>

              {/* 6. Middle Left - People */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, -14, 0] }} transition={{ opacity: { delay: 1.2 }, y: { repeat: Infinity, duration: 7.5, ease: "easeInOut", delay: 0.8 } }}
                className="absolute bottom-[28%] left-[25%] z-10"
              >
                <div className="w-40 h-40 rounded-[2rem] overflow-hidden shadow-lg border-[5px] border-white dark:border-[#222]">
                  <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&q=80" alt="Team" className="w-full h-full object-cover" />
                </div>
              </motion.div>

              {/* 7. Bottom Right - Large Tall Lounge */}
              <motion.div
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: [0, -16, 0] }} transition={{ opacity: { delay: 1.4 }, y: { repeat: Infinity, duration: 9, ease: "easeInOut", delay: 0.2 } }}
                className="absolute -bottom-[5%] right-[8%] z-40"
              >
                <div className="w-60 h-80 rounded-[3rem] overflow-hidden shadow-2xl border-[8px] border-white dark:border-[#222]">
                  <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&q=80" alt="Lounge" className="w-full h-full object-cover" />
                </div>
                {/* Pill: Prime Locations */}
                <div className="absolute top-12 -right-12 bg-white dark:bg-[#222] px-5 py-3 rounded-full shadow-xl flex items-center gap-2 z-50">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-bold text-slate-800 dark:text-white text-sm">High Occupancy</span>
                </div>
                {/* Pill: Business Address */}
                <div className="absolute bottom-8 -left-10 bg-white dark:bg-[#222] px-5 py-3 rounded-full shadow-xl flex items-center gap-3 z-50">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-slate-800 dark:text-white text-sm">Premium Brand</span>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      {/* Stats Section (Clean) */}
      <section className="py-10 border-y border-slate-100 dark:border-white/10 bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-md relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100 dark:divide-white/5">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center px-4 group cursor-default"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="mb-3 inline-flex p-3 rounded-2xl bg-[#EFAD1A]/10 text-[#EFAD1A] group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl md:font-grotesk text-4xl font-bold text-slate-900 dark:text-white mb-1">
                  {stat.number}
                </div>
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Types Section */}
      <section className="py-24 px-4 bg-white dark:bg-[#0a0a0a] relative transition-colors duration-300">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, black 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-grotesk text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4">
              Partnership <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-amber-500">Opportunities</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
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
                <Card className="group hover:shadow-2xl transition-all duration-500 border border-slate-200 hover:border-[#EFAD1A] overflow-hidden h-full bg-white dark:bg-[#1f1f1f] dark:border-white/10">
                  {/* Image Section */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={type.image}
                      alt={type.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all"></div>
                  </div>

                  <CardContent className="p-8 relative">
                    <div className="absolute -top-10 right-8 p-4 bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-lg border border-slate-100 dark:border-white/10 group-hover:scale-110 transition-transform">
                      <type.icon className="w-8 h-8 text-[#EFAD1A]" />
                    </div>

                    <h3 className="font-grotesk text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-[#EFAD1A] transition-colors">
                      {type.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                      {type.description}
                    </p>

                    <div className="space-y-3 mb-8">
                      {type.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-slate-600 dark:text-slate-300 text-sm font-medium">{benefit}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={() => {
                        handleInputChange('partnershipType', type.title);
                        document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-[#EFAD1A] dark:hover:bg-[#EFAD1A] rounded-xl py-6 font-bold shadow-lg hover:shadow-xl transition-all duration-300"
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

      {/* Benefits Section */}
      <section id="benefits" className="py-24 px-4 bg-slate-50 dark:bg-[#0f172a] relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#EFAD1A]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-grotesk text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4">
              Why Partner with <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-amber-500">Us?</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
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
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-yellow-600 transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories / Testimonials */}
      <section className="py-24 px-4 bg-white dark:bg-[#0a0a0a] relative overflow-hidden">

        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-grotesk text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4">
              Success <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EFAD1A] to-amber-500">Stories</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-gray-300 max-w-2xl mx-auto">
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
                <Card className="bg-slate-50 dark:bg-[#1f1f1f] border border-slate-100 dark:border-white/10 hover:border-[#EFAD1A] transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full">
                  <CardContent className="p-8">
                    {/* Rating Stars */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(story.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-slate-600 dark:text-gray-300 mb-6 italic leading-relaxed">
                      "{story.quote}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-white/10">
                      <img
                        src={story.image}
                        alt={story.name}
                        className="w-14 h-14 rounded-full border-2 border-[#EFAD1A]"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{story.name}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{story.role}</p>
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
      <section className="py-24 px-4 bg-gradient-to-br from-amber-50 via-white to-yellow-50/30 dark:from-[#1a1a1a] dark:via-black dark:to-[#111] relative transition-colors duration-300">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-grotesk text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4">
              Partnership <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-amber-500">Process</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Your journey to becoming a FlashSpace partner in 5 simple steps
            </p>
          </motion.div>

          <div className="relative">
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
                    <div className="absolute -top-3 -right-3 bg-white border-4 border-yellow-400 rounded-full w-10 h-10 flex items-center justify-center font-bold text-slate-900 z-20">
                      {step.step}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-24 px-4 bg-white dark:bg-black transition-colors duration-300">
        {/* 🟢 FORM stays inside narrow container */}
        <div className="container mx-auto max-w-4xl">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="font-grotesk text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4"

            >
              Let's Build{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-amber-500">
                Together
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Fill out the form below and our partnership team will reach out to you
              within 24 hours
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="border-2 border-gray-100 dark:border-white/10 shadow-2xl hover:shadow-yellow-400/20 transition-shadow duration-300 bg-white dark:bg-[#1a1a1a]">
              <CardContent className="p-8 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2"
                      >
                        <Users className="w-4 h-4" />
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="John Doe"
                        className="border-gray-300 dark:border-white/20 dark:bg-black/30 dark:text-white focus:border-yellow-400 focus:ring-yellow-400/20 h-12"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="john@example.com"
                        className="border-gray-300 dark:border-white/20 dark:bg-black/30 dark:text-white focus:border-yellow-400 focus:ring-yellow-400/20 h-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                        className="border-gray-300 dark:border-white/20 dark:bg-black/30 dark:text-white focus:border-yellow-400 focus:ring-yellow-400/20 h-12"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="company"
                        className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2"
                      >
                        <Building2 className="w-4 h-4" />
                        Company Name
                      </Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        placeholder="Your Company"
                        className="border-gray-300 dark:border-white/20 dark:bg-black/30 dark:text-white focus:border-yellow-400 focus:ring-yellow-400/20 h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="partnershipType"
                      className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2"
                    >
                      <Handshake className="w-4 h-4" />
                      Partnership Type *
                    </Label>
                    <select
                      id="partnershipType"
                      value={formData.partnershipType}
                      onChange={(e) =>
                        handleInputChange("partnershipType", e.target.value)
                      }
                      className="w-full h-12 px-4 border border-gray-300 dark:border-white/20 rounded-md focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 bg-white dark:bg-black/30 dark:text-white"
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
                    <Label
                      htmlFor="message"
                      className="text-gray-700 dark:text-gray-300 font-medium"
                    >
                      Tell us more about your requirements
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Share your goals, property details, or any questions you have..."
                      className="border-gray-300 dark:border-white/20 dark:bg-black/30 dark:text-white focus:border-yellow-400 focus:ring-yellow-400/20 min-h-[140px]"
                      rows={5}
                    />
                  </div>

                  <div className="flex justify-center pt-6">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="group bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-900 px-12 py-7 text-lg rounded-full font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"

                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Partnership Request
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div> {/* ✅ Closed container here */}

        {/* 🟢 Contact Info Cards — moved OUTSIDE container for full width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-16 px-6 md:px-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 isolate bg-gray-100 dark:bg-[#111] py-12 px-8 rounded-3xl shadow-inner transition-colors duration-300">
            {[
              {
                icon: Phone,
                label: "Call Us",
                value: "+91 XXX XXX XXXX",
                gradient: "from-blue-500 to-blue-600",
              },
              {
                icon: Mail,
                label: "Email Us",
                value: "partners@flashspace.com",
                gradient: "from-purple-500 to-purple-600",
              },
              {
                icon: MapPin,
                label: "Visit Us",
                value: "Pan India Presence",
                gradient: "from-pink-500 to-pink-600",
              },
            ].map((contact, index) => (
              <motion.div
                key={index}
                className="relative z-0 group flex items-center gap-4 p-8 bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-lg hover:shadow-2xl
                     transition-all duration-300 border border-gray-200 dark:border-white/10 hover:border-yellow-400 hover:z-10 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div
                  className={`p-4 bg-gradient-to-br ${contact.gradient} rounded-lg shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <contact.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    {contact.label}
                  </p>
                  <p className="font-bold text-slate-900 text-sm md:text-base whitespace-nowrap">
                    {contact.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
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
            <h2 className="font-grotesk text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to Grow Together?
            </h2>
            <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
              Join hundreds of successful partners who are transforming the workspace industry with FlashSpace
            </p>
            <Button
              onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-900 px-12 py-7 text-lg rounded-full font-bold shadow-2xl hover:shadow-yellow-500/50 hover:scale-110 transition-all duration-300"

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
