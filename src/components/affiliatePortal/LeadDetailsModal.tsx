import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Phone,
    Mail,
    X,
    User,
    Building2,
    MapPin,
    Clock,
    FileText,
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
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl">
                <div className="bg-white p-8 space-y-8">
                    {/* Header with Lead ID and Status */}
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                Lead ID
                            </p>
                            <h3 className="text-xl font-bold text-[#5bb09c]">
                                LD-{lead.id.padStart(3, "0")}
                            </h3>
                        </div>
                        <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${statusColors[lead.status]}`}
                        >
                            {lead.status}
                        </span>
                    </div>

                    {/* User Profile Info */}
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {lead.name}
                        </h2>
                        <p className="text-gray-500 font-medium flex items-center gap-2">
                            <Building2 className="w-4 h-4" /> {lead.company}
                        </p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase">
                                Interest
                            </p>
                            <p className="text-sm font-bold text-gray-700">
                                {lead.interest}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase">
                                Last Contact
                            </p>
                            <p className="text-sm font-bold text-gray-700">
                                {lead.lastContact}
                            </p>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Contact Information
                        </h4>
                        <div className="space-y-2">
                            <div
                                className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 group hover:border-[#5bb09c]/30 transition-all cursor-pointer"
                                onClick={() =>
                                    (window.location.href = `mailto:${lead.name.toLowerCase().replace(" ", ".")}@company.com`)
                                }
                            >
                                <Mail className="w-4 h-4 text-[#5bb09c]" />
                                <span className="text-sm font-medium text-gray-600">
                                    {lead.name.toLowerCase().replace(" ", ".")}
                                    @company.com
                                </span>
                            </div>
                            <div
                                className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 group hover:border-[#5bb09c]/30 transition-all cursor-pointer"
                                onClick={() =>
                                    (window.location.href = `tel:${lead.phone}`)
                                }
                            >
                                <Phone className="w-4 h-4 text-[#5bb09c]" />
                                <span className="text-sm font-medium text-gray-600">
                                    {lead.phone}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Notes Section */}
                    <div className="space-y-2">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Notes
                        </h4>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-500 leading-relaxed italic">
                            "Ready to sign, needs pricing confirmation on the
                            virtual office package for a 12-month tenure."
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <Button
                            variant="outline"
                            className="flex-1 h-12 rounded-xl gap-2 font-bold"
                            onClick={() =>
                                (window.location.href = `tel:${lead.phone}`)
                            }
                        >
                            <Phone className="w-4 h-4" /> Call
                        </Button>
                        <Button className="flex-1 h-12 rounded-xl bg-[#5bb09c] hover:bg-[#4a9b89] gap-2 font-bold shadow-lg shadow-teal-100">
                            <Mail className="w-4 h-4" /> Email
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default LeadDetailsModal;
