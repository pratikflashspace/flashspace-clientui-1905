
import React, { useEffect, useState } from 'react';
import { AdminNotificationService, AdminNotification } from '@/services/adminNotification.service';
import { Bell, Trash2, Check, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function Notifications() {
    const [notifications, setNotifications] = useState<AdminNotification[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const data = await AdminNotificationService.getAll();
            setNotifications(data);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
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
            setNotifications(prev => prev.filter(n => n._id !== id));
        } catch (error) {
            console.error("Failed to delete notification", error);
        }
    };

    const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const updated = await AdminNotificationService.markAsRead(id);
            setNotifications(prev => prev.map(n => n._id === id ? updated : n));
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'WARNING': return <AlertCircle className="w-5 h-5 text-amber-500" />;
            case 'ERROR': return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'SUCCESS': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
            default: return <Bell className="w-5 h-5 text-teal-500" />;
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading notifications...</div>;
    }

    return (
        <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                        System <span className="text-primary italic">Notifications</span>
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Stay updated with real-time system alerts and activities.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-background px-6 py-3 rounded-2xl border border-border flex items-center gap-3 shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-sm font-bold text-foreground">
                            {notifications.length} Total Alerts
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden">
                {notifications.length === 0 ? (
                    <div className="p-16 text-center text-muted-foreground flex flex-col items-center gap-3">
                        <Bell className="w-16 h-16 opacity-10 mb-2" />
                        <h3 className="text-xl font-bold text-foreground">All caught up!</h3>
                        <p>You don't have any new notifications at the moment.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {notifications.map((notification) => (
                            <div
                                key={notification._id}
                                className={`p-8 hover:bg-muted/30 transition-all group flex gap-6 items-start ${!notification.read ? 'bg-primary/5' : ''}`}
                            >
                                <div className={`p-4 rounded-2xl bg-background border border-border shadow-sm h-fit transition-transform group-hover:scale-105 ${!notification.read ? 'ring-2 ring-primary/20' : ''}`}>
                                    {getIcon(notification.type)}
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-3">
                                            <h3 className={`text-lg font-bold text-foreground ${!notification.read ? 'text-primary' : ''}`}>
                                                {notification.title}
                                            </h3>
                                            {!notification.read && (
                                                <span className="w-2 h-2 rounded-full bg-primary" />
                                            )}
                                        </div>
                                        <span className="text-sm font-medium text-muted-foreground flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-full border border-border">
                                            <Clock className="w-4 h-4" />
                                            {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                                        </span>
                                    </div>
                                    <p className="text-muted-foreground text-base leading-relaxed mb-4 max-w-4xl">
                                        {notification.message}
                                    </p>

                                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0">
                                        {!notification.read && (
                                            <button
                                                onClick={(e) => handleMarkAsRead(notification._id, e)}
                                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-teal-600 bg-teal-50 hover:bg-teal-100 transition-all active:scale-95"
                                            >
                                                <Check className="w-4 h-4" />
                                                Mark as read
                                            </button>
                                        )}
                                        <button
                                            onClick={(e) => handleDelete(notification._id, e)}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-all active:scale-95"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
