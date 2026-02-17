import React, { useEffect, useState } from "react";
import {
    TrendingUp,
    Wallet,
    CreditCard,
    Banknote,
    Sparkles,
    ArrowUpRight,
    DollarSign,
} from "lucide-react";

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
// Handles formatting like "₹2.8L" while animating the "2.8" part
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
    const count = useCountUp(value, 1500); // 1.5s duration for smooth count
    return (
        <span>
            {prefix}
            {count.toFixed(decimals)}
            {suffix}
        </span>
    );
};

// --- Sub-Component: Animated Progress Bar ---
const AnimatedBar = ({
    percentage,
    color = "bg-[#5aa39c]",
}: {
    percentage: number;
    color?: string;
}) => {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        // Small delay to ensure render happens before transition
        const timer = setTimeout(() => {
            setWidth(percentage);
        }, 100);
        return () => clearTimeout(timer);
    }, [percentage]);

    return (
        <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
                className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${width}%` }}
            />
        </div>
    );
};

// --- Mock Data ---
const stats = [
    {
        label: "Total Earnings",
        value: 2.8,
        prefix: "₹",
        suffix: "L",
        decimals: 1,
        change: "22% from last month",
        icon: TrendingUp,
    },
    {
        label: "This Month",
        value: 45,
        prefix: "₹",
        suffix: "K",
        decimals: 0,
        change: "15% from last month",
        icon: Wallet,
    },
    {
        label: "Pending Payout",
        value: 28,
        prefix: "₹",
        suffix: "K",
        decimals: 0,
        change: null, // No change metric in screenshot
        icon: Banknote,
    },
    {
        label: "Avg Commission",
        value: 3.2,
        prefix: "₹",
        suffix: "K",
        decimals: 1,
        change: "8% from last month",
        icon: CreditCard,
    },
];

const earningsTrend = [
    { month: "Oct 2023", amount: 18500, deals: 5, width: 40 },
    { month: "Nov 2023", amount: 24200, deals: 7, width: 55 },
    { month: "Dec 2023", amount: 32800, deals: 9, width: 70 },
    { month: "Jan 2024", amount: 45000, deals: 12, width: 100 },
    { month: "Feb 2024 (MTD)", amount: 28000, deals: 8, width: 60 },
];

const revenueByProduct = [
    {
        product: "Virtual Office Premium",
        amount: 85000,
        percent: 35,
        width: 100,
    },
    { product: "Team Space", amount: 62000, percent: 26, width: 75 },
    {
        product: "Virtual Office Standard",
        amount: 48000,
        percent: 20,
        width: 58,
    },
    { product: "Meeting Rooms", amount: 28000, percent: 12, width: 35 },
    { product: "Day Pass", amount: 17000, percent: 7, width: 20 },
];

// --- Main Component ---
const DashboardRevenue = () => {
    return (
        <div className="min-h-screen bg-[#fafafa] p-6 lg:p-10 font-sans w-full animate-fade-in">
            <div className="w-full space-y-8">
                {/* 1. Header */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Revenue{" "}
                        <span className="text-[#5aa39c] italic">
                            Dashboard
                        </span>
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Track your earnings and commission trends
                    </p>
                </div>

                {/* 2. Top Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, idx) => (
                        <div
                            key={idx}
                            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-gray-500 font-medium text-sm">
                                    {stat.label}
                                </span>
                                <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-[#eaf4f3] transition-colors">
                                    <stat.icon
                                        size={18}
                                        className="text-gray-400 group-hover:text-[#5aa39c] transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-4xl font-bold text-slate-900">
                                    <AnimatedCounter
                                        value={stat.value}
                                        prefix={stat.prefix}
                                        suffix={stat.suffix}
                                        decimals={stat.decimals}
                                    />
                                </h3>
                                {stat.change && (
                                    <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                                        <ArrowUpRight size={14} />
                                        <span>{stat.change}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* 3. Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Chart: Monthly Earnings Trend */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                        <h3 className="font-bold text-slate-900 mb-6">
                            Monthly Earnings Trend
                        </h3>
                        <div className="space-y-6">
                            {earningsTrend.map((item, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between items-end text-sm">
                                        <span className="font-medium text-slate-700">
                                            {item.month}
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-slate-900">
                                                ₹{item.amount.toLocaleString()}
                                            </span>
                                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full border border-gray-200">
                                                {item.deals} deals
                                            </span>
                                        </div>
                                    </div>
                                    {/* Animated Bar */}
                                    <AnimatedBar percentage={item.width} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Chart: Revenue by Product */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                        <h3 className="font-bold text-slate-900 mb-6">
                            Revenue by Product
                        </h3>
                        <div className="space-y-6">
                            {revenueByProduct.map((item, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between items-end text-sm">
                                        <span className="font-medium text-slate-700">
                                            {item.product}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-slate-900">
                                                ₹{item.amount.toLocaleString()}
                                            </span>
                                            <span className="text-gray-400 text-xs">
                                                ({item.percent}%)
                                            </span>
                                        </div>
                                    </div>
                                    {/* Animated Bar */}
                                    <AnimatedBar percentage={item.width} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 4. AI Insight Footer */}
                <div className="bg-[#eaf4f3]/40 border border-[#5aa39c]/20 p-6 rounded-2xl animate-slide-up relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-[#5aa39c] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                            <Sparkles size={12} fill="white" /> AI Insight
                        </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Your earnings have grown <strong>43%</strong> over the
                        last 3 months.{" "}
                        <span className="font-semibold text-slate-800">
                            Virtual Office Premium
                        </span>{" "}
                        shows the highest conversion rate (68%). Focus on Team
                        Space promotions to increase revenue share in this
                        segment.
                    </p>
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
          animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.8s ease-out forwards;
        }
      `}</style>
        </div>
    );
};

export default DashboardRevenue;
