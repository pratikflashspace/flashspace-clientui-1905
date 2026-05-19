import { useState, useEffect, useRef } from "react";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  CreditCard,
  ShieldCheck,
  ShieldAlert,
  Clock,
  ExternalLink,
  Upload,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Download,
  Eye,
  Settings,
  User as UserIcon,
  X,
  Save,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { getSafeImageUrl } from "@/utils/imageUrl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import * as spacePartnerService from "@/services/spacePortal/spacePartner.service";

export default function Profile() {
  const { user } = useAuth();
  const [kycData, setKycData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form states for edits
  const [editForm, setEditForm] = useState({
    companyName: "",
    registeredAddress: "",
    contactPhone: "",
    gstNumber: "",
    panNumber: "",
  });

  const [bankForm, setBankForm] = useState({
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    branch: "",
    accountType: "Current Account",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const resp = await spacePartnerService.fetchMyKyc();
      if (resp.success && resp.data) {
        setKycData(resp.data);
        const data = resp.data;
        setEditForm({
          companyName: data.companyName || "",
          registeredAddress: data.registeredAddress || "",
          contactPhone: data.contactPhone || user?.phoneNumber || "",
          gstNumber: data.gstNumber || "",
          panNumber: data.panNumber || "",
        });
        setBankForm({
          accountHolderName: data.accountHolderName || "",
          bankName: data.bankName || "",
          accountNumber: data.accountNumber || "",
          ifscCode: data.ifscCode || "",
          branch: data.branch || "",
          accountType: data.accountType || "Current Account",
        });
      }
    } catch (error) {
      console.error("Error fetching KYC data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBusiness = async () => {
    try {
      const resp = await spacePartnerService.updateKycBusiness(editForm);
      if (resp.success) {
        toast.success("Business information updated successfully");
        setIsEditingBusiness(false);
        fetchData();
      }
    } catch (error) {
      toast.error("Failed to update business information");
    }
  };

  const handleUpdateBank = async () => {
    try {
      const resp = await spacePartnerService.updateKycBank(bankForm);
      if (resp.success) {
        toast.success("Bank information updated successfully");
        setIsEditingBank(false);
        fetchData();
      }
    } catch (error) {
      toast.error("Failed to update bank information");
    }
  };

  const handleFileUpload = async (documentType: string, file: File) => {
    try {
      setIsUploading(true);
      const resp = await spacePartnerService.uploadKycDoc(documentType, file);
      if (resp.success) {
        toast.success("Document uploaded successfully");
        fetchData();
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 py-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#35503F] tracking-tight">
            Profile & <span className="text-[#4A6D56] italic">KYC</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your company profile and KYC documents
          </p>
        </div>
      </div>

      <Tabs defaultValue="company" className="w-full">
        <TabsList className="bg-muted/50 p-1 rounded-2xl border border-border/50 mb-4 inline-flex">
          <TabsTrigger value="company" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm font-bold text-sm transition-all">
            Company Profile
          </TabsTrigger>
          <TabsTrigger value="kyc" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm font-bold text-sm transition-all">
            KYC Documents
          </TabsTrigger>
          <TabsTrigger value="bank" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm font-bold text-sm transition-all">
            Bank Details
          </TabsTrigger>
        </TabsList>

        {/* --- COMPANY PROFILE TAB --- */}
        <TabsContent value="company">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="border border-primary/20 shadow-xl shadow-primary/5 rounded-3xl overflow-hidden bg-background">
            <CardHeader className="px-10 pt-10 pb-6 flex flex-row items-center justify-between border-b border-border/50">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-black">Company Information</CardTitle>
                <CardDescription className="font-medium text-sm">Your primary business identification and contact details</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                {isEditingBusiness ? (
                  <>
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        setIsEditingBusiness(false);
                        fetchData(false);
                      }}
                      className="rounded-2xl font-bold flex items-center gap-2"
                    >
                      <X className="w-4 h-4" /> Cancel
                    </Button>
                    <Button 
                      onClick={handleUpdateBusiness}
                      className="rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20"
                    >
                      <Save className="w-4 h-4" /> Save Changes
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditingBusiness(true)}
                    className="rounded-2xl border-2 font-bold flex items-center gap-2 hover:bg-primary/5 hover:border-primary/30 transition-all"
                  >
                    <Edit3 className="w-4 h-4" /> Edit Details
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EditableBlock 
                  label="Company Name" 
                  value={editForm.companyName} 
                  isEditing={isEditingBusiness}
                  onChange={(val) => setEditForm({...editForm, companyName: val})}
                  icon={Building2} 
                />
                <InfoBlock label="Contact Email" value={user?.email || "Not Set"} icon={Mail} />
                <EditableBlock 
                  label="Contact Phone" 
                  value={editForm.contactPhone} 
                  isEditing={isEditingBusiness}
                  onChange={(val) => setEditForm({...editForm, contactPhone: val})}
                  icon={Phone} 
                />
                <div className="md:col-span-2">
                   <EditableBlock 
                    label="Registered Address" 
                    value={editForm.registeredAddress} 
                    isEditing={isEditingBusiness}
                    onChange={(val) => setEditForm({...editForm, registeredAddress: val})}
                    icon={MapPin} 
                  />
                </div>
                <EditableBlock 
                  label="GST Number" 
                  value={editForm.gstNumber} 
                  isEditing={isEditingBusiness}
                  onChange={(val) => setEditForm({...editForm, gstNumber: val})}
                  icon={FileText} 
                />
                <EditableBlock 
                  label="PAN Number" 
                  value={editForm.panNumber} 
                  isEditing={isEditingBusiness}
                  onChange={(val) => setEditForm({...editForm, panNumber: val})}
                  icon={FileText} 
                />
              </div>
            </CardContent>
          </Card>
          </motion.div>
        </TabsContent>

        {/* --- KYC DOCUMENTS TAB --- */}
        <TabsContent value="kyc">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="border border-primary/20 shadow-xl shadow-primary/5 rounded-3xl overflow-hidden bg-background">
            <CardHeader className="px-10 pt-10 pb-6 flex flex-row items-center justify-between border-b border-border/50">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-black">KYC Documents</CardTitle>
                <CardDescription className="font-medium text-sm">Upload and manage your verification documents</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
               <DocumentRow 
                title="Company Registration Certificate" 
                status={kycData?.companyRegistrationStatus} 
                date={kycData?.companyRegistrationUrl ? "Uploaded" : "Not Uploaded"}
                url={kycData?.companyRegistrationUrl}
                onUpload={(file) => handleFileUpload("company_registration", file)}
              />
              <DocumentRow 
                title="GST Registration Certificate" 
                status={kycData?.gstCertificateStatus} 
                date={kycData?.gstCertificateUrl ? "Uploaded" : "Not Uploaded"}
                url={kycData?.gstCertificateUrl}
                onUpload={(file) => handleFileUpload("gst_certificate", file)}
              />
              <DocumentRow 
                title="PAN Card" 
                status={kycData?.panImageStatus} 
                date={kycData?.panImageUrl ? "Uploaded" : "Not Uploaded"}
                url={kycData?.panImageUrl}
                onUpload={(file) => handleFileUpload("pan_image", file)}
              />
              <DocumentRow 
                title="Bank Account Details" 
                status={kycData?.bankDetailsProofStatus} 
                date={kycData?.bankDetailsProofUrl ? "Uploaded" : "Not Uploaded"}
                url={kycData?.bankDetailsProofUrl}
                onUpload={(file) => handleFileUpload("bank_details_proof", file)}
              />
            </CardContent>
          </Card>
          </motion.div>
        </TabsContent>

        {/* --- BANK DETAILS TAB --- */}
        <TabsContent value="bank">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="border border-primary/20 shadow-xl shadow-primary/5 rounded-3xl overflow-hidden bg-background">
            <CardHeader className="px-10 pt-10 pb-6 flex flex-row items-center justify-between border-b border-border/50">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-black">Bank Account Details</CardTitle>
                <CardDescription className="font-medium text-sm">Information where you'll receive your payouts</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                {isEditingBank ? (
                  <>
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        setIsEditingBank(false);
                        fetchData(false);
                      }}
                      className="rounded-2xl font-bold flex items-center gap-2"
                    >
                      <X className="w-4 h-4" /> Cancel
                    </Button>
                    <Button 
                      onClick={handleUpdateBank}
                      className="rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20"
                    >
                      <Save className="w-4 h-4" /> Save Changes
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditingBank(true)}
                    className="rounded-2xl border-2 font-bold flex items-center gap-2 hover:bg-primary/5 hover:border-primary/30 transition-all"
                  >
                    <Edit3 className="w-4 h-4" /> Update
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EditableBlock 
                  label="Account Holder Name" 
                  value={bankForm.accountHolderName} 
                  isEditing={isEditingBank}
                  onChange={(val) => setBankForm({...bankForm, accountHolderName: val})}
                  icon={Building2} 
                />
                <EditableBlock 
                  label="Bank Name" 
                  value={bankForm.bankName} 
                  isEditing={isEditingBank}
                  onChange={(val) => setBankForm({...bankForm, bankName: val})}
                  icon={Building2} 
                />
                <EditableBlock 
                  label="Account Number" 
                  value={isEditingBank ? bankForm.accountNumber : maskAccountNumber(kycData?.accountNumber)} 
                  isEditing={isEditingBank}
                  onChange={(val) => setBankForm({...bankForm, accountNumber: val})}
                  icon={CreditCard} 
                />
                <EditableBlock 
                  label="IFSC Code" 
                  value={bankForm.ifscCode} 
                  isEditing={isEditingBank}
                  onChange={(val) => setBankForm({...bankForm, ifscCode: val})}
                  icon={FileText} 
                />
                <EditableBlock 
                  label="Branch" 
                  value={bankForm.branch} 
                  isEditing={isEditingBank}
                  onChange={(val) => setBankForm({...bankForm, branch: val})}
                  icon={MapPin} 
                />
                <EditableBlock 
                  label="Account Type" 
                  value={bankForm.accountType} 
                  isEditing={isEditingBank}
                  onChange={(val) => setBankForm({...bankForm, accountType: val})}
                  icon={Settings} 
                />
              </div>

              {kycData?.bankStatus === "approved" && (
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-emerald-900">Bank Account Verified</h4>
                    <p className="text-emerald-700/80 text-sm font-medium">Your bank account has been verified and is ready to receive payments.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoBlock({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
    return (
      <div className="space-y-1.5 group">
        <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">{label}</label>
        <div className="relative group/field">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground transition-all duration-300">
            <Icon className="w-4 h-4" />
          </div>
          <div className="w-full h-11 bg-muted/30 border border-border/50 rounded-xl flex items-center px-12 text-sm font-bold text-foreground/90 transition-all duration-300">
            {value}
          </div>
        </div>
      </div>
    );
}

function EditableBlock({ 
    label, 
    value, 
    isEditing, 
    onChange, 
    icon: Icon 
  }: { 
    label: string; 
    value: string; 
    isEditing: boolean; 
    onChange: (val: string) => void;
    icon: any 
  }) {
    return (
      <div className="space-y-1.5 group animate-in fade-in duration-300">
        <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">{label}</label>
        <div className="relative group/field">
          <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${isEditing ? 'bg-primary/10 text-primary' : 'bg-muted/50 text-muted-foreground'}`}>
            <Icon className="w-4 h-4" />
          </div>
          {isEditing ? (
            <Input 
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-11 pl-12 rounded-xl text-sm font-bold border-primary/30 focus-visible:ring-primary/20 bg-background shadow-sm"
              placeholder={`Enter ${label}`}
            />
          ) : (
            <div className="w-full h-11 bg-muted/30 border border-border/50 rounded-xl flex items-center px-12 text-sm font-bold text-foreground/90 group-hover/field:border-primary/20 transition-all duration-300">
              {value || "Not Set"}
            </div>
          )}
        </div>
      </div>
    );
}

function DocumentRow({ 
    title, 
    status, 
    date, 
    url,
    onUpload 
  }: { 
    title: string; 
    status: string; 
    date: string; 
    url?: string;
    onUpload: (file: File) => void 
  }) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = () => {
      fileInputRef.current?.click();
    };

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl border border-border/50 hover:border-primary/20 hover:bg-primary/[0.02] transition-all group">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-foreground">{title}</h4>
            <p className="text-[11px] font-medium text-muted-foreground">{date}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 mt-3 sm:mt-0">
          {getStatusBadge(status)}
          <div className="flex items-center gap-2">
            {url && (
              <a href={getSafeImageUrl(url)} target="_blank" rel="noreferrer">
                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10 text-primary" title="View Document">
                  <Eye className="w-4 h-4" />
                </Button>
              </a>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUpload(file);
              }}
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-xl hover:bg-primary/10 text-primary" 
              title={url ? "Replace Document" : "Upload Document"}
              onClick={handleUploadClick}
            >
              <Upload className="w-4 h-4" />
            </Button>

            {url && (
              <a href={getSafeImageUrl(url)} download target="_blank" rel="noreferrer">
                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10 text-primary" title="Download Document">
                  <Download className="w-4 h-4" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    );
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "approved":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none px-3 py-1 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> Verified
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none px-3 py-1 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" /> Pending Review
        </Badge>
      );
    case "rejected":
      return (
        <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-none px-3 py-1 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" /> Rejected
        </Badge>
      );
    default:
      return (
        <Badge className="bg-muted text-muted-foreground hover:bg-muted/80 border-none px-3 py-1">
          Not Started
        </Badge>
      );
  }
};

const maskAccountNumber = (acc: string) => {
  if (!acc) return "Not Set";
  if (acc.length < 4) return acc;
  return "**** **** **** " + acc.slice(-4);
};
