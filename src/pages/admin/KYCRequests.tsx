import React, { useState, useEffect } from "react";
import {
  Search,
  Check,
  X,
  Eye,
  FileText,
  AlertCircle,
  Building2,
  Clock,
  User,
  ArrowLeft,
  Filter,
  ArrowRight,
  ChevronRight,
  List,
  Mail,
  Phone,
  Calendar,
  Shield,
  File,
  ExternalLink,
  Download,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SpacePartnerKycRequest from "./SpacePartnerKycRequest";
import { KYCRequest, KYCDocument } from "@/types/adminKyc";

const getFullUrl = (url: string | undefined): string => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${cleanBaseUrl}${cleanPath}`;
};

export default function KYCRequests() {
  const navigate = useNavigate();
  // State from Version 1
  const [requests, setRequests] = useState<KYCRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<KYCDocument | null>(
    null,
  );
  const [selectedRequest, setSelectedRequest] = useState<KYCRequest | null>(
    null,
  );
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // Additional state from Version 2
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [partnerSearchTerm, setPartnerSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("users");
  const [viewMode, setViewMode] = useState<
    "list" | "user_partners" | "user_business"
  >("list");
  const [partnerRequests, setPartnerRequests] = useState<any[]>([]);
  const [loadingPartnerRequests, setLoadingPartnerRequests] = useState(false);
  const [businessInfo, setBusinessInfo] = useState<any[]>([]);
  const [loadingBusinessInfo, setLoadingBusinessInfo] = useState(false);
  const [selectedUserForPartners, setSelectedUserForPartners] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [selectedUserForBusiness, setSelectedUserForBusiness] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [requestSourceFilter, setRequestSourceFilter] = useState<
    "all" | "partner" | "regular"
  >("all");

  useEffect(() => {
    fetchKYCRequests();
  }, [requestSourceFilter]);

  const fetchKYCRequests = async () => {
    setLoading(true);
    try {
      const response = await adminService.getPendingKYC(true);
      if (response.success && response.data) {
        // Deduplicate by _id
        const uniqueRequests = response.data.filter(
          (req: KYCRequest, index: number, self: KYCRequest[]) =>
            index === self.findIndex((r) => r._id === req._id),
        );
        setRequests(uniqueRequests);
      }
    } catch (error) {
      console.error("Failed to fetch KYC requests", error);
      toast.error("Failed to fetch KYC requests");
    } finally {
      setLoading(false);
    }
  };

  const stats = React.useMemo(() => {
    if (activeTab === "partners" || viewMode === "user_partners") {
      return {
        total: partnerRequests.length,
        pending: partnerRequests.filter((r) => r.status === "pending").length,
        approved: partnerRequests.filter((r) => r.status === "approved").length,
        rejected: partnerRequests.filter((r) => r.status === "rejected").length,
      };
    }
    return {
      total: requests.length,
      pending: requests.filter((r) => r.overallStatus === "pending").length,
      approved: requests.filter((r) => r.overallStatus === "approved").length,
      rejected: requests.filter((r) => r.overallStatus === "rejected").length,
    };
  }, [requests, partnerRequests, activeTab, viewMode]);

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.user?.fullName
        ?.toLowerCase()
        .includes(userSearchTerm.toLowerCase()) ||
      request.user?.email?.toLowerCase().includes(userSearchTerm.toLowerCase());

    if (requestSourceFilter === "all") return matchesSearch;
    if (requestSourceFilter === "partner")
      return matchesSearch && !!request.isPartner;
    return matchesSearch && !request.isPartner;
  });

  const filteredPartnerRequests = partnerRequests.filter(
    (partner) =>
      partner.fullName
        ?.toLowerCase()
        .includes(partnerSearchTerm.toLowerCase()) ||
      partner.email?.toLowerCase().includes(partnerSearchTerm.toLowerCase()),
  );

  const handleApprove = async (request: KYCRequest) => {
    try {
      const response = await adminService.reviewKYC(request._id, "approve");
      if (response.success) {
        toast.success("KYC approved successfully");
        fetchKYCRequests();
      }
    } catch (error) {
      toast.error("Failed to approve KYC");
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    if (!selectedRequest) return;

    try {
      const response = await adminService.reviewKYC(
        selectedRequest._id,
        "reject",
        rejectionReason,
      );
      if (response.success) {
        toast.success("KYC rejected successfully");
        setShowRejectModal(false);
        setRejectionReason("");
        fetchKYCRequests();
      }
    } catch (error) {
      toast.error("Failed to reject KYC");
    }
  };

  const handleDocumentReview = async (status: "approved" | "rejected") => {
    if (!selectedDocument || !selectedRequest) return;

    const action = status === "approved" ? "approve" : "reject";

    try {
      const response = await adminService.reviewKYCDocument(
        selectedRequest._id,
        selectedDocument.type,
        action,
        status === "rejected" ? "Document invalid or unclear" : undefined,
      );

      if (response.success) {
        toast.success(`Document ${status} successfully`);
        setShowDocumentModal(false);
        fetchKYCRequests();
      }
    } catch (error) {
      toast.error("Failed to review document");
    }
  };

  const handleViewPartners = async (userId: string, fullName: string) => {
    setViewMode("user_partners");
    setSelectedUserForPartners({ id: userId, name: fullName });
    setLoadingPartnerRequests(true);
    try {
      const response = await adminService.getPartnersByUser(userId);
      if (response.success) {
        setPartnerRequests(
          Array.isArray(response.data) ? response.data : [response.data],
        );
      }
    } catch (error) {
      toast.error("Failed to fetch partner applications");
    } finally {
      setLoadingPartnerRequests(false);
    }
  };

  const handleViewBusinessInfo = async (userId: string, fullName: string) => {
    setViewMode("user_business");
    setSelectedUserForBusiness({ id: userId, name: fullName });
    setLoadingBusinessInfo(true);
    try {
      const response = await adminService.getBusinessInfoByUser(userId);
      if (response.success && response.data) {
        setBusinessInfo(
          Array.isArray(response.data) ? response.data : [response.data],
        );
      }
    } catch (error) {
      toast.error("Failed to fetch business information");
    } finally {
      setLoadingBusinessInfo(false);
    }
  };

  const handleBackToRequests = () => {
    setViewMode("list");
    setSelectedUserForPartners(null);
    setSelectedUserForBusiness(null);
    setPartnerRequests([]);
    setBusinessInfo([]);
  };

  const openRejectModal = (request: KYCRequest) => {
    setSelectedRequest(request);
    setShowRejectModal(true);
  };

  const openDocumentModal = (doc: KYCDocument, request: KYCRequest) => {
    setSelectedDocument(doc);
    setSelectedRequest(request);
    setShowDocumentModal(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider border border-green-200">
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase tracking-wider border border-red-200">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold uppercase tracking-wider border border-yellow-200">
            Pending
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

  const isPDFFile = (url?: string) => {
    return getFileExtension(url) === "pdf";
  };

  const isVideoFile = (url?: string) => {
    const ext = getFileExtension(url);
    return ["mp4", "webm", "mov", "avi", "mkv"].includes(ext);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-6 bg-gray-50/30 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {viewMode === "user_partners" ? (
              <>
                Partners{" "}
                <span className="text-teal-500 italic">
                  for {selectedUserForPartners?.name}
                </span>
              </>
            ) : viewMode === "user_business" ? (
              <>
                Business Profiles{" "}
                <span className="text-purple-500 italic">
                  for {selectedUserForBusiness?.name}
                </span>
              </>
            ) : (
              <>
                KYC <span className="text-teal-500 italic">Verification</span>
              </>
            )}
          </h1>
          <p className="text-gray-500 mt-2 text-lg font-light">
            {viewMode === "user_partners"
              ? "Review partner applications for this user"
              : viewMode === "user_business"
                ? "Review business info for this user"
                : "Review and approve identity documents"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {(viewMode === "user_partners" || viewMode === "user_business") && (
            <button
              onClick={handleBackToRequests}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors font-medium shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Requests
            </button>
          )}
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl border border-blue-200">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">
              {viewMode === "user_partners"
                ? `${filteredPartnerRequests.length} Partners Found`
                : viewMode === "user_business"
                  ? `${businessInfo.length} Business Profiles`
                  : activeTab === "users"
                    ? `${filteredRequests.length} Users Found`
                    : `${filteredPartnerRequests.length} Pending Partners`}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
          <h3 className="text-3xl font-extrabold text-yellow-600">
            {stats.pending}
          </h3>
          <p className="text-gray-500 text-sm">Pending Review</p>
        </div>
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
          <h3 className="text-3xl font-extrabold text-green-600">
            {stats.approved}
          </h3>
          <p className="text-gray-500 text-sm">Approved</p>
        </div>
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
          <h3 className="text-3xl font-extrabold text-red-600">
            {stats.rejected}
          </h3>
          <p className="text-gray-500 text-sm">Rejected</p>
        </div>
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
          <h3 className="text-3xl font-extrabold text-gray-900">
            {stats.total}
          </h3>
          <p className="text-gray-500 text-sm">Total Requests</p>
        </div>
      </div>

      {viewMode === "user_partners" ? (
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6">
          {loadingPartnerRequests ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Loading partners...</p>
            </div>
          ) : filteredPartnerRequests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No partners found for this user.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPartnerRequests.map((partner) => (
                <div
                  key={partner._id}
                  className="bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {partner.fullName}
                      </h4>
                      <p className="text-sm text-gray-500">{partner.email}</p>
                    </div>
                    {getStatusBadge(partner.status)}
                  </div>
                  <button
                    onClick={() =>
                      navigate(
                        `/admin/kyc-requests/${partner._id}?type=partner`,
                      )
                    }
                    className="w-full mt-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-semibold shadow-sm"
                  >
                    View Partner Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : viewMode === "user_business" ? (
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6">
          {loadingBusinessInfo ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Loading business information...</p>
            </div>
          ) : businessInfo.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No business information found for this user.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {businessInfo.map((biz) => (
                <div
                  key={biz._id}
                  className="bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-gray-900 text-xl">
                      {biz.companyName || "N/A"}
                    </h4>
                    {getStatusBadge(biz.status || "pending")}
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>
                      <span className="font-semibold text-gray-900">GST:</span>{" "}
                      {biz.gstNumber || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-900">PAN:</span>{" "}
                      {biz.panNumber || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-900">Type:</span>{" "}
                      {biz.companyType || "N/A"}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      navigate(
                        `/admin/kyc-requests/${biz._id}?type=businessinfo`,
                      )
                    }
                    className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold shadow-sm"
                  >
                    Review Business Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
            <TabsTrigger
              value="users"
              className="rounded-lg px-6 data-[state=active]:bg-[#3FA69E] data-[state=active]:text-white"
            >
              User KYC
            </TabsTrigger>
            <TabsTrigger
              value="partners"
              className="rounded-lg px-6 data-[state=active]:bg-teal-600 data-[state=active]:text-white"
            >
              Partner KYC
            </TabsTrigger>
          </TabsList>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={
                  activeTab === "users" ? userSearchTerm : partnerSearchTerm
                }
                onChange={(e) =>
                  activeTab === "users"
                    ? setUserSearchTerm(e.target.value)
                    : setPartnerSearchTerm(e.target.value)
                }
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 focus:bg-white transition-all text-gray-900"
              />
            </div>
          </div>

          <TabsContent value="users" className="space-y-6">
            {filteredRequests.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No Requests Found
                </h3>
                <p className="text-gray-500">
                  No users match your current search and filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredRequests.map((request) => (
                  <div
                    key={request._id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                  >
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                      <div className="flex items-center justify-between mb-4 gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                            {request.user?.fullName?.charAt(0) || "U"}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">
                              {request.user?.fullName}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {request.user?.email}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(request.overallStatus)}
                      </div>
                    </div>

                    <div className="p-6 space-y-4 flex-1">
                      {request.personalInfo && (
                        <button
                          onClick={() =>
                            handleViewPartners(
                              request.user?._id,
                              request.user?.fullName,
                            )
                          }
                          className="w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl p-4 transition-colors text-left"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-semibold text-blue-900">
                              Partner Portals
                            </h4>
                            <List className="w-4 h-4 text-blue-600" />
                          </div>
                          <p className="text-xs text-blue-700">
                            View and manage linked partners
                          </p>
                        </button>
                      )}

                      {request.overallStatus === "approved" && (
                        <button
                          onClick={() =>
                            handleViewBusinessInfo(
                              request.user?._id,
                              request.user?.fullName,
                            )
                          }
                          className="w-full bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl p-4 transition-colors text-left"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-semibold text-purple-900">
                              Business Info
                            </h4>
                            <Building2 className="w-4 h-4 text-purple-600" />
                          </div>
                          <p className="text-xs text-purple-700">
                            Review business profiles & tax info
                          </p>
                        </button>
                      )}

                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Submitted Documents
                        </h4>
                        <div className="space-y-1">
                          {request.documents?.map((doc, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm"
                            >
                              <span className="capitalize">{doc.type}</span>
                              <button
                                onClick={() => openDocumentModal(doc, request)}
                                className="text-blue-600 hover:underline font-medium"
                              >
                                Verify
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 pt-0 mt-auto">
                      <button
                        onClick={() =>
                          navigate(`/admin/kyc-requests/${request._id}`)
                        }
                        className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-md"
                      >
                        Complete Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="partners" className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-teal-50 rounded-xl">
                  <Building2 className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Partner KYC Requests
                  </h3>
                  <p className="text-sm text-gray-500">
                    Review and approve property partners
                  </p>
                </div>
              </div>
              <SpacePartnerKycRequest />
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Modals */}
      {showDocumentModal && selectedDocument && selectedRequest && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={(e) =>
            e.target === e.currentTarget && setShowDocumentModal(false)
          }
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold">Document Verification</h3>
              <button onClick={() => setShowDocumentModal(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 bg-white">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 border-none uppercase mb-1">
                    Type
                  </p>
                  <p className="text-lg font-bold capitalize">
                    {selectedDocument.type}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 border-none uppercase mb-1">
                    Status
                  </p>
                  {getStatusBadge(selectedDocument.status || "pending")}
                </div>
              </div>
              <div className="aspect-video bg-gray-100 rounded-xl border-none overflow-hidden flex items-center justify-center">
                {isImageFile(selectedDocument.fileUrl) ? (
                  <img
                    src={getFullUrl(selectedDocument.fileUrl)}
                    alt="Preview"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : isPDFFile(selectedDocument.fileUrl) ? (
                  <iframe
                    src={getFullUrl(selectedDocument.fileUrl)}
                    className="w-full h-full"
                    title="PDF Preview"
                  />
                ) : (
                  <div className="text-center p-8">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Preview not available</p>
                    <a
                      href={getFullUrl(selectedDocument.fileUrl)}
                      target="_blank"
                      className="text-blue-600 underline font-bold"
                      rel="noreferrer"
                    >
                      Download File
                    </a>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t flex gap-4">
              <button
                onClick={() => handleDocumentReview("approve")}
                className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-md"
              >
                Approve Document
              </button>
              <button
                onClick={() => handleDocumentReview("reject")}
                className="flex-1 py-3 border-2 border-red-100 text-red-600 rounded-xl font-bold hover:bg-red-50"
              >
                Reject Document
              </button>
            </div>
          </div>
        </div>
      )}

      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-red-600">
                Reject KYC Request
              </h3>
              <button onClick={() => setShowRejectModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Rejection Reason
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-4 border rounded-xl h-32 resize-none focus:ring-2 focus:ring-red-100"
                placeholder="Tell the user what needs to be fixed..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 py-3 border rounded-xl font-bold text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-md"
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
