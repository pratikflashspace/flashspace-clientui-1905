import React, { useState, useEffect, useRef } from "react";
import {
    Search,
    Filter,
    Download,
    Eye,
    FileText,
    CheckCircle2,
    Clock,
    TrendingUp,
    ArrowUpRight,
    Printer,
    Share2,
    X,
    Loader2
} from "lucide-react";
import { affiliatePortalService, AffiliateInvoice } from "@/services/affiliatePortal.service";
import { format } from "date-fns";
import { generateInvoicePDF } from "@/utils/pdfGenerator";

// --- Types ---
interface InvoiceItem {
    desc: string;
    qty: number;
    rate: number;
    total: number;
}

// Reuse the type from service but keep it here for local ease if needed, 
// or just import and use AffiliateInvoice.
export type { AffiliateInvoice as LocalInvoice };

// INVOICE_DATA Removed - Fetching real data now

// --- Utilities ---
const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
    }).format(val);

// --- Sub-Components ---
const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
        paid: "bg-green-100 text-green-700 border-green-200",
        pending: "bg-amber-100 text-amber-700 border-amber-200",
        overdue: "bg-red-100 text-red-700 border-red-200",
        cancelled: "bg-gray-100 text-gray-700 border-gray-200",
    };
    const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);
    return (
        <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status.toLowerCase()] ||
                "bg-gray-100 text-gray-600"
                }`}
        >
            {displayStatus}
        </span>
    );
};

// --- Main Invoice View Component (The "Paper" design) ---
const InvoicePaper = ({ data }: { data: AffiliateInvoice }) => {
    const subtotal = data.amount;
    const tax = subtotal * 0.09; // Mock 9% CGST + 9% SGST breakdown
    const formattedDate = format(new Date(data.date), "MMM dd, yyyy");
    const formattedDueDate = data.date ? format(new Date(new Date(data.date).getTime() + 30 * 24 * 60 * 60 * 1000), "MMM dd, yyyy") : "N/A";

    return (
        <div className="bg-white p-8 max-w-3xl mx-auto text-slate-800 font-sans print-container h-full">
            {/* Header Row */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 style={{ fontFamily: "'Inter', sans-serif" }} className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        FlashSpace
                    </h1>
                    <p className="text-sm text-gray-500 font-medium">
                        Virtual Office Solutions
                    </p>
                    <div className="mt-3 text-xs text-gray-500 leading-relaxed">
                        <p>123 Business Hub, Bandra Kurla Complex</p>
                        <p>Mumbai, Maharashtra 400051</p>
                        <p>GSTIN: 27AABCT1234F1ZH</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex flex-col items-end gap-1">
                        <h2 style={{ fontFamily: "'Inter', sans-serif" }} className="text-lg font-bold text-slate-900">
                            Invoice {data.invoiceNumber}
                        </h2>
                        <StatusBadge status={data.status} />
                    </div>
                    <div className="mt-4 text-xs text-right space-y-1">
                        <div className="flex justify-between gap-4">
                            <span className="text-gray-500">Invoice Date</span>
                            <span className="font-semibold">{formattedDate}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-gray-500">Due Date</span>
                            <span className="font-semibold">
                                {formattedDueDate}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bill To */}
            <div className="mb-8">
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">
                    Bill To
                </p>
                <div className="text-sm text-slate-900">
                    <p className="font-bold text-sm">{data.client}</p>
                    {data.clientAddress.map((line, i) => (
                        <p key={i}>{line}</p>
                    ))}
                    <p className="mt-1 text-gray-500 text-xs">
                        GSTIN: {data.clientGstin}
                    </p>
                </div>
            </div>

            {/* Table */}
            <div className="mb-8">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="text-left py-3 px-2 font-semibold text-gray-600">
                                Description
                            </th>
                            <th className="text-center py-3 px-2 font-semibold text-gray-600">
                                Qty
                            </th>
                            <th className="text-right py-3 px-2 font-semibold text-gray-600">
                                Rate
                            </th>
                            <th className="text-right py-3 px-2 font-semibold text-gray-600">
                                Total
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.items.map((item, idx) => (
                            <tr key={idx}>
                                <td className="py-3 px-2">{item.desc}</td>
                                <td className="py-3 px-2 text-center">
                                    {item.qty}
                                </td>
                                <td className="py-3 px-2 text-right">
                                    {formatCurrency(item.rate)}
                                </td>
                                <td className="py-3 px-2 text-right font-medium">
                                    {formatCurrency(item.total)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals & Bank Info */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                {/* Bank Details */}
                <div className="flex-1 bg-gray-50 p-4 rounded-lg text-xs space-y-2">
                    <p className="font-bold text-gray-700 mb-1">
                        Payment Details
                    </p>
                    <div className="flex gap-2">
                        <span className="text-gray-500 w-16">Bank:</span>
                        <span className="font-medium">HDFC Bank</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="text-gray-500 w-16">Account:</span>
                        <span className="font-medium">50200012345678</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="text-gray-500 w-16">IFSC:</span>
                        <span className="font-medium">HDFC0001234</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="text-gray-500 w-16">UPI:</span>
                        <span className="font-medium">flashspace@hdfcbank</span>
                    </div>
                </div>

                {/* Calculations */}
                <div className="w-full md:w-64 space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>CGST (9%)</span>
                        <span>{formatCurrency(tax)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>SGST (9%)</span>
                        <span>{formatCurrency(tax)}</span>
                    </div>
                    <div className="border-t border-gray-200 my-2 pt-2 flex justify-between font-bold text-slate-900 text-lg">
                        <span>Total</span>
                        <span className="text-[#5aa39c]">
                            {formatCurrency(subtotal)}
                        </span>
                    </div>

                    {/* Commission Highlight */}
                    <div className="mt-4 bg-green-50 p-3 rounded-lg flex justify-between items-center border border-green-100">
                        <span className="text-xs font-bold text-green-700">
                            Your Commission
                        </span>
                        <span className="text-sm font-bold text-green-700">
                            {formatCurrency(data.commission)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Page Component ---
const Invoices = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [invoices, setInvoices] = useState<AffiliateInvoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState<AffiliateInvoice | null>(
        null,
    );
    const [printInvoiceData, setPrintInvoiceData] = useState<AffiliateInvoice | null>(
        null,
    );
    const [showFilter, setShowFilter] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string[]>([]);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                setLoading(true);
                const response = await affiliatePortalService.getInvoices();
                if (response.success && response.data) {
                    setInvoices(response.data.invoices);
                }
            } catch (error) {
                console.error("Failed to fetch invoices:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInvoices();
    }, []);

    // Filter Logic
    const filteredData = invoices.filter((item) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
            item.client.toLowerCase().includes(query) ||
            item.invoiceNumber.toLowerCase().includes(query);

        const matchesStatus =
            statusFilter.length === 0 || statusFilter.includes(item.status.toLowerCase());

        return matchesSearch && matchesStatus;
    });

    // Print / Download Handler
    const handleDownload = async (invoice: AffiliateInvoice) => {
        try {
            await generateInvoicePDF(invoice, "download");
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    return (
 <div className="min-h-screen p-4 md:p-6 lg:p-8 w-full bg-[#FAFAF7] font-sans relative">
            {/* --- HIDDEN PRINT AREA --- 
          This is what will be printed. It is hidden from screen but visible to print.
      */}
            {printInvoiceData && (
                <div className="print-only-container">
                    <InvoicePaper data={printInvoiceData} />
                </div>
            )}

            {/* --- NORMAL SCREEN CONTENT (Hidden during print via CSS) --- */}
            <div className="max-w-7xl mx-auto space-y-8 no-print">
                <div className="space-y-1">
                    <h1 style={{ fontFamily: "'Inter', sans-serif" }} className="text-3xl font-extrabold tracking-tight">
                        <span className="text-[#1A1A1A]">Affiliate </span>
                        <span className="text-[#36503F] italic">Invoices</span>
                    </h1>
                    <p className="text-sm md:text-base text-[#6B8F78] font-medium">
                        View and download invoices for your referred bookings
                    </p>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-[#D4E0D0] shadow-[rgba(23,34,38,0.08)_0px_4px_24px_-4px]">
                    <div className="relative flex-1 w-full sm:max-w-md">
                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B8F78]"
                        />
                        <input
                            type="text"
                            placeholder="Search by ID or Client..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white rounded-lg border border-[#D4E0D0] focus:outline-none focus:border-[#36503F] focus:ring-0 text-sm font-medium transition-all"
                        />
                    </div>

                    <div className="flex gap-3 w-full sm:w-auto relative">
                        {/* Filter Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowFilter(!showFilter)}
                                className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-semibold transition ${statusFilter.length > 0
                                    ? "bg-[#F0F4EE] text-[#36503F] border-[#36503F]"
                                    : "bg-white text-[#6B8F78] border-[#D4E0D0] hover:bg-[#F0F4EE]"
                                    }`}
                            >
                                <Filter size={16} /> Filter{" "}
                                {statusFilter.length > 0 &&
                                    `(${statusFilter.length})`}
                            </button>

                            {showFilter && (
                                <div className="absolute right-0 top-12 w-48 bg-white border border-[#D4E0D0] rounded-xl shadow-xl p-3 z-30">
                                    <p className="text-sm font-bold text-[#6B8F78] mb-2">
                                        Status
                                    </p>
                                    {["paid", "pending", "overdue", "cancelled"].map(
                                        (status) => (
                                            <label
                                                key={status}
                                                className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer p-1.5 hover:bg-[#F0F4EE] rounded"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={statusFilter.includes(
                                                        status,
                                                    )}
                                                    onChange={() =>
                                                        setStatusFilter(
                                                            (prev) =>
                                                                prev.includes(
                                                                    status,
                                                                )
                                                                    ? prev.filter(
                                                                        (s) =>
                                                                            s !==
                                                                            status,
                                                                    )
                                                                    : [
                                                                        ...prev,
                                                                        status,
                                                                    ],
                                                        )
                                                    }
                                                    className="rounded text-[#5aa39c] focus:ring-[#5aa39c]"
                                                />
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </label>
                                        ),
                                    )}
                                </div>
                            )}
                        </div>

                        <button className="inline-flex items-center justify-center gap-2 bg-[#F0F4EE] text-[#36503F] hover:bg-[#D4E0D0] rounded-lg h-10 px-4 text-sm font-bold border border-[#D4E0D0] transition-all">
                            <Download size={16} /> Export CSV
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-[#D4E0D0] shadow-[rgba(23,34,38,0.08)_0px_4px_24px_-4px] overflow-hidden">
                    <div className="overflow-x-auto min-h-[400px]">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-24 gap-3">
                                <Loader2 className="w-10 h-10 text-[#36503F] animate-spin" />
                                <p className="text-[#6B8F78] font-medium">Loading invoices...</p>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#FAFAF7] border-b border-[#D4E0D0]">
                                        {[
                                            "Invoice ID",
                                            "Client",
                                            "Amount",
                                            "Commission",
                                            "Date",
                                            "Status",
                                            "Actions",
                                        ].map((h) => (
                                            <th
                                                key={h}
                                                className="px-6 py-5 text-sm font-bold text-[#6B8F78] tracking-wider whitespace-nowrap"
                                            >
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200/60">
                                    {filteredData.length > 0 ? (
                                        filteredData.map((inv) => (
                                            <tr
                                                key={inv._id}
                                                className="group hover:bg-[#fafafa] transition-colors"
                                            >
                                                <td className="px-6 py-4 text-sm font-medium text-slate-900 whitespace-nowrap font-mono">
                                                    {inv.invoiceNumber}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 font-medium whitespace-nowrap">
                                                    {inv.client}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-slate-900">
                                                    {formatCurrency(inv.amount)}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-[#5aa39c]">
                                                    {formatCurrency(inv.commission)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {format(new Date(inv.date), "MMM dd, yyyy")}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <StatusBadge
                                                        status={inv.status}
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() =>
                                                                setSelectedInvoice(
                                                                    inv,
                                                                )
                                                            }
                                                            className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#F0F4EE] text-[#36503F] hover:bg-[#36503F] hover:text-[#fef8c5] transition-all border border-[#D4E0D0]"
                                                            title="View Details"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDownload(inv)
                                                            }
                                                            className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#F0F4EE] text-[#36503F] hover:bg-[#36503F] hover:text-[#fef8c5] transition-all border border-[#D4E0D0]"
                                                            title="Download/Print PDF"
                                                        >
                                                            <Download size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="px-6 py-12 text-center text-gray-400"
                                            >
                                                <p>
                                                    No invoices found matching
                                                    criteria.
                                                </p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* --- MODAL (The "Eye" Popup) --- */}
            {selectedInvoice && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in no-print">
                    {/* Modal Container */}
                    <div className="bg-white w-full max-w-3xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col animate-scale-up relative overflow-hidden">
                        {/* Modal Header (Sticky) */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
                            <div className="flex items-center gap-3">
                                <h2 style={{ fontFamily: "'Inter', sans-serif" }} className="text-lg font-bold text-slate-800">
                                    {selectedInvoice.invoiceNumber}
                                </h2>
                                <StatusBadge status={selectedInvoice.status} />
                            </div>
                            <button
                                onClick={() => setSelectedInvoice(null)}
                                className="p-2 hover:bg-gray-100 rounded-full transition"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Modal Body (Scrollable) */}
                        <div className="overflow-y-auto flex-1 bg-white custom-scrollbar" data-lenis-prevent>
                            {/* Reuse the InvoicePaper component for visual consistency */}
                            <InvoicePaper data={selectedInvoice} />
                        </div>

                        {/* Modal Footer (Sticky) */}
                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center sticky bottom-0 z-10">
                            <button className="flex items-center gap-2 text-gray-500 text-sm hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition">
                                <Share2 size={16} /> Share
                            </button>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleDownload(selectedInvoice)}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 transition text-gray-700"
                                >
                                    <Printer size={16} /> Print
                                </button>
                                <button
                                    onClick={() => handleDownload(selectedInvoice)}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#5aa39c] text-white rounded-lg text-sm font-medium hover:bg-[#4a8b85] shadow-sm hover:shadow transition"
                                >
                                    <Download size={16} /> Download PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- CSS Animations & Print Styles --- */}
            <style>{`
        /* Print Logic */
        .print-only-container { display: none; }
        
        @media print {
            /* Hide everything on the screen */
            body * { visibility: hidden; }
            .no-print { display: none !important; }
            
            /* Show only the print container */
            .print-only-container, .print-only-container * {
                visibility: visible;
                display: block;
            }
            .print-only-container {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                margin: 0;
                padding: 0;
                background: white;
            }
            /* Clean up print style */
            @page { margin: 10mm; size: auto; }
        }
      `}</style>
        </div>
    );
};

export default Invoices;
