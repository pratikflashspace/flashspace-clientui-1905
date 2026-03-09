import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import {
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  CheckCircle,
  TrendingUp,
  Calculator,
} from "lucide-react";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavItems";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminService } from "@/services/admin.service";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";


interface Receivable {
  _id: string;
  client: string;
  email: string;
  amount: number;
  bookingNumber: string;
  type: string;
  dueDate: string;
  ageDays: number;
  status: "current" | "upcoming" | "overdue";
}

interface Payable {
  partner: string;
  city: string;
  amount: number;
  totalRevenue: number;
  bookingCount: number;
  dueDate: string;
  ageDays: number;
  status: "scheduled" | "pending" | "overdue";
}

interface Metrics {
  totalReceivable: number;
  overdueReceivable: number;
  totalPayable: number;
  dueThisWeek: number;
}

const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

const formatAge = (days: number) => {
  if (days < 0) return `${Math.abs(days)} days overdue`;
  if (days === 0) return "Due today";
  return `Due in ${days} days`;
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "current":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          Current
        </Badge>
      );
    case "upcoming":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
          Upcoming
        </Badge>
      );
    case "overdue":
      return <Badge variant="destructive">Overdue</Badge>;
    case "pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
          Pending
        </Badge>
      );
    case "scheduled":
      return <Badge variant="outline">Scheduled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const ReceivablePayable = () => {
  const [metrics, setMetrics] = useState<Metrics>({
    totalReceivable: 0,
    overdueReceivable: 0,
    totalPayable: 0,
    dueThisWeek: 0,
  });
  const [receivables, setReceivables] = useState<Receivable[]>([]);
  const [payables, setPayables] = useState<Payable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await adminService.getFinanceSummary();
        if (res.success && res.data) {
          setMetrics(res.data.metrics);
          setReceivables(res.data.receivables);
          setPayables(res.data.payables);
        }
      } catch (err) {
        console.error("Failed to fetch finance data", err);
        toast({
          title: "Error",
          description: "Failed to load finance data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSendReminder = (r: Receivable) => {
    toast({
      title: "Reminder Sent",
      description: `Payment reminder sent to ${r.client}.`,
    });
  };

  const handleProcessPayment = (p: Payable) => {
    toast({
      title: "Payment Initiated",
      description: `Payout of ${formatINR(p.amount)} to ${p.partner} initiated.`,
    });
  };

  return (
    <DashboardLayout
      portalName="FlashSpace Admin"
      portalDescription="Complete platform management"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
          Receivable / <span className="text-primary italic">Payable</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Track outstanding client payments and partner payouts
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Total Receivable"
          value={loading ? "—" : formatINR(metrics.totalReceivable)}
          change={0}
          icon={ArrowDownRight}
        />
        <StatsCard
          title="Overdue Amount"
          value={loading ? "—" : formatINR(metrics.overdueReceivable)}
          change={0}
          icon={TrendingUp}
        />
        <StatsCard
          title="Total Payable"
          value={loading ? "—" : formatINR(metrics.totalPayable)}
          change={0}
          icon={ArrowUpRight}
        />
        <StatsCard
          title="Due This Week"
          value={loading ? "—" : formatINR(metrics.dueThisWeek)}
          change={0}
          icon={Calculator}
        />
      </div>

      <Tabs defaultValue="receivable" className="space-y-6">
        <TabsList>
          <TabsTrigger value="receivable">
            Accounts Receivable ({loading ? "…" : receivables.length})
          </TabsTrigger>
          <TabsTrigger value="payable">
            Accounts Payable ({loading ? "…" : payables.length})
          </TabsTrigger>
        </TabsList>

        {/* ── Receivables ── */}
        <TabsContent value="receivable">
          <div className="bg-background border border-border rounded-xl overflow-hidden">
            {loading ? (
              <div className="p-10 text-center text-muted-foreground">
                Loading…
              </div>
            ) : receivables.length === 0 ? (
              <div className="p-10 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3 opacity-60" />
                <p className="font-semibold text-foreground">
                  All payments collected!
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  No outstanding receivables.
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">
                      Client
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">
                      Booking
                    </th>
                    <th className="text-right p-4 text-sm font-semibold text-foreground">
                      Amount
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">
                      Due Date
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">
                      Age
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">
                      Status
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {receivables.map((item) => (
                    <tr
                      key={item._id}
                      className="border-t border-border hover:bg-muted/20 transition-colors"
                    >
                      <td className="p-4">
                        <p className="font-medium text-foreground">
                          {item.client}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.email}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-foreground font-mono">
                          {item.bookingNumber}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {(item.type || "").replace(/_/g, " ")}
                        </p>
                      </td>
                      <td className="p-4 text-right font-semibold text-foreground">
                        {formatINR(item.amount)}
                      </td>
                      <td className="p-4 text-muted-foreground text-sm">
                        {item.dueDate
                          ? format(new Date(item.dueDate), "dd MMM yyyy")
                          : "—"}
                      </td>
                      <td className="p-4 text-sm">
                        <span
                          className={
                            item.ageDays < 0
                              ? "text-red-600 font-medium"
                              : "text-muted-foreground"
                          }
                        >
                          {formatAge(item.ageDays)}
                        </span>
                      </td>
                      <td className="p-4">{getStatusBadge(item.status)}</td>
                      <td className="p-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSendReminder(item)}
                        >
                          <Bell className="w-3 h-3 mr-1" />
                          Remind
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </TabsContent>

        {/* ── Payables ── */}
        <TabsContent value="payable">
          <div className="bg-background border border-border rounded-xl overflow-hidden">
            {loading ? (
              <div className="p-10 text-center text-muted-foreground">
                Loading…
              </div>
            ) : payables.length === 0 ? (
              <div className="p-10 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3 opacity-60" />
                <p className="font-semibold text-foreground">
                  No payables outstanding!
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Partner payouts appear once bookings are active and space
                  snapshots have partner info.
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">
                      Partner
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">
                      City
                    </th>
                    <th className="text-right p-4 text-sm font-semibold text-foreground">
                      Payout (70%)
                    </th>
                    <th className="text-right p-4 text-sm font-semibold text-foreground">
                      Bookings
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">
                      Due Date
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">
                      Status
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payables.map((item, idx) => (
                    <tr
                      key={idx}
                      className="border-t border-border hover:bg-muted/20 transition-colors"
                    >
                      <td className="p-4 font-medium text-foreground">
                        {item.partner}
                      </td>
                      <td className="p-4 text-muted-foreground capitalize">
                        {item.city || "—"}
                      </td>
                      <td className="p-4 text-right font-semibold text-foreground">
                        {formatINR(item.amount)}
                      </td>
                      <td className="p-4 text-right text-muted-foreground">
                        {item.bookingCount}
                      </td>
                      <td className="p-4 text-muted-foreground text-sm">
                        {item.dueDate
                          ? format(new Date(item.dueDate), "dd MMM yyyy")
                          : "—"}
                      </td>
                      <td className="p-4">{getStatusBadge(item.status)}</td>
                      <td className="p-4">
                        <Button
                          size="sm"
                          onClick={() => handleProcessPayment(item)}
                        >
                          Process
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default ReceivablePayable;
