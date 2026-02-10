import { Link, useLocation } from "react-router-dom";
import { sidebarConfig } from "./SidebarConfig";

function SidebarItem({
  icon: Icon,
  label,
  path,
  active,
}: {
  icon: any;
  label: string;
  path: string;
  active: boolean;
}) {
  return (
    <Link
      to={path}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${active
        ? "bg-[#3FA69E] text-white shadow-sm"
        : "text-slate-600 hover:bg-slate-100"
        }`}
    >
      <span className={`${active ? "text-white" : "text-slate-500"}`}>
        <Icon size={18} />
      </span>
      <span>{label}</span>
    </Link>
  );
}

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="h-screen w-72 border-r border-slate-200 bg-white px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">flashspace</h1>
        <p className="text-sm text-slate-500">Space Admin</p>
      </div>

      <div className="flex flex-col gap-2">
        {sidebarConfig.map((item) => (
          <SidebarItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            path={item.path}
            active={location.pathname === item.path}
          />
        ))}
      </div>

      <div className="mt-auto pt-10 text-sm text-slate-500">
        <button className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-3 hover:bg-slate-50">
          Logout
        </button>
      </div>
    </aside>
  );
}
