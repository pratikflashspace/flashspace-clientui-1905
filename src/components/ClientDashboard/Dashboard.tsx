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
  MoreVertical,
  Eye,
  CheckCircle2,
  Download,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Booking } from "@/types/services";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getAllVirtualOffices } from "@/services/virtualOffice.service";
import { getAllCoworkingSpaces } from "@/services/coworkingSpace.service";
import { getAllMeetingRooms } from "@/services/meetingRoom.service";
import { getShortAddress } from "@/utils/address";

type WorkspaceCodeSource = {
  _id?: string;
  spaceId?: string;
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingAutoRenew, setTogglingAutoRenew] = useState<string | null>(
    null,
  );

  // Workspace Code Mapping Logic (Replicated from MyBookings)
  const [workspaceCodeMap, setWorkspaceCodeMap] = useState<
    Record<string, string>
  >({});
  const [workspaceCodeByAddress, setWorkspaceCodeByAddress] = useState<
    Record<string, string>
  >({});
  const [workspaceCodeByShortAddress, setWorkspaceCodeByShortAddress] =
    useState<Record<string, string>>({});

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashRes, bookingsRes] = await Promise.all([
        userDashboardService.getDashboard(),
        userDashboardService.getBookings(),
      ]);

      if (dashRes.success && dashRes.data) {
        setDashboardData(dashRes.data);
      }

      if (bookingsRes.success && bookingsRes.data) {
        setBookings(bookingsRes.data);
      }
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const normalizeSpaceCode = (value?: string) => {
      const trimmed = value?.trim();
      if (!trimmed) return "";
      const match = trimmed.toUpperCase().match(/\b[A-Z]{2,}\d{2,}\b/);
      return match?.[0] || "";
    };

    const normalizeAddressKey = (value?: string) => {
      return (value || "").toLowerCase().replace(/\s+/g, " ").trim();
    };

    const mapById = (items: WorkspaceCodeSource[]) => {
      const mapped: Record<string, string> = {};
      items.forEach((item) => {
        const id = item._id?.trim();
        const code = normalizeSpaceCode(item.spaceId);
        if (id && code) {
          mapped[id] = code;
        }
      });
      return mapped;
    };

    const mapByAddress = (
      items: Array<WorkspaceCodeSource & { address?: string }>,
    ) => {
      const mapped: Record<string, string> = {};
      items.forEach((item) => {
        const code = normalizeSpaceCode(item.spaceId);
        const addressKey = normalizeAddressKey(item.address);
        if (code && addressKey) {
          mapped[addressKey] = code;
        }
      });
      return mapped;
    };

    const mapByShortAddress = (
      items: Array<WorkspaceCodeSource & { address?: string }>,
    ) => {
      const mapped: Record<string, string> = {};
      items.forEach((item) => {
        const code = normalizeSpaceCode(item.spaceId);
        const shortAddressKey = normalizeAddressKey(
          getShortAddress(item.address || ""),
        );
        if (code && shortAddressKey) {
          mapped[shortAddressKey] = code;
        }
      });
      return mapped;
    };

    const fetchWorkspaceCodes = async () => {
      try {
        const [virtualOfficeRes, coworkingRes, meetingRoomRes] =
          await Promise.allSettled([
            getAllVirtualOffices(),
            getAllCoworkingSpaces(),
            getAllMeetingRooms(),
          ]);

        const voMap =
          virtualOfficeRes.status === "fulfilled"
            ? mapById(virtualOfficeRes.value.offices)
            : {};
        const cwMap =
          coworkingRes.status === "fulfilled"
            ? mapById(coworkingRes.value)
            : {};
        const mrMap =
          meetingRoomRes.status === "fulfilled"
            ? mapById(meetingRoomRes.value)
            : {};
        const voAddressMap =
          virtualOfficeRes.status === "fulfilled"
            ? mapByAddress(virtualOfficeRes.value.offices)
            : {};
        const cwAddressMap =
          coworkingRes.status === "fulfilled"
            ? mapByAddress(coworkingRes.value)
            : {};
        const mrAddressMap =
          meetingRoomRes.status === "fulfilled"
            ? mapByAddress(meetingRoomRes.value)
            : {};
        const voShortAddressMap =
          virtualOfficeRes.status === "fulfilled"
            ? mapByShortAddress(virtualOfficeRes.value.offices)
            : {};
        const cwShortAddressMap =
          coworkingRes.status === "fulfilled"
            ? mapByShortAddress(coworkingRes.value)
            : {};
        const mrShortAddressMap =
          meetingRoomRes.status === "fulfilled"
            ? mapByShortAddress(meetingRoomRes.value)
            : {};

        if (isMounted) {
          setWorkspaceCodeMap({ ...voMap, ...cwMap, ...mrMap });
          setWorkspaceCodeByAddress({
            ...voAddressMap,
            ...cwAddressMap,
            ...mrAddressMap,
          });
          setWorkspaceCodeByShortAddress({
            ...voShortAddressMap,
            ...cwShortAddressMap,
            ...mrShortAddressMap,
          });
        }
      } catch (error) {
        console.error("Failed to resolve workspace codes", error);
      }
    };

    fetchWorkspaceCodes();

    return () => {
      isMounted = false;
    };
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

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
          icon: CheckCircle2,
          label: "Active",
        };
      case "expired":
        return {
          bg: "bg-gray-100",
          text: "text-gray-600",
          icon: Clock,
          label: "Expired",
        };
      case "pending_payment":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-700",
          icon: AlertCircle,
          label: "Payment Pending",
        };
      case "pending_kyc":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-700",
          icon: AlertCircle,
          label: "Pending KYC",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-600",
          icon: Clock,
          label: status,
        };
    }
  };

  const getPriceUnit = (unit?: string) => {
    if (!unit) return "/mo";
    const normalizedUnit = unit.toLowerCase();
    if (normalizedUnit.includes("hour")) return "/hr";
    if (normalizedUnit.includes("day")) return "/day";
    if (normalizedUnit.includes("year")) return "/yr";
    if (normalizedUnit.includes("month")) return "/mo";
    return `/${unit}`;
  };

  function getWorkspaceDisplayName(booking?: Booking | null) {
    const normalizeSpaceCode = (value?: string) => {
      const trimmed = value?.trim();
      if (!trimmed) return "";
      const match = trimmed.toUpperCase().match(/\b[A-Z]{2,}\d{2,}\b/);
      return match?.[0] || "";
    };

    const normalizeAddressKey = (value?: string) => {
      return (value || "").toLowerCase().replace(/\s+/g, " ").trim();
    };

    const addrKey = normalizeAddressKey(booking?.spaceSnapshot?.address);
    const shortAddrKey = normalizeAddressKey(
      getShortAddress(booking?.spaceSnapshot?.address || ""),
    );

    return (
      workspaceCodeMap[booking?.spaceId || ""] ||
      workspaceCodeByAddress[addrKey] ||
      workspaceCodeByShortAddress[shortAddrKey] ||
      normalizeSpaceCode(booking?.spaceSnapshot?.spaceId) ||
      normalizeSpaceCode(booking?.spaceSnapshot?.name) ||
      booking?.spaceSnapshot?.name ||
      "Workspace"
    );
  }

  const handleToggleAutoRenew = async (
    bookingId: string,
    currentValue: boolean,
  ) => {
    setTogglingAutoRenew(bookingId);
    try {
      const response = await userDashboardService.toggleAutoRenew(
        bookingId,
        !currentValue,
      );
      if (response.success) {
        setBookings((prev) =>
          prev.map((b) =>
            b._id === bookingId ? { ...b, autoRenew: !currentValue } : b,
          ),
        );
      }
    } catch (err) {
      console.error("Failed to toggle auto-renew", err);
    } finally {
      setTogglingAutoRenew(null);
    }
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
        {/* Upcoming Renewals Section */}
        {Array.isArray(bookings) && bookings.filter((b) => b.autoRenew).length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#35503F] tracking-tight">
                Upcoming <span className="italic">Auto Renewals</span>
              </h2>
        
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings
                .filter((b) => b.autoRenew)
                .sort((a, b) => {
                  const dateA = new Date(a.endDate || 0).getTime();
                  const dateB = new Date(b.endDate || 0).getTime();
                  return dateA - dateB;
                })
                .map((booking) => {
                  const statusConfig = getStatusConfig(booking.status);

                  return (
                    <div
                      key={booking._id}
                      className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all group relative"
                    >
                      {/* Header: ID & Status */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            {booking.bookingNumber || "BO-2024-XXX"}
                          </span>
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${booking.type === "VirtualOffice" ||
                              booking.type === "virtual_office"
                              ? "bg-gray-50 border-gray-200 text-gray-600"
                              : booking.type === "MeetingRoom" ||
                                booking.type === "meeting_room"
                                ? "bg-purple-50 border-purple-100 text-purple-600"
                                : "bg-blue-50 border-blue-100 text-blue-600"
                              }`}
                          >
                            {booking.type === "VirtualOffice" ||
                              booking.type === "virtual_office"
                              ? "Virtual Office"
                              : booking.type === "MeetingRoom" ||
                                booking.type === "meeting_room"
                                ? "On Demand"
                                : "Coworking"}
                          </span>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${statusConfig.bg} ${statusConfig.text}`}
                        >
                          <statusConfig.icon className="w-3 h-3" />
                          {statusConfig.label}
                        </span>
                      </div>

                      {/* Main Content */}
                      <div className="mb-5">
                        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#35503F] transition-colors line-clamp-1">
                          {getWorkspaceDisplayName(booking)}
                        </h3>
                        <div className="flex items-start gap-2 text-gray-500 text-xs mb-3 h-8">
                          <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#35503F]" />
                          <span className="line-clamp-2">
                            {booking.spaceSnapshot?.address},{" "}
                            {booking.spaceSnapshot?.city}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">
                            {formatDate(booking.startDate || "")} —{" "}
                            {formatDate(booking.endDate || "")}
                          </span>
                        </div>

                        {/* Auto-renewal Status */}
                        <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-green-50/50 border border-green-100 rounded-xl w-fit">
                          <div className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-[10px] font-bold text-green-700 uppercase tracking-tight">
                            Auto Renewal: ON — {formatDate(booking.endDate || "")}
                          </span>
                        </div>
                      </div>

                      <div className="h-px bg-gray-100 my-4" />

                      {/* Footer: Price & Actions */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-black text-gray-900">
                            {formatCurrency(booking.plan.price)}
                            <span className="text-xs font-normal text-gray-500 ml-1">
                              {getPriceUnit(booking.plan.tenureUnit)}
                            </span>
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            {booking.plan.tenure} {booking.plan.tenureUnit} Plan
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          

                          <Popover>
                            <PopoverTrigger asChild>
                              <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:border-[#35503F] hover:text-[#35503F] transition-all bg-white shadow-sm active:scale-95">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-56 p-1 bg-white rounded-2xl shadow-xl border-gray-100"
                              align="end"
                            >
                              {booking.status === "pending_kyc" && (
                                <button
                                  onClick={() => navigate('/dashboard/profile')}
                                  className="w-full text-left px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-3 transition-colors"
                                >
                                  <ShieldCheck className="w-4 h-4 text-green-600" /> Verify KYC
                                </button>
                              )}
                              {booking.documents &&
                                booking.documents.length > 0 && (
                                  <button className="w-full text-left px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-3 transition-colors">
                                    <Download className="w-4 h-4 text-blue-600" /> Documents
                                  </button>
                                )}
                              {booking.status === "active" && (
                                <button
                                  onClick={() =>
                                    handleToggleAutoRenew(
                                      booking._id,
                                      booking.autoRenew || false,
                                    )
                                  }
                                  disabled={togglingAutoRenew === booking._id}
                                  className="w-full text-left px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-3 transition-colors"
                                >
                                  <RefreshCw className={`w-4 h-4 text-[#35503F] ${togglingAutoRenew === booking._id ? "animate-spin" : ""}`} /> 
                                  Turn Off Auto-renew
                                </button>
                              )}
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}