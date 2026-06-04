import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminService, AdminDashboardStats } from "@/services/admin.service";
import {
  Users,
  TrendingUp,
  Ticket,
  BarChart3,
  Bell,
  Wallet,
  BookOpen,
  Trophy,
  Target,
  FileText,
  Receipt,
  Mail,
  User as UserIcon,
  MapPin,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavItems";
import { useSocket } from "@/contexts/SocketContext";
import {
  AdminNotificationService,
  AdminNotification,
} from "@/services/adminNotification.service";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { StatsSkeleton } from "@/components/ui/skeleton-loaders";

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

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
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
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Polling for real-time stats
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData(true);
    }, 5000);
    return () => clearInterval(interval);
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
              <div key={i} className="bg-background border border-border rounded-xl p-6 shadow-sm space-y-3">
                <div className="w-10 h-10 bg-muted/30 rounded-xl" />
                <div className="h-8 w-24 bg-muted/50 rounded-lg" />
                <div className="h-4 w-16 bg-muted/10 rounded-md" />
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
          <p className="text-sm md:text-base text-[#6B7280] mt-2">
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
          icon={BarChart3}
        />
        <StatsCard
          title="Active Clients"
          value={stats?.totalUsers?.toLocaleString() || "0"}
          icon={Users}
        />
        <StatsCard
          title="Monthly Revenue"
          value={
            stats?.totalRevenue
              ? `₹${stats.totalRevenue.toLocaleString()}`
              : "₹0"
          }
          icon={TrendingUp}
        />
        <StatsCard
          title="Open Tickets"
          value={stats?.openTickets?.toLocaleString() || "0"}
          icon={Ticket}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mt-8 animate-in slide-in-from-bottom-4 duration-700">
        {/* Recent Leads */}
        <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
          <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
            <div>
              <h3 className="text-lg font-bold text-foreground">Recent Leads</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Latest enquiries from the website</p>
            </div>
            <Button variant="ghost" size="sm" className="text-primary font-bold hover:bg-primary hover:text-[#FEF8C5]" onClick={() => navigate("/admin/leads")}>
              View All <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-sm capitalize text-left p-4 font-semibold text-muted-foreground">User</th>
                    <th className="text-sm capitalize text-left p-4 font-semibold text-muted-foreground">Date</th>
                    <th className="text-sm capitalize text-left p-4 font-semibold text-muted-foreground">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {stats?.recentLeads?.length ? (
                    stats.recentLeads.map((lead: any) => (
                      <tr key={lead.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">{lead.name}</span>
                            <span className="text-xs text-muted-foreground">{lead.email}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-muted-foreground">
                            {new Date(lead.time).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {new Date(lead.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-12 text-center text-muted-foreground">No recent leads</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
          <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
            <div>
              <h3 className="text-lg font-bold text-foreground">Recent Bookings</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Latest successful transactions</p>
            </div>
            <Button variant="ghost" size="sm" className="text-primary font-bold hover:bg-primary hover:text-[#FEF8C5]" onClick={() => navigate("/admin/sales-analytics")}>
              View All <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-sm capitalize text-left p-4 font-semibold text-muted-foreground">Client</th>
                    <th className="text-sm capitalize text-left p-4 font-semibold text-muted-foreground">Space</th>
                    <th className="text-sm capitalize text-left p-4 font-semibold text-muted-foreground">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {stats?.recentBookings?.length ? (
                    stats.recentBookings.map((booking: any) => (
                      <tr key={booking.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">{booking.userName}</span>
                            <span className="text-xs text-muted-foreground truncate max-w-[150px]">{booking.userEmail}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-foreground truncate max-w-[120px] inline-block font-medium">{booking.spaceName}</span>
                        </td>
                        <td className="p-4 font-bold text-green-600">
                          ₹{booking.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-12 text-center text-muted-foreground">No recent bookings</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

    </DashboardLayout>
  );
}
