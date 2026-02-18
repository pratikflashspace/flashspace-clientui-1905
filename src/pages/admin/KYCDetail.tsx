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
      } else {
        response = await adminService.getKYCDetails(kycId);
      }
      if (response.success && response.data) {
        setKycData(response.data);
      } else {
        toast.error("Failed to load KYC details");
        navigate("/admin/kyc-requests");
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

  const handleApproveKYC = async () => {
    if (!id) return;
    if (!confirm("Are you sure you want to approve this KYC application?"))
      return;

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
        navigate("/admin/kyc-requests");
      } else {
        toast.error(response.message || "Failed to approve KYC");
      }
    } catch (error) {
      console.error("Error approving KYC:", error);
      toast.error("Failed to approve KYC");
    } finally {
      setProcessing(false);
    }
  };

  const handleRejectKYC = async () => {
    if (!id) return;
    const reason = prompt("Enter rejection reason for the entire application:");
    if (!reason) return;

    setProcessing(true);
    try {
      let response;
      if (type === "business") {
        response = await adminService.updateBusinessInfoStatus(
          id,
          "reject",
          reason,
        );
      } else if (type === "partner") {
        response = await adminService.updatePartnerStatus(id, "reject", reason);
      } else {
        response = await adminService.reviewKYC(id, "reject", reason);
      }
      if (response.success) {
        toast.success("KYC rejected successfully");
        navigate("/admin/kyc-requests");
      } else {
        toast.error(response.message || "Failed to reject KYC");
      }
    } catch (error) {
      console.error("Error rejecting KYC:", error);
      toast.error("Failed to reject KYC");
    } finally {
      setProcessing(false);
    }
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
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!kycData) return null;

  const isCompany = kycData.kycType === "business";

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <button
          onClick={() => navigate("/admin/kyc-requests")}
          className="flex items-center text-gray-500 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to KYC Requests
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              KYC <span className="text-teal-500 italic">Verification</span>
            </h1>
            <p className="text-gray-500 mt-1">
              Review all details, documents, and take an approval decision.
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            {getStatusBadge(kycData.overallStatus)}
            <span className="text-xs text-gray-500">
              Progress: {kycData.progress || 0}%
            </span>
            <span className="text-xs text-gray-400">
              Submitted: {new Date(kycData.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                  Main Account Holder
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
                <h3 className="font-bold text-gray-900">Personal Info</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Name:</span>
                  <span className="font-medium text-gray-900">
                    {kycData.personalInfo.fullName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone:</span>
                  <span className="font-medium text-gray-900">
                    {kycData.personalInfo.phone || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-medium text-gray-900">
                    {kycData.personalInfo.email || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Pan Number:</span>
                  <span className="font-medium text-gray-900">
                    {kycData.personalInfo.panNumber || "N/A"}
                  </span>
                </div>
                {kycData.personalInfo.aadhaarNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Aadhaar Number:</span>
                    <span className="font-medium text-gray-900">
                      {kycData.personalInfo.aadhaarNumber}
                    </span>
                  </div>
                )}
                {kycData.personalInfo.dateOfBirth && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">DOB:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(
                        kycData.personalInfo?.dateOfBirth,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Business Info (if applicable) */}
          {isCompany && kycData.businessInfo && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-purple-500" />
                <h3 className="font-bold text-gray-900">Business Info</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Company Name:</span>
                  <span className="font-medium text-gray-900 text-right">
                    {kycData.businessInfo.companyName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Type:</span>
                  <span className="font-medium text-gray-900">
                    {kycData.businessInfo.companyType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">GST:</span>
                  <span className="font-medium text-gray-900">
                    {kycData.businessInfo.gstNumber || "N/A"}
                  </span>
                </div>
                {kycData.businessInfo.cinNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">CIN:</span>
                    <span className="font-medium text-gray-900">
                      {kycData.businessInfo.cinNumber}
                    </span>
                  </div>
                )}
                <div className="mt-2 pt-2 border-t border-gray-50">
                  <span className="text-gray-500 block mb-1">Address:</span>
                  <p className="text-gray-900 font-medium leading-relaxed">
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
                <h3 className="font-bold text-gray-900 mb-4">Final Decision</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleRejectKYC}
                    disabled={processing}
                    className="w-full py-3 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" /> Reject KYC
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
                    <CheckCircle2 className="w-4 h-4" /> Approve KYC
                  </button>
                  {!kycData.documents?.every(
                    (doc) => doc.status === "approved",
                  ) && (
                    <p className="text-xs text-orange-500 text-center mt-2">
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
                    <div className="flex items-start justify-between gap-4">
                      {/* File Icon & Info */}
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4
                            className="font-bold text-gray-900 capitalize truncate max-w-[200px]"
                            title={doc.name || doc.type.replace(/_/g, " ")}
                          >
                            {doc.name || doc.type.replace(/_/g, " ")}
                          </h4>
                          <p className="text-xs text-gray-500 truncate max-w-[200px]">
                            {doc.fileUrl?.split("/").pop()}
                          </p>
                          {doc.rejectionReason && doc.status === "rejected" && (
                            <p className="text-xs text-red-600 mt-1 font-medium bg-red-50 p-1 px-2 rounded inline-block">
                              Reason: {doc.rejectionReason}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {/* Status Label */}
                        <div className="mr-2">
                          {doc.status === "approved" && (
                            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                              Approved
                            </span>
                          )}
                          {doc.status === "rejected" && (
                            <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">
                              Rejected
                            </span>
                          )}
                          {doc.status === "pending" && (
                            <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                              Pending
                            </span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-1">
                          {doc.status !== "approved" && (
                            <button
                              onClick={() =>
                                handleDocumentAction(doc._id, "approve")
                              }
                              disabled={processing}
                              className="p-2 px-3 bg-white border border-green-200 text-green-600 hover:bg-green-50 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Accept
                            </button>
                          )}

                          {doc.status !== "rejected" && (
                            <button
                              onClick={() => openRejectModal(doc._id)}
                              disabled={processing}
                              className="p-2 px-3 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                            >
                              <XCircle className="w-3 h-3" /> Reject
                            </button>
                          )}

                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedDoc(doc);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="p-2 px-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" /> View
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
                Reject Document
              </h3>
              <button
                onClick={() => setShowRejectModal(false)}
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
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-100 min-h-[100px] mb-4 text-sm resize-none"
              placeholder="e.g., Image is blurry, Incorrect document type..."
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
                onClick={() => {
                  if (selectedDocId && rejectionReason) {
                    handleDocumentAction(
                      selectedDocId,
                      "reject",
                      rejectionReason,
                    );
                  }
                }}
                disabled={!rejectionReason.trim() || processing}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
