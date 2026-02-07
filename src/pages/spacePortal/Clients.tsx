import { useMemo, useState } from "react";
import { CLIENTS } from "@/data/spacePortal/clients";
import type { Client } from "@/types/spacePortal/client";
import { MapPin, Eye, MessageSquare, MoreVertical, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Clients() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  console.log("🔍 CLIENTS imported:", CLIENTS);
  console.log("🔍 CLIENTS length:", CLIENTS.length);


  const filteredClients = useMemo(() => {
    const result = CLIENTS.filter((client) => {
      const q = query.toLowerCase();
      return (
        client.companyName.toLowerCase().includes(q) ||
        client.contactName.toLowerCase().includes(q) ||
        client.id.toLowerCase().includes(q) ||
        client.space.toLowerCase().includes(q)
      );
    });
    console.log("🔍 Filtered clients:", result.length);
    return result;
  }, [query]);
  console.log("🔍 Rendering with clients:", filteredClients.length);

  return (
    <div className="flex-1">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          My <span className="text-[#3FA69E]">Clients</span>
        </h1>
        <p className="mt-2 text-slate-500">
          Manage all your client relationships
        </p>
      </div>

      {/* Search + Filter */}
      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clients..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>

        <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          <Filter size={18} />
          Filter
        </button>
      </div>

      {/* Table Card */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50">
            <tr className="text-slate-600">
              <th className="px-6 py-4 font-semibold">Client</th>
              <th className="px-6 py-4 font-semibold">Plan</th>
              <th className="px-6 py-4 font-semibold">Space</th>
              <th className="px-6 py-4 font-semibold">Duration</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">KYC</th>
              <th className="px-6 py-4 text-center font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredClients.map((client) => (
              <ClientRow
                key={client.id}
                client={client}
                onView={() => navigate(`/spaceportal/clients/${client.id}`)}
              />
            ))}
          </tbody>
        </table>

        {filteredClients.length === 0 && (
          <p className="p-6 text-center text-slate-500">No clients found.</p>
        )}
      </div>
    </div>
  );
}

function ClientRow({
  client,
  onView,
}: {
  client: Client;
  onView: () => void;
}) {
  const initials = useMemo(() => {
    return client.companyName
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  }, [client.companyName]);

  return (
    <tr className="border-t border-slate-100 hover:bg-slate-50">
      {/* Client */}
      <td className="px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-[#3FA69E]">
            {initials}
          </div>

          <div>
            <p className="font-semibold text-slate-900">{client.companyName}</p>
            <p className="text-sm text-slate-500">{client.contactName}</p>
          </div>
        </div>
      </td>

      {/* Plan */}
      <td className="px-6 py-5 font-semibold text-slate-800">{client.plan}</td>

      {/* Space */}
      <td className="px-6 py-5 text-slate-600">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-slate-400" />
          {client.space}
        </div>
      </td>

      {/* Duration */}
      <td className="px-6 py-5 text-slate-600">
        <p>{client.startDate}</p>
        <p className="text-xs text-slate-400">to {client.endDate}</p>
      </td>

      {/* Status */}
      <td className="px-6 py-5">
        <span
          className={`rounded-full px-4 py-1 text-xs font-semibold ${
            client.status === "ACTIVE"
              ? "bg-emerald-50 text-emerald-700"
              : client.status === "EXPIRING_SOON"
              ? "bg-amber-50 text-amber-700"
              : "bg-rose-50 text-rose-700"
          }`}
        >
          {client.status === "ACTIVE"
            ? "Active"
            : client.status === "EXPIRING_SOON"
            ? "Expiring Soon"
            : "Inactive"}
        </span>
      </td>

      {/* KYC */}
      <td className="px-6 py-5">
        <span
          className={`rounded-full px-4 py-1 text-xs font-semibold ${
            client.kycStatus === "VERIFIED"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {client.kycStatus === "VERIFIED" ? "KYC Verified" : "KYC Pending"}
        </span>
      </td>

      {/* Actions */}
      <td className="px-6 py-5">
        <div className="flex items-center justify-center gap-4 text-slate-500">
          <button onClick={onView} className="hover:text-slate-900" aria-label="Quick preview" type="button">
            <Eye size={18} />
          </button>

          <button className="hover:text-slate-900" aria-label="Send message" type="button">
            <MessageSquare size={18} />
          </button>

          <button className="hover:text-slate-900" aria-label="More options" type="button">
            <MoreVertical size={18} />
          </button>

          <button
            onClick={onView}
            className="rounded-lg bg-[#3FA69E] px-4 py-2 text-xs font-semibold text-white hover:opacity-90" type="button"
          >
            View
          </button>
        </div>
      </td>
    </tr>
  );
}
