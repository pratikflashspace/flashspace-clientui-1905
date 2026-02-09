import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "@/components/SpacePartner/sidebar/Sidebar";
import Topbar from "@/components/SpacePartner/topbar/Topbar";
import Footer from "@/components/SpacePartner/footer/Footer";
import { SpacePortalSearchProvider } from "@/contexts/SpacePortalSearchContext";
import { SPACE_PORTAL_NOTIFICATIONS } from "@/data/spacePortal/notifications";
import { SpacePortalNotificationsProvider } from "@/contexts/SpacePortalNotificationsContext";
import type { SpacePortalNotification } from "@/types/spacePortal/notification";

export default function SpacePortalLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQueryByPath, setSearchQueryByPath] = useState<
    Record<string, string>
  >({});
  const [notifications, setNotifications] = useState(
    SPACE_PORTAL_NOTIFICATIONS
  );
  const [toastQueue, setToastQueue] = useState<SpacePortalNotification[]>([]);
  const [activeToast, setActiveToast] =
    useState<SpacePortalNotification | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);
  const prevNotificationIdsRef = useRef<Set<string>>(
    new Set(SPACE_PORTAL_NOTIFICATIONS.map((item) => item.id))
  );
  const hasRequestedNotificationPermissionRef = useRef(false);

  const searchConfig: Record<
    string,
    { showSearch: boolean; placeholder: string }
  > = {
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
  };

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

  const searchMeta = searchConfig[location.pathname] ?? {
    showSearch: false,
    placeholder: "Search...",
  };

  const searchValue = searchQueryByPath[searchKey] ?? "";
  const searchQuery = searchQueryByPath[searchKey] ?? "";

  const updateQueryForKey = (value: string) => {
    setSearchQueryByPath((prev) => ({ ...prev, [searchKey]: value }));
  };

  const handleSearchChange = (value: string) => {
    updateQueryForKey(value);
  };

  const handleSearchSubmit = (value: string) => {
    updateQueryForKey(value.trim());
  };

  useEffect(() => {
    const prevIds = prevNotificationIdsRef.current;
    const newItems = notifications.filter((item) => !prevIds.has(item.id));

    if (newItems.length > 0) {
      setToastQueue((prev) => [...prev, ...newItems]);
      newItems.forEach((item) => {
        if (typeof window === "undefined" || !("Notification" in window)) {
          return;
        }
        const permission = window.Notification.permission;

        if (permission === "granted") {
          new window.Notification(item.title, {
            body: item.description ?? "",
            tag: item.id,
          });
          return;
        }

        if (permission === "default" && !hasRequestedNotificationPermissionRef.current) {
          hasRequestedNotificationPermissionRef.current = true;
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

    prevNotificationIdsRef.current = new Set(
      notifications.map((item) => item.id)
    );
  }, [notifications]);

  useEffect(() => {
    if (activeToast || toastQueue.length === 0) {
      return;
    }

    setActiveToast(toastQueue[0]);
    setToastQueue((prev) => prev.slice(1));
  }, [activeToast, toastQueue]);

  useEffect(() => {
    if (!activeToast) {
      return;
    }

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

  const makeTitle = (lead: string, highlight?: string) =>
    highlight ? (
      <>
        {lead} <span className="text-[#3FA69E]">{highlight}</span>
      </>
    ) : (
      lead
    );

  const pageHeaderMap: Record<string, { title: ReactNode; subtitle?: string }> =
    {
    "/spaceportal/dashboard": {
      title: makeTitle("Space", "Dashboard"),
      subtitle: "Complete control over clients, plans, and space performance.",
    },
    "/spaceportal/booking-analytics": {
      title: makeTitle("Booking", "Analytics"),
      subtitle: "Monitor performance across plans, spaces, and revenue trends.",
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
      subtitle: "Manage your coworking spaces, availability, and operational status.",
    },
    "/spaceportal/space-management/add": {
      title: makeTitle("Add", "Space"),
      subtitle: "Create a new space listing for your portal.",
    },
    "/spaceportal/clients/:id": {
      title: "Client Details",
      subtitle: "Review client profile and plan details.",
    },
  };

  const headerKey = useMemo(() => {
    if (location.pathname.startsWith("/spaceportal/clients/")) {
      return "/spaceportal/clients/:id";
    }
    return location.pathname;
  }, [location.pathname]);

  const headerConfig = pageHeaderMap[headerKey] ?? {
    title: "Space Portal",
  };

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const saved = window.localStorage.getItem("spaceportal.sidebar.collapsed");
    if (saved === "true") {
      setIsSidebarCollapsed(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(
      "spaceportal.sidebar.collapsed",
      String(isSidebarCollapsed)
    );
  }, [isSidebarCollapsed]);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  return (
    <SpacePortalNotificationsProvider
      value={{
        notifications,
        markAllRead: () =>
          setNotifications((prev) =>
            prev.map((item) => ({ ...item, read: true }))
          ),
        markRead: (id) =>
          setNotifications((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, read: true } : item
            )
          ),
        markUnread: (id) =>
          setNotifications((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, read: false } : item
            )
          ),
        deleteNotification: (id) =>
          setNotifications((prev) => prev.filter((item) => item.id !== id)),
        restoreNotification: (notification, index) =>
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
        addNotification: (notification) =>
          setNotifications((prev) => [notification, ...prev]),
      }}
    >
      <SpacePortalSearchProvider
        value={{
          query: searchQuery,
          setQuery: updateQueryForKey,
          clearQuery: () => updateQueryForKey(""),
        }}
      >
        <div className="flex min-h-screen bg-slate-50">
          {/* Sidebar */}
        <div className="hidden lg:flex">
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          />
        </div>

          {/* Mobile Sidebar */}
          <div
            className={`fixed inset-0 z-40 transition-opacity lg:hidden ${
              isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
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
              className={`absolute inset-y-0 left-0 w-72 transform bg-white shadow-2xl transition-transform ${
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
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
            <Topbar
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
