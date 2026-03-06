import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminService, AdminDashboardStats } from "@/services/admin.service";
import {
  Users,
  TrendingUp,
  Ticket,
  BarChart3,
  Target,
  Headphones,
  Trophy,
  LayoutDashboard,
  Bell,
  Trash2,
  Wallet,
  Receipt,
  Calculator,
  FileText,
} from "lucide-react";
import { useSocket } from "@/contexts/SocketContext";
import {
  AdminNotificationService,
  AdminNotification,
} from "@/services/adminNotification.service";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { FeatureSection } from "@/components/dashboard/FeatureSection";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Notification State
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

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
      socket.emit("join_admin_feed");

      const handleNewNotification = (newNotification: AdminNotification) => {
        setNotifications((prev) => [newNotification, ...prev]);
      };

      socket.on("notification:new", handleNewNotification);

      return () => {
        socket.off("notification:new", handleNewNotification);
      };
    }
  }, [socket]);

  const handleRemoveNotification = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await AdminNotificationService.delete(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
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
        console.error("Failed to fetch admin data", error);
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

  const salesAIFeatures = [
    {
      title: "Sales Forecasting",
      description: "AI-based analysis and forecasting of sales based on web portal activity",
      isAI: true
    },
    {
      title: "Lead Scoring",
      description: "AI-enabled lead scoring with sales probability prediction",
      isAI: true
    },
    {
      title: "Client Suggestions",
      description: "AI forecasting and suggestions on which clients to focus on",
      isAI: true
    },
    {
      title: "Inhouse AI Agent",
      description: "Ask anything about clients, get improvement suggestions and more",
      isAI: true
    },
  ];

  const salesFeatures = [
    {
      title: "Client Information Panel",
      description: "View all client information including their activity on FlashSpace ecosystem",
      href: "/admin/clients"
    },
    {
      title: "CRM Integration",
      description: "Manage leads with email and WhatsApp marketing workflows integrated",
      href: "/admin/leads"
    },
    {
      title: "Coupon Generator",
      description: "Create discount vouchers for payment portal to help close deals",
      href: "/admin/coupons"
    },
    {
      title: "WhatsApp Access",
      description: "Tap into client chats coming into the website via WhatsApp API",
      href: "/admin/support"
    },
    {
      title: "Booking Dashboard",
      description: "View total bookings by categories, packages, and sales amounts",
      href: "/admin/booking-analysis"
    },
    {
      title: "Leaderboard",
      description: "Track KPIs, targets, and achievements with team rankings",
      href: "/admin/leaderboard"
    },
  ];

  const supportAIFeatures = [
    {
      title: "AI Support Agent",
      description: "Access all client data - agreements, renewals, visits, and more",
      isAI: true
    },
    {
      title: "Auto Translation",
      description: "Translate any language used by clients for support team understanding",
      isAI: true
    },
    {
      title: "Satisfaction Dashboard",
      description: "AI-based metrics on client satisfaction, pending cases, and more",
      isAI: true
    },
    {
      title: "Performance Suggestions",
      description: "AI board showing best performers' strategies and improvement tips",
      isAI: true
    },
  ];

  const supportFeatures = [
    {
      title: "Ticket Management",
      description: "Auto-assign tickets with due dates, follow-ups, and escalation alerts",
      href: "/admin/tickets"
    },
    {
      title: "Chat Takeover",
      description: "Take over support chats and view all active and past tickets",
      href: "/admin/support"
    },
    {
      title: "Client Portal",
      description: "Detailed access to all client accounts and their history",
      href: "/admin/users"
    },
    {
      title: "Learning Hub",
      description: "Training videos, articles, and documents for day-to-day tasks",
      href: "/admin/learning-hub"
    },
    {
      title: "Support Leaderboard",
      description: "Track team performance and highlight best performers",
      href: "/admin/leaderboard"
    },
  ];

  const financeFeatures = [
    {
      title: "Revenue Dashboard",
      description: "Track payments received, receivable, payable, and more data",
      href: "/admin/revenue"
    },
    {
      title: "Receivable/Payable",
      description: "Filter by space, city to get detailed payment information",
      href: "/admin/finance"
    },
    {
      title: "Invoice Management",
      description: "View and approve/reject invoices from clients and space partners",
      href: "/admin/invoices"
    },
    {
      title: "Cleared Invoices",
      description: "Track all cleared invoices with payment details",
      href: "/admin/invoices"
    },
    {
      title: "Balance Sheet",
      description: "Overall, space-specific, region-specific, and date-range reports",
      href: "/admin/balance"
    },
    {
      title: "AI Assistant",
      description: "Custom AI agent to answer questions about any client",
      isAI: true
    },
  ];

  return (
    <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Admin <span className="text-primary italic">Portal</span>
          </h1>
          <p className="text-muted-foreground mt-2">
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
                  <span className="text-xs text-gray-500">
                    {notifications.length} total
                  </span>
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
                    {notifications.slice(0, 5).map((notif) => (
                      <div
                        key={notif._id}
                        className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!notif.read ? "bg-blue-50/30" : ""}`}
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1">
                            <p className="font-semibold text-sm text-gray-900 mb-1">
                              {notif.title}
                            </p>
                            <p className="text-xs text-gray-500 leading-relaxed mb-1.5">
                              {notif.message}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              {new Date(notif.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={(e) =>
                              handleRemoveNotification(e, notif._id)
                            }
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
                          navigate("/admin/notifications");
                        }}
                        className="p-3 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer border-t border-gray-100"
                      >
                        <span className="text-xs font-bold text-teal-600">
                          View all notifications
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Total Bookings"
          value={stats?.totalBookings?.toLocaleString() || "2,847"}
          change={18}
          icon={BarChart3}
        />
        <StatsCard
          title="Active Clients"
          value={stats?.totalUsers?.toLocaleString() || "1,234"}
          change={12}
          icon={Users}
        />
        <StatsCard
          title="Monthly Revenue"
          value={stats?.totalRevenue ? `₹${(stats.totalRevenue / 100000).toFixed(1)}L` : "₹48.5L"}
          change={23}
          icon={TrendingUp}
        />
        <StatsCard
          title="Open Tickets"
          value={stats?.openTickets?.toLocaleString() || "47"}
          change={-8}
          icon={Ticket}
        />
      </div>

      {/* Sales Team Section */}
      <div className="space-y-12">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Sales Team</h2>
            <p className="text-muted-foreground">Tools and insights for the sales team</p>
          </div>

          <FeatureSection
            title="AI-Powered Sales Tools"
            description="Leverage AI for better sales outcomes"
            features={salesAIFeatures}
          />

          <FeatureSection
            title="Sales Management"
            description="Comprehensive tools for managing sales"
            icon={Target}
            features={salesFeatures}
          />
        </div>

        {/* Support Team Section */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Support Team</h2>
            <p className="text-muted-foreground">Tools for client support and satisfaction</p>
          </div>

          <FeatureSection
            title="AI Support Tools"
            description="AI-powered support assistance"
            features={supportAIFeatures}
          />

          <FeatureSection
            title="Support Operations"
            description="Manage tickets and client support"
            icon={Headphones}
            features={supportFeatures}
          />
        </div>

        {/* Finance Team Section */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Finance & Accounts</h2>
            <p className="text-muted-foreground">Financial management and reporting</p>
          </div>

          <FeatureSection
            title="Financial Management"
            description="Complete financial control and reporting"
            icon={Wallet}
            features={financeFeatures}
          />
        </div>
      </div>
    </div>
  );
}
