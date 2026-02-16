import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
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
              isPartner: true,
              kycType: "individual",
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
            };
            response = {
              success: true,
              data: mappedData,
              message: "Partner loaded",
            };
          }
        } catch (e) {
          console.log("Not a partner ID either");
        }
      }

      if (response.success && response.data) {
        if (profileId && profileId !== "new") {
          // Specific profile loaded
          const data = response.data as KYCData;
          setKycData(data);

          // Detect if this is a partner profile
          if (
            data.isPartner ||
            (data.kycType === "individual" &&
              data.personalInfo?.fullName &&
              data.personalInfo.fullName !== user?.fullName)
          ) {
            setIsPartnerMode(true);
          } else {
            setIsPartnerMode(false);
          }
          // ... existing logic to populate form ...

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

          // Pre-fill personal form if exist
          setPersonalForm((prev) => ({
            phone: data.personalInfo?.phone || user?.phoneNumber || "",
            dateOfBirth: data.personalInfo?.dateOfBirth
              ? new Date(data.personalInfo.dateOfBirth)
                  .toISOString()
                  .split("T")[0]
              : "",
            aadhaar: prev.aadhaar || data.personalInfo?.aadhaarNumber || "", // Keep existing value or use full number
            pan: data.personalInfo?.panNumber || "",
            fullName: data.personalInfo?.fullName || "",
            email: data.personalInfo?.email || user?.email || "",
          }));

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
                setPartnerProfiles(partnersResp.data);
              } else {
                setPartnerProfiles([]);
              }
            } catch (e) {
              console.error("Failed to fetch partners", e);
              setPartnerProfiles([]); // Fallback
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
          address: "N/A", // Address is not currently in the form for partners, passing placeholder
        };

        const partnerResponse =
          await userDashboardService.addPartner(partnerData);

        if (partnerResponse.success) {
          setEditMode(false);
          // Refresh to show in list
          fetchKYC();
          setProfileId(null); // Go back to list
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
        // fetchKYC(); // Relies on useEffect [profileId]
      }
    } catch (err) {
      console.error("Failed to save business info");
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
      handleUploadDocument(uploadingDocType, file);
    }
  };

  const triggerFileUpload = (docType: string) => {
    setUploadingDocType(docType);
    const accept =
      docType === "video_kyc" ? ".mp4,.webm,.mov" : ".pdf,.jpg,.jpeg,.png";
    setUploadAccept(accept);
    setTimeout(() => fileInputRef.current?.click(), 0);
  };

  // Video KYC Handlers removed - using triggerFileUpload instead

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
      default:
        return { bg: "bg-gray-500", text: "Not Started", icon: Info };
    }
  };

  const steps = [
    { id: "personal", label: "Personal Info", icon: User },
    ...(kycType === "business"
      ? [{ id: "business", label: "Business Info", icon: Building2 }]
      : []),
    ...(!isPartnerMode
      ? [{ id: "video", label: "Video KYC", icon: FileVideo }]
      : []),
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
    if (kycType !== "business") return true;
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

    // Video KYC - accessible after previous steps are saved (not shown for partners)
    if (step === "video") {
      if (isPartnerMode) return false; // Partners don't have video KYC
      if (kycType === "business") {
        return isPersonalInfoSaved() && isBusinessInfoSaved();
      }
      return isPersonalInfoSaved();
    }

    // Documents - accessible after previous steps are saved
    if (step === "documents") {
      if (kycType === "business") {
        return isPersonalInfoSaved() && isBusinessInfoSaved();
      }
      return isPersonalInfoSaved();
    }

    // Review - accessible after all previous steps including documents
    if (step === "review") {
      if (kycType === "business") {
        return isPersonalInfoSaved() && isBusinessInfoSaved();
      }
      return isPersonalInfoSaved();
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

    // Check video KYC completion (not applicable for partners)
    const hasVideoKYC =
      !isPartnerMode &&
      !!kycData?.documents?.find((d) => d.type === "video_kyc");

    if (isBusiness) {
      // Personal Info - 20%
      if (hasPersonalInfo) progress += 20;

      // Business Info - 20%
      if (hasBusinessInfo) progress += 20;

      // Video KYC - 20% (not for partners)
      if (!isPartnerMode && hasVideoKYC) progress += 20;

      // Documents - 40% or 60% for partners (reaches 100% when all docs uploaded)
      const uploadedDocsCount =
        kycData?.documents?.filter((d) => d.type !== "video_kyc").length || 0;
      const requiredDocsCount = 4; // pan, gst, coi, address (video removed)
      const docWeight = isPartnerMode ? 60 : 40; // Higher weight for partners since no video KYC
      progress += Math.min(
        docWeight,
        Math.round((uploadedDocsCount / requiredDocsCount) * docWeight),
      );
    } else {
      // Personal Info - 30% or 50% for partners
      const personalWeight = isPartnerMode ? 50 : 30;
      if (hasPersonalInfo) progress += personalWeight;

      // Video KYC - 30% (not for partners)
      if (!isPartnerMode && hasVideoKYC) progress += 30;

      // Documents - 40% or 50% for partners (reaches 100% when all docs uploaded)
      const uploadedDocsCount =
        kycData?.documents?.filter((d) => d.type !== "video_kyc").length || 0;
      const requiredDocsCount = 2; // pan, aadhaar (video removed)
      const docWeight = isPartnerMode ? 50 : 40; // Higher weight for partners since no video KYC
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
              className="px-4 py-2 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-500 transition-colors flex items-center gap-2"
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
            <h1 className="text-2xl md:text-3xl font-bold font-[Poppins] text-gray-900">
              {profileId ? "Profile" : "Business"}{" "}
              <span className="text-yellow-500">Verification</span>
            </h1>
            <p className="text-gray-500 mt-1">
              {linkBookingId
                ? "Select or create a business profile for your space"
                : "Manage your business profiles for seamless verification"}
            </p>
          </div>
          {profileId && profileId !== "new" && (
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-white ${overallStatus.bg}`}
            >
              <overallStatus.icon className="w-4 h-4" />
              <span className="font-medium">{overallStatus.text}</span>
            </div>
          )}
        </div>

        {!profileId ? (
          <div className="space-y-8">
            {/* Contextual Message for Booking Linking */}
            {linkBookingId && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-900">
                      Verification Required for Booking
                    </h3>
                    <p className="text-sm text-yellow-800 mt-1">
                      To activate your booking, please ensure your{" "}
                      <strong>Personal Identity</strong> is verified first.
                      Then, you can either link an existing Business Profile or
                      create a new one.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Section 1: Personal Identity */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
                1. Personal Identity (Mandatory)
              </h2>

              {individualProfile ? (
                // Existing Individual Logic
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
                  <div className="flex items-start justify-between mb-4 pl-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-50 rounded-lg">
                        <User className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Personal Verification
                        </h3>
                        <p className="text-sm text-gray-500">
                          {individualProfile.profileName || "Individual"}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusConfig(individualProfile.overallStatus as DocumentStatus).bg} ${getStatusConfig(individualProfile.overallStatus as DocumentStatus).text}`}
                    >
                      {
                        getOverallStatusConfig(
                          individualProfile.overallStatus || "not_started",
                        ).text
                      }
                    </span>
                  </div>

                  <div className="pl-2">
                    <button
                      onClick={() => {
                        setProfileId(individualProfile._id!);
                        setSearchParams((params) => {
                          params.set("profileId", individualProfile._id!);
                          return params;
                        });
                      }}
                      className="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      {individualProfile.overallStatus === "approved"
                        ? "View Details"
                        : "Continue Verification"}
                    </button>
                  </div>
                </div>
              ) : (
                // No Individual Profile -> Call to Action
                <div className="bg-white rounded-xl shadow-sm border-2 border-dashed border-yellow-200 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-yellow-50 rounded-full">
                      <User className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Start Personal Verification
                      </h3>
                      <p className="text-sm text-gray-500">
                        You must verify your identity before adding a business.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setProfileId("new");
                      setKycType("individual");
                      setActiveStep("personal");
                      // Reset form
                      setBusinessForm({
                        profileName: user?.fullName
                          ? `${user.fullName} (Personal)`
                          : "My Personal Profile",
                        companyName: "",
                        companyType: "",
                        gstNumber: "",
                        cinNumber: "",
                        registeredAddress: "",
                        industry: "",
                        partners: [],
                      });
                    }}
                    className="px-6 py-2 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-500 shadow-sm whitespace-nowrap"
                  >
                    Start Verification
                  </button>
                </div>
              )}
            </div>

            {/* Section 2: Partner Profiles */}
            <div
              className={`space-y-4 transition-opacity duration-300 ${!individualProfile || individualProfile.overallStatus !== "approved" ? "opacity-50 grayscale-[0.5] pointer-events-none" : ""}`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-2 gap-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  2. Partner Profiles
                </h2>
                <div className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  <span>
                    Adding a company with partners? Add them here first!
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {partnerProfiles.map((p) => {
                  const status = getOverallStatusConfig(p.overallStatus);
                  return (
                    <div
                      key={p._id}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <Users className="w-6 h-6 text-gray-600" />
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full text-white ${status.bg}`}
                        >
                          {status.text}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 truncate mb-1">
                        {p.profileName}
                      </h3>
                      <p className="text-xs text-gray-500 mb-4 uppercase tracking-wide">
                        Partner
                      </p>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setProfileId(p._id!);
                            setSearchParams((params) => {
                              params.set("profileId", p._id!);
                              return params;
                            });
                            setIsPartnerMode(true);
                          }}
                          className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  );
                })}

                <button
                  onClick={() => {
                    setProfileId("new");
                    setKycType("individual");
                    setActiveStep("personal");
                    setIsPartnerMode(true);
                    setBusinessForm({
                      profileName: "",
                      companyName: "",
                      companyType: "",
                      gstNumber: "",
                      cinNumber: "",
                      registeredAddress: "",
                      industry: "",
                      partners: [],
                    });
                    setPersonalForm({
                      phone: "",
                      dateOfBirth: "",
                      aadhaar: "",
                      pan: "",
                      fullName: "",
                      email: "",
                    });
                  }}
                  disabled={
                    !individualProfile ||
                    individualProfile.overallStatus !== "approved"
                  }
                  className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-200 p-5 flex flex-col items-center justify-center text-gray-400 hover:border-yellow-400 hover:text-yellow-600 transition-all group min-h-[160px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-400"
                >
                  <div className="p-3 bg-gray-50 rounded-full group-hover:bg-yellow-50 mb-3 transition-colors">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="font-medium">Add Partner Profile</span>
                </button>
              </div>
            </div>

            {/* Section 3: Business Profiles */}
            <div
              className={`space-y-4 transition-opacity duration-300 ${!individualProfile || individualProfile.overallStatus !== "approved" ? "opacity-50 grayscale-[0.5] pointer-events-none" : ""}`}
            >
              <div className="flex items-center justify-between border-b pb-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  3. Business Profiles
                </h2>
                {(!individualProfile ||
                  individualProfile.overallStatus !== "approved") && (
                  <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded">
                    Locked until Personal Verification is Approved
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {businessProfiles.map((p) => {
                  const status = getOverallStatusConfig(p.overallStatus);
                  return (
                    <div
                      key={p._id}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <Building2 className="w-6 h-6 text-gray-600" />
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full text-white ${status.bg}`}
                        >
                          {status.text}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 truncate mb-1">
                        {p.profileName}
                      </h3>
                      <p className="text-xs text-gray-500 mb-4 uppercase tracking-wide">
                        {p.businessInfo?.companyName || "Business Profile"}
                      </p>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setProfileId(p._id!);
                            setSearchParams((params) => {
                              params.set("profileId", p._id!);
                              return params;
                            });
                          }}
                          className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                        >
                          Details
                        </button>

                        {linkBookingId && p.overallStatus === "approved" && (
                          <button
                            onClick={() => handleLinkBooking(p._id!)}
                            disabled={saving}
                            className="px-3 py-2 bg-yellow-400 text-black rounded-lg text-sm font-medium hover:bg-yellow-500 disabled:opacity-50 flex items-center gap-1"
                          >
                            {saving ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              "Select"
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                <button
                  onClick={() => {
                    setProfileId("new");
                    setKycType("business");
                    setActiveStep("business");
                    setBusinessForm({
                      profileName: "",
                      companyName: "",
                      companyType: "",
                      gstNumber: "",
                      cinNumber: "",
                      registeredAddress: "",
                      industry: "",
                      partners: [],
                    });
                  }}
                  disabled={
                    !individualProfile ||
                    individualProfile.overallStatus !== "approved"
                  }
                  className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-200 p-5 flex flex-col items-center justify-center text-gray-400 hover:border-yellow-400 hover:text-yellow-600 transition-all group min-h-[160px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-400"
                >
                  <div className="p-3 bg-gray-50 rounded-full group-hover:bg-yellow-50 mb-3 transition-colors">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="font-medium">Add Business Profile</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
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
                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-500 ease-out"
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
                  <div className="flex bg-gray-100 p-1 rounded-lg self-end h-min">
                    <button
                      onClick={() => setKycType("individual")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${kycType === "individual" ? "bg-white text-black shadow-sm" : "text-gray-500"}`}
                    >
                      <User className="w-4 h-4" /> Individual
                    </button>
                    <button
                      onClick={() => setKycType("business")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${kycType === "business" ? "bg-white text-black shadow-sm" : "text-gray-500"}`}
                    >
                      <Building2 className="w-4 h-4" /> Business
                    </button>
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
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors relative ${
                          activeStep === step.id
                            ? "bg-yellow-400 text-black"
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
                  <h2 className="text-xl font-bold font-[Poppins]">
                    Start New Verification
                  </h2>
                  <p className="text-gray-500">
                    Provide a name for this profile and select the type to
                    begin.
                  </p>
                  <button
                    onClick={handleSaveBusinessInfo}
                    disabled={saving || !businessForm.profileName}
                    className="w-full py-3 bg-yellow-400 text-black rounded-lg font-bold hover:bg-yellow-500 transition-colors disabled:opacity-50"
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
                      <h2 className="text-lg font-semibold font-[Poppins] text-gray-900 flex items-center gap-2">
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
                          onChange={(e) =>
                            setPersonalForm({
                              ...personalForm,
                              phone: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          required
                          minLength={10}
                          maxLength={10}
                          pattern="[0-9]{10}"
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
                          onChange={(e) =>
                            setPersonalForm({
                              ...personalForm,
                              aadhaar: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          required
                          minLength={12}
                          maxLength={12}
                          pattern="[0-9]{12}"
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
                          } else if (isPartnerMode) {
                            setActiveStep("documents"); // Partners skip video KYC
                          } else {
                            setActiveStep("video"); // Regular individual goes to video
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
                        className="px-6 py-2 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-500 transition-colors flex items-center gap-2 disabled:opacity-50"
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
                      <h2 className="text-lg font-semibold font-[Poppins] text-gray-900 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-yellow-500" />{" "}
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
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
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
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 uppercase"
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
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 uppercase"
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
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
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
                                className="w-5 h-5 text-yellow-500 rounded focus:ring-yellow-400"
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
                          // Business profiles go to video unless it's somehow a partner (edge case)
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
                        className="px-6 py-2 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-500 transition-colors flex items-center gap-2 disabled:opacity-50"
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

                {activeStep === "video" && !isPartnerMode && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold font-[Poppins] text-gray-900 flex items-center gap-2">
                        <FileVideo className="w-5 h-5 text-yellow-500" /> Video
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
                            return (
                              <div className="text-center space-y-4">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900">
                                    Video Uploaded
                                  </h3>
                                  <p className="text-sm text-gray-500 mt-1">
                                    {videoDoc.name}
                                  </p>
                                </div>
                                <div className="flex gap-2 justify-center">
                                  <button
                                    onClick={() => {
                                      console.log("Video document:", videoDoc);
                                      console.log(
                                        "Video fileUrl:",
                                        videoDoc.fileUrl,
                                      );
                                      if (videoDoc.fileUrl) {
                                        setPreviewDoc({
                                          url: videoDoc.fileUrl,
                                          type: "video_kyc",
                                          mimeType: "video/mp4",
                                        });
                                      } else {
                                        alert(
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
                                    className="px-4 py-2 bg-yellow-400 text-black rounded-lg text-sm font-medium hover:bg-yellow-500 flex items-center gap-2"
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
                                className="px-6 py-2.5 bg-yellow-400 text-black rounded-xl font-bold hover:bg-yellow-500 transition-all shadow-md flex items-center gap-2 mx-auto disabled:opacity-50"
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
                        className="px-8 py-3 bg-yellow-400 text-black rounded-xl font-bold hover:bg-yellow-500 transition-all flex items-center gap-2 shadow-md"
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
                      <h2 className="text-lg font-semibold font-[Poppins] text-gray-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-yellow-500" />{" "}
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
                                      className={`flex items-center gap-1.5 px-3 py-2 ${uploadedDoc ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-yellow-400 text-black hover:bg-yellow-500"} rounded-lg text-sm font-medium transition-colors disabled:opacity-50`}
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
                        className="px-6 py-2 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-500 transition-colors flex items-center gap-2"
                      >
                        Proceed to Review <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {activeStep === "review" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold font-[Poppins] text-gray-900 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-yellow-500" /> Review &
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
                          <Clock className="w-5 h-5 text-yellow-500" />
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
                            <Clock className="w-5 h-5 text-yellow-500" />
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
                            <Clock className="w-5 h-5 text-yellow-500" />
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
                          <Clock className="w-5 h-5 text-yellow-500" />
                        )}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-100">
                      <label className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          className="mt-1 w-4 h-4 text-yellow-500 rounded focus:ring-yellow-400"
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
                                  • Personal Information
                                </span>
                              )}
                              {kycType === "business" &&
                                !isBusinessInfoSaved() && (
                                  <span className="block">
                                    • Business Information
                                  </span>
                                )}
                              {!isPartnerMode && !isVideoKYCComplete() && (
                                <span className="block">• Video KYC</span>
                              )}
                              {!areAllRequiredDocsUploaded() && (
                                <span className="block">
                                  • Upload all required documents
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
                            alert(
                              "Please complete all required steps before submitting.",
                            );
                            return;
                          }

                          // Submit KYC for review
                          setSaving(true);
                          try {
                            const response =
                              await userDashboardService.submitKYC(profileId!);
                            if (response.success) {
                              alert(
                                "Your KYC has been submitted for verification. Our team will review it shortly.",
                              );
                              fetchKYC(); // Refresh to show new status
                            } else {
                              alert(response.message || "Failed to submit KYC");
                            }
                          } catch (err) {
                            console.error("Failed to submit KYC:", err);
                            alert("Failed to submit KYC for review");
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
                        (!linkBookingId &&
                          !isReadyForSubmission() &&
                          kycData?.overallStatus !== "approved" &&
                          kycData?.overallStatus !== "pending")
                      }
                      className="w-full py-3 bg-yellow-400 text-black rounded-xl font-semibold hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
              </>
            )}
          </div>
        )}
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
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

                console.log("Preview Doc:", previewDoc);
                console.log("Full URL:", fullUrl);
                console.log("MIME Type:", previewDoc.mimeType);

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
      )}
    </div>
  );
}
