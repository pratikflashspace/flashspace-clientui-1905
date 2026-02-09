import React from "react";
import { sidebarConfig } from "./sidebarConfig";
import { NavLink } from "react-router-dom";

type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  to: string;
};

function SidebarItem({ icon, label, to }: SidebarItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
          isActive
            ? "bg-[#3FA69E] text-white shadow-sm"
            : "text-slate-600 hover:bg-slate-100"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className={`${isActive ? "text-white" : "text-slate-500"}`}>
            {icon}
          </span>
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-200 bg-white px-4 py-6">
      {/* Logo */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">flashspace</h1>
        <p className="text-sm text-slate-500">Space Partner Portal</p>
      </div>

      {/* Menu */}
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
  {sidebarConfig.map((item) => (
    <SidebarItem
      key={item.path}
      to={item.path}
      icon={<item.icon size={18} />}
      label={item.label}
    />
  ))}
</div>


      {/* Bottom */}
      <div className="mt-auto pt-6 text-sm text-slate-500">
        <button className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-3 font-semibold hover:bg-slate-50">
          Logout
        </button>
      </div>
    </aside>
  );
}
