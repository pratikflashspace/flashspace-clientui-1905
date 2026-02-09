import { Bell, Search, ChevronDown, Menu } from "lucide-react";

type TopbarProps = {
  title: string;
  subtitle?: string;

  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;

  userName?: string;
  userRole?: string;
  userInitial?: string;
  onMenuClick?: () => void;
};

export default function Topbar({
  title,
  subtitle = "Manage bookings, clients, and analytics",
  showSearch = true,
  searchValue = "",
  onSearchChange,
  userName = "Space Admin",
  userRole = "flashspace",
  userInitial = "S",
  onMenuClick,
}: TopbarProps) {
  return (
    <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
      {/* Left */}
      <div className="flex items-start gap-3">
        {onMenuClick ? (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open sidebar"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 shadow-sm hover:bg-slate-50 lg:hidden"
          >
            <Menu size={18} />
          </button>
        ) : null}

        <div>
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        {/* Search */}
        {showSearch ? (
          <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 shadow-sm focus-within:border-[#3FA69E] md:flex">
            <Search size={18} className="text-slate-500" />

            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search..."
              className="w-52 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>
        ) : null}

        {/* Notification */}
        <button className="rounded-xl border border-slate-200 p-2 hover:bg-slate-50">
          <Bell size={18} className="text-slate-600" />
        </button>

        {/* Profile */}
        <button className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2 hover:bg-slate-50">
          <div className="h-9 w-9 rounded-full bg-[#3FA69E] text-center text-sm font-bold leading-9 text-white">
            {userInitial}
          </div>

          <div className="hidden text-left md:block">
            <p className="text-sm font-semibold text-slate-900">{userName}</p>
            <p className="text-xs text-slate-500">{userRole}</p>
          </div>

          <ChevronDown size={16} className="text-slate-500" />
        </button>
      </div>
    </header>
  );
}
