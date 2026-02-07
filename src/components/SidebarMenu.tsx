import React, { useEffect, useState } from "react";
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
  MoreHorizontal,
  LayoutDashboard,
  LogOut,
  Building,
  MapPin,
  Zap,
  ChevronDown
} from "lucide-react";

import { smoothScrollTo } from "@/lib/lenis";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
}

const MENU_WIDTH_OPEN = 300;
const MENU_WIDTH_ICON = 68;
const UPDATES_WIDTH = 520;

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
  if (!open) return null;

  return createPortal(
    <div
      className={`fixed top-0 left-0 z-[9999] h-screen transition-transform duration-400 ease-[cubic-bezier(.7,.22,.26,.98)] ${open ? "translate-x-0" : "translate-x-[120%]"
        }`}
      style={{
        width: UPDATES_WIDTH,
        left: menuWidth,
      }}
    >
      <div
        className="w-full h-full overflow-y-auto flex flex-col relative bg-white dark:bg-[#0a0a0a] border-l border-neutral-200 dark:border-white/10 shadow-2xl rounded-r-[22px] rounded-l-none text-black dark:text-white p-8"
      >
        {/* Header */}
        <div className="flex justify-between items-center gap-3">
          <h2 className="text-2xl font-bold mb-5 mt-2 tracking-wide text-[#222] dark:text-white">
            Update & <span className="text-[#FFCC00]">Notification</span>
          </h2>
          <button
            onClick={onCloseBoth}
            aria-label="Close updates"
            className="bg-transparent border-none cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-black dark:text-white" />
          </button>
        </div>

        {/* Updates Content */}
        <div className="flex flex-col gap-5">
          <div className="bg-[#f6f7ff] dark:bg-[#1a1a2e] rounded-[14px] p-[18px]">
            <strong className="text-black dark:text-white">Site Launched!</strong>
            <p className="mt-[10px] m-0 text-[#506] dark:text-[#a080ff]">
              We have deployed the first AI-enabled business workspace platform. 🎉
            </p>
          </div>

          <div className="bg-[#f0fff6] dark:bg-[#1a2e22] rounded-[14px] p-[18px]">
            <strong className="text-black dark:text-white">New Feature: Flash Tribe</strong>
            <p className="mt-[10px] m-0 text-[#265] dark:text-[#50e090]">
              Now connect with fellow workspace members and grow your professional network.
            </p>
          </div>

          <div className="bg-[#fff8f0] dark:bg-[#2e241a] rounded-[14px] p-[18px]">
            <strong className="text-black dark:text-white">Maintenance Notice</strong>
            <p className="mt-[10px] m-0 text-[#a64] dark:text-[#ffa060]">
              There’s scheduled maintenance on Nov 3rd, 2AM to 3AM IST.
            </p>
          </div>
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

const SidebarMenu = ({ isOpen, onClose, onOpenLogin }: SidebarMenuProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [showUpdates, setShowUpdates] = useState(false);
  const [isWorkspacesOpen, setIsWorkspacesOpen] = useState(false);

  const solutions = [
    { label: "Virtual Office", href: "/services/virtual-office", icon: Building },
    { label: "Coworking Space", href: "/services/coworking-space", icon: Briefcase },
    { label: "On Demand", href: "/services/on-demand", icon: Zap },
    { label: "Event Spaces", href: "/services/event-spaces", icon: MapPin },
  ];

  const primaryTop = [
    { label: "Start Chatting", href: "/start-chatting", icon: MessageCircle },
    { label: "Business Setup", href: "/Solutions/business-setup", icon: FileText }
  ];

  const middle = [
    { label: "Your Bookings", href: "/dashboard/my-bookings", icon: Calendar },
    { label: "Flash Tribe", href: "/community", icon: Users }
  ];

  const footer = [
    { label: "Updates", href: "/updates", icon: Bell },
    { label: "Settings", href: "/settings", icon: SettingsIcon },
    // { label: "More", href: "#more", icon: MoreHorizontal }
  ];

  useEffect(() => {
    if (!isOpen && showUpdates) setShowUpdates(false);
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
      try {
        smoothScrollTo(href, { offset: -90 });
      } catch {
        document.querySelector(href)?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    } else {
      navigate(href);
    }
    onClose();
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
      document.body.style.overflow = "unset";
    }
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, showUpdates]);

  const menuWidth = showUpdates ? MENU_WIDTH_ICON : MENU_WIDTH_OPEN;
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
      {/* Overlay click closes both, NO blur or dark background */}
      <div
        onClick={closeBoth}
        className="absolute inset-0"
        style={{
          background: "transparent",
          cursor: "pointer"
        }}
      />

      {/* Updates Popup */}
      <UpdatesPopup open={showUpdates} menuWidth={menuWidth} onCloseBoth={closeBoth} />

      {/* Sidebar */}
      <div
        className="relative z-20 h-full bg-white dark:bg-[#0a0a0a] text-black dark:text-white border-r border-neutral-200 dark:border-white/10 shadow-xl transform transition-transform duration-300 ease-out overflow-hidden font-geist"
        style={{
          width: `${menuWidth}px`,
          minWidth: `${menuWidth}px`,
          maxWidth: `${menuWidth}px`,
          transition:
            "width 0.36s cubic-bezier(.7,.22,.26,.98), min-width 0.36s cubic-bezier(.7,.22,.26,.98), max-width 0.36s cubic-bezier(.7,.22,.26,.98)"
        }}
      >
        {/* Header */}
        {!hideLogoFooter && (
          <div className="flex items-center justify-between p-5 border-b border-neutral-200 dark:border-white/10" style={{ minHeight: 64 }}>
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
        <div className="overflow-hidden h-full pb-32 flex flex-col ">
          <div className="p-5 space-y-2 text-sm tracking-wide flex-1">
            <nav className="space-y-2">
              {/* Primary Top Items */}
              {primaryTop.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item.href, item.label)}
                  className={`group w-full flex items-center ${iconOnly ? "justify-center" : "gap-3 text-left"
                    } py-2 px-2 text-[13px] font-medium text-black dark:text-white hover:text-yellow-600 dark:hover:text-[#EDB003] rounded hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 font-poppins`}
                >
                  <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-yellow-600 dark:group-hover:text-[#EDB003] transition-colors duration-300" />
                  {!iconOnly && <span>{item.label}</span>}
                </button>
              ))}

              <div className="h-px bg-neutral-300 my-3" />

              {/* Get Workspaces Link */}
              <button
                onClick={() => handleNavigation("/services/virtual-office", "Get Workspaces")}
                className={`group w-full flex items-center ${iconOnly ? "justify-center" : "gap-3 text-left"
                  } py-2 px-2 text-[13px] font-medium text-black dark:text-white hover:text-yellow-600 dark:hover:text-[#EDB003] rounded hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 font-poppins`}
              >
                <Building className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-yellow-600 dark:group-hover:text-[#EDB003] transition-colors duration-300" />
                {!iconOnly && <span>Get Workspaces</span>}
              </button>

              <div className="h-px bg-neutral-300 my-3" />

              {/* Middle Items */}
              {middle.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item.href, item.label)}
                  className={`group w-full flex items-center ${iconOnly ? "justify-center" : "gap-3 text-left"
                    } py-2 px-2 text-[13px] font-medium text-black dark:text-white hover:text-yellow-600 dark:hover:text-[#EDB003] rounded hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 font-poppins`}
                >
                  <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-yellow-600 dark:group-hover:text-[#EDB003] transition-colors duration-300" />
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
                    } py-2 px-2 text-[13px] font-medium text-black dark:text-white hover:text-yellow-600 dark:hover:text-[#EDB003] rounded hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 font-poppins`}
                >
                  <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-yellow-600 dark:group-hover:text-[#EDB003] transition-colors duration-300" />
                  {!iconOnly && <span>{item.label}</span>}
                </button>
              ))}
            </nav>

            {/* Footer */}
            {!hideLogoFooter && (
              <>
                {/* User Profile Section - Only for Authenticated Users */}
                {isAuthenticated ? (
                  <div className="mb-4">
                    {/* User Profile Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800 shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                          {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate font-poppins">
                            {user?.fullName || 'User Account'}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate font-geist">
                            {user?.email || 'user@example.com'}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        <button
                          onClick={() => handleNavigation("/dashboard")}
                          className="w-full rounded-lg bg-blue-600 text-white font-semibold py-2.5 text-sm hover:bg-blue-700 active:scale-[0.98] transition flex items-center justify-center gap-2 shadow-sm font-poppins"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Go to Dashboard
                        </button>

                        <button
                          onClick={async () => {
                            await logout();
                            closeBoth();
                            navigate("/");
                          }}
                          className="w-full rounded-lg border-2 border-red-200 text-red-600 font-semibold py-2.5 text-sm hover:bg-red-600 hover:text-white hover:border-red-600 active:scale-[0.98] transition flex items-center justify-center gap-2 font-poppins"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Not Authenticated - Show Logo and Login
                  <>
                    <div className="flex items-center justify-center py-4">
                      <div className="w-20 h-20 rounded-full border-2 border-gray-300 dark:border-white/10 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden bg-white dark:bg-black/20 flex items-center justify-center">
                        <img
                          src="/Logo/FlashSpace Favicon.png"
                          alt="FlashSpace Favicon"
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                    </div>
                    <div className="space-y-3 pt-2">
                      <button
                        onClick={() => handleNavigation("#contact")}
                        className="w-full rounded-md bg-yellow-400 text-black font-semibold py-2 text-sm hover:bg-yellow-300 active:scale-[0.98] transition font-poppins"
                      >
                        Get Consultation
                      </button>

                      <button
                        onClick={() => {
                          onOpenLogin();
                          closeBoth();
                        }}
                        className="w-full rounded-md border border-neutral-600 dark:border-white/30 text-black dark:text-white py-2 text-sm hover:bg-yellow-400 hover:text-black dark:hover:bg-[#EDB003] dark:hover:text-black active:scale-[0.98] transition font-poppins font-semibold"
                      >
                        Log in
                      </button>
                    </div>
                  </>
                )}

                {/* Get Consultation Button - Always Show for Authenticated Users */}
                {isAuthenticated && (
                  <div className="mt-3">
                    <button
                      onClick={() => handleNavigation("#contact")}
                      className="w-full rounded-md bg-yellow-400 text-black font-semibold py-2 text-sm hover:bg-yellow-300 active:scale-[0.98] transition font-poppins"
                    >
                      Get Consultation
                    </button>
                  </div>
                )}
              </>
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
