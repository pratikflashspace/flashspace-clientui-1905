import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  User,
  MessageSquare,
  Send,
  Headphones,
  Star,
  Paperclip,
  X,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import partnerTicketService, {
  PartnerTicketData,
} from "@/services/spacePortal/partnerTicket.service";
import { fetchPartnerActiveRequests } from "@/services/spacePortal/spacePartner.service";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { useSocket } from "@/contexts/SocketContext";
import { useMemo } from "react";
import SearchBar from "@/components/ui/SpacePartner/SearchBar";
import SelectBox from "@/components/ui/SpacePartner/SelectionBox";



const getStatusBadge = (status: string) => {
  const s = (status || "open").toLowerCase();
  switch (s) {
    case "open":
    case "pending":
      return (
        <Badge variant="outline" className="text-red-600 border-red-200">
          <AlertCircle className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    case "in_progress":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">
          <Clock className="w-3 h-3 mr-1" />
          In Progress
        </Badge>
      );
    case "resolved":
    case "completed":
    case "closed":
    case "accepted":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Completed
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function TicketsAndTasks() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<PartnerTicketData[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState<PartnerTicketData | null>(
    null,
  );
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [messageInput, setMessageInput] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, query]);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { socket } = useSocket();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeTicket) {
      scrollToBottom();
    }
  }, [activeTicket?.messages]);

  const loadData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const ticketRes = await partnerTicketService.getPartnerTickets(1, 100);
      if (ticketRes.success && ticketRes.data) {
        setTickets(ticketRes.data.tickets || []);
      }


      const taskRes: any = await fetchPartnerActiveRequests();
      if (taskRes?.success) {
        setTasks(taskRes.data);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
      if (!silent) {
        toast({
          title: "Error",
          description: "Failed to load tickets and tasks",
          variant: "destructive",
        });
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Add polling for data synchronization
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Polling tickets and tasks for space partner...");
      loadData(true); // Silent refresh every 5 seconds
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Socket listeners for list updates
  useEffect(() => {
    if (!socket) return;

    const handleUpdate = () => {
      console.log("Real-time update received via socket");
      loadData(true);
    };

    socket.on("ticket_updated", handleUpdate);
    socket.on("partner_new_ticket", handleUpdate);

    return () => {
      socket.off("ticket_updated", handleUpdate);
      socket.off("partner_new_ticket", handleUpdate);
    };
  }, [socket]);

  // Socket listeners for active chat
  useEffect(() => {
    if (!socket || !activeTicket) return;

    socket.emit("join_ticket", activeTicket._id);

    const onNewMessage = (data: { ticketId: string; message: any }) => {
      if (data.ticketId === activeTicket._id) {
        setActiveTicket((prev) => {
          if (!prev) return null;
          const exists = prev.messages.some(m => 
            new Date(m.createdAt).getTime() === new Date(data.message.createdAt).getTime() &&
            m.message === data.message.message
          );
          if (exists) return prev;
          return { ...prev, messages: [...prev.messages, data.message] };
        });
      }
    };

    const onTyping = (data: { ticketId: string; user: string }) => {
      if (data.ticketId === activeTicket._id) setTypingUser(data.user);
    };

    const onStopTyping = (data: { ticketId: string }) => {
      if (data.ticketId === activeTicket._id) setTypingUser(null);
    };

    socket.on("new_message", onNewMessage);
    socket.on("typing", onTyping);
    socket.on("stop_typing", onStopTyping);

    return () => {
      socket.off("new_message", onNewMessage);
      socket.off("typing", onTyping);
      socket.off("stop_typing", onStopTyping);
    };
  }, [socket, activeTicket?._id]);

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const q = query.toLowerCase();
      const matchesQuery =
        t.subject.toLowerCase().includes(q) ||
        t.ticketNumber.toLowerCase().includes(q) ||
        (t.user?.fullName || "").toLowerCase().includes(q);

      const matchesCategory =
        categoryFilter === "ALL" ? true : t.category?.toLowerCase() === categoryFilter.toLowerCase();

      return matchesQuery && matchesCategory;
    });
  }, [tickets, query, categoryFilter]);

  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTickets.slice(start, start + itemsPerPage);
  }, [filteredTickets, currentPage]);

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);



  const handleResolve = async () => {
    if (!activeTicket) return;
    try {
      const res = await partnerTicketService.closeTicket(activeTicket._id);
      if (res.success) {
        toast({ title: "Resolved", description: "Ticket marked as resolved." });
        loadData();
        setActiveTicket(null);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to resolve ticket.",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async () => {
    if (!activeTicket || (!messageInput.trim() && selectedFiles.length === 0)) return;
    try {
      const formData = new FormData();
      formData.append("message", messageInput.trim());
      selectedFiles.forEach(file => formData.append("attachments", file));

      const res = await partnerTicketService.replyToTicket(
        activeTicket._id,
        formData,
      );
      if (res.success) {
        // Clear inputs
        setMessageInput("");
        setSelectedFiles([]);
        if (socket) {
          socket.emit("stop_typing", { ticketId: activeTicket._id });
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        }
        
        // Refresh ticket to get official message state
        loadData();
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (val: string) => {
    setMessageInput(val);
    if (!socket || !activeTicket) return;

    socket.emit("typing", { ticketId: activeTicket._id, user: user?.fullName || "Partner" });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { ticketId: activeTicket._id });
    }, 3000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (selectedFiles.length + files.length > 5) {
        toast({ title: "Max 5 files allowed", variant: "destructive" });
        return;
      }
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (idx: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
  };

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
  }, [tickets, tasks]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[#35503F] tracking-tight">
            Tickets & <span className="text-[#4A6D56] italic">Tasks</span>
          </h1>
          <p className="text-[#164e4e]/70 dark:text-gray-400 mt-1">
            Manage your support tickets and daily team tasks
          </p>
        </div>
        <Button
          onClick={() =>
            toast({
              title: "Coming Soon",
              description: "This feature will be available shortly.",
            })
          }
          className="bg-[#2D3F33] hover:bg-[#2D3F33]/90 text-[#FDE68A] font-bold rounded-xl shadow-lg transition-all active:scale-95 px-6"
        >
          <Plus className="w-5 h-5 mr-1" />
          Create Task
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-4 mb-10">
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

      <Tabs defaultValue="tickets" className="space-y-6">
        <TabsList className="bg-[#2D3F33]/10 dark:bg-white/5 p-1 rounded-xl w-fit">
          <TabsTrigger
            value="tickets"
            className="rounded-lg px-6 py-2 font-bold data-[state=active]:bg-[#2D3F33] data-[state=active]:text-[#FDE68A] data-[state=active]:shadow-sm transition-all"
          >
            Client Tickets
          </TabsTrigger>
          <TabsTrigger
            value="tasks"
            className="rounded-lg px-6 py-2 font-bold data-[state=active]:bg-[#2D3F33] data-[state=active]:text-[#FDE68A] data-[state=active]:shadow-sm transition-all"
          >
            Team Tasks
          </TabsTrigger>
        </TabsList>

        {/* ========== TICKETS TAB ========== */}
        <TabsContent
          value="tickets"
          className="animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="Search by ID, subject, or client name..."
            />
            <div className="flex gap-3">
              <SelectBox
                value={categoryFilter}
                onChange={setCategoryFilter}
                options={[
                  { label: "All Categories", value: "ALL" },
                  { label: "Virtual Office", value: "virtual_office" },
                  { label: "Coworking", value: "coworking" },
                  { label: "Billing", value: "billing" },
                  { label: "KYC", value: "kyc" },
                  { label: "Technical", value: "technical" },
                  { label: "Mail Services", value: "mail_services" },
                  { label: "Bookings", value: "bookings" },
                  { label: "Compliance", value: "compliance" },
                  { label: "Leads", value: "leads" },
                  { label: "Other", value: "other" },
                ]}
              />
            </div>
          </div>

          {/* Tickets Table */}
          <div className="bg-white dark:bg-[#0f0f0f] border border-[#2D3F33]/10 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#fafafa] dark:bg-white/5 border-b border-[#2D3F33]/5 dark:border-white/10">
                  <tr>
                    <th className="text-left p-5 text-xs font-bold text-[#164e4e]/60 dark:text-gray-400 uppercase tracking-widest">
                      Ticket
                    </th>
                    <th className="text-left p-5 text-xs font-bold text-[#164e4e]/60 dark:text-gray-400 uppercase tracking-widest">
                      Client
                    </th>
                    <th className="text-left p-5 text-xs font-bold text-[#164e4e]/60 dark:text-gray-400 uppercase tracking-widest">
                      Category
                    </th>
                    <th className="text-left p-5 text-xs font-bold text-[#164e4e]/60 dark:text-gray-400 uppercase tracking-widest">
                      Assignee
                    </th>
                    <th className="text-left p-5 text-xs font-bold text-[#164e4e]/60 dark:text-gray-400 uppercase tracking-widest">
                      Date
                    </th>
                    <th className="text-left p-5 text-xs font-bold text-[#164e4e]/60 dark:text-gray-400 uppercase tracking-widest">
                      Status
                    </th>
                    <th className="text-left p-5 text-xs font-bold text-[#164e4e]/60 dark:text-gray-400 uppercase tracking-widest">
                      Rating
                    </th>
                    <th className="text-right p-5 text-xs font-bold text-[#164e4e]/60 dark:text-gray-400 uppercase tracking-widest">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2D3F33]/5 dark:divide-white/10">
                  {paginatedTickets.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="p-12 text-center text-[#164e4e]/40 italic"
                  >
                    No support tickets found
                  </td>
                </tr>
              ) : (
                paginatedTickets.map((ticket) => (
                      <tr
                        key={ticket._id}
                        className="hover:bg-[#fcfcfc] dark:hover:bg-white/5 transition-colors"
                      >
                        <td className="p-5">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-[#164e4e]/50 dark:text-gray-500 font-bold mb-1">
                              #{ticket.ticketNumber}
                            </span>
                            <p className="text-sm font-bold text-[#164e4e] dark:text-white truncate max-w-[200px]">
                              {ticket.subject}
                            </p>
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-2">
                            <div className="h-9 w-9 rounded-lg border border-[#164e4e]/10 overflow-hidden flex-shrink-0 bg-slate-50">
                              {ticket.user?.profilePicture ? (
                                <img 
                                  src={ticket.user.profilePicture.startsWith('http') ? ticket.user.profilePicture : `${import.meta.env.VITE_API_URL || ''}${ticket.user.profilePicture}`} 
                                  alt={ticket.user?.fullName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs bg-[#164e4e]/5 text-[#164e4e] font-bold">
                                  {ticket.user?.fullName?.[0] || "U"}
                                </div>
                              )}
                            </div>
                            <span className="text-sm text-[#164e4e]/80 dark:text-gray-300 font-medium">
                              {ticket.user?.fullName}
                            </span>
                          </div>
                        </td>
                        <td className="p-5">
                          <Badge variant="secondary" className="text-[10px] uppercase tracking-wider font-bold bg-[#2D3F33]/5 text-[#2D3F33]/70 border-none rounded-lg px-2 py-1">
                            {ticket.category?.replace('_', ' ') || 'Other'}
                          </Badge>
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8 border border-[#2D3F33]/10">
                              {ticket.assignee?.profilePicture && (
                                <AvatarImage src={ticket.assignee.profilePicture} alt={ticket.assignee.fullName} className="object-cover" />
                              )}
                              <AvatarFallback className="text-[10px] bg-[#2D3F33]/10 text-[#2D3F33] dark:text-[#FDE68A] font-bold uppercase">
                                {ticket.assignee?.fullName
                                  ?.split(" ")
                                  .map((n) => n[0])
                                  .join("") || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-xs text-[#164e4e] dark:text-white font-bold">
                                {ticket.assignee?.fullName || "Unassigned"}
                              </span>
                              {ticket.assignee?.role && (
                                <span className="text-[10px] text-[#164e4e]/60 dark:text-gray-400 font-bold uppercase tracking-wider">
                                  {ticket.assignee.role.replace('_', ' ')}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-5 text-sm text-[#164e4e]/70 dark:text-gray-400 font-medium">
                          {format(new Date(ticket.createdAt), "MMM d, yyyy")}
                        </td>
                        <td className="p-5">{getStatusBadge(ticket.status)}</td>
                        <td className="p-5">
                          {Number(ticket.rating) > 0 ? (
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
                            <span className="text-xs text-[#164e4e]/30">-</span>
                          )}
                        </td>
                        <td className="p-5 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setActiveTicket(ticket)}
                            className="rounded-xl text-[#2D3F33] dark:text-[#FDE68A] hover:bg-[#2D3F33]/5 dark:hover:bg-white/5 gap-1.5"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-[#2D3F33]/5 bg-[#2D3F33]/[0.02]">
                <div className="text-xs text-[#164e4e]/60 font-medium">
                  Showing <span className="text-[#164e4e]">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                  <span className="text-[#164e4e]">
                    {Math.min(currentPage * itemsPerPage, filteredTickets.length)}
                  </span>{" "}
                  of <span className="text-[#164e4e]">{filteredTickets.length}</span> tickets
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="h-8 text-xs font-bold rounded-lg border-[#2D3F33]/10 hover:bg-[#2D3F33]/5"
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
                        className={`h-8 w-8 p-0 text-xs font-bold rounded-lg ${
                          currentPage === i + 1 
                            ? "bg-[#2D3F33] text-[#FDE68A] hover:bg-[#2D3F33]/90" 
                            : "text-[#164e4e]/60 hover:bg-[#2D3F33]/5"
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
                    className="h-8 text-xs font-bold rounded-lg border-[#2D3F33]/10 hover:bg-[#2D3F33]/5"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Chat Panel (only shown when a ticket is selected) */}
          {activeTicket ? (
            <div className="mt-8 bg-white dark:bg-[#0f0f0f] border border-[#2D3F33]/10 dark:border-white/10 rounded-2xl overflow-hidden shadow-lg flex flex-col h-[600px]">
              {/* Messages Header */}
              <div className="p-4 border-b border-[#2D3F33]/5 dark:border-white/10 bg-gray-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    {activeTicket.user?.profilePicture && (
                      <AvatarImage src={activeTicket.user.profilePicture} alt={activeTicket.user.fullName} className="object-cover" />
                    )}
                    <AvatarFallback className="bg-[#2D3F33]/10 text-[#2D3F33]">
                      {activeTicket.user?.fullName
                        ?.substring(0, 2)
                        .toUpperCase() || "US"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-[#164e4e]">
                      {activeTicket.subject}
                    </h3>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-[#164e4e]/60">
                        {activeTicket.user?.fullName}
                      </p>
                      {activeTicket.rating && (
                        <div className="flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-[10px] font-bold text-yellow-700">{activeTicket.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {activeTicket.status !== "resolved" &&
                    activeTicket.status !== "closed" && (
                      <Button
                        size="sm"
                        onClick={handleResolve}
                        className="bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 rounded-xl"
                      >
                        Resolve
                      </Button>
                    )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setActiveTicket(null)}
                    className="rounded-xl"
                  >
                    Close Chat
                  </Button>
                </div>
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/50">
                {activeTicket.messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <MessageSquare className="w-12 h-12 mb-2 opacity-20" />
                    <p>No messages yet.</p>
                  </div>
                )}

                {activeTicket.messages.map((msg, idx) => {
                  const isPartner = msg.sender === "partner";
                  const isAdmin = msg.sender === "admin";
                  const isSupport = msg.sender === "support";
                  const isAffiliate = msg.sender === "affiliate";
                  const isRightSide = isPartner || isAdmin || isSupport;

                  const ROLE_BADGE: Record<
                    string,
                    { bg: string; text: string; label: string; dot: string }
                  > = {
                    user: {
                      bg: "bg-blue-100",
                      text: "text-blue-700",
                      label: "Client",
                      dot: "bg-blue-400",
                    },
                    partner: {
                      bg: "bg-[#2D3F33]/10",
                      text: "text-[#2D3F33]",
                      label: "You (Partner)",
                      dot: "bg-[#2D3F33]",
                    },
                    admin: {
                      bg: "bg-indigo-100",
                      text: "text-indigo-700",
                      label: "Admin",
                      dot: "bg-indigo-400",
                    },
                    affiliate: {
                      bg: "bg-amber-100",
                      text: "text-amber-700",
                      label: "Affiliate",
                      dot: "bg-amber-400",
                    },
                    support: {
                      bg: "bg-purple-100",
                      text: "text-purple-700",
                      label: "AI Support",
                      dot: "bg-purple-400",
                    },
                  };

                  const badge = ROLE_BADGE[msg.sender] || ROLE_BADGE.user;

                  const getIdentifier = (): string => {
                    if (msg.sender === "user")
                      return (
                        activeTicket.user?.email ||
                        activeTicket.user?.fullName ||
                        ""
                      );
                    if (msg.sender === "partner")
                      return user?.email || "partner@flashspace.io";
                    if (msg.sender === "admin") return "admin@flashspace.io";
                    if (msg.sender === "affiliate")
                      return "affiliate@flashspace.io";
                    return "AI · flashspace.io";
                  };

                  const getBubble = (): string => {
                    if (isPartner)
                      return "bg-[#2D3F33] text-white rounded-tr-none";
                    if (isAdmin)
                      return "bg-indigo-50 text-gray-800 border border-indigo-100 rounded-tr-none";
                    if (isSupport)
                      return "bg-purple-50 text-gray-800 border border-purple-100 rounded-tr-none";
                    if (isAffiliate)
                      return "bg-amber-50 text-gray-800 border border-amber-200 rounded-tl-none";
                    return "bg-white text-gray-800 border border-gray-200 rounded-tl-none";
                  };

                  const isSystem =
                    msg.message.startsWith("[") && msg.message.endsWith("]");
                  if (isSystem) {
                    return (
                      <div key={idx} className="flex justify-center">
                        <span className="text-[10px] text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                          {msg.message.replace(/\[|\]/g, "")}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={idx}
                      className={`flex ${isRightSide ? "justify-end" : "justify-start"}`}
                    >
                      <div className="max-w-[80%] space-y-1.5">
                        <div
                          className={`p-4 rounded-2xl shadow-sm ${getBubble()}`}
                        >
                          <div
                            className={`flex items-center gap-1.5 mb-2 ${isRightSide ? "flex-row-reverse" : ""}`}
                          >
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${badge.bg} ${badge.text}`}
                            >
                              <span
                                className={`w-1 h-1 rounded-full shrink-0 ${badge.dot}`}
                              />
                              {badge.label}
                            </span>
                            <span
                              className={`text-[10px] font-medium truncate max-w-[130px] ${isPartner ? "text-white/60" : "text-gray-400"}`}
                            >
                              {getIdentifier()}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {msg.message}
                          </p>
                          
                          {/* Attachments rendering */}
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {msg.attachments.map((url: string, i: number) => {
                                const isImg = url.match(/\.(jpg|jpeg|png|gif)$/i);
                                return (
                                  <a key={i} href={url.startsWith('http') ? url : `${import.meta.env.VITE_API_URL || ''}${url}`} target="_blank" rel="noreferrer" className="block">
                                    {isImg ? (
                                      <img src={url.startsWith('http') ? url : `${import.meta.env.VITE_API_URL || ''}${url}`} alt="attachment" className="w-20 h-20 object-cover rounded-lg border border-white/20" />
                                    ) : (
                                      <div className="flex items-center gap-2 bg-black/10 p-2 rounded-lg text-[10px] font-bold">
                                        <FileText className="w-3 h-3" /> Doc {i+1}
                                      </div>
                                    )}
                                  </a>
                                );
                              })}
                            </div>
                          )}
                        </div>
                        <span
                          className={`text-[10px] text-gray-400 block px-1 ${isRightSide ? "text-right" : ""}`}
                        >
                          {format(new Date(msg.createdAt), "h:mm a")}
                        </span>
                      </div>
                    </div>
                  );
                })}
                
                {typingUser && (
                  <div className="flex flex-col items-start gap-1 mt-2 animate-in fade-in slide-in-from-left-2 duration-300">
                    <div className="bg-white dark:bg-[#1a1a1a] border border-[#2D3F33]/10 dark:border-white/10 px-4 py-2.5 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-[#2D3F33] dark:bg-[#FDE68A] rounded-full" style={{ animation: 'typing-bounce 1s infinite' }} />
                        <div className="w-1.5 h-1.5 bg-[#2D3F33] dark:bg-[#FDE68A] rounded-full" style={{ animation: 'typing-bounce 1s infinite 0.2s' }} />
                        <div className="w-1.5 h-1.5 bg-[#2D3F33] dark:bg-[#FDE68A] rounded-full" style={{ animation: 'typing-bounce 1s infinite 0.4s' }} />
                      </div>
                      <span className="text-[10px] font-black text-[#2D3F33]/60 dark:text-gray-400 uppercase tracking-widest">
                        {typingUser} is typing...
                      </span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Messages Input Area */}
              {activeTicket.status !== "resolved" &&
              activeTicket.status !== "closed" ? (
                <div className="p-6 bg-white border-t border-gray-100 space-y-4">
                  {selectedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 px-2">
                      {selectedFiles.map((file, i) => (
                        <div key={i} className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full text-[10px] font-bold text-gray-600 border border-gray-200">
                          <span className="max-w-[120px] truncate">{file.name}</span>
                          <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => removeFile(i)} />
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-4 bg-gray-50 p-2 pr-2 rounded-2xl border border-gray-200 focus-within:ring-2 focus-within:ring-[#2D3F33]/10 transition-all relative">
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} multiple hidden accept="image/*,.pdf" />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 text-gray-400 hover:text-[#2D3F33] transition-colors"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      placeholder="Type your reply..."
                      className="flex-1 bg-transparent border-none focus:outline-none px-2 text-sm text-gray-700 placeholder:text-gray-400"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={(!messageInput.trim() && selectedFiles.length === 0)}
                      className="bg-[#2D3F33] text-[#FDE68A] hover:bg-[#2D3F33]/90 rounded-xl"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-gray-50 border-t border-gray-100 text-center text-gray-500 text-sm">
                  This query is closed.
                </div>
              )}
            </div>
          ) : (
            <div className="mt-8 bg-white dark:bg-[#0f0f0f] border border-[#2D3F33]/10 dark:border-white/10 rounded-2xl p-12 text-center text-gray-400 shadow-sm flex flex-col items-center">
              <Headphones className="w-16 h-16 mb-4 opacity-20" />
              <h3 className="text-xl font-bold text-gray-600">
                Select a ticket
              </h3>
              <p>
                Choose a ticket from the list to view details and start chatting
              </p>
            </div>
          )}
        </TabsContent>

        {/* ========== TASKS TAB ========== */}
        <TabsContent
          value="tasks"
          className="animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {tasks.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-white dark:bg-[#0f0f0f] border border-[#2D3F33]/10 dark:border-white/10 rounded-2xl">
                <p className="text-[#164e4e]/50 dark:text-gray-500 italic">
                  No pending tasks or requests
                </p>
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white dark:bg-[#0f0f0f] border border-[#2D3F33]/10 dark:border-white/10 rounded-2xl p-6 flex flex-col gap-5 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#2D3F33]/5 dark:bg-white/5 flex items-center justify-center text-[#2D3F33] dark:text-[#FDE68A] group-hover:bg-[#2D3F33] group-hover:text-[#FDE68A] transition-colors">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#164e4e] dark:text-white leading-tight mb-1">
                          {task.space || "Space Booking Request"}
                        </h4>
                        <div className="flex items-center gap-2">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[8px] font-bold text-slate-600">
                            {task.user?.avatar || "U"}
                          </div>
                          <p className="text-xs text-[#164e4e]/60 dark:text-gray-400 font-bold">
                            Requested by: {task.user?.name || "Client"}
                          </p>
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(task.status)}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#2D3F33]/5 dark:border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#164e4e]/50 dark:text-gray-500 font-bold uppercase tracking-widest mb-1">
                        Due Date
                      </span>
                      <p className="text-xs font-bold text-[#164e4e] dark:text-white">
                        {task.date || "TBD"}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() =>
                        toast({
                          title: "Coming Soon",
                          description:
                            "Reviewing requests for this space category will be enabled in the next update.",
                        })
                      }
                      className="bg-[#2D3F33] hover:bg-[#2D3F33]/90 text-[#FDE68A] rounded-xl h-8 text-xs font-bold px-4"
                    >
                      Review Request
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
