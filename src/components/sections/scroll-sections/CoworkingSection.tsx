import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Wifi, Coffee, Users, Monitor } from "lucide-react";

import { Link } from "react-router-dom";

// Using high-quality placeholder as requested
const featureCoworking = "/coworking-illustrated-themed.jpg";

const amenities = [
    { icon: Wifi, label: "High-speed WiFi" },
    { icon: Coffee, label: "Pantry & Café" },
    { icon: Users, label: "Community Events" },
    { icon: Monitor, label: "Ergonomic Setup" },
];

export const CoworkingSection = () => {
    return (
        <section id="coworking" className="py-12 lg:py-16 border-t border-border/50">
            <div className="space-y-10">
                {/* Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative rounded-3xl overflow-hidden"
                >
                    <img
                        src={featureCoworking}
                        alt="Coworking space"
                        className="w-full h-[350px] lg:h-[420px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                        <span className="text-primary-foreground/70 text-sm font-semibold uppercase tracking-wider mb-2 block">Coworking</span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
                            Flexible desks & cabins
                            <br />
                            <span className="text-white/70">for every team size.</span>
                        </h2>
                    </div>
                </motion.div>

                {/* Description + amenities */}
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    <div>
                        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                            From hot desks to private cabins, find the perfect coworking setup for individuals
                            and teams. Fully furnished, move-in ready spaces with world-class amenities.
                        </p>
                        <Link to="/Solutions/coworking-space">
                            <Button variant="outline" size="lg" className="group border-primary/30 hover:bg-primary/5 font-semibold">
                                Browse Coworking Spaces
                                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {amenities.map((a, i) => (
                            <motion.div
                                key={a.label}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border"
                            >
                                <a.icon className="w-5 h-5 text-primary" />
                                <span className="text-sm font-medium text-foreground">{a.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-8 lg:gap-16 pt-8 border-t border-border/50">
                    {[
                        { value: "500+", label: "Coworking locations" },
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
    );
};