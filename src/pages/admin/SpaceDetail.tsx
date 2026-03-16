import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  ArrowLeft,
  ArrowRight,
  Building2,
  MapPin,
  Globe,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavItems";
import {
  getAllSpaceDetails,
  SpaceDetailsResponse,
  getPartnerPropertiesData,
  PropertyData,
  getPartnerPropertiesByUserId,
} from "@/Api/spaceDetailsAdmin.service";
import { getAllSpacePartnerKyc } from "@/Api/spacePartnerKyc.service";
import axios from "axios";
import toast from "react-hot-toast";

const getStatusBadge = (kycStatus?: string) => {
  const config: any = {
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

  const {
    bg,
    text,
    icon: Icon,
  } = config[kycStatus || "pending"] || config.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${bg} ${text}`}
    >
      <Icon className="w-3 h-3" />
      {kycStatus}
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
  const [propertiesData, setPropertiesData] = useState<PropertyData[] | null>(
    null,
  );
  const [kycId, setKycId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        // 1. Fetch space details and properties in parallel
        const [list, pData, kycList] = await Promise.all([
          getAllSpaceDetails(),
          id ? getPartnerPropertiesByUserId(id) : Promise.resolve([]),
          getAllSpacePartnerKyc(),
        ]);

        // 2. Find the specific space profile by matching userId
        const found = list.find((s) => {
          const spaceUserId =
            typeof s.userKyc === "object"
              ? s.userKyc?.userId || s.userKyc?.id
              : undefined;
          return spaceUserId === id;
        });

        // 3. Find the KYC request ID for this user
        const userKyc = kycList.find((k) => k.userId === id);
        if (userKyc) {
          setKycId(userKyc._id);
        }

        setSpace(found || null);
        setPropertiesData(pData as PropertyData[]);
      } catch (err) {
        console.error("Error in SpaceDetail fetch:", err);
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
      style={{ position: "absolute", top: 24, left: 0, zIndex: 10 }}
    >
      <ArrowLeft className="w-4 h-4" /> Back
    </button>
  );

  const handleApprove = async () => {
    if (!space?._id) return;

    setSubmitting(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "";
      await axios.put(
        `${apiUrl}/api/spacePartner/space-details/${space._id}/accept`,
        {},
        { withCredentials: true },
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
      const apiUrl = import.meta.env.VITE_API_URL || "";
      await axios.put(
        `${apiUrl}/api/spacePartner/space-details/${space._id}/reject`,
        { rejectReason },
        { withCredentials: true },
      );
      setAction("rejected");
      setRejectReason("");
    } catch {
      setAction("error");
    }
    setSubmitting(false);
  };

  const renderStatusBadge = (status: string | undefined) => {
    const s = status?.toLowerCase() || "pending";
    const config = {
      approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
      active: "bg-emerald-100 text-emerald-700 border-emerald-200",
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      pending_approval: "bg-amber-100 text-amber-700 border-amber-200",
      rejected: "bg-rose-100 text-rose-700 border-rose-200",
      inactive: "bg-rose-100 text-rose-700 border-rose-200",
      draft: "bg-gray-100 text-gray-700 border-gray-200",
      not_started: "bg-gray-100 text-gray-700 border-gray-200",
      resubmit: "bg-orange-100 text-orange-700 border-orange-200",
    };

    const style =
      config[s as keyof typeof config] ||
      "bg-gray-100 text-gray-700 border-gray-200";

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${style}`}
      >
        {s.replace("_", " ")}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="relative flex justify-center items-center h-64">
        {BackButton}
        <div className="animate-spin h-10 w-10 border-b-2 border-black rounded-full" />
      </div>
    );
  }

  return (
    <DashboardLayout
      portalName="FlashSpace Admin"
      portalDescription="Complete platform management"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="space-y-8 animate-in fade-in duration-500 bg-transparent min-h-screen">
        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total Properties",
              value: propertiesData?.length || 0,
              color: "text-gray-600",
              bg: "bg-gray-50",
              border: "border-gray-100",
            },
            {
              label: "Active Properties",
              value:
                propertiesData?.filter((p) => p.kycStatus === "approved")
                  .length || 0,
              color: "text-emerald-600",
              bg: "bg-emerald-50/50",
              border: "border-emerald-100",
            },
            {
              label: "Pending Review",
              value:
                propertiesData?.filter((p) => p.kycStatus === "pending")
                  .length || 0,
              color: "text-amber-600",
              bg: "bg-amber-50/50",
              border: "border-amber-100",
            },
            {
              label: "Rejected / Draft",
              value:
                propertiesData?.filter(
                  (p) =>
                    p.kycStatus === "rejected" ||
                    p.kycStatus === "not_started" ||
                    p.kycStatus === "resubmit",
                ).length || 0,
              color: "text-rose-600",
              bg: "bg-rose-50/50",
              border: "border-rose-100",
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`${stat.bg} ${stat.border} border rounded-3xl p-6 transition-all duration-300 hover:shadow-md`}
            >
              <p className="text-sm font-medium text-gray-500 mb-1">
                {stat.label}
              </p>
              <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight">
              Space Profile
            </h1>
            <p className="text-gray-500 mt-2 text-lg font-light">
              Review all details, documents, and take an approval decision.
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors font-medium shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Requests
          </button>
        </div>

        {space && (
          <>
            <div className="flex items-center justify-end gap-4 mt-8">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  Current Status
                </span>
                {renderStatusBadge(space.overallStatus)}
              </div>
              <span className="text-gray-700 font-medium">Progress: 100%</span>
              <span className="text-xs text-gray-500">
                Submitted:{" "}
                {space.createdAt
                  ? new Date(space.createdAt).toLocaleString()
                  : "-"}
              </span>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Main Account Holder Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex-1 min-w-[320px]">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl shadow-md">
                    {space.ownerOfPremisesName?.charAt(0) || "A"}
                  </div>
                  <div>
                    <h2 className="font-bold text-xl text-gray-900">
                      {space.ownerOfPremisesName || "Unknown Owner"}
                    </h2>
                    <p className="text-gray-500 text-sm">
                      {space.ownerOfPremisesEmail || ""}
                    </p>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {space.ownerOfPremisesPhone || "-"}
                  </p>
                  <p>
                    <span className="font-medium">Company Name:</span>{" "}
                    {space.spaceName || "-"}
                  </p>
                  <p>
                    <span className="font-medium">Company Type:</span>{" "}
                    {space.companyType || "-"}
                  </p>
                  <p>
                    <span className="font-medium">CIN Number:</span>{" "}
                    {space.cinNumber || "-"}
                  </p>
                  <p>
                    <span className="font-medium">GST Number:</span>{" "}
                    {space.gstNumber || "-"}
                  </p>
                  <p>
                    <span className="font-medium">Registered Address:</span>{" "}
                    {space.registeredAddress || "-"}
                  </p>
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
                ${
                  submitting ||
                  space.status === "approved" ||
                  action === "approved"
                    ? "bg-green-200 text-white cursor-not-allowed opacity-60"
                    : "bg-green-500 text-white hover:bg-green-600"
                }
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
                ${
                  submitting ||
                  space.status === "rejected" ||
                  action === "rejected"
                    ? "bg-red-100 text-red-300 border-red-100 cursor-not-allowed opacity-60"
                    : "bg-white text-red-500 border-red-300 hover:bg-red-50"
                }
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
                  <span className="text-2xl font-bold text-blue-700">
                    Submitted Documents
                  </span>
                  <span className="text-xs text-gray-500">
                    All documents uploaded for this space.
                  </span>
                </div>
                <div className="space-y-4">
                  {space.sampleAgreementUrl && (
                    <div className="bg-blue-50 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-blue-900">
                          Agreement
                        </span>
                        <span className="text-xs text-gray-500">
                          {space.sampleAgreementUrl.split("/").pop()}
                        </span>
                      </div>
                      <button
                        className="px-3 py-1.5 text-xs text-blue-600 hover:text-blue-700 font-semibold bg-blue-50 hover:bg-blue-100 rounded-lg"
                        onClick={() =>
                          window.open(space.sampleAgreementUrl, "_blank")
                        }
                      >
                        View
                      </button>
                    </div>
                  )}
                  {space.propertyTaxReceiptUrl && (
                    <div className="bg-blue-50 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-blue-900">
                          Property Tax
                        </span>
                        <span className="text-xs text-gray-500">
                          {space.propertyTaxReceiptUrl.split("/").pop()}
                        </span>
                      </div>
                      <button
                        className="px-3 py-1.5 text-xs text-blue-600 hover:text-blue-700 font-semibold bg-blue-50 hover:bg-blue-100 rounded-lg"
                        onClick={() =>
                          window.open(space.propertyTaxReceiptUrl, "_blank")
                        }
                      >
                        View
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Properties List */}
        <h2 className="text-2xl font-bold text-gray-800 mt-12 mb-6">
          Partner Properties
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {propertiesData && propertiesData.length > 0 ? (
            propertiesData.map((prop) => (
              <div
                key={prop._id}
                className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
              >
                {/* Header with Visual Element */}
                <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex justify-between items-start relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <Building2 className="w-32 h-32 -bottom-8 -right-8 absolute rotate-12" />
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white relative z-10">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="relative z-10 flex-shrink-0">
                    {renderStatusBadge(prop.kycStatus)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-4">
                    <h3
                      className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate"
                      title={prop.name}
                    >
                      {prop.name}
                    </h3>
                    <div className="flex items-start gap-1.5 mt-2 text-gray-500">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                      <p
                        className="text-sm leading-relaxed space-y-1"
                        title={`${prop.address}, ${prop.area}, ${prop.city}`}
                      >
                        <span className="font-semibold text-gray-900 block">
                          {prop.area}, {prop.city}
                        </span>
                        <span className="text-xs text-gray-500 truncate block w-full">
                          {prop.address}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    {/* Features / Tags */}
                    <div className="flex flex-wrap gap-2">
                      {prop.features?.slice(0, 3).map((f, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[11px] font-semibold rounded-lg border border-blue-100"
                        >
                          {f}
                        </span>
                      ))}
                      {(prop.features?.length || 0) > 3 && (
                        <span className="px-2.5 py-1 bg-gray-50 text-gray-600 text-[11px] font-semibold rounded-lg border border-gray-100">
                          +{prop.features.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Operational Status Indicators */}
                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-50">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${prop.isActive ? "bg-emerald-500" : "bg-gray-400"}`}
                        />
                        <span className="text-xs font-semibold text-gray-700">
                          {prop.isActive ? "Active Now" : "Inactive"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck
                          className={`w-3.5 h-3.5 ${prop.kycStatus === "approved" ? "text-blue-500" : "text-gray-400"}`}
                        />
                        <span
                          className={`text-xs font-semibold ${
                            prop.kycStatus === "approved"
                              ? "text-emerald-600"
                              : prop.kycStatus === "pending" ||
                                  prop.kycStatus === "pending_approval"
                                ? "text-amber-600"
                                : "text-rose-600"
                          }`}
                        >
                          KYC: {prop.kycStatus?.replace("_", " ")}
                        </span>
                      </div>
                    </div>

                    {/* Space KYC Pending Tags */}
                    {(prop.voPending ||
                      prop.coworkingPending ||
                      prop.meetingPending) && (
                      <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-50 mt-1">
                        {prop.voPending && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500 text-white uppercase animate-pulse shadow-sm shadow-orange-200">
                            <AlertCircle className="w-3 h-3" /> VO Pending
                          </span>
                        )}
                        {prop.coworkingPending && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500 text-white uppercase animate-pulse shadow-sm shadow-orange-200">
                            <AlertCircle className="w-3 h-3" /> Coworking
                            Pending
                          </span>
                        )}
                        {prop.meetingPending && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500 text-white uppercase animate-pulse shadow-sm shadow-orange-200">
                            <AlertCircle className="w-3 h-3" /> On-Demand
                            Pending
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="px-6 pb-6 mt-auto">
                    {prop.kycStatus === "approved" ? (
                      <button
                        onClick={() => {
                          navigate(`/admin/manage-property/${prop._id}`);
                        }}
                        className="w-full py-3 rounded-2xl font-bold text-sm shadow-xl bg-blue-600 text-white shadow-blue-100 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group"
                      >
                        Manage Property
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (kycId) {
                            navigate(
                              `/admin/kyc-partners/${kycId}?propertyId=${prop._id}`,
                            );
                          } else {
                            toast.error(
                              "KYC Request not found for this partner",
                            );
                          }
                        }}
                        className="w-full py-3 rounded-2xl font-bold text-sm shadow-xl bg-green-500 text-white shadow-green-100 hover:bg-green-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group"
                      >
                        Complete KYC
                        <CheckCircle2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center bg-gray-50 border border-dashed border-gray-200 rounded-2xl">
              <p className="text-gray-500 font-medium">
                No properties submitted for review yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
