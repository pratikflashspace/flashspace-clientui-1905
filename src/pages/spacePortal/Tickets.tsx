import { useState, useEffect, useMemo, useCallback } from "react";
import { Eye, Star, MessageSquare, Clock, CheckCircle2, Zap, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { TableSkeleton } from "@/components/ui/skeleton-loaders";
import { toast } from "sonner";
import partnerTicketService, {
  PartnerTicketData,
} from "@/services/spacePortal/partnerTicket.service";
import SearchBar from "@/components/ui/SpacePartner/SearchBar";
import SelectBox from "@/components/ui/SpacePartner/SelectionBox";
import { useSocket } from "@/contexts/SocketContext";
import { EnquiryChatModal } from "@/components/modals/EnquiryChatModal";

export default function Tickets() {
  const [tickets, setTickets] = useState<PartnerTicketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [activeTab, setActiveTab] = useState("inprogress");
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const { socket } = useSocket();

  const fetchTickets = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await partnerTicketService.getPartnerTickets(1, 100);
      if (res.success && res.data) {
        setTickets(res.data.tickets);
      }
    } catch (error) {
      console.error("Failed to fetch tickets", error);
      if (!silent) toast.error("Failed to load tickets");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    if (!socket) return;

    const handleNewTicket = (data: any) => {
      // Add the new ticket to the list if it's not already there
      setTickets(prev => {
        const exists = prev.some(t => t._id === data.ticket._id);
        if (exists) return prev;
        return [data.ticket, ...prev];
      });
      toast.success(`New support ticket received: ${data.ticket.subject}`);
    };

    socket.on("partner_new_ticket", handleNewTicket);
    return () => {
      socket.off("partner_new_ticket", handleNewTicket);
    };
  }, [socket]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    tickets.forEach(t => {
      if (t.category) cats.add(t.category);
    });
    return Array.from(cats);
  }, [tickets]);

  const stats = useMemo(() => {
    const total = tickets.length;
    const inProgress = tickets.filter(t => {
      const s = (t.status || "").toUpperCase();
      return s === "OPEN" || s === "IN_PROGRESS" || s === "ESCALATED";
    }).length;
    const resolvedCount = tickets.filter(t => {
      const s = (t.status || "").toUpperCase();
      return s === "RESOLVED";
    }).length;

    // Dynamic Avg Response Time calculation (simplified: time from createdAt to closedAt/updatedAt for resolved/closed tickets)
    let avgTimeStr = "N/A";
    const resolvedTickets = tickets.filter(t => {
      const s = (t.status || "").toUpperCase();
      return (s === "RESOLVED") && t.createdAt && (t.resolvedAt || t.updatedAt);
    });

    if (resolvedTickets.length > 0) {
      const totalDiff = resolvedTickets.reduce((acc, t) => {
        const start = new Date(t.createdAt).getTime();
        const end = new Date(t.resolvedAt || t.updatedAt).getTime();
        return acc + (end - start);
      }, 0);
      const avgMs = totalDiff / resolvedTickets.length;
      const mins = Math.floor(avgMs / 60000);
      const hours = Math.floor(mins / 60);
      if (hours > 0) avgTimeStr = `${hours}h ${mins % 60}m`;
      else if (mins > 0) avgTimeStr = `${mins}m`;
      else avgTimeStr = "< 1m";
    }

    return { total, inProgress, resolved: resolvedCount, avgTime: avgTimeStr };
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const q = query.toLowerCase();
      const status = (t.status || "").toUpperCase();
      const matchesQuery =
        t.subject.toLowerCase().includes(q) ||
        t.ticketNumber.toLowerCase().includes(q) ||
        (t.user?.fullName || "").toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "ALL" ? true : status === statusFilter.toUpperCase();

      const matchesCategory =
        categoryFilter === "ALL" ? true : t.category === categoryFilter;

      const matchesTab = 
        activeTab === "inprogress" 
          ? (status === "OPEN" || status === "IN_PROGRESS" || status === "ESCALATED")
          : (status === "RESOLVED");

      return matchesQuery && matchesStatus && matchesCategory && matchesTab;
    });
  }, [tickets, query, statusFilter, categoryFilter, activeTab]);

  const handleViewDetails = (ticket: PartnerTicketData) => {
    setSelectedTicket({
      id: ticket._id,
      ticketNumber: ticket.ticketNumber,
      user: {
        id: ticket.user?._id || ticket.user?.id,
        name: ticket.user?.fullName,
        email: ticket.user?.email,
        phone: ticket.user?.phoneNumber,
      },
      space: ticket.bookingId?.spaceSnapshot?.name || ticket.subject || "Support Ticket",
      category: ticket.category,
      status: ticket.status,
      subject: ticket.subject,
    });
    setChatOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="h-12 w-64 bg-gray-200 rounded" />
          <div className="h-4 w-96 bg-gray-100 rounded" />
        </div>
        <div className="h-10 w-full bg-gray-50 rounded-xl" />
        <div className="bg-background border border-border rounded-xl p-4">
          <TableSkeleton rows={10} cols={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#164e4e]">
          Tickets
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage and track client support tickets and enquiries
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Tickets", value: stats.total, icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "In Progress", value: stats.inProgress, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Resolved", value: stats.resolved, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Avg Response Time", value: stats.avgTime, icon: Zap, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs and Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="bg-slate-100/50 p-1 rounded-xl">
            <TabsTrigger 
              value="inprogress" 
              className="px-6 py-2 rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:text-[#164e4e] data-[state=active]:shadow-sm"
            >
              In Progress
            </TabsTrigger>
            <TabsTrigger 
              value="converted"
              className="px-6 py-2 rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:text-[#164e4e] data-[state=active]:shadow-sm"
            >
              Converted
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-1 w-full md:w-auto gap-3">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search by ID, subject, or client name..."
            className="flex-1"
          />
          <SelectBox
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={[
              { label: "All Categories", value: "ALL" },
              ...categories.map(c => ({ 
                label: c.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), 
                value: c 
              }))
            ]}
          />
          <SelectBox
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { label: "All Status", value: "ALL" },
              { label: "Open", value: "OPEN" },
              { label: "In Progress", value: "IN_PROGRESS" },
              { label: "Resolved", value: "RESOLVED" },
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left p-4 text-xs font-extrabold text-foreground uppercase tracking-wider">
                  Ticket
                </th>
                <th className="text-left p-4 text-xs font-extrabold text-foreground uppercase tracking-wider">
                  Client
                </th>
                <th className="text-left p-4 text-xs font-extrabold text-foreground uppercase tracking-wider">
                  Date
                </th>
                <th className="text-left p-4 text-xs font-extrabold text-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left p-4 text-xs font-extrabold text-foreground uppercase tracking-wider">
                  Rating
                </th>
                <th className="text-right p-4 text-xs font-extrabold text-foreground uppercase tracking-wider pr-6">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-12 text-center text-muted-foreground italic"
                  >
                    No support tickets found
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr
                    key={ticket._id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-primary font-bold mb-1 opacity-70">
                          #{ticket.ticketNumber}
                        </span>
                        <p className="text-sm font-bold text-foreground line-clamp-1 max-w-[240px]">
                          {ticket.subject}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7 border border-border">
                          <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                            {ticket.user?.fullName?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-foreground">
                          {ticket.user?.fullName}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-xs font-medium text-muted-foreground whitespace-nowrap">
                      {format(new Date(ticket.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="p-4">
                      {ticket.rating && Number(ticket.rating) > 0 ? (
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < Number(ticket.rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted/30"
                              }`}
                            />
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground/30">-</span>
                      )}
                    </td>
                    <td className="p-4 text-right pr-6">
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(ticket)}
                          className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10 hover:text-primary"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EnquiryChatModal
        enquiry={selectedTicket}
        open={chatOpen}
        onOpenChange={setChatOpen}
      />
    </div>
  );
}



function StatusBadge({ status }: { status: string }) {
  const s = status?.toLowerCase();
  const styles =
    {
      open: "bg-blue-100 text-blue-700",
      in_progress: "bg-indigo-100 text-indigo-700",
      resolved: "bg-emerald-100 text-emerald-700",
    }[s] || "bg-slate-100 text-slate-700";

  return (
    <Badge
      className={`${styles} border-none font-extrabold text-[10px] uppercase px-2 py-0.5 rounded-full`}
    >
      {status?.replace("_", " ")}
    </Badge>
  );
}
