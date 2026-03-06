import { API_CONFIG } from "@/config/api.config";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { adminService, KYCData } from "@/services/admin.service";
import { toast } from "sonner";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileText,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
  XCircle,
  AlertCircle,
  ExternalLink,
  Building2,
  X,
  ChevronRight,
  RefreshCw,
  LayoutDashboard
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function KYCDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const [kycData, setKycData] = useState<KYCData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchKYCDetails(id);
    }
  }, [id]);

  const getFullFileUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${API_CONFIG.BASE_URL}${cleanPath}`;
  };

  const renderPreview = (doc: any) => {
    if (!doc?.fileUrl) return null;
    const url = getFullFileUrl(doc.fileUrl);
    const ext = doc.fileUrl.split(".").pop()?.toLowerCase();
    const isVideo = ["mp4", "webm", "mov", "avi"].includes(ext || "");
    const isImage = ["jpg", "jpeg", "png", "webp"].includes(ext || "");
    const isPdf = ext === "pdf";

    return (
      <div className="relative min-h-[400px] flex items-center justify-center bg-background/50 rounded-2xl border border-dashed border-border overflow-hidden">
        {isVideo ? (
          <video
            src={url}
            controls
            className="w-full rounded-xl max-h-[600px] bg-black shadow-2xl"
          >
            Your browser does not support the video tag.
          </video>
        ) : isImage ? (
          <img
            src={url}
            alt="KYC Document"
            className="max-w-full max-h-[600px] rounded-xl object-contain animate-in fade-in duration-500 shadow-2xl"
          />
        ) : isPdf ? (
          <iframe
            src={url}
            className="w-full h-[600px] rounded-xl border border-border bg-white shadow-2xl"
            title="PDF Preview"
          ></iframe>
        ) : (
          <div className="py-20 text-center space-y-5">
            <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mx-auto shadow-inner text-muted-foreground/30">
              <FileText className="w-10 h-10" />
            </div>
            <div>
              <p className="text-sm font-black text-foreground uppercase tracking-widest mb-1">Preview Unavailable</p>
              <p className="text-xs font-bold text-muted-foreground">Unsupported format for direct audit</p>
            </div>
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 rounded-xl px-8 font-black uppercase text-[10px] tracking-widest shadow-lg"
            >
              <a href={url} target="_blank" rel="noopener noreferrer">
                <Download className="w-4 h-4 mr-2" />
                Extract Asset
              </a>
            </Button>
          </div>
        )}
      </div>
    );
  };

  const fetchKYCDetails = async (kycId: string) => {
    setLoading(true);
    try {
      let response;
      if (type === "partner") {
        response = await adminService.getPartnerDetails(kycId);
      } else if (type === "business" || type === "businessinfo") {
        response = await adminService.getBusinessInfoById(kycId);
      } else if (type === "property") {
        response = await adminService.getKYCDetails(kycId);
      } else {
        response = await adminService.getKYCDetails(kycId);
      }
      if (response.success && response.data) {
        setKycData(response.data);
      } else {
        toast.error("Failed to load KYC details");
        navigate(-1);
      }
    } catch (error) {
      console.error("Error fetching KYC details:", error);
      toast.error("Error fetching KYC details");
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentAction = async (
    docId: string,
    action: "approve" | "reject",
    reason?: string,
  ) => {
    if (!id) return;
    setProcessing(true);
    try {
      const response = await adminService.reviewKYCDocument(
        id,
        docId,
        action,
        reason,
      );
      if (response.success) {
        toast.success(`Document ${action}ed successfully`);
        fetchKYCDetails(id); // Refresh data
        if (action === "reject") {
          setShowRejectModal(false);
          setRejectionReason("");
          setSelectedDocId(null);
        }
      } else {
        toast.error(response.message || `Failed to ${action} document`);
      }
    } catch (error) {
      console.error(`Error ${action}ing document:`, error);
      toast.error(`Failed to ${action} document`);
    } finally {
      setProcessing(false);
    }
  };

  const handleApproveKYC = () => {
    setShowApproveModal(true);
  };

  const performApproveKYC = async () => {
    if (!id) return;

    setProcessing(true);
    try {
      let response;
      if (type === "business") {
        response = await adminService.updateBusinessInfoStatus(id, "approve");
      } else if (type === "partner") {
        response = await adminService.updatePartnerStatus(id, "approve");
      } else {
        response = await adminService.reviewKYC(id, "approve");
      }
      if (response.success) {
        toast.success("KYC approved successfully");
        navigate(-1);
      } else {
        toast.error(response.message || "Failed to approve KYC");
      }
    } catch (error) {
      console.error("Error approving KYC:", error);
      toast.error("Failed to approve KYC");
    } finally {
      setProcessing(false);
      setShowApproveModal(false);
    }
  };

  const handleRejectKYC = () => {
    setRejectionReason("");
    setSelectedDocId("kyc"); // Special ID for full KYC rejection
    setShowRejectModal(true);
  };

  const openRejectModal = (docId: string) => {
    setSelectedDocId(docId);
    setShowRejectModal(true);
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { className: string, icon: any, label: string }> = {
      approved: { className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", icon: CheckCircle2, label: "Verified" },
      rejected: { className: "bg-destructive/10 text-destructive border-destructive/20", icon: XCircle, label: "Rejected" },
      pending: { className: "bg-amber-500/10 text-amber-600 border-amber-500/20", icon: Clock, label: "Pending" }
    };
    const c = config[status] || config.pending;
    return (
      <Badge variant="outline" className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${c.className}`}>
        <c.icon className="w-3.5 h-3.5" />
        {c.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8">
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl border-4 border-primary/20 border-t-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-primary/40" />
          </div>
        </div>
        <p className="mt-8 text-sm font-black text-muted-foreground uppercase tracking-[0.2em] animate-pulse">
          Accessing Restricted Files...
        </p>
      </div>
    );
  }

  if (!kycData) return null;

  const isCompany = kycData.kycType === "business";

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
            Return to Audit queue
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-black uppercase tracking-widest">
                Security Phase 03
              </Badge>
              <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">KYC AUDIT: {kycData._id}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter uppercase italic">
              Identity <span className="text-primary not-italic">Verification</span>
            </h1>
            <p className="text-muted-foreground font-bold mt-4 max-w-lg text-sm leading-relaxed">
              Perform deep documentation analysis and verified identity auditing for partner profile activation.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-4">
          {getStatusBadge(kycData.overallStatus)}
          <div className="space-y-2 w-full min-w-[240px]">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Verification Depth</span>
              <span className="text-xs font-black text-primary">{kycData.progress || 0}%</span>
            </div>
            <Progress value={kycData.progress || 0} className="h-1.5 bg-muted rounded-full" />
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">
            <Calendar className="w-3.5 h-3.5" />
            Submitted: {new Date(kycData.createdAt).toLocaleDateString(undefined, {
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
        {/* Profile Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          {/* Associate Profile Dossier */}
          <div className="bg-background rounded-[2.5rem] border border-border shadow-2xl shadow-primary/5 p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[4rem] group-hover:w-40 group-hover:h-40 transition-all duration-700 -z-0" />

            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-background font-black text-3xl shadow-xl group-hover:scale-105 transition-all duration-500">
                  {kycData.user.fullName.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">
                    {type === "property" ? "Property Owner" : "Main Account Associate"}
                  </p>
                  <h3 className="text-xl font-black text-foreground truncate uppercase group-hover:text-primary transition-colors">
                    {kycData.user.fullName}
                  </h3>
                  <p className="text-xs font-bold text-muted-foreground truncate font-mono mt-1">
                    {kycData.user.email}
                  </p>
                </div>
              </div>

              {kycData.profileName && (
                <div className="p-4 rounded-xl bg-muted/30 border border-border/50 flex items-center justify-between">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Active Profile</span>
                  <Badge variant="outline" className="font-mono text-[10px] border-primary/20 text-primary">
                    {kycData.profileName}
                  </Badge>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <h4 className="text-[10px) font-black text-foreground uppercase tracking-[0.2em]">Biometric Identity</h4>
                </div>

                {[
                  { label: 'Identifier', value: kycData.personalInfo?.fullName, icon: User },
                  { label: 'Secure Line', value: kycData.personalInfo?.phone, icon: Phone },
                  { label: 'Pan Archival', value: kycData.personalInfo?.panNumber, icon: Shield },
                  { label: 'Aadhaar Registry', value: kycData.personalInfo?.aadhaarNumber, icon: Building2 },
                  { label: 'Birth Log', value: kycData.personalInfo?.dateOfBirth ? new Date(kycData.personalInfo.dateOfBirth).toLocaleDateString() : null, icon: Calendar }
                ].map((item, idx) => item.value && (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-border/40 last:border-0 group/item">
                    <div className="flex items-center gap-3">
                      <item.icon className="w-3.5 h-3.5 text-muted-foreground group-hover/item:text-primary transition-colors" />
                      <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">{item.label}</span>
                    </div>
                    <span className="text-xs font-black text-foreground uppercase tracking-tight">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Business Entity Dossier */}
          {isCompany && kycData.businessInfo && (
            <div className="bg-background rounded-[2.5rem] border border-border shadow-2xl p-8 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600 shadow-inner">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Business Registry</h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Corporate Metadata</p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="p-6 rounded-2xl bg-muted/20 border border-border/50">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">Corporate Legal Name</p>
                  <p className="text-lg font-black text-foreground leading-tight">{kycData.businessInfo.companyName}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Entity Level', value: kycData.businessInfo.companyType },
                    { label: 'GST Identity', value: kycData.businessInfo.gstNumber },
                    { label: 'CIN Registry', value: kycData.businessInfo.cinNumber }
                  ].map((item, idx) => item.value && (
                    <div key={idx} className="p-4 rounded-xl bg-muted/30 border border-border/40">
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">{item.label}</p>
                      <p className="text-xs font-black text-foreground uppercase truncate">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="p-6 rounded-2xl bg-muted/10 border border-border/30">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-primary opacity-50" />
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Registered HQ</p>
                  </div>
                  <p className="text-sm font-bold text-foreground leading-relaxed italic opacity-80">
                    {kycData.businessInfo.registeredAddress || "ARCHIVE_NOT_FOUND"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Operation Directive Card */}
          {kycData.overallStatus !== "rejected" && kycData.overallStatus !== "approved" && (
            <div className="bg-foreground rounded-[2.5rem] p-8 shadow-2xl shadow-primary/20 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <h3 className="text-xs font-black text-background uppercase tracking-[0.3em]">Final Operation</h3>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={handleRejectKYC}
                  disabled={processing}
                  className="w-full h-16 rounded-2xl bg-background/5 text-destructive border border-destructive/30 hover:bg-destructive/10 font-black uppercase text-[10px] tracking-[0.2em] transition-all"
                >
                  <XCircle className="w-4 h-4 mr-3" />
                  Terminate Application
                </Button>

                <Button
                  onClick={handleApproveKYC}
                  disabled={
                    processing ||
                    !kycData.documents?.every((doc) => doc.status === "approved")
                  }
                  className="w-full h-16 rounded-2xl bg-primary text-background hover:bg-primary/90 font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-primary/30 transition-all disabled:opacity-30"
                >
                  <CheckCircle2 className="w-4 h-4 mr-3" />
                  Authorize Associate
                </Button>

                {!kycData.documents?.every((doc) => doc.status === "approved") && (
                  <div className="bg-background/5 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] font-bold text-amber-500/80 leading-relaxed uppercase tracking-widest">
                      Protocol Error: Comprehensive asset audit required before authorization.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Audit Core Area */}
        <div className="lg:col-span-8 space-y-10">
          {/* Documentation Table */}
          <div className="bg-background rounded-[2.5rem] border border-border shadow-2xl overflow-hidden">
            <div className="px-10 py-8 border-b border-border bg-muted/20 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Document Audit</h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Secure Asset Registry</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-background font-black text-[10px] tracking-widest uppercase py-1 px-4 border-border">
                {kycData.documents?.length || 0} ASSETS LOADED
              </Badge>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/10">
                    <th className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Asset Category</th>
                    <th className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Audit Status</th>
                    <th className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {kycData.documents && kycData.documents.length > 0 ? (
                    kycData.documents.map((doc: any, index: number) => (
                      <tr
                        key={doc._id || index}
                        className={`group transition-all duration-300 ${selectedDoc?._id === doc._id ? 'bg-primary/5' : 'hover:bg-muted/30'}`}
                      >
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-5">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 ${selectedDoc?._id === doc._id ? 'bg-primary text-background' : 'bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary'}`}>
                              <FileText className="w-7 h-7" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-black text-foreground uppercase tracking-tight truncate max-w-[240px]">
                                {doc.name || doc.type.replace(/_/g, " ")}
                              </p>
                              <p className="text-[10px] font-bold text-muted-foreground truncate max-w-[200px] font-mono mt-1 opacity-60">
                                {doc.fileUrl?.split("/").pop()}
                              </p>
                              {doc.rejectionReason && doc.status === "rejected" && (
                                <div className="mt-2 flex items-center gap-2 text-[10px] font-black text-destructive uppercase tracking-widest">
                                  <XCircle className="w-3.5 h-3.5" />
                                  Reason: {doc.rejectionReason}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          {getStatusBadge(doc.status || "pending")}
                        </td>
                        <td className="px-10 py-8 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {doc.status !== "approved" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDocumentAction(doc._id, "approve")}
                                disabled={processing}
                                className="h-10 rounded-xl border-emerald-500/30 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest px-4 shadow-sm"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 mr-2" /> Accept
                              </Button>
                            )}

                            {doc.status !== "rejected" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openRejectModal(doc._id)}
                                disabled={processing}
                                className="h-10 rounded-xl border-destructive/30 text-destructive hover:bg-destructive hover:text-white transition-all font-black text-[10px] uppercase tracking-widest px-4 shadow-sm"
                              >
                                <XCircle className="w-3.5 h-3.5 mr-2" /> Reject
                              </Button>
                            )}

                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                setSelectedDoc(doc);
                                document.getElementById('audit-viewport')?.scrollIntoView({ behavior: 'smooth' });
                              }}
                              className={`h-10 rounded-xl font-black text-[10px] uppercase tracking-widest px-5 shadow-lg flex items-center gap-3 transition-all ${selectedDoc?._id === doc._id ? 'bg-primary text-background' : 'bg-foreground text-background hover:bg-foreground/90'}`}
                            >
                              {selectedDoc?._id === doc._id ? <ExternalLink className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              {selectedDoc?._id === doc._id ? 'Auditing' : 'Audit'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-24 text-center">
                        <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                          <Shield className="w-10 h-10 text-muted-foreground/20" />
                        </div>
                        <h3 className="text-xl font-black text-foreground uppercase tracking-tight mb-2">Registry Empty</h3>
                        <p className="text-muted-foreground font-bold text-sm">No documentation has been logged for this identity.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Secure Viewport Tier */}
          <div id="audit-viewport" className="space-y-6">
            {selectedDoc ? (
              <div className="bg-background rounded-[2.5rem] border border-border shadow-2xl p-10 animate-in fade-in slide-in-from-top-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />

                <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-primary text-background flex items-center justify-center shadow-xl shadow-primary/20">
                      <Shield className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-foreground uppercase tracking-tight flex items-center gap-3">
                        Audit <span className="text-primary italic">Viewport</span>
                      </h3>
                      <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-widest">
                        Analyzing: {selectedDoc.name || selectedDoc.type}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="flex gap-3">
                      <Badge variant="outline" className="bg-background font-black text-[9px] uppercase tracking-[0.2em] border-border px-3 py-1">
                        SECURE STREAM
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedDoc(null)}
                        className="rounded-xl hover:bg-destructive/10 hover:text-destructive transition-all"
                      >
                        <X className="w-6 h-6" />
                      </Button>
                    </div>
                    <div className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
                      ARCHIVE LOG: {new Date(selectedDoc.uploadedAt || Date.now()).toLocaleString()}
                    </div>
                  </div>
                </div>

                {selectedDoc.status === "rejected" && (
                  <div className="mb-10 p-5 rounded-2xl bg-destructive/5 border border-destructive/20 flex items-center gap-4 animate-pulse">
                    <div className="p-2 bg-destructive rounded-lg text-background shadow-lg shadow-destructive/20">
                      <XCircle className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-black text-destructive uppercase tracking-widest">This asset has failed previous security audits.</p>
                  </div>
                )}

                {renderPreview(selectedDoc)}

                <div className="mt-10 flex flex-col sm:flex-row gap-4 pt-10 border-t border-border">
                  <Button
                    variant="outline"
                    asChild
                    className="flex-1 h-16 rounded-2xl border-border font-black uppercase text-[10px] tracking-widest hover:bg-muted/50 transition-all"
                  >
                    <a href={getFullFileUrl(selectedDoc.fileUrl)} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-3" />
                      Force External Access
                    </a>
                  </Button>
                  <Button
                    asChild
                    className="flex-1 h-16 rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-black uppercase text-[10px] tracking-widest shadow-xl transition-all"
                  >
                    <a href={getFullFileUrl(selectedDoc.fileUrl)} download>
                      <Download className="w-4 h-4 mr-3" />
                      Local Extraction
                    </a>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-muted/10 rounded-[2.5rem] border border-dashed border-border p-24 text-center">
                <div className="w-24 h-24 bg-muted rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner text-muted-foreground/10 group">
                  <Shield className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-black text-muted-foreground/40 uppercase tracking-[0.3em]">Standalone Viewport Offline</h3>
                <p className="text-muted-foreground/40 font-bold text-xs mt-4 uppercase tracking-widest">Select an asset from the identity dossier to begin audit</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Operation: Terminate Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[200] p-4 backdrop-blur-xl bg-background/80">
          <div className="bg-background rounded-[2.5rem] border border-border shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-border bg-destructive/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive shadow-inner">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-foreground uppercase tracking-tight">
                    Audit <span className="text-destructive italic">Rejection</span>
                  </h3>
                  <p className="text-[10px] font-bold text-muted-foreground mt-0.5 uppercase tracking-widest">
                    {selectedDocId === "kyc" ? "TERMINATING IDENTITY DOSSIER" : "REJECTING INDIVIDUAL ASSET"}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowRejectModal(false)} className="rounded-xl hover:bg-destructive/10 hover:text-destructive">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Reason for Violation</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Specify clear documentation failures or security concerns..."
                  className="w-full h-40 px-5 py-4 bg-muted/30 border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-destructive/10 focus:border-destructive transition-all text-sm font-bold resize-none custom-scrollbar"
                />
                <p className="text-[10px] font-bold text-muted-foreground/60 italic ml-1">* This directive will be logged and transmitted to the partner.</p>
              </div>
            </div>

            <div className="p-8 border-t border-border bg-muted/40 flex gap-4">
              <Button
                variant="outline"
                onClick={() => setShowRejectModal(false)}
                className="flex-1 h-14 rounded-2xl border-border font-black uppercase text-[10px] tracking-widest hover:bg-background transition-all"
              >
                ABORT
              </Button>
              <Button
                onClick={async () => {
                  if (rejectionReason) {
                    if (selectedDocId === "kyc") {
                      setProcessing(true);
                      try {
                        let response;
                        if (type === "business") {
                          response = await adminService.updateBusinessInfoStatus(id!, "reject", rejectionReason);
                        } else if (type === "partner") {
                          response = await adminService.updatePartnerStatus(id!, "reject", rejectionReason);
                        } else {
                          response = await adminService.reviewKYC(id!, "reject", rejectionReason);
                        }
                        if (response.success) {
                          toast.success("KYC rejected successfully");
                          navigate(-1);
                        } else {
                          toast.error(response.message || "Failed to reject KYC");
                        }
                      } catch (error) {
                        console.error("Error rejecting KYC:", error);
                        toast.error("Failed to reject KYC");
                      } finally {
                        setProcessing(false);
                        setShowRejectModal(false);
                      }
                    } else if (selectedDocId) {
                      handleDocumentAction(selectedDocId, "reject", rejectionReason);
                    }
                  }
                }}
                disabled={!rejectionReason.trim() || processing}
                className="flex-1 h-14 rounded-2xl bg-destructive text-destructive-foreground hover:bg-destructive/90 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-destructive/20 transition-all disabled:opacity-50"
              >
                {processing ? "PROCESSING..." : "CONFIRM TERMINATION"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Operation: Authorize Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[200] p-4 backdrop-blur-xl bg-background/80">
          <div className="bg-background rounded-[2.5rem] border border-border shadow-2xl max-sm w-full overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-10 text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto shadow-inner border border-emerald-500/20">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 animate-in zoom-in-50 duration-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-foreground uppercase tracking-tight">
                  Authorize <span className="text-emerald-600 italic">Associate?</span>
                </h3>
                <p className="text-xs font-bold text-muted-foreground leading-relaxed uppercase tracking-widest px-4 opacity-70">
                  Are you certain you want to grant full associate network access to this identity dossier?
                </p>
              </div>
            </div>

            <div className="p-8 border-t border-border bg-muted/40 flex flex-col gap-3">
              <Button
                onClick={performApproveKYC}
                className="w-full h-14 rounded-2xl bg-emerald-600 text-background hover:bg-emerald-700 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-500/20 transition-all"
                disabled={processing}
              >
                {processing ? "AUTHORIZING..." : "CONFIRM AUTHORIZATION"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowApproveModal(false)}
                className="w-full h-12 rounded-2xl text-muted-foreground font-black uppercase text-[10px] tracking-widest hover:bg-background"
                disabled={processing}
              >
                ABORT MISSION
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
