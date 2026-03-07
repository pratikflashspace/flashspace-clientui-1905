import React, { useEffect, useState, useMemo } from "react";
import {
  AdminNotificationService,
  AdminNotification,
  NotificationType,
} from "@/services/adminNotification.service";
import {
  Bell,
  Trash2,
  Check,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
  X,
  MailOpen,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavItems";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

export default function Notifications() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "unread" | "read">(
    "all",
  );
  const [selectedNotification, setSelectedNotification] =
    useState<AdminNotification | null>(null);

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

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await AdminNotificationService.delete(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success("Notification deleted");
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear all notifications?"))
      return;
    try {
      await AdminNotificationService.deleteAll();
      setNotifications([]);
      toast.success("All notifications cleared");
    } catch (error) {
      toast.error("Failed to clear notifications");
    }
  };

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updated = await AdminNotificationService.markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n._id === id ? updated : n)));
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const matchesSearch =
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        filterType === "all" ||
        (filterType === "unread" && !n.read) ||
        (filterType === "read" && n.read);

      return matchesSearch && matchesFilter;
    });
  }, [notifications, searchQuery, filterType]);

  const getIcon = (type: string) => {
    switch (type) {
      case NotificationType.WARNING:
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case NotificationType.ERROR:
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case NotificationType.SUCCESS:
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case NotificationType.TICKET_UPDATE:
        return <Bell className="w-5 h-5 text-blue-500" />;
      case NotificationType.MEETING_BOOKED:
        return <Clock className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-teal-500" />;
    }
  };

  const getCategoryColor = (type: string) => {
    switch (type) {
      case NotificationType.WARNING:
        return "bg-amber-50 text-amber-700 border-amber-100";
      case NotificationType.ERROR:
        return "bg-red-50 text-red-700 border-red-100";
      case NotificationType.SUCCESS:
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case NotificationType.TICKET_UPDATE:
        return "bg-blue-50 text-blue-700 border-blue-100";
      case NotificationType.MEETING_BOOKED:
        return "bg-purple-50 text-purple-700 border-purple-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  return (
    <DashboardLayout
      portalName="FlashSpace Admin"
      portalDescription="Complete platform management"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-[Poppins]">
              Notifications
            </h1>
            <p className="text-gray-500 mt-1">
              Stay updated with system activities and alerts.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="px-3 py-1 rounded-full">
              {notifications.filter((n) => !n.read).length} Unread
            </Badge>
            <button
              onClick={handleClearAll}
              disabled={notifications.length === 0}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-transparent rounded-xl focus:outline-none placeholder:text-gray-400 text-sm"
            />
          </div>
          <div className="flex bg-gray-50 p-1 rounded-xl gap-1">
            {(["all", "unread", "read"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  filterType === type
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* List Container */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-md overflow-hidden">
          {loading ? (
            <div className="p-20 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-20 text-center text-gray-400 flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                <Bell className="w-10 h-10 opacity-20" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-900">
                  No notifications found
                </h3>
                <p className="max-w-xs mx-auto">
                  {searchQuery
                    ? `No matches for "${searchQuery}" in ${filterType} notifications.`
                    : "You're all caught up! No new notifications to show."}
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => {
                    if (!notification.read)
                      handleMarkAsRead(notification._id, {} as any);
                    setSelectedNotification(notification);
                  }}
                  className={`p-5 hover:bg-gray-50/50 transition-all group flex gap-5 cursor-pointer items-center ${
                    !notification.read ? "bg-blue-50/20" : ""
                  }`}
                >
                  <div
                    className={`p-3 rounded-2xl border h-fit transition-transform group-hover:scale-110 ${
                      !notification.read
                        ? "bg-white border-blue-100 shadow-sm"
                        : "bg-gray-50/50 border-gray-100"
                    }`}
                  >
                    {getIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-4 mb-1">
                      <div className="flex items-center gap-3 min-w-0">
                        <h3
                          className={`font-bold truncate ${
                            !notification.read
                              ? "text-gray-900"
                              : "text-gray-600"
                          }`}
                        >
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                        )}
                        <Badge
                          variant="outline"
                          className={`hidden sm:inline-flex text-[10px] uppercase tracking-wider font-bold h-5 ${getCategoryColor(
                            notification.type,
                          )}`}
                        >
                          {notification.type.replace(/_/g, " ")}
                        </Badge>
                      </div>
                      <span className="text-[11px] text-gray-400 whitespace-nowrap font-medium flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {format(
                          new Date(notification.createdAt),
                          "MMM d, h:mm a",
                        )}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-1 pr-10">
                      {notification.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                    {!notification.read && (
                      <button
                        onClick={(e) => handleMarkAsRead(notification._id, e)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Mark as read"
                      >
                        <MailOpen className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => handleDelete(notification._id, e)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-5 h-5 text-gray-300 ml-1" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Notification Modal */}
      {selectedNotification && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setSelectedNotification(null)}
        >
          <div
            className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 pb-4 flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div
                  className={`p-4 rounded-2xl border ${getCategoryColor(
                    selectedNotification.type,
                  )}`}
                >
                  {getIcon(selectedNotification.type)}
                </div>
                <div>
                  <Badge
                    variant="outline"
                    className={`mb-1 text-[10px] uppercase font-bold ${getCategoryColor(
                      selectedNotification.type,
                    )}`}
                  >
                    {selectedNotification.type.replace(/_/g, " ")}
                  </Badge>
                  <p className="text-sm text-gray-400 font-medium">
                    {format(
                      new Date(selectedNotification.createdAt),
                      "MMMM d, yyyy • h:mm a",
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedNotification(null)}
                className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 pt-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                {selectedNotification.title}
              </h3>
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 mb-8">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedNotification.message}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="flex-1 py-3 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
                >
                  Close
                </button>
                <button
                  onClick={(e) => {
                    handleDelete(selectedNotification._id, e);
                    setSelectedNotification(null);
                  }}
                  className="px-6 py-3 border-2 border-red-100 text-red-600 font-bold rounded-2xl hover:bg-red-50 transition-all active:scale-95"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
