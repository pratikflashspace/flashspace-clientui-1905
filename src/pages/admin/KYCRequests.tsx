import React, { useEffect, useState } from "react";
import SpacePartnerKycRequest from "./SpacePartnerKycRequest";
import { adminService } from "@/services/admin.service";
import {
  Search,
  Check,
  X,
  FileText,
  AlertCircle,
  User,
  Building2,
  Eye,
  Download,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Calendar,
  File,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/api.config";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavItems";
import { useNavigate } from "react-router-dom";

interface KYCDocument {
  type: string;
  name: string;
  fileUrl?: string;
  status?: string;
  rejectionReason?: string;
  uploadedAt?: string;
  verifiedAt?: string;
}

interface KYCRequest {
  _id: string;
  profileName?: string;
  kycType?: "individual" | "business";
  isPartner?: boolean;
  user: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
  };
  personalInfo?: {
    fullName?: string;
    email?: string;
    phone?: string;
  };
  businessInfo?: {
    companyName?: string;
    companyType?: string;
    gstNumber?: string;
    panNumber?: string;
  };
  overallStatus:
    | "pending"
    | "approved"
    | "rejected"
    | "resubmit"
    | "not_started";
  documents: KYCDocument[];
  progress?: number;
  createdAt: string;
  partnerCount?: number;
  businessInfoCount?: number;
}

export default function KYCRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<KYCRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [partnerSearchTerm, setPartnerSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<KYCRequest | null>(
    null,
  );
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<KYCDocument | null>(
    null,
  );

  // Partner KYC State
  const [partnerRequests, setPartnerRequests] = useState<any[]>([]);
  const [loadingPartnerRequests, setLoadingPartnerRequests] = useState(false);
  const [activeTab, setActiveTab] = useState("users");
  const [viewMode, setViewMode] = useState<
    "list" | "user_partners" | "user_business"
  >("list");
  const [selectedUserForPartners, setSelectedUserForPartners] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [selectedUserForBusiness, setSelectedUserForBusiness] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Partner Modal State
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [partners, setPartners] = useState<any[]>([]);
  const [loadingPartners, setLoadingPartners] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<any | null>(null);

  // Personal Info Modal State
  const [showPersonalInfoModal, setShowPersonalInfoModal] = useState(false);
  const [selectedPersonalInfo, setSelectedPersonalInfo] = useState<any | null>(
    null,
  );

  // Business Info Modal State
  const [showBusinessInfoModal, setShowBusinessInfoModal] = useState(false);
  const [businessInfo, setBusinessInfo] = useState<any[]>([]); // Changed to array
  const [loadingBusinessInfo, setLoadingBusinessInfo] = useState(false);

  // Helper to construct full URL from relative path
  const getFullUrl = (url?: string): string => {
    if (!url) return "";

    let cleanUrl = url;
    if (cleanUrl.includes("localhost:5000")) {
      cleanUrl = cleanUrl.replace(/https?:\/\/localhost:5000(\/api)?/, "");
    }

    if (cleanUrl.startsWith("http")) return cleanUrl;

    const baseUrl = API_CONFIG.BASE_URL.endsWith("/")
      ? API_CONFIG.BASE_URL.slice(0, -1)
      : API_CONFIG.BASE_URL;
    const path = cleanUrl.startsWith("/") ? cleanUrl : `/${cleanUrl}`;
    return `${baseUrl}${path}`;
  };

  useEffect(() => {
    fetchKYCRequests();
    fetchPartnerKYCRequests();
  }, []);

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showDocumentModal) {
          setShowDocumentModal(false);
          setSelectedDocument(null);
        }
        if (showRejectModal) {
          setShowRejectModal(false);
          setRejectionReason("");
          setSelectedRequest(null);
        }
        if (showPartnerModal) {
          setShowPartnerModal(false);
          setPartners([]);
        }
        if (showBusinessInfoModal) {
          setShowBusinessInfoModal(false);
          setBusinessInfo([]);
        }
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showDocumentModal, showRejectModal, showPartnerModal]);

  // Derived Stats
  const stats = React.useMemo(() => {
    if (activeTab === "partners" || viewMode === "user_partners") {
      return {
        total: partnerRequests.length,
        pending: partnerRequests.filter((r) => r.status === "pending").length,
        approved: partnerRequests.filter((r) => r.status === "approved").length,
        rejected: partnerRequests.filter((r) => r.status === "rejected").length,
        partners: partnerRequests.length,
      };
    }
    if (viewMode === "user_business") {
      return {
        total: businessInfo.length,
        pending: businessInfo.filter(
          (r) => r.status === "pending" || r.overallStatus === "pending",
        ).length,
        approved: businessInfo.filter(
          (r) => r.status === "approved" || r.overallStatus === "approved",
        ).length,
        rejected: businessInfo.filter(
          (r) => r.status === "rejected" || r.overallStatus === "rejected",
        ).length,
        partners: partnerRequests.length,
      };
    }
    return {
      total: requests.length,
      pending: requests.filter((r) => r.overallStatus === "pending").length,
      approved: requests.filter((r) => r.overallStatus === "approved").length,
      rejected: requests.filter((r) => r.overallStatus === "rejected").length,
      partners: partnerRequests.length, // This might need adjustment if we want total partners here
    };
  }, [requests, partnerRequests, businessInfo, activeTab, viewMode]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (
      showDocumentModal ||
      showRejectModal ||
      showPartnerModal ||
      showBusinessInfoModal
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [
    showDocumentModal,
    showRejectModal,
    showPartnerModal,
    showBusinessInfoModal,
  ]);

  const fetchKYCRequests = async () => {
    setLoading(true);
    try {
      const response = await adminService.getPendingKYC();
      // console.log("KYC Response:", response);
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

  const fetchPartnerKYCRequests = async (userId?: string) => {
    setLoadingPartnerRequests(true);
    // console.log("Fetching partner requests for userId:", userId);
    try {
      const params: any = { limit: 100 };
      const idToFetch = userId || selectedUserForPartners?.id;
      if (idToFetch) {
        params.userId = idToFetch;
      }
      // console.log("API params:", params);
      const response = await adminService.getAllPartnerKYC(params);
      if (response.success && response.data) {
        setPartnerRequests(response.data.partners || []);
      }
    } catch (error) {
      console.error("Failed to fetch partner KYC requests", error);
      toast.error("Failed to fetch partner KYC requests");
    } finally {
      setLoadingPartnerRequests(false);
    }
  };

  const handleViewUserPartners = (userId: string, userName: string) => {
    // console.log("View Partners clicked:", { userId, userName });
    if (!userId) {
      console.error("No userId provided to handleViewUserPartners");
      toast.error("Cannot view partners: User ID missing");
      return;
    }
    setSelectedUserForPartners({ id: userId, name: userName });
    setViewMode("user_partners");
    // Clear current partner list and fetch specific user's partners
    setPartnerRequests([]);
    fetchPartnerKYCRequests(userId);
  };

  const handleBackToRequests = () => {
    setViewMode("list");
    setSelectedUserForPartners(null);
    setSelectedUserForBusiness(null);
    setPartnerRequests([]);
    setBusinessInfo([]);
    // Re-fetch all partners or reset to blank if we want lazy load
    // For now, let's just reset tab to Users or fetch all partners if that was the active tab
    if (activeTab === "partners") {
      fetchPartnerKYCRequests();
    }
  };

  const fetchPartners = async (userId: string) => {
    setLoadingPartners(true);
    try {
      const response = await adminService.getPartnersByUser(userId);
      if (response.success && response.data) {
        setPartners(response.data);
        setShowPartnerModal(true);
      } else {
        toast.error("Failed to fetch partners");
      }
    } catch (error) {
      console.error("Error fetching partners:", error);
      toast.error("Error fetching partners");
    } finally {
      setLoadingPartners(false);
    }
  };

  const fetchBusinessInfo = async (userId: string) => {
    setLoadingBusinessInfo(true);
    try {
      const response = await adminService.getBusinessInfoByUser(userId);
      if (response.success && response.data) {
        if (Array.isArray(response.data)) {
          setBusinessInfo(response.data);
        } else if (response.data) {
          setBusinessInfo([response.data]);
        } else {
          setBusinessInfo([]);
        }
      } else {
        // toast.error("Business info not found for this user");
        setBusinessInfo([]);
      }
    } catch (error) {
      console.error("Error fetching business info:", error);
      toast.error("Failed to fetch business info");
    } finally {
      setLoadingBusinessInfo(false);
    }
  };

  const handleViewBusinessInfo = (userId: string, userName: string) => {
    // console.log("View Business Info clicked:", { userId, userName });
    if (!userId) {
      console.error("No userId provided to handleViewBusinessInfo");
      return;
    }
    setSelectedUserForBusiness({ id: userId, name: userName });
    setViewMode("user_business");
    setBusinessInfo([]);
    fetchBusinessInfo(userId);
  };

  const handlePartnerAction = async (
    partnerId: string,
    action: "approve" | "reject",
    reason?: string,
  ) => {
    try {
      const response = await adminService.updatePartnerStatus(
        partnerId,
        action,
        reason,
      );
      if (response.success) {
        toast.success(`Partner ${action}d successfully`);
        // Refresh partners list
        if (selectedRequest?.user?._id) {
          fetchPartners(selectedRequest.user._id);
        }
        // Also refresh main list to update counts if needed
        fetchKYCRequests();
      } else {
        toast.error(response.message || `Failed to ${action} partner`);
      }
    } catch (error) {
      console.error(`Error ${action}ing partner:`, error);
      toast.error(`Failed to ${action} partner`);
    }
  };

  const handleApprove = async (request: KYCRequest) => {
    try {
      const response = await adminService.reviewKYC(request._id, "approve");
      if (response.success) {
        toast.success("KYC approved successfully");
        fetchKYCRequests();
      } else {
        toast.error(response.message || "Failed to approve KYC");
      }
    } catch (error) {
      console.error("Approve error:", error);
      toast.error("Failed to approve KYC");
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;

    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

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
        setSelectedRequest(null);
        fetchKYCRequests();
      } else {
        toast.error(response.message || "Failed to reject KYC");
      }
    } catch (error) {
      console.error("Failed to reject KYC", error);
      toast.error("Failed to reject KYC");
    }
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

  const openPersonalInfoModal = (partner: any) => {
    setSelectedPersonalInfo({
      ...partner,
      originalRequest: partner,
    });
    setShowPersonalInfoModal(true);
  };

  const filteredRequests = requests.filter(
    (request) =>
      request.user?.fullName
        ?.toLowerCase()
        .includes(userSearchTerm.toLowerCase()) ||
      request.user?.email?.toLowerCase().includes(userSearchTerm.toLowerCase()),
  );

  const filteredPartnerRequests = partnerRequests.filter(
    (request) =>
      request.fullName
        ?.toLowerCase()
        .includes(partnerSearchTerm.toLowerCase()) ||
      request.email?.toLowerCase().includes(partnerSearchTerm.toLowerCase()) ||
      request.phone?.toLowerCase().includes(partnerSearchTerm.toLowerCase()),
  );

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
    <DashboardLayout
      portalName="FlashSpace Admin"
      portalDescription="Complete platform management"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
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
            <p className="text-sm md:text-lg text-gray-500 mt-2 font-light">
              {viewMode === "user_partners"
                ? "Review partner applications for this user"
                : viewMode === "user_business"
                  ? "Review business info for this user"
                  : "Review and approve identity documents"}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {(viewMode === "user_partners" || viewMode === "user_business") && (
              <button
                onClick={handleBackToRequests}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors font-medium shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Requests
              </button>
            )}
            <div className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-xl border border-blue-200">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">
                {viewMode === "user_partners"
                  ? `${filteredPartnerRequests.length} Partners Found`
                  : viewMode === "user_business"
                    ? `${businessInfo.length} Business Profiles`
                    : activeTab === "users"
                      ? `${filteredRequests.length} User Found`
                      : `${filteredPartnerRequests.length} Pending Partners`}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white rounded-[24px] p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-yellow-600">
              {stats.pending}
            </h3>
            <p className="text-gray-500 font-medium mt-1 text-[10px] md:text-sm uppercase tracking-wider">
              Pending
            </p>
          </div>
          <div className="bg-white rounded-[24px] p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-green-600">
              {stats.approved}
            </h3>
            <p className="text-gray-500 font-medium mt-1 text-[10px] md:text-sm uppercase tracking-wider">Approved</p>
          </div>
          <div className="bg-white rounded-[24px] p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-red-600">
              {stats.rejected}
            </h3>
            <p className="text-gray-500 font-medium mt-1 text-[10px] md:text-sm uppercase tracking-wider">Rejected</p>
          </div>
          <div className="bg-white rounded-[24px] p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
              {stats.total}
            </h3>
            <p className="text-gray-500 font-medium mt-1 text-[10px] md:text-sm uppercase tracking-wider">
              Total
            </p>
          </div>
        </div>

        {viewMode === "user_partners" ? (
          /* Partner View Mode - Keep existing structure but maybe update container style if needed */
          <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center gap-4">
              <button
                onClick={handleBackToRequests}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Partner Profiles
                </h2>
                <p className="text-gray-500 text-sm">
                  Managing partners for{" "}
                  <span className="font-semibold text-gray-900">
                    {selectedUserForPartners?.name}
                  </span>
                </p>
              </div>
            </div>

            <div className="p-4 md:p-6">
              {/* ... Existing Partner Grid ... */}
              {loadingPartnerRequests ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading partner profiles...</p>
                </div>
              ) : partnerRequests.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">
                    No partners found for this user
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {partnerRequests.map((partner) => (
                    <div
                      key={partner._id}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-orange-600" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-gray-900 truncate">
                              {partner.fullName}
                            </h4>
                            <p className="text-sm text-gray-500 truncate">
                              {partner.email}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(partner.status)}
                      </div>

                      <div className="space-y-2 text-sm text-gray-600 mb-6">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            Phone:
                          </span>{" "}
                          {partner.phone}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            DOB:
                          </span>{" "}
                          {new Date(partner.dob).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            Gender:
                          </span>{" "}
                          <span className="capitalize">{partner.gender}</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-100">
                        <button
                          onClick={() =>
                            navigate(
                              `/admin/kyc-requests/${partner._id}?type=partner`,
                            )
                          }
                          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all text-sm font-semibold shadow-md hover:shadow-lg hover:scale-[1.02]"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : viewMode === "user_business" ? (
          /* Business View Mode */
          <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center gap-4">
              <button
                onClick={handleBackToRequests}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Business Profiles
                </h2>
                <p className="text-gray-500 text-sm">
                  Managing business profiles for{" "}
                  <span className="font-semibold text-gray-900">
                    {selectedUserForBusiness?.name}
                  </span>
                </p>
              </div>
            </div>

            <div className="p-4 md:p-6">
              {loadingBusinessInfo ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading business profiles...</p>
                </div>
              ) : businessInfo.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">
                    No business profiles found for this user
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {businessInfo.map((profile, index) => (
                    <div
                      key={profile._id || index}
                      className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
                    >
                      {/* Card Header */}
                      <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 line-clamp-1">
                              {profile.companyName || "N/A"}
                            </h4>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                              {profile.profileName || "Business Profile"}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(profile.status || "pending")}
                      </div>

                      {/* Card Body */}
                      <div className="p-5 space-y-4 flex-1">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2 border-b border-gray-50">
                            <span className="text-xs font-medium text-gray-500 uppercase">
                              GST Number
                            </span>
                            <span className="text-sm font-medium text-gray-900 font-mono">
                              {profile.gstNumber || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-50">
                            <span className="text-xs font-medium text-gray-500 uppercase">
                              PAN Number
                            </span>
                            <span className="text-sm font-medium text-gray-900 font-mono">
                              {profile.panNumber || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-50">
                            <span className="text-xs font-medium text-gray-500 uppercase">
                              CIN Number
                            </span>
                            <span className="text-sm font-medium text-gray-900 font-mono">
                              {profile.cinNumber || "N/A"}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-500 uppercase block mb-1">
                              Company Type
                            </span>
                            <span className="text-sm font-medium text-gray-900 font-mono">
                              {profile.companyType || "N/A"}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-500 uppercase block mb-1">
                              Registered Address
                            </span>
                            <span
                              className="text-sm text-gray-700 block line-clamp-2"
                              title={profile.registeredAddress}
                            >
                              {profile.registeredAddress || "N/A"}
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // console.log(
                              //   "Navigating to business detail:",
                              //   profile._id,
                              // );
                              navigate(
                                `/admin/kyc-requests/${profile._id}?type=businessinfo`,
                              );
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
                          >
                            View Details
                          </button>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="p-4 bg-gray-50 border-t border-gray-100 mt-auto flex justify-between items-center">
                        <div className="text-xs text-gray-400">
                          Updated:{" "}
                          {new Date(
                            profile.updatedAt || Date.now(),
                          ).toLocaleDateString()}
                        </div>
                        {/* Add ability to view documents or other actions here if needed */}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Main Tab View */
          <div className="space-y-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <div className="flex justify-center md:justify-end">
                <TabsList className="inline-flex w-full md:w-auto h-12 md:h-10 items-center justify-center rounded-xl bg-gray-100/50 p-1 text-gray-500 border border-gray-200 shadow-sm">
                  <TabsTrigger
                    value="users"
                    className="flex-1 md:flex-none inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-1.5 text-sm font-bold ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Client KYC
                  </TabsTrigger>
                  <TabsTrigger
                    value="partners"
                    className="flex-1 md:flex-none inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-1.5 text-sm font-bold ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md"
                  >
                    <Building2 className="w-4 h-4 mr-2" />
                    Partner KYC
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="users" className="space-y-6">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm shadow-sm"
                  />
                </div>

                {/* User KYC Requests Grid */}
                {loading ? (
                  <div className="p-12 text-center bg-white rounded-[24px] border border-gray-100">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading requests...</p>
                  </div>
                ) : filteredRequests.length === 0 ? (
                  <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-16 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      No Requests Found
                    </h3>
                    <p className="text-gray-500">
                      No KYC requests match your criteria.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredRequests.map((request) => (
                      <div
                        key={request._id}
                        className="bg-white rounded-[24px] border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group flex flex-col h-full"
                      >
                        {/* Card Content */}
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                          <div className="flex items-center justify-between mb-4 gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                                {request.user?.fullName?.charAt(0) || "U"}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-bold text-gray-900 truncate">
                                  {request.user?.fullName || "Unknown User"}
                                </h3>
                                <p className="text-sm text-gray-500 truncate">
                                  {request.user?.email || ""}
                                </p>
                                {request.profileName && (
                                  <p className="text-xs text-blue-600 font-medium truncate mt-0.5">
                                    {request.isPartner
                                      ? "≡ƒñ¥ Partner: "
                                      : request.kycType === "business"
                                        ? "≡ƒÅó "
                                        : ""}
                                    {request.profileName}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex-shrink-0 flex flex-col items-end gap-1">
                              {!(
                                request.overallStatus === "approved" &&
                                (request.partnerCount || 0) > 0
                              ) && getStatusBadge(request.overallStatus)}
                              {request.overallStatus === "approved" &&
                                (request.partnerCount || 0) > 0 && (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 uppercase">
                                    <AlertCircle className="w-3 h-3" />
                                    Partner KYC Pending
                                  </span>
                                )}
                              {request.overallStatus === "approved" &&
                                (request.businessInfoCount || 0) > 0 && (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 uppercase">
                                    <AlertCircle className="w-3 h-3" />
                                    Business Info Pending
                                  </span>
                                )}
                            </div>
                          </div>

                          {/* Progress Bar */}
                          {request.progress !== undefined && (
                            <div className="mt-4">
                              <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>Completion</span>
                                <span className="font-semibold">
                                  {request.progress}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${request.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Personal/Business Info */}
                        <div className="p-6 space-y-4 flex-grow">
                          {request.personalInfo && (
                            <div
                              className="bg-blue-50 rounded-xl p-4 cursor-pointer hover:bg-blue-100 transition-colors group/personal relative"
                              onClick={() =>
                                navigate(`/admin/kyc-requests/${request._id}`)
                              }
                            >
                              <div className="flex items-center gap-2 mb-3">
                                <User className="w-4 h-4 text-blue-600" />
                                <h4 className="text-sm font-semibold text-blue-900">
                                  Personal Info
                                </h4>
                                <ExternalLink className="w-3 h-3 text-blue-400 opacity-0 group-hover/personal:opacity-100 transition-opacity ml-auto absolute top-4 right-4" />
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
                              </div>
                            </div>
                          )}

                          {/* Partner Info Button - Show if Approved */}
                          {request.overallStatus === "approved" && (
                            <button
                              onClick={() =>
                                handleViewUserPartners(
                                  request.user._id || (request.user as any).id,
                                  request.user.fullName,
                                )
                              }
                              className="w-full bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl p-4 transition-colors text-left group/partner"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-orange-600" />
                                  <h4 className="text-sm font-semibold text-orange-900 group-hover/partner:text-orange-700">
                                    Partner Info
                                  </h4>
                                </div>
                                <ExternalLink className="w-4 h-4 text-orange-400 group-hover/partner:text-orange-600" />
                              </div>
                              <p className="text-xs text-orange-700">
                                {(request.partnerCount || 0) > 0
                                  ? `View details for ${request.partnerCount} linked partner${request.partnerCount !== 1 ? "s" : ""}`
                                  : "View partner details"}
                              </p>
                            </button>
                          )}

                          {/* Business Info Button - Only show if Approved */}
                          {request.overallStatus === "approved" && (
                            <button
                              onClick={() =>
                                handleViewBusinessInfo(
                                  request.user._id || (request.user as any).id,
                                  request.user.fullName,
                                )
                              }
                              className="w-full bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl p-4 transition-colors text-left group/business"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <Building2 className="w-4 h-4 text-purple-600" />
                                  <h4 className="text-sm font-semibold text-purple-900 group-hover/business:text-purple-700">
                                    Business Info
                                  </h4>
                                </div>
                                <ExternalLink className="w-4 h-4 text-purple-400 group-hover/business:text-purple-600" />
                              </div>
                              <div className="space-y-1 text-sm">
                                {request.businessInfo?.companyName && (
                                  <p className="text-purple-700">
                                    <span className="font-medium">
                                      Company:
                                    </span>{" "}
                                    {request.businessInfo.companyName}
                                  </p>
                                )}
                                {!request.businessInfo?.companyName && (
                                  <p className="text-xs text-purple-700">
                                    View detailed business information
                                  </p>
                                )}
                              </div>
                            </button>
                          )}

                          {/* Documents - Hide if Approved */}
                          {request.overallStatus !== "approved" && (
                            <div>
                              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                                Documents Submitted (
                                {request.documents?.length || 0})
                              </h4>
                              {request.documents &&
                              request.documents.length > 0 ? (
                                <div className="space-y-2">
                                  {request.documents.map((doc, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors group/doc"
                                    >
                                      <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <div className="p-1.5 bg-blue-100 rounded-lg">
                                          <FileText className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm text-gray-700 font-medium capitalize truncate">
                                            {doc.type}
                                          </p>
                                          <p className="text-xs text-gray-500 truncate">
                                            {doc.name}
                                          </p>
                                        </div>
                                      </div>
                                      <button
                                        onClick={() =>
                                          openDocumentModal(doc, request)
                                        }
                                        className="flex items-center gap-1 px-3 py-1.5 text-xs text-blue-600 hover:text-blue-700 font-semibold bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                      >
                                        <Eye className="w-3 h-3" />
                                        Details
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                                  <AlertCircle className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                                  <p className="text-sm font-medium text-orange-900">
                                    No documents uploaded yet
                                  </p>
                                  <p className="text-xs text-orange-600 mt-1">
                                    User needs to upload KYC documents
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Actions - Only show if NOT approved */}
                        {request.overallStatus !== "approved" && (
                          <div className="p-6 pt-0">
                            <div className="grid grid-cols-2 gap-3">
                              <button
                                onClick={() =>
                                  navigate(`/admin/kyc-requests/${request._id}`)
                                }
                                className="col-span-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </button>
                            </div>
                            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                              <Clock className="w-3 h-3" />
                              Submitted:{" "}
                              {new Date(request.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="partners" className="space-y-6">
                <SpacePartnerKycRequest />
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Document Details Modal */}
        {showDocumentModal && selectedDocument && selectedRequest && (
          <div
            className="fixed inset-0  flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowDocumentModal(false);
                setSelectedDocument(null);
              }
            }}
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[100vh] flex flex-col animate-in fade-in zoom-in duration-200">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white flex-shrink-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      Document Details
                    </h3>
                    <p className="text-sm text-gray-500">
                      Submitted by {selectedRequest.user?.fullName}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowDocumentModal(false);
                      setSelectedDocument(null);
                    }}
                    className="p-2 hover:bg-white rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="p-6 space-y-6 overflow-y-auto flex-1">
                {/* Document Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <File className="w-4 h-4 text-gray-600" />
                      <p className="text-xs font-semibold text-gray-500 uppercase">
                        Document Type
                      </p>
                    </div>
                    <p className="text-lg font-bold text-gray-900 capitalize">
                      {selectedDocument.type}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-gray-600" />
                      <p className="text-xs font-semibold text-gray-500 uppercase">
                        File Name
                      </p>
                    </div>
                    <p className="text-lg font-bold text-gray-900 truncate">
                      {selectedDocument.name}
                    </p>
                  </div>
                  {selectedDocument.uploadedAt && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <p className="text-xs font-semibold text-gray-500 uppercase">
                          Uploaded
                        </p>
                      </div>
                      <p className="text-lg font-bold text-gray-900">
                        {new Date(
                          selectedDocument.uploadedAt,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-gray-600" />
                      <p className="text-xs font-semibold text-gray-500 uppercase">
                        Status
                      </p>
                    </div>
                    {getStatusBadge(selectedDocument.status || "pending")}
                  </div>
                </div>

                {/* Document Preview */}
                {selectedDocument.fileUrl && (
                  <div className="bg-gray-50 rounded-xl p-6 relative">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold text-gray-700">
                        Document Preview
                      </h4>
                      <button
                        onClick={() => {
                          setShowDocumentModal(false);
                          setSelectedDocument(null);
                        }}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Close Preview"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    {isImageFile(selectedDocument.fileUrl) ? (
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <img
                          src={getFullUrl(selectedDocument.fileUrl)}
                          alt={selectedDocument.name}
                          className="max-w-full max-h-96 mx-auto rounded-lg shadow-md"
                          onError={(e) => {
                            console.error("Image load error:", e);
                            console.error(
                              "Image URL:",
                              selectedDocument.fileUrl,
                            );
                            console.error(
                              "Full URL:",
                              getFullUrl(selectedDocument.fileUrl),
                            );
                          }}
                        />
                      </div>
                    ) : isPDFFile(selectedDocument.fileUrl) ? (
                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <iframe
                          src={getFullUrl(selectedDocument.fileUrl)}
                          className="w-full h-96"
                          title={selectedDocument.name}
                        />
                      </div>
                    ) : isVideoFile(selectedDocument.fileUrl) ? (
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <video
                          key={getFullUrl(selectedDocument.fileUrl)}
                          src={getFullUrl(selectedDocument.fileUrl)}
                          controls
                          controlsList="nodownload"
                          className="max-w-full max-h-96 mx-auto rounded-lg shadow-md"
                          onLoadStart={() => {
                            /* console.log("Video loading started") */
                          }}
                          onLoadedMetadata={() => {
                            /* console.log("Video metadata loaded") */
                          }}
                          onCanPlay={() => {
                            /* console.log("Video can play") */
                          }}
                          onError={(e) => {
                            console.error("Video load error:", e);
                            console.error(
                              "Video URL:",
                              selectedDocument.fileUrl,
                            );
                            console.error(
                              "Full URL:",
                              getFullUrl(selectedDocument.fileUrl),
                            );
                          }}
                        >
                          Your browser does not support the video tag.
                        </video>
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
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          <Download className="w-4 h-4" />
                          Download File
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Rejection Reason */}
                {selectedDocument.rejectionReason && (
                  <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <p className="text-sm font-semibold text-red-900">
                        Rejection Reason
                      </p>
                    </div>
                    <p className="text-sm text-red-700">
                      {selectedDocument.rejectionReason}
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3 flex-shrink-0">
                {selectedDocument.fileUrl && (
                  <>
                    <a
                      href={getFullUrl(selectedDocument.fileUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors font-semibold"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open in New Tab
                    </a>
                    <a
                      href={getFullUrl(selectedDocument.fileUrl)}
                      download
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors font-semibold"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && selectedRequest && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowRejectModal(false);
                setRejectionReason("");
                setSelectedRequest(null);
              }
            }}
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Reject KYC
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedRequest.user?.fullName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason("");
                    setSelectedRequest(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Close"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a detailed reason for rejection..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason("");
                    setSelectedRequest(null);
                  }}
                  className="w-full sm:flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={!rejectionReason.trim()} // Assuming 'processing' state is not available here, keeping original logic for disabled
                  className="w-full sm:flex-1 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50 order-1 sm:order-2"
                >
                  Reject KYC
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Personal Info Modal */}
        {selectedPersonalInfo && (
          <div
            className="fixed inset-0 flex items-center justify-center z-40 p-4 backdrop-blur-sm bg-black/30"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedPersonalInfo(null);
              }
            }}
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full transform transition-all animate-in fade-in zoom-in duration-200">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal Information
                </h3>
                <button
                  onClick={() => {
                    setSelectedPersonalInfo(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-4">
                  <div className="group p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Full Name
                    </p>
                    <p className="text-gray-900 font-medium text-lg">
                      {selectedPersonalInfo.fullName || "N/A"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="group p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Email Address
                      </p>
                      <p className="text-gray-900 font-medium break-all md:break-words">
                        {selectedPersonalInfo.email || "N/A"}
                      </p>
                    </div>

                    <div className="group p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Phone Number
                      </p>
                      <p className="text-gray-900 font-medium">
                        {selectedPersonalInfo.phone || "N/A"}
                      </p>
                    </div>
                  </div>

                  {selectedPersonalInfo.dob && (
                    <div className="group p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Date of Birth
                      </p>
                      <p className="text-gray-900 font-medium">
                        {new Date(
                          selectedPersonalInfo.dob,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {selectedPersonalInfo.gender && (
                    <div className="group p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Gender
                      </p>
                      <p className="text-gray-900 font-medium capitalize">
                        {selectedPersonalInfo.gender}
                      </p>
                    </div>
                  )}

                  {/* ID Proof Section if needed in future */}
                  {selectedPersonalInfo.documents &&
                    selectedPersonalInfo.documents.length > 0 && (
                      <div className="pt-2">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                          Submitted Documents (
                          {selectedPersonalInfo.documents.length})
                        </p>
                        <div className="space-y-2">
                          {selectedPersonalInfo.documents.map(
                            (doc: any, idx: number) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors group/doc"
                              >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <div className="p-1.5 bg-blue-100 rounded-lg">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-700 font-medium capitalize truncate">
                                      {doc.type}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                      {doc.name}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => {
                                    // We need to pass the full request object to openDocumentModal.
                                    // Since we don't have the full request in selectedPersonalInfo,
                                    // we might need to adjust or just pass a mock request object if strictly needed for context,
                                    // OR better, we can just use the doc URL if openDocumentModal relies on it.
                                    // Looking at openDocumentModal: props are (doc, request).
                                    // Let's assume we can reuse openDocumentModal if we have access to it.
                                    // Issue: selectedPersonalInfo doesn't have the full 'request' object context easily unless we pass it.
                                    // Let's pass the 'request' context into selectedPersonalInfo or just use a dedicated state for the request relative to this modal.
                                    // Actually, openDocumentModal uses 'setSelectedDocument' and 'setSelectedRequest'.
                                    // We can just call it. But wait, we need the request object for 'selectedRequest' state?
                                    // Yes. So let's store the request in selectedPersonalInfo as well.

                                    // HOWEVER, for now, let's assuming passing the *request* object is not strictly possible here without refactoring 'openDocumentModal' or passing the whole request.
                                    // Easiest fix: Pass the 'request' object to selectedPersonalInfo as 'originalRequest'.
                                    if (selectedPersonalInfo.originalRequest) {
                                      openDocumentModal(
                                        doc,
                                        selectedPersonalInfo.originalRequest,
                                      );
                                    }
                                  }}
                                  className="flex items-center gap-1 px-3 py-1.5 text-xs text-blue-600 hover:text-blue-700 font-semibold bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                >
                                  <Eye className="w-3 h-3" />
                                  View
                                </button>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 flex justify-end bg-gray-50 rounded-b-2xl">
                <button
                  onClick={() => {
                    setShowPersonalInfoModal(false);
                    setSelectedPersonalInfo(null);
                  }}
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium shadow-sm transition-all hover:shadow"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
