import React, { useState, useEffect } from "react";
import {
    Share2,
    Users,
    TrendingUp,
    Wallet,
    Sparkles,
    Send,
    Trophy,
    X,
    RefreshCw,
    Lightbulb,
    ArrowUpRight,
    Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// --- Types & Data ---

type InsightType = "renewal" | "crossSell" | "performance" | "revenue";

interface InsightMetric {
    label: string;
    value: string; // The big number/text
    subtext: string; // The smaller description below
    trend?: string; // Optional green trend badge text
    isHighlight?: boolean; // For "Follow-ups" style highlight
}

interface InsightContent {
    title: string;
    loadingText: string;
    recommendation: string;
    metrics: InsightMetric[];
}

// Data mapping matching your screenshots exactly
const INSIGHT_DATA: Record<InsightType, InsightContent> = {
    renewal: {
        title: "Renewal Forecasting",
        loadingText: "Analyzing renewal patterns...",
        recommendation:
            "Focus on follow-ups with high-potential leads this week. Your conversion rate shows room for 15% improvement with better timing.",
        metrics: [
            {
                label: "Expected Renewals",
                value: "28",
                subtext: "Clients likely to renew this quarter",
                trend: "+8%",
            },
            {
                label: "Potential Revenue",
                value: "₹8.4L",
                subtext: "From expected renewals",
            },
            {
                label: "Churn Risk",
                value: "4 clients",
                subtext: "Low engagement - need attention",
            },
        ],
    },
    crossSell: {
        title: "Cross-Sell Suggestions",
        loadingText: "Finding upsell opportunities...",
        recommendation:
            "Focus on follow-ups with high-potential leads this week. Your conversion rate shows room for 15% improvement with better timing.",
        metrics: [
            {
                label: "Meeting Room Add-on",
                value: "12 clients",
                subtext: "Perfect fit based on their usage patterns",
            },
            {
                label: "Virtual Address Upgrade",
                value: "8 clients",
                subtext: "High potential for premium address upgrade",
            },
            {
                label: "GST Registration",
                value: "15 leads",
                subtext: "Interested in compliance services",
            },
        ],
    },
    performance: {
        title: "Performance Insights",
        loadingText: "Analyzing your performance...",
        recommendation:
            "Focus on follow-ups with high-potential leads this week. Your conversion rate shows room for 15% improvement with better timing.",
        metrics: [
            {
                label: "Your Rank",
                value: "#12",
                subtext: "Moved up 3 positions this week",
                trend: "+3",
            },
            {
                label: "Conversion Rate",
                value: "34%",
                subtext: "Above average for your region",
                trend: "+5%",
            },
            {
                label: "Top Improvement",
                value: "Follow-ups",
                subtext: "Increase follow-up calls by 2x for better results",
                isHighlight: true,
            },
        ],
    },
    revenue: {
        title: "Revenue Predictions",
        loadingText: "Forecasting your earnings...",
        recommendation:
            "Focus on follow-ups with high-potential leads this week. Your conversion rate shows room for 15% improvement with better timing.",
        metrics: [
            {
                label: "This Month",
                value: "₹45K",
                subtext: "On track to exceed last month",
                trend: "+12%",
            },
            {
                label: "Next Month Estimate",
                value: "₹52K",
                subtext: "Based on pipeline and renewals",
            },
            {
                label: "Quarterly Bonus",
                value: "₹25K",
                subtext: "Achievable if current pace maintained",
            },
        ],
    },
};

// --- Sub-Components ---

// 1. Main Insight Card (Clickable)
const InsightCard = ({
    title,
    description,
    id,
    onClick,
}: {
    title: string;
    description: string;
    id: InsightType;
    onClick: (id: InsightType) => void;
}) => (
    <div
        onClick={() => onClick(id)}
        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group relative overflow-hidden"
    >
        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Sparkles size={40} className="text-[#5aa39c]" />
        </div>
        <div className="flex justify-between items-start mb-4 relative z-10">
            <h3 className="font-bold text-slate-900 group-hover:text-[#5aa39c] transition-colors text-base">
                {title}
            </h3>
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-full text-[10px] font-bold text-gray-600 border border-gray-200 tracking-wide uppercase">
                <Sparkles size={10} className="text-[#5aa39c] fill-[#5aa39c]" />{" "}
                AI
            </span>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed relative z-10 pr-4">
            {description}
        </p>
    </div>
);

// 2. Stat Card (For Top Grid)
const StatCardDashboard = ({ label, value, trend, icon: Icon, delay }: any) => (
    <div
        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="flex justify-between items-start mb-4">
            <span className="text-gray-500 font-medium text-sm">{label}</span>
            <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                <Icon size={18} />
            </div>
        </div>
        <div className="space-y-1">
            <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
            {trend && (
                <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                    <TrendingUp size={14} />
                    <span>{trend}</span>
                </div>
            )}
        </div>
    </div>
);

// 3. Section Header
const SectionHeader = ({ icon: Icon, title, subtitle }: any) => (
    <div className="flex items-start gap-4 mb-6 pt-8 border-t border-gray-100/50">
        <div className="p-3 bg-[#eaf4f3] rounded-xl text-[#5aa39c]">
            <Icon size={24} strokeWidth={2.5} />
        </div>
        <div>
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
            <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
    </div>
);

// 4. Standard Action Card (Non-Interactive/Generic)
const ActionCard = ({ title, description, badge }: any) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col justify-between group cursor-default">
        <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-slate-900 text-sm group-hover:text-[#5aa39c] transition-colors">
                {title}
            </h3>
            {badge && (
                <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-semibold text-gray-600 border border-gray-200 uppercase tracking-wider">
                    {badge}
                </span>
            )}
        </div>
        <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
);

// --- Main Dashboard Component ---

const Dashboard = () => {
    const [selectedInsight, setSelectedInsight] = useState<InsightType | null>(
        null,
    );
    const [isLoadingInsight, setIsLoadingInsight] = useState(false);
    const navigate = useNavigate();

    // Handle opening the modal
    const handleInsightClick = (id: InsightType) => {
        setSelectedInsight(id);
        setIsLoadingInsight(true);
    };

    // Handle the "Refresh" simulation
    const handleRefresh = () => {
        setIsLoadingInsight(true);
    };

    // Effect to simulate loading delay (2 seconds)
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (selectedInsight && isLoadingInsight) {
            timer = setTimeout(() => {
                setIsLoadingInsight(false);
            }, 2000); // 2 second loading time
        }
        return () => clearTimeout(timer);
    }, [selectedInsight, isLoadingInsight]);

    // -- Data Definitions --
    const stats = [
        {
            label: "Total Referrals",
            value: "89",
            trend: "15% from last month",
            icon: Share2,
        },
        {
            label: "Converted Clients",
            value: "34",
            trend: "22% from last month",
            icon: Users,
        },
        {
            label: "Total Earnings",
            value: "₹2.8L",
            trend: "18% from last month",
            icon: TrendingUp,
        },
        { label: "Pending Payout", value: "₹45K", trend: null, icon: Wallet },
    ];

    const sections = [
        {
            id: "booking",
            icon: Users,
            title: "Booking Management",
            subtitle: "Track all your referrals and their status",
            cards: [
                {
                    title: "Booking Management",
                    desc: "View companies you've referred and their booking status",
                },
                {
                    title: "Client Tracking",
                    desc: "Track all clients from referral to conversion and beyond",
                },
                {
                    title: "Status Updates",
                    desc: "Real-time updates on client booking progress",
                },
            ],
        },
        {
            id: "revenue",
            icon: Wallet,
            title: "Revenue & Payouts",
            subtitle: "Track your earnings and payments",
            cards: [
                {
                    title: "Revenue Dashboard",
                    desc: "Complete view of your earnings and revenue trends",
                },
                {
                    title: "Payout Tracking",
                    desc: "Track completed payouts, pending, and expected dates",
                },
                {
                    title: "Auto Invoicing",
                    desc: "Generate and share invoices automatically with clients",
                },
            ],
        },
        {
            id: "marketing",
            icon: Send,
            title: "Marketing Tools",
            subtitle: "Tools to help you close more deals",
            cards: [
                {
                    title: "Quotation Generator",
                    desc: "Create instant quotations with FlashSpace and affiliate branding",
                },
                {
                    title: "WhatsApp Follow-ups",
                    desc: "Integrated WhatsApp and email follow-ups for all leads",
                },
                {
                    title: "Lead Management",
                    desc: "Manage all your leads in one place with status tracking",
                },
            ],
        },
        {
            id: "leaderboard",
            icon: Trophy,
            title: "Leaderboard & Support",
            subtitle: "Compete and get help when needed",
            cards: [
                {
                    title: "Regional Rankings",
                    desc: "See your position among affiliates in your region",
                },
                {
                    title: "National Leaderboard",
                    desc: "Compete with affiliates pan-India for top positions",
                },
                {
                    title: "AI Support Chat",
                    desc: "Get queries resolved with AI that escalates to support when needed",
                    badge: "AI",
                },
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-[#fafafa] p-6 lg:p-10 font-sans animate-fade-in relative">
            <div className="w-full space-y-10">
                {/* 1. Page Header */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Affiliate{" "}
                        <span className="text-[#5aa39c] italic ">
                            Dashboard
                        </span>
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Track your referrals, revenue, and performance
                    </p>
                </div>

                {/* 2. Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, idx) => (
                        <StatCardDashboard
                            key={idx}
                            {...stat}
                            delay={idx * 100}
                        />
                    ))}
                </div>

                {/* 3. AI Insights Section (Interactive) */}
                <div className="space-y-6">
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Sparkles size={20} className="text-[#5aa39c]" />{" "}
                            AI-Powered Insights
                        </h2>
                        <p className="text-sm text-gray-500">
                            Leverage AI to maximize your earnings
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {/* Note: I mapped these manually to ensure they pass the correct IDs */}
                        <InsightCard
                            id="renewal"
                            title="Renewal Forecasting"
                            description="AI predicts renewals and expected revenue from existing clients"
                            onClick={handleInsightClick}
                        />
                        <InsightCard
                            id="crossSell"
                            title="Cross-Sell Suggestions"
                            description="AI-based suggestions for additional services to increase revenue"
                            onClick={handleInsightClick}
                        />
                        <InsightCard
                            id="performance"
                            title="Performance Insights"
                            description="AI suggestions on how to improve your performance ranking"
                            onClick={handleInsightClick}
                        />
                        <InsightCard
                            id="revenue"
                            title="Revenue Predictions"
                            description="AI forecasts revenue for coming months with growth suggestions"
                            onClick={handleInsightClick}
                        />
                    </div>
                </div>

                {/* 4. Other Sections */}
                {sections.map((section) => (
                    <div key={section.id} onClick={()=>navigate("")} className="animate-slide-up">
                        <SectionHeader
                            icon={section.icon}
                            title={section.title}
                            subtitle={section.subtitle}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {section.cards.map((card, idx) => (
                                <ActionCard
                                    key={idx}
                                    title={card.title}
                                    description={card.desc}
                                    badge={card.badge}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* --- AI ANALYZING / RESULT MODAL --- */}
            {selectedInsight && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fade-in p-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative animate-scale-up">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0">
                            <div className="flex items-center gap-2">
                                <Sparkles
                                    size={18}
                                    className="text-[#5aa39c] fill-[#5aa39c]"
                                />
                                <h3 className="font-bold text-slate-800 text-lg">
                                    {INSIGHT_DATA[selectedInsight].title}
                                </h3>
                                <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">
                                    AI Powered
                                </span>
                            </div>
                            <button
                                onClick={() => setSelectedInsight(null)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 min-h-[320px] flex flex-col">
                            {/* LOADING STATE */}
                            {isLoadingInsight ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
                                    <div className="relative">
                                        <div className="w-16 h-16 border-4 border-[#eaf4f3] border-t-[#5aa39c] rounded-full animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Sparkles
                                                size={20}
                                                className="text-[#5aa39c] animate-pulse"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-slate-800 font-medium text-lg">
                                            {
                                                INSIGHT_DATA[selectedInsight]
                                                    .loadingText
                                            }
                                        </p>
                                        <p className="text-gray-400 text-sm mt-1">
                                            Processing data points...
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                /* RESULT STATE */
                                <div className="space-y-6 animate-fade-in">
                                    {/* Metrics List */}
                                    <div className="space-y-6">
                                        {INSIGHT_DATA[
                                            selectedInsight
                                        ].metrics.map((metric, idx) => (
                                            <div
                                                key={idx}
                                                className="flex justify-between items-start group"
                                            >
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800 mb-1">
                                                        {metric.label}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {metric.subtext}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    {metric.isHighlight ? (
                                                        <span className="text-[#5aa39c] font-bold text-lg">
                                                            {metric.value}
                                                        </span>
                                                    ) : (
                                                        <div className="flex items-center justify-end gap-2">
                                                            <span className="font-bold text-lg text-slate-900">
                                                                {metric.value}
                                                            </span>
                                                            {metric.trend && (
                                                                <span className="bg-green-50 text-green-600 text-[10px] font-bold px-1.5 py-0.5 rounded border border-green-100 flex items-center gap-0.5">
                                                                    <ArrowUpRight
                                                                        size={
                                                                            10
                                                                        }
                                                                    />{" "}
                                                                    {
                                                                        metric.trend
                                                                    }
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* AI Recommendation Box */}
                                    <div className="bg-[#eaf4f3]/50 border border-[#5aa39c]/20 rounded-xl p-4 flex gap-3 items-start">
                                        <Lightbulb
                                            size={20}
                                            className="text-[#5aa39c] shrink-0 mt-0.5"
                                        />
                                        <div>
                                            <p className="text-xs font-bold text-[#5aa39c] mb-1">
                                                AI Recommendation
                                            </p>
                                            <p className="text-sm text-slate-700 leading-relaxed">
                                                {
                                                    INSIGHT_DATA[
                                                        selectedInsight
                                                    ].recommendation
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    {/* Refresh Button */}
                                    <div className="pt-2 flex justify-end">
                                        <button
                                            onClick={handleRefresh}
                                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-lg text-sm font-semibold text-gray-600 hover:text-[#5aa39c] hover:border-[#5aa39c] transition-all"
                                        >
                                            <RefreshCw size={14} /> Refresh
                                            Insights
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Styles for Animations */}
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        .animate-scale-up {
          animation: scaleUp 0.3s ease-out forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.6s ease-out forwards;
        }
      `}</style>
        </div>
    );
};

export default Dashboard;
