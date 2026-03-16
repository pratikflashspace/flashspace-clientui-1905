import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/lib/axios";
import {
  Users,
  TrendingUp,
  DollarSign,
  Search,
  ChevronRight,
  ArrowLeft,
  Trophy,
  Tag,
  Star,
  Phone,
  Mail,
  Calendar,
  Hash,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  UserCheck,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavItems";

// ---------------------------------------------------------------
// Types
// ---------------------------------------------------------------
interface Affiliate {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
  isActive: boolean;
  totalClients: number;
  totalRevenue: number;
  totalCommission: number;
  couponCode: string | null;
  couponUsageCount: number;
}

interface AffiliateClient {
  bookingId: string;
  bookingNumber: string;
  user: { id: string; fullName: string; email: string; phone: string };
  space: string;
  city: string;
  plan: string;
  tenure: string;
  amount: number;
  commissionAmount: number;
  couponCode: string;
  status: string;
  createdAt: string;
}

interface AffiliateDetail {
  affiliate: {
    fullName: string;
    email: string;
    phone: string;
    createdAt: string;
  };
  coupon: { code: string; usageCount: number; status: string } | null;
  clients: AffiliateClient[];
  stats: {
    totalClients: number;
    totalRevenue: number;
    totalCommission: number;
  };
}

// ---------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------
const formatCurrency = (n: number) =>
  `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

// ---------------------------------------------------------------
// Stat Card
// ---------------------------------------------------------------
const StatCard = ({
  label,
  value,
  icon: Icon,
  color,
  sub,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  sub?: string;
}) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-start gap-4">
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className="text-xl font-bold text-gray-900 mt-0.5">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

// ---------------------------------------------------------------
// Affiliate Row
// ---------------------------------------------------------------
const AffiliateRow = ({
  affiliate,
  rank,
  onClick,
}: {
  affiliate: Affiliate;
  rank: number;
  onClick: () => void;
}) => (
  <tr
    className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors cursor-pointer group"
    onClick={onClick}
  >
    <td className="px-5 py-4">
      <div className="flex items-center gap-2">
        <span
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                    ${
                      rank === 1
                        ? "bg-amber-100 text-amber-700"
                        : rank === 2
                          ? "bg-gray-200 text-gray-600"
                          : rank === 3
                            ? "bg-orange-100 text-orange-700"
                            : "bg-gray-100 text-gray-400"
                    }`}
        >
          {rank <= 3 ? <Trophy className="w-3.5 h-3.5" /> : rank}
        </span>
        <div>
          <p className="font-semibold text-gray-900 text-sm">
            {affiliate.fullName}
          </p>
          <p className="text-xs text-gray-400">{affiliate.email}</p>
        </div>
      </div>
    </td>
    <td className="px-5 py-4">
      {affiliate.couponCode ? (
        <span className="font-mono text-xs bg-teal-50 text-teal-700 border border-teal-100 px-2.5 py-1 rounded-lg font-bold tracking-wide">
          {affiliate.couponCode}
        </span>
      ) : (
        <span className="text-xs text-gray-400 italic">No code</span>
      )}
    </td>
    <td className="px-5 py-4 text-center">
      <span className="font-bold text-gray-800">{affiliate.totalClients}</span>
    </td>
    <td className="px-5 py-4">
      <span className="font-semibold text-gray-800">
        {formatCurrency(affiliate.totalRevenue)}
      </span>
    </td>
    <td className="px-5 py-4">
      <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg text-sm">
        {formatCurrency(affiliate.totalCommission)}
      </span>
    </td>
    <td className="px-5 py-4 text-xs text-gray-400">
      {formatDate(affiliate.createdAt)}
    </td>
    <td className="px-5 py-4">
      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-teal-600 transition-colors" />
    </td>
  </tr>
);

// ---------------------------------------------------------------
// Affiliate Detail Drawer Panel
// ---------------------------------------------------------------
const AffiliateDetailPanel = ({
  affiliateId,
  onClose,
}: {
  affiliateId: string;
  onClose: () => void;
}) => {
  const [data, setData] = useState<AffiliateDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(
          `/api/admin/affiliates/${affiliateId}/clients`,
        );
        setData((res as any).data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [affiliateId]);

  const filtered = (data?.clients || []).filter(
    (c) =>
      c.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-teal-600 to-teal-700 text-white">
          <button
            onClick={onClose}
            className="mb-3 flex items-center gap-2 text-teal-100 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Affiliates
          </button>
          {loading ? (
            <div className="animate-pulse h-6 bg-teal-500 rounded w-48 mb-2" />
          ) : (
            <>
              <h2 className="text-2xl font-bold">{data?.affiliate.fullName}</h2>
              <p className="text-teal-100 text-sm mt-0.5">
                {data?.affiliate.email}
              </p>
            </>
          )}

          {/* Mini Stats */}
          {data && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="bg-white/15 rounded-xl p-3 text-center">
                <p className="text-xs text-teal-100">Total Clients</p>
                <p className="text-xl font-bold">{data.stats.totalClients}</p>
              </div>
              <div className="bg-white/15 rounded-xl p-3 text-center">
                <p className="text-xs text-teal-100">Revenue</p>
                <p className="text-xl font-bold">
                  {formatCurrency(data.stats.totalRevenue)}
                </p>
              </div>
              <div className="bg-white/15 rounded-xl p-3 text-center">
                <p className="text-xs text-teal-100">Commission</p>
                <p className="text-xl font-bold">
                  {formatCurrency(data.stats.totalCommission)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Coupon Info */}
        {data?.coupon && (
          <div className="px-8 py-4 bg-teal-50 border-b border-teal-100 flex items-center gap-4">
            <Tag className="w-4 h-4 text-teal-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-teal-700 font-medium">
                Referral Coupon Code
              </p>
              <p className="font-mono font-bold text-teal-800 text-sm">
                {data.coupon.code}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Total Uses</p>
              <p className="font-bold text-teal-700">
                {data.coupon.usageCount}
              </p>
            </div>
          </div>
        )}

        {/* Client List */}
        <div className="flex-1 overflow-y-auto">
          {/* Search */}
          <div className="px-8 py-4 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <UserCheck className="w-12 h-12 mb-3 opacity-30" />
              <p className="font-medium">No clients found</p>
            </div>
          ) : (
            <div className="px-8 py-4 space-y-3">
              {filtered.map((client) => (
                <div
                  key={client.bookingId.toString()}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:border-teal-200 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate mb-0.5">
                        {client.user.fullName}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {client.user.email}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-emerald-700 text-sm">
                        {formatCurrency(client.commissionAmount)}
                      </p>
                      <p className="text-xs text-gray-400">commission</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-gray-600">
                    <div>
                      <p className="text-gray-400 font-medium">Space</p>
                      <p className="font-medium truncate">{client.space}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium">Plan</p>
                      <p className="font-medium">
                        {client.plan} · {client.tenure}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium">Paid</p>
                      <p className="font-medium">
                        {formatCurrency(client.amount)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500">
                      {client.bookingNumber}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(client.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------
export default function AdminAffiliateManagement() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [summary, setSummary] = useState({
    totalAffiliates: 0,
    totalRevenue: 0,
    totalCommissionPayable: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAffiliateId, setSelectedAffiliateId] = useState<string | null>(
    null,
  );

  const fetchAffiliates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get("/api/admin/affiliates");
      const {
        affiliates: list,
        totalAffiliates,
        totalRevenue,
        totalCommissionPayable,
      } = (res as any).data.data;
      setAffiliates(list);
      setSummary({ totalAffiliates, totalRevenue, totalCommissionPayable });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch affiliates");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAffiliates();
  }, [fetchAffiliates]);

  const filtered = (affiliates || []).filter(
    (a) =>
      a.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.couponCode &&
        a.couponCode.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <DashboardLayout
      portalName="FlashSpace Admin"
      portalDescription="Complete platform management"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Affiliate Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor all affiliate partners, their referral codes, clients, and
            commission earnings.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total Affiliates"
            value={String(summary.totalAffiliates)}
            icon={Users}
            color="bg-teal-100 text-teal-600"
          />
          <StatCard
            label="Total Revenue Generated"
            value={formatCurrency(summary.totalRevenue)}
            icon={TrendingUp}
            color="bg-indigo-100 text-indigo-600"
            sub="From affiliate referrals"
          />
          <StatCard
            label="Total Commission Payable"
            value={formatCurrency(summary.totalCommissionPayable)}
            icon={DollarSign}
            color="bg-emerald-100 text-emerald-600"
            sub="15% of referred revenue"
          />
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or coupon code…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {filtered.length} of {affiliates.length}
            </span>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-red-500 gap-3">
              <AlertCircle className="w-10 h-10" />
              <p className="font-medium">{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
              <Users className="w-12 h-12 opacity-30" />
              <p className="font-medium">No affiliates found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                    <th className="px-5 py-3">Affiliate</th>
                    <th className="px-5 py-3">Coupon Code</th>
                    <th className="px-5 py-3 text-center">Clients</th>
                    <th className="px-5 py-3">Revenue</th>
                    <th className="px-5 py-3">Commission</th>
                    <th className="px-5 py-3">Joined</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((affiliate, idx) => (
                    <AffiliateRow
                      key={affiliate._id}
                      affiliate={affiliate}
                      rank={idx + 1}
                      onClick={() => setSelectedAffiliateId(affiliate._id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Affiliate Detail Panel */}
        {selectedAffiliateId && (
          <AffiliateDetailPanel
            affiliateId={selectedAffiliateId}
            onClose={() => setSelectedAffiliateId(null)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
