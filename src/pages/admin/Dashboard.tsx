import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService, AdminDashboardStats } from '@/services/admin.service';
import {
    Users,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Ticket,
    BarChart3,
    Sparkles,
    LineChart,
    Target,
    Lightbulb,
    Bot,
    MessageCircle,
    Trophy,
    Link,
    LayoutDashboard,
    Headset,
    CreditCard,
    FileCheck,
    CheckCircle,
    Scale,
    Bell,
    Trash2,
    X
} from 'lucide-react';
import { useSocket } from '@/contexts/SocketContext';
import { AdminNotificationService, AdminNotification } from '@/services/adminNotification.service';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState<AdminDashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    // Notification State
    const { socket } = useSocket();
    const [notifications, setNotifications] = useState<AdminNotification[]>([]);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await AdminNotificationService.getAll();
                setNotifications(data);
            } catch (error) {
                console.error("Failed to fetch notifications", error);
            }
        };
        fetchNotifications();

        if (socket) {
            // Join admin feed
            socket.emit('join_admin_feed');

            const handleNewNotification = (newNotification: AdminNotification) => {
                setNotifications(prev => [newNotification, ...prev]);
                // Optional: Play sound
            };

            socket.on('notification:new', handleNewNotification);

            return () => {
                socket.off('notification:new', handleNewNotification);
            };
        }
    }, [socket]);

    const handleRemoveNotification = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        try {
            await AdminNotificationService.delete(id);
            setNotifications(prev => prev.filter(n => n._id !== id));
        } catch (error) {
            console.error("Failed to delete notification", error);
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsResponse] = await Promise.all([
                    adminService.getDashboardStats(),
                ]);

                if (statsResponse.success && statsResponse.data) {
                    setStats(statsResponse.data);
                }
            } catch (error) {
                console.error('Failed to fetch admin data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="p-8 space-y-8 animate-pulse bg-transparent min-h-screen">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-40 bg-gray-100 rounded-[24px]"></div>
                    ))}
                </div>
            </div>
        );
    }

    const kpiCards = [
        {
            title: "Total Bookings",
            value: stats?.totalBookings?.toLocaleString() || "2,847",
            change: "18% from last month",
            trend: "up",
            icon: BarChart3,
            iconClass: "text-emerald-600 bg-emerald-50"
        },
        {
            title: "Active Clients",
            value: stats?.totalUsers?.toLocaleString() || "1,234",
            change: "12% from last month",
            trend: "up",
            icon: Users,
            iconClass: "text-teal-600 bg-teal-50"
        },
        {
            title: "Monthly Revenue",
            value: stats?.totalRevenue ? `₹${stats.totalRevenue.toLocaleString()}` : "₹48.5L",
            change: "23% from last month",
            trend: "up",
            icon: TrendingUp,
            iconClass: "text-emerald-600 bg-emerald-50"
        },
        {
            title: "Open Tickets",
            value: "47",
            change: "8% from last month",
            trend: "down",
            icon: Ticket,
            iconClass: "text-teal-600 bg-teal-50"
        }
    ];

    const aiTools = [
        {
            title: "Sales Forecasting",
            desc: "AI-based analysis and forecasting of sales based on web portal activity",
            icon: LineChart
        },
        {
            title: "Lead Scoring",
            desc: "AI-enabled lead scoring with sales probability prediction",
            icon: Target
        },
        {
            title: "Client Suggestions",
            desc: "AI forecasting and suggestions on which clients to focus on",
            icon: Lightbulb
        },
        {
            title: "Inhouse AI Agent",
            desc: "Ask anything about clients, get improvement suggestions and more",
            icon: Bot
        }
    ];

    return (
        <div className="min-h-screen bg-transparent space-y-10 font-sans animate-in fade-in duration-500 pb-12">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Admin <span className="text-teal-500 italic">Portal</span>
                    </h1>
                    <p className="text-gray-500 mt-2 text-base font-light">
                        Complete control over sales, support, and finance operations
                    </p>
                </div>

                {/* Notification Bell */}
                <div className="relative">
                    <button
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        className="p-3 bg-white rounded-full shadow-sm border border-gray-100 hover:bg-gray-50 transition-all relative"
                    >
                        <Bell className="w-6 h-6 text-gray-600" />
                        {unreadCount > 0 && (
                            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white"></span>
                        )}
                    </button>

                    {/* Dropdown */}
                    {isNotificationsOpen && (
                        <div className="absolute right-0 top-full mt-4 w-96 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden transform origin-top-right transition-all">
                            <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                                <h3 className="font-bold text-gray-900">Notifications</h3>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-500">{notifications.length} total</span>
                                    {notifications.length > 0 && (
                                        <button
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                try {
                                                    await AdminNotificationService.deleteAll();
                                                    setNotifications([]);
                                                } catch (err) {
                                                    console.error("Failed to clear notifications", err);
                                                }
                                            }}
                                            className="text-xs text-red-500 hover:text-red-700 font-medium hover:underline"
                                        >
                                            Clear All
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="max-h-96 overflow-y-auto custom-scrollbar">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-gray-400 flex flex-col items-center gap-2">
                                        <Bell className="w-8 h-8 opacity-20" />
                                        <span>No new notifications</span>
                                    </div>
                                ) : (
                                    <>
                                        {notifications.slice(0, 5).map(notif => (
                                            <div key={notif._id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!notif.read ? 'bg-blue-50/30' : ''}`}>
                                                <div className="flex justify-between items-start gap-3">
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-sm text-gray-900 mb-1">{notif.title}</p>
                                                        <p className="text-xs text-gray-500 leading-relaxed mb-1.5">{notif.message}</p>
                                                        <p className="text-[10px] text-gray-400">{new Date(notif.createdAt).toLocaleString()}</p>
                                                    </div>
                                                    <button
                                                        onClick={(e) => handleRemoveNotification(e, notif._id)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors p-1.5 hover:bg-red-50 rounded-lg"
                                                        title="Remove"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {notifications.length > 5 && (
                                            <div
                                                onClick={() => {
                                                    setIsNotificationsOpen(false);
                                                    navigate('/admin/notifications');
                                                }}
                                                className="p-3 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer border-t border-gray-100"
                                            >
                                                <span className="text-xs font-bold text-teal-600">View all notifications</span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiCards.map((card, idx) => (
                    <div
                        key={idx}
                        className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 relative group"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <span className="text-gray-500 font-medium text-base">{card.title}</span>
                            <div className={`p-2.5 rounded-xl ${card.iconClass} bg-opacity-60`}>
                                <card.icon className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-4xl font-extrabold text-gray-900 tracking-tight">{card.value}</h3>
                            <div className={`flex items-center gap-2 text-sm font-bold ${card.trend === 'up' ? 'text-emerald-500' : 'text-red-500'
                                }`}>
                                {card.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                <span>{card.change}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-12">
                {/* Sales Team Section */}
                <div className="space-y-8">
                    {/* Header */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Sales Team</h2>
                        <p className="text-gray-500 text-sm font-light mt-1">Tools and insights for the sales team</p>
                    </div>

                    {/* AI Tools Subsection */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">AI-Powered Sales Tools</h3>
                            <p className="text-gray-500 text-sm font-light">Leverage AI for better sales outcomes</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {aiTools.map((tool, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer group flex flex-col justify-between min-h-[160px]"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 mb-1 text-base">{tool.title}</h4>
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                                            <Sparkles className="w-3 h-3 text-gray-400" />
                                            <span className="text-[10px] font-bold text-gray-500 tracking-wider">AI</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        <p className="text-gray-500 text-xs leading-relaxed font-light">
                                            {tool.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sales Management Subsection */}
                    <div className="space-y-6">
                        <div className="space-y-2"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                {
                                    title: "Client Information Panel",
                                    desc: "View all client information including their activity on flashspace ecosystem",
                                    icon: Users
                                },
                                {
                                    title: "CRM Integration",
                                    desc: "Manage leads with email and WhatsApp marketing workflows integrated",
                                    icon: Link
                                },
                                {
                                    title: "Coupon Generator",
                                    desc: "Create discount vouchers for payment portal to help close deals",
                                    icon: Ticket
                                },
                                {
                                    title: "WhatsApp Access",
                                    desc: "Tap into client chats coming into the website via WhatsApp API",
                                    icon: MessageCircle
                                },
                                {
                                    title: "Booking Dashboard",
                                    desc: "View total bookings by categories, packages, and sales amounts",
                                    icon: LayoutDashboard
                                },
                                {
                                    title: "Leaderboard",
                                    desc: "Track KPIs, targets, and achievements with team rankings",
                                    icon: Trophy
                                }
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer group flex items-center gap-6">
                                    <div className="p-3 bg-teal-50 rounded-2xl text-teal-600">
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1 text-base">{item.title}</h4>
                                        <p className="text-gray-500 text-xs leading-relaxed font-light">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Support Team Section */}
                <div className="space-y-8">
                    {/* Header */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Support Team</h2>
                        <p className="text-gray-500 text-sm font-light mt-1">Tools for client support and satisfaction</p>
                    </div>

                    {/* AI Support Tools Subsection */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">AI Support Tools</h3>
                            <p className="text-gray-500 text-sm font-light">AI-powered support assistance</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    title: "AI Support Agent",
                                    desc: "Access all client data - agreements, renewals, visits, and more",
                                },
                                {
                                    title: "Auto Translation",
                                    desc: "Translate any language used by clients for support team understanding",
                                },
                                {
                                    title: "Satisfaction Dashboard",
                                    desc: "AI based metrics on client satisfaction, pending cases, and more",
                                },
                                {
                                    title: "Performance Suggestions",
                                    desc: "AI board showing best performers' strategies and improvement tips",
                                }
                            ].map((tool, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer group flex flex-col justify-between min-h-[160px]"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 mb-1 text-base">{tool.title}</h4>
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                                            <Sparkles className="w-3 h-3 text-gray-400" />
                                            <span className="text-[10px] font-bold text-gray-500 tracking-wider">AI</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        <p className="text-gray-500 text-xs leading-relaxed font-light">
                                            {tool.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Support Operations Subsection */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                {
                                    title: "Ticket Management",
                                    desc: "Auto-assign tickets with due dates, follow-ups, and escalation alerts",
                                    icon: Ticket
                                },
                                {
                                    title: "Chat Takeover",
                                    desc: "Take over support chats and view all active and past tickets",
                                    icon: MessageCircle
                                },
                                {
                                    title: "Client Portal",
                                    desc: "Detailed access to all client accounts and their history",
                                    icon: Users
                                },
                                {
                                    title: "Learning Hub",
                                    desc: "Training videos, articles, and documents for day-to-day tasks",
                                    icon: Lightbulb
                                },
                                {
                                    title: "Support Leaderboard",
                                    desc: "Track team performance and highlight best performers",
                                    icon: Trophy
                                }
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer group flex items-center gap-6">
                                    <div className="p-3 bg-teal-50 rounded-2xl text-teal-600">
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1 text-base">{item.title}</h4>
                                        <p className="text-gray-500 text-xs leading-relaxed font-light">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Finance & Accounts Section */}
                <div className="space-y-8">
                    {/* Header */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Finance & Accounts</h2>
                        <p className="text-gray-500 text-sm font-light mt-1">Financial management and reporting</p>
                    </div>

                    {/* Financial Management Subsection */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Financial Management</h3>
                            <p className="text-gray-500 text-sm font-light">Complete financial control and reporting</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                {
                                    title: "Revenue Dashboard",
                                    desc: "Track payments received, receivable, payable, and more data",
                                    icon: BarChart3,
                                    isAi: false
                                },
                                {
                                    title: "Receivable/Payable",
                                    desc: "Filter by space, city to get detailed payment information",
                                    icon: CreditCard,
                                    isAi: false
                                },
                                {
                                    title: "Invoice Management",
                                    desc: "View and approve/reject invoices from clients and space partners",
                                    icon: FileCheck,
                                    isAi: false
                                },
                                {
                                    title: "Cleared Invoices",
                                    desc: "Track all cleared invoices with payment details",
                                    icon: CheckCircle,
                                    isAi: false
                                },
                                {
                                    title: "Balance Sheet",
                                    desc: "Overall, space specific, region specific, and date range reports",
                                    icon: Scale,
                                    isAi: false
                                },
                                {
                                    title: "AI Assistant",
                                    desc: "Custom AI agent to answer questions about any client",
                                    icon: Bot,
                                    isAi: true
                                }
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer group flex items-center gap-6 relative overflow-hidden">
                                    <div className="p-3 bg-teal-50 rounded-2xl text-teal-600 flex-shrink-0">
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-gray-900 mb-1 text-base">{item.title}</h4>
                                            {item.isAi && (
                                                <div className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 absolute top-6 right-6">
                                                    <Sparkles className="w-2.5 h-2.5 text-gray-400" />
                                                    <span className="text-[9px] font-bold text-gray-500 tracking-wider">AI</span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-gray-500 text-xs leading-relaxed font-light pr-2">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
