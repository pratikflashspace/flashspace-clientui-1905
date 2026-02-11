import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
    Search,
    Filter,
    Plus,
    Eye,
    Clock,
    CheckCircle,
    AlertCircle,
    MoreHorizontal,
    Ticket,
    ArrowUpRight,
    X,
    MessageSquare,
    RefreshCw,
    User,
    Send
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { adminService, AdminTicketData, TicketStats } from '@/services/admin.service';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import playNotificationSound, { initAudioContext } from '@/utils/sound.util';

export default function TicketSystem() {
    const { user } = useAuth();
    const { socket } = useSocket();
    const [activeTab, setActiveTab] = useState('All Tickets');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<AdminTicketData | null>(null);
    const [tickets, setTickets] = useState<AdminTicketData[]>([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<TicketStats>({
        open: 0,
        in_progress: 0,
        escalated: 0,
        resolved: 0,
        closed: 0,
        avgResolution: "4.2 hrs",
        resolvedThisMonth: 0,
        totalTickets: 0
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [replyMessage, setReplyMessage] = useState('');

    // Form State
    const [newTicket, setNewTicket] = useState({
        title: '',
        client: '',
        category: 'technical',
        description: ''
    });

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const filters: {
                status?: string;
                search?: string;
                page?: number;
                limit?: number;
            } = {};

            if (activeTab !== 'All Tickets') {
                filters.status = activeTab.toLowerCase();
            }
            if (searchTerm) {
                filters.search = searchTerm;
            }

            const response = await adminService.getAllTickets(filters);
            if (response.success && response.data) {
                setTickets(response.data.tickets || []);
            }
        } catch (err: unknown) {
            console.error('Failed to fetch tickets', err);
            toast.error('Failed to load tickets');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await adminService.getTicketStats();
            if (response.success && response.data) {
                setStats(response.data);
            }
        } catch (err: unknown) {
            console.error('Failed to fetch stats', err);
        }
    };

    useEffect(() => {
        fetchTickets();
        fetchStats();
    }, [activeTab, searchTerm]);

    // Socket listener
    useEffect(() => {
        if (!socket || !selectedTicket) return;

        socket.emit('join_ticket', selectedTicket._id);

        const handleNewMessage = (data: { ticketId: string, message: any }) => {
            if (data.ticketId === selectedTicket._id) {
                // Update selected ticket messages
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

                // Refresh list to update previews/unread status if needed
                fetchTickets();
            }
        };

        const handleTicketUpdated = (data: { ticketId: string, ticket: any }) => {
            if (data.ticketId === selectedTicket._id) {
                setSelectedTicket(data.ticket);
                fetchTickets();
                fetchStats();
            }
        };

        socket.on('new_message', handleNewMessage);
        socket.on('ticket_updated', handleTicketUpdated);

        return () => {
            socket.off('new_message', handleNewMessage);
            socket.off('ticket_updated', handleTicketUpdated);
        };
    }, [socket, selectedTicket?._id]);

    // Admin Feed Listener (Global)
    useEffect(() => {
        if (!socket) {
            console.log("Socket not available for admin feed");
            return;
        }

        console.log("Emitting join_admin_feed");
        socket.emit('join_admin_feed');

        const handleNewTicket = (ticket: any) => {
            console.log("Received new_ticket_created event!", ticket);
            try {
                playNotificationSound();
                console.log("Sound played");
            } catch (e) {
                console.error("Error playing sound:", e);
            }

            toast.success(`New Ticket: ${ticket.subject}`, {
                duration: 5000,
                position: 'top-right',
                icon: '🎫'
            });
            fetchTickets();
            fetchStats();
        };

        socket.on('new_ticket_created', handleNewTicket);

        return () => {
            socket.off('new_ticket_created', handleNewTicket);
        };
    }, [socket]);

    const handleCreateTicket = async () => {
        if (!newTicket.title || !newTicket.client) return;

        try {
            // This would be an admin-created ticket on behalf of user
            // You might need a different API endpoint for this
            alert('Admin ticket creation would go here');
            setIsCreateOpen(false);
            setNewTicket({
                title: '',
                client: '',
                category: 'technical',
                description: ''
            });
            fetchTickets();
        } catch (err: unknown) {
            console.error('Failed to create ticket', err);
        }
    };

    const handleAssignTicket = async (ticketId: string) => {
        try {
            if (user?._id || user?.id) {
                const userId = user._id || user.id;
                const response = await adminService.assignTicket(ticketId, userId);
                if (response.success) {
                    toast.success('Ticket assigned successfully!');
                    fetchTickets();
                    if (selectedTicket?._id === ticketId) {
                        setSelectedTicket(response.data || null);
                    }
                }
            }
        } catch (err: unknown) {
            console.error('Failed to assign ticket', err);
            toast.error('Failed to assign ticket');
        }
    };

    const handleResolveTicket = async (ticketId: string) => {
        try {
            const response = await adminService.resolveTicket(ticketId);
            if (response.success) {
                toast.success('Ticket resolved successfully!');
                fetchTickets();
                fetchStats();
                if (selectedTicket?._id === ticketId) {
                    setSelectedTicket(response.data || null);
                }
            }
        } catch (err: unknown) {
            console.error('Failed to resolve ticket', err);
            toast.error('Failed to resolve ticket');
        }
    };

    const handleEscalateTicket = async (ticketId: string) => {
        try {
            const response = await adminService.escalateTicket(ticketId);
            if (response.success) {
                toast.success('Ticket escalated!');
                fetchTickets();
                if (selectedTicket?._id === ticketId) {
                    setSelectedTicket(response.data || null);
                }
            }
        } catch (err: unknown) {
            console.error('Failed to escalate ticket', err);
            toast.error('Failed to escalate ticket');
        }
    };

    const handleCloseTicket = async (ticketId: string) => {
        try {
            const response = await adminService.closeTicket(ticketId);
            if (response.success) {
                toast.success('Ticket closed permanently');
                fetchTickets();
                fetchStats();
                if (selectedTicket?._id === ticketId) {
                    setSelectedTicket(response.data || null);
                }
            }
        } catch (err: unknown) {
            console.error('Failed to close ticket', err);
            toast.error('Failed to close ticket');
        }
    };

    const handleReply = async () => {
        if (!selectedTicket || !replyMessage.trim()) return;

        try {
            const response = await adminService.replyToTicket(selectedTicket._id, replyMessage);
            if (response.success) {
                toast.success('Reply sent!');
                setSelectedTicket(response.data || null);
                setReplyMessage('');
                fetchTickets();
            }
        } catch (err: unknown) {
            console.error('Failed to send reply', err);
            toast.error('Failed to send reply');
        }
    };



    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'open': return 'bg-white border-gray-200 text-gray-700';
            case 'in_progress': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'escalated': return 'bg-orange-50 text-orange-600 border-orange-100';
            case 'resolved': return 'bg-green-50 text-green-600 border-green-100';
            case 'closed': return 'bg-gray-50 text-gray-600 border-gray-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'open': return <Clock className="w-3.5 h-3.5" />;
            case 'in_progress': return <ArrowUpRight className="w-3.5 h-3.5" />;
            case 'escalated': return <AlertCircle className="w-3.5 h-3.5" />;
            case 'resolved': return <CheckCircle className="w-3.5 h-3.5" />;
            case 'closed': return <CheckCircle className="w-3.5 h-3.5" />;
            default: return null;
        }
    };

    const formatStatus = (status: string) => {
        switch (status) {
            case 'in_progress': return 'In Progress';
            case 'escalated': return 'Escalated';
            case 'open': return 'Open';
            case 'resolved': return 'Resolved';
            case 'closed': return 'Closed';
            default: return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        }
    };



    const formatCategory = (category: string) => {
        return category.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    return (
        <>
            <div className="min-h-screen bg-transparent space-y-8 font-sans animate-in fade-in duration-500 pb-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            Ticket <span className="text-teal-500 italic">System</span>
                        </h1>
                        <p className="text-gray-500 mt-2 text-lg font-light">
                            Manage and resolve support tickets
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={fetchTickets}
                            className="flex items-center gap-2 px-4 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200 font-medium"
                        >
                            <RefreshCw className="w-5 h-5" />
                            <span>Refresh</span>
                        </button>
                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors shadow-md shadow-teal-200 font-medium"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Create Ticket</span>
                        </button>
                    </div>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
                        <h3 className="text-3xl font-extrabold tracking-tight text-gray-900">{stats.open}</h3>
                        <p className="text-gray-500 font-medium mt-1 text-sm">Open Tickets</p>
                    </div>
                    <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
                        <h3 className="text-3xl font-extrabold tracking-tight text-blue-600">{stats.in_progress}</h3>
                        <p className="text-gray-500 font-medium mt-1 text-sm">In Progress</p>
                    </div>
                    <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
                        <h3 className="text-3xl font-extrabold tracking-tight text-orange-600">{stats.escalated}</h3>
                        <p className="text-gray-500 font-medium mt-1 text-sm">Escalated</p>
                    </div>
                    <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
                        <h3 className="text-3xl font-extrabold tracking-tight text-green-600">{stats.resolvedThisMonth}</h3>
                        <p className="text-gray-500 font-medium mt-1 text-sm">Resolved (MTD)</p>
                    </div>
                    <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
                        <h3 className="text-3xl font-extrabold tracking-tight text-gray-900">{stats.totalTickets}</h3>
                        <p className="text-gray-500 font-medium mt-1 text-sm">Total Tickets</p>
                    </div>
                </div>

                {/* Filter & Table Section */}
                <div className="space-y-6">
                    {/* Search */}
                    <div className="relative">
                        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-100 transition-all text-sm shadow-sm"
                        />
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                        {['All Tickets', 'open', 'in_progress', 'escalated', 'resolved', 'closed'].map((tab) => {
                            const displayName = tab === 'All Tickets' ? 'All Tickets' : formatStatus(tab);
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-transparent text-gray-500 hover:bg-gray-100'
                                        }`}
                                >
                                    {displayName}
                                </button>
                            );
                        })}
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
                        {loading ? (
                            <div className="p-8 text-center">
                                <RefreshCw className="w-8 h-8 text-teal-500 animate-spin mx-auto mb-3" />
                                <p className="text-gray-500">Loading tickets...</p>
                            </div>
                        ) : tickets.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 text-sm">
                                No tickets found in this view.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50/50 text-gray-900 font-semibold border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-5">Ticket</th>
                                            <th className="px-6 py-5">Client</th>
                                            <th className="px-6 py-5">Category</th>
                                            <th className="px-6 py-5">Assignee</th>
                                            <th className="px-6 py-5">Created</th>
                                            <th className="px-6 py-5">Status</th>
                                            <th className="px-6 py-5 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {tickets.map((ticket) => (
                                            <tr key={ticket._id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-6 py-5">
                                                    <div>
                                                        <span className="text-xs text-gray-400 font-mono block mb-1">{ticket.ticketNumber}</span>
                                                        <p className="font-bold text-gray-900 text-base">{ticket.subject}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                                                            {ticket.user?.fullName?.substring(0, 2).toUpperCase() || 'US'}
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-600 font-medium block">{ticket.user?.fullName || 'Unknown'}</span>
                                                            <span className="text-xs text-gray-400">{ticket.user?.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium border border-gray-200">
                                                        {formatCategory(ticket.category)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    {ticket.assignee ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center text-[10px] font-bold">
                                                                {ticket.assignee.fullName.substring(0, 2).toUpperCase()}
                                                            </div>
                                                            <span className="text-gray-500 text-xs">{ticket.assignee.fullName}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">Unassigned</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-5 text-gray-500 text-sm">
                                                    {new Date(ticket.createdAt).toLocaleDateString('en-IN')}
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(ticket.status)}`}>
                                                        {getStatusIcon(ticket.status)}
                                                        <span>{formatStatus(ticket.status)}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex gap-2 justify-end">
                                                        <button
                                                            onClick={() => setSelectedTicket(ticket)}
                                                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-600 text-xs font-medium hover:bg-gray-50 transition-colors shadow-sm"
                                                        >
                                                            <Eye className="w-3.5 h-3.5" />
                                                            <span>View</span>
                                                        </button>
                                                        {ticket.status === 'open' && (
                                                            <button
                                                                onClick={() => handleAssignTicket(ticket._id)}
                                                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50 border border-teal-100 rounded-lg text-teal-600 text-xs font-medium hover:bg-teal-100 transition-colors"
                                                            >
                                                                <User className="w-3.5 h-3.5" />
                                                                <span>Assign</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Ticket Detail Modal */}
                {selectedTicket && (
                    <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
                        <DialogContent className="sm:max-w-4xl bg-white rounded-3xl border-0 shadow-2xl p-0 overflow-hidden">
                            <DialogHeader className="px-6 py-5 border-b border-gray-100">
                                <div>
                                    <DialogTitle className="text-2xl font-bold text-gray-900 pr-10">{selectedTicket.subject}</DialogTitle>
                                    <p className="text-sm text-gray-500 mt-1">{selectedTicket.ticketNumber}</p>
                                </div>
                            </DialogHeader>

                            <div className="p-6 max-h-[70vh] overflow-y-auto">
                                {/* Ticket Info */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <p className="text-sm text-gray-500">Client</p>
                                        <p className="font-medium">{selectedTicket.user?.fullName}</p>
                                        <p className="text-xs text-gray-400">{selectedTicket.user?.email}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <p className="text-sm text-gray-500">Client</p>
                                        <p className="font-medium">{selectedTicket.user?.fullName}</p>
                                        <p className="text-xs text-gray-400">{selectedTicket.user?.email}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <p className="text-sm text-gray-500">Status</p>
                                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${getStatusStyle(selectedTicket.status)}`}>
                                            {formatStatus(selectedTicket.status)}
                                        </span>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <p className="text-sm text-gray-500">Category</p>
                                        <p className="font-medium">{formatCategory(selectedTicket.category)}</p>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="mb-6">
                                    <h3 className="font-semibold text-gray-900 mb-2">Issue Description</h3>
                                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100">{selectedTicket.description}</p>
                                </div>

                                {/* Chat Messages Section */}
                                <div className="mb-6">
                                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4 text-teal-500" />
                                        Conversation ({selectedTicket.messages?.length || 0} messages)
                                    </h3>
                                    <div className="bg-gray-50 rounded-2xl p-5 max-h-96 overflow-y-auto space-y-4 border border-gray-100 scrollbar-thin scrollbar-thumb-gray-300">
                                        {selectedTicket.messages?.length === 0 ? (
                                            <div className="text-center py-12">
                                                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                                <p className="text-gray-400 font-medium">No messages yet</p>
                                                <p className="text-gray-400 text-sm">Start the conversation below!</p>
                                            </div>
                                        ) : (
                                            selectedTicket.messages?.map((msg, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm ${msg.sender === 'admin'
                                                        ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-br-sm'
                                                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
                                                        }`}>
                                                        <div className="flex items-center gap-2 mb-1.5">
                                                            <span className={`text-xs font-semibold ${msg.sender === 'admin' ? 'text-teal-100' : 'text-gray-500'}`}>
                                                                {msg.sender === 'user' ? selectedTicket.user?.fullName : 'You (Support)'}
                                                            </span>
                                                            <span className={`text-xs ${msg.sender === 'admin' ? 'text-teal-200' : 'text-gray-400'}`}>
                                                                {new Date(msg.createdAt).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                        <p className={`text-sm leading-relaxed ${msg.sender === 'admin' ? 'text-white' : 'text-gray-700'}`}>{msg.message}</p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Reply Section - Disabled when resolved/closed */}
                                {(selectedTicket.status === 'resolved' || selectedTicket.status === 'closed') ? (
                                    <div className="border-t border-gray-100 pt-4">
                                        <div className="bg-gray-100 rounded-xl p-4 text-center">
                                            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                            <p className="text-gray-600 font-medium">
                                                This ticket has been {selectedTicket.status === 'resolved' ? 'resolved' : 'closed'}
                                            </p>
                                            <p className="text-sm text-gray-400">No further replies can be sent</p>
                                            {selectedTicket.status === 'resolved' && (
                                                <button
                                                    onClick={() => handleCloseTicket(selectedTicket._id)}
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
                                                onClick={handleReply}
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
                                                {selectedTicket.status !== 'escalated' && (
                                                    <button
                                                        onClick={() => handleEscalateTicket(selectedTicket._id)}
                                                        className="px-4 py-2 bg-orange-100 text-orange-600 rounded-lg text-sm font-medium hover:bg-orange-200 transition-colors border border-orange-200"
                                                    >
                                                        <AlertCircle className="w-4 h-4 inline mr-1" />
                                                        Escalate
                                                    </button>
                                                )}
                                                {selectedTicket.status === 'open' && (
                                                    <button
                                                        onClick={() => handleAssignTicket(selectedTicket._id)}
                                                        className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors border border-blue-200"
                                                    >
                                                        <User className="w-4 h-4 inline mr-1" />
                                                        Assign to Me
                                                    </button>
                                                )}
                                            </div>

                                            {/* Prominent Resolve Button */}
                                            <button
                                                onClick={() => handleResolveTicket(selectedTicket._id)}
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
                )}

                {/* Create Ticket Modal */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent className="sm:max-w-md bg-white rounded-3xl border-0 shadow-2xl p-0 overflow-hidden">
                        <DialogHeader className="px-6 py-6 border-b border-gray-100">
                            <DialogTitle className="text-xl font-bold text-gray-900">Create New Ticket</DialogTitle>
                        </DialogHeader>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Subject</label>
                                    <input
                                        type="text"
                                        value={newTicket.title}
                                        onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        placeholder="Ticket subject"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Client Email</label>
                                    <input
                                        type="email"
                                        value={newTicket.client}
                                        onChange={(e) => setNewTicket({ ...newTicket, client: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        placeholder="client@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Category</label>
                                    <select
                                        value={newTicket.category}
                                        onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    >
                                        <option value="technical">Technical</option>
                                        <option value="virtual_office">Virtual Office</option>
                                        <option value="coworking">Coworking</option>
                                        <option value="billing">Billing</option>
                                        <option value="kyc">KYC</option>
                                        <option value="mail_services">Mail Services</option>
                                        <option value="bookings">Bookings</option>
                                        <option value="compliance">Compliance</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Description</label>
                                    <textarea
                                        value={newTicket.description}
                                        onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        placeholder="Describe the issue..."
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="px-6 py-6 border-t border-gray-100">
                            <button
                                onClick={() => setIsCreateOpen(false)}
                                className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateTicket}
                                className="px-6 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
                            >
                                Create Ticket
                            </button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}