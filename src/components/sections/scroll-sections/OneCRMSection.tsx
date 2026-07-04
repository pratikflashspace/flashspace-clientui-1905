import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Users, TrendingUp, BarChart3, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const featureImage = "/onecrm.png";

const services = [
    { icon: Users, title: "Lead Management", desc: "Capture, track, and nurture your leads from a single, intuitive dashboard." },
    { icon: TrendingUp, title: "Sales Pipeline", desc: "Visualize your sales stages and close deals faster with automated follow-ups." },
    { icon: BarChart3, title: "Deep Analytics", desc: "Gain actionable insights into your business performance and customer behavior." },
    { icon: Zap, title: "Workflow Automation", desc: "Automate repetitive tasks to save time and let your team focus on selling." },
];

export const OneCRMSection = () => {
    return (
        <section id="one-crm" className="py-12 lg:py-16 border-t border-border/50" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="space-y-12" style={{ fontFamily: "'Inter', sans-serif" }}>
                {/* Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative rounded-xl overflow-hidden shadow-sm border border-border"
                >
                    <img
                        src={featureImage}
                        alt="One CRM Dashboard"
                        className="w-full h-full object-cover"
                    />
                </motion.div>

                {/* Description + Features */}
                <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 items-start px-5 sm:px-0" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <div className="text-justify sm:text-left" style={{ fontFamily: "'Inter', sans-serif" }}>
                        <p className="text-[15px] sm:text-lg text-muted-foreground mb-6 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                            Take complete control of your customer journey. Our powerful Free CRM tool brings your sales, marketing, and support teams together on one unified platform to drive growth and build lasting relationships.
                        </p>
                        <Link to="/solutions/one-crm" onClick={() => window.scrollTo(0, 0)}>
                            <Button variant="outline" size="lg" className="group border-primary/30 hover:bg-primary/5 font-semibold w-full sm:w-auto">
                                Explore Free One CRM
                                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:gap-6" style={{ fontFamily: "'Inter', sans-serif" }}>
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
                                <h4 className="text-sm sm:text-base font-medium sm:font-bold text-foreground mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>{service.title}</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed hidden sm:block" style={{ fontFamily: "'Inter', sans-serif" }}>{service.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
