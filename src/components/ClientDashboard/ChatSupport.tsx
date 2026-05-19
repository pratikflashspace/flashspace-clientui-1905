import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Send, MessageSquare, Loader2, RefreshCw, CheckCircle2, X, AlertCircle, User as UserIcon, Ticket, MessageCircle, History, Star, ChevronLeft, ChevronRight, ChevronDown, Building2, Paperclip, FileText } from 'lucide-react';
import { useSocket } from '@/contexts/SocketContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import axiosInstance from '@/lib/axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TicketMessage {
    sender: 'user' | 'support' | 'admin' | 'partner';
    message: string;
    attachments?: string[];
    createdAt: string;
}

interface Ticket {
    _id: string;
    id: string;
    ticketNumber: string;
    subject: string;
    description: string;
    category: string;
    priority: string;
    status: string;
    messages: TicketMessage[];
    bookingId?: {
        _id: string;
        bookingNumber: string;
        spaceSnapshot?: { name?: string };
    };
    assignee?: { fullName: string; email: string };
    user?: { fullName?: string; email?: string };
    rating?: number;
    ratingRemarks?: string;
    feedbackSubmittedAt?: string;
    createdAt: string;
    updatedAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.FC<{ className?: string }> }> = {
    open: { label: 'Open', color: 'bg-red-100 text-red-700', icon: AlertCircle },
    in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: RefreshCw },
    escalated: { label: 'Escalated', color: 'bg-orange-100 text-orange-700', icon: AlertCircle },
    resolved: { label: 'Resolved', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
    closed: { label: 'Closed', color: 'bg-gray-100 text-gray-500', icon: X },
};

const ROLE_LABEL: Record<string, string> = {
    user: 'Client',
    partner: 'Space Partner',
    admin: 'Admin',
    support: 'Support Team',
};

export default function ChatSupport() {
    const { socket } = useSocket();
    const { user } = useAuth();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState<'open' | 'all'>('open');
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState<string | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [messageInput, setMessageInput] = useState('');
    const [sending, setSending] = useState(false);
    const [showNewTicketForm, setShowNewTicketForm] = useState(false);
    const [newTicketData, setNewTicketData] = useState({ subject: '', category: '', description: '', bookingId: '' });
    const [userBookings, setUserBookings] = useState<any[]>([]);
    const [loadingBookings, setLoadingBookings] = useState(false);
    const [creatingTicket, setCreatingTicket] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [remarksInput, setRemarksInput] = useState('');
    const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    const hasPendingAction = tickets.some(t => 
        t.status === 'open' || 
        t.status === 'in_progress' || 
        ((t.status === 'resolved' || t.status === 'closed') && !t.feedbackSubmittedAt)
    );

    const activeTicket = useMemo(() => {
        if (!activeTicketId) return null;
        return tickets.find(t => t._id === activeTicketId || t.id === activeTicketId);
    }, [tickets, activeTicketId]);

    const fetchTickets = async (page = 1) => {
        try {
            setLoading(true);
            const res = await axiosInstance.get('/api/tickets/my-tickets', { 
                params: { page, limit: 10 } 
            });
            if (res.data.success) {
                const fetchedTickets = res.data.data?.tickets || [];
                const sorted = [...fetchedTickets].sort(
                    (a: Ticket, b: Ticket) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                );
                setTickets(sorted);
                setTotalPages(res.data.data?.totalPages || 1);
                setCurrentPage(page);
                
                // If there's a ticketId in location state, prioritize it
                if (location.state?.ticketId) {
                    setActiveTicketId(location.state.ticketId);
                    setActiveTab('open');
                } else if (sorted.length > 0) {
                    // Try to find the best ticket to show:
                    // 1. Current activeTicketId if it still exists in sorted
                    // 2. Latest open/pending action ticket
                    // 3. Just the first ticket
                    const currentStillExists = activeTicketId && sorted.find((t: Ticket) => t._id === activeTicketId || t.id === activeTicketId);
                    
                    if (!currentStillExists) {
                        const latestOpen = sorted.find((t: Ticket) => 
                            t.status === 'open' || 
                            t.status === 'in_progress' || 
                            ((t.status === 'resolved' || t.status === 'closed') && !t.feedbackSubmittedAt)
                        );
                        if (latestOpen) {
                            setActiveTicketId(latestOpen._id || latestOpen.id);
                        } else if (sorted[0]) {
                            setActiveTicketId(sorted[0]._id || sorted[0].id);
                        }
                    }
                }
            }
        } catch (e) {
            console.error('Failed to fetch tickets', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
        
        // Handle incoming state from MyBookings "Raise Query"
        if (location.state?.autoShowForm) {
            setShowNewTicketForm(true);
            if (location.state.bookingId) {
                setNewTicketData(prev => ({
                    ...prev,
                    bookingId: location.state.bookingId,
                    category: 'bookings'
                }));
            }
        }
    }, [location.state]);

    useEffect(() => {
        const container = messagesContainerRef.current;
        if (container) {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [activeTicket?.messages]);

    useEffect(() => {
        if (!socket) return;
        if (activeTicketId) {
            socket.emit('join_ticket', activeTicketId);
        }

        const handleNewMessage = (data: { ticketId: string; message: TicketMessage }) => {
            setTickets(prev => prev.map(t => {
                if (t._id !== data.ticketId) return t;
                return { ...t, messages: [...t.messages, data.message], updatedAt: new Date().toISOString() };
            }));

            if (data.message.sender !== 'user') {
                toast.success('New message received!', { icon: '💬' });
                // Refresh to check for status changes (e.g. admin closed it)
                fetchTickets();
            }
        };

        const handleTicketUpdated = (data: { ticketId: string; ticket: Ticket }) => {
            setTickets(prev => prev.map(t => t._id === data.ticketId ? data.ticket : t));
        };

        const handleTyping = (data: { ticketId: string; user: string }) => {
            if (data.ticketId === activeTicketId) {
                setTypingUser(data.user);
            }
        };

        const handleStopTyping = (data: { ticketId: string }) => {
            if (data.ticketId === activeTicketId) {
                setTypingUser(null);
            }
        };

        socket.on('new_message', handleNewMessage);
        socket.on('ticket_updated', handleTicketUpdated);
        socket.on('typing', handleTyping);
        socket.on('stop_typing', handleStopTyping);

        return () => {
            socket.off('new_message', handleNewMessage);
            socket.off('ticket_updated', handleTicketUpdated);
            socket.off('typing', handleTyping);
            socket.off('stop_typing', handleStopTyping);
        };
    }, [socket, activeTicketId]);

    const fetchUserBookings = async () => {
        setLoadingBookings(true);
        try {
            const res = await axiosInstance.get('/api/user/bookings', { params: { limit: 100 } });
            if (res.data.success) {
                setUserBookings(res.data.data || []);
            }
        } catch (e) {
            console.error('Failed to fetch bookings:', e);
        } finally {
            setLoadingBookings(false);
        }
    };

    useEffect(() => {
        if (showNewTicketForm && newTicketData.category === 'bookings' && userBookings.length === 0) {
            fetchUserBookings();
        }
    }, [showNewTicketForm, newTicketData.category]);

    const handleSendReply = async () => {
        if (!activeTicketId || (!messageInput.trim() && selectedFiles.length === 0)) return;
        setSending(true);
        try {
            const formData = new FormData();
            formData.append('message', messageInput.trim());
            selectedFiles.forEach(file => {
                formData.append('attachments', file);
            });

            const res = await axiosInstance.post(`/api/tickets/${activeTicketId}/reply`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.success) {
                setMessageInput('');
                setSelectedFiles([]);
                if (socket) {
                    socket.emit('stop_typing', { ticketId: activeTicketId });
                    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                }
            }
        } catch (e) {
            toast.error('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageInput(e.target.value);
        
        if (!socket || !activeTicketId) return;

        // Emit typing event
        socket.emit('typing', { ticketId: activeTicketId, user: user?.fullName || 'Client' });

        // Clear previous timeout
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        // Set timeout to stop typing
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('stop_typing', { ticketId: activeTicketId });
        }, 3000);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            if (selectedFiles.length + files.length > 5) {
                toast.error('Maximum 5 files allowed');
                return;
            }
            setSelectedFiles(prev => [...prev, ...files]);
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleCreateTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        if (hasPendingAction) {
            toast.error("Finish your previous ticket or feedback before raising a new one!", { icon: '🚫' });
            return;
        }
        if (!newTicketData.subject || newTicketData.subject.length < 5) {
            toast.error("Subject must be at least 5 characters long");
            return;
        }
        if (!newTicketData.category) {
            toast.error("Please select a category");
            return;
        }
        if (!newTicketData.description || newTicketData.description.length < 10) {
            toast.error("Description must be at least 10 characters long");
            return;
        }

        setCreatingTicket(true);
        try {
            const res = await axiosInstance.post('/api/tickets', newTicketData);
            if (res.data.success) {
                toast.success("Ticket created successfully!");
                setShowNewTicketForm(false);
                setNewTicketData({ subject: '', category: '', description: '', bookingId: '' });
                await fetchTickets(1);
                // Select the new ticket
                if (res.data.data?._id) {
                    setActiveTicketId(res.data.data._id);
                    setActiveTab('open');
                }
            }
        } catch (e: any) {
            toast.error(e.response?.data?.message || "Failed to create ticket");
        } finally {
            setCreatingTicket(false);
        }
    };

    const handleSubmitFeedback = async () => {
        // Find the ticket ID to use - prioritize activeTicketId, fallback to activeTicket property
        const ticketIdToRate = activeTicketId || (activeTicket as any)?._id || (activeTicket as any)?.id;
        console.log('Submitting feedback for ticket:', { ticketIdToRate, activeTicketId, activeTicketFromState: (activeTicket as any)?._id });

        if (!ticketIdToRate) {
            toast.error('Technical error: No ticket selected for feedback.');
            console.error('Feedback failed: No valid ticket ID found', { activeTicketId, activeTicketIdFromObject: (activeTicket as any)?._id || (activeTicket as any)?.id });
            return;
        }

        if (userRating === 0) {
            toast.error('Please select at least 1 star before submitting.');
            return;
        }

        setFeedbackSubmitting(true);
        try {
            const res = await axiosInstance.post(`/api/tickets/${ticketIdToRate}/feedback`, {
                rating: userRating,
                remarks: remarksInput.trim(),
            });
            if (res.data.success) {
                toast.success('Thank you for your feedback!');
                // Reset local state to clear the UI
                setUserRating(0);
                setRemarksInput('');
                setActiveTicketId(null);
                
                // Refresh to find next actionable ticket or show "Everything sorted"
                await fetchTickets(currentPage);
            }
        } catch (e: any) {
            console.error('Feedback submission error:', e);
            toast.error(e.response?.data?.message || 'Failed to submit feedback');
        } finally {
            setFeedbackSubmitting(false);
        }
    };

    const selectTicket = (id: string) => {
        setActiveTicketId(id);
        setActiveTab('open');
    };

    if (loading && tickets.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#35503F]" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] lg:h-screen bg-gray-50 overflow-hidden">
            {/* Main Header */}
            <div className="bg-white border-b border-gray-100 px-8 py-10 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm z-10">
                <div>
                    <h2 className="text-3xl md:text-3xl font-extrabold text-[#35503F] tracking-tight text-center md:text-left">Support <span className="text-[#4A6D56] italic">& Tickets</span></h2>
                    <p className="text-gray-500 font-medium text-sm mt-1 text-center md:text-left">Manage your support queries and interactions.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button
                            onClick={() => setActiveTab('open')}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold transition-all",
                                activeTab === 'open' ? "bg-white text-[#35503F] shadow-sm" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            <MessageSquare className="w-4 h-4" />
                            Open Tickets
                        </button>
                        <button
                            onClick={() => setActiveTab('all')}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold transition-all",
                                activeTab === 'all' ? "bg-white text-[#35503F] shadow-sm" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            <History className="w-4 h-4" />
                            All Tickets
                        </button>
                    </div>

                    <button 
                        onClick={() => {
                            if (hasPendingAction) {
                                toast.error("Please complete your pending actions first!", { icon: '🚫' });
                            } else {
                                setShowNewTicketForm(true);
                            }
                        }}
                        className={cn(
                            "px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 w-full sm:w-auto",
                            hasPendingAction 
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200" 
                                : "bg-[#35503F] text-[#FEF8C3] hover:bg-black shadow-[#35503F]/10"
                        )}
                    >
                        {hasPendingAction ? "Finish Ongoing Cases First" : "Raise New Ticket"}
                    </button>
                </div>
            </div>

            {/* New Ticket Modal-like Overlay */}
            {showNewTicketForm && (
                <div className="fixed inset-0 bg-[#35503F]/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl p-8 md:p-10 relative animate-in zoom-in-95 duration-200">
                        <button 
                            onClick={() => setShowNewTicketForm(false)}
                            className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>

                        <div className="mb-8">
                            <h3 className="text-2xl font-black text-[#35503F] tracking-tight">Create Support Ticket</h3>
                            <p className="text-gray-500 text-sm mt-1">Tell us what you need help with.</p>
                        </div>

                        <form onSubmit={handleCreateTicket} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                                    <select 
                                        required
                                        value={newTicketData.category}
                                        onChange={(e) => setNewTicketData({...newTicketData, category: e.target.value})}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-[#35503F]/5 focus:border-[#35503F]/20 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Select Category</option>
                                        <option value="virtual_office">Virtual Office</option>
                                        <option value="coworking">Coworking</option>
                                        <option value="billing">Billing & Payments</option>
                                        <option value="kyc">KYC & Documents</option>
                                        <option value="technical">Technical Issue</option>
                                        <option value="mail_services">Mail Services</option>
                                        <option value="bookings">Bookings</option>
                                        <option value="compliance">Compliance</option>
                                        <option value="leads">Leads</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Subject</label>
                                    <input 
                                        type="text" required minLength={5}
                                        placeholder="Briefly describe the issue..."
                                        value={newTicketData.subject}
                                        onChange={(e) => setNewTicketData({...newTicketData, subject: e.target.value})}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-[#35503F]/5 focus:border-[#35503F]/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Issue regarding any booking? (Optional)</label>
                                <div className="relative">
                                    <select 
                                        value={newTicketData.bookingId}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setNewTicketData({...newTicketData, bookingId: val});
                                            if (val && !newTicketData.category) {
                                                setNewTicketData(prev => ({...prev, bookingId: val, category: 'bookings'}));
                                            }
                                        }}
                                        onClick={() => userBookings.length === 0 && fetchUserBookings()}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-[#35503F]/5 focus:border-[#35503F]/20 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Not related to a booking</option>
                                        {loadingBookings ? (
                                            <option disabled>Loading your bookings...</option>
                                        ) : (
                                            userBookings.map((b: any) => (
                                                <option key={b._id} value={b._id}>
                                                    {b.bookingNumber} - {b.spaceSnapshot?.name || 'Workspace'}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                                        {loadingBookings ? <Loader2 className="w-4 h-4 animate-spin text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                                <textarea 
                                    required minLength={10} rows={4}
                                    placeholder="Please describe your issue in detail..."
                                    value={newTicketData.description}
                                    onChange={(e) => setNewTicketData({...newTicketData, description: e.target.value})}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-[#35503F]/5 focus:border-[#35503F]/20 transition-all resize-none"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowNewTicketForm(false)}
                                    className="flex-1 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest border border-gray-100 hover:bg-gray-50 transition-all active:scale-95"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={creatingTicket}
                                    className="flex-[2] py-4 rounded-2xl bg-[#35503F] text-[#FEF8C3] text-[11px] font-black uppercase tracking-widest shadow-xl shadow-[#35503F]/10 hover:bg-black transition-all active:scale-95 disabled:opacity-30"
                                >
                                    {creatingTicket ? "Generating Ticket..." : "Submit Support Request"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-hidden">
                {activeTab === 'open' ? (
                    <div className="h-full flex flex-col max-w-6xl mx-auto w-full p-4 lg:p-6 overflow-hidden">
                        {activeTicket ? (
                            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col h-full overflow-hidden relative">
                                {/* Ticket Header */}
                                <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-md z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-[#35503F] flex items-center justify-center text-[#FEF8C3] shadow-lg shadow-[#35503F]/20">
                                            <MessageCircle className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-extrabold text-lg text-[#35503F] leading-tight">{activeTicket.subject}</h3>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                                                    ID: #{activeTicket.ticketNumber}
                                                </span>
                                                <span className="text-[10px] font-bold text-gray-300">•</span>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                    {activeTicket.category.replace('_', ' ')}
                                                </span>
                                                <span className="text-[10px] font-bold text-gray-300">•</span>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                    Raised: {format(new Date(activeTicket.createdAt), 'dd MMM yyyy')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={cn(
                                        "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border",
                                        STATUS_CONFIG[activeTicket.status]?.color || 'bg-gray-100 text-gray-500 border-gray-200'
                                    )}>
                                        {STATUS_CONFIG[activeTicket.status]?.label || activeTicket.status}
                                    </div>
                                </div>

                                {/* Messages Area */}
                                <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth bg-[#FDFDFD] relative">
                                    {/* Subtle background pattern */}
                                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#35503F 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                                    
                                    {activeTicket.messages.map((msg, idx) => {
                                        const isUser = msg.sender === 'user';
                                        return (
                                            <div key={idx} className={cn("flex flex-col relative z-10", isUser ? "items-end" : "items-start")}>
                                                <div className={cn(
                                                    "max-w-[85%] md:max-w-[70%] p-4 rounded-2xl shadow-sm space-y-2 transition-all text-sm font-medium",
                                                    isUser 
                                                        ? "bg-gradient-to-br from-[#35503F] to-[#4A6D56] text-white rounded-tr-none shadow-green-900/10" 
                                                        : "bg-white text-[#35503F] rounded-tl-none border border-gray-100 shadow-gray-200/50"
                                                )}>
                                                    <div className="flex items-center justify-between gap-4 mb-1">
                                                        <span className={cn(
                                                            "text-[8px] font-black uppercase tracking-widest opacity-70",
                                                            isUser ? "text-[#FEF8C3]" : "text-gray-400"
                                                        )}>
                                                            {isUser ? (user?.fullName || 'You') : ROLE_LABEL[msg.sender]}
                                                        </span>
                                                        <span className={cn("text-[8px] font-bold opacity-50", isUser ? "text-white" : "text-gray-400")}>
                                                            {format(new Date(msg.createdAt), 'h:mm a')}
                                                        </span>
                                                    </div>
                                                    <p className="leading-relaxed whitespace-pre-wrap text-[13px] md:text-sm">{msg.message}</p>
                                                    {msg.attachments && msg.attachments.length > 0 && (
                                                        <div className="mt-3 flex flex-wrap gap-2">
                                                            {msg.attachments.map((url, i) => {
                                                                const isImage = url.match(/\.(jpg|jpeg|png|gif)$/i);
                                                                return (
                                                                    <a 
                                                                        key={i} 
                                                                        href={`${import.meta.env.VITE_API_URL || ''}${url}`} 
                                                                        target="_blank" 
                                                                        rel="noopener noreferrer"
                                                                        className="block group/file"
                                                                    >
                                                                        {isImage ? (
                                                                            <img 
                                                                                src={`${import.meta.env.VITE_API_URL || ''}${url}`} 
                                                                                alt="attachment" 
                                                                                className="w-32 h-32 object-cover rounded-xl border border-white/20 hover:scale-105 transition-transform"
                                                                            />
                                                                        ) : (
                                                                            <div className="flex items-center gap-2 bg-black/10 px-3 py-2 rounded-xl border border-white/10 hover:bg-black/20 transition-colors">
                                                                                <FileText className="w-4 h-4" />
                                                                                <span className="text-[10px] font-bold truncate max-w-[100px]">Attachment {i + 1}</span>
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
                                    })}

                                    {typingUser && (
                                        <div className="flex flex-col items-start gap-1 mt-2 animate-in fade-in slide-in-from-left-2 duration-300">
                                            <div className="bg-white border border-[#35503F]/10 px-4 py-2.5 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                                                <div className="flex gap-1">
                                                    <div className="w-1.5 h-1.5 bg-[#35503F] rounded-full" style={{ animation: 'typing-bounce 1s infinite' }} />
                                                    <div className="w-1.5 h-1.5 bg-[#35503F] rounded-full" style={{ animation: 'typing-bounce 1s infinite 0.2s' }} />
                                                    <div className="w-1.5 h-1.5 bg-[#35503F] rounded-full" style={{ animation: 'typing-bounce 1s infinite 0.4s' }} />
                                                </div>
                                                <span className="text-[10px] font-black text-[#35503F]/60 uppercase tracking-widest">
                                                    {typingUser} is typing...
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Feedback Section - Mini Style */}
                                    {(activeTicket.status === 'closed' || activeTicket.status === 'resolved') && (
                                        <div className="mt-8 py-8 border-t border-gray-100 max-w-sm mx-auto text-center space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                            <h4 className="text-2xl font-black text-[#35503F] tracking-tighter">
                                                {userRating === 5 ? "LOVED IT!" : userRating >= 1 ? "TELL US MORE!" : "RATE YOUR EXPERIENCE"}
                                            </h4>

                                            {activeTicket.feedbackSubmittedAt ? (
                                                <div className="space-y-2">
                                                    <div className="flex justify-center gap-1.5">
                                                        {[1, 2, 3, 4, 5].map(s => (
                                                            <Star key={s} className={cn("w-5 h-5", s <= (activeTicket.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-100")} />
                                                        ))}
                                                    </div>
                                                    <p className="text-[11px] text-gray-400 font-bold italic tracking-wide">"{activeTicket.ratingRemarks || 'No remarks provided'}"</p>
                                                    <div className="pt-2">
                                                        <span className="text-[8px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded uppercase tracking-[0.2em]">Feedback Submitted</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-6">
                                                    <div className="flex justify-center gap-3">
                                                        {[1, 2, 3, 4, 5].map(s => (
                                                            <button 
                                                                key={s} 
                                                                type="button"
                                                                onClick={() => {
                                                                    console.log('Star clicked:', s);
                                                                    setUserRating(s);
                                                                }}
                                                                className="transition-transform active:scale-90 hover:scale-110"
                                                            >
                                                                <Star 
                                                                    className={cn(
                                                                        "w-10 h-10 transition-all", 
                                                                        userRating >= s 
                                                                            ? "text-yellow-400 fill-yellow-400" 
                                                                            : "text-white fill-none stroke-[1.5px] stroke-black/20"
                                                                    )} 
                                                                />
                                                            </button>
                                                        ))}
                                                    </div>
                                                    
                                                    <div className="px-4">
                                                        <input 
                                                            type="text"
                                                            value={remarksInput}
                                                            onChange={(e) => setRemarksInput(e.target.value)}
                                                            placeholder="Give feedback so what we can improve..."
                                                            className="w-full py-2 bg-transparent border-b border-gray-200 text-sm font-semibold focus:border-[#35503F] transition-all outline-none text-center placeholder:text-gray-300"
                                                        />
                                                    </div>

                                                    <button 
                                                        onClick={handleSubmitFeedback}
                                                        disabled={userRating === 0 || feedbackSubmitting}
                                                        className="px-10 py-3 bg-[#35503F] text-[#FEF8C3] rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black shadow-lg shadow-[#35503F]/10 transition-all active:scale-95 disabled:opacity-20 mx-auto block mt-4"
                                                    >
                                                        {feedbackSubmitting ? "Submitting..." : "Submit Review"}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Input Area */}
                                {activeTicket.status !== 'closed' && activeTicket.status !== 'resolved' ? (
                                    <div className="p-6 bg-white border-t border-gray-100 relative z-10 shrink-0">
                                        {selectedFiles.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {selectedFiles.map((file, i) => (
                                                    <div key={i} className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-200">
                                                        <span className="text-[10px] font-bold text-gray-600 truncate max-w-[150px]">{file.name}</span>
                                                        <button onClick={() => removeFile(i)} className="p-0.5 hover:bg-gray-200 rounded-full">
                                                            <X className="w-3 h-3 text-gray-400" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3 bg-gray-50/80 rounded-2xl border border-gray-200 p-2 pl-4 focus-within:ring-4 focus-within:ring-[#35503F]/5 focus-within:border-[#35503F]/20 focus-within:bg-white transition-all">
                                            <input 
                                                type="file" 
                                                ref={fileInputRef} 
                                                onChange={handleFileSelect} 
                                                multiple 
                                                className="hidden" 
                                                accept="image/*,.pdf"
                                            />
                                            <button 
                                                onClick={() => fileInputRef.current?.click()}
                                                className="p-2 hover:bg-gray-200 rounded-xl transition-colors text-gray-400 hover:text-[#35503F]"
                                            >
                                                <Paperclip className="w-5 h-5" />
                                            </button>
                                            <input 
                                                type="text" value={messageInput}
                                                onChange={handleInputChange}
                                                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendReply()}
                                                placeholder="Type your message here..."
                                                className="flex-1 bg-transparent border-none focus:outline-none text-sm font-semibold text-gray-700 placeholder:text-gray-400"
                                            />
                                            <button
                                                onClick={handleSendReply}
                                                disabled={(!messageInput.trim() && selectedFiles.length === 0) || sending}
                                                className="w-11 h-11 rounded-xl bg-[#35503F] text-[#FEF8C3] flex items-center justify-center shadow-lg shadow-[#35503F]/20 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:scale-100 transition-all"
                                            >
                                                {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-6 bg-gray-50/80 border-t border-gray-100 text-center relative z-10 shrink-0">
                                        <div className="inline-flex items-center gap-2 px-6 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                                This ticket is {activeTicket.status}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-dashed border-gray-200 h-full">
                                <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-6">
                                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                                </div>
                                <h3 className="text-2xl font-black text-[#35503F] tracking-tight">Everything Sorted!</h3>
                                <p className="text-gray-500 font-medium max-w-xs mt-2">You don't have any pending tickets or feedback. Great job!</p>
                                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                                    <button 
                                        onClick={() => setActiveTab('all')} 
                                        className="px-8 py-3 bg-gray-100 text-[#35503F] rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
                                    >
                                        Browse History
                                    </button>
                                    <button 
                                        onClick={() => {
                                            if (hasPendingAction) {
                                                const pendingTicket = tickets.find(t => 
                                                    t.status === 'open' || 
                                                    t.status === 'in_progress' || 
                                                    ((t.status === 'resolved' || t.status === 'closed') && !t.feedbackSubmittedAt)
                                                );
                                                if (pendingTicket) {
                                                    setActiveTicketId(pendingTicket._id || pendingTicket.id);
                                                    setActiveTab('open');
                                                }
                                            } else {
                                                setShowNewTicketForm(true);
                                            }
                                        }}
                                        className={cn(
                                            "px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95",
                                            hasPendingAction 
                                                ? "bg-[#FEF8C3] text-[#35503F] border border-[#35503F]/10 hover:shadow-md" 
                                                : "bg-[#35503F] text-[#FEF8C3] hover:bg-black shadow-[#35503F]/10 ring-4 ring-[#35503F]/10"
                                        )}
                                    >
                                        {hasPendingAction ? "Resolve Pending Action" : "Raise New Ticket"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-full overflow-hidden flex flex-col p-4 lg:p-8 max-w-7xl mx-auto w-full">
                        {tickets.length === 0 ? (
                            <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 border-dashed">
                                <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No tickets found.</p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                                <div className="overflow-x-auto no-scrollbar">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-50 bg-gray-50/50">
                                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ticket ID</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Space Name</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Subject</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date / Raised On</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Progress</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {tickets.map(ticket => {
                                                const cfg = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open;
                                                return (
                                                    <tr 
                                                        key={ticket._id}
                                                        onClick={() => selectTicket(ticket._id)}
                                                        className="group hover:bg-[#35503F]/[0.02] cursor-pointer transition-colors"
                                                    >
                                                        <td className="px-6 py-5">
                                                            <span className="text-xs font-mono font-bold text-gray-400">#{ticket.ticketNumber.slice(-8)}</span>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <div className="flex items-center gap-2">
                                                                <Building2 className="w-4 h-4 text-gray-300" />
                                                                <span className={cn(
                                                                    "text-xs font-bold",
                                                                    ticket.bookingId?.spaceSnapshot?.name ? "text-[#35503F]" : "text-gray-400 italic"
                                                                )}>
                                                                    {ticket.bookingId?.spaceSnapshot?.name || "No Particular Space"}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-bold text-[#35503F] group-hover:text-primary transition-colors">{ticket.subject}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <div className="flex items-center gap-2">
                                                                <History className="w-3.5 h-3.5 text-gray-300" />
                                                                <span className="text-xs font-bold text-gray-600">{format(new Date(ticket.createdAt), 'dd MMM yyyy')}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                                                                {ticket.category.replace('_', ' ')}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <div className={cn(
                                                                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                                cfg.color
                                                            )}>
                                                                <cfg.icon className="w-3 h-3" />
                                                                {cfg.label}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5 text-right">
                                                            <button className="text-xs font-black text-[#35503F] uppercase tracking-widest bg-[#FEF8C3] px-3 py-1.5 rounded-xl border border-[#35503F]/10 hover:shadow-md transition-all">
                                                                View Chat
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="px-6 py-5 border-t border-gray-100 flex items-center justify-between bg-gray-50/50 mb-12">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                        Page <span className="text-[#35503F] px-1">{currentPage}</span> of {totalPages}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => fetchTickets(currentPage - 1)}
                                            disabled={currentPage === 1 || loading}
                                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-[#35503F] hover:border-[#35503F] transition-all disabled:opacity-20"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => fetchTickets(currentPage + 1)}
                                            disabled={currentPage === totalPages || loading}
                                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-[#35503F] hover:border-[#35503F] transition-all disabled:opacity-20"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
