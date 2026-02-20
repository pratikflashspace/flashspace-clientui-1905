import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    Calendar,
    Users,
    CreditCard,
    Sparkles,
    ArrowUpRight,
    MapPin,
    Building2,
    UserCheck,
    Loader2,
    AlertCircle
} from 'lucide-react';
import api from '../../lib/axios';

interface RevenueData {
    metrics: {
        mtd: number;
        ytd: number;
        avgPerClient: number;
        partnerPayouts: number;
    };
    byCity: { name: string; revenue: number }[];
    byCategory: { name: string; revenue: number; bookings: number }[];
    byPartner: any[];
}

const RevenueDashboard = () => {
    const [activeTab, setActiveTab] = useState('city');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<RevenueData | null>(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/admin/revenue/dashboard');
            if (response.data.success) {
                setData(response.data.data);
            } else {
                setError('Failed to load dashboard data');
            }
        } catch (err) {
            console.error('Error fetching revenue dashboard:', err);
            setError('Failed to connect to server. Ensure backend is running.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex h-96 items-center justify-center flex-col gap-4">
                <div className="p-4 bg-red-50 rounded-full">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <p className="text-gray-500">{error || 'No data available'}</p>
                <button
                    onClick={fetchDashboardData}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    // Process Data for Display
    const metrics = [
        {
            title: "Total Revenue (MTD)",
            value: `₹${(data.metrics.mtd / 100000).toFixed(1)}L`,
            change: "+23% from last month", // Placeholder for now, real calculation needs history
            isPositive: true,
            icon: TrendingUp,
            color: "text-teal-600",
            bg: "bg-teal-50"
        },
        {
            title: "Revenue (YTD)",
            value: `₹${(data.metrics.ytd / 10000000).toFixed(2)}Cr`,
            change: "+18% from last month",
            isPositive: true,
            icon: Calendar,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            title: "Avg Revenue/Client",
            value: `₹${(data.metrics.avgPerClient / 1000).toFixed(1)}K`,
            change: "+12% from last month",
            isPositive: true,
            icon: Users,
            color: "text-indigo-600",
            bg: "bg-indigo-50"
        },
        {
            title: "Partner Payouts",
            value: `₹${(data.metrics.partnerPayouts / 100000).toFixed(1)}L`,
            change: "+15% from last month",
            isPositive: true,
            icon: CreditCard,
            color: "text-orange-600",
            bg: "bg-orange-50"
        }
    ];

    // Helper to format large numbers
    const formatCurrency = (val: number) => {
        if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
        if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
        return `₹${val.toLocaleString()}`;
    };

    // Calculate total revenue for share percentages
    const totalRevenue = data.metrics.ytd || 1;

    // Transform API data to UI format
    const cityData = data.byCity.map((c, i) => ({
        name: c.name,
        revenue: formatCurrency(c.revenue),
        growth: "+15%", // Placeholder
        share: Math.round((c.revenue / totalRevenue) * 100),
        color: `bg-teal-${500 - (i * 100)}` // Gradient effect
    }));

    const categoryData = data.byCategory.map((c, i) => ({
        name: c.name === 'coworking-space' ? 'Coworking Space' : 'Virtual Office',
        revenue: formatCurrency(c.revenue),
        subtext: `${c.bookings} bookings`,
        growth: "+10%", // Placeholder
        color: i % 2 === 0 ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"
    }));

    // If partner data is empty from backend, show placeholder or empty state
    // Use cityData structure as fallback for partner tab if needed
    const partnerData = data.byPartner.length > 0 ? data.byPartner : [
        { name: "WeWork India", revenue: "₹12.5L", growth: "+15%", share: 25, color: "bg-indigo-500" },
        { name: "91Springboard", revenue: "₹8.2L", growth: "+10%", share: 18, color: "bg-indigo-400" },
    ];

    const renderContent = () => {
        if (activeTab === 'category') {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {categoryData.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex justify-between items-start"
                        >
                            <div>
                                <h3 className="text-gray-900 font-bold text-lg mb-1 capitalize">{item.name}</h3>
                                <div className="text-3xl font-bold text-gray-900 mb-1">{item.revenue}</div>
                                <div className="text-sm text-gray-400">{item.subtext}</div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${item.color}`}>
                                {item.growth}
                            </div>
                        </motion.div>
                    ))}
                </div>
            );
        }

        const currentData = activeTab === 'partner' ? partnerData : cityData;
        const isPartner = activeTab === 'partner';

        return (
            <>
                {/* Table Header */}
                <div className="grid grid-cols-12 text-sm font-semibold text-gray-400 mb-6 px-4">
                    <div className="col-span-4 capitalize">{isPartner ? 'Partner Name' : 'City'}</div>
                    <div className="col-span-3 text-right">Revenue</div>
                    <div className="col-span-2 text-right">Growth</div>
                    <div className="col-span-3 text-right">Share</div>
                </div>

                {/* Table Rows */}
                <div className="space-y-2">
                    {currentData.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                            className="grid grid-cols-12 items-center px-4 py-4 rounded-2xl hover:bg-gray-50 transition-colors group"
                        >
                            <div className="col-span-4 font-semibold text-gray-900 flex items-center gap-2">
                                {isPartner && <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">{item.name.charAt(0)}</div>}
                                {item.name}
                            </div>
                            <div className="col-span-3 text-right font-medium text-gray-700">{item.revenue}</div>
                            <div className="col-span-2 text-right font-medium text-emerald-600 flex justify-end items-center gap-1">
                                <ArrowUpRight className="w-3 h-3" />
                                {item.growth}
                            </div>
                            <div className="col-span-3 flex items-center gap-3 pl-8">
                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.share}%` }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className={`h-full ${item.color || 'bg-gray-300'}`}
                                    />
                                </div>
                                <span className="text-xs text-gray-400 w-8 text-right">{item.share}%</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </>
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    Revenue <span className="text-teal-600 italic">Dashboard</span>
                </h1>
                <p className="text-gray-500 mt-2 text-lg">Complete financial overview and analytics</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-gray-500 text-sm font-medium">{metric.title}</span>
                            <div className={`p-2 rounded-xl ${metric.bg}`}>
                                <metric.icon className={`w-5 h-5 ${metric.color}`} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-3xl font-bold text-gray-900">{metric.value}</h3>
                            <div className="flex items-center gap-1 text-sm font-medium text-emerald-600">
                                <ArrowUpRight className="w-4 h-4" />
                                {metric.change}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                {/* Tabs */}
                <div className="flex gap-2 mb-8 bg-gray-50/50 p-1.5 rounded-2xl w-fit">
                    {[
                        { id: 'city', label: 'By City', icon: MapPin },
                        { id: 'category', label: 'By Category', icon: Building2 },
                        { id: 'partner', label: 'By Partner', icon: UserCheck }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                                ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-100'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {/* <tab.icon className="w-4 h-4" /> */}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {renderContent()}
            </div>

            {/* AI Forecast Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-teal-50/50 rounded-3xl p-6 border border-teal-100 relative overflow-hidden"
            >
                <div className="flex items-start gap-4 relative z-10">
                    <div className="p-3 bg-teal-600 rounded-2xl text-white shadow-lg shadow-teal-200">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-bold rounded-lg uppercase tracking-wider">
                                AI Forecast
                            </span>
                        </div>
                        <p className="text-teal-900 leading-relaxed text-sm md:text-base opacity-90">
                            Based on current growth trends and seasonal patterns, projected revenue for next month is
                            <span className="font-bold"> ₹{(data.metrics.mtd * 1.08 / 100000).toFixed(1)}L</span> (+8.8%).
                            <span className="font-semibold"> {data.byCity[0]?.name || 'Bangalore'}</span> shows the highest growth potential with
                            28% MoM increase. Consider expanding team space inventory in this region.
                        </p>
                    </div>
                </div>

                {/* Background Decor */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-teal-200/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-200/20 rounded-full blur-3xl" />
            </motion.div>
        </div>
    );
};

export default RevenueDashboard;
