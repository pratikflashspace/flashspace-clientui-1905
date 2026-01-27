import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { adminService, AdminDashboardStats } from '@/services/admin.service';
import {
    Users,
    CreditCard,
    Building2,
    TrendingUp,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    CheckCircle,
    AlertCircle,
    DollarSign
} from 'lucide-react';
import { ClippedAreaChart } from '@/components/ui/clipped-area-chart';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState<AdminDashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [revenueData, setRevenueData] = useState<{ month: string; revenue: number }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsResponse, bookingsResponse] = await Promise.all([
                    adminService.getDashboardStats(),
                    adminService.getAllBookings()
                ]);

                if (statsResponse.success && statsResponse.data) {
                    setStats(statsResponse.data);
                }

                if (bookingsResponse.success && bookingsResponse.data && bookingsResponse.data.bookings) {
                    processRevenueData(bookingsResponse.data.bookings);
                }
            } catch (error) {
                console.error('Failed to fetch admin data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const processRevenueData = (bookings: any[]) => {
        // Group revenue by month for the current year (or last 12 months)
        const monthMap = new Map<string, number>();
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        // Initialize all months with 0
        months.forEach(m => monthMap.set(m, 0));

        bookings.forEach(booking => {
            if (booking.createdAt && booking.plan?.price) {
                const date = new Date(booking.createdAt);
                if (!isNaN(date.getTime())) {
                    const monthName = months[date.getMonth()];
                    const currentRevenue = monthMap.get(monthName) || 0;
                    monthMap.set(monthName, currentRevenue + Number(booking.plan.price));
                }
            }
        });

        const data = months.map(month => ({
            month,
            revenue: monthMap.get(month) || 0
        }));

        setRevenueData(data);
    };

    if (loading) {
        return (
            <div className="animate-pulse space-y-8">
                <div className="h-12 w-64 bg-gray-200 rounded"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-40 bg-gray-200 rounded-2xl"></div>
                    ))}
                </div>
                <div className="h-96 bg-gray-200 rounded-2xl"></div>
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Users',
            value: stats?.totalUsers.toLocaleString() || '0',
            icon: Users,
            gradient: 'from-blue-500 to-cyan-500',
            change: '+12.5%',
            isPositive: true,
            navPath: '/admin/users',
        },
        {
            title: 'Total Revenue',
            value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`,
            icon: DollarSign,
            gradient: 'from-emerald-500 to-teal-500',
            change: '+23.1%',
            isPositive: true,
            navPath: '/admin/bookings',
        },
        {
            title: 'Active Bookings',
            value: stats?.totalBookings.toLocaleString() || '0',
            icon: TrendingUp,
            gradient: 'from-purple-500 to-pink-500',
            change: '+8.2%',
            isPositive: true,
            navPath: '/admin/bookings',
        },
        {
            title: 'Active Listings',
            value: stats?.activeListings.toLocaleString() || '0',
            icon: Building2,
            gradient: 'from-orange-500 to-amber-500',
            change: '+5.4%',
            isPositive: true,
            navPath: '/admin/spaces',
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight font-[Poppins]">
                        Dashboard Overview
                    </h1>
                    <p className="text-gray-500 mt-2 text-lg">
                        Welcome back! Here's what's happening with your business today.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl border border-green-200">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm font-medium">All Systems Operational</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        onClick={() => navigate(stat.navPath)}
                        className="group relative bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer hover:scale-105"
                    >
                        {/* Gradient Background */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                        <div className="relative p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${stat.isPositive
                                    ? 'bg-green-50 text-green-700'
                                    : 'bg-red-50 text-red-700'
                                    }`}>
                                    {stat.isPositive ? (
                                        <ArrowUpRight className="w-3 h-3" />
                                    ) : (
                                        <ArrowDownRight className="w-3 h-3" />
                                    )}
                                    {stat.change}
                                </div>
                            </div>
                            <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                            <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                            <div className="mt-3 flex items-center gap-1 text-xs text-gray-400 group-hover:text-gray-600 transition-colors">
                                <span>View details</span>
                                <ArrowUpRight className="w-3 h-3" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity - Takes 2 columns */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Revenue Chart */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden p-4">
                        <ClippedAreaChart data={revenueData} />
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Activity className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                                </div>
                                <button className="text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                                    View All →
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="relative">
                                {/* Vertical Line */}
                                <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gray-100 hidden sm:block"></div>

                                <div className="space-y-6">
                                    {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                                        stats.recentActivity.map((activity, index) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                key={activity.id}
                                                className="relative flex gap-4 group"
                                            >
                                                {/* Icon/Timeline Dot */}
                                                <div className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm border-2 border-white transition-all duration-300 group-hover:scale-110 group-hover:shadow-md ${activity.type === 'user' ? 'bg-indigo-50 text-indigo-600' :
                                                    activity.type === 'payment' ? 'bg-emerald-50 text-emerald-600' :
                                                        activity.type === 'kyc' ? 'bg-amber-50 text-amber-600' :
                                                            'bg-gray-50 text-gray-600'
                                                    }`}>
                                                    {activity.type === 'user' ? <Users className="w-5 h-5" /> :
                                                        activity.type === 'payment' ? <CreditCard className="w-5 h-5" /> :
                                                            activity.type === 'kyc' ? <CheckCircle className="w-5 h-5" /> :
                                                                <Activity className="w-5 h-5" />}
                                                </div>

                                                {/* Content Card */}
                                                <div className="flex-1 bg-gray-50/50 rounded-2xl p-4 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group-hover:shadow-sm">
                                                    <div className="flex justify-between items-start gap-4">
                                                        <div>
                                                            <h4 className={`font-semibold text-sm mb-1 ${activity.type === 'user' ? 'text-indigo-900' :
                                                                activity.type === 'payment' ? 'text-emerald-900' :
                                                                    activity.type === 'kyc' ? 'text-amber-900' :
                                                                        'text-gray-900'
                                                                }`}>
                                                                {activity.type === 'user' ? 'New User Registration' :
                                                                    activity.type === 'payment' ? 'Payment Received' :
                                                                        activity.type === 'kyc' ? 'KYC Verification' :
                                                                            'System Activity'}
                                                            </h4>
                                                            <p className="text-gray-600 text-sm leading-relaxed">
                                                                {activity.message}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-gray-500 bg-white rounded-full shadow-sm border border-gray-100">
                                                            <Clock className="w-3 h-3" />
                                                            {activity.time}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                                                <Activity className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <h3 className="text-gray-900 font-medium mb-1">No recent activity</h3>
                                            <p className="text-gray-500 text-sm">New events will appear here</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    {/* Quick Actions Card */}
                    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-2xl p-6 text-white overflow-hidden relative">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400 rounded-full blur-3xl opacity-10"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400 rounded-full blur-3xl opacity-10"></div>

                        <div className="relative">
                            <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                                Quick Actions
                            </h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => navigate('/admin/kyc-requests')}
                                    className="w-full group py-3.5 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-left transition-all flex items-center gap-3 border border-white/10 hover:border-white/20 hover:scale-105 duration-200"
                                >
                                    <div className="p-2 bg-yellow-400/20 rounded-lg group-hover:bg-yellow-400/30 transition-colors">
                                        <CheckCircle className="w-5 h-5 text-yellow-400" />
                                    </div>
                                    <div className="flex-1">
                                        <span className="font-semibold">Verify New Users</span>
                                        <p className="text-xs text-gray-400 mt-0.5">Review pending KYC</p>
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                                </button>

                                <button
                                    onClick={() => navigate('/admin/spaces')}
                                    className="w-full group py-3.5 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-left transition-all flex items-center gap-3 border border-white/10 hover:border-white/20 hover:scale-105 duration-200"
                                >
                                    <div className="p-2 bg-blue-400/20 rounded-lg group-hover:bg-blue-400/30 transition-colors">
                                        <Building2 className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div className="flex-1">
                                        <span className="font-semibold">Manage Spaces</span>
                                        <p className="text-xs text-gray-400 mt-0.5">Add or edit listings</p>
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                                </button>

                                <button
                                    onClick={() => navigate('/admin/bookings')}
                                    className="w-full group py-3.5 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-left transition-all flex items-center gap-3 border border-white/10 hover:border-white/20 hover:scale-105 duration-200"
                                >
                                    <div className="p-2 bg-green-400/20 rounded-lg group-hover:bg-green-400/30 transition-colors">
                                        <CreditCard className="w-5 h-5 text-green-400" />
                                    </div>
                                    <div className="flex-1">
                                        <span className="font-semibold">Review Payments</span>
                                        <p className="text-xs text-gray-400 mt-0.5">Check transactions</p>
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* System Status Card */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-blue-600" />
                            System Status
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Database</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span className="text-sm font-medium text-green-600">Healthy</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">API Server</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span className="text-sm font-medium text-green-600">Online</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Payment Gateway</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span className="text-sm font-medium text-green-600">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
