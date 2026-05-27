import React, { useState, useEffect } from "react";
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
} from "lucide-react";

// --- Types ---
interface InvoiceItem {
    desc: string;
    qty: number;
    rate: number;
    total: number;
}

interface Invoice {
    id: string;
    client: string;
    clientAddress: string[];
    clientGstin: string;
    amount: number;
    commission: number;
    date: string;
    dueDate: string;
    status: "Paid" | "Pending" | "Overdue";
    items: InvoiceItem[];
}

// --- Mock Data (Expanded to match Image) ---
const INVOICE_DATA: Invoice[] = [
    {
        id: "INV-2024-001",
        client: "TechStart Solutions",
        clientAddress: ["456 Tech Park, Sector 5", "Noida, UP 201301"],
        clientGstin: "09AABCT5678F1ZK",
        amount: 15000,
        commission: 1500,
        date: "Jan 15, 2024",
        dueDate: "Feb 15, 2024",
        status: "Paid",
        items: [
            {
                desc: "Virtual Office Premium - Monthly",
                qty: 1,
                rate: 12000,
                total: 12000,
            },
            {
                desc: "GST Registration Support",
                qty: 1,
                rate: 2000,
                total: 2000,
            },
            { desc: "Mail Handling Fee", qty: 1, rate: 1000, total: 1000 },
        ],
    },
    {
        id: "INV-2024-002",
        client: "Creative Hub Co",
        clientAddress: ["789 Design Ave", "Bangalore, KA 560001"],
        clientGstin: "29ABCDE1234F1Z5",
        amount: 28000,
        commission: 2800,
        date: "Jan 18, 2024",
        dueDate: "Feb 18, 2024",
        status: "Paid",
        items: [
            {
                desc: "Dedicated Desk - Monthly",
                qty: 2,
                rate: 14000,
                total: 28000,
            },
        ],
    },
    {
        id: "INV-2024-003",
        client: "DataFlow Analytics",
        clientAddress: ["101 Data Drive", "Hyderabad, TS 500081"],
        clientGstin: "36XYZZZ9876F1Z9",
        amount: 45000,
        commission: 4500,
        date: "Jan 22, 2024",
        dueDate: "Feb 22, 2024",
        status: "Pending",
        items: [
            {
                desc: "Private Cabin (4 Seater)",
                qty: 1,
                rate: 45000,
                total: 45000,
            },
        ],
    },
    {
        id: "INV-2024-004",
        client: "GreenTech Innovations",
        clientAddress: ["Eco Park, Unit 4", "Pune, MH 411057"],
        clientGstin: "27PQRS5678F1Z2",
        amount: 32000,
        commission: 3200,
        date: "Jan 25, 2024",
        dueDate: "Feb 25, 2024",
        status: "Pending",
        items: [
            {
                desc: "Virtual Office Premium",
                qty: 2,
                rate: 12000,
                total: 24000,
            },
            {
                desc: "Conference Room Credits",
                qty: 8,
                rate: 1000,
                total: 8000,
            },
        ],
    },
    {
        id: "INV-2024-005",
        client: "StartupNest",
        clientAddress: ["Incubation Cell", "Mumbai, MH 400001"],
        clientGstin: "27AAAAA0000A1Z5",
        amount: 18500,
        commission: 1850,
        date: "Jan 28, 2024",
        dueDate: "Feb 28, 2024",
        status: "Overdue",
        items: [
            { desc: "Hot Desk - Monthly", qty: 3, rate: 5000, total: 15000 },
            { desc: "Locker Facility", qty: 3, rate: 500, total: 1500 },
            { desc: "Mail Handling", qty: 2, rate: 1000, total: 2000 },
        ],
    },
];

// --- Utilities ---
const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
    }).format(val);

// --- Sub-Components ---
const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
        Paid: "bg-green-100 text-green-700 border-green-200",
        Pending: "bg-amber-100 text-amber-700 border-amber-200",
        Overdue: "bg-red-100 text-red-700 border-red-200",
    };
    return (
        <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status as keyof typeof styles] ||
                "bg-gray-100 text-gray-600"
                }`}
        >
            {status}
        </span>
    );
};

// --- Main Invoice View Component (The "Paper" design) ---
const InvoicePaper = ({ data }: { data: Invoice }) => {
    const subtotal = data.amount;
    const tax = subtotal * 0.09; // Mock 9% CGST + 9% SGST breakdown

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
                            Invoice {data.id}
                        </h2>
                        <StatusBadge status={data.status} />
                    </div>
                    <div className="mt-4 text-xs text-right space-y-1">
                        <div className="flex justify-between gap-4">
                            <span className="text-gray-500">Invoice Date</span>
                            <span className="font-semibold">{data.date}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-gray-500">Due Date</span>
                            <span className="font-semibold">
                                {data.dueDate}
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
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(
        null,
    );
    const [printInvoiceData, setPrintInvoiceData] = useState<Invoice | null>(
        null,
    );
    const [showFilter, setShowFilter] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string[]>([]);

    // Filter Logic
    const filteredData = INVOICE_DATA.filter((item) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
            item.client.toLowerCase().includes(query) ||
            item.id.toLowerCase().includes(query);

        const matchesStatus =
            statusFilter.length === 0 || statusFilter.includes(item.status);

        return matchesSearch && matchesStatus;
    });

    // Print Handler
    const handlePrint = (invoice: Invoice) => {
        // 1. Set the specific invoice to be printed into a hidden state/view
        setPrintInvoiceData(invoice);
        // 2. Wait for state update then trigger print
        setTimeout(() => {
            window.print();
            // 3. Clear print data after printing to return to normal view if needed
            // (Optional, but keeping it ensures normal render isn't affected)
            setPrintInvoiceData(null);
        }, 100);
    };

    return (
 <div className="min-h-screen p-4 md:p-6 lg:p-8 bg-[#f7f7f6] font-sans w-full relative"> 
            {/* --- HIDDEN PRINT AREA --- 
          This is what will be printed. It is hidden from screen but visible to print.
      */}
            {printInvoiceData && (
                <div className="print-only-container">
                    <InvoicePaper data={printInvoiceData} />
                </div>
            )}

            {/* --- NORMAL SCREEN CONTENT (Hidden during print via CSS) --- */}
            <div className="w-full space-y-8 no-print animate-slide-up">
                {/* Header */}
                <div>
                    <h1 style={{ fontFamily: "'Inter', sans-serif" }} className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Invoices
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Manage your commission payouts
                    </p>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#f8f8f8] p-4 rounded-xl border-2 border-[#f1f2ed] shadow">
                    <div className="relative flex-1 w-full sm:max-w-md">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search by ID or Client..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5aa39c]/20 focus:border-[#5aa39c] transition-all text-sm"
                        />
                    </div>

                    <div className="flex gap-3 w-full sm:w-auto relative">
                        {/* Filter Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowFilter(!showFilter)}
                                className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-semibold transition ${statusFilter.length > 0
                                    ? "bg-[#5aa39c]/10 text-[#5aa39c] border-[#5aa39c]"
                                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                                    }`}
                            >
                                <Filter size={16} /> Filter{" "}
                                {statusFilter.length > 0 &&
                                    `(${statusFilter.length})`}
                            </button>

                            {showFilter && (
                                <div className="absolute right-0 top-12 w-48 bg-white border border-gray-200 rounded-xl shadow-xl p-3 z-30 animate-fade-in-up">
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">
                                        Status
                                    </p>
                                    {["Paid", "Pending", "Overdue"].map(
                                        (status) => (
                                            <label
                                                key={status}
                                                className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer p-1.5 hover:bg-gray-50 rounded"
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
                                                {status}
                                            </label>
                                        ),
                                    )}
                                </div>
                            )}
                        </div>

                        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50">
                            <Download size={16} /> Export CSV
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-[#f8f8f8] rounded-2xl border-[3px] border-[#f1f2ed] shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#f6f6f4] border-b-[3px] border-[#f1f2ed]">
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
                                            className="px-6 py-4 text-xs font-bold text-gray-500 uppercase whitespace-nowrap"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y-[3px] divide-[#f1f2ed]">
                                {filteredData.length > 0 ? (
                                    filteredData.map((inv) => (
                                        <tr
                                            key={inv.id}
                                            className="group hover:bg-[#fafafa] transition-colors"
                                        >
                                            <td className="px-6 py-4 text-sm font-medium text-slate-900 whitespace-nowrap font-mono">
                                                {inv.id}
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
                                                {inv.date}
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
                                                        className="p-2 bg-[#5aa39c]/10 text-[#5aa39c] hover:bg-[#5aa39c] hover:text-white rounded-lg transition-all"
                                                        title="View Details"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handlePrint(inv)
                                                        }
                                                        className="p-2 bg-white border border-gray-200 text-gray-500 hover:text-slate-900 hover:bg-gray-50 rounded-lg transition-all"
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
                                    {selectedInvoice.id}
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
                        <div className="overflow-y-auto flex-1 bg-white">
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
                                    onClick={() => handlePrint(selectedInvoice)}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 transition text-gray-700"
                                >
                                    <Printer size={16} /> Print
                                </button>
                                <button
                                    onClick={() => handlePrint(selectedInvoice)}
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
