import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { Invoice } from "@/types/services";

/**
 * Utility function to generate a well-formatted PDF invoice
 * based on the provided schema and best practices.
 */
export const generateInvoicePDF = (invoice: Invoice) => {
    const doc = new jsPDF();
    const primaryColor: [number, number, number] = [53, 80, 63]; // Flashspace Green (#35503F)
    const secondaryColor: [number, number, number] = [234, 179, 8]; // Flashspace Yellow (#eab308)
    const textColor: [number, number, number] = [51, 65, 85]; // Slate 700
    const lightGray: [number, number, number] = [241, 245, 249]; // Slate 100

    // Optional: Replace this with the actual base64 logo string if you want a local image logo
    // doc.addImage(logoData, 'PNG', 15, 15, 40, 40);

    // Headers & Brand
    doc.setFontSize(28);
    doc.setTextColor(...primaryColor);
    doc.setFont("helvetica", "bold");
    doc.text("flashspace", 14, 25);

    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    doc.setFont("helvetica", "normal");
    doc.text("Workspace provider solutions", 14, 32);
    doc.text("Support: support@flashspace.co | +91 8100 888 777", 14, 38);

    // Inv title
    doc.setFontSize(36);
    doc.setTextColor(200, 200, 200);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 140, 30);

    // Divider
    doc.setDrawColor(220, 220, 220);
    doc.line(14, 45, 196, 45);

    // Invoice Meta Left
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Bill To:", 14, 55);
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.setFont("helvetica", "bold");
    doc.text(invoice.user?.name || invoice.user?.fullName || "Valued Client", 14, 62);
    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    doc.setFont("helvetica", "normal");
    doc.text(invoice.user?.email || "", 14, 67);
    doc.text(invoice.user?.phoneNumber || "", 14, 72);

    // Invoice Meta Right
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Invoice Number:", 130, 55);
    doc.setTextColor(...textColor);
    doc.setFont("helvetica", "bold");
    doc.text(invoice.invoiceNumber || "N/A", 170, 55);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Date:", 130, 62);
    doc.setTextColor(...textColor);
    doc.text(format(new Date(invoice.createdAt || new Date()), "MMM dd, yyyy"), 170, 62);

    doc.setTextColor(100, 100, 100);
    doc.text("Status:", 130, 69);
    const statusStr = (invoice.status || "pending").toUpperCase();
    if (statusStr === "PAID") doc.setTextColor(22, 163, 74); // Green
    else if (statusStr === "PENDING") doc.setTextColor(202, 138, 4); // Yellow
    else doc.setTextColor(220, 38, 38); // Red
    doc.setFont("helvetica", "bold");
    doc.text(statusStr, 170, 69);

    // Create Table Data
    let tableData = [];

    // Checking if there are custom line items, otherwise construct from description and totals
    if (invoice.lineItems && invoice.lineItems.length > 0) {
        tableData = invoice.lineItems.map(item => [
            item.description,
            item.quantity || 1,
            `Rs. ${(item.rate || 0).toLocaleString()}`,
            `Rs. ${(item.amount || 0).toLocaleString()}`
        ]);
    } else {
        tableData = [
            [
                invoice.description || "Workspace Service Booking",
                "1",
                `Rs. ${(invoice.subtotal || 0).toLocaleString()}`,
                `Rs. ${(invoice.subtotal || 0).toLocaleString()}`
            ]
        ];
    }

    // Draw Table
    autoTable(doc, {
        startY: 85,
        head: [["Description", "Qty", "Rate", "Amount"]],
        body: tableData,
        theme: "plain",
        headStyles: {
            fillColor: lightGray,
            textColor: primaryColor,
            fontStyle: "bold",
        },
        styles: {
            cellPadding: 6,
            fontSize: 10,
            textColor: textColor,
        },
        didDrawCell: function (data) {
            if (data.row.section === "body" && data.column.index === 0) {
                doc.setDrawColor(240, 240, 240);
                const startX = data.cell.x;
                const endX = doc.internal.pageSize.width - 14; // Using right margin 14
                doc.line(
                    startX,
                    data.cell.y + data.cell.height,
                    endX,
                    data.cell.y + data.cell.height
                );
            }
        }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;

    // Invoice Summary Section (Bottom Right)
    const summaryX = 130;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");

    // Subtotal
    doc.text("Subtotal:", summaryX, finalY);
    doc.setTextColor(...textColor);
    doc.text(`Rs. ${(invoice.subtotal || 0).toLocaleString()}`, 170, finalY);

    // Tax Rate
    doc.setTextColor(100, 100, 100);
    doc.text(`Tax Rate:`, summaryX, finalY + 7);
    doc.setTextColor(...textColor);
    doc.text(`${invoice.taxRate || 0}%`, 170, finalY + 7);

    // Tax Amount
    doc.setTextColor(100, 100, 100);
    doc.text(`Tax Amount:`, summaryX, finalY + 14);
    doc.setTextColor(...textColor);
    doc.text(`Rs. ${(invoice.taxAmount || 0).toLocaleString()}`, 170, finalY + 14);

    // Grand Total Background
    doc.setFillColor(...primaryColor);
    doc.roundedRect(summaryX - 5, finalY + 19, 80, 12, 2, 2, 'F');

    // Grand Total Text
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text("Total:", summaryX, finalY + 27);
    doc.text(`Rs. ${(invoice.total || 0).toLocaleString()}`, 170, finalY + 27);

    // Footer 
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150, 150, 150);
    doc.text("This is a computer generated invoice and does not require a signature.", 14, pageHeight - 15);

    // Save the PDF
    const filename = invoice.invoiceNumber ? `invoice_${invoice.invoiceNumber}.pdf` : `invoice_${invoice._id}.pdf`;
    doc.save(filename);
};
