import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Search,
  ArrowRight,
  ArrowUpRight,
  Mic,
  Send,
  Wifi,
  Coffee,
  Users,
  Monitor,
  Calendar,
  Clock,
  CreditCard,
  Sparkles,
  Zap,
  Shield,
  BarChart3,
  MessageSquare,
  Bot,
  Play,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { Stats } from "@/components/sections/Stats";
import { FounderTestimonial } from "@/components/sections/FounderTestimonial";

import { CTA } from "@/components/sections/CTA";

const featureCoworking = "/home4.jpg";
const featureDayPasses = "/home10.jpg";
const featureMeetingRooms = "/coworking-meeting-room.jpg";
const officeIllustrated = "/home9.png";
const videoTestimonial = "/business-setup-illustrated.jpg";

const availableCities = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Chandigarh",
  "Kochi",
  "Indore",
  "Nagpur",
  "Coimbatore",
];

const logos = [
  { src: "/Logo/flipkart.png", alt: "Flipkart", className: "h-12" },
  { src: "/Logo/trulymadly.png", alt: "TrulyMadly", className: "h-12" },
  { src: "/Logo/Stage2.png", alt: "Stage", className: "h-10" },
  { src: "/Logo/StudyIQ.png", alt: "StudyIQ", className: "h-10" },
  { src: "/Logo/Adda247.png", alt: "Adda247", className: "h-12" },
  { src: "/Logo/luv.png", alt: "Luv Films", className: "h-12" },
];

const sidebarItems = [
  { id: "features", label: "Features" },
  { id: "amenities", label: "Amenities" },
  { id: "ai", label: "AI Platform" },
];

const coworkingFeatures = [
  { icon: Users, title: "Hot Desks", desc: "Drop in and get to work — flexible seating across all locations with day pass or monthly access." },
  { icon: Monitor, title: "Dedicated Desks", desc: "Your own permanent desk with storage, 24/7 access, and exclusive member benefits." },
  { icon: Calendar, title: "Meeting Rooms", desc: "Book professional meeting rooms by the hour — fully equipped with AV and video conferencing." },
  { icon: Coffee, title: "Community & Events", desc: "Join a thriving community of founders, freelancers, and remote teams. Attend events and workshops." },
];

const amenities = [
  { icon: Wifi, label: "High-speed WiFi" },
  { icon: Coffee, label: "Pantry & Café" },
  { icon: Users, label: "Community Events" },
  { icon: Monitor, label: "Ergonomic Setup" },
];

const aiCapabilities = [
  { id: "booking", label: "Smart Booking", icon: Zap, active: true },
  { id: "compliance", label: "Compliance", icon: Shield, active: true },
  { id: "access", label: "Access Control", icon: Sparkles, active: true },
  { id: "analytics", label: "Analytics", icon: BarChart3, active: true },
];

const CoworkingSpace = () => {
  useEffect(() => {
    document.title = "Coworking Space - FlashSpace";
  }, []);
  const navigate = useNavigate();
  const [active, setActive] = useState("features");
  const [cityQuery, setCityQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const filteredCities = cityQuery.length > 0
    ? availableCities.filter((c) => c.toLowerCase().includes(cityQuery.toLowerCase()))
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const assignRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  const scrollTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAF7" }}>
      <Header />

      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-16 overflow-hidden">
        <div className="relative z-10 mx-auto max-w-3xl text-center px-6">
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-5xl sm:text-6xl lg:text-[4rem] font-medium text-foreground leading-[1.1] mb-6 tracking-[-0.02em]">
            <span className="whitespace-nowrap">High-Performance Coworking</span>
            <br />
            Spaces
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="text-lg text-muted-foreground max-w-[680px] mx-auto mb-10 leading-relaxed">
            Book desks, meeting rooms, and collaborative workspaces instantly — in the best locations across India.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <div ref={searchRef} className="relative">
              <div className="flex items-center h-12 rounded-xl border border-[#D4E0D0] bg-white overflow-hidden shadow-lg" style={{ width: 400, maxWidth: "90vw" }}>
                <button
                  onClick={() => navigate(`/services/coworking-space?city=${encodeURIComponent(cityQuery || "Delhi")}`)}
                  className="p-4 text-muted-foreground hover:text-foreground transition-colors shrink-0"
                >
                  <Search className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  placeholder="Search coworking spaces in your city…"
                  value={cityQuery}
                  onChange={(e) => {
                    setCityQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      navigate(`/services/coworking-space?city=${encodeURIComponent(cityQuery || "Delhi")}`);
                      setShowSuggestions(false);
                    }
                  }}
                  onFocus={() => cityQuery.length > 0 && setShowSuggestions(true)}
                  className="flex-1 h-full px-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none min-w-0"
                />
              </div>
              {showSuggestions && filteredCities.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-foreground/10 rounded-xl shadow-lg z-50 overflow-hidden py-1">
                  {filteredCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setCityQuery(city);
                        setShowSuggestions(false);
                        navigate(`/services/coworking-space?city=${encodeURIComponent(city)}`);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-foreground/5 transition-colors"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button
              size="lg"
              variant="outline"
              className="font-semibold px-8 h-12 rounded-xl border-[#36503F]/30 text-[#36503F] hover:bg-[#F0F4EE] hover:border-[#36503F]/40 bg-transparent"
              onClick={() => navigate(`/services/coworking-space?city=${encodeURIComponent(cityQuery || "Delhi")}`)}
            >
              Explore Spaces <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>
        </div>

      </section>

      <div className="lg:hidden sticky top-16 z-30 bg-white/90 backdrop-blur border-b border-border/40">
        <div className="flex justify-center gap-2 px-4 py-2.5">
          {sidebarItems.map((n) => (
            <button key={n.id} onClick={() => scrollTo(n.id)} className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase transition-colors ${active === n.id ? "bg-[#35503f] text-white" : "text-foreground/50 hover:text-foreground"}`}>{n.label}</button>
          ))}
        </div>
      </div>

      <div className="flex w-full">
        <aside className="hidden lg:block w-[300px] shrink-0">
          <nav className="sticky top-[120px] pl-[max(2rem,calc((100vw-1280px)/2))] pr-[24px] py-12 flex flex-col gap-1">
            {sidebarItems.map((n) => {
              const isActive = active === n.id;
              return (
                <button key={n.id} onClick={() => scrollTo(n.id)} className="flex items-center text-left py-2.5 transition-all duration-200 bg-transparent border-0 outline-none" style={{ color: "#1F1F1F", opacity: isActive ? 1 : 0.6 }}>
                  {isActive && <span className="shrink-0 rounded-full" style={{ width: 8, height: 8, backgroundColor: "#36503F", marginRight: 10 }} />}
                  <span className={`text-[14px] tracking-widest uppercase ${isActive ? "font-medium" : "font-normal"}`}>{n.label.toUpperCase()}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="flex-1 min-w-0">
          <section ref={assignRef("features")} id="features" className="py-12 lg:py-16">
            <div className="space-y-10 px-6 lg:pl-8 lg:pr-[max(2rem,calc((100vw-1280px)/2))]">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative rounded-3xl overflow-hidden">
                <img src={featureCoworking} alt="Coworking space" className="w-full h-[350px] lg:h-[420px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                  <span className="text-white/75 text-sm font-semibold uppercase tracking-wider mb-2 block">Coworking</span>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
                    Flexible desks & cabins
                    <br />
                    <span className="text-white/70">for every team size.</span>
                  </h2>
                </div>
              </motion.div>

              <div className="max-w-2xl">
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  From hot desks to private cabins, find the perfect coworking setup for individuals
                  and teams. Fully furnished, move-in ready spaces with world-class amenities.
                </p>
                <Button
                  variant="outline"
                  size="lg"
                  className="group border-[#36503F]/30 text-[#36503F] hover:bg-[#F0F4EE] font-semibold"
                  onClick={() => navigate(`/services/coworking-space?city=${encodeURIComponent(cityQuery || "Delhi")}`)}
                >
                  Browse Coworking Spaces
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Button>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {coworkingFeatures.map((f, i) => (
                  <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-6 rounded-2xl bg-white border border-[#D4E0D0] flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#F0F4EE] flex items-center justify-center shrink-0">
                      <f.icon className="w-5 h-5 text-[#36503F]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{f.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-wrap gap-8 lg:gap-16 pt-8 border-t border-border/50">
                {[
                  { value: "100+", label: "Coworking locations" },
                  { value: "₹4,999", label: "Starting price/month" },
                  { value: "24/7", label: "Access available" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section ref={assignRef("amenities")} id="amenities" className="py-12 lg:py-16 border-t border-border/50">
            <div className="space-y-10 px-6 lg:pl-8 lg:pr-[max(2rem,calc((100vw-1280px)/2))]">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <span className="text-[#36503F] text-sm font-semibold uppercase tracking-wider mb-3 block">On Demand</span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight tracking-tight mb-4">
                  Book by the hour
                  <br />
                  <span className="text-muted-foreground">or by the day.</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                  Day passes, meeting rooms, and conference spaces — pay only for what you use.
                  Perfect for remote workers and hybrid teams.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-6">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl overflow-hidden border border-border group">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={featureDayPasses} alt="Day passes" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2">Day Pass</h3>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      Drop into any coworking space for a day. Starting at ₹200/day with all amenities included.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Flexible hours</span>
                      <span className="flex items-center gap-1"><CreditCard className="w-4 h-4" /> Pay per use</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="rounded-2xl overflow-hidden border border-border group">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={featureMeetingRooms} alt="Meeting rooms" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2">Meeting Rooms</h3>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      Conference rooms, board rooms, and training spaces. Book by the hour with AV equipment included.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Instant booking</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Hourly rates</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {amenities.map((a, i) => (
                  <motion.div key={a.label} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                    <a.icon className="w-5 h-5 text-[#36503F]" />
                    <span className="text-sm font-medium text-foreground">{a.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section ref={assignRef("ai")} id="ai" className="py-12 lg:py-16 border-t border-border/50">
            <div className="space-y-10 px-6 lg:pl-8 lg:pr-[max(2rem,calc((100vw-1280px)/2))]">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative rounded-3xl overflow-hidden">
                <img src={officeIllustrated} alt="AI workspace platform" className="w-full h-[400px] lg:h-[500px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4">
                    <Sparkles className="w-4 h-4 text-secondary-foreground" />
                    <span className="text-white/90 text-sm font-medium">AI-Powered</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
                    Flash, The #1 AI
                    <br />
                    <span className="text-white/70">for End to End Business Solutions.</span>
                  </h2>
                </div>
              </motion.div>

              <div className="grid lg:grid-cols-2 gap-12 items-start">
                <div>
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    Flash AI works with your entire business ecosystem, from AI-powered chat that answers every query instantly,
                    to intelligent forecasting for renewals, smart recommendation engines, and beyond. One platform. End-to-end
                    intelligence.
                  </p>
                  <Button
                    variant="outline"
                    size="lg"
                    className="group border-[#36503F]/30 text-[#36503F] hover:bg-[#F0F4EE] font-semibold"
                    onClick={() => navigate("/start-chatting")}
                  >
                    Learn more
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Button>
                </div>
                <div>
                  <div className="text-sm text-[#36503F] uppercase tracking-wider mb-4 font-semibold">Capabilities</div>
                  <h3 className="text-xl lg:text-2xl font-medium text-foreground mb-6 tracking-tight">
                    Built to handle the most complex requirements.
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {aiCapabilities.map((cap) => (
                      <div key={cap.id} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-[#36503F] text-[#FEF8C5] shadow-sm cursor-default">
                        <cap.icon className="w-4 h-4" />
                        {cap.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border">
                <div className="grid lg:grid-cols-3">
                  <div className="lg:col-span-2 p-6 border-r border-border">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#36503F] flex items-center justify-center text-white font-bold">AP</div>
                        <div>
                          <span className="font-semibold text-foreground block">Amit Patel</span>
                          <span className="text-xs text-muted-foreground">Mumbai HQ • Hot Desk</span>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 bg-[#F0F4EE] text-[#36503F] rounded-full font-medium">✓ Active</span>
                    </div>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#36503F] flex-shrink-0" />
                        <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 max-w-sm">
                          <p className="text-sm text-foreground">Hi, I need to book a meeting room for 10 people tomorrow afternoon. Is there anything available?</p>
                        </div>
                      </div>
                      <div className="ml-11 flex items-center gap-2">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">1m ago</span>
                      </div>
                      <div className="flex gap-3 justify-end">
                        <div className="bg-[#F0F4EE] border border-[#D4E0D0] rounded-2xl rounded-tr-sm px-4 py-3 max-w-md">
                          <div className="flex items-center gap-2 mb-2">
                            <Bot className="w-4 h-4 text-[#36503F]" />
                            <span className="text-xs font-semibold text-[#36503F]">Flash AI</span>
                          </div>
                          <p className="text-sm text-foreground">I found 3 meeting rooms available tomorrow 2-5 PM. Conference Room A (12 seats) has video conferencing. Shall I book it?</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-muted/30">
                    <div className="flex items-center gap-4 mb-6">
                      <button className="text-sm font-semibold text-foreground border-b-2 border-[#36503F] pb-1">Details</button>
                      <button className="text-sm text-muted-foreground font-medium">AI Assist</button>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-[#F0F4EE] border border-[#D4E0D0] rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="w-4 h-4 text-[#36503F]" />
                          <h4 className="font-semibold text-foreground">Booking Request</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">Meeting room for 10 people. Suggested: Conference Room A with VC setup.</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Location</span>
                          <span className="text-foreground font-medium">Mumbai, MH</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Plan</span>
                          <span className="text-foreground font-medium">Enterprise</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Bookings (MTD)</span>
                          <span className="text-foreground font-bold">24</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative rounded-3xl overflow-hidden group cursor-pointer">
                <img src={videoTestimonial} alt="Customer testimonial" className="w-full h-[400px] object-cover object-center transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-foreground/40" />
                <div className="absolute top-8 left-8"><span className="text-white/80 font-semibold tracking-wider">TECHSTART</span></div>

              </motion.div>

              <blockquote className="max-w-3xl">
                <p className="text-2xl lg:text-3xl font-semibold text-foreground leading-snug mb-6 tracking-tight">
                  "If you&apos;re debating whether to build your own workspace solution
                  or use FlashSpace, my advice would be to use FlashSpace—it&apos;s
                  transformed how we operate."
                </p>
                <footer className="flex items-center gap-4">
                  <img src="/hero-illustrated.jpg" alt="Rajesh Kumar" className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20" />
                  <div>
                    <div className="font-semibold text-foreground">Rajesh Kumar</div>
                    <div className="text-sm text-muted-foreground">CEO at TechStart India</div>
                  </div>
                </footer>
              </blockquote>
            </div>
          </section>
        </div>
      </div>


      <Stats />
      <FounderTestimonial />

      <CTA />
      <Footer />
    </div>
  );
};

export default CoworkingSpace;
