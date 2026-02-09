import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SPACES } from "@/data/spacePortal/spaces";
import type { SpaceStatus } from "@/types/spacePortal/space";

import StatCard from "@/components/ui/SpacePartner/StatCard";
import SelectBox from "@/components/ui/SpacePartner/SelectionBox";
import { useSpacePortalSearch } from "@/contexts/SpacePortalSearchContext";

import {
  Building2,
  CheckCircle2,
  Wrench,
  XCircle,
  Plus,
} from "lucide-react";

export default function Spaces() {
  const navigate = useNavigate();
  const { query } = useSpacePortalSearch();
  const [statusFilter, setStatusFilter] = useState<SpaceStatus | "ALL">("ALL");
  const [cityFilter, setCityFilter] = useState<string | "ALL">("ALL");

  const filteredSpaces = useMemo(() => {
    return SPACES.filter((space) => {
      const q = query.trim().toLowerCase();

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
      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => navigate("/spaceportal/space-management/add")}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3FA69E] px-5 py-3 text-sm font-bold text-white shadow-sm hover:opacity-90 sm:w-auto sm:justify-start"
        >
          <Plus size={18} />
          Add Space
        </button>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-4">
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
      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-slate-700">Filters</p>
        <p className="mt-1 text-xs text-slate-500">
          Filter spaces by status and city.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
          <SelectBox
            value={statusFilter}
            onChange={(val) => setStatusFilter(val as SpaceStatus | "ALL")}
            options={[
              { label: "All Status", value: "ALL" },
              { label: "Active", value: "ACTIVE" },
              { label: "Maintenance", value: "MAINTENANCE" },
              { label: "Inactive", value: "INACTIVE" },
            ]}
          />

          <SelectBox
            value={cityFilter}
            onChange={(val) => setCityFilter(val)}
            options={[
              { label: "All Cities", value: "ALL" },
              ...cities.map((city) => ({ label: city, value: city })),
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
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
