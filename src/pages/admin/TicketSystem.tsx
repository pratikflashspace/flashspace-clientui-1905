import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Users,
    TrendingUp,
    Ticket,
    BookOpen,
    Trophy,
    Target,
    Headphones,
    Calculator,
    FileText,
    Wallet,
    Receipt,
    Plus,
    Search,
    Clock,
    AlertCircle,
    CheckCircle,
    Eye,
    RefreshCw,
    Send,
    User as UserIcon,
    MessageSquare
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { adminService, AdminTicketData, TicketStats } from '@/services/admin.service';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import playNotificationSound from '@/utils/sound.util';
import { StatsCard } from '@/components/dashboard/StatsCard';

// --- Local Modal Component ---
interface TicketViewModalProps {
    ticket: AdminTicketData | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdate?: () => void;
    user: any;
}

const TicketViewModal = ({ ticket, open, onOpenChange, onUpdate, user }: TicketViewModalProps) => {
    const [replyMessage, setReplyMessage] = useState('');
    const [loading, setLoading] = useState(false);

    if (!ticket) return null;

    const handleReply = async () => {
        if (!replyMessage.trim()) return;
        setLoading(true);
        try {
            const response = await adminService.replyToTicket(ticket._id, replyMessage);
            if (response.success) {
                toast({ title: "Reply sent!" });
                setReplyMessage('');
                onUpdate?.();
            }
        } catch (err) {
            toast({ title: "Failed to send reply", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (action: 'assign' | 'resolve' | 'escalate') => {
        try {
            let response;
            switch (action) {
                case 'assign':
                    if (user?._id || user?.id) {
                        const userId = user._id || user.id;
                        response = await adminService.assignTicket(ticket._id, userId);
                    } else {
                        toast({ title: "User not authenticated", variant: "destructive" });
                        return;
                    }
                    break;
                case 'resolve':
                    response = await adminService.resolveTicket(ticket._id);
                    break;
                case 'escalate':
                    response = await adminService.escalateTicket(ticket._id);
                    break;
            }
            if (response?.success) {
                toast({ title: `Ticket ${action}d successfully!` });
                onUpdate?.();
            }
        } catch (err) {
            toast({ title: `Failed to ${action} ticket`, variant: "destructive" });
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

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case "high":
                return <Badge variant="destructive">High</Badge>;
            case "medium":
                return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Medium</Badge>;
            case "low":
                return <Badge variant="secondary">Low</Badge>;
            default:
                return <Badge variant="outline">{priority}</Badge>;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl bg-white rounded-3xl border-0 shadow-2xl p-0 overflow-hidden">
                <DialogHeader className="px-6 py-5 border-b border-gray-100">
                    <div className="flex justify-between items-start pr-8">
                        <div>
                            <DialogTitle className="text-2xl font-bold text-gray-900">{ticket.subject}</DialogTitle>
                            <p className="text-sm text-gray-500 mt-1">{ticket.ticketNumber}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(ticket.status)}`}>
                            {ticket.status.toUpperCase()}
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-6 max-h-[75vh] overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-gray-50 p-4 rounded-2xl">
                            <p className="text-xs text-gray-400 font-medium uppercase mb-1">Client</p>
                            <p className="font-bold text-gray-900">{ticket.user?.fullName}</p>
                            <p className="text-xs text-gray-500 truncate">{ticket.user?.email}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-2xl">
                            <p className="text-xs text-gray-400 font-medium uppercase mb-1">Category</p>
                            <p className="font-bold text-gray-900 capitalize">{ticket.category.replace('_', ' ')}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-2xl">
                            <p className="text-xs text-gray-400 font-medium uppercase mb-1">Priority</p>
                            <div>{getPriorityBadge(ticket.priority)}</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-2xl">
                            <p className="text-xs text-gray-400 font-medium uppercase mb-1">Created</p>
                            <p className="font-bold text-gray-900">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">Description</h3>
                        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                            <p className="text-gray-700 leading-relaxed">{ticket.description}</p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-teal-500" />
                            Conversation
                        </h3>
                        <div className="bg-gray-50 rounded-3xl p-6 h-80 overflow-y-auto space-y-4 border border-gray-100 mb-4">
                            {ticket.messages && ticket.messages.length > 0 ? (
                                ticket.messages.map((msg: any, idx: number) => (
                                    <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                                        <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${msg.sender === 'user'
                                            ? 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                                            : 'bg-teal-600 text-white rounded-tr-none'
                                            }`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-[10px] font-bold uppercase tracking-tighter ${msg.sender === 'user' ? 'text-gray-400' : 'text-teal-100'}`}>
                                                    {msg.sender === 'user' ? 'Client' : 'Support'}
                                                </span>
                                                <span className={`text-[10px] ${msg.sender === 'user' ? 'text-gray-400' : 'text-teal-200'}`}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-sm">{msg.message}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                    <MessageSquare className="w-12 h-12 mb-2 opacity-20" />
                                    <p>No messages yet</p>
                                </div>
                            )}
                        </div>

                        {ticket.status !== 'closed' && ticket.status !== 'resolved' && (
                            <div className="flex gap-3">
                                <Input
                                    placeholder="Type your reply..."
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    className="rounded-xl h-12 border-gray-200"
                                    onKeyPress={(e) => e.key === 'Enter' && handleReply()}
                                />
                                <Button
                                    className="h-12 px-6 bg-teal-600 hover:bg-teal-700 rounded-xl"
                                    onClick={handleReply}
                                    disabled={loading || !replyMessage.trim()}
                                >
                                    <Send className="w-5 h-5" />
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-gray-100">
                        <div className="flex gap-2">
                            {ticket.status === 'open' && (
                                <Button variant="outline" className="rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50" onClick={() => handleAction('assign')}>
                                    <UserIcon className="w-4 h-4 mr-2" />
                                    Assign to Me
                                </Button>
                            )}
                            {ticket.status !== 'escalated' && ticket.status !== 'closed' && (
                                <Button variant="outline" className="rounded-xl border-orange-200 text-orange-600 hover:bg-orange-50" onClick={() => handleAction('escalate')}>
                                    <AlertCircle className="w-4 h-4 mr-2" />
                                    Escalate
                                </Button>
                            )}
                        </div>
                        {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                            <Button className="rounded-xl bg-green-600 hover:bg-green-700" onClick={() => handleAction('resolve')}>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Resolve Ticket
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

// --- Main Page Component ---

const TicketSystem = () => {
    const { user } = useAuth();
    const { socket } = useSocket();
    const [activeTab, setActiveTab] = useState('all');
    const [selectedTicket, setSelectedTicket] = useState<AdminTicketData | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [tickets, setTickets] = useState<AdminTicketData[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
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

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const filters: any = {};
            if (activeTab !== 'all') {
                filters.status = activeTab;
            }
            if (searchTerm) {
                filters.search = searchTerm;
            }
            const response = await adminService.getAllTickets(filters);
            if (response.success) {
                setTickets(response.data.tickets || []);
            }
        } catch (err) {
            console.error('Failed to fetch tickets', err);
            toast({ title: "Failed to load tickets", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await adminService.getTicketStats();
            if (response.success) {
                setStats(response.data);
            }
        } catch (err) {
            console.error('Failed to fetch stats', err);
        }
    };

    useEffect(() => {
        fetchTickets();
        fetchStats();
    }, [activeTab, searchTerm]);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (data: { ticketId: string, message: any }) => {
            if (data.ticketId === selectedTicket?._id) {
                setSelectedTicket((prev) => {
                    if (!prev) return null;
                    const exists = prev.messages.some(m =>
                        new Date(m.createdAt).getTime() === new Date(data.message.createdAt).getTime() &&
                        m.message === data.message.message
                    );
                    if (exists) return prev;
                    return { ...prev, messages: [...prev.messages, data.message] };
                });
            }
            fetchTickets();
        };

        const handleTicketUpdated = (data: { ticketId: string, ticket: any }) => {
            if (data.ticketId === selectedTicket?._id) {
                setSelectedTicket(data.ticket);
            }
            fetchTickets();
            fetchStats();
        };

        const handleNewTicket = (ticket: any) => {
            try { playNotificationSound(); } catch (e) { }
            toast({ title: `New Ticket: ${ticket.subject}`, description: "A new support ticket has been created." });
            fetchTickets();
            fetchStats();
        };

        socket.on('new_message', handleNewMessage);
        socket.on('ticket_updated', handleTicketUpdated);
        socket.on('new_ticket_created', handleNewTicket);

        return () => {
            socket.off('new_message', handleNewMessage);
            socket.off('ticket_updated', handleTicketUpdated);
            socket.off('new_ticket_created', handleNewTicket);
        };
    }, [socket, selectedTicket?._id]);

    const handleViewTicket = (ticket: AdminTicketData) => {
        setSelectedTicket(ticket);
        setModalOpen(true);
    };

    const handleCreateTicket = () => {
        toast({
            title: "Create Ticket",
            description: "Opening ticket creation form...",
        });
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case "high":
                return <Badge variant="destructive">High</Badge>;
            case "medium":
                return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Medium</Badge>;
            case "low":
                return <Badge variant="secondary">Low</Badge>;
            default:
                return <Badge variant="outline">{priority}</Badge>;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "open":
                return <Badge variant="outline"><AlertCircle className="w-3 h-3 mr-1" />Open</Badge>;
            case "in_progress":
                return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100"><Clock className="w-3 h-3 mr-1" />In Progress</Badge>;
            case "escalated":
                return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Escalated</Badge>;
            case "resolved":
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />Resolved</Badge>;
            case "closed":
                return <Badge variant="secondary"><CheckCircle className="w-3 h-3 mr-1" />Closed</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const renderTicketTable = (data: AdminTicketData[]) => (
        <div className="bg-background border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-muted/50 text-left">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-foreground">Ticket</th>
                            <th className="p-4 text-sm font-semibold text-foreground">Client</th>
                            <th className="p-4 text-sm font-semibold text-foreground">Category</th>
                            <th className="p-4 text-sm font-semibold text-foreground">Priority</th>
                            <th className="p-4 text-sm font-semibold text-foreground">Assignee</th>
                            <th className="p-4 text-sm font-semibold text-foreground">Created</th>
                            <th className="p-4 text-sm font-semibold text-foreground">Status</th>
                            <th className="p-4 text-sm font-semibold text-foreground text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {data.map((ticket) => (
                            <tr key={ticket._id} className="hover:bg-muted/30 transition-colors">
                                <td className="p-4">
                                    <div>
                                        <span className="text-xs text-muted-foreground font-mono">{ticket.ticketNumber}</span>
                                        <p className="font-bold text-foreground">{ticket.subject}</p>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="w-8 h-8">
                                            <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                                {ticket.user?.fullName?.split(' ').map(n => n[0]).join('') || 'US'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="text-sm">
                                            <p className="font-medium text-foreground">{ticket.user?.fullName}</p>
                                            <p className="text-xs text-muted-foreground">{ticket.user?.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <Badge variant="outline" className="capitalize">{ticket.category.replace('_', ' ')}</Badge>
                                </td>
                                <td className="p-4">{getPriorityBadge(ticket.priority)}</td>
                                <td className="p-4">
                                    {ticket.assignee ? (
                                        <div className="flex items-center gap-2">
                                            <Avatar className="w-6 h-6">
                                                <AvatarFallback className="text-[10px] bg-teal-50 text-teal-600">
                                                    {ticket.assignee.fullName.split(' ').map(n => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-xs text-muted-foreground">{ticket.assignee.fullName}</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-muted-foreground italic">Unassigned</span>
                                    )}
                                </td>
                                <td className="p-4 text-sm text-muted-foreground">
                                    {new Date(ticket.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4">{getStatusBadge(ticket.status)}</td>
                                <td className="p-4 text-right">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleViewTicket(ticket)}
                                        className="gap-1 rounded-lg"
                                    >
                                        <Eye className="w-4 h-4" />
                                        View
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {data.length === 0 && !loading && (
                <div className="p-12 text-center">
                    <Ticket className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                    <p className="text-muted-foreground">No tickets found in this category</p>
                </div>
            )}
            {loading && (
                <div className="p-12 text-center">
                    <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Refreshing tickets...</p>
                </div>
            )}
        </div>
    );

    return (
        <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                        Ticket <span className="text-primary italic">System</span>
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Manage and resolve support tickets
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={fetchTickets} className="rounded-xl h-11">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                    <Button onClick={handleCreateTicket}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Ticket
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-5 mb-8">
                <StatsCard title="Open Tickets" value={stats.open} icon={AlertCircle} />
                <StatsCard title="In Progress" value={stats.in_progress} icon={Clock} />
                <StatsCard title="Escalated" value={stats.escalated} icon={TrendingUp} />
                <StatsCard title="Resolved (MTD)" value={stats.resolvedThisMonth} icon={CheckCircle} />
                <StatsCard title="Avg Resolution" value={stats.avgResolution || "4.2 hrs"} icon={RefreshCw} />
            </div>

            <div className="flex gap-4 mb-8">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search tickets by ID, subject or client..."
                        className="pl-11 h-12 rounded-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Tabs defaultValue="all" onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none h-auto p-0 gap-8">
                    <TabsTrigger value="all" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 pb-3 font-semibold text-muted-foreground data-[state=active]:text-foreground">
                        All Tickets
                    </TabsTrigger>
                    <TabsTrigger value="open" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 pb-3 font-semibold text-muted-foreground data-[state=active]:text-foreground">
                        Open
                    </TabsTrigger>
                    <TabsTrigger value="in_progress" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 pb-3 font-semibold text-muted-foreground data-[state=active]:text-foreground">
                        In Progress
                    </TabsTrigger>
                    <TabsTrigger value="escalated" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 pb-3 font-semibold text-muted-foreground data-[state=active]:text-foreground">
                        Escalated
                    </TabsTrigger>
                    <TabsTrigger value="resolved" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 pb-3 font-semibold text-muted-foreground data-[state=active]:text-foreground">
                        Resolved
                    </TabsTrigger>
                    <TabsTrigger value="closed" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 pb-3 font-semibold text-muted-foreground data-[state=active]:text-foreground">
                        Closed
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab}>
                    {renderTicketTable(tickets)}
                </TabsContent>
            </Tabs>

            <TicketViewModal
                ticket={selectedTicket}
                open={modalOpen}
                onOpenChange={setModalOpen}
                onUpdate={() => {
                    fetchTickets();
                    fetchStats();
                }}
                user={user}
            />
        </div>
    );
};

export default TicketSystem;
