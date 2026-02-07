import {
  LayoutDashboard,
  BarChart3,
  Users,
  Ticket,
  Building2,
} from "lucide-react";

function SidebarItem({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
        active
          ? "bg-emerald-600 text-white shadow-sm"
          : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      <span className={`${active ? "text-white" : "text-slate-500"}`}>
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}

export default function Sidebar() {
  return (
    <aside className="h-screen w-72 border-r border-slate-200 bg-white px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">flashspace</h1>
        <p className="text-sm text-slate-500">Space Admin</p>
      </div>

      <div className="flex flex-col gap-2">
        <SidebarItem
          icon={<LayoutDashboard size={18} />}
          label="Dashboard"
          active
        />
        <SidebarItem icon={<BarChart3 size={18} />} label="Bookings Analytics" />
        <SidebarItem icon={<Users size={18} />} label="Clients" />
        <SidebarItem icon={<Ticket size={18} />} label="Ticket System" />
        <SidebarItem icon={<Building2 size={18} />} label="Space Management" />
      </div>

      <div className="mt-auto pt-10 text-sm text-slate-500">
        <button className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-3 hover:bg-slate-50">
          Logout
        </button>
      </div>
    </aside>
  );
}
