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

export default function ClientEnquiries() {
  const [activeTab, setActiveTab] = useState<"ACTIVE" | "CONVERTED">("ACTIVE");
  const [enquiries, setEnquiries] = useState<Enquiry[]>(ENQUIRIES);
  const [activeEnquiry, setActiveEnquiry] = useState<Enquiry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      if (activeTab === "CONVERTED") return e.status === "CONVERTED";
      return e.status === "NEW" || e.status === "IN_PROGRESS";
    });
  }, [activeTab, enquiries]);

  const handleView = (enquiry: Enquiry) => {
    setActiveEnquiry(enquiry);
    setIsDialogOpen(true);
  };

  const updateEnquiryStatus = (id: string, status: EnquiryStatus) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status } : e))
    );

    setActiveEnquiry((prev) =>
      prev && prev.id === id ? { ...prev, status } : prev
    );
  };

  return (
    <div className="flex-1">
      {/* Tabs */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          onClick={() => setActiveTab("ACTIVE")}
          className={`w-full rounded-xl px-4 py-2 text-sm font-semibold transition sm:w-auto sm:px-5 ${
            activeTab === "ACTIVE"
              ? "bg-[#3FA69E] text-white shadow-sm"
              : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          New & In Progress
        </button>

        <button
          onClick={() => setActiveTab("CONVERTED")}
          className={`w-full rounded-xl px-4 py-2 text-sm font-semibold transition sm:w-auto sm:px-5 ${
            activeTab === "CONVERTED"
              ? "bg-[#3FA69E] text-white shadow-sm"
              : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          Converted
        </button>
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

      {filteredEnquiries.length === 0 && (
        <p className="mt-10 text-center text-slate-500">
          No enquiries found.
        </p>
      )}

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

              <div className="mt-5 grid gap-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-slate-400" />
                  <span className="font-semibold text-slate-800">
                    {activeEnquiry.requestedPlan}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-slate-400" />
                  <span>{activeEnquiry.requestedSpace}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-slate-400" />
                  <span>{activeEnquiry.phone}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-slate-400" />
                  <span>{activeEnquiry.email}</span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">
                  <span>Created: {activeEnquiry.createdAt}</span>
                  <StatusPill status={activeEnquiry.status} />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-end">
                <a
                  href={`tel:${activeEnquiry.phone.replace(/\s+/g, "")}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:w-auto sm:px-4 sm:text-sm"
                >
                  <Phone size={16} />
                  Call
                </a>

                <a
                  href={`mailto:${activeEnquiry.email}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:w-auto sm:px-4 sm:text-sm"
                >
                  <Mail size={16} />
                  Email
                </a>

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
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-slate-400" />
          <span className="font-semibold text-slate-800">
            {enquiry.requestedPlan}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-slate-400" />
          <span>{enquiry.requestedSpace}</span>
        </div>

        <div className="flex items-center gap-2">
          <Phone size={16} className="text-slate-400" />
          <span>{enquiry.phone}</span>
        </div>

        <div className="flex items-center gap-2">
          <Mail size={16} className="text-slate-400" />
          <span>{enquiry.email}</span>
        </div>

        <p className="text-xs text-slate-400">
          Created: {enquiry.createdAt}
        </p>
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

        <a
          href={`tel:${enquiry.phone.replace(/\s+/g, "")}`}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:w-auto sm:px-4 sm:text-sm"
        >
          <Phone size={16} />
          Call
        </a>

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
