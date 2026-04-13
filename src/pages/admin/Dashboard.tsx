import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminService, AdminDashboardStats } from "@/services/admin.service";
import {
  Users,
  TrendingUp,
  Ticket,
  BarChart3,
  Headphones,
  Bell,
  Wallet,
  BookOpen,
  Trophy,
  Target,
  FileText,
  Receipt,
} from "lucide-react";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavItems";
import { useSocket } from "@/contexts/SocketContext";
import {
  AdminNotificationService,
  AdminNotification,
} from "@/services/adminNotification.service";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { FeatureSection } from "@/components/dashboard/FeatureSection";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsSkeleton, FeatureSectionSkeleton } from "@/components/ui/skeleton-loaders";

const salesFeatures = [
  {
    title: "Client Information Panel",
    description:
      "View all client information including their activity on FlashSpace ecosystem",
    href: "/admin/clients",
  },
  {
    title: "CRM Integration",
    description:
      "Manage leads with email and WhatsApp marketing workflows integrated",
    href: "/admin/leads",
  },
  {
    title: "Coupon Generator",
    description:
      "Create discount vouchers for payment portal to help close deals",
    href: "/admin/coupons",
  },
  {
    title: "WhatsApp Access",
    description:
      "Tap into client chats coming into the website via WhatsApp API",
    href: "/admin/support",
  },
  {
    title: "Booking Dashboard",
    description:
      "View total bookings by categories, packages, and sales amounts",
    href: "/admin/sales-analytics",
  },
  {
    title: "Leaderboard",
    description: "Track KPIs, targets, and achievements with team rankings",
    href: "/admin/leaderboard",
  },
];

const supportFeatures = [
  {
    title: "Ticket Management",
    description:
      "Auto-assign tickets with due dates, follow-ups, and escalation alerts",
    href: "/admin/tickets",
  },
  {
    title: "Chat Takeover",
    description: "Take over support chats and view all active and past tickets",
    href: "/admin/support",
  },
  {
    title: "Client Portal",
    description: "Detailed access to all client accounts and their history",
    href: "/admin/clients",
  },
  {
    title: "Learning Hub",
    description:
      "Training videos, articles, and documents for day-to-day tasks",
    href: "/admin/learning-hub",
  },
  {
    title: "Support Leaderboard",
    description: "Track team performance and highlight best performers",
    href: "/admin/leaderboard",
  },
];

const financeFeatures = [
  {
    title: "Revenue Dashboard",
    description: "Track payments received, receivable, payable, and more data",
    href: "/admin/revenue",
  },
  {
    title: "Receivable/Payable",
    description: "Filter by space, city to get detailed payment information",
    href: "/admin/finance",
  },
  {
    title: "Invoice Management",
    description:
      "View and approve/reject invoices from clients and space partners",
    href: "/admin/invoices",
  },
  {
    title: "Cleared Invoices",
    description: "Track all cleared invoices with payment details",
    href: "/admin/invoices",
  },
  {
    title: "Balance Sheet",
    description:
      "Overall, space-specific, region-specific, and date-range reports",
    href: "/admin/balance",
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Notification State
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
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
      <DashboardLayout
        portalName="FlashSpace Admin"
        portalDescription="Complete platform management"
        navItems={ADMIN_NAV_ITEMS}
      >
        <div className="space-y-10 animate-pulse">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center">
            <div className="space-y-3">
              <div className="h-10 w-64 bg-muted/50 rounded-2xl" />
              <div className="h-4 w-96 bg-muted/30 rounded-lg" />
            </div>
            <div className="w-12 h-12 bg-muted/30 rounded-2xl" />
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-background border border-border rounded-[24px] p-6 shadow-sm space-y-3">
                <div className="w-10 h-10 bg-muted/30 rounded-xl" />
                <div className="h-8 w-24 bg-muted/50 rounded-lg" />
                <div className="h-4 w-16 bg-muted/10 rounded-md" />
              </div>
            ))}
          </div>

          {/* Feature Sections Skeleton */}
          <div className="space-y-12 pt-4">
            {[1, 2, 3].map((section) => (
              <div key={section} className="space-y-6">
                <div className="space-y-2">
                  <div className="h-7 w-48 bg-muted/50 rounded-lg" />
                  <div className="h-4 w-72 bg-muted/30 rounded-md" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].slice(0, section === 1 ? 6 : 5).map((i) => (
                    <div key={i} className="bg-background border border-border rounded-[20px] p-5 shadow-sm space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="h-5 w-32 bg-muted/50 rounded-md" />
                        <div className="w-5 h-5 bg-muted/30 rounded-md" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 w-full bg-muted/10 rounded" />
                        <div className="h-3 w-2/3 bg-muted/10 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      portalName="FlashSpace Admin"
      portalDescription="Complete platform management"
      navItems={ADMIN_NAV_ITEMS}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Admin <span className="text-primary italic">Portal</span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2">
            Complete control over sales, support, and finance operations
          </p>
        </div>

        {/* Keeping Notifications count minimal visual for now pending full integration if using a dedicated notifications modal later */}
        <div className="relative">
          <button
            onClick={() => navigate("/admin/notifications")}
            className="p-3 bg-white rounded-full shadow-sm border border-border hover:bg-muted transition-all relative"
          >
            <Bell className="w-6 h-6 text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-destructive rounded-full border-2 border-background"></span>
            )}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Total Bookings"
          value={stats?.totalBookings?.toLocaleString() || "0"}
          change={0}
          icon={BarChart3}
        />
        <StatsCard
          title="Active Clients"
          value={stats?.totalUsers?.toLocaleString() || "0"}
          change={0}
          icon={Users}
        />
        <StatsCard
          title="Monthly Revenue"
          value={
            stats?.totalRevenue
              ? `₹${stats.totalRevenue.toLocaleString()}`
              : "₹0"
          }
          change={0}
          icon={TrendingUp}
        />
        <StatsCard
          title="Open Tickets"
          value={stats?.openTickets?.toLocaleString() || "0"}
          change={0}
          icon={Ticket}
        />
      </div>

      {/* Sales Team Section */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-foreground mb-2">Sales Team</h2>
        <p className="text-muted-foreground">
          Tools and insights for the sales team
        </p>
      </div>

      <FeatureSection
        title="Sales Management"
        description="Comprehensive tools for managing sales"
        icon={<Target className="w-6 h-6 text-primary" />}
        features={salesFeatures}
      />

      {/* Support Team Section */}
      <div className="mb-4 mt-12">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Support Team
        </h2>
        <p className="text-muted-foreground">
          Tools for client support and satisfaction
        </p>
      </div>

      <FeatureSection
        title="Support Operations"
        description="Manage tickets and client support"
        icon={<Headphones className="w-6 h-6 text-primary" />}
        features={supportFeatures}
      />

      {/* Finance Team Section */}
      <div className="mb-4 mt-12">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Finance & Accounts
        </h2>
        <p className="text-muted-foreground">
          Financial management and reporting
        </p>
      </div>

      <FeatureSection
        title="Financial Management"
        description="Complete financial control and reporting"
        icon={<Wallet className="w-6 h-6 text-primary" />}
        features={financeFeatures}
      />
    </DashboardLayout>
  );
}
