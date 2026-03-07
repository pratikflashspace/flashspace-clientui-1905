import React, { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Send,
  User,
  Bot,
  Search,
  MessageSquare,
  Headphones,
} from "lucide-react";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavItems";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeTicketId, activeTicket?.messages]);

  const handleTakeOver = async () => {
    if (!activeTicketId) return;
    const takeoverMessage =
      "Hi, I'm taking over this chat. Let me review your request...";
    try {
      await adminService.replyToTicket(activeTicketId, takeoverMessage);
      setTakenOverTickets((prev) => new Set(prev).add(activeTicketId));
      toast.success("You have taken over the chat");
    } catch (error) {
      console.error("Failed to take over", error);
      toast.error("Failed to take over chat");
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
      await adminService.closeTicket(activeTicketId);
      toast.success("Ticket closed");
    } catch (error) {
      console.error("Failed to close", error);
      toast.error("Failed to close ticket");
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
      if (status === "escalated") return 2;
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
      case "escalated":
        return "destructive";
      case "active":
        return "default";
      case "resolved":
      case "closed":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getDisplayStatus = (status: string) => {
    switch (status) {
      case "open":
        return "waiting";
      case "in_progress":
      case "escalated":
        return "active";
      case "resolved":
      case "closed":
        return "resolved";
      default:
        return status;
    }
  };

  const waitingCount = tickets.filter((t) => t.status === "open").length;

  return (
    <DashboardLayout
      portalName="FlashSpace Admin"
      portalDescription="Complete platform management"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
          Support <span className="text-primary italic">Chats</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage live chats and take over from AI when needed
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        <div className="bg-background border border-border rounded-xl p-4">
          <p className="text-xl font-extrabold text-foreground">
            {tickets.length}
          </p>
          <p className="text-sm text-muted-foreground">Active Chats</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-4">
          <p className="text-xl font-extrabold text-yellow-600">
            {waitingCount}
          </p>
          <p className="text-sm text-muted-foreground">Waiting</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-4">
          <p className="text-xl font-extrabold text-green-600">89%</p>
          <p className="text-sm text-muted-foreground">AI Resolution</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-4">
          <p className="text-xl font-extrabold text-foreground">2.3 min</p>
          <p className="text-sm text-muted-foreground">Avg Response</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4 h-[550px]">
        {/* Chat List */}
        <div className="bg-background border border-border rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search chats..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            {loading ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                Loading chats...
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                No active chats
              </div>
            ) : (
              filteredTickets.map((ticket) => {
                const displayStatus = getDisplayStatus(ticket.status);
                const lastMessage =
                  ticket.messages?.length > 0
                    ? ticket.messages[ticket.messages.length - 1].message
                    : ticket.subject;

                return (
                  <div
                    key={ticket._id}
                    onClick={() => setActiveTicketId(ticket._id)}
                    className={`p-4 border-b border-border cursor-pointer hover:bg-muted/30 transition-colors ${
                      activeTicketId === ticket._id ? "bg-muted/50" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground truncate">
                        {ticket.user?.fullName || "Unknown User"}
                      </span>
                      {ticket.unreadCount && ticket.unreadCount > 0 && (
                        <Badge className="bg-primary text-primary-foreground text-xs">
                          {ticket.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {lastMessage}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-muted-foreground">
                        {format(
                          new Date(ticket.updatedAt || ticket.createdAt),
                          "h:mm a",
                        )}
                      </span>
                      <Badge
                        variant={getStatusVariant(ticket.status)}
                        className="text-xs"
                      >
                        {displayStatus}
                      </Badge>
                    </div>
                  </div>
                );
              })
            )}
          </ScrollArea>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-3 bg-background border border-border rounded-xl overflow-hidden flex flex-col">
          {activeTicket ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {activeTicket.user?.fullName
                        ?.substring(0, 2)
                        .toUpperCase() || "US"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {activeTicket.user?.fullName || "Unknown User"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Client ID: {activeTicket.ticketNumber}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {activeTicket.status !== "resolved" &&
                    activeTicket.status !== "closed" &&
                    !hasTakenOver && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleTakeOver}
                      >
                        Take Over
                      </Button>
                    )}
                  {activeTicket.status !== "resolved" &&
                    activeTicket.status !== "closed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleResolve}
                      >
                        Resolve
                      </Button>
                    )}
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {activeTicket.messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-10 h-full text-muted-foreground">
                      <MessageSquare className="w-12 h-12 mb-2 opacity-20" />
                      <p>No messages yet.</p>
                    </div>
                  )}
                  {activeTicket.messages.map((msg, idx) => {
                    const isClient = msg.sender === "user";
                    const isBot = msg.sender === "bot";

                    return (
                      <div
                        key={idx}
                        className={`flex ${isClient ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`flex gap-2 max-w-[70%] ${isClient ? "" : "flex-row-reverse"}`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                              isClient
                                ? "bg-muted"
                                : isBot
                                  ? "bg-purple-100"
                                  : "bg-primary"
                            }`}
                          >
                            {isClient ? (
                              <User className="w-4 h-4 text-muted-foreground" />
                            ) : isBot ? (
                              <Bot className="w-4 h-4 text-purple-600" />
                            ) : (
                              <Headphones className="w-4 h-4 text-primary-foreground" />
                            )}
                          </div>
                          <div
                            className={`rounded-2xl px-4 py-2 ${
                              isClient
                                ? "bg-muted"
                                : isBot
                                  ? "bg-purple-100"
                                  : "bg-primary text-primary-foreground"
                            }`}
                          >
                            {isBot && (
                              <span className="text-xs text-purple-600 block mb-1">
                                AI Bot
                              </span>
                            )}
                            {!isClient && !isBot && (
                              <span className="text-xs text-primary-foreground/70 block mb-1">
                                You
                              </span>
                            )}
                            <p className="text-sm">{msg.message}</p>
                            <span
                              className={`text-xs mt-1 block ${isClient ? "text-muted-foreground" : isBot ? "text-purple-500" : "text-primary-foreground/70"}`}
                            >
                              {format(new Date(msg.createdAt), "h:mm a")}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              {activeTicket.status !== "resolved" &&
              activeTicket.status !== "closed" ? (
                hasTakenOver ? (
                  <div className="p-4 border-t border-border">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                        className="flex-1"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim()}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-muted border-t border-border text-center text-muted-foreground text-sm">
                    Click <strong>Take Over</strong> to start chatting with this
                    user.
                  </div>
                )
              ) : (
                <div className="p-4 bg-muted border-t border-border text-center text-muted-foreground text-sm">
                  This ticket is closed.
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 h-full text-muted-foreground">
              <Headphones className="w-16 h-16 mb-4 opacity-20" />
              <h3 className="text-xl font-bold">Select a chat</h3>
              <p>Choose a ticket from the left to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
