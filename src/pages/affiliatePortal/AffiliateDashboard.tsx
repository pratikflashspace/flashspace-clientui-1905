import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
    BadgePercent,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/lib/axios";

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

import StatCardDashboard from "@/components/affiliatePortal/StatCardDashboard";
import InsightCard from "@/components/affiliatePortal/InsightCard";
import SectionHeader from "@/components/affiliatePortal/SectionHeader";
import ActionCard from "@/components/affiliatePortal/ActionCard";


// --- Main Dashboard Component ---

const Dashboard = () => {
    const [selectedInsight, setSelectedInsight] = useState<InsightType | null>(
        null,
    );
    const [isLoadingInsight, setIsLoadingInsight] = useState(false);
    const navigate = useNavigate();

    // ── Dynamic stat state ────────────────────────────────────────────────
    const [totalCommission, setTotalCommission] = useState<number | null>(null);
    const [totalClients, setTotalClients] = useState<number | null>(null);
    const [pendingPayout, setPendingPayout] = useState(0);

    useEffect(() => {
        axiosInstance
            .get<{ success: boolean; data: { stats: { totalCommission: number; totalClients: number } } }>(
                "/api/affiliate/clients"
            )
            .then((res) => {
                if (res.data.success) {
                    setTotalCommission(res.data.data.stats.totalCommission);
                    setTotalClients(res.data.data.stats.totalClients);
                }
            })
            .catch(() => {/* silently ignore — stats stay null (shown as —) */ });

        axiosInstance.get("/api/affiliate/invoices")
            .then((res) => {
                if (res.data.success && res.data.data) {
                    const invoices = res.data.data.invoices || [];
                    const stored = localStorage.getItem("affiliate_paid_payouts");
                    let paidInvoiceIds: string[] = [];
                    if (stored) {
                        try {
                            paidInvoiceIds = JSON.parse(stored);
                        } catch (e) {
                            console.error(e);
                        }
                    }
                    const validInvoices = invoices.filter((inv: any) => inv.commission && inv.commission > 0);
                    const pendingInvoices = validInvoices.filter((inv: any) => !paidInvoiceIds.includes(inv._id || inv.invoiceNumber));
                    const calculatedPending = pendingInvoices.reduce((sum: number, inv: any) => sum + inv.commission, 0);
                    setPendingPayout(calculatedPending);
                }
            })
            .catch(() => {});
    }, []);

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

    // 3 stat cards: Total Earnings (dynamic), Total Clients (dynamic), Pending Payout (static)
    const formatFullINR = (value: number) => {
        return value.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        });
    };

    const stats = [
        {
            label: "Total Earnings",
            value: totalCommission !== null ? formatFullINR(totalCommission) : "—",
            trend: "Commission @ 15% of paid amount",
            icon: BadgePercent,
        },
        {
            label: "Total Clients",
            value: totalClients !== null ? String(totalClients) : "—",
            trend: "Bookings via your coupon code",
            icon: Users,
        },
        {
            label: "Pending Payout",
            value: formatFullINR(pendingPayout),
            trend: null,
            icon: Wallet,
        },
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
                    path: "/affiliate-portal/booking-management",
                },
                {
                    title: "Client Tracking",
                    desc: "Track all clients from referral to conversion and beyond",
                    path: "/affiliate-portal/booking-management",
                },
                {
                    title: "Status Updates",
                    desc: "Real-time updates on client booking progress",
                    path: "/affiliate-portal/booking-management",
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
                    path: "/affiliate-portal/revenue-dashboard",
                },
                {
                    title: "Payout Tracking",
                    desc: "Track completed payouts, pending, and expected dates",
                    path: "/affiliate-portal/payouts",
                },
                {
                    title: "Auto Invoicing",
                    desc: "Generate and share invoices automatically with clients",
                    path: "/affiliate-portal/affiliate-invoices",
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
                    path: "/affiliate-portal/quotation-generator",
                },
                {
                    title: "Lead Follow-ups",
                    desc: "Integrated phone and email follow-ups for all leads",
                    path: "/affiliate-portal/lead-management",
                },
                {
                    title: "Lead Management",
                    desc: "Manage all your leads in one place with status tracking",
                    path: "/affiliate-portal/lead-management",
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
                    path: "/affiliate-portal/leaderboard",
                },
                {
                    title: "National Leaderboard",
                    desc: "Compete with affiliates pan-India for top positions",
                    path: "/affiliate-portal/leaderboard",
                },
                {
                    title: "AI Support Chat",
                    desc: "Get queries resolved with AI that escalates to support when needed",
                    badge: "AI",
                    path: "/affiliate-portal/support",
                },
            ],
        },
    ];

    return (
 <div className="min-h-screen p-4 md:p-6 lg:p-8 bg-[#FAFAF7] font-sans relative">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* 1. Page Header */}
                <div className="space-y-1">
                    <h1 style={{ fontFamily: "'Inter', sans-serif" }} className="text-3xl font-extrabold tracking-tight">
                        <span className="text-[#1A1A1A]">Affiliate </span>
                        <span className="text-[#36503F] italic">Dashboard</span>
                    </h1>
                    <p className="text-sm md:text-base font-medium text-[#6B8F78]">
                        Track your referrals, revenue, and performance
                    </p>
                </div>

                {/* 2. Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, idx) => (
                        <StatCardDashboard
                            key={idx}
                            {...stat}
                            delay={idx * 100}
                        />
                    ))}
                </div>

                <div className="space-y-6 pt-6">
                    <div className="space-y-0.5">
                        <h2 style={{ fontFamily: "'Inter', sans-serif" }} className="text-2xl font-extrabold tracking-tight text-[#1A1A1A]">
                            AI-Powered Insights
                        </h2>
                        <p className="text-sm font-medium text-[#6B8F78]">
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
                    <div key={section.id} className="animate-slide-up">
                        <SectionHeader
                            icon={section.icon}
                            title={section.title}
                            subtitle={section.subtitle}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {section.cards.map((card, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => {
                                        // Use the path directly from the card object
                                        if (card.path) {
                                            navigate(card.path);
                                        }
                                    }}
                                    className="cursor-pointer transition-transform hover:scale-[1.02]"
                                >
                                    <ActionCard
                                        title={card.title}
                                        description={card.desc}
                                        badge={card.badge}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* --- AI ANALYZING / RESULT MODAL --- */}
            {selectedInsight && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fade-in p-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative animate-scale-up">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0">
                            <div className="flex items-center gap-2">
                                <Sparkles
                                    size={18}
                                    className="text-[#36503F] fill-[#36503F]"
                                />
                                <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-lg font-bold text-[#1A1A1A]">
                                    {INSIGHT_DATA[selectedInsight].title}
                                </h3>
                                <span className="px-2.5 py-0.5 bg-[#F0F4EE] rounded-full text-xs font-semibold text-[#36503F] ml-1">
                                    Ai Powered
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
                                        <div className="w-16 h-16 border-4 border-[#eaf4f3] border-t-[#36503F] rounded-full animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Sparkles
                                                size={20}
                                                className="text-[#36503F] animate-pulse"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[#1A1A1A] font-bold text-lg">
                                            {
                                                INSIGHT_DATA[selectedInsight]
                                                    .loadingText
                                            }
                                        </p>
                                        <p className="text-[#6B8F78] font-medium text-sm mt-1">
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
                                                    <p className="text-sm font-bold text-[#1A1A1A] mb-1">
                                                        {metric.label}
                                                    </p>
                                                    <p className="text-xs font-medium text-[#6B8F78]">
                                                        {metric.subtext}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    {metric.isHighlight ? (
                                                        <span className="text-[#36503F] font-extrabold text-lg">
                                                            {metric.value}
                                                        </span>
                                                    ) : (
                                                        <div className="flex items-center justify-end gap-2">
                                                            <span className="font-extrabold text-lg text-[#1A1A1A]">
                                                                {metric.value}
                                                            </span>
                                                            {metric.trend && (
                                                                <span className="bg-[#F0F4EE] text-[#36503F] text-sm font-bold px-1.5 py-0.5 rounded border border-[#D4E0D0] flex items-center gap-0.5">
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
                                    <div className="bg-[#F0F4EE] border border-[#D4E0D0] rounded-xl p-4 flex gap-3 items-start">
                                        <Lightbulb
                                            size={20}
                                            className="text-[#36503F] shrink-0 mt-0.5"
                                        />
                                        <div>
                                            <p className="text-xs font-bold text-[#36503F] mb-1">
                                                AI Recommendation
                                            </p>
                                            <p className="text-sm text-[#1A1A1A] font-medium leading-relaxed">
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
                                            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#D4E0D0] shadow-[rgba(23,34,38,0.08)_0px_4px_24px_-4px] rounded-lg text-sm font-semibold text-[#1A1A1A] hover:border-[#36503F]/60 transition-all"
                                        >
                                            <RefreshCw size={14} /> Refresh
                                            Insights
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}

        </div>
    );
};

export default Dashboard;
