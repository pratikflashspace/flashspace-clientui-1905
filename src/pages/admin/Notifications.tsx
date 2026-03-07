
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
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage all your system alerts and updates</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-sm font-medium text-gray-600">
                    {notifications.length} Total
                </div>
            </div>

            <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
                {notifications.length === 0 ? (
                    <div className="p-12 text-center text-gray-400 flex flex-col items-center gap-3">
                        <Bell className="w-12 h-12 opacity-20" />
                        <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
                        <p>You're all caught up!</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {notifications.map((notification) => (
                            <div
                                key={notification._id}
                                className={`p-6 hover:bg-gray-50 transition-colors group flex gap-4 ${!notification.read ? 'bg-blue-50/30' : ''}`}
                            >
                                <div className={`p-3 rounded-full bg-white border border-gray-100 shadow-sm h-fit ${!notification.read ? 'ring-2 ring-blue-100' : ''}`}>
                                    {getIcon(notification.type)}
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className={`font-semibold text-gray-900 ${!notification.read ? 'text-blue-900' : ''}`}>
                                            {notification.title}
                                        </h3>
                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-3">
                                        {notification.message}
                                    </p>

                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {!notification.read && (
                                            <button
                                                onClick={(e) => handleMarkAsRead(notification._id, e)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-teal-600 hover:bg-teal-50 transition-colors"
                                            >
                                                <Check className="w-3.5 h-3.5" />
                                                Mark as read
                                            </button>
                                        )}
                                        <button
                                            onClick={(e) => handleDelete(notification._id, e)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
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
