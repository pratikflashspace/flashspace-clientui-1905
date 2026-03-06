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
    Loader2,
    TrendingUp,
    TrendingDown,
    MessageSquare
} from 'lucide-react';
import { adminService } from '@/services/admin.service';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { StatsCard } from '@/components/dashboard/StatsCard';

export default function LeadManagement() {
    const [activeTab, setActiveTab] = useState('all');
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        hot: 0,
        warm: 0,
        conversion: 0
    });
    const [selectedLead, setSelectedLead] = useState<any | null>(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);

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

            let status = 'warm';
            if (booking.status === 'confirmed' || booking.status === 'completed') {
                status = 'won';
            } else if (booking.status === 'cancelled') {
                status = 'cold';
            } else if (score > 85) {
                status = 'hot';
            }

            // Format interest nicely
            let interest = booking.plan?.name || booking.type || "Inquiry";
            interest = interest.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

            return {
                id: booking._id,
                name: booking.user?.companyName || (booking.user?.firstName ? `${booking.user.firstName} ${booking.user.lastName || ''}` : "Unknown Client"),
                contact: booking.user?.firstName ? `${booking.user.firstName} ${booking.user.lastName || ''}` : "Unknown",
                email: booking.user?.email || "No email",
                phone: booking.user?.phone || "No phone",
                interest: interest,
                source: booking.user?.source || "Website",
                score: score,
                status: status,
                assignee: "Unassigned",
                lastActivity: new Date(booking.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                notes: booking.notes || "No additional notes",
                rawStatus: booking.status
            };
        });

        // Calculate stats
        const total = processed.length;
        const hot = processed.filter(l => l.status === 'hot').length;
        const warm = processed.filter(l => l.status === 'warm').length;
        const won = processed.filter(l => l.status === 'won').length;

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
        if (score >= 60) return "text-yellow-600";
        return "text-red-600";
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "hot":
                return <Badge variant="destructive">Hot Lead</Badge>;
            case "warm":
                return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Warm</Badge>;
            case "cold":
                return <Badge variant="secondary">Cold</Badge>;
            case "won":
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Won</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const handleView = (lead: any) => {
        setSelectedLead(lead);
        setViewModalOpen(true);
    };

    const handleCall = (phone: string) => {
        toast({
            title: "Initiating Call",
            description: `Calling ${phone}...`,
        });
    };

    const handleEmail = (email: string) => {
        window.location.href = `mailto:${email}`;
    };

    const handleAddLead = () => {
        toast({
            title: "Add New Lead",
            description: "Opening lead creation form...",
        });
    };

    const renderLeadTable = (leadsToRender: any[]) => (
        <div className="bg-background border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-muted/50 text-left">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-foreground">Lead</th>
                            <th className="p-4 text-sm font-semibold text-foreground">Interest</th>
                            <th className="p-4 text-sm font-semibold text-foreground">Source</th>
                            <th className="p-4 text-sm font-semibold text-foreground">AI Score</th>
                            <th className="p-4 text-sm font-semibold text-foreground">Status</th>
                            <th className="p-4 text-sm font-semibold text-foreground">Assignee</th>
                            <th className="p-4 text-sm font-semibold text-foreground">Last Activity</th>
                            <th className="p-4 text-sm font-semibold text-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {leadsToRender.map((lead) => (
                            <tr key={lead.id} className="hover:bg-muted/30 transition-colors group">
                                <td className="p-4">
                                    <div>
                                        <div className="font-bold text-foreground text-base">{lead.name}</div>
                                        <div className="text-sm text-muted-foreground">{lead.contact}</div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <Badge variant="outline">{lead.interest}</Badge>
                                </td>
                                <td className="p-4 text-sm text-muted-foreground">{lead.source}</td>
                                <td className="p-4 font-bold text-lg">
                                    <span className={getScoreColor(lead.score)}>{lead.score}</span>
                                </td>
                                <td className="p-4">{getStatusBadge(lead.status)}</td>
                                <td className="p-4 text-sm text-muted-foreground">{lead.assignee}</td>
                                <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{lead.lastActivity}</td>
                                <td className="p-4">
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleView(lead)}
                                            className="bg-primary/10 hover:bg-primary/20"
                                        >
                                            <Eye className="w-4 h-4 text-primary" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleCall(lead.phone)}
                                        >
                                            <Phone className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEmail(lead.email)}
                                        >
                                            <Mail className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {leadsToRender.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                    No leads in this category
                </div>
            )}
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const hotLeads = leads.filter(l => l.status === "hot");
    const warmLeads = leads.filter(l => l.status === "warm");
    const coldLeads = leads.filter(l => l.status === "cold");
    const wonLeads = leads.filter(l => l.status === "won");

    const getFilteredLeads = () => {
        if (activeTab === 'all') return leads;
        if (activeTab === 'hot') return hotLeads;
        if (activeTab === 'warm') return warmLeads;
        if (activeTab === 'cold') return coldLeads;
        if (activeTab === 'won') return wonLeads;
        return leads;
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                        Lead <span className="text-primary italic">Management</span>
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Track, score, and convert leads with AI assistance
                    </p>
                </div>
                <Button onClick={handleAddLead}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Lead
                </Button>
            </div>

            {/* Stats Row */}
            <div className="grid gap-4 sm:grid-cols-4 mb-8">
                <StatsCard title="Total Leads" value={stats.total} icon={Target} />
                <StatsCard title="Hot Leads" value={stats.hot} icon={TrendingUp} />
                <StatsCard title="Warm Leads" value={stats.warm} icon={TrendingDown} />
                <StatsCard title="Conversion Rate" value={`${stats.conversion.toFixed(1)}%`} icon={Target} />
            </div>

            {/* Search & Filter */}
            <div className="flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search leads..." className="pl-10" />
                </div>
                <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList>
                    <TabsTrigger value="all">All Leads ({leads.length})</TabsTrigger>
                    <TabsTrigger value="hot">Hot ({hotLeads.length})</TabsTrigger>
                    <TabsTrigger value="warm">Warm ({warmLeads.length})</TabsTrigger>
                    <TabsTrigger value="won">Won ({wonLeads.length})</TabsTrigger>
                    <TabsTrigger value="cold">Cold ({coldLeads.length})</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab}>
                    {renderLeadTable(getFilteredLeads())}
                </TabsContent>
            </Tabs>

            {/* Lead View Modal */}
            <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Lead Details</DialogTitle>
                    </DialogHeader>
                    {selectedLead && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-foreground">{selectedLead.name}</h3>
                                    <p className="text-muted-foreground">{selectedLead.contact}</p>
                                </div>
                                {getStatusBadge(selectedLead.status)}
                            </div>

                            <div className="bg-muted/30 rounded-lg p-4 space-y-2 border border-border/50">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground text-sm font-medium">AI Score</span>
                                    <span className={`font-bold text-xl ${getScoreColor(selectedLead.score)}`}>{selectedLead.score}/100</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground text-sm font-medium">Interest</span>
                                    <Badge variant="outline">{selectedLead.interest}</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground text-sm font-medium">Source</span>
                                    <span className="text-foreground text-sm">{selectedLead.source}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground text-sm font-medium">Assigned To</span>
                                    <span className="text-foreground text-sm">{selectedLead.assignee}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-semibold text-foreground text-sm">Contact Information</h4>
                                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
                                    <Mail className="w-4 h-4 text-primary" />
                                    <span className="text-sm">{selectedLead.email}</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
                                    <Phone className="w-4 h-4 text-primary" />
                                    <span className="text-sm">{selectedLead.phone}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-semibold text-foreground text-sm">Notes</h4>
                                <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border/50 leading-relaxed font-light">
                                    {selectedLead.notes}
                                </p>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button variant="outline" className="flex-1" onClick={() => handleCall(selectedLead.phone)}>
                                    <Phone className="w-4 h-4 mr-2" />
                                    Call
                                </Button>
                                <Button className="flex-1" onClick={() => handleEmail(selectedLead.email)}>
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Email
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
