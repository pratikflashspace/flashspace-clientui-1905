import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchBookingAnalytics } from "@/services/spacePortal/spacePartner.service";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  CalendarCheck,
  XCircle,
  Clock,
  TrendingUp,
  AlertCircle,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import { Badge } from "@/components/ui/badge";

export default function BookingAnalytics() {
  const {
    data: analyticsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["partner-booking-analytics"],
    queryFn: fetchBookingAnalytics,
  });

  const analytics = analyticsData?.data;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  const growth = useMemo(() => {
    if (!analytics?.summary?.revenueLastMonth) return 0;
    return (
      ((analytics.summary.revenueThisMonth -
        analytics.summary.revenueLastMonth) /
        analytics.summary.revenueLastMonth) *
      100
    );
  }, [analytics]);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl bg-white/50" />
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Skeleton className="xl:col-span-2 h-[450px] w-full rounded-2xl bg-white/50" />
          <Skeleton className="h-[450px] w-full rounded-2xl bg-white/50" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-background border border-border rounded-2xl p-12">
        <AlertCircle size={48} className="mb-4 text-rose-500 opacity-50" />
        <h2 className="text-xl font-bold text-foreground">
          Analytics Unavailable
        </h2>
        <p className="mt-2 text-sm text-muted-foreground text-center max-w-xs">
          We're having trouble reaching the analytics engine. Please refresh or
          try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl">
          Booking <span className="text-primary italic">Analytics</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive breakdown of your revenue, bookings, and space
          performance.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <AnalyticsStat
          title="Total Bookings"
          value={analytics?.summary?.totalBookings || 0}
          icon={CalendarCheck}
          trend="+8%"
          isUp={true}
        />
        <AnalyticsStat
          title="Active Clients"
          value={analytics?.summary?.activeClients || 0}
          icon={Users}
          trend="+5%"
          isUp={true}
        />
        <AnalyticsStat
          title="Cancelled"
          value={analytics?.summary?.cancelledBookings || 0}
          icon={XCircle}
          trend="-2%"
          isUp={false}
          color="text-rose-600"
        />
        <AnalyticsStat
          title="Pending"
          value={analytics?.summary?.pendingRequests || 0}
          icon={Clock}
          trend="+3%"
          isUp={true}
          color="text-amber-600"
        />
      </div>

      {/* Revenue Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10">
        {/* Chart Card */}
        <div className="xl:col-span-2 bg-background border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-foreground uppercase tracking-wider opacity-70">
                Revenue Trend
              </h2>
              <p className="text-sm text-muted-foreground">
                Monthly performance monitoring
              </p>
            </div>
            <Badge
              variant="outline"
              className="font-bold text-xs uppercase bg-primary/5 text-primary border-primary/20 px-3 py-1"
            >
              Current Year
            </Badge>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.revenueTrend || []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3FA69E" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3FA69E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(0,0,0,0.05)"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fontWeight: 700, fill: "currentColor" }}
                  className="text-muted-foreground"
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fontWeight: 700, fill: "currentColor" }}
                  className="text-muted-foreground"
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value: number) => [
                    formatCurrency(value),
                    "Revenue",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3FA69E"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Summary Card */}
        <div className="bg-background border border-border rounded-2xl p-6 shadow-sm flex flex-col">
          <h2 className="text-lg font-bold text-foreground uppercase tracking-wider opacity-70 mb-6">
            Summary
          </h2>

          <div className="space-y-8 flex-1">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                Current Month
              </p>
              <p className="text-4xl font-extrabold text-foreground tracking-tight">
                {formatCurrency(analytics?.summary?.revenueThisMonth)}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                Previous Month
              </p>
              <p className="text-2xl font-bold text-muted-foreground opacity-60">
                {formatCurrency(analytics?.summary?.revenueLastMonth)}
              </p>
            </div>

            <div
              className={`p-4 rounded-xl flex items-center justify-between ${growth >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
            >
              <div className="flex items-center gap-2">
                <TrendingUp
                  size={20}
                  className={growth < 0 ? "rotate-180" : ""}
                />
                <span className="font-extrabold text-lg">Growth Rate</span>
              </div>
              <span className="text-2xl font-black">{growth.toFixed(1)}%</span>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-muted-foreground">
                Average Order Value
              </span>
              <span className="font-extrabold text-foreground">₹4,250</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-muted-foreground">
                Target Completion
              </span>
              <span className="font-extrabold text-emerald-600">84%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
        <DivisionCard
          title="Plan Analytics"
          subtitle="Revenue distribution by plan type"
          items={(analytics?.planDivision || []).map((plan: any) => ({
            key: plan.plan,
            name: plan.plan,
            bookings: plan.bookings,
            revenue: plan.revenue,
          }))}
          formatCurrency={formatCurrency}
        />

        <DivisionCard
          title="Location Analytics"
          subtitle="Performance breakdown by space"
          items={(analytics?.spaceDivision || []).map((space: any) => ({
            key: space.space,
            name: space.space,
            bookings: space.bookings,
            revenue: space.revenue,
          }))}
          formatCurrency={formatCurrency}
        />
      </div>
    </div>
  );
}

function AnalyticsStat({
  title,
  value,
  icon: Icon,
  trend,
  isUp,
  color = "text-primary",
}: any) {
  return (
    <div className="bg-background border border-border rounded-2xl p-6 shadow-sm hover:translate-y-[-2px] transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-xl bg-muted/50">
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <div
          className={`flex items-center gap-0.5 text-xs font-black ${isUp ? "text-emerald-600" : "text-rose-600"}`}
        >
          {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trend}
        </div>
      </div>
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
        {title}
      </p>
      <p className="text-3xl font-extrabold text-foreground tracking-tight">
        {value}
      </p>
    </div>
  );
}

function DivisionCard({ title, subtitle, items, formatCurrency }: any) {
  return (
    <div className="bg-background border border-border rounded-2xl p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-foreground uppercase tracking-wider opacity-70">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <div className="space-y-3">
        {items.map((item: any) => (
          <div
            key={item.key}
            className="group flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-background border border-border flex items-center justify-center font-bold text-primary group-hover:scale-110 transition-transform">
                {item.name[0]}
              </div>
              <div>
                <p className="font-extrabold text-foreground">{item.name}</p>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-background text-[10px] font-bold px-1.5 py-0 h-4"
                  >
                    {item.bookings} Bookings
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-extrabold text-foreground">
                {formatCurrency(item.revenue)}
              </p>
              <div className="w-24 h-1 bg-muted rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-primary" style={{ width: "70%" }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
