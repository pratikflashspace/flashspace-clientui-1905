import React, { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import {
  Globe,
  MessageSquare,
  Zap,
  CheckCircle2,
  LayoutTemplate,
  Rocket,
  ShieldCheck,
  Bot,
  Sparkles,
  Users,
  BarChart,
  Gem,
  Crown,
  MonitorSmartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const features = [
  {
    icon: LayoutTemplate,
    title: "Company Landing Pages",
    description: "Stunning, high-converting landing pages designed to showcase your brand and capture leads effectively.",
  },
  {
    icon: Globe,
    title: "Service Showcases",
    description: "Beautifully structured sections to highlight your services, pricing, and unique value propositions.",
  },
  {
    icon: Bot,
    title: "AI Chatbot Integration",
    description: "A smart, custom-trained AI assistant embedded directly into your site to answer queries 24/7.",
  },
  {
    icon: Sparkles,
    title: "All-in-One Package",
    description: "We handle the design, development, domain setup, hosting, and AI integration. You get a complete, ready-to-launch website.",
  },
];

const chatbotFeatures = [
  {
    icon: Zap,
    title: "Instant Responses",
    description: "Provide immediate answers to customer inquiries without making them wait.",
  },
  {
    icon: Users,
    title: "Lead Generation",
    description: "The AI engages visitors, captures their details, and turns traffic into potential clients.",
  },
  {
    icon: ShieldCheck,
    title: "Custom Knowledge Base",
    description: "Trained exclusively on your company's data, ensuring accurate and brand-aligned responses.",
  },
  {
    icon: BarChart,
    title: "Valuable Insights",
    description: "Analyze chat logs to understand customer pain points and frequently asked questions.",
  },
];

const WebsiteDevelopment = () => {
  useEffect(() => {
    document.title = "Website Development & AI Chatbots | FlashSpace";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Header />
      <main className="flex-1 pb-0">
        
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#f8faf9] to-white pt-32 pb-16 lg:pt-40 lg:pb-24">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 style={{ fontFamily: "'Inter', sans-serif" }} className="text-4xl md:text-6xl font-extrabold text-[#1a2b21] tracking-tight mb-6 max-w-4xl mx-auto leading-[1.1]">
                Stunning Websites Powered by <br className="block md:hidden" /><span style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#36503F]">AI Chatbots</span>
              </h1>
              <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
                We build professional company landing pages, showcase your services, and integrate a smart AI chatbot all in one comprehensive package. 
                <br /><br />
                {/* <strong style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#1a2b21] font-semibold">Transform your online presence from a static brochure into an interactive lead-generation engine.</strong> */}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/packages/premium">
                  <Button style={{ fontFamily: "'Inter', sans-serif" }} size="lg" className="bg-[#36503F] hover:bg-[#2b4032] text-white rounded-full px-8 h-14 text-lg w-full sm:w-auto">
                    View Premium Plan
                  </Button>
                </Link>
                <Link to="/packages/elite">
                  <Button style={{ fontFamily: "'Inter', sans-serif" }} size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg border-2 w-full sm:w-auto hover:bg-[#FEF8CF] hover:text-black transition-colors">
                    Explore Elite Package
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* What We Build Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 style={{ fontFamily: "'Inter', sans-serif" }} className="text-3xl md:text-5xl font-bold text-[#1a2b21] mb-6">
                More Than Just A <span style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#36503F]">Website</span>
              </h2>
              <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-lg text-muted-foreground">
                We provide an end-to-end web presence solution. From showcasing your services to integrating intelligent automation, we handle it all.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-[#f8faf9] p-8 rounded-3xl border border-border/50 hover:shadow-md transition-shadow group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#36503F]/10 flex items-center justify-center mb-6 group-hover:bg-[#36503F] group-hover:text-white transition-colors duration-300 text-[#36503F]">
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-xl font-bold text-[#1a2b21] mb-3">{feature.title}</h3>
                  <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Chatbot Importance Section */}
        <section className="py-24 bg-[#36503F] text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-white/5 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-white/5 rounded-full blur-3xl -ml-40 -mb-40 pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 style={{ fontFamily: "'Inter', sans-serif" }} className="text-3xl md:text-5xl font-bold mb-6">
                  Why Your Website Needs an <span style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#FEF8C5]">AI Chatbot</span>
                </h2>
                <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-xl text-white/80 mb-10 leading-relaxed">
                  In today's fast-paced digital world, visitors expect instant answers. An AI chatbot acts as your hardest-working employee, ensuring no lead slips through the cracks.
                </p>
                <div className="space-y-6">
                  {chatbotFeatures.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-10 h-10 rounded-full bg-[#FEF8C5]/10 flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-[#FEF8C5]" />
                        </div>
                      </div>
                      <div>
                        <h4 style={{ fontFamily: "'Inter', sans-serif" }} className="text-lg font-bold mb-1">{item.title}</h4>
                        <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-white/70">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl"
              >
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 bg-[#FEF8C5] rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-6 h-6 text-[#1a2b21]" />
                    </div>
                    <div>
                      <h4 style={{ fontFamily: "'Inter', sans-serif" }} className="font-bold text-lg">AI Assistant</h4>
                      <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-sm text-white/70">Online 24/7</p>
                    </div>
                  </div>
                  
                  <div style={{ fontFamily: "'Inter', sans-serif" }} className="bg-white/5 rounded-2xl p-4 text-sm text-white/90 ml-auto max-w-[80%] rounded-tr-sm">
                    Hi! How can I help you learn more about our services today?
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif" }} className="bg-[#36503F] rounded-2xl p-4 text-sm text-white max-w-[80%] rounded-tl-sm">
                    I'm looking for business setup services and pricing.
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif" }} className="bg-white/5 rounded-2xl p-4 text-sm text-white/90 ml-auto max-w-[80%] rounded-tr-sm">
                    I can certainly help with that! We offer complete business setup packages starting at competitive rates. Would you like me to schedule a consultation call with our team?
                  </div>
                  
                  <div className="mt-4 flex items-center gap-3">
                    <div style={{ fontFamily: "'Inter', sans-serif" }} className="h-10 bg-white/10 rounded-full flex-1 px-4 flex items-center text-white/50 text-sm">
                      Type your message...
                    </div>
                    <div className="w-10 h-10 bg-[#FEF8C5] rounded-full flex items-center justify-center text-[#1a2b21] hover:bg-white transition-colors cursor-pointer">
                      <Rocket className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Packages Highlight Section */}
        <section className="py-24 bg-[#f8faf9] border-t border-border/50">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 style={{ fontFamily: "'Inter', sans-serif" }} className="text-3xl md:text-5xl font-bold text-[#1a2b21] mb-6">
                Included in our <span style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#36503F]">Top Packages</span>
              </h2>
              <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
                We believe in providing maximum value. That's why complete Website Development, including Domain, Hosting, and AI Chatbot integration, is bundled into our Premium and Elite packages.
              </p>
              
              <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-8 relative z-10 max-w-6xl mx-auto pt-8">
                {/* Premium Plan - Highlighted */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="relative z-20 w-full lg:w-1/3 min-w-[280px]"
                  >
                    {/* Dark Green Crest */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-12 bg-[#36503F] clip-path-badge flex items-center justify-center pt-1 z-30 shadow-xl border-t-2 border-[#FEF8C5]">
                      <Sparkles className="w-5 h-5 text-[#FEF8C5] -mt-2" fill="none" strokeWidth={1.5} />
                    </div>

                    <div
                      className="bg-[#FCFBF8] border-2 border-[#36503F] ring-1 ring-[#36503F]/50 rounded-xl pt-16 pb-16 px-8 text-center shadow-[0_0_25px_rgba(54,80,63,0.35)] flex flex-col h-full relative overflow-hidden scale-[1.03] z-20"
                    >
                      {/* MOST POPULAR Pill */}
                      <div className="mb-6 mx-auto">
                        <span className="bg-[#FEF8C5] text-[#36503F] text-[10px] font-bold px-4 py-1.5 rounded-full tracking-wider uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>
                          Most Popular
                        </span>
                      </div>

                      {/* Icon inside circle */}
                      <div className="w-16 h-16 rounded-full border border-gray-200 flex items-center justify-center mx-auto mb-6 text-[#36503F]">
                        <Gem className="w-8 h-8 text-[#36503F]" />
                      </div>

                      <h3 className="text-base tracking-widest font-bold text-[#36503F] mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>PREMIUM</h3>
                      <div className="w-8 h-[2px] bg-[#36503F] mx-auto mb-6"></div>

                      <ul className="text-gray-600 text-xs leading-relaxed mb-8 flex-grow space-y-4 flex flex-col w-fit mx-auto text-left px-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                        <li style={{ fontFamily: "'Inter', sans-serif" }} className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-[#36503F]" /> Website Development
                        </li>
                        <li style={{ fontFamily: "'Inter', sans-serif" }} className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-[#36503F]" /> Free Domain & Hosting
                        </li>
                        <li style={{ fontFamily: "'Inter', sans-serif" }} className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-[#36503F]" /> AI Chatbot Integration
                        </li>
                      </ul>

                      <div className="mb-8">
                        <span className="text-4xl font-serif text-[#36503F]" style={{ fontFamily: "'Inter', sans-serif" }}>₹14999</span>
                      </div>

                      <Link to="/packages/premium" className="w-full">
                        <button 
                          className="w-full py-3.5 px-6 rounded-md text-xs font-bold tracking-wider transition-all duration-300 bg-[#36503F] text-[#FEF8C5] hover:bg-[#25362B] shadow-md uppercase"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          View Details
                        </button>
                      </Link>
                    </div>
                </motion.div>

                {/* Elite Plan - Highlighted */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="relative z-20 w-full lg:w-1/3 min-w-[280px]"
                  >
                    {/* Dark Green Crest */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-12 bg-[#36503F] clip-path-badge flex items-center justify-center pt-1 z-30 shadow-xl border-t-2 border-[#FEF8C5]">
                      <Crown className="w-5 h-5 text-[#FEF8C5] -mt-2" fill="none" strokeWidth={1.5} />
                    </div>

                    <div
                      className="bg-[#FCFBF8] border-2 border-[#36503F] ring-1 ring-[#36503F]/50 rounded-xl pt-16 pb-16 px-8 text-center shadow-[0_0_25px_rgba(54,80,63,0.35)] flex flex-col h-full relative overflow-hidden scale-[1.03] z-20"
                    >
                      {/* MOST POPULAR Pill */}
                      <div className="mb-6 mx-auto">
                        <span className="bg-[#FEF8C5] text-[#36503F] text-[10px] font-bold px-4 py-1.5 rounded-full tracking-wider uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>
                          Top Choice
                        </span>
                      </div>

                      {/* Icon inside circle */}
                      <div className="w-16 h-16 rounded-full border border-gray-200 flex items-center justify-center mx-auto mb-6 text-[#36503F]">
                        <Crown className="w-8 h-8 text-[#36503F]" />
                      </div>

                      <h3 className="text-base tracking-widest font-bold text-[#36503F] mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>ELITE</h3>
                      <div className="w-8 h-[2px] bg-[#36503F] mx-auto mb-6"></div>

                      <ul className="text-gray-600 text-xs leading-relaxed mb-8 flex-grow space-y-4 flex flex-col w-fit mx-auto text-left px-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                        <li style={{ fontFamily: "'Inter', sans-serif" }} className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-[#36503F]" /> Advanced Web Development
                        </li>
                        <li style={{ fontFamily: "'Inter', sans-serif" }} className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-[#36503F]" /> Free Domain & Hosting
                        </li>
                        <li style={{ fontFamily: "'Inter', sans-serif" }} className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-[#36503F]" /> Advanced AI Chatbot
                        </li>
                      </ul>

                      <div className="mb-8">
                        <span className="text-4xl font-serif text-[#36503F]" style={{ fontFamily: "'Inter', sans-serif" }}>₹24999</span>
                      </div>

                      <Link to="/packages/elite" className="w-full">
                        <button 
                          className="w-full py-3.5 px-6 rounded-md text-xs font-bold tracking-wider transition-all duration-300 bg-[#36503F] text-[#FEF8C5] hover:bg-[#25362B] shadow-md uppercase"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          View Details
                        </button>
                      </Link>
                    </div>
                  </motion.div>

                {/* Custom Plan - Highlighted */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative z-20 w-full lg:w-1/3 min-w-[280px]"
                  >
                    {/* Dark Green Crest */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-12 bg-[#36503F] clip-path-badge flex items-center justify-center pt-1 z-30 shadow-xl border-t-2 border-[#FEF8C5]">
                      <MonitorSmartphone className="w-5 h-5 text-[#FEF8C5] -mt-2" fill="none" strokeWidth={1.5} />
                    </div>

                    <div
                      className="bg-[#FCFBF8] border-2 border-[#36503F] ring-1 ring-[#36503F]/50 rounded-xl pt-16 pb-16 px-8 text-center shadow-[0_0_25px_rgba(54,80,63,0.35)] flex flex-col h-full relative overflow-hidden scale-[1.03] z-20"
                    >
                      {/* MOST POPULAR Pill */}
                      <div className="mb-6 mx-auto">
                        <span className="bg-[#FEF8C5] text-[#36503F] text-[10px] font-bold px-4 py-1.5 rounded-full tracking-wider uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>
                          Custom Only
                        </span>
                      </div>

                      {/* Icon inside circle */}
                      <div className="w-16 h-16 rounded-full border border-gray-200 flex items-center justify-center mx-auto mb-6 text-[#36503F]">
                        <MonitorSmartphone className="w-8 h-8 text-[#36503F]" />
                      </div>

                      <h3 className="text-base tracking-widest font-bold text-[#36503F] mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>CUSTOM</h3>
                      <div className="w-8 h-[2px] bg-[#36503F] mx-auto mb-6"></div>

                      <ul className="text-gray-600 text-xs leading-relaxed mb-8 flex-grow space-y-4 flex flex-col w-fit mx-auto text-left px-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                        <li style={{ fontFamily: "'Inter', sans-serif" }} className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-[#36503F]" /> Custom Web Development
                        </li>
                        <li style={{ fontFamily: "'Inter', sans-serif" }} className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-[#36503F]" /> Tailored Design
                        </li>
                        <li style={{ fontFamily: "'Inter', sans-serif" }} className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-[#36503F]" /> Highly Scalable
                        </li>
                      </ul>

                      <div className="mb-8">
                        <span className="text-3xl font-serif font-bold text-[#36503F]" style={{ fontFamily: "'Inter', sans-serif" }}>Custom Quote</span>
                      </div>

                      <a href="tel:+919888687898" className="w-full">
                        <button 
                          className="w-full py-3.5 px-6 rounded-md text-xs font-bold tracking-wider transition-all duration-300 bg-[#36503F] text-[#FEF8C5] hover:bg-[#25362B] shadow-md uppercase"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          Call Now
                        </button>
                      </a>
                    </div>
                </motion.div>
              </div>

              {/* Custom CSS for the badge shape */}
              <style dangerouslySetInnerHTML={{
                __html: `
                .clip-path-badge {
                  clip-path: polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%);
                }
              `}} />
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-5 sm:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#36503F] rounded-[3rem] p-12 md:p-20 text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -ml-20 -mb-20" />
              
              <div className="relative z-10">
                <h2 style={{ fontFamily: "'Inter', sans-serif" }} className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Ready To Elevate Your Online Presence?
                </h2>
                <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-10 leading-relaxed">
                  Get a stunning website equipped with an intelligent AI chatbot and start converting more visitors into customers.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a href="tel:+919888687898">
                    <Button style={{ fontFamily: "'Inter', sans-serif" }} size="lg" className="bg-[#FEF8C5] hover:bg-white text-[#1a2b21] font-bold rounded-full px-10 h-14 text-lg w-full sm:w-auto shadow-lg hover:shadow-xl transition-all">
                      Talk to our Team
                    </Button>
                  </a>
                  <Link to="/packages/premium">
                    <Button style={{ fontFamily: "'Inter', sans-serif" }} size="lg" variant="outline" className="border-2 border-[#FEF8C5] text-black hover:bg-[#FEF8CF] hover:text-black font-bold rounded-full px-10 h-14 text-lg w-full sm:w-auto transition-all">
                      View Packages
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default WebsiteDevelopment;
