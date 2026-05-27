import React, { useState, useEffect } from "react";
import {
    Download,
    Calendar,
    Clock,
    CheckCircle2,
    Loader2,
    AlertCircle,
} from "lucide-react";

// --- Custom Hook for Number Counting Animation (0.5s duration) ---
const useCountUp = (end: number, duration: number = 500) => {
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
    const count = useCountUp(value, 500); // 0.5s duration
    return (
        <span>
            {prefix}
            {count.toFixed(decimals)}
            {suffix}
        </span>
    );
};

// --- Mock Data ---
const pendingPayouts = [
    {
        id: "PAY-001",
        status: "Processing",
        period: "Jan 2024",
        details: "8 bookings • Expected: Feb 10, 2024",
        amount: "₹28,000",
    },
    {
        id: "PAY-002",
        status: "Pending",
        period: "Feb 2024 (MTD)",
        details: "5 bookings • Expected: Mar 10, 2024",
        amount: "₹17,000",
    },
];

const completedPayouts = [
    {
        id: "PAY-089",
        period: "Dec 2023",
        bookings: 9,
        amount: "₹32,800",
        paidDate: "Jan 10, 2024",
        method: "Bank Transfer",
    },
    {
        id: "PAY-085",
        period: "Nov 2023",
        bookings: 7,
        amount: "₹24,200",
        paidDate: "Dec 10, 2023",
        method: "Bank Transfer",
    },
    {
        id: "PAY-078",
        period: "Oct 2023",
        bookings: 5,
        amount: "₹18,500",
        paidDate: "Nov 10, 2023",
        method: "Bank Transfer",
    },
];

// --- Components ---

const StatCard = ({
    label,
    value,
    subValue,
    colorClass = "text-slate-900",
    delay,
}: {
    label: string;
    value: number | string;
    subValue?: string;
    colorClass?: string;
    delay: number;
}) => (
    <div
        className="bg-[#f8f8f8] p-6 rounded-2xl border border-gray-200 shadow transition-all duration-300 hover:-translate-y-1 group animate-fade-in-up"
        style={{ animationDelay: `${delay}ms` }}
    >
        <h3 style={{ fontFamily: "'Inter', sans-serif" }} className={`text-3xl font-extrabold ${colorClass} mb-1`}>
            {typeof value === "number" ? (
                <AnimatedCounter
                    value={value}
                    prefix={subValue === "K" ? "₹" : "₹"}
                    suffix={subValue || ""}
                    decimals={subValue === "L" ? 2 : 0}
                />
            ) : (
                value
            )}
        </h3>
        <p className="text-gray-500 font-medium text-sm">{label}</p>
    </div>
);

const StatusBadge = ({ status }: { status: string }) => {
    if (status === "Processing") {
        return (
            <span className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold border border-blue-100">
                <Clock size={12} /> Processing
            </span>
        );
    }
    return (
        <span className="flex items-center gap-1 px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full text-xs font-semibold border border-yellow-100">
            <Clock size={12} /> Pending
        </span>
    );
};

const Payouts = () => {
    const [activeTab, setActiveTab] = useState<"pending" | "completed">(
        "pending",
    );

    return (
        <div className="w-full bg-[#f7f7f6] p-6 lg:p-10 pb-2 lg:pb-4 font-sans">
            <div className="w-full space-y-8 animate-fade-in">
                {/* 1. Header */}
                {/* Header Removed */}

                {/* 2. Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Using numeric values where possible for the animation hook */}
                    <StatCard
                        label="Total Earned"
                        value={2.8}
                        subValue="L"
                        delay={0}
                    />
                    <StatCard
                        label="Total Paid"
                        value={2.35}
                        subValue="L"
                        colorClass="text-green-600"
                        delay={100}
                    />
                    <StatCard
                        label="Pending Payout"
                        value={45}
                        subValue="K"
                        colorClass="text-orange-500"
                        delay={200}
                    />
                    {/* Static value for date */}
                    <StatCard
                        label="Next Payout Date"
                        value="10th"
                        delay={300}
                    />
                </div>

                {/* 3. Main Content Section */}
                <div className="space-y-6">
                    {/* Tabs */}
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1 w-max">
                        <button
                            onClick={() => setActiveTab("pending")}
                            className={`
                px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300
                ${activeTab === "pending"
                                    ? "bg-white text-slate-900 shadow-sm ring-1 ring-gray-200"
                                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                                }
              `}
                        >
                            Pending Payouts
                        </button>
                        <button
                            onClick={() => setActiveTab("completed")}
                            className={`
                px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300
                ${activeTab === "completed"
                                    ? "bg-white text-slate-900 shadow-sm ring-1 ring-gray-200"
                                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                                }
              `}
                        >
                            Completed
                        </button>
                    </div>

                    {/* Conditional Content */}
                    <div className="animate-slide-up">
                        {activeTab === "pending" ? (
                            // --- PENDING VIEW (List Style) ---
                            <div className="space-y-4">
                                {pendingPayouts.map((item, idx) => (
                                    <div
                                        key={item.id}
                                        className="bg-[#f8f8f8] rounded-2xl border border-gray-200 p-6 shadow transition-all duration-300 group flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                                        style={{
                                            animationDelay: `${idx * 100}ms`,
                                        }}
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-gray-400 text-sm font-mono">
                                                    {item.id}
                                                </span>
                                                <StatusBadge
                                                    status={item.status}
                                                />
                                            </div>
                                            <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-lg font-bold text-slate-900">
                                                {item.period}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {item.details}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-extrabold text-slate-900">
                                                {item.amount}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            // --- COMPLETED VIEW (Table Style) ---
                            <div className="bg-[#f8f8f8] rounded-2xl border border-gray-200 shadow overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-[#f6f6f4] border-b border-[#f1f2ed]">
                                                {[
                                                    "Payout ID",
                                                    "Period",
                                                    "Bookings",
                                                    "Amount",
                                                    "Paid Date",
                                                    "Method",
                                                    "Receipt",
                                                ].map((head) => (
                                                    <th
                                                        key={head}
                                                        className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                                                    >
                                                        {head}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#f1f2ed]">
                                            {completedPayouts.map(
                                                (payout, idx) => (
                                                    <tr
                                                        key={payout.id}
                                                        className="group hover:bg-[#fafafa] transition-colors duration-150"
                                                    >
                                                        <td className="px-6 py-4 text-sm font-medium text-slate-900 whitespace-nowrap">
                                                            {payout.id}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium whitespace-nowrap">
                                                            {payout.period}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500">
                                                            {payout.bookings}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-bold text-[#5aa39c] whitespace-nowrap">
                                                            {payout.amount}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                            {payout.paidDate}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                            {payout.method}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <button className="p-2 text-gray-400 hover:text-[#fff] hover:bg-yellow-500 rounded-lg transition-colors">
                                                                <Download
                                                                    size={18}
                                                                />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

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
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.4s ease-out forwards;
        }
      `}</style>
        </div>
    );
};

export default Payouts;
