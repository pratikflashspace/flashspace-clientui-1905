import React from "react";
import { Share2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface QuotationCardProps {
    id: string;
    clientName: string;
    spaceDetails: string;
    location: string;
    price: string;
    date: string;
    status: "Sent" | "Viewed" | "Accepted";
}

const QuotationCard = ({
    id,
    clientName,
    spaceDetails,
    location,
    price,
    date,
    status,
}: QuotationCardProps) => {
    const statusStyles = {
        Sent: "bg-orange-50 text-orange-600 border-orange-100",
        Viewed: "bg-blue-50 text-blue-600 border-blue-100",
        Accepted: "bg-emerald-50 text-emerald-600 border-emerald-100",
    };

    return (
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative transition-all hover:border-[#5bb09c]/30">
            {/* Top Row: ID and Status Badge */}
            <div className="flex justify-between items-start mb-3">
                <span className="text-[11px] font-bold text-[#5bb09c] uppercase tracking-wider">
                    {id}
                </span>
                <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusStyles[status]}`}
                >
                    {status}
                </span>
            </div>

            {/* Info Section */}
            <div className="mb-4">
                <h4 className="font-bold text-gray-900 text-base mb-1">
                    {clientName}
                </h4>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                    {spaceDetails}
                    <br />
                    {location}
                </p>
            </div>

            {/* Bottom Row: Price, Date, and Actions */}
            <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                <div className="flex items-baseline gap-2">
                    <span className="text-base font-bold text-gray-900">
                        {price}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                        {date}
                    </span>
                </div>

                <div className="flex gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-[#5bb09c] hover:bg-teal-50"
                    >
                        <Share2 className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-[#5bb09c] hover:bg-teal-50"
                    >
                        <Download className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default QuotationCard;
