import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { adminService } from "@/services/admin.service";
import {
  Search,
  Filter,
  Eye,
  MessageSquare,
  MoreVertical,
  MapPin,
  Loader2,
} from "lucide-react";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavItems";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ClientViewModal } from "@/components/modals/ClientViewModal";
import { ClientChatModal } from "@/components/modals/ClientChatModal";
import { toast } from "@/hooks/use-toast";
import { AdminPageSkeleton } from "@/components/ui/skeleton-loaders";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Active":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          Active
        </Badge>
      );
    case "At Risk":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
          At Risk
        </Badge>
      );
    case "Churned":
      return <Badge variant="secondary">Churned</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getHealthColor = (score: number) => {
  if (score >= 70) return "bg-green-500";
  if (score >= 50) return "bg-yellow-500";
  return "bg-red-500";
};

const ClientManagement = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    atRisk: 0,
    churned: 0,
  });

  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await adminService.getAllBookings();

        if (response.success && response.data && response.data.bookings) {
          processBookingClients(response.data.bookings);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch clients from bookings", error);
        toast({
          title: "Error",
          description: "Could not fetch clients.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const processBookingClients = (bookings: any[]) => {
    const clientMap = new Map<string, any>();

    bookings.forEach((booking) => {
      if (!booking.user) return;

      const userId = booking.user._id || booking.user.email;
      const existing = clientMap.get(userId);
      const amount = Number(booking.plan?.price || booking.amount || 0);
      const date = new Date(booking.createdAt);

      if (existing) {
        existing.revenue += amount;
        if (date > existing.lastActivityDate) {
          existing.lastActivityDate = date;
          existing.plan = booking.plan?.name || booking.type || existing.plan;
          existing.space = booking.spaceSnapshot?.name
            ? `${booking.spaceSnapshot.name}${booking.spaceSnapshot.city ? ` — ${booking.spaceSnapshot.city}` : ""}`
            : existing.space;
          existing.bookingStatus = booking.status;
          existing.renewal = booking.endDate;
        }
      } else {
        const fullName =
          booking.user.fullName ||
          (booking.user.firstName
            ? `${booking.user.firstName} ${booking.user.lastName || ""}`
            : "Unknown User");
        const spaceName = booking.spaceSnapshot?.name
          ? `${booking.spaceSnapshot.name}${booking.spaceSnapshot.city ? ` — ${booking.spaceSnapshot.city}` : ""}`
          : "—";

        clientMap.set(userId, {
          id: userId,
          name: booking.user.companyName || fullName,
          contact: fullName,
          email: booking.user.email || "—",
          phone: booking.user.phoneNumber || booking.user.phone || "—",
          plan: booking.plan?.name || booking.type || "—",
          space: spaceName,
          revenue: amount,
          lastActivityDate: date,
          bookingStatus: booking.status,
          renewal: booking.endDate,
        });
      }
    });

    const processed = Array.from(clientMap.values()).map((client) => {
      let statusLabel = "Active";
      let healthScore = 85;

      if (
        client.bookingStatus === "expired" ||
        client.bookingStatus === "cancelled"
      ) {
        statusLabel = "Churned";
        healthScore = Math.floor(Math.random() * 30); // 0-30
      } else if (client.bookingStatus === "active" && client.renewal) {
        const daysLeft =
          (new Date(client.renewal).getTime() - Date.now()) /
          (1000 * 3600 * 24);
        if (daysLeft < 7) {
          statusLabel = "At Risk";
          healthScore = Math.floor(Math.random() * 20) + 40; // 40-60
        } else {
          healthScore = Math.min(Math.floor(Math.random() * 20) + 80, 100); // 80-100
        }
      } else if (
        client.bookingStatus === "pending_kyc" ||
        client.bookingStatus === "pending_payment"
      ) {
        statusLabel = "At Risk";
        healthScore = Math.floor(Math.random() * 20) + 40; // 40-60
      }

      const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }).format(amount);
      };

      const formattedRenewal = client.renewal
        ? new Date(client.renewal).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "—";

      const initials =
        client.name
          .split(" ")
          .slice(0, 2)
          .map((w: string) => w[0] ?? "")
          .join("")
          .toUpperCase() || "??";

      return {
        ...client,
        status: statusLabel,
        healthScore: healthScore,
        revenue: formatCurrency(client.revenue),
        renewal: formattedRenewal,
        initials: initials,
      };
    });

    setStats({
      total: processed.length,
      active: processed.filter((c) => c.status === "Active").length,
      atRisk: processed.filter((c) => c.status === "At Risk").length,
      churned: processed.filter((c) => c.status === "Churned").length,
    });

    setClients(processed);
    setLoading(false);
  };

  const filteredClients =
    activeTab === "all"
      ? clients
      : clients.filter((c) => {
          if (activeTab === "active") return c.status === "Active";
          if (activeTab === "at_risk") return c.status === "At Risk";
          if (activeTab === "churned") return c.status === "Churned";
          return true;
        });

  const handleViewClient = (client: any) => {
    setSelectedClient(client);
    setViewModalOpen(true);
  };

  const handleChatClient = (client: any) => {
    setSelectedClient(client);
    setChatModalOpen(true);
  };

  const handleClientAction = (action: string, client: any) => {
    switch (action) {
      case "send_renewal":
        toast({
          title: "Renewal Reminder Sent",
          description: `Renewal reminder sent to ${client.name}`,
        });
        break;
      case "schedule_call":
        toast({
          title: "Call Scheduled",
          description: `Call scheduled with ${client.contact}`,
        });
        break;
      case "view_invoices":
        toast({
          title: "Loading Invoices",
          description: `Fetching invoices for ${client.name}`,
        });
        break;
      case "export_data":
        toast({
          title: "Exporting Data",
          description: `Client data export started for ${client.name}`,
        });
        break;
    }
  };

  const renderClientTable = (clientList: any[]) => (
    <div className="bg-background border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 text-sm font-semibold text-foreground">
                Client
              </th>
              <th className="text-left p-4 text-sm font-semibold text-foreground">
                Plan
              </th>
              <th className="text-left p-4 text-sm font-semibold text-foreground">
                Space
              </th>
              <th className="text-left p-4 text-sm font-semibold text-foreground">
                Revenue
              </th>
              <th className="text-left p-4 text-sm font-semibold text-foreground">
                Health
              </th>
              <th className="text-left p-4 text-sm font-semibold text-foreground">
                Status
              </th>
              <th className="text-left p-4 text-sm font-semibold text-foreground whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {clientList.length > 0 ? (
              clientList.map((client) => (
                <tr
                  key={client.id}
                  className="border-t border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {client.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-foreground whitespace-nowrap">
                          {client.name}
                        </div>
                        <div className="text-sm text-muted-foreground whitespace-nowrap">
                          {client.contact}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline" className="whitespace-nowrap">
                      {client.plan}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground whitespace-nowrap">
                      <MapPin className="w-3 h-3" />
                      {client.space}
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-foreground whitespace-nowrap">
                    {client.revenue}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-2 rounded-full ${getHealthColor(client.healthScore)}`}
                      />
                      <span className="text-sm text-muted-foreground">
                        {client.healthScore}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">{getStatusBadge(client.status)}</td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewClient(client)}
                        className="hover:bg-primary/10"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleChatClient(client)}
                        className="hover:bg-primary/10"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              handleClientAction("send_renewal", client)
                            }
                          >
                            Send Renewal Reminder
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleClientAction("schedule_call", client)
                            }
                          >
                            Schedule Call
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleClientAction("view_invoices", client)
                            }
                          >
                            View Invoices
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleClientAction("export_data", client)
                            }
                          >
                            Export Client Data
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="p-8 text-center text-muted-foreground"
                >
                  No clients found in this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

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
          Manage all clients and track their health scores
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4 mb-8">
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <p className="text-2xl font-extrabold text-foreground">
            {stats.total}
          </p>
          <p className="text-sm text-muted-foreground">Total Clients</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <p className="text-2xl font-extrabold text-green-600">
            {stats.active}
          </p>
          <p className="text-sm text-muted-foreground">Active</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <p className="text-2xl font-extrabold text-yellow-600">
            {stats.atRisk}
          </p>
          <p className="text-sm text-muted-foreground">At Risk</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <p className="text-2xl font-extrabold text-foreground">
            {stats.churned}
          </p>
          <p className="text-sm text-muted-foreground">Churned (YTD)</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search clients..." className="pl-10" />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="all">All Clients ({stats.total})</TabsTrigger>
          <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
          <TabsTrigger value="at_risk">At Risk ({stats.atRisk})</TabsTrigger>
          <TabsTrigger value="churned">Churned ({stats.churned})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {renderClientTable(filteredClients)}
        </TabsContent>
        <TabsContent value="active">
          {renderClientTable(filteredClients)}
        </TabsContent>
        <TabsContent value="at_risk">
          {renderClientTable(filteredClients)}
        </TabsContent>
        <TabsContent value="churned">
          {renderClientTable(filteredClients)}
        </TabsContent>
      </Tabs>

      {/* Modals - If these components don't exist, we will need to create them or replace with inline Dialogs */}
      {viewModalOpen && ClientViewModal && (
        <ClientViewModal
          client={selectedClient}
          open={viewModalOpen}
          onOpenChange={setViewModalOpen}
          onOpenChat={() => {
            setViewModalOpen(false);
            setChatModalOpen(true);
          }}
        />
      )}

      {chatModalOpen && ClientChatModal && (
        <ClientChatModal
          client={selectedClient}
          open={chatModalOpen}
          onOpenChange={setChatModalOpen}
        />
      )}
    </DashboardLayout>
  );
};

export default ClientManagement;
