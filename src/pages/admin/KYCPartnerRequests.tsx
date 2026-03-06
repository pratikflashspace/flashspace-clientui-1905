import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminService, type PartnerKYCData } from "@/services/admin.service";
import {
  Search,
  Handshake,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Filter,
  Users,
  Briefcase,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

const getStatusBadge = (status: string) => {
  const config: Record<
    string,
    {
      variant: "default" | "secondary" | "destructive" | "outline";
      icon: React.ComponentType<{ className?: string }>;
      className: string;
    }
  > = {
    pending: {
      variant: "secondary",
      icon: Clock,
      className: "bg-amber-500/10 text-amber-600 border-amber-500/20"
    },
    approved: {
      variant: "default",
      icon: CheckCircle2,
      className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
    },
    rejected: {
      variant: "destructive",
      icon: XCircle,
      className: "bg-destructive/10 text-destructive border-destructive/20"
    },
    resubmit: {
      variant: "outline",
      icon: AlertCircle,
      className: "bg-blue-500/10 text-blue-600 border-blue-500/20"
    },
  };

  const { variant, icon: Icon, className } = config[status] || config.pending;
  return (
    <Badge
      variant={variant}
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${className}`}
    >
      <Icon className="w-3 h-3" />
      {status}
    </Badge>
  );
};

export default function KYCPartnerRequests() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<PartnerKYCData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPartners = async () => {
      setLoading(true);
      try {
        const res = await adminService.getPartnerKYCList();
        if (res.success && res.data) {
          setRecords(res.data);
        } else {
          toast.error(res.message || "Failed to fetch partner KYC records");
        }
      } catch (err) {
        console.error("Failed to fetch partner KYC records", err);
        toast.error("Failed to fetch partner KYC records");
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const filtered = records.filter((r) => {
    const name = r.partnerInfo?.fullName?.toLowerCase() || "";
    const email = r.partnerInfo?.email?.toLowerCase() || "";
    const phone = r.partnerInfo?.phone?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();
    return name.includes(term) || email.includes(term) || phone.includes(term);
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl border-4 border-primary/20 border-t-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Handshake className="w-8 h-8 text-primary/40" />
          </div>
        </div>
        <p className="mt-8 text-sm font-black text-muted-foreground uppercase tracking-[0.2em] animate-pulse">
          Decrypting Associate Network...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-10 animate-in fade-in duration-700">
      {/* Premium Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-border/60">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
              Associate Tier
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Global Audit System</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter uppercase italic">
            Associate <span className="text-primary not-italic">Network</span>
          </h1>
          <p className="text-muted-foreground font-bold mt-4 max-w-lg text-sm leading-relaxed">
            Review partner-level KYC snapshots derived from individual profiles and corporate associate applications.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative group w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <Input
              type="text"
              placeholder="Search associate ID, name, or contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-14 pl-11 pr-4 rounded-2xl bg-muted/30 border-border/50 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-sm"
            />
          </div>
          <Button variant="outline" className="h-14 px-6 rounded-2xl border-border font-black uppercase text-[10px] tracking-widest flex items-center gap-3 hover:bg-muted/50 transition-all">
            <Filter className="w-4 h-4" />
            Sort Audit queue
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-background rounded-[2.5rem] border border-border shadow-2xl shadow-primary/5 overflow-hidden">
        <div className="px-10 py-8 border-b border-border bg-muted/20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 shadow-inner">
              <Handshake className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Associate Snapshots</h3>
              <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Verified Identity Ledger</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-background font-black text-[10px] tracking-widest uppercase py-1 px-4 border-border">
              {filtered.length} ACTIVE AUDITS
            </Badge>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-24 h-24 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Briefcase className="w-12 h-12 text-muted-foreground/20" />
            </div>
            <h3 className="text-2xl font-black text-foreground uppercase tracking-tight mb-3">No Audit Logs Found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto font-bold text-sm">
              The associate network audit queue is currently empty or matches no search parameters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/10">
                  <th className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Associate Information</th>
                  <th className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Contact Identity</th>
                  <th className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Audit Status</th>
                  <th className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Dossier Progress</th>
                  <th className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Initial Log</th>
                  <th className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Operation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filtered.map((rec) => (
                  <tr
                    key={rec._id}
                    className="group hover:bg-muted/30 transition-all duration-300"
                  >
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-background text-xl font-black shadow-lg group-hover:scale-110 transition-transform duration-500">
                          {rec.partnerInfo?.fullName?.charAt(0) || "P"}
                        </div>
                        <div>
                          <p className="text-sm font-black text-foreground uppercase tracking-tight group-hover:text-primary transition-colors">
                            {rec.partnerInfo?.fullName || "Corporate Anonymous"}
                          </p>
                          {rec.partnerProfileId && (
                            <div className="flex items-center gap-1.5 mt-1.5 font-mono text-[10px] text-muted-foreground font-bold uppercase">
                              <span className="opacity-40">Profile:</span>
                              <span className="text-secondary-foreground">{rec.partnerProfileId}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="space-y-1.5">
                        <p className="text-xs font-black text-foreground tracking-tight">
                          {rec.partnerInfo?.email || "SYSTEM_REDIRECT"}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                            {rec.partnerInfo?.phone || "ENCRYPTED LINE"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      {getStatusBadge(rec.overallStatus || "pending")}
                    </td>
                    <td className="px-10 py-8">
                      {typeof rec.progress === "number" ? (
                        <div className="space-y-3 w-40">
                          <div className="flex justify-between items-end">
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Audit Depth</span>
                            <span className="text-[11px] font-black text-primary">{rec.progress}%</span>
                          </div>
                          <Progress value={rec.progress} className="h-1.5 bg-muted rounded-full" />
                        </div>
                      ) : (
                        <Badge variant="outline" className="font-mono text-[10px] text-muted-foreground opacity-40">DATA_ERR</Badge>
                      )}
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                        <Clock className="w-3.5 h-3.5 opacity-40" />
                        {rec.createdAt
                          ? new Date(rec.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                          : "---"}
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <Button
                        onClick={() => navigate(`/admin/kyc-partners/${rec._id}`)}
                        className="h-11 px-6 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all flex items-center gap-2 ml-auto"
                      >
                        <Eye className="w-4 h-4" />
                        Inspect Dossier
                        <ChevronRight className="w-4 h-4 opacity-40 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
