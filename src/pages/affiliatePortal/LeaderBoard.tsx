import React, { useEffect, useState } from "react";
import { affiliatePortalService } from "@/services/affiliatePortal.service";
import { AffiliateHeaderActions } from "@/components/affiliatePortal/AffiliateHeaderActions";
import {
  AlertCircle,
  Award,
  ChevronLeft,
  ChevronRight,
  Crown,
  Loader2,
  Medal,
} from "lucide-react";

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

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const getRankMarker = (rank: number) => {
  if (rank === 1) return <Crown className="h-4 w-4 text-[#F2B705]" />;
  if (rank === 2) return <Medal className="h-4 w-4 text-slate-400" />;
  if (rank === 3) return <Award className="h-4 w-4 text-orange-500" />;
  return <span className="text-xs font-black text-[#6B8F78]">#{rank}</span>;
};

const LeaderBoard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: PAGE_SIZE,
    totalEntries: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchLeaderboard = async (pageNumber: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await affiliatePortalService.getLeaderboard(pageNumber, PAGE_SIZE);

      if (response.success && response.data) {
        setLeaderboard(response.data.leaderboard || []);
        setPagination(response.data.pagination || pagination);
        setCurrentUser(response.data.currentUser || null);
      } else {
        setError(response.message || "Failed to load leaderboard.");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(page);
  }, [page]);

  return (
 <div className="min-h-screen p-4 md:p-6 lg:p-8 bg-[#FAFAF7] font-sans "> 
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 style={{ fontFamily: "'Inter', sans-serif" }} className="text-3xl font-extrabold tracking-tight text-[#1A1A1A]">
              Affiliate <span className="italic text-[#36503F]">Leaderboard</span>
            </h1>
            <p className="mt-2 text-[16px] font-medium text-[#6B7280]">
              Ranked by successful bookings via affiliate coupon code.
            </p>
          </div>
          <AffiliateHeaderActions />
        </div>

        {currentUser && (
          <div className="flex min-h-[86px] flex-col gap-4 rounded-[18px] bg-[#36503F] px-5 py-4 text-white shadow-sm md:flex-row md:items-center md:justify-between md:px-6">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15 text-base font-black">
                {currentUser.rank ? `#${currentUser.rank}` : "-"}
              </div>
              <div className="min-w-0">
                <h2 style={{ fontFamily: "'Inter', sans-serif" }} className="text-base font-extrabold leading-tight">Your Position</h2>
                <p className="mt-1 truncate text-[16px] font-semibold leading-tight text-white/70 text-[#6B7280]">
                  {currentUser.rank
                    ? `Ranked #${currentUser.rank} of ${pagination.totalEntries} affiliates`
                    : "No successful bookings yet"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 text-center md:ml-auto md:w-[280px] md:gap-10">
              <div className="min-w-0">
                <p className="text-2xl font-extrabold leading-none">{currentUser.successfulBookings}</p>
                <p className="mt-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                  Bookings
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-extrabold leading-none text-[#FEF8C5]">
                  {formatCurrency(currentUser.totalCommission)}
                </p>
                <p className="mt-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                  Commission
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-[#DDE6DD] bg-white shadow-sm">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-4 py-32">
              <Loader2 className="h-9 w-9 animate-spin text-[#36503F]" />
              <p className="text-sm font-medium text-[#6B8F78]">Loading leaderboard...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-4 px-6 py-20 text-center">
              <AlertCircle className="h-10 w-10 text-red-400" />
              <p className="text-base font-bold text-[#1A1A1A]">{error}</p>
              <button
                type="button"
                onClick={() => fetchLeaderboard(page)}
                className="rounded-full bg-[#36503F] px-5 py-2 text-sm font-bold text-[#FEF8C5]"
              >
                Retry
              </button>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="px-6 py-24 text-center">
              <p className="text-base font-bold text-[#1A1A1A]">No data yet</p>
              <p className="mt-1 text-sm text-[#6B8F78]">Successful referrals will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] table-fixed text-left">
                <colgroup>
                  <col className="w-16" />
                  <col />
                  <col className="w-28" />
                  <col className="w-32" />
                </colgroup>
                <thead>
                  <tr className="border-b border-[#DDE6DD] bg-[#FBFCFA] text-xs font-bold uppercase tracking-[0.16em] text-[#6B8F78]">
                    <th className="px-6 py-4">#</th>
                    <th className="px-2 py-4 text-[#36503F]">
                      <div className="grid grid-cols-[44px_minmax(0,1fr)] items-center gap-4">
                        <span className="col-start-2">Affiliate</span>
                      </div>
                    </th>
                    <th className="px-4 py-4 text-center">Bookings</th>
                    <th className="px-4 py-4 text-center">Commission</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEF2EE]">
                  {leaderboard.map((entry) => (
                    <tr
                      key={entry.affiliateId}
                      className={`transition-colors ${
                        entry.isUser ? "bg-[#F0F4EE]" : "bg-white hover:bg-[#FAFAF7]"
                      }`}
                    >
                      <td className="px-6 py-4 align-middle">{getRankMarker(entry.rank)}</td>
                      <td className="px-2 py-4">
                        <div className="grid grid-cols-[44px_minmax(0,1fr)] items-center gap-4">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                              entry.isUser
                                ? "bg-[#36503F] text-white"
                                : "bg-[#EDF2EC] text-[#36503F]"
                            }`}
                          >
                            {entry.initials}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="truncate text-sm font-extrabold text-[#1A1A1A]">
                                {entry.name}
                              </p>
                              {entry.isUser && (
                                <span className="rounded-full bg-[#36503F] px-2 py-0.5 text-[9px] font-black text-white">
                                  You
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center text-xs font-bold text-[#1A1A1A]">
                        {entry.successfulBookings}
                      </td>
                      <td className="px-4 py-4 text-center text-xs font-bold text-[#1A1A1A]">
                        {formatCurrency(entry.totalCommission)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {!loading && !error && pagination.totalEntries > 0 && (
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <p className="text-xs font-medium text-[#6B8F78]">
              Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, pagination.totalEntries)} of{" "}
              {pagination.totalEntries} affiliates
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => page > 1 && setPage((p) => p - 1)}
                disabled={!pagination.hasPrev}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDE6DD] bg-white text-[#36503F] shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="rounded-xl border border-[#DDE6DD] bg-white px-4 py-2 text-sm font-black text-[#1A1A1A] shadow-sm">
                {page} / {pagination.totalPages}
              </span>
              <button
                type="button"
                onClick={() => pagination.hasNext && setPage((p) => p + 1)}
                disabled={!pagination.hasNext}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDE6DD] bg-white text-[#36503F] shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderBoard;
