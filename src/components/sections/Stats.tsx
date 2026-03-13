import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Building2, Users, MapPin, ThumbsUp, Clock } from "lucide-react";

const stats = [
    { value: "5,000+", label: "Happy Clients", trend: "+23%", positive: true, icon: Users },
    { value: "100+", label: "Workspaces", trend: "+15%", positive: true, icon: Building2 },
    { value: "68+", label: "Cities", trend: "+8%", positive: true, icon: MapPin },
    { value: "98%", label: "Satisfaction", trend: "+2%", positive: true, icon: ThumbsUp },
    { value: "<3 days", label: "Avg. Setup Time", trend: "-40%", positive: true, icon: Clock },
];

const distribution = [
    { label: "Virtual Office", percent: 32 },
    { label: "Coworking Space", percent: 28 },
    { label: "On Demand", percent: 25 },
    { label: "Business Setup", percent: 15 },
];

export const Stats = () => {
    return (
        <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-background via-card/50 to-background relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-12 sm:mb-20"
                >
                    <span className="text-primary font-semibold text-xs sm:text-sm uppercase tracking-wider mb-4 block">
                        Performance Analytics
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-foreground mb-4 sm:mb-6 tracking-tight px-2">
                        Data-Driven Excellence.
                    </h2>
                    <p className="text-muted-foreground text-sm sm:text-lg leading-relaxed px-4">
                        Our commitment to excellence reflected in every metric
                    </p>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-6">
                    {/* Left Side - Featured Stat */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-4 bg-gradient-to-br from-primary to-primary/80 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 text-primary-foreground relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm mb-4 sm:mb-6">
                                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span className="text-xs sm:text-sm font-medium">+23% this quarter</span>
                            </div>

                            <div className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter mb-2 sm:mb-3">
                                5,000+
                            </div>
                            <div className="text-lg sm:text-xl font-medium text-primary-foreground/80 mb-4 sm:mb-6">
                                Happy Clients
                            </div>

                            <p className="text-primary-foreground/70 text-xs sm:text-sm leading-relaxed">
                                Trusted by businesses of all sizes, from startups to Fortune 500 companies across the globe.
                            </p>
                        </div>
                    </motion.div>

                    {/* Middle - Stats Grid */}
                    <div className="lg:col-span-4 grid grid-cols-2 gap-3 sm:gap-4">
                        {stats.slice(1, 5).map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
                            >
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-primary/20 transition-colors">
                                    <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                                </div>
                                <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-foreground tracking-tight mb-0.5 sm:mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-muted-foreground text-[11px] sm:text-sm mb-2 sm:mb-3">{stat.label}</div>
                                <div className={`inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:py-1 rounded-full ${stat.positive
                                    ? 'text-primary bg-primary/10'
                                    : 'text-accent bg-accent/10'
                                    }`}>
                                    {stat.positive ? <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : <TrendingDown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                                    {stat.trend}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Right Side - Distribution Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-4 bg-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-border/50"
                    >
                        <div className="flex items-center justify-between mb-6 sm:mb-8">
                            <h3 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">
                                Service Distribution
                            </h3>
                            <span className="text-[10px] sm:text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full text-[10px] sm:text-xs">
                                Q4 2025
                            </span>
                        </div>

                        <div className="space-y-4 sm:space-y-5">
                            {distribution.map((item, index) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                >
                                    <div className="flex justify-between text-xs sm:text-sm mb-1.5 sm:mb-2">
                                        <span className="font-medium text-foreground">{item.label}</span>
                                        <span className="text-muted-foreground font-semibold">{item.percent}%</span>
                                    </div>
                                    <div className="h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${item.percent}%` }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.5 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                                            className="h-full rounded-full"
                                            style={{
                                                background: index === 0
                                                    ? 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary) / 0.7))'
                                                    : index === 1
                                                        ? 'linear-gradient(90deg, hsl(var(--accent)), hsl(var(--accent) / 0.7))'
                                                        : index === 2
                                                            ? 'linear-gradient(90deg, hsl(var(--primary) / 0.6), hsl(var(--primary) / 0.4))'
                                                            : 'linear-gradient(90deg, hsl(var(--accent) / 0.6), hsl(var(--accent) / 0.4))'
                                            }}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-border flex items-center justify-between">
                            <div>
                                <span className="text-muted-foreground text-[11px] sm:text-sm block mb-0.5 sm:mb-1">Total Coverage</span>
                                <span className="text-[10px] sm:text-xs text-muted-foreground/70">All services combined</span>
                            </div>
                            <span className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">100%</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};