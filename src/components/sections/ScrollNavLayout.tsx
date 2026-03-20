import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AISection } from "@/components/sections/scroll-sections/AISection";
import { VirtualOfficeSection } from "@/components/sections/scroll-sections/VirtualOfficeSection";
import { CoworkingSection } from "@/components/sections/scroll-sections/CoworkingSection";
import { BusinessSetupSection } from "@/components/sections/scroll-sections/BusinessSetupSection";
import { GlobalAccessSection } from "@/components/sections/scroll-sections/GlobalAccessSection";

type NavItem = {
    id: string;
    label: string;
};

const navItems: NavItem[] = [
    { id: "virtual-office", label: "Virtual Office" },
    { id: "coworking", label: "Coworking" },
    { id: "business-setup", label: "Business Setup" },
    { id: "global-access", label: "Global Access" },
    { id: "ai-platform", label: "AI Platform" },
];

export const ScrollNavLayout = () => {
    const [activeSection, setActiveSection] = useState("virtual-office");
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            const offset = 140;
            for (let i = navItems.length - 1; i >= 0; i--) {
                const el = document.getElementById(navItems[i].id);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= offset) {
                        setActiveSection(navItems[i].id);
                        return;
                    }
                }
            }
            setActiveSection(navItems[0].id);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            const offset = 150;
            const y = el.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    };

    return (
        <div ref={containerRef} className="relative overflow-hidden">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid lg:grid-cols-[200px_1fr] gap-8 lg:gap-16">
                    {/* Sticky left nav */}
                    <div className="hidden lg:block">
                        <nav className="sticky top-[120px] py-8 pl-6 pr-8 space-y-1">
                            {navItems.map((item) => {
                                const isActive = activeSection === item.id;

                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => scrollTo(item.id)}
                                        className="relative flex flex-col w-full text-left py-2 pl-0 bg-transparent transition-all duration-200 ease-in-out"
                                    >
                                        <span
                                            className={`whitespace-nowrap uppercase tracking-[0.08em] transition-colors duration-200 text-[12px] ${isActive ? "font-semibold" : "font-medium"
                                                }`}
                                            style={{
                                                color: isActive ? '#36503F' : 'rgba(0,0,0,0.55)',
                                                fontFamily: "'Inter Tight', sans-serif",
                                            }}
                                        >
                                            {item.label}
                                        </span>
                                        <div className="relative w-full h-[2px] mt-1.5 bg-border/30 rounded-full overflow-hidden">
                                            {isActive && (
                                                <motion.div
                                                    layoutId="nav-underline"
                                                    className="absolute inset-y-0 left-0 right-0 rounded-full"
                                                    style={{ backgroundColor: '#36503F' }}
                                                    initial={{ scaleX: 0, originX: 0 }}
                                                    animate={{ scaleX: 1 }}
                                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                                />
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Sections column */}
                    <div>
                        <VirtualOfficeSection />
                        <CoworkingSection />
                        <BusinessSetupSection />
                        <GlobalAccessSection />
                        <AISection />
                    </div>
                </div>
            </div>
        </div>
    );
};
// Trigger HMR