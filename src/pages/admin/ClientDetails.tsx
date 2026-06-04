import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavItems";
import { AdminPageSkeleton } from "@/components/ui/skeleton-loaders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { adminService } from "@/services/admin.service";
import type { AdminClientBookingItem } from "@/services/admin.service";
import { getUploadedFileUrl } from "@/utils/fileUrl";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

const formatDate = (date: string | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getClientStatusBadge = (status: "Active" | "At Risk" | "Churned") => {
  if (status === "Active") {
    return (
      <Badge className="rounded-full bg-emerald-50 px-4 py-1 text-emerald-700 hover:bg-emerald-50">
        Active
      </Badge>
    );
  }

  if (status === "At Risk") {
    return (
      <Badge className="rounded-full bg-amber-50 px-4 py-1 text-amber-700 hover:bg-amber-50">
        At Risk
      </Badge>
    );
  }

  return (
    <Badge className="rounded-full px-4 py-1" variant="secondary">
      Churned
    </Badge>
  );
};

const getBookingStatusBadge = (status: string) => {
  if (status === "active") {
    return (
      <Badge className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 hover:bg-emerald-50">
        Active
      </Badge>
    );
  }

  if (status === "pending_payment" || status === "pending_kyc") {
    return (
      <Badge className="rounded-full bg-amber-50 px-3 py-1 text-amber-700 hover:bg-amber-50">
        {status === "pending_payment" ? "Pending Payment" : "Pending KYC"}
      </Badge>
    );
  }

  if (status === "expired") {
    return (
      <Badge className="rounded-full px-3 py-1" variant="outline">
        Expired
      </Badge>
    );
  }

  if (status === "cancelled") {
    return (
      <Badge className="rounded-full px-3 py-1" variant="secondary">
        Cancelled
      </Badge>
    );
  }

  return (
    <Badge className="rounded-full px-3 py-1" variant="outline">
      {status}
    </Badge>
  );
};

const InfoItem = ({ label, value }: { label: string; value: string | number }) => (
  <div>
    <p className="text-[11px] font-bold uppercase tracking-wide text-[#7B8A82]">
      {label}
    </p>
    <p className="mt-1 break-words text-sm font-semibold text-[#10231B]">
      {value || "-"}
    </p>
  </div>
);

const BookingRow = ({ booking }: { booking: AdminClientBookingItem }) => (
  <article className="grid gap-4 px-5 py-4 transition-colors hover:bg-[#F8FAF7] lg:grid-cols-[minmax(145px,0.9fr)_minmax(220px,1.25fr)_minmax(170px,0.9fr)_minmax(110px,0.65fr)_minmax(110px,0.65fr)_minmax(110px,0.55fr)] lg:items-center">
    <div className="min-w-0">
      <p className="truncate font-mono text-xs font-bold text-[#123025]">
        {booking.bookingNumber}
      </p>
      <p className="mt-2 text-xs text-[#597064]">{formatDate(booking.createdAt)}</p>
    </div>

    <div className="min-w-0">
      <p className="truncate text-base font-extrabold text-[#10231B]">{booking.spaceName}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {booking.spaceCity && (
          <span className="rounded-full bg-[#F0F5F1] px-3 py-1 text-xs font-medium text-[#496558]">
            {booking.spaceCity}
          </span>
        )}
        <span className="rounded-full bg-[#F0F5F1] px-3 py-1 text-xs font-medium text-[#496558]">
          {booking.type}
        </span>
      </div>
    </div>

    <div className="min-w-0">
      <p className="text-sm font-bold text-[#10231B]">{booking.planName}</p>
      {booking.planTenure && (
        <p className="mt-2 inline-flex rounded-full bg-[#FFF5BF] px-3 py-1 text-xs font-semibold text-[#574700]">
          {booking.planTenure}
        </p>
      )}
    </div>

    <div>
      <p className="text-[11px] font-bold uppercase tracking-wide text-[#7B8A82] lg:hidden">
        Amount
      </p>
      <p className="font-bold text-[#10231B]">{formatCurrency(booking.amount)}</p>
    </div>

    <div>
      <p className="text-[11px] font-bold uppercase tracking-wide text-[#7B8A82] lg:hidden">
        Valid Till
      </p>
      <p className="text-sm font-medium text-[#496558]">{formatDate(booking.endDate)}</p>
    </div>

    <div className="lg:text-right">{getBookingStatusBadge(booking.status)}</div>
  </article>
);

const ClientDetails = () => {
  const { id: clientId } = useParams();
  const navigate = useNavigate();

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ["admin-client-details", clientId],
    queryFn: async () => adminService.getClientDetails(clientId || ""),
    enabled: Boolean(clientId),
  });

  if (isLoading) {
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

  if (isError || !response?.success || !response.data?.client) {
    return (
      <DashboardLayout
        portalName="FlashSpace Admin"
        portalDescription="Complete platform management"
        navItems={ADMIN_NAV_ITEMS}
      >
        <div className="mx-auto max-w-3xl space-y-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-foreground">Client not found</h1>
          <p className="text-[#6B7280]">
            This client does not exist or you do not have access to view the details.
          </p>
          <Button onClick={() => navigate("/admin/clients")}>Back to Client Management</Button>
        </div>
      </DashboardLayout>
    );
  }

  const { client, bookings } = response.data;
  const currentPlan = bookings.find((booking) => booking.status === "active")?.planName
    || bookings[0]?.planName
    || "-";

  return (
    <DashboardLayout
      portalName="FlashSpace Admin"
      portalDescription="Complete platform management"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="space-y-6">
        <section className="rounded-2xl border border-[#DDE5DA] bg-white px-6 py-5 shadow-sm">
          <div>
            <h1 className="text-xl font-extrabold text-[#123025]">Client Details</h1>
            <p className="text-[#6B7280] mt-1 text-sm font-medium text-[#607067]">
              Review client profile and booking activity.
            </p>
          </div>
        </section>

        <Button
          variant="outline"
          className="h-10 rounded-xl border-[#DDE5DA] bg-white px-4 text-[#244333] shadow-sm hover:bg-[#F8FAF7]"
          onClick={() => navigate("/admin/clients")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Clients
        </Button>

        <section className="rounded-2xl border border-[#DDE5DA] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <Avatar className="h-20 w-20 shrink-0 ring-4 ring-background shadow-lg md:h-24 md:w-24">
                {client.profilePicture && (
                  <AvatarImage src={getUploadedFileUrl(client.profilePicture)} alt={client.name} className="object-cover" />
                )}
                <AvatarFallback className="bg-primary/10 text-2xl font-black text-primary">
                  {client.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "CL"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h1 className="break-words text-3xl font-bold text-[#10251A]">{client.name}</h1>

              <p className="text-[#6B7280] mt-2 text-[#607067]">
                Client ID:{" "}
                <span className="font-semibold text-[#35503F]">{client.id}</span>
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <span className="rounded-full bg-[#F2F5F1] px-4 py-1 text-xs font-semibold text-[#35503F]">
                  Plan: {currentPlan}
                </span>
                <span className="rounded-full bg-emerald-50 px-4 py-1 text-xs font-semibold text-emerald-700">
                  Bookings: {client.totalBookings}
                </span>
                {getClientStatusBadge(client.statusLabel)}
              </div>
              </div>
            </div>

            <div className="flex min-w-[220px] flex-col gap-2 rounded-xl border border-[#DDE5DA] bg-[#F8FAF7] p-4">
              <span className="text-xs font-bold uppercase tracking-wide text-[#607067]">
                Total Revenue
              </span>
              <span className="text-2xl font-extrabold text-[#10251A]">
                {formatCurrency(client.totalRevenue)}
              </span>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-2xl border border-[#DDE5DA] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-extrabold text-[#10231B]">Overview</h2>
            <p className="mt-1 text-sm text-[#5B7066]">
              Basic client profile and booking activity.
            </p>

            <div className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2">
              <InfoItem label="Contact Name" value={client.name} />
              <InfoItem label="Email" value={client.email} />
              <InfoItem label="Phone" value={client.phone || "-"} />
              <InfoItem label="Status" value={client.statusLabel} />
              <InfoItem label="First Booking" value={formatDate(client.firstBookingDate)} />
              <InfoItem label="Last Booking" value={formatDate(client.lastBookingDate)} />
            </div>
          </section>

          <aside>
            <section className="rounded-2xl border border-[#DDE5DA] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E9F2EC] text-[#35503F]">
                  <CalendarDays className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-lg font-extrabold text-[#10231B]">Booking Summary</h2>
                  <p className="text-sm text-[#5B7066]">Latest admin view</p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[#E6ECE7] pb-3">
                  <span className="text-sm text-[#5B7066]">Total bookings</span>
                  <span className="font-extrabold text-[#10231B]">{client.totalBookings}</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#E6ECE7] pb-3">
                  <span className="text-sm text-[#5B7066]">Active bookings</span>
                  <span className="font-extrabold text-[#10231B]">{client.activeBookings}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#5B7066]">Total revenue</span>
                  <span className="font-extrabold text-[#10231B]">
                    {formatCurrency(client.totalRevenue)}
                  </span>
                </div>
              </div>
            </section>
          </aside>
        </div>

        <section className="overflow-hidden rounded-2xl border border-[#DDE5DA] bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-[#E6ECE7] px-5 py-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-[#10231B]">Booking History</h2>
              <p className="mt-1 text-sm text-[#5B7066]">
                {bookings.length} booking records linked with this client.
              </p>
            </div>
          </div>

          {bookings.length > 0 && (
            <div className="hidden border-b border-[#E6ECE7] bg-[#F8FAF7] px-5 py-3 text-[11px] font-extrabold uppercase tracking-wide text-[#64776D] lg:grid lg:grid-cols-[minmax(145px,0.9fr)_minmax(220px,1.25fr)_minmax(170px,0.9fr)_minmax(110px,0.65fr)_minmax(110px,0.65fr)_minmax(110px,0.55fr)]">
              <span>Booking</span>
              <span>Space</span>
              <span>Plan</span>
              <span>Amount</span>
              <span>Valid Till</span>
              <span className="text-right">Status</span>
            </div>
          )}

          <div className="divide-y divide-[#E6ECE7]">
            {bookings.length > 0 ? (
              bookings.map((booking) => <BookingRow key={booking.id} booking={booking} />)
            ) : (
              <div className="px-5 py-12 text-center text-sm font-medium text-[#5B7066]">
                No bookings found for this client.
              </div>
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default ClientDetails;
