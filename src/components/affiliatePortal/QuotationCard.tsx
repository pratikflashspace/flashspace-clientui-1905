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

    const handleDownloadPDF = () => {
        try {
            // Dynamically import jsPDF so we don't break SSR or initial bundle if not needed
            import("jspdf").then(({ default: jsPDF }) => {
                const doc = new jsPDF();

                // Add Company Header
                doc.setFontSize(22);
                doc.setTextColor(91, 176, 156); // #5bb09c
                doc.text("FlashSpace", 105, 20, { align: "center" });

                doc.setFontSize(16);
                doc.setTextColor(40, 40, 40);
                doc.text("Quotation", 105, 30, { align: "center" });

                // Add Line separator
                doc.setDrawColor(200, 200, 200);
                doc.line(20, 35, 190, 35);

                // Add Details
                doc.setFontSize(12);
                doc.setTextColor(80, 80, 80);

                const startY = 50;
                const lineHeight = 10;

                doc.text(`Quotation ID: ${id}`, 20, startY);
                doc.text(`Date: ${date}`, 140, startY);

                doc.setFont("helvetica", "bold");
                doc.text("Prepared For:", 20, startY + lineHeight * 2);
                doc.setFont("helvetica", "normal");
                doc.text(clientName, 20, startY + lineHeight * 2.6);

                doc.setFont("helvetica", "bold");
                doc.text("Space Requirements:", 20, startY + lineHeight * 4);
                doc.setFont("helvetica", "normal");
                doc.text(spaceDetails, 20, startY + lineHeight * 4.6);
                doc.text(location, 20, startY + lineHeight * 5.2);

                // Total Box
                doc.setFillColor(242, 250, 249); // bg-[#f2faf9] approximate
                doc.roundedRect(20, startY + lineHeight * 7, 170, 25, 3, 3, "F");

                doc.setFontSize(14);
                doc.setFont("helvetica", "bold");
                doc.setTextColor(91, 176, 156);
                doc.text("Total Amount:", 25, startY + lineHeight * 8.6);

                doc.setFontSize(18);
                doc.setTextColor(40, 40, 40);
                doc.text(price, 185, startY + lineHeight * 8.6, { align: "right" });

                // Footer
                doc.setFontSize(10);
                doc.setFont("helvetica", "normal");
                doc.setTextColor(150, 150, 150);
                doc.text("Thank you for choosing FlashSpace. This is a system generated quotation.", 105, 280, { align: "center" });

                // Save PDF
                doc.save(`Quotation_${id}.pdf`);
            });
        } catch (error) {
            console.error("Failed to generate PDF:", error);
        }
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
                        className="h-8 w-8 text-gray-400 hover:text-[#5bb09c] hover:bg-teal-50 pt-0.5"
                    >
                        <Share2 className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-[#5bb09c] hover:bg-teal-50 pt-0.5"
                        onClick={handleDownloadPDF}
                    >
                        <Download className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default QuotationCard;
