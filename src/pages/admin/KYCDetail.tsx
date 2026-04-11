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
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavItems";
import { KYCDetailSkeleton } from "@/components/ui/skeleton-loaders";

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

  const truncateFileName = (name: string, maxLength: number = 25) => {
    if (!name) return "";
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + "...";
  };

  const renderPreview = (doc: any) => {
    if (!doc?.fileUrl) return null;
    const url = getFullFileUrl(doc.fileUrl);
    const ext = doc.fileUrl.split(".").pop()?.toLowerCase();
    const isVideo = ["mp4", "webm", "mov", "avi"].includes(ext || "");
    const isImage = ["jpg", "jpeg", "png", "webp"].includes(ext || "");
    const isPdf = ext === "pdf";

    return (
      <div className="mt-4">
        {isVideo ? (
          <video
            src={url}
            controls
            className="w-full rounded-lg max-h-[400px] bg-black"
          >
            Your browser does not support the video tag.
          </video>
        ) : isImage ? (
          <img
            src={url}
            alt="KYC Document"
            className="w-full rounded-lg max-h-[400px] object-contain bg-gray-100"
          />
        ) : isPdf ? (
          <iframe
            src={url}
            className="w-full h-[400px] rounded-lg border border-gray-200"
            title="PDF Preview"
          ></iframe>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 bg-gray-100 rounded-lg text-gray-500">
            <FileText className="w-12 h-12 mb-2" />
            <p>Preview not available</p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm mt-2"
            >
              Download File
            </a>
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

  if (loading) {
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

  if (!kycData) return null;

  const isCompany = kycData.kycType === "business";

  return (
    <DashboardLayout
      portalName="FlashSpace Admin"
      portalDescription="Complete platform management"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="min-h-screen bg-transparent animate-in fade-in duration-500">
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
                KYC <span className="text-[#35503F] italic">Verification</span>
              </h1>
              <p className="text-gray-500 mt-2 text-sm md:text-base">
                Review all details, documents, and take an approval decision.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-end gap-2 bg-white md:bg-transparent p-4 md:p-0 rounded-2xl md:rounded-none border md:border-0 border-gray-100 shadow-sm md:shadow-none">
              {getStatusBadge(kycData.overallStatus)}
              <div className="flex flex-col items-center md:items-end">
                <span className="text-xs text-gray-500 font-medium">
                  Progress: {kycData.progress || 0}%
                </span>
                <span className="text-[10px] md:text-xs text-gray-400">
                  Submitted: {new Date(kycData.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-0 grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          {/* Left Column: User & Business Info */}
          <div className="space-y-6">
            {/* User Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                  {kycData.user.fullName.charAt(0)}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    {type === "property"
                      ? "Property Owner"
                      : "Main Account Holder"}
                  </p>
                  <h3 className="font-bold text-gray-900 text-lg truncate">
                    {kycData.user.fullName}
                  </h3>
                  <p className="text-gray-500 text-sm truncate">
                    {kycData.user.email}
                  </p>
                  {/* <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {kycData.user.phoneNumber || "N/A"}
                </p> */}
                </div>
              </div>
              {kycData.profileName && (
                <div className="mt-4 pt-4 border-t border-gray-50">
                  <p className="text-sm font-medium text-blue-600">
                    Profile: {kycData.profileName}
                  </p>
                </div>
              )}
            </div>

            {/* Personal Info */}
            {type != "businessinfo" && kycData.personalInfo && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-blue-500" />
                  <h3 className="font-bold text-gray-900">
                    {type === "property" ? "Property Details" : "Personal Info"}
                  </h3>
                </div>
                {type === "property" ? (
                  <div className="space-y-4 text-sm">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                      <span className="text-gray-500 text-xs sm:text-sm">Property Name:</span>
                      <span className="font-bold text-gray-900">
                        {kycData.personalInfo.fullName}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                      <span className="text-gray-500 text-xs sm:text-sm">Address:</span>
                      <span className="font-bold text-gray-900 sm:text-right sm:ml-4 leading-relaxed">
                        {kycData.personalInfo.address || "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                      <span className="text-gray-500 text-xs sm:text-sm">City:</span>
                      <span className="font-bold text-gray-900">
                        {kycData.personalInfo.city || "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                      <span className="text-gray-500 text-xs sm:text-sm">Area:</span>
                      <span className="font-bold text-gray-900">
                        {kycData.personalInfo.area || "N/A"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 text-sm">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                      <span className="text-gray-500 text-xs sm:text-sm">Name:</span>
                      <span className="font-bold text-gray-900">
                        {kycData.personalInfo.fullName}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                      <span className="text-gray-500 text-xs sm:text-sm">Phone:</span>
                      <span className="font-bold text-gray-900 font-mono">
                        {kycData.personalInfo.phone || "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                      <span className="text-gray-500 text-xs sm:text-sm">Email:</span>
                      <span className="font-bold text-gray-900 break-all sm:break-normal">
                        {kycData.personalInfo.email || "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                      <span className="text-gray-500 text-xs sm:text-sm">Pan Number:</span>
                      <span className="font-bold text-gray-900 font-mono">
                        {kycData.personalInfo.panNumber || "N/A"}
                      </span>
                    </div>
                    {kycData.personalInfo.aadhaarNumber && (
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                        <span className="text-gray-500 text-xs sm:text-sm">Aadhaar Number:</span>
                        <span className="font-bold text-gray-900 font-mono">
                          {kycData.personalInfo.aadhaarNumber}
                        </span>
                      </div>
                    )}
                    {kycData.personalInfo.dateOfBirth && (
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                        <span className="text-gray-500 text-xs sm:text-sm">DOB:</span>
                        <span className="font-bold text-gray-900">
                          {new Date(
                            kycData.personalInfo?.dateOfBirth,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Business Info (if applicable) */}
            {isCompany && kycData.businessInfo && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-purple-500" />
                  <h3 className="font-bold text-gray-900">Business Info</h3>
                </div>
                <div className="space-y-4 text-sm">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-gray-500 text-xs sm:text-sm">Company Name:</span>
                    <span className="font-bold text-gray-900 sm:text-right leading-tight">
                      {kycData.businessInfo.companyName}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-gray-500 text-xs sm:text-sm">Type:</span>
                    <span className="font-bold text-gray-900">
                      {kycData.businessInfo.companyType}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-gray-500 text-xs sm:text-sm">GST:</span>
                    <span className="font-bold text-gray-900 font-mono">
                      {kycData.businessInfo.gstNumber || "N/A"}
                    </span>
                  </div>
                  {kycData.businessInfo.cinNumber && (
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                      <span className="text-gray-500 text-xs sm:text-sm">CIN:</span>
                      <span className="font-bold text-gray-900 font-mono">
                        {kycData.businessInfo.cinNumber}
                      </span>
                    </div>
                  )}
                  <div className="mt-4 pt-4 border-t border-gray-50">
                    <span className="text-gray-500 block mb-2 text-xs uppercase font-bold tracking-wider">Registered Address:</span>
                    <p className="text-gray-900 font-medium leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                      {kycData.businessInfo.registeredAddress || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Overall Actions */}
            {kycData.overallStatus !== "rejected" &&
              kycData.overallStatus !== "approved" && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-bold text-gray-900 mb-4">
                    Final Decision
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={handleRejectKYC}
                      disabled={processing}
                      className="w-full py-3 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />{" "}
                      {type === "property"
                        ? "Reject Property KYC"
                        : "Reject KYC"}
                    </button>
                    <button
                      onClick={handleApproveKYC}
                      disabled={
                        processing ||
                        !kycData.documents?.every(
                          (doc) => doc.status === "approved",
                        )
                      }
                      className={`w-full py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-sm ${
                        !kycData.documents?.every(
                          (doc) => doc.status === "approved",
                        )
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600 text-white"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />{" "}
                      {type === "property"
                        ? "Approve Property KYC"
                        : "Approve KYC"}
                    </button>
                    {!kycData.documents?.every(
                      (doc) => doc.status === "approved",
                    ) && (
                      <p className="text-xs text-orange-500 text-center mt-2 flex items-center justify-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        All documents must be approved before approving KYC.
                      </p>
                    )}
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
                    Submitted Documents
                  </h3>
                  <p className="text-gray-500 text-sm">
                    All documents uploaded for this partner.
                  </p>
                </div>
                <span className="text-sm font-medium text-gray-500">
                  Total: {kycData.documents?.length || 0}
                </span>
              </div>

              <div className="space-y-4">
                {kycData.documents && kycData.documents.length > 0 ? (
                  kycData.documents.map((doc: any, index: number) => (
                    <div
                      key={doc._id || index}
                      className="group border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all bg-gray-50/50"
                    >
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                        {/* File Icon & Info */}
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4
                              className="font-bold text-gray-900 capitalize"
                              title={doc.name || doc.type.replace(/_/g, " ")}
                            >
                              {truncateFileName(
                                doc.name || doc.type.replace(/_/g, " "),
                                20,
                              )}
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
                            {doc.rejectionReason &&
                              doc.status === "rejected" && (
                                <div className="mt-2 text-[10px] md:text-xs text-red-600 font-medium bg-red-50 p-2 rounded-lg border border-red-100 leading-tight">
                                  <span className="font-bold">Reason:</span> {doc.rejectionReason}
                                </div>
                              )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-row sm:items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                          {/* Status Label */}
                          <div className="sm:mr-2">
                            {doc.status === "approved" && (
                              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-green-50 px-2.5 py-1.5 rounded-lg border border-green-100">
                                <CheckCircle2 className="w-3 h-3" /> APPROVED
                              </span>
                            )}
                            {doc.status === "rejected" && (
                              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-red-600 bg-red-50 px-2.5 py-1.5 rounded-lg border border-red-100">
                                <XCircle className="w-3 h-3" /> REJECTED
                              </span>
                            )}
                            {doc.status === "pending" && (
                              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-yellow-600 bg-yellow-50 px-2.5 py-1.5 rounded-lg border border-yellow-100">
                                <Clock className="w-3 h-3" /> PENDING
                              </span>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-1.5 shrink-0">
                            {doc.status !== "approved" && (
                              <button
                                onClick={() =>
                                  handleDocumentAction(doc._id, "approve")
                                }
                                title="Approve"
                                disabled={processing}
                                className="p-2.5 bg-white border border-green-200 text-green-600 hover:bg-green-600 hover:text-white rounded-xl transition-all shadow-sm"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            )}

                            {doc.status !== "rejected" && (
                              <button
                                onClick={() => openRejectModal(doc._id)}
                                title="Reject"
                                disabled={processing}
                                className="p-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setSelectedDoc(doc);
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
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p>No documents uploaded yet.</p>
                  </div>
                )}
              </div>
            </div>

            {/* PREVIEW SECTION */}
            {selectedDoc && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-in fade-in slide-in-from-top-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      SELECTED DOCUMENT
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      {selectedDoc.name || selectedDoc.type}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Uploaded:{" "}
                      {new Date(
                        selectedDoc.uploadedAt || Date.now(),
                      ).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedDoc(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                {selectedDoc.status === "rejected" && (
                  <div className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2 mb-4">
                    <XCircle className="w-4 h-4" /> REJECTED
                  </div>
                )}

                {renderPreview(selectedDoc)}
              </div>
            )}
          </div>
        </div>

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-900">
                  {selectedDocId === "kyc"
                    ? "Reject Application"
                    : "Reject Document"}
                </h3>
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-500 text-sm mb-4">
                Please provide a reason for rejecting this{" "}
                {selectedDocId === "kyc" ? "application" : "document"}. This
                will be visible to the user.
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-100 min-h-[100px] mb-4 text-sm resize-none"
                placeholder={
                  selectedDocId === "kyc"
                    ? "e.g., Inconsistent information, Blurred documents..."
                    : "e.g., Image is blurry, Incorrect document type..."
                }
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (rejectionReason) {
                      if (selectedDocId === "kyc") {
                        // Handle KYC Rejection
                        setProcessing(true);
                        try {
                          let response;
                          if (type === "business") {
                            response =
                              await adminService.updateBusinessInfoStatus(
                                id!,
                                "reject",
                                rejectionReason,
                              );
                          } else if (type === "partner") {
                            response = await adminService.updatePartnerStatus(
                              id!,
                              "reject",
                              rejectionReason,
                            );
                          } else {
                            response = await adminService.reviewKYC(
                              id!,
                              "reject",
                              rejectionReason,
                            );
                          }
                          if (response.success) {
                            toast.success("KYC rejected successfully");
                            navigate(-1);
                          } else {
                            toast.error(
                              response.message || "Failed to reject KYC",
                            );
                          }
                        } catch (error) {
                          console.error("Error rejecting KYC:", error);
                          toast.error("Failed to reject KYC");
                        } finally {
                          setProcessing(false);
                          setShowRejectModal(false);
                          setRejectionReason("");
                        }
                      } else {
                        // This case is for rejecting a specific document
                        handleDocumentAction(
                          selectedDocId,
                          "reject",
                          rejectionReason
                        );
                      }
                    }
                  }}
                  disabled={!rejectionReason.trim() || processing}
                  className="w-full sm:flex-1 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50 order-1 sm:order-2"
                >
                  {processing ? "Processing..." : "Confirm Rejection"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Approve Confirmation Modal */}
        {showApproveModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl animate-in zoom-in-95 duration-200">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Approve KYC?
                </h3>
                <p className="text-gray-500 text-sm">
                  Are you sure you want to approve this KYC application? This
                  action cannot be undone efficiently.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowApproveModal(false)}
                  className="w-full sm:flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors order-2 sm:order-1"
                  disabled={processing}
                >
                  Cancel
                </button>
                <button
                  onClick={performApproveKYC}
                  className="w-full sm:flex-1 py-2.5 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors disabled:opacity-50 order-1 sm:order-2"
                  disabled={processing}
                >
                  {processing ? "Approving..." : "Yes, Approve"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
