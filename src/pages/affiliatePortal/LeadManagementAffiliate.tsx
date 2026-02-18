import React, { useState, useMemo, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeadStatCard from "@/components/affiliatePortal/LeadStatCard";
import LeadTableRow, { Lead } from "@/components/affiliatePortal/LeadTableRow";
import { useAuth } from "@/contexts/AuthContext";
import { affiliatePortalService } from "@/services/affiliatePortal.service";

// --- Static Data for easy Backend swapping ---
const INITIAL_LEADS: Lead[] = [
    // {
    //     id: "1",
    //     name: "Vikram Mehta",
    //     phone: "+91 98765 11111",
    //     company: "NextGen Tech",
    //     interest: "Virtual Office",
    //     status: "Hot",
    //     lastContact: "2 hours ago",
    // },
    // {
    //     id: "2",
    //     name: "Sneha Reddy",
    //     phone: "+91 87654 22222",
    //     company: "Creative Hub",
    //     interest: "Team Space",
    //     status: "Warm",
    //     lastContact: "1 day ago",
    // },
    // {
    //     id: "3",
    //     name: "Arjun Kapoor",
    //     phone: "+91 76543 33333",
    //     company: "Fintech Sol",
    //     interest: "Meeting Room",
    //     status: "Cold",
    //     lastContact: "5 days ago",
    // },
    // {
    //     id: "4",
    //     name: "Pooja Singh",
    //     phone: "+91 65432 44444",
    //     company: "Design Co",
    //     interest: "Day Pass",
    //     status: "Warm",
    //     lastContact: "3 hours ago",
    // },
];

const LeadManagementAffiliate = () => {
    const { user, isAuthenticated } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);

    const canUseSeedData =
        isAuthenticated &&
        (user?.role === "admin" || user?.role === "affiliate");

    useEffect(() => {
        const fetchLeads = async () => {
            if (!canUseSeedData) {
                setLeads(INITIAL_LEADS);
                return;
            }

            try {
                const response = await affiliatePortalService.getLeads();
                if (response.success && Array.isArray(response.data)) {
                    const mapped: Lead[] = response.data.map((lead) => ({
                        id: lead.id,
                        name: lead.name,
                        phone: lead.phone,
                        company: lead.company || "-",
                        interest: lead.interest || "-",
                        status: lead.status,
                        lastContact: lead.lastContact
                            ? new Date(lead.lastContact).toLocaleDateString()
                            : "-",
                    }));
                    setLeads(mapped);
                    return;
                }
                setLeads(INITIAL_LEADS);
            } catch {
                setLeads(INITIAL_LEADS);
            }
        };

        fetchLeads();
    }, [canUseSeedData]);

    // Filter Logic: Search + Status Tabs
    const filteredLeads = useMemo(() => {
        return leads.filter((lead) => {
            const matchesSearch =
                lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.company.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTab =
                activeTab === "all" || lead.status.toLowerCase() === activeTab;
            return matchesSearch && matchesTab;
        });
    }, [leads, searchQuery, activeTab]);

    // Calculate Dynamic Stats
    const stats = useMemo(() => {
        const total = leads.length;
        const hot = leads.filter(l => l.status === "Hot").length;
        const warm = leads.filter(l => l.status === "Warm").length;
        const converted = leads.filter(l => l.status === "Converted").length;
        const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0;
        return { total, hot, warm, converted, conversionRate };
    }, [leads]);

    return (
        <div className=" mx-auto min-h-screen p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        Lead{" "}
                        <span className="italic text-[#5bb09c]">
                            Management
                        </span>
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium">
                        Track and manage your referral leads
                    </p>
                </div>
                <Button className="bg-[#5bb09c] text-white hover:bg-[#4a9b89] gap-2 shadow-md">
                    <Plus className="w-4 h-4 text-white" /> Add Lead
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up">
                <LeadStatCard
                    label="Total Leads"
                    value={stats.total}
                />
                <LeadStatCard
                    label="Hot Leads"
                    value={stats.hot}
                    highlightColor="text-red-500"
                />
                <LeadStatCard
                    label="Converted"
                    value={stats.converted}
                    highlightColor="text-emerald-500"
                />
                <LeadStatCard label="Conversion Rate" value={`${stats.conversionRate}%`} />
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-slide-up">
                <div className="p-6 space-y-6">
                    {/* Search Bar */}
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search leads..."
                            className="pl-10 bg-gray-50/50 border-gray-200"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Custom Tabs Logic */}
                    <Tabs
                        defaultValue="all"
                        onValueChange={setActiveTab}
                        className="w-full"
                    >
                        <TabsList className="bg-transparent h-auto p-0 gap-2 mb-6">
                            <TabsTrigger
                                value="all"
                                className="data-[state=active]:bg-[#5bb09c]/10 data-[state=active]:text-[#5bb09c] rounded-full px-6 py-2 border border-transparent data-[state=active]:border-[#5bb09c]/20"
                            >
                                All Leads ({stats.total})
                            </TabsTrigger>
                            <TabsTrigger
                                value="hot"
                                className="data-[state=active]:bg-red-50 data-[state=active]:text-red-500 rounded-full px-6 py-2"
                            >
                                Hot ({stats.hot})
                            </TabsTrigger>
                            <TabsTrigger
                                value="warm"
                                className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-500 rounded-full px-6 py-2"
                            >
                                Warm ({stats.warm})
                            </TabsTrigger>
                            <TabsTrigger
                                value="converted"
                                className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-500 rounded-full px-6 py-2"
                            >
                                Converted ({stats.converted})
                            </TabsTrigger>
                        </TabsList>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead>
                                    <tr className="border-b border-gray-50 text-gray-400 text-[11px] uppercase tracking-widest font-bold">
                                        <th className="px-6 py-4">Lead</th>
                                        <th className="px-6 py-4">Company</th>
                                        <th className="px-6 py-4">Interest</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">
                                            Last Contact
                                        </th>
                                        <th className="px-6 py-4 text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredLeads.map((lead) => (
                                        <LeadTableRow key={lead.id} {...lead} />
                                    ))}
                                </tbody>
                            </table>
                            {filteredLeads.length === 0 && (
                                <div className="py-20 text-center text-gray-400 italic">
                                    No leads found matching your criteria.
                                </div>
                            )}
                        </div>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default LeadManagementAffiliate;
