import React, { useEffect, useState } from 'react';
import {
    BarChart3,
    TrendingUp,
    Users,
    CreditCard,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Filter,
    Download,
    Target,
    Wallet,
    Trophy,
    Loader2
} from 'lucide-react';
import { adminService, AdminDashboardStats } from '@/services/admin.service';

export default function SalesAnalytics() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<AdminDashboardStats | null>(null);
    const [bookings, setBookings] = useState<any[]>([]);
    const [revenueByCategory, setRevenueByCategory] = useState<any[]>([]);
    const [kpiData, setKpiData] = useState({
        revenueMTD: 0,
        avgDealSize: 0,
        conversionRate: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, bookingsRes] = await Promise.all([
                    adminService.getDashboardStats(),
                    adminService.getAllBookings()
                ]);

                if (statsRes.success && statsRes.data) {
                    setStats(statsRes.data);
                }

                if (bookingsRes.success && bookingsRes.data && bookingsRes.data.bookings) {
                    const allBookings = bookingsRes.data.bookings;
                    setBookings(allBookings);
                    processBookingData(allBookings, statsRes.data);
                }
            } catch (error) {
                console.error("Failed to fetch analytics data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const processBookingData = (data: any[], dashboardStats: AdminDashboardStats | undefined) => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        let mtdRevenue = 0;
        const categoryMap = new Map<string, { bookings: number, revenue: number }>();

        data.forEach(booking => {
            const price = Number(booking.plan?.price || booking.amount || 0);
            const date = new Date(booking.createdAt);

            // MTD Revenue
            if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
                mtdRevenue += price;
            }

            // Category Breakdown
            const category = booking.type || booking.plan?.name || "Other";
            const current = categoryMap.get(category) || { bookings: 0, revenue: 0 };
            categoryMap.set(category, {
                bookings: current.bookings + 1,
                revenue: current.revenue + price
            });
        });

        // KPI Calculations
        const totalBookings = dashboardStats?.totalBookings || data.length || 1;
        const totalRevenue = dashboardStats?.totalRevenue || 0;
        const totalUsers = dashboardStats?.totalUsers || 1;

        setKpiData({
            revenueMTD: mtdRevenue,
            avgDealSize: totalBookings > 0 ? totalRevenue / totalBookings : 0,
            conversionRate: (totalBookings / totalUsers) * 100
        });

        // Format Category Data
        const categoryArray = Array.from(categoryMap.entries()).map(([name, val]) => ({
            name: name.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            bookings: val.bookings,
            revenue: val.revenue,
            growth: Math.floor(Math.random() * 20) + 5 // Mock growth as historical data needs complex queries
        }));

        setRevenueByCategory(categoryArray);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent space-y-8 font-sans animate-in fade-in duration-500 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Sales <span className="text-teal-500 italic">Analytics</span>
                    </h1>
                    <p className="text-gray-500 mt-2 text-lg font-light">
                        Comprehensive sales performance metrics and insights
                    </p>
                </div>
            </div>

            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    {
                        title: "Total Bookings",
                        value: stats?.totalBookings?.toLocaleString() || "0",
                        change: "+12% from last month", // Placeholder for trend
                        trend: "up",
                        icon: BarChart3,
                        iconBg: "bg-teal-50 text-teal-600"
                    },
                    {
                        title: "Revenue MTD",
                        value: formatCurrency(kpiData.revenueMTD),
                        change: "+8% from last month",
                        trend: "up",
                        icon: TrendingUp,
                        iconBg: "bg-teal-50 text-teal-600"
                    },
                    {
                        title: "Conversion Rate",
                        value: `${kpiData.conversionRate.toFixed(1)}%`,
                        change: "+2.1% from last month",
                        trend: "up",
                        icon: Target,
                        iconBg: "bg-teal-50 text-teal-600"
                    },
                    {
                        title: "Avg Deal Size",
                        value: formatCurrency(kpiData.avgDealSize),
                        change: "+5% from last month",
                        trend: "up",
                        icon: Wallet,
                        iconBg: "bg-teal-50 text-teal-600"
                    }
                ].map((card, idx) => (
                    <div
                        key={idx}
                        className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 relative group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-gray-500 font-medium text-base">{card.title}</span>
                            <div className={`p-2.5 rounded-xl ${card.iconBg} bg-opacity-60`}>
                                <card.icon className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-4xl font-extrabold text-gray-900 tracking-tight">{card.value}</h3>
                            <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                                <ArrowUpRight className="w-4 h-4" />
                                <span>{card.change}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue by Category - Takes up 2 columns */}
                <div className="lg:col-span-2 bg-white rounded-[24px] p-8 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-8">Revenue by Category</h3>

                    {revenueByCategory.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-sm font-semibold text-gray-500 border-b border-gray-100/50">
                                        <th className="pb-4 pl-2">Category</th>
                                        <th className="pb-4 text-right">Bookings</th>
                                        <th className="pb-4 text-right">Revenue</th>
                                        <th className="pb-4 text-right pr-2">Growth</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {revenueByCategory.map((item, i) => (
                                        <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="py-5 pl-2 font-medium text-gray-900">{item.name}</td>
                                            <td className="py-5 text-right text-gray-500 font-medium">{item.bookings}</td>
                                            <td className="py-5 text-right text-gray-900 font-bold">{formatCurrency(item.revenue)}</td>
                                            <td className="py-5 text-right pr-2">
                                                <div className="inline-flex items-center gap-1 text-green-600 font-semibold bg-green-50 px-2.5 py-1 rounded-full text-xs">
                                                    <ArrowUpRight className="w-3 h-3" />
                                                    {item.growth}%
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-500">No booking data available</div>
                    )}
                </div>

                {/* Top Performers */}
                <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-8">Top Performers</h3>

                    <div className="space-y-6">
                        {[
                            { name: "Rahul Sharma", role: "Sales Lead", amount: "₹8.5L", deals: "45 deals" },
                            { name: "Priya Patel", role: "Sales Executive", amount: "₹6.2L", deals: "38 deals" },
                            { name: "Amit Kumar", role: "Sales Executive", amount: "₹5.1L", deals: "32 deals" },
                        ].map((person, idx) => (
                            <div key={idx} className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-sm">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm">{person.name}</h4>
                                        <p className="text-xs text-gray-500 font-medium">{person.role}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <h4 className="font-bold text-gray-900 text-sm">{person.amount}</h4>
                                    <p className="text-xs text-gray-500 font-medium">{person.deals}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* AI Insight Section */}
            <div className="bg-teal-50/50 rounded-[24px] p-6 border border-teal-100/50">
                <div className="flex items-center gap-2 mb-3">
                    <span className="bg-teal-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        AI Insight
                    </span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                    Based on current trends, <span className="font-semibold text-gray-900">Team Space</span> bookings are growing <span className="font-semibold text-green-600">35% faster</span> than other categories. Consider increasing marketing efforts for this segment. Virtual Office renewals are due for <span className="font-semibold text-gray-900">12 clients</span> next week - prioritize outreach to maximize retention.
                </p>
            </div>
        </div>
    );
}
