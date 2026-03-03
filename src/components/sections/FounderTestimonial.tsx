import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
    {
        quote: "FlashSpace gave us the infrastructure to scale across 12 cities without a single long-term lease. It's the backbone of our hybrid strategy.",
        name: "Ananya Mehta",
        title: "CEO, NovaBridge Technologies",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&auto=format",
    },
    {
        quote: "We reduced our workspace costs by 40% while doubling our team's access to premium offices. FlashSpace made it effortless.",
        name: "Vikram Desai",
        title: "Co-founder, Meridian Labs",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&auto=format",
    },
    {
        quote: "From virtual offices to meeting rooms on demand — FlashSpace is the only platform our operations team needs.",
        name: "Sneha Kapoor",
        title: "Head of Operations, Prism Collective",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&auto=format",
    },
];

export const FounderTestimonial = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % testimonials.length);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    const current = testimonials[activeIndex];

    return (
        <section className="w-full bg-foreground border-y border-white/5 py-24 lg:py-32">
            <div className="container mx-auto px-4 lg:px-8 flex flex-col items-center text-center">
                {/* Label */}
                <span className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.2em] mb-10">
                    Trusted by Founders
                </span>

                {/* Quote */}
                <div className="max-w-4xl min-h-[160px] flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.blockquote
                            key={activeIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4 }}
                            className="text-2xl sm:text-3xl lg:text-4xl font-medium text-white leading-relaxed tracking-tight"
                        >
                            "{current.quote}"
                        </motion.blockquote>
                    </AnimatePresence>
                </div>

                {/* Profile */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                        className="mt-12 flex flex-col items-center gap-4"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                            <img
                                src={current.avatar}
                                alt={current.name}
                                className="w-16 h-16 rounded-full object-cover border-2 border-primary/20 relative z-10"
                            />
                        </div>
                        <div>
                            <p className="text-white font-bold text-lg">{current.name}</p>
                            <p className="text-muted-foreground text-sm font-medium">{current.title}</p>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Dots */}
                <div className="flex gap-3 mt-12">
                    {testimonials.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveIndex(i)}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === activeIndex
                                    ? "bg-[#EFAD1A] w-6"
                                    : "bg-white/20 hover:bg-white/40"
                                }`}
                            aria-label={`Go to testimonial ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};