import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Ticket,
  BookOpen,
  Trophy,
  Target,
  Headphones,
  Calculator,
  FileText,
  Wallet,
  Receipt,
  Search,
  Filter,
  Eye,
  MessageSquare,
  MoreVertical,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  Loader2,
  X,
  Download,
  AlertTriangle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { adminService } from "@/services/admin.service";
import { toast } from "@/hooks/use-toast";

// --- Sub-components for Modals ---

const ClientViewModal = ({ client, open, onOpenChange, onOpenChat }: any) => {
  if (!client) return null;

  const getStatusStyle = (status: string) => {
    if (status === "Active") return "bg-green-50 text-green-700 border-green-100";
    if (status === "At Risk") return "bg-orange-50 text-orange-700 border-orange-100";
    if (status === "Churned") return "bg-red-50 text-red-700 border-red-100";
    return "bg-gray-50 text-gray-700 border-gray-100";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full p-0 overflow-hidden bg-white rounded-3xl border-0 shadow-2xl">
        <div className="flex flex-col h-[90vh] md:h-auto max-h-[90vh]">
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-2xl">
                {client.initials}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {client.companyName}
                </h2>
                <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                  <span>{client.name}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                    {client.bookingNumber || client.id}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusStyle(client.statusLabel)}`}
              >
                {client.statusLabel}
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer group">
                    <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="text-sm">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer group">
                    <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span className="text-sm">{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer group">
                    <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="text-sm">
                      {client.spaceName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Subscription Info */}
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">
                  Subscription Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-gray-50 rounded text-gray-500">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                      {client.plan}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="p-1.5 bg-gray-50 rounded text-gray-500">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <span>
                      Status:{" "}
                      <span className="text-gray-900 font-medium capitalize">
                        {client.bookingStatus?.replace(/_/g, " ") || "—"}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="p-1.5 bg-gray-50 rounded text-gray-500">
                      <Clock className="w-4 h-4" />
                    </div>
                    <span>
                      Expires:{" "}
                      <span className="text-gray-900 font-medium">
                        {client.endDate ? new Date(client.endDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 relative">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-gray-500 text-sm font-medium">
                    Monthly Revenue
                  </h4>
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {formatCurrency(client.revenue)}
                </div>
                <p className="text-xs text-gray-500">
                  Lifetime value: {formatCurrency(client.revenue * 12)}
                </p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                  <span className="text-gray-600">Last login</span>
                  <span className="font-medium text-gray-900">2 days ago</span>
                </div>
                <div className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                  <span className="text-gray-600">Support tickets (30 days)</span>
                  <span className="font-medium text-gray-900">2 tickets</span>
                </div>
                <div className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                  <span className="text-gray-600">Mail received (30 days)</span>
                  <span className="font-medium text-gray-900">15 items</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex gap-3 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                View Invoices
              </button>
              <button className="flex-1 sm:flex-none px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Download Report
              </button>
            </div>
            <button
              onClick={() => {
                onOpenChange(false);
                onOpenChat();
              }}
              className="w-full sm:w-auto px-6 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200/50 flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Start Chat
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ClientChatModal = ({ client, open, onOpenChange }: any) => {
  if (!client) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden bg-white rounded-3xl border-0 shadow-2xl">
        <div className="flex flex-col h-[600px]">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-teal-600 text-white">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border-2 border-white/20">
                <AvatarFallback className="bg-white/10 text-white font-bold">
                  {client.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold">{client.companyName}</h3>
                <p className="text-xs text-teal-100">Live Support Chat</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="text-white hover:bg-white/10">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 p-6 flex flex-col justify-center items-center text-center space-y-4">
            <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-teal-600" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Initialize Chat</h4>
              <p className="text-gray-500 text-sm max-w-xs mx-auto mt-2">
                Connect with {client.name} for real-time support and assistance.
              </p>
            </div>
            <Button className="bg-teal-600 hover:bg-teal-700">Open Full Chat Interface</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// --- Main Component ---

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

  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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
        console.error("Failed to fetch clients", error);
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
          existing.spaceName = booking.spaceSnapshot?.name ? `${booking.spaceSnapshot.name}${booking.spaceSnapshot.city ? ` — ${booking.spaceSnapshot.city}` : ""}` : existing.spaceName;
          existing.bookingStatus = booking.status;
          existing.endDate = booking.endDate;
        }
      } else {
        const fullName = booking.user.fullName || "Unknown User";
        const spaceName = booking.spaceSnapshot?.name ? `${booking.spaceSnapshot.name}${booking.spaceSnapshot.city ? ` — ${booking.spaceSnapshot.city}` : ""}` : "—";
        clientMap.set(userId, {
          id: userId,
          bookingNumber: booking.bookingNumber,
          name: fullName,
          companyName: fullName,
          email: booking.user.email || "—",
          phone: booking.user.phoneNumber || "—",
          plan: booking.plan?.name || booking.type || "—",
          spaceName,
          revenue: amount,
          lastActivityDate: date,
          bookingStatus: booking.status,
          endDate: booking.endDate,
          healthScore: Math.floor(Math.random() * 40) + 60, // Mock health score
          initials: fullName.split(" ").slice(0, 2).map((w: string) => w[0] ?? "").join("").toUpperCase() || "??",
        });
      }
    });

    const processed = Array.from(clientMap.values()).map((client) => {
      let statusLabel = "Active";
      let statusKey = "active";
      if (client.bookingStatus === "expired" || client.bookingStatus === "cancelled") {
        statusLabel = "Churned";
        statusKey = "churned";
        client.healthScore = Math.floor(Math.random() * 20);
      } else if (client.bookingStatus === "active" && client.endDate) {
        const daysLeft = (new Date(client.endDate).getTime() - Date.now()) / (1000 * 3600 * 24);
        if (daysLeft < 7) {
          statusLabel = "At Risk";
          statusKey = "at_risk";
          client.healthScore = Math.floor(Math.random() * 20) + 30;
        }
      } else if (client.bookingStatus === "pending_kyc" || client.bookingStatus === "pending_payment") {
        statusLabel = "At Risk";
        statusKey = "at_risk";
        client.healthScore = Math.floor(Math.random() * 20) + 40;
      }
      return { ...client, statusLabel, statusKey };
    });

    setStats({
      total: processed.length,
      active: processed.filter((c) => c.statusKey === "active").length,
      atRisk: processed.filter((c) => c.statusKey === "at_risk").length,
      churned: processed.filter((c) => c.statusKey === "churned").length,
    });
    setClients(processed);
    setLoading(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>;
      case "at_risk":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">At Risk</Badge>;
      case "churned":
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

  const filteredClients = clients.filter(c => {
    const matchesTab = activeTab === "all" || c.statusKey === activeTab;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || c.companyName.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  const renderClientTable = (clientList: any[]) => (
    <div className="bg-background border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 text-sm font-semibold text-foreground">Client</th>
              <th className="text-left p-4 text-sm font-semibold text-foreground">Plan</th>
              <th className="text-left p-4 text-sm font-semibold text-foreground">Space</th>
              <th className="text-left p-4 text-sm font-semibold text-foreground">Revenue</th>
              <th className="text-left p-4 text-sm font-semibold text-foreground whitespace-nowrap">Health</th>
              <th className="text-left p-4 text-sm font-semibold text-foreground">Status</th>
              <th className="text-right p-4 text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clientList.map((client) => (
              <tr key={client.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {client.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-foreground">{client.companyName}</div>
                      <div className="text-sm text-muted-foreground">{client.name}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <Badge variant="outline" className="whitespace-nowrap">{client.plan}</Badge>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate max-w-[150px]">{client.spaceName}</span>
                  </div>
                </td>
                <td className="p-4 font-semibold text-foreground whitespace-nowrap">{formatCurrency(client.revenue)}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-2 rounded-full ${getHealthColor(client.healthScore)}`} />
                    <span className="text-sm text-muted-foreground">{client.healthScore}</span>
                  </div>
                </td>
                <td className="p-4">{getStatusBadge(client.statusKey)}</td>
                <td className="p-4">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setSelectedClient(client); setViewModalOpen(true); }}
                      className="hover:bg-primary/10"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setSelectedClient(client); setChatModalOpen(true); }}
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
                        <DropdownMenuItem onClick={() => toast({ title: "Reminder Sent", description: `Renewal reminder sent to ${client.name}` })}>
                          Send Renewal Reminder
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast({ title: "Call Scheduled", description: `Call scheduled with ${client.name}` })}>
                          Schedule Call
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast({ title: "Loading Invoices", description: `Fetching invoices for ${client.name}` })}>
                          View Invoices
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast({ title: "Export Started", description: `Exporting data for ${client.name}` })}>
                          Export Client Data
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto p-6 bg-background min-h-screen">
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
          <p className="text-2xl font-extrabold text-foreground">{stats.total}</p>
          <p className="text-sm text-muted-foreground">Total Clients</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <p className="text-2xl font-extrabold text-green-600">{stats.active}</p>
          <p className="text-sm text-muted-foreground">Active</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <p className="text-2xl font-extrabold text-yellow-600">{stats.atRisk}</p>
          <p className="text-sm text-muted-foreground">At Risk</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <p className="text-2xl font-extrabold text-foreground">{stats.churned}</p>
          <p className="text-sm text-muted-foreground">Churned (YTD)</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            className="pl-10"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setSearchQuery(searchInput)}
          />
        </div>
        <Button variant="outline" onClick={() => setSearchQuery(searchInput)}>
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Clients</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="at_risk">At Risk</TabsTrigger>
          <TabsTrigger value="churned">Churned</TabsTrigger>
        </TabsList>

        <TabsContent value="all">{renderClientTable(filteredClients)}</TabsContent>
        <TabsContent value="active">{renderClientTable(filteredClients)}</TabsContent>
        <TabsContent value="at_risk">{renderClientTable(filteredClients)}</TabsContent>
        <TabsContent value="churned">{renderClientTable(filteredClients)}</TabsContent>
      </Tabs>

      {/* Modals */}
      <ClientViewModal
        client={selectedClient}
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        onOpenChat={() => setChatModalOpen(true)}
      />
      <ClientChatModal
        client={selectedClient}
        open={chatModalOpen}
        onOpenChange={setChatModalOpen}
      />
    </div>
  );
};

export default ClientManagement;
