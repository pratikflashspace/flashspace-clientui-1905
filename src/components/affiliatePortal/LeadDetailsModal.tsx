import React from "react";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Phone,
    Mail,
    X,
    Building2,
} from "lucide-react";
import { Lead } from "./LeadTableRow";

interface LeadDetailsModalProps {
    lead: Lead | null;
    isOpen: boolean;
    onClose: () => void;
}

const LeadDetailsModal = ({ lead, isOpen, onClose }: LeadDetailsModalProps) => {
    if (!lead) return null;

    const statusColors = {
        Hot: "bg-red-50 text-red-500",
        Warm: "bg-orange-50 text-orange-500",
        Cold: "bg-blue-50 text-blue-500",
        Converted: "bg-emerald-50 text-emerald-500",
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            {/* Transparent backdrop logic to allow the custom card styling */}
            <DialogContent className="sm:max-w-[420px] p-0 bg-transparent border-none shadow-none focus:outline-none overflow-y-auto max-h-[85vh] [&>button]:hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                
                {/* MATCHING ANIMATION & STYLING CONTAINER */}
                <div className="animate-in zoom-in-95 fade-in duration-200 bg-white rounded-3xl overflow-hidden shadow-2xl mx-4 my-2">
                    
                    {/* Sticky Header - Identical to AddLeadForm */}
                    <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-white sticky top-0 z-10">
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                Lead Details
                            </p>
                            <h3 className="text-lg font-bold text-[#5bb09c]">
                                LD-{lead.id.padStart(3, "0")}
                            </h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                            type="button"
                        >
                            <X size={18} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="p-5 space-y-4">
                        {/* Status Badge */}
                        <div className="flex justify-start">
                            <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColors[lead.status as keyof typeof statusColors] || "bg-gray-50 text-gray-500"}`}
                            >
                                {lead.status}
                            </span>
                        </div>

                        {/* Profile Info */}
                        <div className="space-y-0.5">
                            <h2 className="text-xl font-bold text-gray-900 leading-tight">
                                {lead.name}
                            </h2>
                            <p className="text-gray-500 text-sm font-medium flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-gray-400" /> {lead.company}
                            </p>
                        </div>

                        {/* Details Grid Card */}
                        <div className="grid grid-cols-2 gap-3 bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
                            <div className="space-y-0.5">
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Interest</p>
                                <p className="text-xs font-bold text-gray-700">{lead.interest}</p>
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Last Contact</p>
                                <p className="text-xs font-bold text-gray-700">{lead.lastContact}</p>
                            </div>
                        </div>

                        {/* Contact Section */}
                        <div className="space-y-2">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contact Information</h4>
                            <div className="space-y-1.5">
                                <div
                                    className="flex items-center gap-2.5 bg-gray-50 p-2.5 rounded-xl border border-gray-100 group hover:border-[#5bb09c]/30 transition-all cursor-pointer"
                                    onClick={() => (window.location.href = `mailto:contact@company.com`)}
                                >
                                    <Mail className="w-3.5 h-3.5 text-[#5bb09c]" />
                                    <span className="text-xs font-medium text-gray-600 truncate">
                                        {lead.name.toLowerCase().replace(/\s+/g, ".")}@company.com
                                    </span>
                                </div>
                                <div
                                    className="flex items-center gap-2.5 bg-gray-50 p-2.5 rounded-xl border border-gray-100 group hover:border-[#5bb09c]/30 transition-all cursor-pointer"
                                    onClick={() => (window.location.href = `tel:${lead.phone}`)}
                                >
                                    <Phone className="w-3.5 h-3.5 text-[#5bb09c]" />
                                    <span className="text-xs font-medium text-gray-600">
                                        {lead.phone}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Notes Section */}
                        <div className="space-y-1.5">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Notes</h4>
                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs text-gray-500 leading-relaxed italic">
                                "Ready to sign, needs pricing confirmation on the virtual office package for a 12-month tenure."
                            </div>
                        </div>

                        {/* Footer Action Buttons */}
                        <div className="flex flex-col md:flex-row gap-2 pt-1">
                            <Button
                                variant="outline"
                                className="flex-1 h-10 rounded-xl gap-1.5 text-xs font-bold border-gray-200 hover:bg-gray-50 transition-all"
                                onClick={() => (window.location.href = `tel:${lead.phone}`)}
                            >
                                <Phone className="w-3.5 h-3.5" /> Call Lead
                            </Button>
                            <Button className="flex-1 h-10 text-white rounded-xl bg-[#5bb09c] hover:bg-[#4a9b89] gap-1.5 text-xs font-bold shadow-lg shadow-teal-100/50 transition-all">
                                <Mail className="w-3.5 h-3.5 text-white" /> Send Email
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default LeadDetailsModal;