import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, Loader2, X, CheckCircle, FileText, Paperclip } from "lucide-react";
import partnerTicketService, { PartnerTicketMessage } from "@/services/spacePortal/partnerTicket.service";
import { toast } from "@/hooks/use-toast";
import { useSocket } from "@/contexts/SocketContext";
import { format } from "date-fns";

interface EnquiryChatModalProps {
  enquiry: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EnquiryChatModal = ({
  enquiry,
  open,
  onOpenChange,
}: EnquiryChatModalProps) => {
  const [messages, setMessages] = useState<PartnerTicketMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [activeTicketStatus, setActiveTicketStatus] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { socket } = useSocket();

  useEffect(() => {
    if (open && enquiry) {
      loadMessages();
    } else {
      setMessages([]);
      setActiveTicketId(null);
      setActiveTicketStatus(null);
    }
  }, [open, enquiry]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Socket listener for new messages
  useEffect(() => {
    if (!socket || !activeTicketId) return;

    const handleNewMessage = (data: any) => {
      if (data.ticketId === activeTicketId) {
        setMessages((prev) => {
          const exists = prev.some(
            (m) =>
              new Date(m.createdAt).getTime() ===
                new Date(data.message.createdAt).getTime() &&
              m.message === data.message.message,
          );
          if (exists) return prev;
          return [...prev, data.message];
        });
      }
    };

    socket.emit("join_ticket", activeTicketId);
    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.emit("leave_ticket", activeTicketId);
    };
  }, [socket, activeTicketId]);

  const loadMessages = async () => {
    if (!enquiry) return;
    setLoading(true);
    try {
      // Find ticket for this request
      const allTicketsRes = await partnerTicketService.getPartnerTickets(1, 100);
      if (allTicketsRes.success && allTicketsRes.data) {
        // First try direct match by ticket ID (for Converted tab where enquiry.id = ticket._id)
        let leadTicket = allTicketsRes.data.tickets.find((t: any) => t._id === enquiry.id);

        // If no direct match, fall back to user/booking matching (for In Progress tab)
        if (!leadTicket) {
          leadTicket = allTicketsRes.data.tickets.find((t: any) => {
            const tUserId = t.user?.id || t.user?._id || (typeof t.user === 'string' ? t.user : null);
            const eUserId = enquiry.user?.id;
            
            const tBookingId = t.bookingId?.id || t.bookingId?._id || (typeof t.bookingId === 'string' ? t.bookingId : null);
            const eInquiryId = enquiry.id;

            const userMatch = eUserId && tUserId === eUserId;
            const bookingMatch = eInquiryId && tBookingId === eInquiryId;

            if (enquiry.category === "Booking") {
              return userMatch && bookingMatch;
            }
            return bookingMatch || userMatch;
          });
        }

        // Also try matching by ticketNumber (for In Progress tab where id might be ticketNumber)
        if (!leadTicket) {
          leadTicket = allTicketsRes.data.tickets.find((t: any) => t.ticketNumber === enquiry.id || t.ticketNumber === enquiry.ticketNumber);
        }

        if (leadTicket) {
          setMessages(leadTicket.messages || []);
          setActiveTicketId(leadTicket._id);
          setActiveTicketStatus(leadTicket.status);
        }
      }
    } catch (error) {
      console.error("Failed to load lead chat:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && selectedFiles.length === 0) return;
    
    setSending(true);
    try {
      const formData = new FormData();
      formData.append("message", inputValue.trim());
      selectedFiles.forEach(file => formData.append("attachments", file));

      if (activeTicketId) {
        // Reply to existing ticket
        const res = await partnerTicketService.replyToTicket(activeTicketId, formData);
        if (res.success) {
          setInputValue("");
          setSelectedFiles([]);
          if (!socket) loadMessages();
        }
      } else {
        // Create new ticket for this lead
        // Ensure we have a valid bookingId from the enquiry
        const bookingId = enquiry.bookingId?._id || enquiry.bookingId?.id || (enquiry.category === "Booking" ? enquiry.id : null);
        
        if (!bookingId && !enquiry.user?.id) {
          toast({
            title: "Error",
            description: "Cannot initiate chat: Missing client or booking information.",
            variant: "destructive",
          });
          setSending(false);
          return;
        }

        const res = await partnerTicketService.createTicketForClient({
          clientUserId: enquiry.user?.id || enquiry.user?._id,
          bookingId: bookingId,
          subject: `Inquiry: ${enquiry.space || "General"}`,
          message: inputValue.trim()
        });
        if (res.success) {
          setActiveTicketId(res.data._id);
          setMessages(res.data.messages || []);
          setInputValue("");
          setSelectedFiles([]);
          toast({
            title: "Chat Initiated",
            description: "Message sent to lead.",
          });
        }
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  if (!enquiry) return null;
  const name = enquiry.user?.name || "Client";
  const company = enquiry.user?.company || "N/A";
  const interest = enquiry.space || enquiry.type || "Space";

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />
          <div className="relative bg-white rounded-2xl w-full max-w-[500px] h-[650px] shadow-2xl overflow-hidden border border-border text-slate-900 opacity-100 flex flex-col flex-nowrap">
            {/* Header */}
            <div className="p-6 border-b bg-white flex shrink-0 items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-xl font-bold">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Chat with {name}
                  {activeTicketStatus === "resolved" && (
                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium ml-1">
                      Resolved
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{company} • {interest}</p>
              </div>
              <div className="flex items-center gap-2">
                {activeTicketId && activeTicketStatus !== "resolved" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-[10px] font-bold uppercase tracking-wider border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700"
                    onClick={async () => {
                      if (!activeTicketId) return;
                      try {
                        const res = await partnerTicketService.closeTicket(activeTicketId);
                        if (res.success) {
                          setActiveTicketStatus("resolved");
                          toast({
                            title: "Resolved",
                            description: "Inquiry marked as resolved.",
                          });
                        }
                      } catch (err) {
                        toast({
                          title: "Error",
                          description: "Failed to resolve inquiry.",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Mark as Resolved
                  </Button>
                )}
                <button
                  onClick={() => onOpenChange(false)}
                  className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 custom-scrollbar"
            >
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full space-y-2">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Loading chat history...</p>
                </div>
              ) : messages.length > 0 ? (
                messages.map((msg, i) => {
                  const isPartner = msg.sender === "partner";
                  const isUser = msg.sender === "user";
                  const isAdmin = msg.sender === "admin";
                  const isSupport = msg.sender === "support";
                  
                  return (
                    <div 
                      key={i}
                      className={`flex flex-col ${isPartner ? "items-end" : "items-start"}`}
                    >
                      <div className={`flex items-center gap-1.5 mb-1 ${isPartner ? "flex-row-reverse" : ""}`}>
                         <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                           isPartner ? "bg-primary/10 text-primary" : 
                           isUser ? "bg-blue-100 text-blue-700" :
                           isAdmin ? "bg-amber-100 text-amber-700" :
                           "bg-purple-100 text-purple-700"
                         }`}>
                           {isPartner ? "Space Partner" : isUser ? "Client" : isAdmin ? "Admin" : "AI Support"}
                         </span>
                         <span className="text-[10px] text-muted-foreground">
                           {format(new Date(msg.createdAt), "h:mm a")}
                         </span>
                      </div>
                      <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        isPartner 
                          ? "bg-primary text-white rounded-tr-none shadow-sm" 
                          : isUser
                            ? "bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm"
                            : "bg-slate-100 text-slate-700 border border-slate-200 rounded-tl-none italic"
                      }`}>
                        <p>{msg.message}</p>
                        
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {msg.attachments.map((url: string, i: number) => {
                              const isImg = url.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                              const fullUrl = url.startsWith('http') ? url : `${import.meta.env.VITE_API_URL || ''}${url}`;
                              return (
                                <a 
                                  key={i} 
                                  href={fullUrl} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="block group/attach relative"
                                >
                                  {isImg ? (
                                    <img 
                                      src={fullUrl} 
                                      alt="attachment" 
                                      className="w-24 h-24 object-cover rounded-lg border border-black/5 hover:opacity-90 transition-opacity shadow-sm" 
                                    />
                                  ) : (
                                    <div className="flex items-center gap-2 bg-slate-100/50 hover:bg-slate-100 p-2 rounded-lg text-[10px] font-bold border border-slate-200 transition-colors">
                                      <span className="text-primary">📎</span> Doc {i+1}
                                    </div>
                                  )}
                                </a>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 p-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-foreground">No messages yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Start a conversation with {name} about their inquiry for {interest}.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t bg-white shrink-0 space-y-3">
              {selectedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedFiles.map((file, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-lg text-[10px] font-bold border border-slate-200 group">
                      <span className="max-w-[100px] truncate">{file.name}</span>
                      <X 
                        className="w-3 h-3 cursor-pointer text-muted-foreground hover:text-red-500" 
                        onClick={() => setSelectedFiles(prev => prev.filter((_, idx) => idx !== i))}
                      />
                    </div>
                  ))}
                </div>
              )}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="relative flex items-center gap-2"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={(e) => {
                    if (e.target.files) {
                      const files = Array.from(e.target.files);
                      setSelectedFiles(prev => [...prev, ...files].slice(0, 5));
                    }
                  }} 
                  multiple 
                  hidden 
                  accept="image/*,.pdf" 
                />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-muted-foreground hover:text-primary transition-colors bg-slate-50 rounded-xl border border-border"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={activeTicketStatus === "resolved" ? "This inquiry has been resolved" : "Type your message..."}
                    disabled={sending || activeTicketStatus === "resolved"}
                    className="w-full pl-4 pr-12 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 bg-muted/20 text-sm disabled:opacity-50"
                  />
                  <Button 
                    type="submit"
                    size="icon" 
                    disabled={sending || (!inputValue.trim() && selectedFiles.length === 0) || activeTicketStatus === "resolved"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg w-8 h-8"
                  >
                    {sending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
