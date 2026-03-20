"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

type Testimonial = {
    quote: string;
    name: string;
    designation: string;
    src: string;
};

export const AnimatedTestimonials = ({
    testimonials,
    autoplay = false,
}: {
    testimonials: Testimonial[];
    autoplay?: boolean;
}) => {
    // Scroll-based logic
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const [active, setActive] = useState(0);

    // Map scroll progress (0 to 1) to active index (0 to length-1)
    useTransform(scrollYProgress, (value) => {
        const index = Math.min(
            Math.floor(value * testimonials.length),
            testimonials.length - 1
        );
        // Only update state if it changed to avoid excessive re-renders
        // We use a clean approach by checking current state in setter or an effect
        // But useTransform doesn't trigger state updates directly.
        // So we use an effect observing the value, or use 'change' event.
        return index;
    });

    // We need to listen to changes on scrollYProgress to update 'active'
    useEffect(() => {
        const unsubscribe = scrollYProgress.on("change", (value) => {
            const index = Math.min(
                Math.floor(value * (testimonials.length)),
                testimonials.length - 1
            );
            setActive(index);
        });
        return () => unsubscribe();
    }, [scrollYProgress, testimonials.length]);

    const randomRotateY = () => {
        return Math.floor(Math.random() * 21) - 10;
    };

    return (
        // TALL CONTAINER FOR SCROLL SPACE
        // Height = Screen Height * (Number of Testimonials + 0.5) to give enough scroll room
        // or just a fixed large height like 200vh or 300vh depending on content
        <div
            ref={containerRef}
            className="relative w-full"
            style={{ height: `${(testimonials.length + 1) * 100}vh` }}
        >
            {/* STICKY VIEWPORT */}
            <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
                <div className="max-w-sm md:max-w-4xl mx-auto antialiased font-sans px-4 md:px-8 lg:px-12">
                    <div className="relative flex justify-center w-full max-w-4xl mx-auto text-center">
                        <div className="flex justify-between flex-col py-4 w-full">
                            <motion.div
                                key={active}
                                initial={{
                                    y: 20,
                                    opacity: 0,
                                }}
                                animate={{
                                    y: 0,
                                    opacity: 1,
                                }}
                                exit={{
                                    y: -20,
                                    opacity: 0,
                                }}
                                transition={{
                                    duration: 0.2,
                                    ease: "easeInOut",
                                }}
                            >
                                <h3 className="text-2xl font-bold dark:text-white text-black">
                                    {testimonials[active].name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-neutral-500">
                                    {testimonials[active].designation}
                                </p>
                                <motion.p className="text-lg text-gray-500 mt-8 dark:text-neutral-300">
                                    {testimonials[active].quote.split(" ").map((word, index) => (
                                        <motion.span
                                            key={index}
                                            initial={{
                                                filter: "blur(10px)",
                                                opacity: 0,
                                                y: 5,
                                            }}
                                            animate={{
                                                filter: "blur(0px)",
                                                opacity: 1,
                                                y: 0,
                                            }}
                                            transition={{
                                                duration: 0.2,
                                                ease: "easeInOut",
                                                delay: 0.02 * index,
                                            }}
                                            className="inline-block"
                                        >
                                            {word}&nbsp;
                                        </motion.span>
                                    ))}
                                </motion.p>
                            </motion.div>

                            {/* Scroll Indicator Hint */}
                            <div className="pt-12 md:pt-16 flex flex-col items-center gap-2 text-gray-400 animate-pulse w-full justify-center">
                                <div className="h-8 w-0.5 bg-gray-300 dark:bg-neutral-700 rounded-full"></div>
                                <span className="text-xs uppercase tracking-widest font-medium">Scroll to explore</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
