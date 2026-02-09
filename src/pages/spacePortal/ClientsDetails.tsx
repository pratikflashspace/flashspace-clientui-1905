import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CLIENT_DETAILS } from "@/data/spacePortal/clientDetail";
import { ArrowLeft, Download, FileText, ShieldCheck, User } from "lucide-react";

export default function ClientDetails() {
  const { clientId } = useParams(); // ✅ Changed from 'id' to match route param
  const navigate = useNavigate();

  const client = useMemo(() => {
    if (!clientId) return null;
    // ✅ Find in array instead of accessing as object
    return CLIENT_DETAILS.find(c => c.id === clientId) || null;
  }, [clientId]);

  if (!client) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Client Not Found</h1>
        <p className="text-slate-500">
          No client exists with ID: <span className="font-semibold">{clientId}</span>
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

            <div className="mt-4 flex flex-wrap gap-3">
              <span className="rounded-full bg-emerald-50 px-4 py-1 text-xs font-semibold text-[#3FA69E]">
                Plan: {client.plan}
              </span>

              <span
                className={`rounded-full px-4 py-1 text-xs font-semibold ${
                  client.status === "ACTIVE"
                    ? "bg-emerald-50 text-emerald-700"
                    : client.status === "EXPIRING_SOON"
                    ? "bg-amber-50 text-amber-700"
                    : "bg-rose-50 text-rose-700"
                }`}
              >
                Status: {client.status}
              </span>

              <span
                className={`rounded-full px-4 py-1 text-xs font-semibold ${
                  client.kyc.status === "VERIFIED"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                KYC: {client.kyc.status}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <Download size={16} />
              Download Agreement
            </button>

            <button className="rounded-xl bg-[#3FA69E] px-5 py-3 text-sm font-semibold text-white hover:opacity-90">
              Message Client
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT (Main Info) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Overview */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Overview</h2>
            <p className="mt-1 text-sm text-slate-500">
              Basic client information and plan details.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <InfoRow label="Contact Name" value={client.contactName} />
              <InfoRow label="Email" value={client.email} />
              <InfoRow label="Phone" value={client.phone} />
              <InfoRow label="Space" value={client.space} />
              <InfoRow label="Start Date" value={client.startDate} />
              <InfoRow label="End Date" value={client.endDate} />
            </div>
          </div>

          {/* Booking History */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Booking History
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Recent bookings done by this client.
            </p>

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
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            b.status === "CONFIRMED"
                              ? "bg-emerald-50 text-emerald-700"
                              : b.status === "PENDING"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {b.status}
                        </span>
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
          </div>

          {/* Invoice History */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Invoices</h2>
            <p className="mt-1 text-sm text-slate-500">
              Payment history for this client.
            </p>

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
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            inv.status === "PAID"
                              ? "bg-emerald-50 text-emerald-700"
                              : inv.status === "PENDING"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {inv.status}
                        </span>
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
          </div>
        </div>

        {/* RIGHT (KYC + Agreement) */}
        <div className="flex flex-col gap-6">
          {/* KYC Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-[#3FA69E]" size={20} />
              <h2 className="text-lg font-bold text-slate-900">KYC Details</h2>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <p className="text-slate-600">Status: <span className="font-semibold text-slate-900">{client.kyc.status}</span></p>
              <p className="text-slate-600">Documents: <span className="font-semibold text-slate-900">{client.kyc.documents.length} uploaded</span></p>
            </div>

            <button className="mt-6 w-full rounded-xl bg-[#3FA69E] px-4 py-3 text-sm font-semibold text-white hover:opacity-90">
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
              <InfoRow label="Signed Date" value={client.agreement.signedAt || "-"} />
              <InfoRow label="Valid Till" value={client.agreement.validTill || "-"} />
            </div>

            <button className="mt-6 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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
