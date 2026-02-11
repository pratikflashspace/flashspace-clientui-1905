import { useMemo, useState } from "react";
import { TICKETS } from "@/data/spacePortal/ticket";
import type {
  Ticket,
  TicketPriority,
  TicketStatus,
} from "@/types/spacePortal/ticket";

import { Eye, MoreVertical } from "lucide-react";
import { useSpacePortalSearch } from "@/contexts/SpacePortalSearchContext";
import SelectBox from "@/components/ui/SpacePartner/SelectionBox";

/**
 * Tickets Page
 *
 * Features:
 * - Search tickets by title/client/space/id
 * - Filter by status + priority
 * - Display tickets in a table
 *
 * Backend-ready:
 * - Replace TICKETS mock data with API response.
 * - Add view details route when backend is ready.
 */
export default function Tickets() {
  const { query } = useSpacePortalSearch();

  const [statusFilter, setStatusFilter] = useState<TicketStatus | "ALL">("ALL");
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | "ALL">(
    "ALL"
  );

  /**
   * Normalize search query once.
   */
  const normalizedQuery = useMemo(() => query.trim().toLowerCase(), [query]);

  /**
   * Dropdown options extracted to avoid inline repetition.
   */
  const statusOptions = useMemo(
    () => [
      { label: "All Status", value: "ALL" },
      { label: "Open", value: "OPEN" },
      { label: "In Progress", value: "IN_PROGRESS" },
      { label: "Resolved", value: "RESOLVED" },
      { label: "Closed", value: "CLOSED" },
    ],
    []
  );

  const priorityOptions = useMemo(
    () => [
      { label: "All Priority", value: "ALL" },
      { label: "Low", value: "LOW" },
      { label: "Medium", value: "MEDIUM" },
      { label: "High", value: "HIGH" },
      { label: "Urgent", value: "URGENT" },
    ],
    []
  );

  /**
   * Filter tickets based on search + filters.
   */
  const filteredTickets = useMemo(() => {
    return TICKETS.filter((t) => {
      const matchesQuery =
        t.title.toLowerCase().includes(normalizedQuery) ||
        t.clientName.toLowerCase().includes(normalizedQuery) ||
        t.space.toLowerCase().includes(normalizedQuery) ||
        t.id.toLowerCase().includes(normalizedQuery);

      const matchesStatus =
        statusFilter === "ALL" ? true : t.status === statusFilter;

      const matchesPriority =
        priorityFilter === "ALL" ? true : t.priority === priorityFilter;

      return matchesQuery && matchesStatus && matchesPriority;
    });
  }, [normalizedQuery, statusFilter, priorityFilter]);

  return (
    <div className="flex-1">
      {/* Filters */}
      <div className="mt-6 flex flex-nowrap items-center gap-3">
        <SelectBox
          value={statusFilter}
          onChange={(val) => setStatusFilter(val as TicketStatus | "ALL")}
          options={statusOptions}
          triggerClassName="w-36 sm:w-52"
        />

        <SelectBox
          value={priorityFilter}
          onChange={(val) => setPriorityFilter(val as TicketPriority | "ALL")}
          options={priorityOptions}
          triggerClassName="w-36 sm:w-52"
        />
      </div>

      {/* Table */}
      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead className="bg-slate-50">
            <tr className="text-slate-600">
              <th className="px-6 py-4 font-semibold">Ticket ID</th>
              <th className="px-6 py-4 font-semibold">Title</th>
              <th className="px-6 py-4 font-semibold">Client</th>
              <th className="px-6 py-4 font-semibold">Space</th>
              <th className="px-6 py-4 font-semibold">Priority</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Assigned</th>
              <th className="px-6 py-4 text-center font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredTickets.map((ticket) => (
              <TicketRow key={ticket.id} ticket={ticket} />
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {filteredTickets.length === 0 && (
          <p className="p-6 text-center text-slate-500">No tickets found.</p>
        )}
      </div>
    </div>
  );
}

/**
 * Single ticket row component
 * Extracted for readability.
 */
function TicketRow({ ticket }: { ticket: Ticket }) {
  return (
    <tr className="border-t border-slate-100 hover:bg-slate-50">
      <td className="px-6 py-5 font-semibold text-slate-900">{ticket.id}</td>

      <td className="px-6 py-5">
        <p className="font-semibold text-slate-900">{ticket.title}</p>
        <p className="line-clamp-1 text-xs text-slate-500">
          {ticket.description}
        </p>
      </td>

      <td className="px-6 py-5 font-semibold text-slate-700">
        {ticket.clientName}
      </td>

      <td className="px-6 py-5 text-slate-600">{ticket.space}</td>

      <td className="px-6 py-5">
        <PriorityPill priority={ticket.priority} />
      </td>

      <td className="px-6 py-5">
        <StatusPill status={ticket.status} />
      </td>

      <td className="px-6 py-5 text-slate-600">
        {ticket.assignedTo || "Unassigned"}
      </td>

      <td className="px-6 py-5">
        <div className="flex items-center justify-center gap-4 text-slate-500">
          {/* type="button" prevents accidental form submission bugs */}
          <button type="button" className="hover:text-slate-900">
            <Eye size={18} />
          </button>

          <button type="button" className="hover:text-slate-900">
            <MoreVertical size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}

/**
 * Ticket Status Pill (UI badge)
 */
function StatusPill({ status }: { status: TicketStatus }) {
  const config =
    status === "OPEN"
      ? { label: "Open", className: "bg-blue-50 text-blue-700" }
      : status === "IN_PROGRESS"
      ? { label: "In Progress", className: "bg-amber-50 text-amber-700" }
      : status === "RESOLVED"
      ? { label: "Resolved", className: "bg-emerald-50 text-emerald-700" }
      : { label: "Closed", className: "bg-slate-100 text-slate-700" };

  return (
    <span
      className={`rounded-full px-4 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}

/**
 * Ticket Priority Pill (UI badge)
 */
function PriorityPill({ priority }: { priority: TicketPriority }) {
  const config =
    priority === "LOW"
      ? { label: "Low", className: "bg-slate-100 text-slate-700" }
      : priority === "MEDIUM"
      ? { label: "Medium", className: "bg-amber-50 text-amber-700" }
      : priority === "HIGH"
      ? { label: "High", className: "bg-rose-50 text-rose-700" }
      : { label: "Urgent", className: "bg-red-100 text-red-700" };

  return (
    <span
      className={`rounded-full px-4 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}
