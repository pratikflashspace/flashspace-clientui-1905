import React, { useEffect, useState } from "react";
import { getUploadedFileUrl } from "@/utils/fileUrl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  getAllSpacePartnerKyc,
  SpaceUserKycResponse,
} from "@/Api/spacePartnerKyc.service";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  User,
  List,
  CheckCircle2,
  XCircle,
  Clock,
  X,
  FileText,
  Eye,
  AlertCircle,
} from "lucide-react";
import {
  getPartnerPropertiesData,
  PropertyData,
} from "@/Api/spaceDetailsAdmin.service";
import { toast } from "sonner";
import {
  reviewSpaceUserKycDocument,
  reviewSpaceUserKycOverall,
  KycDecisionStatus,
  SpaceUserKycDocumentType,
} from "@/Api/spacePartnerKycAdmin.service";

interface SpacePartnerKycRequestProps {
  onDataLoaded?: (list: SpaceUserKycResponse[]) => void;
}

export default function SpacePartnerKycRequest({
  onDataLoaded,
}: SpacePartnerKycRequestProps) {
  const [kycList, setKycList] = useState<SpaceUserKycResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [selectedKyc, setSelectedKyc] = useState<SpaceUserKycResponse | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);
  const [propertyMap, setPropertyMap] = useState<
    Record<string, PropertyData[]>
  >({});
  const navigate = useNavigate();

  const fetchKycList = () => {
    setLoading(true);
    getAllSpacePartnerKyc()
      .then(async (data) => {
        setKycList(data);
        if (onDataLoaded) {
          onDataLoaded(data);
        }
        setError(null);

        // Fetch properties for each KYC request to check for pending property KYC
        const map: Record<string, PropertyData[]> = {};
        for (const kyc of data) {
          try {
            const props = await getPartnerPropertiesData(kyc._id);
            map[kyc._id] = props;
          } catch (err) {
            console.error(
              `Failed to fetch properties for KYC ${kyc._id}:`,
              err,
            );
          }
        }
        setPropertyMap(map);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch KYC requests");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchKycList();
  }, []);

  const openDocumentModal = (doc: any, kyc: SpaceUserKycResponse) => {
    setSelectedDocument(doc);
    setSelectedKyc(kyc);
    setShowDocumentModal(true);
  };

  const handleDocumentReview = async (action: "approve" | "reject") => {
    if (!selectedDocument || !selectedKyc) return;

    setSubmitting(true);
    try {
      const status: KycDecisionStatus =
        action === "approve" ? "approved" : "rejected";

      const response = await reviewSpaceUserKycDocument(
        selectedKyc.userId,
        selectedDocument.type as SpaceUserKycDocumentType,
        status,
        action === "reject" ? "Document invalid or unclear" : undefined,
      );

      if (response) {
        toast.success(`Document ${status} successfully`);
        setShowDocumentModal(false);
        fetchKycList();
      }
    } catch (error) {
      toast.error("Failed to review document");
    } finally {
      setSubmitting(false);
    }
  };

  const hasPendingPropertyDoc = (kycId: string) => {
    const props = propertyMap[kycId];
    if (!props) return false;
    return props.some((p) => p.kycStatus === "pending");
  };

  const getStatusBadge = (status?: string) => {
    switch (status?.toLowerCase()) {
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
      case "resubmit":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 uppercase">
            <Clock className="w-3 h-3" /> Resubmit
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 uppercase">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
    }
  };

  const getFullUrl = (url?: string) => {
    if (!url) return "";
    
    let cleanUrl = url;
    if (cleanUrl.includes("localhost:5000")) {
      cleanUrl = cleanUrl.replace(/https?:\/\/localhost:5000(\/api)?/, "");
    }

    return getUploadedFileUrl(cleanUrl);
  };

  const isImageFile = (url?: string) =>
    /\.(jpg|jpeg|png|webp|gif)$/i.test(url || "");
  const isPDFFile = (url?: string) => /\.pdf$/i.test(url || "");

  if (loading && kycList.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  if (kycList.length === 0) {
    return (
      <div className="p-8 text-center text-gray-600">
        No space partner KYC requests found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {kycList.map((kyc) => (
        <div
          key={kyc._id}
          className="bg-white rounded-2xl border border-border shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
        >
          <div className="p-6 border-b border-border bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between mb-4 gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Avatar className="flex-shrink-0 w-12 h-12 ring-2 ring-background shadow-md border border-border">
                  {kyc.profilePicture && (
                    <AvatarImage src={getUploadedFileUrl(kyc.profilePicture)} alt={kyc.fullName} className="object-cover" />
                  )}
                  <AvatarFallback className="bg-[#35503f] text-white font-bold text-lg">
                    {kyc.fullName?.charAt(0) || "P"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h3 className="font-bold text-foreground truncate">
                    {kyc.fullName}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">{kyc.email}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {getStatusBadge(kyc.overallStatus)}
                {hasPendingPropertyDoc(kyc._id) && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500 text-white uppercase animate-pulse shadow-sm shadow-orange-200">
                    <AlertCircle className="w-3 h-3" /> Review Property
                  </span>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <span className="font-semibold text-gray-800">Phone:</span>
              {kyc.phoneNumber}
            </div>
          </div>

          <div className="p-6 space-y-4 flex-1">
            <button
              onClick={() => navigate(`/admin/kyc-partners/${kyc._id}`)}
              className="w-full bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-xl p-4 transition-colors text-left"
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-semibold text-primary">
                  Partner Identity
                </h4>
                <User className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xs text-primary/70">
                Review identity documents & personal info
              </p>
            </button>

            {kyc.overallStatus === "approved" && (
              <button
                onClick={() =>
                  navigate(
                    `/admin/space-details/${kyc.userId}?partnerId=${kyc.userId}`,
                  )
                }
                className="w-full bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl p-4 transition-colors text-left"
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-semibold text-purple-900">
                    Space Details
                  </h4>
                  <Building2 className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-xs text-purple-700">
                  Review space profiles & property info
                </p>
              </button>
            )}

            {kyc.overallStatus !== "approved" && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Submitted Documents
                </h4>
                <div className="space-y-1">
                  {[
                    {
                      id: "aadhaar",
                      label: "Aadhaar",
                      url: kyc.aadhaarImageUrl,
                      status: kyc.aadhaarImageStatus,
                      type: "aadhaar_image",
                    },
                    {
                      id: "pan",
                      label: "PAN",
                      url: kyc.panImageUrl,
                      status: kyc.panImageStatus,
                      type: "pan_image",
                    },
                    {
                      id: "video",
                      label: "Video KYC",
                      url: kyc.videoKycUrl,
                      status: kyc.videoKycStatus,
                      type: "video_kyc",
                    },
                  ]
                    .filter((d) => d.url)
                    .map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-2 bg-muted/30 rounded-lg text-sm"
                      >
                        <span className="capitalize">{doc.label}</span>
                        <button
                          onClick={() =>
                            openDocumentModal({ ...doc, fileUrl: doc.url }, kyc)
                          }
                          className="text-primary hover:underline font-medium"
                        >
                          Verify
                        </button>
                      </div>
                    ))}
                  {!kyc.aadhaarImageUrl &&
                    !kyc.panImageUrl &&
                    !kyc.videoKycUrl && (
                      <div className="p-2 text-xs text-muted-foreground italic">
                        No documents uploaded yet
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>

          <div className="p-6 pt-0 mt-auto">
            {kyc.overallStatus !== "approved" && (
              <button
                onClick={() => navigate(`/admin/kyc-partners/${kyc._id}`)}
                className="w-full py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-semibold shadow-md"
              >
                Complete Review
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Document Modal */}
      {showDocumentModal && selectedDocument && selectedKyc && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={(e) =>
            e.target === e.currentTarget && setShowDocumentModal(false)
          }
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-muted/30">
              <h3 className="text-xl font-bold">Document Verification</h3>
              <button onClick={() => setShowDocumentModal(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 bg-white">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="p-4 bg-muted/30 rounded-xl">
                  <p className="text-xs font-bold text-muted-foreground/70 uppercase mb-1">
                    Type
                  </p>
                  <p className="text-lg font-bold capitalize">
                    {selectedDocument.label}
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl">
                  <p className="text-xs font-bold text-muted-foreground/70 uppercase mb-1">
                    Status
                  </p>
                  {getStatusBadge(selectedDocument.status || "pending")}
                </div>
              </div>
              <div className="aspect-video bg-muted/50 rounded-xl overflow-hidden flex items-center justify-center">
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
                    <p className="text-muted-foreground">Preview not available</p>
                    <a
                      href={getFullUrl(selectedDocument.fileUrl)}
                      target="_blank"
                      className="text-primary underline font-bold"
                      rel="noreferrer"
                    >
                      Download File
                    </a>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 bg-muted/30 border-t flex gap-4">
              <button
                onClick={() => handleDocumentReview("approve")}
                disabled={submitting}
                className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 shadow-md disabled:opacity-50"
              >
                Approve Document
              </button>
              <button
                onClick={() => handleDocumentReview("reject")}
                disabled={submitting}
                className="flex-1 py-3 border-2 border-red-100 text-red-600 rounded-xl font-bold hover:bg-red-50 disabled:opacity-50"
              >
                Reject Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
