import StatCard from "@/components/ui/SpacePartner/StatCard";
import { BOOKING_ANALYTICS } from "@/data/spacePortal/bookingAnalytics";

import { Users, CalendarCheck, XCircle, Clock, TrendingUp } from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function BookingAnalytics() {
  const { summary, planDivision, spaceDivision, revenueTrend } =
    BOOKING_ANALYTICS;

  const growth =
    ((summary.revenueThisMonth - summary.revenueLastMonth) /
      summary.revenueLastMonth) *
    100;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="flex-1">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Booking <span className="text-[#3FA69E]">Analytics</span>
        </h1>
        <p className="mt-2 text-slate-500">
          Monitor performance across plans, spaces, and revenue trends.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Bookings"
          value={summary.totalBookings}
          icon={<CalendarCheck size={22} />}
          trend="up"
          trendLabel="8%"
        />

        <StatCard
          title="Active Clients"
          value={summary.activeClients}
          icon={<Users size={22} />}
          trend="up"
          trendLabel="5%"
        />

        <StatCard
          title="Cancelled Bookings"
          value={summary.cancelledBookings}
          icon={<XCircle size={22} />}
          trend="down"
          trendLabel="2%"
        />

        <StatCard
          title="Pending Requests"
          value={summary.pendingRequests}
          icon={<Clock size={22} />}
          trend="up"
          trendLabel="3%"
        />
      </div>

      {/* Revenue Chart + Summary */}
      <div className="mt-10 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Chart */}
        <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Revenue Trend</h2>
          <p className="text-sm text-slate-500">
            Monthly revenue & booking performance.
          </p>

          <div className="mt-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3FA69E"
                  strokeWidth={3}
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
                {formatCurrency(summary.revenueThisMonth)}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Last Month</p>
              <p className="text-xl font-bold text-slate-700">
                {formatCurrency(summary.revenueLastMonth)}
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
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Plan-wise Division
          </h2>
          <p className="text-sm text-slate-500">
            Compare bookings and revenue by plan type.
          </p>

          <div className="mt-6 space-y-4">
            {planDivision.map((plan) => (
              <div
                key={plan.plan}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="font-semibold text-slate-900">{plan.plan}</p>
                  <p className="text-xs text-slate-500">
                    {plan.bookings} bookings
                  </p>
                </div>

                <p className="font-bold text-slate-900">
                  {formatCurrency(plan.revenue)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Space Division */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Space-wise Division
          </h2>
          <p className="text-sm text-slate-500">
            Performance breakdown by each space location.
          </p>

          <div className="mt-6 space-y-4">
            {spaceDivision.map((space) => (
              <div
                key={space.space}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="font-semibold text-slate-900">{space.space}</p>
                  <p className="text-xs text-slate-500">
                    {space.bookings} bookings
                  </p>
                </div>

                <p className="font-bold text-slate-900">
                  {formatCurrency(space.revenue)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
