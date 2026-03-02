import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

export const FeatureCTA = () => {
    return (
        <section className="py-20 lg:py-28 bg-foreground relative overflow-hidden">
            {/* Decorative vertical lines on left - softer */}
            <div className="absolute left-8 lg:left-16 top-0 bottom-0 flex gap-2">
                <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: "60%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="w-0.5 bg-primary/30 rounded-full"
                />
                <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: "80%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="w-0.5 bg-primary/20 rounded-full"
                />
                <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: "50%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="w-0.5 bg-primary/15 rounded-full"
                />
                <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: "70%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="w-0.5 bg-primary/20 rounded-full"
                />
            </div>

            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="lg:pl-16"
                    >
                        <span className="text-secondary font-semibold text-sm uppercase tracking-widest mb-6 block">
                            Unprecedented Scale
                        </span>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-secondary mb-8 tracking-tight leading-tight">
                            FlashSpace is built for
                            <br />
                            modern workspaces
                        </h2>

                        <p className="text-background/70 max-w-lg leading-relaxed mb-8 text-xl">
                            Traditional workspace management can't handle the complexity of modern hybrid work.
                            FlashSpace is designed specifically for flexible workspace needs.
                            Book, manage, and optimize spaces 24x faster with our platform.
                        </p>

                        <Button
                            variant="outline"
                            className="group text-secondary border-secondary/40 hover:bg-transparent hover:text-background hover:border-secondary font-medium px-6 py-6 bg-transparent rounded-xl"
                        >
                            Learn more
                            <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Button>
                    </motion.div>

                    {/* Right - Comparison Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="space-y-8"
                    >
                        <div>
                            <div className="text-4xl lg:text-5xl font-extrabold text-background tracking-tight mb-2">
                                24x <span className="text-xl lg:text-2xl font-semibold text-background/70">faster booking</span>
                            </div>
                        </div>

                        {/* Comparison Bars */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="text-background/50 text-xs uppercase tracking-wider w-28 shrink-0">FlashSpace</span>
                                <div className="flex-1 flex items-center gap-3">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: "4%" }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, delay: 0.4 }}
                                        className="h-3 bg-secondary rounded-sm"
                                    />
                                    <span className="text-secondary text-sm font-mono">5 min</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="text-background/50 text-xs uppercase tracking-wider w-28 shrink-0">Traditional</span>
                                <div className="flex-1 flex items-center gap-3">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: "100%" }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1.2, delay: 0.6 }}
                                        className="h-3 bg-background/20 rounded-sm relative overflow-hidden"
                                    >
                                        {/* Striped pattern */}
                                        <div className="absolute inset-0 opacity-30" style={{
                                            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.2) 2px, rgba(255,255,255,0.2) 4px)'
                                        }} />
                                    </motion.div>
                                    <span className="text-background/40 text-sm font-mono shrink-0">120+ hrs</span>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-background/10 pt-6">
                            <div className="flex items-center gap-6">
                                <div>
                                    <div className="text-2xl font-extrabold text-background">98%</div>
                                    <div className="text-background/50 text-sm">Satisfaction rate</div>
                                </div>
                                <div className="w-px h-10 bg-background/15" />
                                <div>
                                    <div className="text-2xl font-extrabold text-background">5K+</div>
                                    <div className="text-background/50 text-sm">Happy clients</div>
                                </div>
                                <div className="w-px h-10 bg-background/15" />
                                <div>
                                    <div className="text-2xl font-extrabold text-background">68+</div>
                                    <div className="text-background/50 text-sm">Cities</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};