import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

import { Link } from "react-router-dom";

// Using high-quality placeholder as requested
const featureVirtualOffice = "/virtual-office-illustrated.jpg";

export const VirtualOfficeSection = () => {
    return (
        <section id="virtual-office" className="py-12 lg:py-16 border-t border-border/50">
            <div className="space-y-10">
                {/* Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative rounded-3xl overflow-hidden"
                >
                    <img
                        src={featureVirtualOffice}
                        alt="Virtual office space"
                        className="w-full h-[350px] lg:h-[420px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                        <span className="text-primary-foreground/70 text-sm font-semibold uppercase tracking-wider mb-2 block">Virtual Office</span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
                            A real business address,
                            <br />
                            <span className="text-white/70">without the real estate.</span>
                        </h2>
                    </div>
                </motion.div>

                {/* Description */}
                <div className="max-w-2xl">
                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                        Establish your business presence in premium locations without the overhead of a physical office.
                        Perfect for startups, remote teams, and businesses expanding into new markets.
                    </p>
                    <Link to="/Solutions/virtual-office">
                        <Button variant="outline" size="lg" className="group border-primary/30 hover:bg-primary/5 font-semibold">
                            Explore Virtual Offices
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};