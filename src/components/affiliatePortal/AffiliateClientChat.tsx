import React, { useState, useEffect, useRef } from 'react';
import {
    Search, Send, MessageSquare, Loader2, Zap, Users, AlertCircle,
    CheckCircle, RefreshCw, X,
} from 'lucide-react';
import { useSocket } from '@/contexts/SocketContext';
import { useAuth } from '@/contexts/AuthContext';
import axiosInstance from '@/lib/axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

// ─── Types ──────────────────────────────────────────────────────────────────

interface TicketMessage {
    sender: 'user' | 'support' | 'admin' | 'partner' | 'affiliate';
    message: string;
    attachments?: string[];
    createdAt: string;
}

interface AffiliateTicket {
    _id: string;
    id?: string;
    ticketNumber: string;
    subject: string;
    description: string;
    category: string;
    priority: string;
    status: string;
    chatType: 'user_admin' | 'user_partner';
    affiliateId?: string;
    tappedIn: string[];
    messages: TicketMessage[];
    user?: { _id?: string; fullName?: string; email?: string };
    bookingId?: { _id: string; bookingNumber: string; spaceSnapshot?: { name?: string } };
    createdAt: string;
    updatedAt: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getStatusColor = (status: string) => {
    switch (status) {
        case 'open': return 'bg-red-50 text-red-600 border-red-100';
        case 'in_progress': return 'bg-blue-50 text-blue-600 border-blue-100';
        case 'escalated': return 'bg-orange-50 text-orange-600 border-orange-100';
        case 'resolved': return 'bg-green-50 text-green-600 border-green-100';
        case 'closed': return 'bg-gray-50 text-gray-500 border-gray-100';
        default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
};

const getStatusLabel = (status: string) => ({
    open: 'Open', in_progress: 'In Progress',
    escalated: 'Escalated', resolved: 'Resolved', closed: 'Closed',
}[status] || status);

const ROLE_BADGE: Record<string, { bg: string; text: string; label: string; dot: string }> = {
    user: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Client', dot: 'bg-blue-400' },
    partner: { bg: 'bg-teal-100', text: 'text-teal-700', label: 'Space Partner', dot: 'bg-teal-400' },
    admin: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Admin', dot: 'bg-indigo-400' },
    affiliate: { bg: 'bg-white/25', text: 'text-white', label: 'You', dot: 'bg-white' },
    support: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'AI Support', dot: 'bg-purple-400 animate-pulse' },
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AffiliateClientChat() {
    const { socket } = useSocket();
    const { user } = useAuth();

    const [tickets, setTickets] = useState<AffiliateTicket[]>([]);
    const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [messageInput, setMessageInput] = useState('');
    const [sending, setSending] = useState(false);
    const [tappingIn, setTappingIn] = useState(false);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    const activeTicket = tickets.find(t => t._id === activeTicketId);
    const isTappedIn = activeTicket ? activeTicket.tappedIn.includes(user?.id || '') : false;
    const canSend = isTappedIn && activeTicket?.status !== 'closed' && activeTicket?.status !== 'resolved';

    const filteredTickets = tickets
        .filter(t =>
            t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.ticketNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.bookingId?.spaceSnapshot?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            const score = (s: string) => s === 'open' ? 3 : s === 'in_progress' ? 2 : s === 'escalated' ? 1 : 0;
            return (score(b.status) - score(a.status)) || new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });

    // ─── Fetch ────────────────────────────────────────────────────────────────

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get('/api/tickets/affiliate/my-chats');
            if (res.data.success) {
                const list: AffiliateTicket[] = res.data.data?.tickets || [];
                setTickets(list);
                if (!activeTicketId && list.length > 0) {
                    setActiveTicketId(list[0]._id);
                }
            }
        } catch (e) {
            console.error('Failed to fetch affiliate chats', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTickets(); }, []);

    useEffect(() => {
        const container = messagesContainerRef.current;
        if (container) {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [activeTicket?.messages]);

    // ─── Socket ───────────────────────────────────────────────────────────────

    useEffect(() => {
        if (!socket) return;
        if (activeTicketId) socket.emit('join_ticket', activeTicketId);

        const onNewMessage = (data: { ticketId: string; message: TicketMessage }) => {
            setTickets(prev => prev.map(t => {
                if (t._id !== data.ticketId) return t;
                const exists = t.messages.some(m =>
                    new Date(m.createdAt).getTime() === new Date(data.message.createdAt).getTime()
                    && m.message === data.message.message
                );
                if (exists) return t;
                return { ...t, messages: [...t.messages, data.message], updatedAt: new Date().toISOString() };
            }));
        };

        const onTapIn = (data: { ticketId: string; ticket: AffiliateTicket }) => {
            setTickets(prev => prev.map(t => t._id === data.ticketId ? { ...t, ...data.ticket } : t));
        };

        const onTicketUpdated = (data: { ticketId: string; ticket: AffiliateTicket }) => {
            setTickets(prev => prev.map(t => t._id === data.ticketId ? data.ticket : t));
        };

        const onAffiliateNewTicket = (data: { ticket: AffiliateTicket }) => {
            toast.success(`New query from a client: "${data.ticket?.subject || 'New Query'}"`, { icon: '🎯', duration: 5000 });
            fetchTickets();
        };

        socket.on('new_message', onNewMessage);
        socket.on('tap_in', onTapIn);
        socket.on('ticket_updated', onTicketUpdated);
        socket.on('affiliate_new_ticket', onAffiliateNewTicket);

        return () => {
            socket.off('new_message', onNewMessage);
            socket.off('tap_in', onTapIn);
            socket.off('ticket_updated', onTicketUpdated);
            socket.off('affiliate_new_ticket', onAffiliateNewTicket);
        };
    }, [socket, activeTicketId]);

    // ─── Actions ─────────────────────────────────────────────────────────────

    const handleTapIn = async () => {
        if (!activeTicketId) return;
        setTappingIn(true);
        try {
            const res = await axiosInstance.post(`/api/tickets/affiliate/${activeTicketId}/tap-in`);
            if (res.data.success) {
                toast.success('You have joined the conversation!', { icon: '🎯' });
                setTickets(prev => prev.map(t => t._id === activeTicketId ? { ...t, ...res.data.data } : t));
            }
        } catch (e: any) {
            toast.error(e.response?.data?.message || 'Failed to tap in');
        } finally {
            setTappingIn(false);
        }
    };

    const handleSendReply = async () => {
        if (!activeTicketId || !messageInput.trim()) return;
        setSending(true);
        try {
            const res = await axiosInstance.post(`/api/tickets/affiliate/${activeTicketId}/reply`, { message: messageInput.trim() });
            if (res.data.success) {
                setMessageInput('');
            }
        } catch (e: any) {
            toast.error(e.response?.data?.message || 'Failed to send message');
        } finally {
            setSending(false);
        }
    };

    // ─── Loading ─────────────────────────────────────────────────────────────

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="w-10 h-10 animate-spin text-amber-400" />
            </div>
        );
    }

    // ─── Empty ────────────────────────────────────────────────────────────────

    if (tickets.length === 0) {
        return (
            <div className="bg-white rounded-[24px] border border-gray-100 p-16 text-center shadow-sm">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-600 mb-2">No client queries yet</h3>
                <p className="text-gray-400 max-w-sm mx-auto text-sm">
                    When a client books a space using your coupon code and raises a query to the space partner, it will appear here.
                    You can <strong>Tap In</strong> to join the conversation.
                </p>
            </div>
        );
    }

    // ─── Main Layout ─────────────────────────────────────────────────────────

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[700px]">

            {/* ── Left panel: query list ─────────────────────────────── */}
            <div className="w-full lg:w-1/3 bg-white rounded-[24px] border border-gray-100 flex flex-col shadow-sm">
                <div className="p-6 border-b border-gray-100">
                    <div className="relative">
                        <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search queries..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all text-sm"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {filteredTickets.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">No matching queries</div>
                    ) : filteredTickets.map(ticket => {
                        const isActive = ticket._id === activeTicketId;
                        const tapped = ticket.tappedIn.includes(user?.id || '');
                        const lastMsg = ticket.messages[ticket.messages.length - 1];

                        return (
                            <div
                                key={ticket._id}
                                onClick={() => setActiveTicketId(ticket._id)}
                                className={`p-4 rounded-xl cursor-pointer transition-all ${isActive ? 'bg-amber-50 border border-amber-200 shadow-sm' : 'hover:bg-gray-50 border border-transparent'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isActive ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {ticket.user?.fullName?.substring(0, 2).toUpperCase() || 'US'}
                                        </div>
                                        <div className="overflow-hidden">
                                            <h4 className={`text-sm font-bold truncate ${isActive ? 'text-amber-900' : 'text-gray-900'}`}>
                                                {ticket.user?.fullName || 'Client'}
                                            </h4>
                                            <p className={`text-xs truncate max-w-[140px] mt-0.5 ${isActive ? 'text-amber-600' : 'text-gray-500'}`}>
                                                {ticket.subject}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-medium ml-2 shrink-0">
                                        {format(new Date(ticket.updatedAt || ticket.createdAt), 'h:mm a')}
                                    </span>
                                </div>

                                {ticket.bookingId?.spaceSnapshot?.name && (
                                    <p className="text-[10px] text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full w-fit mt-1 ml-[52px] font-medium truncate max-w-[180px]">
                                        {ticket.bookingId.spaceSnapshot.name}
                                    </p>
                                )}

                                {lastMsg && (
                                    <p className="text-[10px] text-gray-400 ml-[52px] mt-1 truncate max-w-[180px]">
                                        {lastMsg.sender === 'affiliate' ? 'You: ' : `${lastMsg.sender}: `}{lastMsg.message}
                                    </p>
                                )}

                                <div className="flex justify-between items-center mt-2 pl-[52px]">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border ${getStatusColor(ticket.status)}`}>
                                        {getStatusLabel(ticket.status)}
                                    </span>
                                    {tapped ? (
                                        <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold">JOINED</span>
                                    ) : (
                                        <span className="text-[9px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full font-bold">OBSERVER</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Right panel: chat window ───────────────────────────── */}
            <div className="w-full lg:w-2/3 bg-white rounded-[24px] border border-gray-100 flex flex-col shadow-sm overflow-hidden">
                {activeTicket ? (
                    <>
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold bg-amber-100 text-amber-700">
                                    {activeTicket.user?.fullName?.substring(0, 2).toUpperCase() || 'US'}
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">{activeTicket.user?.fullName || 'Client'}</h2>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {activeTicket.ticketNumber}
                                        {activeTicket.bookingId?.spaceSnapshot?.name && (
                                            <span className="text-teal-600"> · {activeTicket.bookingId.spaceSnapshot.name}</span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* tapped-in count */}
                                {activeTicket.tappedIn.length > 0 && (
                                    <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-1 rounded-full font-bold flex items-center gap-1">
                                        <Users className="w-3 h-3" />
                                        {activeTicket.tappedIn.length} joined
                                    </span>
                                )}

                                {/* Tap In button */}
                                {!isTappedIn && activeTicket.status !== 'closed' && activeTicket.status !== 'resolved' && (
                                    <button
                                        onClick={handleTapIn}
                                        disabled={tappingIn}
                                        className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                                    >
                                        {tappingIn ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                                        Tap In
                                    </button>
                                )}

                                <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full border ${getStatusColor(activeTicket.status)}`}>
                                    {getStatusLabel(activeTicket.status)}
                                </span>
                            </div>
                        </div>

                        {/* Tap-in note */}
                        {!isTappedIn && (
                            <div className="px-6 py-2.5 bg-amber-50 border-b border-amber-100 text-xs text-amber-700 font-medium">
                                ⚡ You're observing — click <strong>Tap In</strong> to join and reply without interrupting the existing conversation.
                            </div>
                        )}
                        {isTappedIn && (
                            <div className="px-6 py-2 bg-amber-50/60 border-b border-amber-100 text-[11px] text-amber-600 font-semibold flex items-center gap-1.5">
                                <Zap className="w-3 h-3" /> You have joined — this is now a group conversation
                            </div>
                        )}

                        {/* Messages */}
                        <div 
                            ref={messagesContainerRef}
                            className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/50 scroll-smooth"
                        >
                            {activeTicket.messages.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <MessageSquare className="w-12 h-12 mb-2 opacity-20" />
                                    <p>No messages yet.</p>
                                </div>
                            )}

                            {activeTicket.messages.map((msg, idx) => {
                                const isMe = msg.sender === 'affiliate';
                                const isPartner = msg.sender === 'partner';
                                const isAdmin = msg.sender === 'admin' || msg.sender === 'support';
                                const isRightSide = isMe;

                                const badge = ROLE_BADGE[msg.sender] || ROLE_BADGE.user;

                                // Identifier shown next to badge
                                const getIdentifier = (): string => {
                                    if (msg.sender === 'user') return activeTicket.user?.email || activeTicket.user?.fullName || 'Client';
                                    if (msg.sender === 'affiliate') return user?.email || 'affiliate@flashspace.io';
                                    if (msg.sender === 'partner') return 'partner@flashspace.io';
                                    if (msg.sender === 'admin') return 'admin@flashspace.io';
                                    return 'AI · flashspace.io';
                                };

                                // Bubble style
                                const getBubble = (): string => {
                                    if (isMe) return 'bg-[#d97706] text-white rounded-tr-none';
                                    if (isPartner) return 'bg-teal-600 text-white rounded-tl-none';
                                    if (isAdmin) return 'bg-purple-50 text-gray-800 border border-purple-100 rounded-tl-none';
                                    return 'bg-white text-gray-800 border border-gray-200 rounded-tl-none';
                                };

                                // System messages
                                const isSystem = msg.message.startsWith('[') && msg.message.endsWith(']');
                                if (isSystem) {
                                    return (
                                        <div key={idx} className="flex justify-center">
                                            <span className="text-[10px] text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                                                {msg.message.replace(/\[|\]/g, '')}
                                            </span>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={idx} className={`flex ${isRightSide ? 'justify-end' : 'justify-start'}`}>
                                        <div className="max-w-[80%] space-y-1.5">
                                            <div className={`p-4 rounded-2xl shadow-sm ${getBubble()}`}>
                                                {/* Badge row */}
                                                <div className={`flex items-center gap-1.5 mb-2 ${isRightSide ? 'flex-row-reverse' : ''}`}>
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${badge.bg} ${badge.text}`}>
                                                        <span className={`w-1 h-1 rounded-full shrink-0 ${badge.dot}`} />
                                                        {badge.label}
                                                    </span>
                                                    <span className={`text-[10px] font-medium truncate max-w-[140px] ${(isMe || isPartner) ? 'text-white/60' : 'text-gray-400'}`}>
                                                        {getIdentifier()}
                                                    </span>
                                                </div>

                                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                                            </div>
                                            <span className={`text-[10px] text-gray-400 block px-1 ${isRightSide ? 'text-right' : ''}`}>
                                                {format(new Date(msg.createdAt), 'h:mm a')}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Input */}
                        {canSend ? (
                            <div className="p-6 bg-white border-t border-gray-100">
                                <div className="flex items-center gap-4 bg-gray-50 p-2 pr-2 rounded-2xl border border-gray-200 focus-within:ring-2 focus-within:ring-amber-100 focus-within:border-amber-200 transition-all">
                                    <input
                                        type="text"
                                        value={messageInput}
                                        onChange={e => setMessageInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSendReply()}
                                        placeholder="Type your reply..."
                                        className="flex-1 bg-transparent border-none focus:outline-none px-4 text-sm text-gray-700 placeholder:text-gray-400"
                                    />
                                    <button
                                        onClick={handleSendReply}
                                        disabled={!messageInput.trim() || sending}
                                        className="p-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors shadow-md shadow-amber-200 flex items-center justify-center disabled:opacity-50"
                                    >
                                        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        ) : !isTappedIn ? (
                            <div className="p-6 bg-amber-50 border-t border-amber-100 text-center text-amber-700 text-sm font-medium">
                                Click <strong>Tap In</strong> above to join and send messages.
                            </div>
                        ) : (
                            <div className="p-6 bg-gray-50 border-t border-gray-100 text-center text-gray-500 text-sm">
                                This query is {getStatusLabel(activeTicket.status).toLowerCase()}.
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
                        <h3 className="text-xl font-bold text-gray-600">Select a query</h3>
                        <p>Choose a query from the left to view</p>
                    </div>
                )}
            </div>
        </div>
    );
}