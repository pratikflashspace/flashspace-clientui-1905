import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Send,
  User,
  Headphones,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Bot,
  MoreHorizontal,
  Loader2
} from "lucide-react";
import { adminService, AdminTicketData } from "@/services/admin.service";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
    (activeTicket?.messages?.some((m) => m.sender === "admin") ?? false)
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
      "Hi, I'm the admin now. I will be the one continuing the chat.";
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

  const filteredTickets = tickets.filter(
    (t) =>
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.ticketNumber?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "open":
        return "destructive";
      case "in_progress":
        return "default";
      case "resolved":
      case "closed":
        return "secondary";
      default:
        return "outline";
    }
  };

  const activeChatsCount = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;
  const waitingCount = tickets.filter(t => t.status === 'open' && !takenOverTickets.has(t._id)).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent space-y-8 font-sans animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
          Support <span className="text-primary italic">Chats</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage live chats and take over from AI when needed
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        <div className="bg-background border border-border rounded-xl p-4 shadow-sm">
          <p className="text-xl font-extrabold text-foreground">{activeChatsCount}</p>
          <p className="text-sm text-muted-foreground">Active Chats</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-4 shadow-sm">
          <p className="text-xl font-extrabold text-yellow-600">{waitingCount}</p>
          <p className="text-sm text-muted-foreground">Waiting</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-4 shadow-sm">
          <p className="text-xl font-extrabold text-green-600">89%</p>
          <p className="text-sm text-muted-foreground">AI Resolution</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-4 shadow-sm">
          <p className="text-xl font-extrabold text-foreground">2.3 min</p>
          <p className="text-sm text-muted-foreground">Avg Response</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4 h-[600px]">
        {/* Chat List */}
        <div className="bg-background border border-border rounded-xl overflow-hidden flex flex-col shadow-sm">
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
            {filteredTickets.map((ticket) => (
              <div
                key={ticket._id}
                onClick={() => setActiveTicketId(ticket._id)}
                className={`p-4 border-b border-border cursor-pointer hover:bg-muted/30 transition-colors ${activeTicketId === ticket._id ? 'bg-muted/50 shadow-inner' : ''
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Avatar className="w-6 h-6 shrink-0">
                      <AvatarFallback className="text-[10px]">
                        {ticket.user?.fullName?.substring(0, 2).toUpperCase() || "US"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-foreground truncate text-sm">
                      {ticket.user?.fullName || "Unknown User"}
                    </span>
                  </div>
                  {/* Unread dot placeholder could go here */}
                </div>
                <p className="text-xs text-muted-foreground truncate italic">"{ticket.subject}"</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[10px] text-muted-foreground">
                    {format(new Date(ticket.updatedAt || ticket.createdAt), "h:mm a")}
                  </span>
                  <Badge variant={getStatusVariant(ticket.status)} className="text-[10px] px-1.5 py-0">
                    {ticket.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            ))}
            {filteredTickets.length === 0 && (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No active chats
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-3 bg-background border border-border rounded-xl overflow-hidden flex flex-col shadow-sm">
          {activeTicket ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border flex items-center justify-between bg-muted/10">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {activeTicket.user?.fullName?.substring(0, 2).toUpperCase() || "US"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground text-base">
                      {activeTicket.user?.fullName || "Unknown User"}
                    </h3>
                    <p className="text-xs text-muted-foreground">Ticket: #{activeTicket.ticketNumber}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!hasTakenOver && (activeTicket.status !== 'resolved' && activeTicket.status !== 'closed') && (
                    <Button variant="outline" size="sm" onClick={handleTakeOver} className="text-xs">Take Over</Button>
                  )}
                  {(activeTicket.status !== 'resolved' && activeTicket.status !== 'closed') && (
                    <Button variant="outline" size="sm" onClick={handleResolve} className="text-xs text-green-600 border-green-200 hover:bg-green-50">Resolve</Button>
                  )}
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-6 bg-muted/5">
                <div className="space-y-6">
                  {activeTicket.messages.map((msg, idx) => {
                    const isAdmin = msg.sender === "admin";
                    const isSupport = msg.sender === "support";

                    return (
                      <div key={idx} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex gap-3 max-w-[80%] ${isAdmin ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${isAdmin ? 'bg-primary' : isSupport ? 'bg-purple-100' : 'bg-muted border border-border'
                            }`}>
                            {isAdmin ? (
                              <Headphones className="w-4 h-4 text-primary-foreground" />
                            ) : isSupport ? (
                              <Bot className="w-4 h-4 text-purple-600" />
                            ) : (
                              <User className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className={`rounded-2xl px-4 py-3 shadow-sm ${isAdmin ? 'bg-primary text-primary-foreground rounded-tr-none' :
                              isSupport ? 'bg-purple-50 text-purple-900 border border-purple-100 rounded-tl-none' :
                                'bg-white text-foreground border border-border rounded-tl-none'
                            }`}>
                            {isSupport && <span className="text-[10px] font-bold text-purple-600 block mb-1 uppercase tracking-wider">AI Assistant</span>}
                            {isAdmin && <span className="text-[10px] font-bold text-primary-foreground/70 block mb-1 uppercase tracking-wider">You (Admin)</span>}
                            {!isAdmin && !isSupport && <span className="text-[10px] font-bold text-muted-foreground block mb-1 uppercase tracking-wider">{activeTicket.user?.fullName}</span>}

                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>

                            <span className={`text-[10px] mt-2 block text-right font-medium ${isAdmin ? 'text-primary-foreground/60' : 'text-muted-foreground'
                              }`}>
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
              {(activeTicket.status !== 'resolved' && activeTicket.status !== 'closed') ? (
                hasTakenOver ? (
                  <div className="p-4 border-t border-border bg-white">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button onClick={handleSendMessage} disabled={!messageInput.trim()}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-amber-50 border-t border-amber-100 text-center text-amber-700 text-sm font-medium">
                    Click <strong>Take Over</strong> to start chatting with this user.
                  </div>
                )
              ) : (
                <div className="p-4 bg-gray-50 border-t border-gray-100 text-center text-gray-400 text-sm">
                  This ticket is closed.
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-muted/5">
              <MessageSquare className="w-16 h-16 mb-4 opacity-10" />
              <h3 className="text-xl font-bold">Select a chat</h3>
              <p className="text-sm">Choose a ticket from the left to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
