import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavItems";
import {
  AdminClientListItem,
  adminService,
} from "@/services/admin.service";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminPageSkeleton } from "@/components/ui/skeleton-loaders";
import { toast } from "@/hooks/use-toast";
import { Eye, Loader2, RotateCcw, Search } from "lucide-react";

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

const renderStatusBadge = (status: AdminClientListItem["statusLabel"]) => {
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

const ClientManagement = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<AdminClientListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchClients = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);

    try {
      const response = await adminService.getClients({ page: 1, limit: 500 });

      if (response.success && response.data?.clients) {
        setClients(response.data.clients);
      } else {
        setClients([]);
      }
    } catch (error) {
      console.error("Failed to fetch clients", error);
      toast({
        title: "Error",
        description: "Could not load clients. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  };

  useEffect(() => {
    void fetchClients();
  }, []);

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const searchedClients = useMemo(() => {
    if (!normalizedSearch) return clients;

    return clients.filter((client) =>
      [client.name, client.email, client.phone].some((value) =>
        value.toLowerCase().includes(normalizedSearch),
      ),
    );
  }, [clients, normalizedSearch]);

  const allStats = useMemo(
    () => ({
      total: clients.length,
    }),
    [clients],
  );
  const visibleClients = searchedClients;

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
          Client <span className="text-primary italic">Management</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          View all clients who have placed bookings and track their booking activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-1 mb-8">
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <p className="text-2xl font-extrabold text-foreground">{allStats.total}</p>
          <p className="text-sm text-muted-foreground">Total Clients</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by name, email, or phone..."
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => void fetchClients(true)}
          disabled={refreshing}
          className="w-full sm:w-auto"
        >
          {refreshing ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RotateCcw className="w-4 h-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        All Clients ({visibleClients.length})
      </p>

      <div className="hidden md:block bg-background border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Client
                </th>
                <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Email
                </th>
                <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Phone
                </th>
                <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Bookings
                </th>
                <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Revenue
                </th>
                <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Last Booking
                </th>
                <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="text-right p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visibleClients.length > 0 ? (
                visibleClients.map((client) => (
                  <tr
                    key={client.id}
                    onClick={() => navigate(`/admin/clients/${client.id}`)}
                    className="hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 ring-2 ring-background shadow-sm">
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                            {client.initials || "CL"}
                          </AvatarFallback>
                        </Avatar>
                        <p className="font-semibold text-foreground">{client.name}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{client.email}</td>
                    <td className="p-4 text-sm text-muted-foreground">{client.phone}</td>
                    <td className="p-4 text-sm font-semibold text-foreground">
                      {client.bookingCount}
                    </td>
                    <td className="p-4 text-sm font-semibold text-foreground">
                      {formatCurrency(client.totalRevenue)}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {formatDate(client.lastBookingDate)}
                    </td>
                    <td className="p-4">{renderStatusBadge(client.statusLabel)}</td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        className="text-primary"
                        onClick={(event) => {
                          event.stopPropagation();
                          navigate(`/admin/clients/${client.id}`);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Bookings
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="p-12 text-center text-muted-foreground font-medium"
                  >
                    No clients found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden grid grid-cols-1 gap-4">
        {visibleClients.length > 0 ? (
          visibleClients.map((client) => (
            <div
              key={client.id}
              className="bg-white border border-border rounded-2xl p-5 shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-foreground">{client.name}</p>
                  <p className="text-sm text-muted-foreground break-all">{client.email}</p>
                  <p className="text-sm text-muted-foreground">{client.phone}</p>
                </div>
                {renderStatusBadge(client.statusLabel)}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Bookings</p>
                  <p className="font-semibold">{client.bookingCount}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Revenue</p>
                  <p className="font-semibold">{formatCurrency(client.totalRevenue)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Last Booking</p>
                  <p className="font-semibold">{formatDate(client.lastBookingDate)}</p>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={() => navigate(`/admin/clients/${client.id}`)}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Booking Details
              </Button>
            </div>
          ))
        ) : (
          <div className="bg-muted/30 border border-dashed border-border rounded-2xl p-10 text-center text-muted-foreground">
            No clients found for the selected filters.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClientManagement;
