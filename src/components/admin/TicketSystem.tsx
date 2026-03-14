import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Plus,
  Search,
  Clock,
  AlertCircle,
  CheckCircle,
  Eye,
  RefreshCw,
} from "lucide-react";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavItems";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TicketViewModal } from "@/components/modals/TicketViewModal";

import { toast } from "@/hooks/use-toast";

import {
  adminService,
  AdminTicketData,
  TicketStats,
} from "@/services/admin.service";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import playNotificationSound from "@/utils/sound.util";

export default function TicketSystem() {
  const { user } = useAuth();
  const { socket } = useSocket();

  // States
  const [selectedTicket, setSelectedTicket] = useState<AdminTicketData | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);


  // Original states
  const [activeTab, setActiveTab] = useState("all");
  const [tickets, setTickets] = useState<AdminTicketData[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<TicketStats>({
    open: 0,
    in_progress: 0,
    escalated: 0,
    resolved: 0,
    closed: 0,
    avgResolution: "4.2 hrs",
    resolvedThisMonth: 0,
    totalTickets: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTickets = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const filters: {
        status?: string;
        search?: string;
        page?: number;
        limit?: number;
      } = {};

      if (activeTab !== "all") {
        filters.status = activeTab.toLowerCase();
      }
      if (searchTerm) {
        filters.search = searchTerm;
      }

      const response = await adminService.getAllTickets(filters);
      if (response.success && response.data) {
        setTickets(response.data.tickets || []);
      }
    } catch (err: unknown) {
      console.error("Failed to fetch tickets", err);
      toast({
        title: "Error",
        description: "Failed to load tickets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminService.getTicketStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err: unknown) {
      console.error("Failed to fetch stats", err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTickets();
      fetchStats();
    }, 300);
    return () => clearTimeout(timer);
  }, [activeTab, searchTerm]);

  useEffect(() => {
    if (!socket || !selectedTicket) return;

    socket.emit("join_ticket", selectedTicket._id);

    const handleNewMessage = (data: { ticketId: string; message: any }) => {
      if (data.ticketId === selectedTicket._id) {
        setSelectedTicket((prev) => {
          if (!prev) return null;
          const exists = prev.messages.some(
            (m) =>
              new Date(m.createdAt).getTime() ===
              new Date(data.message.createdAt).getTime() &&
              m.message === data.message.message,
          );
          if (exists) return prev;
          return {
            ...prev,
            messages: [...prev.messages, data.message],
          };
        });
        fetchTickets();
      }
    };

    const handleTicketUpdated = (data: { ticketId: string; ticket: any }) => {
      if (data.ticketId === selectedTicket._id) {
        setSelectedTicket(data.ticket);
        fetchTickets();
        fetchStats();
      }
    };

    socket.on("new_message", handleNewMessage);
    socket.on("ticket_updated", handleTicketUpdated);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("ticket_updated", handleTicketUpdated);
    };
  }, [socket, selectedTicket?._id]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("join_admin_feed");

    const handleNewTicket = (ticket: any) => {
      try {
        playNotificationSound();
      } catch (e) {
        console.error("Error playing sound:", e);
      }

      toast({
        title: "New Ticket",
        description: ticket.subject,
      });
      fetchTickets();
      fetchStats();
    };

    socket.on("new_ticket_created", handleNewTicket);

    return () => {
      socket.off("new_ticket_created", handleNewTicket);
    };
  }, [socket]);


  const handleViewTicket = (ticket: AdminTicketData) => {
    setSelectedTicket(ticket);
    setModalOpen(true);
  };

  const handleAssignTicket = async (ticketId: string) => {
    try {
      if (user?._id || user?.id) {
        const userId = user._id || user.id;
        const response = await adminService.assignTicket(ticketId, userId);
        if (response.success) {
          toast({
            title: "Success",
            description: "Ticket assigned successfully!",
          });
          fetchTickets();
          if (selectedTicket?._id === ticketId) {
            setSelectedTicket(response.data || null);
          }
        }
      }
    } catch (err: unknown) {
      console.error("Failed to assign ticket", err);
      toast({
        title: "Error",
        description: "Failed to assign ticket",
        variant: "destructive",
      });
    }
  };

  const handleResolveTicket = async (ticketId: string) => {
    try {
      const response = await adminService.resolveTicket(ticketId);
      if (response.success) {
        toast({
          title: "Success",
          description: "Ticket resolved successfully!",
        });
        fetchTickets();
        fetchStats();
        if (selectedTicket?._id === ticketId) {
          setSelectedTicket(response.data || null);
        }
      }
    } catch (err: unknown) {
      console.error("Failed to resolve ticket", err);
      toast({
        title: "Error",
        description: "Failed to resolve ticket",
        variant: "destructive",
      });
    }
  };

  const handleEscalateTicket = async (ticketId: string) => {
    try {
      const response = await adminService.escalateTicket(ticketId);
      if (response.success) {
        toast({ title: "Success", description: "Ticket escalated!" });
        fetchTickets();
        if (selectedTicket?._id === ticketId) {
          setSelectedTicket(response.data || null);
        }
      }
    } catch (err: unknown) {
      console.error("Failed to escalate ticket", err);
      toast({
        title: "Error",
        description: "Failed to escalate ticket",
        variant: "destructive",
      });
    }
  };

  const handleCloseTicket = async (ticketId: string) => {
    try {
      const response = await adminService.closeTicket(ticketId);
      if (response.success) {
        toast({ title: "Success", description: "Ticket closed permanently" });
        fetchTickets();
        fetchStats();
        if (selectedTicket?._id === ticketId) {
          setSelectedTicket(response.data || null);
        }
      }
    } catch (err: unknown) {
      console.error("Failed to close ticket", err);
      toast({
        title: "Error",
        description: "Failed to close ticket",
        variant: "destructive",
      });
    }
  };

  const handleReply = async (ticketId: string, message: string) => {
    try {
      const response = await adminService.replyToTicket(ticketId, message);
      if (response.success) {
        toast({ title: "Success", description: "Reply sent!" });
        setSelectedTicket(response.data || null);
        fetchTickets();
      }
    } catch (err: unknown) {
      console.error("Failed to send reply", err);
      toast({
        title: "Error",
        description: "Failed to send reply",
        variant: "destructive",
      });
    }
  };

  const getPriorityBadge = (priority: string = "medium") => {
    switch (priority.toLowerCase()) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            Medium
          </Badge>
        );
      case "low":
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge variant="outline">
            <AlertCircle className="w-3 h-3 mr-1" />
            Open
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            <Clock className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        );
      case "escalated":
        return (
          <Badge variant="destructive">
            <AlertCircle className="w-3 h-3 mr-1" />
            Escalated
          </Badge>
        );
      case "resolved":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Resolved
          </Badge>
        );
      case "closed":
        return (
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Closed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status.replace("_", " ")}</Badge>;
    }
  };

  const formatCategory = (category: string) => {
    return category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const renderTicketTable = () => (
    <div className="bg-background border border-border rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-4 text-sm font-semibold text-foreground">
              Ticket
            </th>
            <th className="text-left p-4 text-sm font-semibold text-foreground">
              Client
            </th>
            <th className="text-left p-4 text-sm font-semibold text-foreground">
              Category
            </th>
            <th className="text-left p-4 text-sm font-semibold text-foreground">
              Priority
            </th>
            <th className="text-left p-4 text-sm font-semibold text-foreground">
              Assignee
            </th>
            <th className="text-left p-4 text-sm font-semibold text-foreground">
              Created
            </th>
            <th className="text-left p-4 text-sm font-semibold text-foreground">
              Status
            </th>
            <th className="text-left p-4 text-sm font-semibold text-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr
              key={ticket._id}
              className="border-t border-border hover:bg-muted/30 transition-colors"
            >
              <td className="p-4">
                <div>
                  <span className="text-xs text-muted-foreground">
                    {ticket.ticketNumber}
                  </span>
                  <p className="font-medium text-foreground">
                    {ticket.subject}
                  </p>
                </div>
              </td>
              <td className="p-4 text-sm text-muted-foreground">
                {ticket.user?.fullName || "Unknown"}
              </td>
              <td className="p-4">
                <Badge variant="outline">
                  {formatCategory(ticket.category)}
                </Badge>
              </td>
              <td className="p-4">{getPriorityBadge("medium")}</td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {ticket.assignee?.fullName
                        ? ticket.assignee.fullName.substring(0, 2).toUpperCase()
                        : "UA"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">
                    {ticket.assignee?.fullName || "Unassigned"}
                  </span>
                </div>
              </td>
              <td className="p-4 text-sm text-muted-foreground">
                {new Date(ticket.createdAt).toLocaleDateString("en-IN")}
              </td>
              <td className="p-4">{getStatusBadge(ticket.status)}</td>
              <td className="p-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewTicket(ticket)}
                  className="gap-1"
                >
                  <Eye className="w-4 h-4" />
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {tickets.length === 0 && (
        <div className="p-8 text-center text-muted-foreground flex flex-col justify-center items-center">
          {loading ? (
            <>
              <RefreshCw className="w-6 h-6 animate-spin mb-2" />
              Loading tickets...
            </>
          ) : (
            "No tickets in this category"
          )}
        </div>
      )}
    </div>
  );

  return (
    <DashboardLayout
      portalName="FlashSpace Admin"
      portalDescription="Complete platform management"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Ticket <span className="text-primary italic">System</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage and resolve support tickets
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-5 mb-8">
        <div className="bg-background border border-border rounded-xl p-5">
          <p className="text-2xl font-extrabold text-foreground">
            {stats.open}
          </p>
          <p className="text-sm text-muted-foreground">Open Tickets</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-5">
          <p className="text-2xl font-extrabold text-blue-600">
            {stats.in_progress}
          </p>
          <p className="text-sm text-muted-foreground">In Progress</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-5">
          <p className="text-2xl font-extrabold text-red-600">
            {stats.escalated}
          </p>
          <p className="text-sm text-muted-foreground">Escalated</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-5">
          <p className="text-2xl font-extrabold text-green-600">
            {stats.resolvedThisMonth}
          </p>
          <p className="text-sm text-muted-foreground">Resolved (MTD)</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-5">
          <p className="text-2xl font-extrabold text-foreground">
            {stats.totalTickets}
          </p>
          <p className="text-sm text-muted-foreground">Total Tickets</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="all">All Tickets</TabsTrigger>
          <TabsTrigger value="open">Open ({stats.open})</TabsTrigger>
          <TabsTrigger value="in_progress">
            In Progress ({stats.in_progress})
          </TabsTrigger>
          <TabsTrigger value="escalated">
            Escalated ({stats.escalated})
          </TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>

        {/* Because we filter natively from the API via `activeTab`, we don't need distinct filtered array mapping, we just re-render the current tickets state table for the active tab */}
        <TabsContent value="all">{renderTicketTable()}</TabsContent>
        <TabsContent value="open">{renderTicketTable()}</TabsContent>
        <TabsContent value="in_progress">{renderTicketTable()}</TabsContent>
        <TabsContent value="escalated">{renderTicketTable()}</TabsContent>
        <TabsContent value="resolved">{renderTicketTable()}</TabsContent>
      </Tabs>

      <TicketViewModal
        ticket={selectedTicket}
        open={modalOpen}
        onOpenChange={setModalOpen}
        handleAssignTicket={handleAssignTicket}
        handleResolveTicket={handleResolveTicket}
        handleEscalateTicket={handleEscalateTicket}
        handleCloseTicket={handleCloseTicket}
        handleReply={handleReply}
      />

    </DashboardLayout>
  );
}
