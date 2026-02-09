import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Eye,
    MessageSquare,
    Download,
    Calendar,
    FileText,
    Phone,
    Loader2,
    Mail,
    MapPin,
    TrendingUp,
    Clock,
    CheckCircle,
    X,
} from 'lucide-react';
import { adminService } from '@/services/admin.service';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";

export default function ClientManagement() {
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All Clients');
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        atRisk: 0,
        churned: 0
    });

    // Modal state
    const [selectedClient, setSelectedClient] = useState<any>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                // Fetch bookings to aggregate unique paying clients
                const response = await adminService.getAllBookings();

                if (response.success && response.data && response.data.bookings) {
                    processBookingClients(response.data.bookings);
                } else {
                    console.warn("No bookings found to populate clients");
                    setLoading(false);
                }
            } catch (error) {
                console.error("Failed to fetch clients from bookings", error);
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    const processBookingClients = (bookings: any[]) => {
        const clientMap = new Map<string, any>();

        bookings.forEach(booking => {
            if (!booking.user) return;

            const userId = booking.user._id || booking.user.email;
            const existing = clientMap.get(userId);
            const amount = Number(booking.amount || booking.plan?.price || 0);
            const date = new Date(booking.createdAt);

            if (existing) {
                // Update existing client stats
                existing.revenue += amount;
                existing.bookingCount += 1;
                if (date > existing.lastActivityDate) {
                    existing.lastActivityDate = date;
                    existing.plan = booking.plan?.name || booking.type;
                    existing.spaceName = booking.space?.name || booking.location || existing.spaceName;
                }
            } else {
                // Add new client
                clientMap.set(userId, {
                    id: userId,
                    clientId: `CL-${Math.floor(100 + Math.random() * 900)}`, // Mock Client ID
                    name: booking.user.firstName ? `${booking.user.firstName} ${booking.user.lastName || ''}` : "Unknown User",
                    companyName: booking.user.companyName || booking.user.firstName || "Individual",
                    email: booking.user.email,
                    phone: booking.user.phone || "+91 98765 43210", // Mock if missing
                    plan: booking.plan?.name || booking.type || "Standard Access",
                    spaceName: booking.space?.name || booking.location || "Main Hub",
                    revenue: amount,
                    bookingCount: 1,
                    lastActivityDate: date,
                    initials: (booking.user.companyName || booking.user.firstName || "CL").substring(0, 2).toUpperCase()
                });
            }
        });

        // Convert Map to Array and add UI fields
        const processed = Array.from(clientMap.values()).map(client => {
            // Determine status based on recency
            const daysSinceActive = (new Date().getTime() - client.lastActivityDate.getTime()) / (1000 * 3600 * 24);

            // Simulation logic for fields not in DB
            const healthScore = Math.floor(Math.random() * (100 - 50) + 50);
            let statusLabel = 'Active';

            if (daysSinceActive > 60) statusLabel = 'Churned';
            else if (daysSinceActive > 30) statusLabel = 'At Risk';
            else if (healthScore < 60) statusLabel = 'At Risk';

            return {
                ...client,
                displayName: client.companyName,
                health: healthScore,
                statusLabel: statusLabel
            };
        });

        // Calculate Stats
        setStats({
            total: processed.length,
            active: processed.filter(c => c.statusLabel === 'Active').length,
            atRisk: processed.filter(c => c.statusLabel === 'At Risk').length,
            churned: processed.filter(c => c.statusLabel === 'Churned').length,
        });

        setClients(processed);
        setLoading(false);
    };

    const filteredClients = activeTab === 'All Clients'
        ? clients
        : clients.filter(c => c.statusLabel === activeTab);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getHealthColor = (score: number) => {
        if (score >= 80) return "bg-green-500";
        if (score >= 60) return "bg-yellow-500";
        return "bg-red-500";
    };

    const getStatusStyle = (status: string) => {
        if (status === 'Active') return "bg-green-50 text-green-700 border-green-100";
        if (status === 'At Risk') return "bg-orange-50 text-orange-700 border-orange-100";
        if (status === 'Churned') return "bg-red-50 text-red-700 border-red-100";
        return "bg-gray-50 text-gray-700 border-gray-100";
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent space-y-8 font-sans animate-in fade-in duration-500 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Client <span className="text-teal-500 italic">Management</span>
                    </h1>
                    <p className="text-gray-500 mt-2 text-lg font-light">
                        Manage all clients and track their health scores
                    </p>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Clients", value: stats.total.toString() },
                    { label: "Active", value: stats.active.toString(), color: "text-green-600" },
                    { label: "At Risk", value: stats.atRisk.toString(), color: "text-orange-600" },
                    { label: "Churned (YTD)", value: stats.churned.toString(), color: "text-gray-500" }
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
                        <h3 className={`text-4xl font-extrabold tracking-tight ${stat.color || 'text-gray-900'}`}>{stat.value}</h3>
                        <p className="text-gray-500 font-medium mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Filters and Table */}
            <div className="space-y-6">
                {/* Search & Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search clients..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-100 transition-all text-sm"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors shadow-sm font-medium">
                        <Filter className="w-4 h-4" />
                        <span>Filter</span>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {['All Clients', 'Active', 'At Risk', 'Churned'].map((tab) => (
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
                    ))}
                </div>

                {/* Table */}
                <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50/50 text-gray-900 font-semibold border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-5">Client</th>
                                    <th className="px-6 py-5">Plan</th>
                                    <th className="px-6 py-5">Space</th>
                                    <th className="px-6 py-5">Revenue</th>
                                    <th className="px-6 py-5 w-48">Health</th>
                                    <th className="px-6 py-5">Status</th>
                                    <th className="px-6 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredClients.length > 0 ? (
                                    filteredClients.map((client, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-sm">
                                                        {client.initials}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 text-sm">{client.companyName}</p>
                                                        <p className="text-xs text-gray-500 mt-0.5">{client.name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium border border-gray-200">
                                                    {client.plan}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-gray-500 text-xs text-nowrap">
                                                <div className="flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                                    {client.spaceName}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 font-bold text-gray-900">
                                                {formatCurrency(client.revenue)}
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${getHealthColor(client.health)}`}
                                                            style={{ width: `${client.health}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-700">{client.health}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusStyle(client.statusLabel)}`}>
                                                    {client.statusLabel}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedClient(client);
                                                            setIsDetailsOpen(true);
                                                        }}
                                                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
                                                        <MessageSquare className="w-4 h-4" />
                                                    </button>

                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48">
                                                            <DropdownMenuItem className="text-xs">
                                                                <Calendar className="w-3.5 h-3.5 mr-2 text-gray-500" />
                                                                Send Renewal Reminder
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-xs">
                                                                <Phone className="w-3.5 h-3.5 mr-2 text-gray-500" />
                                                                Schedule Call
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-xs">
                                                                <FileText className="w-3.5 h-3.5 mr-2 text-gray-500" />
                                                                View Invoices
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-xs">
                                                                <Download className="w-3.5 h-3.5 mr-2 text-gray-500" />
                                                                Export Client Data
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                            No clients found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Client Details Modal */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="sm:max-w-3xl fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full p-0 overflow-hidden bg-white rounded-3xl border-0 shadow-2xl">
                    {selectedClient && (
                        <div className="flex flex-col h-[90vh] md:h-auto max-h-[90vh]">
                            {/* Header */}
                            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-2xl">
                                        {selectedClient.initials}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">{selectedClient.companyName}</h2>
                                        <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                                            <span>{selectedClient.name}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                            <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{selectedClient.clientId || 'CL-001'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusStyle(selectedClient.statusLabel)}`}>
                                        {selectedClient.statusLabel}
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-8">
                                {/* Info Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    {/* Contact Info */}
                                    <div className="space-y-4">
                                        <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Contact Information</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer group">
                                                <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                                                    <Mail className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm">{selectedClient.email}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer group">
                                                <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                                                    <Phone className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm">{selectedClient.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer group">
                                                <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                                                    <MapPin className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm">{selectedClient.spaceName}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Subscription Info */}
                                    <div className="space-y-4">
                                        <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Subscription Details</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="p-1.5 bg-gray-50 rounded text-gray-500">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                                                    {selectedClient.plan}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                                <div className="p-1.5 bg-gray-50 rounded text-gray-500">
                                                    <Calendar className="w-4 h-4" />
                                                </div>
                                                <span>Started: <span className="text-gray-900 font-medium">Jan 15, 2024</span></span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                                <div className="p-1.5 bg-gray-50 rounded text-gray-500">
                                                    <Clock className="w-4 h-4" />
                                                </div>
                                                <span>Renewal: <span className="text-gray-900 font-medium">Jan 15, 2025</span></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="text-gray-500 text-sm font-medium">Health Score</h4>
                                            <span className="text-2xl font-bold text-gray-900">{selectedClient.health}</span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
                                            <div
                                                className={`h-full rounded-full ${getHealthColor(selectedClient.health)}`}
                                                style={{ width: `${selectedClient.health}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-gray-500">Client is highly engaged</p>
                                    </div>

                                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 relative">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-gray-500 text-sm font-medium">Monthly Revenue</h4>
                                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900 mb-1">
                                            {formatCurrency(selectedClient.revenue)}
                                        </div>
                                        <p className="text-xs text-gray-500">Lifetime value: {formatCurrency(selectedClient.revenue * 12)}</p>
                                    </div>
                                </div>

                                {/* Recent Activity */}
                                <div className="space-y-4">
                                    <h3 className="font-bold text-gray-900">Recent Activity</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                                            <span className="text-gray-600">Last login</span>
                                            <span className="font-medium text-gray-900">2 days ago</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                                            <span className="text-gray-600">Support tickets (30 days)</span>
                                            <span className="font-medium text-gray-900">2 tickets</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                                            <span className="text-gray-600">Mail received (30 days)</span>
                                            <span className="font-medium text-gray-900">15 items</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex gap-3 w-full sm:w-auto">
                                    <button className="flex-1 sm:flex-none px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center justify-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        View Invoices
                                    </button>
                                    <button className="flex-1 sm:flex-none px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center justify-center gap-2">
                                        <Download className="w-4 h-4" />
                                        Download Report
                                    </button>
                                </div>
                                <button className="w-full sm:w-auto px-6 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200/50 flex items-center justify-center gap-2">
                                    <MessageSquare className="w-4 h-4" />
                                    Start Chat
                                </button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
