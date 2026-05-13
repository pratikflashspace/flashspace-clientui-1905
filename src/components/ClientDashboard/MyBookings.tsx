import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import userDashboardService from "@/services/userDashboard.service";
import { Booking, BookingType, BookingStatus } from "@/types/services";
import {
  Building2,
  Briefcase,
  MapPin,
  Calendar as CalendarIcon,
  Clock,
  Download,
  Eye,
  Filter,
  Search,
  ChevronDown,
  FileText,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
  Loader2,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  MessageSquare,
  MoreVertical,
  Star,
} from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calender";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import ReviewModal from "@/components/ui/ReviewModal";
import { getAllVirtualOffices } from "@/services/virtualOffice.service";
import { getAllCoworkingSpaces } from "@/services/coworkingSpace.service";
import { getAllMeetingRooms } from "@/services/meetingRoom.service";
import { getShortAddress } from "@/utils/address";
import BookingDetailsModal from "./BookingDetailsModal";

const MyBookings: React.FC = () => {
  type WorkspaceCodeSource = {
    _id?: string;
    spaceId?: string;
  };

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<"all" | BookingType>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | BookingStatus>(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingAutoRenew, setTogglingAutoRenew] = useState<string | null>(
    null,
  );
  const [date, setDate] = useState<DateRange | undefined>();
  const [totalCount, setTotalCount] = useState(0);
  const [bookingStats, setBookingStats] = useState({
    total: 0,
    active: 0,
    virtualOffice: 0,
    coworking: 0,
    meetingRoom: 0,
  });
  const [workspaceCodeMap, setWorkspaceCodeMap] = useState<
    Record<string, string>
  >({});
  const [workspaceCodeByAddress, setWorkspaceCodeByAddress] = useState<
    Record<string, string>
  >({});
  const [workspaceCodeByShortAddress, setWorkspaceCodeByShortAddress] =
    useState<Record<string, string>>({});

  // Raise Query state
  const [queryModalBooking, setQueryModalBooking] = useState<Booking | null>(
    null,
  );
  const [querySubject, setQuerySubject] = useState("");
  const [queryMessage, setQueryMessage] = useState("");
  const [submittingQuery, setSubmittingQuery] = useState(false);

  // Rate & Review state
  const [reviewModalBooking, setReviewModalBooking] = useState<Booking | null>(
    null,
  );

  const fetchBookings = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setError(null);
    try {
      const typeMap: Record<string, string> = {
        virtual_office: "VirtualOffice",
        coworking_space: "CoworkingSpace",
        meeting_room: "MeetingRoom",
      };

      const response = await userDashboardService.getBookings({
        type: activeTab === "all" ? undefined : (typeMap[activeTab] as any),
        status: statusFilter === "all" ? undefined : statusFilter,
      });
      if (response.success && response.data) {
        setBookings(response.data);

        // Only update stats if we are fetching "all" without filters, 
        // to prevent filtered tab requests from overriding global stats.
        if (activeTab === "all" && statusFilter === "all") {
          let stats = response.stats;
          // Fallback: compute stats from data if API stats are missing or all zeros
          const isStatsEmpty = !stats || (
            stats.total === 0 &&
            stats.active === 0 &&
            stats.virtualOffice === 0 &&
            stats.coworking === 0 &&
            stats.meetingRoom === 0
          );

          if (isStatsEmpty && response.data.length > 0) {
            stats = {
              total: response.data.length,
              active: response.data.filter((b: any) => b.status === "active").length,
              virtualOffice: response.data.filter((b: any) => b.type === "VirtualOffice" || b.bookingType === "VirtualOffice").length,
              coworking: response.data.filter((b: any) => b.type === "CoworkingSpace" || b.bookingType === "CoworkingSpace").length,
              meetingRoom: response.data.filter((b: any) => b.type === "MeetingRoom" || b.bookingType === "MeetingRoom").length,
            };
          }

          if (stats) {
            setBookingStats(stats);
          }
        }

        if (response.pagination) {
          setTotalCount(response.pagination.total);
        } else {
          setTotalCount(response.data.length);
        }
      } else {
        if (!isSilent) setError(response.message || "Failed to load bookings");
      }
    } catch (err) {
      if (!isSilent) setError("Failed to load bookings");
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();

    // Set up polling every 5 seconds
    const interval = setInterval(() => {
      fetchBookings(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeTab, statusFilter]);

  useEffect(() => {
    const openBookingId = searchParams.get("openBooking");
    if (openBookingId && bookings.length > 0) {
      const targetBooking = bookings.find((b) => b._id === openBookingId);
      if (targetBooking) {
        setSelectedBooking(targetBooking);
        // Clear the param so it doesn't reopen on reload
        const newParams = new URLSearchParams(searchParams);
        newParams.delete("openBooking");
        setSearchParams(newParams, { replace: true });
      }
    }
  }, [searchParams, bookings, setSearchParams]);

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
          setWorkspaceCodeMap({
            ...voMap,
            ...cwMap,
            ...mrMap,
          });
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
        if (selectedBooking?._id === bookingId) {
          setSelectedBooking({ ...selectedBooking, autoRenew: !currentValue });
        }
      }
    } catch (err) {
      console.error("Failed to toggle auto-renew");
    } finally {
      setTogglingAutoRenew(null);
    }
  };

  const handleRaiseQuery = async () => {
    if (!queryModalBooking || !querySubject.trim() || !queryMessage.trim())
      return;
    setSubmittingQuery(true);
    try {
      const response = await userDashboardService.createTicket({
        subject: querySubject.trim(),
        description: queryMessage.trim(),
        category: "bookings",
        bookingId: queryModalBooking._id,
      });
      if (response.success) {
        toast.success(
          "Query raised successfully! The space partner will get back to you.",
        );
        setQueryModalBooking(null);
        setQuerySubject("");
        setQueryMessage("");
      } else {
        toast.error(response.message || "Failed to raise query");
      }
    } catch (err) {
      toast.error("Failed to raise query");
    } finally {
      setSubmittingQuery(false);
    }
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedBooking || queryModalBooking || reviewModalBooking) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedBooking, queryModalBooking]);

  // Filter bookings client-side for search
  const filteredBookings = bookings.filter((b) => {
    const workspaceId = getWorkspaceDisplayName(b).toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchSearch =
      searchQuery === "" ||
      workspaceId.includes(query) ||
      b.bookingNumber.toLowerCase().includes(query) ||
      b.spaceSnapshot?.city?.toLowerCase().includes(query);

    // Filter by Date Range (Start Date)
    const matchDate =
      !date?.from ||
      (new Date(b.startDate || "").getTime() >= date.from.getTime() &&
        (!date.to ||
          new Date(b.startDate || "").getTime() <= date.to.getTime()));

    return matchSearch && matchDate;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
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

    const byBookingRef = booking?.spaceId ? workspaceCodeMap[booking.spaceId] : "";
    const bySnapshotRef = booking?.spaceSnapshot?._id
      ? workspaceCodeMap[booking.spaceSnapshot._id]
      : "";
    const byAddress =
      workspaceCodeByAddress[
        normalizeAddressKey(booking?.spaceSnapshot?.address)
      ] || "";
    const byShortAddress =
      workspaceCodeByShortAddress[
        normalizeAddressKey(
          getShortAddress(booking?.spaceSnapshot?.address || ""),
        )
      ] || "";
    const snapshotCode = normalizeSpaceCode(booking?.spaceSnapshot?.spaceId);
    const codeFromName = normalizeSpaceCode(booking?.spaceSnapshot?.name);

    const resolvedCode =
      byBookingRef ||
      bySnapshotRef ||
      byAddress ||
      byShortAddress ||
      snapshotCode ||
      codeFromName;

    if (!resolvedCode) return "Space ID Not Available";
    return resolvedCode;
  }

  const getStatusConfig = (booking: Booking) => {
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
      case "pending":
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
      case "cancelled":
        return {
          bg: "bg-red-100",
          text: "text-red-700",
          icon: X,
          label: "Cancelled",
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

  const calculateDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Price Unit Helper
  const getPriceUnit = (unit?: string) => {
    if (!unit) return "/mo";
    const normalizedUnit = unit.toLowerCase();
    if (normalizedUnit.includes("hour")) return "/hr";
    if (normalizedUnit.includes("day")) return "/day";
    if (normalizedUnit.includes("year")) return "/yr";
    if (normalizedUnit.includes("month")) return "/mo";
    return `/${unit}`;
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-yellow-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading bookings...</p>
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
            onClick={fetchBookings}
            className="px-4 py-2 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-500 transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-3xl font-extrabold text-[#35503F] tracking-tight">
              My <span className="text-[#35503F] italic">Bookings</span>
            </h1>
            <p className="text-sm md:text-base text-gray-500 font-medium">
              Manage your virtual offices and coworking spaces
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

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <p className="text-3xl font-extrabold text-[#35503F] mb-1">
              {bookingStats.total}
            </p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Bookings</p>
          </div>
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md border-l-4 border-l-[#10B981]">
            <p className="text-3xl font-extrabold text-[#10B981] mb-1">
              {bookingStats.active}
            </p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active</p>
          </div>
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <p className="text-3xl font-extrabold text-[#35503F] mb-1">
              {bookingStats.virtualOffice}
            </p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Virtual Offices</p>
          </div>
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <p className="text-3xl font-extrabold text-[#35503F] mb-1">
              {bookingStats.coworking}
            </p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Coworking</p>
          </div>
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <p className="text-3xl font-extrabold text-[#35503F] mb-1">
              {bookingStats.meetingRoom}
            </p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">On Demand</p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col xl:flex-row justify-between gap-6 items-stretch xl:items-center">
          {/* Service Type Tabs - Better scroll behavior on mobile */}
          <div className="w-full xl:w-fit min-w-0">
            <div className="flex w-full xl:w-fit min-w-0 p-1 rounded-xl shadow-sm bg-gray-100/80 overflow-x-auto whitespace-nowrap scroll-smooth">
            {[
              { id: "all", label: "All", icon: null },
              {
                id: "virtual_office",
                label: "Virtual Office",
                icon: Building2,
              },
              { id: "coworking_space", label: "Coworking", icon: Briefcase },
              { id: "meeting_room", label: "On Demand", icon: CalendarIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-lg text-[11px] 2xl:text-xs font-bold transition-all shrink-0 ${activeTab === tab.id
                  ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/50"
                  }`}
              >
                {tab.icon && <tab.icon className="w-3.5 h-3.5" />}
                {tab.label}
              </button>
            ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center w-full xl:w-auto">
            {/* Search */}
            <div className="relative flex-1 xl:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-[#35503F]/10 text-sm font-medium transition-all"
              />
            </div>

            {/* Date Range Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "justify-start text-left font-semibold bg-white border-gray-100 rounded-2xl hover:bg-gray-50 px-4 h-12 transition-all",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                  {date?.from ? (
                    date.to ? (
                      <span className="text-gray-900">
                        {format(date.from, "MMM dd")} -{" "}
                        {format(date.to, "MMM dd")}
                      </span>
                    ) : (
                      <span className="text-gray-900">{format(date.from, "MMM dd")}</span>
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            {/* Status Filter */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-center gap-2 px-5 h-12 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all text-sm font-semibold text-gray-700"
              >
                <Filter className="w-4 h-4 text-primary" />
                Status
                <ChevronDown className={cn("w-4 h-4 transition-transform", showFilters && "rotate-180")} />
              </button>
              {showFilters && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-gray-100 rounded-xl shadow-lg z-10 min-w-[150px] p-1">
                  {[
                    "all",
                    "active",
                    "pending_payment",
                    "pending_kyc",
                    "expired",
                    "cancelled",
                  ].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status as typeof statusFilter);
                        setShowFilters(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm rounded-lg hover:bg-gray-50 ${statusFilter === status
                        ? "bg-[#35503F]/5 text-[#35503F]"
                        : "text-gray-600"
                        }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bookings Grid */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-[32px] p-16 text-center shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-10 h-10 text-gray-200" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No bookings found
            </h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto text-sm font-medium">
              {searchQuery
                ? "We couldn't find any bookings matching your search. Try resetting your filters."
                : "You haven't made any bookings yet. Explore our premium spaces to get started."}
            </p>
            <a
              href="/services/virtual-office"
              className="inline-flex items-center gap-2 bg-[#35503F] text-[#FEF8C3] px-8 py-3 rounded-2xl font-bold hover:bg-[#35503F]/90 transition-all shadow-md active:scale-95"
            >
              Browse Spaces
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((booking) => {
              const statusConfig = getStatusConfig(booking);
              const daysRemaining = calculateDaysRemaining(
                booking.endDate || "",
              );

              return (
                <div
                  key={booking._id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group relative"
                >
                  {/* Header: ID & Status */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                        {booking.bookingNumber || "BO-2024-XXX"}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${booking.type === "VirtualOffice" ||
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
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${statusConfig.bg} ${statusConfig.text}`}
                    >
                      {(() => {
                        const Icon = statusConfig.icon;
                        return <Icon className="w-3 h-3" />;
                      })()}
                      {statusConfig.label}
                    </span>
                  </div>

                  {/* Main Content */}
                  <div className="mb-4">
                    <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-[#35503F] transition-colors line-clamp-1">
                      {getWorkspaceDisplayName(booking)}
                    </h3>
                    <div className="flex items-start gap-1.5 text-gray-500 text-xs mb-2 h-8">
                      <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#35503F]" />
                      <span className="line-clamp-2">
                        {booking.spaceSnapshot?.address},{" "}
                        {booking.spaceSnapshot?.city}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
                      <span>
                        {formatDate(booking.startDate || "")} —{" "}
                        {formatDate(booking.endDate || "")}
                      </span>
                    </div>

                    {/* Auto-renewal Status */}
                    {(booking.status === "active" || booking.status === "pending_payment" || booking.autoRenew) && (
                      <div className="mt-3 flex items-center gap-1.5 px-2.5 py-1.5 bg-green-50/50 border border-green-100 rounded-xl w-fit">
                        <div className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-green-700 uppercase tracking-tight">
                          Renewal on {formatDate(booking.endDate || "")}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="h-px bg-gray-100 my-3" />

                  {/* Footer: Price & Actions */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base font-bold text-gray-900">
                        {formatCurrency(booking.plan.price)}
                        <span className="text-xs font-normal text-gray-500">
                          {getPriceUnit(booking.plan.tenureUnit)}
                        </span>
                      </p>
                      <p className="text-[10px] text-gray-400 capitalize">
                        {booking.plan.tenure} {booking.plan.tenureUnit} Plan
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-[#35503F] hover:text-[#35503F] transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-[#35503F] hover:text-[#35503F] transition-colors">
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-48 p-1 bg-white"
                          align="end"
                        >
                          {booking.status === "pending_kyc" && (
                            <button
                              // onClick={() => navigate(`/dashboard/kyc-verification?linkBookingId=${booking._id}`)}
                              onClick={() => navigate('/dashboard/profile')}
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center gap-2"
                            >
                              <ShieldCheck className="w-4 h-4" /> Verify KYC
                            </button>
                          )}


                          <button
                            onClick={() => navigate('/dashboard/support', { state: { bookingId: booking._id, autoShowForm: true } })}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center gap-2"
                          >
                            <MessageSquare className="w-4 h-4" /> Raise Query
                          </button>

                          {(booking.status === "active" ||
                            booking.status === "expired") && (
                              <button
                                onClick={() => setReviewModalBooking(booking)}
                                className="w-full text-left px-3 py-2 text-sm text-[#35503F] hover:bg-[#35503F]/5 rounded-md flex items-center gap-2 font-medium"
                              >
                                <Star
                                  className={`w-4 h-4 ${booking.existingReview ? "fill-[#35503F]" : ""}`}
                                />
                                {booking.existingReview
                                  ? "Edit Review"
                                  : "Rate Space"}
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

        {/* Raise Query Modal */}
        {queryModalBooking && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Raise a Query
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {getWorkspaceDisplayName(queryModalBooking)} —{" "}
                      {queryModalBooking.bookingNumber}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setQueryModalBooking(null);
                      setQuerySubject("");
                      setQueryMessage("");
                    }}
                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Issue with mail forwarding"
                    value={querySubject}
                    onChange={(e) => setQuerySubject(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Describe your concern
                  </label>
                  <textarea
                    placeholder="Tell us what you need help with..."
                    rows={4}
                    value={queryMessage}
                    onChange={(e) => setQueryMessage(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-sm resize-none"
                  />
                </div>
              </div>

              <div className="p-6 pt-0 flex gap-3">
                <button
                  onClick={() => {
                    setQueryModalBooking(null);
                    setQuerySubject("");
                    setQueryMessage("");
                  }}
                  className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRaiseQuery}
                  disabled={
                    submittingQuery ||
                    !querySubject.trim() ||
                    !queryMessage.trim()
                  }
                  className="flex-1 bg-teal-600 text-white py-2.5 rounded-lg font-medium hover:bg-teal-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submittingQuery ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <MessageSquare className="w-4 h-4" />
                  )}
                  {submittingQuery ? "Submitting..." : "Submit Query"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Review Modal */}
        {reviewModalBooking && (
          <ReviewModal
            isOpen={!!reviewModalBooking}
            onClose={() => setReviewModalBooking(null)}
            booking={reviewModalBooking}
            existingReview={reviewModalBooking.existingReview}
            onSuccess={fetchBookings}
          />
        )}
      </div>
    </div>
  );
};

export default MyBookings;
