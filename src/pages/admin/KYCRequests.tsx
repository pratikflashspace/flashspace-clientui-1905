import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';
import { Search, Check, X, FileText, AlertCircle, User, Building2, Eye, Download, Clock, CheckCircle2, XCircle, ExternalLink, Calendar, File } from 'lucide-react';
import { toast } from "sonner";

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
    overallStatus: 'pending' | 'approved' | 'rejected' | 'resubmit';
    documents: KYCDocument[];
    progress?: number;
    createdAt: string;
}

export default function KYCRequests() {
    const [requests, setRequests] = useState<KYCRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequest, setSelectedRequest] = useState<KYCRequest | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showDocumentModal, setShowDocumentModal] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<KYCDocument | null>(null);

    useEffect(() => {
        fetchKYCRequests();
    }, []);

    const fetchKYCRequests = async () => {
        setLoading(true);
        try {
            const response = await adminService.getPendingKYC();
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
    };

    const handleApprove = async (request: KYCRequest) => {
        if (confirm(`Are you sure you want to approve KYC for ${request.user?.fullName}?`)) {
            try {
                const response = await adminService.reviewKYC(request._id, 'approve');
                if (response.success) {
                    toast.success('KYC approved successfully');
                    fetchKYCRequests();
                } else {
                    toast.error(response.message || 'Failed to approve KYC');
                }
            } catch (error) {
                console.error('Failed to approve KYC', error);
                toast.error('Failed to approve KYC');
            }
        }
    };

    const handleReject = async () => {
        if (!selectedRequest) return;

        if (!rejectionReason.trim()) {
            toast.error('Please provide a rejection reason');
            return;
        }

        try {
            const response = await adminService.reviewKYC(selectedRequest._id, 'reject', rejectionReason);
            if (response.success) {
                toast.success('KYC rejected successfully');
                setShowRejectModal(false);
                setRejectionReason('');
                setSelectedRequest(null);
                fetchKYCRequests();
            } else {
                toast.error(response.message || 'Failed to reject KYC');
            }
        } catch (error) {
            console.error('Failed to reject KYC', error);
            toast.error('Failed to reject KYC');
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

    const filteredRequests = requests.filter(request =>
        request.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-[Poppins]">KYC Verification</h1>
                    <p className="text-gray-500 mt-2 text-lg">Review and approve user identity documents</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl border border-blue-200">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">{filteredRequests.length} Pending Requests</span>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="relative max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* KYC Requests Grid */}
            {filteredRequests.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Pending Requests</h3>
                    <p className="text-gray-500">All caught up! There are no pending KYC requests at the moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredRequests.map((request) => (
                        <div key={request._id} className="bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                            {/* Header */}
                            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                <div className="flex items-center justify-between mb-4 gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                                            {request.user?.fullName?.charAt(0) || 'U'}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-bold text-gray-900 truncate">{request.user?.fullName || 'Unknown User'}</h3>
                                            <p className="text-sm text-gray-500 truncate">{request.user?.email || ''}</p>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0">
                                        {getStatusBadge(request.overallStatus)}
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                {request.progress !== undefined && (
                                    <div className="mt-4">
                                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                                            <span>Completion</span>
                                            <span className="font-semibold">{request.progress}%</span>
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
                            <div className="p-6 space-y-4">
                                {request.personalInfo && (
                                    <div className="bg-blue-50 rounded-xl p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <User className="w-4 h-4 text-blue-600" />
                                            <h4 className="text-sm font-semibold text-blue-900">Personal Info</h4>
                                        </div>
                                        <div className="space-y-1 text-sm">
                                            {request.personalInfo.fullName && (
                                                <p className="text-gray-700"><span className="font-medium">Name:</span> {request.personalInfo.fullName}</p>
                                            )}
                                            {request.personalInfo.phone && (
                                                <p className="text-gray-700"><span className="font-medium">Phone:</span> {request.personalInfo.phone}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {request.businessInfo && (
                                    <div className="bg-purple-50 rounded-xl p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Building2 className="w-4 h-4 text-purple-600" />
                                            <h4 className="text-sm font-semibold text-purple-900">Business Info</h4>
                                        </div>
                                        <div className="space-y-1 text-sm">
                                            {request.businessInfo.companyName && (
                                                <p className="text-gray-700"><span className="font-medium">Company:</span> {request.businessInfo.companyName}</p>
                                            )}
                                            {request.businessInfo.gstNumber && (
                                                <p className="text-gray-700"><span className="font-medium">GST:</span> {request.businessInfo.gstNumber}</p>
                                            )}
                                            {request.businessInfo.panNumber && (
                                                <p className="text-gray-700"><span className="font-medium">PAN:</span> {request.businessInfo.panNumber}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Documents */}
                                <div>
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Documents Submitted ({request.documents?.length || 0})</h4>
                                    {request.documents && request.documents.length > 0 ? (
                                        <div className="space-y-2">
                                            {request.documents.map((doc, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors group/doc">
                                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                                        <div className="p-1.5 bg-blue-100 rounded-lg">
                                                            <FileText className="w-4 h-4 text-blue-600" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm text-gray-700 font-medium capitalize truncate">{doc.type}</p>
                                                            <p className="text-xs text-gray-500 truncate">{doc.name}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => openDocumentModal(doc, request)}
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
                                            <p className="text-sm font-medium text-orange-900">No documents uploaded yet</p>
                                            <p className="text-xs text-orange-600 mt-1">User needs to upload KYC documents</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="p-6 pt-0">
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => openRejectModal(request)}
                                        className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50 transition-all text-sm font-semibold hover:scale-105"
                                    >
                                        <X className="w-4 h-4" />
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleApprove(request)}
                                        className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 transition-all text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105"
                                    >
                                        <Check className="w-4 h-4" />
                                        Approve
                                    </button>
                                </div>
                                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                                    <Clock className="w-3 h-3" />
                                    Submitted: {new Date(request.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Document Details Modal */}
            {showDocumentModal && selectedDocument && selectedRequest && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8 animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-1">Document Details</h3>
                                    <p className="text-sm text-gray-500">Submitted by {selectedRequest.user?.fullName}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowDocumentModal(false);
                                        setSelectedDocument(null);
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            {/* Document Info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <File className="w-4 h-4 text-gray-600" />
                                        <p className="text-xs font-semibold text-gray-500 uppercase">Document Type</p>
                                    </div>
                                    <p className="text-lg font-bold text-gray-900 capitalize">{selectedDocument.type}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FileText className="w-4 h-4 text-gray-600" />
                                        <p className="text-xs font-semibold text-gray-500 uppercase">File Name</p>
                                    </div>
                                    <p className="text-lg font-bold text-gray-900 truncate">{selectedDocument.name}</p>
                                </div>
                                {selectedDocument.uploadedAt && (
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Calendar className="w-4 h-4 text-gray-600" />
                                            <p className="text-xs font-semibold text-gray-500 uppercase">Uploaded</p>
                                        </div>
                                        <p className="text-lg font-bold text-gray-900">
                                            {new Date(selectedDocument.uploadedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CheckCircle2 className="w-4 h-4 text-gray-600" />
                                        <p className="text-xs font-semibold text-gray-500 uppercase">Status</p>
                                    </div>
                                    {getStatusBadge(selectedDocument.status || 'pending')}
                                </div>
                            </div>

                            {/* Document Preview */}
                            {selectedDocument.fileUrl && (
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-4">Document Preview</h4>
                                    {isImageFile(selectedDocument.fileUrl) ? (
                                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                                            <img
                                                src={selectedDocument.fileUrl}
                                                alt={selectedDocument.name}
                                                className="max-w-full max-h-96 mx-auto rounded-lg shadow-md"
                                            />
                                        </div>
                                    ) : isPDFFile(selectedDocument.fileUrl) ? (
                                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                            <iframe
                                                src={selectedDocument.fileUrl}
                                                className="w-full h-96"
                                                title={selectedDocument.name}
                                            />
                                        </div>
                                    ) : (
                                        <div className="bg-white rounded-lg p-8 border border-gray-200 text-center">
                                            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                                            <p className="text-gray-500 mb-4">Preview not available for this file type</p>
                                            <a
                                                href={selectedDocument.fileUrl}
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
                                        <p className="text-sm font-semibold text-red-900">Rejection Reason</p>
                                    </div>
                                    <p className="text-sm text-red-700">{selectedDocument.rejectionReason}</p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
                            {selectedDocument.fileUrl && (
                                <>
                                    <a
                                        href={selectedDocument.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors font-semibold"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Open in New Tab
                                    </a>
                                    <a
                                        href={selectedDocument.fileUrl}
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
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <XCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Reject KYC</h3>
                                <p className="text-sm text-gray-500">{selectedRequest.user?.fullName}</p>
                            </div>
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

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectionReason('');
                                    setSelectedRequest(null);
                                }}
                                className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                className="flex-1 py-3 px-4 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors font-semibold"
                            >
                                Reject KYC
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
