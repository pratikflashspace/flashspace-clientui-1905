import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

type FaqCategory = "all" | "pricing" | "registration" | "coworking" | "support" | "documents";

interface FaqItem {
    question: string;
    answer: string;
    category: Exclude<FaqCategory, "all">;
}

const faqs: FaqItem[] = [
    {
        question: "What is a virtual office and who needs it?",
        answer: "A virtual office provides a premium business address without the high costs of physical office space. It is perfect for startups, freelancers, remote teams, and businesses expanding to new cities, offering benefits like GST registration, mail handling, and a professional image.",
        category: "registration",
    },
    {
        question: "Are there any hidden charges?",
        answer: "No, FlashSpace believes in transparent pricing. All costs are clearly mentioned upfront — what you see is what you pay. No surprises.",
        category: "pricing",
    },
    {
        question: "Why is your pricing higher than some competitors?",
        answer: "We provide premium, legally compliant addresses at prime locations with end-to-end support including GST registration, mail handling, and dedicated account management.",
        category: "pricing",
    },
    {
        question: "Do you offer monthly and yearly plans?",
        answer: "Yes, we offer both monthly and annual plans across all our services. Annual plans come with significant savings of up to 30%.",
        category: "pricing",
    },
    {
        question: "Can I upgrade my plan later?",
        answer: "Absolutely. You can upgrade your plan at any time. The difference in pricing will be prorated for the remaining billing period.",
        category: "pricing",
    },
    {
        question: "Is the virtual office address legally valid?",
        answer: "Yes, all our virtual office addresses are legally valid and accepted for GST registration, company incorporation, and other regulatory requirements.",
        category: "registration",
    },
    {
        question: "Can I use this address for GST registration?",
        answer: "Yes, our addresses are fully compliant for GST registration. We also provide the NOC and utility bills needed for the process.",
        category: "registration",
    },
    {
        question: "Will GST officers physically verify the address?",
        answer: "GST officers may conduct physical verification. Our team ensures the premises are always ready and our staff is trained to handle such visits.",
        category: "registration",
    },
    {
        question: "Is this address accepted by banks?",
        answer: "Yes, our virtual office addresses are accepted by major banks for current account opening and other banking formalities.",
        category: "registration",
    },
    {
        question: "What documents will I receive?",
        answer: "You'll receive an agreement, NOC, utility bills, and a welcome kit. All documents are legally valid and ready for regulatory use.",
        category: "documents",
    },
    {
        question: "When will I receive the documents?",
        answer: "Documents are typically delivered within 24–48 hours of completing KYC verification and payment.",
        category: "documents",
    },
    {
        question: "What is the difference between Hot Desk and Dedicated Desk?",
        answer: "A hot desk is a shared, first-come-first-served seat. A dedicated desk is your personal, reserved workspace available 24/7 with storage.",
        category: "coworking",
    },
    {
        question: "Are utilities included in coworking plans?",
        answer: "Yes, all coworking plans include high-speed WiFi, electricity, AC, housekeeping, drinking water, and access to common areas.",
        category: "coworking",
    },
    {
        question: "Is there any lock-in period?",
        answer: "No lock-in period for monthly plans. Annual plans require a minimum commitment but offer flexibility to upgrade or switch locations.",
        category: "coworking",
    },
    {
        question: "How do I book a meeting room?",
        answer: "You can book meeting rooms instantly through the FlashSpace app or website. Select your city, preferred location, date, and time slot.",
        category: "coworking",
    },
    {
        question: "How do I raise a support request?",
        answer: "You can raise a support ticket through the FlashSpace app, email us at support@flashspace.ai, or call +91 8100888777. We're available 24/7.",
        category: "support",
    },
    {
        question: "How long does support take to respond?",
        answer: "Our average response time is under 2 hours. Critical issues are addressed within 30 minutes during business hours.",
        category: "support",
    },
    {
        question: "Can I cancel my booking?",
        answer: "Yes, bookings can be cancelled as per our cancellation policy. Refund eligibility depends on the timing and type of service booked.",
        category: "support",
    },
    {
        question: "Do you have an affiliate program?",
        answer: "Yes! Our affiliate program lets you earn commissions by referring businesses to FlashSpace. Sign up through our Affiliate Portal to get started.",
        category: "support",
    },
];

const categories: { label: string; value: FaqCategory }[] = [
    { label: "All", value: "all" },
    { label: "Pricing", value: "pricing" },
    { label: "Registration", value: "registration" },
    { label: "Coworking", value: "coworking" },
    { label: "Documents", value: "documents" },
    { label: "Support", value: "support" },
];

export const FAQSection = () => {
    const [activeCategory, setActiveCategory] = useState<FaqCategory>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [aiMode, setAiMode] = useState(false);
    const [aiQuery, setAiQuery] = useState("");
    const aiInputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const filtered = faqs
        .filter((f) => activeCategory === "all" || f.category === activeCategory)
        .filter((f) =>
            searchQuery === ""
                ? true
                : f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                f.answer.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const scroll = (dir: "left" | "right") => {
        if (!scrollRef.current) return;
        const amount = 340;
        scrollRef.current.scrollBy({
            left: dir === "left" ? -amount : amount,
            behavior: "smooth",
        });
    };

    return (
        <section className="py-12 sm:py-16 lg:py-24 bg-[#FAFAF7] overflow-hidden">
            <div className="fs-container">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10"
                >
                    <span className="fs-tag mb-3">
                        FAQ
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#1A1A1A] mb-3 px-2">
                        Everything You Need to Know
                    </h2>
                    <p className="text-[#6B8F78] text-sm sm:text-base max-w-lg mx-auto px-4">
                        Get instant answers to the most common questions about our solutions and services.
                    </p>
                </motion.div>

                {/* Search bar with AI toggle */}
                <div className="max-w-xl mx-auto mb-8">
                    <AnimatePresence mode="wait">
                        {!aiMode ? (
                            <motion.div
                                key="faq-search"
                                initial={false}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                transition={{ duration: 0.25 }}
                                className="flex flex-row items-center bg-white rounded-full border border-[#D4E0D0] overflow-hidden p-1 sm:p-0"
                            >
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search questions..."
                                        className="w-full pl-8 sm:pl-11 pr-2 sm:pr-4 py-2 sm:py-3 bg-transparent text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                                    />
                                </div>
                                <button
                                    onClick={() => {
                                        setAiMode(true);
                                        setTimeout(() => aiInputRef.current?.focus(), 100);
                                    }}
                                    className="flex items-center justify-center gap-1.5 sm:gap-2 border border-[#36503F] bg-[#36503F] text-[#FEF8C5] px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold sm:mr-1.5 hover:bg-[#1F2E26] transition-colors shrink-0"
                                >
                                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    <span className="whitespace-nowrap">Chat with AI</span>
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="faq-ai"
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 40 }}
                                transition={{ duration: 0.25 }}
                                className="flex flex-row items-center bg-white rounded-full border border-[#36503F] overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-1 sm:p-0"
                            >
                                <div className="hidden sm:flex items-center gap-2 px-4 border-r border-border shrink-0 py-3">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                    <span className="text-sm font-medium text-primary">AI</span>
                                </div>
                                <input
                                    ref={aiInputRef}
                                    type="text"
                                    value={aiQuery}
                                    onChange={(e) => setAiQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && aiQuery.trim()) {
                                            navigate(`/start-chatting?q=${encodeURIComponent(aiQuery.trim())}`);
                                        }
                                        if (e.key === "Escape") {
                                            setAiMode(false);
                                            setAiQuery("");
                                        }
                                    }}
                                    placeholder="Ask AI anything..."
                                    className="flex-1 bg-transparent text-xs sm:text-sm outline-none placeholder:text-muted-foreground px-3 sm:px-4 py-2 sm:py-3"
                                />
                                <div className="flex items-center gap-1 sm:gap-2 sm:mr-1.5">
                                    <button
                                        onClick={() => { setAiMode(false); setAiQuery(""); }}
                                        className="rounded-full bg-[#36503F] text-[#FEF8C5] hover:bg-[#1F2E26] text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2.5 transition-colors shrink-0"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (aiQuery.trim()) {
                                                navigate(`/start-chatting?q=${encodeURIComponent(aiQuery.trim())}`);
                                            }
                                        }}
                                        disabled={!aiQuery.trim()}
                                        className="flex items-center justify-center gap-1.5 sm:gap-2 bg-[#36503F] text-[#FEF8C5] px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-[#1F2E26] transition-colors shrink-0 disabled:opacity-40"
                                    >
                                        <Search className="w-3 h-3 sm:w-4 sm:h-4" />
                                        Ask
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Category Filters */}
                <div className="flex justify-center gap-2 mb-8 flex-wrap">
                    {categories.map((cat) => (
                        <button
                            key={cat.value}
                            onClick={() => setActiveCategory(cat.value)}
                            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${activeCategory === cat.value
                                ? "border-[#36503F] bg-[#36503F] text-[#FEF8C5]"
                                : "border-[#D4E0D0] bg-white text-[#36503F] hover:border-[#36503F] hover:bg-[#F0F4EE]"
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Scroll controls */}
                <div className="relative">
                    <button
                        onClick={() => scroll("left")}
                        className="absolute -left-4 lg:-left-12 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#36503F] border border-[#36503F] shadow-md flex items-center justify-center text-[#FEF8C5] transition-colors hover:bg-[#1F2E26] hidden sm:flex"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="absolute -right-4 lg:-right-12 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#36503F] border border-[#36503F] shadow-md flex items-center justify-center text-[#FEF8C5] transition-colors hover:bg-[#1F2E26] hidden sm:flex"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Cards slider */}
                    <div
                        ref={scrollRef}
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        className="flex gap-4 overflow-x-auto overflow-y-hidden py-4 snap-x snap-mandatory px-4 -mx-4 [&::-webkit-scrollbar]:hidden items-stretch"
                    >
                        {filtered.map((faq, i) => (
                            <motion.div
                                key={faq.question}
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.04 }}
                                className="min-w-[300px] max-w-[320px] flex-shrink-0 snap-start rounded-xl border border-[#D4E0D0] bg-white p-6 flex flex-col transition-all hover:border-[#36503F] hover:shadow-[0_4px_24px_rgba(54,80,63,0.08)]"
                            >
                                <span className="text-xs uppercase tracking-[0.08em] text-[#36503F] font-medium mb-3">
                                    {faq.category}
                                </span>
                                <h3 className="text-[15px] font-semibold text-[#1A1A1A] leading-snug mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    {faq.question}
                                </h3>
                                <p className="text-sm text-[#6B8F78] leading-relaxed flex-1">
                                    {faq.answer}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
