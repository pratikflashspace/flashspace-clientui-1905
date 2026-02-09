import type { BookingRequest } from "@/types/spacePortal/booking";
import { CheckCircle2, XCircle } from "lucide-react";

type PendingRequestsPanelProps = {
  requests: BookingRequest[];
};

export default function PendingRequestsPanel({
  requests,
}: PendingRequestsPanelProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900">Pending Requests</h3>
      <p className="text-sm text-slate-500">
        Approve or reject upcoming booking requests.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className="rounded-xl border border-slate-200 bg-slate-50 p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-900">{req.clientName}</p>
                <p className="text-sm text-slate-600">{req.space}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {req.requestedDate} • {req.requestedTime}
                </p>
              </div>

              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                Pending
              </span>
            </div>

            <div className="mt-4 flex gap-2">
              <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#3FA69E] px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
                <CheckCircle2 size={16} />
                Approve
              </button>

              <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                <XCircle size={16} />
                Reject
              </button>
            </div>
          </div>
        ))}

        {requests.length === 0 && (
          <p className="text-center text-sm text-slate-500">
            No pending requests.
          </p>
        )}
      </div>
    </div>
  );
}
