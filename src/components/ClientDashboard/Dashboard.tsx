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
  Sparkles,
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

  const aiFeatures = [
    {
      title: "Goal Analysis Quiz",
      description: "AI-powered quiz to analyze your ultimate goal for virtual office and get personalized suggestions",
    },
    {
      title: "Delivery Predictions",
      description: "AI predicts expected delivery date and time for your orders with real-time updates",
    },
    {
      title: "Delay Tracking & Alerts",
      description: "If delays occur, AI explains the reason and prescribes actions for fast tracking",
    },
    {
      title: "Compliance Suggestions",
      description: "AI promotes additional compliance services and best options for next 3-6 months",
    },
  ];

  const bookingManagement = [
    {
      title: "Active Subscriptions",
      description: "View all your active workspace subscriptions and their status",
      icon: Package,
    },
    {
      title: "Renewal Alerts",
      description: "Get timely payment and renewal alerts directly in your dashboard",
      icon: BellRing,
    },
    {
      title: "Booking History",
      description: "Complete history of all your past bookings and transactions",
      icon: History,
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-[#35503F]  mb-2">
          Welcome back, {user?.fullName?.split(" ")[0] || "Customer"}
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

      {/* AI-Powered Features */}
      <div className="mb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 ">AI-Powered Features</h2>
          <p className="text-gray-500">Intelligent assistance throughout your journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {aiFeatures.map((feature, idx) => (
            <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-[#35503F]/30 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-sm leading-tight pr-2">{feature.title}</h3>
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800 gap-1 shrink-0">
                  <Sparkles className="w-3 h-3" /> AI
                </div>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Management */}
      <div>
        <div className="mb-6 flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Package className="w-6 h-6 text-gray-700" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 ">Booking Management</h2>
            <p className="text-gray-500 text-sm">Track and manage all your bookings</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bookingManagement.map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-[#35503F]/30 transition-colors cursor-pointer group flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gray-50 rounded-lg shrink-0">
                    <item.icon className="w-5 h-5 text-[#35503F]" />
                  </div>
                  <h3 className="font-bold text-gray-900">{item.title}</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{item.description}</p>
              </div>
              <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                {/* <ArrowRight className="w-5 h-5 text-[#35503F]" /> */}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Communication & Records */}
      <div className="mt-12 mb-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <MessageSquare className="w-6 h-6 text-gray-700" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 ">Communication & Records</h2>
            <p className="text-gray-500 text-sm">Stay connected and track all activities</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-[#35503F]/30 transition-colors cursor-pointer group flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Direct Chat with Partner</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Chat directly with Space Partner to resolve queries (privacy protected)</p>
            </div>

            <div className="flex justify-end mt-4">
              <div className="p-2 bg-gray-50 rounded-full group-hover:bg-[#35503F]/10 transition-colors">
                {/* <MessageSquare className="w-5 h-5 text-[#35503F]" /> */}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-[#35503F]/30 transition-colors cursor-pointer group flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Mail Records View</h3>
              <p className="text-gray-500 text-sm leading-relaxed">See all couriers received at your office with dispatch status and details</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-[#35503F]/30 transition-colors cursor-pointer group flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Visit Records</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Track all visits done at the space regarding your registered company</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}