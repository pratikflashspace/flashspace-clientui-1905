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

    const handleDownloadPDF = async () => {
        try {
            // Dynamically import jsPDF so we don't break SSR or initial bundle if not needed
            const { default: jsPDF } = await import("jspdf");
            const doc = new jsPDF();

            const loadImage = (url: string): Promise<HTMLImageElement> => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.crossOrigin = 'Anonymous';
                    img.onload = () => resolve(img);
                    img.onerror = (e) => reject(e);
                    img.src = url;
                });
            };

            let logo: HTMLImageElement | null = null;
            try {
                logo = await loadImage('/Logo/Flashspace Logo.png');
            } catch (err) {
                console.warn("Could not load logo for PDF", err);
            }

            // Header Section
            if (logo) {
                const imgWidth = 45;
                const imgHeight = (logo.height * imgWidth) / logo.width;
                doc.addImage(logo, 'PNG', 20, 15, imgWidth, imgHeight);
            } else {
                doc.setFontSize(24);
                doc.setTextColor(91, 176, 156); // #5bb09c
                doc.setFont("helvetica", "bold");
                doc.text("FlashSpace", 20, 25);
            }

            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.setFont("helvetica", "normal");
            doc.text("www.flashspace.in", 190, 20, { align: "right" });
            doc.text("hello@flashspace.in", 190, 25, { align: "right" });

            // Title
            doc.setFontSize(28);
            doc.setTextColor(40, 40, 40);
            doc.setFont("helvetica", "bold");
            doc.text("QUOTATION", 190, 45, { align: "right" });

            // Line separator
            doc.setDrawColor(91, 176, 156);
            doc.setLineWidth(0.5);
            doc.line(20, 55, 190, 55);

            // Meta details
            doc.setFontSize(10);
            doc.setTextColor(80, 80, 80);
            const startY = 70;

            doc.setFont("helvetica", "bold");
            doc.text("Quotation No:", 20, startY);
            doc.setFont("helvetica", "normal");
            doc.text(id, 50, startY);

            doc.setFont("helvetica", "bold");
            doc.text("Date:", 140, startY);
            doc.setFont("helvetica", "normal");
            doc.text(date, 155, startY);

            // Client Details Box
            doc.setFillColor(249, 250, 251);
            doc.roundedRect(20, startY + 15, 80, 40, 3, 3, "F");

            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(40, 40, 40);
            doc.text("Prepared For:", 25, startY + 25);

            doc.setFontSize(12);
            doc.setTextColor(91, 176, 156);
            doc.text(clientName, 25, startY + 35);

            // Space Details Box
            doc.setFillColor(249, 250, 251);
            doc.roundedRect(110, startY + 15, 80, 40, 3, 3, "F");

            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(40, 40, 40);
            doc.text("Space Requirements:", 115, startY + 25);

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(80, 80, 80);

            const splitDetails = doc.splitTextToSize(spaceDetails, 70);
            doc.text(splitDetails, 115, startY + 35);
            doc.text(location, 115, startY + 35 + (splitDetails.length * 5));

            // Pricing Section
            const tableY = startY + 75;

            // Table Header
            doc.setFillColor(91, 176, 156);
            doc.rect(20, tableY, 170, 12, "F");

            doc.setFontSize(10);
            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "bold");
            doc.text("Description", 25, tableY + 8);
            doc.text("Total", 185, tableY + 8, { align: "right" });

            // Table Row
            doc.setFillColor(255, 255, 255);
            doc.setDrawColor(230, 230, 230);
            doc.rect(20, tableY + 12, 170, 20);

            doc.setTextColor(60, 60, 60);
            doc.setFont("helvetica", "normal");
            doc.text("Office Space Rental - As per requirements", 25, tableY + 24);

            // Avoid missing char encoding issues in jsPDF default fonts
            const safePrice = price.replace('₹', 'INR ');
            doc.setFont("helvetica", "bold");
            doc.text(safePrice, 185, tableY + 24, { align: "right" });

            // Total Box
            doc.setFillColor(242, 250, 249);
            doc.rect(20, tableY + 32, 170, 20, "F");

            doc.setFontSize(14);
            doc.setTextColor(40, 40, 40);
            doc.text("Net Total Amount:", 120, tableY + 45);

            doc.setTextColor(91, 176, 156);
            doc.setFontSize(16);
            doc.text(safePrice, 185, tableY + 45, { align: "right" });

            // Footer
            doc.setFontSize(10);
            doc.setFont("helvetica", "italic");
            doc.setTextColor(150, 150, 150);
            doc.text("Thank you for choosing FlashSpace.", 105, 275, { align: "center" });
            doc.text("This is a system generated quotation and does not require a signature.", 105, 280, { align: "center" });

            // Save PDF
            doc.save(`Quotation_${id}.pdf`);
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
