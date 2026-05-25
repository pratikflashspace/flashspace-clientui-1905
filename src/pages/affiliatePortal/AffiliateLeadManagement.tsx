import React, { useState, useMemo } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import LeadStatCard from "@/components/affiliatePortal/LeadStatCard";
import LeadTableRow, { Lead } from "@/components/affiliatePortal/LeadTableRow";
import AddLeadForm from "@/components/affiliatePortal/AddLeadForm";

const INITIAL_LEADS: Lead[] = [
    {
        id: "1",
        name: "Vikram Mehta",
        phone: "+91 98765 11111",
        company: "NextGen Tech",
        interest: "Virtual Office",
        status: "Hot",
        lastContact: "2 hours ago",
    },
    {
        id: "1",
        name: "Vikram Mehta",
        phone: "+91 98765 11111",
        company: "NextGen Tech",
        interest: "Virtual Office",
        status: "Hot",
        lastContact: "2 hours ago",
    },
    {
        id: "1",
        name: "Vikram Mehta",
        phone: "+91 98765 11111",
        company: "NextGen Tech",
        interest: "Virtual Office",
        status: "Hot",
        lastContact: "2 hours ago",
    },
    {
        id: "1",
        name: "Vikram Mehta",
        phone: "+91 98765 11111",
        company: "NextGen Tech",
        interest: "Virtual Office",
        status: "Hot",
        lastContact: "2 hours ago",
    },
];

const LeadManagementAffiliate = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredLeads = useMemo(() => {
        return INITIAL_LEADS.filter((lead) => {
            const matchesSearch =
                lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.company.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTab =
                activeTab === "all" || lead.status.toLowerCase() === activeTab;
            return matchesSearch && matchesTab;
        });
    }, [searchQuery, activeTab]);

    return (
        <div className="mx-auto w-full p-6 lg:p-10 pb-2 lg:pb-4 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Lead Management</h1>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#5bb09c] text-white hover:bg-[#4a9b89] gap-2 shadow-md">
                            <Plus className="w-4 h-4 text-white" /> Add Lead
                        </Button>
                    </DialogTrigger>

                    {/* [&>button]:hidden removes the default shadcn close (X) button.
                        bg-transparent and border-none allow your AddLeadForm's 3xl rounded corners to show.
                    */}
                    <DialogContent className="sm:max-w-[600px] p-0 bg-transparent border-none shadow-none focus:outline-none overflow-y-auto max-h-[90vh] [&>button]:hidden">

                        {/* Accessibility requirement: Title and Description hidden from sight but available to Screen Readers */}
                        <VisuallyHidden.Root>
                            <DialogTitle>Add New Lead</DialogTitle>
                            <DialogDescription>Fill out the form to add a new potential client.</DialogDescription>
                        </VisuallyHidden.Root>

                        <div className="animate-in zoom-in-95 fade-in duration-200">
                            <AddLeadForm onCancel={() => setIsModalOpen(false)} />
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up">
                <LeadStatCard label="Total Leads" value={INITIAL_LEADS.length} />
                <LeadStatCard label="Hot Leads" value="1" highlightColor="text-red-500" />
                <LeadStatCard label="Converted" value="1" highlightColor="text-emerald-500" />
                <LeadStatCard label="Conversion Rate" value="38%" />
            </div>

            {/* Main Content Area */}
            <div className="bg-[#f8f8f8] rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-slide-up">
                <div className="p-6 space-y-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search leads..."
                            className="pl-10 bg-gray-50/50 border-gray-200"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
                        <TabsList className="bg-transparent h-auto p-0 gap-2 mb-6">
                            <TabsTrigger value="all" className="data-[state=active]:bg-[#5bb09c]/10 data-[state=active]:text-[#5bb09c] rounded-full px-6 py-2 border border-transparent data-[state=active]:border-[#5bb09c]/20">
                                All Leads ({INITIAL_LEADS.length})
                            </TabsTrigger>
                            <TabsTrigger value="hot" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-500 rounded-full px-6 py-2">
                                Hot (1)
                            </TabsTrigger>
                            <TabsTrigger value="warm" className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-500 rounded-full px-6 py-2">
                                Warm (2)
                            </TabsTrigger>
                            <TabsTrigger value="converted" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-500 rounded-full px-6 py-2">
                                Converted (1)
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
                                        <th className="px-6 py-4">Last Contact</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredLeads.map((lead) => (
                                        <LeadTableRow key={lead.id} {...lead} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default LeadManagementAffiliate;