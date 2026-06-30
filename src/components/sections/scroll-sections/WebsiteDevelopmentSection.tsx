import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, MonitorSmartphone, Bot, Rocket, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const featureImage = "/homewebsite.png";

const services = [
    { icon: MonitorSmartphone, title: "Responsive Design", desc: "Websites that look perfect on desktops, tablets, and smartphones alike." },
    { icon: Bot, title: "AI Chatbot Integration", desc: "Engage visitors 24/7 with a smart AI chatbot that drives leads and support." },
    { icon: Rocket, title: "SEO & Performance", desc: "Optimized for lightning-fast speeds and high search engine rankings." },
    { icon: ShieldCheck, title: "Secure & Reliable", desc: "Protected with advanced security protocols and reliable hosting solutions." },
];

export const WebsiteDevelopmentSection = () => {
    return (
        <section id="web-development" className="py-12 lg:py-16 border-t border-border/50" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="space-y-12" style={{ fontFamily: "'Inter', sans-serif" }}>
                {/* Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative rounded-xl overflow-hidden"
                >
                    <img
                        src={featureImage}
                        alt="Website Development"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1F2E26]/90 via-[#1F2E26]/40 to-transparent" style={{ fontFamily: "'Inter', sans-serif" }} />
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 lg:p-12" style={{ fontFamily: "'Inter', sans-serif" }}>
                        <span className="text-[#FEF8C5] text-xs sm:text-sm font-bold uppercase tracking-widest mb-1 sm:mb-2 block" style={{ fontFamily: "'Inter', sans-serif" }}>Services</span>
                        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#FEF8C5] leading-tight tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
                            Build your digital presence
                            <br />
                            <span className="text-[#FEF8C5]/70 font-bold" style={{ fontFamily: "'Inter', sans-serif" }}>with modern web experiences.</span>
                        </h2>
                    </div>
                </motion.div>

                {/* Description + Features */}
                <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 items-start px-5 sm:px-0" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <div className="text-justify sm:text-left" style={{ fontFamily: "'Inter', sans-serif" }}>
                        <p className="text-[15px] sm:text-lg text-muted-foreground mb-6 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                            Your website is your ultimate digital storefront. We design and develop high-performance, visually stunning websites that captivate audiences and drive conversions. Let us bring your vision to the web.
                        </p>
                        <Link to="/solutions/website-development" onClick={() => window.scrollTo(0, 0)}>
                            <Button variant="outline" size="lg" className="group border-primary/30 hover:bg-primary/5 font-semibold w-full sm:w-auto">
                                Explore Web Services
                                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {services.map((service, i) => (
                            <motion.div
                                key={service.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-3 sm:p-5 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors"
                            >
                                <service.icon className="w-6 h-6 sm:w-8 sm:h-8 text-[#36503F] mb-2 sm:mb-4" />
                                <h4 className="text-sm sm:text-base font-bold text-foreground mb-1 sm:mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>{service.title}</h4>
                                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{service.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
