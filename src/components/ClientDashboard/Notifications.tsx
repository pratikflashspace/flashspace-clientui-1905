import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CheckCircle2,
  Info,
  Mail,
  Search,
  Trash2,
  UserCircle2,
} from "lucide-react";

import { useNotifications, type INotification } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/auth.service";
import { maskSpaceName } from "@/utils/masking";

type NotificationPreferencesState = {
  email: boolean;
  reminders: boolean;
  push: boolean;
  loginAlerts: boolean;
  promotional: boolean;
};

type NotificationVisualMeta = {
  Icon: typeof Bell;
  iconClassName: string;
  cardClassName: string;
};

const DEFAULT_PREFERENCES: NotificationPreferencesState = {
  email: true,
  reminders: true,
  push: true,
  loginAlerts: true,
  promotional: false,
};

const buildPreferences = (
  raw?: Partial<NotificationPreferencesState>
): NotificationPreferencesState => ({
  email: raw?.email ?? DEFAULT_PREFERENCES.email,
  reminders: raw?.reminders ?? DEFAULT_PREFERENCES.reminders,
  push: raw?.push ?? DEFAULT_PREFERENCES.push,
  loginAlerts: raw?.loginAlerts ?? DEFAULT_PREFERENCES.loginAlerts,
  promotional: raw?.promotional ?? DEFAULT_PREFERENCES.promotional,
});

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

const preferenceItems: Array<{
  key: keyof NotificationPreferencesState;
  label: string;
  description: string;
}> = [
  {
    key: "email",
    label: "Email Notifications",
    description: "Receive updates via email",
  },
  {
    key: "reminders",
    label: "Payment Alerts",
    description: "Get billing and due-date reminders",
  },
  {
    key: "push",
    label: "Mail Notifications",
    description: "Updates for incoming mail and parcels",
  },
  {
    key: "loginAlerts",
    label: "Visit Alerts",
    description: "Notify when visitors are logged",
  },
  {
    key: "promotional",
    label: "Marketing Updates",
    description: "Offers and product announcements",
  },
];

const ToggleButton = ({
  checked,
  disabled,
  onClick,
}: {
  checked: boolean;
  disabled?: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 ${
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
  const [updatingPreferenceKey, setUpdatingPreferenceKey] =
    useState<keyof NotificationPreferencesState | null>(null);
  const [preferences, setPreferences] = useState<NotificationPreferencesState>(() =>
    buildPreferences(user?.notifications)
  );

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    setPreferences(buildPreferences(user?.notifications));
  }, [user?.notifications]);

  const filteredNotifications = useMemo(() => {
    if (!searchQuery.trim()) return notifications;

    const query = searchQuery.toLowerCase();
    return notifications.filter((notification) => {
      const title = notification.title || "";
      const message = notification.message || "";
      return (
        title.toLowerCase().includes(query) ||
        message.toLowerCase().includes(query)
      );
    });
  }, [notifications, searchQuery]);

  const handleTogglePreference = async (key: keyof NotificationPreferencesState) => {
    const nextPreferences = {
      ...preferences,
      [key]: !preferences[key],
    };

    const prevPreferences = preferences;

    setPreferences(nextPreferences);
    setUpdatingPreferenceKey(key);

    try {
      const response = await authService.updateProfile({
        notifications: nextPreferences,
      });

      if (response.success && response.data) {
        updateUser(response.data);
      } else {
        setPreferences(prevPreferences);
      }
    } catch (error) {
      console.error("Failed to update notification preferences:", error);
      setPreferences(prevPreferences);
    } finally {
      setUpdatingPreferenceKey(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] items-start gap-8">
          <section className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#35503F] tracking-tight">
                  Notifica<span className="text-primary italic">tions</span>
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
              <h2 className="text-2xl font-bold text-[#35503F]">Recent Notifications</h2>
              <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                {filteredNotifications.length} total
              </div>
            </div>

          <div className="mt-4 space-y-2.5">
            {filteredNotifications.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#d8e3df] bg-[#f7faf8] px-6 py-7 text-center">
                <Bell className="mx-auto h-8 w-8 text-[#6a8288]" />
                <p className="mt-3 text-sm font-medium text-[#496065]">No notifications found</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => {
                const visual = getNotificationVisualMeta(notification);

                return (
                  <article
                    key={notification._id}
                    className={`rounded-2xl border px-4 py-3.5 transition hover:shadow-sm sm:px-5 ${
                      !notification.read ? visual.cardClassName : "border-[#e3ebe8] bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <span className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white ${visual.iconClassName}`}>
                          <visual.Icon className="h-5 w-5" />
                        </span>

                        <div className="min-w-0">
                          <p className="text-base font-semibold text-[#13282b]">{notification.title}</p>
                          <p className="mt-0.5 text-sm text-[#4f666c]">{maskSpaceName(notification.message, notification.metadata, workspaceCodeMap)}</p>
                          <p className="mt-1.5 text-xs text-[#6a8288]">{formatRelativeTime(notification.createdAt)}</p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-start gap-2">
                        {!notification.read ? (
                          <span className="rounded-full bg-[#35503F] px-2.5 py-1 text-xs font-semibold text-white">
                            New
                          </span>
                        ) : null}

                        {!notification.read ? (
                          <button
                            type="button"
                            onClick={() => markAsRead(notification._id)}
                            className="rounded-lg border border-[#d8e3df] px-2.5 py-1.5 text-xs font-semibold text-[#1a3134] transition hover:bg-[#eef4f2]"
                          >
                            Mark read
                          </button>
                        ) : null}

                        <button
                          type="button"
                          onClick={() => deleteNotification(notification._id)}
                          className="rounded-lg border border-transparent p-2 text-[#7a9095] transition hover:bg-red-50 hover:text-red-500"
                          title="Delete notification"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>

        <aside className="h-fit rounded-2xl border border-[#d8e3df] bg-white p-4 shadow-sm sm:p-5">
          <h3 className="text-2xl font-semibold leading-none text-[#13282b]">Notification Preferences</h3>

          <div className="mt-4 space-y-4">
            {preferenceItems.map((item) => (
              <div key={item.key} className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-[#13282b]">{item.label}</p>
                  <p className="text-sm text-[#577076]">{item.description}</p>
                </div>

                <ToggleButton
                  checked={preferences[item.key]}
                  disabled={updatingPreferenceKey === item.key}
                  onClick={() => handleTogglePreference(item.key)}
                />
              </div>
            ))}
          </div>
        </aside>
          </div>
        </div>
      </div>
    );
};

export default Notifications;
