import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import userDashboardService, { DashboardData } from "@/services/userDashboard.service";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Building2,
  CreditCard,
  Calendar,
  ShieldCheck,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const COLORS = ["#f9c909", "#ffea80"];

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
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
        setError(response.message || "Failed to load dashboard");
      }
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

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
      case "approved":
        return { text: "Verified", color: "text-green-600" };
      case "pending":
        return { text: "Pending", color: "text-yellow-600" };
      case "rejected":
        return { text: "Rejected", color: "text-red-600" };
      default:
        return { text: "Not Started", color: "text-gray-500" };
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-yellow-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-700 font-medium mb-2">{error}</p>
          <button
            onClick={fetchDashboard}
            className="px-4 py-2 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-500 transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  const kycStatus = getKYCStatusDisplay(dashboardData?.kycStatus || "not_started");

  const lineData = dashboardData?.monthlyBookings?.map((m) => ({
    month: m.month,
    bookings: m.count,
  })) || [];

  const pieData = [
    { name: "Virtual Office", value: dashboardData?.usageBreakdown?.virtualOffice || 0 },
    { name: "Coworking Space", value: dashboardData?.usageBreakdown?.coworkingSpace || 0 },
  ];

  const summaryCards = [
    {
      title: "Active Services",
      value: String(dashboardData?.activeServices || 0),
      icon: Building2,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Pending Invoices",
      value: formatCurrency(dashboardData?.pendingInvoices || 0),
      icon: CreditCard,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "Next Renewal",
      value: formatDate(dashboardData?.nextBookingDate || null),
      icon: Calendar,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "KYC Status",
      value: kycStatus.text,
      icon: ShieldCheck,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      valueColor: kycStatus.color,
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-6 md:p-8 mb-8 text-black">
        <h2 className="text-2xl md:text-3xl font-bold font-[Poppins]">
          Welcome back, {user?.fullName?.split(" ")[0] || "User"}!
        </h2>
        <p className="text-black/70 mt-2">
          Here's a quick summary of your account
        </p>
      </div>

      {/* Account Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 ${card.iconBg} rounded-lg flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              <span className="text-sm text-gray-500">{card.title}</span>
            </div>
            <p className={`text-xl font-bold ${card.valueColor || "text-gray-900"}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4 font-[Poppins]">Monthly Bookings</h3>
          {lineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineData}>
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#f9c909"
                  strokeWidth={3}
                  dot={{ fill: "#f9c909", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-400">
              No booking data yet
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4 font-[Poppins]">Usage Breakdown</h3>
          {pieData.some(d => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ value }) => `${value}%`}
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-400">
              No usage data yet
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4 font-[Poppins]">Recent Activity</h3>
        {dashboardData?.recentActivity && dashboardData.recentActivity.length > 0 ? (
          <ul className="space-y-3">
            {dashboardData.recentActivity.map((activity, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  activity.type === "payment" ? "bg-green-100 text-green-600" :
                  activity.type === "booking" ? "bg-blue-100 text-blue-600" :
                  activity.type === "kyc" ? "bg-purple-100 text-purple-600" :
                  "bg-gray-100 text-gray-600"
                }`}>
                  {activity.type === "payment" && "$"}
                  {activity.type === "booking" && "B"}
                  {activity.type === "kyc" && "K"}
                  {!["payment", "booking", "kyc"].includes(activity.type) && "N"}
                </span>
                <div>
                  <p className="text-gray-700">{activity.message}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(activity.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm">No recent activity</p>
        )}
      </div>
    </div>
  );
}
