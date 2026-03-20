import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Sparkles, Zap, Shield, BarChart3, MessageSquare, Bot, Clock } from "lucide-react";

import { Link } from "react-router-dom";

// Using high-quality placeholders as requested
const officeIllustrated = "/ai-workspace-office.png";

const capabilities = [
    { id: "booking", label: "Smart Booking", icon: Zap, active: true },
    { id: "compliance", label: "Compliance", icon: Shield, active: false },
    { id: "access", label: "Access Control", icon: Sparkles, active: false },
    { id: "analytics", label: "Analytics", icon: BarChart3, active: false },
];

export const AISection = () => {
    return (
        <section id="ai-platform" className="py-12 lg:py-16">
            <div className="space-y-10">
                {/* AI Hero banner */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative rounded-3xl overflow-hidden illustrated-overlay"
                >
                    <img
                        src={officeIllustrated}
                        alt="Premium private office illustration"
                        className="w-full h-[400px] lg:h-[500px] object-cover"
                    />
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

                {/* Description & Capabilities */}
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    <div>
                        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                            Flash AI works with your entire business ecosystem, from AI-powered chat that answers every query instantly,
                            to intelligent forecasting for renewals, smart recommendation engines, and beyond. One platform. End-to-end
                            intelligence.
                        </p>
                        <Link to="/start-chatting">
                            <Button variant="outline" size="lg" className="group border-primary/30 hover:bg-primary/5 font-semibold">
                                Learn more
                                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </Button>
                        </Link>
                    </div>

                    <div>
                        <div className="text-sm text-primary uppercase tracking-wider mb-4 font-semibold">
                            Capabilities
                        </div>
                        <h3 className="text-xl lg:text-2xl font-medium text-foreground mb-6 tracking-tight">
                            Built to handle the most complex requirements.
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {capabilities.map((cap) => (
                                <button
                                    key={cap.id}
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${cap.active
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                                        }`}
                                >
                                    <cap.icon className="w-4 h-4" />
                                    {cap.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Product mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border"
                >
                    <div className="grid lg:grid-cols-3">
                        {/* Chat panel */}
                        <div className="lg:col-span-2 p-6 border-r border-border">
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center text-white font-bold">AP</div>
                                    <div>
                                        <span className="font-semibold text-foreground block">Amit Patel</span>
                                        <span className="text-xs text-muted-foreground">Mumbai HQ • Hot Desk</span>
                                    </div>
                                </div>
                                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">✓ Active</span>
                            </div>

                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent/70 flex-shrink-0" />
                                    <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 max-w-sm">
                                        <p className="text-sm text-foreground">Hi, I need to book a meeting room for 10 people tomorrow afternoon. Is there anything available?</p>
                                    </div>
                                </div>
                                <div className="ml-11 flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">1m ago</span>
                                </div>
                                <div className="flex gap-3 justify-end">
                                    <div className="bg-primary/10 border border-primary/20 rounded-2xl rounded-tr-sm px-4 py-3 max-w-md">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Bot className="w-4 h-4 text-primary" />
                                            <span className="text-xs font-semibold text-primary">Flash AI</span>
                                        </div>
                                        <p className="text-sm text-foreground">I found 3 meeting rooms available tomorrow 2-5 PM. Conference Room A (12 seats) has video conferencing. Shall I book it?</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Details panel */}
                        <div className="p-6 bg-muted/30">
                            <div className="flex items-center gap-4 mb-6">
                                <button className="text-sm font-semibold text-foreground border-b-2 border-primary pb-1">Details</button>
                                <button className="text-sm text-muted-foreground font-medium">AI Assist</button>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MessageSquare className="w-4 h-4 text-primary" />
                                        <h4 className="font-semibold text-foreground">Booking Request</h4>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Meeting room for 10 people. Suggested: Conference Room A with VC setup.
                                    </p>
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
            </div>
        </section>
    );
};