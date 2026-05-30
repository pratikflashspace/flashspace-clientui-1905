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
import { AdminPageSkeleton } from "@/components/ui/skeleton-loaders";
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
  kycVerified?: boolean;
  verifiedStatus?: "verified" | "pending" | "rejected";
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
  isActive,
  sub,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  isActive?: boolean;
  sub?: string;
}) => (
  <div className="bg-background border border-border rounded-xl shadow-[rgba(23,34,38,0.08)_0px_4px_24px_-4px] p-6 transition-all hover:shadow-lg">
    <div className="flex items-center justify-between mb-4">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
        <Icon className="w-4 h-4" />
      </div>
    </div>
    <h3 style={{ fontFamily: "'Inter', sans-serif" }} className={`text-[24px] font-extrabold tracking-tight ${isActive ? 'text-primary' : 'text-foreground'}`}>{value}</h3>
    {sub && <p className="text-[10px] text-muted-foreground/60 mt-1 font-bold italic">{sub}</p>}
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
      <div className="flex items-center gap-3">
        <span
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-sm
                    ${
                      rank === 1
                        ? "bg-amber-100 text-amber-700 border border-amber-200"
                        : rank === 2
                          ? "bg-muted text-muted-foreground border border-border"
                          : rank === 3
                            ? "bg-orange-50 text-orange-700 border border-orange-100"
                            : "bg-muted/50 text-muted-foreground/60 border border-border/50"
                    }`}
        >
          {rank <= 3 ? <Trophy className="w-3.5 h-3.5" /> : rank}
        </span>
        <div>
          <p className="font-bold text-foreground text-sm">
            {affiliate.fullName}
          </p>
          <p className="text-xs text-muted-foreground font-medium">{affiliate.email}</p>
        </div>
      </div>
    </td>
    <td className="px-5 py-4">
      {affiliate.kycVerified || affiliate.verifiedStatus === "verified" ? (
        <span className="inline-flex items-center gap-1.5 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1.5 rounded-lg font-black uppercase tracking-widest">
          <UserCheck className="w-3 h-3" /> Verified
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-[10px] bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1.5 rounded-lg font-black uppercase tracking-widest">
          <AlertCircle className="w-3 h-3" /> Pending
        </span>
      )}
    </td>
    <td className="px-5 py-4 text-center">
      <span className="font-black text-foreground">{affiliate.totalClients}</span>
    </td>
    <td className="px-5 py-4">
      <span className="font-bold text-foreground">
        {formatCurrency(affiliate.totalRevenue)}
      </span>
    </td>
    <td className="px-5 py-4">
      <span className="inline-flex items-center gap-1 font-black text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg text-xs border border-emerald-100 shadow-sm">
        {formatCurrency(affiliate.totalCommission)}
      </span>
    </td>
    <td className="px-5 py-4 text-[11px] text-muted-foreground font-medium">
      {formatDate(affiliate.createdAt)}
    </td>
    <td className="px-5 py-4">
      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
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

  const safeSearch = searchQuery.toLowerCase().trim();
  const filtered = (data?.clients || []).filter(
    (c) => {
      if (!safeSearch) return true;
      const name = (c.user?.fullName || "").toLowerCase();
      const email = (c.user?.email || "").toLowerCase();
      const booking = (c.bookingNumber || "").toLowerCase();
      return name.includes(safeSearch) || email.includes(safeSearch) || booking.includes(safeSearch);
    }
  );

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="w-full max-w-3xl bg-background h-full shadow-2xl flex flex-col overflow-hidden border-l border-border">
        {/* Header */}
        <div className="px-8 py-8 border-b border-border bg-gradient-to-br from-primary to-primary/80 text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
          <button
            onClick={onClose}
            className="mb-6 flex items-center gap-2 text-primary-foreground/80 hover:text-white text-xs font-black uppercase tracking-widest transition-all hover:-translate-x-1"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Partners
          </button>
          {loading ? (
            <div className="animate-pulse space-y-3">
               <div className="h-8 bg-white/20 rounded-xl w-64" />
               <div className="h-4 bg-white/10 rounded-lg w-48" />
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-black tracking-tight">{data?.affiliate.fullName}</h2>
              <p className="text-primary-foreground/70 text-sm mt-1 font-medium flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> {data?.affiliate.email}
              </p>
            </>
          )}

          {/* Mini Stats */}
          {data && (
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/10 shadow-inner">
                <p className="text-[10px] text-primary-foreground/60 uppercase font-black tracking-widest mb-1">Total Clients</p>
                <p className="text-2xl font-black">{data.stats.totalClients}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/10 shadow-inner">
                <p className="text-[10px] text-primary-foreground/60 uppercase font-black tracking-widest mb-1">Revenue</p>
                <p className="text-2xl font-black">
                  {formatCurrency(data.stats.totalRevenue)}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/10 shadow-inner">
                <p className="text-[10px] text-primary-foreground/60 uppercase font-black tracking-widest mb-1">Commission</p>
                <p className="text-2xl font-black text-emerald-300">
                  {formatCurrency(data.stats.totalCommission)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Coupon Info */}
        {data?.coupon && (
          <div className="px-8 py-5 bg-primary/5 border-b border-primary/10 flex items-center gap-5">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
               <Tag className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-primary/60 font-black uppercase tracking-widest">
                Referral Coupon Code
              </p>
              <p className="font-mono font-black text-primary text-base">
                {data.coupon.code}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Total Uses</p>
              <p className="text-lg font-black text-foreground">
                {data.coupon.usageCount}
              </p>
            </div>
          </div>
        )}

        {/* Client List */}
        <div className="flex-1 overflow-y-auto scrollbar-none bg-background">
          {/* Search */}
          <div className="px-8 py-5 border-b border-border sticky top-0 bg-background/95 backdrop-blur-md z-10 transition-all">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search clients by name, email or booking ID…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-transparent rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-background focus:border-primary/20 transition-all placeholder:text-muted-foreground/60"
              />
            </div>
          </div>

          {loading ? (
             <div className="px-8 py-6 space-y-4">
               {[1, 2, 3, 4].map((i) => (
                 <div key={i} className="h-32 bg-muted/50 rounded-2xl animate-pulse" />
               ))}
             </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground/60 gap-4">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <UserCheck className="w-8 h-8 opacity-40 text-primary" />
              </div>
              <p className="font-bold text-sm uppercase tracking-widest">No clients found</p>
            </div>
          ) : (
            <div className="px-8 py-6 space-y-4">
              {filtered.map((client) => (
                <div
                  key={client.bookingId.toString()}
                  className="bg-background rounded-2xl border border-border shadow-sm p-5 hover:border-primary/20 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-foreground text-base tracking-tight mb-0.5 group-hover:text-primary transition-colors">
                        {client.user.fullName}
                      </p>
                      <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                        <Mail className="w-3 h-3 opacity-60" /> {client.user.email}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl shadow-sm">
                      <p className="font-black text-emerald-700 text-sm leading-none mb-1">
                        {formatCurrency(client.commissionAmount)}
                      </p>
                      <p className="text-[9px] uppercase tracking-widest font-black text-emerald-600/70">Commission</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 py-4 border-y border-border/50 bg-muted/20 -mx-5 px-5">
                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mb-1.5 opacity-60">Space</p>
                      <p className="text-xs font-bold text-foreground truncate">{client.space}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mb-1.5 opacity-60">Plan & Tenure</p>
                      <p className="text-xs font-bold text-foreground truncate">
                        {client.plan} · {client.tenure}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mb-1.5 opacity-60">Revenue</p>
                      <p className="text-xs font-black text-primary">
                        {formatCurrency(client.amount)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-mono text-[10px] bg-muted px-2.5 py-1 rounded-lg text-muted-foreground font-bold tracking-tighter">
                      {client.bookingNumber}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" /> {formatDate(client.createdAt)}
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

  const safeMainSearch = searchQuery.toLowerCase().trim();
  const filtered = (affiliates || [])
    .sort((a, b) => (b.totalCommission || 0) - (a.totalCommission || 0))
    .filter(
      (a) => {
        if (!safeMainSearch) return true;
        const name = (a.fullName || "").toLowerCase();
        const email = (a.email || "").toLowerCase();
        return name.includes(safeMainSearch) || email.includes(safeMainSearch);
      }
    );

  return (
    <DashboardLayout
      portalName="FlashSpace Admin"
      portalDescription="Complete platform management"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
              Affiliate <span className="text-primary italic">Management</span>
            </h1>
            <p className="text-sm md:text-base text-muted-foreground font-medium">
              Monitor partners, verification status, clients, and commission earnings.
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total Affiliates"
            value={String(summary.totalAffiliates)}
            icon={Users}
            isActive={true}
          />
          <StatCard
            label="Revenue Generated"
            value={formatCurrency(summary.totalRevenue)}
            icon={TrendingUp}
          />
          <StatCard
            label="Commission Payable"
            value={formatCurrency(summary.totalCommissionPayable)}
            icon={DollarSign}
          />
        </div>

        {/* Table Card */}
        <div className="bg-background rounded-3xl border border-border shadow-xl shadow-muted/20 overflow-hidden">
          {/* Toolbar */}
          <div className="px-6 py-5 border-b border-border flex flex-col md:flex-row items-center gap-5 bg-background">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name or email…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-transparent rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-background focus:border-primary/20 transition-all"
              />
            </div>
            <div className="px-4 py-2 bg-muted/50 rounded-xl border border-border/50">
              <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                {filtered.length} <span className="text-primary/60">/ {affiliates.length}</span> Partners
              </span>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="p-8">
              <AdminPageSkeleton hideHeader hideStats />
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
            <div className="overflow-x-auto scrollbar-none">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 text-left text-xs font-black text-muted-foreground uppercase tracking-widest border-b border-border">
                    <th className="px-5 py-4">Affiliate Partner</th>
                    <th className="px-5 py-4">Verified Status</th>
                    <th className="px-5 py-4 text-center">Clients</th>
                    <th className="px-5 py-4">Revenue</th>
                    <th className="px-5 py-4">Commission</th>
                    <th className="px-5 py-4">Joined On</th>
                    <th className="px-5 py-4" />
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
