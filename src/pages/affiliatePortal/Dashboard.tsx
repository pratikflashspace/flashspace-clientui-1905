import React, { useState, useEffect } from "react";
import {
    Users,
    TrendingUp,
    Wallet,
} from "lucide-react";
import { StatsSkeleton } from "@/components/ui/skeleton-loaders";
import { useAuth } from "@/contexts/AuthContext";
import { AffiliateHeaderActions } from "@/components/affiliatePortal/AffiliateHeaderActions";

import { affiliatePortalService, RevenueDashboardStats } from "@/services/affiliatePortal.service";

// --- Sub-Components ---

import StatCardDashboard from "@/components/affiliatePortal/StatCardDashboard";

// --- Main Dashboard Component ---

const Dashboard = () => {
    const [dashboardStats, setDashboardStats] = useState<RevenueDashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { refreshProfile } = useAuth();

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Refresh profile to get latest KYC status
                await refreshProfile();

                const [statsRes] = await Promise.allSettled([
                    affiliatePortalService.getDashboardStats(),
                ]);

                if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
                    setDashboardStats(statsRes.value.data as RevenueDashboardStats);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // 3 stat cards: Total Earnings (dynamic), Total Clients (dynamic), Pending Payout (static)
    const formatFullCurrency = (value: number) => {
        return value.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        });
    };

    const stats = [
        {
            label: "Total Earnings",
            value: dashboardStats?.totalEarnings !== undefined ? formatFullCurrency(dashboardStats.totalEarnings) : "₹0",
            trend: null,
            icon: TrendingUp,
        },
        {
            label: "Total Clients",
            value: dashboardStats?.convertedClients?.toString() || "0",
            trend: null,
            icon: Users,
        },
        {
            label: "Pending Payout",
            value: dashboardStats?.pendingPayout !== undefined ? formatFullCurrency(dashboardStats.pendingPayout) : "₹0",
            trend: null,
            icon: Wallet,
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
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f7f6] p-4 md:p-6 lg:p-10 font-sans animate-fade-in relative">
            <div className="w-full space-y-10">
                {/* 1. Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                            Affiliate <span className="text-[#4A6D56] italic">Dashboard</span>
                        </h1>
                        <p className="text-gray-500 text-base md:text-lg">
                            Track your referrals, revenue, and performance
                        </p>
                    </div>
                    <AffiliateHeaderActions />
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
            </div>

        </div>
    );
};

export default Dashboard;
