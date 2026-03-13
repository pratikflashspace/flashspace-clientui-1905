import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import {
  X,
  MessageCircle,
  Briefcase,
  FileText,
  Calendar,
  Users,
  Bell,
  Settings as SettingsIcon,
  Building,
  Building2,
  MapPin,
  Zap,
  Check,
  Tag,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { useNotifications, NotificationType } from "@/contexts/NotificationContext";
import { formatDistanceToNow } from 'date-fns';

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
  onOpenContact?: () => void;
}

const MENU_WIDTH_OPEN = 300;
const MENU_WIDTH_ICON = 68;
// const UPDATES_WIDTH = 420;

// ------------------------------------------------
// UpdatesPopup component (no blur / no overlay)
// ------------------------------------------------
const UpdatesPopup = ({
  open,
  menuWidth,
  onCloseBoth
}: {
  open: boolean;
  menuWidth: number;
  onCloseBoth: () => void;
}) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [activeFilter, setActiveFilter] = useState("All");
  const [updatesWidth, setUpdatesWidth] = useState(420);

  useEffect(() => {
    const handleResize = () => {
      setUpdatesWidth(window.innerWidth < 640 ? window.innerWidth : 420);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!open) return null;

  const filters = ["All", "Unread", "Read", "Bookings", "Invoice", "KYC"];

  const getNotificationIcon = (type: string, metadata?: any) => {
    // Prioritise metadata type for more accurate icons
    const metaType = metadata?.type;
    if (metaType === 'booking_confirmation') return Building2;
    if (metaType === 'invoice_generated') return FileText;
    if (metaType === 'partner' || metaType === 'business') return Users;
    switch (type) {
      case NotificationType.SUCCESS:
        return Building2;
      case NotificationType.MEETING_BOOKED:
        return Building2;
      case NotificationType.TICKET_UPDATE:
        return MessageCircle;
      case NotificationType.INFO:
        return Tag;
      case NotificationType.WARNING:
        return Zap;
      case NotificationType.ERROR:
        return X;
      default:
        return Bell;
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Unread") return !n.read;
    if (activeFilter === "Read") return n.read;
    if (activeFilter === "Bookings") return n.metadata?.type === 'booking_confirmation' || n.type === NotificationType.MEETING_BOOKED;
    if (activeFilter === "Invoice") return n.metadata?.type === 'invoice_generated';
    if (activeFilter === "KYC") return n.metadata?.type === 'partner' || n.metadata?.type === 'business';
    return true;
  });

  return createPortal(
    <div
      onClick={(e) => e.stopPropagation()}
      className={`fixed top-0 left-0 z-[13000] h-screen transition-transform duration-400 ease-[cubic-bezier(.7,.22,.26,.98)] ${open ? "translate-x-0" : "translate-x-[120%]"
        }`}
      style={{
        width: updatesWidth,
        left: window.innerWidth < 640 ? 0 : menuWidth,
      }}
    >
      <div
        className="w-full h-full overflow-y-auto flex flex-col relative bg-[#F8F9FA] dark:bg-[#0a0a0a] border-l border-neutral-200 dark:border-white/10 shadow-2xl rounded-r-none sm:rounded-r-[22px] rounded-l-none text-black dark:text-white p-5 sm:p-6 md:p-8"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#1F2E26] dark:text-white">Updates</h2>
            <p className="text-xs text-[#677E73] mt-0.5">{unreadCount} unread</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => markAllAsRead()}
              className="flex items-center gap-1.5 text-xs font-medium text-[#1F2E26] hover:text-[#35503F] transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              Read all
            </button>
            <button
              onClick={onCloseBoth}
              className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-[#1F2E26] dark:text-white" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${activeFilter === filter
                ? "bg-[#35503F] text-white shadow-sm"
                : "bg-white text-[#677E73] border border-slate-100 hover:border-slate-300"
                }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="flex-1 flex flex-col gap-3 min-h-0">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => {
              const Icon = getNotificationIcon(notif.type, notif.metadata);
              return (
                <div
                  key={notif._id}
                  onClick={() => !notif.read && markAsRead(notif._id)}
                  className={`group flex gap-4 p-4 rounded-2xl transition-all border border-transparent hover:border-slate-100 cursor-pointer ${!notif.read ? "bg-[#F1F3F5] dark:bg-white/5" : "bg-white dark:bg-transparent"
                    }`}
                >
                  {/* Icon Container */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center shadow-sm border border-slate-50">
                    <Icon className="w-4 h-4 text-[#677E73]" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-sm font-bold text-[#1F2E26] leading-tight mb-1">
                        {notif.title}
                      </h3>
                      {!notif.read && (
                        <div className="w-2 h-2 rounded-full bg-[#35503F] mt-1.5 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[13px] text-[#677E73] leading-relaxed mb-2 line-clamp-2">
                      {notif.message}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-[11px] text-slate-400">
                        {notif.createdAt ? formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true }) : ''}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-4">
              <div className="w-16 h-16 bg-white dark:bg-white/5 rounded-full flex items-center justify-center mb-4 shadow-sm">
                <Bell className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-sm font-bold text-[#1F2E26] dark:text-white mb-1">No updates found</h3>
              <p className="text-xs text-[#677E73]">
                {activeFilter === "All"
                  ? "You're all caught up! Check back later for new notifications."
                  : `No ${activeFilter.toLowerCase()} updates at the moment.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

// ------------------------------------------------
// SidebarMenu component
// ------------------------------------------------
// ... (imports need to include ChevronDown, I will handle that in a separate edit or same if I can match the import line, but let's do the logic first. Wait, I must add ChevronDown to imports first or it will fail. I'll take a safer approach and do the content replacement first, but I need to make sure I don't break the file. Actually, I can replace the import block too.)

// Let's replace the component logic.

const SidebarMenu = ({ isOpen, onClose, onOpenLogin, onOpenContact }: SidebarMenuProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const menuScrollRef = useRef<HTMLDivElement>(null);
  const [showUpdates, setShowUpdates] = useState(false);

  const primaryTop = [
    { label: "Start Chatting", href: "/start-chatting", icon: MessageCircle },
  ];

  const middle = [
    { label: "Your Bookings", href: "/dashboard/my-bookings", icon: Calendar },
  ];

  const footer = [
    { label: "Updates", href: "/updates", icon: Bell },
    { label: "Settings", href: "/settings", icon: SettingsIcon },
    // { label: "More", href: "#more", icon: MoreHorizontal }
  ];

  useEffect(() => {
    if (!isOpen && showUpdates) setShowUpdates(false);
  }, [isOpen, showUpdates]);

  useEffect(() => {
    if (!isOpen || showUpdates) return;

    const onWheel = (event: WheelEvent) => {
      const container = menuScrollRef.current;
      if (!container) return;

      const target = event.target as Node;
      const isInsideSidebar = container.contains(target);

      if (isInsideSidebar) {
        container.scrollTop += event.deltaY;
      }

      event.preventDefault();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [isOpen, showUpdates]);

  // Close both Sidebar & Updates
  const closeBoth = () => {
    setShowUpdates(false);
    onClose();
  };

  const handleNavigation = (href: string, label?: string) => {
    if (label === "Updates") {
      setShowUpdates((prev) => !prev);
      return;
    }
    if (href.startsWith("#")) {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(href);
    }
    onClose();
  };

  const handleSidebarWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const container = menuScrollRef.current;
    if (!container) return;
    event.preventDefault();
    container.scrollBy({ top: event.deltaY, behavior: "auto" });
  };

  // ESC closes both
  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeBoth();
    };
    if (isOpen || showUpdates) {
      document.addEventListener("keydown", esc);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [isOpen, showUpdates]);

  const menuWidth = showUpdates ? 0 : MENU_WIDTH_OPEN;
  const hideLogoFooter = showUpdates;
  const iconOnly = showUpdates;

  const content = (
    <div
      id="flashspace-fullmenu"
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-[12000] overflow-hidden transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
    >
      {/* Overlay click closes both */}
      <div
        onClick={closeBoth}
        className="absolute inset-0"
        style={{
          background: "rgba(0,0,0,0.25)",
          cursor: "pointer"
        }}
      />

      {/* Updates Popup */}
      <UpdatesPopup open={showUpdates} menuWidth={menuWidth} onCloseBoth={closeBoth} />

      {/* Sidebar */}
      <div
        className="relative z-20 h-full bg-[#f3f4f3] dark:bg-[#0f0f0f] text-black dark:text-white border-r border-neutral-200 dark:border-white/10 shadow-2xl transform transition-transform duration-300 ease-out overflow-hidden flex flex-col"
        style={{
          fontFamily: "'Inter Tight', sans-serif",
          fontWeight: 500,
          width: showUpdates ? 0 : (window.innerWidth < 640 ? '100vw' : `${MENU_WIDTH_OPEN}px`),
          minWidth: showUpdates ? 0 : (window.innerWidth < 640 ? '100vw' : `${MENU_WIDTH_OPEN}px`),
          maxWidth: showUpdates ? 0 : (window.innerWidth < 640 ? '100vw' : `${MENU_WIDTH_OPEN}px`),
          opacity: showUpdates ? 0 : 1,
          transition:
            "width 0.36s cubic-bezier(.7,.22,.26,.98), min-width 0.36s cubic-bezier(.7,.22,.26,.98), max-width 0.36s cubic-bezier(.7,.22,.26,.98), opacity 0.2s ease"
        }}
      >
        {/* Header */}
        {!hideLogoFooter && (
          <div className="flex items-center justify-between p-5 border-b border-neutral-200/80 dark:border-white/10" style={{ minHeight: 64 }}>
            <img
              src="/Logo/Flashspace Logo.png"
              alt="FlashSpace Logo"
              className="h-8 w-auto cursor-pointer select-none"
              onClick={() => handleNavigation("/")}
            />
            <button
              onClick={closeBoth}
              className="p-2 rounded-md hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 transition"
              aria-label="Close menu"
            >
              <X className="h-5 w-5 text-black dark:text-white" />
            </button>
          </div>
        )}

        {/* Menu items */}
        <div
          ref={menuScrollRef}
          onWheel={handleSidebarWheel}
          className="flex-1 overflow-y-auto pb-32 flex flex-col overscroll-contain touch-pan-y min-h-0 scroll-smooth"
        >
          <div className="p-5 space-y-2 text-sm tracking-wide flex-1">
            <nav className="space-y-2">
              {/* Primary Top Items */}
              {primaryTop.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item.href, item.label)}
                  className={`group w-full flex items-center ${iconOnly ? "justify-center" : "gap-3 text-left"
                    } py-2.5 px-3 text-[15px] font-medium text-[#485753] dark:text-slate-100 hover:text-[#2D3F33] dark:hover:text-[#FDE68A] rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300`}
                >
                  <item.icon className="w-5 h-5 text-[#7a8682] dark:text-gray-400 group-hover:text-[#2D3F33] dark:group-hover:text-[#FDE68A] transition-colors duration-300" />
                  {!iconOnly && <span>{item.label}</span>}
                </button>
              ))}

              <div className="h-px bg-neutral-300 my-3" />

              {/* Get Workspaces Link */}
              <button
                onClick={() => handleNavigation("/services/virtual-office", "Get Workspaces")}
                className={`group w-full flex items-center ${iconOnly ? "justify-center" : "gap-3 text-left"
                  } py-2.5 px-3 text-[15px] font-medium text-[#485753] dark:text-slate-100 hover:text-[#2D3F33] dark:hover:text-[#FDE68A] rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300`}
              >
                <Building className="w-5 h-5 text-[#7a8682] dark:text-gray-400 group-hover:text-[#2D3F33] dark:group-hover:text-[#FDE68A] transition-colors duration-300" />
                {!iconOnly && <span>Get Workspaces</span>}
              </button>

              {/* <div className="h-px bg-neutral-300 my-3" /> */}

              {/* Middle Items */}
              {middle.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item.href, item.label)}
                  className={`group w-full flex items-center ${iconOnly ? "justify-center" : "gap-3 text-left"
                    } py-2.5 px-3 text-[15px] font-medium text-[#485753] dark:text-slate-100 hover:text-[#2D3F33] dark:hover:text-[#FDE68A] rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300`}
                >
                  <item.icon className="w-5 h-5 text-[#7a8682] dark:text-gray-400 group-hover:text-[#2D3F33] dark:group-hover:text-[#FDE68A] transition-colors duration-300" />
                  {!iconOnly && <span>{item.label}</span>}
                </button>
              ))}

              <div className="h-px bg-neutral-300 my-3" />

              {/* Footer Items */}
              {footer.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item.href, item.label)}
                  className={`group w-full flex items-center ${iconOnly ? "justify-center" : "gap-3 text-left"
                    } py-2.5 px-3 text-[15px] font-medium text-[#485753] dark:text-slate-100 hover:text-[#2D3F33] dark:hover:text-[#FDE68A] rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300`}
                >
                  <item.icon className="w-5 h-5 text-[#7a8682] dark:text-gray-400 group-hover:text-[#2D3F33] dark:group-hover:text-[#FDE68A] transition-colors duration-300" />
                  {!iconOnly && <span>{item.label}</span>}
                </button>
              ))}
            </nav>

            {/* Footer */}
            {!hideLogoFooter && (
              <div className="space-y-3 mt-4">
                {!isAuthenticated && (
                  <button
                    onClick={() => {
                      onOpenLogin();
                      onClose();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 text-[15px] font-semibold text-[#164e4e] dark:text-white border border-[#164e4e]/20 dark:border-white/20 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                  >
                    Log In / Sign Up
                  </button>
                )}
                
                <button
                  onClick={() => {
                    if (onOpenContact) {
                      onOpenContact();
                      closeBoth();
                    } else {
                      handleNavigation("#contact");
                    }
                  }}
                  className="w-full rounded-[20px] bg-[#e8e2ad] text-[#253734] font-semibold py-3 text-[15px] hover:bg-[#e2da99] active:scale-[0.98] transition shadow-sm"
                >
                  Get Consultation
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document !== "undefined") return createPortal(content, document.body);
  return content;
};

export default SidebarMenu;