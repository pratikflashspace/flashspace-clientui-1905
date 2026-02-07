import { useMemo, useState } from "react";
import { SPACES } from "@/data/spacePortal/spaces";
import type { SpaceStatus } from "@/types/spacePortal/space";

import StatCard from "@/components/ui/SpacePartner/StatCard";

import {
  Building2,
  CheckCircle2,
  Wrench,
  XCircle,
  Search,
  Plus,
} from "lucide-react";

export default function Spaces() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<SpaceStatus | "ALL">("ALL");
  const [cityFilter, setCityFilter] = useState<string | "ALL">("ALL");

  const filteredSpaces = useMemo(() => {
    return SPACES.filter((space) => {
      const q = query.toLowerCase();

      const matchesQuery =
        space.name.toLowerCase().includes(q) ||
        space.city.toLowerCase().includes(q) ||
        space.location.toLowerCase().includes(q) ||
        space.id.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "ALL" ? true : space.status === statusFilter;

      const matchesCity =
        cityFilter === "ALL" ? true : space.city === cityFilter;

      return matchesQuery && matchesStatus && matchesCity;
    });
  }, [query, statusFilter, cityFilter]);

  // Stats
  const totalSpaces = SPACES.length;
  const activeSpaces = SPACES.filter((s) => s.status === "ACTIVE").length;
  const inactiveSpaces = SPACES.filter((s) => s.status === "INACTIVE").length;
  const maintenanceSpaces = SPACES.filter((s) => s.status === "MAINTENANCE").length;

  const cities = Array.from(new Set(SPACES.map((s) => s.city)));

  return (
    <div className="flex-1">
      {/* Heading */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Space <span className="text-[#3FA69E]">Management</span>
          </h1>
          <p className="mt-2 text-slate-500">
            Manage your coworking spaces, availability, and operational status.
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-xl bg-[#3FA69E] px-5 py-3 text-sm font-bold text-white shadow-sm hover:opacity-90">
          <Plus size={18} />
          Add Space
        </button>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Spaces"
          value={totalSpaces}
          icon={<Building2 size={22} />}
          trend="up"
          trendLabel="4%"
        />

        <StatCard
          title="Active Spaces"
          value={activeSpaces}
          icon={<CheckCircle2 size={22} />}
          trend="up"
          trendLabel="3%"
        />

        <StatCard
          title="Maintenance"
          value={maintenanceSpaces}
          icon={<Wrench size={22} />}
          trend="down"
          trendLabel="1%"
        />

        <StatCard
          title="Inactive Spaces"
          value={inactiveSpaces}
          icon={<XCircle size={22} />}
          trend="down"
          trendLabel="2%"
        />
      </div>

      {/* Filters */}
      <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center">
        {/* Search */}
        <div className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <Search size={18} className="text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by space name, city, id..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="MAINTENANCE">Maintenance</option>
          <option value="INACTIVE">Inactive</option>
        </select>

        {/* City Filter */}
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
        >
          <option value="ALL">All Cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50">
            <tr className="text-slate-600">
              <th className="px-6 py-4 font-semibold">Space ID</th>
              <th className="px-6 py-4 font-semibold">Space Name</th>
              <th className="px-6 py-4 font-semibold">City</th>
              <th className="px-6 py-4 font-semibold">Location</th>
              <th className="px-6 py-4 font-semibold">Seats</th>
              <th className="px-6 py-4 font-semibold">Meeting Rooms</th>
              <th className="px-6 py-4 font-semibold">Cabins</th>
              <th className="px-6 py-4 font-semibold">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredSpaces.map((space) => (
              <tr
                key={space.id}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="px-6 py-5 font-semibold text-slate-900">
                  {space.id}
                </td>

                <td className="px-6 py-5 font-semibold text-slate-900">
                  {space.name}
                </td>

                <td className="px-6 py-5 text-slate-600">{space.city}</td>

                <td className="px-6 py-5 text-slate-600">{space.location}</td>

                <td className="px-6 py-5 text-slate-700 font-semibold">
                  {space.availableSeats}/{space.totalSeats}
                </td>

                <td className="px-6 py-5 text-slate-600">
                  {space.meetingRooms}
                </td>

                <td className="px-6 py-5 text-slate-600">{space.cabins}</td>

                <td className="px-6 py-5">
                  <span
                    className={`rounded-full px-4 py-1 text-xs font-semibold ${
                      space.status === "ACTIVE"
                        ? "bg-emerald-50 text-[#3FA69E]"
                        : space.status === "MAINTENANCE"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {space.status === "ACTIVE"
                      ? "Active"
                      : space.status === "MAINTENANCE"
                      ? "Maintenance"
                      : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredSpaces.length === 0 && (
          <p className="p-6 text-center text-slate-500">No spaces found.</p>
        )}
      </div>
    </div>
  );
}
