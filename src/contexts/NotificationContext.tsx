import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext'; // Assuming you have an AuthContext
import toast from 'react-hot-toast';
import { maskSpaceName } from '@/utils/masking';
import userDashboardService from '@/services/userDashboard.service';

// Types (Match Backend)
export enum NotificationType {
    INFO = 'INFO',
    SUCCESS = 'SUCCESS',
    WARNING = 'WARNING',
    ERROR = 'ERROR',
    TICKET_UPDATE = 'TICKET_UPDATE',
    MEETING_BOOKED = 'MEETING_BOOKED'
}
import { API_CONFIG } from '@/config/api.config';

export interface INotification {
    _id: string;
    type: NotificationType;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
    metadata?: any;
}

type NotificationPreferenceKey =
    | "email"
    | "push"
    | "promotional"
    | "reminders"
    | "loginAlerts";

type NotificationPreferencesState = Record<NotificationPreferenceKey, boolean>;

const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferencesState = {
    email: true,
    push: true,
    promotional: false,
    reminders: true,
    loginAlerts: true,
};

const normalizeNotificationPreferences = (
    raw?: Partial<NotificationPreferencesState>
): NotificationPreferencesState => ({
    email: typeof raw?.email === "boolean" ? raw.email : DEFAULT_NOTIFICATION_PREFERENCES.email,
    push: typeof raw?.push === "boolean" ? raw.push : DEFAULT_NOTIFICATION_PREFERENCES.push,
    promotional:
        typeof raw?.promotional === "boolean"
            ? raw.promotional
            : DEFAULT_NOTIFICATION_PREFERENCES.promotional,
    reminders:
        typeof raw?.reminders === "boolean"
            ? raw.reminders
            : DEFAULT_NOTIFICATION_PREFERENCES.reminders,
    loginAlerts:
        typeof raw?.loginAlerts === "boolean"
            ? raw.loginAlerts
            : DEFAULT_NOTIFICATION_PREFERENCES.loginAlerts,
});

const inferPreferenceKeyFromNotification = (
    notification: INotification
): NotificationPreferenceKey | null => {
    const explicitPreference = notification?.metadata?.__preferenceKey;
    if (
        explicitPreference === "email" ||
        explicitPreference === "push" ||
        explicitPreference === "promotional" ||
        explicitPreference === "reminders" ||
        explicitPreference === "loginAlerts"
    ) {
        return explicitPreference;
    }

    const combinedText = `${notification?.title || ""} ${notification?.message || ""}`.toLowerCase();
    const metadata = notification?.metadata;

    if (
        combinedText.includes("kyc") ||
        combinedText.includes("partner application") ||
        combinedText.includes("business profile") ||
        Boolean(metadata?.kycId) ||
        Boolean(metadata?.partnerId) ||
        Boolean(metadata?.businessId)
    ) {
        return "reminders";
    }

    if (
        combinedText.includes("mail") ||
        combinedText.includes("parcel") ||
        combinedText.includes("courier") ||
        Boolean(metadata?.mailRecordId) ||
        Boolean(metadata?.mailId)
    ) {
        return "push";
    }

    if (
        combinedText.includes("visit") ||
        combinedText.includes("visitor") ||
        Boolean(metadata?.visitId) ||
        Boolean(metadata?.visitorId)
    ) {
        return "loginAlerts";
    }

    if (
        combinedText.includes("marketing") ||
        combinedText.includes("offer") ||
        combinedText.includes("announcement") ||
        combinedText.includes("promo")
    ) {
        return "promotional";
    }

    return null;
};

const isNotificationEnabledByPreference = (
    notification: INotification,
    preferences: NotificationPreferencesState
) => {
    const preferenceKey = inferPreferenceKeyFromNotification(notification);
    if (!preferenceKey) return true;
    return preferences[preferenceKey];
};

const getCreatedAtTime = (value?: string): number => {
    if (!value) return 0;
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
};

const normalizeNotifications = (items: INotification[]): INotification[] => {
    const deduped = new Map<string, INotification>();

    items.forEach((item) => {
        if (!item?._id) return;
        deduped.set(item._id, item);
    });

    return Array.from(deduped.values()).sort(
        (a, b) => getCreatedAtTime(b.createdAt) - getCreatedAtTime(a.createdAt)
    );
};

const mergeNotifications = (
    current: INotification[],
    incoming: INotification[]
): INotification[] => normalizeNotifications([...current, ...incoming]);

interface NotificationContextType {
    notifications: INotification[];
    unreadCount: number;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    fetchNotifications: () => void;
    deleteNotification: (id: string) => void;
    deleteAllNotifications: () => void;
    workspaceCodeMap: Record<string, string>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth(); // Get current user
    const [socket, setSocket] = useState<Socket | null>(null);
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [workspaceCodeMap, setWorkspaceCodeMap] = useState<Record<string, string>>({});

    const unreadCount = notifications.filter(n => !n.read).length;

    // 1. Fetch History
    const fetchNotifications = useCallback(async () => {
        if (!user) return;

        // Debug user object to see why _id is undefined
        // console.log("Current User Object:", user);
        // Fallback for ID if _id is missing
        const userId = user._id || user.id;
        // console.log("Fetching notifications for user ID:", userId);

        const baseUrl = API_CONFIG.BASE_URL; // Use config with fallback

        try {
            const res = await fetch(`${baseUrl}/api/notifications`, {
                credentials: 'include'
            });

            // Check content type to avoid JSON parse error on HTML response
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") === -1) {
                console.error("Received non-JSON response:", await res.text());
                return;
            }

            const data = await res.json();
            // console.log("Notification API Response:", data);

            if (data.success && Array.isArray(data.data)) {
                const preferences = normalizeNotificationPreferences(user.notifications);
                const filteredData = data.data.filter((notification: INotification) =>
                    isNotificationEnabledByPreference(notification, preferences)
                );
                setNotifications(normalizeNotifications(filteredData));
            }
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        }
    }, [user]);

    const fetchWorkspaceCodes = useCallback(async () => {
        if (!user) return;
        try {
            const response = await userDashboardService.getBookings({ status: "active" });
            if (response.success && Array.isArray(response.data)) {
                const map: Record<string, string> = {};
                response.data.forEach((b: any) => {
                    const normalizeSpaceCode = (value?: string) => {
                        const trimmed = value?.trim();
                        if (!trimmed) return "";
                        const match = trimmed.toUpperCase().match(/\b[A-Z]{2,}\d{1,}\b/);
                        return match?.[0] || "";
                    };
                    const code = normalizeSpaceCode(b.spaceSnapshot?.spaceId) || 
                                 normalizeSpaceCode(b.spaceSnapshot?.name);
                    
                    if (code) {
                        if (b.spaceId) map[b.spaceId] = code;
                        if (b.spaceSnapshot?._id) map[b.spaceSnapshot._id] = code;
                    }
                });
                setWorkspaceCodeMap(map);
            }
        } catch (err) {
            console.error("Failed to fetch workspace codes", err);
        }
    }, [user]);

    // 2. Initial Fetch
    useEffect(() => {
        if (user) {
            fetchNotifications();
            fetchWorkspaceCodes();
        } else {
            setNotifications([]);
        }
    }, [user, fetchNotifications]);

    // 3. Socket Connection
    useEffect(() => {
        if (!user) return;

        const userId = user._id || user.id;
        const baseUrl = API_CONFIG.BASE_URL;

        // Connect to Backend
        const socketInstance = io(baseUrl, {
            withCredentials: true,
            query: { userId: userId }
        });

        // Listen for new notifications
        socketInstance.on('notification:new', (newNotification: INotification) => {
            const normalizedIncoming: INotification = {
                ...newNotification,
                _id: newNotification?._id || `notification-${Date.now()}`,
            };
            const preferences = normalizeNotificationPreferences(user.notifications);

            if (!isNotificationEnabledByPreference(normalizedIncoming, preferences)) {
                return;
            }

            // Show Toast
            toast(
                (t) => (
                    <div onClick={() => toast.dismiss(t.id)}>
                        <strong>{normalizedIncoming.title}</strong>
                        <p>{maskSpaceName(normalizedIncoming.message, normalizedIncoming.metadata, workspaceCodeMap)}</p>
                    </div>
                ),
                { duration: 4000, position: 'top-right' }
            );

            // Update State
            setNotifications(prev => mergeNotifications(prev, [normalizedIncoming]));
        });

        // Join Rooms based on role
        if (user.role === 'admin') {
            socketInstance.emit('join_admin_feed');
        } else {
            socketInstance.emit('join_user_feed', user.id || user._id);
        }

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, [user]);

    // 4. Actions
    // 4. Actions
    const markAsRead = async (id: string) => {
        // Optimistic Update
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));

        try {
            await fetch(`${API_CONFIG.BASE_URL}/api/notifications/${id}/read`, {
                method: 'PATCH',
                credentials: 'include'
            });
        } catch (err) {
            console.error("Failed to mark read", err);
        }
    };

    const markAllAsRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        try {
            await fetch(`${API_CONFIG.BASE_URL}/api/notifications/read-all`, {
                method: 'PATCH',
                credentials: 'include'
            });
        } catch (err) {
            console.error("Failed to mark all read", err);
        }
    };

    const deleteNotification = async (id: string) => {
        // Optimistic Update
        setNotifications(prev => prev.filter(n => n._id !== id));

        try {
            await fetch(`${API_CONFIG.BASE_URL}/api/notifications/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
        } catch (err) {
            console.error("Failed to delete notification", err);
        }
    };

    const deleteAllNotifications = async () => {
        setNotifications([]);
        try {
            await fetch(`${API_CONFIG.BASE_URL}/api/notifications/all`, {
                method: 'DELETE',
                credentials: 'include'
            });
        } catch (err) {
            console.error("Failed to delete all notifications", err);
        }
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            markAsRead,
            markAllAsRead,
            fetchNotifications,
            deleteNotification,
            deleteAllNotifications,
            workspaceCodeMap
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
};
