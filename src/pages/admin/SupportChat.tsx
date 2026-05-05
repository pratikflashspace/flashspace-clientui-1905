import React, { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Send,
  User,
  Bot,
  Search,
  MessageSquare,
  Headphones,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { ChatSkeleton } from "@/components/ui/skeleton-loaders";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavItems";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { adminService, AdminTicketData } from "@/services/admin.service";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function SupportChat() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [tickets, setTickets] = useState<AdminTicketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageInput, setMessageInput] = useState("");
  const [takenOverTickets, setTakenOverTickets] = useState<Set<string>>(
    new Set(),
  );
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const activeTicket = tickets.find((t) => t._id === activeTicketId);

  // Admin has taken over if they explicitly clicked Take Over OR if there's already an admin message in the chat
  const hasTakenOver = activeTicketId
    ? takenOverTickets.has(activeTicketId) ||
      (activeTicket?.messages?.some(
        (m) => m.sender === "admin" || m.sender === "support",
      ) ??
        false)
    : false;

  const fetchTickets = async () => {
    try {
      const response = await adminService.getAllTickets({ limit: 100 });
      if (response.success && response.data) {
        setTickets(response.data.tickets);
        if (!activeTicketId && response.data.tickets.length > 0) {
          setActiveTicketId(response.data.tickets[0]._id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch tickets", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Socket Listener
  useEffect(() => {
    if (!socket) return;

    socket.emit("join_admin_feed");

    if (activeTicketId) {
      socket.emit("join_ticket", activeTicketId);
    }

    const handleNewMessage = (data: { ticketId: string; message: any }) => {
      setTickets((prev) =>
        prev.map((t) => {
          if (t._id === data.ticketId) {
            const exists = t.messages.some(
              (m) =>
                new Date(m.createdAt).getTime() ===
                  new Date(data.message.createdAt).getTime() &&
                m.message === data.message.message,
            );
            if (exists) return t;

            return {
              ...t,
              messages: [...t.messages, data.message],
              updatedAt: new Date().toISOString(),
            };
          }
          return t;
        }),
      );

      if (activeTicketId === data.ticketId) {
        scrollToBottom();
      }
    };

    const handleTicketUpdated = (data: { ticketId: string; ticket: any }) => {
      setTickets((prev) =>
        prev.map((t) => (t._id === data.ticketId ? data.ticket : t)),
      );
    };

    const handleNewTicket = (ticket: any) => {
      setTickets((prev) => [ticket, ...prev]);
      toast.success(`New Ticket: ${ticket.subject}`, { icon: "🎫" });
    };

    socket.on("new_message", handleNewMessage);
    socket.on("ticket_updated", handleTicketUpdated);
    socket.on("new_ticket_created", handleNewTicket);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("ticket_updated", handleTicketUpdated);
      socket.off("new_ticket_created", handleNewTicket);
    };
  }, [socket, activeTicketId]);

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeTicketId, activeTicket?.messages]);

  const handleTakeOver = async () => {
    if (!activeTicketId) return;
    const takeoverMessage =
      "Hi, I'm taking over this chat. Let me review your request...";
    try {
      // Use the new tap-in endpoint which also sends a system message
      await adminService.replyToTicket(
        activeTicketId,
        "[Admin joined the conversation]",
      );
      setTakenOverTickets((prev) => new Set(prev).add(activeTicketId));
      toast.success("You have tapped in to the chat");
    } catch (error) {
      console.error("Failed to tap in", error);
      toast.error("Failed to tap in to chat");
    }
  };

  const handleSendMessage = async () => {
    if (!activeTicketId || !messageInput.trim()) return;
    try {
      await adminService.replyToTicket(activeTicketId, messageInput);
      setMessageInput("");
    } catch (error) {
      console.error("Failed to send message", error);
      toast.error("Failed to send message");
    }
  };

  const handleResolve = async () => {
    if (!activeTicketId) return;
    try {
      await adminService.resolveTicket(activeTicketId);
      toast.success("Ticket resolved");
    } catch (error) {
      console.error("Failed to resolve", error);
      toast.error("Failed to resolve ticket");
    }
  };

  // Filter tickets based on search
  const filteredTickets = tickets.filter(
    (t) =>
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.ticketNumber?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Sort tickets: Open/In Progress first, then by date
  filteredTickets.sort((a, b) => {
    const score = (status: string) => {
      if (status === "open") return 3;
      if (status === "in_progress") return 2;

      return 0;
    };
    const scoreDiff = score(b.status) - score(a.status);
    if (scoreDiff !== 0) return scoreDiff;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "open":
      case "in_progress":

      case "active":
        return "default";
      case "resolved":
      case "closed":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-50 text-red-600 border-red-200";
      case "in_progress":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "resolved":
      case "closed":
        return "bg-green-50 text-green-600 border-green-200";

      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const activeChatsCount = tickets.filter(
    (t) => t.status === "open" || t.status === "in_progress",
  ).length;
  const waitingCount = tickets.filter(
    (t) => t.status === "open" && !takenOverTickets.has(t._id),
  ).length;

  // ── Role badge config ────────────────────────────────────────────
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
    admin: {
      bg: "bg-teal-100",
      text: "text-teal-700",
      label: "Admin",
      dot: "bg-teal-400",
    },
    partner: {
      bg: "bg-amber-100",
      text: "text-amber-700",
      label: "Space Partner",
      dot: "bg-amber-400",
    },
    affiliate: {
      bg: "bg-orange-100",
      text: "text-orange-700",
      label: "Affiliate",
      dot: "bg-orange-400",
    },
    support: {
      bg: "bg-purple-100",
      text: "text-purple-700",
      label: "AI Support",
      dot: "bg-purple-400",
    },
  };

  const getMsgIdentifier = (
    sender: string,
    ticket: AdminTicketData,
    adminEmail?: string,
  ): string => {
    if (sender === "user")
      return ticket.user?.email || ticket.user?.fullName || "";
    if (sender === "admin") return adminEmail || "admin@flashspace.io";
    if (sender === "affiliate") return "affiliate@flashspace.io";
    if (sender === "partner") return "partner@flashspace.io";
    return "AI · flashspace.io";
  };

  const [showMobileList, setShowMobileList] = useState(true);

  useEffect(() => {
    if (activeTicketId) {
      setShowMobileList(false);
    }
  }, [activeTicketId]);

  if (loading) {
    return (
      <DashboardLayout
        portalName="FlashSpace Admin"
        portalDescription="Complete platform management"
        navItems={ADMIN_NAV_ITEMS}
      >
        <div className="mb-6">
          <div className="h-10 w-64 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-96 bg-gray-100 rounded" />
        </div>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 sm:h-24 bg-white border border-gray-100 rounded-xl" />
          ))}
        </div>
        <ChatSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      portalName="FlashSpace Admin"
      portalDescription="Complete platform management"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
          Support <span className="text-primary italic">Chats</span>
        </h1>
        <p className="text-sm md:text-muted-foreground mt-1 md:mt-2">
          Manage live chats and take over from AI when needed
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div className="bg-background border border-border rounded-xl p-3 md:p-4 shadow-sm">
          <p className="text-lg md:text-xl font-extrabold text-foreground">
            {tickets.length}
          </p>
          <p className="text-[10px] md:text-sm text-muted-foreground font-medium uppercase tracking-wider">Active</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-3 md:p-4 shadow-sm">
          <p className="text-lg md:text-xl font-extrabold text-yellow-600">
            {waitingCount}
          </p>
          <p className="text-[10px] md:text-sm text-muted-foreground font-medium uppercase tracking-wider">Waiting</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-3 md:p-4 shadow-sm">
          <p className="text-lg md:text-xl font-extrabold text-green-600">89%</p>
          <p className="text-[10px] md:text-sm text-muted-foreground font-medium uppercase tracking-wider">AI Res</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-3 md:p-4 shadow-sm">
          <p className="text-lg md:text-xl font-extrabold text-foreground">2.3m</p>
          <p className="text-[10px] md:text-sm text-muted-foreground font-medium uppercase tracking-wider">SLA</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4 h-[calc(100vh-280px)] min-h-[500px] lg:h-[700px]">
        {/* Chat List */}
        <div className={`bg-background border border-border rounded-2xl overflow-hidden flex flex-col shadow-sm ${!showMobileList ? "hidden lg:flex" : "flex"}`}>
          <div className="p-4 border-b border-border bg-gray-50/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search chats..."
                className="pl-10 h-10 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-2">
              {filteredTickets.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  No active chats
                </div>
              ) : (
                filteredTickets.map((ticket) => (
                  <div
                    key={ticket._id}
                    onClick={() => {
                      setActiveTicketId(ticket._id);
                      setShowMobileList(false);
                    }}
                    className={`group p-4 rounded-xl cursor-pointer transition-all border ${
                      activeTicketId === ticket._id
                        ? "bg-teal-50 border-teal-100 shadow-sm ring-1 ring-teal-100"
                        : "hover:bg-gray-50 border-transparent"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-9 w-9 ring-2 ring-background shrink-0">
                          {ticket.user?.profilePicture && (
                            <AvatarImage src={ticket.user.profilePicture} alt={ticket.user.fullName} className="object-cover" />
                          )}
                          <AvatarFallback className="text-[10px] font-black bg-gray-100 text-gray-600">
                            {ticket.user?.fullName
                              ?.substring(0, 2)
                              .toUpperCase() || "US"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <h4
                            className={`text-sm font-bold truncate ${
                              activeTicketId === ticket._id
                                ? "text-teal-900"
                                : "text-gray-900"
                            }`}
                          >
                            {ticket.user?.fullName || "Unknown User"}
                          </h4>
                          <p
                            className={`text-[10px] md:text-xs truncate mt-0.5 font-medium ${
                              activeTicketId === ticket._id
                                ? "text-teal-600"
                                : "text-gray-500"
                            }`}
                          >
                            {ticket.subject}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold ml-2 shrink-0">
                        {format(
                          new Date(ticket.updatedAt || ticket.createdAt),
                          "h:mm a",
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-3 pl-[48px]">
                      <span
                        className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border border-white shadow-sm ${getStatusColor(ticket.status)}`}
                      >
                        {ticket.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Window */}
        <div className={`lg:col-span-3 bg-background border border-border rounded-2xl overflow-hidden flex flex-col shadow-sm ${showMobileList ? "hidden lg:flex" : "flex"}`}>
          {activeTicket ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setShowMobileList(true)}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-500 -ml-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <Avatar className="h-10 w-10 ring-2 ring-gray-100">
                    {activeTicket.user?.profilePicture && (
                      <AvatarImage src={activeTicket.user.profilePicture} alt={activeTicket.user.fullName} className="object-cover" />
                    )}
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {activeTicket.user?.fullName
                        ?.substring(0, 2)
                        .toUpperCase() || "US"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 truncate max-w-[120px] sm:max-w-[200px]">
                      {activeTicket.user?.fullName || "Unknown User"}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                      ID: {activeTicket.ticketNumber}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {activeTicket.status !== "resolved" &&
                    activeTicket.status !== "closed" &&
                    !hasTakenOver && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleTakeOver}
                        className="h-9 px-3 text-[10px] font-black uppercase tracking-wider rounded-xl hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200"
                      >
                        <Headphones className="w-3.5 h-3.5 mr-1" />
                        Tap In
                      </Button>
                    )}
                  {activeTicket.status !== "resolved" &&
                    activeTicket.status !== "closed" && (
                      <Button
                        size="sm"
                        onClick={handleResolve}
                        className="h-9 px-3 bg-green-600 hover:bg-green-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl shadow-md active:scale-95"
                      >
                        Resolved
                      </Button>
                    )}
                </div>
              </div>

              {/* Messages Area */}
              <div 
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50/30 scroll-smooth"
              >
                <div className="space-y-6">
                  {activeTicket.messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400 opacity-30">
                      <MessageSquare className="w-16 h-16 mb-2" />
                      <p className="font-bold">No messages yet.</p>
                    </div>
                  )}

                  {activeTicket.messages.map((msg, idx) => {
                    const isAdmin = msg.sender === "admin";
                    const isSupport = msg.sender === "support";
                    const isMine =
                      msg.sender === "admin" || msg.sender === "support";
                    const badge = ROLE_BADGE[msg.sender] || ROLE_BADGE.support;
                    const identifier = getMsgIdentifier(
                      msg.sender,
                      activeTicket,
                      user?.email,
                    );

                    return (
                      <div
                        key={idx}
                        className={`flex ${isMine ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                      >
                        <div className="max-w-[85%] sm:max-w-[70%]">
                          <div
                            className={`p-4 rounded-2xl shadow-sm relative group ${
                              isAdmin
                                ? "bg-gray-900 text-white rounded-tr-none"
                                : isSupport
                                  ? "bg-white text-gray-800 border-2 border-primary/10 rounded-tr-none"
                                  : msg.sender === "affiliate"
                                    ? "bg-white text-gray-800 border-2 border-orange-100 rounded-tl-none"
                                    : "bg-white text-gray-800 border-2 border-gray-100 rounded-tl-none shadow-gray-200/50"
                            }`}
                          >
                            <div
                              className={`flex items-center gap-1.5 mb-2 ${isMine ? "flex-row-reverse" : ""}`}
                            >
                              <span
                                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                                  isAdmin
                                    ? "bg-white/10 text-white"
                                    : isSupport
                                      ? "bg-primary/5 text-primary"
                                      : "bg-blue-50 text-blue-600"
                                }`}
                              >
                                <span
                                  className={`w-1 h-1 rounded-full shrink-0 ${isAdmin ? "bg-white" : badge.dot}`}
                                />
                                {badge.label}
                              </span>
                              {identifier && (
                                <span
                                  className={`text-[9px] font-bold truncate max-w-[120px] ${
                                    isAdmin
                                      ? "text-white/40"
                                      : isSupport
                                        ? "text-primary/40"
                                        : "text-gray-400"
                                  }`}
                                >
                                  {identifier}
                                </span>
                              )}
                            </div>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                              {msg.message}
                            </p>
                          </div>
                          <span
                            className={`text-[9px] text-gray-400 mt-1.5 block font-bold px-1 ${isMine ? "text-right" : ""}`}
                          >
                            {format(new Date(msg.createdAt), "h:mm a")}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Input Area */}
              {activeTicket.status !== "resolved" &&
              activeTicket.status !== "closed" ? (
                hasTakenOver ? (
                  <div className="p-4 border-t border-border bg-white shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
                    <div className="flex gap-2 max-w-4xl mx-auto">
                      <Input
                        placeholder="Type your message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                        className="flex-1 rounded-xl h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all text-sm font-medium"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim()}
                        className="h-11 w-11 p-0 rounded-xl bg-gray-900 hover:bg-black text-white shadow-lg active:scale-95 transition-all"
                      >
                        <Send className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-amber-50 border-t border-amber-100/50 flex flex-col items-center gap-2">
                    <p className="text-amber-800 text-xs font-bold uppercase tracking-widest text-center">
                      AI is handling this chat
                    </p>
                    <Button
                      onClick={handleTakeOver}
                      size="sm"
                      className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider px-6 h-9 transition-all shadow-md active:scale-95"
                    >
                      Tap In Now
                    </Button>
                  </div>
                )
              ) : (
                <div className="p-5 bg-gray-50 border-t border-border text-center text-gray-500 text-[10px] font-black uppercase tracking-widest">
                  Ticket Closed
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 h-screen max-h-[700px] text-gray-300">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100 shadow-inner">
                <Headphones className="w-10 h-10 opacity-20" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-1">Select a conversation</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Choose a ticket from the list</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
