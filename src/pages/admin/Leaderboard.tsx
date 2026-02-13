import React, { useState } from 'react';
import {
    Trophy,
    Medal,
    TrendingUp,
    Target,
    Star,
    Flame,
    Crown,
    Headphones,
    MessageSquare,
    Clock,
    CheckCircle2
} from 'lucide-react';
import { cn } from "@/lib/utils";

// Mock Data
const salesTeam = [
    {
        rank: 1,
        name: "Rahul Sharma",
        role: "Sales Lead",
        avatar: "RS",
        streak: 12,
        deals: 45,
        revenue: "₹8.5L",
        target: 105,
        rating: 4.9,
    },
    {
        rank: 2,
        name: "Priya Patel",
        role: "Sales Executive",
        avatar: "PP",
        streak: 8,
        deals: 38,
        revenue: "₹6.2L",
        target: 98,
        rating: 4.8,
    },
    {
        rank: 3,
        name: "Amit Kumar",
        role: "Sales Executive",
        avatar: "AK",
        streak: 5,
        deals: 32,
        revenue: "₹5.1L",
        target: 92,
        rating: 4.7,
    },
    {
        rank: 4,
        name: "Neha Reddy",
        role: "Sales Executive",
        avatar: "NR",
        streak: 0,
        deals: 28,
        revenue: "₹4.5L",
        target: 85,
        rating: 4.6,
    },
    {
        rank: 5,
        name: "Vikram Singh",
        role: "Sales Executive",
        avatar: "VS",
        streak: 0,
        deals: 25,
        revenue: "₹4.0L",
        target: 78,
        rating: 4.5,
    }
];

const supportTeam = [
    {
        rank: 1,
        name: "Sarah Jenkins",
        role: "Support Lead",
        avatar: "SJ",
        streak: 15,
        tickets: 145,
        avgTime: "12m",
        csat: 98,
        rating: 5.0,
    },
    {
        rank: 2,
        name: "Mike Chen",
        role: "Support Agent",
        avatar: "MC",
        streak: 10,
        tickets: 132,
        avgTime: "15m",
        csat: 95,
        rating: 4.9,
    },
    {
        rank: 3,
        name: "Jessica Wu",
        role: "Support Agent",
        avatar: "JW",
        streak: 7,
        tickets: 118,
        avgTime: "18m",
        csat: 92,
        rating: 4.8,
    },
    {
        rank: 4,
        name: "David Ross",
        role: "Support Agent",
        avatar: "DR",
        streak: 3,
        tickets: 95,
        avgTime: "22m",
        csat: 88,
        rating: 4.6,
    },
    {
        rank: 5,
        name: "Emily White",
        role: "Support Agent",
        avatar: "EW",
        streak: 0,
        tickets: 82,
        avgTime: "25m",
        csat: 85,
        rating: 4.5,
    }
];

export default function Leaderboard() {
    const [activeTab, setActiveTab] = useState<'sales' | 'support'>('sales');

    const data = activeTab === 'sales' ? salesTeam : supportTeam;

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500" />;
            case 2:
                return <Medal className="w-6 h-6 text-gray-400 fill-gray-400" />;
            case 3:
                return <Medal className="w-6 h-6 text-amber-700 fill-amber-700" />;
            default:
                return <span className="text-lg font-bold text-teal-500">#{rank}</span>;
        }
    };

    const getCardStyle = (rank: number) => {
        switch (rank) {
            case 1:
                return "bg-yellow-50/80 border-yellow-200 shadow-sm";
            case 2:
                return "bg-gray-50/80 border-gray-200 shadow-sm";
            case 3:
                return "bg-orange-50/50 border-orange-100 shadow-sm";
            default:
                return "bg-white border-transparent hover:border-gray-100";
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    Team <span className="text-teal-600">Leaderboard</span>
                </h1>
                <p className="text-gray-500 mt-2">Track performance and celebrate top performers</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-gray-100/50 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('sales')}
                    className={cn(
                        "px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200",
                        activeTab === 'sales'
                            ? "bg-white text-teal-700 shadow-sm ring-1 ring-gray-200"
                            : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                    )}
                >
                    Sales Team
                </button>
                <button
                    onClick={() => setActiveTab('support')}
                    className={cn(
                        "px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200",
                        activeTab === 'support'
                            ? "bg-white text-teal-700 shadow-sm ring-1 ring-gray-200"
                            : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                    )}
                >
                    Support Team
                </button>
            </div>

            {/* List */}
            <div className="space-y-4">
                {data.map((user) => (
                    <div
                        key={user.rank}
                        className={cn(
                            "group flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 hover:shadow-md hover:scale-[1.01] cursor-default",
                            getCardStyle(user.rank)
                        )}
                    >
                        {/* Left Side: Rank & Profile */}
                        <div className="flex items-center gap-6">
                            {/* Rank */}
                            <div className="w-12 flex justify-center flex-shrink-0">
                                {getRankIcon(user.rank)}
                            </div>

                            {/* Profile */}
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm",
                                    user.rank === 1 ? "bg-teal-600" :
                                        user.rank === 2 ? "bg-teal-500" :
                                            user.rank === 3 ? "bg-teal-500/90" : "bg-teal-400"
                                )}>
                                    {user.avatar}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-gray-900 text-lg">{user.name}</h3>
                                        {user.streak > 0 && (
                                            <span className="flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-600 text-xs font-bold rounded-full border border-orange-200 relative group/tooltip">
                                                <Flame className="w-3 h-3 fill-orange-500" />
                                                {user.streak} day streak
                                                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                    Consecutive days hitting target
                                                </span>
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 font-medium">{user.role}</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Metrics */}
                        <div className="flex items-center gap-12 pr-4">
                            {/* Metric 1 */}
                            <div className="text-center">
                                <p className="text-2xl font-extrabold text-gray-900">
                                    {activeTab === 'sales' ? user.deals : user.tickets}
                                </p>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                                    {activeTab === 'sales' ? 'Deals' : 'Tickets'}
                                </p>
                            </div>

                            {/* Metric 2 */}
                            <div className="text-center w-24">
                                <p className="text-2xl font-extrabold text-gray-900">
                                    {activeTab === 'sales' ? user.revenue : user.avgTime}
                                </p>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                                    {activeTab === 'sales' ? 'Revenue' : 'Avg Time'}
                                </p>
                            </div>

                            {/* Metric 3 */}
                            <div className="text-center w-20">
                                <p className={cn(
                                    "text-2xl font-extrabold",
                                    (activeTab === 'sales' ? user.target : user.csat) >= 100 ? "text-green-600" :
                                        (activeTab === 'sales' ? user.target : user.csat) >= 90 ? "text-gray-900" : "text-amber-600"
                                )}>
                                    {activeTab === 'sales' ? `${user.target}%` : `${user.csat}%`}
                                </p>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                                    {activeTab === 'sales' ? 'Target' : 'CSAT'}
                                </p>
                            </div>

                            {/* Rating */}
                            <div className="flex gap-1">
                                {[1, 2, 3].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={cn(
                                            "w-5 h-5",
                                            i < Math.floor(user.rating - 2) // showing 3 stars max for space
                                                ? "text-yellow-400 fill-yellow-400"
                                                : "text-gray-300"
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
