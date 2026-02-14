import { useState } from "react";
import { Plus, Clock, CheckCircle2 } from "lucide-react";

export default function TicketAndTasksLayout() {
  const [activeTab, setActiveTab] = useState("client");

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Header />
      <Stats />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "client" ? <TicketTable /> : <TeamTasks />}
    </div>
  );
}

/* ---------------- Header ---------------- */

function Header() {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Tickets & Tasks</h1>
        <p className="text-gray-500 text-sm">
          Manage support tickets and team tasks
        </p>
      </div>

      <button className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition">
        <Plus size={16} />
        Create Task
      </button>
    </div>
  );
}

/* ---------------- Stats ---------------- */

function Stats() {
  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      <StatCard title="Open Tickets" value="5" />
      <StatCard title="In Progress" value="3" />
      <StatCard title="Resolved This Week" value="12" />
      <StatCard title="Avg Response Time" value="4.2 hrs" />
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="text-xl font-semibold text-gray-800">{value}</div>
      <div className="text-sm text-gray-500">{title}</div>
    </div>
  );
}

/* ---------------- Tabs ---------------- */

function Tabs({ activeTab, setActiveTab }) {
  return (
    <div className="mb-4 flex gap-2">
      <button
        onClick={() => setActiveTab("client")}
        className={`px-4 py-2 rounded-md text-sm transition
          ${
            activeTab === "client"
              ? "bg-teal-50 text-teal-600"
              : "bg-white border border-gray-200 text-gray-600"
          }`}
      >
        Client Tickets
      </button>
      <button
        onClick={() => setActiveTab("team")}
        className={`px-4 py-2 rounded-md text-sm transition
          ${
            activeTab === "team"
              ? "bg-teal-50 text-teal-600"
              : "bg-white border border-gray-200 text-gray-600"
          }`}
      >
        Team Tasks
      </button>
    </div>
  );
}

/* ---------------- Client Tickets Table ---------------- */

function TicketTable() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="grid grid-cols-7 text-sm font-medium text-gray-500 px-6 py-3 border-b">
        <span>Ticket</span>
        <span>Client</span>
        <span>Priority</span>
        <span>Assignee</span>
        <span>Deadline</span>
        <span>Status</span>
        <span>Actions</span>
      </div>

      <TicketRow
        ticket="Mail forwarding request pending"
        client="Tech Innovations Pvt Ltd"
        priority="High"
        assignee="Raj Kumar"
        deadline="Feb 3, 2024"
        status="Open"
      />

      <TicketRow
        ticket="Meeting room booking confirmation needed"
        client="StartupXYZ Solutions"
        priority="Medium"
        assignee="Priya Sharma"
        deadline="Feb 2, 2024"
        status="In Progress"
      />

      <TicketRow
        ticket="Document verification follow-up"
        client="Global Consulting LLC"
        priority="Low"
        assignee="Unassigned"
        deadline="Feb 5, 2024"
        status="Open"
      />
    </div>
  );
}

function TicketRow({ ticket, client, priority, assignee, deadline, status }) {
  const priorityColor = {
    High: "bg-red-100 text-red-600",
    Medium: "bg-yellow-100 text-yellow-600",
    Low: "bg-blue-100 text-blue-600",
  };

  const statusColor =
    status === "In Progress"
      ? "bg-blue-100 text-blue-600"
      : "bg-gray-100 text-gray-600";

  return (
    <div className="grid grid-cols-7 items-center px-6 py-4 text-sm border-b last:border-none">
      <span className="font-medium text-gray-700">{ticket}</span>

      <span className="text-gray-600 px-5">{client}</span>

      <span
        className={`px-3 py-1 rounded-full text-xs w-fit ${priorityColor[priority]}`}
      >
        {priority}
      </span>

      <span className="text-gray-600">{assignee}</span>

      <span className="text-gray-600">{deadline}</span>

      <span className={`px-3 py-1 rounded-full text-xs w-fit ${statusColor}`}>
        {status}
      </span>

      <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-yellow-400 w-fit">
        View
      </button>
    </div>
  );
}

/* ---------------- Team Tasks List ---------------- */

function TeamTasks() {
  return (
    <div className="space-y-4">
      <TaskCard
        title="Update pricing for Q2"
        assigned="Self"
        due="Feb 10, 2024"
        status="pending"
      />

      <TaskCard
        title="Review client agreements for renewal"
        assigned="Raj Kumar"
      />

      <TaskCard
        title="Prepare monthly revenue report"
        assigned="Priya Sharma"
        completed
      />
    </div>
  );
}

/* ---------------- Task Card ---------------- */

interface TaskCardProps {
  title: string;
  assigned: string;
  due?: string;
  status?: string;
  completed?: boolean;
}

function TaskCard({
  title,
  assigned,
  due,
  status,
  completed = false,
}: TaskCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 flex items-center justify-center rounded-full ${
            completed ? "bg-green-100" : "bg-gray-100"
          }`}
        >
          {completed ? (
            <CheckCircle2 className="text-green-600" size={20} />
          ) : (
            <Clock className="text-gray-500" size={20} />
          )}
        </div>

        <div>
          <p
            className={`font-medium ${completed ? "line-through text-gray-400" : ""}`}
          >
            {title}
          </p>
          <p className="text-sm text-gray-500">Assigned to: {assigned}</p>
        </div>
      </div>

      <div className="text-sm text-gray-500 flex items-center gap-4">
        {due && <span>Due: {due}</span>}
        {status && (
          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs">
            {status}
          </span>
        )}
      </div>
    </div>
  );
}
