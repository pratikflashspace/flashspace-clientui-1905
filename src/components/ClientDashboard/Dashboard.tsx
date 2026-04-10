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
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-[#35503F]  mb-2">
          Welcome back, <span className="italic">{user?.fullName?.split(" ")[0] || "Customer"}</span>
        </h1>
        <p className="text-gray-500 text-lg">
          Manage your workspace subscriptions and track your orders
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statsCards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-4">{card.title}</p>
              <h3 className={`${card.isSmall ? "text-xl font-medium" : "text-3xl font-bold"} ${card.valueColor || "text-gray-900"}`}>{card.value}</h3>
            </div>
            <div className="p-3 bg-gray-50 rounded-full">
              <card.icon className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        ))}
      </div>





    </div>
  );
}