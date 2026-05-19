// Import the new UI component
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
} from "@/Api/spaceDetails.service";
import { getPartnerProperties } from "@/services/property.service";
import { Property } from "@/types/services";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

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

const normalizeProfileId = (value?: string | null) => {
  const trimmed = value?.trim();
  if (!trimmed || trimmed === "undefined" || trimmed === "null") {
    return null;
  }
  return trimmed;
};

export default function KYCVerification() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [profileId, setProfileId] = useState<string | null>(
    normalizeProfileId(searchParams.get("profileId")),
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

  useEffect(() => {
    const rawProfileId = searchParams.get("profileId");
    if (rawProfileId && !normalizeProfileId(rawProfileId)) {
      setProfileId(null);
      setSearchParams(
        (params) => {
          const nextParams = new URLSearchParams(params);
          nextParams.delete("profileId");
          return nextParams;
        },
        { replace: true },
      );
    }
  }, [searchParams, setSearchParams]);

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

    const backendId = normalizeProfileId(backend._id || backend.id);

    return {
      _id: backendId || undefined,
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
      if (mapped?._id) {
        setIndividualProfile(mapped);
        setKycData(mapped);
        setProfileId(mapped._id);

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
        setPersonalForm({
          fullName: mapped?.personalInfo?.fullName || user?.fullName || "",
          email: mapped?.personalInfo?.email || user?.email || "",
          phone: mapped?.personalInfo?.phone || "",
          dateOfBirth: mapped?.personalInfo?.dateOfBirth || "",
          aadhaar: mapped?.personalInfo?.aadhaarNumber || "",
          pan: mapped?.personalInfo?.panNumber || "",
        });
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

      if (backendKyc.userId && mapped?._id) {
        setKycData(mapped);
        setIndividualProfile(mapped);

        setProfileId(mapped._id);
        setSearchParams((params) => {
          params.set("profileId", mapped._id!);
          return params;
        });
      } else {
        setKycData((prev) =>
          prev
            ? {
                ...prev,
                businessInfo: {
                  companyName: businessForm.companyName,
                  companyType: businessForm.companyType,
                  gstNumber: businessForm.gstNumber,
                  cinNumber: businessForm.cinNumber,
                  registeredAddress: businessForm.registeredAddress,
                  industry: businessForm.industry,
                  partners: businessForm.partners,
                },
              }
            : prev,
        );
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
          bg: "bg-primary/10",
          text: "text-primary",
          icon: CheckCircle2,
          label: "Verified",
        };
      case "pending":
        return {
          bg: "bg-muted",
          text: "text-muted-foreground",
          icon: Clock,
          label: "Under Review",
        };
      case "rejected":
        return {
          bg: "bg-destructive/10",
          text: "text-destructive",
          icon: AlertCircle,
          label: "Rejected",
        };
      default:
        return {
          bg: "bg-muted/50",
          text: "text-muted-foreground/70",
          icon: Clock,
          label: "Pending",
        };
    }
  };

  const getOverallStatusConfig = (status: string) => {
    switch (status) {
      case "approved":
        return { bg: "bg-primary", text: "Verified", icon: CheckCircle2 };
      case "pending":
        return {
          bg: "bg-muted-foreground",
          text: "Verification in Progress",
          icon: Clock,
        };
      case "rejected":
        return {
          bg: "bg-destructive",
          text: "Action Required",
          icon: AlertCircle,
        };
      case "resubmit":
        return {
          bg: "bg-destructive",
          text: "Resubmission Required",
          icon: RefreshCw,
        };
      default:
        return { bg: "bg-muted", text: "Not Started", icon: Info };
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
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
            <Shield className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-muted-foreground font-medium animate-pulse">
            Loading KYC details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="text-center bg-background border border-border rounded-3xl p-12 shadow-2xl max-w-lg w-full">
          <div className="bg-destructive/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-destructive" />
          </div>
          <h2 className="text-lg font-extrabold text-foreground mb-2">
            Error Occurred
          </h2>
          <p className="text-muted-foreground font-medium mb-8 leading-relaxed">
            {error}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={fetchKYC}
              className="rounded-xl h-12 px-8 font-bold gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setProfileId(null);
                setKycData(null);
                setSearchParams((params) => {
                  params.delete("profileId");
                  return params;
                });
                setError(null);
              }}
              className="rounded-xl h-12 px-8 font-bold"
            >
              Go Back
            </Button>
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
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={uploadAccept}
        onChange={handleFileSelect}
      />

      <div className="w-full space-y-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-[#35503F] tracking-tight">
              {profileId ? "KYC" : "Space"}{" "}
              <span className="text-[#4A6D56] italic">Verification</span>
            </h1>
            <p className="text-muted-foreground mt-2 text-base">
              {linkBookingId
                ? "Securely verify your identity to enable bookings"
                : "Manage your verification profiles for compliance"}
            </p>
          </div>
          {profileId && profileId !== "new" && (
            <div
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl text-white shadow-lg ${overallStatus.bg}`}
            >
              <overallStatus.icon className="w-5 h-5" />
              <span className="font-bold tracking-tight">
                {overallStatus.text}
              </span>
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
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-1 bg-primary rounded-full" />
                <h2 className="text-lg font-extrabold text-foreground tracking-tight">
                  1. Personal{" "}
                  <span className="text-primary italic">Identity</span>
                </h2>
              </div>

              {individualProfile?._id ? (
                <div className="bg-background border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                        <User className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-foreground">
                          Personal Identity
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {individualProfile.profileName ||
                            "Authorized Signatory"}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-4 py-1.5 rounded-full font-bold shadow-sm ${getStatusConfig(individualProfile.overallStatus as DocumentStatus).bg} ${getStatusConfig(individualProfile.overallStatus as DocumentStatus).text}`}
                    >
                      {
                        getOverallStatusConfig(
                          individualProfile.overallStatus || "not_started",
                        ).text
                      }
                    </span>
                  </div>

                  <div className="mt-8">
                    <Button
                      onClick={() => {
                        const selectedProfileId = normalizeProfileId(
                          individualProfile._id,
                        );
                        if (!selectedProfileId) {
                          setProfileId("new");
                          setKycType("individual");
                          setActiveStep("personal");
                          setKycData(null);
                          return;
                        }

                        setProfileId(selectedProfileId);
                        setSearchParams((params) => {
                          params.set("profileId", selectedProfileId);
                          return params;
                        });
                        setKycData(individualProfile);
                      }}
                      className="rounded-xl px-8 py-6 font-bold text-base shadow-lg hover:shadow-primary/20 transition-all active:scale-95 gap-2"
                    >
                      {individualProfile.overallStatus === "approved"
                        ? "Review Profile"
                        : "Complete Verification"}
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              ) : (
                // No Individual Profile -> Call to Action
                <div className="bg-background border-2 border-dashed border-border rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:border-primary group">
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                      <User className="w-10 h-10 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-foreground">
                        Verify Your Identity
                      </h3>
                      <p className="text-muted-foreground font-medium">
                        Personal verification is required before listing spaces.
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      setProfileId("new");
                      setKycType("individual");
                      setActiveStep("personal");
                      setKycData(null);
                      setPersonalForm((prev) => ({
                        ...prev,
                        fullName: prev.fullName || user?.fullName || "",
                        email: prev.email || user?.email || "",
                      }));
                      // Reset form
                      setBusinessForm({
                        profileName: user?.fullName
                          ? `${user.fullName} (Personal)`
                          : "Primary KYC Profile",
                        companyName: "",
                        companyType: "",
                        gstNumber: "",
                        cinNumber: "",
                        registeredAddress: "",
                        industry: "",
                        partners: [],
                      });
                    }}
                    className="rounded-xl px-10 py-6 font-bold text-base shadow-xl hover:shadow-primary/20 transition-all active:scale-95 whitespace-nowrap"
                  >
                    Start Now
                  </Button>
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
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-1 bg-primary rounded-full" />
                  <h2 className="text-lg font-extrabold text-foreground tracking-tight">
                    2. Space{" "}
                    <span className="text-primary italic">Information</span>
                  </h2>
                </div>
                {(!individualProfile ||
                  individualProfile.overallStatus !== "approved") && (
                  <Badge variant="destructive" className="rounded-lg">
                    Locked until Personal Verification is Approved
                  </Badge>
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
                      className="bg-background border border-border rounded-xl p-6 hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between min-h-[180px] shadow-sm"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                          <Building2 className="w-8 h-8 text-primary" />
                        </div>
                        <span
                          className={`text-xs px-4 py-1.5 rounded-full font-bold shadow-sm text-white ${status.bg}`}
                        >
                          {status.text}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-lg text-foreground truncate">
                          {p.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <MapPin className="w-4 h-4 text-primary/70" />
                          <span className="truncate">
                            {p.area}, {p.city}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <button
                  onClick={() => {
                    navigate("/spaceportal/space-management/add");
                  }}
                  disabled={
                    !individualProfile ||
                    individualProfile.overallStatus !== "approved"
                  }
                  className="bg-background border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-foreground transition-all group min-h-[180px] disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:text-muted-foreground"
                >
                  <div className="p-5 bg-primary/10 rounded-full group-hover:scale-110 mb-3 transition-all">
                    <Building2 className="w-10 h-10 text-primary" />
                  </div>
                  <span className="font-bold text-base">
                    {individualProfile?.overallStatus === "approved"
                      ? "Register New Space"
                      : "Complete Personal KYC First"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Button
              variant="ghost"
              onClick={() => {
                setProfileId(null);
                setKycData(null);
                setSearchParams((params) => {
                  params.delete("profileId");
                  return params;
                });
              }}
              className="px-0 group text-muted-foreground hover:text-foreground hover:bg-background"
            >
              <ChevronRight className="w-4 h-4 rotate-180 group-hover:rotate-0 transition-transform" />
              Back to profiles
            </Button>

            {profileId !== "new" && (
              <div className="bg-background border border-border rounded-xl p-8 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-extrabold text-foreground tracking-tight">
                    Verification{" "}
                    <span className="text-primary italic">Progress</span>
                  </h2>
                  <span className="text-xl font-extrabold text-primary transition-all duration-300">
                    {completionPercentage}%
                  </span>
                </div>
                <div className="h-4 bg-muted rounded-full overflow-hidden border border-border">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500 ease-out shadow-[0_0_15px_rgba(var(--primary),0.3)]"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Profile Name Input (Hide for Partner Mode) */}
            {(profileId === "new" || editMode) && !isPartnerMode && (
              <div className="bg-background border border-border rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="flex-1 space-y-2">
                    <label className="text-sm font-semibold text-foreground">
                      Profile Name (Internal Reference){" "}
                      <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. Primary KYC Profile"
                      value={businessForm.profileName}
                      onChange={(e) =>
                        setBusinessForm({
                          ...businessForm,
                          profileName: e.target.value,
                        })
                      }
                      className="rounded-xl h-12"
                      required
                    />
                  </div>
                  <div className="flex bg-muted/50 p-1.5 rounded-xl border border-border h-12">
                    <Button
                      variant={kycType === "individual" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setKycType("individual")}
                      className={`gap-2 rounded-lg font-bold px-6 ${kycType === "individual" ? "shadow-md" : "text-muted-foreground"}`}
                    >
                      <User className="w-4 h-4" /> Individual
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {profileId !== "new" && (
              <div className="bg-muted/30 border border-border rounded-2xl p-2 shadow-inner">
                <div className="flex gap-2">
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
                        className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-sm font-bold transition-all relative ${
                          activeStep === step.id
                            ? "bg-background text-primary shadow-lg ring-1 ring-border translate-y-[-2px]"
                            : isAccessible
                              ? "text-muted-foreground hover:bg-background/50 cursor-pointer"
                              : "text-muted-foreground/30 cursor-not-allowed opacity-50 bg-muted/50"
                        }`}
                        title={
                          !isAccessible ? "Complete previous steps first" : ""
                        }
                      >
                        {!isAccessible && (
                          <Lock className="w-3 h-3 absolute top-1.5 right-1.5" />
                        )}
                        <step.icon
                          className={`w-4 h-4 ${activeStep === step.id ? "text-primary" : ""}`}
                        />
                        <span className="hidden sm:inline">{step.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {profileId === "new" && !isPartnerMode ? (
              <div className="space-y-6 text-center py-12 bg-background border border-dashed border-border rounded-xl">
                <div className="max-w-md mx-auto space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-lg font-extrabold text-foreground tracking-tight">
                      Ready to Start{" "}
                      <span className="text-primary italic">Verification?</span>
                    </h2>
                    <p className="text-muted-foreground">
                      Provide a name for this profile and select the type to
                      begin your KYC journey.
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setHasStartedNewProfile(true);
                    }}
                    disabled={saving || !businessForm.profileName}
                    className="w-full h-16 rounded-xl font-bold text-base shadow-xl hover:shadow-primary/20 transition-all active:scale-95 gap-3"
                  >
                    {saving ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      "Begin Verification"
                    )}
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ) : null}

            {/* Display Forms if Profile ID is set OR (Profile ID is New AND Is Partner Mode) */}
            {(profileId !== "new" || isPartnerMode || hasStartedNewProfile) && (
              <>
                {activeStep === "personal" && (
                  <div className="bg-background border border-border rounded-xl p-8 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                      <h2 className="text-lg font-extrabold text-foreground flex items-center gap-3">
                        <User className="w-7 h-7 text-primary" />
                        {isPartnerMode
                          ? "Partner Personal Information"
                          : "Personal Information"}
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">
                          Full Name <span className="text-destructive">*</span>
                        </label>
                        {isPartnerMode ||
                        (profileId !== "new" &&
                          kycData?.kycType === "individual" &&
                          kycData?.profileName !== user?.fullName &&
                          kycData?.personalInfo?.fullName !==
                            user?.fullName) ? (
                          <Input
                            type="text"
                            placeholder="Partner Full Name"
                            value={personalForm.fullName}
                            onChange={(e) =>
                              setPersonalForm({
                                ...personalForm,
                                fullName: e.target.value,
                              })
                            }
                            className="rounded-xl h-12"
                            required
                          />
                        ) : (
                          <div className="h-12 flex items-center px-4 bg-muted/30 rounded-xl font-bold text-foreground">
                            {user?.fullName ||
                              kycData?.personalInfo?.fullName ||
                              "-"}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">
                          Email Address{" "}
                          <span className="text-destructive">*</span>
                        </label>
                        {isPartnerMode ? (
                          <Input
                            type="email"
                            placeholder="partner@example.com"
                            value={personalForm.email}
                            onChange={(e) =>
                              setPersonalForm({
                                ...personalForm,
                                email: e.target.value,
                              })
                            }
                            className="rounded-xl h-12"
                            required
                          />
                        ) : (
                          <div className="h-12 flex items-center px-4 bg-muted/30 rounded-xl font-bold text-foreground">
                            {user?.email || kycData?.personalInfo?.email || "-"}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">
                          Phone Number{" "}
                          <span className="text-destructive">*</span>
                        </label>
                        <Input
                          type="tel"
                          placeholder="10-digit mobile number"
                          value={personalForm.phone}
                          onChange={(e) => {
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
                          className="rounded-xl h-12"
                          required
                          minLength={10}
                          maxLength={10}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">
                          Date of Birth{" "}
                          <span className="text-destructive">*</span>
                        </label>
                        <Input
                          type="date"
                          value={personalForm.dateOfBirth}
                          onChange={(e) =>
                            setPersonalForm({
                              ...personalForm,
                              dateOfBirth: e.target.value,
                            })
                          }
                          className="rounded-xl h-12"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">
                          Aadhaar Number{" "}
                          <span className="text-destructive">*</span>
                        </label>
                        <Input
                          type="text"
                          placeholder="12-digit Aadhaar Number"
                          value={personalForm.aadhaar}
                          onChange={(e) => {
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
                          className="rounded-xl h-12"
                          required
                          minLength={12}
                          maxLength={12}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">
                          PAN Number <span className="text-destructive">*</span>
                        </label>
                        <Input
                          type="text"
                          placeholder="10-character PAN"
                          value={personalForm.pan}
                          onChange={(e) => {
                            const cleaned = e.target.value.replace(
                              /[^a-zA-Z0-9]/g,
                              "",
                            );
                            const trimmed = cleaned.slice(0, 10).toUpperCase();
                            setPersonalForm({ ...personalForm, pan: trimmed });
                          }}
                          className="rounded-xl h-12 uppercase"
                          required
                          minLength={10}
                          maxLength={10}
                        />
                      </div>
                    </div>
                    <div className="mt-12 flex justify-end">
                      <Button
                        onClick={async () => {
                          setSaving(true);
                          try {
                            const savedKyc = await upsertSpaceUserKyc({
                              fullName:
                                personalForm.fullName || user?.fullName || "",
                              email: personalForm.email || user?.email || "",
                              phoneNumber: personalForm.phone,
                              dateOfBirth: personalForm.dateOfBirth,
                              aadhaarNumber: personalForm.aadhaar,
                              panNumber: personalForm.pan,
                            });
                            const mapped = mapBackendKycToFrontend(
                              savedKyc,
                              user?.fullName || null,
                              user?.email || null,
                            );
                            if (mapped?._id) {
                              setIndividualProfile(mapped);
                              setKycData(mapped);
                              setProfileId(mapped._id);
                              setSearchParams((params) => {
                                params.set("profileId", mapped._id!);
                                return params;
                              });
                            }
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
                        className="rounded-xl h-14 px-10 font-bold text-base shadow-xl hover:shadow-primary/20 transition-all active:scale-95 gap-3"
                      >
                        {saving ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          "Save & Continue"
                        )}
                        {!saving && (
                          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {activeStep === "business" && (
                  <div className="bg-background border border-border rounded-xl p-8 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                      <h2 className="text-lg font-extrabold text-foreground flex items-center gap-3">
                        <Building2 className="w-7 h-7 text-primary" />
                        Business Information
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">
                          Company Name{" "}
                          <span className="text-destructive">*</span>
                        </label>
                        <Input
                          type="text"
                          placeholder="Registered Company Name"
                          value={businessForm.companyName}
                          onChange={(e) =>
                            setBusinessForm({
                              ...businessForm,
                              companyName: e.target.value,
                            })
                          }
                          className="rounded-xl h-12"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">
                          Company Type{" "}
                          <span className="text-destructive">*</span>
                        </label>
                        <select
                          value={businessForm.companyType}
                          onChange={(e) =>
                            setBusinessForm({
                              ...businessForm,
                              companyType: e.target.value,
                            })
                          }
                          className="w-full h-12 px-4 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all"
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
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">
                          Industry <span className="text-destructive">*</span>
                        </label>
                        <Input
                          type="text"
                          placeholder="e.g. Technology, Retail"
                          value={businessForm.industry}
                          onChange={(e) =>
                            setBusinessForm({
                              ...businessForm,
                              industry: e.target.value,
                            })
                          }
                          className="rounded-xl h-12"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">
                          GST Number <span className="text-destructive">*</span>
                        </label>
                        <Input
                          type="text"
                          placeholder="15-digit GSTIN"
                          value={businessForm.gstNumber}
                          onChange={(e) =>
                            setBusinessForm({
                              ...businessForm,
                              gstNumber: e.target.value.toUpperCase(),
                            })
                          }
                          className="rounded-xl h-12 uppercase"
                          required
                          minLength={15}
                          maxLength={15}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">
                          CIN / Registration No.
                        </label>
                        <Input
                          type="text"
                          placeholder="Corporate Identity Number"
                          value={businessForm.cinNumber}
                          onChange={(e) =>
                            setBusinessForm({
                              ...businessForm,
                              cinNumber: e.target.value.toUpperCase(),
                            })
                          }
                          className="rounded-xl h-12 uppercase"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-semibold text-foreground">
                          Registered Address{" "}
                          <span className="text-destructive">*</span>
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
                          className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all resize-none"
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-12 flex justify-end">
                      <Button
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
                        className="rounded-xl h-14 px-10 font-bold text-base shadow-xl hover:shadow-primary/20 transition-all active:scale-95 gap-3"
                      >
                        {saving ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          "Save & Continue"
                        )}
                        {!saving && (
                          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {activeStep === "documents" && (
                  <div className="bg-background border border-border rounded-xl p-8 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                      <h2 className="text-lg font-extrabold text-foreground flex items-center gap-3">
                        <FileText className="w-7 h-7 text-primary" /> Required
                        Documents
                      </h2>
                    </div>
                    <div className="space-y-5">
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
                            className={`p-6 border rounded-2xl transition-all ${status === "rejected" ? "border-red-200 bg-red-50" : "border-border bg-muted/20 hover:border-primary/50"}`}
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-bold text-foreground">
                                    {docType.name}
                                  </h3>
                                  {docType.required && (
                                    <Badge
                                      variant="destructive"
                                      className="text-[10px] h-5"
                                    >
                                      Required
                                    </Badge>
                                  )}
                                  {uploadedDoc && (
                                    <Badge
                                      className={`gap-1 ${statusConfig.bg} ${statusConfig.text} border-none`}
                                    >
                                      <statusConfig.icon className="w-3 h-3" />
                                      {statusConfig.label}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {docType.description}
                                </p>
                                {uploadedDoc?.name && (
                                  <p className="text-xs text-muted-foreground/70 mt-1 flex items-center gap-1">
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
                                  <p className="text-sm text-destructive mt-2 flex items-start gap-1 font-medium">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                    {uploadedDoc.rejectionReason}
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-2">
                                {uploadedDoc?.fileUrl && (
                                  <Button
                                    variant="outline"
                                    size="sm"
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
                                    className="h-9 gap-1.5"
                                  >
                                    <Eye className="w-4 h-4" /> View
                                  </Button>
                                )}
                                {status !== "approved" && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant={
                                        uploadedDoc ? "outline" : "default"
                                      }
                                      onClick={() =>
                                        triggerFileUpload(docType.type)
                                      }
                                      disabled={isUploading || !!deleting}
                                      className="h-9 gap-1.5"
                                    >
                                      {isUploading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : uploadedDoc ? (
                                        <RefreshCw className="w-4 h-4" />
                                      ) : (
                                        <Upload className="w-4 h-4" />
                                      )}
                                      {uploadedDoc ? "Replace" : "Upload"}
                                    </Button>

                                    {uploadedDoc && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          handleDeleteDocument(docType.type)
                                        }
                                        disabled={
                                          deleting === docType.type ||
                                          isUploading
                                        }
                                        className="h-9 px-3 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                                        title="Delete Document"
                                      >
                                        {deleting === docType.type ? (
                                          <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                          <Trash2 className="w-4 h-4" />
                                        )}
                                      </Button>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4 border border-border">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        <span>
                          <strong>Accepted formats:</strong> PDF, JPG, PNG (Max
                          5MB per file)
                        </span>
                      </p>
                    </div>

                    <div className="mt-8 flex justify-end">
                      <Button
                        onClick={() => setActiveStep("review")}
                        className="rounded-xl h-14 px-10 font-bold text-base shadow-xl hover:shadow-primary/20 transition-all active:scale-95 gap-3"
                      >
                        Proceed to Review <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                )}

                {activeStep === "review" && (
                  <div className="bg-background border border-border rounded-xl p-8 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                      <h2 className="text-lg font-extrabold text-foreground flex items-center gap-3">
                        <Shield className="w-7 h-7 text-primary" /> Review &
                        Submit
                      </h2>
                    </div>
                    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                      <p className="text-foreground font-medium leading-relaxed">
                        Please review all your information carefully before
                        submitting. Once submitted, the details will be locked
                        for verification by our compliance team.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-muted/20 border border-border rounded-xl">
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-primary" />
                          <span className="font-bold text-foreground">
                            Personal Information
                          </span>
                        </div>
                        {kycData?.personalInfo?.fullName &&
                        kycData?.personalInfo?.phone &&
                        kycData?.personalInfo?.aadhaarNumber ? (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        ) : (
                          <Clock className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>

                      {kycType === "business" && (
                        <div className="flex items-center justify-between p-4 bg-muted/20 border border-border rounded-xl">
                          <div className="flex items-center gap-3">
                            <Building2 className="w-5 h-5 text-primary" />
                            <span className="font-bold text-foreground">
                              Business Information
                            </span>
                          </div>
                          {kycData?.businessInfo?.companyName ? (
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                          ) : (
                            <Clock className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between p-4 bg-muted/20 border border-border rounded-xl">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-primary" />
                          <span className="font-bold text-foreground">
                            Documents (
                            {(() => {
                              const uploaded = kycData?.documents?.filter(
                                (d) =>
                                  d.type !== "video_kyc" &&
                                  (d.status === "approved" ||
                                    d.status === "pending"),
                              ).length || 0;
                              const required = requiredDocTypes.filter((d) => d.required).length;
                              return `${uploaded}/${Math.max(uploaded, required)}`;
                            })()}{" "}
                            uploaded)
                          </span>
                        </div>
                        {kycData?.documents?.filter(
                          (d) => d.type !== "video_kyc",
                        ).length >=
                        requiredDocTypes.filter((d) => d.required).length ? (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        ) : (
                          <Clock className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-center mt-1">
                          <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            className="w-5 h-5 rounded border-border text-primary focus:ring-primary/20 transition-all cursor-pointer"
                          />
                        </div>
                        <span className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                          I confirm that all the information provided is
                          accurate and I agree to FlashSpace{" "}
                          <a
                            href="/terms"
                            className="text-primary font-semibold hover:underline"
                          >
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a
                            href="/privacy"
                            className="text-primary font-semibold hover:underline"
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
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                          <div className="text-sm text-amber-900 space-y-3">
                            <div className="flex items-center gap-2 font-bold">
                              <AlertCircle className="w-5 h-5 text-amber-600" />
                              <span>Complete Required Steps</span>
                            </div>

                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              {!isPersonalInfoSaved() && (
                                <li className="flex items-center gap-2 bg-amber-100/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                                  Personal Information
                                </li>
                              )}

                              {kycType === "business" &&
                                !isBusinessInfoSaved() && (
                                  <li className="flex items-center gap-2 bg-amber-100/50 p-2 rounded-lg">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                                    Business Information
                                  </li>
                                )}

                              {!areAllRequiredDocsUploaded() && (
                                <li className="flex items-center gap-2 bg-amber-100/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                                  Required Documents
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
                        <div className="bg-primary/10 border border-primary/20 rounded-xl p-5">
                          <p className="text-sm text-primary font-bold flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5" />
                            Requirements Complete! Ready for Submission.
                          </p>
                        </div>
                      )}

                    {linkBookingId && kycData?.overallStatus === "approved" && (
                      <div className="bg-primary/10 border border-primary/20 rounded-xl p-5 mb-4">
                        <p className="text-sm text-primary font-bold flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5" /> profile Verified!
                          Use for Booking.
                        </p>
                      </div>
                    )}

                    <Button
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
                      className="w-full h-16 rounded-xl font-bold text-base shadow-xl hover:shadow-primary/20 transition-all active:scale-95 gap-3"
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
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {previewDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-background border border-border rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h3 className="font-extrabold text-lg text-foreground tracking-tight">
                  Document Preview
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPreviewDoc(null)}
                  className="rounded-full hover:bg-muted"
                  id="close-preview"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
              <div className="flex-1 overflow-auto bg-gray-50 dark:bg-black/20 p-6 flex items-center justify-center">
                {(() => {
                  const fullUrl = previewDoc.url;

                  if (previewDoc.mimeType === "application/pdf") {
                    return (
                      <iframe
                        src={fullUrl}
                        className="w-full h-full min-h-[60vh] rounded-2xl border border-[#2D3F33]/10 shadow-sm"
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
                        className="max-w-full max-h-[70vh] rounded-2xl shadow-xl"
                        controlsList="nodownload"
                      >
                        Your browser does not support the video tag.
                      </video>
                    );
                  } else {
                    return (
                      <img
                        src={fullUrl}
                        alt="Document Preview"
                        className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-xl"
                      />
                    );
                  }
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
