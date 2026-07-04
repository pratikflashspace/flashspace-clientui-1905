import React, { useEffect, useState } from "react";
import {
    TrendingUp,
    Wallet,
    Banknote,
    Sparkles,
    ArrowUpRight,
    Loader2,
} from "lucide-react";
import { affiliatePortalService, RevenueDashboardStats } from "../../services/affiliatePortal.service";

// --- Custom Hook for Number Counting Animation ---
const useCountUp = (end: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = currentTime - startTime;

            if (progress < duration) {
                const nextCount = Math.min(end, (progress / duration) * end);
                setCount(nextCount);
                requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        requestAnimationFrame(animate);
    }, [end, duration]);

    return count;
};

// --- Sub-Component: Animated Counter ---
const AnimatedCounter = ({
    value,
    prefix = "",
    suffix = "",
    decimals = 0,
}: {
    value: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
}) => {
    const count = useCountUp(value, 1500);
    return (
        <span>
            {prefix}
            {count.toFixed(decimals)}
            {suffix}
        </span>
    );
};

const StatCard = ({ label, value, trend, icon: Icon, delay }: any) => (
    <div
        className="bg-white border border-[#D4E0D0] rounded-xl shadow-[rgba(23,34,38,0.08)_0px_4px_24px_-4px] p-6 transition-all hover:shadow-lg group"
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-[#6B8F78]">{label}</span>
            <div className="w-8 h-8 rounded-lg bg-[#36503F]/10 flex items-center justify-center">
                <Icon
                    className="w-4 h-4 text-[#36503F]"
                />
            </div>
        </div>
        <div className="space-y-2">
            <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-[24px] font-extrabold text-[#1A1A1A] tracking-tight">{value}</h3>
            {trend && (
                <div className={`flex items-center gap-1.5 text-xs font-bold ${trend.startsWith('-') ? 'text-red-500' : 'text-[#10b981]'}`}>
                    <ArrowUpRight size={14} className={trend.startsWith('-') ? 'rotate-90' : ''} />
                    <span>{trend} from last month</span>
                </div>
            )}
        </div>
    </div>
);

const TrendBar = ({ label, value, subValue, percentage, color = "bg-[#334D3D]" }: any) => (
    <div className="group mb-6 last:mb-0">
        <div className="flex justify-between items-end mb-2.5">
            <span className="text-sm font-bold text-[#1A1A1A]">{label}</span>
            <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#1A1A1A]">{value}</span>
                {subValue && (
                    <span className="px-2.5 py-0.5 bg-[#F0F4EE] rounded-full text-xs font-semibold text-[#6B8F78] border border-[#D4E0D0]">
                        {subValue}
                    </span>
                )}
            </div>
        </div>
        <div className="h-2 w-full bg-[#F0F4EE] rounded-full overflow-hidden">
            <div
                className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${percentage}%` }}
            />
        </div>
    </div>
);

const DashboardRevenue = () => {
    const [stats, setStats] = useState<RevenueDashboardStats | null>(null);
    const [pendingPayout, setPendingPayout] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [res, invoicesRes] = await Promise.allSettled([
                    affiliatePortalService.getRevenueDashboardStats(),
                    affiliatePortalService.getInvoices(),
                ]);

                if (res.status === 'fulfilled' && res.value?.success && res.value?.data) {
                    setStats(res.value.data);
                }

                if (invoicesRes.status === 'fulfilled' && invoicesRes.value?.success && invoicesRes.value?.data) {
                    const invoices = invoicesRes.value.data.invoices || [];
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
            } catch (error) {
                console.error("Failed to load dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading || !stats) {
        return (
 <div className="min-h-screen p-4 md:p-6 lg:p-8 bg-[#FAFAF7] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-[#36503F]" />
                    <p className="text-[#6B8F78] font-medium">Loading your revenue dashboard...</p>
                </div>
            </div>
        );
    }

    const formatShortINR = (val: number) => {
        const sign = val < 0 ? "-" : "";
        const amount = Math.abs(val);
        const compact = (unit: number, suffix: string) => {
            const floored = Math.floor((amount / unit) * 10) / 10;
            return `${sign}${floored.toFixed(1).replace(/\.0$/, "")}${suffix}`;
        };
        if (amount >= 10000000) return compact(10000000, "Cr");
        if (amount >= 100000) return compact(100000, "L");
        if (amount >= 1000) return compact(1000, "K");
        return `${sign}${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
    };

    const formatFullINR = (val: number) => `Rs ${val.toLocaleString("en-IN")}`;

    const lastMonth = stats.monthlyEarnings && stats.monthlyEarnings.length > 0
        ? stats.monthlyEarnings[stats.monthlyEarnings.length - 1]
        : { earnings: 0, clients: 0 };

    const topCards = [
        {
            label: "Total Earnings",
            value: formatShortINR(stats.totalEarnings),
            trend: stats.momGrowth ? `${stats.momGrowth}%` : null,
            icon: TrendingUp,
        },
        {
            label: "This Month",
            value: formatShortINR(lastMonth.earnings),
            trend: stats.momGrowth ? `${stats.momGrowth}%` : null,
            icon: Wallet,
        },
        {
            label: "Pending Payout",
            value: formatShortINR(pendingPayout),
            icon: Banknote,
        },
        {
            label: "Avg Commission",
            value: formatShortINR(stats.convertedClients > 0 ? stats.totalEarnings / stats.convertedClients : 0),
            trend: null,
            icon: Sparkles,
        },
    ];

    // Dynamic Monthly Trends
    const maxEarnings = Math.max(...(stats.monthlyEarnings?.map((m: any) => m.earnings) || [1]));
    const dynamicMonthlyTrends = stats.monthlyEarnings?.map((m: any) => ({
        label: m.month,
        value: formatFullINR(m.earnings),
        subValue: `${m.clients} deals`,
        percentage: (m.earnings / (maxEarnings || 1)) * 100
    })) || [];

    // Map Product Revenue from actual backend data
    const dynamicProductRevenue = stats.revenueByProduct?.map(p => ({
        label: p.label,
        value: formatFullINR(p.value),
        subValue: `(${p.percentage.toFixed(0)}%)`,
        percentage: p.percentage
    })) || [];

    return (
 <div className="min-h-screen p-4 md:p-6 lg:p-8 bg-[#FAFAF7] font-sans w-full">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* 1. Header */}
                <div className="space-y-1">
                    <h1 className="text-3xl font-extrabold tracking-tight text-[#1A1A1A]">
                        <span className="text-[#1A1A1A]">Revenue </span>
                        <span className="text-[#36503F] italic">Dashboard</span>
                    </h1>
                    <p className="text-[16px] font-medium text-[#6B7280]">
                        Track your earnings and commission trends
                    </p>
                </div>

                {/* 2. Top Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {topCards.map((stat, idx) => (
                        <StatCard
                            key={idx}
                            {...stat}
                            delay={idx * 100}
                        />
                    ))}
                </div>

                {/* 3. Trends Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Monthly Earnings Trend */}
                    <div className="bg-white border border-[#D4E0D0] rounded-xl shadow-[rgba(23,34,38,0.08)_0px_4px_24px_-4px] p-6 space-y-5">
                        <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-lg font-bold text-[#1A1A1A]">
                            Monthly Earnings Trend
                        </h3>
                        <div className="space-y-1">
                            {dynamicMonthlyTrends.length > 0 ? (
                                dynamicMonthlyTrends.map((trend, idx) => (
                                    <TrendBar key={idx} {...trend} />
                                ))
                            ) : (
                                <p className="text-[#6B8F78] text-center py-10 font-medium">No earnings data available.</p>
                            )}
                        </div>
                    </div>

                    {/* Revenue by Product */}
                    <div className="bg-white border border-[#D4E0D0] rounded-xl shadow-[rgba(23,34,38,0.08)_0px_4px_24px_-4px] p-6 space-y-5">
                        <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-lg font-bold text-[#1A1A1A]">
                            Revenue by Product
                        </h3>
                        <div className="space-y-1">
                            {dynamicProductRevenue.length > 0 ? (
                                dynamicProductRevenue.map((product, idx) => (
                                    <TrendBar key={idx} {...product} />
                                ))
                            ) : (
                                <p className="text-[#6B8F78] text-center py-10 font-medium">No product breakdown available.</p>
                            )}
                        </div>
                    </div>
                </div>



                {/* Global CSS for Animations */}
                <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
            </div>
        </div>
    );
};

export default DashboardRevenue;

