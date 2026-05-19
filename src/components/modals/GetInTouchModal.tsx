import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Headphones, TrendingUp, Handshake, Mail, Phone } from "lucide-react";
import { createContactForm } from "@/Api/contactForm.service";
import { toast } from "sonner";

interface GetInTouchModalProps {
    open: boolean;
    onClose: () => void;
}

const contactCards = [
    {
        title: "Support",
        icon: Headphones,
        description: "Need technical help or facing issues with our platform? Our support team is here 24×7 to assist you with queries and troubleshooting.",
        contacts: [
            { label: "Support Mail:", value: "support@flashspace.co", href: "mailto:support@flashspace.co", icon: Mail },
        ],
    },
    {
        title: "Sales",
        icon: TrendingUp,
        description: "Want to explore FlashSpace solutions for your business? Our sales experts will help you find the right plan and growth strategy.",
        contacts: [
            { label: "Sales Mail:", value: "sales@flashspace.co", href: "mailto:sales@flashspace.co", icon: Mail },
            { label: "Contact:", value: "8100888777", icon: Phone },
        ],
    },
    {
        title: "Partnership",
        icon: Handshake,
        description: "Interested in collaborating or becoming a FlashSpace partner? Let's innovate together and build future-ready digital solutions.",
        contacts: [
            { label: "Partnership Mail:", value: "partner@flashspace.co", href: "mailto:partner@flashspace.co", icon: Mail },
        ],
    },
];

export const GetInTouchModal = ({ open, onClose }: GetInTouchModalProps) => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic 10-digit validation
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            toast.error("Please enter a valid 10-digit mobile number.");
            return;
        }

        setIsLoading(true);
        try {
            const rawBase = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5000" : window.location.origin);
            const base = rawBase.replace(/\/$/, "");
            
            const res = await fetch(`${base}/api/leads`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-api-key": "flashspace123", // must match backend
                "x-flashspace-csrf": "true",
              },
              body: JSON.stringify({
                name: name,
                email: email,
                phone: phone,
                city: "Get In Touch", // Using city field for context
                source: "Get In Touch Modal",
                page: window.location.href,
              }),
            });

            const data = await res.json();

            if (data.ok) {
              localStorage.setItem("hasFilledGetInTouch", "true");
              toast.success("Thank you! We will get in touch soon.");
              onClose();
              // Reset form
              setName("");
              setPhone("");
              setEmail("");
            } else {
              toast.error(data.message || "Something went wrong. Please try again.");
            }
        } catch (error: any) {
            console.error(error);
            toast.error("Server error. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-foreground/20 backdrop-blur-sm p-4 sm:p-6"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="relative w-full max-w-[500px] md:max-w-[900px] bg-card rounded-2xl shadow-2xl border border-border mt-8 mb-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close */}
                        <button
                            onClick={onClose}
                            className="absolute top-5 right-5 z-10 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="grid md:grid-cols-2 gap-0 overflow-hidden rounded-2xl">
                            {/* Left — Contact Cards (Desktop only) */}
                            <div className="hidden md:block p-5 sm:p-6 space-y-4 bg-muted/30">
                                {contactCards.map((card) => (
                                    <div
                                        key={card.title}
                                        className="bg-background rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                                <card.icon className="w-5 h-5" />
                                            </div>
                                            <h3 className="text-lg font-bold text-foreground">{card.title}</h3>
                                        </div>
                                        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                                            {card.description}
                                        </p>
                                        <div className="space-y-2">
                                            {card.contacts.map((c) => (
                                                <div key={c.label} className="flex items-center gap-2 group">
                                                    <c.icon className="w-3.5 h-3.5 text-primary/60 group-hover:text-primary transition-colors" />
                                                    <p className="text-xs text-foreground">
                                                        <span className="font-semibold text-muted-foreground mr-1">{c.label}</span>{" "}
                                                        {c.href ? (
                                                            <a href={c.href} className="text-primary font-medium hover:text-primary/80 transition-colors underline decoration-primary/30 underline-offset-2">
                                                                {c.value}
                                                            </a>
                                                        ) : (
                                                            <span className="font-medium">{c.value}</span>
                                                        )}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Right — Form */}
                            <div className="p-6 sm:p-10 bg-background flex flex-col justify-center">
                                <div className="mb-6">
                                    <img
                                        src="https://cdn.prod.website-files.com/664330484432dcdd6519a8fd/665dd8e0007de68a44f3750b_Black%20and%20White%20Bold%20Typography%20Clothing%20Brand%20Logo%20(940%20x%20400%20px)%20(940%20x%20200%20px)%20(940%20x%20150%20px).png"
                                        alt="FlashSpace Logo"
                                        className="h-8 md:h-10 w-auto mb-4 dark:invert opacity-90"
                                    />
                                    <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight leading-tight mb-2">
                                        Get Expert Advice for Your Virtual Office
                                    </h2>
                                    <p className="text-sm md:text-base text-muted-foreground">
                                        Find your perfect virtual office solution with our expert insights.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Name*"
                                            className="w-full px-5 py-4 rounded-xl border-2 border-border/60 bg-background text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm group-hover:border-primary/30"
                                            required
                                        />
                                    </div>

                                    <div className="relative group">
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="Mobile number*"
                                            className="w-full px-5 py-4 rounded-xl border-2 border-border/60 bg-background text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm group-hover:border-primary/30"
                                            required
                                        />
                                    </div>

                                    <div className="relative group">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Email*"
                                            className="w-full px-5 py-4 rounded-xl border-2 border-border/60 bg-background text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm group-hover:border-primary/30"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold py-4 rounded-xl hover:bg-primary/95 hover:shadow-lg active:scale-[0.98] transition-all text-base mt-4 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            "Get Expert Advice"
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};