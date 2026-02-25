import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { Invoice } from "@/types/services";
import { AffiliateInvoice } from "@/services/affiliatePortal.service";

// Define a type extension for jsPDF to include autoTable methods and properties
interface jsPDFWithAutoTable extends jsPDF {
    lastAutoTable?: {
        finalY: number;
    };
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

/**
 * Utility function to generate a well-formatted PDF invoice
 * based on the Stirring Minds TAX INVOICE format.
 * Dynamically handles both Dashboard `Invoice` and `AffiliateInvoice` objects.
 */
export const generateInvoicePDF = async (
    invoice: Invoice | AffiliateInvoice,
    action: "download" | "preview" = "download"
): Promise<string | void> => {
    try {
        const doc = new jsPDF("p", "mm", "a4");

        // Type guard properties to safely extract data from either shape
        const isAffiliateInvoice = 'amount' in invoice;

        // Extract shared or varying properties safely
        const invoiceId = invoice.invoiceNumber || (invoice as any)._id || "N/A";
        const clientName = isAffiliateInvoice
            ? (invoice as AffiliateInvoice).client
            : (invoice as Invoice).user?.name || (invoice as Invoice).user?.fullName || "Valued Client";

        // Use provided subject or default
        const subject = isAffiliateInvoice ? "Affiliate Booking Commission" : ((invoice as Invoice).description || "Workspace Services");

        // Dates
        const invoiceDate = isAffiliateInvoice
            ? format(new Date((invoice as AffiliateInvoice).date), "dd/MM/yy")
            : format(new Date((invoice as Invoice).createdAt || new Date()), "dd/MM/yy");

        // Financial extraction 
        const baseRate = isAffiliateInvoice
            ? (invoice as AffiliateInvoice).amount
            : (invoice as Invoice).subtotal || (invoice as Invoice).total || 0;

        // Calculate splits (Assuming standard pricing includes GST or we calculate on top)
        // Adjust these logic checks as needed; currently mocking 9% splits off base
        const cgst = baseRate * 0.09;
        const sgst = baseRate * 0.09;
        const totalAmount = baseRate + cgst + sgst;

        const formatAmount = (num: number) => num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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
        doc.text(`# INV-${invoiceId.replace("INV-", "").replace("QT-", "")}`, 195, 32, { align: "right" });

        // Balance box 
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Balance Due", 195, 45, { align: "right" });

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
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
        doc.text(`Place Of Supply: Delhi (07)`, 15, currentY); // Custom logic for location if needed

        currentY += 10;
        doc.text("Subject :", 15, currentY);
        currentY += 5;
        doc.text(subject, 15, currentY);

        // Invoice Dates (Right)
        let rightStartY = 85;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        doc.text("Invoice Date :", 150, rightStartY, { align: "right" });
        doc.setTextColor(0, 0, 0);
        doc.text(invoiceDate, 195, rightStartY, { align: "right" });

        rightStartY += 7;
        doc.setTextColor(100, 100, 100);
        doc.text("Terms :", 150, rightStartY, { align: "right" });
        doc.setTextColor(0, 0, 0);
        doc.text("Due on Receipt", 195, rightStartY, { align: "right" });

        rightStartY += 7;
        doc.setTextColor(100, 100, 100);
        doc.text("Due Date :", 150, rightStartY, { align: "right" });
        doc.setTextColor(0, 0, 0);
        doc.text(invoiceDate, 195, rightStartY, { align: "right" });

        rightStartY += 7;
        doc.setTextColor(100, 100, 100);
        doc.text("Sales person :", 150, rightStartY, { align: "right" });
        doc.setTextColor(0, 0, 0);
        doc.text("Rahul Rathore", 195, rightStartY, { align: "right" }); // Defaulting to Rahul as per ref

        // ==========================================
        // TABLE SECTION
        // ==========================================
        currentY += 15;

        // Prepare table data
        const tableHead = [["#", "Description", "HSN/SAC", "Qty", "Rate", "CGST", "SGST", "Amount"]];
        let tableBody: any[][] = [];

        // Build Rows from either Invoice Type
        if (!isAffiliateInvoice && (invoice as Invoice).lineItems && (invoice as Invoice).lineItems!.length > 0) {
            (invoice as Invoice).lineItems!.forEach((item, index) => {
                const lBase = item.amount || item.rate || 0;
                const lCgst = lBase * 0.09;
                const lSgst = lBase * 0.09;
                tableBody.push([
                    (index + 1).toString(),
                    item.description,
                    "998599", // mock SAC
                    (item.quantity || 1).toFixed(2),
                    formatAmount(lBase),
                    `${formatAmount(lCgst)}\n  9%`,
                    `${formatAmount(lSgst)}\n  9%`,
                    formatAmount(lBase)
                ]);
            });
        } else {
            // Fallback to single primary row
            tableBody.push([
                "1",
                subject,
                "998599",
                "1.00",
                formatAmount(baseRate),
                `${formatAmount(cgst)}\n  9%`,
                `${formatAmount(sgst)}\n  9%`,
                formatAmount(baseRate)
            ]);
        }


        // @ts-ignore - plugin
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
            didParseCell: function (data: any) {
                if (data.section === 'head' && data.column.index === 1) {
                    data.cell.styles.halign = 'left';
                }
            }
        });

        // ==========================================
        // TOTALS SECTION
        // ==========================================
        currentY = (doc as any).lastAutoTable.finalY + 2;

        // Draw line below table
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.line(15, currentY, 195, currentY);

        currentY += 7;

        // Total Qty (Left)
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");

        let totalQty = "1.00";
        if (!isAffiliateInvoice && (invoice as Invoice).lineItems) {
            const sum = (invoice as Invoice).lineItems!.reduce((acc, curr) => acc + (curr.quantity || 1), 0);
            totalQty = sum.toFixed(2);
        }
        doc.text(totalQty, 25, currentY);

        // SubTotals Box (Right)
        let sumY = currentY;

        const rightAlignedKey = (text: string, y: number, bold: boolean = false, color: number[] = [0, 0, 0]) => {
            const prev = doc.getFont();
            if (bold) doc.setFont("helvetica", "bold");
            doc.setTextColor(color[0], color[1], color[2]);
            doc.text(text, 160, y, { align: "right" });
            doc.setFont("helvetica", prev.fontStyle);
            doc.setTextColor(0, 0, 0); // Reset
        };

        const rightAlignedVal = (text: string, y: number, bold: boolean = false, color: number[] = [0, 0, 0]) => {
            const prev = doc.getFont();
            if (bold) doc.setFont("helvetica", "bold");
            doc.setTextColor(color[0], color[1], color[2]);
            doc.text(text, 195, y, { align: "right" });
            doc.setFont("helvetica", prev.fontStyle);
            doc.setTextColor(0, 0, 0); // Reset
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

        // Payments Mock Logic - for the sake of layout matching the request screenshot
        sumY += 8;
        rightAlignedKey("Payment Made", sumY, false, [220, 38, 38]);
        rightAlignedVal(`(-) 0.00`, sumY, false, [220, 38, 38]);

        sumY += 8;
        rightAlignedKey("Amount Withheld", sumY, false, [220, 38, 38]);
        rightAlignedVal(`(-) 0.00`, sumY, false, [220, 38, 38]);

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
        currentY = doc.internal.pageSize.height - 50;
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

        // "POWERED BY flashspace" layout at absolute bottom
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text("POWERED BY", 15, doc.internal.pageSize.height - 10);

        doc.setTextColor(53, 80, 63); // Flashspace Green
        doc.setFont("helvetica", "bold");
        doc.text("flashspace", 40, doc.internal.pageSize.height - 10);

        // Output based on action
        if (action === "preview") {
            return doc.output('bloburl').toString();
        } else {
            const filename = `Invoice_${invoiceId.replace("INV-", "").replace("QT-", "")}.pdf`;
            doc.save(filename);
        }
    } catch (error) {
        console.error("Failed to generate PDF:", error);
    }
};
