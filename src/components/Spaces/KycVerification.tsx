// Import the new UI component
import { SpaceInformationStepStandalone } from "./spaceDetailUi";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { API } from "@/api";
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
import DemoKYCVideo from "@/assets/kycVideo/DemoKYCVideo.mp4";
import {
  getMySpaceUserKyc,
  upsertSpaceUserKyc,
  uploadSpaceUserKycFile,
  upsertSpaceUserKycBusinessInfo,
  submitSpaceUserKyc,
  SpaceUserKycResponse,
} from "@/Api/spacePartnerKyc.service";
import toast from "react-hot-toast";
import {
  createSpaceDetails,
  SpaceDetailsPayload,
} from "../Api/spaceDetails.service";
import { getPartnerProperties } from "@/services/property.service";
import { Property } from "@/types/services";
import { MapPin } from "lucide-react";

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

type KYCDocument = {
  type: string;
  name?: string;
  fileUrl?: string;
  status?: DocumentStatus | string;
  uploadedAt?: string;
  rejectionReason?: string;
};

type KYCData = {
  _id?: string;
  profileName?: string;
  kycType?: KYCType | string;
  isPartner?: boolean;
  overallStatus?: DocumentStatus | "not_started" | "resubmit" | string;
  personalInfo?: {
    fullName?: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    aadhaarNumber?: string;
    panNumber?: string;
  };
  businessInfo?: {
    companyName?: string;
    companyType?: string;
    gstNumber?: string;
    cinNumber?: string;
    registeredAddress?: string;
    industry?: string;
    partners?: string[];
  };
  documents?: KYCDocument[];
};

// Space & Owner Types
type OwnerDetails = {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  address?: string;
};

type SpaceDocument = {
  id?: string;
  name: string;
  fileUrl: string;
  uploadedAt?: string;
  status?: "pending" | "approved" | "rejected";
};

type NavItem = {
  key: "spaceDetail" | "ownerDetail" | "spaceDocuments";
  label: string;
};

export type SpaceType = {
  spaceName: string;
  ownerDetails: OwnerDetails;
  spaceDocuments: SpaceDocument[];
  navs: NavItem[];
};

export default function KYCVerification() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [profileId, setProfileId] = useState<string | null>(
    searchParams.get("profileId"),
  );
  const userSpaceId = "userSpaceId"; // Replace with actual user space id if available
  const linkBookingId =
    searchParams.get("linkBookingId") || searchParams.get("bookingId");
  const navigate = useNavigate();
  //space info
  const [space, setSpace] = useState<SpaceType | null>(null);

  // --- Fix: Ensure showSpaceInfoStep is always defined ---
  const [showSpaceInfoStep, setShowSpaceInfoStep] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const initializedRef = useRef(false);
  const [activeStep, setActiveStep] = useState<VerificationStep>("personal");
  const [kycType, setKycType] = useState<KYCType>("individual");
  const [kycData, setKycData] = useState<KYCData | null>(null);

  // Multi-Level State
  const [individualProfile, setIndividualProfile] = useState<KYCData | null>(
    null,
  );
  const [properties, setProperties] = useState<Property[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploadingDocType, setUploadingDocType] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [hasStartedNewProfile, setHasStartedNewProfile] = useState(false);
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

  const [spaceDetailsForm, setSpaceDetailsForm] = useState({
    spaceName: "",
    sampleAgreementUrl: "",
    ownerOfPremisesName: "",
    propertyTaxReceiptUrl: "",
  });
  const [spaceDetailsSaving, setSpaceDetailsSaving] = useState(false);
  const [spaceDetailsSuccess, setSpaceDetailsSuccess] = useState<string | null>(
    null,
  );
  const [spaceDetailsError, setSpaceDetailsError] = useState<string | null>(
    null,
  );

  const [termsAccepted, setTermsAccepted] = useState(false);

  const mapBackendKycToFrontend = (
    backend: SpaceUserKycResponse | null,
    fullName?: string | null,
    email?: string | null,
  ): KYCData | null => {
    if (!backend) return null;

    const fileBase = API.domain.replace(/\/$/, "");

    const buildFileUrl = (relativeUrl?: string | null) => {
      if (!relativeUrl) return undefined;
      return `${fileBase}${relativeUrl}`;
    };

    const getNameFromUrl = (url: string, fallback: string) => {
      const parts = url.split("/");
      return parts[parts.length - 1] || fallback;
    };

    const documents: KYCDocument[] = [];

    if (backend.panImageUrl) {
      const fullUrl = buildFileUrl(backend.panImageUrl)!;
      documents.push({
        type: "pan_card",
        name: getNameFromUrl(fullUrl, "PAN Document"),
        fileUrl: fullUrl,
        status: backend.panImageStatus || "pending",
        rejectionReason: backend.panImageRejectMessage,
      });
    }

    if (backend.aadhaarImageUrl) {
      const fullUrl = buildFileUrl(backend.aadhaarImageUrl)!;
      documents.push({
        type: "aadhaar",
        name: getNameFromUrl(fullUrl, "Aadhaar Document"),
        fileUrl: fullUrl,
        status: backend.aadhaarImageStatus || "pending",
        rejectionReason: backend.aadhaarImageRejectMessage,
      });
    }

    if (backend.videoKycUrl) {
      const fullUrl = buildFileUrl(backend.videoKycUrl)!;
      documents.push({
        type: "video_kyc",
        name: getNameFromUrl(fullUrl, "Video KYC"),
        fileUrl: fullUrl,
        status: backend.videoKycStatus || "pending",
        rejectionReason: backend.videoKycRejectMessage,
      });
    }

    return {
      _id: backend._id,
      profileName: fullName
        ? `${fullName} (Personal)`
        : "My Personal KYC Profile",
      kycType: "individual",
      isPartner: false,
      overallStatus: backend.kycStatus || backend.overallStatus || "pending",
      personalInfo: {
        fullName: backend.fullName || fullName || "",
        email: backend.email || email || "",
        phone: backend.phoneNumber,
        dateOfBirth: backend.dateOfBirth?.slice(0, 10),
        aadhaarNumber: backend.aadhaarNumber,
        panNumber: backend.panNumber,
      },
      businessInfo: {
        companyName: backend.companyName,
        companyType: backend.companyType,
        gstNumber: backend.gstNumber,
        cinNumber: backend.cinRegistrationNumber,
        registeredAddress: backend.registeredAddress,
        industry: backend.industry,
        partners: backend.companyPartners || [],
      },
      documents,
    };
  };

  const fetchKYC = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const backendKyc = await getMySpaceUserKyc();
      const mapped = mapBackendKycToFrontend(
        backendKyc,
        user?.fullName || null,
        user?.email || null,
      );
      if (mapped) {
        setIndividualProfile(mapped);
        setKycData(mapped);
        setProfileId(mapped._id || null);

        setPersonalForm({
          fullName: mapped.personalInfo?.fullName || "",
          email: mapped.personalInfo?.email || "",
          phone: mapped.personalInfo?.phone || "",
          dateOfBirth: mapped.personalInfo?.dateOfBirth || "",
          aadhaar: mapped.personalInfo?.aadhaarNumber || "",
          pan: mapped.personalInfo?.panNumber || "",
        });
      } else {
        setIndividualProfile(null);
        setKycData(null);
        setProfileId(null);
      }
    } catch (err: unknown) {
      console.error("Failed to fetch KYC from backend", err);
      const message =
        err instanceof Error ? err.message : "Failed to load KYC details";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [user?.fullName, user?.email]);

  const fetchProperties = useCallback(async () => {
    setLoadingProperties(true);
    try {
      const props = await getPartnerProperties();
      setProperties(props);
    } catch (err) {
      console.error("Failed to fetch partner properties", err);
    } finally {
      setLoadingProperties(false);
    }
  }, []);

  const handleLinkBooking = async (pid: string) => {
    if (!linkBookingId) return;
    setSaving(true);
    try {
      alert(`Dummy: Booking ${linkBookingId} linked to profile ${pid}.`);
    } catch (err) {
      setError("Error linking booking (dummy mode)");
    } finally {
      setSaving(false);
    }
  };

  // Load KYC data from backend once
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    fetchKYC();
    fetchProperties();
  }, [fetchKYC, fetchProperties]);

  // When profileId changes, attach the matching dummy profile to kycData
  useEffect(() => {
    if (!profileId || profileId === "new") {
      setKycData(null);
      return;
    }

    const found =
      individualProfile?._id === profileId ? individualProfile : null;
    setKycData(found);
    setIsPartnerMode(!!found?.isPartner);
    if (found?.kycType) {
      setKycType(found.kycType as KYCType);
    }

    if (found?.personalInfo) {
      setPersonalForm({
        fullName: found.personalInfo.fullName || "",
        email: found.personalInfo.email || "",
        phone: found.personalInfo.phone || "",
        dateOfBirth: found.personalInfo.dateOfBirth || "",
        aadhaar: found.personalInfo.aadhaarNumber || "",
        pan: found.personalInfo.panNumber || "",
      });
    }

    // Sync business info to businessForm
    if (found?.businessInfo) {
      setBusinessForm({
        profileName: found.profileName || "",
        companyName: found.businessInfo.companyName || "",
        companyType: found.businessInfo.companyType || "",
        gstNumber: found.businessInfo.gstNumber || "",
        cinNumber: found.businessInfo.cinNumber || "",
        registeredAddress: found.businessInfo.registeredAddress || "",
        industry: found.businessInfo.industry || "",
        partners: found.businessInfo.partners || [],
      });
    }
  }, [profileId, individualProfile]);

  const handleSaveBusinessInfo = async () => {
    setSaving(true);
    try {
      const payload = {
        companyName: businessForm.companyName,
        companyType: businessForm.companyType,
        industry: businessForm.industry,
        gstNumber: businessForm.gstNumber,
        cinRegistrationNumber: businessForm.cinNumber,
        registeredAddress: businessForm.registeredAddress,
        companyPartners: businessForm.partners,
      };
      const backendKyc = await upsertSpaceUserKycBusinessInfo(payload);
      const mapped = mapBackendKycToFrontend(backendKyc);

      if (mapped) {
        setKycData(mapped);
        setIndividualProfile(mapped);

        const newId = mapped._id;
        if (newId) {
          setProfileId(newId);
          setSearchParams((params) => {
            params.set("profileId", newId);
            return params;
          });
        }
      }
    } catch (err) {
      setError("Failed to save business information");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDocument = async (docType: string) => {
    if (!profileId) return;
    if (!confirm("Are you sure you want to delete this document?")) return;

    setDeleting(docType);
    try {
      setKycData((prev) =>
        prev
          ? {
              ...prev,
              documents: (prev.documents || []).filter(
                (d) => d.type !== docType,
              ),
            }
          : prev,
      );
    } catch (err) {
      console.error("Failed to delete document (dummy mode)");
      alert("Failed to delete document (dummy mode)");
    } finally {
      setDeleting(null);
    }
  };

  const handleUploadDocument = async (docType: string, file: File) => {
    if (!profileId || profileId === "new") {
      alert(
        "Please save your personal information first before uploading documents.",
      );
      return;
    }

    // Only PAN, Aadhaar and Video KYC are supported by current backend
    const mapDocTypeToBackend = (
      type: string,
    ): "aadhaar_image" | "pan_image" | "video_kyc" | null => {
      if (type === "aadhaar") return "aadhaar_image";
      if (type === "pan_card") return "pan_image";
      if (type === "video_kyc") return "video_kyc";
      return null;
    };

    const backendType = mapDocTypeToBackend(docType);
    if (!backendType) {
      alert(
        "Backend upload is currently supported only for PAN, Aadhaar and Video KYC.",
      );
      return;
    }

    setUploading(docType);
    try {
      const backendKyc = await uploadSpaceUserKycFile(backendType, file);
      const mapped = mapBackendKycToFrontend(backendKyc);
      if (mapped) {
        setKycData(mapped);
        setIndividualProfile(mapped);
      }
    } catch (err) {
      console.error("Failed to upload KYC document", err);
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
          bg: "bg-[#3FA69E]",
          text: "text-white",
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
          bg: "bg-[#3FA69E]",
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
    { id: "business", label: "Business Info", icon: Building2 },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "review", label: "Review", icon: Shield },
  ];

  // Step validation functions
  const isPersonalInfoComplete = () => {
    if (isPartnerMode && (!personalForm.fullName || !personalForm.email))
      return false;
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

    if (isBusiness) {
      // Personal Info - 20%
      if (hasPersonalInfo) progress += 20;

      // Business Info - 20%
      if (hasBusinessInfo) progress += 20;

      // Documents - 60% (reaches 100% when all docs uploaded)
      const uploadedDocsCount =
        kycData?.documents?.filter((d) => d.type !== "video_kyc").length || 0;
      const requiredDocsCount = 4; // pan, gst, coi, address
      const docWeight = 60;
      progress += Math.min(
        docWeight,
        Math.round((uploadedDocsCount / requiredDocsCount) * docWeight),
      );
    } else {
      // Personal Info - 50%
      const personalWeight = 50;
      if (hasPersonalInfo) progress += personalWeight;

      // Documents - 50% (reaches 100% when all docs uploaded)
      const uploadedDocsCount =
        kycData?.documents?.filter((d) => d.type !== "video_kyc").length || 0;
      const requiredDocsCount = 2; // pan, aadhaar
      const docWeight = 50;
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

    return true;
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-[#3FA69E] animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading KYC data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] minw-full flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-700 font-medium mb-2">{error}</p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={fetchKYC}
              className="px-4 py-2 bg-[#3FA69E] text-black rounded-lg font-medium hover:bg-[#3FA69E] transition-colors flex items-center gap-2"
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
  let completionPercentage = getCompletionPercentage();
  if (kycData?.overallStatus === "approved") {
    completionPercentage = 100;
  }

  const rejectedDocs =
    kycData?.documents?.filter((d) => d.status === "rejected") || [];
  const rejectedDocNames = rejectedDocs.map((rd) => {
    const docInfo = requiredDocTypes.find((t) => t.type === rd.type);
    return docInfo?.name || rd.name || rd.type;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={uploadAccept}
        onChange={handleFileSelect}
      />

      <div className="w-full space-y-6">
        {/* Informative Note for Partners */}
        {(!kycData ||
          (kycData?.overallStatus !== "approved" &&
            kycData?.overallStatus !== "rejected")) && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8 shadow-sm">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Info className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-1">
                  Complete Your Verification
                </h3>
                <p className="text-blue-700/80 text-sm leading-relaxed">
                  To ensure a smooth onboarding process, please provide accurate
                  information and clear document uploads. Verification typically
                  takes 24-48 hours once submitted. You'll be notified via email
                  once our team reviews your application.
                </p>
              </div>
            </div>
          </div>
        )}

        {kycData?.overallStatus === "rejected" && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-8 shadow-sm animate-in fade-in slide-in-from-top-4">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-900 mb-1">
                  Verification Issues Found
                </h3>
                <p className="text-red-700/80 text-sm leading-relaxed mb-4">
                  Please review the issues highlighted below and update the
                  necessary documents to proceed with your verification.
                </p>

                {rejectedDocNames.length > 0 && (
                  <div className="text-sm text-red-800 bg-red-100/50 p-4 rounded-xl border border-red-100">
                    <strong className="block mb-2 text-red-900">
                      Action Required For:
                    </strong>
                    <ul className="list-disc pl-5 space-y-1">
                      {rejectedDocNames.map((name, idx) => (
                        <li key={idx} className="font-medium">
                          {name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {profileId && profileId !== "new" && (
                  <button
                    onClick={() => setActiveStep("documents")}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    Update Documents <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-[Poppins] text-gray-900">
              {profileId ? "Profile" : "Space"}{" "}
              <span className="text-[#3FA69E]">Verification</span>
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
              <div className="bg-[#3FA69E] border border-[#3FA69E] rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-[#3FA69E] flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-[#3FA69E]-900">
                      Verification Required for Booking
                    </h3>
                    <p className="text-sm text-[#3FA69E]-800 mt-1">
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
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#3FA69E]"></div>
                  <div className="flex items-start justify-between mb-4 pl-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#80dad3bb] rounded-lg">
                        <User className="w-6 h-6 text-[#3FA69E]" />
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
                        setKycData(individualProfile);
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
                <div className="bg-white rounded-xl shadow-sm border-2 border-dashed border-[#3FA69E] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#80dad3bb] rounded-full">
                      <User className="w-6 h-6 text-[#3FA69E]" />
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
                    className="px-6 py-2 bg-[#3FA69E] text-black rounded-lg font-medium hover:bg-[#3FA69E] shadow-sm whitespace-nowrap"
                  >
                    Start Verification
                  </button>
                </div>
              )}
            </div>

            {/* Section 2: Partner Profiles */}
            {/* <div className={`space-y-4 transition-opacity duration-300 ${!individualProfile || individualProfile.overallStatus !== 'approved' ? 'opacity-50 grayscale-[0.5] pointer-events-none' : ''}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-2 gap-2">
                <h2 className="text-lg font-semibold text-gray-900">2. Partner Profiles</h2>
                <div className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  <span>Adding a company with partners? Add them here first!</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {partnerProfiles.map((p) => {
                  const status = getOverallStatusConfig(p.overallStatus);
                  return (
                    <div key={p._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <Users className="w-6 h-6 text-gray-600" />
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full text-white ${status.bg}`}>
                          {status.text}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 truncate mb-1">{p.profileName}</h3>
                      <p className="text-xs text-gray-500 mb-4 uppercase tracking-wide">Partner</p>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setProfileId(p._id!);
                            setSearchParams(params => { params.set("profileId", p._id!); return params; });
                            setIsPartnerMode(true);
                            setKycData(p);
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
                      profileName: "", companyName: "", companyType: "", gstNumber: "", cinNumber: "", registeredAddress: "", industry: "", partners: []
                    });
                    setPersonalForm({
                      phone: "", dateOfBirth: "", aadhaar: "", pan: "", fullName: "", email: ""
                    });
                  }}
                  disabled={!individualProfile || individualProfile.overallStatus !== 'approved'}
                  className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-200 p-5 flex flex-col items-center justify-center text-gray-400 hover:border-[#3FA69E] hover:text-[#3FA69E] transition-all group min-h-[160px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-400"
                >
                  <div className="p-3 bg-gray-50 rounded-full group-hover:bg-[#3FA69E] mb-3 transition-colors">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="font-medium">Add Partner Profile</span>
                </button>
              </div>
            </div> */}

            {/* Section 3: Business Profiles */}
            <div
              className={`space-y-4 transition-opacity duration-300 ${!individualProfile || individualProfile.overallStatus !== "approved" ? "opacity-50 grayscale-[0.5] pointer-events-none" : ""}`}
            >
              <div className="flex items-center justify-between border-b pb-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  2. Space Information
                </h2>
                {(!individualProfile ||
                  individualProfile.overallStatus !== "approved") && (
                  <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded">
                    Locked until Personal Verification is Approved
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {properties.map((p) => {
                  const status = getOverallStatusConfig(
                    p.kycStatus || p.status || "pending",
                  );
                  return (
                    <div
                      key={p._id}
                      onClick={() =>
                        navigate(
                          `/spaceportal/space-management/add?id=${p._id}`,
                        )
                      }
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-[#3FA69E]/10 transition-colors">
                          <Building2 className="w-6 h-6 text-gray-600 group-hover:text-[#3FA69E]" />
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full text-white ${status.bg}`}
                        >
                          {status.text}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 truncate mb-1">
                        {p.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">
                          {p.area}, {p.city}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                          Manage Space
                        </button>
                      </div>
                    </div>
                  );
                })}

                <button
                  onClick={() => {
                    navigate("/spaceportal/space-management/add");
                  }}
                  className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-200 p-5 flex flex-col items-center justify-center text-gray-400 hover:border-[#3FA69E] hover:text-[#3FA69E] transition-all group min-h-[160px]"
                >
                  <div className="p-3 bg-gray-50 rounded-full group-hover:bg-[#80dad3bb] mb-3 transition-colors">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="font-medium">Add New Space</span>
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
                  <span className="text-2xl font-bold text-[#3FA69E] transition-all duration-300">
                    {completionPercentage}%
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#3FA69E] to-[#74bbb5] rounded-full transition-all duration-500 ease-out"
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
                      placeholder="e.g. My Personal Profile"
                      value={businessForm.profileName}
                      onChange={(e) =>
                        setBusinessForm({
                          ...businessForm,
                          profileName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3FA69E] focus:outline-none"
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
                            ? "bg-[#3FA69E] text-white"
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
                    onClick={() => {
                      setHasStartedNewProfile(true);
                    }}
                    disabled={saving || !businessForm.profileName}
                    className="w-full py-3 bg-[#3FA69E] text-black rounded-lg font-bold hover:bg-[#3FA69E] transition-colors disabled:opacity-50"
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
            {(profileId !== "new" || isPartnerMode || hasStartedNewProfile) && (
              <>
                {activeStep === "personal" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold font-[Poppins] text-gray-900 flex items-center gap-2">
                        <User className="w-5 h-5 text-[#3FA69E]" />{" "}
                        {isPartnerMode
                          ? "Partner Personal Information"
                          : "Personal Information"}
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
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FA69E]"
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
                          Email <span className="text-red-500">*</span>
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
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FA69E]"
                            required
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
                            // Allow only digits and enforce max length 10
                            const digitsOnly = e.target.value.replace(
                              /\D/g,
                              "",
                            );
                            const trimmed = digitsOnly.slice(0, 10);
                            setPersonalForm({
                              ...personalForm,
                              phone: trimmed,
                            });
                          }}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FA69E]"
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
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FA69E]"
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
                            // Allow only digits and enforce max length 12
                            const digitsOnly = e.target.value.replace(
                              /\D/g,
                              "",
                            );
                            const trimmed = digitsOnly.slice(0, 12);
                            setPersonalForm({
                              ...personalForm,
                              aadhaar: trimmed,
                            });
                          }}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FA69E]"
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
                          onChange={(e) => {
                            // Allow only alphabets and numbers, enforce max length 10
                            const cleaned = e.target.value.replace(
                              /[^a-zA-Z0-9]/g,
                              "",
                            );
                            const trimmed = cleaned.slice(0, 10).toUpperCase();
                            setPersonalForm({ ...personalForm, pan: trimmed });
                          }}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FA69E] uppercase"
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
                          setSaving(true);
                          try {
                            // Save personal info first
                            await upsertSpaceUserKyc({
                              fullName:
                                personalForm.fullName || user?.fullName || "",
                              email: personalForm.email || user?.email || "",
                              phoneNumber: personalForm.phone,
                              dateOfBirth: personalForm.dateOfBirth,
                              aadhaarNumber: personalForm.aadhaar,
                              panNumber: personalForm.pan,
                            });
                            setActiveStep("business");
                          } catch (err) {
                            setError("Failed to save personal information");
                          } finally {
                            setSaving(false);
                          }
                        }}
                        disabled={
                          saving ||
                          !personalForm.phone ||
                          !personalForm.dateOfBirth ||
                          !personalForm.aadhaar ||
                          !personalForm.pan ||
                          (isPartnerMode &&
                            (!personalForm.fullName || !personalForm.email))
                        }
                        className="px-6 py-2 bg-[#3FA69E] text-white rounded-lg font-medium hover:bg-[#3FA69E] transition-colors flex items-center gap-2 disabled:opacity-50"
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

                {activeStep === "business" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold font-[Poppins] text-gray-900 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-[#3FA69E]" />{" "}
                        Business Information
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
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
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FA69E]"
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
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FA69E] bg-white"
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
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FA69E]"
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
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FA69E] uppercase"
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
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FA69E] uppercase"
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
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FA69E] resize-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={async () => {
                          await handleSaveBusinessInfo();
                          setActiveStep("documents");
                        }}
                        disabled={
                          saving ||
                          !businessForm.companyName ||
                          !businessForm.companyType ||
                          !businessForm.industry ||
                          !businessForm.gstNumber ||
                          !businessForm.registeredAddress
                        }
                        className="px-6 py-2 bg-[#3FA69E] text-black rounded-lg font-medium hover:bg-[#3FA69E] transition-colors flex items-center gap-2 disabled:opacity-50"
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

                {activeStep === "documents" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold font-[Poppins] text-gray-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#3FA69E]" /> Required
                        Documents
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
                            className={`p-4 border rounded-xl transition-colors ${status === "rejected" ? "border-red-200 bg-red-50" : "border-gray-200 hover:border-[#3FA69E]"}`}
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
                                    <FileText className="w-3.5 h-3.5" />
                                    <span
                                      className="truncate max-w-[150px] sm:max-w-[250px]"
                                      title={uploadedDoc.name}
                                    >
                                      {uploadedDoc.name}
                                    </span>
                                    {uploadedDoc.uploadedAt && (
                                      <>
                                        <span className="mx-1">•</span>
                                        <span>
                                          Uploaded on{" "}
                                          {new Date(
                                            uploadedDoc.uploadedAt,
                                          ).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                          })}
                                        </span>
                                      </>
                                    )}
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
                                      className={`flex items-center gap-1.5 px-3 py-2 ${uploadedDoc ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-[#3FA69E] text-black hover:bg-[#3FA69E]"} rounded-lg text-sm font-medium transition-colors disabled:opacity-50`}
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
                        className="px-6 py-2 bg-[#3FA69E] text-white rounded-lg font-medium hover:bg-[#3FA69E] transition-colors flex items-center gap-2"
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
                        <Shield className="w-5 h-5 text-[#3FA69E]" /> Review &
                        Submit
                      </h2>
                    </div>
                    <div className="bg-[#3FA69E] border border-[#3FA69E] rounded-xl p-4">
                      <p className="text-sm text-[#3FA69E]-800">
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
                          <Clock className="w-5 h-5 text-[#3FA69E]" />
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
                            <Clock className="w-5 h-5 text-[#3FA69E]" />
                          )}
                        </div>
                      )}

                      {!isPartnerMode && (
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Building2 className="w-5 h-5 text-gray-400" />
                            <span className="font-medium text-gray-900">
                              Business Info
                            </span>
                          </div>
                          {kycData?.businessInfo?.companyName ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <Clock className="w-5 h-5 text-[#3FA69E]" />
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
                          <Clock className="w-5 h-5 text-[#3FA69E]" />
                        )}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-100">
                      <label className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                          className="mt-1 w-4 h-4 text-[#3FA69E] rounded focus:ring-[#3FA69E]"
                        />
                        <span className="text-sm text-gray-600">
                          I confirm that all the information provided is
                          accurate and I agree to FlashSpace{" "}
                          <a
                            href="/terms"
                            className="text-[#3FA69E] hover:underline"
                          >
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a
                            href="/privacy"
                            className="text-[#3FA69E] hover:underline"
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
                          <div className="text-sm text-amber-800 font-medium space-y-2">
                            <div className="flex items-start gap-2">
                              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <span>
                                Please complete all required steps before
                                submitting:
                              </span>
                            </div>

                            <ul className="ml-6 space-y-2 list-disc">
                              {!isPersonalInfoSaved() && (
                                <li>
                                  <span className="font-semibold underline">
                                    Personal Information:
                                  </span>
                                  <div className="text-xs mt-0.5 text-amber-700 flex flex-wrap gap-1">
                                    {!kycData?.personalInfo?.fullName && (
                                      <span className="bg-amber-100 px-1.5 py-0.5 rounded">
                                        Full Name
                                      </span>
                                    )}
                                    {!kycData?.personalInfo?.phone && (
                                      <span className="bg-amber-100 px-1.5 py-0.5 rounded">
                                        Phone Number
                                      </span>
                                    )}
                                    {!kycData?.personalInfo?.dateOfBirth && (
                                      <span className="bg-amber-100 px-1.5 py-0.5 rounded">
                                        Date of Birth
                                      </span>
                                    )}
                                    {!kycData?.personalInfo?.aadhaarNumber && (
                                      <span className="bg-amber-100 px-1.5 py-0.5 rounded">
                                        Aadhaar Card
                                      </span>
                                    )}
                                    {!kycData?.personalInfo?.panNumber && (
                                      <span className="bg-amber-100 px-1.5 py-0.5 rounded">
                                        PAN Card
                                      </span>
                                    )}
                                  </div>
                                </li>
                              )}

                              {kycType === "business" &&
                                !isBusinessInfoSaved() && (
                                  <li>
                                    <span className="font-semibold underline">
                                      Business Information:
                                    </span>
                                    <div className="text-xs mt-0.5 text-amber-700 flex flex-wrap gap-1">
                                      {!kycData?.businessInfo?.companyName && (
                                        <span className="bg-amber-100 px-1.5 py-0.5 rounded">
                                          Company Name
                                        </span>
                                      )}
                                      {!kycData?.businessInfo?.companyType && (
                                        <span className="bg-amber-100 px-1.5 py-0.5 rounded">
                                          Company Type
                                        </span>
                                      )}
                                      {!kycData?.businessInfo?.gstNumber && (
                                        <span className="bg-amber-100 px-1.5 py-0.5 rounded">
                                          GST Number
                                        </span>
                                      )}
                                      {!kycData?.businessInfo
                                        ?.registeredAddress && (
                                        <span className="bg-amber-100 px-1.5 py-0.5 rounded">
                                          Registered Address
                                        </span>
                                      )}
                                      {!kycData?.businessInfo?.industry && (
                                        <span className="bg-amber-100 px-1.5 py-0.5 rounded">
                                          Industry
                                        </span>
                                      )}
                                    </div>
                                  </li>
                                )}

                              {!areAllRequiredDocsUploaded() && (
                                <li>
                                  <span className="font-semibold underline">
                                    Required Documents:
                                  </span>
                                  <div className="text-xs mt-0.5 text-amber-700 flex flex-wrap gap-1">
                                    {requiredDocTypes
                                      .filter(
                                        (doc) =>
                                          doc.required &&
                                          !kycData?.documents?.find(
                                            (d) => d.type === doc.type,
                                          ),
                                      )
                                      .map((doc) => (
                                        <span
                                          key={doc.type}
                                          className="bg-amber-100 px-1.5 py-0.5 rounded"
                                        >
                                          {doc.name}
                                        </span>
                                      ))}
                                  </div>
                                </li>
                              )}
                            </ul>
                          </div>
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

                          // For space partner KYC, we call the explicit submission endpoint
                          setSaving(true);
                          const toastId = toast.loading("Submitting KYC...");
                          try {
                            const response = await submitSpaceUserKyc();
                            if (response) {
                              toast.success(
                                "KYC Submitted! Our team will review it shortly.",
                                { id: toastId },
                              );
                              fetchKYC();
                            }
                          } catch (err: any) {
                            console.error("Failed to submit KYC:", err);
                            toast.error(
                              err.message || "Failed to submit KYC for review",
                              { id: toastId },
                            );
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
                          kycData?.overallStatus !== "pending") ||
                        (!termsAccepted &&
                          kycData?.overallStatus !== "approved" &&
                          kycData?.overallStatus !== "pending")
                      }
                      className="w-full py-3 bg-[#3FA69E] text-white rounded-xl font-semibold hover:bg-[#3FA69E] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                const fullUrl = previewDoc.url;

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
