
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
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, token } = useAuth(); // Get current user
    const [socket, setSocket] = useState<Socket | null>(null);
    const [notifications, setNotifications] = useState<INotification[]>([]);

    const unreadCount = notifications.filter(n => !n.read).length;

    // 1. Fetch History
    const fetchNotifications = async () => {
        if (!user || !token) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setNotifications(data.notifications);
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
        if (!user || !token) return;

        // Connect to Backend
        const socketInstance = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
            auth: { token }, // If your socket middleware uses this
            query: { userId: user._id } // Or this
        });

        // Listen for new notifications
        socketInstance.on('notification:new', (newNotification: INotification) => {
            // Play sound?
            // const audio = new Audio('/notification.mp3');
            // audio.play();

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
            socketInstance.emit('join_ticket', user._id); // Example: joining user room
        }

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, [user, token]);

    // 4. Actions
    const markAsRead = async (id: string) => {
        // Optimistic Update
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));

        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/${id}/read`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (err) {
            console.error("Failed to mark read", err);
        }
    };

    const markAllAsRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/read-all`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (err) {
            console.error("Failed to mark all read", err);
        }
    }

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications }}>
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
