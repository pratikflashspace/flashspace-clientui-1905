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
import { StatsSkeleton, FeatureSectionSkeleton } from "@/components/ui/skeleton-loaders";
import { useNavigate } from "react-router-dom";
import { NotificationBell } from "@/components/NotificationBell";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { Copy, CheckCircle } from "lucide-react";

import { affiliatePortalService, RevenueDashboardStats } from "@/services/affiliatePortal.service";

// --- Types & Data ---

type InsightType = "renewal" | "crossSell" | "performance" | "revenue";

interface InsightMetric {
    label: string; // The big number/text
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

// Stats Data Interface
interface DashboardStats {
    totalReferrals: number;
    convertedClients: number;
    totalEarnings: number;
    pendingPayout: number;
}

// --- Sub-Components ---

import StatCardDashboard from "@/components/affiliatePortal/StatCardDashboard";
import InsightCard from "@/components/affiliatePortal/InsightCard";
import SectionHeader from "@/components/affiliatePortal/SectionHeader";
import ActionCard from "@/components/affiliatePortal/ActionCard";


// --- Main Dashboard Component ---

const Dashboard = () => {
    const [selectedInsight, setSelectedInsight] = useState<InsightType | null>(null);
    const [isLoadingInsight, setIsLoadingInsight] = useState(false);
    const [dashboardStats, setDashboardStats] = useState<RevenueDashboardStats | null>(null);
    const [insightData, setInsightData] = useState<Record<InsightType, InsightContent> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [coupon, setCoupon] = useState<any>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const { user, refreshProfile } = useAuth();
    const navigate = useNavigate();

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Refresh profile to get latest KYC status
                await refreshProfile();

                const [statsRes, insightsRes, couponRes] = await Promise.allSettled([
                    affiliatePortalService.getDashboardStats(),
                    affiliatePortalService.getAIInsights(),
                    affiliatePortalService.getMyCoupon()
                ]);

                if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
                    setDashboardStats(statsRes.value.data as RevenueDashboardStats);
                }
                if (insightsRes.status === 'fulfilled' && insightsRes.value?.data) {
                    setInsightData(insightsRes.value.data as Record<InsightType, InsightContent>);
                }
                if (couponRes.status === 'fulfilled' && couponRes.value?.data) {
                    setCoupon(couponRes.value.data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleGenerateCoupon = async () => {
        if (!user?.kycVerified) {
            toast.error("Your KYC must be approved by admin before generating a coupon.");
            return;
        }

        setIsGenerating(true);
        try {
            const response = await affiliatePortalService.generateCoupon();
            if (response.success) {
                setCoupon(response.data);
                toast.success("Coupon generated successfully!");
            } else {
                toast.error(response.message || "Failed to generate coupon");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Error generating coupon");
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Coupon code copied to clipboard!");
    };

    // Handle opening the modal
    const handleInsightClick = (id: InsightType) => {
        if (!insightData || !insightData[id]) return;
        setSelectedInsight(id);
        // No need to simulate loading if data is already there, but we can keep it for effect
        setIsLoadingInsight(true);
    };

    // Handle the "Refresh" simulation
    const handleRefresh = () => {
        setIsLoadingInsight(true);
        // Re-fetch logic could go here
        setTimeout(() => setIsLoadingInsight(false), 1500);
    };

    // Effect to simulate loading delay (2 seconds)
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (selectedInsight && isLoadingInsight) {
            timer = setTimeout(() => {
                setIsLoadingInsight(false);
            }, 1000); // reduced to 1 second
        }
        return () => clearTimeout(timer);
    }, [selectedInsight, isLoadingInsight]);

    // 3 stat cards: Total Earnings (dynamic), Total Clients (dynamic), Pending Payout (static)
    const formatCurrency = (v: number) =>
        new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);

    const formatCompactCurrency = (v: number) => {
        if (v >= 100000) {
            return `₹${(v / 100000).toFixed(1)}L`;
        }
        if (v >= 1000) {
            return `₹${(v / 1000).toFixed(0)}K`;
        }
        return `₹${v}`;
    };

    const stats = [
        {
            label: "Total Earnings",
            value: dashboardStats?.totalEarnings !== undefined ? formatCompactCurrency(dashboardStats.totalEarnings) : "₹0",
            trend: "18% from last month",
            icon: TrendingUp,
        },
        {
            label: "Total Clients",
            value: dashboardStats?.convertedClients?.toString() || "0",
            trend: "22% from last month",
            icon: Users,
        },
        {
            label: "Pending Payout",
            value: dashboardStats?.pendingPayout !== undefined ? formatCompactCurrency(dashboardStats.pendingPayout) : "₹0",
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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#f7f7f6] p-6 lg:p-10 font-sans space-y-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <div className="h-10 w-64 bg-gray-200 rounded" />
                        <div className="h-6 w-96 bg-gray-100 rounded" />
                    </div>
                </div>
                <StatsSkeleton count={3} />
                <FeatureSectionSkeleton />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f7f6] p-6 lg:p-10 font-sans animate-fade-in relative">
            <div className="w-full space-y-10">
                {/* 1. Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                            Affiliate <span className="text-[#35503F] italic font-medium">Dashboard</span>
                        </h1>
                        <p className="text-gray-500 text-lg">
                            Track your referrals, revenue, and performance
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-[#f8f8f8] p-1 rounded-full shadow-sm border border-gray-100">
                            <NotificationBell />
                        </div>
                    </div>
                </div>

                {/* 2. Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                            <Sparkles size={20} className="text-[#334D3D]" />{" "}
                            AI-Powered Insights
                        </h2>
                        <p className="text-sm text-gray-500">
                            Leverage AI to maximize your earnings
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

                {/* Referral Reward Program (Coupon Generation) */}
                <div className="bg-[#f8f8f8] rounded-2xl border border-gray-200 p-8 shadow transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#334D3D]/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110 duration-700"></div>

                    <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="space-y-4 max-w-2xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#eaf4f3] rounded-lg">
                                    <Trophy size={24} className="text-[#334D3D]" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">Referral Reward Program</h2>
                            </div>
                            <p className="text-gray-500 leading-relaxed">
                                Share your unique coupon code with potential clients. They get a <span className="text-[#334D3D] font-bold text-lg">10% discount</span> on their first booking, and you earn commissions on every successful conversion!
                            </p>
                            {!user?.kycVerified && (
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-100 rounded-full text-amber-700 text-xs font-semibold">
                                    <X size={12} /> KYC Approval Pending
                                </div>
                            )}
                        </div>

                        <div className="shrink-0">
                            {coupon ? (
                                <div className="bg-slate-50 border-2 border-dashed border-[#334D3D]/30 rounded-2xl p-6 flex flex-col items-center gap-4 animate-fade-in min-w-[280px]">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Your Unique Code</span>
                                    <div className="flex items-center gap-3">
                                        <code className="text-3xl font-black text-slate-900 tracking-tighter bg-[#f8f8f8] px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                                            {coupon.code}
                                        </code>
                                        <button
                                            onClick={() => copyToClipboard(coupon.code)}
                                            className="p-3 bg-[#334D3D] text-white rounded-xl hover:bg-[#335D3D] transition-colors shadow-md hover:shadow-lg active:scale-95 translate-y-0 hover:-translate-y-1 duration-200"
                                            title="Copy Code"
                                        >
                                            <Copy size={20} />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2 text-[#334D3D] text-xs font-bold">
                                        <CheckCircle size={14} /> Ready to share
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={handleGenerateCoupon}
                                    disabled={!user?.kycVerified || isGenerating}
                                    className={`relative px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl flex items-center gap-3 overflow-hidden ${user?.kycVerified
                                        ? "bg-[#334D3D] text-white hover:bg-[#335D3D] hover:shadow-[#334D3D]/20 hover:-translate-y-1 active:translate-y-0 active:scale-95"
                                        : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 shadow-none"
                                        }`}
                                >
                                    {isGenerating ? (
                                        <>
                                            <RefreshCw size={24} className="animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={24} />
                                            Generate My Code
                                        </>
                                    )}
                                    {!user?.kycVerified && (
                                        <div className="absolute inset-0 bg-gray-50/10 backdrop-blur-[1px]"></div>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* 4. Other Sections */}
                {sections.map((section) => (
                    <div key={section.id} onClick={() => navigate("")} className="animate-slide-up">
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
            {selectedInsight && insightData && insightData[selectedInsight] && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fade-in p-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative animate-scale-up">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[#f8f8f8] sticky top-0">
                            <div className="flex items-center gap-2">
                                <Sparkles
                                    size={18}
                                    className="text-[#334D3D] fill-[#334D3D]"
                                />
                                <h3 className="font-bold text-slate-800 text-lg">
                                    {insightData[selectedInsight].title}
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
                                        <div className="w-16 h-16 border-4 border-[#eaf4f3] border-t-[#334D3D] rounded-full animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Sparkles
                                                size={20}
                                                className="text-[#334D3D] animate-pulse"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-slate-800 font-medium text-lg">
                                            {
                                                insightData[selectedInsight]
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
                                        {insightData[
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
                                                        <span className="text-[#334D3D] font-bold text-lg">
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
                                    <div className="bg-[#eaf4f3]/50 border border-[#334D3D]/20 rounded-xl p-4 flex gap-3 items-start">
                                        <Lightbulb
                                            size={20}
                                            className="text-[#334D3D] shrink-0 mt-0.5"
                                        />
                                        <div>
                                            <p className="text-xs font-bold text-[#334D3D] mb-1">
                                                AI Recommendation
                                            </p>
                                            <p className="text-sm text-slate-700 leading-relaxed">
                                                {
                                                    insightData[
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
                                            className="flex items-center gap-2 px-4 py-2 bg-[#f8f8f8] border border-gray-200 shadow rounded-lg text-sm font-semibold text-gray-600 hover:text-[#334D3D] hover:border-[#334D3D] transition-all"
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

        </div>
    );
};

export default Dashboard;
