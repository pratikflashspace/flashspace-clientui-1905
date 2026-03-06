import { useMemo, useState, useEffect } from "react";

import type {
  ClientStatus,
  ClientPlan,
  Client,
} from "@/types/spacePortal/client";
import { fetchPartnerDashboard } from "@/services/spacePortal/spacePartner.service";

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
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real data on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const payload: any = await fetchPartnerDashboard();
        if (payload?.success) {
          setClients(payload.data.clients);
        }
      } catch (err) {
        console.error("Failed to load partner dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

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
    [],
  );

  const planOptions = useMemo(() => {
    // Extract unique plan names from the fetched clients
    const uniquePlans = Array.from(new Set(clients.map((c) => c.plan))).filter(
      Boolean,
    );

    const options = [{ label: "All Plans", value: "ALL" }];
    uniquePlans.forEach((planName) => {
      options.push({ label: planName, value: planName });
    });

    return options;
  }, [clients]);

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
    return clients.filter((c) => {
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
  }, [normalizedQuery, statusFilter, planFilter, clients]);

  /**
   * Dashboard stats computed once.
   * This is cleaner + prevents repeated CLIENTS.filter calls.
   */
  const stats = useMemo(() => {
    const total = clients.length;

    const active = clients.filter((c) => c.status === "ACTIVE").length;
    const expiringSoon = clients.filter(
      (c) => c.status === "EXPIRING_SOON",
    ).length;
    const inactive = clients.filter((c) => c.status === "INACTIVE").length;

    return {
      total,
      active,
      expiringSoon,
      inactive,
    };
  }, [clients]);

  if (loading) {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <div className="text-[#164e4e]/70 dark:text-gray-400">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="flex-1" style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 500 }}>
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
      <div className="mt-10 rounded-2xl border border-[#2D3F33]/10 dark:border-white/10 bg-white dark:bg-[#0f0f0f] p-6 shadow-sm">
        <h2 className="text-lg font-bold text-[#164e4e] dark:text-white">Client Overview</h2>
        <p className="text-sm text-[#164e4e]/70 dark:text-gray-400">
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
            <p className="mt-6 text-center text-[#164e4e]/70 dark:text-gray-400">No clients found.</p>
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
      ? { label: "Active", className: "bg-[#2D3F33]/10 text-[#2D3F33] dark:text-[#FDE68A]" }
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
      ? { label: "Verified", className: "bg-[#2D3F33]/10 text-[#2D3F33] dark:text-[#FDE68A]" }
      : { label: "Pending", className: "bg-amber-50 text-amber-700" };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}
