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
        className="bg-[#f8f8f8] p-7 rounded-[2rem] border border-gray-200 shadow transition-all duration-300 group animate-fade-in-up"
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="flex justify-between items-start mb-4">
            <span className="text-[#64748b] font-medium text-[14px] tracking-tight">{label}</span>
            <div className="w-10 h-10 flex items-center justify-center bg-[#f1f5f9] rounded-full transition-colors group-hover:bg-[#e2e8f0]">
                <Icon
                    size={20}
                    className="text-[#64748b]"
                />
            </div>
        </div>
        <div className="space-y-2">
            <h3 className="text-[2rem] font-black text-[#1a2d1d] leading-none" style={{ fontFamily: "'Inter Tight', sans-serif" }}>{value}</h3>
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
            <span className="text-[14px] font-bold text-[#1a2d1d] tracking-tight">{label}</span>
            <div className="flex items-center gap-2">
                <span className="text-[15px] font-black text-[#1a2d1d]">{value}</span>
                {subValue && (
                    <span className="px-2 py-0.5 bg-gray-100 rounded-full text-[11px] font-extrabold text-[#64748b] border border-gray-200">
                        {subValue}
                    </span>
                )}
            </div>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
                className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${percentage}%` }}
            />
        </div>
    </div>
);

const DashboardRevenue = () => {
    const [stats, setStats] = useState<RevenueDashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await affiliatePortalService.getRevenueDashboardStats();
                if (res.success && res.data) {
                    setStats(res.data);
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
            <div className="min-h-screen bg-[#f7f7f6] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-[#334D3D]" />
                    <p className="text-[#64748b] font-medium">Loading your revenue dashboard...</p>
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
            value: formatShortINR(stats.pendingPayout),
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
        <div className="min-h-screen bg-[#f7f7f6] p-8 lg:p-12 font-sans w-full animate-fade-in">
            <div className="max-w-[1400px] mx-auto space-y-12">
                {/* 1. Header */}
                <div className="animate-fade-in-down">
                    <h1 className="text-3xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                        Revenue <span className="text-[#4A6D56] italic">Dashboard</span>
                    </h1>
                    <p className="mt-2 text-lg font-medium text-[#6B8F78] tracking-tight">
                        Track your earnings and commission trends
                    </p>
                </div>

                {/* 2. Top Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {topCards.map((stat, idx) => (
                        <StatCard
                            key={idx}
                            {...stat}
                            delay={idx * 100}
                        />
                    ))}
                </div>

                {/* 3. Trends Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Monthly Earnings Trend */}
                    <div className="bg-[#f8f8f8] p-10 rounded-[2.5rem] border border-gray-200 shadow">
                        <h3 className="text-[1.25rem] font-black text-[#1a2d1d] mb-10 tracking-tight">
                            Monthly Earnings Trend
                        </h3>
                        <div className="space-y-1">
                            {dynamicMonthlyTrends.length > 0 ? (
                                dynamicMonthlyTrends.map((trend, idx) => (
                                    <TrendBar key={idx} {...trend} />
                                ))
                            ) : (
                                <p className="text-[#64748b] text-center py-10 font-medium">No earnings data available.</p>
                            )}
                        </div>
                    </div>

                    {/* Revenue by Product */}
                    <div className="bg-[#f8f8f8] p-10 rounded-[2.5rem] border border-gray-200 shadow">
                        <h3 className="text-[1.25rem] font-black text-[#1a2d1d] mb-10 tracking-tight">
                            Revenue by Product
                        </h3>
                        <div className="space-y-1">
                            {dynamicProductRevenue.length > 0 ? (
                                dynamicProductRevenue.map((product, idx) => (
                                    <TrendBar key={idx} {...product} />
                                ))
                            ) : (
                                <p className="text-[#64748b] text-center py-10 font-medium">No product breakdown available.</p>
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

