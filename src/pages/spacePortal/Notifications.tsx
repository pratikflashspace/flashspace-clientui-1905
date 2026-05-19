import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CheckCircle2,
  ExternalLink,
  Info,
  Mail,
  RotateCcw,
  Search,
  Trash2,
  UserCircle2,
} from "lucide-react";

import { API_CONFIG } from "@/config/api.config";
import { useSpacePortalNotifications } from "@/contexts/SpacePortalNotificationsContext";
import type { SpacePortalNotification } from "@/types/spacePortal/notification";

type NotificationVisualMeta = {
  Icon: typeof Bell;
  iconClassName: string;
  cardClassName: string;
};


const mapNotification = (raw: any): SpacePortalNotification => {
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
    description: raw.message ?? raw.description ?? "",
    read: raw.read ?? false,
    archived: raw.archived ?? false,
    href,
    metadata,
    createdAt: raw.createdAt,
    time: raw.createdAt
      ? new Date(raw.createdAt).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : undefined,
  };
};

const formatRelativeTime = (value?: string): string => {
  if (!value) return "Just now";

  const inputTime = new Date(value).getTime();
  if (Number.isNaN(inputTime)) return "Just now";

  const diffMs = Date.now() - inputTime;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) return "Just now";
  if (diffMs < hour) {
    const minutes = Math.floor(diffMs / minute);
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }
  if (diffMs < day) {
    const hours = Math.floor(diffMs / hour);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }
  if (diffMs < day * 2) return "1 day ago";

  const days = Math.floor(diffMs / day);
  return `${days} days ago`;
};

const getNotificationVisualMeta = (
  notification: SpacePortalNotification,
): NotificationVisualMeta => {
  const combinedText = `${notification.title || ""} ${
    notification.description || ""
  }`.toLowerCase();

  if (
    combinedText.includes("payment") ||
    combinedText.includes("invoice") ||
    combinedText.includes("due")
  ) {
    return {
      Icon: CheckCircle2,
      iconClassName: "text-emerald-500",
      cardClassName: "border-emerald-200 bg-emerald-50/40",
    };
  }

  if (
    combinedText.includes("mail") ||
    combinedText.includes("parcel") ||
    combinedText.includes("courier")
  ) {
    return {
      Icon: Mail,
      iconClassName: "text-emerald-500",
      cardClassName: "border-emerald-200 bg-emerald-50/40",
    };
  }

  if (combinedText.includes("visitor") || combinedText.includes("visit")) {
    return {
      Icon: UserCircle2,
      iconClassName: "text-[#35503F]",
      cardClassName: "border-[#35503F]/35 bg-[#35503F]/8",
    };
  }

  if (
    combinedText.includes("success") ||
    combinedText.includes("verified") ||
    combinedText.includes("approved")
  ) {
    return {
      Icon: CheckCircle2,
      iconClassName: "text-emerald-500",
      cardClassName: "border-emerald-200 bg-emerald-50/30",
    };
  }

  return {
    Icon: Info,
    iconClassName: "text-[#35503F]",
    cardClassName: "border-slate-200 bg-slate-50/30",
  };
};

export default function Notifications() {
  const {
    markAllRead,
    markRead,
    deleteNotification,
    restoreNotification,
    navigateToNotification,
  } = useSpacePortalNotifications();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState<"recent" | "deleted">("recent");
  
  const [recentNotifications, setRecentNotifications] = useState<SpacePortalNotification[]>([]);
  const [deletedNotifications, setDeletedNotifications] = useState<SpacePortalNotification[]>([]);
  
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1
  });
  
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async (page = 1) => {
    setLoading(true);
    try {
      const archived = activeView === "deleted" ? "only" : "false";
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/notifications?archived=${archived}&page=${page}&limit=10`,
        { credentials: "include" },
      );
      const data = await response.json();
      if (data.success) {
        const mapped = data.data.map(mapNotification);
        if (activeView === "deleted") {
          setDeletedNotifications(mapped);
        } else {
          setRecentNotifications(mapped);
        }
        setPagination(data.pagination || { total: mapped.length, page: 1, limit: 10, pages: 1 });
      }
    } catch (error) {
      console.error("[SpacePortal] Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(1);
  }, [activeView]);

  const filteredNotifications = useMemo(() => {
    const source = activeView === "deleted" ? deletedNotifications : recentNotifications;
    const query = searchQuery.trim().toLowerCase();
    if (!query) return source;

    return source.filter((notification) => {
      const title = notification.title || "";
      const description = notification.description || "";
      return (
        title.toLowerCase().includes(query) ||
        description.toLowerCase().includes(query)
      );
    });
  }, [activeView, deletedNotifications, recentNotifications, searchQuery]);

  const handleDelete = async (notification: SpacePortalNotification) => {
    await deleteNotification(notification.id);
    setRecentNotifications(prev => prev.filter(n => n.id !== notification.id));
    // If we're on recent view, we might want to refetch or just remove
    if (activeView === "recent" && recentNotifications.length <= 1 && pagination.page > 1) {
      fetchNotifications(pagination.page - 1);
    }
  };

  const handleRestore = async (notification: SpacePortalNotification) => {
    try {
      await fetch(`${API_CONFIG.BASE_URL}/api/notifications/${notification.id}/archive`, {
        method: "PATCH",
        headers: {
          "x-flashspace-csrf": "true",
        },
        credentials: "include",
      });
      setDeletedNotifications(prev => prev.filter(n => n.id !== notification.id));
      restoreNotification({ ...notification, archived: false }, 0);
      if (activeView === "deleted" && deletedNotifications.length <= 1 && pagination.page > 1) {
        fetchNotifications(pagination.page - 1);
      }
    } catch (error) {
      console.error("[SpacePortal] Failed to restore notification:", error);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchNotifications(newPage);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gray-50 px-0 py-2 sm:py-4">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="grid grid-cols-1 items-start gap-8">
          <section className="space-y-8">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div className="space-y-1">
                <h1 className="text-3xl font-extrabold tracking-tight text-[#35503F] md:text-4xl">
                  My <span className="italic text-primary">Notifications</span>
                </h1>
                <p className="text-sm font-medium text-gray-500 md:text-base">
                  Stay updated with all your partner portal activities
                </p>
              </div>

              <button
                type="button"
                onClick={async () => {
                  await markAllRead();
                  fetchNotifications(pagination.page);
                }}
                disabled={recentNotifications.length === 0}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-6 py-2.5 font-bold text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Mark all as read
              </button>
            </div>

            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search notifications"
                className="w-full rounded-2xl border border-gray-100 bg-white py-3 pl-11 pr-4 text-sm font-medium transition-all focus:outline-none focus:ring-4 focus:ring-[#35503F]/10"
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold text-[#35503F]">
                  {activeView === "deleted"
                    ? "Deleted Notifications"
                    : "Recent Notifications"}
                </h2>
                <div className="inline-flex rounded-2xl border border-gray-200 bg-white p-1 shadow-sm">
                  <TabButton
                    active={activeView === "recent"}
                    onClick={() => setActiveView("recent")}
                  >
                    Recent
                  </TabButton>
                  <TabButton
                    active={activeView === "deleted"}
                    onClick={() => setActiveView("deleted")}
                  >
                    Deleted
                  </TabButton>
                </div>
              </div>
              <div className="text-sm font-bold uppercase tracking-wider text-gray-400">
                {pagination.total} total
              </div>
            </div>

            <div className="mt-4">
              {loading ? (
                <EmptyState text="Loading notifications..." />
              ) : filteredNotifications.length === 0 ? (
                <EmptyState text="No notifications found" />
              ) : (
                <div className="space-y-3">
                  {filteredNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      deletedView={activeView === "deleted"}
                      onNavigate={() => navigateToNotification?.(notification)}
                      onMarkRead={async () => {
                        await markRead(notification.id);
                        fetchNotifications(pagination.page);
                      }}
                      onDelete={() => handleDelete(notification)}
                      onRestore={() => handleRestore(notification)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Pagination UI */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1 || loading}
                  className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-all"
                >
                  Previous
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, pagination.pages) }).map((_, i) => {
                    let pageNum = i + 1;
                    // Simple windowing logic
                    if (pagination.pages > 5 && pagination.page > 3) {
                      pageNum = pagination.page - 2 + i;
                      if (pageNum + (5-i-1) > pagination.pages) {
                        pageNum = pagination.pages - 4 + i;
                      }
                    }
                    if (pageNum <= 0) return null;
                    if (pageNum > pagination.pages) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                          pagination.page === pageNum
                            ? "bg-[#35503F] text-white shadow-md"
                            : "bg-white border border-gray-100 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages || loading}
                  className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function NotificationItem({
  notification,
  deletedView,
  onNavigate,
  onMarkRead,
  onDelete,
  onRestore,
}: {
  notification: SpacePortalNotification;
  deletedView: boolean;
  onNavigate: () => void;
  onMarkRead: () => void;
  onDelete: () => void;
  onRestore: () => void;
}) {
  const visual = getNotificationVisualMeta(notification);
  const description = notification.description?.trim();

  return (
    <article
      onClick={deletedView ? undefined : onNavigate}
      className={`group rounded-2xl border bg-white px-4 py-3.5 transition hover:shadow-md sm:px-5 ${
        !notification.read && !deletedView
          ? visual.cardClassName
          : "border-[#e3ebe8]"
      } ${deletedView ? "" : "cursor-pointer"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={`mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/5 ${visual.iconClassName}`}
          >
            <visual.Icon className="h-5 w-5" />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-base font-bold tracking-tight text-[#13282b]">
                {notification.title}
              </p>
              {!deletedView ? (
                <ExternalLink className="h-3.5 w-3.5 text-gray-300 opacity-0 transition-opacity group-hover:opacity-100" />
              ) : null}
            </div>
            {description ? (
              <p className="mt-0.5 line-clamp-2 text-sm leading-relaxed text-[#4f666c]">
                {description}
              </p>
            ) : null}
            <p className="mt-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              {formatRelativeTime(notification.createdAt)}
            </p>
          </div>
        </div>

        <div
          className="flex shrink-0 items-center gap-2"
          onClick={(event) => event.stopPropagation()}
        >
          {!notification.read && !deletedView ? (
            <span className="h-2 w-2 rounded-full bg-primary" />
          ) : null}

          {!notification.read && !deletedView ? (
            <button
              type="button"
              onClick={onMarkRead}
              className="hidden rounded-lg bg-[#35503F]/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#35503F] transition hover:bg-[#35503F] hover:text-white sm:block"
            >
              Mark read
            </button>
          ) : null}

          {deletedView ? (
            <button
              type="button"
              onClick={onRestore}
              className="rounded-xl p-2 text-gray-400 transition-all hover:bg-emerald-50 hover:text-emerald-600"
              title="Restore notification"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onDelete}
              className="rounded-xl p-2 text-gray-400 transition-all hover:bg-red-50 hover:text-red-600"
              title="Delete notification"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
        active ? "bg-[#35503F] text-white" : "text-gray-500 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#d8e3df] bg-[#f7faf8] px-6 py-7 text-center">
      <Bell className="mx-auto h-8 w-8 text-[#6a8288]" />
      <p className="mt-3 text-sm font-medium text-[#496065]">{text}</p>
    </div>
  );
}

function ToggleButton({
  checked,
  disabled,
  onClick,
}: {
  checked: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200 ${
        checked ? "bg-[#35503F]" : "bg-slate-200"
      } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
      aria-pressed={checked}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
