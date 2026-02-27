import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

const MyBookings: React.FC = () => {
  const navigate = useNavigate();
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

  const fetchBookings = async () => {
    setLoading(true);
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
        setError(response.message || "Failed to load bookings");
      }
    } catch (err) {
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [activeTab, statusFilter]);

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
    const matchSearch =
      searchQuery === "" ||
      b.spaceSnapshot?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      b.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.spaceSnapshot?.city?.toLowerCase().includes(searchQuery.toLowerCase());

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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold  text-[#35503F]">
              My <span className="italic">Bookings</span>
            </h1>
            <p className="text-gray-500 mt-2">
              Manage your virtual offices and coworking spaces
            </p>
          </div>
          <a
            href="/services/virtual-office"
            className="inline-flex items-center gap-2 bg-[#35503F] text-white px-6 py-3 rounded-full font-medium hover:bg-[#35503F]/90 transition-colors"
          >
            <span className="text-lg">+</span>
            Book New Space
          </a>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-150">
            <p className="text-3xl font-bold text-[#35503F] mb-1">
              {bookingStats.total}
            </p>
            <p className="text-xs text-gray-500">Total Bookings</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-150">
            <p className="text-3xl font-bold text-[#10B981] mb-1">
              {bookingStats.active}
            </p>
            <p className="text-xs text-gray-500">Active</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-150">
            <p className="text-3xl font-bold text-[#35503F] mb-1">
              {bookingStats.virtualOffice}
            </p>
            <p className="text-xs text-gray-500">Virtual Offices</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-150">
            <p className="text-3xl font-bold text-[#35503F] mb-1">
              {bookingStats.coworking}
            </p>
            <p className="text-xs text-gray-500">Coworking</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-150">
            <p className="text-3xl font-bold text-[#35503F] mb-1">
              {bookingStats.meetingRoom}
            </p>
            <p className="text-xs text-gray-500">On Demand</p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
          {/* Service Type Tabs */}
          <div className="flex p-1 rounded-lg shadow-sm bg-gray-100">
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
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${activeTab === tab.id
                  ? "bg-white text-black shadow-md"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {tab.icon && <tab.icon className="w-4 h-4" />}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, ID, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white rounded-full border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#35503F]/20 text-sm"
              />
            </div>

            {/* Date Range Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "justify-start text-left font-normal bg-white border-gray-100 rounded-full hover:bg-white px-4 h-11",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd")} -{" "}
                        {format(date.to, "LLL dd")}
                      </>
                    ) : (
                      format(date.from, "LLL dd")
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
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-full hover:bg-gray-50 transition-colors text-sm"
              >
                <Filter className="w-4 h-4" />
                Status
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
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No bookings found
            </h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto text-sm">
              {searchQuery
                ? "We couldn't find any bookings matching your search. Try adjusting your filters."
                : "You haven't made any bookings yet."}
            </p>
            <a
              href="/services/virtual-office"
              className="inline-flex items-center gap-2 bg-[#35503F] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#35503F]/90 transition-colors text-sm"
            >
              Browse Spaces
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBookings.map((booking) => {
              const statusConfig = getStatusConfig(booking.status);
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
                      <statusConfig.icon className="w-3 h-3" />
                      {statusConfig.label}
                    </span>
                  </div>

                  {/* Main Content */}
                  <div className="mb-4">
                    <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-[#35503F] transition-colors line-clamp-1">
                      {booking.spaceSnapshot?.name}
                    </h3>
                    <div className="flex items-start gap-1.5 text-gray-500 text-xs mb-2 h-8">
                      <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
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
                          {booking.documents &&
                            booking.documents.length > 0 && (
                              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center gap-2">
                                <Download className="w-4 h-4" /> Documents
                              </button>
                            )}
                          {booking.status === "active" && (
                            <button
                              onClick={() =>
                                handleToggleAutoRenew(
                                  booking._id,
                                  booking.autoRenew,
                                )
                              }
                              disabled={togglingAutoRenew === booking._id}
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center gap-2"
                            >
                              <RefreshCw
                                className={`w-4 h-4 ${togglingAutoRenew === booking._id ? "animate-spin" : ""}`}
                              />
                              {booking.autoRenew
                                ? "Disable Auto-Renew"
                                : "Enable Auto-Renew"}
                            </button>
                          )}
                          <button
                            onClick={() => setQueryModalBooking(booking)}
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="relative">
                <img
                  src={
                    selectedBooking.spaceSnapshot?.images?.[0] ||
                    selectedBooking.spaceSnapshot?.image ||
                    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400"
                  }
                  alt={selectedBooking.spaceSnapshot?.name}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${selectedBooking.type === "virtual_office"
                      ? "bg-yellow-400 text-black"
                      : "bg-blue-500 text-white"
                      }`}
                  >
                    {selectedBooking.type === "virtual_office"
                      ? "Virtual Office"
                      : "Coworking"}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedBooking.spaceSnapshot?.name}
                    </h2>
                    <p className="text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4" />{" "}
                      {selectedBooking.spaceSnapshot?.address}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${getStatusConfig(selectedBooking.status).bg
                      } ${getStatusConfig(selectedBooking.status).text}`}
                  >
                    {getStatusConfig(selectedBooking.status).label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Booking ID</p>
                    <p className="text-sm font-semibold">
                      {selectedBooking.bookingNumber}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Plan</p>
                    <p className="text-sm font-semibold">
                      {selectedBooking.plan.name}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Start Date</p>
                    <p className="text-sm font-semibold">
                      {formatDate(selectedBooking.startDate || "")}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">End Date</p>
                    <p className="text-sm font-semibold">
                      {formatDate(selectedBooking.endDate || "")}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Amount</p>
                    <p className="text-sm font-semibold">
                      {formatCurrency(selectedBooking.plan.price)}/
                      {selectedBooking.plan.tenure}{" "}
                      {selectedBooking.plan.tenureUnit}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">City</p>
                    <p className="text-sm font-semibold">
                      {selectedBooking.spaceSnapshot?.city}
                    </p>
                  </div>
                </div>

                {/* Documents */}
                {selectedBooking.documents &&
                  selectedBooking.documents.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Documents
                      </h3>
                      <div className="space-y-2">
                        {selectedBooking.documents.map((doc, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-gray-400" />
                              <span className="text-sm font-medium">
                                {doc.name}
                              </span>
                            </div>
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-yellow-600 hover:text-yellow-700 font-medium text-sm"
                            >
                              Download
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Auto Renew Toggle */}
                {selectedBooking.status === "active" && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Auto Renew</p>
                      <p className="text-sm text-gray-500">
                        Automatically renew before expiry
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handleToggleAutoRenew(
                          selectedBooking._id,
                          selectedBooking.autoRenew,
                        )
                      }
                      disabled={togglingAutoRenew === selectedBooking._id}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedBooking.autoRenew
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-600"
                        }`}
                    >
                      {togglingAutoRenew === selectedBooking._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : selectedBooking.autoRenew ? (
                        "Enabled"
                      ) : (
                        "Disabled"
                      )}
                    </button>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
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
                      {queryModalBooking.spaceSnapshot?.name} —{" "}
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
