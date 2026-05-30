import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Bell,
  CheckCircle,
  ExternalLink,
  MailOpen,
  RotateCcw,
  Search,
  Trash2,
  UserCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavItems";
import {
  AdminNotification,
  AdminNotificationService,
  NotificationType,
} from "@/services/adminNotification.service";

type FilterType = "all" | "unread" | "read";
type ActiveView = "recent" | "deleted";

type NotificationVisualMeta = {
  Icon: typeof Bell;
  iconClassName: string;
  cardClassName: string;
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
  notification: AdminNotification,
): NotificationVisualMeta => {
  const combinedText = `${notification.title || ""} ${
    notification.message || ""
  }`.toLowerCase();

  if (notification.type === NotificationType.WARNING) {
    return {
      Icon: AlertCircle,
      iconClassName: "text-amber-500",
      cardClassName: "border-amber-200 bg-amber-50/40",
    };
  }

  if (notification.type === NotificationType.ERROR) {
    return {
      Icon: AlertCircle,
      iconClassName: "text-red-500",
      cardClassName: "border-red-200 bg-red-50/40",
    };
  }

  if (
    notification.type === NotificationType.SUCCESS ||
    combinedText.includes("approved") ||
    combinedText.includes("verified") ||
    combinedText.includes("completed")
  ) {
    return {
      Icon: CheckCircle,
      iconClassName: "text-emerald-500",
      cardClassName: "border-emerald-200 bg-emerald-50/30",
    };
  }

  if (
    notification.type === NotificationType.TICKET_UPDATE ||
    combinedText.includes("ticket") ||
    combinedText.includes("support")
  ) {
    return {
      Icon: MailOpen,
      iconClassName: "text-[#35503F]",
      cardClassName: "border-[#35503F]/35 bg-[#35503F]/8",
    };
  }

  if (
    notification.type === NotificationType.MEETING_BOOKED ||
    combinedText.includes("meeting") ||
    combinedText.includes("booking")
  ) {
    return {
      Icon: UserCircle2,
      iconClassName: "text-[#35503F]",
      cardClassName: "border-[#35503F]/35 bg-[#35503F]/8",
    };
  }

  return {
    Icon: Bell,
    iconClassName: "text-[#35503F]",
    cardClassName: "border-slate-200 bg-slate-50/30",
  };
};

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDeleted, setLoadingDeleted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [activeView, setActiveView] = useState<ActiveView>("recent");
  const [deletedNotifications, setDeletedNotifications] = useState<
    AdminNotification[]
  >([]);

  const fetchNotifications = async () => {
    try {
      const data = await AdminNotificationService.getAll();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
      toast.error("Could not load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchDeletedNotifications = async () => {
    setLoadingDeleted(true);
    try {
      const data = await AdminNotificationService.getAll("only");
      setDeletedNotifications(data);
    } catch (error) {
      console.error("Failed to fetch deleted notifications", error);
      toast.error("Could not load deleted notifications");
    } finally {
      setLoadingDeleted(false);
    }
  };

  useEffect(() => {
    if (activeView === "deleted") {
      fetchDeletedNotifications();
    }
  }, [activeView]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications],
  );

  const filteredNotifications = useMemo(() => {
    const source =
      activeView === "deleted"
        ? deletedNotifications
        : notifications.filter((notification) => !notification.archived);

    return source.filter((notification) => {
      const matchesSearch =
        notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        filterType === "all" ||
        (filterType === "unread" && !notification.read) ||
        (filterType === "read" && notification.read);

      return matchesSearch && matchesFilter;
    });
  }, [activeView, deletedNotifications, filterType, notifications, searchQuery]);

  const handleMarkAsRead = async (id: string) => {
    try {
      const updated = await AdminNotificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id ? updated : notification,
        ),
      );
    } catch (error) {
      console.error("Failed to mark notification as read", error);
      toast.error("Failed to mark notification as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter(
      (notification) => !notification.read,
    );

    if (!unreadNotifications.length) return;

    try {
      const updatedNotifications = await Promise.all(
        unreadNotifications.map((notification) =>
          AdminNotificationService.markAsRead(notification._id),
        ),
      );

      const updatedMap = new Map(
        updatedNotifications.map((notification) => [
          notification._id,
          notification,
        ]),
      );

      setNotifications((prev) =>
        prev.map(
          (notification) => updatedMap.get(notification._id) || notification,
        ),
      );
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Failed to mark all notifications as read", error);
      toast.error("Failed to mark all notifications as read");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const notificationToDelete = notifications.find(
        (notification) => notification._id === id,
      );
      await AdminNotificationService.delete(id);
      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== id),
      );
      if (notificationToDelete) {
        setDeletedNotifications((prev) => [
          { ...notificationToDelete, archived: true, read: true },
          ...prev.filter((notification) => notification._id !== id),
        ]);
      }
      toast.success("Notification deleted");
    } catch (error) {
      console.error("Failed to delete notification", error);
      toast.error("Failed to delete notification");
    }
  };

  const handleRestore = async (id: string) => {
    const notificationToRestore = deletedNotifications.find(
      (notification) => notification._id === id,
    );

    setDeletedNotifications((prev) =>
      prev.filter((notification) => notification._id !== id),
    );

    try {
      const updated = await AdminNotificationService.toggleArchive(id);
      setNotifications((prev) => [
        { ...updated, archived: false },
        ...prev.filter((notification) => notification._id !== id),
      ]);
      toast.success("Notification restored");
    } catch (error) {
      console.error("Failed to restore notification", error);
      if (notificationToRestore) {
        setDeletedNotifications((prev) => [notificationToRestore, ...prev]);
      }
      toast.error("Failed to restore notification");
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear all notifications?")) {
      return;
    }

    try {
      await AdminNotificationService.deleteAll();
      setNotifications([]);
      toast.success("All notifications cleared");
    } catch (error) {
      console.error("Failed to clear notifications", error);
      toast.error("Failed to clear notifications");
    }
  };

  const handleNotificationClick = async (
    notification: AdminNotification,
  ) => {
    if (!notification.read) {
      await handleMarkAsRead(notification._id);
    }

    const { metadata, type } = notification;
    let targetRoute = "";

    if (metadata?.kycId) {
      targetRoute = "/admin/kyc-requests";
    } else if (metadata?.ticketId || type === NotificationType.TICKET_UPDATE) {
      targetRoute = "/admin/tickets";
    } else if (metadata?.propertyId) {
      targetRoute = `/admin/space-details/${metadata.propertyId}`;
    } else if (
      metadata?.bookingId ||
      type === NotificationType.MEETING_BOOKED
    ) {
      targetRoute = "/admin/dashboard";
    }

    if (targetRoute) {
      navigate(targetRoute);
    }
  };

  return (
    <DashboardLayout
      portalName="FlashSpace Admin"
      portalDescription="Complete platform management"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="min-h-[calc(100vh-8rem)] px-0 py-2 sm:py-4">
        <div className="mx-auto space-y-8">
          <section className="space-y-8">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div className="space-y-1">
                <h1 className="text-[30px] font-extrabold tracking-tight text-black" style={{ fontFamily: "'Inter', sans-serif" }}>
                  My <span className="italic text-primary">Notifications</span>
                </h1>
                <p className="text-sm font-medium text-gray-500 md:text-base">
                  Stay updated with system activities, booking alerts, and ticket
                  updates.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  disabled={
                    activeView === "deleted" ||
                    notifications.length === 0 ||
                    unreadCount === 0
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-6 py-2.5 font-bold text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Mark all as read
                </button>
                <button
                  type="button"
                  onClick={handleClearAll}
                  disabled={activeView === "deleted" || notifications.length === 0}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-100 bg-white px-6 py-2.5 font-bold text-red-600 shadow-sm transition-all hover:bg-red-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear all
                </button>
              </div>
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
                  {([
                    { value: "recent", label: "Recent" },
                    { value: "deleted", label: "Deleted" },
                  ] as const).map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setActiveView(item.value)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                        activeView === item.value
                          ? "bg-[#35503F] text-white"
                          : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                {activeView === "recent" ? (
                  <div className="inline-flex rounded-2xl border border-gray-200 bg-white p-1 shadow-sm">
                    {([
                      { value: "all", label: "All" },
                      { value: "unread", label: "Unread" },
                      { value: "read", label: "Read" },
                    ] as const).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setFilterType(item.value)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                          filterType === item.value
                            ? "bg-[#35503F] text-white"
                            : "text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="text-sm font-bold uppercase tracking-wider text-gray-400">
                {filteredNotifications.length} total
              </div>
            </div>

            <div className="mt-4">
              {loading || (activeView === "deleted" && loadingDeleted) ? (
                <EmptyState text="Loading notifications..." />
              ) : filteredNotifications.length === 0 ? (
                <EmptyState
                  text={
                    searchQuery
                      ? `No matches for "${searchQuery}".`
                      : "No notifications found"
                  }
                />
              ) : (
                <div className="space-y-3">
                  {filteredNotifications.map((notification) => (
                    <NotificationItem
                      key={notification._id}
                      notification={notification}
                      deletedView={activeView === "deleted"}
                      onNavigate={() => handleNotificationClick(notification)}
                      onMarkRead={() => handleMarkAsRead(notification._id)}
                      onDelete={() => handleDelete(notification._id)}
                      onRestore={() => handleRestore(notification._id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
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
  notification: AdminNotification;
  deletedView: boolean;
  onNavigate: () => void;
  onMarkRead: () => void;
  onDelete: () => void;
  onRestore: () => void;
}) {
  const visual = getNotificationVisualMeta(notification);

  return (
    <article
      onClick={deletedView ? undefined : onNavigate}
      className={`group rounded-2xl border bg-white px-4 py-3.5 transition hover:shadow-md sm:px-5 ${
        !notification.read && !deletedView
          ? visual.cardClassName
          : "border-[#E3EBE6]"
      } ${deletedView ? "" : "cursor-pointer"} ${
        deletedView ? "bg-[#fbfdfb]" : ""
      }`}
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
            <p className="mt-0.5 line-clamp-2 text-sm leading-relaxed text-[#4f666c]">
              {notification.message}
            </p>
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

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#d8e3df] bg-[#f7faf8] px-6 py-7 text-center">
      <Bell className="mx-auto h-8 w-8 text-[#6a8288]" />
      <p className="mt-3 text-sm font-medium text-[#496065]">{text}</p>
    </div>
  );
}
