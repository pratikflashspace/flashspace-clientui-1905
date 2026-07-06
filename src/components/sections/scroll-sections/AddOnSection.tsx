import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Users, Code, Bot, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
    { icon: Users, title: "Free OneCRM", desc: "Manage leads, automate workflows, and get deep analytics in one unified dashboard, completely free." },
    { icon: Code, title: "Website Development", desc: "Build responsive, lightning-fast websites to establish a strong digital presence." },
    { icon: Bot, title: "AI Integration", desc: "Engage visitors 24/7 with smart chatbots and AI-powered business tools." },
    { icon: TrendingUp, title: "Sales & SEO", desc: "Boost search rankings and visualize your sales pipeline to close deals faster." },
];

export const AddOnSection = () => {
    return (
        <section id="add-on" className="py-12 lg:py-16 border-t border-border/50" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="space-y-12" style={{ fontFamily: "'Inter', sans-serif" }}>
                {/* Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative rounded-xl overflow-hidden shadow-sm border border-border"
                >
                    <img
                        src="/onecrm&website.webp"
                        alt="Add On Services"
                        className="w-full h-auto object-contain"
                    />

                </motion.div>

                {/* Description + Features */}
                <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 items-start px-5 sm:px-0">
                    <div className="text-justify sm:text-left">
                        <p className="text-[15px] sm:text-lg text-muted-foreground mb-6 leading-relaxed">
                            Take your business to the next level with our powerful add-on services. From a unified, Free OneCRM to manage your customer journey, to high-performance websites that drive conversions, we provide the tools you need to accelerate growth.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/solutions/one-crm" onClick={() => window.scrollTo(0, 0)} className="w-full sm:w-auto">
                                <Button variant="outline" size="lg" className="group border-primary/30 hover:bg-primary/5 font-semibold w-full">
                                    Explore Free OneCRM
                                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </Button>
                            </Link>
                            <Link to="/solutions/website-development" onClick={() => window.scrollTo(0, 0)} className="w-full sm:w-auto">
                                <Button variant="outline" size="lg" className="group border-primary/30 hover:bg-primary/5 font-semibold w-full">
                                    Explore Web Dev
                                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:gap-6">
                        {services.map((service, i) => (
                            <motion.div
                                key={service.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-5 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors"
                            >
                                <service.icon className="w-8 h-8 text-[#36503F] mb-4" />
                                <h4 className="text-sm sm:text-base font-medium sm:font-bold text-foreground mb-2">{service.title}</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed hidden sm:block">{service.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
