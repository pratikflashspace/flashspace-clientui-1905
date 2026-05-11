import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext'; // Assuming you have an AuthContext
import { toast } from 'sonner';
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
    archived: boolean;
    createdAt: string;
    metadata?: any;
}

type NotificationPreferenceKey =
    | "email"
    | "push"
    | "reminders"
    | "loginAlerts";

type NotificationPreferencesState = Record<NotificationPreferenceKey, boolean>;

const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferencesState = {
    email: true,
    push: true,
    reminders: true,
    loginAlerts: true,
};

const normalizeNotificationPreferences = (
    raw?: Partial<NotificationPreferencesState>
): NotificationPreferencesState => ({
    email: typeof raw?.email === "boolean" ? raw.email : DEFAULT_NOTIFICATION_PREFERENCES.email,
    push: typeof raw?.push === "boolean" ? raw.push : DEFAULT_NOTIFICATION_PREFERENCES.push,
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

const isPartnerPortalNotification = (notification: INotification): boolean => {
    const metadata = notification.metadata || {};
    const actionUrl = typeof metadata.actionUrl === "string" ? metadata.actionUrl : "";
    const metadataType = typeof metadata.type === "string" ? metadata.type : "";
    const title = (notification.title || "").toLowerCase();

    return (
        actionUrl.startsWith("/spaceportal/") ||
        metadataType === "booking_request" ||
        title.includes("booking request")
    );
};

const normalizeNotifications = (items: INotification[]): INotification[] => {
    const deduped = new Map<string, INotification>();

    items.forEach((item) => {
        if (!item?._id) return;
        if (isPartnerPortalNotification(item)) return;
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
    archiveNotification: (id: string) => void;
    deleteAllNotifications: () => void;
    handleNavigate: (notification: INotification) => void;
    requestPermission: () => Promise<void>;
    notificationPermission: NotificationPermission;
    workspaceCodeMap: Record<string, string>;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    console.log("NotificationProvider rendering");
    const { user } = useAuth(); // Get current user
    const navigate = useNavigate();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [workspaceCodeMap, setWorkspaceCodeMap] = useState<Record<string, string>>({});
    const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
        typeof Notification !== 'undefined' ? Notification.permission : 'default'
    );

    const requestPermission = useCallback(async () => {
        if (typeof Notification === 'undefined') return;
        
        try {
            const permission = await Notification.requestPermission();
            setNotificationPermission(permission);
            if (permission === 'granted') {
                toast.success('Browser notifications enabled!');
            }
        } catch (err) {
            console.error('Failed to request notification permission', err);
        }
    }, []);

    const handleNavigate = useCallback((notification: INotification) => {
        const metadata = notification.metadata || {};
        const message = (notification.message || "").toLowerCase();
        const title = (notification.title || "").toLowerCase();
        const actionUrl = typeof metadata.actionUrl === "string" ? metadata.actionUrl : "";

        if (actionUrl.startsWith("/dashboard/") || actionUrl.startsWith("/spaceportal/") || actionUrl.startsWith("/affiliate-portal/")) {
            navigate(actionUrl);
            return;
        }

        if (metadata.type === "booking_request" || title.includes("booking request")) {
            navigate("/spaceportal/booking-requests");
            return;
        }

        // 1. Mail Records
        if (metadata.mailRecordId || message.includes("mail") || message.includes("parcel") || title.includes("mail")) {
            navigate("/dashboard/mail-records");
            return;
        }

        // 2. Visit Records
        if (metadata.visitId || message.includes("visit") || message.includes("visitor") || title.includes("visit")) {
            navigate("/dashboard/visit-records");
            return;
        }

        // 3. KYC / Profile
        if (message.includes("kyc") || message.includes("verified") || message.includes("approved") || title.includes("kyc")) {
            navigate("/dashboard/profile");
            return;
        }

        // 4. Support
        if (metadata.ticketId || message.includes("ticket") || message.includes("support") || title.includes("ticket") || title.includes("support") || notification.type === "TICKET_UPDATE") {
            navigate("/dashboard/support");
            return;
        }

        // 5. Payments/Invoices
        if (metadata.invoiceId || metadata.invoiceNumber || message.includes("payment") || message.includes("invoice") || message.includes("due") || title.includes("payment") || title.includes("invoice")) {
            navigate("/dashboard/payments");
            return;
        }

        // 6. Bookings
        if (metadata.bookingId || message.includes("booking") || message.includes("booked") || title.includes("booking") || notification.type === "MEETING_BOOKED") {
            navigate("/dashboard/my-bookings");
            return;
        }

        // 7. Documents
        if (message.includes("document") || title.includes("document")) {
            navigate("/dashboard/documents");
            return;
        }
    }, [navigate]);

    const unreadCount = notifications.filter(n => !n.read && !n.archived).length;

    // 1. Fetch History
    const fetchNotifications = useCallback(async () => {
        if (!user) return;

        const baseUrl = API_CONFIG.BASE_URL;

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
                setNotifications(normalizeNotifications(data.data));
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
            
            // Auto request browser notification permission on visit
            if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
                requestPermission();
            }
        } else {
            setNotifications([]);
        }
    }, [user, fetchNotifications, requestPermission]);

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

            if (isPartnerPortalNotification(normalizedIncoming)) {
                return;
            }

            if (!isNotificationEnabledByPreference(normalizedIncoming, preferences)) {
                return;
            }

            // Show Toast
            toast.custom(
                (t) => (
                    <div 
                        className="w-full max-w-sm bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-border/50 dark:border-white/10 p-4 flex items-start gap-4 transition-all duration-500 ease-out hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
                        onClick={() => {
                            handleNavigate(normalizedIncoming);
                            toast.dismiss(t);
                        }}
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            normalizedIncoming.type === 'SUCCESS' ? 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400' :
                            normalizedIncoming.type === 'ERROR' ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' :
                            normalizedIncoming.type === 'WARNING' ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400' :
                            'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground'
                        }`}>
                            {normalizedIncoming.type === 'SUCCESS' ? (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            ) : normalizedIncoming.type === 'ERROR' ? (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                            )}
                        </div>
                        <div className="flex-grow min-w-0">
                            <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                                {normalizedIncoming.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                                {maskSpaceName(normalizedIncoming.message, normalizedIncoming.metadata, workspaceCodeMap)}
                            </p>
                        </div>
                        <div className="shrink-0 pt-0.5">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        </div>
                    </div>
                ),
                { duration: 5000, position: 'top-right' }
            );

            // Trigger Browser Notification if permission granted
            if (Notification.permission === 'granted') {
                const body = maskSpaceName(normalizedIncoming.message, normalizedIncoming.metadata, workspaceCodeMap);
                new Notification(normalizedIncoming.title, {
                    body: body,
                    icon: '/favicon.ico', // You can use a specific notification icon here
                });
            }

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

    const archiveNotification = async (id: string) => {
        // Optimistic Update: Toggle archived status in state instead of filtering out
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, archived: !n.archived } : n));

        try {
            await fetch(`${API_CONFIG.BASE_URL}/api/notifications/${id}/archive`, {
                method: 'PATCH',
                credentials: 'include'
            });
        } catch (err) {
            console.error("Failed to archive notification", err);
            // Revert on error if necessary, but for now we trust the toggle
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
            archiveNotification,
            deleteAllNotifications,
            handleNavigate,
            requestPermission,
            notificationPermission,
            workspaceCodeMap
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        console.error("useNotifications called outside of NotificationProvider!", {
            context,
            NotificationContext
        });
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
};
