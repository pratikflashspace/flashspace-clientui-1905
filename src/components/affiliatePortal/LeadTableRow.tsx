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
    User2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import LeadDetailsModal from "./LeadDetailsModal";
import { Lead } from "./LeadTypes";

const StatusBadge = ({ status }: { status: Lead['status'] }) => {
    const styles = {
        Hot: "bg-[#fef2f2] text-red-600 border-red-100",
        Warm: "bg-[#fffbeb] text-amber-600 border-amber-100",
        Cold: "bg-[#f0f9ff] text-blue-600 border-blue-100",
        Converted: "bg-[#f0fdf4] text-[#10b981] border-[#bcf0da]",
    };

    const dotColors = {
        Hot: "bg-red-500",
        Warm: "bg-amber-500",
        Cold: "bg-blue-500",
        Converted: "bg-[#10b981]",
    };

    return (
        <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider border ${styles[status]}`}>
            <span className={`w-2 h-2 rounded-full ${dotColors[status]}`} />
            {status}
        </span>
    );
};

interface LeadTableRowProps extends Lead {
    delay?: number;
}

const LeadTableRow = (props: LeadTableRowProps) => {
    const { id, name, phone, company, interest, status, lastContact, delay = 0 } = props;
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    return (
        <>
            <tr
                className="group hover:bg-gray-50/50 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${delay}ms` }}
            >
                {/* Lead Column */}
                <td className="px-6 py-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#f1f5f9] flex items-center justify-center text-[#64748b] group-hover:bg-white group-hover:shadow-sm transition-all">
                            <User2 size={18} />
                        </div>
                        <div>
                            <p className="font-bold text-[#1a2d1d] text-sm tracking-tight">{name}</p>
                            <p className="text-sm text-[#64748b] font-medium">{phone}</p>
                        </div>
                    </div>
                </td>

                {/* Company Column */}
                <td className="px-6 py-6">
                    <p className="text-sm font-bold text-[#1a2d1d] tracking-tight">
                        {company}
                    </p>
                </td>

                {/* Interest Column */}
                <td className="px-6 py-6">
                    <span className="bg-[#f8f9fa] text-[#1a2d1d] px-3 py-1 rounded-lg text-sm font-bold uppercase tracking-tight border border-gray-100">
                        {interest}
                    </span>
                </td>

                {/* Status Column */}
                <td className="px-6 py-6">
                    <StatusBadge status={status} />
                </td>

                {/* Last Contact Column */}
                <td className="px-6 py-6">
                    <p className="text-sm text-[#64748b] font-medium">
                        {lastContact}
                    </p>
                </td>

                {/* Actions Column */}
                <td className="px-6 py-6">
                    <div className="flex items-center gap-2">
                        {/* View */}
                        <button
                            onClick={() => setIsDetailsOpen(true)}
                            className="p-2.5 bg-[#FAFAF7] text-[#6B8F78] rounded-lg hover:bg-[#36503F] hover:text-[#fef8c5] transition-all shadow-sm border border-[#D4E0D0]"
                            title="View Details"
                        >
                            <Eye size={16} />
                        </button>

                        {/* Phone */}
                        <button
                            onClick={() => window.location.href = `tel:${phone}`}
                            className="p-2.5 bg-[#f8f9fa] text-[#64748b] rounded-xl hover:bg-[#10b981] hover:text-white transition-all shadow-sm border border-gray-100"
                            title="Call Lead"
                        >
                            <Phone size={16} />
                        </button>

                        {/* Mail */}
                        <button
                            onClick={() => window.location.href = `mailto:support@flashspace.in`}
                            className="p-2.5 bg-[#f8f9fa] text-[#64748b] rounded-xl hover:bg-[#3b82f6] hover:text-white transition-all shadow-sm border border-gray-100"
                            title="Email Lead"
                        >
                            <Mail size={16} />
                        </button>

                        {/* More Actions */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <button
                                    className="p-2.5 bg-[#f8f9fa] text-[#64748b] rounded-xl hover:bg-white hover:text-[#1a2d1d] transition-all shadow-sm border border-gray-100"
                                >
                                    <MoreVertical size={16} />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-56 p-2 bg-white rounded-[1.25rem] shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 mt-2"
                                align="end"
                            >
                                <div className="space-y-1">
                                    <button className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-white bg-[#334D3D] rounded-xl hover:bg-[#1a2d1d] transition-all">
                                        <FileText className="w-4 h-4" /> Send Quotation
                                    </button>
                                    <button className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-[#64748b] hover:bg-[#f8f9fa] hover:text-[#1a2d1d] rounded-xl transition-all">
                                        <Calendar className="w-4 h-4" /> Schedule Follow-up
                                    </button>
                                    <button className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-[#64748b] hover:bg-[#f8f9fa] hover:text-[#1a2d1d] rounded-xl transition-all">
                                        <StickyNote className="w-4 h-4" /> Add Note
                                    </button>
                                    <button className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-[#10b981] hover:bg-emerald-50 rounded-xl transition-all border border-emerald-50">
                                        <CheckCircle className="w-4 h-4" /> Mark as Converted
                                    </button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </td>
            </tr>

            {/* Details Modal */}
            <LeadDetailsModal
                lead={{ id, name, phone, company, interest, status, lastContact }}
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
            />
        </>
    );
};

export default LeadTableRow;
