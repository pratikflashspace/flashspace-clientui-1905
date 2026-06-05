import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  fetchBookingAnalytics,
  fetchPartnerBookingRequests,
} from "@/services/spacePortal/spacePartner.service";
import { Client } from "@/types/spacePortal/client";
import { userDashboardService } from "@/services/userDashboard.service";


export default function Dashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [addSpaceOpen, setAddSpaceOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Dashboard Metrics
  const [metrics, setMetrics] = useState({
    activeSpaces: 0,
    totalClients: 0,
    monthlyRevenue: "₹0",
    pendingBookings: 0,
  });

  const [activeSpaces, setActiveSpaces] = useState<any[]>([]);
  const [bookingRequests, setBookingRequests] = useState<any[]>([]);

  const loadDashboardData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [dashboardRes, spacesRes, requestsRes, analyticsRes, clientBookingsRes, bookingRequestsRes] = await Promise.all([
        fetchPartnerDashboard(),
        fetchAllPartnerSpaces(),
        fetchPartnerActiveRequests(),
        fetchBookingAnalytics(),
        userDashboardService.getPartnerClientBookings(),
        fetchPartnerBookingRequests(),
      ]);

      const spaces: any[] = (spacesRes?.data || []).filter((s: any) => s.status?.toLowerCase() === 'active');
      const stats = dashboardRes?.data?.stats || {};
      const activeRequests = requestsRes?.data || [];
      const bookingRequestsData = bookingRequestsRes?.data || [];
      const analytics = analyticsRes?.data?.summary || {};

      setBookingRequests(bookingRequestsData);
      setActiveSpaces(spaces);

      // Priority: 1. Analytics Service (most accurate) 2. Dashboard Stats 3. Clients Deal Value (fallback)
      const clients: Client[] = clientBookingsRes.success ? clientBookingsRes.data : (dashboardRes?.data?.clients || []);
      const totalRevenue = analytics.revenueThisMonth !== undefined
        ? analytics.revenueThisMonth
        : (stats.monthlyRevenue !== undefined
          ? stats.monthlyRevenue
          : clients.reduce((sum, c) => sum + (c.dealValue || 0), 0));

      const formattedRevenue =
        totalRevenue >= 100000
          ? `₹${(totalRevenue / 100000).toFixed(1)}L`
          : `₹${totalRevenue.toLocaleString()}`;

      setMetrics({
        activeSpaces: spaces.length,
        totalClients: stats.totalClients !== undefined ? stats.totalClients : clients.length,
        monthlyRevenue: formattedRevenue,
        pendingBookings: bookingRequestsData.length || activeRequests.length || 0,
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
    <div className="min-h-screen p-4 md:p-6 lg:p-8 bg-[#f7f7f6] font-sans animate-fade-in relative">
      <div className="w-full space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-3xl font-extrabold tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
              <span className="text-gray-900 dark:text-white">Space Partner</span> <span className="text-[#36503F] italic">Dashboard</span>
            </h1>
            <p className="text-[#6B7280] text-[16px] md:text-[16px]">
              Manage your workspace listings, clients, and revenue
            </p>
          </div>
          <SpacePartnerHeaderActions />
        </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Active Spaces"
          value={metrics.activeSpaces.toString()}
          icon={Building2}
          className="py-12"
        />
        <StatsCard
          title="Total Clients"
          value={metrics.totalClients.toString()}
          icon={Users}
          className="py-12"
        />
        <StatsCard
          title="Monthly Revenue"
          value={metrics.monthlyRevenue}
          icon={TrendingUp}
          className="py-12"
        />
        <StatsCard
          title="Pending Bookings"
          value={metrics.pendingBookings.toString()}
          icon={Calendar}
          className="py-12"
        />
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 items-start">
        {/* Active Spaces Column */}
        <div className="bg-white border border-[#DDE5DA] rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-[#DDE5DA] bg-[#F8FAF7] flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#10251A] flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Active Spaces
            </h2>
            <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
              {activeSpaces.length} Total
            </span>
          </div>
          <div className="divide-y divide-[#DDE5DA] max-h-[480px] overflow-y-auto scrollbar-hover-only">
            {activeSpaces.length > 0 ? (
              activeSpaces.map((space) => (
                <div key={space._id || space.id} className="p-4 hover:bg-[#F8FAF7] transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-[#10251A] text-sm">{space.name}</p>
                      <p className="text-xs text-[#607067]">{space.city}, {space.area}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${space.status?.toLowerCase() === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {space.status?.toUpperCase() || 'ACTIVE'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-[#607067] italic">No active spaces found.</div>
            )}
          </div>
        </div>

        {/* Booking Requests Column */}
        <div className="bg-white border border-[#DDE5DA] rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-[#DDE5DA] bg-[#F8FAF7] flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#10251A] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Booking Requests
            </h2>
            <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
              {bookingRequests.length} Pending
            </span>
          </div>
          <div className="divide-y divide-[#DDE5DA] max-h-[480px] overflow-y-auto scrollbar-hover-only">
            {bookingRequests.length > 0 ? (
              bookingRequests.map((request) => (
                <div 
                  key={request._id || request.id} 
                  onClick={() => navigate(`/spaceportal/booking-requests?bookingId=${request.bookingId}`)}
                  className="p-4 hover:bg-[#F8FAF7] transition-colors flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <UserPlus className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-[#10251A] text-sm">{request.client?.companyName || request.client?.name || request.companyName || request.contactName || "New Request"}</p>
                      <p className="text-xs text-[#607067]">
                        {(typeof request.space === 'object' ? request.space?.name : (request.spaceName || request.space)) || "N/A"} • {typeof request.plan === 'object' ? request.plan?.name : (request.plan || request.bookingType || "N/A")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#10251A]">
                      {request.dealValue && typeof request.dealValue !== 'object' ? `₹${request.dealValue.toLocaleString()}` : (request.plan?.price ? `₹${request.plan.price.toLocaleString()}` : "Pending")}
                    </p>
                    <p className="text-[10px] text-[#607067] font-medium capitalize">
                      {typeof request.status === 'string' ? request.status.toLowerCase() : 'review'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-[#607067] italic">No pending booking requests.</div>
            )}
          </div>
        </div>
      </div>

      </div>
      <AddSpaceDialog open={addSpaceOpen} onOpenChange={setAddSpaceOpen} />
    </div>
  );
}
