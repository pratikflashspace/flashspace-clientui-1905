import React, { useState } from "react";
import { Share2, Download, Eye, X, MapPin, Calendar, Building2, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface QuotationCardProps {
    id: string;
    clientName: string;
    spaceDetails: string;
    location: string;
    price: string;
    date: string;
    status: "Sent" | "Viewed" | "Accepted";
}

// --- Helper Functions ---
function numberToWords(num: number): string {
    const a = [
        "", "One ", "Two ", "Three ", "Four ", "Five ", "Six ", "Seven ", "Eight ", "Nine ", "Ten ",
        "Eleven ", "Twelve ", "Thirteen ", "Fourteen ", "Fifteen ", "Sixteen ", "Seventeen ", "Eighteen ", "Nineteen "
    ];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    if ((num = Math.floor(num)) === 0) return "Zero";

    const n = ("000000000" + num).substring(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return "";

    let str = "";
    str += n[1] !== "00" ? (a[Number(n[1])] || b[n[1][0] as any] + " " + a[n[1][1] as any]) + "Crore " : "";
    str += n[2] !== "00" ? (a[Number(n[2])] || b[n[2][0] as any] + " " + a[n[2][1] as any]) + "Lakh " : "";
    str += n[3] !== "00" ? (a[Number(n[3])] || b[n[3][0] as any] + " " + a[n[3][1] as any]) + "Thousand " : "";
    str += n[4] !== "0" ? (a[Number(n[4])] || b[n[4][0] as any] + " " + a[n[4][1] as any]) + "Hundred " : "";
    str += n[5] !== "00" ? ((str !== "") ? "and " : "") + (a[Number(n[5])] || b[n[5][0] as any] + " " + a[n[5][1] as any]) : "";

    return str.trim() + " Only";
}

function parseBaseRate(priceStr: string): number {
    const num = parseInt(priceStr.replace(/\D/g, ""));
    return isNaN(num) ? 500 : num;
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
    const [showPreview, setShowPreview] = useState(false);

    const statusStyles = {
        Sent: "bg-orange-50 text-orange-600 border-orange-100",
        Viewed: "bg-blue-50 text-blue-600 border-blue-100",
        Accepted: "bg-emerald-50 text-emerald-600 border-emerald-100",
    };

    const handleDownloadPDF = async () => {
        try {
            const doc = new jsPDF("p", "mm", "a4");

            // Define calculated values
            // We assume the specified `price` is the BASE rate, as GST is added on top.
            const baseRate = parseBaseRate(price);
            const cgst = baseRate * 0.09;
            const sgst = baseRate * 0.09;
            const totalAmount = baseRate + cgst + sgst;

            const formatAmount = (num: number) => num.toFixed(2);

            // ==========================================
            // HEADER SECTION
            // ==========================================

            // Try formatting logo: using /stirring-minds.png
            const loadImage = (url: string): Promise<HTMLImageElement> => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.crossOrigin = 'Anonymous';
                    img.onload = () => resolve(img);
                    img.onerror = (e) => reject(e);
                    img.src = url;
                });
            };

            try {
                const logo = await loadImage('/stirring-minds.png');
                const imgWidth = 60; // Max width
                const imgHeight = (logo.height * imgWidth) / logo.width;
                doc.addImage(logo, 'PNG', 15, 15, imgWidth, imgHeight);
            } catch (err) {
                console.warn("Could not load logo for PDF. Expected at /stirring-minds.png", err);
                doc.setFontSize(22);
                doc.setTextColor(0, 0, 0);
                doc.setFont("helvetica", "bold");
                doc.text("STIRRING MINDS", 15, 25);
            }

            // Company Info (Left)
            let currentY = 55;
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(0, 0, 0);
            doc.text("Stirring Minds (Jan 2026 in Use)", 15, currentY);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(60, 60, 60);
            currentY += 5;
            doc.text("2-A/3 Kundan Mansion Asaf Ali Road, New Delhi Delhi 110002", 15, currentY);
            currentY += 4;
            doc.text("India", 15, currentY);
            currentY += 4;
            doc.text("GSTIN 07AAYCS7042P1ZB", 15, currentY);
            currentY += 4;
            doc.text("CIN - U93090DL2017PTC318023", 15, currentY);

            // Title and Summary (Right)
            doc.setFontSize(26);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0, 0, 0);
            doc.text("TAX INVOICE", 195, 25, { align: "right" });

            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.text(`# ${id.replace("QT-", "INV-")}`, 195, 32, { align: "right" });

            // Balance box 
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text("Balance Due", 195, 45, { align: "right" });

            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            // use Rs. if supported
            doc.text(`Rs. ${formatAmount(totalAmount)}`, 195, 52, { align: "right" });

            // ==========================================
            // META DETAILS (Middle)
            // ==========================================
            currentY = 85;

            // Client details (Left)
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.text(clientName || "Client Name", 15, currentY);
            doc.setFont("helvetica", "normal");
            currentY += 5;
            doc.text("GSTIN: N/A", 15, currentY);

            currentY += 15;
            let supplyLoc = location && location.includes(",") ? location.split(",")[1].trim() : "Delhi";
            doc.text(`Place Of Supply: ${supplyLoc} (07)`, 15, currentY);

            // Invoice Dates (Right)
            let rightStartY = 75;
            doc.setFont("helvetica", "normal");
            doc.setTextColor(100, 100, 100);
            doc.text("Invoice Date :", 150, rightStartY, { align: "right" });
            doc.setTextColor(0, 0, 0);
            doc.text(date, 195, rightStartY, { align: "right" });

            rightStartY += 7;
            doc.setTextColor(100, 100, 100);
            doc.text("Terms :", 150, rightStartY, { align: "right" });
            doc.setTextColor(0, 0, 0);
            doc.text("Custom", 195, rightStartY, { align: "right" });

            rightStartY += 7;
            doc.setTextColor(100, 100, 100);
            doc.text("Due Date :", 150, rightStartY, { align: "right" });
            doc.setTextColor(0, 0, 0);
            doc.text(date, 195, rightStartY, { align: "right" });

            // ==========================================
            // TABLE SECTION
            // ==========================================
            currentY += 15;

            // Prepare table data
            const tableHead = [["#", "Description", "HSN/SAC", "Qty", "Rate", "CGST", "SGST", "Amount"]];
            const tableBody = [
                [
                    "1",
                    spaceDetails,
                    "998594",
                    "1.00\npcs", // new line for pcs
                    formatAmount(baseRate),
                    `${formatAmount(cgst)}\n  9%`,
                    `${formatAmount(sgst)}\n  9%`,
                    formatAmount(baseRate)
                ]
            ];

            autoTable(doc, {
                startY: currentY,
                head: tableHead,
                body: tableBody,
                theme: 'plain',
                headStyles: {
                    fillColor: [64, 64, 64], // Dark grey matching the image
                    textColor: [255, 255, 255],
                    fontStyle: 'normal',
                    fontSize: 9,
                    halign: 'right'
                },
                bodyStyles: {
                    fontSize: 9,
                    textColor: [0, 0, 0],
                    halign: 'right',
                    valign: 'top'
                },
                columnStyles: {
                    0: { halign: 'center', cellWidth: 15 }, // #
                    1: { halign: 'left', cellWidth: 50 },  // Description
                    2: { halign: 'right' }, // HSN
                    3: { halign: 'right' }, // Qty
                    4: { halign: 'right' }, // Rate
                    5: { halign: 'right' }, // CGST
                    6: { halign: 'right' }, // SGST
                    7: { halign: 'right' }, // Amount
                },
                didParseCell: function (data) {
                    if (data.section === 'head' && data.column.index === 1) {
                        data.cell.styles.halign = 'left';
                    }
                }
            });

            // ==========================================
            // TOTALS SECTION
            // ==========================================
            // @ts-ignore - autotable adds lastAutoTable to doc
            currentY = (doc as any).lastAutoTable.finalY + 2;

            // Draw line below table
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.5);
            doc.line(15, currentY, 195, currentY);

            currentY += 7;

            // Total Qty (Left)
            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            doc.text("1.00", 25, currentY);

            // SubTotals Box (Right)
            let sumY = currentY;

            const rightAlignedKey = (text: string, y: number, bold: boolean = false) => {
                const prev = doc.getFont();
                if (bold) doc.setFont("helvetica", "bold");
                doc.text(text, 160, y, { align: "right" });
                doc.setFont("helvetica", prev.fontStyle);
            };

            const rightAlignedVal = (text: string, y: number, bold: boolean = false) => {
                const prev = doc.getFont();
                if (bold) doc.setFont("helvetica", "bold");
                doc.text(text, 195, y, { align: "right" });
                doc.setFont("helvetica", prev.fontStyle);
            };

            rightAlignedKey("Sub Total", sumY);
            rightAlignedVal(formatAmount(baseRate), sumY);

            sumY += 8;
            rightAlignedKey("Total Taxable Amount", sumY);
            rightAlignedVal(formatAmount(baseRate), sumY);

            sumY += 8;
            rightAlignedKey("CGST9 (9%)", sumY);
            rightAlignedVal(formatAmount(cgst), sumY);

            sumY += 8;
            rightAlignedKey("SGST9 (9%)", sumY);
            rightAlignedVal(formatAmount(sgst), sumY);

            // Big line before totals
            sumY += 4;
            doc.line(120, sumY, 195, sumY);

            sumY += 7;
            rightAlignedKey("Total", sumY, true);
            rightAlignedVal(`Rs. ${formatAmount(totalAmount)}`, sumY, true);

            // Background highlight for Balance Due
            sumY += 4;
            doc.setFillColor(245, 245, 245);
            doc.rect(120, sumY, 80, 10, "F");

            sumY += 6.5; // adjust for text baseline
            rightAlignedKey("Balance Due", sumY, true);
            rightAlignedVal(`Rs. ${formatAmount(totalAmount)}`, sumY, true);

            // ==========================================
            // FOOTER & WORDS AMOUNT
            // ==========================================
            currentY = sumY + 15;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.text("Total In Words:", 120, currentY, { align: "right" });

            doc.setFont("helvetica", "bolditalic");

            const splitWords = doc.splitTextToSize(`Indian Rupee ${numberToWords(totalAmount)}`, 65);
            doc.text(splitWords, 125, currentY);

            // Bank Details at bottom
            currentY = 240;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(0, 0, 0);

            doc.text("Thanks for your business.", 15, currentY);

            currentY += 8;
            doc.setFont("helvetica", "bold");
            const bankDetailsLines = doc.splitTextToSize("Bank: HDFC Bank Account Name: Stirring Minds Services Pvt. Ltd IFSC Code: HDFC0004399 AC NO.: 50200025626726 Branch: Gagan Vihar, New Delhi UPI - stirringmindsbank@upi", 180);
            doc.text(bankDetailsLines, 15, currentY);

            currentY += 25;
            doc.setDrawColor(0, 0, 0);
            doc.line(15, currentY, 70, currentY);
            currentY += 5;
            doc.setFont("helvetica", "normal");
            doc.text("Authorised Signatory", 15, currentY);

            // Save PDF
            doc.save(`Invoice_${id.replace("QT-", "INV-")}.pdf`);
        } catch (error) {
            console.error("Failed to generate PDF:", error);
        }
    };

    return (
        <>
            {/* Preview Modal */}
            {showPreview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPreview(false)} />
                    <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div>
                                <p className="text-[11px] font-bold text-[#5bb09c] uppercase tracking-wider mb-1">{id}</p>
                                <h3 className="text-lg font-bold text-gray-900">{clientName}</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusStyles[status]}`}>{status}</span>
                                <button onClick={() => setShowPreview(false)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-2xl p-4 flex items-start gap-3">
                                    <div className="p-2 bg-[#5bb09c]/10 rounded-xl text-[#5bb09c] mt-0.5"><Building2 className="w-4 h-4" /></div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Space</p>
                                        <p className="text-sm font-semibold text-gray-800">{spaceDetails}</p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-2xl p-4 flex items-start gap-3">
                                    <div className="p-2 bg-[#5bb09c]/10 rounded-xl text-[#5bb09c] mt-0.5"><MapPin className="w-4 h-4" /></div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Location</p>
                                        <p className="text-sm font-semibold text-gray-800">{location}</p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-2xl p-4 flex items-start gap-3">
                                    <div className="p-2 bg-[#5bb09c]/10 rounded-xl text-[#5bb09c] mt-0.5"><Calendar className="w-4 h-4" /></div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Date</p>
                                        <p className="text-sm font-semibold text-gray-800">{date}</p>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-[#5bb09c]/10 to-[#5bb09c]/5 rounded-2xl p-4 flex items-start gap-3">
                                    <div className="p-2 bg-[#5bb09c]/20 rounded-xl text-[#5bb09c] mt-0.5"><DollarSign className="w-4 h-4" /></div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Total Price</p>
                                        <p className="text-lg font-black text-gray-900">{price}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex gap-3 p-6 pt-0">
                            <Button onClick={() => setShowPreview(false)} variant="outline" className="flex-1 h-11 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50">
                                Close
                            </Button>
                            <Button onClick={handleDownloadPDF} className="flex-1 h-11 rounded-xl bg-[#5bb09c] hover:bg-[#4a9b89] text-white gap-2">
                                <Download className="w-4 h-4" /> Download PDF
                            </Button>
                        </div>
                    </div>
                </div>
            )}

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
                            title="Preview"
                            className="h-8 w-8 text-gray-400 hover:text-[#5bb09c] hover:bg-teal-50 pt-0.5"
                            onClick={() => setShowPreview(true)}
                        >
                            <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            title="Share"
                            className="h-8 w-8 text-gray-400 hover:text-[#5bb09c] hover:bg-teal-50 pt-0.5"
                        >
                            <Share2 className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            title="Download PDF"
                            className="h-8 w-8 text-gray-400 hover:text-[#5bb09c] hover:bg-teal-50 pt-0.5"
                            onClick={handleDownloadPDF}
                        >
                            <Download className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default QuotationCard;
