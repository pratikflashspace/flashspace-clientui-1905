import React, { useState, useEffect } from "react";
import { Users2, TrendingUp, BookOpen, IndianRupee, ExternalLink, Loader2, AlertCircle, Search, Filter } from "lucide-react";
import axiosInstance from "@/lib/axios";

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
    couponCode: string;
    status: string;
    startDate?: string;
    createdAt?: string;
}

interface ClientStats {
    totalClients: number;
    totalRevenue: number;
    activeBookings: number;
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
    const [stats, setStats] = useState<ClientStats>({ totalClients: 0, totalRevenue: 0, activeBookings: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        const fetchClients = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get<{ success: boolean; data: { clients: ClientBooking[]; stats: ClientStats } }>(
                    "/api/affiliate/clients"
                );
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
        const matchesSearch =
            !searchQuery ||
            c.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.space.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === "all" || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // ─── Loading ────────────────────────────────────────────────────────────
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

    // ─── Render ──────────────────────────────────────────────────────────────
    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Client Management</h1>
                <p className="text-gray-500 text-sm mt-1">All clients who booked through your affiliate coupon code.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                    <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center">
                        <IndianRupee className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats.totalRevenue)}</p>
                        <p className="text-xs text-gray-500">Total Revenue Generated</p>
                    </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                    <div className="w-11 h-11 bg-[#5aa39c]/10 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-[#5aa39c]" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900">{stats.activeBookings}</p>
                        <p className="text-xs text-gray-500">Active Bookings</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email, space or booking ID…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5aa39c]/30"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400 shrink-0" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-gray-200 rounded-xl text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#5aa39c]/30"
                    >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="pending_kyc">Pending KYC</option>
                        <option value="pending_payment">Pending Payment</option>
                        <option value="expired">Expired</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
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
                            ? "Share your affiliate coupon code with prospects. When they book using it, they'll appear here."
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
                                    <th className="px-5 py-3">Space</th>
                                    <th className="px-5 py-3">Plan / Tenure</th>
                                    <th className="px-5 py-3">Amount</th>
                                    <th className="px-5 py-3">Coupon</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3">Booked On</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map((c) => (
                                    <tr key={c.bookingId} className="hover:bg-gray-50/50 transition-colors">
                                        {/* Client */}
                                        <td className="px-5 py-4">
                                            <p className="font-semibold text-slate-800">{c.user.fullName}</p>
                                            <p className="text-xs text-gray-400">{c.user.email}</p>
                                            {c.user.phone && c.user.phone !== "—" && (
                                                <p className="text-xs text-gray-400">{c.user.phone}</p>
                                            )}
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

                                        {/* Amount */}
                                        <td className="px-5 py-4 font-semibold text-slate-800">
                                            {formatCurrency(c.amount)}
                                        </td>

                                        {/* Coupon */}
                                        <td className="px-5 py-4">
                                            <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                                                {c.couponCode}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-5 py-4">
                                            <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold border ${statusColors[c.status] || "bg-gray-100 text-gray-500 border-gray-200"}`}>
                                                {c.status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                            </span>
                                        </td>

                                        {/* Date */}
                                        <td className="px-5 py-4 text-gray-500">
                                            {formatDate(c.createdAt)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
                        Showing {filtered.length} of {clients.length} client{clients.length !== 1 ? "s" : ""}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AffiliateClientManagement;
