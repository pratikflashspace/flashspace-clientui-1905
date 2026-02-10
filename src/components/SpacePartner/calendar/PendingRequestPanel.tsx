import type { BookingRequest } from "@/types/spacePortal/booking";
import { CheckCircle2, XCircle } from "lucide-react";

type PendingRequestsPanelProps = {
  requests: BookingRequest[];
  requestStatus: Record<string, "PENDING" | "APPROVED" | "DECLINED">;
  onApprove: (id: string) => void;
  onDecline: (id: string) => void;
  onUndoDecline: (id: string) => void;
};

export default function PendingRequestsPanel({
  requests,
  requestStatus,
  onApprove,
  onDecline,
  onUndoDecline,
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

              {requestStatus[req.id] === "APPROVED" ? (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Approved
                </span>
              ) : requestStatus[req.id] === "DECLINED" ? (
                <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                  Declined
                </span>
              ) : (
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  Pending
                </span>
              )}
            </div>

            {requestStatus[req.id] === "PENDING" ? (
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={() => onApprove(req.id)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3FA69E] px-3 py-2 text-xs font-semibold text-white hover:opacity-90 sm:flex-1 sm:min-w-[130px] sm:px-4 sm:text-sm"
                >
                  <CheckCircle2 size={16} />
                  Approve
                </button>

                <button
                  type="button"
                  onClick={() => onDecline(req.id)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 sm:flex-1 sm:min-w-[130px] sm:px-4 sm:text-sm"
                >
                  <XCircle size={16} />
                  Decline
                </button>
              </div>
            ) : (
              <div className="mt-4 flex flex-col gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-center text-xs font-semibold text-slate-500">
                <span>
                  This request has been{" "}
                  {requestStatus[req.id] === "APPROVED"
                    ? "approved"
                    : "declined"}
                  .
                </span>
                {requestStatus[req.id] === "DECLINED" && (
                  <button
                    type="button"
                    onClick={() => onUndoDecline(req.id)}
                    className="mx-auto w-fit rounded-lg border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Undo
                  </button>
                )}
              </div>
            )}
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
