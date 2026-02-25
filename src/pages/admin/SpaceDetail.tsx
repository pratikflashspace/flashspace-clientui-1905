import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  ArrowLeft,
} from "lucide-react";
import {
  getAllSpaceDetails,
  SpaceDetailsResponse,
} from "@/Api/spaceDetailsAdmin.service";
import axios from "axios";

const getStatusBadge = (status?: string) => {
  const config: any = {
    pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock },
    approved: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2 },
    rejected: { bg: "bg-red-100", text: "text-red-700", icon: XCircle },
    resubmit: { bg: "bg-orange-100", text: "text-orange-700", icon: AlertCircle },
  };

  const { bg, text, icon: Icon } = config[status || "pending"] || config.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${bg} ${text}`}
    >
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
};

export default function SpaceDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [space, setSpace] = useState<SpaceDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const list = await getAllSpaceDetails();

        const found = list.find((s) => {
          const userKycId =
            typeof s.userKyc === "string" ? s.userKyc : s.userKyc?.$oid;
          return userKycId === id;
        });

        setSpace(found || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSpace();
  }, [id]);

  // Always render the back button at the top
  const BackButton = (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 text-sm mt-5 border border-2 rounded-md w-20 border-gray-200"
      aria-label="Back to Requests"
      style={{ position: 'absolute', top: 24, left:0 , zIndex: 10 }}
    >
      <ArrowLeft className="w-4 h-4" /> Back
    </button>
  );

  const handleApprove = async () => {
    if (!space?._id) return;

    setSubmitting(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      await axios.put(
        `${apiUrl}/api/spacePartner/space-details/${space._id}/accept`,
        {},
        { withCredentials: true }
      );
      setAction("approved");
    } catch {
      setAction("error");
    }
    setSubmitting(false);
  };

  const handleReject = async () => {
    if (!space?._id) return;

    setSubmitting(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      await axios.put(
        `${apiUrl}/api/spacePartner/space-details/${space._id}/reject`,
        { rejectReason },
        { withCredentials: true }
      );
      setAction("rejected");
      setRejectReason("");
    } catch {
      setAction("error");
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="relative flex justify-center items-center h-64">
        {BackButton}
        <div className="animate-spin h-10 w-10 border-b-2 border-black rounded-full" />
      </div>
    );
  }
  if (!space) {
    return (
      <div className="relative flex justify-center items-center h-64">
        {BackButton}
        <span className="text-gray-500 text-lg">No data present</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      {BackButton}
      <h1 className="text-3xl font-bold text-blue-700 tracking-tight">Space Profile</h1>
      <p className="text-gray-500 text-lg mb-4">Review all details, documents, and take an approval decision.</p>
   <div className="flex items-end justify-end gap-4 mt-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
          {space.overallStatus === "approved" ? "APPROVED" : "PENDING"}
        </span>
        <span className="text-gray-700 font-medium">Progress: 100%</span>
        <span className="text-xs text-gray-500">Submitted: {space.createdAt ? new Date(space.createdAt).toLocaleString() : '-'}</span>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Account Holder Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex-1 min-w-[320px]">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl shadow-md">
              {space.ownerOfPremisesName?.charAt(0) || 'A'}
            </div>
            <div>
              <h2 className="font-bold text-xl text-gray-900">{space.ownerOfPremisesName || 'Unknown Owner'}</h2>
              <p className="text-gray-500 text-sm">{space.ownerOfPremisesEmail || ''}</p>
            </div>
          </div>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Phone:</span> {space.ownerOfPremisesPhone || '-'}</p>
            <p><span className="font-medium">Company Name:</span> {space.spaceName || '-'}</p>
            <p><span className="font-medium">Company Type:</span> {space.companyType || '-'}</p>
            <p><span className="font-medium">CIN Number:</span> {space.cinNumber || '-'}</p>
            <p><span className="font-medium">GST Number:</span> {space.gstNumber || '-'}</p>
            <p><span className="font-medium">Registered Address:</span> {space.registeredAddress || '-'}</p>
          </div>
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleApprove}
              disabled={
                submitting ||
                space.status === "approved" ||
                action === "approved"
              }
              className={`px-4 py-2 rounded-xl font-semibold text-lg transition-colors
                ${submitting || space.status === "approved" || action === "approved"
                  ? "bg-green-200 text-white cursor-not-allowed opacity-60"
                  : "bg-green-500 text-white hover:bg-green-600"}
              `}
            >
              Approve KYC
            </button>
            <button
              onClick={() => setAction("reject")}
              disabled={
                submitting ||
                space.status === "rejected" ||
                action === "rejected"
              }
              className={`px-4 py-2 border rounded-xl font-semibold text-lg transition-colors
                ${submitting || space.status === "rejected" || action === "rejected"
                  ? "bg-red-100 text-red-300 border-red-100 cursor-not-allowed opacity-60"
                  : "bg-white text-red-500 border-red-300 hover:bg-red-50"}
              `}
            >
              Reject KYC
            </button>
          </div>
          {action === "reject" && (
            <div className="mt-4">
              <input
                className="border p-2 w-full mb-2"
                placeholder="Reject reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
              <button
                onClick={handleReject}
                disabled={!rejectReason}
                className="bg-red-600 text-white px-4 py-2 rounded font-semibold text-lg"
              >
                Confirm Reject
              </button>
            </div>
          )}
          {/* {(action === "approved" || space.status === "approved" || space.overallStatus === "approved") && (
            <p className="text-green-600 mt-4">Space Approved ✅</p>
          )}
          {(action === "rejected" || space.status === "rejected" || space.overallStatus === "rejected") && (
            <p className="text-red-600 mt-4">Space Rejected ❌</p>
          )}
          {action === "error" && (
            <p className="text-red-600 mt-4">Something went wrong</p>
          )} */}
        </div>

        {/* Submitted Documents Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex-1 min-w-[320px]">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl font-bold text-blue-700">Submitted Documents</span>
            <span className="text-xs text-gray-500">All documents uploaded for this space.</span>
          </div>
          <div className="space-y-4">
            {space.sampleAgreementUrl && (
              <div className="bg-blue-50 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-blue-900">Agreement</span>
                  <span className="text-xs text-gray-500">{space.sampleAgreementUrl.split('/').pop()}</span>
                </div>
                <button
                  className="px-3 py-1.5 text-xs text-blue-600 hover:text-blue-700 font-semibold bg-blue-50 hover:bg-blue-100 rounded-lg"
                  onClick={() => window.open(space.sampleAgreementUrl, '_blank')}
                >
                  View
                </button>
              </div>
            )}
            {space.propertyTaxReceiptUrl && (
              <div className="bg-blue-50 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-blue-900">Property Tax</span>
                  <span className="text-xs text-gray-500">{space.propertyTaxReceiptUrl.split('/').pop()}</span>
                </div>
                <button
                  className="px-3 py-1.5 text-xs text-blue-600 hover:text-blue-700 font-semibold bg-blue-50 hover:bg-blue-100 rounded-lg"
                  onClick={() => window.open(space.propertyTaxReceiptUrl, '_blank')}
                >
                  View
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status & Progress */}
   
    </div>
  );
}