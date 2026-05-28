import React, { useState, useMemo, useEffect } from "react";
import {
    Search,
    Plus,
    ArrowUpRight,
    Users,
    Flame,
    CheckCircle2,
    Percent,
    Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { affiliatePortalService } from "@/services/affiliatePortal.service";
import LeadTableRow, { Lead } from "@/components/affiliatePortal/LeadTableRow";

// --- Custom Hook for Number Counting Animation ---
const useCountUp = (end: number, duration: number = 800) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        let animationFrameId: number;

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = currentTime - startTime;

            if (progress < duration) {
                const nextCount = Math.min(end, (progress / duration) * end);
                setCount(nextCount);
                animationFrameId = requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, [end, duration]);

    return count;
};

// --- Sub-Component: StatCard ---
const StatCard = ({ label, value, icon: Icon, delay, colorClass = "text-[#1a2d1d]", isPercentage = false }: any) => {
    const count = useCountUp(typeof value === 'number' ? value : parseFloat(value) || 0);

    return (
        <div
            className="bg-[#f8f8f8] p-6 rounded-2xl border border-gray-200 shadow transition-all duration-300 group animate-fade-in-up flex flex-col justify-between h-[160px]"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex justify-between items-start">
                <span className="text-[#677e73] font-medium text-sm tracking-tight">{label}</span>
                <div className="w-8 h-8 flex items-center justify-center bg-[#f8f8f8] rounded-full text-[#677e73] transition-colors group-hover:bg-[#e2e8f0]">
                    <Icon size={18} />
                </div>
            </div>
            <div className="mt-auto space-y-2">
                <h3 className={`text-[30px] font-black ${colorClass} leading-none tracking-tight`} style={{ fontFamily: "'Inter Tight', sans-serif" }}>
                    {isPercentage ? `${Math.round(count)}%` : Math.round(count)}
                </h3>
            </div>
        </div>
    );
};

const LeadManagementAffiliate = () => {
    const { user, isAuthenticated } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

    const canUseSeedData =
        isAuthenticated &&
        (user?.role === "admin" || user?.role === "affiliate");

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                setLoading(true);
                const response = await affiliatePortalService.getLeads();
                if (response.success && Array.isArray(response.data)) {
                    const mapped: Lead[] = response.data.map((lead) => ({
                        id: lead.id,
                        name: lead.name,
                        phone: lead.phone,
                        company: lead.company || "-",
                        interest: lead.interest || "Virtual Office",
                        status: (lead.status.charAt(0).toUpperCase() + lead.status.slice(1)) as Lead['status'],
                        lastContact: lead.lastContact
                            ? new Date(lead.lastContact).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                            : "Recently",
                    }));
                    setLeads(mapped);
                }
            } catch (error) {
                console.error("Failed to fetch leads:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeads();
    }, [canUseSeedData]);

    const stats = useMemo(() => {
        const total = leads.length;
        const hot = leads.filter(l => l.status === "Hot").length;
        const warm = leads.filter(l => l.status === "Warm").length;
        const converted = leads.filter(l => l.status === "Converted").length;
        const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0;
        return { total, hot, warm, converted, conversionRate };
    }, [leads]);

    const filteredLeads = useMemo(() => {
        return leads.filter((lead) => {
            const matchesSearch =
                lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.company.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTab =
                activeTab === "all" || lead.status.toLowerCase() === activeTab.toLowerCase();
            return matchesSearch && matchesTab;
        });
    }, [leads, searchQuery, activeTab]);

    return (
        <div className="min-h-screen bg-[#f7f7f6] p-8 lg:p-12 font-sans w-full animate-fade-in relative overflow-x-hidden">
            <div className="max-w-[1400px] mx-auto space-y-12">
                {/* 1. Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-fade-in-down">
                    <div>
                        <h1 className="text-3xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                            Lead <span className="italic">Management</span>
                        </h1>
                        <p className="mt-2 text-[16px] font-medium text-[#6B7280] tracking-tight">
                            Track and manage your referral leads
                        </p>
                    </div>
                    <Button className="bg-[#334D3D] text-white hover:bg-[#1a2d1d] px-8 py-7 rounded-2xl text-[15px] font-black shadow-lg shadow-[#334D3D]/10 transition-all gap-2 h-auto">
                        <Plus className="w-5 h-5" /> Add Lead
                    </Button>
                </div>

                {/* 2. Stats Grid */}
                <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
                    <StatCard
                        label="Total Leads"
                        value={stats.total}
                        icon={Users}
                        delay={0}
                    />
                    <StatCard
                        label="Hot Leads"
                        value={stats.hot}
                        icon={Flame}
                        colorClass="text-red-500"
                        delay={100}
                    />
                    <StatCard
                        label="Converted"
                        value={stats.converted}
                        icon={CheckCircle2}
                        colorClass="text-[#10b981]"
                        delay={200}
                    />
                    <StatCard
                        label="Conversion Rate"
                        value={stats.conversionRate}
                        icon={Percent}
                        delay={300}
                        isPercentage={true}
                    />
                </div>

                {/* 3. Main Content Area */}
                <div className="bg-[#f8f8f8] rounded-[2.5rem] border border-gray-200 shadow transition-all duration-300 overflow-hidden animate-slide-up">
                    <div className="p-8 space-y-8">
                        {/* Toolbar */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            {/* Search */}
                            <div className="relative flex-1 w-full max-w-2xl">
                                <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#64748b]" />
                                <Input
                                    placeholder="Search leads..."
                                    className="w-full pl-14 pr-6 py-4 bg-[#f8f9fa] border-[#edede6] rounded-[1.25rem] focus:bg-white focus:border-[#334D3D]/10 focus:ring-2 focus:ring-[#334D3D]/5 shadow-none text-[15px] font-medium text-[#1a2d1d] h-auto"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            {/* Tabs */}
                            <div className="flex items-center gap-2 bg-[#f8f9fa] p-1.5 rounded-[1.25rem] w-full md:w-auto">
                                {[
                                    { id: "all", label: "All Leads", count: stats.total },
                                    { id: "hot", label: "Hot", count: stats.hot },
                                    { id: "warm", label: "Warm", count: stats.warm },
                                    { id: "converted", label: "Converted", count: stats.converted },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`
                                            flex-1 md:flex-none px-6 py-3 rounded-xl text-[13px] font-black transition-all duration-300 whitespace-nowrap
                                            ${activeTab === tab.id
                                                ? "bg-white text-[#1a2d1d] shadow-sm shadow-gray-200/50"
                                                : "text-[#64748b] hover:text-[#1a2d1d]"
                                            }
                                        `}
                                    >
                                        {tab.label} ({tab.count})
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto -mx-8 px-8">
                            <table className="w-full text-left border-collapse min-w-[1000px]">
                                <thead>
                                    <tr className="bg-[#f6f6f4] border-b border-[#f1f2ed]">
                                        {[
                                            "Lead",
                                            "Company",
                                            "Interest",
                                            "Status",
                                            "Last Contact",
                                            "Actions"
                                        ].map((head) => (
                                            <th key={head} className="px-6 py-4 text-[13px] font-black text-[#64748b] tracking-widest uppercase">
                                                {head}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#f1f2ed]">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-24 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <Loader2 className="w-10 h-10 animate-spin text-[#334D3D]" />
                                                    <p className="text-[#64748b] font-medium">Fetching leads...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredLeads.length > 0 ? (
                                        filteredLeads.map((lead, idx) => (
                                            <LeadTableRow
                                                key={lead.id}
                                                {...lead}
                                                delay={idx * 50}
                                            />
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-24 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <p className="text-[#64748b] text-lg font-medium">No leads found matching your search.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Global CSS for Animations */}
            <style>{`
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .animate-fade-in-down {
                    animation: fadeInDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    animation-fill-mode: forwards;
                }
                .animate-slide-up {
                    animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    );
};

export default LeadManagementAffiliate;
