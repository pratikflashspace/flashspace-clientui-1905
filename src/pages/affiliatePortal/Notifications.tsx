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
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

import { useNotifications, type INotification } from "@/contexts/NotificationProvider";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/auth.service";
import { maskSpaceName } from "@/utils/masking";
import { API_CONFIG } from "@/config/api.config";



const getNotificationVisualMeta = (notification: INotification): NotificationVisualMeta => {
  const combinedText = `${notification.title || ''} ${notification.message || ''}`.toLowerCase();

  if (combinedText.includes("payment") || combinedText.includes("invoice") || combinedText.includes("due")) {
    return {
      Icon: CheckCircle2,
      iconClassName: "text-emerald-500",
      cardClassName: "border-emerald-200 bg-emerald-50/40",
    };
  }

  if (combinedText.includes("mail") || combinedText.includes("parcel") || combinedText.includes("courier")) {
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

  if (notification.type === "SUCCESS" || combinedText.includes("success") || combinedText.includes("verified")) {
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



/* --- Swipeable Notification Item Component (Original Style) --- */
const NotificationItem = ({ 
  notification, 
  onDelete, 
  onMarkRead, 
  workspaceCodeMap,
  deletedView = false,
  onRestore,
}: { 
  notification: INotification; 
  onDelete: (id: string) => void;
  onMarkRead: (id: string) => void;
  workspaceCodeMap: Record<string, string>;
  deletedView?: boolean;
  onRestore?: (id: string) => void;
}) => {
  const navigate = useNavigate();
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);
  const visual = getNotificationVisualMeta(notification);

  const handleDragEnd = (_: any, info: any) => {
    if (Math.abs(info.offset.x) > 150) {
      if (deletedView) return;
      onDelete(notification._id);
    }
  };

  const { handleNavigate: navigateTo } = useNotifications();

  const handleNavigate = () => {
    if (!notification.read) {
      onMarkRead(notification._id);
    }
    navigateTo(notification);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl mb-2.5">
      {/* Absolute Background Delete Indicator */}
      <div className={`absolute inset-0 flex items-center justify-between px-8 font-bold text-sm uppercase tracking-widest ${
        deletedView ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
      }`}>
        <div className="flex items-center gap-2">
           {deletedView ? <RotateCcw className="w-5 h-5" /> : <Trash2 className="w-5 h-5" />}
           {deletedView ? "Deleted" : "Delete"}
        </div>
        <div className="flex items-center gap-2">
           {deletedView ? "Deleted" : "Delete"}
           {deletedView ? <RotateCcw className="w-5 h-5" /> : <Trash2 className="w-5 h-5" />}
        </div>
      </div>

      <motion.article
        drag={deletedView ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        style={{ x, opacity }}
        initial={{ x: 0, opacity: 1 }}
        exit={{ 
          x: x.get() > 0 ? 500 : -500, 
          opacity: 0, 
          height: 0, 
          marginBottom: 0,
          transition: { duration: 0.2 } 
        }}
        onClick={handleNavigate}
        className={`relative z-10 rounded-2xl border px-4 py-3.5 transition hover:shadow-md sm:px-5 touch-pan-y bg-white cursor-pointer group ${
          !notification.read ? visual.cardClassName : "border-[#e3ebe8]"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className={`mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/5 ${visual.iconClassName}`}>
              <visual.Icon className="h-5 w-5" />
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-base font-bold text-[#13282b] tracking-tight">{notification.title}</p>
                <ExternalLink className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="mt-0.5 text-sm text-[#4f666c] leading-relaxed line-clamp-2">{maskSpaceName(notification.message, notification.metadata, workspaceCodeMap)}</p>
              <p className="mt-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{formatRelativeTime(notification.createdAt)}</p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {!notification.read && (
              <span className="w-2 h-2 rounded-full bg-primary" />
            )}

            {!notification.read ? (
              <button
                type="button"
                onClick={() => onMarkRead(notification._id)}
                className="hidden sm:block rounded-lg bg-[#35503F]/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#35503F] transition hover:bg-[#35503F] hover:text-white"
              >
                Mark read
              </button>
            ) : null}

            {deletedView ? (
              <button
                type="button"
                onClick={() => onRestore?.(notification._id)}
                className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                title="Restore notification"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onDelete(notification._id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                title="Delete notification"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </motion.article>
    </div>
  );
};

const Notifications = () => {
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    workspaceCodeMap,
  } = useNotifications();
  const { user, updateUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState<"recent" | "deleted">("recent");
  const [deletedNotifications, setDeletedNotifications] = useState<INotification[]>([]);
  const [loadingDeleted, setLoadingDeleted] = useState(false);

  const handleMarkRead = async (id: string) => {
    await markAsRead(id);
    if (activeView === "deleted") {
      setDeletedNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const fetchDeletedNotifications = async () => {
    setLoadingDeleted(true);
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/notifications?archived=only`,
        { credentials: "include" },
      );
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setDeletedNotifications(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch deleted notifications:", error);
    } finally {
      setLoadingDeleted(false);
    }
  };

  useEffect(() => {
    if (activeView === "deleted") {
      fetchDeletedNotifications();
    }
  }, [activeView]);

  const restoreNotification = async (id: string) => {
    setDeletedNotifications((prev) =>
      prev.filter((notification) => notification._id !== id),
    );
    try {
      await fetch(`${API_CONFIG.BASE_URL}/api/notifications/${id}/archive`, {
        method: "PATCH",
        credentials: "include",
      });
      await fetchNotifications();
    } catch (error) {
      console.error("Failed to restore notification:", error);
      await fetchDeletedNotifications();
    }
  };

  const filteredNotifications = useMemo(() => {
    const source =
      activeView === "deleted"
        ? deletedNotifications
        : notifications.filter((notification) => !notification.archived);

    if (!searchQuery.trim()) return source;

    const query = searchQuery.toLowerCase();
    return source.filter((notification) => {
      const title = notification.title || "";
      const message = notification.message || "";
      return (
        title.toLowerCase().includes(query) ||
        message.toLowerCase().includes(query)
      );
    });
  }, [activeView, deletedNotifications, notifications, searchQuery]);



  return (
 <div className="min-h-screen p-4 md:p-6 lg:p-8 bg-[#f7f7f6] ">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col items-start gap-8">
          <section className="space-y-8 w-full">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <h1 style={{ fontFamily: "'Inter', sans-serif" }} className="text-3xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                  My <span className="text-[#36503F] italic">Notifications</span>
                </h1>
                <p className="text-sm md:text-base text-gray-500 font-medium">
                  Stay updated with all your workspace activities
                </p>
              </div>
              <button
                type="button"
                onClick={markAllAsRead}
                disabled={notifications.length === 0 || unreadCount === 0}
                className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-2.5 rounded-2xl font-bold hover:bg-gray-50 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mark all as read
              </button>
            </div>

            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="notification-search"
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search notifications"
                className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-[#35503F]/10 text-sm font-medium transition-all"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <h2 style={{ fontFamily: "'Inter', sans-serif" }} className="font-sans text-2xl font-bold text-[#35503F]">
                  {activeView === "deleted" ? "Deleted Notifications" : "Recent Notifications"}
                </h2>
                <div className="inline-flex rounded-2xl border border-gray-200 bg-white p-1 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setActiveView("recent")}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                      activeView === "recent"
                        ? "bg-[#35503F] text-white"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    Recent
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveView("deleted")}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                      activeView === "deleted"
                        ? "bg-[#35503F] text-white"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    Deleted
                  </button>
                </div>
              </div>
              <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                {filteredNotifications.length} total
              </div>
            </div>

            <div className="mt-4">
              <AnimatePresence initial={false} key={activeView}>
                {loadingDeleted && activeView === "deleted" ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="rounded-2xl border border-dashed border-[#d8e3df] bg-[#f7faf8] px-6 py-7 text-center"
                  >
                    <Bell className="mx-auto h-8 w-8 text-[#6a8288]" />
                    <p className="mt-3 text-sm font-medium text-[#496065]">Loading deleted notifications...</p>
                  </motion.div>
                ) : filteredNotifications.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="rounded-2xl border border-dashed border-[#d8e3df] bg-[#f7faf8] px-6 py-7 text-center"
                  >
                    <Bell className="mx-auto h-8 w-8 text-[#6a8288]" />
                    <p className="mt-3 text-sm font-medium text-[#496065]">No notifications found</p>
                  </motion.div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <NotificationItem 
                      key={notification._id}
                      notification={notification}
                      onDelete={deleteNotification}
                      onMarkRead={handleMarkRead}
                      workspaceCodeMap={workspaceCodeMap}
                      deletedView={activeView === "deleted"}
                      onRestore={restoreNotification}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
