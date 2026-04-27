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
import { AdminPageSkeleton } from "@/components/ui/skeleton-loaders";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavItems";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

  const handleNotificationClick = (notification: AdminNotification) => {
    // 1. Mark as read if unread
    if (!notification.read) {
      handleMarkAsRead(notification._id, {} as any);
    }

    // 2. Determine target route based on metadata or type
    const { type, metadata } = notification;
    let targetRoute = "";

    // Priority 1: KYC Documents
    if (metadata?.kycId) {
      targetRoute = `/admin/kyc-requests`;
    } 
    // Priority 2: Tickets/Support
    else if (metadata?.ticketId || type === NotificationType.TICKET_UPDATE) {
      targetRoute = `/admin/tickets`;
    } 
    // Priority 3: Space/Property Updates
    else if (metadata?.propertyId) {
      targetRoute = `/admin/space-details/${metadata.propertyId}`;
    }
    // Priority 4: Booking/Meeting Alerts
    else if (metadata?.bookingId || type === NotificationType.MEETING_BOOKED) {
      targetRoute = `/admin/dashboard`;
    }

    // 3. Navigate or Open Modal
    if (targetRoute) {
      navigate(targetRoute);
    } else {
      // General notifications just show details in modal
      setSelectedNotification(notification);
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
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      case NotificationType.SUCCESS:
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case NotificationType.TICKET_UPDATE:
        return <Bell className="w-5 h-5 text-primary" />;
      case NotificationType.MEETING_BOOKED:
        return <Clock className="w-5 h-5 text-violet-500" />;
      default:
        return <Bell className="w-5 h-5 text-primary" />;
    }
  };

  const getCategoryColor = (type: string) => {
    switch (type) {
      case NotificationType.WARNING:
        return "bg-amber-50 text-amber-700 border-amber-100";
      case NotificationType.ERROR:
        return "bg-destructive/10 text-destructive border-destructive/20";
      case NotificationType.SUCCESS:
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case NotificationType.TICKET_UPDATE:
        return "bg-primary/10 text-primary border-primary/20";
      case NotificationType.MEETING_BOOKED:
        return "bg-violet-50 text-violet-700 border-violet-100";
      default:
        return "bg-muted text-muted-foreground border-border";
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
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
              System <span className="text-primary italic">Notifications</span>
            </h1>
            <p className="text-sm md:text-base text-muted-foreground font-medium">
              Stay updated with system activities, booking alerts, and ticket updates.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Badge variant="secondary" className="px-5 py-2 rounded-full font-black text-primary bg-primary/5 border-primary/10 flex-1 md:flex-none justify-center shadow-sm">
              {notifications.filter((n) => !n.read).length} Unread
            </Badge>
            <button
              onClick={handleClearAll}
              disabled={notifications.length === 0}
              className="flex items-center justify-center gap-2 px-5 py-2 text-sm font-black text-destructive hover:bg-destructive/5 rounded-2xl transition-all disabled:opacity-50 border border-destructive/10 flex-1 md:flex-none shadow-sm"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 bg-background p-2 rounded-2xl border border-border shadow-xl shadow-muted/20 sticky top-0 z-10 md:static">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search notifications by title or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-muted/30 md:bg-transparent rounded-xl focus:outline-none placeholder:text-muted-foreground/50 text-sm font-bold text-foreground"
            />
          </div>
          <div className="flex bg-muted p-1 rounded-xl gap-1 overflow-x-auto scrollbar-none border border-border/50">
            {(["all", "unread", "read"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`flex-1 md:flex-none min-w-[90px] px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                  filterType === type
                    ? "bg-background text-primary shadow-md border border-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* List Container */}
        <div className="bg-background rounded-[32px] border border-border shadow-2xl shadow-muted/30 overflow-hidden mb-12">
          {loading ? (
            <div className="p-12 text-center animate-pulse">
               <div className="h-12 w-12 bg-muted rounded-full mx-auto mb-4" />
               <div className="h-4 bg-muted rounded w-48 mx-auto mb-2" />
               <div className="h-3 bg-muted rounded w-32 mx-auto" />
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-24 text-center text-muted-foreground flex flex-col items-center gap-6">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center border border-border shadow-inner">
                <Bell className="w-10 h-10 opacity-20 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-foreground">
                  No notifications found
                </h3>
                <p className="max-w-xs mx-auto text-sm font-medium opacity-60">
                  {searchQuery
                    ? `No matches for "${searchQuery}" in ${filterType} notifications.`
                    : "You're all caught up! No new notifications to show."}
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-5 md:p-6 hover:bg-muted/30 transition-all group flex gap-4 md:gap-7 cursor-pointer items-start md:items-center relative ${
                    !notification.read ? "bg-primary/5 border-l-[6px] border-l-primary" : "border-l-[6px] border-l-transparent"
                  }`}
                >
                  <div
                    className={`p-3 md:p-4 rounded-2xl md:rounded-3xl border h-fit transition-all group-hover:scale-110 shrink-0 shadow-sm ${
                      !notification.read
                        ? "bg-background border-primary/20"
                        : "bg-muted/50 border-border/50 opacity-60"
                    }`}
                  >
                    {getIcon(notification.type)}
                  </div>
 
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start md:gap-5 gap-1 mb-1.5">
                      <div className="flex flex-wrap items-center gap-2 md:gap-3 min-w-0">
                        <h3
                          className={`font-black text-sm md:text-lg truncate max-w-full tracking-tight ${
                            !notification.read
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="relative flex h-2.5 w-2.5">
                             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                             <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                          </span>
                        )}
                        <Badge
                          variant="outline"
                          className={`text-[8.5px] md:text-[9.5px] uppercase tracking-widest font-black h-4.5 md:h-5.5 px-2 shadow-sm ${getCategoryColor(
                            notification.type,
                          )}`}
                        >
                          {notification.type.replace(/_/g, " ")}
                        </Badge>
                      </div>
                      <span className="text-[10px] md:text-xs text-muted-foreground whitespace-nowrap font-bold flex items-center gap-2 bg-muted/50 px-2.5 py-1 rounded-full border border-border/30">
                        <Clock className="w-3.5 h-3.5 opacity-60" />
                        {format(
                          new Date(notification.createdAt),
                          "MMM d, h:mm a",
                        )}
                      </span>
                    </div>
                    <p className={`text-xs md:text-base line-clamp-1 pr-8 md:pr-12 font-medium ${!notification.read ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
                      {notification.message}
                    </p>
                  </div>
 
                  <div className="flex items-center gap-2 opacity-0 md:group-hover:opacity-100 transition-all md:-translate-x-3 md:group-hover:translate-x-0">
                    <div className="hidden md:flex gap-2">
                      {!notification.read && (
                        <button
                          onClick={(e) => handleMarkAsRead(notification._id, e)}
                          className="p-2.5 text-primary hover:bg-primary/10 rounded-xl transition-all shadow-sm bg-background border border-primary/10"
                          title="Mark as read"
                        >
                          <MailOpen className="w-4.5 h-4.5" />
                        </button>
                      )}
                      <button
                        onClick={(e) => handleDelete(notification._id, e)}
                        className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-xl transition-all shadow-sm bg-background border border-border"
                        title="Delete"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground/30 ml-2 shrink-0 group-hover:text-primary transition-colors" />
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/40 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setSelectedNotification(null)}
        >
          <div
            className="bg-background rounded-[40px] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-400 border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 md:p-10 pb-6 flex justify-between items-start">
              <div className="flex items-center gap-5 md:gap-6">
                <div
                  className={`p-4 md:p-5 rounded-3xl border shadow-lg ${getCategoryColor(
                    selectedNotification.type,
                  )}`}
                >
                  {getIcon(selectedNotification.type)}
                </div>
                <div>
                  <Badge
                    variant="outline"
                    className={`mb-2 text-[10px] uppercase font-black tracking-[0.2em] px-3 py-1 shadow-sm ${getCategoryColor(
                      selectedNotification.type,
                    )}`}
                  >
                    {selectedNotification.type.replace(/_/g, " ")}
                  </Badge>
                  <p className="text-xs md:text-sm text-muted-foreground font-black uppercase tracking-tighter opacity-60">
                    {format(
                      new Date(selectedNotification.createdAt),
                      "MMM d, yyyy • h:mm a",
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedNotification(null)}
                className="p-3 text-muted-foreground/40 hover:text-foreground hover:bg-muted rounded-full transition-all duration-300"
              >
                <X className="w-6 h-6 md:w-7 md:h-7" />
              </button>
            </div>

            <div className="p-8 md:p-10 pt-4">
              <h3 className="text-2xl md:text-3xl font-black text-foreground mb-6 leading-[1.1] tracking-tight">
                {selectedNotification.title}
              </h3>
              <div className="bg-muted/40 rounded-[28px] p-6 md:p-8 border border-border/50 mb-10 md:mb-12 shadow-inner">
                <p className="text-base md:text-lg text-foreground/80 font-medium leading-[1.6] whitespace-pre-wrap">
                  {selectedNotification.message}
                </p>
              </div>
 
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="flex-1 h-14 bg-foreground text-background font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-foreground/90 transition-all shadow-xl hover:shadow-2xl active:scale-[0.98]"
                >
                  Dismiss
                </button>
                <button
                  onClick={(e) => {
                    handleDelete(selectedNotification._id, e);
                    setSelectedNotification(null);
                  }}
                  className="px-8 h-14 border-2 border-destructive/10 text-destructive font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-destructive/5 transition-all active:scale-[0.98]"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
