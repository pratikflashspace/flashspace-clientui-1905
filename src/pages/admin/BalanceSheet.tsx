import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  PieChart,
  TrendingDown,
  TrendingUp,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Download,
  Calendar,
  DollarSign,
  ArrowRight,
  Target,
  Trophy,
  Filter,
} from "lucide-react";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavItems";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminService } from "@/services/admin.service";
import { toast } from "@/hooks/use-toast";

interface SummaryItem {
  label: string;
  amount: number;
  type: "credit" | "debit" | "profit";
}

interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

interface CityData {
  city: string;
  revenue: number;
  expenses: number;
  profit: number;
  margin: string;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const BalanceSheet = () => {
  const [overallSummary, setOverallSummary] = useState<SummaryItem[]>([]);
  const [monthlyBreakdown, setMonthlyBreakdown] = useState<MonthlyData[]>([]);
  const [cityBreakdown, setCityBreakdown] = useState<CityData[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("monthly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  const fetchBalanceSheet = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await adminService.getBalanceSheet(params);
      if (response.success && response.data) {
        setOverallSummary(response.data.overallSummary);
        setMonthlyBreakdown(response.data.monthlyBreakdown);
        setCityBreakdown(response.data.cityBreakdown);
      }
    } catch (error) {
      console.error("Failed to fetch balance sheet", error);
      toast({
        title: "Error",
        description: "Failed to load balance sheet data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalanceSheet();
  }, []);

  const handleExportCSV = () => {
    let csvData = "";
    if (activeTab === "monthly") {
      csvData = "Month,Revenue,Expenses,Net Profit\n";
      monthlyBreakdown.forEach((item) => {
        csvData += `"${item.month}",${item.revenue},${item.expenses},${item.profit}\n`;
      });
    } else if (activeTab === "city") {
      csvData = "City,Revenue,Expenses,Profit,Margin\n";
      cityBreakdown.forEach((item) => {
        csvData += `"${item.city}",${item.revenue},${item.expenses},${item.profit},"${item.margin}"\n`;
      });
    }

    if (!csvData) {
      toast({ title: "No data to export", variant: "default" });
      return;
    }

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `balance_sheet_${activeTab}_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Export Started",
      description: "Your CSV file is downloading.",
    });
  };

  if (loading) {
    return (
      <DashboardLayout
        portalName="FlashSpace Admin"
        portalDescription="Complete platform management"
        navItems={ADMIN_NAV_ITEMS}
      >
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading financial data...</p>
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Balance <span className="text-primary italic">Sheet</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Complete financial summary and reports
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setFilterDialogOpen(true)}>
            <Calendar className="w-4 h-4 mr-2" />
            Select Period
          </Button>
          <Button variant="outline" onClick={() => setFilterDialogOpen(true)}>
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overall Summary */}
      <div className="bg-background border border-border rounded-xl p-6 mb-8 shadow-sm">
        <h2 className="font-semibold text-foreground mb-4">
          FY {new Date().getFullYear()}-
          {(new Date().getFullYear() + 1).toString().slice(-2)} Summary
        </h2>
        <div className="space-y-3">
          {overallSummary.map((item, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                item.type === "profit"
                  ? "bg-green-50 border border-green-100"
                  : "bg-muted/30 border border-transparent"
              }`}
            >
              <span
                className={`font-medium ${item.type === "profit" ? "text-green-700" : "text-foreground"}`}
              >
                {item.label}
              </span>
              <span
                className={`font-bold text-xl ${
                  item.type === "credit"
                    ? "text-green-600"
                    : item.type === "profit"
                      ? "text-green-700"
                      : "text-red-600"
                }`}
              >
                {item.type === "debit" ? "-" : ""}
                {formatCurrency(item.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="monthly">Monthly Breakdown</TabsTrigger>
          <TabsTrigger value="city">City-wise</TabsTrigger>
          <TabsTrigger value="partner">Partner-wise</TabsTrigger>
        </TabsList>

        <TabsContent value="monthly">
          <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-foreground">
                    Month
                  </th>
                  <th className="text-right p-4 text-sm font-semibold text-foreground">
                    Revenue
                  </th>
                  <th className="text-right p-4 text-sm font-semibold text-foreground">
                    Expenses
                  </th>
                  <th className="text-right p-4 text-sm font-semibold text-foreground">
                    Net Profit
                  </th>
                </tr>
              </thead>
              <tbody>
                {monthlyBreakdown.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                  >
                    <td className="p-4 font-medium text-foreground">
                      {item.month}
                    </td>
                    <td className="p-4 text-right text-green-600 font-semibold">
                      {formatCurrency(item.revenue)}
                    </td>
                    <td className="p-4 text-right text-red-600 font-semibold">
                      {formatCurrency(item.expenses)}
                    </td>
                    <td className="p-4 text-right text-foreground font-bold">
                      {formatCurrency(item.profit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="city">
          <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-foreground">
                    City
                  </th>
                  <th className="text-right p-4 text-sm font-semibold text-foreground">
                    Revenue
                  </th>
                  <th className="text-right p-4 text-sm font-semibold text-foreground">
                    Expenses
                  </th>
                  <th className="text-right p-4 text-sm font-semibold text-foreground">
                    Profit
                  </th>
                  <th className="text-right p-4 text-sm font-semibold text-foreground">
                    Margin
                  </th>
                </tr>
              </thead>
              <tbody>
                {cityBreakdown.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                  >
                    <td className="p-4 font-medium text-foreground">
                      {item.city}
                    </td>
                    <td className="p-4 text-right text-green-600 font-semibold">
                      {formatCurrency(item.revenue)}
                    </td>
                    <td className="p-4 text-right text-red-600 font-semibold">
                      {formatCurrency(item.expenses)}
                    </td>
                    <td className="p-4 text-right text-foreground font-bold">
                      {formatCurrency(item.profit)}
                    </td>
                    <td className="p-4 text-right">
                      <Badge
                        className={`${
                          parseInt(item.margin) >= 40
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        }`}
                        variant="secondary"
                      >
                        {item.margin}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="partner">
          <div className="bg-background border border-border rounded-xl p-12 text-center shadow-sm">
            <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground font-medium">
              Partner-wise breakdown coming soon
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              We are aggregating partner-specific financial reports.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter Financial Data</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                  setFilterDialogOpen(false);
                  setTimeout(() => {
                    adminService.getBalanceSheet({}).then((res) => {
                      if (res.success && res.data) {
                        setOverallSummary(res.data.overallSummary);
                        setMonthlyBreakdown(res.data.monthlyBreakdown);
                        setCityBreakdown(res.data.cityBreakdown);
                      }
                    });
                  }, 0);
                }}
              >
                Reset
              </Button>
              <Button
                onClick={() => {
                  setFilterDialogOpen(false);
                  fetchBalanceSheet();
                }}
              >
                Apply Filter
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default BalanceSheet;
