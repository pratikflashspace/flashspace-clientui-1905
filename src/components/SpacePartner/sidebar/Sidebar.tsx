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
        className={`flex w-full items-center rounded-xl text-left text-sm font-semibold transition opacity-40 cursor-not-allowed text-[#485753] dark:text-slate-200 ${collapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-2.5"}`}
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
          ? "bg-[#35503F] text-white shadow-sm"
          : "text-[#485753] dark:text-slate-200 hover:bg-[#2D3F33]/5 dark:hover:bg-white/5"
        } ${collapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-2.5"}`
      }
    >
      {({ isActive }) => (
        <>
          <span className={`${isActive ? "text-white" : "text-[#7a8682] dark:text-gray-400"}`}>
            {icon}
          </span>
          {collapsed ? null : (
            <>
              <span className="min-w-0 flex-1 truncate">{label}</span>
              {badgeCount > 0 ? (
                <span
                  className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                    isActive
                      ? "bg-white text-[#2D3F33]"
                      : "bg-[#D1FAE5] text-[#2D3F33]"
                  }`}
                >
                  {badgeCount > 99 ? "99+" : badgeCount}
                </span>
              ) : null}
            </>
          )}
          {collapsed && badgeCount > 0 ? (
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-white ring-2 ring-[#f3f4f3]" />
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
      className={`flex h-full flex-shrink-0 flex-col overflow-hidden border-r border-[#2D3F33]/10 dark:border-white/10 bg-[#f3f4f3] dark:bg-[#0f0f0f] py-6 transition-all duration-300 ease-in-out ${isCollapsed ? "w-[72px]" : "w-72"
        }`}
      data-lenis-prevent
    >
      {/* Logo Section */}
      <div
        className={`flex flex-col items-start gap-1 cursor-pointer transition-all ${isCollapsed ? "mb-6 px-2 items-center" : "mb-8 px-6"
          }`}
        onClick={() => navigate("/spaceportal/dashboard")}
      >
        <div className="flex items-center justify-between w-full  ml-[-12px]">
          <img
            src="/Logo/Flashspace Logo.png"
            alt="FlashSpace Logo"
            className={`w-auto object-contain transition-all duration-300 ${isCollapsed ? "h-7" : "h-9"}`}
          />
          {!isCollapsed && onClose && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        {!isCollapsed && (
          <div className="mt-2 space-y-0.5">
            <p className="text-sm font-bold text-[#1F2E26] dark:text-white leading-none">Space Partner Portal</p>
            <p className="text-[11px] text-[#677E73] dark:text-gray-400 font-medium leading-tight">Manage your spaces and clients</p>
          </div>
        )}
      </div>

      {/* Horizontal Separator Line */}
      <div className="border-b border-[#2D3F33]/10 dark:border-white/10 w-full mb-6" />

      <div
        ref={menuRef}
        className={`flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto scrollbar-hover-only touch-pan-y ${isCollapsed ? "px-2" : "px-2"}`}
        data-lenis-prevent
      >
        {sidebarConfig.map((item) => (
          <SidebarItem
            key={item.path}
            to={item.path}
            icon={<item.icon size={20} />}
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
      <div className="mt-auto pt-6 border-t border-[#2D3F33]/10 dark:border-white/10">
        <div className={`flex flex-col gap-2 ${isCollapsed ? "px-2" : "px-4"}`}>
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className={`flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-[#7a8682] hover:bg-[#2D3F33]/5 dark:hover:bg-white/5 transition-colors ${isCollapsed ? "justify-center px-2" : ""}`}
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
            className={`flex items-center gap-3 w-full rounded-xl text-[#485753] dark:text-gray-200 hover:bg-[#2D3F33]/5 dark:hover:bg-white/5 transition-colors ${isCollapsed ? "justify-center px-2 py-3" : "px-4 py-3"}`}
            title="Back to Home"
          >
            <Home className="w-5 h-5" />
            {!isCollapsed && <span className="font-medium text-sm">Back to Home</span>}
          </button>
        </div>
      </div>
    </aside >
  );
}
