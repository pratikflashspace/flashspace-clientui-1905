import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { ClientDetails } from "@/types/spacePortal/clientDetails";

import {
  ArrowLeft,
  Download,
  FileText,
  ShieldCheck,
  Mail,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { userDashboardService } from "@/services/userDashboard.service";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * ClientDetails Page
 *
 * Shows:
 * - Client overview
 * - Booking history
 * - Invoice history
 * - KYC documents
 * - Agreement details
 *
 * Backend-ready:
 * - Replace CLIENT_DETAILS with GET /api/clients/:id response.
 */
export default function ClientDetails() {
  const { clientId } = useParams(); // must match route param
  const navigate = useNavigate();

  const [client, setClient] = useState<ClientDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<{
    url: string;
    type: string;
    label: string;
  } | null>(null);

  /**
   * Fetch client details from backend
   */
  useEffect(() => {
    const fetchClientDetails = async () => {
      if (!clientId) return;
      try {
        setLoading(true);
        const response =
          await userDashboardService.getPartnerClientDetails(clientId);
        if (response.success && response.data) {
          setClient(response.data);
        } else {
          toast.error(response.message || "Failed to load client details");
        }
      } catch (error) {
        console.error("Failed to fetch client details:", error);
        toast.error("An error occurred while fetching client details");
      } finally {
        setLoading(false);
      }
    };
    fetchClientDetails();
  }, [clientId]);

  /**
   * Opens external file link safely.
   * Used for agreement PDF and KYC documents.
   */
  const handleOpenLink = (url: string | undefined, label: string) => {
    if (!url || url === "#") {
      toast.error(`${label} is not available yet.`);
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  /**
   * Opens the in-page document viewer.
   */
  const handleViewDoc = (
    url: string | undefined,
    type: string,
    label: string,
  ) => {
    if (!url || url === "#") {
      toast.error(`${label} is not available yet.`);
      return;
    }
    setViewingDoc({ url, type, label });
    setViewerOpen(true);
  };

  /**
   * If loading
   */
  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#3FA69E]" />
        <p className="mt-4 text-slate-500 font-medium">
          Loading client details...
        </p>
      </div>
    );
  }

  /**
   * If client not found show fallback UI.
   */
  if (!client) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Client Not Found</h1>

        <p className="text-slate-500">
          No client exists with ID:{" "}
          <span className="font-semibold">{clientId}</span>
        </p>

        <button
          onClick={() => navigate("/spaceportal/clients")}
          className="w-fit rounded-xl bg-[#3FA69E] px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          Go Back to Clients
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Back Button */}
      <button
        onClick={() => navigate("/spaceportal/clients")}
        className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
      >
        <ArrowLeft size={16} />
        Back to Clients
      </button>

      {/* Header Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {client.companyName}
            </h1>

            <p className="mt-2 text-slate-500">
              Client ID:{" "}
              <span className="font-semibold text-slate-700">{client.id}</span>
            </p>

            {/* Tags */}
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="rounded-full bg-emerald-50 px-4 py-1 text-xs font-semibold text-[#3FA69E]">
                Plan: {client.plan}
              </span>

              <ClientStatusBadge status={client.status} />
              <KycStatusBadge status={client.kyc.status} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() =>
                handleOpenLink(client.agreement.agreementUrl, "Agreement")
              }
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Download size={16} />
              Download Agreement
            </button>

            <a
              href={`mailto:${client.email}?subject=Flashspace%20Partnership&body=Hi%20${encodeURIComponent(
                client.contactName,
              )},%0A%0A`}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#3FA69E] px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              <Mail size={16} />
              Message Client
            </a>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Overview */}
          <SectionCard
            title="Overview"
            description="Basic client information and plan details."
          >
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <InfoRow label="Contact Name" value={client.contactName} />
              <InfoRow label="Email" value={client.email} />
              <InfoRow label="Phone" value={client.phone} />
              <InfoRow label="Space" value={client.space} />
              <InfoRow label="Start Date" value={client.startDate} />
              <InfoRow label="End Date" value={client.endDate} />
            </div>
          </SectionCard>

          {/* Booking History */}
          <SectionCard
            title="Booking History"
            description="Recent bookings done by this client."
          >
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-3">Booking ID</th>
                    <th>Date</th>
                    <th>Slot</th>
                    <th>Status</th>
                    <th className="text-right">Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {client.bookings.map((b) => (
                    <tr
                      key={b.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="py-3 font-semibold text-slate-900">
                        {b.id}
                      </td>
                      <td className="text-slate-700">{b.date}</td>
                      <td className="text-slate-600">{b.slot}</td>
                      <td>
                        <BookingStatusBadge status={b.status} />
                      </td>
                      <td className="text-right font-semibold text-slate-900">
                        ₹{b.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {client.bookings.length === 0 && (
                <p className="mt-6 text-center text-slate-500">
                  No bookings found.
                </p>
              )}
            </div>
          </SectionCard>

          {/* Invoice History */}
          <SectionCard
            title="Invoices"
            description="Payment history for this client."
          >
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-3">Invoice #</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th className="text-right">Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {client.invoices.map((inv) => (
                    <tr
                      key={inv.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="py-3 font-semibold text-slate-900">
                        {inv.invoiceNumber}
                      </td>
                      <td className="text-slate-600">{inv.createdAt}</td>
                      <td>
                        <InvoiceStatusBadge status={inv.status} />
                      </td>
                      <td className="text-right font-semibold text-slate-900">
                        ₹{inv.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {client.invoices.length === 0 && (
                <p className="mt-6 text-center text-slate-500">
                  No invoices found.
                </p>
              )}
            </div>
          </SectionCard>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col gap-6">
          {/* KYC Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-[#3FA69E]" size={20} />
              <h2 className="text-lg font-bold text-slate-900">KYC Details</h2>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <p className="text-slate-600">
                Status:{" "}
                <span className="font-semibold text-slate-900">
                  {client.kyc.status}
                </span>
              </p>

              <p className="text-slate-600">
                Documents:{" "}
                <span className="font-semibold text-slate-900">
                  {client.kyc.documents.length} uploaded
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!client.kyc.documents.length) {
                  toast.error("No uploaded documents found.");
                  return;
                }
                setIsDocsOpen(true);
              }}
              className="mt-6 w-full rounded-xl bg-[#3FA69E] px-4 py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              View Uploaded Docs
            </button>
          </div>

          {/* Agreement Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <FileText className="text-[#3FA69E]" size={20} />
              <h2 className="text-lg font-bold text-slate-900">
                Agreement Details
              </h2>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <InfoRow label="Status" value={client.agreement.status} />
              <InfoRow
                label="Signed Date"
                value={client.agreement.signedAt || "-"}
              />
              <InfoRow
                label="Valid Till"
                value={client.agreement.validTill || "-"}
              />
            </div>

            <button
              type="button"
              onClick={() =>
                handleOpenLink(client.agreement.agreementUrl, "Agreement")
              }
              className="mt-6 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Uploaded Docs Dialog */}
      <Dialog open={isDocsOpen} onOpenChange={setIsDocsOpen}>
        <DialogContent className="max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-slate-900">
              Uploaded Documents
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Review the client KYC documents.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-3">
            {client.kyc.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {doc.type}
                  </p>
                  <p className="text-xs text-slate-500">
                    Uploaded: {doc.uploadedAt}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleViewDoc(
                        doc.fileUrl,
                        doc.type,
                        `${doc.type} document`,
                      )
                    }
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    View
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleOpenLink(doc.fileUrl, `${doc.type} document`)
                    }
                    className="rounded-lg bg-[#3FA69E] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Document Viewer Modal */}
      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xl flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-slate-900">
              {viewingDoc?.label || "Document Preview"}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 flex-1 flex items-center justify-center bg-slate-50 rounded-xl overflow-hidden min-h-[50vh]">
            {viewingDoc?.url ? (
              viewingDoc.type.toLowerCase().includes("video") ? (
                <video
                  src={viewingDoc.url}
                  controls
                  autoPlay
                  className="max-h-[70vh] w-auto h-auto"
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={viewingDoc.url}
                  alt={viewingDoc.label}
                  className="max-h-[70vh] w-auto h-auto object-contain"
                />
              )
            ) : (
              <p className="text-slate-500">No preview available</p>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() =>
                handleOpenLink(viewingDoc?.url, viewingDoc?.label || "Document")
              }
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Download size={16} />
              Open in New Tab
            </button>
            <button
              onClick={() => setViewerOpen(false)}
              className="rounded-xl bg-[#3FA69E] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/**
 * Reusable Section Card
 * Used for Overview, Booking History, Invoices etc.
 */
function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
      {children}
    </div>
  );
}

/**
 * Info row component
 */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs font-semibold text-slate-500">{label}</span>
      <span className="mt-1 text-sm font-semibold text-slate-900">
        {value || "-"}
      </span>
    </div>
  );
}

/**
 * Generic Badge Component
 * Used to remove repeated badge code.
 */
function Badge({ label, className }: { label: string; className: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap ${className}`}
    >
      {label}
    </span>
  );
}

/**
 * Client Status Badge
 */
function ClientStatusBadge({ status }: { status: string }) {
  const config =
    status === "ACTIVE"
      ? {
          className: "bg-emerald-50 text-emerald-700",
          label: `Status: ${status}`,
        }
      : status === "EXPIRING_SOON"
        ? {
            className: "bg-amber-50 text-amber-700",
            label: `Status: ${status}`,
          }
        : { className: "bg-rose-50 text-rose-700", label: `Status: ${status}` };

  return <Badge label={config.label} className={config.className} />;
}

/**
 * KYC Status Badge
 */
function KycStatusBadge({ status }: { status: string }) {
  const config =
    status === "VERIFIED"
      ? { className: "bg-emerald-50 text-emerald-700", label: `KYC: ${status}` }
      : { className: "bg-amber-50 text-amber-700", label: `KYC: ${status}` };

  return <Badge label={config.label} className={config.className} />;
}

/**
 * Booking Status Badge
 */
function BookingStatusBadge({ status }: { status: string }) {
  const config =
    status === "CONFIRMED"
      ? { className: "bg-emerald-50 text-emerald-700", label: status }
      : status === "PENDING"
        ? { className: "bg-amber-50 text-amber-700", label: status }
        : { className: "bg-rose-50 text-rose-700", label: status };

  return <Badge label={config.label} className={config.className} />;
}

/**
 * Invoice Status Badge
 */
function InvoiceStatusBadge({ status }: { status: string }) {
  const config =
    status === "PAID"
      ? { className: "bg-emerald-50 text-emerald-700", label: status }
      : status === "PENDING"
        ? { className: "bg-amber-50 text-amber-700", label: status }
        : { className: "bg-rose-50 text-rose-700", label: status };

  return <Badge label={config.label} className={config.className} />;
}
