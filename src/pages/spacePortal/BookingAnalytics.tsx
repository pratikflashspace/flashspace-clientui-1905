import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchBookingAnalytics, fetchAllPartnerSpaces } from "@/services/spacePortal/spacePartner.service";
import { getPropertyBookingsForPartner } from "@/services/property.service";
import { userDashboardService } from "@/services/userDashboard.service";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  CalendarCheck,
  XCircle,
  Clock,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  Building2,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  ReceiptText,
  UserRound,
  ExternalLink,
  Mail,
  Phone,
} from "lucide-react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type PartnerSpace = {
  _id?: string;
  id?: string;
  name?: string;
  city?: string;
  area?: string;
  address?: string;
  image?: string;
  images?: string[];
  status?: string;
  propertyStatus?: string;
  isActive?: boolean;
};

type PartnerBooking = {
  _id?: string;
  bookingNumber?: string;
  status?: string;
  createdAt?: string;
  startDate?: string;
  endDate?: string;
  totalAmount?: number;
  spaceId?: string;
  type?: string;
  plan?: {
    name?: string;
    price?: number;
    finalPrice?: number;
    tenure?: number;
    tenureUnit?: string;
  };
  spaceSnapshot?: {
    _id?: string;
    name?: string;
    address?: string;
    city?: string;
    image?: string;
  };
  user?: {
    _id?: string;
    id?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    phoneNumber?: string;
    company?: string;
  } | string | null;
  userId?: string;
  clientUserId?: string;
  clientCompanyName?: string;
  clientEmail?: string;
  clientPhone?: string;
  daysRemaining?: number;
};

type SpaceRollup = PartnerSpace & {
  bookings: PartnerBooking[];
  totalRevenue: number;
  activeClients: number;
  activeBookings: number;
  cancelledBookings: number;
  pendingBookings: number;
  latestBooking?: PartnerBooking | null;
};

type PartnerClientBookingRow = {
  bookingId?: string;
  bookingNumber?: string;
  userId?: string;
  companyName?: string;
  contactName?: string;
  email?: string;
  phone?: string;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatDate = (value?: string) => {
  if (!value) return "N/A";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "N/A";
  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const toSpaceId = (space: PartnerSpace) =>
  String(space?._id || space?.id || "").trim();

const toBookingAmount = (booking: PartnerBooking) =>
  Number(booking?.totalAmount ?? booking?.plan?.finalPrice ?? booking?.plan?.price ?? 0);

const getClientId = (booking: PartnerBooking) =>
  String(
    booking?.clientUserId ||
      booking?.userId ||
      (typeof booking?.user === "object" ? booking?.user?._id || booking?.user?.id : booking?.user) ||
      "",
  ).trim();

const getClientName = (booking: PartnerBooking) =>
  booking?.clientCompanyName ||
  (typeof booking?.user === "object" && booking?.user
    ? booking.user.fullName || booking.user.company || booking.user.email
    : "") ||
  "Client";

const getClientEmail = (booking: PartnerBooking) =>
  booking?.clientEmail ||
  (typeof booking?.user === "object" && booking?.user ? booking.user.email : "") ||
  "";

const getClientPhone = (booking: PartnerBooking) =>
  booking?.clientPhone ||
  (typeof booking?.user === "object" && booking?.user ? booking.user.phone || booking.user.phoneNumber : "") ||
  "";

const getBookingStatus = (booking: PartnerBooking) =>
  String(booking?.status || "unknown").toLowerCase();

const isActiveBooking = (booking: PartnerBooking) =>
  ["active", "confirmed"].includes(getBookingStatus(booking));

const isCancelledBooking = (booking: PartnerBooking) =>
  ["cancelled", "canceled"].includes(getBookingStatus(booking));

const isPendingBooking = (booking: PartnerBooking) =>
  ["pending", "pending_payment", "pending_kyc"].includes(getBookingStatus(booking));

const extractSpaces = (response: any): PartnerSpace[] => {
  const payload = response?.data ?? response;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.spaces)) return payload.data.spaces;
  if (Array.isArray(payload?.data?.properties)) return payload.data.properties;
  if (Array.isArray(payload?.spaces)) return payload.spaces;
  if (Array.isArray(payload?.properties)) return payload.properties;
  return [];
};

export default function BookingAnalytics() {
  const navigate = useNavigate();
  const { propertyId } = useParams<{ propertyId?: string }>();
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#space-bookings") {
      const element = document.getElementById("space-bookings");
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 500); // Wait for data to likely be rendered
      }
    }
  }, [location]);

  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useQuery({
    queryKey: ["partner-booking-analytics"],
    queryFn: fetchBookingAnalytics,
  });

  const { data: partnerClientBookings } = useQuery({
    queryKey: ["partner-client-bookings"],
    queryFn: async () => {
      const response = await userDashboardService.getPartnerClientBookings();
      return response.success && Array.isArray(response.data) ? response.data : [];
    },
  });

  const [spaces, setSpaces] = useState<PartnerSpace[]>([]);
  const [spaceBookings, setSpaceBookings] = useState<Record<string, PartnerBooking[]>>({});
  const [spacesLoading, setSpacesLoading] = useState(true);
  const [spacesError, setSpacesError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    const loadSpacesAndBookings = async () => {
      setSpacesLoading(true);
      setSpacesError(null);

      try {
        const response = await fetchAllPartnerSpaces();
        const rawSpaces = extractSpaces(response);

        const bookingPairs = await Promise.all(
          rawSpaces.map(async (space) => {
            const id = toSpaceId(space);
            if (!id) return null;

            try {
              const bookings = await getPropertyBookingsForPartner(id);
              return [id, Array.isArray(bookings) ? bookings : []] as const;
            } catch (error) {
              console.error("Failed to load bookings for space", id, error);
              return [id, []] as const;
            }
          }),
        );

        if (!alive) return;

        setSpaces(rawSpaces);
        setSpaceBookings(Object.fromEntries(bookingPairs.filter(Boolean) as Array<
          readonly [string, PartnerBooking[]]
        >));
      } catch (error) {
        console.error("Failed to load partner spaces", error);
        if (!alive) return;
        setSpacesError("Failed to load spaces.");
        setSpaces([]);
        setSpaceBookings({});
      } finally {
        if (alive) setSpacesLoading(false);
      }
    };

    loadSpacesAndBookings();

    return () => {
      alive = false;
    };
  }, []);

  // Pagination for Client Bookings Table
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const analytics = analyticsData?.data;

  const bookingClientLookup = useMemo(() => {
    const rows = Array.isArray(partnerClientBookings)
      ? (partnerClientBookings as PartnerClientBookingRow[])
      : [];

    return rows.reduce<Record<string, PartnerClientBookingRow>>((acc, row) => {
      const keys = [row.bookingId, row.bookingNumber].map((value) => String(value || "").trim());
      keys.filter(Boolean).forEach((key) => {
        acc[key] = row;
      });
      return acc;
    }, {});
  }, [partnerClientBookings]);

  const resolveClientId = (booking: PartnerBooking) => {
    const directId = getClientId(booking);
    if (directId) return directId;

    const fallback =
      bookingClientLookup[String(booking._id || "").trim()] ||
      bookingClientLookup[String(booking.bookingNumber || "").trim()];

    return String(fallback?.userId || "").trim();
  };

  const resolveClientName = (booking: PartnerBooking) => {
    const directName = getClientName(booking);
    if (directName !== "Client") return directName;

    const fallback =
      bookingClientLookup[String(booking._id || "").trim()] ||
      bookingClientLookup[String(booking.bookingNumber || "").trim()];

    return fallback?.companyName || fallback?.contactName || fallback?.email || directName;
  };

  const resolveClientEmail = (booking: PartnerBooking) => {
    const fallback =
      bookingClientLookup[String(booking._id || "").trim()] ||
      bookingClientLookup[String(booking.bookingNumber || "").trim()];

    return booking?.clientEmail || fallback?.email || getClientEmail(booking);
  };

  const resolveClientPhone = (booking: PartnerBooking) => {
    const fallback =
      bookingClientLookup[String(booking._id || "").trim()] ||
      bookingClientLookup[String(booking.bookingNumber || "").trim()];

    return booking?.clientPhone || fallback?.phone || getClientPhone(booking);
  };

  const growth = useMemo(() => {
    if (!analytics?.summary?.revenueLastMonth) return 0;
    return (
      ((analytics.summary.revenueThisMonth - analytics.summary.revenueLastMonth) /
        analytics.summary.revenueLastMonth) *
      100
    );
  }, [analytics]);

  const rollups = useMemo<SpaceRollup[]>(() => {
    return spaces.map((space) => {
      const id = toSpaceId(space);
      const bookings = spaceBookings[id] || [];
      const activeClients = new Set(
        bookings
          .filter(isActiveBooking)
          .map(resolveClientId)
          .filter(Boolean),
      ).size;

      const totalRevenue = bookings.reduce(
        (sum, booking) => sum + toBookingAmount(booking),
        0,
      );

      const activeBookings = bookings.filter(isActiveBooking).length;
      const cancelledBookings = bookings.filter(isCancelledBooking).length;
      const pendingBookings = bookings.filter(isPendingBooking).length;

      return {
        ...space,
        bookings,
        totalRevenue,
        activeClients,
        activeBookings,
        cancelledBookings,
        pendingBookings,
        latestBooking: bookings[0] || null,
      };
    });
  }, [spaces, spaceBookings, bookingClientLookup]);

  const selectedSpace = useMemo(() => {
    if (!propertyId) return null;
    return rollups.find((space) => toSpaceId(space) === propertyId) || null;
  }, [propertyId, rollups]);

  const selectedBookings = selectedSpace?.bookings || [];

  const selectedSummary = useMemo(() => {
    const totalBookings = selectedBookings.length;
    const activeClients = new Set(
      selectedBookings
        .filter(isActiveBooking)
        .map(resolveClientId)
        .filter(Boolean),
    ).size;
    const cancelledBookings = selectedBookings.filter(isCancelledBooking).length;
    const revenue = selectedBookings.reduce(
      (sum, booking) => sum + toBookingAmount(booking),
      0,
    );

    return {
      totalBookings,
      activeClients,
      cancelledBookings,
      revenue,
    };
  }, [selectedBookings, bookingClientLookup]);

  const totalPages = Math.ceil(selectedBookings.length / itemsPerPage);
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return selectedBookings.slice(startIndex, startIndex + itemsPerPage);
  }, [selectedBookings, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [propertyId]);

  if (analyticsLoading || spacesLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl bg-white/50" />
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Skeleton className="xl:col-span-2 h-[450px] w-full rounded-2xl bg-white/50" />
          <Skeleton className="h-[450px] w-full rounded-2xl bg-white/50" />
        </div>
      </div>
    );
  }

  if (analyticsError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-background border border-border rounded-2xl p-12">
        <AlertCircle size={48} className="mb-4 text-rose-500 opacity-50" />
        <h2 className="text-xl font-bold text-foreground">
          Analytics Unavailable
        </h2>
        <p className="mt-2 text-sm text-muted-foreground text-center max-w-xs">
          We are having trouble reaching the analytics engine. Please refresh or
          try again later.
        </p>
      </div>
    );
  }

  if (propertyId) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <button
          onClick={() => navigate("/spaceportal/booking-analytics")}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted/40 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Analytics
        </button>

        {!selectedSpace ? (
          <div className="rounded-2xl border border-border bg-background p-10 text-center">
            <Building2 className="mx-auto mb-4 h-14 w-14 text-muted-foreground/60" />
            <h2 className="text-2xl font-bold text-foreground">
              Space not found
            </h2>
            <p className="mt-2 text-muted-foreground">
              We could not find this space in your partner account.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8 rounded-3xl border border-border bg-background p-6 shadow-sm">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-5">
                  <div className="h-20 w-20 overflow-hidden rounded-2xl border border-border bg-muted">
                    <img
                      src={
                        selectedSpace.image ||
                        selectedSpace.images?.[0] ||
                        "/hero-illustrated.jpg"
                      }
                      alt={selectedSpace.name || "Space"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                      Booking Drilldown
                    </p>
                    <h1 className="mt-1 text-3xl font-extrabold text-foreground">
                      {selectedSpace.name || "Space"}
                    </h1>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {[selectedSpace.city, selectedSpace.area]
                          .filter(Boolean)
                          .join(" - ") || selectedSpace.address || "Unknown location"}
                      </span>
                      <Badge
                        variant="outline"
                        className="border-primary/20 bg-primary/5 text-primary"
                      >
                        {String(selectedSpace.status || "active").toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                  <MetricCard
                    label="Total Bookings"
                    value={selectedSummary.totalBookings}
                    icon={CalendarCheck}
                  />
                  <MetricCard
                    label="Active Clients"
                    value={selectedSummary.activeClients}
                    icon={Users}
                  />
                  <MetricCard
                    label="Cancelled"
                    value={selectedSummary.cancelledBookings}
                    icon={XCircle}
                  />
                  <MetricCard
                    label="Revenue"
                    value={formatCurrency(selectedSummary.revenue)}
                    icon={ReceiptText}
                    isCurrency
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 rounded-3xl border border-border bg-background p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-foreground uppercase tracking-wider opacity-70">
                      Client Bookings
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Every booking linked to this space, with client details.
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="font-bold text-xs uppercase bg-primary/5 text-primary border-primary/20 px-3 py-1"
                  >
                    {selectedBookings.length} Records
                  </Badge>
                </div>

                <div className="mt-6 overflow-x-auto custom-scrollbar">
                  <table className="w-full min-w-[1000px] border-collapse text-left text-base">
                    <thead className="bg-[#F8FAF7]">
                      <tr className="border-b border-border text-muted-foreground uppercase tracking-widest text-[11px] font-black">
                        <th className="p-5">Booking ID</th>
                        <th className="p-5">Client Information</th>
                        <th className="p-5">Plan</th>
                        <th className="p-5">Start Date</th>
                        <th className="p-5">Status</th>
                        <th className="p-5 text-right">Revenue</th>
                        <th className="p-5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EEF1EC]">
                      {paginatedBookings.map((booking) => {
                        const clientId = resolveClientId(booking);
                        const clientName = resolveClientName(booking);
                        const clientEmail = resolveClientEmail(booking);
                        const clientPhone = resolveClientPhone(booking);
                        const amount = toBookingAmount(booking);
                        const status = getBookingStatus(booking);

                        return (
                          <tr
                            key={booking._id || booking.bookingNumber}
                            className="hover:bg-[#F8FAF7] transition-colors group"
                          >
                            <td className="p-5 whitespace-nowrap">
                              <span className="font-mono text-xs font-bold text-primary px-3 py-1.5 bg-[#EAF6EF] rounded-xl border border-primary/10">
                                {booking.bookingNumber || (booking._id ? booking._id.slice(-8).toUpperCase() : "FS-B-NEW")}
                              </span>
                            </td>
                            <td className="p-5">
                              <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/5 text-primary border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all">
                                  <UserRound className="h-5 w-5" />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-extrabold text-[#10251A] truncate text-base">
                                    {clientName}
                                  </p>
                                  <div className="flex flex-col gap-0.5 mt-1">
                                    {clientEmail && (
                                      <div className="flex items-center gap-1.5 text-xs font-medium text-[#607067]">
                                        <Mail className="h-3 w-3" />
                                        <span className="truncate">{clientEmail}</span>
                                      </div>
                                    )}
                                    {clientPhone && (
                                      <div className="flex items-center gap-1.5 text-xs font-medium text-[#607067]">
                                        <Phone className="h-3 w-3" />
                                        <span className="truncate">{clientPhone}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-5">
                              <p className="font-bold text-[#10251A] text-sm">{booking.plan?.name || "Premium Plan"}</p>
                              <p className="text-[10px] text-[#607067] font-bold uppercase mt-0.5">
                                {booking.plan?.tenure} {booking.plan?.tenureUnit} Subscription
                              </p>
                            </td>
                            <td className="p-5 whitespace-nowrap">
                              <div className="flex flex-col">
                                <span className="font-bold text-[#10251A] text-sm">{formatDate(booking.startDate || booking.createdAt)}</span>
                                <span className="text-[10px] text-[#607067] font-bold uppercase">Booking Date</span>
                              </div>
                            </td>
                            <td className="p-5">
                              <BookingBadge status={status} />
                            </td>
                            <td className="p-5 text-right">
                              <p className="font-black text-[#10251A] text-lg">{formatCurrency(amount)}</p>
                              <p className="text-[10px] text-emerald-600 font-bold uppercase">Total Value</p>
                            </td>
                            <td className="p-5 text-right">
                              {(() => {
                                const params = new URLSearchParams();
                                if (booking.bookingNumber) {
                                  params.set("bookingNumber", booking.bookingNumber);
                                }
                                if (clientId) {
                                  params.set("clientId", clientId);
                                }
                                const clientsRoute = params.toString()
                                  ? `/spaceportal/clients?${params.toString()}`
                                  : "/spaceportal/clients";

                                return (
                                  <button
                                    onClick={() => navigate(clientsRoute)}
                                    className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-white px-4 py-2.5 text-xs font-black text-primary hover:bg-primary hover:text-white hover:shadow-md transition-all whitespace-nowrap"
                                  >
                                    View Client
                                    <ExternalLink className="h-3.5 w-3.5" />
                                  </button>
                                );
                              })()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Pagination Controls */}
                  {selectedBookings.length > itemsPerPage && (
                    <div className="p-6 border-t border-[#EEF1EC] flex flex-col items-center gap-4 bg-[#F8FAF7] pb-8">
                      <p className="text-xs font-bold text-[#677E73] order-2 sm:order-1">
                        Showing <span className="text-[#10251A]">{Math.min((currentPage - 1) * itemsPerPage + 1, selectedBookings.length)}</span> to <span className="text-[#10251A]">{Math.min(currentPage * itemsPerPage, selectedBookings.length)}</span> of <span className="text-[#10251A]">{selectedBookings.length}</span> entries
                      </p>
                      <div className="flex items-center gap-2 order-1 sm:order-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="font-bold rounded-xl border-[#DDE5DA] bg-white h-9 px-4 hover:bg-[#F8FAF7]"
                        >
                          <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                        </Button>
                        <div className="flex items-center gap-1.5">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              className={`w-9 h-9 p-0 rounded-xl font-bold transition-all ${currentPage === page ? 'shadow-md bg-[#2D3F33] text-[#FEF8C5]' : 'border-[#DDE5DA] bg-white hover:bg-[#F8FAF7]'}`}
                            >
                              {page}
                            </Button>
                          )).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="font-bold rounded-xl border-[#DDE5DA] bg-white h-9 px-4 hover:bg-[#F8FAF7]"
                        >
                          Next <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {selectedBookings.length === 0 && (
                    <div className="py-16 text-center">
                      <CalendarDays className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                      <h3 className="text-lg font-bold text-foreground">
                        No bookings yet
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        This space has no bookings to show right now.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-background p-6 shadow-sm">
                <h2 className="text-lg font-bold text-foreground uppercase tracking-wider opacity-70">
                  Space Snapshot
                </h2>
                <div className="mt-6 space-y-4">
                  <SnapshotRow label="City" value={selectedSpace.city || "N/A"} />
                  <SnapshotRow label="Area" value={selectedSpace.area || "N/A"} />
                  <SnapshotRow
                    label="Address"
                    value={selectedSpace.address || "N/A"}
                  />
                  <SnapshotRow
                    label="Latest Booking"
                    value={
                      selectedSpace.latestBooking
                        ? formatDate(
                            selectedSpace.latestBooking.startDate ||
                              selectedSpace.latestBooking.createdAt,
                          )
                        : "N/A"
                    }
                  />
                  <SnapshotRow
                    label="Revenue"
                    value={formatCurrency(selectedSpace.totalRevenue)}
                  />
                </div>

                <div className="mt-8 rounded-2xl border border-border bg-muted/20 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Recent Clients
                  </p>
                  <div className="mt-4 space-y-3">
                    {selectedBookings.slice(0, 4).map((booking) => (
                      <div
                        key={booking._id || booking.bookingNumber}
                        className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-3 py-3"
                      >
                        <div>
                          <p className="font-semibold text-foreground">
                            {getClientName(booking)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {booking.bookingNumber || booking._id}
                          </p>
                        </div>
                        <Badge variant="secondary" className="capitalize">
                          {getBookingStatus(booking).replace(/_/g, " ")}
                        </Badge>
                      </div>
                    ))}
                    {selectedBookings.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No client data available.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8">
        <h1 className="text-3xl md:text-3xl font-extrabold tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
          <span className="text-gray-900 dark:text-white">Booking</span> <span className="text-[#36503F] italic">Analytics</span>
        
        </h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive breakdown of your revenue, bookings, and space
          performance.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <AnalyticsStat
          title="Total Bookings"
          value={analytics?.summary?.totalBookings || 0}
          icon={CalendarCheck}
        />
        <AnalyticsStat
          title="Active Clients"
          value={analytics?.summary?.activeClients || 0}
          icon={Users}
        />
        <AnalyticsStat
          title="Cancelled"
          value={analytics?.summary?.cancelledBookings || 0}
          icon={XCircle}
          color="text-rose-600"
        />
        <AnalyticsStat
          title="Pending"
          value={analytics?.summary?.pendingRequests || 0}
          icon={Clock}
          color="text-amber-600"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10">
        <div className="xl:col-span-2 bg-background border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-foreground uppercase tracking-wider opacity-70">
                Revenue Trend
              </h2>
              <p className="text-sm text-muted-foreground">
                Monthly performance monitoring
              </p>
            </div>
            <Badge
              variant="outline"
              className="font-bold text-xs uppercase bg-primary/5 text-primary border-primary/20 px-3 py-1"
            >
              Current Year
            </Badge>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.revenueTrend || []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3FA69E" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3FA69E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(0,0,0,0.05)"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fontWeight: 700, fill: "currentColor" }}
                  className="text-muted-foreground"
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fontWeight: 700, fill: "currentColor" }}
                  className="text-muted-foreground"
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value: number) => [formatCurrency(value), "Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3FA69E"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-background border border-border rounded-2xl p-5 shadow-sm flex flex-col h-fit">
          <h2 className="text-sm font-black text-foreground uppercase tracking-widest opacity-60 mb-4">
            Revenue Summary
          </h2>

          <div className="space-y-5 flex-1">
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">
                Current Month
              </p>
              <p className="text-2xl font-black text-[#10251A] tracking-tight">
                {formatCurrency(analytics?.summary?.revenueThisMonth)}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">
                Previous Month
              </p>
              <p className="text-lg font-extrabold text-muted-foreground opacity-50">
                {formatCurrency(analytics?.summary?.revenueLastMonth)}
              </p>
            </div>

            <div
              className={`p-3.5 rounded-xl flex items-center justify-between ${growth >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
            >
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className={growth < 0 ? "rotate-180" : ""} />
                <span className="font-black text-sm uppercase tracking-tight">Growth Rate</span>
              </div>
              <span className="text-xl font-black">{growth.toFixed(1)}%</span>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-border space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-black text-muted-foreground uppercase tracking-tight">
                Avg. Order Value
              </span>
              <span className="font-black text-[#10251A]">₹4,250</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-black text-muted-foreground uppercase tracking-tight">
                Target Progress
              </span>
              <span className="font-black text-emerald-600">84%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <DivisionCard
          title="Plan Analytics"
          subtitle="Revenue distribution by plan type"
          items={(analytics?.planDivision || []).map((plan: any) => ({
            key: plan.plan,
            name: plan.plan,
            bookings: plan.bookings,
            revenue: plan.revenue,
          }))}
          formatCurrency={formatCurrency}
        />

        <DivisionCard
          title="Location Analytics"
          subtitle="Performance breakdown by space"
          items={(analytics?.spaceDivision || []).map((space: any) => ({
            key: space.space,
            name: space.space,
            bookings: space.bookings,
            revenue: space.revenue,
          }))}
          formatCurrency={formatCurrency}
        />
      </div>

      <div id="space-bookings" className="mb-10 rounded-3xl border border-border bg-background p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Space-wise Bookings
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Click a space to open the full booking and client view.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4" />
            {rollups.length} linked spaces
          </div>
        </div>

        {spacesError ? (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-700">
            {spacesError}
          </div>
        ) : rollups.length === 0 ? (
          <div className="mt-8 py-16 text-center">
            <Building2 className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-lg font-bold text-foreground">
              No linked spaces found
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Add a space in My Spaces and it will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
            {rollups.map((space) => (
              <button
                key={toSpaceId(space)}
                onClick={() =>
                  navigate(`/spaceportal/booking-analytics/${toSpaceId(space)}`)
                }
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-background p-5 text-left transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-muted ring-1 ring-border/60">
                    <img
                      src={space.image || space.images?.[0] || "/hero-illustrated.jpg"}
                      alt={space.name || "Space"}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2">
                      <div className="min-w-0">
                        <h3 className="truncate text-[17px] font-bold leading-6 text-foreground">
                          {space.name || "Space"}
                        </h3>
                        <p className="mt-1 flex items-start gap-1.5 text-sm leading-5 text-muted-foreground">
                          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          <span className="line-clamp-2">
                            {[space.city, space.area].filter(Boolean).join(" - ") ||
                              space.address ||
                              "Unknown location"}
                          </span>
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="w-fit shrink-0 whitespace-nowrap border-primary/20 bg-primary/5 text-primary"
                      >
                        {String(space.status || "active").toUpperCase()}
                      </Badge>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2.5 min-w-0">
                      <div className="rounded-2xl border border-border bg-muted/20 px-3 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Bookings
                        </p>
                        <p className="mt-1 text-2xl font-black leading-none text-foreground">
                          {space.bookings.length}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-border bg-muted/20 px-3 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Clients
                        </p>
                        <p className="mt-1 text-2xl font-black leading-none text-foreground">
                          {space.activeClients}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-border bg-muted/20 px-3 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Revenue
                        </p>
                        <p className="mt-1 truncate text-lg font-black leading-tight text-foreground">
                          {formatCurrency(space.totalRevenue)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-1 flex-col justify-between gap-4 border-t border-border/60 pt-4">
                  <div className="flex flex-wrap gap-2">
                    {space.bookings.slice(0, 2).map((booking) => (
                      <span
                        key={booking._id || booking.bookingNumber}
                        className="inline-flex max-w-full items-center gap-1 rounded-full bg-muted/40 px-3 py-1 text-xs font-semibold text-muted-foreground"
                      >
                        <UserRound className="h-3 w-3 shrink-0" />
                        <span className="truncate">{getClientName(booking)}</span>
                      </span>
                    ))}
                    {space.bookings.length === 0 && (
                      <span className="text-xs text-muted-foreground">
                        No bookings yet
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">
                      {space.activeBookings} active bookings
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-primary">
                      View bookings
                      <ExternalLink className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AnalyticsStat({
  title,
  value,
  icon: Icon,
  trend,
  isUp,
  color = "text-primary",
}: any) {
  return (
    <div className="bg-background border border-border rounded-2xl p-6 shadow-sm hover:translate-y-[-2px] transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-xl bg-muted/50">
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
        {title}
      </p>
      <p className="text-3xl font-extrabold text-foreground tracking-tight">
        {value}
      </p>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
  isCurrency = false,
}: {
  label: string;
  value: string | number;
  icon: any;
  isCurrency?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-muted/20 p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <p className={`mt-2 font-extrabold ${isCurrency ? "text-xl" : "text-2xl"} text-foreground`}>
        {value}
      </p>
    </div>
  );
}

function SnapshotRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-muted/10 p-4">
      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="text-right text-sm font-semibold text-foreground">
        {value}
      </span>
    </div>
  );
}

function DivisionCard({ title, subtitle, items, formatCurrency }: any) {
  return (
    <div className="bg-background border border-border rounded-2xl p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-foreground uppercase tracking-wider opacity-70">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <div className="space-y-3">
        {items.map((item: any) => (
          <div
            key={item.key}
            className="group flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="h-10 w-10 rounded-lg bg-background border border-border flex items-center justify-center font-bold text-primary group-hover:scale-110 transition-transform">
                {item.name?.[0] || "S"}
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-foreground truncate">
                  {item.name}
                </p>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-background text-[10px] font-bold px-1.5 py-0 h-4"
                  >
                    {item.bookings} Bookings
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-extrabold text-foreground">
                {formatCurrency(item.revenue)}
              </p>
              <div className="w-24 h-1 bg-muted rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-primary" style={{ width: "70%" }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BookingBadge({ status }: { status: string }) {
  const normalized = String(status || "unknown").toLowerCase();
  const styles: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-100",
    confirmed: "bg-emerald-50 text-emerald-700 border-emerald-100",
    cancelled: "bg-rose-50 text-rose-700 border-rose-100",
    canceled: "bg-rose-50 text-rose-700 border-rose-100",
    pending: "bg-amber-50 text-amber-700 border-amber-100",
    pending_payment: "bg-amber-50 text-amber-700 border-amber-100",
    pending_kyc: "bg-amber-50 text-amber-700 border-amber-100",
  };

  return (
    <Badge
      variant="outline"
      className={`capitalize font-semibold ${styles[normalized] || "bg-muted text-muted-foreground border-border"}`}
    >
      {normalized.replace(/_/g, " ")}
    </Badge>
  );
}
