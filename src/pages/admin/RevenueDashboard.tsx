import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import {
  ArrowUpRight,
  Building2,
  TrendingUp,
  Wallet,
  Users,
} from "lucide-react";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavItems";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminService } from "@/services/admin.service";
import { AdminPageSkeleton } from "@/components/ui/skeleton-loaders";
import toast from "react-hot-toast";

/** Format a raw rupee amount (e.g. 4850000) to "₹48.5L" or "₹4.2Cr" */
const formatRupees = (amount: number): string => {
  if (!amount) return "₹0";
  if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(1)}Cr`;
  if (amount >= 100_000) return `₹${(amount / 100_000).toFixed(1)}L`;
  if (amount >= 1_000) return `₹${(amount / 1_000).toFixed(1)}K`;
  return `₹${amount}`;
};

/** Map the raw booking type to a human-readable label */
const categoryLabel = (raw: string | null) => {
  if (!raw) return "Other";
  const map: Record<string, string> = {
    virtual_office: "Virtual Office",
    coworking_space: "Coworking Space",
    meeting_room: "Meeting Room",
    day_pass: "Day Pass",
  };
  return (
    map[raw] ?? raw.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
};

const RevenueDashboard = () => {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    mtdRevenue: 0,
    ytdRevenue: 0,
    avgRevenuePerClient: 0,
  });
  const [byCity, setByCity] = useState<
    { city: string; revenue: number; percentage: number }[]
  >([]);
  const [byCategory, setByCategory] = useState<
    { category: string; revenue: number; percentage: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await adminService.getRevenueDashboard();
        if (res.success && res.data) {
          setMetrics(res.data.metrics);
          setByCity(res.data.revenueByCity || []);
          setByCategory(res.data.revenueByCategory || []);
        }
      } catch (err) {
        console.error("Revenue dashboard fetch error:", err);
        toast.error("Failed to fetch revenue data");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

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

  const totalRevenue = metrics.totalRevenue;

  return (
    <DashboardLayout
      portalName="FlashSpace Admin"
      portalDescription="Complete platform management"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
          Revenue <span className="text-primary italic">Dashboard</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Complete financial overview and analytics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Total Revenue (MTD)"
          value={loading ? "—" : formatRupees(metrics.mtdRevenue)}
          change={0}
          icon={TrendingUp}
        />
        <StatsCard
          title="Revenue (YTD)"
          value={loading ? "—" : formatRupees(metrics.ytdRevenue)}
          change={0}
          icon={Wallet}
        />
        <StatsCard
          title="Avg Revenue/Client"
          value={loading ? "—" : formatRupees(metrics.avgRevenuePerClient)}
          change={0}
          icon={Users}
        />
        <StatsCard
          title="Total Revenue (All Time)"
          value={loading ? "—" : formatRupees(metrics.totalRevenue)}
          change={0}
          icon={Building2}
        />
      </div>

      <Tabs defaultValue="city" className="space-y-6">
        <TabsList>
          <TabsTrigger value="city">By City</TabsTrigger>
          <TabsTrigger value="category">By Category</TabsTrigger>
          <TabsTrigger value="partner">By Partner</TabsTrigger>
        </TabsList>

        {/* ── By City ── */}
        <TabsContent value="city">
          <div className="bg-background border border-border rounded-xl overflow-hidden">
            {loading ? (
              <div className="p-10 text-center text-muted-foreground">
                Loading…
              </div>
            ) : byCity.length === 0 ? (
              <div className="p-10 text-center text-muted-foreground">
                No city revenue data found.
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">
                      City
                    </th>
                    <th className="text-right p-4 text-sm font-semibold text-foreground">
                      Revenue
                    </th>
                    <th className="text-right p-4 text-sm font-semibold text-foreground">
                      Share
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {byCity.map((item) => (
                    <tr
                      key={item.city ?? "unknown"}
                      className="border-t border-border"
                    >
                      <td className="p-4 font-medium text-foreground capitalize">
                        {item.city || "Unknown"}
                      </td>
                      <td className="p-4 text-right font-semibold text-foreground">
                        {formatRupees(item.revenue)}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{
                                width: `${item.percentage || (totalRevenue > 0 ? Math.round((item.revenue / totalRevenue) * 100) : 0)}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-8">
                            {item.percentage ||
                              (totalRevenue > 0
                                ? Math.round(
                                  (item.revenue / totalRevenue) * 100,
                                )
                                : 0)}
                            %
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </TabsContent>

        {/* ── By Category ── */}
        <TabsContent value="category">
          {loading ? (
            <div className="p-10 text-center text-muted-foreground">
              Loading…
            </div>
          ) : byCategory.length === 0 ? (
            <div className="bg-background border border-border rounded-xl p-10 text-center text-muted-foreground">
              No category revenue data found.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {byCategory.map((item) => {
                const share =
                  item.percentage ||
                  (totalRevenue > 0
                    ? Math.round((item.revenue / totalRevenue) * 100)
                    : 0);
                return (
                  <div
                    key={item.category}
                    className="bg-background border border-border rounded-xl p-5"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-foreground">
                        {categoryLabel(item.category)}
                      </h3>
                      <Badge
                        className={`${share >= 30
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : "bg-blue-100 text-blue-700 hover:bg-blue-100"
                          }`}
                      >
                        {share}% share
                      </Badge>
                    </div>
                    <p className="text-3xl font-extrabold text-foreground mb-2">
                      {formatRupees(item.revenue)}
                    </p>
                    <div className="mt-3 w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${share}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* ── By Partner ── */}
        <TabsContent value="partner">
          <div className="bg-background border border-border rounded-xl p-6 text-center">
            <p className="text-muted-foreground">
              Partner-wise revenue breakdown coming soon
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* AI Insight — dynamic based on top-growing city */}
      {!loading && byCity.length > 0 && (
        <div className="mt-6 p-5 bg-primary/5 border border-primary/20 rounded-xl">
          <Badge className="bg-primary text-primary-foreground mb-2">
            <ArrowUpRight className="w-3 h-3 mr-1 inline" />
            Revenue Insight
          </Badge>
          <p className="text-sm text-muted-foreground">
            Your top revenue market is{" "}
            <strong className="text-foreground capitalize">
              {byCity[0]?.city || "your top city"}
            </strong>{" "}
            contributing{" "}
            <strong className="text-foreground">
              {byCity[0]?.percentage}%
            </strong>{" "}
            of total revenue ({formatRupees(byCity[0]?.revenue)}). Total revenue
            across{" "}
            <strong className="text-foreground">{byCity.length} cities</strong>{" "}
            stands at{" "}
            <strong className="text-foreground">
              {formatRupees(totalRevenue)}
            </strong>
            .
          </p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default RevenueDashboard;
