import { useMemo, useState } from "react";
import { TICKETS } from "@/data/spacePortal/ticket";
import type { Ticket, TicketPriority, TicketStatus } from "@/types/spacePortal/ticket";

import { Search, Eye, MoreVertical } from "lucide-react";

export default function Tickets() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "ALL">("ALL");
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | "ALL">("ALL");

  const filteredTickets = useMemo(() => {
    return TICKETS.filter((t) => {
      const q = query.toLowerCase();

      const matchesQuery =
        t.title.toLowerCase().includes(q) ||
        t.clientName.toLowerCase().includes(q) ||
        t.space.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "ALL" ? true : t.status === statusFilter;

      const matchesPriority =
        priorityFilter === "ALL" ? true : t.priority === priorityFilter;

      return matchesQuery && matchesStatus && matchesPriority;
    });
  }, [query, statusFilter, priorityFilter]);

  return (
    <div className="flex-1">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Ticket <span className="text-[#3FA69E]">System</span>
        </h1>
        <p className="mt-2 text-slate-500">
          Track support requests raised by clients and manage resolutions.
        </p>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center">
        {/* Search */}
        <div className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <Search size={18} className="text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tickets..."
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
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>

        {/* Priority Filter */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as any)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
        >
          <option value="ALL">All Priority</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
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

        {filteredTickets.length === 0 && (
          <p className="p-6 text-center text-slate-500">No tickets found.</p>
        )}
      </div>
    </div>
  );
}

function TicketRow({ ticket }: { ticket: Ticket }) {
  return (
    <tr className="border-t border-slate-100 hover:bg-slate-50">
      <td className="px-6 py-5 font-semibold text-slate-900">{ticket.id}</td>

      <td className="px-6 py-5">
        <p className="font-semibold text-slate-900">{ticket.title}</p>
        <p className="text-xs text-slate-500 line-clamp-1">{ticket.description}</p>
      </td>

      <td className="px-6 py-5 text-slate-700 font-semibold">
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
          <button className="hover:text-slate-900">
            <Eye size={18} />
          </button>
          <button className="hover:text-slate-900">
            <MoreVertical size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}

function StatusPill({ status }: { status: TicketStatus }) {
  const style =
    status === "OPEN"
      ? "bg-blue-50 text-blue-700"
      : status === "IN_PROGRESS"
      ? "bg-amber-50 text-amber-700"
      : status === "RESOLVED"
      ? "bg-emerald-50 text-emerald-700"
      : "bg-slate-100 text-slate-700";

  const label =
    status === "OPEN"
      ? "Open"
      : status === "IN_PROGRESS"
      ? "In Progress"
      : status === "RESOLVED"
      ? "Resolved"
      : "Closed";

  return (
    <span className={`rounded-full px-4 py-1 text-xs font-semibold ${style}`}>
      {label}
    </span>
  );
}

function PriorityPill({ priority }: { priority: TicketPriority }) {
  const style =
    priority === "LOW"
      ? "bg-slate-100 text-slate-700"
      : priority === "MEDIUM"
      ? "bg-amber-50 text-amber-700"
      : priority === "HIGH"
      ? "bg-rose-50 text-rose-700"
      : "bg-red-100 text-red-700";

  const label =
    priority === "LOW"
      ? "Low"
      : priority === "MEDIUM"
      ? "Medium"
      : priority === "HIGH"
      ? "High"
      : "Urgent";

  return (
    <span className={`rounded-full px-4 py-1 text-xs font-semibold ${style}`}>
      {label}
    </span>
  );
}
