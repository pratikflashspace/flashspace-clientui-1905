import React, { useEffect, useState } from "react";
import { Search, Plus, Eye, Loader2, ArrowLeft, CheckCircle2, Send, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { affiliatePortalService } from "@/services/affiliatePortal.service";
import { SupportTicket, TicketStatus } from "@/types/services";
import { useSocket } from "@/contexts/SocketContext";
import toast from "react-hot-toast";

const SupportTickets = () => {
    const { socket } = useSocket();
    const [searchQuery, setSearchQuery] = useState("");
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [loading, setLoading] = useState(false);
    const [showNewTicket, setShowNewTicket] = useState(false);

    // New Ticket Form State
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        subject: "",
        category: "",
        description: "",
    });

    // Reply State
    const [replyMessage, setReplyMessage] = useState("");

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const response = await affiliatePortalService.getSupportTickets();
            if (response.success && response.data) {
                let ticketsData: SupportTicket[] = [];
                if (Array.isArray(response.data)) {
                    ticketsData = response.data;
                } else if (response.data && typeof response.data === 'object') {
                    // @ts-ignore
                    if (Array.isArray(response.data.tickets)) {
                        // @ts-ignore
                        ticketsData = response.data.tickets;
                    }
                }
                setTickets(ticketsData.reverse()); // Show newest first
            }
        } catch (err) {
            console.error("Failed to fetch tickets", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    // Socket listener for real-time ticket updates and messages
    useEffect(() => {
        if (!socket || !selectedTicket) return;

        socket.emit('join_ticket', selectedTicket._id);

        const handleNewMessage = (data: { ticketId: string, message: any }) => {
            if (data.ticketId === selectedTicket._id) {
                setSelectedTicket((prev) => {
                    if (!prev) return null;
                    const exists = prev.messages.some(m =>
                        new Date(m.createdAt).getTime() === new Date(data.message.createdAt).getTime() &&
                        m.message === data.message.message
                    );
                    if (exists) return prev;
                    return {
                        ...prev,
                        messages: [...prev.messages, data.message]
                    };
                });
                fetchTickets();
            }
        };

        const handleTicketUpdated = (data: { ticketId: string, ticket: any }) => {
            if (data.ticketId === selectedTicket._id) {
                setSelectedTicket(data.ticket);
                fetchTickets();
            }
        };

        socket.on('new_message', handleNewMessage);
        socket.on('ticket_updated', handleTicketUpdated);

        return () => {
            socket.off('new_message', handleNewMessage);
            socket.off('ticket_updated', handleTicketUpdated);
        };
    }, [socket, selectedTicket?._id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await affiliatePortalService.createSupportTicket({
                subject: formData.subject,
                category: formData.category,
                description: formData.description,
            });

            if (response.success && response.data) {
                setSubmitted(true);
                fetchTickets();
                setTimeout(() => {
                    setSubmitted(false);
                    setShowNewTicket(false);
                    setFormData({ subject: "", category: "", description: "" });
                }, 3000);
            } else {
                toast.error(response.message || "Failed to create ticket");
            }
        } catch (err) {
            console.error("Failed to create ticket", err);
            toast.error("Failed to create ticket. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleReply = async () => {
        if (!selectedTicket || !replyMessage.trim()) return;
        setSubmitting(true);
        try {
            const response = await affiliatePortalService.replyToSupportTicket(selectedTicket._id, replyMessage);
            if (response.success && response.data) {
                setSelectedTicket(response.data);
                setReplyMessage("");
                fetchTickets();
            } else {
                toast.error(response.message || "Failed to send reply");
            }
        } catch (err) {
            console.error("Failed to reply", err);
            toast.error("Failed to send reply. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const viewTicketDetails = async (ticketId: string) => {
        try {
            setLoading(true);
            const response = await affiliatePortalService.getSupportTicketById(ticketId);
            if (response.success && response.data) {
                setSelectedTicket(response.data);
            }
        } catch (err) {
            console.error("Failed to load ticket", err);
            toast.error("Failed to load ticket details");
        } finally {
            setLoading(false);
        }
    };

    const getStatusConfig = (status: TicketStatus) => {
        switch (status) {
            case "open": return { bg: "bg-blue-100", text: "text-blue-700", label: "Open" };
            case "in_progress": return { bg: "bg-yellow-100", text: "text-yellow-700", label: "In Progress" };
            case "waiting_customer": return { bg: "bg-orange-100", text: "text-orange-700", label: "Waiting for Customer" };
            case "resolved": return { bg: "bg-green-100", text: "text-green-700", label: "Resolved" };
            case "closed": return { bg: "bg-gray-100", text: "text-gray-600", label: "Closed" };
            default: return { bg: "bg-gray-100", text: "text-gray-600", label: status };
        }
    };


    const filteredTickets = tickets.filter(
        (ticket) =>
            ticket.ticketNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // Helper to show assignee name and role
    const renderAssignee = (assignee) => {
        if (!assignee) return <span className="text-gray-400">Unassigned</span>;
        return (
            <span>
                {assignee.fullName}
                {assignee.role && (
                    <span className="text-xs text-gray-400 ml-1">({assignee.role})</span>
                )}
            </span>
        );
    };

    if (selectedTicket) {
        return (
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={() => setSelectedTicket(null)}
                    className="flex items-center gap-2 text-[#6b7280] hover:text-[#2d5a4c] mb-6 transition-colors font-bold text-sm"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Tickets
                </button>

                <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 pb-6 border-b border-gray-50 gap-4">
                    <div>
                        <p className="text-[10px] font-black text-[#2d5a4c] mb-1">{selectedTicket.ticketNumber}</p>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">{selectedTicket.subject}</h2>
                        <div className="flex items-center gap-3 mt-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusConfig(selectedTicket.status).bg} ${getStatusConfig(selectedTicket.status).text}`}>
                                {getStatusConfig(selectedTicket.status).label}
                            </span>
                            <span className="text-xs text-gray-400 font-medium">
                                Created {new Date(selectedTicket.createdAt).toLocaleDateString("en-IN", { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Messages Timeline */}
                <div className="space-y-6 mb-8 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {selectedTicket.messages?.map((msg, idx) => {
                        const isUser = msg.sender === "user" || msg.sender === "affiliate";
                        return (
                            <div key={idx} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[90%] md:max-w-[85%] rounded-xl md:rounded-2xl p-4 md:p-5 ${isUser ? "bg-[#f2faf9] border border-[#5bb09c]/10 text-gray-800 rounded-tr-sm" : "bg-gray-50 border border-gray-100 text-gray-800 rounded-tl-sm"}`}>
                                    <div className="flex items-center justify-between gap-4 mb-2">
                                        <span className="text-sm font-bold text-gray-900">
                                            {isUser ? "You" : "Support Team"}
                                        </span>
                                        <span className="text-[10px] text-gray-400 font-medium">
                                            {new Date(msg.createdAt).toLocaleString("en-IN", { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Reply Interface */}
                {selectedTicket.status !== "closed" && selectedTicket.status !== "resolved" && (
                    <div className="bg-[#f9fafb] rounded-[1.5rem] p-2 ring-1 ring-black/5 flex items-end gap-2 focus-within:ring-2 focus-within:ring-[#2d5a4c]/20 focus-within:bg-white transition-all">
                        <textarea
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                            placeholder="Type your reply here..."
                            rows={1}
                            className="flex-1 max-h-32 min-h-[44px] bg-transparent resize-none px-4 py-3 text-sm font-medium focus:outline-none placeholder:text-gray-400"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleReply();
                                }
                            }}
                        />
                        {/* ...other reply UI elements if any... */}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {showNewTicket ? (
                <div className="p-6 md:p-8">
                    <button
                        onClick={() => setShowNewTicket(false)}
                        className="flex items-center gap-2 text-[#6b7280] hover:text-[#2d5a4c] mb-6 transition-colors font-bold text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Tickets
                    </button>

                    {submitted ? (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100">
                                <CheckCircle2 className="w-8 h-8 text-green-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Ticket Submitted!</h3>
                            <p className="text-sm text-gray-500">We'll get back to you shortly.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                                <Input
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    placeholder="Brief summary of your issue"
                                    className="h-12 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                                <select
                                    required
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full h-12 rounded-xl border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#5bb09c]/50"
                                >
                                    <option value="">Select a category</option>
                                    <option value="billing">Billing</option>
                                    <option value="technical">Technical</option>
                                    <option value="booking">Booking</option>
                                    <option value="general">General</option>
                                    <option value="leads">Leads</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe your issue in detail..."
                                    rows={5}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5bb09c]/50 resize-none"
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-[#2d5a4c] text-white hover:bg-[#1a3a3a] h-12 px-8 rounded-xl font-black"
                                >
                                    {submitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                                    {submitting ? "Submitting..." : "Submit Ticket"}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            ) : (
                <>
                    <div className="p-6 md:px-8 md:py-6 border-b border-gray-50 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/30">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                className="pl-11 h-12 bg-white border-none shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] rounded-xl focus-visible:ring-1 focus-visible:ring-[#5bb09c]/50 text-sm"
                                placeholder="Search by Ticket ID or Subject..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button
                            className="bg-[#2d5a4c] text-white hover:bg-[#1a3a3a] gap-2 h-12 px-6 rounded-xl shadow-lg shadow-[#2d5a4c]/10 w-full md:w-auto font-black"
                            onClick={() => setShowNewTicket(true)}
                        >
                            <Plus className="w-4 h-4" /> New Ticket
                        </Button>
                    </div>

                    <div className="divide-y divide-gray-50">
                        {loading ? (
                            <div className="text-center py-20">
                                <Loader2 className="w-8 h-8 text-[#5bb09c] animate-spin mx-auto mb-4" />
                                <p className="text-sm font-medium text-gray-500">Loading your tickets...</p>
                            </div>
                        ) : filteredTickets.length > 0 ? (
                            filteredTickets.map((t, idx) => {
                                const statusConfig = getStatusConfig(t.status);
                                return (
                                    <div
                                        key={t._id || t.ticketNumber || idx}
                                        onClick={() => viewTicketDetails(t._id)}
                                        className="p-6 md:px-8 hover:bg-gray-50/80 transition-all cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4"
                                    >
                                        <div className="space-y-1.5 flex-1">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-black text-[#2d5a4c] bg-[#2d5a4c]/5 px-2.5 py-1 rounded-md tracking-widest uppercase">
                                                    {t.ticketNumber}
                                                </span>
                                                <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${statusConfig.bg} ${statusConfig.text}`}>
                                                    {statusConfig.label}
                                                </span>
                                            </div>
                                            <h4 className="font-black text-[#1a1a1a] text-lg group-hover:text-[#2d5a4c] transition-colors">{t.subject}</h4>
                                            <p className="text-xs text-[#9ca3af] font-bold flex items-center gap-2">
                                                Created {new Date(t.createdAt).toLocaleDateString("en-IN", { month: 'short', day: 'numeric', year: 'numeric' })}
                                                {t.category && <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>}
                                                {t.category && <span className="capitalize">{t.category.replace('_', ' ')}</span>}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4 border-t md:border-t-0 border-gray-100 pt-4 md:pt-0 shrink-0">
                                            <div className="text-sm font-black text-[#2d5a4c] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                                                View Thread <ArrowLeft className="w-4 h-4 rotate-180" />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-20 text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                                    <Headphones className="w-6 h-6 text-gray-400" />
                                </div>
                                <h4 className="font-bold text-gray-900 mb-1">No Tickets Found</h4>
                                <p className="text-sm text-gray-500 max-w-sm mx-auto">
                                    {searchQuery ? "We couldn't find any tickets matching your search." : "You haven't created any support tickets yet. Need help? Click 'New Ticket' above."}
                                </p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default SupportTickets;
