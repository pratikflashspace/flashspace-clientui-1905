import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

interface ModernFlairButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    flairColor?: string;
    variant?: "default" | "3d";
}

export default function ModernFlairButton({
    className,
    children,
    flairColor = "rgba(239, 173, 26, 0.2)",
    onClick,
    variant = "3d",
    ...props
}: ModernFlairButtonProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const flairRef = useRef<HTMLSpanElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const xSetRef = useRef<((value: number) => void) | null>(null);
    const ySetRef = useRef<((value: number) => void) | null>(null);

    useEffect(() => {
        if (!buttonRef.current || !flairRef.current) return;

        // Initialize GSAP quickSetters
        xSetRef.current = gsap.quickSetter(flairRef.current, "xPercent") as (value: number) => void;
        ySetRef.current = gsap.quickSetter(flairRef.current, "yPercent") as (value: number) => void;

        const getXY = (e: MouseEvent) => {
            if (!buttonRef.current) return { x: 0, y: 0 };

            const { left, top, width, height } = buttonRef.current.getBoundingClientRect();

            const xTransformer = gsap.utils.pipe(
                gsap.utils.mapRange(0, width, 0, 100),
                gsap.utils.clamp(0, 100)
            );

            const yTransformer = gsap.utils.pipe(
                gsap.utils.mapRange(0, height, 0, 100),
                gsap.utils.clamp(0, 100)
            );

            return {
                x: xTransformer(e.clientX - left),
                y: yTransformer(e.clientY - top),
            };
        };

        const handleMouseEnter = (e: MouseEvent) => {
            const { x, y } = getXY(e);
            if (xSetRef.current) xSetRef.current(x);
            if (ySetRef.current) ySetRef.current(y);

            gsap.to(flairRef.current, {
                scale: 1,
                duration: 0.4,
                ease: "power2.out",
            });

            if (variant === "3d" && contentRef.current) {
                gsap.to(buttonRef.current, {
                    scale: 1.05,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        };

        const handleMouseLeave = (e: MouseEvent) => {
            const { x, y } = getXY(e);

            gsap.killTweensOf(flairRef.current);
            gsap.to(flairRef.current, {
                xPercent: x > 90 ? x + 20 : x < 10 ? x - 20 : x,
                yPercent: y > 90 ? y + 20 : y < 10 ? y - 20 : y,
                scale: 0,
                duration: 0.3,
                ease: "power2.out",
            });

            if (variant === "3d" && contentRef.current) {
                gsap.to(buttonRef.current, {
                    scale: 1,
                    x: 0,
                    y: 0,
                    rotationX: 0,
                    rotationY: 0,
                    boxShadow: "0 0 0 rgba(0,0,0,0)",
                    duration: 0.5,
                    ease: "elastic.out(1, 0.5)"
                });
                gsap.to(contentRef.current, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: "elastic.out(1, 0.5)"
                });
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            const { x, y } = getXY(e);
            gsap.to(flairRef.current, {
                xPercent: x,
                yPercent: y,
                duration: 0.4,
                ease: "power2",
            });

            if (variant === "3d" && buttonRef.current && contentRef.current) {
                const rect = buttonRef.current.getBoundingClientRect();
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;

                const rotateX = ((mouseY - centerY) / centerY) * -8; // Max 8 deg rotation
                const rotateY = ((mouseX - centerX) / centerX) * 8;

                const moveX = ((mouseX - centerX) / centerX) * 5;
                const moveY = ((mouseY - centerY) / centerY) * 5;

                gsap.to(buttonRef.current, {
                    rotationX: rotateX,
                    rotationY: rotateY,
                    transformPerspective: 500,
                    duration: 0.1,
                    ease: "power1.out"
                });

                gsap.to(contentRef.current, {
                    x: moveX,
                    y: moveY,
                    duration: 0.1,
                    ease: "power1.out"
                });
            }
        };

        const button = buttonRef.current;
        button.addEventListener("mouseenter", handleMouseEnter);
        button.addEventListener("mouseleave", handleMouseLeave);
        button.addEventListener("mousemove", handleMouseMove);

        return () => {
            button.removeEventListener("mouseenter", handleMouseEnter);
            button.removeEventListener("mouseleave", handleMouseLeave);
            button.removeEventListener("mousemove", handleMouseMove);
        };
    }, [variant]);

    return (
        <button
            ref={buttonRef}
            className={cn(
                "relative overflow-hidden transition-all text-sm font-medium",
                variant === "3d" ? "hover:shadow-2xl" : "",
                className
            )}
            onClick={onClick}
            {...props}
        >
            <span
                ref={flairRef}
                className="pointer-events-none absolute top-0 left-0 hover:opacity-100 opacity-0 transition-opacity duration-300 z-0"
                style={{
                    width: "0%",
                    height: "0%",
                    transform: "translate(-50%, -50%) scale(0)",
                }}
            >
                <span
                    className="absolute top-0 left-0 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                        width: "300px",
                        height: "300px",
                        backgroundColor: flairColor,
                    }}
                />
            </span>
            <div ref={contentRef} className="relative z-10 flex items-center justify-center gap-2 h-full w-full pointer-events-none">
                {children}
            </div>
        </button>
    );
}
