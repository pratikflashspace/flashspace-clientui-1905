import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    Eye,
    Phone,
    Mail,
    MoreVertical,
    Target,
    Loader2
} from 'lucide-react';
import { adminService } from '@/services/admin.service';

export default function LeadManagement() {
    const [activeTab, setActiveTab] = useState('All Leads');
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        hot: 0,
        warm: 0,
        conversion: 0
    });

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const response = await adminService.getAllBookings(); // Using bookings as leads for now
                if (response.success && response.data && response.data.bookings) {
                    processLeads(response.data.bookings);
                }
            } catch (error) {
                console.error("Failed to fetch leads", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeads();
    }, []);

    const processLeads = (bookings: any[]) => {
        // Sort bookings by date descending
        const sortedBookings = [...bookings].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        const processed = sortedBookings.map(booking => {
            // Simulate AI score and status based on data
            const amount = Number(booking.amount || booking.plan?.price || 0);

            // Random score but biased by amount
            const randomBase = Math.floor(Math.random() * (95 - 65) + 65);
            const score = Math.min(randomBase + (amount > 10000 ? 5 : 0), 99);

            let status = 'Warm';
            if (booking.status === 'confirmed' || booking.status === 'completed') {
                status = 'Won';
            } else if (booking.status === 'cancelled') {
                status = 'Cold';
            } else if (score > 85) {
                status = 'Hot Lead';
            }

            // Format interest nicely
            let interest = booking.plan?.name || booking.type || "Inquiry";
            interest = interest.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

            return {
                company: booking.user?.companyName || (booking.user?.firstName ? `${booking.user.firstName} ${booking.user.lastName || ''}` : "Unknown Client"),
                contact: booking.user?.email || "No contact info",
                interest: interest,
                source: booking.user?.source || "Website",
                score: score,
                status: status,
                assignee: "Unassigned",
                lastActivity: new Date(booking.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                rawStatus: booking.status
            };
        });

        // Calculate stats
        const total = processed.length;
        const hot = processed.filter(l => l.status === 'Hot Lead').length;
        const warm = processed.filter(l => l.status === 'Warm').length;
        const won = processed.filter(l => l.status === 'Won').length;

        setStats({
            total,
            hot,
            warm,
            conversion: total > 0 ? (won / total) * 100 : 0
        });

        setLeads(processed);
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-600";
        if (score >= 60) return "text-orange-500";
        return "text-red-500";
    };

    const getStatusStyle = (status: string) => {
        if (status === "Hot Lead") return "bg-red-50 text-red-600 border-red-100";
        if (status === "Warm") return "bg-orange-50 text-orange-600 border-orange-100";
        if (status === "Won") return "bg-green-50 text-green-600 border-green-100";
        if (status === "Cold") return "bg-gray-100 text-gray-500 border-gray-200";
        return "bg-gray-50 text-gray-600 border-gray-100";
    };

    const filteredLeads = activeTab === 'All Leads'
        ? leads
        : leads.filter(l => {
            if (activeTab === 'Hot') return l.status === 'Hot Lead';
            if (activeTab === 'Won') return l.status === 'Won';
            if (activeTab === 'Cold') return l.status === 'Cold';
            return l.status === activeTab;
        });

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
                        Lead <span className="text-teal-500 italic">Management</span>
                    </h1>
                    <p className="text-gray-500 mt-2 text-lg font-light">
                        Track, score, and convert leads with AI assistance
                    </p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors shadow-md shadow-teal-200 font-medium">
                    <Plus className="w-5 h-5" />
                    <span>Add Lead</span>
                </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Leads", value: stats.total.toString() },
                    { label: "Hot Leads", value: stats.hot.toString(), color: "text-red-600" },
                    { label: "Warm Leads", value: stats.warm.toString(), color: "text-orange-600" },
                    { label: "Conversion Rate", value: `${stats.conversion.toFixed(1)}%` }
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
                            placeholder="Search leads..."
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
                    {/* Dynamic Tabs based on counts */}
                    {[
                        { name: 'All Leads', count: leads.length },
                        { name: 'Hot', count: stats.hot },
                        { name: 'Warm', count: stats.warm },
                        { name: 'Won', count: leads.filter(l => l.status === 'Won').length },
                        { name: 'Cold', count: leads.filter(l => l.status === 'Cold').length }
                    ].map((tab) => (
                        <button
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.name
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-transparent text-gray-500 hover:bg-gray-100'
                                }`}
                        >
                            {tab.name} ({tab.count})
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50/50 text-gray-900 font-semibold border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-5">Lead</th>
                                    <th className="px-6 py-5">Interest</th>
                                    <th className="px-6 py-5">Source</th>
                                    <th className="px-6 py-5">AI Score</th>
                                    <th className="px-6 py-5">Status</th>
                                    <th className="px-6 py-5">Assignee</th>
                                    <th className="px-6 py-5">Last Activity</th>
                                    <th className="px-6 py-5">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredLeads.length > 0 ? (
                                    filteredLeads.map((lead, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div>
                                                    <p className="font-bold text-gray-900 text-base">{lead.company}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">{lead.contact}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium border border-gray-200">
                                                    {lead.interest}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-gray-500">{lead.source}</td>
                                            <td className="px-6 py-5 font-bold text-base">
                                                <span className={getScoreColor(lead.score)}>{lead.score}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(lead.status)}`}>
                                                    {lead.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-gray-600">{lead.assignee}</td>
                                            <td className="px-6 py-5 text-gray-400 text-xs whitespace-nowrap">{lead.lastActivity}</td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-2 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 transition-colors">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
                                                        <Phone className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
                                                        <Mail className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                                            No leads found in this category.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
