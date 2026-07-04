import React, { useState, useEffect } from "react";
import {
    Users,
    TrendingUp,
    Wallet,
    Banknote,
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
    const [pendingPayout, setPendingPayout] = useState(0);
    const [recentCommission, setRecentCommission] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const { refreshProfile } = useAuth();

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Refresh profile to get latest KYC status
                await refreshProfile();

                const [statsRes, invoicesRes, bookingsRes] = await Promise.allSettled([
                    affiliatePortalService.getDashboardStats(),
                    affiliatePortalService.getInvoices(),
                    affiliatePortalService.getBookings(),
                ]);

                if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
                    setDashboardStats(statsRes.value.data as RevenueDashboardStats);
                }

                if (invoicesRes.status === 'fulfilled' && invoicesRes.value?.data) {
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

                if (bookingsRes.status === 'fulfilled' && bookingsRes.value?.data) {
                    const bookings = bookingsRes.value.data.bookings || [];
                    const validBookings = bookings.filter((b: any) => b.commission && b.commission > 0);
                    const latestBooking = [...validBookings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
                    if (latestBooking) {
                        setRecentCommission(latestBooking.commission);
                    }
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
            label: "Recent Commission",
            value: recentCommission > 0 ? formatFullCurrency(recentCommission) : "₹0",
            trend: null,
            icon: Banknote,
        },
        {
            label: "Pending Payout",
            value: formatFullCurrency(pendingPayout),
            trend: null,
            icon: Wallet,
        },
    ];

    if (isLoading) {
        return (
 <div className="min-h-screen p-4 md:p-6 lg:p-8 bg-[#f7f7f6] font-sans space-y-10"> 
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
 <div className="min-h-screen p-4 md:p-6 lg:p-8 bg-[#f7f7f6] font-sans animate-fade-in relative"> 
            <div className="w-full space-y-10">
                {/* 1. Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-extrabold tracking-tight text-[#1A1A1A]">
                            Affiliate <span className="text-[#36503F] italic">Dashboard</span>
                        </h1>
                        <p className="text-[#6B7280] text-[16px] md:text-[16px]">
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
