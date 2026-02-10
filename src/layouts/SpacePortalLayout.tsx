import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import Sidebar from "@/components/SpacePartner/sidebar/Sidebar";
import TopBar from "@/components/SpacePartner/topbar/Topbar";
import Footer from "@/components/SpacePartner/footer/Footer";

import { SpacePortalSearchProvider } from "@/contexts/SpacePortalSearchContext";
import { SpacePortalNotificationsProvider } from "@/contexts/SpacePortalNotificationsContext";

import { SPACE_PORTAL_NOTIFICATIONS } from "@/data/spacePortal/notifications";
import type { SpacePortalNotification } from "@/types/spacePortal/notification";

/**
 * SpacePortalLayout
 *
 * Responsibilities:
 * - Sidebar layout (desktop + mobile)
 * - Topbar header (title, subtitle, search bar)
 * - Search query persistence per route
 * - Notification context provider
 * - Toast queue handling
 *
 * Backend-ready:
 * - Replace SPACE_PORTAL_NOTIFICATIONS with API fetched notifications.
 * - Replace addNotification logic with WebSocket / polling updates.
 */
export default function SpacePortalLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Sidebar UI state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  /**
   * Stores search query per page route.
   * Example:
   * {
   *   "/spaceportal/clients": "abc",
   *   "/spaceportal/tickets": "urgent"
   * }
   */
  const [searchQueryByPath, setSearchQueryByPath] = useState<
    Record<string, string>
  >({});

  /**
   * Notifications state (currently using mock data)
   */
  const [notifications, setNotifications] = useState(
    SPACE_PORTAL_NOTIFICATIONS
  );

  /**
   * Toast queue system (shows 1 toast at a time)
   */
  const [toastQueue, setToastQueue] = useState<SpacePortalNotification[]>([]);
  const [activeToast, setActiveToast] =
    useState<SpacePortalNotification | null>(null);

  const toastTimeoutRef = useRef<number | null>(null);

  /**
   * Used to detect new notifications (by ID)
   */
  const prevNotificationIdsRef = useRef<Set<string>>(
    new Set(SPACE_PORTAL_NOTIFICATIONS.map((item) => item.id))
  );

  /**
   * Avoid requesting Notification permission repeatedly.
   */
  const hasRequestedNotificationPermissionRef = useRef(false);

  /**
   * Search bar configuration per route.
   */
  const searchConfig: Record<string, { showSearch: boolean; placeholder: string }> =
    useMemo(
      () => ({
        "/spaceportal/dashboard": {
          showSearch: true,
          placeholder: "Search by ID, company, contact, space...",
        },
        "/spaceportal/clients": {
          showSearch: true,
          placeholder: "Search clients...",
        },
        "/spaceportal/tickets": {
          showSearch: true,
          placeholder: "Search tickets...",
        },
        "/spaceportal/space-management": {
          showSearch: true,
          placeholder: "Search spaces by name, city, id...",
        },
      }),
      []
    );

  /**
   * Resolve route key for search.
   * Example:
   * /spaceportal/clients/123 -> /spaceportal/clients
   */
  const searchKey = useMemo(() => {
    const { pathname } = location;

    if (pathname.startsWith("/spaceportal/clients/")) {
      return "/spaceportal/clients";
    }

    if (pathname.startsWith("/spaceportal/tickets/")) {
      return "/spaceportal/tickets";
    }

    if (pathname.startsWith("/spaceportal/space-management/")) {
      return "/spaceportal/space-management";
    }

    return pathname;
  }, [location.pathname]);

  /**
   * IMPORTANT FIX:
   * Must use searchKey instead of location.pathname
   * otherwise nested pages lose search config.
   */
  const searchMeta = useMemo(() => {
    return (
      searchConfig[searchKey] ?? {
        showSearch: false,
        placeholder: "Search...",
      }
    );
  }, [searchConfig, searchKey]);

  /**
   * Current page search value.
   */
  const searchValue = searchQueryByPath[searchKey] ?? "";

  /**
   * Updates search query for the active route.
   */
  const updateQueryForKey = (value: string) => {
    setSearchQueryByPath((prev) => ({ ...prev, [searchKey]: value }));
  };

  const handleSearchChange = (value: string) => {
    updateQueryForKey(value);
  };

  const handleSearchSubmit = (value: string) => {
    updateQueryForKey(value.trim());
  };

  /**
   * Title helper: allows highlighting 2nd word in teal.
   */
  const makeTitle = (lead: string, highlight?: string) =>
    highlight ? (
      <>
        {lead} <span className="text-[#3FA69E]">{highlight}</span>
      </>
    ) : (
      lead
    );

  /**
   * Page header config (title + subtitle)
   */
  const pageHeaderMap: Record<string, { title: ReactNode; subtitle?: string }> =
    useMemo(
      () => ({
        "/spaceportal/dashboard": {
          title: makeTitle("Space", "Dashboard"),
          subtitle:
            "Complete control over clients, plans, and space performance.",
        },
        "/spaceportal/booking-analytics": {
          title: makeTitle("Booking", "Analytics"),
          subtitle:
            "Monitor performance across plans, spaces, and revenue trends.",
        },
        "/spaceportal/booking-calendar": {
          title: makeTitle("Booking", "Calendar"),
          subtitle: "Plan schedules and manage booking requests.",
        },
        "/spaceportal/clients": {
          title: makeTitle("My", "Clients"),
          subtitle: "Manage all your client relationships",
        },
        "/spaceportal/client-enquiries": {
          title: makeTitle("Client", "Enquiries"),
          subtitle: "Manage new leads, ongoing conversations, and conversions.",
        },
        "/spaceportal/invoices-payments": {
          title: makeTitle("Invoices and", "Payments"),
          subtitle: "Submit new invoices, track payments received, and view dues.",
        },
        "/spaceportal/notifications": {
          title: "Notifications",
          subtitle: "All updates from clients, bookings, invoices, and support.",
        },
        "/spaceportal/profile": {
          title: "Profile",
          subtitle: "Manage your space partner profile and contact details.",
        },
        "/spaceportal/settings": {
          title: "Settings",
          subtitle: "Manage notification preferences and security details.",
        },
        "/spaceportal/tickets": {
          title: makeTitle("Ticket", "System"),
          subtitle:
            "Track support requests raised by clients and manage resolutions.",
        },
        "/spaceportal/space-management": {
          title: makeTitle("Space", "Management"),
          subtitle:
            "Manage your coworking spaces, availability, and operational status.",
        },
        "/spaceportal/space-management/add": {
          title: makeTitle("Add", "Space"),
          subtitle: "Create a new space listing for your portal.",
        },
        "/spaceportal/clients/:id": {
          title: "Client Details",
          subtitle: "Review client profile and plan details.",
        },
        "/spaceportal/feedback-nps": {
          title: "Feedback",
          subtitle: "Monitor client satisfaction",
        },
      }),
      []
    );

  /**
   * Resolve header key for dynamic routes.
   */
  const headerKey = useMemo(() => {
    if (location.pathname.startsWith("/spaceportal/clients/")) {
      return "/spaceportal/clients/:id";
    }
    return location.pathname;
  }, [location.pathname]);

  const headerConfig = pageHeaderMap[headerKey] ?? {
    title: "Space Portal",
  };

  /**
   * Auto close sidebar when route changes.
   */
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  /**
   * Load sidebar collapsed state from localStorage
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = window.localStorage.getItem("spaceportal.sidebar.collapsed");
    if (saved === "true") {
      setIsSidebarCollapsed(true);
    }
  }, []);

  /**
   * Persist sidebar collapsed state in localStorage
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    window.localStorage.setItem(
      "spaceportal.sidebar.collapsed",
      String(isSidebarCollapsed)
    );
  }, [isSidebarCollapsed]);

  /**
   * Prevent body scrolling when mobile sidebar is open.
   */
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  /**
   * Detect new notifications and push them into toast queue.
   * Also triggers browser notifications if permission is granted.
   */
  useEffect(() => {
    const prevIds = prevNotificationIdsRef.current;
    const newItems = notifications.filter((item) => !prevIds.has(item.id));

    if (newItems.length > 0) {
      setToastQueue((prev) => [...prev, ...newItems]);
      triggerBrowserNotifications(newItems, hasRequestedNotificationPermissionRef);
    }

    prevNotificationIdsRef.current = new Set(
      notifications.map((item) => item.id)
    );
  }, [notifications]);

  /**
   * Show next toast when activeToast is cleared.
   */
  useEffect(() => {
    if (activeToast || toastQueue.length === 0) return;

    setActiveToast(toastQueue[0]);
    setToastQueue((prev) => prev.slice(1));
  }, [activeToast, toastQueue]);

  /**
   * Auto dismiss toast after 4 seconds.
   */
  useEffect(() => {
    if (!activeToast) return;

    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }

    toastTimeoutRef.current = window.setTimeout(() => {
      setActiveToast(null);
    }, 4000);

    return () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, [activeToast]);

  const dismissToast = () => {
    setActiveToast(null);
  };

  /**
   * Notification provider value extracted (cleaner + backend ready).
   */
  const notificationsProviderValue = useMemo(() => {
    return {
      notifications,

      markAllRead: () =>
        setNotifications((prev) => prev.map((item) => ({ ...item, read: true }))),

      markRead: (id: string) =>
        setNotifications((prev) =>
          prev.map((item) => (item.id === id ? { ...item, read: true } : item))
        ),

      markUnread: (id: string) =>
        setNotifications((prev) =>
          prev.map((item) => (item.id === id ? { ...item, read: false } : item))
        ),

      deleteNotification: (id: string) =>
        setNotifications((prev) => prev.filter((item) => item.id !== id)),

      restoreNotification: (
        notification: SpacePortalNotification,
        index: number
      ) =>
        setNotifications((prev) => {
          if (prev.some((item) => item.id === notification.id)) {
            return prev;
          }

          if (index === undefined || index < 0 || index > prev.length) {
            return [notification, ...prev];
          }

          return [
            ...prev.slice(0, index),
            notification,
            ...prev.slice(index),
          ];
        }),

      clearNotifications: () => setNotifications([]),

      addNotification: (notification: SpacePortalNotification) =>
        setNotifications((prev) => [notification, ...prev]),
    };
  }, [notifications]);

  /**
   * Search provider value extracted (cleaner).
   */
  const searchProviderValue = useMemo(() => {
    return {
      query: searchValue,
      setQuery: updateQueryForKey,
      clearQuery: () => updateQueryForKey(""),
    };
  }, [searchValue, searchKey]);

  return (
    <SpacePortalNotificationsProvider value={notificationsProviderValue}>
      <SpacePortalSearchProvider value={searchProviderValue}>
        <div className="flex min-h-screen bg-slate-50">
          {/* Desktop Sidebar */}
          <div className="hidden lg:flex">
            <Sidebar
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
            />
          </div>

          {/* Mobile Sidebar */}
          <div
            className={`fixed inset-0 z-40 transition-opacity lg:hidden ${isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            aria-hidden={!isSidebarOpen}
          >
            <button
              type="button"
              aria-label="Close sidebar"
              onClick={() => setIsSidebarOpen(false)}
              className="absolute inset-0 bg-black/40"
            />

            <div
              className={`absolute inset-y-0 left-0 w-72 transform bg-white shadow-2xl transition-transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
              <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </div>
          </div>

          {/* Toast */}
          {activeToast ? (
            <div className="fixed left-1/2 top-4 z-50 w-[92%] max-w-md -translate-x-1/2">
              <div className="animate-in slide-in-from-top-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {activeToast.title}
                    </p>

                    {activeToast.description ? (
                      <p className="text-xs text-slate-500">
                        {activeToast.description}
                      </p>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={dismissToast}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-700"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {/* Main Content */}
          <div className="flex min-w-0 flex-1 flex-col">
            {/* Topbar */}
            <div className="px-3 pt-3 sm:px-5 sm:pt-5 lg:px-8">
              <TopBar
                title={headerConfig.title}
                subtitle={headerConfig.subtitle}
                onMenuClick={() => setIsSidebarOpen(true)}
                showSearch={searchMeta.showSearch}
                searchValue={searchValue}
                searchPlaceholder={searchMeta.placeholder}
                onSearchChange={handleSearchChange}
                onSearchSubmit={handleSearchSubmit}
                notifications={notifications}
                onProfileNavigate={() => navigate("/spaceportal/profile")}
                onSettingsNavigate={() => navigate("/spaceportal/settings")}
              />
            </div>

            {/* Page Content */}
            <main className="mt-4 flex-1 px-3 pb-6 sm:mt-6 sm:px-5 lg:px-8">
              <Outlet />
            </main>

            {/* Footer */}
            <div className="px-3 pb-4 sm:px-5 sm:pb-6 lg:px-8">
              <Footer />
            </div>
          </div>
        </div>
      </SpacePortalSearchProvider>
    </SpacePortalNotificationsProvider>
  );
}

/**
 * Browser Notifications Helper
 *
 * - Shows browser notification when permission granted
 * - Requests permission only once
 */
function triggerBrowserNotifications(
  newItems: SpacePortalNotification[],
  permissionRequestedRef: React.MutableRefObject<boolean>
) {
  if (typeof window === "undefined" || !("Notification" in window)) return;

  newItems.forEach((item) => {
    const permission = window.Notification.permission;

    // If already granted, show instantly
    if (permission === "granted") {
      new window.Notification(item.title, {
        body: item.description ?? "",
        tag: item.id,
      });
      return;
    }

    // Request permission only once
    if (permission === "default" && !permissionRequestedRef.current) {
      permissionRequestedRef.current = true;

      window.Notification.requestPermission().then((result) => {
        if (result === "granted") {
          new window.Notification(item.title, {
            body: item.description ?? "",
            tag: item.id,
          });
        }
      });
    }
  });
}
