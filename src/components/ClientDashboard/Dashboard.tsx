import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import userDashboardService, {
  DashboardData,
} from "@/services/userDashboard.service";
import {
  Package,
  Clock,
  MapPin,
  Users,
  ArrowRight,
  ShieldCheck,
  History,
  BellRing,
  Loader2,
  AlertCircle,
  RefreshCw,
  MessageSquare,
  CreditCard,
  Calendar,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userDashboardService.getDashboard();
      if (response.success && response.data) {
        setDashboardData(response.data);
      } else {
        // setError(response.message || "Failed to load dashboard");
        // Fallback to empty data if fail, to show UI at least
        setDashboardData(null);
      }
    } catch (err) {
      console.error("Failed to load dashboard data", err);
      // setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-[#35503F] animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Helper Functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No upcoming";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getKYCStatusDisplay = (status: string) => {
    switch (status) {
      case "in_progress":
        return { text: "Draft", color: "text-gray-400", isSmall: true };
      case "approved":
        return { text: "Verified", color: "text-green-600", isSmall: false };
      case "pending":
        return { text: "Pending", color: "text-yellow-600", isSmall: false };
      case "rejected":
        return { text: "Rejected", color: "text-red-600", isSmall: false };
      default:
        return { text: "Not Started", color: "text-gray-400", isSmall: true };
    }
  };

  const kycStatus = getKYCStatusDisplay(
    dashboardData?.kycStatus || "not_started",
  );

  const nextRenewalDate = dashboardData?.nextBookingDate;
  const nextRenewalDisplay = nextRenewalDate ? formatDate(nextRenewalDate) : "No upcoming";
  const nextRenewalColor = nextRenewalDate ? "text-gray-900" : "text-gray-400";
  const isNextRenewalSmall = !nextRenewalDate;

  // Active Services Logic
  const activeServicesCount = dashboardData?.activeServices || 0;
  const isActiveServicesZero = activeServicesCount === 0;
  const activeServicesColor = isActiveServicesZero ? "text-gray-400" : "text-gray-900";

  // Pending Invoices Logic
  const pendingInvoicesAmount = dashboardData?.pendingInvoices || 0;
  const isPendingInvoicesZero = pendingInvoicesAmount === 0;
  const pendingInvoicesColor = isPendingInvoicesZero ? "text-gray-400" : "text-gray-900";

  // Dynamic Data UI
  const statsCards = [
    {
      title: "Active Services",
      value: String(activeServicesCount),
      valueColor: activeServicesColor,
      isSmall: isActiveServicesZero,
      icon: Package,
    },
    {
      title: "Pending Invoices",
      value: formatCurrency(pendingInvoicesAmount),
      valueColor: pendingInvoicesColor,
      isSmall: isPendingInvoicesZero,
      icon: CreditCard,
    },
    {
      title: "Next Renewal",
      value: nextRenewalDisplay,
      valueColor: nextRenewalColor,
      isSmall: isNextRenewalSmall,
      icon: Calendar,
    },
    {
      title: "KYC Status",
      value: kycStatus.text,
      valueColor: kycStatus.color,
      isSmall: kycStatus.isSmall,
      icon: ShieldCheck,
    },
  ];





  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#35503F] tracking-tight">
              Welcome back, <span className="text-primary italic">{user?.fullName?.split(" ")[0] || "Customer"}</span>
            </h1>
            <p className="text-sm md:text-base text-gray-500 font-medium">
              Manage your workspace subscriptions and track your orders
            </p>
          </div>
          <a
            href="/services/virtual-office"
            className="inline-flex items-center justify-center gap-2 bg-[#35503F] text-[#FEF8C3] px-8 py-3.5 rounded-2xl font-bold hover:bg-[#35503F]/90 transition-all shadow-md active:scale-95 text-center"
          >
            <span className="text-xl">+</span>
            Book New Space
          </a>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md flex items-start justify-between"
            >
              <div>
                <p className={`mb-1 ${card.isSmall ? "text-xl font-bold" : "text-3xl font-extrabold"} ${card.valueColor || "text-[#35503F]"}`}>
                  {card.value}
                </p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{card.title}</p>
              </div>
              <div className="p-2.5 bg-gray-50 rounded-2xl text-[#35503F]">
                <card.icon className="w-5 h-5 opacity-70" />
              </div>
            </div>
          ))}
        </div>



      </div>
    </div>
  );
}