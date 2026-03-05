import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  TrendingUp,
  Globe,
  Headphones,
  BarChart3,
  Shield,
  CheckCircle2,
  ArrowRight,
  FileText,
  BadgeCheck,
  Coins,
  Zap,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { submitPartnerInquiry } from "@/services/partnerInquiry.service";
import MeetingBookingModal from "@/components/ui/MeetingBookingModal";

const benefits = [
  {
    icon: TrendingUp,
    title: "Maximize Occupancy",
    description:
      "Fill empty desks and rooms with our network of verified professionals and enterprises.",
  },
  {
    icon: Globe,
    title: "Pan-India Reach",
    description:
      "Get discovered by businesses across India through our platform and sales team.",
  },
  {
    icon: BarChart3,
    title: "AI-Powered Insights",
    description:
      "Access real-time analytics on demand trends, pricing, and occupancy optimization.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description:
      "A dedicated account manager and 24/7 support to help you grow your business.",
  },
  {
    icon: Shield,
    title: "Verified Clients",
    description:
      "All clients are verified through our platform, so you can focus on delivering great experiences.",
  },
  {
    icon: Building2,
    title: "Flexible Listing",
    description:
      "List hot desks, private offices, meeting rooms, or virtual office plans — your call.",
  },
];

const stats = [
  { value: "500+", label: "Partner Spaces" },
  { value: "68+", label: "Cities" },
  { value: "95%", label: "Partner Retention" },
  { value: "3x", label: "Average Revenue Lift" },
];

const fadeInProps = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease: "easeOut" },
} as const;

const staggerContainerProps = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-100px" },
  transition: { staggerChildren: 0.1 },
} as const;

const PartnerWithUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    spaceName: "",
    city: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitPartnerInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.spaceName,
        partnershipType: "Workspace Partner",
        message: `City: ${formData.city}. ${formData.message}`,
      });

      toast.success(
        "Thank you for your interest! Our partnership team will contact you within 24 hours.",
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        spaceName: "",
        city: "",
        message: "",
      });
    } catch (error: any) {
      console.error("Partnership submission error:", error);
      toast.error(
        error.message ||
        "Failed to submit partnership request. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white transition-colors duration-300">
      <Header />
      <main>
        {/* Hero Section - Centered and Premium */}
        <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-32 overflow-hidden illustrated-bg">
          <div className="container mx-auto px-4 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-[#334d3d] text-sm font-semibold mb-8 shadow-sm"
              >
                <Zap className="w-4 h-4" />
                <span>India's #1 Workspace Network</span>
              </motion.div>

              <h1 className="text-5xl lg:text-8xl font-medium tracking-tight mb-8 leading-[1.05] text-[#1A1A1A]">
                Partner with us. <br />
                <span className="text-[#334d3d]">Grow your business.</span>
              </h1>

              <p className="text-lg lg:text-2xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-normal">
                Join our network of verified professionals. List your space,
                reach thousands of clients, and leverage our AI-powered growth
                tools.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                <Button
                  onClick={() =>
                    document
                      .getElementById("partner-form")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  size="lg"
                  className="bg-[#334d3d] text-white hover:bg-[#26392d] font-bold px-10 h-14 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
                >
                  List Your Space <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  onClick={() => setIsMeetingModalOpen(true)}
                  size="lg"
                  variant="ghost"
                  className="font-semibold px-8 h-14 rounded-2xl text-slate-600 hover:text-[#334d3d] hover:bg-slate-50 transition-all duration-300"
                >
                  Talk to Our Team
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section - Clean and Glassy */}
        <section className="py-12 border-y border-border organic-bg overflow-hidden">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.3 }}
              variants={{
                initial: { opacity: 0 },
                animate: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.15,
                  },
                },
              }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  variants={{
                    initial: { opacity: 0, y: 30, filter: "blur(10px)" },
                    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="text-center group"
                >
                  <div className="text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-2 group-hover:text-[#334d3d] transition-colors duration-300">
                    {stat.value}
                  </div>
                  <div className="text-xs lg:text-sm text-slate-400 font-bold uppercase tracking-widest">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Benefits Section - Glassy Cards */}
        <section className="py-24 lg:py-32 organic-bg relative">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div {...fadeInProps} className="mb-20 text-center">
              <h2 className="text-4xl lg:text-5xl font-bold text-[#1A1A1A] tracking-tight mb-6">
                Why partner with us?
              </h2>
              <p className="text-slate-500 text-xl max-w-2xl mx-auto leading-relaxed">
                We provide the technology, reach, and support you need to scale
                your workspace business effortlessly.
              </p>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.1 }}
              variants={{
                initial: { opacity: 0 },
                animate: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {benefits.map((b, i) => {
                const Icon = b.icon;
                return (
                  <motion.div
                    key={b.title}
                    variants={{
                      initial: {
                        opacity: 0,
                        y: 50,
                        x: i % 3 === 0 ? -20 : i % 3 === 2 ? 20 : 0,
                      },
                      animate: { opacity: 1, y: 0, x: 0 },
                    }}
                    transition={{
                      duration: 0.8,
                      ease: [0.21, 0.47, 0.32, 0.98],
                    }}
                    whileHover={{ y: -8 }}
                    className="p-10 rounded-3xl border border-border glass-card hover:bg-primary/[0.02] hover:border-primary/20 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#334d3d]/[0.03] rounded-bl-full -mr-10 -mt-10 group-hover:bg-[#334d3d]/[0.08] transition-colors duration-500" />

                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-[#334d3d] transition-all duration-500">
                      <Icon className="w-7 h-7 text-[#334d3d] group-hover:text-white transition-colors duration-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">
                      {b.title}
                    </h3>
                    <p className="text-slate-500 text-lg leading-relaxed">
                      {b.description}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* How it works Section - Minimalist Timeline */}
        <section className="py-24 organic-bg relative overflow-hidden">
          <div className="container mx-auto px-4 lg:px-8 relative z-10 w-full">
            <motion.div {...fadeInProps} className="text-center mb-24">
              <h2 className="text-4xl lg:text-5xl font-bold text-[#1A1A1A] tracking-tight">
                How it works
              </h2>
            </motion.div>

            <div className="relative max-w-5xl mx-auto">
              {/* Connector lines animation */}
              <div className="hidden lg:block absolute top-[28px] left-[15%] right-[15%] z-0">
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                  style={{ originX: 0 }}
                  className="h-[2px] bg-gradient-to-r from-slate-100 via-[#334d3d]/20 to-slate-100 w-full"
                />
              </div>

              <motion.div
                {...staggerContainerProps}
                className="grid lg:grid-cols-3 gap-12 relative z-10"
              >
                {[
                  {
                    step: "01",
                    title: "Apply",
                    desc: "Fill out the form below with your workspace details.",
                    Icon: FileText,
                  },
                  {
                    step: "02",
                    title: "Onboard",
                    desc: "Our team verifies and lists your space within 48 hours.",
                    Icon: BadgeCheck,
                  },
                  {
                    step: "03",
                    title: "Earn",
                    desc: "Start receiving bookings and grow your revenue.",
                    Icon: Coins,
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.step}
                    variants={{
                      initial: { opacity: 0, y: 30, scale: 0.95 },
                      whileInView: { opacity: 1, y: 0, scale: 1 },
                    }}
                    whileHover={{ y: -5 }}
                    className="flex flex-col items-center text-center group cursor-default"
                  >
                    <motion.div
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      className="w-14 h-14 rounded-full bg-white flex items-center justify-center mb-8 border border-slate-100 shadow-sm group-hover:border-[#334d3d]/30 group-hover:shadow-md transition-all duration-300 relative z-10"
                    >
                      <item.Icon className="w-6 h-6 text-[#334d3d]" />
                    </motion.div>

                    <motion.span
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.2 + i * 0.2 }}
                      className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em] mb-3 group-hover:text-[#334d3d] transition-colors"
                    >
                      Step {item.step}
                    </motion.span>

                    <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4 group-hover:translate-y-[-2px] transition-transform duration-300">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 leading-relaxed text-base max-w-[240px] group-hover:text-slate-600 transition-colors">
                      {item.desc}
                    </p>

                    {/* Hover Glow Effect */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#334d3d]/[0.02] rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Partner Form Section - Column Layout matching image */}
        <section className="py-24 lg:py-32 organic-bg" id="partner-form">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-[1fr,1.2fr] gap-16 lg:gap-24 items-start">
              {/* Left Column */}
              <motion.div
                initial={{ opacity: 1, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-5xl lg:text-7xl font-bold text-[#1a2d1d] tracking-tight mb-6">
                  List your space today
                </h2>
                <p className="text-[#334d3d] text-xl lg:text-2xl leading-relaxed mb-12">
                  Fill in your details and our partnership team will get in touch
                  within 24 hours.
                </p>

                <div className="space-y-6 mb-16">
                  {[
                    "Zero listing fees — we only earn when you do",
                    "Full control over pricing and availability",
                    "Dashboard to manage bookings and clients",
                    "Marketing support and premium placement",
                  ].map((point, i) => (
                    <motion.div
                      key={point}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                      className="flex items-center gap-5"
                    >
                      <div className="w-7 h-7 rounded-full border-[#1a2d1d]/30 border flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-[#1a2d1d]" />
                      </div>
                      <span className="text-lg text-[#1a2d1d] font-medium">
                        {point}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="grid grid-cols-2 gap-4"
                >
                  {[
                    { value: "48hrs", label: "Average Onboarding" },
                    { value: "95%", label: "Partner Retention" },
                    { value: "3x", label: "Revenue Uplift" },
                    { value: "24/7", label: "Support Available" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="bg-[#FEFCE8] rounded-[2rem] p-8 text-center flex flex-col justify-center items-center shadow-sm"
                    >
                      <div className="text-3xl font-bold text-[#334d3d] mb-1">
                        {s.value}
                      </div>
                      <div className="text-sm text-[#334d3d] font-medium leading-tight">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Right Column - Form Container */}
              <motion.div
                initial={{ opacity: 1, y: 20, scale: 1 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white border border-black/20 rounded-[2.5rem] p-8 lg:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden"
              >
                {/* Subtle Form Background Glow */}
                {/* <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#334d3d]/[0.03] blur-[60px] rounded-full pointer-events-none" /> */}

                <form
                  onSubmit={handleSubmit}
                  className="space-y-6 relative z-10  "
                >
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2.5">
                      <label className="text-base font-semibold text-[#1A1A1A]">
                        Your Name
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="John Doe"
                        required
                        className="h-14 bg-[#F8F9FA] border border-slate-200 rounded-2xl focus-visible:ring-1 focus-visible:ring-[#334d3d] transition-all placeholder:text-slate-400"
                      />
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-base font-semibold text-[#1A1A1A]">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="john@workspace.com"
                        required
                        className="h-14 bg-[#F8F9FA] border border-slate-200 rounded-2xl focus-visible:ring-1 focus-visible:ring-[#334d3d] transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2.5">
                      <label className="text-base font-semibold text-[#1A1A1A]">
                        Phone
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="+91 98765 43210"
                        required
                        className="h-14 bg-[#F8F9FA] border border-slate-200 rounded-2xl focus-visible:ring-1 focus-visible:ring-[#334d3d] transition-all placeholder:text-slate-400"
                      />
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-base font-semibold text-[#1A1A1A]">
                        Space Name
                      </label>
                      <Input
                        value={formData.spaceName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            spaceName: e.target.value,
                          })
                        }
                        placeholder="Your Workspace Name"
                        required
                        className="h-14 bg-[#F8F9FA] border border-slate-200 rounded-2xl focus-visible:ring-1 focus-visible:ring-[#334d3d] transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-base font-semibold text-[#1A1A1A]">
                      City
                    </label>
                    <Input
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      placeholder="e.g. Delhi, Mumbai, Bangalore"
                      required
                      className="h-14 bg-[#F8F9FA] border border-slate-200 rounded-2xl focus-visible:ring-1 focus-visible:ring-[#334d3d] transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-base font-semibold text-[#1A1A1A]">
                      Message (optional)
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Tell us about your space..."
                      rows={5}
                      className="bg-[#F8F9FA] border border-slate-200 rounded-2xl focus-visible:ring-1 focus-visible:ring-[#334d3d] transition-all p-4 placeholder:text-slate-400"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#334d3d] text-[#FDE68A] hover:bg-[#26392d] h-16 rounded-2xl font-bold text-lg shadow-xl shadow-[#334d3d]/20 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      "Submitting..."
                    ) : (
                      <>
                        Submit Application <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <MeetingBookingModal
        isOpen={isMeetingModalOpen}
        onClose={() => setIsMeetingModalOpen(false)}
        item={{ name: "Partnership Team", address: "Online Call" } as any}
      />
      <Footer />
    </div>
  );
};

export default PartnerWithUs;
