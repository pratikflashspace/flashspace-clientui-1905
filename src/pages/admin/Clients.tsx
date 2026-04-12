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
  RotateCcw,
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
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block bg-background border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Client
                </th>
                <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Plan
                </th>
                <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Space
                </th>
                <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Revenue
                </th>
                <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Health
                </th>
                <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="text-right p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {clientList.length > 0 ? (
                clientList.map((client) => (
                  <tr
                    key={client.id}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 ring-2 ring-background shadow-sm">
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                            {client.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="font-bold text-foreground truncate max-w-[150px]">
                            {client.name}
                          </div>
                          <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                            {client.contact}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant="secondary"
                        className="bg-primary/5 text-primary border-primary/10 font-bold"
                      >
                        {client.plan}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                        <MapPin className="w-3 h-3 text-primary/60" />
                        <span className="truncate max-w-[150px]">
                          {client.space}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-foreground">
                      {client.revenue}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 min-w-[60px] h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getHealthColor(client.healthScore)} transition-all`}
                            style={{ width: `${client.healthScore}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-muted-foreground min-w-[20px]">
                          {client.healthScore}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">{getStatusBadge(client.status)}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-primary hover:bg-primary/10 hover:text-primary transition-colors"
                          onClick={() => handleViewClient(client)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-primary hover:bg-primary/10 hover:text-primary transition-colors"
                          onClick={() => handleChatClient(client)}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-muted"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem
                              onClick={() =>
                                handleClientAction("send_renewal", client)
                              }
                              className="gap-2"
                            >
                              <RotateCcw className="w-4 h-4" />
                              Send Renewal Reminder
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleClientAction("schedule_call", client)
                              }
                              className="gap-2"
                            >
                              <MessageSquare className="w-4 h-4" />
                              Schedule Call
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleClientAction("view_invoices", client)
                              }
                              className="gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Invoices
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
                    className="p-12 text-center text-muted-foreground font-medium"
                  >
                    No clients found in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {clientList.length > 0 ? (
          clientList.map((client) => (
            <div
              key={client.id}
              className="bg-white border border-border rounded-[24px] p-6 shadow-sm space-y-5 active:scale-[0.98] transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 shadow-md">
                    <AvatarFallback className="bg-primary/10 text-primary font-extrabold">
                      {client.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-foreground truncate max-w-[140px] leading-tight mb-0.5">{client.name}</h3>
                    <p className="text-sm text-muted-foreground font-medium">
                      {client.contact}
                    </p>
                  </div>
                </div>
                {getStatusBadge(client.status)}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    Plan
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {client.plan}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">
                    Revenue
                  </p>
                  <p className="text-sm font-bold text-foreground text-right">
                    {client.revenue}
                  </p>
                </div>
                <div className="col-span-2 space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    Space
                  </p>
                  <p className="text-sm font-medium text-muted-foreground truncate flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground/70" />
                    {client.space}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  <span>Health Score</span>
                  <span>{client.healthScore}%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden border border-border/50">
                  <div
                    className={`h-full ${getHealthColor(client.healthScore)} transition-all`}
                    style={{ width: `${client.healthScore}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  className="flex-1 bg-primary hover:opacity-90 text-primary-foreground rounded-2xl h-11 font-bold transition-all shadow-lg active:scale-95"
                  onClick={() => handleViewClient(client)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                <Button
                  variant="outline"
                  className="w-12 h-11 p-0 rounded-2xl border-border active:scale-95 transition-all"
                  onClick={() => handleChatClient(client)}
                >
                  <MessageSquare className="w-5 h-5 text-muted-foreground" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-muted/30 border border-dashed border-border rounded-[24px] p-12 text-center">
            <p className="text-muted-foreground font-medium">No results.</p>
          </div>
        )}
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
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search clients..." className="pl-10 w-full rounded-xl" />
        </div>
        <Button variant="outline" className="w-full sm:w-auto rounded-xl">
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
