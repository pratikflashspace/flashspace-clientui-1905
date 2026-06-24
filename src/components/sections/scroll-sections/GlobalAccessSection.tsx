import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

import { Link } from "react-router-dom";

// Using high-quality placeholder as requested
const featureGlobalAccess = "https://res.cloudinary.com/davqpypmw/image/upload/v1780035686/flashspace_homepage/ngj0wpxe66hs2xgmutqh.png"
export const GlobalAccessSection = () => {
    return (
        <section id="global-access" className="py-12 lg:py-16 border-t border-border/50" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="space-y-10" style={{ fontFamily: "'Inter', sans-serif" }}>
                {/* Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative rounded-xl overflow-hidden"
                >
                    <img
                        src={featureGlobalAccess}
                        alt="Global workspace access"
                        className="w-full h-[350px] lg:h-[450px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1F2E26]/90 via-[#1F2E26]/40 to-transparent" style={{ fontFamily: "'Inter', sans-serif" }} />
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 lg:p-12" style={{ fontFamily: "'Inter', sans-serif" }}>
                        <span className="text-[#FEF8C5] text-xs sm:text-sm font-bold uppercase tracking-widest mb-1 sm:mb-2 block" style={{ fontFamily: "'Inter', sans-serif" }}>Global Access</span>
                        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#FEF8C5] leading-tight tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
                            One membership.
                            <br />
                            <span className="text-[#FEF8C5]/70 font-bold" style={{ fontFamily: "'Inter', sans-serif" }}>Work from anywhere in the world.</span>
                        </h2>
                    </div>
                </motion.div>

                {/* Description */}
                <div className="max-w-2xl px-5 sm:px-0 text-justify sm:text-left mx-auto sm:mx-0" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <p className="text-[15px] sm:text-lg text-muted-foreground mb-6 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Access premium workspaces across North America, Europe, Asia-Pacific, and the Middle East — with one unified membership. No extra bookings, no extra fees.
                    </p>
                    <Link to="/services/virtual-office" onClick={() => window.scrollTo(0, 0)}>
                        <Button variant="outline" size="lg" className="group border-primary/30 hover:bg-primary/5 font-semibold w-full sm:w-auto">
                            View all locations
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};