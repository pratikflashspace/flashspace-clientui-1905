import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/lib/axios";
import {
  Search,
  Clock,
  AlertCircle,
  CheckCircle,
  Eye,
  RefreshCw,
  Plus,
  ArrowLeft,
  ArrowRight,
  Trophy,
  Target,
  Wallet,
  TrendingUp,
  Tag,
  Users,
  DollarSign,
  ChevronRight,
  UserCheck,
  Loader2,
  Phone,
  Mail,
  Calendar,
  Hash,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { StatsCard } from '@/components/dashboard/StatsCard';

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

const getInitials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

const getRandomGradient = (name: string) => {
  const gradients = [
    'from-blue-600 to-indigo-600',
    'from-emerald-600 to-teal-600',
    'from-violet-600 to-purple-600',
    'from-amber-600 to-orange-600',
    'from-rose-600 to-pink-600',
    'from-cyan-600 to-blue-600',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
};


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
    className="border-t border-border hover:bg-muted/30 transition-colors group cursor-pointer"
    onClick={onClick}
  >
    <td className="p-4">
      <div className="flex items-center gap-3">
        <span
          className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black
                    ${rank === 1
              ? "bg-amber-100 text-amber-700 border border-amber-200"
              : rank === 2
                ? "bg-gray-100 text-gray-600 border border-gray-200"
                : rank === 3
                  ? "bg-orange-100 text-orange-700 border border-orange-200"
                  : "bg-muted text-muted-foreground border border-border"
            }`}
        >
          {rank <= 3 ? <Trophy className="w-4 h-4" /> : rank}
        </span>
        <div>
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                {getInitials(affiliate.fullName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-foreground text-sm leading-tight">
                {affiliate.fullName}
              </p>
              <p className="text-xs text-muted-foreground">{affiliate.email}</p>
            </div>
          </div>
        </div>
      </div>
    </td>
    <td className="p-4">
      {affiliate.couponCode ? (
        <Badge variant="outline" className="font-mono text-[10px] bg-teal-50 text-teal-700 border-teal-100 uppercase tracking-wider px-2 py-0.5">
          {affiliate.couponCode}
        </Badge>
      ) : (
        <span className="text-xs text-muted-foreground italic opacity-50">No code</span>
      )}
    </td>
    <td className="p-4 text-center">
      <span className="font-extrabold text-foreground">{affiliate.totalClients}</span>
    </td>
    <td className="p-4">
      <span className="font-bold text-foreground">
        {formatCurrency(affiliate.totalRevenue)}
      </span>
    </td>
    <td className="p-4">
      <Badge className="bg-green-50 text-green-700 hover:bg-green-100 border-green-100 font-bold px-2 py-0.5">
        {formatCurrency(affiliate.totalCommission)}
      </Badge>
    </td>
    <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
      {formatDate(affiliate.createdAt)}
    </td>
    <td className="p-4 text-right pr-6">
      <Button
        variant="outline"
        size="sm"
        className="gap-1 rounded-lg h-8 px-3 text-[10px] font-bold uppercase tracking-widest border-border hover:bg-muted"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <Eye className="w-3 h-3" />
        View
      </Button>
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
    <div className="fixed inset-0 z-50 flex animate-in fade-in duration-300">
      {/* Backdrop */}
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="w-full max-w-2xl bg-background h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-500">
        {/* Header */}
        <div className="px-8 py-8 border-b border-border bg-muted/30">
          <Button
            variant="ghost"
            onClick={onClose}
            className="mb-6 -ml-2 text-muted-foreground hover:text-foreground gap-2 h-8 px-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Back to Network</span>
          </Button>

          <div className="flex items-center gap-4 mb-6">
            <Avatar className="w-16 h-16 border-4 border-background shadow-xl">
              <AvatarFallback className="text-xl bg-primary/10 text-primary font-black">
                {data ? getInitials(data.affiliate.fullName) : "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              {loading ? (
                <div className="space-y-2">
                  <div className="h-6 w-48 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-black text-foreground tracking-tighter uppercase italic italic">
                    {data?.affiliate.fullName}
                  </h2>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-70">
                    {data?.affiliate.email}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Mini Stats */}
          {data && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-background border border-border rounded-2xl p-4 shadow-sm">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Impact</p>
                <p className="text-xl font-black text-foreground">{data.stats.totalClients} <span className="text-[10px] text-muted-foreground not-italic">Clients</span></p>
              </div>
              <div className="bg-background border border-border rounded-2xl p-4 shadow-sm">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Growth</p>
                <p className="text-xl font-black text-foreground">
                  {formatCurrency(data.stats.totalRevenue)}
                </p>
              </div>
              <div className="bg-background border border-border rounded-2xl p-4 shadow-sm">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Reward</p>
                <p className="text-xl font-black text-emerald-600">
                  {formatCurrency(data.stats.totalCommission)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Coupon Info */}
        {data?.coupon && (
          <div className="px-8 py-4 bg-teal-50/30 border-b border-teal-100/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Tag className="w-4 h-4 text-teal-600" />
              <div>
                <p className="text-[10px] font-black text-teal-800 uppercase tracking-widest">Active Protocol</p>
                <p className="font-mono font-bold text-teal-700 text-sm">
                  {data.coupon.code}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-teal-800 uppercase tracking-widest">Deployment Count</p>
              <p className="font-black text-teal-700 text-xl">
                {data.coupon.usageCount}
              </p>
            </div>
          </div>
        )}

        {/* Client List */}
        <div className="flex-1 overflow-y-auto bg-muted/10">
          {/* Search */}
          <div className="px-8 py-4 border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Synchronize searching clients…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 rounded-xl border-border bg-background"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <RefreshCw className="w-8 h-8 text-primary animate-spin" />
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Fetching Data Stream...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-muted-foreground/30">
              <UserCheck className="w-16 h-16 mb-4 opacity-10" />
              <p className="text-[10px] font-black uppercase tracking-widest">Archive Void: No Clients Detected</p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {filtered.map((client) => (
                <div
                  key={client.bookingId.toString()}
                  className="bg-background rounded-2xl border border-border shadow-sm p-5 hover:border-primary/30 transition-all hover:shadow-md group"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border border-border">
                        <AvatarFallback className="text-xs bg-muted text-foreground font-bold">
                          {getInitials(client.user.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-foreground text-sm uppercase">
                          {client.user.fullName}
                        </p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight opacity-70">
                          {client.user.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-emerald-600 text-lg leading-none mb-1">
                        {formatCurrency(client.commissionAmount)}
                      </p>
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-50">Yield Received</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-50">Sector</p>
                      <p className="font-bold text-foreground text-xs truncate">{client.space}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-50">Blueprint</p>
                      <p className="font-bold text-foreground text-xs truncate">
                        {client.plan} · {client.tenure}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-50">Transaction</p>
                      <p className="font-bold text-foreground text-xs">
                        {formatCurrency(client.amount)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-4 border-t border-border/50">
                    <Badge variant="secondary" className="font-mono text-[9px] uppercase tracking-tighter bg-muted/50">
                      ID: {client.bookingNumber}
                    </Badge>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                      {formatDate(client.createdAt)}
                    </p>
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
  const [activeTab, setActiveTab] = useState("all");
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
    (a) => {
      const matchesSearch = a.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.couponCode && a.couponCode.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      // Filter by tab if needed (currently all are active by default in mock, 
      // but in real app we might have status)
      if (activeTab === "active") return a.isActive;
      if (activeTab === "inactive") return !a.isActive;

      return true;
    }
  );

  return (
    <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Affiliate <span className="text-primary italic">Management</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor and scale the global referral architecture.
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={fetchAffiliates} className="rounded-xl h-11">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Synchronize
          </Button>
          <Button onClick={() => { }}>
            <Plus className="w-4 h-4 mr-2" />
            Integrate Partner
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 mb-12">
        <StatsCard title="Active Affiliates" value={String(summary.totalAffiliates)} icon={Users} />
        <StatsCard title="Total Yield Generated" value={formatCurrency(summary.totalRevenue)} icon={TrendingUp} />
        <StatsCard title="Payable Rewards" value={formatCurrency(summary.totalCommissionPayable)} icon={DollarSign} />
        <StatsCard title="Active Coupon Codes" value={String(affiliates.filter(a => a.couponCode).length)} icon={Tag} />
        <StatsCard title="Avg Node Yield" value={formatCurrency(summary.totalRevenue / (summary.totalAffiliates || 1))} icon={Wallet} />
      </div>

      {/* Toolbar & Search */}
      <div className="flex gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search network by ID, identity or protocol code..."
            className="pl-11 h-12 rounded-xl border-border bg-background shadow-sm focus:ring-primary/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center text-[10px] font-black text-muted-foreground uppercase tracking-widest px-4">
          Displaying {filtered.length} of {affiliates.length} segments
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none h-auto p-0 gap-8">
          <TabsTrigger value="all" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 pb-3 font-semibold text-muted-foreground data-[state=active]:text-foreground uppercase text-[11px] tracking-widest">
            All Affiliates
          </TabsTrigger>
          <TabsTrigger value="active" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 pb-3 font-semibold text-muted-foreground data-[state=active]:text-foreground uppercase text-[11px] tracking-widest">
            Active Nodes
          </TabsTrigger>
          <TabsTrigger value="inactive" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 pb-3 font-semibold text-muted-foreground data-[state=active]:text-foreground uppercase text-[11px] tracking-widest">
            Pending/Disabled
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {/* Table Container */}
          <div className="bg-background border border-border rounded-2xl overflow-hidden shadow-xl">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <RefreshCw className="w-10 h-10 text-primary animate-spin" />
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Synchronizing Network Stream...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-32 text-red-500 gap-4">
                <AlertCircle className="w-16 h-16 opacity-20" />
                <p className="font-bold uppercase tracking-widest text-xs">{error}</p>
                <Button variant="outline" size="sm" onClick={fetchAffiliates} className="h-8 rounded-lg text-[10px] font-black uppercase tracking-widest">Retry Connection</Button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-muted-foreground/30 gap-4">
                <Users className="w-16 h-16 opacity-10" />
                <p className="text-[10px] font-black uppercase tracking-widest">No segments matched current query</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr className="text-left">
                      <th className="p-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Affiliate Node</th>
                      <th className="p-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Protocol Code</th>
                      <th className="p-4 text-center text-[10px] font-black text-muted-foreground uppercase tracking-widest">Volume</th>
                      <th className="p-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Yield</th>
                      <th className="p-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Available Reward</th>
                      <th className="p-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Deployment</th>
                      <th className="p-4 text-right pr-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
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
        </TabsContent>
      </Tabs>

      {/* Affiliate Detail Panel */}
      {selectedAffiliateId && (
        <AffiliateDetailPanel
          affiliateId={selectedAffiliateId}
          onClose={() => setSelectedAffiliateId(null)}
        />
      )}
    </div>
  );
}
