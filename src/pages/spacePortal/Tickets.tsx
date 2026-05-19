import { useState, useEffect, useMemo, useCallback } from "react";
import { Eye, Star, MessageSquare, Clock, CheckCircle2, Zap, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [activeTab, setActiveTab] = useState("inprogress");
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { socket } = useSocket();

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, categoryFilter, query]);

  const fetchTickets = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await partnerTicketService.getPartnerTickets(1, 100);
      if (res.success && res.data) {
        setTickets(res.data.tickets || []);
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

    const handleTicketUpdate = (data: any) => {
      console.log("Ticket updated socket event received:", data);
      fetchTickets(true); // Silent refresh
    };

    socket.on("ticket_updated", handleTicketUpdate);

    return () => {
      socket.off("partner_new_ticket", handleNewTicket);
      socket.off("ticket_updated", handleTicketUpdate);
    };
  }, [socket, fetchTickets]);

  // Add polling for data synchronization
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Polling tickets for space partner...");
      fetchTickets(true); // Silent refresh every 5 seconds
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchTickets]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    tickets.forEach(t => {
      if (t.category) cats.add(t.category);
    });
    return Array.from(cats);
  }, [tickets]);

  const stats = useMemo(() => {
    const total = tickets.length;
    const inProgress = tickets.filter((t) => {
      const s = (t.status || "").toLowerCase();
      return s === "open" || s === "in_progress" || s === "escalated";
    }).length;
    
    const resolved = tickets.filter((t) => {
      const s = (t.status || "").toLowerCase();
      return s === "resolved" || s === "closed";
    }).length;

    // Dynamic Avg Response Time calculation
    let avgTimeStr = "0.0 hrs";
    const ticketsForStats = tickets.filter(t => {
      const hasReply = t.messages && t.messages.some(m => m.sender !== 'user');
      const isResolved = (t.status || "").toLowerCase() === "resolved" || t.resolvedAt;
      return hasReply || isResolved;
    });

    if (ticketsForStats.length > 0) {
      const totalDiff = ticketsForStats.reduce((acc, t) => {
        let responseTime = 0;
        const staffMessages = (t.messages || []).filter(m => m.sender !== 'user');

        if (staffMessages.length > 0) {
          const firstStaffMessage = staffMessages.sort((a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          )[0];
          responseTime = new Date(firstStaffMessage.createdAt).getTime() - new Date(t.createdAt).getTime();
        } else if (t.resolvedAt) {
          responseTime = new Date(t.resolvedAt).getTime() - new Date(t.createdAt).getTime();
        }

        return acc + Math.max(0, responseTime);
      }, 0);

      const avgMs = totalDiff / ticketsForStats.length;
      const totalMinutes = Math.round(avgMs / 60000);

      if (totalMinutes < 60) {
        avgTimeStr = `${totalMinutes} min${totalMinutes !== 1 ? "s" : ""}`;
      } else {
        const hours = (totalMinutes / 60).toFixed(1);
        avgTimeStr = `${hours} hr${Number(hours) !== 1 ? "s" : ""}`;
      }
    }

    return { total, inProgress, resolved, avgResponse: avgTimeStr };
  }, [tickets]);
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const q = query.toLowerCase();
      const status = (t.status || "").toUpperCase();
      const matchesQuery =
        t.subject.toLowerCase().includes(q) ||
        t.ticketNumber.toLowerCase().includes(q) ||
        (t.user?.fullName || "").toLowerCase().includes(q);

      const matchesCategory =
        categoryFilter === "ALL" ? true : t.category === categoryFilter;

      const matchesTab =
        activeTab === "inprogress"
          ? (status === "OPEN" || status === "IN_PROGRESS" || status === "ESCALATED")
          : (status === "RESOLVED" || status === "CLOSED");

      return matchesQuery && matchesCategory && matchesTab;
    });
  }, [tickets, query, categoryFilter, activeTab]);

  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTickets.slice(start, start + itemsPerPage);
  }, [filteredTickets, currentPage]);

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

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
        <h1 className="text-3xl font-extrabold text-[#35503F] tracking-tight">
          Tickets
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage and track client support tickets and enquiries
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white/40 dark:bg-white/5 backdrop-blur-sm border border-[#2D3F33]/15 dark:border-white/10 rounded-2xl p-6 flex flex-col justify-between min-h-[105px] hover:shadow-md transition-all">
          <p className="text-3xl font-extrabold text-[#0D1B2A] dark:text-white mb-1.5 leading-none">
            {stats.total}
          </p>
          <p className="text-sm font-medium text-[#7A8A81] dark:text-gray-400">
            Total Tickets
          </p>
        </div>
        <div className="bg-white/40 dark:bg-white/5 backdrop-blur-sm border border-[#2D3F33]/15 dark:border-white/10 rounded-2xl p-6 flex flex-col justify-between min-h-[105px] hover:shadow-md transition-all">
          <p className="text-3xl font-extrabold text-[#0D1B2A] dark:text-white mb-1.5 leading-none">
            {stats.inProgress}
          </p>
          <p className="text-sm font-medium text-[#7A8A81] dark:text-gray-400">
            In Progress
          </p>
        </div>
        <div className="bg-white/40 dark:bg-white/5 backdrop-blur-sm border border-[#2D3F33]/15 dark:border-white/10 rounded-2xl p-6 flex flex-col justify-between min-h-[105px] hover:shadow-md transition-all">
          <p className="text-3xl font-extrabold text-[#0D1B2A] dark:text-white mb-1.5 leading-none">
            {stats.resolved}
          </p>
          <p className="text-sm font-medium text-[#7A8A81] dark:text-gray-400">
            Resolved
          </p>
        </div>
        <div className="bg-white/40 dark:bg-white/5 backdrop-blur-sm border border-[#2D3F33]/15 dark:border-white/10 rounded-2xl p-6 flex flex-col justify-between min-h-[105px] hover:shadow-md transition-all">
          <p className="text-3xl font-extrabold text-[#0D1B2A] dark:text-white mb-1.5 leading-none">
            {stats.avgResponse}
          </p>
          <p className="text-sm font-medium text-[#7A8A81] dark:text-gray-400">
            Avg Response Time
          </p>
        </div>
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
              Resolved
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
                  Category
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
              {paginatedTickets.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="p-12 text-center text-muted-foreground italic"
                  >
                    No support tickets found
                  </td>
                </tr>
              ) : (
                paginatedTickets.map((ticket) => (
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
                        <div className="h-9 w-9 rounded-lg border border-border overflow-hidden flex-shrink-0 bg-slate-50">
                          {ticket.user?.profilePicture ? (
                            <img 
                              src={ticket.user.profilePicture.startsWith('http') ? ticket.user.profilePicture : `${import.meta.env.VITE_API_URL || ''}${ticket.user.profilePicture}`} 
                              alt={ticket.user?.fullName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs bg-primary/10 text-primary font-bold">
                              {ticket.user?.fullName?.[0] || "U"}
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {ticket.user?.fullName}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary" className="text-[10px] uppercase tracking-wider font-bold bg-slate-100 text-slate-600 border-none rounded-lg px-2 py-1 whitespace-nowrap">
                        {ticket.category?.replace('_', ' ') || 'Other'}
                      </Badge>
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
                              className={`w-3 h-3 ${i < Number(ticket.rating)
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
            <div className="text-xs text-muted-foreground font-medium">
              Showing <span className="text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
              <span className="text-foreground">
                {Math.min(currentPage * itemsPerPage, filteredTickets.length)}
              </span>{" "}
              of <span className="text-foreground">{filteredTickets.length}</span> tickets
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-8 text-xs font-bold rounded-lg"
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Button
                    key={i + 1}
                    variant={currentPage === i + 1 ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(i + 1)}
                    className={`h-8 w-8 p-0 text-xs font-bold rounded-lg ${currentPage === i + 1 ? "bg-[#164e4e] hover:bg-[#164e4e]/90" : ""
                      }`}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-8 text-xs font-bold rounded-lg"
              >
                Next
              </Button>
            </div>
          </div>
        )}
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
