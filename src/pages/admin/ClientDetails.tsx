import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavItems";
import { AdminPageSkeleton } from "@/components/ui/skeleton-loaders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { adminService } from "@/services/admin.service";

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
    return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>;
  }

  if (status === "At Risk") {
    return (
      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
        At Risk
      </Badge>
    );
  }

  return <Badge variant="secondary">Churned</Badge>;
};

const getBookingStatusBadge = (status: string) => {
  if (status === "active") {
    return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>;
  }

  if (status === "pending_payment" || status === "pending_kyc") {
    return (
      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
        {status === "pending_payment" ? "Pending Payment" : "Pending KYC"}
      </Badge>
    );
  }

  if (status === "expired") {
    return <Badge variant="outline">Expired</Badge>;
  }

  if (status === "cancelled") {
    return <Badge variant="secondary">Cancelled</Badge>;
  }

  return <Badge variant="outline">{status}</Badge>;
};

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
        <div className="max-w-3xl mx-auto text-center py-24 space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Client not found</h1>
          <p className="text-muted-foreground">
            This client does not exist or you do not have access to view the details.
          </p>
          <Button onClick={() => navigate("/admin/clients")}>Back to Client Management</Button>
        </div>
      </DashboardLayout>
    );
  }

  const { client, bookings } = response.data;

  return (
    <DashboardLayout
      portalName="FlashSpace Admin"
      portalDescription="Complete platform management"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="space-y-8">
        <div className="space-y-4">
          <Button
            variant="ghost"
            className="-ml-3"
            onClick={() => navigate("/admin/clients")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Client Management
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                {client.name}
              </h1>
              <p className="text-muted-foreground mt-1">
                {client.email} • {client.phone}
              </p>
            </div>
            {getClientStatusBadge(client.statusLabel)}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div className="bg-background border border-border rounded-xl p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Total Bookings</p>
            <p className="text-2xl font-bold mt-1">{client.totalBookings}</p>
          </div>
          <div className="bg-background border border-border rounded-xl p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Active Bookings</p>
            <p className="text-2xl font-bold mt-1 text-green-600">{client.activeBookings}</p>
          </div>
          <div className="bg-background border border-border rounded-xl p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold mt-1">{formatCurrency(client.totalRevenue)}</p>
          </div>
          <div className="bg-background border border-border rounded-xl p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">First Booking</p>
            <p className="text-base font-semibold mt-1">{formatDate(client.firstBookingDate)}</p>
          </div>
          <div className="bg-background border border-border rounded-xl p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Last Booking</p>
            <p className="text-base font-semibold mt-1">{formatDate(client.lastBookingDate)}</p>
          </div>
        </div>

        <div className="bg-background border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-xl font-bold">Booking History</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Complete booking records for this client.
            </p>
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Booking ID
                  </th>
                  <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Type
                  </th>
                  <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Space
                  </th>
                  <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Plan
                  </th>
                  <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Amount
                  </th>
                  <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Booked On
                  </th>
                  <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Valid Till
                  </th>
                  <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 text-sm font-semibold text-foreground">
                        {booking.bookingNumber}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">{booking.type}</td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {booking.spaceName}
                        {booking.spaceCity ? `, ${booking.spaceCity}` : ""}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {booking.planName}
                        {booking.planTenure ? ` (${booking.planTenure})` : ""}
                      </td>
                      <td className="p-4 text-sm font-semibold text-foreground">
                        {formatCurrency(booking.amount)}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {formatDate(booking.createdAt)}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {formatDate(booking.endDate)}
                      </td>
                      <td className="p-4">{getBookingStatusBadge(booking.status)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="p-10 text-center text-muted-foreground font-medium"
                    >
                      No bookings found for this client.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="md:hidden p-4 space-y-3">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="border border-border rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{booking.bookingNumber}</p>
                      <p className="text-sm text-muted-foreground">{booking.type}</p>
                    </div>
                    {getBookingStatusBadge(booking.status)}
                  </div>

                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p>
                      <span className="font-medium text-foreground">Space:</span> {booking.spaceName}
                      {booking.spaceCity ? `, ${booking.spaceCity}` : ""}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">Plan:</span> {booking.planName}
                      {booking.planTenure ? ` (${booking.planTenure})` : ""}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">Amount:</span> {formatCurrency(booking.amount)}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">Booked On:</span> {formatDate(booking.createdAt)}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">Valid Till:</span> {formatDate(booking.endDate)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-muted-foreground font-medium">
                No bookings found for this client.
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientDetails;
