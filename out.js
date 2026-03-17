"use strict";
import React, { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Send,
  Search,
  MessageSquare,
  Headphones
} from "lucide-react";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavItems";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { adminService } from "@/services/admin.service";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import { format } from "date-fns";
import toast from "react-hot-toast";
export default function SupportChat() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTicketId, setActiveTicketId] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageInput, setMessageInput] = useState("");
  const [takenOverTickets, setTakenOverTickets] = useState(
    /* @__PURE__ */ new Set()
  );
  const messagesEndRef = useRef(null);
  const activeTicket = tickets.find((t) => t._id === activeTicketId);
  const hasTakenOver = activeTicketId ? takenOverTickets.has(activeTicketId) || (activeTicket?.messages?.some(
    (m) => m.sender === "admin" || m.sender === "support"
  ) ?? false) : false;
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
  useEffect(() => {
    if (!socket) return;
    socket.emit("join_admin_feed");
    if (activeTicketId) {
      socket.emit("join_ticket", activeTicketId);
    }
    const handleNewMessage = (data) => {
      setTickets(
        (prev) => prev.map((t) => {
          if (t._id === data.ticketId) {
            const exists = t.messages.some(
              (m) => new Date(m.createdAt).getTime() === new Date(data.message.createdAt).getTime() && m.message === data.message.message
            );
            if (exists) return t;
            return {
              ...t,
              messages: [...t.messages, data.message],
              updatedAt: (/* @__PURE__ */ new Date()).toISOString()
            };
          }
          return t;
        })
      );
      if (activeTicketId === data.ticketId) {
        scrollToBottom();
      }
    };
    const handleTicketUpdated = (data) => {
      setTickets(
        (prev) => prev.map((t) => t._id === data.ticketId ? data.ticket : t)
      );
    };
    const handleNewTicket = (ticket) => {
      setTickets((prev) => [ticket, ...prev]);
      toast.success(`New Ticket: ${ticket.subject}`, { icon: "\u{1F3AB}" });
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
    const takeoverMessage = "Hi, I'm taking over this chat. Let me review your request...";
    try {
      await adminService.replyToTicket(activeTicketId, "[Admin joined the conversation]");
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
      await adminService.closeTicket(activeTicketId);
      toast.success("Ticket closed");
    } catch (error) {
      console.error("Failed to close", error);
      toast.error("Failed to close ticket");
    }
  };
  const filteredTickets = tickets.filter(
    (t) => t.subject.toLowerCase().includes(searchTerm.toLowerCase()) || t.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || t.ticketNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  filteredTickets.sort((a, b) => {
    const score = (status) => {
      if (status === "open") return 3;
      if (status === "in_progress") return 2;
      if (status === "escalated") return 2;
      return 0;
    };
    const scoreDiff = score(b.status) - score(a.status);
    if (scoreDiff !== 0) return scoreDiff;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  const getStatusVariant = (status) => {
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
  const getStatusColor = (status) => {
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
  const activeChatsCount = tickets.filter((t) => t.status === "open" || t.status === "in_progress").length;
  const waitingCount = tickets.filter((t) => t.status === "open" && !takenOverTickets.has(t._id)).length;
  const ROLE_BADGE = {
    user: { bg: "bg-blue-100", text: "text-blue-700", label: "Client", dot: "bg-blue-400" },
    admin: { bg: "bg-teal-100", text: "text-teal-700", label: "Admin", dot: "bg-teal-400" },
    partner: { bg: "bg-amber-100", text: "text-amber-700", label: "Space Partner", dot: "bg-amber-400" },
    affiliate: { bg: "bg-orange-100", text: "text-orange-700", label: "Affiliate", dot: "bg-orange-400" },
    support: { bg: "bg-purple-100", text: "text-purple-700", label: "AI Support", dot: "bg-purple-400" }
  };
  const getMsgIdentifier = (sender, ticket, adminEmail) => {
    if (sender === "user") return ticket.user?.email || ticket.user?.fullName || "";
    if (sender === "admin") return adminEmail || "admin@flashspace.io";
    if (sender === "affiliate") return "affiliate@flashspace.io";
    if (sender === "partner") return "partner@flashspace.io";
    return "AI \xB7 flashspace.io";
  };
  if (loading) {
    return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen flex items-center justify-center" }, /* @__PURE__ */ React.createElement(Loader2, { className: "w-8 h-8 animate-spin text-primary" }));
  }
  return /* @__PURE__ */ React.createElement(
    DashboardLayout,
    {
      portalName: "FlashSpace Admin",
      portalDescription: "Complete platform management",
      navItems: ADMIN_NAV_ITEMS
    },
    /* @__PURE__ */ React.createElement("div", { className: "mb-6" }, /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-extrabold text-foreground tracking-tight" }, "Support ", /* @__PURE__ */ React.createElement("span", { className: "text-primary italic" }, "Chats")), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground mt-2" }, "Manage live chats and take over from AI when needed")),
    /* @__PURE__ */ React.createElement("div", { className: "grid gap-4 sm:grid-cols-4 mb-6" }, /* @__PURE__ */ React.createElement("div", { className: "bg-background border border-border rounded-xl p-4" }, /* @__PURE__ */ React.createElement("p", { className: "text-xl font-extrabold text-foreground" }, tickets.length), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-muted-foreground" }, "Active Chats")), /* @__PURE__ */ React.createElement("div", { className: "bg-background border border-border rounded-xl p-4" }, /* @__PURE__ */ React.createElement("p", { className: "text-xl font-extrabold text-yellow-600" }, waitingCount), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-muted-foreground" }, "Waiting")), /* @__PURE__ */ React.createElement("div", { className: "bg-background border border-border rounded-xl p-4" }, /* @__PURE__ */ React.createElement("p", { className: "text-xl font-extrabold text-green-600" }, "89%"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-muted-foreground" }, "AI Resolution")), /* @__PURE__ */ React.createElement("div", { className: "bg-background border border-border rounded-xl p-4" }, /* @__PURE__ */ React.createElement("p", { className: "text-xl font-extrabold text-foreground" }, "2.3 min"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-muted-foreground" }, "Avg Response"))),
    /* @__PURE__ */ React.createElement("div", { className: "grid gap-6 lg:grid-cols-4 h-[700px]" }, /* @__PURE__ */ React.createElement("div", { className: "bg-background border border-border rounded-xl overflow-hidden flex flex-col" }, /* @__PURE__ */ React.createElement("div", { className: "p-4 border-b border-border" }, /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }), /* @__PURE__ */ React.createElement(
      Input,
      {
        placeholder: "Search chats...",
        className: "pl-10",
        value: searchTerm,
        onChange: (e) => setSearchTerm(e.target.value)
      }
    ))), /* @__PURE__ */ React.createElement(ScrollArea, { className: "flex-1" }, /* @__PURE__ */ React.createElement("div", { className: "p-4 space-y-2" }, filteredTickets.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "text-center py-8 text-muted-foreground text-sm" }, "No active chats") : filteredTickets.map((ticket) => /* @__PURE__ */ React.createElement(
      "div",
      {
        key: ticket._id,
        onClick: () => setActiveTicketId(ticket._id),
        className: `p-4 rounded-xl cursor-pointer transition-all border ${activeTicketId === ticket._id ? "bg-teal-50 border-teal-100 shadow-sm" : "hover:bg-gray-50 border-transparent"}`
      },
      /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-start mb-1" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold bg-gray-100 text-gray-600" }, ticket.user?.fullName?.substring(0, 2).toUpperCase() || "US"), /* @__PURE__ */ React.createElement("div", { className: "overflow-hidden" }, /* @__PURE__ */ React.createElement("h4", { className: `text-sm font-bold truncate ${activeTicketId === ticket._id ? "text-teal-900" : "text-gray-900"}` }, ticket.user?.fullName || "Unknown User"), /* @__PURE__ */ React.createElement("p", { className: `text-xs truncate max-w-[140px] mt-0.5 ${activeTicketId === ticket._id ? "text-teal-600" : "text-gray-500"}` }, ticket.subject))), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-gray-400 font-medium ml-2 shrink-0" }, format(new Date(ticket.updatedAt || ticket.createdAt), "h:mm a"))),
      /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mt-3 pl-[52px]" }, /* @__PURE__ */ React.createElement("span", { className: `text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border ${getStatusColor(ticket.status)}` }, ticket.status.replace("_", " ")))
    ))))), /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-3 bg-background border border-border rounded-xl overflow-hidden flex flex-col" }, activeTicket ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "p-4 border-b border-border flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement(Avatar, null, /* @__PURE__ */ React.createElement(AvatarFallback, { className: "bg-primary/10 text-primary" }, activeTicket.user?.fullName?.substring(0, 2).toUpperCase() || "US")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-semibold text-foreground" }, activeTicket.user?.fullName || "Unknown User"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-muted-foreground" }, "Client ID: ", activeTicket.ticketNumber))), /* @__PURE__ */ React.createElement("div", { className: "flex gap-3" }, activeTicket.status !== "resolved" && activeTicket.status !== "closed" && !hasTakenOver && /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: handleTakeOver,
        className: "px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors shadow-sm"
      },
      "\u{1F3AF} Tap In"
    ), activeTicket.status !== "resolved" && activeTicket.status !== "closed" && /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: handleResolve,
        className: "px-4 py-2 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs font-bold hover:bg-green-100 transition-colors shadow-sm"
      },
      "Resolved"
    ))), /* @__PURE__ */ React.createElement(ScrollArea, { className: "flex-1 p-8 bg-gray-50/50" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, activeTicket.messages.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center justify-center h-full text-gray-400 mt-20" }, /* @__PURE__ */ React.createElement(MessageSquare, { className: "w-12 h-12 mb-2 opacity-20" }), /* @__PURE__ */ React.createElement("p", null, "No messages yet.")), activeTicket.messages.map((msg, idx) => {
      const isAdmin = msg.sender === "admin";
      const isSupport = msg.sender === "support";
      const isMine = msg.sender === "admin" || msg.sender === "support";
      const badge = ROLE_BADGE[msg.sender] || ROLE_BADGE.support;
      const identifier = getMsgIdentifier(msg.sender, activeTicket, user?.email);
      return /* @__PURE__ */ React.createElement(
        "div",
        {
          key: idx,
          className: `flex ${isMine ? "justify-end" : "justify-start"}`
        },
        /* @__PURE__ */ React.createElement("div", { className: "max-w-[80%]" }, /* @__PURE__ */ React.createElement(
          "div",
          {
            className: `p-4 rounded-2xl shadow-sm relative group ${isAdmin ? "bg-teal-600 text-white rounded-tr-none" : isSupport ? "bg-purple-50 text-gray-800 border border-purple-100 rounded-tr-none" : msg.sender === "affiliate" ? "bg-orange-50 text-gray-800 border border-orange-200 rounded-tl-none" : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"}`
          },
          /* @__PURE__ */ React.createElement("div", { className: `flex items-center gap-1.5 mb-2 ${isMine ? "flex-row-reverse" : ""}` }, /* @__PURE__ */ React.createElement("span", { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${isAdmin ? "bg-white/20 text-white" : isSupport ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}` }, /* @__PURE__ */ React.createElement("span", { className: `w-1 h-1 rounded-full shrink-0 ${isAdmin ? "bg-white" : badge.dot}` }), badge.label), identifier && /* @__PURE__ */ React.createElement("span", { className: `text-[10px] font-medium truncate max-w-[140px] ${isAdmin ? "text-white/60" : isSupport ? "text-purple-400" : "text-gray-400"}` }, identifier)),
          /* @__PURE__ */ React.createElement("p", { className: "text-sm leading-relaxed whitespace-pre-wrap" }, msg.message)
        ), /* @__PURE__ */ React.createElement("span", { className: `text-[10px] text-gray-400 mt-1 block px-2 ${isMine ? "text-right" : ""}` }, format(new Date(msg.createdAt), "h:mm a")))
      );
    }), /* @__PURE__ */ React.createElement("div", { ref: messagesEndRef }))), activeTicket.status !== "resolved" && activeTicket.status !== "closed" ? hasTakenOver ? /* @__PURE__ */ React.createElement("div", { className: "p-4 border-t border-border" }, /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement(
      Input,
      {
        placeholder: "Type your message...",
        value: messageInput,
        onChange: (e) => setMessageInput(e.target.value),
        onKeyDown: (e) => e.key === "Enter" && handleSendMessage(),
        className: "flex-1"
      }
    ), /* @__PURE__ */ React.createElement(
      Button,
      {
        onClick: handleSendMessage,
        disabled: !messageInput.trim()
      },
      /* @__PURE__ */ React.createElement(Send, { className: "w-4 h-4" })
    ))) : /* @__PURE__ */ React.createElement("div", { className: "p-6 bg-amber-50 border-t border-amber-100 text-center text-amber-700 text-sm font-medium" }, "Click ", /* @__PURE__ */ React.createElement("strong", null, "Tap In"), " to start chatting with this user.") : /* @__PURE__ */ React.createElement("div", { className: "p-4 bg-muted border-t border-border text-center text-muted-foreground text-sm" }, "This ticket is closed.")) : /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center justify-center p-12 h-full text-muted-foreground" }, /* @__PURE__ */ React.createElement(Headphones, { className: "w-16 h-16 mb-4 opacity-20" }), /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-bold" }, "Select a chat"), /* @__PURE__ */ React.createElement("p", null, "Choose a ticket from the left to start chatting"))))
  );
}
