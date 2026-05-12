import React from "react";
import { X, ChevronLeft, ChevronRight, LogOut, LayoutDashboard, Home } from "lucide-react";
import { sidebarConfig } from "./SidebarConfig";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSpacePortalNotifications } from "@/contexts/SpacePortalNotificationsContext";

type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  to: string;
  collapsed?: boolean;
  disabled?: boolean;
  badgeCount?: number;
};

function SidebarItem({ icon, label, to, collapsed, disabled, badgeCount = 0 }: SidebarItemProps) {
  if (disabled) {
    return (
      <div
        title={`${label} (Coming Soon)`}
        className={`flex w-full items-center rounded-xl text-left text-sm font-semibold transition opacity-40 cursor-not-allowed text-[#485753] dark:text-slate-200 ${collapsed ? "justify-center px-3 py-3" : "gap-3 px-4 py-3"}`}
      >
        <span className="text-[#7a8682] dark:text-gray-400">
          {icon}
        </span>
        {collapsed ? null : <span>{label}</span>}
      </div>
    );
  }

  return (
    <NavLink
      to={to}
      title={label}
      aria-label={label}
      className={({ isActive }) =>
        `relative flex w-full items-center rounded-xl text-left text-sm font-semibold transition ${isActive
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
          {collapsed ? null : (
            <>
              <span className="min-w-0 flex-1 truncate">{label}</span>
              {badgeCount > 0 ? (
                <span
                  className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                    isActive
                      ? "bg-[#FDE68A] text-[#2D3F33]"
                      : "bg-[#FDE68A] text-[#2D3F33]"
                  }`}
                >
                  {badgeCount > 99 ? "99+" : badgeCount}
                </span>
              ) : null}
            </>
          )}
          {collapsed && badgeCount > 0 ? (
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#FDE68A] ring-2 ring-[#f3f4f3]" />
          ) : null}
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
  const { notifications } = useSpacePortalNotifications();
  const menuRef = React.useRef<HTMLDivElement>(null);
  const unreadCount = React.useMemo(
    () => notifications.filter((item) => !item.read && !item.archived).length,
    [notifications],
  );

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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm border border-[#2D3F33]/10 p-1.5">
              <img
                src="/Logo/Flashspace Logo.png"
                alt="FS"
                className="w-full h-full object-contain"
              />
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
        <div className="mb-6 flex items-center justify-center gap-4 relative">
          <NavLink
            to="/spaceportal/dashboard"
            className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#3FA69E]/30"
            aria-label="Go to Space Portal dashboard"
          >
            <div className="flex flex-col items-center gap-2">
              <img
                src="/Logo/Flashspace Logo.png"
                alt="Flashspace"
                className="h-10 w-auto object-contain"
              />
              {!isCollapsed && (
                <div className="text-center">
                  <p className="text-[10px] text-[#164e4e]/70 dark:text-gray-400 font-bold uppercase tracking-wider">Space Partner Portal</p>
                </div>
              )}
            </div>
          </NavLink>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close sidebar"
              className="absolute right-0 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#2D3F33]/20 dark:border-white/10 text-[#164e4e] dark:text-gray-200 hover:bg-[#2D3F33]/5 dark:hover:bg-white/5 lg:hidden"
            >
              <X size={18} />
            </button>
          )}
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
            disabled={item.disabled}
            badgeCount={
              item.path === "/spaceportal/notifications" ? unreadCount : 0
            }
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
