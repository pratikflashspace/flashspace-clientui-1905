import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAllSpacePartnerKyc, SpaceUserKycResponse } from "@/Api/spacePartnerKyc.service";
import { reviewSpaceUserKycDocument, reviewSpaceUserKycOverall, KycDecisionStatus, SpaceUserKycDocumentType } from "@/Api/spacePartnerKycAdmin.service";
import { toast } from "sonner";
import { ArrowLeft, FileText, CheckCircle2, XCircle, AlertCircle, Clock, Calendar, File as FileIcon, Eye, ExternalLink, Download, X, User } from "lucide-react";

const getStatusBadge = (status?: string) => {
    const config: Record<string, { bg: string; text: string; icon: React.ComponentType<{ className?: string }> }> = {
        pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock },
        approved: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2 },
        rejected: { bg: "bg-red-100", text: "text-red-700", icon: XCircle },
        resubmit: { bg: "bg-orange-100", text: "text-orange-700", icon: AlertCircle },
    };
    const { bg, text, icon: Icon } = config[status || "pending"] || config.pending;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${bg} ${text} uppercase`}>
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
const isPDFFile = (url?: string) => getFileExtension(url) === "pdf";
const isVideoFile = (url?: string) => {
    const ext = getFileExtension(url);
    return ["mp4", "webm", "mov", "avi", "mkv"].includes(ext);
};

// Set your backend API base URL here
const API_BASE_URL = "http://localhost:5000"; // Change this if your backend runs elsewhere
const getFullUrl = (url?: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    // Prepend API base URL for relative paths (e.g., /uploads/...)
    return `${API_BASE_URL}${url}`;
};

export default function SpacePartnerKycDetails() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [request, setRequest] = useState<SpaceUserKycResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
    const [docAction, setDocAction] = useState<{ type: SpaceUserKycDocumentType; action: KycDecisionStatus } | null>(null);
    const [docRejectReason, setDocRejectReason] = useState("");
    const [overallAction, setOverallAction] = useState<KycDecisionStatus | null>(null);
    const [overallRejectReason, setOverallRejectReason] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const fetchKyc = React.useCallback(async () => {
        setLoading(true);
        const list = await getAllSpacePartnerKyc();
        const found = list.find((k) => k._id === id);
        setRequest(found || null);
        setLoading(false);
    }, [id]);
    useEffect(() => {
        if (!id) return;
        fetchKyc();
    }, [id, fetchKyc]);

    // Document Accept/Reject handlers
    const handleDocAction = async (type: SpaceUserKycDocumentType, action: KycDecisionStatus, rejectMessage?: string) => {
        if (!request || !request.userId) {
            toast.error('User ID missing for this KYC request.');
            return;
        }
        if (!['pending', 'approved', 'rejected'].includes(action)) {
            toast.error('Invalid status for document action.');
            return;
        }
        setSubmitting(true);
        try {
            await reviewSpaceUserKycDocument(request.userId, type, action, rejectMessage);
            toast.success(`Document ${action === 'approved' ? 'approved' : 'rejected'} successfully`);
            setDocAction(null);
            setDocRejectReason("");
            fetchKyc();
        } catch (e: any) {
            toast.error(e?.response?.data?.message || e?.message || 'Failed to update document status');
        } finally {
            setSubmitting(false);
        }
    };

    // Overall Accept/Reject handlers
    const handleOverallAction = async (action: KycDecisionStatus, rejectMessage?: string) => {
        if (!request || !request.userId) {
            toast.error('User ID missing for this KYC request.');
            return;
        }
        if (!['pending', 'approved', 'rejected'].includes(action)) {
            toast.error('Invalid status for overall KYC action.');
            return;
        }
        setSubmitting(true);
        try {
            await reviewSpaceUserKycOverall(request.userId, action, rejectMessage);
            toast.success(`KYC ${action === 'approved' ? 'approved' : 'rejected'} successfully`);
            setOverallAction(null);
            setOverallRejectReason("");
            fetchKyc();
        } catch (e: any) {
            toast.error(e?.response?.data?.message || e?.message || 'Failed to update KYC status');
        } finally {
            setSubmitting(false);
        }
    };

    const allDocsApproved = useMemo(() => {
        if (!request) return false;
        // If videoKycStatus is not required, only check aadhaar and pan
        if (request.videoKycUrl === undefined || request.videoKycUrl === null || request.videoKycUrl === "") {
            return [request.aadhaarImageStatus, request.panImageStatus].every((s) => s === "approved");
        }
        // If videoKycUrl exists, require all three to be approved
        return [request.aadhaarImageStatus, request.panImageStatus, request.videoKycStatus].every((s) => s === "approved");
    }, [request]);

    if (loading || !request) {
        return (
            <div className="space-y-6 animate-in fade-in duration-300">
                <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">
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
                    <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 mb-3 shadow-sm backdrop-blur">
                        <ArrowLeft className="w-3 h-3" />
                        Back
                    </button>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight font-[Poppins] bg-gradient-to-r from-blue-600 via-teal-500 to-purple-500 bg-clip-text text-transparent">KYC Profile</h1>
                    <p className="text-gray-500 mt-1 text-base font-light">Review all details, documents, and take an approval decision.</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                        {getStatusBadge(request.overallStatus)}
                        <span className="text-xs text-gray-500">Progress: {allDocsApproved ? "100" : "80"}%</span>
                    </div>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Submitted: {request.createdAt ? new Date(request.createdAt).toLocaleString() : "-"}
                    </p>
                </div>
            </div>

            {/* Main layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                {/* Left: partner info */}
                <div className="space-y-4 xl:col-span-1">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                                {request.fullName?.charAt(0) || "U"}
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-0.5">Main Account Holder</p>
                                <p className="font-semibold text-gray-900">{request.fullName}</p>
                                <p className="text-xs text-gray-500">{request.email}</p>
                            </div>
                        </div>
                        <div className="mt-2 space-y-1 text-xs text-gray-600">
                            <p><span className="font-semibold">Phone:</span> {request.phoneNumber}</p>
                            <p><span className="font-semibold">PAN:</span> {request.panNumber}</p>
                            <p><span className="font-semibold">Aadhaar:</span> {request.aadhaarNumber}</p>
                            <p><span className="font-semibold">Company Name:</span> {request.companyName}</p>
                            <p><span className="font-semibold">Company Type:</span> {request.companyType}</p>
                            <p><span className="font-semibold">CIN Number:</span> {request.cinRegistrationNumber}</p>
                            <p><span className="font-semibold">GST Number:</span> {request.gstNumber}</p>
                            <p><span className="font-semibold">Registered Address:</span> {request.registeredAddress}</p>
                        </div>
                        {/* Final Accept/Reject Buttons */}
                        <div className="flex flex-col gap-2 mt-6">
                            <div className="flex gap-3">
                                <button
                                    className="flex-1 py-3 px-4 rounded-xl bg-green-500/60 text-white hover:bg-green-700 transition-colors font-semibold disabled:opacity-60"
                                    disabled={!allDocsApproved || submitting || request.overallStatus === 'approved'}
                                    onClick={() => handleOverallAction('approved')}
                                >
                                    Approve KYC
                                </button>
                                <button
                                    className="flex-1 py-3 px-4 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors font-semibold disabled:opacity-60"
                                    disabled={submitting || request.overallStatus === 'rejected'}
                                    onClick={() => setOverallAction('rejected')}
                                >
                                    Reject KYC
                                </button>
                            </div>
                            <button
                                className="w-full py-2 px-4 rounded-xl bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors font-semibold text-xs mt-2"
                                onClick={() => request._id && navigate(`/admin/space-details/${request._id}`)}
                            >
                                View Space Information
                            </button>
                        </div>
                        {/* Modal for overall reject reason */}
                        {overallAction === 'rejected' && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                                <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
                                    <h3 className="font-bold text-lg mb-2 text-red-600">Reject KYC</h3>
                                    <p className="text-sm text-gray-600 mb-3">Please provide a reason for rejection:</p>
                                    <textarea
                                        className="w-full border border-gray-300 rounded-lg p-2 mb-3 text-sm"
                                        rows={3}
                                        value={overallRejectReason}
                                        onChange={e => setOverallRejectReason(e.target.value)}
                                        placeholder="Enter rejection reason..."
                                    />
                                    <div className="flex gap-2 justify-end">
                                        <button
                                            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                                            onClick={() => { setOverallAction(null); setOverallRejectReason(""); }}
                                            disabled={submitting}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold"
                                            onClick={() => handleOverallAction('rejected', overallRejectReason)}
                                            disabled={submitting || !overallRejectReason.trim()}
                                        >
                                            Confirm Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {/* Right: documents list & preview */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="rounded-3xl border border-gray-100 shadow-xl bg-white/80 backdrop-blur-lg p-7">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><FileText className="w-5 h-5 text-blue-500" /> Submitted Documents</h2>
                                <p className="text-xs text-gray-500 mt-1">All documents uploaded for this partner.</p>
                            </div>
                            <span className="text-xs text-gray-500 font-semibold">Total: 3</span>
                        </div>
                        <div className="space-y-3">
                            {request.videoKycUrl && (
                                <div className="flex items-center justify-between p-4 bg-gradient-to-br from-blue-50/80 to-white rounded-2xl border border-blue-100 shadow group hover:shadow-lg transition-all">
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className="p-2 bg-blue-200/40 rounded-xl"><FileText className="w-5 h-5 text-blue-600" /></div>
                                        <div className="min-w-0">
                                            <p className="text-base font-semibold text-gray-900 capitalize truncate">Video KYC</p>
                                            <p className="text-xs text-gray-500 truncate">{request.videoKycUrl.split("/").pop()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-0.5 text-xs rounded-full font-bold capitalize border ${request.videoKycStatus === 'approved' ? 'bg-green-50 text-green-700 border-green-200' : request.videoKycStatus === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>{request.videoKycStatus}</span>
                                        <button onClick={() => setSelectedDocument("videoKycUrl")} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-blue-600 hover:text-blue-700 font-semibold bg-blue-50 hover:bg-blue-100 rounded-lg shadow-sm"><Eye className="w-3 h-3" />View</button>
                                        {request.videoKycStatus === 'pending' && (
                                            <>
                                                <button disabled={submitting} onClick={() => handleDocAction('video_kyc', 'approved')} className="ml-2 px-3 py-1 text-xs rounded-lg bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold shadow hover:scale-105 transition-transform">Accept</button>
                                                <button disabled={submitting} onClick={() => setDocAction({ type: 'video_kyc', action: 'rejected' })} className="ml-1 px-3 py-1 text-xs rounded-lg bg-gradient-to-r from-red-400 to-pink-500 text-white font-bold shadow hover:scale-105 transition-transform">Reject</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                            {request.panImageUrl && (
                                <div className="flex items-center justify-between p-4 bg-gradient-to-br from-blue-50/80 to-white rounded-2xl border border-blue-100 shadow group hover:shadow-lg transition-all">
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className="p-2 bg-blue-200/40 rounded-xl"><FileText className="w-5 h-5 text-blue-600" /></div>
                                        <div className="min-w-0">
                                            <p className="text-base font-semibold text-gray-900 capitalize truncate">PAN Card</p>
                                            <p className="text-xs text-gray-500 truncate">{request.panImageUrl.split("/").pop()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-0.5 text-xs rounded-full font-bold capitalize border ${request.panImageStatus === 'approved' ? 'bg-green-50 text-green-700 border-green-200' : request.panImageStatus === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>{request.panImageStatus}</span>
                                        <button onClick={() => setSelectedDocument("panImageUrl")} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-blue-600 hover:text-blue-700 font-semibold bg-blue-50 hover:bg-blue-100 rounded-lg shadow-sm"><Eye className="w-3 h-3" />View</button>
                                        {request.panImageStatus === 'pending' && (
                                            <>
                                                <button disabled={submitting} onClick={() => handleDocAction('pan_image', 'approved')} className="ml-2 px-3 py-1 text-xs rounded-lg bg-green-500/60 text-white font-bold shadow hover:scale-105 transition-transform">Accept</button>
                                                <button disabled={submitting} onClick={() => setDocAction({ type: 'pan_image', action: 'rejected' })} className="ml-1 px-3 py-1 text-xs rounded-lg bg-gradient-to-r from-red-400 to-pink-500 text-white font-bold shadow hover:scale-105 transition-transform">Reject</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                            {request.aadhaarImageUrl && (
                                <div className="flex items-center justify-between p-4 bg-gradient-to-br from-blue-50/80 to-white rounded-2xl border border-blue-100 shadow group hover:shadow-lg transition-all">
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className="p-2 bg-blue-200/40 rounded-xl"><FileText className="w-5 h-5 text-blue-600" /></div>
                                        <div className="min-w-0">
                                            <p className="text-base font-semibold text-gray-900 capitalize truncate">Aadhaar</p>
                                            <p className="text-xs text-gray-500 truncate">{request.aadhaarImageUrl.split("/").pop()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-0.5 text-xs rounded-full font-bold capitalize border ${request.aadhaarImageStatus === 'approved' ? 'bg-green-50 text-green-700 border-green-200' : request.aadhaarImageStatus === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>{request.aadhaarImageStatus}</span>
                                        <button onClick={() => setSelectedDocument("aadhaarImageUrl")} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-blue-600 hover:text-blue-700 font-semibold bg-blue-50 hover:bg-blue-100 rounded-lg shadow-sm"><Eye className="w-3 h-3" />View</button>
                                        {request.aadhaarImageStatus === 'pending' && (
                                            <>
                                                <button disabled={submitting} onClick={() => handleDocAction('aadhaar_image', 'approved')} className="ml-2 px-3 py-1 text-xs rounded-lg bg-green-500/60 text-white font-bold shadow hover:scale-105 transition-transform">Accept</button>
                                                <button disabled={submitting} onClick={() => setDocAction({ type: 'aadhaar_image', action: 'rejected' })} className="ml-1 px-3 py-1 text-xs rounded-lg bg-gradient-to-r from-red-400 to-pink-500 text-white font-bold shadow hover:scale-105 transition-transform">Reject</button>
                                            </>
                                        )}
                                    </div>
                                            {/* Document Reject Modal */}
                                            {docAction && docAction.action === 'rejected' && (
                                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                                                    <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
                                                        <h3 className="font-bold text-lg mb-2 text-red-700">Reject Document</h3>
                                                        <p className="text-sm mb-2">Please provide a reason for rejection:</p>
                                                        <textarea
                                                            className="w-full border rounded p-2 mb-3 text-sm"
                                                            rows={3}
                                                            value={docRejectReason}
                                                            onChange={e => setDocRejectReason(e.target.value)}
                                                            disabled={submitting}
                                                        />
                                                        <div className="flex gap-2 justify-end">
                                                            <button className="px-4 py-2 rounded bg-gray-100 text-gray-700" onClick={() => setDocAction(null)} disabled={submitting}>Cancel</button>
                                                            <button
                                                                className="px-4 py-2 rounded bg-red-600 text-white font-semibold disabled:opacity-60"
                                                                disabled={submitting || !docRejectReason.trim()}
                                                                onClick={() => handleDocAction(docAction.type, 'rejected', docRejectReason)}
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {/* Final Decision Section */}
                                            {/* Final Decision section removed as buttons are now above */}

                                            {/* Overall Reject Modal */}
                                            {overallAction === 'rejected' && (
                                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                                                    <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
                                                        <h3 className="font-bold text-lg mb-2 text-red-700">Reject KYC</h3>
                                                        <p className="text-sm mb-2">Please provide a reason for rejection:</p>
                                                        <textarea
                                                            className="w-full border rounded p-2 mb-3 text-sm"
                                                            rows={3}
                                                            value={overallRejectReason}
                                                            onChange={e => setOverallRejectReason(e.target.value)}
                                                            disabled={submitting}
                                                        />
                                                        <div className="flex gap-2 justify-end">
                                                            <button className="px-4 py-2 rounded bg-gray-100 text-gray-700" onClick={() => setOverallAction(null)} disabled={submitting}>Cancel</button>
                                                            <button
                                                                className="px-4 py-2 rounded bg-red-600 text-white font-semibold disabled:opacity-60"
                                                                disabled={submitting || !overallRejectReason.trim()}
                                                                onClick={() => handleOverallAction('rejected', overallRejectReason)}
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Overall Approve Action */}
                                            {overallAction === 'approved' && (
                                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                                                    <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
                                                        <h3 className="font-bold text-lg mb-2 text-green-700">Approve KYC</h3>
                                                        <p className="text-sm mb-4">Are you sure you want to approve this KYC?</p>
                                                        <div className="flex gap-2 justify-end">
                                                            <button className="px-4 py-2 rounded bg-gray-100 text-gray-700" onClick={() => setOverallAction(null)} disabled={submitting}>Cancel</button>
                                                            <button
                                                                className="px-4 py-2 rounded bg-green-600 text-white font-semibold disabled:opacity-60"
                                                                disabled={submitting}
                                                                onClick={() => handleOverallAction('approved')}
                                                            >
                                                                Approve
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Selected document preview */}
                    {selectedDocument && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1 mb-1"><FileIcon className="w-3 h-3" />Selected Document</p>
                                    <p className="text-lg font-semibold text-gray-900 capitalize">{selectedDocument.replace("Url", "").replace(/([A-Z])/g, " $1").trim()}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{request[selectedDocument]?.split("/").pop()}</p>
                                    <div className="mt-2">{getStatusBadge(request[selectedDocument + "Status"] as string)}</div>
                                </div>
                                <button onClick={() => setSelectedDocument(null)} className="p-2 rounded-lg hover:bg-gray-100" title="Close preview"><X className="w-4 h-4 text-gray-500" /></button>
                            </div>
                            {request[selectedDocument] && (
                                <div className="bg-gray-50 rounded-xl p-4">
                                            {isImageFile(request[selectedDocument]) ? (
                                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                    <img
                                                        src={getFullUrl(request[selectedDocument])}
                                                        alt={selectedDocument}
                                                        className="max-w-full max-h-96 rounded-lg border border-gray-200 shadow"
                                                    />
                                                </div>
                                    ) : isPDFFile(request[selectedDocument]) ? (
                                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden"><iframe src={getFullUrl(request[selectedDocument])} className="w-full h-[26rem]" title={selectedDocument} /></div>
                                    ) : isVideoFile(request[selectedDocument]) ? (
                                        <div className="bg-white rounded-lg p-4 border border-gray-200"><video src={getFullUrl(request[selectedDocument])} controls controlsList="nodownload" className="max-w-full max-h-[26rem] mx-auto rounded-lg shadow-md" /></div>
                                    ) : (
                                        <div className="bg-white rounded-lg p-8 border border-gray-200 text-center"><FileText className="w-16 h-16 text-gray-300 mx-auto mb-3" /><p className="text-gray-500 mb-4">Preview not available for this file type</p><a href={getFullUrl(request[selectedDocument])} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"><ExternalLink className="w-4 h-4" />Open in New Tab</a></div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
