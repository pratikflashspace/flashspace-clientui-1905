import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { adminService } from "@/services/admin.service";
import { getUploadedFileUrl } from "@/utils/fileUrl";
import type { KYCRequest, KYCDocument } from "@/types/adminKyc";
import {
  ArrowLeft,
  User,
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
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";

const getFullUrl = (url?: string): string => {
  return getUploadedFileUrl(url);
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

const getStatusBadge = (status: string) => {
  const config: Record<string, { bg: string; text: string; icon: any }> = {
    pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock },
    approved: {
      bg: "bg-green-100",
      text: "text-green-700",
      icon: CheckCircle2,
    },
    rejected: { bg: "bg-red-100", text: "text-red-700", icon: XCircle },
    resubmit: {
      bg: "bg-orange-100",
      text: "text-orange-700",
      icon: AlertCircle,
    },
  };

  const { bg, text, icon: Icon } = config[status] || config.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${bg} ${text} uppercase`}
    >
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
};

export default function KYCRequestDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const initialRequest = (location.state as { request?: KYCRequest } | null)
    ?.request;

  const [request, setRequest] = useState<KYCRequest | null>(
    initialRequest || null,
  );
  const [loading, setLoading] = useState(!initialRequest);
  const [rejecting, setRejecting] = useState(false);
  const [approving, setApproving] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<KYCDocument | null>(
    null,
  );
  const [docActionLoadingId, setDocActionLoadingId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (request || !id) return;

    const fetchById = async () => {
      setLoading(true);
      try {
        const res = await adminService.getKYCDetails(id);
        if (res.success && res.data) {
          setRequest(res.data as unknown as KYCRequest);
        } else {
          toast.error(res.message || "Failed to load KYC request");
        }
      } catch (error) {
        console.error("Failed to fetch KYC request", error);
        toast.error("Failed to load KYC request");
      } finally {
        setLoading(false);
      }
    };

    fetchById();
  }, [id, request]);

  const refreshKYC = async () => {
    if (!id) return;
    try {
      const res = await adminService.getKYCDetails(id);
      if (res.success && res.data) {
        setRequest(res.data as unknown as KYCRequest);
      }
    } catch (error) {
      console.error("Failed to refresh KYC", error);
    }
  };

  const allDocsApproved = useMemo(() => {
    if (!request?.documents || request.documents.length === 0) return false;
    return request.documents.every((doc) => doc.status === "approved");
  }, [request]);

  const isKycVerified = useMemo(() => {
    if (!request) return false;
    return request.overallStatus === "approved" && allDocsApproved;
  }, [request, allDocsApproved]);

  const handleApprove = async () => {
    if (!request) return;
    if (!confirm(`Approve KYC for ${request.user?.fullName || "this user"}?`))
      return;

    try {
      setApproving(true);
      const res = await adminService.reviewKYC(request._id, "approve");
      if (res.success) {
        toast.success("KYC approved successfully");
        navigate(-1);
      } else {
        toast.error(res.message || "Failed to approve KYC");
      }
    } catch (error) {
      console.error("Failed to approve KYC", error);
      toast.error("Failed to approve KYC");
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    if (!request) return;
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      setRejecting(true);
      const res = await adminService.reviewKYC(
        request._id,
        "reject",
        rejectionReason,
      );
      if (res.success) {
        toast.success("KYC rejected successfully");
        navigate(-1);
      } else {
        toast.error(res.message || "Failed to reject KYC");
      }
    } catch (error) {
      console.error("Failed to reject KYC", error);
      toast.error("Failed to reject KYC");
    } finally {
      setRejecting(false);
      setShowRejectModal(false);
      setRejectionReason("");
    }
  };

  const handleDocumentReview = async (
    doc: KYCDocument,
    action: "approve" | "reject",
  ) => {
    if (!request || !doc._id) return;

    let reason: string | undefined;
    if (action === "reject") {
      const input =
        window.prompt("Enter rejection reason for this document (optional)") ||
        "";
      reason = input.trim() || undefined;
    }

    try {
      setDocActionLoadingId(doc._id);
      const res = await adminService.reviewKYCDocument(
        request._id,
        doc._id,
        action,
        reason,
      );
      if (res.success) {
        toast.success(`Document ${action}ed successfully`);
        await refreshKYC();
      } else {
        toast.error(res.message || `Failed to ${action} document`);
      }
    } catch (error) {
      console.error(`Failed to ${action} document`, error);
      toast.error(`Failed to ${action} document`);
    } finally {
      setDocActionLoadingId(null);
    }
  };

  if (loading || !request) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
        </div>
      </div>
    );
  }

  const isPartnerProfile =
    request.isPartner || request.kycType === "individual";

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 mb-3"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to KYC Requests
          </button>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight font-[Poppins]">
            {/* {isPartnerProfile ? "Partner KYC Profile" : "KYC Profile"} */}
            KYC Profile
          </h1>
          <p className="text-[#6B7280] mt-1 text-sm">
            Review all details, documents, and take an approval decision.
          </p>
          {isKycVerified && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-green-50 border border-green-200 text-xs font-medium text-green-800">
              <CheckCircle2 className="w-4 h-4" />
              <span>KYC is verified with the submitted documents.</span>
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            {getStatusBadge(request.overallStatus)}
            {typeof request.progress === "number" && (
              <span className="text-xs text-gray-500">
                Progress: {request.progress}%
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Submitted: {new Date(request.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Left: user + partner / business info */}
        <div className="space-y-4 xl:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                {request.user?.fullName?.charAt(0) || "U"}
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-0.5">
                  Main Account Holder
                </p>
                <p className="font-semibold text-gray-900">
                  {request.user?.fullName}
                </p>
                <p className="text-xs text-gray-500">{request.user?.email}</p>
              </div>
            </div>
            {request.personalInfo && (
              <p className="text-xs text-blue-600 font-medium mt-1">
                {/* {isPartnerProfile ? "Partner Profile: " : "Profile: "} */}{" "}
                Profile: {request.profileName}
              </p>
            )}
          </div>

          {request.personalInfo && (
            <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-blue-900">
                  {/* {isPartnerProfile ? "Partner Personal Info" : "Personal Info"} */}
                  Personal Info
                </h3>
              </div>
              <div className="space-y-1 text-sm">
                {request.personalInfo.fullName && (
                  <p className="text-gray-700">
                    <span className="font-medium">Name:</span>{" "}
                    {request.personalInfo.fullName}
                  </p>
                )}
                {request.personalInfo.phone && (
                  <p className="text-gray-700">
                    <span className="font-medium">Phone:</span>{" "}
                    {request.personalInfo.phone}
                  </p>
                )}
                {request.personalInfo.email && (
                  <p className="text-gray-700">
                    <span className="font-medium">Email:</span>{" "}
                    {request.personalInfo.email}
                  </p>
                )}
                {request.personalInfo.panNumber && (
                  <p className="text-gray-700">
                    <span className="font-medium">Pan Number:</span>{" "}
                    {request.personalInfo.panNumber}
                  </p>
                )}
                {request.personalInfo.aadhaarNumber && (
                  <p className="text-gray-700">
                    <span className="font-medium">Aadhaar Number:</span>{" "}
                    {request.personalInfo.aadhaarNumber}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Final Decision
            </h3>
            <button
              onClick={() => setShowRejectModal(true)}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold transition-colors"
            >
              <X className="w-4 h-4" />
              Reject KYC
            </button>
            <button
              onClick={handleApprove}
              disabled={!allDocsApproved || approving}
              className={`w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white shadow-md transition-all ${
                !allDocsApproved || approving
                  ? "bg-green-500/60 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              }`}
              title={
                allDocsApproved ? "Approve KYC" : "Approve all documents first"
              }
            >
              <Check className="w-4 h-4" />
              {approving ? "Approving..." : "Approve KYC"}
            </button>
            {!allDocsApproved && (
              <p className="text-xs text-orange-500 mt-1">
                All documents must be approved before approving KYC.
              </p>
            )}
          </div>
        </div>

        {/* Right: documents list & preview */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  Submitted Documents
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  All documents uploaded for this{" "}
                  {isPartnerProfile ? "partner" : "profile"}.
                </p>
              </div>
              <span className="text-xs text-gray-500">
                Total: {request.documents?.length || 0}
              </span>
            </div>

            {request.documents && request.documents.length > 0 ? (
              <div className="space-y-2">
                {request.documents.map((doc, idx) => (
                  <div
                    key={doc._id || idx}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="p-1.5 bg-blue-100 rounded-lg">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <p
                          className="text-sm font-medium text-gray-800 capitalize"
                          title={doc.type}
                        >
                          {truncateFileName(doc.type, 20)}
                        </p>
                        <p
                          className="text-xs text-gray-500"
                          title={doc.name}
                        >
                          {truncateFileName(doc.name || "", 30)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.status && (
                        <span className="px-2 py-0.5 text-[11px] rounded-full bg-white text-gray-600 border border-gray-200 capitalize">
                          {doc.status}
                        </span>
                      )}
                      <button
                        onClick={() => handleDocumentReview(doc, "approve")}
                        disabled={docActionLoadingId === doc._id}
                        className="inline-flex items-center gap-1 px-2 py-1 text-[11px] text-green-700 bg-green-50 hover:bg-green-100 rounded-md border border-green-200 disabled:opacity-60"
                      >
                        <Check className="w-3 h-3" />
                        {docActionLoadingId === doc._id
                          ? "Approving..."
                          : "Accept"}
                      </button>
                      <button
                        onClick={() => handleDocumentReview(doc, "reject")}
                        disabled={docActionLoadingId === doc._id}
                        className="inline-flex items-center gap-1 px-2 py-1 text-[11px] text-red-700 bg-red-50 hover:bg-red-100 rounded-md border border-red-200 disabled:opacity-60"
                      >
                        <X className="w-3 h-3" />
                        {docActionLoadingId === doc._id
                          ? "Rejecting..."
                          : "Reject"}
                      </button>
                      <button
                        onClick={() => setSelectedDocument(doc)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-blue-600 hover:text-blue-700 font-semibold bg-blue-50 hover:bg-blue-100 rounded-lg"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
                <AlertCircle className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-orange-900 mb-1">
                  No documents uploaded
                </p>
                <p className="text-xs text-orange-700">
                  The user has not uploaded any KYC documents yet.
                </p>
              </div>
            )}
          </div>

          {/* Selected document preview */}
          {selectedDocument && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1 mb-1">
                    <FileIcon className="w-3 h-3" />
                    Selected Document
                  </p>
                  <p className="text-lg font-semibold text-gray-900 capitalize">
                    {selectedDocument.type}
                  </p>
                  {selectedDocument.name && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {selectedDocument.name}
                    </p>
                  )}
                  {selectedDocument.uploadedAt && (
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      Uploaded:{" "}
                      {new Date(selectedDocument.uploadedAt).toLocaleString()}
                    </p>
                  )}
                  <div className="mt-2">
                    {getStatusBadge(selectedDocument.status || "pending")}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                  title="Close preview"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {selectedDocument.fileUrl && (
                <div className="bg-gray-50 rounded-xl p-4">
                  {isImageFile(selectedDocument.fileUrl) ? (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <img
                        src={getFullUrl(selectedDocument.fileUrl)}
                        alt={selectedDocument.name}
                        className="max-w-full max-h-[26rem] mx-auto rounded-lg shadow-md"
                      />
                    </div>
                  ) : isPDFFile(selectedDocument.fileUrl) ? (
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <iframe
                        src={getFullUrl(selectedDocument.fileUrl)}
                        className="w-full h-[26rem]"
                        title={selectedDocument.name}
                      />
                    </div>
                  ) : isVideoFile(selectedDocument.fileUrl) ? (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <video
                        src={getFullUrl(selectedDocument.fileUrl)}
                        controls
                        controlsList="nodownload"
                        className="max-w-full max-h-[26rem] mx-auto rounded-lg shadow-md"
                      />
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg p-8 border border-gray-200 text-center">
                      <FileText className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 mb-4">
                        Preview not available for this file type
                      </p>
                      <a
                        href={getFullUrl(selectedDocument.fileUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open in New Tab
                      </a>
                    </div>
                  )}
                </div>
              )}

              {selectedDocument.rejectionReason && (
                <div className="bg-red-50 rounded-xl p-3 border border-red-200">
                  <p className="text-xs font-semibold text-red-900 flex items-center gap-1 mb-1">
                    <XCircle className="w-3 h-3" />
                    Previous Rejection Reason
                  </p>
                  <p className="text-xs text-red-700">
                    {selectedDocument.rejectionReason}
                  </p>
                </div>
              )}

              {selectedDocument.fileUrl && (
                <div className="flex flex-wrap gap-2 justify-end text-xs">
                  <a
                    href={getFullUrl(selectedDocument.fileUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Open
                  </a>
                  <a
                    href={getFullUrl(selectedDocument.fileUrl)}
                    download
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowRejectModal(false);
              setRejectionReason("");
            }
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    Reject KYC
                  </h3>
                  <p className="text-xs text-gray-500">
                    {request.user?.fullName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                }}
                className="p-1.5 rounded-lg hover:bg-gray-100"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a clear reason for rejecting this KYC..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                rows={4}
              />
            </div>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                }}
                className="flex-1 py-2.5 px-4 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={rejecting}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 text-white hover:bg-red-700 text-sm font-semibold disabled:opacity-60"
              >
                {rejecting ? "Rejecting..." : "Reject KYC"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
