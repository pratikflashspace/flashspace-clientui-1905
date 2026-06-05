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
        className={`flex items-center transition-all duration-300 rounded-lg opacity-40 cursor-not-allowed group relative
          ${collapsed ? "justify-center w-12 h-12 mx-auto" : "justify-start w-[263px] h-[40px] px-[12px] gap-4 mx-auto"}
          text-[#677e73] dark:text-slate-200`}
      >
        <span className="shrink-0">
          {icon}
        </span>
        {!collapsed && <span className="text-[14px] font-semibold whitespace-nowrap min-w-0 flex-1 truncate">{label}</span>}
      </div>
    );
  }

  return (
    <NavLink
      to={to}
      title={label}
      aria-label={label}
      className={({ isActive }) =>
        `flex items-center transition-all duration-300 rounded-lg group relative
        ${collapsed ? "justify-center w-12 h-12 mx-auto" : "justify-start w-[263px] h-[40px] px-[12px] gap-4 mx-auto"}
        ${isActive
          ? "bg-[#334d3d] text-[#FEF8C3] shadow-sm dark:bg-[#334d3d] dark:text-[#FEF8C3]"
          : "text-[#677e73] dark:text-slate-200 hover:bg-gray-50 hover:text-[#1a2d1d] dark:hover:bg-white/5 dark:hover:text-white"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className={`shrink-0 ${isActive ? "text-[#FEF8C3]" : "text-[#677e73] dark:text-gray-400"}`}>
            {icon}
          </span>
          {!collapsed && (
            <>
              <span className="text-[14px] font-semibold whitespace-nowrap min-w-0 flex-1 truncate">{label}</span>
              {badgeCount > 0 ? (
                <span
                  className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ml-auto ${
                    isActive
                      ? "bg-[#FEF8C3] text-[#334d3d]"
                      : "bg-[#D1FAE5] text-[#2D3F33]"
                  }`}
                >
                  {badgeCount > 99 ? "99+" : badgeCount}
                </span>
              ) : null}
            </>
          )}
          {collapsed && badgeCount > 0 ? (
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800" />
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
      className={`flex h-full flex-shrink-0 flex-col overflow-hidden border-r border-[#edede6] dark:border-white/10 bg-[#f8f8f8] dark:bg-[#0f0f0f] transition-all duration-300 ease-in-out ${isCollapsed ? "w-20" : "w-72"}`}
      data-lenis-prevent
    >
      {/* Logo Section */}
      <div
        className={`flex flex-col shrink-0 transition-all duration-300 ${isCollapsed ? "p-4 items-center" : "w-[287px] h-[137px] p-[24px]"}`}
      >
        <div className={`flex items-center w-full ${isCollapsed ? "justify-center" : "justify-between"}`}>
          <img
            src="/Logo/Flashspace Logo.png"
            alt="FlashSpace Logo"
            onClick={() => navigate("/spaceportal/dashboard")}
            className={`w-auto object-contain transition-all duration-300 ml-[-12px] cursor-pointer ${isCollapsed ? "h-7" : "h-9"}`}
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
        <div className={`mt-[17px] overflow-hidden transition-all duration-300 flex flex-col gap-1 ${isCollapsed ? "h-0 opacity-0" : "h-auto opacity-100"}`}>
            <h2 className="w-[239px] h-[20px] text-[14px] font-bold text-[#1a2d1d] dark:text-white whitespace-nowrap leading-none flex items-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                Space Partner Portal
            </h2>
            <p className="w-[239px] h-[16px] text-[12px] text-[#64748b] dark:text-gray-400 whitespace-nowrap font-medium leading-none flex items-center">
                Manage your spaces and clients
            </p>
        </div>
      </div>

      <div
        ref={menuRef}
        className="flex-1 min-h-0 overflow-y-auto px-4 space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
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



      {/* Footer and Bottom Actions */}
      <div className="p-6 border-t border-[#edede6] dark:border-white/10 space-y-4 bg-[#f8f9fa]/30 dark:bg-transparent shrink-0">
          {onToggleCollapse && (
              <button
                  type="button"
                  onClick={onToggleCollapse}
                  className={`
                      hidden xl:flex items-center transition-colors text-[#677e73] dark:text-gray-400 hover:text-[#1a2d1d] dark:hover:text-white py-2 mx-auto
                      ${isCollapsed ? "justify-center w-full" : "justify-start gap-4 w-[263px] h-[40px] px-[12px]"}
                  `}
                  title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                  {isCollapsed ? (
                      <ChevronRight size={22} />
                  ) : (
                      <>
                          <ChevronLeft size={20} />
                          <span className="text-[15px] font-bold">Collapse</span>
                      </>
                  )}
              </button>
          )}

          <button
              onClick={() => navigate("/")}
              className={`
                  flex items-center rounded-lg shadow-sm font-bold transition-all border border-[#edede6] dark:border-gray-700 text-[#677e73] dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md mx-auto
                  ${isCollapsed ? "justify-center w-full h-14" : "justify-start gap-4 w-[263px] h-[40px] px-[12px] text-[14px]"}
              `}
              title="Back to Home"
          >
              <Home size={20} />
              {!isCollapsed && (
                  <span className="whitespace-nowrap">Back to Home</span>
              )}
          </button>
      </div>
    </aside >
  );
}
