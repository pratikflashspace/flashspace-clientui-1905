import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MessageSquare,
  CheckCircle,
  Send,
  AlertCircle,
  User,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { AdminTicketData } from "@/services/admin.service";

interface TicketViewModalProps {
  ticket: AdminTicketData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleAssignTicket: (ticketId: string) => void;
  handleResolveTicket: (ticketId: string) => void;
  handleEscalateTicket: (ticketId: string) => void;
  handleCloseTicket: (ticketId: string) => void;
  handleReply: (ticketId: string, message: string) => Promise<void>;
}

export const TicketViewModal = ({
  ticket,
  open,
  onOpenChange,
  handleAssignTicket,
  handleResolveTicket,
  handleEscalateTicket,
  handleCloseTicket,
  handleReply,
}: TicketViewModalProps) => {
  const [replyMessage, setReplyMessage] = useState("");

  if (!ticket) return null;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "open":
        return "bg-white border-gray-200 text-gray-700";
      case "in_progress":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "escalated":
        return "bg-orange-50 text-orange-600 border-orange-100";
      case "resolved":
        return "bg-green-50 text-green-600 border-green-100";
      case "closed":
        return "bg-gray-50 text-gray-600 border-gray-100";
      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case "in_progress":
        return "In Progress";
      case "escalated":
        return "Escalated";
      case "open":
        return "Open";
      case "resolved":
        return "Resolved";
      case "closed":
        return "Closed";
      default:
        return status
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
    }
  };

  const formatCategory = (category: string) => {
    return category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const submitReply = async () => {
    if (!replyMessage.trim()) return;
    await handleReply(ticket._id, replyMessage);
    setReplyMessage("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl bg-white rounded-3xl border-0 shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="px-6 py-5 border-b border-gray-100">
          <div>
            <DialogTitle className="text-2xl font-bold text-gray-900 pr-10">
              {ticket.subject}
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-1">{ticket.ticketNumber}</p>
          </div>
        </DialogHeader>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Ticket Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-sm text-gray-500">Client</p>
              <p className="font-medium">
                {ticket.user?.fullName || "Unknown"}
              </p>
              <p className="text-xs text-gray-400">{ticket.user?.email}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-sm text-gray-500">Status</p>
              <span
                className={`inline-block px-2 py-0.5 mt-1 rounded-full text-xs font-bold ${getStatusStyle(ticket.status)}`}
              >
                {formatStatus(ticket.status)}
              </span>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-medium mt-1">
                {formatCategory(ticket.category)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-sm text-gray-500">Assignee</p>
              <p className="font-medium mt-1">
                {ticket.assignee?.fullName || "Unassigned"}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              Issue Description
            </h3>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100">
              {ticket.description}
            </p>
          </div>

          {/* Chat Messages Section */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-500" />
              Conversation ({ticket.messages?.length || 0} messages)
            </h3>
            <div className="bg-gray-50 rounded-2xl p-5 max-h-96 overflow-y-auto space-y-4 border border-gray-100 scrollbar-thin scrollbar-thumb-gray-300">
              {ticket.messages?.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400 font-medium">No messages yet</p>
                  <p className="text-gray-400 text-sm">
                    Start the conversation below!
                  </p>
                </div>
              ) : (
                ticket.messages?.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm ${
                        msg.sender === "admin"
                          ? "bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-br-sm"
                          : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className={`text-xs font-semibold ${msg.sender === "admin" ? "text-teal-100" : "text-gray-500"}`}
                        >
                          {msg.sender === "user"
                            ? ticket.user?.fullName
                            : "You (Support)"}
                        </span>
                        <span
                          className={`text-xs ${msg.sender === "admin" ? "text-teal-200" : "text-gray-400"}`}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p
                        className={`text-sm leading-relaxed ${msg.sender === "admin" ? "text-white" : "text-gray-700"}`}
                      >
                        {msg.message}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Reply Section - Disabled when resolved/closed */}
          {ticket.status === "resolved" || ticket.status === "closed" ? (
            <div className="border-t border-gray-100 pt-4">
              <div className="bg-gray-100 rounded-xl p-4 text-center">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-gray-600 font-medium">
                  This ticket has been{" "}
                  {ticket.status === "resolved" ? "resolved" : "closed"}
                </p>
                <p className="text-sm text-gray-400">
                  No further replies can be sent
                </p>
                {ticket.status === "resolved" && (
                  <button
                    onClick={() => handleCloseTicket(ticket._id)}
                    className="mt-3 px-6 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                  >
                    Close Ticket Permanently
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="border-t border-gray-100 pt-5">
              {/* Reply Input */}
              <div className="flex gap-4 mb-5">
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply to the client..."
                  rows={3}
                  className="flex-1 px-5 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none text-sm placeholder:text-gray-400 bg-gray-50 hover:bg-white transition-colors"
                />
                <button
                  onClick={submitReply}
                  disabled={!replyMessage.trim()}
                  className="px-6 py-4 bg-teal-600 text-white rounded-2xl font-semibold hover:bg-teal-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed self-end flex items-center gap-2 shadow-lg shadow-teal-200 hover:shadow-xl hover:shadow-teal-300 active:scale-95"
                >
                  <Send className="w-5 h-5" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100">
                <div className="flex gap-2">
                  {ticket.status !== "escalated" && (
                    <button
                      onClick={() => handleEscalateTicket(ticket._id)}
                      className="px-4 py-2 bg-orange-100 text-orange-600 rounded-lg text-sm font-medium hover:bg-orange-200 transition-colors border border-orange-200"
                    >
                      <AlertCircle className="w-4 h-4 inline mr-1" />
                      Escalate
                    </button>
                  )}
                  {ticket.status === "open" && (
                    <button
                      onClick={() => handleAssignTicket(ticket._id)}
                      className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors border border-blue-200"
                    >
                      <User className="w-4 h-4 inline mr-1" />
                      Assign to Me
                    </button>
                  )}
                </div>

                {/* Prominent Resolve Button */}
                <button
                  onClick={() => handleResolveTicket(ticket._id)}
                  className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200 flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Resolve Now
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
