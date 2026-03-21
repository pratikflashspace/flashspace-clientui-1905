import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GetInTouchModal } from "@/components/modals/GetInTouchModal";

// Using the local illustration from the public folder
const ctaIllustration = "/ctaIllustration.jpg";

const highlights = [
    { tag: "PRODUCTIVITY", text: "AI tools that maximize workspace efficiency" },
    { tag: "USABILITY", text: "Modern booking that's fast and friction-free" },
    { tag: "SCALABILITY", text: "Global network that grows with your business" },
];

export const CTA = () => {
    const navigate = useNavigate();
    const [isContactOpen, setIsContactOpen] = useState(false);

    return (
        <section className="relative w-full overflow-hidden" style={{ paddingTop: 80, paddingBottom: 80 }}>
            {/* Illustration Background */}
            <img
                src={ctaIllustration}
                alt="Coworking workspace illustration"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: "brightness(0.95) saturate(0.8)" }}
            />

            {/* Light overlay for readability */}
            <div
                className="absolute inset-0"
                style={{
                    background: "radial-gradient(circle at center, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0.35) 100%)",
                }}
            />

            <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-10 tracking-tight"
                >
                    Ready to Transform Your Business ?
                </motion.h2>

                {/* Highlight cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="max-w-3xl mx-auto rounded-2xl bg-background/70 backdrop-blur-md border border-border/50 p-6 lg:p-8 mb-10"
                >
                    <div className="grid sm:grid-cols-3 gap-6 text-left">
                        {highlights.map((h) => (
                            <div key={h.tag}>
                                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-foreground border border-border rounded-full px-3 py-1 mb-3">
                                    {h.tag}
                                </span>
                                <p className="text-sm font-semibold text-foreground leading-snug">{h.text}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center justify-center gap-4 flex-wrap"
                >
                    <button
                        onClick={() => setIsContactOpen(true)}
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold transition-all duration-200 hover:brightness-95"
                        style={{
                            borderRadius: 999,
                            padding: "14px 42px",
                            fontSize: 15,
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                        }}
                    >
                        Get Started Free
                        <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => navigate("/Solutions/virtual-office#sales-contact")}
                        className="inline-flex items-center gap-2 bg-background text-foreground font-semibold border border-border transition-all duration-200 hover:bg-muted"
                        style={{
                            borderRadius: 999,
                            padding: "14px 42px",
                            fontSize: 15,
                            cursor: "pointer",
                        }}
                    >
                        Talk to Sales
                    </button>
                </motion.div>
            </div>

            <GetInTouchModal open={isContactOpen} onClose={() => setIsContactOpen(false)} />
        </section>
    );
};