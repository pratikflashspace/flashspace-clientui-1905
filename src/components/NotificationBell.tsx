import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { Bell, Check, Trash2, X } from 'lucide-react';
import { format } from 'date-fns';

export const NotificationBell: React.FC = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const [clearedIds, setClearedIds] = useState<Set<string>>(new Set());
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Filter out locally cleared notifications
    const visibleNotifications = notifications.filter(n => !clearedIds.has(n._id));
    const visibleUnreadCount = visibleNotifications.filter(n => !n.read).length;

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
                <Bell className="w-6 h-6" />
                {visibleUnreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full min-w-[18px] text-center">
                        {visibleUnreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-[#fcfcfc]">
                        <h3 className="text-sm font-semibold text-[#1a2f24]">Notifications</h3>
                        <div className="flex gap-3">
                            {visibleUnreadCount > 0 && (
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        markAllAsRead();
                                    }}
                                    className="text-xs text-[#0d3b2e] hover:text-[#D96832] flex items-center gap-1 font-medium transition-colors"
                                    title="Mark all as read"
                                >
                                    <Check className="w-3.5 h-3.5" /> Mark all read
                                </button>
                            )}
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    // Clear visually without deleting
                                    setClearedIds(new Set(notifications.map(n => n._id)));
                                }}
                                className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 font-medium transition-colors"
                                title="Clear all visually"
                            >
                                <X className="w-3.5 h-3.5" /> Clear all
                            </button>
                        </div>
                    </div>

                    {/* List */}
                    <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
                        {visibleNotifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <p className="text-sm text-gray-400">No notifications yet.</p>
                            </div>
                        ) : (
                            visibleNotifications.slice(0, 10).map(n => (
                                <div
                                    key={n._id}
                                    className={`group p-4 hover:bg-gray-50/80 transition-colors cursor-pointer relative ${!n.read ? 'bg-[#f0f9f4]' : 'bg-white'}`}
                                    onClick={() => markAsRead(n._id)}
                                >
                                    <div className="flex justify-between items-start gap-3">
                                        <div className="flex-1 min-w-0 pr-8">
                                            <p className={`text-sm truncate ${!n.read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                                                {n.title}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                {n.message}
                                            </p>
                                            <span className="text-[10px] text-gray-400 mt-2 block">
                                                {new Date(n.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Clear individual button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // Add to locally cleared IDs
                                            setClearedIds(prev => new Set(prev).add(n._id));
                                        }}
                                        className="absolute top-4 right-3 p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                        title="Clear notification from view"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}

                        {/* View All Footer Option */}
                        {visibleNotifications.length > 0 && (
                            <div className="p-2 bg-white border-t border-gray-100">
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        const currentPath = window.location.pathname;
                                        if (currentPath.includes('/affiliate-portal')) {
                                            window.location.href = '/affiliate-portal/notifications';
                                        } else if (currentPath.includes('/spaceportal')) {
                                            window.location.href = '/spaceportal/notifications';
                                        } else {
                                            window.location.href = '/dashboard/notifications';
                                        }
                                    }}
                                    className="w-full py-2 text-xs font-medium text-[#0d3b2e] hover:bg-[#0d3b2e]/5 rounded-md transition-colors"
                                >
                                    View All Notifications
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
