import React, { useState } from "react";
import { Search, Plus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { createPortal } from "react-dom";
import NewTicketForm from "./NewTicketForm";

const SupportTickets = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);

    const tickets = [
        {
            id: "TKT-2024-045",
            subject: "Commission calculation query",
            status: "open",
            priority: "medium",
            date: "Jan 28, 2024",
        },
        {
            id: "TKT-2024-039",
            subject: "Referral link not tracking",
            status: "in progress",
            priority: "high",
            date: "Jan 25, 2024",
        },
        {
            id: "TKT-2024-032",
            subject: "Need marketing materials",
            status: "resolved",
            priority: "low",
            date: "Jan 20, 2024",
        },
    ];

    const filteredTickets = tickets.filter(
        (ticket) =>
            ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            className="pl-10"
                            placeholder="Search tickets..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button 
                        onClick={() => setIsNewTicketOpen(true)}
                        className="bg-[#5bb09c] text-white hover:bg-[#4a9b89] gap-2 w-full md:w-auto"
                    >
                        <Plus className="w-4 h-4 text-white" /> New Ticket
                    </Button>
                </div>

                <div className="divide-y divide-gray-50">
                    {filteredTickets.map((t) => (
                        <div
                            key={t.id}
                            className="p-6 hover:bg-gray-50/50 transition-colors flex items-center justify-between"
                        >
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold text-[#5bb09c]">
                                    {t.id}
                                </span>
                                <h4 className="font-bold text-gray-900">
                                    {t.subject}
                                </h4>
                                <p className="text-[10px] text-gray-400 font-medium">
                                    Created: {t.date}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${t.priority === "high" ? "bg-red-50 text-red-500" : "bg-yellow-50 text-yellow-600"}`}
                                >
                                    {t.priority}
                                </span>
                                <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${t.status === "open" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}`}
                                >
                                    {t.status}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-400 hover:text-[#5bb09c]"
                                >
                                    <Eye className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    {filteredTickets.length === 0 && (
                        <div className="p-8 text-center text-gray-400 text-sm italic">
                            No tickets found matching your search.
                        </div>
                    )}
                </div>
            </div>

            {/* Render New Ticket Modal via Portal */}
            {isNewTicketOpen && createPortal(
                <NewTicketForm onCancel={() => setIsNewTicketOpen(false)} />,
                document.body
            )}
        </>
    );
};

export default SupportTickets;
