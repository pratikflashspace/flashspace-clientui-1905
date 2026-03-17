import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Send, MessageSquare, Loader2, RefreshCw, CheckCircle2, Clock, X, AlertCircle } from 'lucide-react';
import { useSocket } from '@/contexts/SocketContext';
import { useAuth } from '@/contexts/AuthContext';
import axiosInstance from '@/lib/axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

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
    user?: { fullName?: string; email?: string }; // Populated in some contexts
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

export default function ChatSupport() {
    const { socket } = useSocket();
    const { user } = useAuth();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [messageInput, setMessageInput] = useState('');
    const [sending, setSending] = useState(false);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    const activeTicket = tickets.find(t => t._id === activeTicketId);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get('/api/tickets/my-tickets', { params: { limit: 50 } });
            if (res.data.success) {
                const sorted = (res.data.data?.tickets || []).sort(
                    (a: Ticket, b: Ticket) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                );
                setTickets(sorted);
                if (!activeTicketId && sorted.length > 0) {
                    setActiveTicketId(sorted[0]._id);
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
    }, []);

    // Scroll to bottom when messages change
    useEffect(() => {
        const container = messagesContainerRef.current;
        if (container) {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [activeTicket?.messages]);

    // Socket: join the active ticket room and listen for new messages
    useEffect(() => {
        if (!socket) return;

        if (activeTicketId) {
            socket.emit('join_ticket', activeTicketId);
        }

        const handleNewMessage = (data: { ticketId: string; message: TicketMessage }) => {
            setTickets(prev => prev.map(t => {
                if (t._id !== data.ticketId) return t;
                const exists = t.messages.some(m =>
                    new Date(m.createdAt).getTime() === new Date(data.message.createdAt).getTime() &&
                    m.message === data.message.message
                );
                if (exists) return t;
                return { ...t, messages: [...t.messages, data.message], updatedAt: new Date().toISOString() };
            }));

            // Toast for partner responses
            if (data.message.sender === 'partner') {
                toast.success('Your space partner replied to your query!', { icon: '💬' });
            }
        };

        const handleTicketUpdated = (data: { ticketId: string; ticket: Ticket }) => {
            setTickets(prev => prev.map(t => t._id === data.ticketId ? data.ticket : t));
        };

        socket.on('new_message', handleNewMessage);
        socket.on('ticket_updated', handleTicketUpdated);

        return () => {
            socket.off('new_message', handleNewMessage);
            socket.off('ticket_updated', handleTicketUpdated);
        };
    }, [socket, activeTicketId]);

    const handleSendReply = async () => {
        if (!activeTicketId || !messageInput.trim()) return;
        setSending(true);
        try {
            const res = await axiosInstance.post(`/api/tickets/${activeTicketId}/reply`, {
                message: messageInput.trim(),
            });
            if (res.data.success) {
                setMessageInput('');
            } else {
                toast.error('Failed to send message');
            }
        } catch (e) {
            toast.error('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const getSenderLabel = (sender: string, ticket: Ticket) => {
        if (sender === 'user') return 'You';
        if (sender === 'partner') return 'Space Partner';
        if (sender === 'admin') return 'Support Team';
        return 'AI Support';
    };

     // Role badge config: bg color + text color + label
    const ROLE_BADGE: Record<string, { bg: string; text: string; label: string; dot: string }> = {
        user: { bg: 'bg-emerald-700/30', text: 'text-emerald-100', label: 'Client', dot: 'bg-emerald-300' },
        partner: { bg: 'bg-teal-500/30', text: 'text-teal-100', label: 'Space Partner', dot: 'bg-teal-300' },
        admin: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Admin', dot: 'bg-indigo-400' },
        support: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'AI Support', dot: 'bg-purple-400' },
    };

    const getSenderIdentifier = (sender: string, ticket: Ticket, currentUserEmail?: string): string => {
        if (sender === 'user') return currentUserEmail || ticket.user?.email || '';
        if (sender === 'partner' && ticket.assignee?.email) return ticket.assignee.email;
        if (sender === 'admin') return 'flashspace.io';
        return 'AI · flashspace.io';
    };

    const getSenderColors = (sender: string) => {
        if (sender === 'user') return 'bg-[#35503F] text-white rounded-tr-none';
        if (sender === 'partner') return 'bg-teal-600 text-white rounded-tl-none';
        if (sender === 'admin') return 'bg-indigo-50 text-gray-800 border border-indigo-100 rounded-tl-none';
        if (sender === 'affiliate') return 'bg-amber-50 text-gray-800 border border-amber-200 rounded-tl-none';
        return 'bg-gray-100 text-gray-700 rounded-tl-none';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#35503F]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="mb-6 pl-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        My <span className="text-[#35503F] italic">Queries</span>
                    </h1>
                    <p className="text-gray-500 mt-2">Chat with your space partner about your bookings</p>
                </div>

                {tickets.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
                        <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-600 mb-2">No queries yet</h3>
                        <p className="text-gray-400 max-w-sm mx-auto">
                            Go to <strong>My Bookings</strong> and click <strong>Raise Query</strong> on any booking to start a chat with your space partner.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-260px)] min-h-[500px]">
                        {/* Ticket List */}
                        <div className="w-full lg:w-1/3 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                            <div className="p-4 border-b border-gray-100 font-semibold text-gray-700 text-sm">
                                All Queries ({tickets.length})
                            </div>
                            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                                {tickets.map(ticket => {
                                    const cfg = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open;
                                    const StatusIcon = cfg.icon;
                                    const isActive = ticket._id === activeTicketId;
                                    const lastMsg = ticket.messages[ticket.messages.length - 1];
                                    return (
                                        <div
                                            key={ticket._id}
                                            onClick={() => setActiveTicketId(ticket._id)}
                                            className={`p-4 cursor-pointer transition-all ${isActive ? 'bg-[#35503F]/5 border-l-4 border-[#35503F]' : 'hover:bg-gray-50'}`}
                                        >
                                            <div className="flex justify-between mb-1">
                                                <h4 className={`text-sm font-bold truncate flex-1 mr-2 ${isActive ? 'text-[#35503F]' : 'text-gray-900'}`}>
                                                    {ticket.subject}
                                                </h4>
                                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${cfg.color}`}>
                                                    {cfg.label}
                                                </span>
                                            </div>
                                            {ticket.bookingId?.spaceSnapshot?.name && (
                                                <p className="text-[10px] text-teal-600 font-medium mb-1">{ticket.bookingId.spaceSnapshot.name}</p>
                                            )}
                                            {lastMsg && (
                                                <p className="text-xs text-gray-400 truncate">
                                                    {getSenderLabel(lastMsg.sender, ticket)}: {lastMsg.message}
                                                </p>
                                            )}
                                            <p className="text-[10px] text-gray-300 mt-1">{format(new Date(ticket.updatedAt), 'd MMM, h:mm a')}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Chat Window */}
                        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                            {activeTicket ? (
                                <>
                                    {/* Header */}
                                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                                        <div>
                                            <h2 className="font-bold text-gray-900">{activeTicket.subject}</h2>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {activeTicket.ticketNumber}
                                                {activeTicket.bookingId?.spaceSnapshot?.name && (
                                                    <span className="text-teal-600"> · {activeTicket.bookingId.spaceSnapshot.name}</span>
                                                )}
                                            </p>
                                        </div>
                                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_CONFIG[activeTicket.status]?.color || 'bg-gray-100 text-gray-500'}`}>
                                            {STATUS_CONFIG[activeTicket.status]?.label || activeTicket.status}
                                        </span>
                                    </div>

                                    {/* Messages */}
                                    <div 
                                        ref={messagesContainerRef}
                                        className="flex-1 overflow-y-auto p-6 space-y-5 bg-gray-50/50 scroll-smooth"
                                    >
                                        {activeTicket.messages.length === 0 && (
                                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                                <MessageSquare className="w-10 h-10 mb-2 opacity-20" />
                                                <p className="text-sm">No messages yet</p>
                                            </div>
                                        )}
                                        {activeTicket.messages.map((msg, idx) => {
                                            const isUser = msg.sender === 'user';
                                            const badge = ROLE_BADGE[msg.sender] || ROLE_BADGE.support;
                                            const identifier = getSenderIdentifier(msg.sender, activeTicket, user?.email);
                                            return (
                                                <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                                                    <div className="max-w-[75%]">
                                                        <div className={`p-3.5 rounded-2xl text-sm shadow-sm ${getSenderColors(msg.sender)}`}>
                                                             {/* Role badge + sender name row */}
                                                            <div className={`flex items-center gap-1.5 mb-2 ${isUser ? 'flex-row-reverse' : ''}`}>
                                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${badge.bg} ${badge.text}`}>
                                                                    <span className={`w-1 h-1 rounded-full shrink-0 ${badge.dot}`} />
                                                                    {badge.label}
                                                                </span>
                                                                {identifier && (
                                                                    <span className={`text-[10px] font-medium truncate max-w-[120px] ${isUser ? 'text-white/60' : 'text-gray-400'}`}>
                                                                        {identifier}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                                                        </div>
                                                        <span className={`text-[10px] text-gray-400 mt-1 block px-1 ${isUser ? 'text-right' : ''}`}>
                                                            {format(new Date(msg.createdAt), 'h:mm a')}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Input */}
                                    {activeTicket.status !== 'closed' && activeTicket.status !== 'resolved' ? (
                                        <div className="p-4 bg-white border-t border-gray-100">
                                            <div className="flex items-center gap-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-[#35503F]/20 p-2 pr-2">
                                                <input
                                                    type="text"
                                                    value={messageInput}
                                                    onChange={e => setMessageInput(e.target.value)}
                                                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSendReply()}
                                                    placeholder="Type your message..."
                                                    className="flex-1 bg-transparent border-none focus:outline-none px-3 text-sm text-gray-700 placeholder:text-gray-400"
                                                />
                                                <button
                                                    onClick={handleSendReply}
                                                    disabled={!messageInput.trim() || sending}
                                                    className="p-2.5 bg-[#35503F] text-white rounded-lg hover:bg-[#35503F]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                                >
                                                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center text-sm text-gray-500">
                                            This query is {activeTicket.status}.
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
                                    <p className="font-semibold text-gray-500">Select a query to view</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
