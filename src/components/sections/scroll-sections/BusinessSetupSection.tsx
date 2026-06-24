import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

import { Link } from "react-router-dom";

// Using high-quality placeholder as requested
const featureBusinessSetup = "https://res.cloudinary.com/davqpypmw/image/upload/v1780035682/flashspace_homepage/dh6bjebpk3xwe3mobsuo.png";

export const BusinessSetupSection = () => {
    return (
        <section id="business-setup" className="py-12 lg:py-16 border-t border-border/50" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="space-y-10" style={{ fontFamily: "'Inter', sans-serif" }}>
                {/* Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative rounded-xl overflow-hidden"
                >
                    <img
                        src={featureBusinessSetup}
                        alt="Business setup services"
                        className="w-full h-[350px] lg:h-[420px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1F2E26]/90 via-[#1F2E26]/40 to-transparent" style={{ fontFamily: "'Inter', sans-serif" }} />
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 lg:p-12" style={{ fontFamily: "'Inter', sans-serif" }}>
                        <span className="text-[#FEF8C5] text-xs sm:text-sm font-bold uppercase tracking-widest mb-1 sm:mb-2 block" style={{ fontFamily: "'Inter', sans-serif" }}>Business Setup</span>
                        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#FEF8C5] leading-tight tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
                            Launch your business
                            <br />
                            <span className="text-[#FEF8C5]/70 font-bold" style={{ fontFamily: "'Inter', sans-serif" }}>in any city, hassle-free.</span>
                        </h2>
                    </div>
                </motion.div>

                {/* Description */}
                <div className="max-w-2xl px-5 sm:px-0 text-justify sm:text-left mx-auto sm:mx-0" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <p className="text-[15px] sm:text-lg text-muted-foreground mb-6 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                        From company registration to GST filing, we provide end-to-end business setup services.
                        Get operational in a new city within days, not months.
                    </p>
                    <Link to="/services/business-setup" onClick={() => window.scrollTo(0, 0)}>
                        <Button variant="outline" size="lg" className="group border-primary/30 hover:bg-primary/5 font-semibold w-full sm:w-auto">
                            Start your setup
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};