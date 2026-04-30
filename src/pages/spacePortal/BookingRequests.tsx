import { useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  FileCheck2,
  FileText,
  Filter,
  Check,
  ChevronRight,
  MapPin,
  Search,
  Upload,
  X,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  fetchPartnerBookingRequests,
  reviewPartnerBookingDocument,
  reviewPartnerBookingKycDocument,
  uploadPartnerBookingDocument,
} from "@/services/spacePortal/spacePartner.service";
import { getUploadedFileUrl } from "@/utils/fileUrl";

type Doc = {
  id: string;
  type: string;
  name: string;
  status?: string;
  partnerReviewStatus?: string;
  fileUrl?: string;
  rejectionReason?: string;
  partnerRejectionReason?: string;
  partnerReviewedAt?: string;
};

type BookingRequest = {
  bookingId: string;
  bookingNumber: string;
  client: { name: string; email: string; phone?: string; companyName?: string };
  space: { name: string; address?: string; city?: string; image?: string; type?: string };
  plan: { name: string; tenure: number; tenureUnit: string; price: number };
  status: string;
  kycStatus: string;
  startDate?: string;
  endDate?: string;
  kyc: {
    profileId: string;
    profileName: string;
    kycType: string;
    overallStatus: string;
    personalDocuments: Doc[];
    businessDocuments: Doc[];
    partnerDocuments: Array<{ id: string; name: string; email: string; status: string; documents: Doc[] }>;
  };
  agreement: {
    draftAgreement?: Doc;
    signedAgreement?: Doc;
    finalAgreement?: Doc;
    supportingDocuments: Doc[];
    documents: Doc[];
  };
};

const DOC_LABELS: Record<string, string> = {
  pan_card: "PAN Card",
  aadhaar: "Aadhaar",
  video_kyc: "Video KYC",
  coi: "Certificate of Incorporation",
  gst_certificate: "GST Certificate",
  address_proof: "Address Proof",
  draft_agreement: "Draft Agreement",
  signed_agreement: "Signed Agreement",
  final_agreement: "Final Agreement",
  noc: "NOC",
  utility_bill: "Electricity Bill",
  electricity_bill: "Electricity Bill",
  other_support: "Supporting Document",
};

const formatDate = (value?: string) => {
  if (!value) return "N/A";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "N/A"
    : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const statusClass = (status?: string) => {
  const normalized = (status || "pending").toLowerCase();
  if (["approved", "active", "available"].includes(normalized)) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (normalized === "rejected") return "bg-rose-50 text-rose-700 border-rose-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
};

const formatAmount = (value?: number) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const adminStatusLabel = (status?: string) => {
  const normalized = (status || "pending").toLowerCase();
  if (normalized === "approved") return "Admin Approved";
  if (normalized === "rejected") return "Admin Rejected";
  return "Admin Pending";
};

const partnerStatusLabel = (status?: string) => {
  const normalized = (status || "pending").toLowerCase();
  if (normalized === "approved") return "Partner Approved";
  if (normalized === "rejected") return "Partner Rejected";
  return "Partner Pending";
};

export default function BookingRequests() {
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [detailStep, setDetailStep] = useState(1);
  const [uploadTarget, setUploadTarget] = useState<{ bookingId: string; type: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const response = await fetchPartnerBookingRequests();
      const rows = response?.success ? response.data || [] : [];
      setRequests(rows);
    } catch (err) {
      console.error("Failed to load booking requests:", err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const filtered = useMemo(() => {
    return requests.filter((request) => {
      const haystack = [
        request.bookingNumber,
        request.client.name,
        request.client.email,
        request.client.companyName,
        request.space.name,
        request.plan.name,
      ].join(" ").toLowerCase();
      const matchesQuery = haystack.includes(query.toLowerCase());
      const matchesStatus = status === "all" || request.status === status || request.kycStatus === status;
      return matchesQuery && matchesStatus;
    });
  }, [requests, query, status]);

  const selected = filtered.find((request) => request.bookingId === selectedId);

  useEffect(() => {
    setDetailStep(1);
  }, [selected?.bookingId]);

  useEffect(() => {
    if (!selected) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [selected]);

  const metrics = useMemo(() => {
    const pendingKyc = requests.filter((request) => request.kycStatus !== "approved").length;
    const signedPending = requests.filter((request) => request.agreement.signedAgreement?.status === "pending").length;
    const finalReady = requests.filter((request) => request.agreement.finalAgreement).length;
    return { total: requests.length, pendingKyc, signedPending, finalReady };
  }, [requests]);

  const handleReviewKyc = async (
    booking: BookingRequest,
    doc: Doc,
    action: "approve" | "reject",
    profileModel: "kyc" | "business" | "partner" = "kyc",
    profileId = booking.kyc.profileId,
  ) => {
    const rejectionReason = action === "reject" ? window.prompt("Rejection reason") || "Rejected by partner" : undefined;
    const toastId = toast.loading(`${action === "approve" ? "Approving" : "Rejecting"} document...`);
    const response = await reviewPartnerBookingKycDocument(booking.bookingId, {
      profileModel,
      profileId,
      documentId: doc.id,
      documentType: doc.type,
      action,
      rejectionReason,
    });
    if (response.success) {
      setRequests((current) =>
        current.map((request) => {
          if (request.bookingId !== booking.bookingId) return request;

          const updateDocs = (docs: Doc[]) =>
            docs.map((item) =>
              item.id === doc.id
                ? {
                    ...item,
                    partnerReviewStatus: action === "approve" ? "approved" : "rejected",
                    partnerRejectionReason: action === "reject" ? rejectionReason : undefined,
                  }
                : item,
            );

          return {
            ...request,
            kyc: {
              ...request.kyc,
              personalDocuments: profileModel === "kyc" ? updateDocs(request.kyc.personalDocuments) : request.kyc.personalDocuments,
              businessDocuments: profileModel === "business" ? updateDocs(request.kyc.businessDocuments) : request.kyc.businessDocuments,
              partnerDocuments: request.kyc.partnerDocuments.map((partner) =>
                profileModel === "partner" && partner.id === profileId
                  ? { ...partner, documents: updateDocs(partner.documents) }
                  : partner,
              ),
            },
          };
        }),
      );
      toast.success("Document updated", { id: toastId });
    } else {
      toast.error(response.message || "Action failed", { id: toastId });
    }
  };

  const handleReviewAgreement = async (booking: BookingRequest, action: "approve" | "reject") => {
    const rejectionReason = action === "reject" ? window.prompt("Rejection reason") || "Signed agreement rejected" : undefined;
    const toastId = toast.loading(`${action === "approve" ? "Approving" : "Rejecting"} signed agreement...`);
    const response = await reviewPartnerBookingDocument(booking.bookingId, {
      documentType: "signed_agreement",
      action,
      rejectionReason,
    });
    response.success ? toast.success("Signed agreement updated", { id: toastId }) : toast.error(response.message || "Action failed", { id: toastId });
    await loadRequests();
  };

  const startUpload = (bookingId: string, type: string) => {
    setUploadTarget({ bookingId, type });
    setTimeout(() => fileRef.current?.click(), 0);
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !uploadTarget) return;

    const toastId = toast.loading("Uploading document...");
    const response = await uploadPartnerBookingDocument(uploadTarget.bookingId, uploadTarget.type, file, DOC_LABELS[uploadTarget.type]);
    response.success ? toast.success("Document uploaded", { id: toastId }) : toast.error(response.message || "Upload failed", { id: toastId });
    setUploadTarget(null);
    event.target.value = "";
    await loadRequests();
  };

  const renderDocRow = (
    booking: BookingRequest,
    doc: Doc,
    profileModel: "kyc" | "business" | "partner" = "kyc",
    profileId = booking.kyc.profileId,
  ) => {
    const partnerStatus = doc.partnerReviewStatus || "pending";
    const isPartnerApproved = partnerStatus === "approved";
    const isPartnerRejected = partnerStatus === "rejected";

    return (
      <div key={`${profileId}-${doc.id}-${doc.type}`} className="flex flex-col gap-3 rounded-lg border border-[#2D3F33]/10 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="font-semibold text-sm text-[#12251b]">{DOC_LABELS[doc.type] || doc.name}</p>
          <p className="text-xs text-[#607067] truncate">{doc.name}</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase ${statusClass(doc.status)}`}>
            {adminStatusLabel(doc.status)}
          </span>
          <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase ${statusClass(partnerStatus)}`}>
            {partnerStatusLabel(partnerStatus)}
          </span>
          {doc.fileUrl && (
            <a
              href={getUploadedFileUrl(doc.fileUrl)}
              target="_blank"
              rel="noreferrer"
              title="View document"
              aria-label="View document"
              className="grid h-9 w-9 place-items-center rounded-lg border text-[#2D3F33] hover:bg-[#2D3F33]/5"
            >
              <Eye size={16} />
            </a>
          )}
          {partnerStatus === "pending" && (
            <>
              <button
                onClick={() => handleReviewKyc(booking, doc, "approve", profileModel, profileId)}
                title="Partner approve"
                aria-label="Partner approve"
                className="grid h-9 w-9 place-items-center rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition"
              >
                <CheckCircle2 size={16} />
              </button>
              <button
                onClick={() => handleReviewKyc(booking, doc, "reject", profileModel, profileId)}
                title="Partner reject"
                aria-label="Partner reject"
                className="grid h-9 w-9 place-items-center rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 transition"
              >
                <XCircle size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleUpload} />

      <div>
        <h1 className="text-4xl font-black tracking-tight text-[#10251a]">
          Booking <span className="text-primary italic">Requests</span>
        </h1>
        <p className="mt-2 text-[#557064]">Verify KYC, exchange agreements, and publish final booking documents.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Total Requests", metrics.total, FileText],
          ["KYC Pending", metrics.pendingKyc, Clock3],
          ["Signed Review", metrics.signedPending, FileCheck2],
          ["Final Ready", metrics.finalReady, CheckCircle2],
        ].map(([label, value, Icon]: any) => (
          <div key={label} className="rounded-xl border border-[#2D3F33]/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#557064]">{label}</p>
              <Icon className="text-[#2D3F33]" size={18} />
            </div>
            <p className="mt-4 text-3xl font-black text-[#10251a]">{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[#2D3F33]/10 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#718178]" size={18} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search booking, client, space..." className="h-11 w-full rounded-lg border border-[#2D3F33]/10 bg-[#f7f8f6] pl-10 pr-3 outline-none focus:border-[#2D3F33]" />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-[#718178]" size={16} />
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-11 rounded-lg border border-[#2D3F33]/10 bg-[#f7f8f6] pl-9 pr-8 outline-none focus:border-[#2D3F33]">
              <option value="all">All Status</option>
              <option value="pending_kyc">Pending KYC</option>
              <option value="active">Active</option>
              <option value="approved">KYC Approved</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-md">
        <div className="overflow-hidden rounded-xl border border-[#2D3F33]/10 bg-white shadow-sm">
          <div className="border-b px-4 py-3">
            <p className="font-bold text-[#10251a]">{filtered.length} Requests</p>
          </div>
          <div className="max-h-[720px] overflow-y-auto">
            {loading ? (
              <p className="p-6 text-sm text-[#607067]">Loading requests...</p>
            ) : filtered.length === 0 ? (
              <p className="p-6 text-sm text-[#607067]">No booking requests found.</p>
            ) : (
              filtered.map((request) => (
                <button
                  key={request.bookingId}
                  onClick={() => {
                    setSelectedId(request.bookingId);
                    setDetailStep(1);
                  }}
                  className={`block w-full border-b px-4 py-4 text-left transition hover:bg-[#f7f8f6] ${selected?.bookingId === request.bookingId ? "bg-[#fff9d8]" : ""}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-black text-[#10251a]">{request.bookingNumber}</p>
                      <p className="mt-1 text-sm font-semibold text-[#2D3F33]">{request.client.companyName || request.client.name}</p>
                      <p className="text-xs text-[#607067]">{request.space.name}</p>
                    </div>
                    <span className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase ${statusClass(request.kycStatus)}`}>{request.kycStatus}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {selected && (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onWheel={(event) => event.preventDefault()}
          >
            <div className="flex h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl">
              <div className="relative h-40 shrink-0 overflow-hidden text-white">
                <img
                  src={selected.space.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900"}
                  alt={selected.space.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
                <button
                  type="button"
                  onClick={() => setSelectedId("")}
                  className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-black/25 text-white backdrop-blur-md transition hover:bg-black/45"
                >
                  <X size={16} />
                </button>
                <div className="absolute bottom-4 left-6 right-6">
                  <div className="flex items-end justify-between gap-4">
                    <div className="min-w-0">
                      <span className="mb-2 inline-block rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                        {selected.space.type || "Virtual Office"}
                      </span>
                      <h2 className="truncate text-2xl font-bold text-white drop-shadow-md">{selected.space.name}</h2>
                      <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-white/85">
                        <MapPin size={14} /> {selected.space.address || selected.space.city || "Location"}
                      </p>
                    </div>
                    <span className={`hidden rounded-full border px-3 py-1 text-sm font-bold uppercase shadow-sm sm:inline-flex ${statusClass(selected.kycStatus)}`}>
                      {selected.kycStatus}
                    </span>
                  </div>
                </div>
                <div className="hidden">
                <p className="text-sm text-white/70">{selected.space.type} • {selected.space.city || "Location"}</p>
                <h2 className="mt-1 text-2xl font-black">{selected.space.name}</h2>
                <p className="mt-1 text-sm text-white/75">{selected.space.address}</p>
                </div>
              </div>
              <div className="shrink-0 border-b border-[#2D3F33]/10 bg-[#f7f8f6]/70 px-5 py-4">
                <div className="flex items-center justify-between">
                  {["Booking Summary", "KYC Documents", "Agreements"].map((label, index) => {
                    const num = index + 1;
                    const isActive = detailStep === num;
                    const isPast = detailStep > num;

                    return (
                      <div key={label} className="contents">
                        <button
                          type="button"
                          onClick={() => setDetailStep(num)}
                          className={`flex min-w-0 flex-col items-center text-center transition ${isActive ? "opacity-100" : isPast ? "opacity-80" : "opacity-45"}`}
                        >
                          <span className={`mb-1.5 grid h-8 w-8 place-items-center rounded-full text-sm font-black transition ${isActive ? "bg-[#35503F] text-[#FEF8C3] ring-4 ring-[#35503F]/15" : isPast ? "bg-[#35503F] text-white" : "bg-white text-[#607067]"}`}>
                            {isPast ? <Check size={16} /> : num}
                          </span>
                          <span className="text-xs font-bold text-[#2D3F33]">{label}</span>
                        </button>
                        {num < 3 && <div className={`mx-3 h-1 flex-1 rounded-full ${isPast ? "bg-[#35503F]" : "bg-white"}`} />}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
                onWheel={(event) => event.stopPropagation()}
              >
              <div className={`${detailStep === 1 ? "grid" : "hidden"} gap-3 p-5 md:grid-cols-3`}>
                {[
                  ["Booking ID", selected.bookingNumber],
                  ["Plan", `${selected.plan.name} • ${selected.plan.tenure} ${selected.plan.tenureUnit}`],
                  ["Amount", `₹${Number(selected.plan.price || 0).toLocaleString("en-IN")}`],
                  ["Start Date", formatDate(selected.startDate)],
                  ["End Date", formatDate(selected.endDate)],
                  ["Amount", `${formatAmount(selected.plan.price)}/${selected.plan.tenure} ${selected.plan.tenureUnit}`],
                  ["City", selected.space.city || "N/A"],
                ].filter((_, index) => index !== 2).map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-[#2D3F33]/10 bg-[#f7f8f6] p-4">
                    <p className="text-xs font-bold uppercase text-[#607067]">{label}</p>
                    <p className="mt-1 font-black text-[#10251a]">{value}</p>
                  </div>
                ))}
              </div>
              {detailStep === 1 && (
                <div className="flex border-t border-[#2D3F33]/10 p-5 pt-4">
                  <button
                    type="button"
                    onClick={() => setDetailStep(2)}
                    className="ml-auto flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[#35503F] px-4 py-3 font-black text-[#FEF8C3] transition hover:bg-[#35503F]/90 md:flex-none md:min-w-52"
                  >
                    Next Step <ChevronRight size={16} />
                  </button>
                </div>
              )}

            <section className={`${detailStep === 2 ? "block" : "hidden"} rounded-xl border border-[#2D3F33]/10 bg-white p-5 shadow-sm`}>
              <h3 className="text-lg font-black text-[#10251a]">KYC Documents</h3>
              <p className="text-sm text-[#607067]">
                Status badge shows admin verification. Use Partner Review actions to approve or reject for this booking.
              </p>
              <div className="mt-4 space-y-5">
                <div>
                  <p className="mb-2 text-sm font-bold text-[#2D3F33]">Personal / Primary Profile</p>
                  <div className="space-y-2">
                    {selected.kyc.personalDocuments.length
                      ? selected.kyc.personalDocuments.map((doc) => renderDocRow(selected, doc, "kyc", selected.kyc.profileId))
                      : <p className="rounded-lg bg-[#f7f8f6] p-4 text-sm text-[#607067]">No personal documents uploaded.</p>}
                  </div>
                </div>

                {selected.kyc.businessDocuments.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm font-bold text-[#2D3F33]">Business Documents</p>
                    <div className="space-y-2">
                      {selected.kyc.businessDocuments.map((doc) => renderDocRow(selected, doc, "business", selected.kyc.profileId))}
                    </div>
                  </div>
                )}

                {selected.kyc.partnerDocuments.map((partner) => (
                  <div key={partner.id}>
                    <p className="mb-2 text-sm font-bold text-[#2D3F33]">{partner.name} • Partner Documents</p>
                    <div className="space-y-2">
                      {partner.documents.map((doc) => renderDocRow(selected, doc, "partner", partner.id))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex gap-3 border-t border-[#2D3F33]/10 pt-4">
                <button
                  type="button"
                  onClick={() => setDetailStep(1)}
                  className="flex min-h-11 flex-1 items-center justify-center rounded-lg border border-[#2D3F33]/10 px-4 py-3 font-black text-[#607067] transition hover:bg-[#f7f8f6]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setDetailStep(3)}
                  className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[#35503F] px-4 py-3 font-black text-[#FEF8C3] transition hover:bg-[#35503F]/90"
                >
                  Next Step <ChevronRight size={16} />
                </button>
              </div>
            </section>

            <section className={`${detailStep === 3 ? "block" : "hidden"} rounded-xl border border-[#2D3F33]/10 bg-white p-5 shadow-sm`}>
              <h3 className="text-lg font-black text-[#10251a]">Draft & Agreement Flow</h3>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <AgreementCard
                  title="1. Upload Draft"
                  doc={selected.agreement.draftAgreement}
                  actionLabel="Upload Draft"
                  onUpload={() => startUpload(selected.bookingId, "draft_agreement")}
                />
                <AgreementCard
                  title="2. Review Signed Copy"
                  doc={selected.agreement.signedAgreement}
                  actionLabel="Awaiting User"
                  onApprove={() => handleReviewAgreement(selected, "approve")}
                  onReject={() => handleReviewAgreement(selected, "reject")}
                />
                <div className="rounded-xl border border-[#2D3F33]/10 bg-[#f7f8f6] p-4 lg:col-span-2">
                  <p className="font-black text-[#10251a]">3. Final Documents</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {["final_agreement", "noc", "utility_bill", "other_support"].map((type) => {
                      const doc = type === "final_agreement"
                        ? selected.agreement.finalAgreement
                        : selected.agreement.supportingDocuments.find((item) => item.type === type);
                      return (
                        <div key={type} className="flex min-h-12 items-center justify-between gap-3 rounded-lg bg-white p-3">
                          <span className="min-w-0 text-sm font-semibold leading-snug text-[#12251b]">{DOC_LABELS[type]}</span>
                          {doc?.fileUrl ? (
                            <div className="flex shrink-0 items-center gap-2">
                              <a
                                href={getUploadedFileUrl(doc.fileUrl)}
                                target="_blank"
                                rel="noreferrer"
                                title="View document"
                                aria-label={`View ${DOC_LABELS[type]}`}
                                className="grid h-9 w-9 place-items-center rounded-lg border border-[#2D3F33]/10 text-[#2D3F33] hover:bg-[#2D3F33]/5"
                              >
                                <Eye size={16} />
                              </a>
                              <a
                                href={getUploadedFileUrl(doc.fileUrl)}
                                target="_blank"
                                rel="noreferrer"
                                title="Download document"
                                aria-label={`Download ${DOC_LABELS[type]}`}
                                className="grid h-9 w-9 place-items-center rounded-lg border border-[#2D3F33]/10 text-[#2D3F33] hover:bg-[#2D3F33]/5"
                              >
                                <Download size={16} />
                              </a>
                            </div>
                          ) : (
                            <button
                              onClick={() => startUpload(selected.bookingId, type)}
                              title={`Upload ${DOC_LABELS[type]}`}
                              aria-label={`Upload ${DOC_LABELS[type]}`}
                              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[#2D3F33]/10 text-[#2D3F33] hover:bg-[#2D3F33]/5"
                            >
                              <Upload size={16} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="mt-5 flex gap-3 border-t border-[#2D3F33]/10 pt-4">
                <button
                  type="button"
                  onClick={() => setDetailStep(2)}
                  className="flex min-h-11 flex-1 items-center justify-center rounded-lg border border-[#2D3F33]/10 px-4 py-3 font-black text-[#607067] transition hover:bg-[#f7f8f6] md:flex-none md:min-w-52"
                >
                  Back
                </button>
              </div>
            </section>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AgreementCard({
  title,
  doc,
  actionLabel,
  onUpload,
  onApprove,
  onReject,
}: {
  title: string;
  doc?: Doc;
  actionLabel: string;
  onUpload?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
}) {
  return (
    <div className="rounded-xl border border-[#2D3F33]/10 bg-[#f7f8f6] p-4">
      <p className="text-base font-black leading-snug text-[#10251a]">{title}</p>
      <div className="mt-3 rounded-lg bg-white p-3">
        {doc ? (
          <>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[#12251b]">{doc.name || DOC_LABELS[doc.type]}</p>
                <span className={`mt-2 inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${statusClass(doc.status)}`}>{doc.status || "available"}</span>
              </div>
              {doc.fileUrl && (
                <div className="flex shrink-0 items-center gap-2">
                  <a
                    href={getUploadedFileUrl(doc.fileUrl)}
                    target="_blank"
                    rel="noreferrer"
                    title="View document"
                    aria-label="View document"
                    className="grid h-9 w-9 place-items-center rounded-lg border border-[#2D3F33]/10 text-[#2D3F33] hover:bg-[#2D3F33]/5"
                  >
                    <Eye size={16} />
                  </a>
                  <a
                    href={getUploadedFileUrl(doc.fileUrl)}
                    target="_blank"
                    rel="noreferrer"
                    title="Download document"
                    aria-label="Download document"
                    className="grid h-9 w-9 place-items-center rounded-lg border border-[#2D3F33]/10 text-[#2D3F33] hover:bg-[#2D3F33]/5"
                  >
                    <Download size={16} />
                  </a>
                </div>
              )}
            </div>
            {(onApprove || onReject) && (!doc.status || doc.status === "pending") && (
              <div className="mt-3 flex gap-2">
                <button onClick={onApprove} className="min-h-10 flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-bold text-white">Approve</button>
                <button onClick={onReject} className="min-h-10 flex-1 rounded-lg border border-rose-200 px-3 py-2 text-sm font-bold text-rose-700">Reject</button>
              </div>
            )}
            {(onApprove || onReject) && doc.status && doc.status !== "pending" && (
              <div className="mt-3 p-2 rounded-lg bg-gray-50 border border-gray-100 text-center">
                <p className={`text-xs font-bold uppercase ${doc.status === 'approved' ? 'text-emerald-700' : 'text-rose-700'}`}>
                  Decision: {doc.status}
                </p>
                {doc.rejectionReason && (
                   <p className="mt-1 text-[10px] text-rose-600 italic">Reason: {doc.rejectionReason}</p>
                )}
              </div>
            )}
          </>
        ) : (
          <button onClick={onUpload} className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#2D3F33]/30 px-3 py-8 text-sm font-bold text-[#2D3F33]">
            <Upload size={16} /> {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
