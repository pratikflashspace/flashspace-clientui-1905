import React, { useState } from "react";
import { Share2, Download, Eye, X, Printer } from "lucide-react";
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
            {/* ===== INVOICE-PAPER STYLE PREVIEW MODAL ===== */}
            {showPreview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    {/* Modal Container - matches AffiliateInvoices exactly */}
                    <div className="bg-white w-full max-w-3xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                        {/* Sticky Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white sticky top-0 z-10 flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <h2 className="font-bold text-lg text-slate-800">{id}</h2>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusStyles[status]}`}>{status}</span>
                            </div>
                            <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-gray-100 rounded-full transition">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Scrollable Body — the "Paper" */}
                        <div className="overflow-y-auto flex-1 bg-white">
                            <div className="bg-white p-8 max-w-3xl mx-auto text-slate-800 font-sans">

                                {/* Header Row */}
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h1 className="text-2xl font-bold text-[#5bb09c] mb-1">FlashSpace</h1>
                                        <p className="text-sm text-gray-500 font-medium">Virtual Office Solutions</p>
                                        <div className="mt-3 text-xs text-gray-500 leading-relaxed">
                                            <p>123 Business Hub, Connaught Place</p>
                                            <p>New Delhi, Delhi 110001</p>
                                            <p>GSTIN: 07AABCT1234F1ZH</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex flex-col items-end gap-1">
                                            <h2 className="text-lg font-bold text-slate-900">Quotation</h2>
                                            <span className="text-sm font-mono text-[#5bb09c] font-bold">{id}</span>
                                        </div>
                                        <div className="mt-4 text-xs text-right space-y-1">
                                            <div className="flex justify-between gap-6">
                                                <span className="text-gray-500">Issue Date</span>
                                                <span className="font-semibold">{date}</span>
                                            </div>
                                            <div className="flex justify-between gap-6">
                                                <span className="text-gray-500">Valid Until</span>
                                                <span className="font-semibold">30 Days</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bill To */}
                                <div className="mb-8">
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Prepared For</p>
                                    <div className="text-sm text-slate-900">
                                        <p className="font-bold text-base">{clientName}</p>
                                        <p className="text-gray-500 mt-0.5">{location}</p>
                                    </div>
                                </div>

                                {/* Line Items Table */}
                                <div className="mb-8">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-gray-100">
                                                <th className="text-left py-3 px-3 font-semibold text-gray-600">Description</th>
                                                <th className="text-center py-3 px-3 font-semibold text-gray-600">Qty</th>
                                                <th className="text-right py-3 px-3 font-semibold text-gray-600">Rate</th>
                                                <th className="text-right py-3 px-3 font-semibold text-gray-600">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            <tr>
                                                <td className="py-3 px-3">
                                                    <p className="font-medium">{spaceDetails}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">{location}</p>
                                                </td>
                                                <td className="py-3 px-3 text-center">1</td>
                                                <td className="py-3 px-3 text-right">{price}</td>
                                                <td className="py-3 px-3 text-right font-medium">{price}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Totals & Notes */}
                                <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                                    {/* Notes / Terms */}
                                    <div className="flex-1 bg-gray-50 p-4 rounded-lg text-xs space-y-2">
                                        <p className="font-bold text-gray-700 mb-1">Payment Details</p>
                                        <div className="flex gap-2">
                                            <span className="text-gray-500 w-16">Bank:</span>
                                            <span className="font-medium">HDFC Bank</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="text-gray-500 w-16">Account:</span>
                                            <span className="font-medium">50200025626726</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="text-gray-500 w-16">IFSC:</span>
                                            <span className="font-medium">HDFC0004399</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="text-gray-500 w-16">UPI:</span>
                                            <span className="font-medium">stirringmindsbank@upi</span>
                                        </div>
                                    </div>

                                    {/* Calculations */}
                                    <div className="w-full md:w-64 space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Subtotal</span>
                                            <span>{price}</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>CGST (9%)</span>
                                            <span>Included</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>SGST (9%)</span>
                                            <span>Included</span>
                                        </div>
                                        <div className="border-t border-gray-200 my-2 pt-2 flex justify-between font-bold text-slate-900 text-lg">
                                            <span>Total</span>
                                            <span className="text-[#5bb09c]">{price}</span>
                                        </div>
                                        <div className="mt-2 bg-[#5bb09c]/10 p-3 rounded-lg flex justify-between items-center border border-[#5bb09c]/20">
                                            <span className="text-xs font-bold text-[#5bb09c]">Valid For</span>
                                            <span className="text-sm font-bold text-[#5bb09c]">30 Days</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Sticky Footer */}
                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center sticky bottom-0 z-10 flex-shrink-0">
                            <button className="flex items-center gap-2 text-gray-500 text-sm hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition">
                                <Share2 className="w-4 h-4" /> Share
                            </button>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleDownloadPDF}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 transition text-gray-700"
                                >
                                    <Printer className="w-4 h-4" /> Print
                                </button>
                                <button
                                    onClick={handleDownloadPDF}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#5bb09c] text-white rounded-lg text-sm font-medium hover:bg-[#4a9b89] shadow-sm hover:shadow transition"
                                >
                                    <Download className="w-4 h-4" /> Download PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow relative transition-all group">
                {/* Top Row: ID and Status Badge */}
                <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-medium text-gray-400">
                        {id}
                    </span>
                    <span
                        className={`text-[11px] font-bold px-3 py-1 rounded-full ${statusStyles[status]}`}
                    >
                        {status}
                    </span>
                </div>

                {/* Info Section */}
                <div className="mb-6">
                    <h4 className="font-bold text-[#1a1a1a] text-lg mb-1">
                        {clientName}
                    </h4>
                    <div className="text-sm text-gray-500 font-medium leading-relaxed">
                        {spaceDetails}
                        <br />
                        {location}
                    </div>
                </div>

                {/* Bottom Row: Price, Date, and Actions */}
                <div className="flex justify-between items-end">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold text-[#1a1a1a]">
                                {price}
                            </span>
                            <span className="text-xs text-gray-400">
                                {date}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            title="Share"
                            className="p-2 text-gray-400 hover:text-[#2d5a4c] hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            <Share2 className="w-5 h-5" />
                        </button>
                        <button
                            title="Download PDF"
                            className="p-2 text-gray-400 hover:text-[#2d5a4c] hover:bg-gray-50 rounded-lg transition-colors"
                            onClick={handleDownloadPDF}
                        >
                            <Download className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default QuotationCard;
