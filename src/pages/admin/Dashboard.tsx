import React, { useEffect, useState } from 'react';
import { adminService, AdminDashboardStats } from '@/services/admin.service';
import {
    Users,
    CreditCard,
    Building2,
    TrendingUp,
    Activity
} from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState<AdminDashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await adminService.getDashboardStats();
                // AdminService now unwraps response.data, which is { success, data, ... }
                if (response.success && response.data) {
                    setStats(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch admin stats', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="animate-pulse space-y-8">
                <div className="h-8 w-48 bg-gray-200 rounded"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                    ))}
                </div>
                <div className="h-96 bg-gray-200 rounded-xl"></div>
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Users',
            value: stats?.totalUsers.toLocaleString() || '0',
            icon: Users,
            color: 'bg-blue-500',
        },
        {
            title: 'Total Revenue',
            value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`,
            icon: CreditCard,
            color: 'bg-green-500',
        },
        {
            title: 'Active Bookings',
            value: stats?.totalBookings.toLocaleString() || '0',
            icon: TrendingUp,
            color: 'bg-purple-500',
        },
        {
            title: 'Active Listings',
            value: stats?.activeListings.toLocaleString() || '0',
            icon: Building2,
            color: 'bg-orange-500',
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 font-[Poppins]">Dashboard Overview</h1>
                <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</h3>
                            </div>
                            <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                                <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity & Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Activity Feed */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                        <button className="text-sm text-yellow-600 font-medium hover:text-yellow-700">View All</button>
                    </div>
                    <div className="space-y-6">
                        {stats?.recentActivity.map((activity) => (
                            <div key={activity.id} className="flex gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${activity.type === 'user' ? 'bg-blue-100 text-blue-600' :
                                    activity.type === 'payment' ? 'bg-green-100 text-green-600' :
                                        activity.type === 'kyc' ? 'bg-orange-100 text-orange-600' :
                                            'bg-gray-100 text-gray-600'
                                    }`}>
                                    <Activity className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-gray-900 font-medium">{activity.message}</p>
                                    <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl shadow-lg p-6 text-white">
                    <h3 className="font-semibold text-lg mb-6">Quick Actions</h3>
                    <div className="space-y-3">
                        <button className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-lg text-left transition-colors flex items-center gap-3 border border-white/5">
                            <Users className="w-5 h-5 text-yellow-400" />
                            <span>Verify New Users</span>
                        </button>
                        <button className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-lg text-left transition-colors flex items-center gap-3 border border-white/5">
                            <Building2 className="w-5 h-5 text-yellow-400" />
                            <span>Add New Space</span>
                        </button>
                        <button className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-lg text-left transition-colors flex items-center gap-3 border border-white/5">
                            <CreditCard className="w-5 h-5 text-yellow-400" />
                            <span>Review Payments</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
