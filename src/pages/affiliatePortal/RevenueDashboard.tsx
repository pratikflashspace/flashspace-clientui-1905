import React, { useEffect, useState } from "react";
import {
    TrendingUp,
    Wallet,
    CreditCard,
    Banknote,
    Sparkles,
    ArrowUpRight,
    Loader2,
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
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

// --- Custom Tooltip for Area Chart ---
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                <p className="font-bold text-slate-800 mb-2">{label}</p>
                <div className="space-y-1">
                    <p className="text-[#5aa39c] font-medium flex justify-between gap-4">
                        <span>Earnings:</span>
                        <span>₹{payload[0].value.toLocaleString()}</span>
                    </p>
                    <p className="text-[#8fb6b1] font-medium flex justify-between gap-4">
                        <span>Clients:</span>
                        <span>{payload[1].value}</span>
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

// --- Main Component ---
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
            <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 animate-pulse">
                    <Loader2 className="w-10 h-10 animate-spin text-[#5aa39c]" />
                    <p className="text-gray-500 font-medium">Loading your revenue data...</p>
                </div>
            </div>
        );
    }

    const monthlyEarnings = stats.monthlyEarnings || [];

    const topCards = [
        {
            label: "Total Earnings",
            value: stats.totalEarnings || 0,
            prefix: "₹",
            decimals: 2,
            change: stats.momGrowth ? `${stats.momGrowth > 0 ? "+" : ""}${stats.momGrowth}% MoM` : null,
            icon: TrendingUp,
        },
        {
            label: "Converted Clients",
            value: stats.convertedClients || 0,
            decimals: 0,
            icon: Wallet,
        },
        {
            label: "Pending Payout",
            value: stats.pendingPayout || 0,
            prefix: "₹",
            decimals: 2,
            icon: Banknote,
        },
        {
            label: "Commission Rate",
            value: stats.commissionRate || 15,
            suffix: "%",
            decimals: 0,
            icon: CreditCard,
        },
    ];

    return (
        <div className="min-h-screen bg-[#fafafa] p-6 lg:p-10 font-sans w-full animate-fade-in">
            <div className="max-w-[1600px] mx-auto space-y-8">
                {/* 1. Header */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Revenue{" "}
                        <span className="text-[#5aa39c] italic">
                            Dashboard
                        </span>
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Track your real-time earnings and commission trends
                    </p>
                </div>

                {/* 2. Top Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {topCards.map((stat, idx) => (
                        <div
                            key={idx}
                            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-gray-500 font-medium text-sm">
                                    {stat.label}
                                </span>
                                <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-[#eaf4f3] group-hover:scale-110 transition-all duration-500">
                                    <stat.icon
                                        size={20}
                                        className="text-gray-400 group-hover:text-[#5aa39c] transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-4xl font-bold text-slate-900 tracking-tight">
                                    <AnimatedCounter
                                        value={stat.value}
                                        prefix={stat.prefix}
                                        suffix={stat.suffix}
                                        decimals={stat.decimals}
                                    />
                                </h3>
                                {stat.change && (
                                    <div className={`flex items-center gap-1 text-sm font-semibold ${stat.change.includes("-") ? "text-red-500" : "text-emerald-500"}`}>
                                        <ArrowUpRight size={16} className={stat.change.includes("-") ? "rotate-90 text-red-500" : ""} />
                                        <span>{stat.change}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* 3. Charts Section */}
                <div className="grid grid-cols-1 gap-6">
                    {/* Main Highlight: Full Width Area Chart */}
                    <div className="bg-white p-6 lg:p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 h-[500px] flex flex-col">
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-slate-900">
                                Earnings Overview
                            </h3>
                            <p className="text-sm text-gray-500 font-medium mt-1">
                                Last 6 months performance and client acquisition
                            </p>
                        </div>

                        <div className="flex-1 w-full min-h-0 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={monthlyEarnings}
                                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                >
                                    <defs>
                                        <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#5aa39c" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#5aa39c" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorClients" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#94d2bd" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#94d2bd" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        yAxisId="left"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                                        tickFormatter={(value) => `₹${value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value}`}
                                    />
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="earnings"
                                        stroke="#5aa39c"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorEarnings)"
                                        animationDuration={2000}
                                        activeDot={{ r: 6, strokeWidth: 0, fill: '#5aa39c' }}
                                    />
                                    <Area
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="clients"
                                        stroke="#8fb6b1"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorClients)"
                                        animationDuration={2000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* 4. AI Insight Footer */}
                <div className="bg-gradient-to-r from-[#eaf4f3] to-[#f4fafa] border border-[#5aa39c]/20 p-6 lg:p-8 rounded-3xl animate-slide-up relative overflow-hidden shadow-sm">
                    {/* Decorative blurred blob */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#5aa39c]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

                    <div className="relative z-10 w-full flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#5aa39c]/10 shrink-0">
                            <Sparkles className="w-8 h-8 text-[#5aa39c]" />
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                                <h4 className="font-bold text-slate-900 text-lg">AI Performance Insight</h4>
                                {stats.momGrowth !== undefined && stats.momGrowth > 0 && (
                                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                        Growing {stats.momGrowth}% MoM
                                    </span>
                                )}
                            </div>
                            <p className="text-slate-600 text-base leading-relaxed max-w-4xl">
                                {stats.momGrowth !== undefined && stats.momGrowth > 0 ? (
                                    <>Your earnings have grown <strong>{stats.momGrowth}%</strong> compared to last month. You've successfully converted <strong>{stats.convertedClients || 0} clients</strong> so far. Keep up the momentum to maximize your 15% commission rate, and focus on your Hot Leads pipeline to ensure this month's payouts peak.</>
                                ) : (
                                    <>You've successfully converted <strong>{stats.convertedClients || 0} clients</strong> and have a 15% recurring commission rate. Focus on engaging your Warm and Hot leads to see Month-over-Month growth.</>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Global CSS for Animations */}
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
        </div>
    );
};

export default DashboardRevenue;
