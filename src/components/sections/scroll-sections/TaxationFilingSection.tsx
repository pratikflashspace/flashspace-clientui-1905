import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

import { Link } from "react-router-dom";

const featureImage = "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2071&auto=format&fit=crop";

export const TaxationFilingSection = () => {
    return (
        <section id="taxation-filing" className="py-12 lg:py-16 border-t border-border/50">
            <div className="space-y-10">
                {/* Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative rounded-xl overflow-hidden"
                >
                    <img
                        src={featureImage}
                        alt="Taxation and Filing services"
                        className="w-full h-[350px] lg:h-[420px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1F2E26]/90 via-[#1F2E26]/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 lg:p-12">
                        <span className="text-[#FEF8C5] text-xs sm:text-sm font-bold uppercase tracking-widest mb-1 sm:mb-2 block">Taxation & Filing</span>
                        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#FEF8C5] leading-tight tracking-tight">
                            Simplify your compliance
                            <br />
                            <span className="text-[#FEF8C5]/70 font-bold">and stay ahead always.</span>
                        </h2>
                    </div>
                </motion.div>

                {/* Description */}
                <div className="max-w-2xl px-5 sm:px-0 text-justify sm:text-left mx-auto sm:mx-0">
                    <p className="text-[15px] sm:text-lg text-muted-foreground mb-6 leading-relaxed">
                        Navigate complex tax regulations with ease. We provide comprehensive taxation and filing services to ensure your business remains compliant and efficient.
                    </p>
                    <Link to="/services/taxation-filing" onClick={() => window.scrollTo(0, 0)}>
                        <Button variant="outline" size="lg" className="group border-primary/30 hover:bg-primary/5 font-semibold w-full sm:w-auto">
                            Explore services
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};
