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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import partnerTicketService, {
  PartnerTicketData,
} from "@/services/spacePortal/partnerTicket.service";
import { fetchPartnerActiveRequests } from "@/services/spacePortal/spacePartner.service";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

const getPriorityBadge = (priority: string) => {
  const p = (priority || "low").toLowerCase();
  switch (p) {
    case "high":
    case "urgent":
      return <Badge variant="destructive">High</Badge>;
    case "medium":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200">
          Medium
        </Badge>
      );
    case "low":
    default:
      return (
        <Badge
          variant="secondary"
          className="bg-slate-100 text-slate-600 border-slate-200"
        >
          Low
        </Badge>
      );
  }
};

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
    case "escalated":
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
  const [messageInput, setMessageInput] = useState("");
  const [hasTakenOver, setHasTakenOver] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeTicket) {
      scrollToBottom();
    }
  }, [activeTicket?.messages]);

  const loadData = async () => {
    setLoading(true);
    try {
      const ticketRes = await partnerTicketService.getPartnerTickets(1, 100);
      if (ticketRes.success && ticketRes.data) {
        setTickets(ticketRes.data.tickets);
      }

      const taskRes: any = await fetchPartnerActiveRequests();
      if (taskRes?.success) {
        setTasks(taskRes.data);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
      toast({
        title: "Error",
        description: "Failed to load tickets and tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTakeOver = () => {
    setHasTakenOver(true);
    toast({
      title: "Joined Chat",
      description: "You have joined the conversation with the client.",
    });
  };

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
    if (!activeTicket || !messageInput.trim()) return;
    try {
      const res = await partnerTicketService.replyToTicket(
        activeTicket._id,
        messageInput.trim(),
      );
      if (res.success) {
        // Optimistically add the new message to the local active ticket
        const newMessage = {
          _id: Date.now().toString(), // temporary id
          sender: "partner",
          message: messageInput.trim(),
          createdAt: new Date().toISOString(),
        };
        setActiveTicket((prev) =>
          prev
            ? {
                ...prev,
                messages: [...prev.messages, newMessage],
              }
            : null,
        );
        setMessageInput("");
        // Refresh the ticket list in the background (optional)
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
          <h1 className="text-4xl">
            Tickets & <span className="text-primary italic">Tasks</span>
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
        <div className="bg-white dark:bg-[#0f0f0f] border border-[#2D3F33]/10 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <p className="text-2xl font-bold text-[#164e4e] dark:text-white">
            {
              tickets.filter((t) => (t.status || "").toLowerCase() === "open")
                .length
            }
          </p>
          <p className="text-sm text-[#164e4e]/70 dark:text-gray-400">
            Open Tickets
          </p>
        </div>
        <div className="bg-white dark:bg-[#0f0f0f] border border-[#2D3F33]/10 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <p className="text-2xl font-bold text-[#164e4e] dark:text-white">
            {
              tickets.filter((t) =>
                ["in_progress", "escalated"].includes(
                  (t.status || "").toLowerCase(),
                ),
              ).length
            }
          </p>
          <p className="text-sm text-[#164e4e]/70 dark:text-gray-400">
            In Progress
          </p>
        </div>
        <div className="bg-white dark:bg-[#0f0f0f] border border-[#2D3F33]/10 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <p className="text-2xl font-bold text-[#164e4e] dark:text-white">
            {tasks.length}
          </p>
          <p className="text-sm text-[#164e4e]/70 dark:text-gray-400">
            Pending Tasks
          </p>
        </div>
        <div className="bg-white dark:bg-[#0f0f0f] border border-[#2D3F33]/10 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <p className="text-2xl font-bold text-[#164e4e] dark:text-white">
            4.2 hrs
          </p>
          <p className="text-sm text-[#164e4e]/70 dark:text-gray-400">
            Avg Response
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
                      Priority
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
                    <th className="text-right p-5 text-xs font-bold text-[#164e4e]/60 dark:text-gray-400 uppercase tracking-widest">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2D3F33]/5 dark:divide-white/10">
                  {tickets.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="p-12 text-center text-[#164e4e]/50 dark:text-gray-500 italic"
                      >
                        No support tickets found
                      </td>
                    </tr>
                  ) : (
                    tickets.map((ticket) => (
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
                        <td className="p-5 text-sm text-[#164e4e]/80 dark:text-gray-300 font-medium">
                          {ticket.user?.fullName}
                        </td>
                        <td className="p-5">
                          {getPriorityBadge(ticket.priority)}
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8 border border-[#2D3F33]/10">
                              <AvatarFallback className="text-[10px] bg-[#2D3F33]/10 text-[#2D3F33] dark:text-[#FDE68A] font-bold uppercase">
                                {ticket.user?.fullName
                                  ?.split(" ")
                                  .map((n) => n[0])
                                  .join("") || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-[#164e4e]/70 dark:text-gray-400 font-semibold">
                              Partner
                            </span>
                          </div>
                        </td>
                        <td className="p-5 text-sm text-[#164e4e]/70 dark:text-gray-400 font-medium">
                          {format(new Date(ticket.createdAt), "MMM d, yyyy")}
                        </td>
                        <td className="p-5">{getStatusBadge(ticket.status)}</td>
                        <td className="p-5 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setActiveTicket(ticket)}
                            className="rounded-xl text-[#2D3F33] dark:text-[#FDE68A] hover:bg-[#2D3F33]/5 dark:hover:bg-white/5"
                          >
                            <Eye className="w-5 h-5" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Chat Panel (only shown when a ticket is selected) */}
          {activeTicket ? (
            <div className="mt-8 bg-white dark:bg-[#0f0f0f] border border-[#2D3F33]/10 dark:border-white/10 rounded-2xl overflow-hidden shadow-lg flex flex-col h-[600px]">
              {/* Messages Header */}
              <div className="p-4 border-b border-[#2D3F33]/5 dark:border-white/10 bg-gray-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
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
                    <p className="text-xs text-[#164e4e]/60">
                      {activeTicket.user?.fullName}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {activeTicket.status !== "resolved" &&
                    activeTicket.status !== "closed" &&
                    !hasTakenOver && (
                      <Button
                        size="sm"
                        onClick={handleTakeOver}
                        className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl"
                      >
                        🎯 Tap In
                      </Button>
                    )}
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
                <div ref={messagesEndRef} />
              </div>

              {/* Messages Input Area */}
              {activeTicket.status !== "resolved" &&
              activeTicket.status !== "closed" ? (
                hasTakenOver ? (
                  <div className="p-6 bg-white border-t border-gray-100">
                    <div className="flex items-center gap-4 bg-gray-50 p-2 pr-2 rounded-2xl border border-gray-200 focus-within:ring-2 focus-within:ring-[#2D3F33]/10 transition-all">
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                        placeholder="Type your reply..."
                        className="flex-1 bg-transparent border-none focus:outline-none px-4 text-sm text-gray-700 placeholder:text-gray-400"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim()}
                        className="bg-[#2D3F33] text-[#FDE68A] hover:bg-[#2D3F33]/90 rounded-xl"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-amber-50 border-t border-amber-100 text-center text-amber-700 text-sm font-medium">
                    Click <strong>Tap In</strong> to start chatting with this
                    user.
                  </div>
                )
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
