import React, { useEffect, useState } from 'react';
import { getAllSpacePartnerKyc, SpaceUserKycResponse } from '@/Api/spacePartnerKyc.service';
import SpacePartnerKycRequest from './SpacePartnerKycRequest';
import { useNavigate } from 'react-router-dom';
import { adminService } from '@/services/admin.service';
import { Search, Check, X, FileText, Handshake  ,AlertCircle, User, Building2, Eye, Download, Clock, CheckCircle2, XCircle, ExternalLink, Calendar, File } from 'lucide-react';
import { toast } from "sonner";
import { API_CONFIG } from '@/config/api.config';
import type { KYCDocument, KYCRequest } from '@/types/adminKyc';

import { useNavigate } from "react-router-dom";

export default function KYCRequests() {
    const navigate = useNavigate();
    const [requests, setRequests] = useState<KYCRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequest, setSelectedRequest] = useState<KYCRequest | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showDocumentModal, setShowDocumentModal] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<KYCDocument | null>(null);
    const [requestSourceFilter, setRequestSourceFilter] = useState<'all' | 'user' | 'partner'>('all');
    const [partnerRequests, setPartnerRequests] = useState<SpaceUserKycResponse[]>([]);
    const [partnerLoading, setPartnerLoading] = useState(false);

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

    // Fetch partner KYC requests when filter is partner
    useEffect(() => {
        if (requestSourceFilter === 'partner') {
            setPartnerLoading(true);
            getAllSpacePartnerKyc()
                .then((data) => setPartnerRequests(data))
                .catch(() => setPartnerRequests([]))
                .finally(() => setPartnerLoading(false));
        }
    }, [requestSourceFilter]);

    // Close modal on ESC key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (showDocumentModal) {
                    setShowDocumentModal(false);
                    setSelectedDocument(null);
                }
                if (showRejectModal) {
                    setShowRejectModal(false);
                    setRejectionReason('');
                    setSelectedRequest(null);
                }
            }
        };

  // Business Info Modal State
  const [showBusinessInfoModal, setShowBusinessInfoModal] = useState(false);
  const [businessInfo, setBusinessInfo] = useState<any[]>([]); // Changed to array
  const [loadingBusinessInfo, setLoadingBusinessInfo] = useState(false);

  // Helper to construct full URL from relative path
  const getFullUrl = (url?: string): string => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    const baseUrl = API_CONFIG.BASE_URL.endsWith("/")
      ? API_CONFIG.BASE_URL.slice(0, -1)
      : API_CONFIG.BASE_URL;
    const path = url.startsWith("/") ? url : `/${url}`;
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

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showDocumentModal, showRejectModal]);

    const fetchKYCRequests = async () => {
        setLoading(true);
        try {
            // includeApproved=true so approved KYCs remain visible in the list
            const response = await adminService.getPendingKYC(true);
            console.log('KYC Response:', response);
            if (response.success && response.data) {
                console.log('KYC Data:', response.data);
                console.log('First request documents:', response.data[0]?.documents);
                setRequests(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch KYC requests', error);
            toast.error('Failed to fetch KYC requests');
        } finally {
            setLoading(false);
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

    const openDocumentModal = (doc: KYCDocument, request: KYCRequest) => {
        setSelectedDocument(doc);
        setSelectedRequest(request);
        setShowDocumentModal(true);
    };

    const handleDocumentReview = async (
        action: 'approve' | 'reject',
        doc?: KYCDocument | null,
        req?: KYCRequest | null
    ) => {
        const targetDoc = doc || selectedDocument;
        const targetReq = req || selectedRequest;

        if (!targetDoc || !targetReq || !targetDoc._id) return;

        let reason: string | undefined;
        if (action === 'reject') {
            const input = window.prompt('Enter rejection reason for this document (optional)') || '';
            reason = input.trim() || undefined;
        }

        try {
            const res = await adminService.reviewKYCDocument(targetReq._id, targetDoc._id, action, reason);
            if (res.success) {
                toast.success(`Document ${action}ed successfully`);
                setShowDocumentModal(false);
                setSelectedDocument(null);
                setSelectedRequest(null);
                fetchKYCRequests();
            } else {
                toast.error(res.message || `Failed to ${action} document`);
            }
        } catch (error) {
            console.error(`Failed to ${action} document`, error);
            toast.error(`Failed to ${action} document`);
        }
    };

   const openPartnerDetails = async (request: KYCRequest) => {
  try {
    const res = await adminService.getPartnerKYCList({
      profileId: request._id,
    });

    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      // Go to partner list page instead of single partner
      navigate(`/admin/kyc/${request._id}/partners`, {
        state: { partners: res.data },
      });
    } else {
      toast.error("No partner KYC snapshot found for this profile yet");
    }
  } catch (error) {
    console.error("Failed to open partner KYC details", error);
    toast.error("Failed to open partner KYC details");
  }
};
    const filteredRequests = requests
        .filter(request =>
            request.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter(request => {
            if (requestSourceFilter === 'all') return true;
            if (requestSourceFilter === 'partner') return !!request.isPartner;
            // 'user' filter: treat undefined isPartner as user request
            return !request.isPartner;
        });

    // Calculate pending count based on filter
    let pendingCount = 0;
    if (requestSourceFilter === 'partner') {
        pendingCount = partnerRequests.filter(
            req => req.overallStatus === 'pending' || req.overallStatus === 'resubmit'
        ).length;
    } else {
        pendingCount = filteredRequests.filter(request =>
            request.overallStatus === 'pending' || request.overallStatus === 'resubmit'
        ).length;
    }

    const getStatusBadge = (status: string) => {
        const config: Record<string, { bg: string; text: string; icon: any }> = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
            approved: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle2 },
            rejected: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
            resubmit: { bg: 'bg-orange-100', text: 'text-orange-700', icon: AlertCircle },
        };

        const { bg, text, icon: Icon } = config[status] || config.pending;
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${bg} ${text} uppercase`}>
                <Icon className="w-3 h-3" />
                {status}
            </span>
        );
    };

    const getFileExtension = (url?: string) => {
        if (!url) return 'file';
        const ext = url.split('.').pop()?.toLowerCase();
        return ext || 'file';
    };

    const isImageFile = (url?: string) => {
        const ext = getFileExtension(url);
        return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);
    };

    const isPDFFile = (url?: string) => {
        return getFileExtension(url) === 'pdf';
    };

    const isVideoFile = (url?: string) => {
        const ext = getFileExtension(url);
        return ['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(ext);
    };

    if (loading || (requestSourceFilter === 'partner' && partnerLoading)) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
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
      console.log("KYC Response:", response);
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
    console.log("Fetching partner requests for userId:", userId);
    try {
      const params: any = { limit: 100 };
      const idToFetch = userId || selectedUserForPartners?.id;
      if (idToFetch) {
        params.userId = idToFetch;
      }
      console.log("API params:", params);
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
    console.log("View Partners clicked:", { userId, userName });
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
    console.log("View Business Info clicked:", { userId, userName });
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