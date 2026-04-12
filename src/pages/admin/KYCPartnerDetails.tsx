import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_CONFIG } from "@/config/api.config";
import { adminService, type PartnerKYCData } from "@/services/admin.service";
import type { KYCDocument } from "@/types/adminKyc";
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
} from "lucide-react";
import { toast } from "sonner";

const getFullUrl = (url?: string): string => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  const baseUrl = API_CONFIG.BASE_URL.endsWith("/")
    ? API_CONFIG.BASE_URL.slice(0, -1)
    : API_CONFIG.BASE_URL;
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${baseUrl}${path}`;
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
  const config: Record<
    string,
    {
      bg: string;
      text: string;
      icon: React.ComponentType<{ className?: string }>;
    }
  > = {
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

export default function KYCPartnerDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [request, setRequest] = useState<PartnerKYCData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<KYCDocument | null>(
    null,
  );

  useEffect(() => {
    if (!id) return;

    const fetchById = async () => {
      setLoading(true);
      try {
        const res = await adminService.getPartnerKYCById(id);

        if (res.success && res.data) {
          setRequest(res.data as PartnerKYCData);
        } else {
          toast.error(res.message || "Failed to load partner KYC");
        }
      } catch (error) {
        console.error("Failed to fetch partner KYC", error);
        toast.error("Failed to load partner KYC");
      } finally {
        setLoading(false);
      }
    };

    fetchById();
  }, [id]);

  const allDocsApproved = useMemo(() => {
    if (!request?.documents || request.documents.length === 0) return false;
    return request.documents.every((doc) => doc.status === "approved");
  }, [request]);

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
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight font-[Poppins]">
            Partner KYC Profile
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Review all details, documents, and take an approval decision.
          </p>
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
        {/* Left: partner info */}
        <div className="space-y-4 xl:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                {request.partnerInfo?.fullName?.charAt(0) || "U"}
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-0.5">Partner</p>
                <p className="font-semibold text-gray-900">
                  {request.partnerInfo?.fullName}
                </p>
                <p className="text-xs text-gray-500">
                  {request.partnerInfo?.email}
                </p>
              </div>
            </div>
            <div className="mt-2 space-y-1 text-xs text-gray-600">
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                {request.partnerInfo?.phone}
              </p>
              <p>
                <span className="font-semibold">PAN:</span>{" "}
                {request.partnerInfo?.panNumber}
              </p>
              <p>
                <span className="font-semibold">Aadhaar:</span>{" "}
                {request.partnerInfo?.aadhaarNumber}
              </p>
            </div>
          </div>

          {/* This view is read-only for partner snapshot */}
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
                  All documents uploaded for this partner.
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
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
    </div>
  );
}
