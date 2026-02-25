import React, { useState, useEffect } from "react";
import {
    Download,
    Clock,
    CheckCircle2,
    Loader2,
    X,
    ArrowRight
} from "lucide-react";
import { affiliatePortalService, AffiliateInvoice } from "../../services/affiliatePortal.service";

// --- Custom Hook for Number Counting Animation (0.5s duration) ---
const useCountUp = (end: number, duration: number = 500) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        let animationFrameId: number;

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = currentTime - startTime;

            if (progress < duration) {
                const nextCount = Math.min(end, (progress / duration) * end);
                setCount(nextCount);
                animationFrameId = requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, [end, duration]);

    return count;
};

// --- Sub-Component: Animated Counter ---
const AnimatedCounter = ({
    value,
    prefix = "",
    suffix = "",
    decimals = 0,
}: {
    value: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
}) => {
    const count = useCountUp(value, 500);
    return (
        <span>
            {prefix}
            {count.toFixed(decimals)}
            {suffix}
        </span>
    );
};

// --- Components ---
const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
    }).format(val);

const StatCard = ({
    label,
    value,
    subValue,
    colorClass = "text-slate-900",
    delay,
}: {
    label: string;
    value: number | string;
    subValue?: string;
    colorClass?: string;
    delay: number;
}) => (
    <div
        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group animate-fade-in-up"
        style={{ animationDelay: `${delay}ms` }}
    >
        <h3 className={`text-3xl font-bold ${colorClass} mb-1 flex items-baseline gap-1`}>
            {typeof value === "number" ? (
                <AnimatedCounter
                    value={value}
                    prefix={subValue && ['K', 'L'].includes(subValue) ? "₹" : typeof value === 'number' && !subValue ? "₹" : ""}
                    suffix={subValue || ""}
                    decimals={subValue === "L" ? 2 : 0}
                />
            ) : (
                value
            )}
        </h3>
        <p className="text-gray-500 font-medium text-sm">{label}</p>
    </div>
);

const StatusBadge = ({ status }: { status: string }) => {
    if (status === "Processing") {
        return (
            <span className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold border border-blue-100">
                <Clock size={12} /> Processing
            </span>
        );
    }
    if (status === "Paid") {
        return (
            <span className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-semibold border border-green-100">
                <CheckCircle2 size={12} /> Paid
            </span>
        );
    }
    return (
        <span className="flex items-center gap-1 px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full text-xs font-semibold border border-yellow-100">
            <Clock size={12} /> Pending
        </span>
    );
};

const Payouts = () => {
    const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");
    const [invoices, setInvoices] = useState<AffiliateInvoice[]>([]);
    const [paidInvoiceIds, setPaidInvoiceIds] = useState<string[]>([]);
    const [selectedPayout, setSelectedPayout] = useState<AffiliateInvoice | null>(null);
    const [showBankModal, setShowBankModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load local storage paid IDs
        const stored = localStorage.getItem("affiliate_paid_payouts");
        if (stored) {
            try {
                setPaidInvoiceIds(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse paid payouts", e);
            }
        }

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

    // Derived Data
    const validInvoices = invoices.filter(inv => inv.commission && inv.commission > 0);
    const pendingInvoices = validInvoices.filter(inv => !paidInvoiceIds.includes(inv.id || inv.invoiceNumber));
    const completedInvoices = validInvoices.filter(inv => paidInvoiceIds.includes(inv.id || inv.invoiceNumber));

    const totalEarned = validInvoices.reduce((sum, inv) => sum + inv.commission, 0);
    const totalPaid = completedInvoices.reduce((sum, inv) => sum + inv.commission, 0);
    const pendingAmount = pendingInvoices.reduce((sum, inv) => sum + inv.commission, 0);

    const handleInitiatePayout = (inv: AffiliateInvoice) => {
        setSelectedPayout(inv);
        setShowBankModal(true);
    };

    const handleConfirmPayout = () => {
        if (selectedPayout) {
            const idToMark = selectedPayout.id || selectedPayout.invoiceNumber;
            const newPaidIds = [...paidInvoiceIds, idToMark];
            setPaidInvoiceIds(newPaidIds);
            localStorage.setItem("affiliate_paid_payouts", JSON.stringify(newPaidIds));

            setShowBankModal(false);
            setTimeout(() => {
                setShowSuccessModal(true);
            }, 300);
        }
    };

    const formatDate = (dateString: string) => {
        try {
            const d = new Date(dateString);
            return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        } catch {
            return dateString;
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] p-6 lg:p-10 font-sans w-full relative">
            <div className="w-full space-y-8 animate-fade-in">
                {/* 1. Header */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Payout{" "}
                        <span className="text-[#5aa39c] italic">
                            Management
                        </span>
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Track your commission payouts
                    </p>
                </div>

                {/* 2. Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        label="Total Earned"
                        value={totalEarned}
                        delay={0}
                    />
                    <StatCard
                        label="Total Paid"
                        value={totalPaid}
                        colorClass="text-green-600"
                        delay={100}
                    />
                    <StatCard
                        label="Pending Payout"
                        value={pendingAmount}
                        colorClass="text-orange-500"
                        delay={200}
                    />
                    {/* Static value for date */}
                    <StatCard
                        label="Next Auto Payout"
                        value="10th"
                        delay={300}
                    />
                </div>

                {/* 3. Main Content Section */}
                <div className="space-y-6">
                    {/* Tabs */}
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1 w-max">
                        <button
                            onClick={() => setActiveTab("pending")}
                            className={`
                px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300
                ${activeTab === "pending"
                                    ? "bg-white text-slate-900 shadow-sm ring-1 ring-gray-200"
                                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                                }
              `}
                        >
                            Pending Payouts ({loading ? "..." : pendingInvoices.length})
                        </button>
                        <button
                            onClick={() => setActiveTab("completed")}
                            className={`
                px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300
                ${activeTab === "completed"
                                    ? "bg-white text-slate-900 shadow-sm ring-1 ring-gray-200"
                                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                                }
              `}
                        >
                            Completed ({loading ? "..." : completedInvoices.length})
                        </button>
                    </div>

                    {/* Conditional Content */}
                    <div className="animate-slide-up">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-24 gap-3">
                                <Loader2 className="w-10 h-10 text-[#5aa39c] animate-spin" />
                                <p className="text-gray-500 font-medium">Loading payouts...</p>
                            </div>
                        ) : activeTab === "pending" ? (
                            // --- PENDING VIEW (List Style) ---
                            <div className="space-y-4">
                                {pendingInvoices.length > 0 ? pendingInvoices.map((item, idx) => (
                                    <div
                                        key={item.id || item.invoiceNumber}
                                        className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                                        style={{
                                            animationDelay: `${idx * 100}ms`,
                                        }}
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-gray-400 text-sm font-mono">
                                                    {item.invoiceNumber}
                                                </span>
                                                <StatusBadge status={"Pending"} />
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900">
                                                {formatDate(item.date)}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Client: {item.client} • Booking Commission
                                            </p>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-3 w-full md:w-auto mt-2 md:mt-0">
                                            <p className="text-2xl font-bold text-slate-900">
                                                {formatCurrency(item.commission)}
                                            </p>
                                            <button
                                                onClick={() => handleInitiatePayout(item)}
                                                className="w-full md:w-auto px-4 py-2 bg-[#5aa39c]/10 text-[#5aa39c] rounded-lg text-sm font-semibold hover:bg-[#5aa39c] hover:text-white transition group-hover:shadow flex items-center justify-center gap-2"
                                            >
                                                Payout <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                                        <p className="text-gray-500 text-lg">No pending payouts available.</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // --- COMPLETED VIEW (Table Style) ---
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                                {[
                                                    "Payout ID",
                                                    "Period",
                                                    "Client",
                                                    "Amount",
                                                    "Paid Date",
                                                    "Method",
                                                ].map((head) => (
                                                    <th
                                                        key={head}
                                                        className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                                                    >
                                                        {head}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {completedInvoices.length > 0 ? completedInvoices.map(
                                                (payout, idx) => (
                                                    <tr
                                                        key={payout.id || payout.invoiceNumber}
                                                        className="group hover:bg-[#fafafa] transition-colors duration-150"
                                                    >
                                                        <td className="px-6 py-4 text-sm font-medium text-slate-900 whitespace-nowrap font-mono">
                                                            {payout.invoiceNumber}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium whitespace-nowrap">
                                                            {formatDate(payout.date)}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500">
                                                            {payout.client}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-bold text-[#5aa39c] whitespace-nowrap">
                                                            {formatCurrency(payout.commission)}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                            {formatDate(new Date().toISOString())}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                            Bank Transfer
                                                        </td>
                                                    </tr>
                                                ),
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                                        No completed payouts yet.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- BANK DETAILS MODAL --- */}
            {showBankModal && selectedPayout && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in no-print">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col animate-scale-up relative overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
                            <h2 className="font-bold text-lg text-slate-800">Confirm Bank Details</h2>
                            <button
                                onClick={() => setShowBankModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-sm text-gray-500">
                                You are requesting a payout for <span className="font-bold text-slate-900">{selectedPayout.invoiceNumber}</span>.
                                The amount of <span className="font-bold text-[#5aa39c]">{formatCurrency(selectedPayout.commission)}</span> will be transferred to your registered bank account.
                            </p>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Bank Name</span>
                                    <span className="font-semibold text-slate-800">HDFC Bank</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Account Number</span>
                                    <span className="font-semibold text-slate-800">•••• •••• 1234</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">IFSC Code</span>
                                    <span className="font-semibold text-slate-800">HDFC0001234</span>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setShowBankModal(false)}
                                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmPayout}
                                    className="flex-1 px-4 py-3 bg-[#5aa39c] text-white rounded-lg text-sm font-semibold hover:bg-[#4a8b85] shadow-sm hover:shadow transition"
                                >
                                    Confirm & Payout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- SUCCESS MODAL --- */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in no-print">
                    <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl flex flex-col items-center text-center p-8 animate-scale-up relative overflow-hidden">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-5 ring-8 ring-green-50">
                            <CheckCircle2 size={40} />
                        </div>
                        <h2 className="font-bold text-2xl text-slate-900 mb-2">Payout Initiated!</h2>
                        <p className="text-sm text-gray-500 mb-8 px-2 font-medium">
                            Your payout request has been successfully submitted. The amount will reflect in your account within 2-3 business days.
                        </p>
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="w-full px-4 py-3.5 bg-[#5aa39c] text-white rounded-xl text-sm font-bold hover:bg-[#4a8b85] shadow-sm hover:shadow-md transition"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}

            {/* Styles for Animations */}
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-scale-up {
          animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.4s ease-out forwards;
        }
      `}</style>
        </div>
    );
};

export default Payouts;
