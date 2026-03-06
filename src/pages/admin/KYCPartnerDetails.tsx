import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_CONFIG } from "@/config/api.config";
import { adminService, type PartnerKYCData } from "@/services/admin.service";
import type { KYCDocument } from "@/types/adminKyc";
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Calendar,
  File as FileIcon,
  Eye,
  ExternalLink,
  Download,
  X,
  User,
  Shield,
  Phone,
  Building2,
  Lock,
  ChevronRight,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const getFullUrl = (url?: string): string => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  const baseUrl = API_CONFIG.BASE_URL.endsWith("/")
    ? API_CONFIG.BASE_URL.slice(0, -1)
    : API_CONFIG.BASE_URL;
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${baseUrl}${path}`;
};

const getFileExtension = (url?: string) => {
  if (!url) return "file";
  const ext = url.split(".").pop()?.toLowerCase();
  return ext || "file";
};

const isImageFile = (url?: string) => {
  const ext = getFileExtension(url);
  return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext);
};

const isPDFFile = (url?: string) => getFileExtension(url) === "pdf";

const isVideoFile = (url?: string) => {
  const ext = getFileExtension(url);
  return ["mp4", "webm", "mov", "avi", "mkv"].includes(ext);
};

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

export default function KYCPartnerDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [request, setRequest] = useState<PartnerKYCData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<KYCDocument | null>(
    null,
  );

  useEffect(() => {
    if (!id) return;

    const fetchById = async () => {
      setLoading(true);
      try {
        const res = await adminService.getPartnerKYCById(id);

        if (res.success && res.data) {
          setRequest(res.data as PartnerKYCData);
        } else {
          toast.error(res.message || "Failed to load partner KYC");
        }
      } catch (error) {
        console.error("Failed to fetch partner KYC", error);
        toast.error("Failed to load partner KYC");
      } finally {
        setLoading(false);
      }
    };

    fetchById();
  }, [id]);

  if (loading || !request) {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-8">
            <div className="relative">
                <div className="w-20 h-20 rounded-3xl border-4 border-primary/20 border-t-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <RefreshCw className="w-8 h-8 text-primary/40" />
                </div>
            </div>
            <p className="mt-8 text-sm font-black text-muted-foreground uppercase tracking-[0.2em] animate-pulse">
                Decrypting Dossier...
            </p>
        </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-10 animate-in fade-in duration-700">
      {/* Header Tier */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-border/60">
        <div className="space-y-4">
            <Button
                variant="ghost" 
                onClick={() => navigate(-1)}
                className="group flex items-center gap-2 text-muted-foreground hover:text-primary p-0 transition-colors font-black text-[10px] uppercase tracking-widest"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to associate list
            </Button>
            <div>
                <div className="flex items-center gap-3 mb-3">
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-black uppercase tracking-widest">
                        Network Audit
                    </Badge>
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">DOSSIER ID: {id?.slice(-8).toUpperCase()}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter uppercase italic">
                    Associate <span className="text-primary not-italic">Snapshot</span>
                </h1>
                <p className="text-muted-foreground font-bold mt-4 max-w-lg text-sm leading-relaxed">
                    Detailed audit of partner-level KYC status and derivation source documents.
                </p>
            </div>
        </div>

        <div className="flex flex-col items-end gap-4">
            {getStatusBadge(request.overallStatus)}
            {typeof request.progress === "number" && (
                <div className="space-y-2 w-full min-w-[240px]">
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Audit Depth</span>
                        <span className="text-xs font-black text-primary">{request.progress}%</span>
                    </div>
                    <Progress value={request.progress} className="h-1.5 bg-muted rounded-full" />
                </div>
            )}
            <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">
                <Clock className="w-3.5 h-3.5" />
                Derivation Log: {new Date(request.createdAt).toLocaleString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Sidebar Dossier */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-background rounded-[2.5rem] border border-border shadow-2xl shadow-primary/5 p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[4rem] transition-all duration-700 -z-0" />
            
            <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-background font-black text-3xl shadow-xl group-hover:scale-105 transition-all duration-500">
                        {request.partnerInfo?.fullName?.charAt(0) || "P"}
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Associate Entity</p>
                        <h3 className="text-xl font-black text-foreground uppercase tracking-tight truncate max-w-[180px]">
                            {request.partnerInfo?.fullName}
                        </h3>
                        <p className="text-xs font-bold text-muted-foreground truncate font-mono mt-1">
                            {request.partnerInfo?.email}
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <h4 className="text-[10px] font-black text-foreground uppercase tracking-[0.2em]">Verified Attributes</h4>
                    </div>
                    
                    {[
                        { label: 'Secure Line', value: request.partnerInfo?.phone, icon: Phone },
                        { label: 'PAN Registry', value: request.partnerInfo?.panNumber, icon: Shield },
                        { label: 'Aadhaar ID', value: request.partnerInfo?.aadhaarNumber, icon: Building2 },
                    ].map((item, idx) => item.value && (
                        <div key={idx} className="flex justify-between items-center py-2 border-b border-border/40 last:border-0">
                            <div className="flex items-center gap-3">
                                <item.icon className="w-3.5 h-3.5 text-muted-foreground opacity-50" />
                                <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">{item.label}</span>
                            </div>
                            <span className="text-xs font-black text-foreground uppercase tracking-tight">{item.value}</span>
                        </div>
                    ))}
                </div>

                <div className="p-6 rounded-2xl bg-muted/20 border border-border/50 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-background border border-border text-primary shadow-sm">
                        <Lock className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-foreground uppercase tracking-widest">Read-Only Snapshot</p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-60">Verified derivative record</p>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Content Tier */}
        <div className="lg:col-span-8 space-y-10">
          {/* Document Audit Registry */}
          <div className="bg-background rounded-[2.5rem] border border-border shadow-2xl shadow-primary/5 overflow-hidden">
            <div className="px-10 py-8 border-b border-border bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Dossier Assets</h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Snapshot Evidence Registry</p>
                    </div>
                </div>
                <Badge variant="outline" className="bg-background font-black text-[10px] tracking-widest uppercase py-1 px-4 border-border">
                    {request.documents?.length || 0} ASSETS DERIVED
                </Badge>
            </div>

            <div className="p-6">
                {request.documents && request.documents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {request.documents.map((doc, idx) => (
                            <div
                                key={doc._id || idx}
                                className={`group p-6 rounded-3xl border transition-all duration-500 cursor-pointer ${selectedDocument?._id === doc._id ? 'bg-primary border-primary shadow-xl shadow-primary/20 scale-[1.02]' : 'bg-muted/30 border-border hover:bg-muted/50 hover:border-border/80'}`}
                                onClick={() => {
                                    setSelectedDocument(doc);
                                    document.getElementById('audit-viewport')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className={`p-3 rounded-2xl transition-colors duration-500 ${selectedDocument?._id === doc._id ? 'bg-background/20 text-background' : 'bg-primary/10 text-primary'}`}>
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <Badge variant="outline" className={`font-black text-[9px] uppercase tracking-widest border-0 px-2 py-0.5 ${selectedDocument?._id === doc._id ? 'bg-background/20 text-background border-transparent' : 'bg-background text-foreground'}`}>
                                        {doc.status || "PENDING"}
                                    </Badge>
                                </div>
                                
                                <div className="space-y-1">
                                    <h4 className={`text-sm font-black uppercase tracking-tight truncate ${selectedDocument?._id === doc._id ? 'text-background' : 'text-foreground'}`}>
                                        {doc.type.replace(/_/g, " ")}
                                    </h4>
                                    <p className={`text-[10px] font-bold truncate opacity-60 font-mono ${selectedDocument?._id === doc._id ? 'text-background' : 'text-muted-foreground'}`}>
                                        {doc.name}
                                    </p>
                                </div>

                                <div className="mt-6 flex justify-between items-center">
                                    <span className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${selectedDocument?._id === doc._id ? 'text-background' : 'text-primary'}`}>
                                        {selectedDocument?._id === doc._id ? 'Auditing' : 'View Asset'}
                                        <ChevronRight className="w-3 h-3" />
                                    </span>
                                    {selectedDocument?._id === doc._id && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-background animate-pulse" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center">
                        <div className="w-20 h-20 bg-muted rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner text-muted-foreground/20">
                            <AlertCircle className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-black text-foreground uppercase tracking-tight mb-2">No Assets Linked</h3>
                        <p className="text-muted-foreground font-bold text-sm max-w-xs mx-auto">No documentation has been linked for this snapshot audit.</p>
                    </div>
                )}
            </div>
          </div>

          {/* Secure Audit Viewport */}
          <div id="audit-viewport" className="space-y-6">
              {selectedDocument ? (
                <div className="bg-background rounded-[2.5rem] border border-border shadow-2xl p-10 animate-in fade-in slide-in-from-top-4 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
                    
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-primary text-background flex items-center justify-center shadow-xl shadow-primary/20">
                                <FileIcon className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-foreground uppercase tracking-tight flex items-center gap-3">
                                    Audit <span className="text-primary italic">Viewport</span>
                                </h3>
                                <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-widest">
                                    Analyzing: {selectedDocument.type}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-3">
                            <div className="flex gap-3">
                                <Badge variant="outline" className="bg-background font-black text-[9px] uppercase tracking-[0.2em] border-border px-3 py-1">
                                    SECURE READ-ONLY
                                </Badge>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSelectedDocument(null)}
                                    className="rounded-xl hover:bg-destructive/10 hover:text-destructive transition-all"
                                >
                                    <X className="w-6 h-6" />
                                </Button>
                            </div>
                            <div className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
                                DERIVED: {new Date(selectedDocument.uploadedAt || Date.now()).toLocaleString()}
                            </div>
                        </div>
                    </div>

                    <div className="bg-muted/10 rounded-2xl border border-border overflow-hidden min-h-[400px] flex flex-col">
                        <div className="flex-1 relative flex items-center justify-center p-4">
                            {selectedDocument.fileUrl ? (
                                <>
                                    {isImageFile(selectedDocument.fileUrl) ? (
                                        <img
                                            src={getFullUrl(selectedDocument.fileUrl)}
                                            alt={selectedDocument.name}
                                            className="max-w-full max-h-[600px] object-contain rounded-xl shadow-2xl animate-in fade-in duration-500"
                                        />
                                    ) : isPDFFile(selectedDocument.fileUrl) ? (
                                        <iframe
                                            src={getFullUrl(selectedDocument.fileUrl)}
                                            className="w-full h-[600px] rounded-xl border-0 bg-white shadow-2xl"
                                            title={selectedDocument.name}
                                        />
                                    ) : isVideoFile(selectedDocument.fileUrl) ? (
                                        <video
                                            src={getFullUrl(selectedDocument.fileUrl)}
                                            controls
                                            className="w-full h-auto max-h-[600px] rounded-xl bg-black shadow-2xl"
                                        />
                                    ) : (
                                        <div className="py-24 text-center space-y-5">
                                            <div className="w-20 h-20 bg-background rounded-3xl border border-border flex items-center justify-center mx-auto shadow-sm text-muted-foreground/30">
                                                <FileText className="w-10 h-10" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-foreground uppercase tracking-widest mb-1">Preview Protocol Error</p>
                                                <p className="text-xs font-bold text-muted-foreground uppercase opacity-60">Unsupported derivation binary</p>
                                            </div>
                                            <Button
                                                asChild
                                                className="bg-primary hover:bg-primary/90 h-12 px-8 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg"
                                            >
                                                <a href={getFullUrl(selectedDocument.fileUrl)} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="w-4 h-4 mr-2" />
                                                    Force Access
                                                </a>
                                            </Button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center">
                                    <AlertCircle className="w-12 h-12 text-destructive/30 mx-auto mb-4" />
                                    <p className="text-sm font-black text-foreground uppercase tracking-widest">Binary Reference Missing</p>
                                </div>
                            )}
                        </div>

                        {selectedDocument.rejectionReason && (
                            <div className="m-6 p-5 bg-destructive/5 border border-destructive/20 rounded-2xl">
                                <p className="text-[10px] font-black text-destructive uppercase tracking-widest flex items-center gap-2 mb-2">
                                    <XCircle className="w-4 h-4" />
                                    Security Audit Refusal Reason
                                </p>
                                <p className="text-xs font-bold text-destructive/80 leading-relaxed uppercase opacity-80">
                                    {selectedDocument.rejectionReason}
                                </p>
                            </div>
                        )}

                        {selectedDocument.fileUrl && (
                            <div className="p-6 bg-muted/30 border-t border-border flex justify-end gap-3">
                                <Button
                                    variant="outline"
                                    asChild
                                    className="h-12 px-6 rounded-xl border-border bg-background font-black uppercase text-[10px] tracking-widest hover:bg-muted/50 transition-all"
                                >
                                    <a href={getFullUrl(selectedDocument.fileUrl)} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        Expose
                                    </a>
                                </Button>
                                <Button
                                    asChild
                                    className="h-12 px-6 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-black uppercase text-[10px] tracking-widest shadow-lg transition-all"
                                >
                                    <a href={getFullUrl(selectedDocument.fileUrl)} download>
                                        <Download className="w-4 h-4 mr-2" />
                                        Extract
                                    </a>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
              ) : (
                <div className="bg-muted/10 rounded-[2.5rem] border border-dashed border-border p-24 text-center">
                    <div className="w-24 h-24 bg-muted rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner text-muted-foreground/10">
                         <Shield className="w-12 h-12" />
                    </div>
                    <h3 className="text-xl font-black text-muted-foreground/40 uppercase tracking-[0.3em]">Snapshot Viewport Offline</h3>
                    <p className="text-muted-foreground/40 font-bold text-xs mt-4 uppercase tracking-widest">Select an evidence asset from the dossier to begin analysis</p>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
