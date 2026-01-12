import React, { useState, useEffect, useRef } from "react";
import userDashboardService, { KYCData } from "@/services/userDashboard.service";
import { useAuth } from "@/contexts/AuthContext";
import {
  Shield,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  User,
  Building2,
  Eye,
  ChevronRight,
  Info,
  Loader2,
  RefreshCw,
  Save,
} from "lucide-react";

// Types
type DocumentStatus = "uploaded" | "pending" | "approved" | "rejected";
type VerificationStep = "personal" | "business" | "documents" | "review";

export default function KYCVerification() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeStep, setActiveStep] = useState<VerificationStep>("documents");
  const [kycData, setKycData] = useState<KYCData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadingDocType, setUploadingDocType] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [businessForm, setBusinessForm] = useState({
    companyName: "",
    companyType: "",
    gstNumber: "",
    cinNumber: "",
    registeredAddress: "",
    industry: "",
  });

  const fetchKYC = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userDashboardService.getKYC();
      if (response.success && response.data) {
        setKycData(response.data);
        if (response.data.businessInfo) {
          setBusinessForm({
            companyName: response.data.businessInfo.companyName || "",
            companyType: response.data.businessInfo.companyType || "",
            gstNumber: response.data.businessInfo.gstNumber || "",
            cinNumber: response.data.businessInfo.cinNumber || "",
            registeredAddress: response.data.businessInfo.registeredAddress || "",
            industry: response.data.businessInfo.industry || "",
          });
        }
      } else {
        // No KYC data yet, that's ok
        setKycData(null);
      }
    } catch (err) {
      setError("Failed to load KYC data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKYC();
  }, []);

  const handleSaveBusinessInfo = async () => {
    setSaving(true);
    try {
      const response = await userDashboardService.updateBusinessInfo(businessForm);
      if (response.success) {
        setEditMode(false);
        fetchKYC();
      }
    } catch (err) {
      console.error("Failed to save business info");
    } finally {
      setSaving(false);
    }
  };

  const handleUploadDocument = async (docType: string, file: File) => {
    setUploading(docType);
    try {
      const response = await userDashboardService.uploadKYCDocument(docType, file);
      if (response.success) {
        fetchKYC();
      }
    } catch (err) {
      console.error("Failed to upload document");
    } finally {
      setUploading(null);
      setUploadingDocType(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadingDocType) {
      handleUploadDocument(uploadingDocType, file);
    }
  };

  const triggerFileUpload = (docType: string) => {
    setUploadingDocType(docType);
    fileInputRef.current?.click();
  };



  const getStatusConfig = (status: DocumentStatus) => {
    switch (status) {
      case "approved":
        return { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2, label: "Verified" };
      case "pending":
        return { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock, label: "Under Review" };
      case "uploaded":
        return { bg: "bg-blue-100", text: "text-blue-700", icon: FileText, label: "Uploaded" };
      case "rejected":
        return { bg: "bg-red-100", text: "text-red-700", icon: AlertCircle, label: "Rejected" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-600", icon: Clock, label: "Pending" };
    }
  };

  const getOverallStatusConfig = (status: string) => {
    switch (status) {
      case "approved":
        return { bg: "bg-green-500", text: "Verified", icon: CheckCircle2 };
      case "pending":
        return { bg: "bg-yellow-500", text: "Verification in Progress", icon: Clock };
      case "rejected":
        return { bg: "bg-red-500", text: "Action Required", icon: AlertCircle };
      default:
        return { bg: "bg-gray-500", text: "Not Started", icon: Info };
    }
  };

  const steps = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "business", label: "Business Info", icon: Building2 },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "review", label: "Review", icon: Shield },
  ];

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    if (!kycData) return 0;
    let completed = 0;
    let total = 4;
    if (kycData.personalInfo?.fullName) completed++;
    if (kycData.businessInfo?.companyName) completed++;
    const verifiedDocs = kycData.documents?.filter(d => d.status === "approved").length || 0;
    if (verifiedDocs > 0) completed++;
    if (kycData.overallStatus === "approved") completed++;
    return Math.round((completed / total) * 100);
  };

  const requiredDocTypes = [
    { type: "pan_card", name: "PAN Card", description: "Company or Individual PAN Card", required: true },
    { type: "aadhaar", name: "Aadhaar Card", description: "Aadhaar card of authorized signatory", required: true },
    { type: "gst_certificate", name: "GST Certificate", description: "GST Registration Certificate", required: true },
    { type: "coi", name: "Certificate of Incorporation", description: "Company incorporation certificate", required: false },
    { type: "address_proof", name: "Address Proof", description: "Utility bill or rent agreement", required: true },
    { type: "bank_statement", name: "Bank Statement", description: "Last 3 months bank statement", required: false },
  ];

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-yellow-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading KYC data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-700 font-medium mb-2">{error}</p>
          <button
            onClick={fetchKYC}
            className="px-4 py-2 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-500 transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  const overallStatus = getOverallStatusConfig(kycData?.overallStatus || "not_started");
  const completionPercentage = getCompletionPercentage();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileSelect}
      />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-[Poppins] text-gray-900">
              KYC <span className="text-yellow-500">Verification</span>
            </h1>
            <p className="text-gray-500 mt-1">Complete your verification to access all services</p>
          </div>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-white ${overallStatus.bg}`}>
            <overallStatus.icon className="w-4 h-4" />
            <span className="font-medium">{overallStatus.text}</span>
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Verification Progress</h2>
            <span className="text-2xl font-bold text-yellow-500">{completionPercentage}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">Upload remaining documents to complete verification</p>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> KYC verification is mandatory for virtual office services. Your business address
                documents will be used for GST registration. Please ensure all documents are valid and clearly readable.
              </p>
            </div>
          </div>
        </div>

        {/* Steps Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
          <div className="flex gap-1">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id as VerificationStep)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeStep === step.id
                  ? "bg-yellow-400 text-black"
                  : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <step.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{step.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {/* Personal Info */}
          {activeStep === "personal" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold font-[Poppins] text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-yellow-500" /> Personal Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Full Name</label>
                  <p className="text-gray-900 font-medium">{user?.fullName || kycData?.personalInfo?.fullName || "-"}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Email</label>
                  <p className="text-gray-900">{user?.email || kycData?.personalInfo?.email || "-"}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Phone Number</label>
                  <p className="text-gray-900">{user?.phone || kycData?.personalInfo?.phone || "-"}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Date of Birth</label>
                  <p className="text-gray-900">{kycData?.personalInfo?.dateOfBirth ? new Date(kycData.personalInfo.dateOfBirth).toLocaleDateString("en-IN") : "-"}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Aadhaar Number</label>
                  <p className="text-gray-900 font-mono">{kycData?.personalInfo?.aadhaarLast4 ? `XXXX XXXX ${kycData.personalInfo.aadhaarLast4}` : "-"}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">PAN Number</label>
                  <p className="text-gray-900 font-mono">{kycData?.personalInfo?.panNumber || "-"}</p>
                </div>
              </div>
            </div>
          )}

          {/* Business Info */}
          {activeStep === "business" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold font-[Poppins] text-gray-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-yellow-500" /> Business Information
                </h2>
                {!editMode ? (
                  <button onClick={() => setEditMode(true)} className="text-sm text-yellow-600 hover:text-yellow-700 font-medium">Edit</button>
                ) : (
                  <button onClick={() => setEditMode(false)} className="text-sm text-gray-500 hover:text-gray-700 font-medium">Cancel</button>
                )}
              </div>

              {editMode ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={businessForm.companyName}
                      onChange={(e) => setBusinessForm({ ...businessForm, companyName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Company Type</label>
                    <select
                      value={businessForm.companyType}
                      onChange={(e) => setBusinessForm({ ...businessForm, companyType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      <option value="">Select Type</option>
                      <option value="Sole Proprietorship">Sole Proprietorship</option>
                      <option value="Partnership">Partnership</option>
                      <option value="LLP">LLP</option>
                      <option value="Private Limited">Private Limited</option>
                      <option value="Public Limited">Public Limited</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">GST Number</label>
                    <input
                      type="text"
                      value={businessForm.gstNumber}
                      onChange={(e) => setBusinessForm({ ...businessForm, gstNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">CIN Number</label>
                    <input
                      type="text"
                      value={businessForm.cinNumber}
                      onChange={(e) => setBusinessForm({ ...businessForm, cinNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-500 mb-1">Business Address</label>
                    <textarea
                      value={businessForm.registeredAddress}
                      onChange={(e) => setBusinessForm({ ...businessForm, registeredAddress: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Industry</label>
                    <input
                      type="text"
                      value={businessForm.industry}
                      onChange={(e) => setBusinessForm({ ...businessForm, industry: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <button
                      onClick={handleSaveBusinessInfo}
                      disabled={saving}
                      className="px-6 py-2 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-500 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Company Name</label>
                    <p className="text-gray-900 font-medium">{kycData?.businessInfo?.companyName || "-"}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Company Type</label>
                    <p className="text-gray-900">{kycData?.businessInfo?.companyType || "-"}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">GST Number</label>
                    <p className="text-gray-900 font-mono">{kycData?.businessInfo?.gstNumber || "-"}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">CIN Number</label>
                    <p className="text-gray-900 font-mono">{kycData?.businessInfo?.cinNumber || "-"}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-500 mb-1">Business Address</label>
                    <p className="text-gray-900">{kycData?.businessInfo?.registeredAddress || "-"}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Industry</label>
                    <p className="text-gray-900">{kycData?.businessInfo?.industry || "-"}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Documents */}
          {activeStep === "documents" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold font-[Poppins] text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-yellow-500" /> Required Documents
                </h2>
              </div>

              <div className="space-y-4">
                {requiredDocTypes.map((docType) => {
                  const uploadedDoc = kycData?.documents?.find(d => d.type === docType.type);
                  const status = uploadedDoc?.status || "pending";
                  const statusConfig = getStatusConfig(status as DocumentStatus);
                  const isUploading = uploading === docType.type;

                  return (
                    <div
                      key={docType.type}
                      className={`p-4 border rounded-xl transition-colors ${status === "rejected" ? "border-red-200 bg-red-50" : "border-gray-200 hover:border-yellow-300"
                        }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900">{docType.name}</h3>
                            {docType.required && (
                              <span className="text-xs text-red-500">*Required</span>
                            )}
                            {uploadedDoc && (
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                                <statusConfig.icon className="w-3 h-3" />
                                {statusConfig.label}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{docType.description}</p>
                          {uploadedDoc?.name && (
                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                              <FileText className="w-3 h-3" /> {uploadedDoc.name} - Uploaded on {new Date(uploadedDoc.uploadedAt || "").toLocaleDateString("en-IN")}
                            </p>
                          )}
                          {uploadedDoc?.rejectionReason && (
                            <p className="text-sm text-red-600 mt-2 flex items-start gap-1">
                              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                              {uploadedDoc.rejectionReason}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {uploadedDoc?.fileUrl && (
                            <a
                              href={uploadedDoc.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                            >
                              <Eye className="w-4 h-4" /> View
                            </a>
                          )}
                          {(status === "rejected" || !uploadedDoc) && (
                            <button
                              onClick={() => triggerFileUpload(docType.type)}
                              disabled={isUploading}
                              className="flex items-center gap-1.5 px-3 py-2 bg-yellow-400 text-black rounded-lg text-sm font-medium hover:bg-yellow-500 transition-colors disabled:opacity-50"
                            >
                              {isUploading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Upload className="w-4 h-4" />
                              )}
                              Upload
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  <strong>Accepted formats:</strong> PDF, JPG, PNG (Max 5MB per file)
                </p>
              </div>
            </div>
          )}

          {/* Review */}
          {activeStep === "review" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold font-[Poppins] text-gray-900 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-yellow-500" /> Review & Submit
                </h2>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm text-yellow-800">
                  Please review all your information before submitting. Once submitted, changes may require re-verification.
                </p>
              </div>

              {/* Summary */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-900">Personal Information</span>
                  </div>
                  {kycData?.personalInfo?.fullName ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-yellow-500" />
                  )}
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-900">Business Information</span>
                  </div>
                  {kycData?.businessInfo?.companyName ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-yellow-500" />
                  )}
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      Documents ({kycData?.documents?.filter(d => d.status === "approved" || d.status === "pending").length || 0}/{requiredDocTypes.length} uploaded)
                    </span>
                  </div>
                  {(kycData?.documents?.length || 0) >= requiredDocTypes.filter(d => d.required).length ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-yellow-500" />
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <label className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1 w-4 h-4 text-yellow-500 rounded focus:ring-yellow-400" />
                  <span className="text-sm text-gray-600">
                    I confirm that all the information provided is accurate and I agree to FlashSpace
                    <a href="/terms" className="text-yellow-600 hover:underline"> Terms of Service</a> and
                    <a href="/privacy" className="text-yellow-600 hover:underline"> Privacy Policy</a>.
                  </span>
                </label>
              </div>

              <button
                disabled={kycData?.overallStatus === "approved" || kycData?.overallStatus === "pending"}
                className="w-full py-3 bg-yellow-400 text-black rounded-xl font-semibold hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {kycData?.overallStatus === "approved" ? "Already Verified" : kycData?.overallStatus === "pending" ? "Under Review" : "Submit for Verification"}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
