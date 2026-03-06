import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { affiliatePortalService } from "@/services/affiliatePortal.service";
import {
    Trophy, ChevronLeft, ChevronRight, Loader2, AlertCircle, BookCheck,
    BadgePercent, Crown, Medal, Award, MapPin
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

const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-orange-500" />;
    return <span className="text-gray-400 font-bold text-lg">#{rank}</span>;
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
        <div className="mx-auto min-h-screen p-6 lg:p-10 space-y-10 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-extrabold text-[#1a1a1a] tracking-tight">
                    Affiliate <span className="italic font-bold text-[#2d5a4c]">Leaderboard</span>
                </h1>
                <p className="text-[#6b7280] mt-2 text-lg font-medium">
                    Ranked by number of successful bookings via affiliate coupon code.
                </p>
            </div>

            {/* Current User Hero Card */}
            {currentUser && (
                <div className="bg-[#f0f4f3] p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group border-0 shadow-sm">
                    <div className="flex items-center gap-8 relative z-10">
                        <div className="w-20 h-20 bg-[#2d5a4c] text-white rounded-full flex items-center justify-center text-3xl font-black shadow-lg shadow-[#2d5a4c]/20 ring-4 ring-white">
                            {currentUser.rank ? `#${currentUser.rank}` : "—"}
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-2xl font-black text-[#1a1a1a]">Your Position</h3>
                            <p className="text-[#2d5a4c] font-bold">
                                {currentUser.rank
                                    ? `You are ranked #${currentUser.rank} out of ${pagination.totalEntries} affiliates`
                                    : "No successful bookings yet — start referring!"}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-12 text-center md:text-right relative z-10">
                        <div>
                            <p className="text-4xl font-black text-[#1a1a1a] tracking-tighter">{currentUser.successfulBookings}</p>
                            <p className="text-[#6b7280] font-bold text-sm uppercase tracking-widest mt-1">Bookings</p>
                        </div>
                        <div>
                            <p className="text-4xl font-black text-[#2d5a4c] tracking-tighter">{formatCurrency(currentUser.totalCommission)}</p>
                            <p className="text-[#6b7280] font-bold text-sm uppercase tracking-widest mt-1">Commission</p>
                        </div>
                    </div>

                    <Trophy className="absolute -right-8 -bottom-8 w-48 h-48 text-[#2d5a4c] opacity-5 transform rotate-12 group-hover:scale-110 transition-transform duration-700" />
                </div>
            )}

            {/* Leaderboard Section */}
            <div className="space-y-4">

                {loading ? (
                    <div className="py-32 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-10 h-10 text-[#2d5a4c] animate-spin" />
                        <p className="text-base text-gray-400 font-medium tracking-wide">Loading leaderboard…</p>
                    </div>
                ) : error ? (
                    <div className="py-20 flex flex-col items-center gap-4 text-center px-6">
                        <AlertCircle className="w-12 h-12 text-red-400" />
                        <p className="text-gray-900 font-bold text-lg">{error}</p>
                        <button
                            onClick={() => fetchLeaderboard(page)}
                            className="mt-2 text-[#2d5a4c] font-bold underline hover:no-underline"
                        >
                            Retry
                        </button>
                    </div>
                ) : leaderboard.length === 0 ? (
                    <div className="py-32 flex flex-col items-center gap-4 text-center px-6 bg-white rounded-[2rem] shadow-sm border border-dashed border-gray-200">
                        <Trophy className="w-12 h-12 text-gray-200" />
                        <p className="text-gray-500 font-bold text-lg">No data yet</p>
                        <p className="text-sm text-gray-400">Be the first to make a successful referral booking!</p>
                    </div>
                ) : (
                    leaderboard.map((entry) => (
                        <div
                            key={entry.affiliateId}
                            className={`bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.03)] ring-1 ring-black/5 hover:ring-[#2d5a4c]/30 flex flex-col md:flex-row items-center justify-between gap-6 transition-all group ${entry.isUser ? "ring-2 ring-[#2d5a4c] bg-[#f0f4f3]/30" : ""
                                }`}
                        >
                            <div className="flex items-center gap-6 w-full md:w-auto">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${entry.rank === 1 ? "bg-yellow-50" :
                                    entry.rank === 2 ? "bg-gray-50" :
                                        entry.rank === 3 ? "bg-orange-50" : "bg-gray-50"
                                    }`}>
                                    {getRankIcon(entry.rank)}
                                </div>

                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black shrink-0 ${entry.isUser ? "bg-[#2d5a4c] text-white" : "bg-gray-100 text-[#6b7280]"
                                    }`}>
                                    {entry.initials}
                                </div>

                                <div className="space-y-0.5">
                                    <h4 className="font-bold text-[#1a1a1a] text-xl group-hover:text-[#2d5a4c] transition-colors">
                                        {entry.isUser ? `${entry.name} (You)` : entry.name}
                                    </h4>
                                </div>
                            </div>

                            <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                                <div className="text-center space-y-1">
                                    <p className="text-2xl font-black text-[#1a1a1a]">{entry.successfulBookings}</p>
                                    <p className="text-[#6b7280] font-bold text-[10px] uppercase tracking-widest text-right">Bookings</p>
                                </div>
                                <div className="text-center space-y-1">
                                    <p className="text-2xl font-black text-[#1a1a1a]">{formatCurrency(entry.totalCommission)}</p>
                                    <p className="text-[#6b7280] font-bold text-[10px] uppercase tracking-widest text-right">Commission (15%)</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {/* Pagination Footer */}
                {!loading && !error && pagination.totalEntries > 0 && (
                    <div className="flex items-center justify-between pt-6">
                        <p className="text-xs text-gray-400">
                            Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, pagination.totalEntries)} of{" "}
                            {pagination.totalEntries} affiliates
                        </p>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handlePrev}
                                disabled={!pagination.hasPrev}
                                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-black/5 text-gray-500 hover:text-[#2d5a4c] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-90"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="text-base font-bold text-[#1a1a1a] bg-white px-4 py-2 rounded-xl shadow-sm ring-1 ring-black/5">
                                {page} <span className="text-gray-300 mx-1">/</span> {pagination.totalPages}
                            </span>
                            <button
                                onClick={handleNext}
                                disabled={!pagination.hasNext}
                                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-black/5 text-gray-500 hover:text-[#2d5a4c] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-90"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaderBoard;
