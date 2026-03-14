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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight font-[Poppins]">
              Notifications
            </h1>
            <p className="text-sm md:text-base text-gray-500 mt-1">
              Stay updated with system activities and alerts.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Badge variant="secondary" className="px-4 py-1.5 rounded-full font-bold text-blue-700 bg-blue-50 border-blue-100 flex-1 md:flex-none justify-center">
              {notifications.filter((n) => !n.read).length} Unread
            </Badge>
            <button
              onClick={handleClearAll}
              disabled={notifications.length === 0}
              className="flex items-center justify-center gap-2 px-4 py-1.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50 border border-red-50 flex-1 md:flex-none"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm sticky top-0 z-10 md:static">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50/50 md:bg-transparent rounded-xl focus:outline-none placeholder:text-gray-400 text-sm font-medium"
            />
          </div>
          <div className="flex bg-gray-50 p-1 rounded-xl gap-1 overflow-x-auto scrollbar-none">
            {(["all", "unread", "read"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`flex-1 md:flex-none min-w-[80px] px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                  filterType === type
                    ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-100"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
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
                  className={`p-4 md:p-5 hover:bg-gray-50/50 transition-all group flex gap-3 md:gap-5 cursor-pointer items-start md:items-center ${
                    !notification.read ? "bg-blue-50/10 border-l-4 border-l-blue-500" : "border-l-4 border-l-transparent"
                  }`}
                >
                  <div
                    className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl border h-fit transition-all group-hover:scale-105 shrink-0 ${
                      !notification.read
                        ? "bg-white border-blue-100 shadow-sm"
                        : "bg-gray-50/50 border-gray-100"
                    }`}
                  >
                    {getIcon(notification.type)}
                  </div>
 
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start md:gap-4 gap-1 mb-1">
                      <div className="flex flex-wrap items-center gap-2 md:gap-3 min-w-0">
                        <h3
                          className={`font-bold text-sm md:text-base truncate max-w-full ${
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
                          className={`text-[9px] md:text-[10px] uppercase tracking-wider font-extrabold h-4 md:h-5 px-1.5 ${getCategoryColor(
                            notification.type,
                          )}`}
                        >
                          {notification.type.replace(/_/g, " ")}
                        </Badge>
                      </div>
                      <span className="text-[10px] md:text-[11px] text-gray-400 whitespace-nowrap font-medium flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {format(
                          new Date(notification.createdAt),
                          "MMM d, h:mm a",
                        )}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs md:text-sm line-clamp-1 pr-6 md:pr-10">
                      {notification.message}
                    </p>
                  </div>
 
                  <div className="flex items-center gap-1 opacity-0 md:group-hover:opacity-100 transition-all md:-translate-x-2 md:group-hover:translate-x-0">
                    <div className="hidden md:flex gap-1">
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
                    </div>
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-300 ml-1 shrink-0" />
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
            <div className="p-6 md:p-8 pb-4 flex justify-between items-start">
              <div className="flex items-center gap-3 md:gap-4">
                <div
                  className={`p-3 md:p-4 rounded-xl md:rounded-2xl border ${getCategoryColor(
                    selectedNotification.type,
                  )}`}
                >
                  {getIcon(selectedNotification.type)}
                </div>
                <div>
                  <Badge
                    variant="outline"
                    className={`mb-1 text-[9px] md:text-[10px] uppercase font-black tracking-widest ${getCategoryColor(
                      selectedNotification.type,
                    )}`}
                  >
                    {selectedNotification.type.replace(/_/g, " ")}
                  </Badge>
                  <p className="text-[11px] md:text-sm text-gray-400 font-bold">
                    {format(
                      new Date(selectedNotification.createdAt),
                      "MMM d, yyyy • h:mm a",
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedNotification(null)}
                className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-all"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            <div className="p-6 md:p-8 pt-4">
              <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-4 leading-tight">
                {selectedNotification.title}
              </h3>
              <div className="bg-gray-50 rounded-2xl p-4 md:p-5 border border-gray-100 mb-6 md:mb-8">
                <p className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedNotification.message}
                </p>
              </div>
 
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="flex-1 py-3.5 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                >
                  Dismiss
                </button>
                <button
                  onClick={(e) => {
                    handleDelete(selectedNotification._id, e);
                    setSelectedNotification(null);
                  }}
                  className="px-6 py-3.5 border-2 border-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-50 transition-all active:scale-[0.98]"
                >
                  Delete Notification
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
