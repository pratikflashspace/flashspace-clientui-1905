import React from "react";
import { X, ChevronLeft, ChevronRight, LogOut, LayoutDashboard, Home } from "lucide-react";
import { sidebarConfig } from "./SidebarConfig";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  to: string;
  collapsed?: boolean;
};

function SidebarItem({ icon, label, to, collapsed }: SidebarItemProps) {
  return (
    <NavLink
      to={to}
      title={label}
      aria-label={label}
      className={({ isActive }) =>
        `flex w-full items-center rounded-xl text-left text-sm font-semibold transition ${isActive
          ? "bg-[#2D3F33] text-[#FDE68A] shadow-sm"
          : "text-[#485753] dark:text-slate-200 hover:bg-[#2D3F33]/5 dark:hover:bg-white/5"
        } ${collapsed ? "justify-center px-3 py-3" : "gap-3 px-4 py-3"}`
      }
    >
      {({ isActive }) => (
        <>
          <span className={`${isActive ? "text-[#FDE68A]" : "text-[#7a8682] dark:text-gray-400"}`}>
            {icon}
          </span>
          {collapsed ? null : <span>{label}</span>}
        </>
      )}
    </NavLink>
  );
}

type SidebarProps = {
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
};

export default function Sidebar({
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const menuEl = menuRef.current;
    if (!menuEl) return;

    const preventLenis = (e: WheelEvent) => {
      e.stopPropagation();
    };

    menuEl.addEventListener("wheel", preventLenis, { passive: false });
    return () => {
      menuEl.removeEventListener("wheel", preventLenis);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <aside
      className={`flex h-full flex-shrink-0 flex-col overflow-hidden border-r border-[#2D3F33]/10 dark:border-white/10 bg-[#f3f4f3] dark:bg-[#0f0f0f] py-6 transition-[width,padding] duration-200 ${isCollapsed ? "w-20 px-3" : "w-72 px-4"
        }`}
      data-lenis-prevent
    >
      {/* Logo */}
      {isCollapsed ? (
        <div className="mb-6 flex items-start justify-between gap-2">
          <NavLink
            to="/spaceportal/dashboard"
            className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#3FA69E]/30"
            aria-label="Go to Space Portal dashboard"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2D3F33] text-sm font-bold text-[#FDE68A]">
              FS
            </div>
          </NavLink>

          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close sidebar"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#2D3F33]/20 dark:border-white/10 text-[#164e4e] dark:text-gray-200 hover:bg-[#2D3F33]/5 dark:hover:bg-white/5 lg:hidden"
            >
              <X size={18} />
            </button>
          ) : null}
        </div>
      ) : (
        <div className="mb-6 flex items-start justify-between gap-4">
          <NavLink
            to="/spaceportal/dashboard"
            className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#3FA69E]/30"
            aria-label="Go to Space Portal dashboard"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2D3F33] text-sm font-bold text-[#FDE68A]">
                FS
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#164e4e] dark:text-white">flashspace</h1>
                <p className="text-sm text-[#164e4e]/70 dark:text-gray-400">Space Partner Portal</p>
              </div>
            </div>
          </NavLink>

          <div className="flex items-center gap-2">

            {onClose ? (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close sidebar"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#2D3F33]/20 dark:border-white/10 text-[#164e4e] dark:text-gray-200 hover:bg-[#2D3F33]/5 dark:hover:bg-white/5 lg:hidden"
              >
                <X size={18} />
              </button>
            ) : null}
          </div>
        </div>
      )}

      {/* Menu */}
      <div
        ref={menuRef}
        className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto touch-pan-y"
        data-lenis-prevent
      >
        {sidebarConfig.map((item) => (
          <SidebarItem
            key={item.path}
            to={item.path}
            icon={<item.icon size={18} />}
            label={item.label}
            collapsed={isCollapsed}
          />
        ))}
      </div>



      {/* Bottom */}
      <div className="mt-auto pt-6 flex flex-col gap-2 border-t border-[#2D3F33]/10 dark:border-white/10">
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className={`flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-[#7a8682] hover:bg-[#2D3F33]/5 dark:hover:bg-white/5 transition-colors ${isCollapsed ? "justify-center" : ""}`}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <ChevronLeft
              size={20}
              className={`transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
            />
            {!isCollapsed && (
              <span className="text-xs font-medium uppercase tracking-wider text-[#7a8682]">
                Collapse
              </span>
            )}
          </button>
        )}

        <button
          onClick={() => navigate('/')}
          className={`flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-[#485753] dark:text-gray-200 hover:bg-[#2D3F33]/5 dark:hover:bg-white/5 transition-colors ${isCollapsed ? "justify-center" : ""}`}
          title="Back to Home"
        >
          <Home className="w-5 h-5" />
          {!isCollapsed && <span className="font-medium text-sm">Back to Home</span>}
        </button>
      </div>
    </aside >
  );
}
