import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CLIENTS } from "@/data/spacePortal/clients";
import type {
  Client,
  ClientPlan,
  ClientStatus,
  KycStatus,
} from "@/types/spacePortal/client";

import { MapPin, Eye, MessageSquare, MoreVertical, Filter } from "lucide-react";

import { useSpacePortalSearch } from "@/contexts/SpacePortalSearchContext";
import SelectBox from "@/components/ui/SpacePartner/SelectionBox";

/**
 * Clients Page
 *
 * Features:
 * - Global search integration (query from context)
 * - Filters (Status, Plan, KYC)
 * - Client listing in table
 * - Navigate to client detail page
 *
 * Backend-ready:
 * - Later CLIENTS will be replaced with API response.
 * - Filters + query will be passed to backend via query params.
 */
export default function Clients() {
  const navigate = useNavigate();
  const { query } = useSpacePortalSearch();

  /**
   * Filters state (UI dropdown filters)
   */
  const [statusFilter, setStatusFilter] = useState<ClientStatus | "ALL">("ALL");
  const [planFilter, setPlanFilter] = useState<ClientPlan | "ALL">("ALL");
  const [kycFilter, setKycFilter] = useState<KycStatus | "ALL">("ALL");

  /**
   * Filter dropdown options (keeps JSX clean)
   */
  const statusOptions = useMemo(
    () => [
      { label: "All Status", value: "ALL" },
      { label: "Active", value: "ACTIVE" },
      { label: "Expiring Soon", value: "EXPIRING_SOON" },
      { label: "Inactive", value: "INACTIVE" },
    ],
    []
  );

  const planOptions = useMemo(
    () => [
      { label: "All Plans", value: "ALL" },
      { label: "Virtual Office Premium", value: "Virtual Office Premium" },
      { label: "Virtual Office Standard", value: "Virtual Office Standard" },
      { label: "Team Space", value: "Team Space" },
      { label: "Hot Desk Monthly", value: "Hot Desk Monthly" },
    ],
    []
  );

  const kycOptions = useMemo(
    () => [
      { label: "All KYC", value: "ALL" },
      { label: "Verified", value: "VERIFIED" },
      { label: "Pending", value: "PENDING" },
    ],
    []
  );

  /**
   * Normalized search query
   */
  const normalizedQuery = useMemo(() => query.trim().toLowerCase(), [query]);

  /**
   * Small helper for filtering.
   */
  const matchesFilter = <T,>(filter: T | "ALL", value: T) => {
    return filter === "ALL" ? true : filter === value;
  };

  /**
   * Filtered clients list based on:
   * - query
   * - status filter
   * - plan filter
   * - kyc filter
   */
  const filteredClients = useMemo(() => {
    return CLIENTS.filter((client) => {
      const matchesQuery =
        client.companyName.toLowerCase().includes(normalizedQuery) ||
        client.contactName.toLowerCase().includes(normalizedQuery) ||
        client.id.toLowerCase().includes(normalizedQuery) ||
        client.space.toLowerCase().includes(normalizedQuery);

      const matchesStatus = matchesFilter(statusFilter, client.status);
      const matchesPlan = matchesFilter(planFilter, client.plan);
      const matchesKyc = matchesFilter(kycFilter, client.kycStatus);

      return matchesQuery && matchesStatus && matchesPlan && matchesKyc;
    });
  }, [normalizedQuery, statusFilter, planFilter, kycFilter]);

  return (
    <div className="flex-1">
      {/* Search + Filter */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-slate-700">
          <Filter size={18} />
          <p className="text-sm font-semibold">Filters</p>
        </div>

        <p className="mt-1 text-xs text-slate-500">
          Narrow down clients by status, plan, and KYC.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
          <SelectBox
            value={statusFilter}
            onChange={(val) => setStatusFilter(val as ClientStatus | "ALL")}
            options={statusOptions}
          />

          <SelectBox
            value={planFilter}
            onChange={(val) => setPlanFilter(val as ClientPlan | "ALL")}
            options={planOptions}
          />

          <SelectBox
            value={kycFilter}
            onChange={(val) => setKycFilter(val as KycStatus | "ALL")}
            options={kycOptions}
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
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

        {/* Empty State */}
        {filteredClients.length === 0 && (
          <p className="p-6 text-center text-slate-500">No clients found.</p>
        )}
      </div>
    </div>
  );
}

/**
 * Client Row Component
 * Displays one client record in table.
 */
function ClientRow({
  client,
  onView,
}: {
  client: Client;
  onView: () => void;
}) {
  /**
   * Create initials from company name.
   * Example: "Flash Space" => "FS"
   */
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
        <StatusPill status={client.status} />
      </td>

      {/* KYC */}
      <td className="px-6 py-5">
        <KycPill status={client.kycStatus} />
      </td>

      {/* Actions */}
      <td className="px-6 py-5">
        <div className="flex items-center justify-center gap-4 text-slate-500">
          <button
            onClick={onView}
            className="hover:text-slate-900"
            aria-label="Quick preview"
            type="button"
          >
            <Eye size={18} />
          </button>

          <button
            className="hover:text-slate-900"
            aria-label="Send message"
            type="button"
          >
            <MessageSquare size={18} />
          </button>

          <button
            className="hover:text-slate-900"
            aria-label="More options"
            type="button"
          >
            <MoreVertical size={18} />
          </button>

          <button
            onClick={onView}
            className="rounded-lg bg-[#3FA69E] px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
            type="button"
          >
            View
          </button>
        </div>
      </td>
    </tr>
  );
}

/**
 * Status pill component
 * Keeps UI consistent + avoids repeated ternary styling.
 */
function StatusPill({ status }: { status: ClientStatus }) {
  const config =
    status === "ACTIVE"
      ? { label: "Active", className: "bg-emerald-50 text-emerald-700" }
      : status === "EXPIRING_SOON"
      ? { label: "Expiring Soon", className: "bg-amber-50 text-amber-700" }
      : { label: "Inactive", className: "bg-rose-50 text-rose-700" };

  return (
    <span
      className={`rounded-full px-4 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}

/**
 * KYC pill component
 */
function KycPill({ status }: { status: KycStatus }) {
  const config =
    status === "VERIFIED"
      ? { label: "KYC Verified", className: "bg-emerald-50 text-emerald-700" }
      : { label: "KYC Pending", className: "bg-amber-50 text-amber-700" };

  return (
    <span
      className={`rounded-full px-4 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}
