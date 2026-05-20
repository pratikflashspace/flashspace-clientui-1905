import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Search,
  ArrowUpRight,
  ChevronDown,
  Sparkles,
  Mail,
  MapPin,
  Phone,
  FileText,
  Shield,
  Building2,
  Zap,
  BarChart3,
  MessageSquare,
  Bot,
  Clock,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { Stats } from "@/components/sections/Stats";
import { FounderTestimonial } from "@/components/sections/FounderTestimonial";

import { CTA } from "@/components/sections/CTA";

const featureVirtualOffice = "/home2.jpg";
const officeIllustrated = "/home9.png";

const popularCities = ["Ahmedabad", "Bangalore", "Chennai", "Delhi", "Gurgaon", "Hyderabad", "Mumbai", "Noida", "Pune"];
const otherCities = ["Agra", "Aluva", "Ambala", "Ambarnath", "Amritsar", "Anand", "Bareja", "Bhagalpur", "Bhilai", "Bhopal", "Bhubaneswar", "Chandigarh", "Coimbatore", "Dehradun", "Dhanbad", "Dharamsala", "Faridabad", "Gandhinagar", "Ghaziabad", "Goa", "Guntur", "Guwahati", "Gwalior", "Haridwar", "Imphal", "Indore", "Jabalpur", "Jaipur", "Jalandhar", "Jammu", "Jamshedpur", "Jodhpur", "Kanpur", "Kochi", "Kolkata", "Lucknow", "Ludhiana", "Meerut", "Mohali", "Mysore", "Nagpur", "Nashik", "Patna", "Raipur", "Rajkot", "Ranchi", "Rohtak", "Surat", "Trivandrum", "Udaipur", "Vadodara", "Vijayawada", "Visakhapatnam"];

const subTabs = [
  { label: "Business Address", icon: Building2, description: "Get a premium business address for GST and company registration" },
  { label: "GST Registration", icon: FileText, description: "Complete GST registration with a virtual office address" },
];

const sidebarItems = [
  { id: "features", label: "Features" },
  { id: "ai", label: "AI Platform" },
];

const voFeatures = [
  { icon: MapPin, title: "Premium Business Address", desc: "Get a prestigious address in top business districts across 100+ cities." },
  { icon: Mail, title: "Mail Handling & Forwarding", desc: "Professional mail management with scanning and forwarding services." },
  { icon: Phone, title: "Dedicated Phone Line", desc: "Local phone number with call answering and forwarding." },
  { icon: FileText, title: "GST & Business Registration", desc: "Use your virtual office address for company registration and compliance." },
];

const aiCapabilities = [
  { id: "booking", label: "Smart Booking", icon: Zap, active: true },
  { id: "compliance", label: "Compliance", icon: Shield, active: true },
  { id: "access", label: "Access Control", icon: Sparkles, active: true },
  { id: "analytics", label: "Analytics", icon: BarChart3, active: true },
];

const VirtualOffice = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState("features");
  const [activeSubTab, setActiveSubTab] = useState(0);
  const [selectedCity, setSelectedCity] = useState("Delhi");
  const [citySearch, setCitySearch] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [aiMode, setAiMode] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const aiInputRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) setShowCityDropdown(false);
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) setShowLocationDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
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

  const currentDescription = subTabs[activeSubTab]?.description || "";

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAF7" }}>
      <Header />

      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-16 overflow-hidden">
        <div className="relative z-10 mx-auto max-w-3xl text-center px-6">
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-4xl sm:text-5xl lg:text-[3.5rem] font-medium text-foreground leading-[1.12] mb-6 tracking-[-0.02em]">
            A Professional Business Address, <span className="text-[#36503F] italic">Anywhere in India.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="text-lg text-muted-foreground max-w-[680px] mx-auto mb-10 leading-relaxed">
            Get a premium business address, mail handling, and compliance support — without leasing a physical office.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="max-w-4xl w-full mx-auto bg-card/95 backdrop-blur-xl rounded-2xl shadow-xl border border-border/30"
          >
            <div className="flex justify-center gap-2 pt-5 pb-3 px-6 flex-wrap">
              {subTabs.map((sub, i) => (
                <button
                  key={sub.label}
                  onClick={() => setActiveSubTab(i)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition-colors ${activeSubTab === i
                    ? "border-[#36503F]/30 bg-[#F0F4EE] text-[#36503F]"
                    : "border-[#D4E0D0] bg-white text-[#6B8F78] hover:text-[#36503F] hover:border-[#36503F]/30"
                    }`}
                >
                  <sub.icon className="w-4 h-4" />
                  {sub.label}
                </button>
              ))}
            </div>

            <p className="text-sm text-muted-foreground px-6 pb-4">{currentDescription}</p>

            <div className="px-6 pb-6">
              <AnimatePresence mode="wait">
                {!aiMode ? (
                  <motion.div
                    key="search-bar"
                    initial={false}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center bg-transparent sm:bg-background rounded-none sm:rounded-xl border-0 sm:border sm:border-border overflow-visible relative gap-3 sm:gap-0"
                  >
                    <div className="flex items-center bg-background rounded-xl border border-border sm:border-0 sm:rounded-none w-full flex-1 shadow-sm sm:shadow-none">
                      <div ref={cityRef} className="relative shrink-0">
                        <button
                          onClick={() => {
                            setShowCityDropdown(!showCityDropdown);
                            setCitySearch("");
                          }}
                          className="flex items-center gap-1 px-5 py-3.5 border-r border-border text-sm"
                        >
                          <span className="font-medium text-foreground">{selectedCity}</span>
                          <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${showCityDropdown ? "rotate-180" : ""}`} />
                        </button>

                        <AnimatePresence>
                          {showCityDropdown && (() => {
                            const q = citySearch.toLowerCase();
                            const filteredPopular = popularCities.filter((c) => c.toLowerCase().includes(q));
                            const filteredOther = otherCities.filter((c) => c.toLowerCase().includes(q));
                            return (
                              <motion.div
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 4 }}
                                transition={{ duration: 0.15 }}
                                className="absolute top-full left-0 mt-1 w-64 bg-card border border-border rounded-xl shadow-xl z-50 max-h-72 overflow-y-auto"
                              >
                                <div className="sticky top-0 bg-card p-2 border-b border-border/50">
                                  <input
                                    type="text"
                                    value={citySearch}
                                    onChange={(e) => setCitySearch(e.target.value)}
                                    placeholder="Search city..."
                                    className="w-full px-3 py-2 text-sm bg-muted/50 rounded-lg outline-none placeholder:text-muted-foreground/50"
                                    autoFocus
                                  />
                                </div>
                                {filteredPopular.length > 0 && (
                                  <>
                                    <div className="px-4 pt-2.5 pb-1 text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Popular Cities</div>
                                    {filteredPopular.map((city) => (
                                      <button key={city} onClick={() => { setSelectedCity(city); setShowCityDropdown(false); }} className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-[#F0F4EE] ${city === selectedCity ? "text-[#36503F] font-medium" : "text-foreground"}`}>
                                        {city}
                                      </button>
                                    ))}
                                  </>
                                )}
                                {filteredOther.length > 0 && (
                                  <>
                                    <div className="px-4 pt-2.5 pb-1 text-[10px] uppercase tracking-widest text-muted-foreground font-medium border-t border-border/50">All Cities</div>
                                    {filteredOther.map((city) => (
                                      <button key={city} onClick={() => { setSelectedCity(city); setShowCityDropdown(false); }} className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-[#F0F4EE] ${city === selectedCity ? "text-[#36503F] font-medium" : "text-foreground"}`}>
                                        {city}
                                      </button>
                                    ))}
                                  </>
                                )}
                                {filteredPopular.length === 0 && filteredOther.length === 0 && (
                                  <div className="px-4 py-6 text-center text-sm text-muted-foreground">No cities found</div>
                                )}
                              </motion.div>
                            );
                          })()}
                        </AnimatePresence>
                      </div>

                      <div ref={locationRef} className="relative flex items-center flex-1 px-4 gap-2">
                        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                        <input
                          type="text"
                          value={locationSearch}
                          onChange={(e) => {
                            setLocationSearch(e.target.value);
                            setShowLocationDropdown(true);
                          }}
                          onFocus={() => {
                            if (locationSearch.length > 0) setShowLocationDropdown(true);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              const q = locationSearch.toLowerCase();
                              const allCities = [...popularCities, ...otherCities];
                              const match = allCities.find((c) => c.toLowerCase().includes(q));
                              const cityToUse = match || selectedCity;
                              setSelectedCity(cityToUse);
                              setLocationSearch("");
                              setShowLocationDropdown(false);
                              navigate(`/get-workspaces?city=${encodeURIComponent(cityToUse)}`);
                            }
                          }}
                          placeholder={`Search virtual offices in ${selectedCity}`}
                          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground py-3.5"
                        />

                        <AnimatePresence>
                          {showLocationDropdown && locationSearch.length > 0 && (() => {
                            const q = locationSearch.toLowerCase();
                            const matchedPopular = popularCities.filter((c) => c.toLowerCase().includes(q));
                            const matchedOther = otherCities.filter((c) => c.toLowerCase().includes(q));
                            if (matchedPopular.length === 0 && matchedOther.length === 0) return null;
                            return (
                              <motion.div
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 4 }}
                                transition={{ duration: 0.15 }}
                                className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto"
                              >
                                {matchedPopular.length > 0 && (
                                  <>
                                    <div className="px-4 pt-2.5 pb-1 text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Popular Cities</div>
                                    {matchedPopular.map((city) => (
                                      <button key={city} onClick={() => { setSelectedCity(city); setLocationSearch(""); setShowLocationDropdown(false); navigate(`/get-workspaces?city=${encodeURIComponent(city)}`); }} className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted/60 transition-colors">
                                        {city}
                                      </button>
                                    ))}
                                  </>
                                )}
                                {matchedOther.length > 0 && (
                                  <>
                                    <div className="px-4 pt-2.5 pb-1 text-[10px] uppercase tracking-widest text-muted-foreground font-medium border-t border-border/50">All Cities</div>
                                    {matchedOther.map((city) => (
                                      <button key={city} onClick={() => { setSelectedCity(city); setLocationSearch(""); setShowLocationDropdown(false); navigate(`/get-workspaces?city=${encodeURIComponent(city)}`); }} className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted/60 transition-colors">
                                        {city}
                                      </button>
                                    ))}
                                  </>
                                )}
                              </motion.div>
                            );
                          })()}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="flex justify-end sm:block">
                      <button
                        onClick={() => {
                          setAiMode(true);
                          setTimeout(() => aiInputRef.current?.focus(), 100);
                        }}
                        className="flex items-center justify-center gap-2 bg-[#36503F] text-[#FEF8C5] px-10 py-3 sm:py-2.5 rounded-xl text-sm font-bold sm:mr-2 hover:bg-[#1F2E26] transition-colors shrink-0 shadow-sm sm:shadow-none"
                      >
                        <Sparkles className="w-4 h-4" />
                        Chat with AI
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="ai-bar"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center bg-transparent sm:bg-background rounded-none sm:rounded-xl border-0 sm:border sm:border-[#36503F]/40 overflow-visible relative sm:shadow-[0_0_12px_-4px_rgba(54,80,63,0.3)] gap-3 sm:gap-0"
                  >
                    <div className="flex items-center bg-background rounded-xl border border-[#36503F]/40 sm:border-0 sm:rounded-none flex-1 shadow-[0_0_12px_-4px_rgba(54,80,63,0.3)] sm:shadow-none">
                      <div className="flex items-center gap-2 px-4 border-r border-border shrink-0">
                        <Sparkles className="w-4 h-4 text-[#36503F]" />
                        <span className="text-sm font-medium text-[#36503F] py-3.5">AI</span>
                      </div>
                      <input
                        ref={aiInputRef}
                        type="text"
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && aiQuery.trim()) navigate(`/start-chatting?q=${encodeURIComponent(aiQuery.trim())}`);
                          if (e.key === "Escape") {
                            setAiMode(false);
                            setAiQuery("");
                          }
                        }}
                        placeholder="Ask AI anything — virtual offices, compliance, plans..."
                        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground px-4 py-3.5"
                      />
                      <button onClick={() => { setAiMode(false); setAiQuery(""); }} className="text-muted-foreground hover:text-foreground text-sm px-3 py-3.5 transition-colors shrink-0">
                        Cancel
                      </button>
                    </div>

                    <div className="flex justify-end sm:block">
                      <button
                        onClick={() => { if (aiQuery.trim()) navigate(`/start-chatting?q=${encodeURIComponent(aiQuery.trim())}`); }}
                        disabled={!aiQuery.trim()}
                        className="flex items-center justify-center gap-2 bg-[#36503F] text-[#FEF8C5] px-5 py-3 sm:py-2.5 rounded-xl text-sm font-bold sm:mr-2 hover:bg-[#1F2E26] transition-colors shrink-0 disabled:opacity-40 shadow-sm sm:shadow-none"
                      >
                        <Search className="w-4 h-4" />
                        Ask AI
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div >
        </div >
      </section >

      <div className="lg:hidden sticky top-16 z-30 bg-white/90 backdrop-blur border-b border-border/40">
        <div className="flex justify-center gap-2 px-4 py-2.5">
          {sidebarItems.map((n) => (
            <button
              key={n.id}
              onClick={() => scrollTo(n.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase transition-colors ${active === n.id ? "bg-[#35503f] text-white" : "text-foreground/50 hover:text-foreground"
                }`}
            >
              {n.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex w-full">
        <aside className="hidden lg:block w-[300px] shrink-0">
          <nav className="sticky top-[120px] pl-10 pr-[24px] py-12 flex flex-col gap-1">
            {sidebarItems.map((n) => {
              const isActive = active === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => scrollTo(n.id)}
                  className="flex items-center text-left py-2.5 transition-all duration-200 bg-transparent border-0 outline-none"
                  style={{ color: "#1F1F1F", opacity: isActive ? 1 : 0.6 }}
                >
                  {isActive && (
                    <span className="shrink-0 rounded-full" style={{ width: 8, height: 8, backgroundColor: "#36503F", marginRight: 10 }} />
                  )}
                  <span className={`text-[14px] tracking-widest uppercase ${isActive ? "font-medium" : "font-normal"}`}>
                    {n.label.toUpperCase()}
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="flex-1 min-w-0">
          <section ref={assignRef("features")} id="features" className="py-12 lg:py-16">
            <div className="space-y-10 px-6 lg:px-8">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative rounded-3xl overflow-hidden">
                <img src={featureVirtualOffice} alt="Virtual office space" className="w-full h-[350px] lg:h-[420px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F2E26]/90 via-[#1F2E26]/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                  <span className="text-[#FEF8C5]/90 text-sm font-semibold uppercase tracking-wider mb-2 block">Virtual Office</span>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
                    A Professional Business Address,
                    <br />
                    <span className="text-[#FEF8C5]">Anywhere in India.</span>
                  </h2>
                </div>
              </motion.div>

              <div className="max-w-2xl">
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Establish your business presence in premium locations without the overhead of a physical office.
                  Perfect for startups, remote teams, and businesses expanding into new markets.
                </p>
                <Button
                  variant="outline"
                  size="lg"
                  className="group bg-[#36503F] text-[#FEF8C5] hover:bg-[#1F2E26] font-bold border-none"
                  onClick={() => navigate("/services/virtual-office")}
                >
                  Explore Virtual Offices
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Button>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {voFeatures.map((f, i) => (
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
                  { value: "100+", label: "Cities covered" },
                  { value: "₹699", label: "Starting price/month" },
                  { value: "2-3 days", label: "Activation time" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section ref={assignRef("ai")} id="ai" className="py-12 lg:py-16 border-t border-border/50">
            <div className="space-y-10 px-6 lg:px-8">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative rounded-3xl overflow-hidden">
                <img src={officeIllustrated} alt="AI workspace platform" className="w-full h-[400px] lg:h-[500px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F2E26]/90 via-[#1F2E26]/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4">
                    <Sparkles className="w-4 h-4 text-[#FEF8C5]" />
                    <span className="text-[#FEF8C5] text-sm font-medium">AI-Powered</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
                    Flash, The #1 AI
                    <br />
                    <span className="text-[#FEF8C5]">for End to End Business Solutions.</span>
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
                    className="group bg-[#36503F] text-[#FEF8C5] hover:bg-[#1F2E26] font-bold border-none"
                    onClick={() => navigate("/start-chatting")}
                  >
                    Learn more
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Button>
                </div>
                <div>
                  <div className="text-sm text-[#36503F] uppercase tracking-wider mb-4 font-semibold">Capabilities</div>
                  <h3 className="text-xl lg:text-2xl font-medium text-foreground mb-6 tracking-tight">Built to handle the most complex requirements.</h3>
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
                          <span className="text-xs text-muted-foreground">Mumbai HQ • Virtual Office</span>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 bg-[#F0F4EE] text-[#36503F] rounded-full font-medium">✓ Active</span>
                    </div>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#36503F] flex-shrink-0" />
                        <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 max-w-sm">
                          <p className="text-sm text-foreground">Hi, I need to check the status of my GST registration. Can you help?</p>
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
                          <p className="text-sm text-foreground">Your GST registration is in progress. Documentation was submitted on Feb 18. Expected approval in 2-3 business days. I&apos;ll notify you once it&apos;s done.</p>
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
                          <h4 className="font-semibold text-foreground">Compliance Status</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">GST registration in progress. All documents verified.</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Location</span><span className="text-foreground font-medium">Mumbai, MH</span></div>
                        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Plan</span><span className="text-foreground font-medium">Growth</span></div>
                        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Mail Items</span><span className="text-foreground font-bold">5</span></div>
                      </div>
                    </div>
                  </div>
                </div>
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

      <section className="py-20 lg:py-32 border-t border-border/50">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
            <span className="text-sm font-semibold text-[#36503F] uppercase tracking-widest mb-3 block">How it works</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight">
              Get started in <span className="text-[#36503F] italic">4 simple steps.</span>
            </h2>
            <p className="text-lg text-muted-foreground mt-4 max-w-xl mx-auto">
              From choosing your plan to going live — we handle the complexity so you can focus on your business.
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-px bg-border lg:-translate-x-px" />

            {[
              {
                step: "01",
                title: "Choose Your Plan & City",
                description: "Select from Business Address, GST Registration, or Mailing Address plans. Pick a premium location across 100+ Indian cities.",
                cardTitle: "Business Address & GST Registration",
                cardText: "Get a prestigious address in a prime commercial district for company registration, branding, and seamless GST registration — with all compliance documentation handled.",
              },
              {
                step: "02",
                title: "Submit Your Documents",
                description: "Upload your KYC documents through our secure portal. Our team verifies everything and begins the setup process immediately.",
                cardTitle: "KYC Verification & Agreement Signing",
                cardText: "Aadhaar, PAN, and company incorporation documents — securely verified within 24 hours. Digitally sign your virtual office agreement with no physical paperwork required.",
              },
              {
                step: "03",
                title: "We Handle the Registration",
                description: "Our compliance team files all necessary registrations with government agencies. Track real-time progress from your dashboard.",
                cardTitle: "GST Filing, NOC & Rent Agreement",
                cardText: "We submit your GST application with all supporting documents and provide your No Objection Certificate and rent agreement — essential for business registration.",
              },
              {
                step: "04",
                title: "Go Live & Start Operating",
                description: "Receive your registered business address, mail handling credentials, and access to your FlashSpace dashboard — all within 48 hours.",
                cardTitle: "Mail, Communications & Dashboard",
                cardText: "Professional mail handling with scanning, forwarding, and real-time notifications. Manage your virtual office, track compliance, and handle mail from a single AI-powered dashboard.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex flex-col lg:flex-row gap-8 lg:gap-16 mb-20 last:mb-0 ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
              >
                <div className="absolute left-6 lg:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#36503F] text-white flex items-center justify-center text-sm font-bold z-10 shadow-lg shadow-[#36503F]/20">
                  {item.step}
                </div>

                <div className={`flex-1 pl-20 lg:pl-0 ${index % 2 === 0 ? "lg:text-right lg:pr-16" : "lg:text-left lg:pl-16"}`}>
                  <h3 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed max-w-md inline-block">
                    {item.description}
                  </p>
                </div>

                <div className={`flex-1 pl-20 lg:pl-0 ${index % 2 === 0 ? "lg:pl-16" : "lg:pr-16"}`}>
                  <motion.div
                    initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="p-5 rounded-2xl bg-white border border-[#D4E0D0] hover:border-[#36503F]/30 transition-colors"
                  >
                    <h4 className="font-semibold text-foreground mb-1.5">{item.cardTitle}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.cardText}</p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-20 pt-12 border-t border-border/50">
            <h3 className="text-2xl font-bold text-foreground mb-3 tracking-tight">Ready to get started?</h3>
            <p className="text-muted-foreground mb-6">Set up your virtual office in under 48 hours.</p>
            <Button
              size="lg"
              className="bg-[#36503F] hover:bg-[#1F2E26] text-[#FEF8C5] font-bold px-8 rounded-xl border-none"
              onClick={() => navigate("/services/virtual-office")}
            >
              Get Started Now
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>
        </div>
      </section>


      <Stats />
      <FounderTestimonial />

      <CTA />
      <Footer />
    </div >
  );
};

export default VirtualOffice;
