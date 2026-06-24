import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Wifi, Coffee, Users, Monitor, MapPin, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

const featureVirtualOffice = "https://res.cloudinary.com/davqpypmw/image/upload/v1780035672/flashspace_homepage/ayxjwyyqrs3edbswmf9b.jpg";
const featureCoworking = "https://res.cloudinary.com/davqpypmw/image/upload/v1780035673/flashspace_homepage/iqibetxdweicak9un3ur.jpg";

const amenities = [
    { icon: MapPin, label: "Premium Address" },
    { icon: Wifi, label: "High-speed WiFi" },
    { icon: Coffee, label: "Pantry & Café" },
    { icon: Users, label: "Community Events" },
    { icon: Monitor, label: "Ergonomic Setup" },
    { icon: Building2, label: "Meeting Rooms" },
];

export const WorkspacesSection = () => {
    return (
        <section id="virtual-office" className="py-12 lg:py-16 border-t border-border/50" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="space-y-12" style={{ fontFamily: "'Inter', sans-serif" }}>
                {/* Header */}
                <div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black leading-tight tracking-tight mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Premium Workspaces
                        <br />
                        <span className="text-[#36503F] font-bold" style={{ fontFamily: "'Inter', sans-serif" }}>for every business need.</span>
                    </h2>
                    <p className="text-[15px] sm:text-lg text-muted-foreground max-w-2xl leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Whether you need a prestigious virtual address or a physical desk to collaborate, we provide flexible workspace solutions tailored to your growth.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {/* Virtual Office Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="rounded-2xl overflow-hidden group cursor-pointer border border-border bg-card flex flex-col hover:border-primary/20 transition-colors"
                    >
                        <Link to="/services/virtual-office" className="flex flex-col h-full">
                            <div className="relative overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
                                <img
                                    src={featureVirtualOffice}
                                    alt="Virtual office space"
                                    className="w-full h-[240px] sm:h-[280px] object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute top-4 left-4 z-10" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    <span className="bg-white/95 backdrop-blur-md text-[#36503F] text-xs sm:text-sm font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md" style={{ fontFamily: "'Inter', sans-serif" }}>Virtual Office</span>
                                </div>
                            </div>
                            <div className="p-6 sm:p-8 flex-1 flex flex-col bg-card z-10 border-t border-border/50" style={{ fontFamily: "'Inter', sans-serif" }}>
                                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    A real business address, without the real estate.
                                </h3>
                                <p className="text-muted-foreground text-[15px] mb-6 line-clamp-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    Establish your business presence in premium locations without the overhead of a physical office.
                                </p>
                                <div className="mt-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    <Button variant="outline" className="border-primary/30 hover:bg-primary/5 font-semibold text-[#36503F] w-full sm:w-auto">
                                        Explore Virtual Offices
                                        <ArrowUpRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                    {/* Coworking Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="rounded-2xl overflow-hidden group cursor-pointer border border-border bg-card flex flex-col hover:border-primary/20 transition-colors"
                    >
                        <Link to="/services/coworking-space" className="flex flex-col h-full">
                            <div className="relative overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
                                <img
                                    src={featureCoworking}
                                    alt="Coworking space"
                                    className="w-full h-[240px] sm:h-[280px] object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute top-4 left-4 z-10" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    <span className="bg-white/95 backdrop-blur-md text-[#36503F] text-xs sm:text-sm font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md" style={{ fontFamily: "'Inter', sans-serif" }}>Coworking</span>
                                </div>
                            </div>
                            <div className="p-6 sm:p-8 flex-1 flex flex-col bg-card z-10 border-t border-border/50" style={{ fontFamily: "'Inter', sans-serif" }}>
                                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    Flexible desks & cabins for every team size.
                                </h3>
                                <p className="text-muted-foreground text-[15px] mb-6 line-clamp-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    From hot desks to private cabins, find the perfect coworking setup for individuals and teams.
                                </p>
                                <div className="mt-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    <Button variant="outline" className="border-primary/30 hover:bg-primary/5 font-semibold text-[#36503F] w-full sm:w-auto">
                                        Browse Coworking
                                        <ArrowUpRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                </div>

                {/* Amenities */}
                <div className="pt-8 border-t border-border/50" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <h4 className="text-sm font-bold tracking-widest uppercase text-muted-foreground mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>Included Amenities</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {amenities.map((a, i) => (
                            <motion.div
                                key={a.label}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border"
                            >
                                <a.icon className="w-5 h-5 text-primary" />
                                <span className="text-sm font-medium text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>{a.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
