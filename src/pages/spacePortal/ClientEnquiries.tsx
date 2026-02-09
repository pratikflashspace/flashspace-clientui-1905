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

export default function ClientEnquiries() {
  const [activeTab, setActiveTab] = useState<"ACTIVE" | "CONVERTED">("ACTIVE");

  const filteredEnquiries = useMemo(() => {
    return ENQUIRIES.filter((e) => {
      if (activeTab === "CONVERTED") return e.status === "CONVERTED";
      return e.status === "NEW" || e.status === "IN_PROGRESS";
    });
  }, [activeTab]);

  return (
    <div className="flex-1">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Client <span className="text-[#3FA69E]">Enquiries</span>
        </h1>
        <p className="mt-2 text-slate-500">
          Manage new leads, ongoing conversations, and conversions.
        </p>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={() => setActiveTab("ACTIVE")}
          className={`rounded-xl px-5 py-2 text-sm font-semibold transition ${
            activeTab === "ACTIVE"
              ? "bg-[#3FA69E] text-white shadow-sm"
              : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          New & In Progress
        </button>

        <button
          onClick={() => setActiveTab("CONVERTED")}
          className={`rounded-xl px-5 py-2 text-sm font-semibold transition ${
            activeTab === "CONVERTED"
              ? "bg-[#3FA69E] text-white shadow-sm"
              : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          Converted
        </button>
      </div>

      {/* Cards */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {filteredEnquiries.map((enquiry) => (
          <EnquiryCard key={enquiry.id} enquiry={enquiry} />
        ))}
      </div>

      {filteredEnquiries.length === 0 && (
        <p className="mt-10 text-center text-slate-500">
          No enquiries found.
        </p>
      )}
    </div>
  );
}

function EnquiryCard({ enquiry }: { enquiry: Enquiry }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {enquiry.clientName}
          </h3>
          <p className="text-sm text-slate-500">{enquiry.companyName}</p>
        </div>

        <StatusPill status={enquiry.status} />
      </div>

      {/* Requested details */}
      <div className="mt-5 space-y-3 text-sm text-slate-600">
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
      <div className="mt-6 flex flex-wrap gap-3">
        <button className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          <Eye size={16} />
          View
        </button>

        <button className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          <Phone size={16} />
          Call
        </button>

        {enquiry.status !== "CONVERTED" && (
          <button className="flex items-center gap-2 rounded-xl bg-[#3FA69E] px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
            <CheckCircle2 size={16} />
            Mark Converted
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
