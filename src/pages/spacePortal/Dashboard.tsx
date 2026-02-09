import { useMemo, useState } from "react";
import { CLIENTS } from "@/data/spacePortal/clients";
import type { ClientStatus, ClientPlan } from "@/types/spacePortal/client";

import StatCard from "@/components/ui/SpacePartner/StatCard";
import SearchBar from "@/components/ui/SpacePartner/SearchBar";
import SelectBox from "@/components/ui/SpacePartner/SelectionBox";
import Table from "@/components/ui/SpacePartner/Table";

import { Users, UserX, Clock, CheckCircle2 } from "lucide-react";

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ClientStatus | "ALL">("ALL");
  const [planFilter, setPlanFilter] = useState<ClientPlan | "ALL">("ALL");

  const filteredClients = useMemo(() => {
    return CLIENTS.filter((c) => {
      const q = query.toLowerCase();

      const matchesQuery =
        c.companyName.toLowerCase().includes(q) ||
        c.contactName.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.space.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "ALL" ? true : c.status === statusFilter;

      const matchesPlan = planFilter === "ALL" ? true : c.plan === planFilter;

      return matchesQuery && matchesStatus && matchesPlan;
    });
  }, [query, statusFilter, planFilter]);

  // Stats
  const totalClients = CLIENTS.length;
  const activeClients = CLIENTS.filter((c) => c.status === "ACTIVE").length;
  const expiringSoon = CLIENTS.filter((c) => c.status === "EXPIRING_SOON").length;
  const inactiveClients = CLIENTS.filter((c) => c.status === "INACTIVE").length;

  return (
    <div className="p-8">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-slate-900">
        Space <span className="text-[#3FA69E]">Dashboard</span>
      </h1>

      <p className="mt-2 text-slate-500">
        Complete control over clients, plans, and space performance.
      </p>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Clients"
          value={totalClients}
          icon={<CheckCircle2 size={22} />}
          trend="up"
          trendLabel="10%"
        />

        <StatCard
          title="Active Clients"
          value={activeClients}
          icon={<Users size={22} />}
          trend="up"
          trendLabel="6%"
        />

        <StatCard
          title="Expiring Soon"
          value={expiringSoon}
          icon={<Clock size={22} />}
          trend="down"
          trendLabel="3%"
        />

        <StatCard
          title="Inactive Clients"
          value={inactiveClients}
          icon={<UserX size={22} />}
          trend="down"
          trendLabel="2%"
        />
      </div>

      {/* Filters */}
      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Client Overview</h2>
        <p className="text-sm text-slate-500">
          Search and filter clients by plan, status, and space.
        </p>

        <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search by ID, company, contact, space..."
          />

          <SelectBox
            value={statusFilter}
            onChange={(val) => setStatusFilter(val as ClientStatus | "ALL")}
            options={[
              { label: "All Status", value: "ALL" },
              { label: "Active", value: "ACTIVE" },
              { label: "Expiring Soon", value: "EXPIRING_SOON" },
              { label: "Inactive", value: "INACTIVE" },
            ]}
          />

          <SelectBox
            value={planFilter}
            onChange={(val) => setPlanFilter(val as ClientPlan | "ALL")}
            options={[
              { label: "All Plans", value: "ALL" },
              { label: "Virtual Office Premium", value: "Virtual Office Premium" },
              { label: "Virtual Office Standard", value: "Virtual Office Standard" },
              { label: "Team Space", value: "Team Space" },
              { label: "Hot Desk Monthly", value: "Hot Desk Monthly" },
            ]}
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
                render: (client) => (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      client.status === "ACTIVE"
                        ? "bg-emerald-50 text-[#3FA69E]"
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
                ),
              },
              {
                key: "kycStatus",
                header: "KYC",
                render: (client) => (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      client.kycStatus === "VERIFIED"
                        ? "bg-emerald-50 text-[#3FA69E]"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {client.kycStatus === "VERIFIED"
                      ? "Verified"
                      : "Pending"}
                  </span>
                ),
              },
            ]}
          />

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
