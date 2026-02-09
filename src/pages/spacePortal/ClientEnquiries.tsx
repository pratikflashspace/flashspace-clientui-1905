import { useMemo, useState } from "react";

import { ENQUIRIES } from "@/data/spacePortal/enquiries";
import type { Enquiry, EnquiryStatus } from "@/types/spacePortal/enquiry";

import {
  Phone,
  Mail,
  MapPin,
  FileText,
  Eye,
  CheckCircle2,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * ClientEnquiries Page
 *
 * Features:
 * - Tabs (Active vs Converted)
 * - Enquiry cards listing
 * - Dialog view with full details
 * - Convert / Reopen enquiry (currently frontend only)
 *
 * Backend-ready:
 * - Later ENQUIRIES will be replaced with API data
 * - updateEnquiryStatus() will call PATCH endpoint
 */
export default function ClientEnquiries() {
  /**
   * activeTab decides which enquiries to show.
   * ACTIVE -> NEW + IN_PROGRESS
   * CONVERTED -> CONVERTED
   */
  const [activeTab, setActiveTab] = useState<"ACTIVE" | "CONVERTED">("ACTIVE");

  /**
   * enquiries is currently mock state.
   * Later it will come from backend (GET /api/enquiries).
   */
  const [enquiries, setEnquiries] = useState<Enquiry[]>(ENQUIRIES);

  /**
   * activeEnquiry is used inside Dialog (View details).
   */
  const [activeEnquiry, setActiveEnquiry] = useState<Enquiry | null>(null);

  /**
   * Dialog open state.
   */
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  /**
   * Filter enquiries based on active tab.
   */
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      if (activeTab === "CONVERTED") return e.status === "CONVERTED";
      return e.status === "NEW" || e.status === "IN_PROGRESS";
    });
  }, [activeTab, enquiries]);

  /**
   * Open dialog with selected enquiry details.
   */
  const handleView = (enquiry: Enquiry) => {
    setActiveEnquiry(enquiry);
    setIsDialogOpen(true);
  };

  /**
   * Update enquiry status in local state.
   *
   * Backend-ready:
   * Later this will call something like:
   * PATCH /api/enquiries/:id { status }
   */
  const updateEnquiryStatus = (id: string, status: EnquiryStatus) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status } : e))
    );

    // Keep dialog enquiry in sync
    setActiveEnquiry((prev) =>
      prev && prev.id === id ? { ...prev, status } : prev
    );
  };

  return (
    <div className="flex-1">
      {/* Tabs */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <TabButton
          active={activeTab === "ACTIVE"}
          onClick={() => setActiveTab("ACTIVE")}
        >
          New & In Progress
        </TabButton>

        <TabButton
          active={activeTab === "CONVERTED"}
          onClick={() => setActiveTab("CONVERTED")}
        >
          Converted
        </TabButton>
      </div>

      {/* Cards */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filteredEnquiries.map((enquiry) => (
          <EnquiryCard
            key={enquiry.id}
            enquiry={enquiry}
            onView={() => handleView(enquiry)}
            onConvert={() => updateEnquiryStatus(enquiry.id, "CONVERTED")}
            onReopen={() => updateEnquiryStatus(enquiry.id, "IN_PROGRESS")}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredEnquiries.length === 0 && (
        <p className="mt-10 text-center text-slate-500">
          No enquiries found.
        </p>
      )}

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
          {activeEnquiry ? (
            <div>
              <DialogHeader>
                <DialogTitle className="text-slate-900">
                  {activeEnquiry.clientName}
                </DialogTitle>
                <DialogDescription className="text-slate-500">
                  {activeEnquiry.companyName}
                </DialogDescription>
              </DialogHeader>

              {/* Details */}
              <div className="mt-5 grid gap-3 text-sm text-slate-600">
                <InfoRow
                  icon={<FileText size={16} className="text-slate-400" />}
                  value={
                    <span className="font-semibold text-slate-800">
                      {activeEnquiry.requestedPlan}
                    </span>
                  }
                />

                <InfoRow
                  icon={<MapPin size={16} className="text-slate-400" />}
                  value={<span>{activeEnquiry.requestedSpace}</span>}
                />

                <InfoRow
                  icon={<Phone size={16} className="text-slate-400" />}
                  value={<span>{activeEnquiry.phone}</span>}
                />

                <InfoRow
                  icon={<Mail size={16} className="text-slate-400" />}
                  value={<span>{activeEnquiry.email}</span>}
                />

                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">
                  <span>Created: {activeEnquiry.createdAt}</span>
                  <StatusPill status={activeEnquiry.status} />
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-end">
                <ContactButtons enquiry={activeEnquiry} />

                {activeEnquiry.status !== "CONVERTED" && (
                  <button
                    type="button"
                    onClick={() =>
                      updateEnquiryStatus(activeEnquiry.id, "CONVERTED")
                    }
                    className="col-span-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#3FA69E] px-3 py-2 text-xs font-semibold text-white hover:opacity-90 sm:w-auto sm:px-4 sm:text-sm"
                  >
                    <CheckCircle2 size={16} />
                    Mark Converted
                  </button>
                )}

                {activeEnquiry.status === "CONVERTED" && (
                  <button
                    type="button"
                    onClick={() =>
                      updateEnquiryStatus(activeEnquiry.id, "IN_PROGRESS")
                    }
                    className="col-span-2 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:w-auto sm:px-4 sm:text-sm"
                  >
                    Reopen Enquiry
                  </button>
                )}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/**
 * Reusable tab button (UI remains same)
 */
function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-xl px-4 py-2 text-sm font-semibold transition sm:w-auto sm:px-5 ${
        active
          ? "bg-[#3FA69E] text-white shadow-sm"
          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}

/**
 * Enquiry Card Component (List View)
 */
function EnquiryCard({
  enquiry,
  onView,
  onConvert,
  onReopen,
}: {
  enquiry: Enquiry;
  onView: () => void;
  onConvert: () => void;
  onReopen: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 sm:text-lg">
            {enquiry.clientName}
          </h3>
          <p className="text-xs text-slate-500 sm:text-sm">
            {enquiry.companyName}
          </p>
        </div>

        <StatusPill status={enquiry.status} />
      </div>

      {/* Requested details */}
      <div className="mt-4 space-y-3 text-sm text-slate-600">
        <InfoRow
          icon={<FileText size={16} className="text-slate-400" />}
          value={
            <span className="font-semibold text-slate-800">
              {enquiry.requestedPlan}
            </span>
          }
        />

        <InfoRow
          icon={<MapPin size={16} className="text-slate-400" />}
          value={<span>{enquiry.requestedSpace}</span>}
        />

        <InfoRow
          icon={<Phone size={16} className="text-slate-400" />}
          value={<span>{enquiry.phone}</span>}
        />

        <InfoRow
          icon={<Mail size={16} className="text-slate-400" />}
          value={<span>{enquiry.email}</span>}
        />

        <p className="text-xs text-slate-400">Created: {enquiry.createdAt}</p>
      </div>

      {/* Actions */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:flex sm:flex-wrap">
        <button
          type="button"
          onClick={onView}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:w-auto sm:px-4 sm:text-sm"
        >
          <Eye size={16} />
          View
        </button>

        <ContactButtons enquiry={enquiry} />

        {enquiry.status !== "CONVERTED" && (
          <button
            type="button"
            onClick={onConvert}
            className="col-span-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#3FA69E] px-3 py-2 text-xs font-semibold text-white hover:opacity-90 sm:w-auto sm:px-4 sm:text-sm"
          >
            <CheckCircle2 size={16} />
            Mark Converted
          </button>
        )}

        {enquiry.status === "CONVERTED" && (
          <button
            type="button"
            onClick={onReopen}
            className="col-span-2 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:w-auto sm:px-4 sm:text-sm"
          >
            Reopen Enquiry
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Reusable contact buttons (Call + Email)
 * Used both in Card and Dialog (removes duplication).
 */
function ContactButtons({ enquiry }: { enquiry: Enquiry }) {
  const cleanPhone = enquiry.phone.replace(/\s+/g, "");

  return (
    <>
      <a
        href={`tel:${cleanPhone}`}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:w-auto sm:px-4 sm:text-sm"
      >
        <Phone size={16} />
        Call
      </a>

      <a
        href={`mailto:${enquiry.email}`}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:w-auto sm:px-4 sm:text-sm"
      >
        <Mail size={16} />
        Email
      </a>
    </>
  );
}

/**
 * Reusable info row (icon + value)
 * Used to remove repeated JSX.
 */
function InfoRow({
  icon,
  value,
}: {
  icon: React.ReactNode;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      {value}
    </div>
  );
}

/**
 * Status pill (NEW, IN_PROGRESS, CONVERTED)
 * UI stays same.
 */
function StatusPill({ status }: { status: EnquiryStatus }) {
  const style =
    status === "NEW"
      ? "bg-blue-50 text-blue-700"
      : status === "IN_PROGRESS"
      ? "bg-amber-50 text-amber-700"
      : "bg-emerald-50 text-emerald-700";

  const label =
    status === "NEW"
      ? "New"
      : status === "IN_PROGRESS"
      ? "In Progress"
      : "Converted";

  return (
    <span className={`rounded-full px-4 py-1 text-xs font-semibold ${style}`}>
      {label}
    </span>
  );
}
