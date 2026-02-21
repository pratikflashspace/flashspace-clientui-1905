import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import type { SpaceStatus } from "@/types/spacePortal/space";
import { fetchAllPartnerSpaces } from "@/services/spacePortal/spacePartner.service";

import StatCard from "@/components/ui/SpacePartner/StatCard";
import SelectBox from "@/components/ui/SpacePartner/SelectionBox";
import { useSpacePortalSearch } from "@/contexts/SpacePortalSearchContext";

import { Building2, CheckCircle2, Wrench, XCircle, Plus } from "lucide-react";

/**
 * Spaces Page
 *
 * Features:
 * - Show spaces list fetched from backend
 * - Search spaces by name/city/location/id
 * - Filter by status and city
 * - KPI stats
 */
export default function Spaces() {
  const navigate = useNavigate();
  const { query } = useSpacePortalSearch();

  const [statusFilter, setStatusFilter] = useState<SpaceStatus | "ALL">("ALL");
  const [cityFilter, setCityFilter] = useState<string | "ALL">("ALL");

  const [spaces, setSpaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const payload: any = await fetchAllPartnerSpaces();
        if (payload?.success) {
          setSpaces(payload.data || []);
        }
      } catch (err) {
        console.error("Failed to load spaces", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  /**
   * Normalize search query once.
   */
  const normalizedQuery = useMemo(() => query.trim().toLowerCase(), [query]);

  /**
   * Compute unique cities list from fetched spaces.
   */
  const cities = useMemo(() => {
    return Array.from(new Set(spaces.map((s) => s.city))).filter(Boolean);
  }, [spaces]);

  /**
   * Filter dropdown options
   */
  const statusOptions = useMemo(
    () => [
      { label: "All Status", value: "ALL" },
      { label: "Active", value: "ACTIVE" },
      { label: "Maintenance", value: "MAINTENANCE" },
      { label: "Inactive", value: "INACTIVE" },
    ],
    [],
  );

  const cityOptions = useMemo(
    () => [
      { label: "All Cities", value: "ALL" },
      ...cities.map((city) => ({ label: city, value: city })),
    ],
    [cities],
  );

  /**
   * Filter spaces list based on query + filters.
   */
  const filteredSpaces = useMemo(() => {
    return spaces.filter((space) => {
      const matchesQuery =
        space.name?.toLowerCase().includes(normalizedQuery) ||
        space.city?.toLowerCase().includes(normalizedQuery) ||
        space.location?.toLowerCase().includes(normalizedQuery) ||
        space.id?.toLowerCase().includes(normalizedQuery);

      const matchesStatus =
        statusFilter === "ALL" ? true : space.status === statusFilter;

      const matchesCity =
        cityFilter === "ALL" ? true : space.city === cityFilter;

      return matchesQuery && matchesStatus && matchesCity;
    });
  }, [normalizedQuery, statusFilter, cityFilter, spaces]);

  /**
   * Stats (computed once)
   */
  const stats = useMemo(() => {
    const total = spaces.length;
    const active = spaces.filter((s) => s.status === "ACTIVE").length;
    const inactive = spaces.filter((s) => s.status === "INACTIVE").length;
    const maintenance = spaces.filter((s) => s.status === "MAINTENANCE").length;

    return {
      total,
      active,
      inactive,
      maintenance,
    };
  }, [spaces]);

  if (loading) {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <div className="text-slate-500">Loading spaces...</div>
      </div>
    );
  }

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
          value={stats.total}
          icon={<Building2 size={22} />}
          trend="up"
          trendLabel="4%"
        />

        <StatCard
          title="Active Spaces"
          value={stats.active}
          icon={<CheckCircle2 size={22} />}
          trend="up"
          trendLabel="3%"
        />

        <StatCard
          title="Maintenance"
          value={stats.maintenance}
          icon={<Wrench size={22} />}
          trend="down"
          trendLabel="1%"
        />

        <StatCard
          title="Inactive Spaces"
          value={stats.inactive}
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
            options={statusOptions}
          />

          <SelectBox
            value={cityFilter}
            onChange={(val) => setCityFilter(val)}
            options={cityOptions}
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
              <SpaceRow key={space.id} space={space} />
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {filteredSpaces.length === 0 && (
          <p className="p-6 text-center text-slate-500">No spaces found.</p>
        )}
      </div>
    </div>
  );
}

/**
 * Extracted row component for clean mapping.
 */
function SpaceRow({
  space,
}: {
  space: {
    id: string;
    name: string;
    city: string;
    location: string;
    availableSeats: number;
    totalSeats: number;
    meetingRooms: number;
    cabins: number;
    status: SpaceStatus;
  };
}) {
  return (
    <tr className="border-t border-slate-100 hover:bg-slate-50">
      <td className="px-6 py-5 font-semibold text-slate-900">{space.id}</td>

      <td className="px-6 py-5 font-semibold text-slate-900">{space.name}</td>

      <td className="px-6 py-5 text-slate-600">{space.city}</td>

      <td className="px-6 py-5 text-slate-600">{space.location}</td>

      <td className="px-6 py-5 font-semibold text-slate-700">
        {space.availableSeats}/{space.totalSeats}
      </td>

      <td className="px-6 py-5 text-slate-600">{space.meetingRooms}</td>

      <td className="px-6 py-5 text-slate-600">{space.cabins}</td>

      <td className="px-6 py-5">
        <SpaceStatusPill status={space.status} />
      </td>
    </tr>
  );
}

/**
 * Space status badge component (removes repeated ternary code)
 */
function SpaceStatusPill({ status }: { status: SpaceStatus }) {
  const config =
    status === "ACTIVE"
      ? { label: "Active", className: "bg-emerald-50 text-[#3FA69E]" }
      : status === "MAINTENANCE"
        ? { label: "Maintenance", className: "bg-amber-50 text-amber-700" }
        : { label: "Inactive", className: "bg-rose-50 text-rose-700" };

  return (
    <span
      className={`rounded-full px-4 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}
