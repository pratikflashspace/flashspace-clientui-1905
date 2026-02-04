import React, { useState } from 'react';
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
    MessageSquare
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

export default function TicketSystem() {
    const [activeTab, setActiveTab] = useState('All Tickets');
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Form State
    const [newTicket, setNewTicket] = useState({
        title: '',
        client: '',
        category: 'IT Support',
        priority: 'Medium',
        description: ''
    });

    // Mock Data based on screenshot
    const [tickets, setTickets] = useState([
        {
            id: "TKT-001",
            title: "Mail forwarding delay",
            client: "Tech Innovations Pvt Ltd",
            clientAvatar: "TI",
            category: "Mail Services",
            priority: "High",
            assignee: "Support Team A",
            assigneeInitials: "STA",
            deadline: "4 hours",
            status: "Open"
        },
        {
            id: "TKT-002",
            title: "Meeting room booking issue",
            client: "StartupXYZ Solutions",
            clientAvatar: "SS",
            category: "Bookings",
            priority: "Medium",
            assignee: "Support Team B",
            assigneeInitials: "STB",
            deadline: "2 days",
            status: "In Progress"
        },
        {
            id: "TKT-003",
            title: "Invoice discrepancy",
            client: "Global Consulting LLC",
            clientAvatar: "GC",
            category: "Billing",
            priority: "Low",
            assignee: "Finance Team",
            assigneeInitials: "FT",
            deadline: "5 days",
            status: "In Progress"
        },
        {
            id: "TKT-004",
            title: "KYC document rejection",
            client: "Design Studio Co",
            clientAvatar: "DS",
            category: "Compliance",
            priority: "High",
            assignee: "Compliance Team",
            assigneeInitials: "CT",
            deadline: "1 day",
            status: "Escalated"
        }
    ]);

    const stats = [
        { label: "Open Tickets", value: tickets.filter(t => t.status === 'Open').length.toString(), color: "text-gray-900" },
        { label: "In Progress", value: tickets.filter(t => t.status === 'In Progress').length.toString(), color: "text-blue-600" },
        { label: "Escalated", value: tickets.filter(t => t.status === 'Escalated').length.toString(), color: "text-red-600" },
        { label: "Resolved (MTD)", value: "156", color: "text-green-600" },
        { label: "Avg Resolution", value: "4.2 hrs", color: "text-gray-900" }
    ];

    const handleCreateTicket = () => {
        if (!newTicket.title || !newTicket.client) return; // Basic validation

        const createdTicket = {
            id: `TKT-${Math.floor(100 + Math.random() * 900)}`,
            title: newTicket.title,
            client: newTicket.client,
            clientAvatar: newTicket.client.substring(0, 2).toUpperCase(),
            category: newTicket.category,
            priority: newTicket.priority,
            assignee: "Unassigned", // Default for new tickets
            assigneeInitials: "UA",
            deadline: "24 hours", // Default deadline
            status: "Open"
        };

        setTickets([createdTicket, ...tickets]);
        setIsCreateOpen(false);
        setNewTicket({
            title: '',
            client: '',
            category: 'IT Support',
            priority: 'Medium',
            description: ''
        });
    };

    const getPriorityStyle = (priority: string) => {
        switch (priority) {
            case 'High': return 'bg-red-50 text-red-600 border-red-100';
            case 'Medium': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
            case 'Low': return 'bg-green-50 text-green-600 border-green-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Open': return 'bg-white border-gray-200 text-gray-700'; // Clean style for Open
            case 'In Progress': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Escalated': return 'bg-red-50 text-red-600 border-red-100';
            case 'Resolved': return 'bg-green-50 text-green-600 border-green-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Open': return <Clock className="w-3.5 h-3.5" />;
            case 'In Progress': return <ArrowUpRight className="w-3.5 h-3.5" />;
            case 'Escalated': return <AlertCircle className="w-3.5 h-3.5" />;
            case 'Resolved': return <CheckCircle className="w-3.5 h-3.5" />;
            default: return null;
        }
    };

    const filteredTickets = activeTab === 'All Tickets'
        ? tickets
        : activeTab.startsWith('Open') ? tickets.filter(t => t.status === 'Open')
            : activeTab.startsWith('Escalated') ? tickets.filter(t => t.status === 'Escalated')
                : activeTab.startsWith('Resolved') ? tickets.filter(t => t.status === 'Resolved')
                    : tickets;

    return (
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
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors shadow-md shadow-teal-200 font-medium"
                >
                    <Plus className="w-5 h-5" />
                    <span>Create Ticket</span>
                </button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
                        <h3 className={`text-3xl font-extrabold tracking-tight ${stat.color}`}>{stat.value}</h3>
                        <p className="text-gray-500 font-medium mt-1 text-sm">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Filter & Table Section */}
            <div className="space-y-6">
                {/* Search */}
                <div className="relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search tickets..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-100 transition-all text-sm shadow-sm"
                    />
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {['All Tickets', 'Open', 'Escalated', 'Resolved'].map((tab) => {
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-transparent text-gray-500 hover:bg-gray-100'
                                    }`}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </div>

                {/* Table */}
                <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50/50 text-gray-900 font-semibold border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-5">Ticket</th>
                                    <th className="px-6 py-5">Client</th>
                                    <th className="px-6 py-5">Category</th>
                                    <th className="px-6 py-5">Priority</th>
                                    <th className="px-6 py-5">Assignee</th>
                                    <th className="px-6 py-5">Deadline</th>
                                    <th className="px-6 py-5">Status</th>
                                    <th className="px-6 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredTickets.map((ticket, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div>
                                                <span className="text-xs text-gray-400 font-mono block mb-1">{ticket.id}</span>
                                                <p className="font-bold text-gray-900 text-base">{ticket.title}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                {/* Use a simple avatar placeholder */}
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                                                    {ticket.clientAvatar}
                                                </div>
                                                <span className="text-gray-600 font-medium">{ticket.client}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium border border-gray-200">
                                                {ticket.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getPriorityStyle(ticket.priority)}`}>
                                                {ticket.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center text-[10px] font-bold">
                                                    {ticket.assigneeInitials}
                                                </div>
                                                <span className="text-gray-500 text-xs">{ticket.assignee}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-gray-500 text-sm">
                                            {ticket.deadline}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(ticket.status)}`}>
                                                {getStatusIcon(ticket.status)}
                                                <span>{ticket.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-600 text-xs font-medium hover:bg-gray-50 transition-colors shadow-sm">
                                                <Eye className="w-3.5 h-3.5" />
                                                <span>View</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredTickets.length === 0 && (
                        <div className="p-8 text-center text-gray-500 text-sm">
                            No tickets found in this view.
                        </div>
                    )}
                </div>
            </div>

            {/* Create Ticket Modal */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-md bg-white rounded-3xl border-0 shadow-2xl p-0 overflow-hidden">
                    <DialogHeader className="px-6 py-6 border-b border-gray-100">
                        <DialogTitle className="text-2xl font-bold text-gray-900">Create New Ticket</DialogTitle>
                    </DialogHeader>

                    <div className="p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Ticket Title</label>
                            <input
                                type="text"
                                placeholder="E.g. Internet connectivity issue"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm"
                                value={newTicket.title}
                                onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Client</label>
                            <select
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm"
                                value={newTicket.client}
                                onChange={(e) => setNewTicket({ ...newTicket, client: e.target.value })}
                            >
                                <option value="">Select a Client...</option>
                                <option value="Tech Innovations Pvt Ltd">Tech Innovations Pvt Ltd</option>
                                <option value="StartupXYZ Solutions">StartupXYZ Solutions</option>
                                <option value="Global Consulting LLC">Global Consulting LLC</option>
                                <option value="Design Studio Co">Design Studio Co</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Category</label>
                                <select
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm"
                                    value={newTicket.category}
                                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                                >
                                    <option value="IT Support">IT Support</option>
                                    <option value="Billing">Billing</option>
                                    <option value="Bookings">Bookings</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Compliance">Compliance</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Priority</label>
                                <select
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm"
                                    value={newTicket.priority}
                                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                placeholder="Describe the issue in detail..."
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm min-h-[100px]"
                                value={newTicket.description}
                                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                            ></textarea>
                        </div>
                    </div>

                    <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-3xl">
                        <button
                            onClick={() => setIsCreateOpen(false)}
                            className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreateTicket}
                            disabled={!newTicket.title || !newTicket.client}
                            className={`px-6 py-2 bg-teal-600 text-white rounded-lg font-medium shadow-lg shadow-teal-200/50 transition-all ${!newTicket.title || !newTicket.client ? 'opacity-50 cursor-not-allowed' : 'hover:bg-teal-700'
                                }`}
                        >
                            Create Ticket
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
