import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import userDashboardService, {
  KYCData,
} from "@/services/userDashboard.service";
import { useAuth } from "@/contexts/AuthContext";
import {
  Shield,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  User,
  Users,
  Building2,
  Eye,
  ChevronRight,
  Info,
  Loader2,
  RefreshCw,
  Save,
  X,
  Trash2,
  Video as FileVideo,
  Camera,
  StopCircle,
  Play,
  Lock,
  Edit,
  ArrowUpRight,
} from "lucide-react";
import { API_CONFIG } from "@/config/api.config";
import DemoKYCVideo from "@/assets/kycVideo/DemoKYCVideo.mp4";

// Types
type DocumentStatus = "pending" | "approved" | "rejected";
type VerificationStep =
  | "type"
  | "personal"
  | "business"
  | "video"
  | "documents"
  | "review";
type KYCType = "individual" | "business";

export default function KYCVerification() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [profileId, setProfileId] = useState<string | null>(
    searchParams.get("profileId"),
  );
  const linkBookingId =
    searchParams.get("linkBookingId") || searchParams.get("bookingId");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeStep, setActiveStep] = useState<VerificationStep>("personal");
  const [kycType, setKycType] = useState<KYCType>("individual");
  const [kycData, setKycData] = useState<KYCData | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Multi-Level State
  const [profiles, setProfiles] = useState<KYCData[]>([]);
  const [individualProfile, setIndividualProfile] = useState<KYCData | null>(
    null,
  );
  const [partnerProfiles, setPartnerProfiles] = useState<KYCData[]>([]);
  const [businessProfiles, setBusinessProfiles] = useState<KYCData[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploadingDocType, setUploadingDocType] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isPartnerMode, setIsPartnerMode] = useState(false);
  const [personalForm, setPersonalForm] = useState({
    phone: "",
    dateOfBirth: "",
    aadhaar: "",
    pan: "",
    fullName: "",
    email: "",
  });
  const [uploadAccept, setUploadAccept] = useState(".pdf,.jpg,.jpeg,.png");

  const [businessForm, setBusinessForm] = useState({
    profileName: "",
    companyName: "",
    companyType: "",
    gstNumber: "",
    cinNumber: "",
    registeredAddress: "",
    industry: "",
    partners: [] as string[],
  });
  const [previewDoc, setPreviewDoc] = useState<{
    url: string;
    type: string;
    mimeType: string;
  } | null>(null);


  const fetchKYC = async () => {
    setLoading(true);
    setError(null);
    try {
      let response = await userDashboardService.getKYC(profileId || undefined);

      // fallback for partner if main KYC not found or if checking for specific partner
      if (
        (!response.success || !response.data) &&
        profileId &&
        profileId !== "new"
      ) {
        try {
          const partnerResp =
            await userDashboardService.getPartnerDetails(profileId);
          if (partnerResp.success && partnerResp.data) {
            // Map partner data to KYCData structure for the form
            const pData = partnerResp.data;
            const mappedData: any = {
              _id: pData._id,
              isPartner: true, // Explicitly flag as partner
              kycType: "individual", // Partners are individuals
              personalInfo: {
                fullName: pData.fullName,
                email: pData.email,
                phone: pData.phone,
                panNumber: pData.panNumber,
                aadhaarNumber: pData.aadhaarNumber,
                dateOfBirth: pData.dob,
              },
              documents: pData.documents || [],
              businessInfo: {
                companyName: "N/A", // Not applicable for partner
                partners: [],
              },
              overallStatus: pData.status,
            };
            response = {
              success: true,
              data: mappedData,
              message: "Partner loaded",
            };

            // Critical: Set state immediately for partner mode
            setIsPartnerMode(true);
            setKycType("individual");
          }
        } catch (e) {
          // console.log("Not a partner ID either");
        }
      }

      if (response.success && response.data) {
        if (profileId && profileId !== "new") {
          // Specific profile loaded
          const data = response.data as KYCData;
          setKycData(data);

          // Detect if this is a partner profile (handling both nested and flat structures)
          const isPartner =
            data.isPartner ||
            (data.kycType === "individual" &&
              (data.personalInfo?.fullName || (data as any).fullName) &&
              (data.personalInfo?.fullName !== user?.fullName ||
                ((data as any).fullName &&
                  (data as any).fullName !== user?.fullName)));

          if (isPartner) {
            setIsPartnerMode(true);
            setKycType("individual");
          } else {
            setIsPartnerMode(false);
          }

          setBusinessForm({
            profileName: data.profileName || "",
            companyName: data.businessInfo?.companyName || "",
            companyType: data.businessInfo?.companyType || "",
            gstNumber: data.businessInfo?.gstNumber || "",
            cinNumber: data.businessInfo?.cinNumber || "",
            registeredAddress: data.businessInfo?.registeredAddress || "",
            industry: data.businessInfo?.industry || "",
            partners: data.businessInfo?.partners || [],
          });

          // Pre-fill personal form if exist (handling both nested and flat structures)
          setPersonalForm((prev) => {
            const info = data.personalInfo || {};
            const flatData = data as any; // Fallback to root level properties

            return {
              phone: info.phone || flatData.phone || user?.phoneNumber || "",
              dateOfBirth:
                info.dateOfBirth || flatData.dob
                  ? new Date(info.dateOfBirth || flatData.dob)
                    .toISOString()
                    .split("T")[0]
                  : "",
              aadhaar:
                prev.aadhaar ||
                info.aadhaarNumber ||
                flatData.aadhaarNumber ||
                "",
              pan: info.panNumber || flatData.panNumber || "",
              fullName: info.fullName || flatData.fullName || "",
              email: info.email || flatData.email || user?.email || "",
            };
          });

          if (data.kycType) {
            setKycType(data.kycType as KYCType);
          }
        } else {
          // All profiles loaded
          const profilesList = Array.isArray(response.data)
            ? response.data
            : [];
          setProfiles(profilesList);

          // Separate profiles
          const indProfiles = profilesList.filter(
            (p: KYCData) => p.kycType === "individual",
          );
          const mainIndProfile = indProfiles.length > 0 ? indProfiles[0] : null;
          const partners = indProfiles.length > 1 ? indProfiles.slice(1) : [];
          const bizProfiles = profilesList.filter(
            (p: KYCData) => p.kycType === "business",
          );

          setIndividualProfile(mainIndProfile);

          // Fetch partners from new API if main profile exists
          if (mainIndProfile && mainIndProfile._id) {
            try {
              const partnersResp = await userDashboardService.getPartners(
                mainIndProfile._id,
              );
              if (partnersResp.success && Array.isArray(partnersResp.data)) {
                const mappedPartners = partnersResp.data.map((p: any) => ({
                  ...p,
                  profileName: p.fullName,
                  personalInfo: {
                    fullName: p.fullName,
                    email: p.email,
                    phone: p.phone,
                  },
                  overallStatus: p.status,
                }));
                setPartnerProfiles(mappedPartners);
              } else {
                setPartnerProfiles([]);
              }
            } catch (e) {
              console.error("Failed to fetch partners", e);
              setPartnerProfiles([]);
            }
          } else {
            setPartnerProfiles([]);
          }

          setBusinessProfiles(bizProfiles);
        }
      }
    } catch (err) {
      setError("Failed to load KYC data");
    } finally {
      setLoading(false);
    }
  };

  const handleLinkBooking = async (pid: string) => {
    if (!linkBookingId) return;
    setSaving(true);
    try {
      const resp = await userDashboardService.linkBookingToProfile(
        linkBookingId,
        pid,
      );
      if (resp.success) {
        window.location.href = "/dashboard/bookings?linked=true";
      } else {
        setError(resp.message || "Failed to link booking");
      }
    } catch (err) {
      setError("Error linking booking");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    setActiveStep("personal");
    fetchKYC();
  }, [profileId]);

  const handleSaveBusinessInfo = async () => {
    setSaving(true);
    try {
      // Intercept for New Partner Creation
      if (isPartnerMode && profileId === "new") {
        if (!individualProfile?._id) {
          setError("Personal verification must be completed first.");
          setSaving(false);
          return;
        }

        const partnerData = {
          profileId: individualProfile._id, // Link to main profile
          fullName: personalForm.fullName,
          email: personalForm.email,
          phone: personalForm.phone,
          panNumber: personalForm.pan,
          aadhaarNumber: personalForm.aadhaar,
          dob: personalForm.dateOfBirth,
          address: "N/A",
        };

        const partnerResponse =
          await userDashboardService.addPartner(partnerData);

        if (partnerResponse.success) {
          setEditMode(false);
          // Redirect to new partner profile
          if (partnerResponse.data && partnerResponse.data._id) {
            const newPartnerId = partnerResponse.data._id;
            setProfileId(newPartnerId);
            setSearchParams((params) => {
              params.set("profileId", newPartnerId);
              return params;
            });
            // Force fetch to load partner data
            setTimeout(() => fetchKYC(), 100);
          } else {
            fetchKYC();
            setProfileId(null);
          }
          return;
        } else {
          setError(partnerResponse.message || "Failed to add partner");
          setSaving(false);
          return;
        }
      }

      // Existing Logic for standard KYC updates
      const response = await userDashboardService.updateBusinessInfo({
        ...businessForm,
        profileId: (profileId === "new" ? undefined : profileId) || undefined,
        kycType: kycType,
        // Added personal info fields
        personalPhone: personalForm.phone,
        personalEmail: personalForm.email,
        personalDob: personalForm.dateOfBirth,
        personalAadhaar: personalForm.aadhaar,
        personalPan: personalForm.pan,
        personalFullName: personalForm.fullName,
        partners: businessForm.partners, // Include selected partners
      });

      if (response.success && response.data) {
        setEditMode(false);
        if (profileId === "new" && response.data._id) {
          // New profile created, redirect to it
          const newProfileId = response.data._id;
          setProfileId(newProfileId);
          setSearchParams((params) => {
            params.set("profileId", newProfileId);
            return params;
          });
        }
      }
    } catch (err) {
      console.error("Failed to save business info", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDocument = async (docType: string) => {
    if (!profileId) return;
    if (!confirm("Are you sure you want to delete this document?")) return;

    setDeleting(docType);
    try {
      const response = await userDashboardService.deleteKYCDocument(
        docType,
        profileId,
      );
      if (response.success) {
        fetchKYC();
      } else {
        alert(response.message || "Failed to delete document");
      }
    } catch (err) {
      console.error("Failed to delete document");
      alert("Failed to delete document");
    } finally {
      setDeleting(null);
    }
  };

  const handleUploadDocument = async (docType: string, file: File) => {
    if (!profileId || profileId === "new") {
      alert(
        "Please save your profile information first before uploading documents.",
      );
      return;
    }
    setUploading(docType);
    try {
      const response = await userDashboardService.uploadKYCDocument(
        docType,
        file,
        profileId,
      );
      if (response.success) {
        fetchKYC();
      } else {
        alert(response.message || "Failed to upload document");
      }
    } catch (err) {
      console.error("Failed to upload document", err);
      alert(
        "An error occurred while uploading the document. Please try again.",
      );
    } finally {
      setUploading(null);
      setUploadingDocType(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadingDocType) {
      // Validation for Document Uploads (excluding video)
      if (uploadingDocType !== "video_kyc" && file.type !== "application/pdf") {
        alert("Only PDF files are allowed for documents.");
        // Reset the input so the user can select again
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }
      handleUploadDocument(uploadingDocType, file);
    }
  };

  const triggerFileUpload = (docType: string) => {
    setUploadingDocType(docType);
    const accept = docType === "video_kyc" ? ".mp4,.webm,.mov" : ".pdf";
    setUploadAccept(accept);
    setTimeout(() => fileInputRef.current?.click(), 0);
  };

  const getStatusConfig = (status: DocumentStatus) => {
    switch (status) {
      case "approved":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
          icon: CheckCircle2,
          label: "Verified",
        };
      case "pending":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-700",
          icon: Clock,
          label: "Under Review",
        };
      case "rejected":
        return {
          bg: "bg-red-100",
          text: "text-red-700",
          icon: AlertCircle,
          label: "Rejected",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-600",
          icon: Clock,
          label: "Pending",
        };
    }
  };

  const getOverallStatusConfig = (status: string) => {
    switch (status) {
      case "approved":
        return { bg: "bg-green-500", text: "Verified", icon: CheckCircle2 };
      case "pending":
        return {
          bg: "bg-yellow-500",
          text: "Verification in Progress",
          icon: Clock,
        };
      case "rejected":
        return { bg: "bg-red-500", text: "Action Required", icon: AlertCircle };
      case "resubmit":
        return {
          bg: "bg-red-500",
          text: "Resubmission Required",
          icon: RefreshCw,
        };
      case "in_progress":
        return {
          bg: "bg-blue-500",
          text: "Draft",
          icon: Edit,
        };
      default:
        return { bg: "bg-gray-500", text: "Not Started", icon: Info };
    }
  };

  const steps = [
    { id: "personal", label: "Personal Info", icon: User },
    ...(kycType === "business"
      ? [{ id: "business", label: "Business Info", icon: Building2 }]
      : []),
    { id: "video", label: "Video KYC", icon: FileVideo },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "review", label: "Review", icon: Shield },
  ];

  // Step validation functions
  const isPersonalInfoComplete = () => {
    if (isPartnerMode && !personalForm.fullName) return false;
    return !!(
      personalForm.phone &&
      personalForm.dateOfBirth &&
      personalForm.aadhaar &&
      personalForm.pan
    );
  };

  const isBusinessInfoComplete = () => {
    if (kycType !== "business") return true;
    return !!(
      businessForm.companyName &&
      businessForm.companyType &&
      businessForm.industry &&
      businessForm.gstNumber &&
      businessForm.registeredAddress
    );
  };

  const isVideoKYCComplete = () => {
    return !!kycData?.documents?.find((d) => d.type === "video_kyc");
  };

  // Check if data is saved to server (for navigation locking)
  const isPersonalInfoSaved = () => {
    return !!(
      kycData?.personalInfo?.phone &&
      kycData?.personalInfo?.dateOfBirth &&
      kycData?.personalInfo?.aadhaarNumber &&
      kycData?.personalInfo?.panNumber
    );
  };

  const isBusinessInfoSaved = () => {
    if (kycType !== "business" || isPartnerMode) return true;
    return !!(
      kycData?.businessInfo?.companyName &&
      kycData?.businessInfo?.companyType &&
      kycData?.businessInfo?.industry &&
      kycData?.businessInfo?.gstNumber &&
      kycData?.businessInfo?.registeredAddress
    );
  };

  const isStepAccessible = (step: VerificationStep) => {
    if (step === "personal") return true;

    // Business tab - only accessible after personal info is saved
    if (step === "business") {
      return isPersonalInfoSaved();
    }

    // Video KYC - accessible after business info is saved
    if (step === "video") {
      return isPersonalInfoSaved() && isBusinessInfoSaved();
    }

    // Documents - accessible after previous steps are saved
    if (step === "documents") {
      return isPersonalInfoSaved() && isBusinessInfoSaved();
    }

    // Review - accessible after all previous steps including documents
    if (step === "review") {
      return isPersonalInfoSaved() && isBusinessInfoSaved();
    }

    return false;
  };

  const getCompletionPercentage = () => {
    const isBusiness = kycType === "business";
    let progress = 0;

    // Check personal info completion (form state or saved data)
    const hasPersonalInfo =
      isPersonalInfoComplete() ||
      (kycData?.personalInfo?.fullName &&
        kycData?.personalInfo?.aadhaarNumber &&
        kycData?.personalInfo?.panNumber);

    // Check business info completion (form state or saved data)
    const hasBusinessInfo =
      isBusinessInfoComplete() || kycData?.businessInfo?.companyName;

    // Check video KYC completion
    const hasVideoKYC = !!kycData?.documents?.find(
      (d) => d.type === "video_kyc",
    );

    if (isBusiness) {
      // Personal Info - 20%
      if (hasPersonalInfo) progress += 20;

      // Business Info - 20%
      if (hasBusinessInfo) progress += 20;

      // Video KYC - 20%
      if (hasVideoKYC) progress += 20;

      // Documents - 40% (reaches 100% when all docs uploaded)
      const uploadedDocsCount =
        kycData?.documents?.filter((d) => d.type !== "video_kyc").length || 0;
      const requiredDocsCount = 4;
      const docWeight = 40;
      progress += Math.min(
        docWeight,
        Math.round((uploadedDocsCount / requiredDocsCount) * docWeight),
      );
    } else {
      // Personal Info - 30%
      const personalWeight = 30;
      if (hasPersonalInfo) progress += personalWeight;

      // Video KYC - 30%
      if (hasVideoKYC) progress += 30;

      // Documents - 40% (reaches 100% when all docs uploaded)
      const uploadedDocsCount =
        kycData?.documents?.filter((d) => d.type !== "video_kyc").length || 0;
      const requiredDocsCount = 2;
      const docWeight = 40;
      progress += Math.min(
        docWeight,
        Math.round((uploadedDocsCount / requiredDocsCount) * docWeight),
      );
    }

    return Math.min(progress, 100);
  };

  const requiredDocTypes =
    kycType === "individual"
      ? [
        {
          type: "pan_card",
          name: "PAN Card",
          description: "Individual PAN Card",
          required: true,
        },
        {
          type: "aadhaar",
          name: "Aadhaar Card",
          description: "Aadhaar Card (Front & Back)",
          required: true,
        },
      ]
      : [
        {
          type: "pan_card",
          name: "PAN Card",
          description: "Company PAN Card",
          required: true,
        },
        {
          type: "gst_certificate",
          name: "GST Certificate",
          description: "GST Registration Certificate",
          required: true,
        },
        {
          type: "coi",
          name: "Certificate of Incorporation",
          description: "Company incorporation certificate",
          required: false,
        },
        {
          type: "address_proof",
          name: "Address Proof",
          description: "Utility bill or rent agreement",
          required: true,
        },
      ];

  // Check if all required documents are uploaded
  const areAllRequiredDocsUploaded = () => {
    const requiredTypes = requiredDocTypes
      .filter((doc) => doc.required)
      .map((doc) => doc.type);

    const uploadedTypes = kycData?.documents?.map((d) => d.type) || [];

    return requiredTypes.every((type) => uploadedTypes.includes(type));
  };

  // Check if all steps are complete for submission
  const isReadyForSubmission = () => {
    // Personal info must be saved
    if (!isPersonalInfoSaved()) return false;

    // Business info must be saved for business type
    if (kycType === "business" && !isBusinessInfoSaved()) return false;

    // All required documents must be uploaded
    if (!areAllRequiredDocsUploaded()) return false;

    // Video KYC must be uploaded (only for non-partners)
    if (!isPartnerMode && !isVideoKYCComplete()) return false;

    return true;
  };

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
          <div className="flex gap-2 justify-center">
            <button
              onClick={fetchKYC}
              className="px-4 py-2 bg-[#35503F] text-[#FEF8C3] rounded-lg font-medium hover:bg-[#35503F]/90 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
            <button
              onClick={() => {
                setProfileId(null);
                setKycData(null);
                setSearchParams((params) => {
                  params.delete("profileId");
                  return params;
                });
                setError(null);
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const overallStatus = getOverallStatusConfig(
    kycData?.overallStatus || "not_started",
  );
  const completionPercentage = getCompletionPercentage();

  // New DASHBOARD VIEW Logic
  if (!profileId) {
    const isPersonalVerified = individualProfile?.overallStatus === "approved";
    const isPersonalSubmitted = individualProfile?.overallStatus && individualProfile?.overallStatus !== "not_started";

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold  text-[#35503F]">
                KYC <span className="text-[#35503F] opacity-100">Verification</span>
              </h1>
              <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-full border border-red-100 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Action Required
              </span>
            </div>
            <p className="text-gray-500">Complete your personal identity to unlock business and partner features.</p>
          </div>

          {/* 1. Personal Identity Section */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">1. Personal Identity <span className="text-gray-400 font-normal text-sm ml-1">(Mandatory)</span></h2>
            <div className={`rounded-2xl border p-6 transition-all ${isPersonalVerified
              ? "bg-green-50/50 border-green-100"
              : "bg-white border-green-600 shadow-md ring-1 ring-green-600/10"
              }`}>
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isPersonalVerified ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"
                    }`}>
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {isPersonalVerified ? "Personal Verification Complete" : "Start Personal Verification"}
                    </h3>
                    <p className="text-sm text-gray-500 max-w-xl">
                      {isPersonalVerified
                        ? "Your personal identity has been verified. You can now proceed with business and partner verifications."
                        : "Verify your Aadhaar and PAN to establish your identity. This is required to create business profiles."}
                    </p>
                    {individualProfile?.overallStatus && individualProfile.overallStatus !== 'not_started' && !isPersonalVerified && (
                      <div className="mt-3 flex items-center gap-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${individualProfile.overallStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          individualProfile.overallStatus === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100'
                          }`}>
                          Status: {individualProfile.overallStatus.replace('_', ' ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (individualProfile?._id) {
                      setProfileId(individualProfile._id);
                      setSearchParams({ profileId: individualProfile._id });
                    } else {
                      // Start new
                      setProfileId("new");
                      setKycType("individual");
                      setSearchParams({ profileId: "new" });
                    }
                  }}
                  className={`px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2 shadow-sm ${isPersonalVerified
                    ? "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    : "bg-[#35503F] text-[#FEF8C3] hover:bg-[#35503F]/90"
                    }`}
                >
                  {isPersonalVerified ? (
                    <>View Details <ChevronRight className="w-4 h-4" /></>
                  ) : (
                    <>{isPersonalSubmitted ? "Continue Verification" : "Start Verification"} <ArrowUpRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 2. Partner Profiles Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-bold ${!isPersonalVerified ? "text-gray-400" : "text-gray-800"}`}>2. Partner Profiles</h2>
              {!isPersonalVerified ? (
                <span className="text-xs text-gray-400 italic flex items-center gap-1">
                  <Info className="w-3 h-3" /> Adding a company with partners? Add them here first!
                </span>
              ) : (
                <button
                  onClick={() => {
                    setProfileId("new");
                    setKycType("individual");
                    setIsPartnerMode(true);
                    setSearchParams({ profileId: "new" });
                  }}
                  className="text-sm font-medium text-[#35503F] hover:underline flex items-center gap-1"
                >
                  + Add Partner
                </button>
              )}
            </div>

            <div className={`border-dashed border-2 rounded-2xl min-h-[160px] flex flex-col items-center justify-center p-8 text-center transition-all ${!isPersonalVerified ? "bg-gray-50/50 border-gray-200" : "bg-white border-gray-200"
              }`}>
              {!isPersonalVerified ? (
                <>
                  <Lock className="w-8 h-8 text-gray-300 mb-2" />
                  <p className="text-sm text-gray-400">Locked until Personal Verification is complete.</p>
                </>
              ) : partnerProfiles.length === 0 ? (
                <>
                  <Users className="w-8 h-8 text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">No partners added yet</p>
                  <p className="text-sm text-gray-400 mt-1 max-w-sm">
                    If your business has multiple partners or directors, add their profiles here before creating the business profile.
                  </p>
                </>
              ) : (
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                  {partnerProfiles.map(partner => (
                    <div key={partner._id} className="bg-white border border-gray-200 p-4 rounded-xl flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                          {partner.personalInfo?.fullName?.charAt(0) || "P"}
                        </div>
                        <div className="text-left">
                          <h4 className="font-semibold text-gray-900">{partner.personalInfo?.fullName || "Partner"}</h4>
                          <p className="text-xs text-gray-500">{partner.personalInfo?.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setProfileId(partner._id || null);
                          setSearchParams({ profileId: partner._id || "" });
                        }}
                        className="px-3 py-1.5 text-xs bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100"
                      >
                        Details
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 3. Business Profiles Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-bold ${!isPersonalVerified ? "text-gray-400" : "text-gray-800"}`}>3. Business Profiles</h2>
              {!isPersonalVerified && (
                <span className="text-xs text-red-300 italic">
                  Locked until Personal Verification is Approved
                </span>
              )}
              {isPersonalVerified && (
                <button
                  onClick={() => {
                    setProfileId("new");
                    setKycType("business");
                    setSearchParams({ profileId: "new" });
                  }}
                  className="text-sm font-medium text-[#35503F] hover:underline flex items-center gap-1"
                >
                  + Add Business
                </button>
              )}
            </div>

            <div className={`rounded-2xl border min-h-[160px] p-6 transition-all ${!isPersonalVerified ? "bg-gray-50 border-gray-200 flex flex-col items-center justify-center text-center" : "bg-white border-gray-200"
              }`}>
              {!isPersonalVerified ? (
                <>
                  <div className="flex gap-2 mb-3 opacity-50">
                    <div className="w-10 h-8 bg-gray-200 rounded-md"></div>
                    <div className="w-24 h-8 bg-gray-200 rounded-md"></div>
                  </div>
                  <span className="px-3 py-1 bg-gray-100 text-gray-400 text-xs font-semibold rounded-full mb-2">NOT STARTED</span>
                  <div className="w-full h-1 bg-gray-200 max-w-[200px] rounded-full mt-4"></div>
                </>
              ) : businessProfiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Building2 className="w-10 h-10 text-gray-300 mb-3" />
                  <p className="text-gray-600 font-medium">No business profiles</p>
                  <p className="text-sm text-gray-400 mt-1 mb-4">Add your company details to unlock business services.</p>
                  <button
                    onClick={() => {
                      setProfileId("new");
                      setKycType("business");
                      setSearchParams({ profileId: "new" });
                    }}
                    className="text-[#35503F] font-medium text-sm flex items-center gap-1 hover:underline"
                  >
                    Create Business Profile <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {businessProfiles.map(biz => (
                    <div key={biz._id} className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 line-clamp-1">{biz.businessInfo?.companyName || "Business Name"}</h4>
                            <p className="text-xs text-gray-500">{biz.businessInfo?.gstNumber || "GST Pending"}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${biz.overallStatus === 'approved' ? 'bg-green-100 text-green-700' :
                          biz.overallStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                          {biz.overallStatus}
                        </span>
                      </div>
                      <div className="space-y-1 mb-4">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Industry</span>
                          <span className="font-medium text-gray-900">{biz.businessInfo?.industry || "-"}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Type</span>
                          <span className="font-medium text-gray-900">{biz.businessInfo?.companyType || "-"}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setProfileId(biz._id || null);
                          setSearchParams({ profileId: biz._id || "" });
                        }}
                        className="w-full py-2 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={uploadAccept}
        onChange={handleFileSelect}
      />

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold  text-[#35503F]">
              {profileId === "new" ? "New Verification" : "Verification Details"}
            </h1>
            <p className="text-gray-500 mt-1">
              {linkBookingId
                ? "Link this profile to your booking"
                : "Complete the verification steps below"}
            </p>
          </div>
        </div>
        <div className="space-y-6">
          <button
            onClick={() => {
              setProfileId(null);
              setKycData(null);
              setSearchParams((params) => {
                params.delete("profileId");
                return params;
              });
              fetchKYC();
            }}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 font-medium"
          >
            <ChevronRight className="w-4 h-4 rotate-180" /> Back to profiles
          </button>

          {profileId !== "new" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">
                  Verification Progress
                </h2>
                <span className="text-2xl font-bold text-yellow-500 transition-all duration-300">
                  {completionPercentage}%
                </span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#35503F] to-[#4a6b55] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Profile Name Input (Hide for Partner Mode) */}
          {(profileId === "new" || editMode) && !isPartnerMode && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                    Profile Name (Internal Reference){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. My Tech Business"
                    value={businessForm.profileName}
                    onChange={(e) =>
                      setBusinessForm({
                        ...businessForm,
                        profileName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {profileId !== "new" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
              <div className="flex gap-1">
                {steps.map((step) => {
                  const isAccessible = isStepAccessible(
                    step.id as VerificationStep,
                  );
                  return (
                    <button
                      key={step.id}
                      onClick={() => {
                        if (isAccessible) {
                          setActiveStep(step.id as VerificationStep);
                        }
                      }}
                      disabled={!isAccessible}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors relative ${activeStep === step.id
                        ? "bg-[#35503F] text-[#FEF8C3]"
                        : isAccessible
                          ? "text-gray-600 hover:bg-gray-100 cursor-pointer"
                          : "text-gray-300 cursor-not-allowed opacity-50 bg-gray-50"
                        }`}
                      title={
                        !isAccessible ? "Complete previous steps first" : ""
                      }
                    >
                      {!isAccessible && (
                        <Lock className="w-3 h-3 absolute top-1 right-1" />
                      )}
                      <step.icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{step.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {profileId === "new" && !isPartnerMode ? (
            <div className="space-y-6 text-center py-8">
              <div className="max-w-md mx-auto space-y-4">
                <h2 className="text-xl font-bold ">
                  Start New Verification
                </h2>
                <p className="text-gray-500">
                  Provide a name for this profile and select the type to
                  begin.
                </p>
                <button
                  onClick={handleSaveBusinessInfo}
                  disabled={saving || !businessForm.profileName}
                  className="w-full py-3 bg-[#35503F] text-[#FEF8C3] rounded-lg font-bold hover:bg-[#35503F]/90 transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    "Begin Verification"
                  )}
                </button>
              </div>
            </div>
          ) : null}

          {/* Display Forms if Profile ID is set OR (Profile ID is New AND Is Partner Mode) */}
          {(profileId !== "new" || isPartnerMode) && (
            <>
              {activeStep === "personal" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold  text-gray-900 flex items-center gap-2">
                      <User className="w-5 h-5 text-yellow-500" /> Personal
                      Information
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      {isPartnerMode ||
                        (profileId !== "new" &&
                          kycData?.kycType === "individual" &&
                          kycData?.profileName !== user?.fullName &&
                          kycData?.personalInfo?.fullName !==
                          user?.fullName) ? (
                        <input
                          type="text"
                          placeholder="Partner Full Name"
                          value={personalForm.fullName}
                          onChange={(e) =>
                            setPersonalForm({
                              ...personalForm,
                              fullName: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          required
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">
                          {user?.fullName ||
                            kycData?.personalInfo?.fullName ||
                            "-"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">
                        Email
                      </label>
                      {isPartnerMode ? (
                        <input
                          type="email"
                          placeholder="Partner Email"
                          value={personalForm.email}
                          onChange={(e) =>
                            setPersonalForm({
                              ...personalForm,
                              email: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                      ) : (
                        <p className="text-gray-900">
                          {user?.email || kycData?.personalInfo?.email || "-"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="Enter 10-digit number"
                        value={personalForm.phone}
                        onChange={(e) => {
                          // Allow only numbers and limit to 10 digits
                          const value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10);
                          setPersonalForm({
                            ...personalForm,
                            phone: value,
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        required
                        pattern="[0-9]{10}"
                        title="Please enter exactly 10 digits"
                        inputMode="numeric"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={personalForm.dateOfBirth}
                        onChange={(e) =>
                          setPersonalForm({
                            ...personalForm,
                            dateOfBirth: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">
                        Aadhaar Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="12-digit Aadhaar Number"
                        value={personalForm.aadhaar}
                        onChange={(e) => {
                          // Allow only numbers and limit to 12 digits
                          const value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 12);
                          setPersonalForm({
                            ...personalForm,
                            aadhaar: value,
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        required
                        minLength={12}
                        maxLength={12}
                        pattern="[0-9]{12}"
                        title="Please enter exactly 12 digits"
                        inputMode="numeric"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">
                        PAN Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="10-character PAN"
                        value={personalForm.pan}
                        onChange={(e) =>
                          setPersonalForm({
                            ...personalForm,
                            pan: e.target.value.toUpperCase(),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 uppercase"
                        required
                        minLength={10}
                        maxLength={10}
                        pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={async () => {
                        await handleSaveBusinessInfo();
                        // Navigate based on profile type
                        if (kycType === "business") {
                          setActiveStep("business");
                        } else {
                          setActiveStep("video"); // Everyone goes to video now
                        }
                      }}
                      disabled={
                        saving ||
                        !personalForm.phone ||
                        !personalForm.dateOfBirth ||
                        !personalForm.aadhaar ||
                        !personalForm.pan ||
                        (isPartnerMode && !personalForm.fullName)
                      }
                      className="px-6 py-2 bg-[#35503F] text-[#FEF8C3] rounded-lg font-medium hover:bg-[#35503F]/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Confirm & Continue"
                      )}
                      {!saving && <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {activeStep === "business" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold  text-gray-900 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-[#35503F]" />{" "}
                      Business Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-500 mb-1">
                        Company Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Registered Company Name"
                        value={businessForm.companyName}
                        onChange={(e) =>
                          setBusinessForm({
                            ...businessForm,
                            companyName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#35503F]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-500 mb-1">
                        Company Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={businessForm.companyType}
                        onChange={(e) =>
                          setBusinessForm({
                            ...businessForm,
                            companyType: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#35503F] bg-white"
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="Private Limited">
                          Private Limited
                        </option>
                        <option value="LLP">LLP</option>
                        <option value="Partnership">Partnership</option>
                        <option value="Proprietorship">Proprietorship</option>
                        <option value="Public Limited">Public Limited</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-500 mb-1">
                        Industry <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Technology, Retail"
                        value={businessForm.industry}
                        onChange={(e) =>
                          setBusinessForm({
                            ...businessForm,
                            industry: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#35503F]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-500 mb-1">
                        GST Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="15-digit GSTIN"
                        value={businessForm.gstNumber}
                        onChange={(e) =>
                          setBusinessForm({
                            ...businessForm,
                            gstNumber: e.target.value.toUpperCase(),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#35503F] uppercase"
                        required
                        minLength={15}
                        maxLength={15}
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-500 mb-1">
                        CIN / Registration No.
                      </label>
                      <input
                        type="text"
                        placeholder="Corporate Identity Number"
                        value={businessForm.cinNumber}
                        onChange={(e) =>
                          setBusinessForm({
                            ...businessForm,
                            cinNumber: e.target.value.toUpperCase(),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#35503F] uppercase"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-500 mb-1">
                        Registered Address{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Full business address"
                        value={businessForm.registeredAddress}
                        onChange={(e) =>
                          setBusinessForm({
                            ...businessForm,
                            registeredAddress: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#35503F] resize-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Company Partners Section */}
                  <div className="border-t border-gray-100 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-900 flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" /> Company
                        Partners
                      </h3>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                      <p className="text-sm text-gray-500 mb-2">
                        Select verified partners to link to this company:
                      </p>
                      {[individualProfile, ...partnerProfiles].filter(
                        (p) => p && p.overallStatus === "approved",
                      ).length === 0 && (
                          <p className="text-sm text-red-400 italic">
                            No verified partners found. Please complete personal
                            verification for yourself and any partners first.
                          </p>
                        )}

                      {[individualProfile, ...partnerProfiles]
                        .filter((p) => p && p.overallStatus === "approved")
                        .map((p) => (
                          <label
                            key={p!._id}
                            className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-yellow-400 transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={businessForm.partners.includes(
                                p!._id!,
                              )}
                              onChange={(e) => {
                                const newPartners = e.target.checked
                                  ? [...businessForm.partners, p!._id!]
                                  : businessForm.partners.filter(
                                    (id) => id !== p!._id,
                                  );
                                setBusinessForm({
                                  ...businessForm,
                                  partners: newPartners,
                                });
                              }}
                              className="w-5 h-5 text-[#35503F] rounded focus:ring-[#35503F]"
                            />
                            <div>
                              <p className="font-medium text-gray-900">
                                {p!.profileName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {p!.personalInfo?.fullName || "Partner"}
                              </p>
                            </div>
                            <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Verified
                            </span>
                          </label>
                        ))}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={async () => {
                        await handleSaveBusinessInfo();
                        setActiveStep(isPartnerMode ? "documents" : "video");
                      }}
                      disabled={
                        saving ||
                        !businessForm.companyName ||
                        !businessForm.companyType ||
                        !businessForm.industry ||
                        !businessForm.gstNumber ||
                        !businessForm.registeredAddress
                      }
                      className="px-6 py-2 bg-[#35503F] text-[#FEF8C3] rounded-lg font-medium hover:bg-[#35503F]/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Save & Continue"
                      )}
                      {!saving && <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {activeStep === "video" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold  text-gray-900 flex items-center gap-2">
                      <FileVideo className="w-5 h-5 text-[#35503F]" /> Video
                      KYC
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Instructions */}
                    <div className="space-y-6">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                        <h3 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                          <Info className="w-4 h-4" /> Instructions
                        </h3>
                        <ul className="text-sm text-yellow-800 space-y-2 list-disc pl-4">
                          <li>
                            Hold your original <strong>PAN Card</strong>{" "}
                            clearly in front of the camera.
                          </li>
                          <li>State your name and PAN number clearly.</li>
                          <li>Rotate your face slightly left and right.</li>
                          <li>
                            Ensure you are in a well-lit area with no
                            background noise.
                          </li>
                          <li>
                            Maximum file size: <strong>50MB</strong>.
                          </li>
                        </ul>
                      </div>

                      <div className="border border-gray-200 rounded-xl p-4">
                        <h4 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">
                          Example Video
                        </h4>
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          <video
                            className="w-full h-full object-fit"
                            controls
                            preload="metadata"
                          >
                            <source src={DemoKYCVideo} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      </div>
                    </div>

                    {/* Upload Interface */}
                    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 hover:bg-gray-50 hover:border-yellow-400 transition-all group">
                      {(() => {
                        const videoDoc = kycData?.documents?.find(
                          (d) => d.type === "video_kyc",
                        );
                        const isUploading = uploading === "video_kyc";

                        if (videoDoc) {
                          const isRejected = videoDoc.status === "rejected";
                          return (
                            <div className="text-center space-y-4">
                              <div
                                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${isRejected ? "bg-red-100" : "bg-green-100"}`}
                              >
                                {isRejected ? (
                                  <AlertCircle className="w-8 h-8 text-red-600" />
                                ) : (
                                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                                )}
                              </div>
                              <div>
                                <h3
                                  className={`font-semibold ${isRejected ? "text-red-700" : "text-gray-900"}`}
                                >
                                  {isRejected
                                    ? "Video Rejected"
                                    : "Video Uploaded"}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                  {videoDoc.name}
                                </p>
                                {isRejected && videoDoc.rejectionReason && (
                                  <div className="mt-2 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 text-left">
                                    <p className="font-semibold flex items-center gap-1">
                                      <AlertCircle className="w-3 h-3" />{" "}
                                      Reason:
                                    </p>
                                    {videoDoc.rejectionReason}
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-2 justify-center">
                                <button
                                  onClick={() => {
                                    // console.log("Video document:", videoDoc);
                                    // console.log(
                                    //   "Video fileUrl:",
                                    //   videoDoc.fileUrl,
                                    // );
                                    if (videoDoc.fileUrl) {
                                      setPreviewDoc({
                                        url: videoDoc.fileUrl,
                                        type: "video_kyc",
                                        mimeType: "video/mp4",
                                      });
                                    } else {
                                      toast.error(
                                        "Video URL not found. Please try uploading again.",
                                      );
                                    }
                                  }}
                                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <Eye className="w-4 h-4" /> View
                                </button>
                                <button
                                  onClick={() =>
                                    triggerFileUpload("video_kyc")
                                  }
                                  className="px-4 py-2 bg-[#35503F] text-[#FEF8C3] rounded-lg text-sm font-medium hover:bg-[#35503F]/90 flex items-center gap-2"
                                >
                                  <RefreshCw className="w-4 h-4" /> Replace
                                </button>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div className="text-center space-y-4">
                            <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                              <Upload className="w-10 h-10 text-yellow-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                Upload Verification Video
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">
                                Select a clear video following the
                                instructions
                              </p>
                            </div>
                            <button
                              onClick={() => triggerFileUpload("video_kyc")}
                              disabled={isUploading}
                              className="px-6 py-2.5 bg-[#35503F] text-[#FEF8C3] rounded-xl font-bold hover:bg-[#35503F]/90 transition-all shadow-md flex items-center gap-2 mx-auto disabled:opacity-50"
                            >
                              {isUploading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                <Upload className="w-4 h-4" />
                              )}
                              {isUploading
                                ? "Uploading..."
                                : "Select Video File"}
                            </button>
                            <p className="text-xs text-gray-400">
                              Supported formats: MP4, WEBM, MOV (Max 50MB)
                            </p>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100 flex justify-end">
                    <button
                      onClick={() => setActiveStep("documents")}
                      className="px-8 py-3 bg-[#35503F] text-[#FEF8C3] rounded-xl font-bold hover:bg-[#35503F]/90 transition-all flex items-center gap-2 shadow-md"
                    >
                      Continue to Documents{" "}
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {activeStep === "documents" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold  text-gray-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#35503F]" />{" "}
                      Required Documents
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {requiredDocTypes.map((docType) => {
                      const uploadedDoc = kycData?.documents?.find(
                        (d) => d.type === docType.type,
                      );
                      const status = uploadedDoc?.status || "pending";
                      const statusConfig = getStatusConfig(
                        status as DocumentStatus,
                      );
                      const isUploading = uploading === docType.type;
                      return (
                        <div
                          key={docType.type}
                          className={`p-4 border rounded-xl transition-colors ${status === "rejected" ? "border-red-200 bg-red-50" : "border-gray-200 hover:border-yellow-300"}`}
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium text-gray-900">
                                  {docType.name}
                                </h3>
                                {docType.required && (
                                  <span className="text-xs text-red-500">
                                    *Required
                                  </span>
                                )}
                                {uploadedDoc && (
                                  <span
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}
                                  >
                                    <statusConfig.icon className="w-3 h-3" />
                                    {statusConfig.label}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500">
                                {docType.description}
                              </p>
                              {uploadedDoc?.name && (
                                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                  <FileText className="w-3 h-3" />{" "}
                                  {uploadedDoc.name} - Uploaded on{" "}
                                  {new Date(
                                    uploadedDoc.uploadedAt || "",
                                  ).toLocaleDateString("en-IN")}
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
                                <button
                                  onClick={() =>
                                    setPreviewDoc({
                                      url: uploadedDoc.fileUrl!,
                                      type: docType.type,
                                      mimeType: uploadedDoc.name
                                        ?.toLowerCase()
                                        .endsWith(".pdf")
                                        ? "application/pdf"
                                        : "image/*",
                                    })
                                  }
                                  className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                                >
                                  <Eye className="w-4 h-4" /> View
                                </button>
                              )}
                              {status !== "approved" && (
                                <>
                                  <button
                                    onClick={() =>
                                      triggerFileUpload(docType.type)
                                    }
                                    disabled={isUploading || !!deleting}
                                    className={`flex items-center gap-1.5 px-3 py-2 ${uploadedDoc ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-[#35503F] text-[#FEF8C3] hover:bg-[#35503F]/90"} rounded-lg text-sm font-medium transition-colors disabled:opacity-50`}
                                  >
                                    {isUploading ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : uploadedDoc ? (
                                      <RefreshCw className="w-4 h-4" />
                                    ) : (
                                      <Upload className="w-4 h-4" />
                                    )}
                                    {uploadedDoc ? "Replace" : "Upload"}
                                  </button>

                                  {uploadedDoc && (
                                    <button
                                      onClick={() =>
                                        handleDeleteDocument(docType.type)
                                      }
                                      disabled={
                                        deleting === docType.type ||
                                        isUploading
                                      }
                                      className="flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 border border-red-100"
                                      title="Delete Document"
                                    >
                                      {deleting === docType.type ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <Trash2 className="w-4 h-4" />
                                      )}
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">
                      <strong>Accepted formats:</strong> PDF, JPG, PNG (Max
                      5MB per file)
                    </p>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setActiveStep("review")}
                      className="px-6 py-2 bg-[#35503F] text-[#FEF8C3] rounded-lg font-medium hover:bg-[#35503F]/90 transition-colors flex items-center gap-2"
                    >
                      Proceed to Review <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {activeStep === "review" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold  text-gray-900 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-[#35503F]" /> Review &
                      Submit
                    </h2>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <p className="text-sm text-yellow-800">
                      Please review all your information before submitting.
                      Once submitted, changes may require re-verification.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          Personal Information
                        </span>
                      </div>
                      {kycData?.personalInfo?.fullName &&
                        kycData?.personalInfo?.phone &&
                        kycData?.personalInfo?.aadhaarNumber ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <Clock className="w-5 h-5 text-[#35503F]" />
                      )}
                    </div>

                    {kycType === "business" && (
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Building2 className="w-5 h-5 text-gray-400" />
                          <span className="font-medium text-gray-900">
                            Business Information
                          </span>
                        </div>
                        {kycData?.businessInfo?.companyName ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <Clock className="w-5 h-5 text-[#35503F]" />
                        )}
                      </div>
                    )}

                    {!isPartnerMode && (
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileVideo className="w-5 h-5 text-gray-400" />
                          <span className="font-medium text-gray-900">
                            Video KYC
                          </span>
                        </div>
                        {kycData?.documents?.find(
                          (d) => d.type === "video_kyc",
                        ) ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <Clock className="w-5 h-5 text-[#35503F]" />
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          Documents (
                          {kycData?.documents?.filter(
                            (d) =>
                              d.type !== "video_kyc" &&
                              (d.status === "approved" ||
                                d.status === "pending"),
                          ).length || 0}
                          /{requiredDocTypes.filter((d) => d.required).length}{" "}
                          uploaded)
                        </span>
                      </div>
                      {kycData?.documents?.filter(
                        (d) => d.type !== "video_kyc",
                      ).length >=
                        requiredDocTypes.filter((d) => d.required).length ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <Clock className="w-5 h-5 text-[#35503F]" />
                      )}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isConfirmed}
                        onChange={(e) => setIsConfirmed(e.target.checked)}
                        className="mt-1 w-4 h-4 text-[#35503F] rounded focus:ring-[#35503F]"
                      />
                      <span className="text-sm text-gray-600">
                        I confirm that all the information provided is
                        accurate and I agree to FlashSpace{" "}
                        <a
                          href="/terms"
                          className="text-yellow-600 hover:underline"
                        >
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                          href="/privacy"
                          className="text-yellow-600 hover:underline"
                        >
                          Privacy Policy
                        </a>
                        .
                      </span>
                    </label>
                  </div>

                  {/* Show warning if not ready to submit */}
                  {!isReadyForSubmission() &&
                    kycData?.overallStatus !== "approved" &&
                    kycData?.overallStatus !== "pending" && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <p className="text-sm text-amber-800 font-medium flex items-start gap-2">
                          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>
                            Please complete all required steps before
                            submitting:
                            {!isPersonalInfoSaved() && (
                              <span className="block">
                                ΓÇó Personal Information
                              </span>
                            )}
                            {kycType === "business" &&
                              !isBusinessInfoSaved() && (
                                <span className="block">
                                  ΓÇó Business Information
                                </span>
                              )}
                            {!isPartnerMode && !isVideoKYCComplete() && (
                              <span className="block">ΓÇó Video KYC</span>
                            )}
                            {!areAllRequiredDocsUploaded() && (
                              <span className="block">
                                ΓÇó Upload all required documents
                              </span>
                            )}
                          </span>
                        </p>
                      </div>
                    )}

                  {/* Show success when ready to submit */}
                  {isReadyForSubmission() &&
                    kycData?.overallStatus !== "approved" &&
                    kycData?.overallStatus !== "pending" && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <p className="text-sm text-green-800 font-medium flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" /> All
                          requirements completed (100%)! You can now submit
                          for verification.
                        </p>
                      </div>
                    )}

                  {linkBookingId && kycData?.overallStatus === "approved" && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                      <p className="text-sm text-green-800 font-medium flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> This profile is
                        verified! Click "Use for Booking" to activate your
                        space.
                      </p>
                    </div>
                  )}

                  <button
                    onClick={async () => {
                      if (
                        linkBookingId &&
                        kycData?.overallStatus === "approved"
                      ) {
                        handleLinkBooking(profileId!);
                      } else if (
                        kycData?.overallStatus !== "approved" &&
                        kycData?.overallStatus !== "pending"
                      ) {
                        if (!isReadyForSubmission()) {
                          toast.error(
                            "Please complete all required steps before submitting.",
                          );
                          return;
                        }

                        if (!isConfirmed) {
                          toast.error("Please confirm the verification statement.");
                          return;
                        }

                        // Submit KYC for review
                        setSaving(true);
                        try {
                          const response =
                            await userDashboardService.submitKYC(profileId!);
                          if (response.success) {
                            toast.success(
                              "Your KYC has been submitted for verification. Our team will review it shortly.",
                            );
                            fetchKYC(); // Refresh to show new status
                          } else {
                            toast.error(response.message || "Failed to submit KYC");
                          }
                        } catch (err) {
                          console.error("Failed to submit KYC:", err);
                          toast.error("Failed to submit KYC for review");
                        } finally {
                          setSaving(false);
                        }
                      }
                    }}
                    disabled={
                      saving ||
                      (!linkBookingId &&
                        kycData?.overallStatus === "approved") ||
                      (!linkBookingId &&
                        kycData?.overallStatus === "pending") ||
                      (!isConfirmed &&
                        kycData?.overallStatus !== "approved" &&
                        kycData?.overallStatus !== "pending") ||
                      (!linkBookingId &&
                        !isReadyForSubmission() &&
                        kycData?.overallStatus !== "approved" &&
                        kycData?.overallStatus !== "pending") ||
                      (!linkBookingId &&
                        kycData?.overallStatus !== "approved" &&
                        kycData?.overallStatus !== "pending" &&
                        !isConfirmed)
                    }
                    className="w-full py-3 bg-[#35503F] text-[#FEF8C3] rounded-xl font-semibold hover:bg-[#35503F]/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />{" "}
                        Processing...
                      </>
                    ) : linkBookingId &&
                      kycData?.overallStatus === "approved" ? (
                      "Use for Booking"
                    ) : kycData?.overallStatus === "approved" ? (
                      "Already Verified"
                    ) : kycData?.overallStatus === "pending" ? (
                      "Under Review"
                    ) : (
                      "Submit for Verification"
                    )}
                    {!saving && <ChevronRight className="w-5 h-5" />}
                  </button>
                </div>
              )}

              {/* Document Preview Modal */}
              {
                previewDoc && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
                      <div className="flex items-center justify-between p-4 border-b">
                        <h3 className="font-semibold text-lg">Document Preview</h3>
                        <button
                          onClick={() => setPreviewDoc(null)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex-1 overflow-auto bg-gray-100 p-4 flex items-center justify-center">
                        {(() => {
                          const fullUrl = previewDoc.url.startsWith("http")
                            ? previewDoc.url
                            : `${API_CONFIG.BASE_URL}${previewDoc.url}`;

                          // console.log("Preview Doc:", previewDoc);
                          // console.log("Full URL:", fullUrl);
                          // console.log("MIME Type:", previewDoc.mimeType);

                          if (previewDoc.mimeType === "application/pdf") {
                            return (
                              <iframe
                                src={fullUrl}
                                className="w-full h-full min-h-[60vh] rounded-lg border shadow-sm"
                                title="PDF Preview"
                              />
                            );
                          } else if (
                            previewDoc.mimeType === "video/mp4" ||
                            previewDoc.type === "video_kyc"
                          ) {
                            return (
                              <video
                                src={fullUrl}
                                controls
                                className="max-w-full max-h-[70vh] rounded-lg shadow-md"
                                controlsList="nodownload"
                                onError={(e) => {
                                  console.error("Video load error:", e);
                                  console.error("Video src:", fullUrl);
                                }}
                              >
                                Your browser does not support the video tag.
                              </video>
                            );
                          } else {
                            return (
                              <img
                                src={fullUrl}
                                alt="Document Preview"
                                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-md"
                              />
                            );
                          }
                        })()}
                      </div>
                    </div>
                  </div>
                )
              }
            </>
          )}
        </div>
      </div>
    </div >
  );
}
