import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { affiliatePortalService } from "@/services/affiliatePortal.service";
import {
    Trophy, ChevronLeft, ChevronRight, Loader2, AlertCircle, BookCheck,
    BadgePercent,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────
interface LeaderboardEntry {
    rank: number;
    affiliateId: string;
    name: string;
    initials: string;
    successfulBookings: number;
    totalCommission: number;
    isUser: boolean;
}

interface Pagination {
    page: number;
    limit: number;
    totalEntries: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

interface CurrentUser {
    rank: number | null;
    successfulBookings: number;
    totalCommission: number;
}

const PAGE_SIZE = 10;

const formatCurrency = (v: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);

const getRankBadge = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
};

// ─── Component ───────────────────────────────────────────────────────────────
const LeaderBoard: React.FC = () => {
    const { user } = useAuth();

    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        page: 1, limit: PAGE_SIZE, totalEntries: 0, totalPages: 1, hasNext: false, hasPrev: false,
    });
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);

    const fetchLeaderboard = async (p: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await affiliatePortalService.getLeaderboard(p, PAGE_SIZE);

            if (response.success && response.data) {
                setLeaderboard(response.data.leaderboard || []);
                setPagination(response.data.pagination || pagination);
                setCurrentUser(response.data.currentUser || null);
            } else {
                setError("Failed to load leaderboard.");
            }
        } catch (err: any) {
            setError(err?.message || "Failed to load leaderboard");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaderboard(page);
    }, [page]);

    const handlePrev = () => { if (page > 1) setPage(p => p - 1); };
    const handleNext = () => { if (pagination.hasNext) setPage(p => p + 1); };

    // ─── Render ─────────────────────────────────────────────────────────────
    return (
        <div className="mx-auto min-h-screen p-6 lg:p-10 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    Affiliate <span className="italic text-[#5bb09c]">Leaderboard</span>
                </h1>
                <p className="text-gray-500 mt-2 text-sm">
                    Ranked by number of successful bookings via affiliate coupon code.
                </p>
            </div>

            {/* Current User Hero Card */}
            {currentUser && (
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-[#5bb09c]/10 text-[#5bb09c] rounded-full flex items-center justify-center text-2xl font-bold">
                            {currentUser.rank ? `#${currentUser.rank}` : "—"}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Your Position</h3>
                            <p className="text-gray-400 text-sm">
                                {currentUser.rank
                                    ? `You are ranked #${currentUser.rank} out of ${pagination.totalEntries} affiliates`
                                    : "No successful bookings yet — start referring!"}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-6 sm:text-right">
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{currentUser.successfulBookings}</p>
                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Bookings</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(currentUser.totalCommission)}</p>
                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Commission</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-[60px_1fr_140px_180px] gap-4 px-6 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                    <span>Rank</span>
                    <span>Affiliate</span>
                    <span className="text-center">Bookings</span>
                    <span className="text-right">Commission (15%)</span>
                </div>

                {/* Rows */}
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-7 h-7 text-[#5bb09c] animate-spin" />
                        <p className="text-sm text-gray-400">Loading leaderboard…</p>
                    </div>
                ) : error ? (
                    <div className="py-16 flex flex-col items-center gap-3 text-center px-6">
                        <AlertCircle className="w-10 h-10 text-red-400" />
                        <p className="text-gray-600 font-medium">{error}</p>
                        <button
                            onClick={() => fetchLeaderboard(page)}
                            className="text-sm text-[#5bb09c] underline hover:no-underline"
                        >
                            Retry
                        </button>
                    </div>
                ) : leaderboard.length === 0 ? (
                    <div className="py-20 flex flex-col items-center gap-3 text-center px-6">
                        <Trophy className="w-12 h-12 text-gray-200" />
                        <p className="text-gray-500 font-medium">No data yet</p>
                        <p className="text-sm text-gray-400">Be the first to make a successful referral booking!</p>
                    </div>
                ) : (
                    leaderboard.map((entry) => (
                        <div
                            key={entry.affiliateId}
                            className={`grid grid-cols-[60px_1fr_140px_180px] gap-4 items-center px-6 py-4 border-b border-gray-50 last:border-0 transition-colors ${entry.isUser ? "bg-[#5bb09c]/5 border-l-4 border-l-[#5bb09c]" : "hover:bg-gray-50/50"
                                }`}
                        >
                            {/* Rank */}
                            <span className={`text-lg font-bold ${entry.rank <= 3 ? "text-yellow-500" : "text-gray-400"}`}>
                                {getRankBadge(entry.rank)}
                            </span>

                            {/* Name + Initials */}
                            <div className="flex items-center gap-3 min-w-0">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${entry.isUser ? "bg-[#5bb09c] text-white" : "bg-gray-100 text-gray-600"
                                    }`}>
                                    {entry.initials}
                                </div>
                                <div className="min-w-0">
                                    <p className={`font-semibold truncate ${entry.isUser ? "text-[#5bb09c]" : "text-gray-800"}`}>
                                        {entry.isUser ? `${entry.name} (You)` : entry.name}
                                    </p>
                                </div>
                            </div>

                            {/* Bookings */}
                            <div className="flex items-center justify-center gap-1.5">
                                <BookCheck className="w-4 h-4 text-[#5bb09c]" />
                                <span className="font-bold text-gray-900">{entry.successfulBookings}</span>
                                <span className="text-xs text-gray-400">bookings</span>
                            </div>

                            {/* Commission */}
                            <div className="text-right">
                                <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-lg text-sm">
                                    <BadgePercent className="w-3.5 h-3.5" />
                                    {formatCurrency(entry.totalCommission)}
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {/* Pagination Footer */}
                {!loading && !error && pagination.totalEntries > 0 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-xs text-gray-400">
                            Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, pagination.totalEntries)} of{" "}
                            {pagination.totalEntries} affiliates
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePrev}
                                disabled={!pagination.hasPrev}
                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-sm font-semibold text-gray-700">
                                {page} / {pagination.totalPages}
                            </span>
                            <button
                                onClick={handleNext}
                                disabled={!pagination.hasNext}
                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaderBoard;
