import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import {
  Bell,
  Search,
  ChevronDown,
  Menu,
  LogOut,
  User as UserIcon,
  Settings,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import type { SpacePortalNotification } from "@/types/spacePortal/notification";

type TopbarProps = {
  title: ReactNode;
  subtitle?: string;

  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: (value: string) => void;
  searchPlaceholder?: string;

  userName?: string;
  userRole?: string;
  userInitial?: string;

  onMenuClick?: () => void;

  showNotifications?: boolean;
  notifications?: SpacePortalNotification[];
  notificationsHref?: string;

  showProfile?: boolean;
  onLogout?: () => Promise<void> | void;
  onProfileNavigate?: () => void;
  onSettingsNavigate?: () => void;
};

function IconButton({
  onClick,
  ariaLabel,
  children,
}: {
  onClick: (e: any) => void;
  ariaLabel: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="group relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-[#2D3F33]/20 dark:border-white/10 bg-white dark:bg-[#101010] shadow-sm transition-all duration-300 hover:scale-105 hover:border-[#2D3F33]/40 hover:bg-[#2D3F33]/5 dark:hover:bg-white/5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D3F33]/30 focus-visible:ring-offset-2 sm:h-10 sm:w-10"
    >
      {children}
    </button>
  );
}

function NotificationButton({
  unreadCount,
  onClick,
}: {
  unreadCount: number;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open notifications"
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#2D3F33]/20 dark:border-white/10 bg-white dark:bg-[#101010] text-[#164e4e] dark:text-white shadow-sm transition-colors hover:bg-[#2D3F33]/5 dark:hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D3F33]/30 focus-visible:ring-offset-2 sm:h-10 sm:w-10"
    >
      <Bell className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />

      {unreadCount > 0 ? (
        <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[#2D3F33] px-1 text-[9px] font-bold text-[#FDE68A] shadow-sm sm:h-5 sm:min-w-[1.25rem] sm:px-1.5 sm:text-[10px]">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      ) : null}
    </button>
  );
}

function ProfileMenu({
  initial,
  name,
  role,
  showName,
  onProfile,
  onSettings,
  onLogout,
}: {
  initial: string;
  name: string;
  role: string;
  showName?: boolean;
  onProfile: () => void;
  onSettings: () => void;
  onLogout: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Open profile menu"
          className="group flex items-center gap-2 overflow-hidden rounded-xl border border-[#2D3F33]/20 dark:border-white/10 bg-white dark:bg-[#101010] px-2.5 py-1.5 shadow-sm transition-all duration-300 hover:scale-105 hover:border-[#2D3F33]/40 hover:bg-[#2D3F33]/5 dark:hover:bg-white/5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D3F33]/30 focus-visible:ring-offset-2 sm:gap-3 sm:px-3 sm:py-2"
        >
          <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-[#2D3F33] via-[#2D3F33] to-[#3a5445] shadow-md ring-2 ring-white/50 transition-all duration-300 group-hover:scale-110 sm:h-9 sm:w-9">
            <div className="flex h-full w-full items-center justify-center text-xs font-bold text-white sm:text-sm">
              {initial}
            </div>
          </div>

          {showName ? (
            <div className="hidden text-left md:block">
              <p className="text-sm font-semibold text-[#164e4e] dark:text-white">{name}</p>
              <p className="text-xs font-medium text-[#164e4e]/70 dark:text-gray-400">{role}</p>
            </div>
          ) : null}

          <ChevronDown className="h-3.5 w-3.5 text-[#164e4e]/70 dark:text-gray-400 transition-transform duration-300 group-hover:translate-y-0.5 group-hover:text-[#2D3F33] dark:group-hover:text-[#FDE68A] sm:h-4 sm:w-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 overflow-hidden rounded-xl border border-[#2D3F33]/15 dark:border-white/10 bg-white/95 dark:bg-[#101010]/95 shadow-xl backdrop-blur-md"
      >
        <DropdownMenuItem
          onSelect={onProfile}
          className="cursor-pointer rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-50 focus:bg-gradient-to-r focus:from-slate-100 focus:to-slate-50"
        >
          <UserIcon size={16} className="mr-2 text-slate-500" />
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={onSettings}
          className="cursor-pointer rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-50 focus:bg-gradient-to-r focus:from-slate-100 focus:to-slate-50"
        >
          <Settings size={16} className="mr-2 text-slate-500" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        <DropdownMenuItem
          onSelect={onLogout}
          className="cursor-pointer rounded-lg text-red-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-50/50 focus:bg-gradient-to-r focus:from-red-50 focus:to-red-50/50 focus:text-red-600"
        >
          <LogOut size={16} className="mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Topbar({
  title,
  subtitle,

  showSearch = true,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  searchPlaceholder = "Search...",

  userName = "Space Admin",
  userRole = "flashspace",
  userInitial,

  onMenuClick,

  showNotifications = true,
  notifications,
  notificationsHref = "/spaceportal/notifications",

  showProfile = true,
  onLogout,
  onProfileNavigate,
  onSettingsNavigate,
}: TopbarProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const mobileSearchRef = useRef<HTMLInputElement | null>(null);

  const isControlledSearch =
    typeof searchValue === "string" && typeof onSearchChange === "function";

  const [internalSearchValue, setInternalSearchValue] = useState(
    searchValue ?? ""
  );

  useEffect(() => {
    if (isControlledSearch) {
      setInternalSearchValue(searchValue ?? "");
    }
  }, [searchValue, isControlledSearch]);

  useEffect(() => {
    if (isMobileSearchOpen) {
      mobileSearchRef.current?.focus();
    }
  }, [isMobileSearchOpen]);

  const resolvedSearchValue = isControlledSearch
    ? searchValue!
    : internalSearchValue;

  const handleSearchChange = (value: string) => {
    if (!isControlledSearch) {
      setInternalSearchValue(value);
    }
    onSearchChange?.(value);
  };

  const handleSearchSubmit = () => {
    const trimmed = resolvedSearchValue.trim();
    onSearchSubmit?.(trimmed);
    setIsMobileSearchOpen(false);
  };

  const resolvedUserName = user?.fullName || userName;

  const resolvedUserRole = user?.role
    ? user.role.replace(/_/g, " ")
    : userRole;

  const resolvedUserInitial = useMemo(() => {
    if (userInitial) return userInitial;
    if (resolvedUserName) return resolvedUserName.charAt(0).toUpperCase();
    return "S";
  }, [resolvedUserName, userInitial]);

  const notificationItems = notifications ?? [];

  const unreadCount = useMemo(() => {
    return notificationItems.filter((n) => !n.read).length;
  }, [notificationItems]);

  const handleNotificationsClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    navigate(notificationsHref);
  };

  const handleLogout = async () => {
    try {
      if (onLogout) {
        await onLogout();
      } else {
        await logout();
      }
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleProfileNavigate = () => {
    if (onProfileNavigate) return onProfileNavigate();
    navigate("/settings");
  };

  const handleSettingsNavigate = () => {
    if (onSettingsNavigate) return onSettingsNavigate();
    navigate("/settings");
  };

 return (
  <header className="flex flex-col gap-3 rounded-2xl border border-[#2D3F33]/10 dark:border-white/10 bg-white dark:bg-[#0f0f0f] px-3 py-3 shadow-sm backdrop-blur-sm sm:px-6 sm:py-4" style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 500 }}>
    {/* TOP ROW */}
    <div className="flex w-full items-center justify-between gap-3">
      {/* LEFT SIDE */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {/* Hamburger only mobile */}
        {onMenuClick ? (
          <div className="shrink-0 lg:hidden">
            <IconButton onClick={onMenuClick} ariaLabel="Open sidebar">
              <Menu className="h-4 w-4 text-[#164e4e] dark:text-gray-100 transition-transform duration-300 group-hover:scale-110 sm:h-[17px] sm:w-[17px]" />
            </IconButton>
          </div>
        ) : null}

        {/* Title */}
        <div className="min-w-0 flex-1 overflow-hidden">
          <h2 className="truncate text-xl font-bold text-[#35503F] dark:text-white sm:text-2xl tracking-tight">
            {title}
          </h2>

          {subtitle ? (
            <p className="mt-0.5 hidden truncate text-[11px] font-medium text-[#164e4e]/70 dark:text-gray-400 sm:block sm:text-sm">
              {subtitle}
            </p>
          ) : null}
        </div>

        {/* Search (Tablet + Desktop) */}
        {showSearch ? (
          <div className="hidden w-[320px] items-center gap-2 overflow-hidden rounded-xl border border-[#2D3F33]/20 dark:border-white/10 bg-[#2D3F33]/5 dark:bg-white/5 px-4 py-2.5 shadow-sm transition-all duration-300 focus-within:border-[#2D3F33]/40 lg:flex">
            <Search size={18} className="text-[#164e4e]/70 dark:text-gray-300" />

            <input
              type="text"
              value={resolvedSearchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchSubmit();
                }
              }}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-sm font-medium text-[#164e4e] dark:text-white outline-none placeholder:text-[#164e4e]/50 dark:placeholder:text-gray-400"
            />
          </div>
        ) : null}
      </div>

      {/* RIGHT SIDE */}
      <div className="flex shrink-0 items-center gap-2">
        {/* Mobile Search Toggle */}
        {showSearch ? (
          <div className="lg:hidden">
            <IconButton
              onClick={() => setIsMobileSearchOpen((prev) => !prev)}
              ariaLabel={isMobileSearchOpen ? "Close search" : "Open search"}
            >
              {isMobileSearchOpen ? (
                <X className="h-4 w-4 text-slate-600 transition-transform duration-300 group-hover:rotate-90" />
              ) : (
                <Search className="h-4 w-4 text-[#164e4e] dark:text-gray-100 transition-transform duration-300 group-hover:scale-110" />
              )}
            </IconButton>
          </div>
        ) : null}

        {/* Notifications */}
        {showNotifications ? (
          <NotificationButton
            unreadCount={unreadCount}
            onClick={handleNotificationsClick}
          />
        ) : null}

        {/* Profile */}
        {showProfile ? (
          <>
            {/* Mobile + Tablet */}
            <div className="lg:hidden">
              <ProfileMenu
                initial={resolvedUserInitial}
                name={resolvedUserName}
                role={resolvedUserRole}
                onProfile={handleProfileNavigate}
                onSettings={handleSettingsNavigate}
                onLogout={handleLogout}
              />
            </div>

            {/* Desktop */}
            <div className="hidden lg:block">
              <ProfileMenu
                initial={resolvedUserInitial}
                name={resolvedUserName}
                role={resolvedUserRole}
                showName
                onProfile={handleProfileNavigate}
                onSettings={handleSettingsNavigate}
                onLogout={handleLogout}
              />
            </div>
          </>
        ) : null}
      </div>
    </div>

    {/* MOBILE SEARCH DROPDOWN */}
    {showSearch && isMobileSearchOpen ? (
      <div className="flex w-full animate-in fade-in slide-in-from-top-2 items-center gap-3 overflow-hidden rounded-xl border border-[#2D3F33]/20 dark:border-white/10 bg-[#2D3F33]/5 dark:bg-white/5 px-4 py-3 shadow-sm transition-all duration-300 focus-within:border-[#2D3F33]/40 lg:hidden">
        <Search className="h-4 w-4 text-[#164e4e]/70 dark:text-gray-300" />

        <input
          ref={mobileSearchRef}
          type="text"
          value={resolvedSearchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearchSubmit();
            if (e.key === "Escape") setIsMobileSearchOpen(false);
          }}
          placeholder={searchPlaceholder}
          className="w-full bg-transparent text-sm font-medium text-[#164e4e] dark:text-white outline-none placeholder:text-[#164e4e]/50 dark:placeholder:text-gray-400"
        />
      </div>
    ) : null}
  </header>
);

}