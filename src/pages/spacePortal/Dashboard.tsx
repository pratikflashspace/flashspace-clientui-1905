import { useMemo, useState } from "react";
import { CLIENTS } from "@/data/spacePortalClient";
import type { ClientStatus, PlanType } from "@/types/spaceClient";
import StatCard from "@/components/ui/SpacePartner/StatCard";
import { Users, UserX, Clock, CheckCircle2 } from "lucide-react";
import Topbar from "@/components/SpacePartner/TopBar";
import Sidebar from "@/components/SpacePartner/Sidebar";
import SearchBar from "@/components/ui/SpacePartner/SearchBar";
import SelectBox from "@/components/ui/SpacePartner/SelectionBox";
import Table from "@/components/ui/SpacePartner/Table";


export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ClientStatus | "ALL">("ALL");
  const [planFilter, setPlanFilter] = useState<PlanType | "ALL">("ALL");

  const filteredClients = useMemo(() => {
    return CLIENTS.filter((c) => {
      const matchesQuery =
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.company.toLowerCase().includes(query.toLowerCase()) ||
        c.id.toLowerCase().includes(query.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ? true : c.status === statusFilter;

      const matchesPlan = planFilter === "ALL" ? true : c.plan === planFilter;

      return matchesQuery && matchesStatus && matchesPlan;
    });
  }, [query, statusFilter, planFilter]);

  const totalBookings = CLIENTS.reduce((sum, c) => sum + c.bookings, 0);
  const activeClients = CLIENTS.filter((c) => c.status === "ACTIVE").length;
  const lostClients = CLIENTS.filter((c) => c.status === "LOST").length;
  const pendingClients = CLIENTS.filter((c) => c.status === "PENDING").length;

  return(
  <div className="flex min-h-screen bg-slate-50">
    {/* Sidebar */}
    <Sidebar />

    {/* Main Content */}
    <div className="flex-1 p-8">
      <Topbar />

      <h1 className="mt-6 text-3xl font-bold text-slate-900">
        Space <span className="text-[#3FA69E]">Dashboard</span>
      </h1>

      <p className="mt-2 text-slate-500">
        Complete control over bookings, clients, and space performance.
      </p>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Bookings"
          value={totalBookings}
          icon={<CheckCircle2 size={22} />}
          trend="up"
          trendLabel="18%"
        />
        <StatCard
          title="Active Clients"
          value={activeClients}
          icon={<Users size={22} />}
          trend="up"
          trendLabel="12%"
        />
        <StatCard
          title="Client Lost"
          value={lostClients}
          icon={<UserX size={22} />}
          trend="down"
          trendLabel="5%"
        />
        <StatCard
          title="Pending Clients"
          value={pendingClients}
          icon={<Clock size={22} />}
          trend="up"
          trendLabel="9%"
        />
      </div>

      {/* Filters */}
      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
  <h2 className="text-lg font-bold text-slate-900">Client Details</h2>
  <p className="text-sm text-slate-500">
    Filter and search clients based on status, plan and name.
  </p>

  <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center">
    <SearchBar
      value={query}
      onChange={setQuery}
      placeholder="Search by ID, name, company..."
    />

    <SelectBox
      value={statusFilter}
      onChange={(val) => setStatusFilter(val as any)}
      options={[
        { label: "All Status", value: "ALL" },
        { label: "Active", value: "ACTIVE" },
        { label: "Pending", value: "PENDING" },
        { label: "Lost", value: "LOST" },
      ]}
    />

    <SelectBox
      value={planFilter}
      onChange={(val) => setPlanFilter(val as any)}
      options={[
        { label: "All Plans", value: "ALL" },
        { label: "Basic", value: "Basic" },
        { label: "Standard", value: "Standard" },
        { label: "Premium", value: "Premium" },
      ]}
    />
  </div>

  <div className="mt-6">
    <Table
      data={filteredClients}
      columns={[
        { key: "id", header: "Client ID" },
        { key: "name", header: "Name" },
        { key: "company", header: "Company" },
        { key: "plan", header: "Plan" },
        {
          key: "status",
          header: "Status",
          render: (client) => (
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                client.status === "ACTIVE"
                  ? "bg-emerald-50 text-[#3FA69E]"
                  : client.status === "PENDING"
                  ? "bg-amber-50 text-amber-700"
                  : "bg-rose-50 text-rose-700"
              }`}
            >
              {client.status}
            </span>
          ),
        },
        { key: "bookings", header: "Bookings" },
      ]}
    />
  </div>
</div>

    </div>
  </div>
);
}
