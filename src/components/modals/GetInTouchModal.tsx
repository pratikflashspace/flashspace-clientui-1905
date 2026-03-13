import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";

interface GetInTouchModalProps {
    open: boolean;
    onClose: () => void;
}

const contactCards = [
    {
        title: "Support",
        description: "Need technical help or facing issues with our platform? Our support team is here 24×7 to assist you with queries and troubleshooting.",
        contacts: [
            { label: "Support Mail:", value: "support@flashspace.co", href: "mailto:support@flashspace.co" },
        ],
    },
    {
        title: "Sales",
        description: "Want to explore FlashSpace solutions for your business? Our sales experts will help you find the right plan and growth strategy.",
        contacts: [
            { label: "Sales Mail:", value: "sales@flashspace.co", href: "mailto:sales@flashspace.co" },
            { label: "Contact:", value: "8100888777" },
        ],
    },
    {
        title: "Partnership",
        description: "Interested in collaborating or becoming a FlashSpace partner? Let's innovate together and build future-ready digital solutions.",
        contacts: [
            { label: "Partnership Mail:", value: "partner@flashspace.co", href: "mailto:partner@flashspace.co" },
        ],
    },
];

export const GetInTouchModal = ({ open, onClose }: GetInTouchModalProps) => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: integrate with backend
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-foreground/20 backdrop-blur-sm p-4 sm:p-6"
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

                        <div className="grid md:grid-cols-2 gap-0">
                            {/* Left — Contact Cards (Desktop only) */}
                            <div className="hidden md:block p-5 sm:p-6 space-y-3">
                                {contactCards.map((card) => (
                                    <div
                                        key={card.title}
                                        className="bg-background rounded-xl border border-border p-4"
                                    >
                                        <h3 className="text-base font-bold text-foreground mb-1">{card.title}</h3>
                                        <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                                            {card.description}
                                        </p>
                                        <div className="space-y-0.5">
                                            {card.contacts.map((c) => (
                                                <p key={c.label} className="text-xs text-foreground">
                                                    <span className="font-semibold">{c.label}</span>{" "}
                                                    {c.href ? (
                                                        <a href={c.href} className="text-primary hover:text-primary/80 transition-colors underline">
                                                            {c.value}
                                                        </a>
                                                    ) : (
                                                        <span>{c.value}</span>
                                                    )}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Right — Form */}
                            <div className="p-5 sm:p-6 md:border-l border-border">
                                <h2 className="text-xl font-bold text-foreground text-center mb-4">
                                    Get in <span className="text-primary">Touch</span>
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-foreground mb-1.5">Full Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Your Name"
                                            className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-all"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-foreground mb-1.5">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="+91 9876543210"
                                            className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-all"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-foreground mb-1.5">Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-all"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-foreground mb-1.5">Message</label>
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="How can we help?"
                                            rows={3}
                                            className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full flex items-center justify-center gap-2 bg-primary text-secondary font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors text-sm"
                                    >
                                        Send Message
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