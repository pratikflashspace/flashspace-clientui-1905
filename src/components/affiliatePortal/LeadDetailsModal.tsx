import React from "react";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Phone,
    Mail,
    Building2,
    Calendar,
    FileText,
    StickyNote,
    User2,
    Clock,
    X,
    MessageSquare,
    Globe
} from "lucide-react";
import { Lead } from "./LeadTypes";

interface LeadDetailsModalProps {
    lead: Lead | null;
    isOpen: boolean;
    onClose: () => void;
}

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

const LeadDetailsModal = ({ lead, isOpen, onClose }: LeadDetailsModalProps) => {
    if (!lead) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none shadow-2xl rounded-[2.5rem] bg-[#f8f9fa]">
                <div className="relative">
                    {/* Close Button Overlay */}
                    <button
                        onClick={onClose}
                        className="absolute right-6 top-6 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full text-[#64748b] hover:text-[#1a2d1d] transition-all shadow-sm"
                    >
                        <X size={20} />
                    </button>

                    <div className="p-8 space-y-8">
                        {/* Header Section */}
                        <div className="flex justify-between items-start pt-2">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-xl bg-[#36503F] flex items-center justify-center text-[#fef8c5] shadow-lg shadow-[#36503F]/20">
                                        <User2 size={32} />
                                    </div>
                                    <div>
                                        <h2 style={{ fontFamily: "'Inter', sans-serif" }} className="text-lg font-bold text-[#1a2d1d] tracking-tight leading-tight">
                                            {lead.name}
                                        </h2>
                                        <StatusBadge status={lead.status} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm space-y-1">
                                <p className="text-sm font-bold text-[#64748b] uppercase tracking-widest">Interested In</p>
                                <div className="flex items-center gap-2">
                                    <Globe size={14} className="text-[#334D3D]" />
                                    <p className="text-sm font-bold text-[#1a2d1d]">{lead.interest}</p>
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm space-y-1">
                                <p className="text-sm font-bold text-[#64748b] uppercase tracking-widest">Last Contact</p>
                                <div className="flex items-center gap-2">
                                    <Clock size={14} className="text-[#10b981]" />
                                    <p className="text-sm font-bold text-[#1a2d1d]">{lead.lastContact}</p>
                                </div>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="space-y-4">
                            <h4 style={{ fontFamily: "'Inter', sans-serif" }} className="text-lg font-bold text-[#64748b] uppercase tracking-widest">Lead Information</h4>
                            <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm divide-y divide-gray-50 overflow-hidden">
                                <div className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#64748b]">
                                        <Building2 size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[#64748b] uppercase">Company</p>
                                        <p className="text-sm font-bold text-[#1a2d1d]">{lead.company}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#64748b]">
                                        <Mail size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[#64748b] uppercase">Email Address</p>
                                        <p className="text-sm font-bold text-[#1a2d1d]">{lead.name.toLowerCase().replace(" ", ".")}@company.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#64748b]">
                                        <Phone size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[#64748b] uppercase">Phone Number</p>
                                        <p className="text-sm font-bold text-[#1a2d1d]">{lead.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notes Section */}
                        <div className="space-y-4">
                            <h4 style={{ fontFamily: "'Inter', sans-serif" }} className="text-lg font-bold text-[#64748b] uppercase tracking-widest">Internal Notes</h4>
                            <div className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm relative group">
                                <StickyNote size={16} className="absolute right-5 top-5 text-[#64748b]/30 group-hover:text-[#334D3D]/50 transition-all" />
                                <p className="text-sm text-[#64748b] leading-relaxed font-medium italic">
                                    "Ready to sign, needs pricing confirmation on the
                                    virtual office package for a 12-month tenure."
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-2">
                            <Button
                                onClick={() => window.location.href = `tel:${lead.phone}`}
                                className="flex-1 bg-[#10b981] hover:bg-[#059669] text-white h-14 rounded-2xl font-bold text-sm gap-2 shadow-lg shadow-emerald-500/10 transition-all"
                            >
                                <Phone className="w-5 h-5" /> Call Now
                            </Button>
                            <Button
                                className="flex-1 bg-white border border-gray-200 text-[#1a2d1d] hover:bg-gray-50 h-14 rounded-2xl font-bold text-sm gap-2 shadow-sm transition-all"
                                onClick={() => window.location.href = `mailto:support@flashspace.in`}
                            >
                                <MessageSquare className="w-5 h-5 text-[#334D3D]" /> Send Email
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default LeadDetailsModal;
