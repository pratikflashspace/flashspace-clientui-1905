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
  LogOut
} from "lucide-react";

import { smoothScrollTo } from "@/lib/lenis";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
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
      style={{
        position: "fixed",
        top: 0,
        left: menuWidth,
        width: UPDATES_WIDTH,
        height: "100vh",
        zIndex: 9999,
        transform: open ? "translateX(0)" : "translateX(120%)",
        transition: "transform 0.4s cubic-bezier(.7,.22,.26,.98)"
      }}
    >
      <div
        style={{
          background: "#fff",
          borderTopLeftRadius: "0px",
          borderBottomLeftRadius: "0px",
          borderTopRightRadius: "22px",
          borderBottomRightRadius: "22px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          padding: "28px 32px 32px 32px",
          width: "100%",
          height: "100%",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          position: "relative"
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: 18,
              color: "#222",
              marginTop: 10,
              letterSpacing: "0.5px"
            }}
          >
            Update & <span style={{ color: "#FFCC00" }}>Notification</span>
          </h2>
          <button
            onClick={onCloseBoth}
            aria-label="Close updates"
            style={{ background: "transparent", border: "none", cursor: "pointer", padding: 8 }}
          >
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Updates Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.3rem" }}>
          <div style={{ background: "#f6f7ff", borderRadius: "14px", padding: "18px" }}>
            <strong>Site Launched!</strong>
            <p style={{ margin: "10px 0 0 0", color: "#506" }}>
              We have deployed the first AI-enabled business workspace platform. 🎉
            </p>
          </div>

          <div style={{ background: "#f0fff6", borderRadius: "14px", padding: "18px" }}>
            <strong>New Feature: Flash Tribe</strong>
            <p style={{ margin: "10px 0 0 0", color: "#265" }}>
              Now connect with fellow workspace members and grow your professional network.
            </p>
          </div>

          <div style={{ background: "#fff8f0", borderRadius: "14px", padding: "18px" }}>
            <strong>Maintenance Notice</strong>
            <p style={{ margin: "10px 0 0 0", color: "#a64" }}>
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
const SidebarMenu = ({ isOpen, onClose }: SidebarMenuProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [showUpdates, setShowUpdates] = useState(false);

  const primaryTop = [
    { label: "Start Chatting", href: "/start-chatting", icon: MessageCircle },
    { label: "Get WorkSpace", href: "/services/coworking-space", icon: Briefcase },
    { label: "Business Setup", href: "/Solutions/business-setup", icon: FileText }
  ];

  const middle = [
    { label: "Your Bookings", href: "/bookings", icon: Calendar },
    { label: "Flash Tribe", href: "/community", icon: Users }
  ];

  const footer = [
    { label: "Updates", href: "/updates", icon: Bell },
    { label: "Settings", href: "/settings", icon: SettingsIcon },
    { label: "More", href: "#more", icon: MoreHorizontal }
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
      className={`fixed inset-0 z-[12000] overflow-hidden transition-opacity duration-300 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
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
        className="relative z-20 h-full bg-white text-black border-r border-neutral-200 shadow-xl transform transition-transform duration-300 ease-out overflow-hidden"
        style={{
          fontFamily: "Geist",
          width: `${menuWidth}px`,
          minWidth: `${menuWidth}px`,
          maxWidth: `${menuWidth}px`,
          transition:
            "width 0.36s cubic-bezier(.7,.22,.26,.98), min-width 0.36s cubic-bezier(.7,.22,.26,.98), max-width 0.36s cubic-bezier(.7,.22,.26,.98)"
        }}
      >
        {/* Header */}
        {!hideLogoFooter && (
          <div className="flex items-center justify-between p-5 border-b border-neutral-200" style={{ minHeight: 64 }}>
            <img
              src="/Logo/Flashspace Logo.png"
              alt="FlashSpace Logo"
              className="h-8 w-auto cursor-pointer select-none"
              onClick={() => handleNavigation("/")}
            />
            <button
              onClick={closeBoth}
              className="p-2 rounded-md hover:bg-black/10 active:scale-95 transition"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Menu items */}
        <div className="overflow-y-auto h-full pb-32 flex flex-col">
          <div className="p-5 space-y-8 text-sm tracking-wide flex-1">
            <nav className="space-y-2">
              {[...primaryTop, { divider: true }, ...middle, { divider: true }, ...footer].map(
                (item: any, idx) =>
                  item.divider ? (
                    <div key={idx} className="h-px bg-neutral-300 my-3" />
                  ) : (
                    <button
                      key={item.label}
                      onClick={() => handleNavigation(item.href, item.label)}
                      className={`group flex items-center ${
                        iconOnly ? "justify-center" : "gap-3 text-left"
                      } py-2 px-2 text-[13px] font-medium text-black hover:text-yellow-600 rounded hover:bg-black/5 transition-all duration-300`}
                    >
                      <item.icon className="w-5 h-5 text-gray-600 group-hover:text-yellow-600 transition-colors duration-300" />
                      {!iconOnly && <span>{item.label}</span>}
                    </button>
                  )
              )}
            </nav>

            {/* Footer */}
            {!hideLogoFooter && (
              <>
                {/* User Profile Section - Only for Authenticated Users */}
                {isAuthenticated ? (
                  <div className="mb-4">
                    {/* User Profile Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100 shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                          {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {user?.fullName || 'User Account'}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {user?.email || 'user@example.com'}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        <button
                          onClick={() => handleNavigation("/dashboard")}
                          className="w-full rounded-lg bg-blue-600 text-white font-semibold py-2.5 text-sm hover:bg-blue-700 active:scale-[0.98] transition flex items-center justify-center gap-2 shadow-sm"
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
                          className="w-full rounded-lg border-2 border-red-200 text-red-600 font-semibold py-2.5 text-sm hover:bg-red-600 hover:text-white hover:border-red-600 active:scale-[0.98] transition flex items-center justify-center gap-2"
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
                      <div className="w-20 h-20 rounded-full border-2 border-gray-300 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden bg-white flex items-center justify-center">
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
                        className="w-full rounded-md bg-yellow-400 text-black font-semibold py-2 text-sm hover:bg-yellow-300 active:scale-[0.98] transition"
                      >
                        Get Consultation
                      </button>
                      
                      <button
                        onClick={() => handleNavigation("/login")}
                        className="w-full rounded-md border border-neutral-600 text-black py-2 text-sm hover:bg-yellow-400 hover:text-white active:scale-[0.98] transition"
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
                      className="w-full rounded-md bg-yellow-400 text-black font-semibold py-2 text-sm hover:bg-yellow-300 active:scale-[0.98] transition"
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
