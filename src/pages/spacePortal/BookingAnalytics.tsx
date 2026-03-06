import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchBookingAnalytics } from "@/services/spacePortal/spacePartner.service";
import StatCard from "@/components/ui/SpacePartner/StatCard";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Users,
  CalendarCheck,
  XCircle,
  Clock,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

/**
 * BookingAnalytics Page
 * - Shows KPI cards
 * - Revenue trend chart
 * - Plan-wise + Space-wise revenue division
 *
 * Now integrated with backend API.
 */
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

  /**
   * Tooltip trigger changes depending on device type:
   * - Desktop -> hover
   * - Mobile -> click
   */
  const [tooltipTrigger, setTooltipTrigger] = useState<"hover" | "click">(
    "hover",
  );

  /**
   * Currency formatter (INR)
   * Keeping it as function for reuse in multiple sections.
   */
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  /**
   * Growth % calculation
   * Safety check prevents division by zero.
   */
  const growth = useMemo(() => {
    if (
      !analytics?.summary?.revenueLastMonth ||
      analytics.summary.revenueLastMonth === 0
    )
      return 0;

    return (
      ((analytics.summary.revenueThisMonth -
        analytics.summary.revenueLastMonth) /
        analytics.summary.revenueLastMonth) *
      100
    );
  }, [analytics]);

  /**
   * KPI Cards Config
   * This avoids repeating <StatCard> code manually.
   */
  const kpiCards = useMemo(
    () => [
      {
        title: "Total Bookings",
        value: analytics?.summary?.totalBookings || 0,
        icon: <CalendarCheck size={22} />,
        trend: "up" as const,
        trendLabel: "8%",
      },
      {
        title: "Active Clients",
        value: analytics?.summary?.activeClients || 0,
        icon: <Users size={22} />,
        trend: "up" as const,
        trendLabel: "5%",
      },
      {
        title: "Cancelled Bookings",
        value: analytics?.summary?.cancelledBookings || 0,
        icon: <XCircle size={22} />,
        trend: "down" as const,
        trendLabel: "2%",
      },
      {
        title: "Pending Requests",
        value: analytics?.summary?.pendingRequests || 0,
        icon: <Clock size={22} />,
        trend: "up" as const,
        trendLabel: "3%",
      },
    ],
    [analytics],
  );

  /**
   * Detect touch devices (mobile/tablet) and change tooltip trigger.
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(hover: none), (pointer: coarse)");

    const updateTrigger = () => {
      setTooltipTrigger(mq.matches ? "click" : "hover");
    };

    updateTrigger();

    // Modern browsers
    if (mq.addEventListener) {
      mq.addEventListener("change", updateTrigger);
      return () => mq.removeEventListener("change", updateTrigger);
    }

    // Old browsers fallback
    mq.addListener(updateTrigger);
    return () => mq.removeListener(updateTrigger);
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Skeleton className="xl:col-span-2 h-[400px] w-full rounded-2xl" />
          <Skeleton className="h-[400px] w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
        <AlertCircle size={48} className="mb-4 text-red-500" />
        <h2 className="text-xl font-semibold text-slate-900">
          Failed to load analytics
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Please try again later or contact support.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1">
      {/* KPI Cards */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            trend={card.trend}
            trendLabel={card.trendLabel}
          />
        ))}
      </div>

      {/* Revenue Chart + Summary */}
      <div className="mt-10 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Chart */}
        <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-slate-900">Revenue Trend</h2>
          <p className="text-sm text-slate-500">
            Monthly revenue & booking performance.
          </p>

          <div className="mt-4 h-[240px] sm:mt-6 sm:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={analytics?.revenueTrend || []}
                margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="month"
                  interval="preserveStartEnd"
                  minTickGap={20}
                  tick={{ fontSize: 12 }}
                />

                <YAxis tick={{ fontSize: 12 }} width={44} />

                <Tooltip
                  trigger={tooltipTrigger}
                  wrapperStyle={{ outline: "none" }}
                />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3FA69E"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Summary */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Revenue Summary</h2>

          <div className="mt-6 space-y-5">
            <div>
              <p className="text-sm text-slate-500">This Month</p>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(analytics?.summary?.revenueThisMonth)}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Last Month</p>
              <p className="text-xl font-bold text-slate-700">
                {formatCurrency(analytics?.summary?.revenueLastMonth)}
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              <TrendingUp size={18} />
              Growth {growth.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Plan + Space Division */}
      <div className="mt-10 grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Plan Division */}
        <DivisionCard
          title="Plan-wise Division"
          description="Compare bookings and revenue by plan type."
          items={(analytics?.planDivision || []).map((plan: any) => ({
            key: plan.plan,
            name: plan.plan,
            bookings: plan.bookings,
            revenue: plan.revenue,
          }))}
          formatCurrency={formatCurrency}
        />

        {/* Space Division */}
        <DivisionCard
          title="Space-wise Division"
          description="Performance breakdown by each space location."
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

/**
 * Reusable component for Plan-wise / Space-wise division
 * UI remains exactly same (just removes duplicate code).
 */
function DivisionCard({
  title,
  description,
  items,
  formatCurrency,
}: {
  title: string;
  description: string;
  items: {
    key: string;
    name: string;
    bookings: number;
    revenue: number;
  }[];
  formatCurrency: (value: number) => string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <p className="text-sm text-slate-500">{description}</p>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
          >
            <div>
              <p className="font-semibold text-slate-900">{item.name}</p>
              <p className="text-xs text-slate-500">{item.bookings} bookings</p>
            </div>

            <p className="font-bold text-slate-900">
              {formatCurrency(item.revenue)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
