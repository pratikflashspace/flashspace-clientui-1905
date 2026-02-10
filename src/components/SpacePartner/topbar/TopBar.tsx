import { Bell, Search, ChevronDown } from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
      {/* Left */}
      <div>
        <h2 className="text-lg font-bold text-slate-900">Dashboard</h2>
        <p className="text-sm text-slate-500">
          Manage bookings, clients, and analytics
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 md:flex">
          <Search size={18} className="text-slate-500" />
          <input
            type="text"
            placeholder="Search..."
            className="w-48 bg-transparent text-sm outline-none"
          />
        </div>

        {/* Notification */}
        <button className="rounded-xl border border-slate-200 p-2 hover:bg-slate-50">
          <Bell size={18} className="text-slate-600" />
        </button>

        {/* Profile */}
        <button className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2 hover:bg-slate-50">
          <div className="h-9 w-9 rounded-full bg-[#3FA69E] text-center text-sm font-bold leading-9 text-white">
            S
          </div>

          <div className="hidden text-left md:block">
            <p className="text-sm font-semibold text-slate-900">Space Admin</p>
            <p className="text-xs text-slate-500">flashspace</p>
          </div>

          <ChevronDown size={16} className="text-slate-500" />
        </button>
      </div>
    </header>
  );
}
