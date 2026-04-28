import { useEffect, useMemo, useRef, useState } from "react";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Check,
  Clock,
  Loader2,
  Search,
  SlidersHorizontal,
  Users,
  XCircle,
} from "lucide-react";
import { AdminPageSkeleton } from "@/components/ui/skeleton-loaders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavItems";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { adminService, BookingData, UserData } from "@/services/admin.service";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";

const STATUS_OPTIONS: Array<{ value: BookingData["status"]; label: string }> = [
  { value: "pending_payment", label: "Pending Payment" },
  { value: "pending_kyc", label: "Pending KYC" },
  { value: "active", label: "Active" },
  { value: "expired", label: "Expired" },
  { value: "cancelled", label: "Cancelled" },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

const formatStatus = (status?: string) =>
  STATUS_OPTIONS.find((item) => item.value === status)?.label ||
  (status || "Unknown").replace(/_/g, " ");

const getPartnerId = (booking: BookingData) =>
  typeof booking.partner === "string" ? booking.partner : booking.partner?._id || "";

const getPartnerName = (booking: BookingData) =>
  typeof booking.partner === "object" && booking.partner?.fullName
    ? booking.partner.fullName
    : typeof booking.partner === "object" && booking.partner?.email
      ? booking.partner.email
      : "Unassigned partner";

const getBookingAmount = (booking: BookingData) =>
  Number(booking.amount || booking.plan?.price || 0);

const normalizePartnerList = (data: any): UserData[] => {
  const rawPartners = Array.isArray(data)
    ? data
    : Array.isArray(data?.partners)
      ? data.partners
      : Array.isArray(data?.users)
        ? data.users
        : [];

  const uniquePartners = new Map<string, UserData>();
  rawPartners.forEach((partner: any) => {
    const id = partner?._id || partner?.id;
    if (!id) return;
    uniquePartners.set(id, {
      ...partner,
      _id: id,
      fullName: partner.fullName || partner.name || partner.email || "Unnamed Partner",
    });
  });

  return Array.from(uniquePartners.values()).sort((a, b) =>
    String(a.fullName || a.email || "").localeCompare(String(b.fullName || b.email || "")),
  );
};

const getInitial = (name?: string) => (name?.trim()?.charAt(0) || "U").toUpperCase();

const formatBookingType = (type?: string) =>
  (type || "Booking")
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const statusBadgeClass: Record<BookingData["status"], string> = {
  pending_payment: "bg-amber-50 text-amber-700 border-amber-200",
  pending_kyc: "bg-blue-50 text-blue-700 border-blue-200",
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  expired: "bg-slate-100 text-slate-700 border-slate-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const ITEMS_PER_PAGE = 10;

export default function BookingManagement() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [partners, setPartners] = useState<UserData[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [partnerFilter, setPartnerFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [partnerMenuOpen, setPartnerMenuOpen] = useState(false);
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(null);
  const partnerMenuRef = useRef<HTMLDivElement | null>(null);

  const fetchBookings = async () => {
    try {
      const [response, partnersResponse] = await Promise.all([
        adminService.getAllBookings({
          limit: 1000,
          status: statusFilter === "all" ? undefined : statusFilter,
          partner: partnerFilter === "all" ? undefined : partnerFilter,
        }),
        partners.length
          ? Promise.resolve(null)
          : adminService.getPartnerUsers(),
      ]);

      if (response.success && response.data) {
        setBookings(response.data.bookings || []);
      } else {
        toast.error(response.message || "Failed to fetch bookings");
      }

      if (partnersResponse?.success && partnersResponse.data) {
        setPartners(normalizePartnerList(partnersResponse.data));
      }
    } catch (error) {
      console.error("Failed to fetch bookings", error);
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchBookings();
  }, [statusFilter, partnerFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, partnerFilter, searchQuery]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (
        partnerMenuRef.current &&
        !partnerMenuRef.current.contains(event.target as Node)
      ) {
        setPartnerMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const partnerOptions = useMemo(() => {
    const bookingPartnerMap = new Map<string, string>();
    bookings.forEach((booking) => {
      const id = getPartnerId(booking);
      if (id) bookingPartnerMap.set(id, getPartnerName(booking));
    });

    if (partners.length) {
      const partnerMap = new Map(
        partners.map((partner) => [
          partner._id || partner.id || "",
          partner.fullName || partner.email || "Unnamed Partner",
        ]),
      );
      bookingPartnerMap.forEach((name, id) => {
        if (!partnerMap.has(id)) partnerMap.set(id, name);
      });

      return Array.from(partnerMap.entries())
        .map(([id, name]) => ({ id, name }))
        .filter((partner) => partner.id && partner.name)
        .sort((a, b) => a.name.localeCompare(b.name));
    }

    return Array.from(bookingPartnerMap.entries()).map(([id, name]) => ({ id, name }));
  }, [bookings, partners]);

  const selectedPartnerName = useMemo(() => {
    if (partnerFilter === "all") return "All Partners";
    return (
      partnerOptions.find((partner) => partner.id === partnerFilter)?.name ||
      "Selected Partner"
    );
  }, [partnerFilter, partnerOptions]);

  const setSelectedPartner = (partnerId: string) => {
    setPartnerFilter(partnerId);
    setPartnerMenuOpen(false);
  };

  const filteredBookings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return bookings;

    return bookings.filter((booking) => {
      const searchable = [
        booking.bookingNumber,
        booking.user?.fullName,
        booking.user?.email,
        booking.spaceSnapshot?.name,
        booking.spaceSnapshot?.city,
        booking.plan?.name,
        getPartnerName(booking),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [bookings, searchQuery]);

  const metrics = useMemo(() => {
    const totalRevenue = filteredBookings.reduce(
      (sum, booking) => sum + getBookingAmount(booking),
      0,
    );

    return {
      total: filteredBookings.length,
      active: filteredBookings.filter((booking) => booking.status === "active").length,
      pending: filteredBookings.filter((booking) =>
        ["pending_payment", "pending_kyc"].includes(booking.status),
      ).length,
      revenue: totalRevenue,
    };
  }, [filteredBookings]);

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / ITEMS_PER_PAGE));
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBookings.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [currentPage, filteredBookings]);
  const visibleStart = filteredBookings.length
    ? (currentPage - 1) * ITEMS_PER_PAGE + 1
    : 0;
  const visibleEnd = Math.min(currentPage * ITEMS_PER_PAGE, filteredBookings.length);

  const updateStatus = async (
    bookingId: string,
    nextStatus: BookingData["status"],
  ) => {
    try {
      setUpdatingBookingId(bookingId);
      const response = await adminService.updateBookingStatus(bookingId, nextStatus);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to update booking status");
      }

      setBookings((current) =>
        current.map((booking) =>
          booking._id === bookingId ? { ...booking, status: nextStatus } : booking,
        ),
      );
      toast.success("Booking status updated");
    } catch (error: any) {
      toast.error(error.message || "Failed to update booking status");
    } finally {
      setUpdatingBookingId(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        portalName="FlashSpace Admin"
        portalDescription="Complete platform management"
        navItems={ADMIN_NAV_ITEMS}
      >
        <AdminPageSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      portalName="FlashSpace Admin"
      portalDescription="Complete platform management"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
          Booking <span className="text-primary italic">Management</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Centralized booking control for every client, partner, and space.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {[
          { label: "Total Bookings", value: metrics.total, icon: CalendarDays },
          { label: "Active Bookings", value: metrics.active, icon: CheckCircle2 },
          { label: "Pending Review", value: metrics.pending, icon: Clock },
          { label: "Booking Revenue", value: formatCurrency(metrics.revenue), icon: Building2 },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-border bg-background p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-3 text-2xl font-bold text-foreground">{item.value}</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                <item.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden">
        <div className="border-b border-border bg-muted/5 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">All Bookings</h2>
              <p className="text-xs font-medium text-muted-foreground mt-1">
                View, filter, and update booking status from one place.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search bookings..."
                  className="pl-9"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-11 rounded-xl border-[#DDE5DA] bg-white sm:w-44">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-[#DDE5DA]">
                  <SelectItem value="all" className="rounded-lg">All Status</SelectItem>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status.value} value={status.value} className="rounded-lg">
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="relative sm:w-56" ref={partnerMenuRef}>
                <button
                  type="button"
                  onClick={() => setPartnerMenuOpen((open) => !open)}
                  className="flex h-11 w-full items-center justify-between rounded-xl border border-[#DDE5DA] bg-white px-3 text-left text-sm font-medium text-foreground shadow-sm transition-colors hover:border-[#B8C6BD]"
                >
                  <span className="truncate">{selectedPartnerName}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                      partnerMenuOpen && "rotate-180",
                    )}
                  />
                </button>

                {partnerMenuOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] z-[9999] w-72 overflow-hidden rounded-xl border border-[#DDE5DA] bg-white shadow-xl">
                    <div className="border-b border-border px-3 py-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        Partners
                      </p>
                      <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                        {partnerOptions.length} available
                      </p>
                    </div>
                    <div className="max-h-80 overflow-y-auto overscroll-contain p-1">
                      <button
                        type="button"
                        onClick={() => setSelectedPartner("all")}
                        className={cn(
                          "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-[#F8FAF7]",
                          partnerFilter === "all" && "bg-[#FEF8C3] text-[#1F2E26]",
                        )}
                      >
                        All Partners
                        {partnerFilter === "all" && <Check className="h-4 w-4" />}
                      </button>

                      {partnerOptions.map((partner) => (
                        <button
                          type="button"
                          key={partner.id}
                          onClick={() => setSelectedPartner(partner.id)}
                          className={cn(
                            "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-[#F8FAF7]",
                            partnerFilter === partner.id && "bg-[#FEF8C3] text-[#1F2E26]",
                          )}
                        >
                          <span className="truncate">{partner.name}</span>
                          {partnerFilter === partner.id && <Check className="h-4 w-4 shrink-0" />}
                        </button>
                      ))}

                      {partnerOptions.length === 0 && (
                        <div className="px-3 py-8 text-center text-sm font-medium text-muted-foreground">
                          No partners found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px]">
            <thead>
              <tr className="border-b border-border bg-muted/10">
                <th className="w-[180px] px-5 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Booking
                </th>
                <th className="w-[270px] px-5 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Client
                </th>
                <th className="w-[260px] px-5 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Space / Partner
                </th>
                <th className="w-[210px] px-5 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Plan
                </th>
                <th className="w-[130px] px-5 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Amount
                </th>
                <th className="w-[130px] px-5 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Status
                </th>
                <th className="w-[180px] px-5 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Update Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedBookings.map((booking) => (
                <tr key={booking._id} className="align-top hover:bg-[#F8FAF7] transition-colors">
                  <td className="px-5 py-5">
                    <p className="inline-flex max-w-[150px] rounded-lg bg-[#F8FAF7] px-2.5 py-1 font-mono text-[11px] font-bold text-[#35503F]">
                      {booking.bookingNumber || booking._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="mt-2 text-[11px] leading-4 font-medium text-muted-foreground">
                      {booking.createdAt
                        ? format(new Date(booking.createdAt), "dd MMM yyyy, hh:mm aa")
                        : "No date"}
                    </p>
                  </td>
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#DDE5DA] bg-[#F8FAF7] text-xs font-bold text-[#35503F]">
                        {booking.user?.fullName ? getInitial(booking.user.fullName) : <Users className="h-4 w-4" />}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-foreground">
                          {booking.user?.fullName || "Guest User"}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {booking.user?.email || "No email"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-5">
                    <p className="line-clamp-2 text-sm font-bold leading-5 text-foreground">
                      {booking.spaceSnapshot?.name || "Unknown Space"}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                        {booking.spaceSnapshot?.city || "No city"}
                      </span>
                      <span className="rounded-md bg-[#EAF6EF] px-2 py-0.5 text-[11px] font-semibold text-[#35503F]">
                        {getPartnerName(booking)}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-5">
                    <p className="line-clamp-2 text-sm font-bold leading-5 text-foreground">
                      {booking.plan?.name || "Custom Plan"}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                        {formatBookingType(booking.type)}
                      </span>
                      <span className="rounded-md bg-[#FEF8C3] px-2 py-0.5 text-[11px] font-semibold text-[#1F2E26]">
                        {booking.plan?.tenure || "-"} {booking.plan?.tenureUnit || ""}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-5 text-right text-sm font-bold text-foreground">
                    {formatCurrency(getBookingAmount(booking))}
                  </td>
                  <td className="px-5 py-5">
                    <Badge
                      variant="outline"
                      className={cn(
                        "capitalize font-semibold",
                        statusBadgeClass[booking.status] || "bg-muted text-muted-foreground",
                      )}
                    >
                      {formatStatus(booking.status)}
                    </Badge>
                  </td>
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-2">
                      <Select
                        value={booking.status}
                        onValueChange={(value) =>
                          updateStatus(booking._id, value as BookingData["status"])
                        }
                        disabled={updatingBookingId === booking._id}
                      >
                        <SelectTrigger className="h-9 w-40 rounded-xl border-[#DDE5DA] bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-[#DDE5DA]">
                          {STATUS_OPTIONS.map((status) => (
                            <SelectItem
                              key={status.value}
                              value={status.value}
                              className="rounded-lg data-[state=checked]:bg-[#FEF8C3]"
                            >
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {updatingBookingId === booking._id && (
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center gap-3 text-muted-foreground">
                      {searchQuery || statusFilter !== "all" || partnerFilter !== "all" ? (
                        <SlidersHorizontal className="h-8 w-8" />
                      ) : (
                        <XCircle className="h-8 w-8" />
                      )}
                      <p className="text-sm font-semibold">No bookings found</p>
                      <p className="text-xs">
                        Try changing the status, partner, or search filter.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredBookings.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-border bg-muted/5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-medium text-muted-foreground">
              Showing <span className="font-bold text-foreground">{visibleStart}</span>-
              <span className="font-bold text-foreground">{visibleEnd}</span> of{" "}
              <span className="font-bold text-foreground">{filteredBookings.length}</span> bookings
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-lg px-4 text-xs font-semibold"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              >
                Previous
              </Button>
              <div className="flex h-9 min-w-20 items-center justify-center rounded-lg border border-border bg-background px-3 text-xs font-bold text-foreground">
                {currentPage} / {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-lg px-4 text-xs font-semibold"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
