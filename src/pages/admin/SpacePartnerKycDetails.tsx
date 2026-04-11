import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  getAllSpacePartnerKyc,
  SpaceUserKycResponse,
} from "@/Api/spacePartnerKyc.service";
import {
  reviewSpaceUserKycDocument,
  reviewSpaceUserKycOverall,
  KycDecisionStatus,
  SpaceUserKycDocumentType,
} from "@/Api/spacePartnerKycAdmin.service";
import {
  getPartnerPropertiesByUserId,
  PropertyData,
} from "@/Api/spaceDetailsAdmin.service";
import { Property } from "@/types/services";
import { getPropertyById, updateProperty } from "@/services/property.service";
import { toast } from "sonner";
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
  Mail,
  MapPin,
  Building2,
} from "lucide-react";
import { KYCDetailSkeleton } from "@/components/ui/skeleton-loaders";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavItems";

const getStatusBadge = (status?: string) => {
  switch (status) {
    case "approved":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 uppercase">
          <CheckCircle2 className="w-3 h-3" /> Verified
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 uppercase">
          <XCircle className="w-3 h-3" /> Rejected
        </span>
      );
    case "pending":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 uppercase">
          <Clock className="w-3 h-3" /> Pending
        </span>
      );
  }
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

const truncateFileName = (name: string, maxLength: number = 25) => {
  if (!name) return "";
  if (name.length <= maxLength) return name;
  return name.substring(0, maxLength) + "...";
};

import { API_CONFIG } from "@/config/api.config";
// ... (rest of imports)

// ...

// Set your backend API base URL here
const API_BASE_URL = API_CONFIG.BASE_URL;
const getFullUrl = (url?: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  // Prepend API base URL for relative paths (e.g., /uploads/...)
  const baseUrl = API_BASE_URL.endsWith("/")
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${baseUrl}${path}`;
};

export default function SpacePartnerKycDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [request, setRequest] = useState<SpaceUserKycResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [docAction, setDocAction] = useState<{
    type: SpaceUserKycDocumentType;
    action: KycDecisionStatus;
  } | null>(null);
  const [docRejectReason, setDocRejectReason] = useState("");
  const [overallAction, setOverallAction] = useState<KycDecisionStatus | null>(
    null,
  );
  const [overallRejectReason, setOverallRejectReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(false);

  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get("propertyId");
  const [focusedProperty, setFocusedProperty] = useState<Property | null>(null);
  const [loadingFocusedProperty, setLoadingFocusedProperty] = useState(false);

  const fetchKyc = React.useCallback(async () => {
    setLoading(true);
    try {
      const list = await getAllSpacePartnerKyc();
      const found = list.find((k) => k._id === id);
      setRequest(found || null);

      if (found?.userId) {
        setLoadingProperties(true);
        try {
          const props = await getPartnerPropertiesByUserId(found.userId);
          setProperties(props || []);
        } catch (err) {
          console.error("Failed to fetch partner properties:", err);
        } finally {
          setLoadingProperties(false);
        }
      }

      if (propertyId) {
        setLoadingFocusedProperty(true);
        try {
          const prop = await getPropertyById(propertyId);
          setFocusedProperty(prop);
        } catch (err) {
          console.error("Failed to fetch focused property:", err);
          toast.error("Failed to load property details");
        } finally {
          setLoadingFocusedProperty(false);
        }
      }
    } catch (err) {
      console.error("Failed to fetch KYC request:", err);
      toast.error("Failed to load KYC details");
    } finally {
      setLoading(false);
    }
  }, [id, propertyId]);
  useEffect(() => {
    if (!id) return;
    fetchKyc();
  }, [id, fetchKyc]);

  // Document Accept/Reject handlers
  const handleDocAction = async (
    type: SpaceUserKycDocumentType,
    action: KycDecisionStatus,
    rejectMessage?: string,
  ) => {
    if (!request || !request.userId) {
      toast.error("User ID missing for this KYC request.");
      return;
    }
    if (!["pending", "approved", "rejected"].includes(action)) {
      toast.error("Invalid status for document action.");
      return;
    }
    setSubmitting(true);
    try {
      await reviewSpaceUserKycDocument(
        request.userId,
        type,
        action,
        rejectMessage,
      );
      toast.success(
        `Document ${action === "approved" ? "approved" : "rejected"} successfully`,
      );
      setDocAction(null);
      setDocRejectReason("");
      fetchKyc();
    } catch (e: any) {
      toast.error(
        e?.response?.data?.message ||
          e?.message ||
          "Failed to update document status",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Overall Accept/Reject handlers
  const handleOverallAction = async (
    action: KycDecisionStatus,
    rejectMessage?: string,
  ) => {
    if (propertyId && focusedProperty) {
      setSubmitting(true);
      try {
        await updateProperty(propertyId, {
          kycStatus: action === "approved" ? "approved" : "rejected",
          kycRejectionReason: rejectMessage,
        });
        toast.success(
          `Property KYC ${action === "approved" ? "approved" : "rejected"} successfully`,
        );
        setOverallAction(null);
        setOverallRejectReason("");
        fetchKyc();
      } catch (e: any) {
        toast.error("Failed to update property KYC status");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (!request || !request.userId) {
      toast.error("User ID missing for this KYC request.");
      return;
    }
    if (!["pending", "approved", "rejected"].includes(action)) {
      toast.error("Invalid status for overall KYC action.");
      return;
    }
    setSubmitting(true);
    try {
      await reviewSpaceUserKycOverall(request.userId, action, rejectMessage);
      toast.success(
        `KYC ${action === "approved" ? "approved" : "rejected"} successfully`,
      );
      setOverallAction(null);
      setOverallRejectReason("");
      fetchKyc();
    } catch (e: any) {
      toast.error(
        e?.response?.data?.message ||
          e?.message ||
          "Failed to update KYC status",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handlePropertyDocAction = async (
    docType: string,
    action: "approved" | "rejected",
    rejectMessage?: string,
  ) => {
    if (!focusedProperty || !propertyId) return;

    setSubmitting(true);
    try {
      const updatedDocs = focusedProperty.documents?.map((doc) => {
        if (doc.type === docType) {
          return { ...doc, status: action, rejectionReason: rejectMessage };
        }
        return doc;
      });

      await updateProperty(propertyId, { documents: updatedDocs });
      toast.success(
        `Document ${action === "approved" ? "approved" : "rejected"} successfully`,
      );
      setDocAction(null);
      setDocRejectReason("");
      fetchKyc();
    } catch (e: any) {
      toast.error("Failed to update property document status");
    } finally {
      setSubmitting(false);
    }
  };

  const allDocsApproved = useMemo(() => {
    if (propertyId && focusedProperty) {
      if (!focusedProperty.documents || focusedProperty.documents.length === 0)
        return false;
      return focusedProperty.documents.every((d) => d.status === "approved");
    }

    if (!request) return false;
    // If videoKycStatus is not required, only check aadhaar and pan
    if (
      request.videoKycUrl === undefined ||
      request.videoKycUrl === null ||
      request.videoKycUrl === ""
    ) {
      return [request.aadhaarImageStatus, request.panImageStatus].every(
        (s) => s === "approved",
      );
    }
    // If videoKycUrl exists, require all three to be approved
    return [
      request.aadhaarImageStatus,
      request.panImageStatus,
      request.videoKycStatus,
    ].every((s) => s === "approved");
  }, [request, propertyId, focusedProperty]);

  if (loading || !request) {
    return (
      <DashboardLayout
        portalName="FlashSpace Admin"
        portalDescription="Complete platform management"
        navItems={ADMIN_NAV_ITEMS}
      >
        <KYCDetailSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      portalName="FlashSpace Admin"
      portalDescription="Complete platform management"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="min-h-screen bg-transparent p-6 md:p-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 px-4 md:px-0">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to KYC Requests
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
              KYC <span className="text-teal-500 italic">Verification</span>
            </h1>
            <p className="text-gray-500 mt-2 text-sm md:text-base">
              {propertyId
                ? `Reviewing property: ${focusedProperty?.name || "..."}`
                : "Review all details, documents, and take an approval decision."}
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2 bg-white md:bg-transparent p-4 md:p-0 rounded-2xl md:rounded-none border md:border-0 border-gray-100 shadow-sm md:shadow-none">
            {getStatusBadge(
              propertyId
                ? focusedProperty?.kycStatus
                : request.kycStatus || request.overallStatus,
            )}
            <div className="flex flex-col items-center md:items-end">
              <span className="text-xs text-gray-500 font-medium">
                Progress: {allDocsApproved ? "100" : "80"}%
              </span>
              <span className="text-[10px] md:text-xs text-gray-400">
                Submitted:{" "}
                {request.createdAt
                  ? new Date(request.createdAt).toLocaleString()
                  : "-"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-4 md:px-0 grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        {/* Left Column: User & Business Info */}
        <div className="space-y-6">
          {!propertyId ? (
            <>
              {/* User Profile Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                    {request.fullName?.charAt(0) || "U"}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Main Account Holder
                    </p>
                    <h3 className="font-bold text-gray-900 text-lg truncate">
                      {request.fullName}
                    </h3>
                    <p className="text-gray-500 text-sm truncate">
                      {request.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Info */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-blue-500" />
                  <h3 className="font-bold text-gray-900">Personal Info</h3>
                </div>
                <div className="space-y-4 text-sm">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-gray-500 text-xs sm:text-sm">Name:</span>
                    <span className="font-bold text-gray-900">
                      {request.fullName}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-gray-500 text-xs sm:text-sm">Phone:</span>
                    <span className="font-bold text-gray-900 font-mono">
                      {request.phoneNumber || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-gray-500 text-xs sm:text-sm">Email:</span>
                    <span className="font-bold text-gray-900 break-all sm:break-normal">
                      {request.email || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-gray-500 text-xs sm:text-sm">Pan Number:</span>
                    <span className="font-bold text-gray-900 font-mono">
                      {request.panNumber || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-gray-500 text-xs sm:text-sm">Aadhaar Number:</span>
                    <span className="font-bold text-gray-900 font-mono">
                      {request.aadhaarNumber || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Focused Property Info */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-gray-900">
                    Property Focus View
                  </h3>
                </div>
                {loadingFocusedProperty ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                  </div>
                ) : focusedProperty ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">
                        {focusedProperty.name}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {focusedProperty.address}
                      </p>
                      <p className="text-sm text-gray-500">
                        {focusedProperty.area}, {focusedProperty.city}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-gray-50">
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                        Amenities
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {focusedProperty.features?.map((f, i) => (
                          <span
                            key={i}
                            className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-medium"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-red-500">Property not found</p>
                )}
              </div>
            </>
          )}

          {/* Final Decision */}
          {(propertyId
            ? focusedProperty?.kycStatus !== "approved" &&
              focusedProperty?.kycStatus !== "rejected"
            : request.overallStatus !== "rejected" &&
              request.overallStatus !== "approved") && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Final Decision</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setOverallAction("rejected")}
                  disabled={submitting}
                  className="w-full py-3 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" /> Reject{" "}
                  {propertyId ? "Property" : "KYC"}
                </button>
                <button
                  onClick={() => setOverallAction("approved")}
                  disabled={submitting || !allDocsApproved}
                  className={`w-full py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-sm ${
                    submitting || !allDocsApproved
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve{" "}
                  {propertyId ? "Property" : "KYC"}
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Right Column: Documents */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">
                  {propertyId ? "Property Documents" : "Submitted Documents"}
                </h3>
                <p className="text-gray-500 text-sm">
                  {propertyId
                    ? "Verify all legal documents for this property."
                    : "All documents uploaded for this partner."}
                </p>
              </div>
              <span className="text-sm font-medium text-gray-500">
                Total:{" "}
                {propertyId ? focusedProperty?.documents?.length || 0 : 3}
              </span>
            </div>

            <div className="space-y-4">
              {propertyId
                ? focusedProperty?.documents?.map((doc, idx) => (
                    <div
                      key={idx}
                      className="group border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all bg-gray-50/50"
                    >
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4
                              className="font-bold text-gray-900 capitalize"
                              title={doc.type.replace(/_/g, " ")}
                            >
                              {truncateFileName(doc.type.replace(/_/g, " "), 20)}
                            </h4>
                            <p
                              className="text-xs text-gray-500 mt-0.5"
                              title={doc.fileUrl?.split("/").pop()}
                            >
                              {truncateFileName(
                                doc.fileUrl?.split("/").pop() || "",
                                30,
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-row sm:items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                          <div className="sm:mr-2">
                            <span
                              className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1.5 rounded-lg border ${
                                doc.status === "approved"
                                  ? "text-green-600 bg-green-50 border-green-100"
                                  : doc.status === "rejected"
                                    ? "text-red-600 bg-red-50 border-red-100"
                                    : "text-yellow-600 bg-yellow-50 border-yellow-100"
                              }`}
                            >
                              {doc.status ? (
                                <>
                                  {doc.status === "approved" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                  {doc.status.toUpperCase()}
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3 h-3" /> PENDING
                                </>
                              )}
                            </span>
                          </div>

                          <div className="flex gap-1.5 shrink-0">
                            {doc.status !== "approved" && (
                              <button
                                onClick={() =>
                                  handlePropertyDocAction(doc.type, "approved")
                                }
                                title="Approve"
                                disabled={submitting}
                                className="p-2.5 bg-white border border-green-200 text-green-600 hover:bg-green-600 hover:text-white rounded-xl transition-all shadow-sm"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            )}

                            {doc.status !== "rejected" && (
                              <button
                                onClick={() =>
                                  setDocAction({
                                    type: doc.type as any,
                                    action: "rejected",
                                  })
                                }
                                title="Reject"
                                disabled={submitting}
                                className="p-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setSelectedDocument(doc.fileUrl || null);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all flex items-center gap-2 font-medium text-xs px-4"
                            >
                              <Eye className="w-4 h-4" />
                              <span className="hidden sm:inline">View</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                : [
                    {
                      id: "video",
                      keyUrl: "videoKycUrl" as keyof SpaceUserKycResponse,
                      keyStatus: "videoKycStatus" as keyof SpaceUserKycResponse,
                      title: "Video KYC",
                      docType: "video_kyc" as SpaceUserKycDocumentType,
                    },
                    {
                      id: "pan",
                      keyUrl: "panImageUrl" as keyof SpaceUserKycResponse,
                      keyStatus: "panImageStatus" as keyof SpaceUserKycResponse,
                      title: "PAN Card",
                      docType: "pan_image" as SpaceUserKycDocumentType,
                    },
                    {
                      id: "aadhaar",
                      keyUrl: "aadhaarImageUrl" as keyof SpaceUserKycResponse,
                      keyStatus:
                        "aadhaarImageStatus" as keyof SpaceUserKycResponse,
                      title: "Aadhaar",
                      docType: "aadhaar_image" as SpaceUserKycDocumentType,
                    },
                  ].map((doc) => {
                    const url = request[doc.keyUrl] as string;
                    const status = request[doc.keyStatus] as string;
                    if (!url) return null;

                    return (
                      <div
                        key={doc.id}
                        className="group border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all bg-gray-50/50"
                      >
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                          <div className="flex items-center gap-4 w-full sm:w-auto">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                               <h4
                                className="font-bold text-gray-900 capitalize"
                                title={doc.title}
                              >
                                {truncateFileName(doc.title, 20)}
                              </h4>
                              <p
                                className="text-xs text-gray-500 mt-0.5"
                                title={url.split("/").pop()}
                              >
                                {truncateFileName(url.split("/").pop() || "", 30)}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-row sm:items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                            <div className="sm:mr-2">
                              <span
                                className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1.5 rounded-lg border ${
                                  status === "approved"
                                    ? "text-green-600 bg-green-50 border-green-100"
                                    : status === "rejected"
                                      ? "text-red-600 bg-red-50 border-red-100"
                                      : "text-yellow-600 bg-yellow-50 border-yellow-100"
                                }`}
                              >
                                {status ? (
                                  <>
                                    {status === "approved" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                    {status.toUpperCase()}
                                  </>
                                ) : (
                                  <>
                                    <Clock className="w-3 h-3" /> PENDING
                                  </>
                                )}
                              </span>
                            </div>

                            <div className="flex gap-1.5 shrink-0">
                              {status !== "approved" && (
                                <button
                                  onClick={() =>
                                    handleDocAction(doc.docType, "approved")
                                  }
                                  title="Approve"
                                  disabled={submitting}
                                  className="p-2.5 bg-white border border-green-200 text-green-600 hover:bg-green-600 hover:text-white rounded-xl transition-all shadow-sm"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                              )}

                              {status !== "rejected" && (
                                <button
                                  onClick={() =>
                                    setDocAction({
                                      type: doc.docType,
                                      action: "rejected",
                                    })
                                  }
                                  title="Reject"
                                  disabled={submitting}
                                  className="p-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  setSelectedDocument(doc.keyUrl);
                                  window.scrollTo({
                                    top: 0,
                                    behavior: "smooth",
                                  });
                                }}
                                className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all flex items-center gap-2 font-medium text-xs px-4"
                              >
                                <Eye className="w-4 h-4" />
                                <span className="hidden sm:inline">View</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
            </div>
          </div>

          {/* PREVIEW SECTION */}
          {(propertyId
            ? selectedDocument
            : selectedDocument &&
              request[selectedDocument as keyof SpaceUserKycResponse]) && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-in fade-in slide-in-from-top-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    SELECTED DOCUMENT
                  </h3>
                  <p className="text-gray-500 text-sm mt-1 capitalize">
                    {propertyId
                      ? "File Preview"
                      : selectedDocument
                          ?.replace("Url", "")
                          .replace(/([A-Z])/g, " $1")
                          .trim()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4">
                {(() => {
                  const fileUrl = propertyId
                    ? selectedDocument
                    : (request[
                        selectedDocument as keyof SpaceUserKycResponse
                      ] as string);
                  if (!fileUrl) return null;

                  if (isVideoFile(fileUrl)) {
                    return (
                      <video
                        src={getFullUrl(fileUrl)}
                        controls
                        className="w-full rounded-lg max-h-[400px] bg-black"
                      >
                        Your browser does not support the video tag.
                      </video>
                    );
                  } else if (isImageFile(fileUrl)) {
                    return (
                      <img
                        src={getFullUrl(fileUrl)}
                        alt="KYC Document"
                        className="w-full rounded-lg max-h-[400px] object-contain bg-gray-100"
                      />
                    );
                  } else if (isPDFFile(fileUrl)) {
                    return (
                      <iframe
                        src={getFullUrl(fileUrl)}
                        className="w-full h-[400px] rounded-lg border border-gray-200"
                        title="PDF Preview"
                      ></iframe>
                    );
                  } else {
                    return (
                      <div className="flex flex-col items-center justify-center h-40 bg-gray-100 rounded-lg text-gray-500">
                        <FileText className="w-12 h-12 mb-2" />
                        <p>Preview not available</p>
                        <a
                          href={getFullUrl(fileUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm mt-2"
                        >
                          Download File
                        </a>
                      </div>
                    );
                  }
                })()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {docAction && docAction.action === "rejected" && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-gray-900">
                Reject Document
              </h3>
              <button
                onClick={() => setDocAction(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Please provide a reason for rejecting this document. This will be
              visible to the user.
            </p>
            <textarea
              value={docRejectReason}
              onChange={(e) => setDocRejectReason(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-100 min-h-[100px] mb-4 text-sm resize-none"
              placeholder="e.g., Image is blurry, Incorrect document type..."
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setDocAction(null)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  propertyId
                    ? handlePropertyDocAction(
                        docAction.type,
                        "rejected",
                        docRejectReason,
                      )
                    : handleDocAction(
                        docAction.type,
                        "rejected",
                        docRejectReason,
                      )
                }
                disabled={!docRejectReason.trim() || submitting}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {submitting ? "Processing..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}

      {overallAction === "rejected" && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-gray-900">
                Reject Application
              </h3>
              <button
                onClick={() => setOverallAction(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Please provide a reason for rejecting this application. This will
              be visible to the user.
            </p>
            <textarea
              value={overallRejectReason}
              onChange={(e) => setOverallRejectReason(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-100 min-h-[100px] mb-4 text-sm resize-none"
              placeholder="e.g., Inconsistent information, Blurred documents..."
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setOverallAction(null)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleOverallAction("rejected", overallRejectReason)
                }
                disabled={!overallRejectReason.trim() || submitting}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {submitting ? "Processing..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
      {overallAction === "approved" && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
            <h3 className="font-bold text-lg text-gray-900 text-center mb-2">
              Approve KYC
            </h3>
            <p className="text-gray-500 text-sm text-center mb-6">
              Are you sure you want to approve this partner's KYC application?
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setOverallAction(null)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={() => handleOverallAction("approved")}
                disabled={submitting}
                className="flex-1 py-2.5 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
              >
                {submitting ? "Approving..." : "Confirm Approve"}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </DashboardLayout>
  );
}
