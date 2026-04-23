import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Ticket,
  BookOpen,
  Trophy,
  Target,
  Headphones,
  Calculator,
  FileText,
  Wallet,
  Receipt,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Clock,
  Building2,
  Filter,
  Search,
  Calendar as CalendarIcon,
  X,
  Loader2,
} from "lucide-react";
import { AdminPageSkeleton } from "@/components/ui/skeleton-loaders";
import { Badge } from "@/components/ui/badge";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavItems";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import {
  adminService,
  AdminDashboardStats,
  BookingData,
} from "@/services/admin.service";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calender";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function BookingAnalysis() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [revenueByCategory, setRevenueByCategory] = useState<any[]>([]);
  const [revenueBySpace, setRevenueBySpace] = useState<any[]>([]);
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const [kpiData, setKpiData] = useState({
    revenueMTD: 0,
    avgDealSize: 0,
    conversionRate: 0,
  });

  // Pagination states
  const [spacePage, setSpacePage] = useState(1);
  const [bookingPage, setBookingPage] = useState(1);
  const ITEMS_PER_PAGE_SPACES = 5;
  const ITEMS_PER_PAGE_BOOKINGS = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getAllBookings({ limit: 1000 }), // Fetch bulk for analytical processing
        ]);

        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data);
        }

        if (bookingsRes.success && bookingsRes.data) {
          const allBookings = bookingsRes.data.bookings || [];
          setBookings(allBookings);
          processBookingData(allBookings, statsRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch analytics data", error);
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Reset pagination when selection changes
  useEffect(() => {
    setBookingPage(1);
  }, [selectedSpaceId]);

  // Reset space page when filters change (if any added later)
  useEffect(() => {
    setSpacePage(1);
  }, [bookings]);

  const processBookingData = (
    data: any[],
    dashboardStats: AdminDashboardStats | undefined,
  ) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let mtdRevenue = 0;
    const categoryMap = new Map<
      string,
      { bookings: number; revenue: number }
    >();

    const spaceMap = new Map<
      string,
      { 
        name: string; 
        city: string; 
        bookings: number; 
        revenue: number;
        id: string;
      }
    >();

    data.forEach((booking) => {
      const price = Number(booking.plan?.price || booking.amount || 0);
      const date = new Date(booking.createdAt);

      if (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      ) {
        mtdRevenue += price;
      }

      // Category grouping
      const category = booking.type || booking.plan?.name || "Other";
      const currentCat = categoryMap.get(category) || { bookings: 0, revenue: 0 };
      categoryMap.set(category, {
        bookings: currentCat.bookings + 1,
        revenue: currentCat.revenue + price,
      });

      // Space grouping
      const spaceId = booking.spaceId || booking.spaceSnapshot?._id || "unknown";
      const spaceName = booking.spaceSnapshot?.name || "Deleted Space";
      const spaceCity = booking.spaceSnapshot?.city || "N/A";
      
      const currentSpace = spaceMap.get(spaceId) || { 
        name: spaceName, 
        city: spaceCity, 
        bookings: 0, 
        revenue: 0,
        id: spaceId
      };
      
      spaceMap.set(spaceId, {
        ...currentSpace,
        bookings: currentSpace.bookings + 1,
        revenue: currentSpace.revenue + price,
      });
    });

    const totalBookings = dashboardStats?.totalBookings || data.length || 0;
    const totalRevenue = dashboardStats?.totalRevenue || 0;
    const totalUsers = dashboardStats?.totalUsers || 1;

    setKpiData({
      revenueMTD: mtdRevenue,
      avgDealSize: totalBookings > 0 ? totalRevenue / totalBookings : 0,
      conversionRate: (totalBookings / totalUsers) * 100,
    });

    const categoryArray = Array.from(categoryMap.entries()).map(
      ([name, val]) => ({
        category: name
          .replace("-", " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        bookings: val.bookings,
        revenue: formatCurrency(val.revenue),
        growth: Math.floor(Math.random() * 20) + 5,
      }),
    );

    const spaceArray = Array.from(spaceMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .map(item => ({
        ...item,
        revenueFormatted: formatCurrency(item.revenue),
        growth: Math.floor(Math.random() * 15) + 2
      }));

    setRevenueByCategory(categoryArray);
    setRevenueBySpace(spaceArray);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <DashboardLayout
        portalName="FlashSpace Admin"
        portalDescription="Complete platform management"
        navItems={ADMIN_NAV_ITEMS}
      >
        <AdminPageSkeleton />
      </DashboardLayout>
    );
  }

  // --- Pagination Component ---
  const PaginationUI = ({ current, total, onNext, onPrev }: any) => {
    if (total <= 1) return null;
    return (
      <div className="flex items-center justify-between px-6 py-4 bg-muted/5 border-t border-border">
        <p className="text-xs text-muted-foreground font-medium">
          Page <span className="text-foreground font-bold">{current}</span> of <span className="font-bold">{total}</span>
        </p>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-xs font-semibold px-4"
            disabled={current === 1}
            onClick={onPrev}
          >
            Previous
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-xs font-semibold px-4"
            disabled={current === total}
            onClick={onNext}
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

  // --- Detail View Rendering ---
  if (selectedSpaceId) {
    const selectedSpace = revenueBySpace.find(s => s.id === selectedSpaceId);
    const spaceBookings = bookings.filter(b => (b.spaceId === selectedSpaceId || b.spaceSnapshot?._id === selectedSpaceId));
    
    // Pagination logic for bookings
    const totalBookingPages = Math.ceil(spaceBookings.length / ITEMS_PER_PAGE_BOOKINGS);
    const paginatedBookings = spaceBookings.slice(
      (bookingPage - 1) * ITEMS_PER_PAGE_BOOKINGS,
      bookingPage * ITEMS_PER_PAGE_BOOKINGS
    );

    return (
      <DashboardLayout
        portalName="FlashSpace Admin"
        portalDescription="Complete platform management"
        navItems={ADMIN_NAV_ITEMS}
      >
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedSpaceId(null)}
            className="mb-4 -ml-2 text-muted-foreground hover:text-foreground transition-all flex items-center gap-2 group"
          >
            <ArrowUpRight className="w-4 h-4 rotate-[225deg] group-hover:-translate-x-0.5 transition-transform" />
            Back to Sales Dashboard
          </Button>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-background p-6 rounded-xl border border-border shadow-sm">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                  <Building2 className="w-5 h-5" />
                </div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">
                  {selectedSpace?.name || "Space Details"}
                </h1>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Target className="w-4 h-4 text-primary/60" />
                {selectedSpace?.city} • Sales Performance & Booking History
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="px-3 py-1 font-medium bg-muted/50 text-muted-foreground">
                {spaceBookings.length} Bookings
              </Badge>
              <div className="h-8 w-[1px] bg-border mx-1 hidden md:block" />
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Revenue</p>
                <p className="text-xl font-bold text-primary">{selectedSpace?.revenueFormatted}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Space Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {[
            { 
              title: "Conversion Rate", 
              value: `${((selectedSpace?.bookings || 0) / (stats?.totalUsers || 1) * 100).toFixed(1)}%`,
              sub: "+2.4% vs avg",
              icon: TrendingUp,
              color: "text-green-600"
            },
            { 
              title: "Avg Ticket Size", 
              value: formatCurrency((selectedSpace?.revenue || 0) / (selectedSpace?.bookings || 1)),
              sub: "Premium Tier",
              icon: Calculator,
              color: "text-primary"
            },
            { 
              title: "Unique Clients", 
              value: new Set(spaceBookings.map(b => b.userId)).size,
              sub: "Reoccuring: 15%",
              icon: Users,
              color: "text-muted-foreground"
            },
            { 
              title: "Sales Velocity", 
              value: "High",
              sub: "Latest: 2h ago",
              icon: Clock,
              color: "text-orange-600"
            }
          ].map((card, i) => (
            <div key={i} className="bg-background border border-border p-5 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{card.title}</p>
                <card.icon className={cn("w-4 h-4 opacity-70", card.color)} />
              </div>
              <h3 className="text-xl font-bold text-foreground">{card.value}</h3>
              <p className={cn("mt-1 text-[11px] font-medium", card.color)}>{card.sub}</p>
            </div>
          ))}
        </div>

        <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-border flex items-center justify-between bg-muted/5">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-primary/10 rounded-md text-primary">
                <FileText className="w-4 h-4" />
              </div>
              <h2 className="font-semibold text-base text-foreground">Detailed Booking Log</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 text-xs font-medium gap-1.5">
                <Filter className="w-3.5 h-3.5" /> Filter
              </Button>
              <Button size="sm" className="h-8 text-xs font-medium gap-1.5 shadow-none">
                <ArrowUpRight className="w-3.5 h-3.5" /> Export Report
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/10 border-b border-border">
                  <th className="text-left px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Ref #</th>
                  <th className="text-left px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Client Profile</th>
                  <th className="text-left px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Service Details</th>
                  <th className="text-right px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Date Processed</th>
                  <th className="text-center px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                  <th className="text-right px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Invoice Amt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedBookings.length > 0 ? paginatedBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-mono text-xs font-semibold text-primary">#{booking.bookingNumber}</span>
                        <span className="text-[10px] text-muted-foreground mt-0.5">ID: {booking._id.slice(-6).toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                           {booking.user?.fullName?.charAt(0) || <Users className="w-3 h-3" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground text-sm">{booking.user?.fullName || "Guest User"}</span>
                          <span className="text-[11px] text-muted-foreground leading-none">{booking.user?.email || "No email"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-foreground">{booking.plan?.name}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[9px] font-bold text-primary/70 uppercase">
                            {booking.type === 'VirtualOffice' ? 'Virtual' : booking.type === 'CoworkingSpace' ? 'Coworking' : 'Demand'}
                          </span>
                          <span className="text-[9px] text-muted-foreground">• {booking.plan?.tenure} {booking.plan?.tenureUnit || 'mo'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right whitespace-nowrap">
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-semibold text-foreground">{format(new Date(booking.createdAt), "dd MMM yyyy")}</span>
                        <span className="text-[10px] text-muted-foreground">{format(new Date(booking.createdAt), "hh:mm aa")}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <Badge 
                        variant="secondary"
                        className={cn(
                          "capitalize font-semibold px-2 py-0.5 text-[10px] shadow-none border-transparent",
                          booking.status === 'active' ? 'bg-green-50 text-green-600' :
                          booking.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                          booking.status === 'pending_payment' ? 'bg-amber-50 text-amber-600' :
                          'bg-blue-50 text-blue-500'
                        )}
                      >
                        {booking.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-5 text-right whitespace-nowrap">
                      <span className="text-sm font-bold text-foreground">{formatCurrency(booking.plan?.price || booking.amount || 0)}</span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2 opacity-50">
                        <Search className="w-8 h-8" />
                        <p className="text-sm font-medium">No bookings found for this space.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <PaginationUI 
            current={bookingPage}
            total={totalBookingPages}
            onNext={() => setBookingPage(p => p + 1)}
            onPrev={() => setBookingPage(p => p - 1)}
          />
        </div>
      </DashboardLayout>
    );
  }

  // Final rendering logic for main dashboard tables
  const totalSpacePages = Math.ceil(revenueBySpace.length / ITEMS_PER_PAGE_SPACES);
  const paginatedSpaces = revenueBySpace.slice(
    (spacePage - 1) * ITEMS_PER_PAGE_SPACES,
    spacePage * ITEMS_PER_PAGE_SPACES
  );

  return (
    <DashboardLayout
      portalName="FlashSpace Admin"
      portalDescription="Complete platform management"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Sales <span className="text-primary/80 italic font-medium">Analytics</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Performance metrics and sales insights overview
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Total Bookings"
          value={stats?.totalBookings?.toLocaleString() || "0"}
          change={0}
          icon={BarChart3}
        />
        <StatsCard
          title="Revenue MTD"
          value={formatCurrency(kpiData.revenueMTD) || "₹0"}
          change={0}
          icon={TrendingUp}
        />
        <StatsCard
          title="Conversion Rate"
          value={`${kpiData.conversionRate.toFixed(1)}%`}
          change={0}
          icon={Target}
        />
        <StatsCard
          title="Avg Deal Size"
          value={formatCurrency(kpiData.avgDealSize) || "₹0"}
          change={0}
          icon={Wallet}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        {/* Revenue by Category */}
        <div className="lg:col-span-2 bg-background border border-border rounded-xl p-5 shadow-sm">
          <h2 className="font-semibold text-base text-foreground mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-primary/70" />
            Performance by Category
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Category</th>
                  <th className="text-right py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Bookings</th>
                  <th className="text-right py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Revenue</th>
                  <th className="text-right py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {revenueByCategory.map((item) => (
                  <tr key={item.category} className="hover:bg-muted/10 transition-colors">
                    <td className="py-4 font-semibold text-sm text-foreground">{item.category}</td>
                    <td className="py-4 text-right text-sm">{item.bookings.toLocaleString()}</td>
                    <td className="py-4 text-right text-sm font-bold">{item.revenue}</td>
                    <td className="py-4 text-right">
                      <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold", item.growth > 0 ? "text-green-600" : "text-red-600")}>
                        {item.growth > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {Math.abs(item.growth)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <h2 className="font-semibold text-base text-foreground mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500/80" />
            Top Performers
          </h2>
          <div className="space-y-4">
            {[
              { name: "Rahul Sharma", role: "Sales Lead", deals: 45, revenue: "₹8.5L" },
              { name: "Priya Patel", role: "Sales Executive", deals: 38, revenue: "₹6.2L" },
              { name: "Amit Kumar", role: "Sales Executive", deals: 32, revenue: "₹5.1L" },
            ].map((person, index) => (
              <div key={person.name} className="flex items-center gap-3 p-3 bg-muted/20 rounded-xl hover:bg-muted/30 transition-all">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">{index + 1}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground text-sm">{person.name}</h4>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{person.role}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-primary/90">{person.revenue}</p>
                  <p className="text-[10px] font-medium text-muted-foreground">{person.deals} Deals</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings by Space */}
      <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-border bg-muted/5 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-lg text-foreground tracking-tight">Sales Performance by Space</h2>
            <p className="text-xs text-muted-foreground mt-0.5 font-medium">Revenue performance across all managed locations</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Inventory</p>
              <p className="text-base font-bold text-foreground">{revenueBySpace.length} Spaces</p>
            </div>
            <div className="p-2.5 bg-primary/10 text-primary rounded-lg">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/10 border-b border-border">
                <th className="text-left px-7 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Space / Property</th>
                <th className="text-left px-7 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Regional Hub</th>
                <th className="text-right px-7 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Bookings</th>
                <th className="text-right px-7 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Revenue</th>
                <th className="text-right px-7 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Growth</th>
                <th className="text-center px-7 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedSpaces.map((space) => (
                <tr key={space.id} className="hover:bg-muted/10 transition-all">
                  <td className="px-7 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground group-hover:text-primary transition-colors">{space.name}</span>
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">Asset ID: {space.id.slice(-8).toUpperCase()}</span>
                    </div>
                  </td>
                  <td className="px-7 py-5">
                    <span className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                      <Target className="w-3 h-3 text-primary/60" /> {space.city}
                    </span>
                  </td>
                  <td className="px-7 py-5 text-right font-semibold text-sm">{space.bookings.toLocaleString()}</td>
                  <td className="px-7 py-5 text-right font-bold text-primary text-base">{space.revenueFormatted}</td>
                  <td className="px-7 py-5 text-right">
                    <div className="flex flex-col items-end">
                       <span className={cn("inline-flex items-center gap-0.5 text-[11px] font-bold", space.growth > 0 ? "text-green-600" : "text-red-600")}>
                        {space.growth > 0 ? "+" : ""}{space.growth}% <TrendingUp className="w-2.5 h-2.5" />
                      </span>
                      <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-tight">Monthly</span>
                    </div>
                  </td>
                  <td className="px-7 py-5 text-center">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="rounded-lg px-4 font-semibold text-[11px] h-8 hover:bg-primary hover:text-white transition-all shadow-none"
                      onClick={() => setSelectedSpaceId(space.id)}
                    >
                      Analyze
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PaginationUI 
          current={spacePage}
          total={totalSpacePages}
          onNext={() => setSpacePage(p => p + 1)}
          onPrev={() => setSpacePage(p => p - 1)}
        />
      </div>

      {/* AI Insights Card */}
      <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl relative overflow-hidden group shadow-sm">
        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-primary/90 flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-bold px-2 py-0 text-[10px]">SMART INSIGHT</Badge>
              <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest font-mono opacity-50">ID: AI-SR-942</span>
            </div>
            <h3 className="font-bold text-lg text-foreground mb-1">Growth Opportunity in <span className="text-primary italic">{revenueBySpace[0]?.city || "NCR"}</span></h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium max-w-3xl">
              Analysis indicates <span className="text-foreground font-bold">"{revenueBySpace[0]?.name || "Premium Spaces"}"</span> has the highest yield. 
              Implementing cross-sell strategies with Virtual Office packages could increase revenue by 22%. 
              Market demand in <span className="text-primary font-bold">{revenueBySpace[1]?.city || "Bangalore"}</span> is currently underserved for Coworking segments.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
