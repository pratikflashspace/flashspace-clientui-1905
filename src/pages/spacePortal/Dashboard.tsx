import { useMemo, useState } from "react";

import { CLIENTS } from "@/data/spacePortal/clients";
import type { ClientStatus, ClientPlan } from "@/types/spacePortal/client";

import StatCard from "@/components/ui/SpacePartner/StatCard";
import SelectBox from "@/components/ui/SpacePartner/SelectionBox";
import Table from "@/components/ui/SpacePartner/Table";
import { useSpacePortalSearch } from "@/contexts/SpacePortalSearchContext";

import { Users, UserX, Clock, CheckCircle2 } from "lucide-react";

/**
 * Dashboard Page
 *
 * Shows:
 * - KPI stats (Total, Active, Expiring, Inactive)
 * - Filters (Status, Plan)
 * - Clients table overview
 *
 * Backend-ready:
 * - Later CLIENTS will be replaced with API response.
 * - Query + filters can be passed to backend.
 */
export default function Dashboard() {
  const { query } = useSpacePortalSearch();

  // Filters state
  const [statusFilter, setStatusFilter] = useState<ClientStatus | "ALL">("ALL");
  const [planFilter, setPlanFilter] = useState<ClientPlan | "ALL">("ALL");

  /**
   * Dropdown filter options (keeps JSX clean and avoids duplication)
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

  /**
   * Normalize query once instead of doing trim().toLowerCase() repeatedly.
   */
  const normalizedQuery = useMemo(() => query.trim().toLowerCase(), [query]);

  /**
   * Filter clients based on:
   * - Search query
   * - Status filter
   * - Plan filter
   */
  const filteredClients = useMemo(() => {
    return CLIENTS.filter((c) => {
      const matchesQuery =
        c.companyName.toLowerCase().includes(normalizedQuery) ||
        c.contactName.toLowerCase().includes(normalizedQuery) ||
        c.id.toLowerCase().includes(normalizedQuery) ||
        c.space.toLowerCase().includes(normalizedQuery);

      const matchesStatus =
        statusFilter === "ALL" ? true : c.status === statusFilter;

      const matchesPlan = planFilter === "ALL" ? true : c.plan === planFilter;

      return matchesQuery && matchesStatus && matchesPlan;
    });
  }, [normalizedQuery, statusFilter, planFilter]);

  /**
   * Dashboard stats computed once.
   * This is cleaner + prevents repeated CLIENTS.filter calls.
   */
  const stats = useMemo(() => {
    const total = CLIENTS.length;

    const active = CLIENTS.filter((c) => c.status === "ACTIVE").length;
    const expiringSoon = CLIENTS.filter((c) => c.status === "EXPIRING_SOON").length;
    const inactive = CLIENTS.filter((c) => c.status === "INACTIVE").length;

    return {
      total,
      active,
      expiringSoon,
      inactive,
    };
  }, []);

  return (
    <div className="flex-1">
      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Clients"
          value={stats.total}
          icon={<CheckCircle2 size={22} />}
          trend="up"
          trendLabel="10%"
        />

        <StatCard
          title="Active Clients"
          value={stats.active}
          icon={<Users size={22} />}
          trend="up"
          trendLabel="6%"
        />

        <StatCard
          title="Expiring Soon"
          value={stats.expiringSoon}
          icon={<Clock size={22} />}
          trend="down"
          trendLabel="3%"
        />

        <StatCard
          title="Inactive Clients"
          value={stats.inactive}
          icon={<UserX size={22} />}
          trend="down"
          trendLabel="2%"
        />
      </div>

      {/* Filters + Table */}
      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Client Overview</h2>
        <p className="text-sm text-slate-500">
          Search and filter clients by plan, status, and space.
        </p>

        {/* Filters */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
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
        </div>

        {/* Table */}
        <div className="mt-6">
          <Table
            data={filteredClients}
            columns={[
              { key: "id", header: "Client ID" },
              { key: "companyName", header: "Company" },
              { key: "contactName", header: "Contact Person" },
              { key: "plan", header: "Plan" },
              { key: "space", header: "Space" },
              {
                key: "status",
                header: "Status",
                render: (client) => <StatusPill status={client.status} />,
              },
              {
                key: "kycStatus",
                header: "KYC",
                render: (client) => <KycPill status={client.kycStatus} />,
              },
            ]}
          />

          {/* Empty State */}
          {filteredClients.length === 0 && (
            <p className="mt-6 text-center text-slate-500">
              No clients found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Status pill used in table
 * Keeps UI same but removes duplicated ternary blocks.
 */
function StatusPill({ status }: { status: ClientStatus }) {
  const config =
    status === "ACTIVE"
      ? { label: "Active", className: "bg-emerald-50 text-[#3FA69E]" }
      : status === "EXPIRING_SOON"
      ? { label: "Expiring Soon", className: "bg-amber-50 text-amber-700" }
      : { label: "Inactive", className: "bg-rose-50 text-rose-700" };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}

/**
 * KYC pill used in table
 */
function KycPill({ status }: { status: string }) {
  const config =
    status === "VERIFIED"
      ? { label: "Verified", className: "bg-emerald-50 text-[#3FA69E]" }
      : { label: "Pending", className: "bg-amber-50 text-amber-700" };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}
