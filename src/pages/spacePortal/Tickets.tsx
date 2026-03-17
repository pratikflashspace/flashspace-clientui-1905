import { useState, useEffect, useMemo, useCallback } from "react";
import { Eye, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { toast } from "sonner";
import partnerTicketService, {
  PartnerTicketData,
} from "@/services/spacePortal/partnerTicket.service";
import SearchBar from "@/components/ui/SpacePartner/SearchBar";
import SelectBox from "@/components/ui/SpacePartner/SelectionBox";
import { useSocket } from "@/contexts/SocketContext";

export default function Tickets() {
  const [tickets, setTickets] = useState<PartnerTicketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
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

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const q = query.toLowerCase();
      const matchesQuery =
        t.subject.toLowerCase().includes(q) ||
        t.ticketNumber.toLowerCase().includes(q) ||
        t.user?.fullName.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "ALL" ? true : t.status === statusFilter;
      const matchesPriority =
        priorityFilter === "ALL" ? true : t.priority === priorityFilter;

      return matchesQuery && matchesStatus && matchesPriority;
    });
  }, [tickets, query, statusFilter, priorityFilter]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4" />
        <p className="text-muted-foreground font-medium">
          Loading ticket system...
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl">
          Support <span className="text-primary italic">Tickets</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Review and resolve support requests from your clients
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search by ID, subject, or client name..."
        />
        <div className="flex gap-3">
          <SelectBox
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { label: "All Status", value: "ALL" },
              { label: "Open", value: "OPEN" },
              { label: "In Progress", value: "IN_PROGRESS" },
              { label: "Resolved", value: "RESOLVED" },
              { label: "Closed", value: "CLOSED" },
            ]}
          />
          <SelectBox
            value={priorityFilter}
            onChange={setPriorityFilter}
            options={[
              { label: "All Priority", value: "ALL" },
              { label: "Low", value: "LOW" },
              { label: "Medium", value: "MEDIUM" },
              { label: "High", value: "HIGH" },
              { label: "Urgent", value: "URGENT" },
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
                  Priority
                </th>
                <th className="text-left p-4 text-xs font-extrabold text-foreground uppercase tracking-wider">
                  Date
                </th>
                <th className="text-left p-4 text-xs font-extrabold text-foreground uppercase tracking-wider">
                  Status
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
                    <td className="p-4">
                      <PriorityBadge priority={ticket.priority} />
                    </td>
                    <td className="p-4 text-xs font-medium text-muted-foreground whitespace-nowrap">
                      {format(new Date(ticket.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="p-4 text-right pr-6">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10 hover:text-primary"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-lg"
                        >
                          <MoreVertical className="w-4 h-4" />
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
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const p = priority?.toLowerCase();
  const styles =
    {
      urgent: "bg-rose-100 text-rose-700",
      high: "bg-orange-100 text-orange-700",
      medium: "bg-amber-100 text-amber-700",
      low: "bg-slate-100 text-slate-700",
    }[p] || "bg-slate-100 text-slate-700";

  return (
    <Badge
      className={`${styles} border-none font-extrabold text-[10px] uppercase px-2 py-0.5 rounded-full`}
    >
      {priority}
    </Badge>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = status?.toLowerCase();
  const styles =
    {
      open: "bg-blue-100 text-blue-700",
      in_progress: "bg-indigo-100 text-indigo-700",
      resolved: "bg-emerald-100 text-emerald-700",
      closed: "bg-slate-100 text-slate-700",
    }[s] || "bg-slate-100 text-slate-700";

  return (
    <Badge
      className={`${styles} border-none font-extrabold text-[10px] uppercase px-2 py-0.5 rounded-full`}
    >
      {status?.replace("_", " ")}
    </Badge>
  );
}
