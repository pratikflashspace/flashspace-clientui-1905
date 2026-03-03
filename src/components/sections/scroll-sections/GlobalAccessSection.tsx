import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

import { Link } from "react-router-dom";

// Using high-quality placeholder as requested
const featureGlobalAccess = "https://images.unsplash.com/photo-1535957998253-26ae1ef29506?auto=format&fit=crop&w=2000&q=80";

export const GlobalAccessSection = () => {
    return (
        <section id="global-access" className="py-12 lg:py-16 border-t border-border/50">
            <div className="space-y-10">
                {/* Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative rounded-3xl overflow-hidden"
                >
                    <img
                        src={featureGlobalAccess}
                        alt="Global workspace access"
                        className="w-full h-[350px] lg:h-[420px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                        <span className="text-primary-foreground/70 text-sm font-semibold uppercase tracking-wider mb-2 block">Global Access</span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
                            One membership.
                            <br />
                            <span className="text-white/70">Work from anywhere in the world.</span>
                        </h2>
                    </div>
                </motion.div>

                {/* Description */}
                <div className="max-w-2xl">
                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                        Access premium workspaces across North America, Europe, Asia-Pacific, and the Middle East — with one unified membership. No extra bookings, no extra fees.
                    </p>
                    <Link to="/city-listing">
                        <Button variant="outline" size="lg" className="group border-primary/30 hover:bg-primary/5 font-semibold">
                            View all locations
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};