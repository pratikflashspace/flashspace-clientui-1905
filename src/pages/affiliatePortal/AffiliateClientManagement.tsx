import React, { useState, useEffect } from "react";
import {
    Users2, TrendingUp, BookOpen, IndianRupee, Loader2,
    AlertCircle, Search, Filter, BadgePercent, Calendar,
} from "lucide-react";
import axiosInstance from "@/lib/axios";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ─── Types ─────────────────────────────────────────────────────────────────
interface ClientBooking {
    bookingId: string;
    bookingNumber: string;
    user: { id: string; fullName: string; email: string; phone: string };
    space: string;
    city: string;
    plan: string;
    tenure: string;
    amount: number;
    discountAmount: number;
    commissionAmount: number; // ← replaces revenue
    couponCode: string;
    status: string;
    startDate?: string;
    createdAt?: string;
}

interface ClientStats {
    totalClients: number;
    totalCommission: number; // ← replaces totalRevenue
    activeBookings: number;
    successfulBookings: number;
    commissionRate: number;
}

const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-700 border-green-200",
    pending_kyc: "bg-yellow-100 text-yellow-700 border-yellow-200",
    pending_payment: "bg-orange-100 text-orange-700 border-orange-200",
    expired: "bg-gray-100 text-gray-500 border-gray-200",
    cancelled: "bg-red-100 text-red-600 border-red-200",
};

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

// ─── Component ──────────────────────────────────────────────────────────────
const AffiliateClientManagement: React.FC = () => {
    const [clients, setClients] = useState<ClientBooking[]>([]);
    const [stats, setStats] = useState<ClientStats>({
        totalClients: 0, totalCommission: 0, activeBookings: 0,
        successfulBookings: 0, commissionRate: 15,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Search & Filter State
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [spaceFilter, setSpaceFilter] = useState("all");
    const [commissionFilter, setCommissionFilter] = useState("All");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    // Staging state for Advanced Filters (applied only on button click)
    const [pendingCommission, setPendingCommission] = useState("All");
    const [pendingDateFrom, setPendingDateFrom] = useState("");
    const [pendingDateTo, setPendingDateTo] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get<{
                    success: boolean;
                    data: { clients: ClientBooking[]; stats: ClientStats };
                }>("/api/affiliate/clients");

                if (response.data.success) {
                    setClients(response.data.data.clients);
                    setStats(response.data.data.stats);
                } else {
                    setError("Failed to load clients. Please try again.");
                }
            } catch (err: any) {
                setError(err?.response?.data?.message || "Failed to load clients");
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    // Filter
    const filtered = clients.filter((c) => {
        const q = searchQuery.trim().toLowerCase();
        const matchesSearch =
            !q ||
            c.user.fullName.toLowerCase().includes(q) ||
            c.user.email.toLowerCase().includes(q) ||
            c.space.toLowerCase().includes(q) ||
            c.city.toLowerCase().includes(q) ||
            c.plan.toLowerCase().includes(q) ||
            c.bookingNumber.toLowerCase().includes(q) ||
            c.couponCode.toLowerCase().includes(q);

        const matchesSpace = spaceFilter === "all" || c.plan === spaceFilter;

        let matchesCommission = true;
        if (commissionFilter === "< 10k") matchesCommission = c.commissionAmount < 10000;
        else if (commissionFilter === "10k - 50k") matchesCommission = c.commissionAmount >= 10000 && c.commissionAmount <= 50000;
        else if (commissionFilter === "> 50k") matchesCommission = c.commissionAmount > 50000;

        let matchesDate = true;
        if (dateFrom) {
            const from = new Date(dateFrom);
            const bookedDate = new Date(c.createdAt || "");
            if (bookedDate < from) matchesDate = false;
        }
        if (dateTo) {
            const to = new Date(dateTo);
            to.setHours(23, 59, 59, 999);
            const bookedDate = new Date(c.createdAt || "");
            if (bookedDate > to) matchesDate = false;
        }

        return matchesSearch && matchesSpace && matchesCommission && matchesDate;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filtered.length / rowsPerPage);
    const paginatedClients = filtered.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage,
    );

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, spaceFilter, commissionFilter, dateFrom, dateTo, rowsPerPage]);

    const handleSearch = () => {
        setSearchQuery(searchInput);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    // ─── Loading ──────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 text-[#5aa39c] animate-spin mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Loading your clients…</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
                    <p className="text-gray-700 font-medium">{error}</p>
                </div>
            </div>
        );
    }

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Client Management</h1>
                <p className="text-gray-500 text-sm mt-1">
                    Clients who booked through your affiliate coupon code.{" "}
                    <span className="font-medium text-[#5aa39c]">{stats.commissionRate}% commission</span> on paid amount.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                    <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center">
                        <Users2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900">{stats.totalClients}</p>
                        <p className="text-xs text-gray-500">Total Clients</p>
                    </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                    <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center">
                        <BadgePercent className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats.totalCommission)}</p>
                        <p className="text-xs text-gray-500">Total Commission Earned</p>
                    </div>
                </div>
            </div>

            {/* Search & Advanced Filter Bar */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 flex gap-2">
                        <div className="relative flex-1">
                            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search by name, email, space, coupon or booking ID…"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5aa39c]/30 transition-all text-sm"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors shadow-sm font-medium"
                        >
                            Search
                        </button>
                    </div>

                    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors shadow-sm font-medium">
                                <Filter className="w-4 h-4" />
                                <span>Advanced Filters</span>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 p-4 space-y-4 bg-white cursor-pointer">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase">
                                    Commission Range
                                </label>
                                <select
                                    className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                                    value={pendingCommission}
                                    onChange={(e) => setPendingCommission(e.target.value)}
                                >
                                    <option value="All">Commission</option>
                                    <option value="< 10k">&lt; ₹10,000</option>
                                    <option value="10k - 50k">₹10,000 - ₹50,000</option>
                                    <option value="> 50k">&gt; ₹50,000</option>
                                </select>
                            </div>
                            <div className="space-y-2 pt-2 border-t border-gray-100">
                                <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    Date Range
                                </label>
                                <div className="space-y-2">
                                    <div>
                                        <label className="text-[11px] text-gray-400 mb-0.5 block">From</label>
                                        <input
                                            type="date"
                                            value={pendingDateFrom}
                                            max={pendingDateTo || undefined}
                                            onChange={(e) => setPendingDateFrom(e.target.value)}
                                            className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] text-gray-400 mb-0.5 block">To</label>
                                        <input
                                            type="date"
                                            value={pendingDateTo}
                                            min={pendingDateFrom || undefined}
                                            onChange={(e) => setPendingDateTo(e.target.value)}
                                            className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                                        />
                                    </div>
                                    {(pendingDateFrom || pendingDateTo) && (
                                        <button
                                            onClick={() => { setPendingDateFrom(""); setPendingDateTo(""); }}
                                            className="w-full text-xs text-red-500 hover:text-red-600 font-medium py-1 transition-colors"
                                        >
                                            Clear Dates
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="pt-3 border-t border-gray-100">
                                <button
                                    onClick={() => {
                                        setCommissionFilter(pendingCommission);
                                        setDateFrom(pendingDateFrom);
                                        setDateTo(pendingDateTo);
                                        setIsDropdownOpen(false);
                                    }}
                                    className="w-full py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Space Type Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {[
                        { label: "All Spaces", value: "all" },
                        { label: "Private Office", value: "Private Office" },
                        { label: "Dedicated Desk", value: "Dedicated Desk" },
                        { label: "Meeting Room", value: "Meeting Room" },
                        { label: "Coworking", value: "Coworking" },
                        { label: "Virtual Office", value: "Virtual Office" },
                    ].map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setSpaceFilter(tab.value)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${spaceFilter === tab.value
                                ? "bg-gray-900 text-white"
                                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table / Empty State */}
            {filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
                    <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-gray-700 font-semibold mb-1">
                        {clients.length === 0 ? "No clients yet" : "No results found"}
                    </h3>
                    <p className="text-sm text-gray-400 max-w-sm mx-auto">
                        {clients.length === 0
                            ? "Share your affiliate coupon code. When someone books using it, they'll appear here."
                            : "Try adjusting your search or filter."}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                                    <th className="px-5 py-3">Client</th>
                                    <th className="px-5 py-3">Booking ID</th>
                                    <th className="px-5 py-3">Space</th>
                                    <th className="px-5 py-3">Plan / Tenure</th>
                                    <th className="px-5 py-3">Paid</th>
                                    <th className="px-5 py-3">Commission (15%)</th>
                                    <th className="px-5 py-3">Coupon</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3">Booked On</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {paginatedClients.map((c) => (
                                    <tr key={String(c.bookingId)} className="hover:bg-gray-50/50 transition-colors">
                                        {/* Client */}
                                        <td className="px-5 py-4">
                                            <p className="font-semibold text-slate-800">{c.user.fullName}</p>
                                            <p className="text-xs text-gray-400">{c.user.email}</p>
                                        </td>

                                        {/* Booking Number */}
                                        <td className="px-5 py-4">
                                            <span className="font-mono text-xs bg-slate-50 border border-slate-100 px-2 py-0.5 rounded text-slate-600">
                                                {c.bookingNumber}
                                            </span>
                                        </td>

                                        {/* Space */}
                                        <td className="px-5 py-4">
                                            <p className="font-medium text-slate-700">{c.space}</p>
                                            <p className="text-xs text-gray-400">{c.city}</p>
                                        </td>

                                        {/* Plan */}
                                        <td className="px-5 py-4">
                                            <p className="text-slate-700">{c.plan}</p>
                                            <p className="text-xs text-gray-400">{c.tenure}</p>
                                        </td>

                                        {/* Paid Amount */}
                                        <td className="px-5 py-4 font-semibold text-slate-800">
                                            {formatCurrency(c.amount)}
                                            {c.discountAmount > 0 && (
                                                <p className="text-xs text-green-600 font-normal">
                                                    −{formatCurrency(c.discountAmount)} disc.
                                                </p>
                                            )}
                                        </td>

                                        {/* Commission */}
                                        <td className="px-5 py-4">
                                            <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg text-sm">
                                                {formatCurrency(c.commissionAmount)}
                                            </span>
                                        </td>

                                        {/* Coupon */}
                                        <td className="px-5 py-4">
                                            <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                                                {c.couponCode}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-5 py-4">
                                            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${statusColors[c.status] || "bg-gray-50 text-gray-500 border-gray-200"}`}>
                                                {c.status.replace(/_/g, " ")}
                                            </span>
                                        </td>

                                        {/* Date */}
                                        <td className="px-5 py-4 text-gray-500">{formatDate(c.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>Showing</span>
                            <select
                                className="border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                                value={rowsPerPage}
                                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                            >
                                {[5, 10, 25, 50].map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                            <span>rows of {filtered.length}</span>
                            <span className="ml-4 font-semibold text-emerald-600">
                                Filtered Commission: {formatCurrency(filtered.reduce((s, c) => s + c.commissionAmount, 0))}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-gray-600 font-medium px-2">
                                Page {currentPage} of {totalPages || 1}
                            </span>
                            <button
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className="px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AffiliateClientManagement;
