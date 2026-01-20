import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userDashboardService, { Booking } from "@/services/userDashboard.service";
import {
  Building2,
  Briefcase,
  MapPin,
  Calendar,
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
} from "lucide-react";

// Type definitions
type BookingType = "virtual_office" | "coworking_space";
type BookingStatus = "active" | "expired" | "pending" | "pending_kyc" | "cancelled" | "pending_payment";

const MyBookings: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"all" | BookingType>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | BookingStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingAutoRenew, setTogglingAutoRenew] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userDashboardService.getBookings({
        type: activeTab === "all" ? undefined : activeTab,
        status: statusFilter === "all" ? undefined : statusFilter,
      });
      if (response.success && response.data) {
        setBookings(response.data);
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

  const handleToggleAutoRenew = async (bookingId: string, currentValue: boolean) => {
    setTogglingAutoRenew(bookingId);
    try {
      const response = await userDashboardService.toggleAutoRenew(bookingId, !currentValue);
      if (response.success) {
        setBookings((prev) =>
          prev.map((b) =>
            b._id === bookingId ? { ...b, autoRenew: !currentValue } : b
          )
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

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedBooking) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedBooking]);

  // Filter bookings client-side for search
  const filteredBookings = bookings.filter((b) => {
    const matchSearch =
      searchQuery === "" ||
      b.spaceSnapshot?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.spaceSnapshot?.city?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
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
        return { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2, label: "Active" };
      case "expired":
        return { bg: "bg-gray-100", text: "text-gray-600", icon: Clock, label: "Expired" };
      case "pending":
      case "pending_payment":
        return { bg: "bg-yellow-100", text: "text-yellow-700", icon: AlertCircle, label: "Payment Pending" };
      case "pending_kyc":
        return { bg: "bg-yellow-100", text: "text-yellow-700", icon: AlertCircle, label: "Pending KYC" };
      case "cancelled":
        return { bg: "bg-red-100", text: "text-red-700", icon: X, label: "Cancelled" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-600", icon: Clock, label: status };
    }
  };

  const calculateDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Stats
  const stats = {
    total: bookings.length,
    active: bookings.filter((b) => b.status === "active").length,
    virtualOffice: bookings.filter((b) => b.type === "virtual_office").length,
    coworking: bookings.filter((b) => b.type === "coworking_space").length,
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
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-[Poppins] text-gray-900">
              My <span className="text-yellow-500">Bookings</span>
            </h1>
            <p className="text-gray-500 mt-1">Manage your virtual offices and coworking spaces</p>
          </div>
          <a
            href="/services/virtual-office"
            className="inline-flex items-center gap-2 bg-yellow-400 text-black px-5 py-2.5 rounded-lg font-medium hover:bg-yellow-500 transition-colors"
          >
            <Building2 className="w-4 h-4" />
            Book New Space
          </a>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-500">Total Bookings</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            <p className="text-sm text-gray-500">Active</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-2xl font-bold text-yellow-600">{stats.virtualOffice}</p>
            <p className="text-sm text-gray-500">Virtual Offices</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-2xl font-bold text-blue-600">{stats.coworking}</p>
            <p className="text-sm text-gray-500">Coworking</p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Service Type Tabs */}
            <div className="flex gap-2">
              {[
                { id: "all", label: "All", icon: null },
                { id: "virtual_office", label: "Virtual Office", icon: Building2 },
                { id: "coworking_space", label: "Coworking", icon: Briefcase },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                    ? "bg-yellow-400 text-black"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  {tab.icon && <tab.icon className="w-4 h-4" />}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, ID, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Status
                <ChevronDown className="w-4 h-4" />
              </button>
              {showFilters && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[150px]">
                  {["all", "active", "pending", "expired", "cancelled"].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status as typeof statusFilter);
                        setShowFilters(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${statusFilter === status ? "bg-yellow-50 text-yellow-700" : ""
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

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No bookings found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery ? "Try adjusting your search or filters" : "Book your first workspace to get started"}
            </p>
            <a
              href="/services/virtual-office"
              className="inline-flex items-center gap-2 bg-yellow-400 text-black px-6 py-2.5 rounded-lg font-medium hover:bg-yellow-500 transition-colors"
            >
              Browse Spaces
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const statusConfig = getStatusConfig(booking.status);
              const daysRemaining = calculateDaysRemaining(booking.endDate || "");
              const isExpiring = booking.status === "active" && daysRemaining <= 30;

              return (
                <div
                  key={booking._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="md:w-48 h-32 md:h-auto relative">
                      <img
                        src={booking.spaceSnapshot?.images?.[0] || booking.spaceSnapshot?.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400"}
                        alt={booking.spaceSnapshot?.name || "Space"}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${booking.type === "virtual_office"
                            ? "bg-yellow-400 text-black"
                            : "bg-blue-500 text-white"
                            }`}
                        >
                          {booking.type === "virtual_office" ? "Virtual Office" : "Coworking"}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        {/* Left Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">{booking.spaceSnapshot?.name}</h3>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                              <statusConfig.icon className="w-3 h-3" />
                              {statusConfig.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                            <MapPin className="w-3.5 h-3.5" /> {booking.spaceSnapshot?.address}, {booking.spaceSnapshot?.city}
                          </p>

                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-3">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {formatDate(booking.startDate || "")} - {formatDate(booking.endDate || "")}
                            </span>
                            <span className="font-medium">Plan: {booking.plan.name}</span>
                            <span className="font-semibold text-gray-900">{formatCurrency(booking.plan.price)}/{booking.plan.tenure} {booking.plan.tenureUnit}</span>
                          </div>

                          {/* Features Pills */}
                          <div className="flex flex-wrap gap-2 mt-3">
                            {booking.plan.gstIncluded && (
                              <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">GST Included</span>
                            )}
                            {booking.autoRenew && (
                              <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">Auto Renew</span>
                            )}
                            {isExpiring && (
                              <span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-full flex items-center gap-1">
                                <RefreshCw className="w-3 h-3" /> Renews in {daysRemaining} days
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Right Actions */}
                        <div className="flex flex-row md:flex-col gap-2 md:items-end">
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                          >
                            <Eye className="w-4 h-4" /> View Details
                          </button>
                          {booking.status === "pending_kyc" && (
                            <button
                              onClick={() => navigate(`/dashboard/kyc-verification?linkBookingId=${booking._id}`)}
                              className="flex items-center gap-1.5 px-4 py-2 bg-yellow-400 text-black rounded-lg text-sm font-medium hover:bg-yellow-500 transition-colors"
                            >
                              <ShieldCheck className="w-4 h-4" /> Verify Now
                            </button>
                          )}
                          {booking.documents && booking.documents.length > 0 && (
                            <button className="flex items-center gap-1.5 px-4 py-2 bg-yellow-400 text-black rounded-lg text-sm font-medium hover:bg-yellow-500 transition-colors">
                              <Download className="w-4 h-4" /> Documents
                            </button>
                          )}
                          {booking.status === "active" && (
                            <button
                              onClick={() => handleToggleAutoRenew(booking._id, booking.autoRenew)}
                              disabled={togglingAutoRenew === booking._id}
                              className="flex items-center gap-1.5 px-4 py-2 border border-yellow-400 text-yellow-600 rounded-lg text-sm font-medium hover:bg-yellow-50 transition-colors disabled:opacity-50"
                            >
                              {togglingAutoRenew === booking._id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : booking.autoRenew ? (
                                <ToggleRight className="w-4 h-4" />
                              ) : (
                                <ToggleLeft className="w-4 h-4" />
                              )}
                              {booking.autoRenew ? "Auto Renew On" : "Auto Renew Off"}
                            </button>
                          )}
                        </div>
                      </div>
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
                  src={selectedBooking.spaceSnapshot?.images?.[0] || selectedBooking.spaceSnapshot?.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400"}
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
                    {selectedBooking.type === "virtual_office" ? "Virtual Office" : "Coworking"}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedBooking.spaceSnapshot?.name}</h2>
                    <p className="text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4" /> {selectedBooking.spaceSnapshot?.address}
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
                    <p className="text-sm font-semibold">{selectedBooking.bookingNumber}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Plan</p>
                    <p className="text-sm font-semibold">{selectedBooking.plan.name}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Start Date</p>
                    <p className="text-sm font-semibold">{formatDate(selectedBooking.startDate || "")}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">End Date</p>
                    <p className="text-sm font-semibold">{formatDate(selectedBooking.endDate || "")}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Amount</p>
                    <p className="text-sm font-semibold">{formatCurrency(selectedBooking.plan.price)}/{selectedBooking.plan.tenure} {selectedBooking.plan.tenureUnit}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">City</p>
                    <p className="text-sm font-semibold">{selectedBooking.spaceSnapshot?.city}</p>
                  </div>
                </div>

                {/* Documents */}
                {selectedBooking.documents && selectedBooking.documents.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Documents</h3>
                    <div className="space-y-2">
                      {selectedBooking.documents.map((doc, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <span className="text-sm font-medium">{doc.name}</span>
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
                      <p className="text-sm text-gray-500">Automatically renew before expiry</p>
                    </div>
                    <button
                      onClick={() => handleToggleAutoRenew(selectedBooking._id, selectedBooking.autoRenew)}
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
      </div>
    </div>
  );
};

export default MyBookings;
