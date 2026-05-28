import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

import { Link } from "react-router-dom";

// Using high-quality placeholder as requested
const featureBusinessSetup = "/home6.png";

export const BusinessSetupSection = () => {
    return (
        <section id="business-setup" className="py-12 lg:py-16 border-t border-border/50">
            <div className="space-y-10">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1F2E26]/90 via-[#1F2E26]/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                        <span className="text-[#FEF8C5] text-sm font-bold uppercase tracking-widest mb-2 block">Business Setup</span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#FEF8C5] leading-tight tracking-tight">
                            Launch your business
                            <br />
                            <span className="text-[#FEF8C5]/70 font-bold">in any city, hassle-free.</span>
                        </h2>
                    </div>
                </motion.div>

                {/* Description */}
                <div className="max-w-2xl">
                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                        From company registration to GST filing, we provide end-to-end business setup services.
                        Get operational in a new city within days, not months.
                    </p>
                    <Link to="/services/business-setup" onClick={() => window.scrollTo(0, 0)}>
                        <Button variant="outline" size="lg" className="group border-primary/30 hover:bg-primary/5 font-semibold">
                            Start your setup
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};