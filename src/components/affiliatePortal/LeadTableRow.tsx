import React, { useState } from "react";
import {
    Eye,
    Phone,
    Mail,
    MoreVertical,
    FileText,
    Calendar,
    StickyNote,
    CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import LeadDetailsModal from "./LeadDetailsModal";

export interface Lead {
    id: string;
    name: string;
    phone: string;
    company: string;
    interest: string;
    status: "Hot" | "Warm" | "Cold" | "Converted";
    lastContact: string;
}

const LeadTableRow = (lead: Lead) => {
    const { name, phone, company, interest, status, lastContact } = lead;
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const statusColors = {
        Hot: "bg-red-50 text-red-500",
        Warm: "bg-orange-50 text-orange-500",
        Cold: "bg-blue-50 text-blue-500",
        Converted: "bg-emerald-50 text-emerald-500",
    };

    return (
        <>
            <tr className="group hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0">
                <td className="px-6 py-5">
                    <p className="font-bold text-gray-900 text-sm">{name}</p>
                    <p className="text-xs text-gray-400 font-medium">{phone}</p>
                </td>
                <td className="px-6 py-5 text-sm text-gray-600 font-medium">
                    {company}
                </td>
                <td className="px-6 py-5">
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-tight">
                        {interest}
                    </span>
                </td>
                <td className="px-6 py-5">
                    <span
                        className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${statusColors[status]}`}
                    >
                        {status}
                    </span>
                </td>
                <td className="px-6 py-5 text-sm text-gray-400 font-medium">
                    {lastContact}
                </td>
                <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-1">
                        {/* View Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-gray-400 hover:text-[#5bb09c] hover:bg-teal-50 rounded-xl"
                            onClick={() => setIsDetailsOpen(true)}
                        >
                            <Eye className="w-4 h-4" />
                        </Button>

                        {/* Phone Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-gray-400 hover:text-white hover:bg-[#e59e4e] rounded-xl transition-all"
                            onClick={() =>
                                (window.location.href = `tel:${phone}`)
                            }
                        >
                            <Phone className="w-4 h-4" />
                        </Button>

                        {/* Mail Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-gray-400 hover:text-white hover:bg-[#e59e4e] rounded-xl transition-all"
                            onClick={() =>
                                (window.location.href = `mailto:support@flashspace.in`)
                            }
                        >
                            <Mail className="w-4 h-4" />
                        </Button>

                        {/* Action Popover (Three Dots) */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl"
                                >
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-52 p-1 bg-white rounded-xl shadow-xl border border-gray-100 animate-in fade-in zoom-in-95"
                                align="end"
                            >
                                <div className="flex flex-col">
                                    <button className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-white bg-[#e59e4e] rounded-lg mb-1 transition-colors">
                                        <FileText className="w-4 h-4" /> Send
                                        Quotation
                                    </button>
                                    <button className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                        <Calendar className="w-4 h-4" />{" "}
                                        Schedule Follow-up
                                    </button>
                                    <button className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                        <StickyNote className="w-4 h-4" /> Add
                                        Note
                                    </button>
                                    <button className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                        <CheckCircle className="w-4 h-4" /> Mark
                                        as Converted
                                    </button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </td>
            </tr>

            {/* Details Modal */}
            <LeadDetailsModal
                lead={lead}
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
            />
        </>
    );
};

export default LeadTableRow;
