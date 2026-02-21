
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext'; // Assuming you have an AuthContext
import toast from 'react-hot-toast';

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

interface NotificationContextType {
    notifications: INotification[];
    unreadCount: number;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    fetchNotifications: () => void;
    deleteNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth(); // Get current user
    const [socket, setSocket] = useState<Socket | null>(null);
    const [notifications, setNotifications] = useState<INotification[]>([]);

    const unreadCount = notifications.filter(n => !n.read).length;

    // 1. Fetch History
    const fetchNotifications = async () => {
        if (!user) return;

        // Debug user object to see why _id is undefined
        console.log("Current User Object:", user);
        // Fallback for ID if _id is missing
        const userId = user._id || user.id;
        console.log("Fetching notifications for user ID:", userId);

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
            console.log("Notification API Response:", data);

            if (data.success) {
                setNotifications(data.data);
            }
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        }
    };

    // 2. Initial Fetch
    useEffect(() => {
        if (user) {
            fetchNotifications();
        } else {
            setNotifications([]);
        }
    }, [user]);

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
            // Show Toast
            toast(
                (t) => (
                    <div onClick={() => toast.dismiss(t.id)}>
                        <strong>{newNotification.title}</strong>
                        <p>{newNotification.message}</p>
                    </div>
                ),
                { duration: 4000, position: 'top-right' }
            );

            // Update State
            setNotifications(prev => [newNotification, ...prev]);
        });

        // Join Rooms based on role
        if (user.role === 'admin') {
            socketInstance.emit('join_admin_feed');
        } else {
            socketInstance.emit('join_user_feed', user._id);
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
            // Optionally could rollback the state if delete fails
        }
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications, deleteNotification }}>
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
