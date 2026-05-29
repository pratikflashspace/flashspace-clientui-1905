import { ClientHeaderActions } from "./ClientHeaderActions";
import { NotificationBell } from "@/components/NotificationBell";
import {
  useState,
  useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import userDashboardService,
  {
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
  User,
  Bell
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
import BookingDetailsModal from "./BookingDetailsModal";

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
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

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

  const getStatusConfig = (booking: Booking) => {
    if (isBusinessSetupBooking(booking)) {
      return {
        bg: "bg-green-100",
        text: "text-green-700",
        icon: CheckCircle2,
        label: "Active",
      };
    }

    const status = booking.status;
    switch (status) {
      case "active":
        // Check if final agreement exists
        const hasFinalAgreement = booking.documents?.some(d => d.type === "final_agreement");
        if (!hasFinalAgreement) {
          return {
            bg: "bg-yellow-100",
            text: "text-yellow-700",
            icon: Clock,
            label: "Pending",
          };
        }
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

  const isBusinessSetupBooking = (booking?: Booking | null) => {
    if (!booking) return false;
    const values = [
      booking.type,
      (booking as any).bookingType,
      (booking as any).paymentType,
      booking.plan?.name,
      booking.spaceSnapshot?.name,
    ]
      .filter(Boolean)
      .map((value) => String(value).toLowerCase().replace(/[\s-]+/g, "_"));

    return values.some(
      (value) => value.includes("business_setup") || value.includes("businesssetup"),
    );
  };

  function getWorkspaceDisplayName(booking?: Booking | null) {
    if (isBusinessSetupBooking(booking)) {
      return booking?.plan?.name || booking?.spaceSnapshot?.name || "Business Setup";
    }

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
        return { text: "Verified", color: "text-green-600", isSmall: true };
      case "pending":
        return { text: "Pending", color: "text-yellow-600", isSmall: true };
      case "rejected":
        return { text: "Rejected", color: "text-red-600", isSmall: true };
      default:
        return { text: "Not Started", color: "text-gray-400", isSmall: true };
    }
  };

  const kycStatus = getKYCStatusDisplay(
    dashboardData?.kycStatus || "not_started",
  );

  const nextRenewalDate = dashboardData?.nextBookingDate;
  const nextRenewalDisplay = nextRenewalDate ? formatDate(nextRenewalDate) : "-";
  const nextRenewalColor = nextRenewalDate ? "text-gray-900" : "text-gray-400";
  const isNextRenewalSmall = true;

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
 <div className="min-h-screen p-4 md:p-6 lg:p-8 bg-gray-50 "> 
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 style={{ fontFamily: "'Inter', sans-serif" }} className="text-3xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome back, <span className="text-[#36503F] italic">{user?.fullName?.split(" ")[0] || "Customer"}</span>
            </h1>
            <p className="text-sm md:text-base text-gray-500 font-medium">
              Manage your workspace subscriptions and track your orders
            </p>
          </div>
                              <ClientHeaderActions />
        </div>

        {loading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-10 h-10 text-[#35503F] animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Loading dashboard...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statsCards.map((card, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-[#D4E0D0] rounded-xl shadow-[rgba(23,34,38,0.08)_0px_4px_24px_-4px] p-6 transition-all hover:shadow-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span style={{ fontFamily: "'Inter', sans-serif" }} className="text-[14px] font-medium text-[#6B8F78]">{card.title}</span>
                    <div className="w-8 h-8 rounded-lg bg-[#36503F]/10 flex items-center justify-center">
                      <card.icon className="w-4 h-4 text-[#36503F]" />
                    </div>
                  </div>
                  <div className={`${card.isSmall ? 'text-2xl' : 'text-3xl'} font-extrabold text-[#1A1A1A] tracking-tight`}>
                    {card.value}
                  </div>
                </div>
              ))}
            </div>
            {/* Manage Bookings Section */}
            {Array.isArray(bookings) && bookings.filter((b) => b.status === "active" || b.status === "pending_payment" || b.status === "pending_kyc" || b.autoRenew).length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 style={{ fontFamily: "'Inter', sans-serif" }} className="text-2xl font-bold text-gray-900 tracking-tight">
                    Manage <span className="text-[#36503F] italic">Bookings</span>
                  </h2>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bookings
                    .filter((b) => b.status === "active" || b.status === "pending_payment" || b.status === "pending_kyc" || b.autoRenew)
                    .sort((a, b) => {
                      const dateA = new Date(a.endDate || 0).getTime();
                      const dateB = new Date(b.endDate || 0).getTime();
                      return dateA - dateB;
                    })
                    .map((booking) => {
                      const statusConfig = getStatusConfig(booking);
                      const isBusinessSetup = isBusinessSetupBooking(booking);

                      if (isBusinessSetup) {
                        const purchasedDate = booking.startDate || booking.createdAt || "";
                        const packageName =
                          booking.plan?.name ||
                          booking.spaceSnapshot?.name ||
                          "Business Setup";

                        return (
                          <button
                            key={booking._id}
                            type="button"
                            onClick={() => setSelectedBooking(booking)}
                            className="text-left bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 hover:border-[#35503F]/40 hover:shadow-md transition-all group relative min-h-[250px] flex flex-col"
                          >
                            <div className="flex items-start justify-between gap-3 mb-5">
                              <div className="min-w-0">
                                <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700">
                                  Business Setup
                                </span>
                                <p className="mt-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                  {booking.bookingNumber || "Booking ID"}
                                </p>
                              </div>
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${statusConfig.bg} ${statusConfig.text}`}
                              >
                                <statusConfig.icon className="w-3 h-3" />
                                {statusConfig.label}
                              </span>
                            </div>

                            <div className="flex-1 space-y-3">
                              <h3
                                style={{ fontFamily: "'Inter', sans-serif" }}
                                className="text-lg font-bold text-gray-900 group-hover:text-[#35503F] transition-colors line-clamp-2"
                              >
                                {packageName}
                              </h3>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="font-medium">
                                  Bought on {formatDate(purchasedDate)}
                                </span>
                              </div>
                              <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-green-700 border border-green-100">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Lifetime service
                              </div>
                            </div>

                            <div className="h-px bg-gray-100 my-4" />

                            <div>
                              <p className="text-xl font-black text-gray-900">
                                {formatCurrency(booking.plan.price)}
                              </p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                One-time package
                              </p>
                            </div>
                          </button>
                        );
                      }

                      return (
                        <div
                          key={booking._id}
                          className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 hover:border-[#35503F]/40 hover:shadow-md transition-all group relative"
                        >
                          {/* Header: Space ID & Status */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                {getWorkspaceDisplayName(booking)}
                              </span>
                              <span
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${booking.type === "VirtualOffice" ||
                                  booking.type === "virtual_office"
                                    ? "bg-gray-50 border-gray-200 text-gray-600"
                                    : "bg-gray-50 border-gray-200 text-gray-600"
                                  }`}
                              >
                                {booking.type === "VirtualOffice" ||
                                  booking.type === "virtual_office"
                                  ? "Virtual Office"
                                  : booking.type === "BusinessSetup" ||
                                    booking.type === "business_setup"
                                    ? "Business Setup"
                                  : booking.type === "MeetingRoom" ||
                                    booking.type === "meeting_room"
                                    ? "Meeting Room"
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
                            <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#35503F] transition-colors line-clamp-1">
                              {booking.bookingNumber || "Booking ID"}
                            </h3>
                            <div className="flex items-start gap-2 text-gray-500 text-xs mb-3 h-8">
                              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#35503F]" />
                              <span className="line-clamp-2">
                                {booking.spaceSnapshot?.city} — {booking.spaceSnapshot?.address?.split(",")[0]}
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
                            {(booking.status === "active" || booking.status === "pending_payment" || booking.autoRenew) && (
                              <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-green-50/50 border border-green-100 rounded-xl w-fit">
                                <div className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-green-700 uppercase tracking-tight">
                                  Renewal on: {formatDate(booking.endDate || "")}
                                </span>
                              </div>
                            )}
                            {booking.status === "pending_kyc" && (
                              <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-100 rounded-xl w-fit">
                                <AlertCircle className="w-3.5 h-3.5 text-yellow-600" />
                                <span className="text-[10px] font-bold text-yellow-700 uppercase tracking-tight">
                                  Verification Required
                                </span>
                              </div>
                            )}
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
                            
                            <button
                              onClick={() => setSelectedBooking(booking)}
                              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-[#35503F] hover:text-white transition-all shadow-sm border border-gray-100"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </>
        )}

        {/* Booking Detail Modal */}
        {selectedBooking && (
          <BookingDetailsModal
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
            getWorkspaceDisplayName={getWorkspaceDisplayName}
            getStatusConfig={getStatusConfig}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
          />
        )}
      </div>
    </div>
  );
}