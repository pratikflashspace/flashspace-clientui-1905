import { useState, useEffect, useMemo } from "react";
import {
  LayoutDashboard,
  Building2,
  Calendar,
  Users,
  CreditCard,
  MessageSquare,
  Star,
  Ticket,
  Mail,
  UserPlus,
  Settings,
  TrendingUp,
  Clock,
  Loader2,
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { StatsSkeleton } from "@/components/ui/skeleton-loaders";
import { AddSpaceDialog } from "@/components/modals/AddSpaceDialog";
import { PartnerNotificationBell } from "@/components/SpacePartner/PartnerNotificationBell";
import {
  fetchPartnerDashboard,
  fetchAllPartnerSpaces,
  fetchPartnerActiveRequests,
} from "@/services/spacePortal/spacePartner.service";
import { Client } from "@/types/spacePortal/client";


export default function Dashboard() {
  const [addSpaceOpen, setAddSpaceOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Dashboard Metrics
  const [metrics, setMetrics] = useState({
    activeSpaces: 0,
    totalClients: 0,
    monthlyRevenue: "₹0",
    pendingBookings: 0,
  });

  const loadDashboardData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [dashboardRes, spacesRes, requestsRes] = await Promise.all([
        fetchPartnerDashboard(),
        fetchAllPartnerSpaces(),
        fetchPartnerActiveRequests(),
      ]);

      const clients: Client[] = dashboardRes?.data?.clients || [];
      const spaces = spacesRes?.data || [];
      const requests = requestsRes?.data || [];

      // Calculate Revenue from deal values
      const totalRevenue = clients.reduce(
        (sum, c) => sum + (c.dealValue || 0),
        0,
      );
      const formattedRevenue =
        totalRevenue >= 100000
          ? `₹${(totalRevenue / 100000).toFixed(1)}L`
          : `₹${totalRevenue.toLocaleString()}`;

      setMetrics({
        activeSpaces: spaces.length || 0,
        totalClients: clients.length || 0,
        monthlyRevenue: formattedRevenue,
        pendingBookings: requests.length || 0,
      });
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Polling for real-time stats
  useEffect(() => {
    const interval = setInterval(() => {
      loadDashboardData(true);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse">
        {/* Header */}
        <div className="mb-8">
          <div className="h-10 w-80 bg-gray-200 rounded mb-3" />
          <div className="h-4 w-96 bg-gray-100 rounded" />
        </div>

        <StatsSkeleton count={4} />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl">
            Space Partner <span className="text-primary italic">Dashboard</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your workspace listings, clients, and revenue
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PartnerNotificationBell />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Active Spaces"
          value={metrics.activeSpaces.toString()}
          icon={Building2}
        />
        <StatsCard
          title="Total Clients"
          value={metrics.totalClients.toString()}
          icon={Users}
        />
        <StatsCard
          title="Monthly Revenue"
          value={metrics.monthlyRevenue}
          icon={TrendingUp}
        />
        <StatsCard
          title="Pending Bookings"
          value={metrics.pendingBookings.toString()}
          icon={Calendar}
        />
      </div>

      <AddSpaceDialog open={addSpaceOpen} onOpenChange={setAddSpaceOpen} />
    </div>
  );
}
