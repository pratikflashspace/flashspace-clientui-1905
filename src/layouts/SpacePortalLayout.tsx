import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import ErrorBoundary from "@/components/ErrorBoundary";

import Sidebar from "@/components/SpacePartner/sidebar/Sidebar";
import TopBar from "@/components/SpacePartner/topbar/Topbar";

import { SpacePortalSearchProvider } from "@/contexts/SpacePortalSearchContext";
import { SpacePortalNotificationsProvider } from "@/contexts/SpacePortalNotificationsContext";
import { useSocket } from "@/contexts/SocketContext";
import { useAuth } from "@/contexts/AuthContext";
import { API_CONFIG } from "@/config/api.config";
import { getLenis } from "@/lib/lenis";

import type { SpacePortalNotification } from "@/types/spacePortal/notification";
import { SPACE_PORTAL_NOTIFICATIONS } from "@/data/spacePortal/notifications";

/**
 * SpacePortalLayout
 *
 * Responsibilities:
 * - Sidebar layout (desktop + mobile)
 * - Topbar header (title, subtitle, search bar)
 * - Search query persistence per route
 * - Notification context provider (real-time via Socket.io + REST API)
 * - Toast queue handling
 */
/**
 * Map a raw backend INotification to SpacePortalNotification.
 */
function mapNotification(raw: any): SpacePortalNotification {
  const id = raw._id?.toString() ?? raw.id ?? String(Date.now());
  const metadata = raw.metadata && typeof raw.metadata === "object" ? raw.metadata : {};
  const href =
    typeof metadata.actionUrl === "string"
      ? metadata.actionUrl
      : typeof raw.href === "string"
        ? raw.href
        : undefined;

  return {
    _id: id,
    id,
    title: raw.title ?? "",
    description: raw.message ?? raw.description ?? undefined,
    href,
    metadata,
    read: raw.read ?? false,
    archived: raw.archived ?? false,
    createdAt: raw.createdAt ?? undefined,
    time: raw.createdAt
      ? new Date(raw.createdAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
      : undefined,
  };
}

export default function SpacePortalLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { user } = useAuth();

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
    SPACE_PORTAL_NOTIFICATIONS,
  );

  /**
   * Toast queue system (shows 1 toast at a time)
   */
  const [toastQueue, setToastQueue] = useState<SpacePortalNotification[]>([]);
  const [activeToast, setActiveToast] =
    useState<SpacePortalNotification | null>(null);

  const toastTimeoutRef = useRef<number | null>(null);

  /**
   * Used to detect new notifications (by ID) for toast/browser-notification.
   */
  const prevNotificationIdsRef = useRef<Set<string>>(
    new Set(SPACE_PORTAL_NOTIFICATIONS.map((item) => item.id)),
  );

  /**
   * Avoid requesting Notification permission repeatedly.
   */
  const hasRequestedNotificationPermissionRef = useRef(false);

  // ---
  // 1. Fetch notifications from API on mount
  // ---
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/notifications`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const mapped: SpacePortalNotification[] =
            data.data.map(mapNotification);
          setNotifications(mapped);
          // Seed the set so existing notifications don't re-toast
          prevNotificationIdsRef.current = new Set(mapped.map((n) => n.id));
        }
      } catch (err) {
        console.error("[SpacePortal] Failed to fetch notifications:", err);
      }
    };

    fetchNotifications();
  }, [user]);

  // ---
  // 2. Subscribe to real-time notifications via Socket.io
  // ---
  useEffect(() => {
    if (!socket || !user) return;

    const userId = (user as any)._id ?? (user as any).id;

    // Join the partner's personal feed room
    socket.emit("join_user_feed", userId);

    const handleNewNotification = (raw: any) => {
      const notification = mapNotification(raw);
      setNotifications((prev) => [notification, ...prev]);
    };

    socket.on("notification:new", handleNewNotification);

    return () => {
      socket.off("notification:new", handleNewNotification);
    };
  }, [socket, user]);

  /**
   * Search bar configuration per route.
   */
  const searchConfig: Record<
    string,
    { showSearch: boolean; placeholder: string }
  > = useMemo(
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
      "/spaceportal/track-progress": {
        showSearch: true,
        placeholder: "Search by ID, user, or space...",
      },
    }),
    [],
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
        {lead}{" "}
        <span className="text-[#4A6D56] italic">{highlight}</span>
      </>
    ) : (
      lead
    );

  /**
   * Page header config (title + subtitle)
   */
  const pageHeaderMap: Record<
    string,
    {
      title: ReactNode;
      subtitle?: string;
      hideTopBar?: boolean;
      pageBg?: string;
    }
  > = useMemo(
    () => ({
      "/spaceportal/dashboard": {
        title: makeTitle("Space", "Dashboard"),
        subtitle:
          "Complete control over clients, plans, and space performance.",
        hideTopBar: true,
        pageBg: "#f3f4f3",
      },
      "/spaceportal/booking-analytics": {
        title: makeTitle("Booking", "Analytics"),
        subtitle:
          "Monitor performance across plans, spaces, and revenue trends.",
        hideTopBar: true,
        pageBg: "#f3f4f3",
      },
      "/spaceportal/summary-analytics": {
        title: makeTitle("Summary", "Reports"),
        subtitle:
          "High-level overview of bookings, mail, and visitor activity.",
        hideTopBar: true,
        pageBg: "#f3f4f3",
      },
      "/spaceportal/booking-analytics/:propertyId": {
        title: makeTitle("Booking", "Analytics"),
        subtitle:
          "View all bookings and clients linked to a specific space.",
        hideTopBar: true,
        pageBg: "#f3f4f3",
      },
      "/spaceportal/booking-calendar": {
        title: makeTitle("Booking", "Calendar"),
        subtitle: "Plan schedules and manage booking requests.",
        hideTopBar: true,
        pageBg: "#f3f4f3",
      },
      "/spaceportal/booking-requests": {
        title: makeTitle("Booking", "Requests"),
        subtitle: "Review KYC, agreements, and final documents.",
        hideTopBar: true,
        pageBg: "#f3f4f3",
      },
      "/spaceportal/clients": {
        title: makeTitle("My", "Clients"),
        subtitle: "Manage all your client relationships",
        hideTopBar: true,
        pageBg: "#f3f4f3",
      },
      "/spaceportal/invoices-payments": {
        title: makeTitle("Invoices and", "Payments"),
        subtitle:
          "Submit new invoices, track payments received, and view dues.",
        hideTopBar: true,
        pageBg: "#f3f4f3",
      },
      "/spaceportal/notifications": {
        title: "Notifications",
        subtitle: "All updates from clients, bookings, invoices, and support.",
      },
      "/spaceportal/kyc-verification": {
        title: makeTitle("KYC", "Verification"),
        subtitle: "Manage your verification profiles for compliance",
        hideTopBar: true,
        pageBg: "#f3f4f3",
      },
      "/spaceportal/track-progress": {
        title: makeTitle("Track", "Progress"),
        subtitle: "Monitor the lifecycle progress of all your space bookings.",
        hideTopBar: true,
        pageBg: "#f3f4f3",
      },
      "/spaceportal/profile": {
        title: "Profile",
        subtitle: "Manage your space partner profile and contact details.",
        hideTopBar: true,
        pageBg: "#f3f4f3",
      },
      "/spaceportal/settings": {
        title: "Settings",
        subtitle: "Manage notification preferences and security details.",
      },
      "/spaceportal/tickets": {
        title: makeTitle("Ticket", "System"),
        subtitle:
          "Track support requests raised by clients and manage resolutions.",
        hideTopBar: true,
        pageBg: "#f3f4f3",
      },
      "/spaceportal/space-management": {
        title: makeTitle("My", "Spaces"),
        subtitle: "Manage all your workspace listings",
        hideTopBar: true,
        pageBg: "#f3f4f3",
      },
      "/spaceportal/space-management/add": {
        title: makeTitle("Add", "Space"),
        subtitle: "Create a new space listing for your portal.",
        hideTopBar: true,
        pageBg: "#f3f4f3",
      },
      "/spaceportal/clients/:id": {
        title: "Client Details",
        subtitle: "Review client profile and plan details.",
      },
      "/spaceportal/team-management": {
        title: makeTitle("Team", "Members"),
        subtitle: "Manage your team and their access permissions",
        hideTopBar: true,
        pageBg: "#f3f4f3",
      },
      "/spaceportal/tasks": {
        title: makeTitle("Tickets &", "Tasks"),
        subtitle: "Manage your client tickets and internal tasks",
        hideTopBar: true,
        pageBg: "#f3f4f3",
      },
      "/spaceportal/feedback-nps": {
        title: makeTitle("Feedback &", "NPS"),
        subtitle: "Monitor client satisfaction and feedback",
        hideTopBar: true,
        pageBg: "#f3f4f3",
      },
      "/spaceportal/client-enquiries": {
        title: makeTitle("Client", "Enquiries"),
        subtitle: "Manage and convert incoming client enquiries",
        hideTopBar: true,
        pageBg: "#f3f4f3",
      },
      "/spaceportal/mail-visits": {
        title: makeTitle("Mail &", "Visits"),
        subtitle: "Track client mail and visitor logs effectively",
        hideTopBar: true,
        pageBg: "#f3f4f3",
      },
      "/spaceportal/space-management/:id": {
        title: "Property Details",
        subtitle: "Review your property performance and inventory.",
        hideTopBar: true,
        pageBg: "#f3f4f3",
      },
    }),
    [],
  );

  /**
   * Resolve header key for dynamic routes.
   */
  const headerKey = useMemo(() => {
    if (location.pathname.startsWith("/spaceportal/booking-analytics/")) {
      return "/spaceportal/booking-analytics/:propertyId";
    }
    if (location.pathname.startsWith("/spaceportal/clients/")) {
      return "/spaceportal/clients/:id";
    }
    if (
      location.pathname.startsWith("/spaceportal/space-management/") &&
      location.pathname !== "/spaceportal/space-management/add"
    ) {
      return "/spaceportal/space-management/:id";
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
      String(isSidebarCollapsed),
    );
  }, [isSidebarCollapsed]);

  useEffect(() => {
    const lenis = getLenis();
    if (!lenis) return;

    if (isSidebarOpen) {
      lenis.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis.start();
      document.body.style.overflow = "";
    }

    return () => {
      lenis.start();
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
      triggerBrowserNotifications(
        newItems,
        hasRequestedNotificationPermissionRef,
      );
    }

    prevNotificationIdsRef.current = new Set(
      notifications.map((item) => item.id),
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

  const navigateToNotification = (notification: SpacePortalNotification) => {
    const href =
      notification.href ||
      (typeof notification.metadata?.actionUrl === "string"
        ? notification.metadata.actionUrl
        : undefined);

    const title = (notification.title || "").toLowerCase();
    const message = (notification.description || "").toLowerCase();
    const metadata = notification.metadata || {};

    if (href?.startsWith("/spaceportal/")) {
      navigate(href);
    } else if (href?.startsWith("/")) {
      navigate(href);
    } else if (
      metadata.ticketId ||
      metadata.type === "TICKET_UPDATE" ||
      title.includes("ticket") ||
      message.includes("ticket")
    ) {
      navigate("/spaceportal/tickets");
    } else if (
      metadata.meetingId ||
      metadata.type === "MEETING_BOOKED" ||
      title.includes("meeting") ||
      message.includes("meeting")
    ) {
      navigate("/spaceportal/booking-calendar");
    } else if (
      metadata.type === "booking_request" ||
      title.includes("booking request") ||
      message.includes("booking request")
    ) {
      navigate("/spaceportal/booking-requests");
    } else if (
      metadata.invoiceId ||
      metadata.invoiceNumber ||
      metadata.type === "invoice_generated" ||
      metadata.type === "invoice_paid" ||
      title.includes("invoice") ||
      message.includes("invoice")
    ) {
      navigate("/spaceportal/invoices-payments");
    } else if (
      metadata.clientId ||
      title.includes("client") ||
      message.includes("client")
    ) {
      if (metadata.clientId) {
        navigate(`/spaceportal/clients/${metadata.clientId}`);
      } else {
        navigate("/spaceportal/clients");
      }
    } else if (
      metadata.propertyId ||
      metadata.spaceId ||
      title.includes("space") ||
      message.includes("space")
    ) {
      const id = metadata.propertyId || metadata.spaceId;
      if (id) {
        navigate(`/spaceportal/space-management/${id}`);
      } else {
        navigate("/spaceportal/space-management");
      }
    } else if (
      metadata.visitId ||
      metadata.visitorId ||
      title.includes("visit") ||
      message.includes("visit") ||
      title.includes("visitor") ||
      message.includes("visitor") ||
      title.includes("mail") ||
      message.includes("mail") ||
      title.includes("parcel") ||
      message.includes("parcel")
    ) {
      navigate("/spaceportal/mail-visits");
    } else if (
      metadata.kycId ||
      title.includes("kyc") ||
      message.includes("kyc") ||
      title.includes("verification") ||
      message.includes("verification")
    ) {
      navigate("/spaceportal/kyc-verification");
    } else {
      navigate("/spaceportal/notifications");
    }

    setNotifications((prev) =>
      prev.map((item) =>
        item.id === notification.id ? { ...item, read: true } : item,
      ),
    );
    setActiveToast(null);
  };

  /**
   * Notification provider value ? all mutations are optimistic
   * (local state updates immediately; API call follows async).
   */
  const notificationsProviderValue = useMemo(() => {
    const base = API_CONFIG.BASE_URL;
    const unreadCount = notifications.filter(n => !n.read && !n.archived).length;

    return {
      notifications,
      unreadCount,

      markAllRead: () =>
        {
          setNotifications((prev) =>
            prev.map((item) => ({ ...item, read: true })),
          );
          fetch(`${base}/api/notifications/read-all`, {
            method: "PATCH",
            credentials: "include",
          }).catch((err) =>
            console.error("[SpacePortal] markAllRead failed:", err),
          );
        },

      markRead: (id: string) => {
        setNotifications((prev) =>
          prev.map((item) => (item.id === id ? { ...item, read: true } : item)),
        );
        fetch(`${base}/api/notifications/${id}/read`, {
          method: "PATCH",
          credentials: "include",
        }).catch((err) =>
          console.error("[SpacePortal] markRead failed:", err),
        );
      },
      // Mark unread is local-only (no backend PATCH for unread)
      markUnread: (id: string) =>
        setNotifications((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, read: false } : item,
          ),
        ),

      deleteNotification: async (id: string) => {
        setNotifications((prev) => prev.filter((item) => item.id !== id));
        try {
          await fetch(`${base}/api/notifications/${id}/archive`, {
            method: "PATCH",
            credentials: "include",
          });
        } catch (err) {
          console.error("[SpacePortal] deleteNotification failed:", err);
        }
      },

      restoreNotification: (
        notification: SpacePortalNotification,
        index: number,
      ) =>
        setNotifications((prev) => {
          if (prev.some((item) => item.id === notification.id)) {
            return prev;
          }

          if (index === undefined || index < 0 || index > prev.length) {
            return [notification, ...prev];
          }

          return [...prev.slice(0, index), notification, ...prev.slice(index)];
        }),

      clearNotifications: async () => {
        setNotifications([]);
        try {
          await fetch(`${base}/api/notifications/all`, {
            method: "DELETE",
            credentials: "include",
          });
        } catch (err) {
          console.error("[SpacePortal] clearNotifications failed:", err);
        }
      },

      addNotification: (notification: SpacePortalNotification) =>
        setNotifications((prev) => [notification, ...prev]),
      navigateToNotification,
    };
  }, [notifications, navigate]);

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
        <div className="min-h-screen bg-slate-50 flex">
          {/* Desktop Sidebar */}
          <div
            className={`fixed inset-y-0 left-0 z-30 transition-all duration-300 hidden lg:block ${isSidebarCollapsed ? "w-20" : "w-72"}`}
          >
            <Sidebar
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
            />
          </div>

          {/* Mobile Sidebar */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 z-50 lg:hidden"
              data-lenis-prevent
            >
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/40 animate-in fade-in duration-300"
                onClick={() => setIsSidebarOpen(false)}
                onWheel={(e) => e.stopPropagation()}
              />

              {/* Sidebar Panel */}
              <div
                className="absolute inset-y-0 left-0 w-72 transform bg-white shadow-2xl transition-transform duration-300 ease-in-out animate-in slide-in-from-left"
                data-lenis-prevent
              >
                <Sidebar onClose={() => setIsSidebarOpen(false)} />
              </div>
            </div>
          )}

          {/* Toast */}
          {activeToast ? (
            <div className="fixed left-1/2 top-4 z-50 w-[92%] max-w-md -translate-x-1/2">
              <div
                role="button"
                tabIndex={0}
                onClick={() => navigateToNotification(activeToast)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigateToNotification(activeToast);
                  }
                }}
                className="animate-in slide-in-from-top-2 cursor-pointer rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg transition hover:border-slate-300"
              >
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
                    onClick={(event) => {
                      event.stopPropagation();
                      dismissToast();
                    }}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-700"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {/* Main Content */}
          <div
            className={`flex min-w-0 flex-1 flex-col min-h-screen transition-all duration-300 ${isSidebarCollapsed ? "lg:ml-20" : "lg:ml-72"} ${isSidebarOpen ? 'overflow-hidden lg:overflow-visible' : ''}`}
            style={{ backgroundColor: headerConfig.pageBg || "" }}
          >
            {/* Topbar */}
            {!headerConfig.hideTopBar ? (
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
            ) : (
              /* If TopBar is hidden, we still need a way to open sidebar on mobile */
              <div className="flex items-center justify-end px-4 pt-4 lg:hidden">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#2D3F33]/20 bg-white shadow-sm text-[#164e4e] hover:bg-[#FEF8C5] hover:border-[#FEF8C5]/50 transition-colors"
                  title="Open sidebar"
                >
                  <Menu size={22} />
                </button>
              </div>
            )}

            {/* Page Content */}
            <main className="relative mt-4 flex-1 px-3 pb-6 sm:mt-6 sm:px-5 lg:px-8">
              <ErrorBoundary>
                <Outlet />
              </ErrorBoundary>
            </main>

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
  permissionRequestedRef: React.MutableRefObject<boolean>,
) {
  if (typeof window === "undefined" || !("Notification" in window)) return;

  newItems.forEach((item) => {
    const permission = window.Notification.permission;
    const openTarget = () => {
      const href =
        item.href ||
        (typeof item.metadata?.actionUrl === "string"
          ? item.metadata.actionUrl
          : "/spaceportal/notifications");

      window.focus();
      if (href.startsWith("/")) {
        window.location.assign(href);
      }
    };

    // If already granted, show instantly
    if (permission === "granted") {
      const browserNotification = new window.Notification(item.title, {
        body: item.description ?? "",
        tag: item.id,
      });
      browserNotification.onclick = openTarget;
      return;
    }

    // Request permission only once
    if (permission === "default" && !permissionRequestedRef.current) {
      permissionRequestedRef.current = true;

      window.Notification.requestPermission().then((result) => {
        if (result === "granted") {
          const browserNotification = new window.Notification(item.title, {
            body: item.description ?? "",
            tag: item.id,
          });
          browserNotification.onclick = openTarget;
        }
      });
    }
  });
}
