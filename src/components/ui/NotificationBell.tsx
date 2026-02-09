import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import notificationService from "@/services/notification.service";
import { Notification } from "@/services/notificationData";
import { Bell, Check, X } from "lucide-react";

const NotificationBell: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    updateNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(updateNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const updateNotifications = () => {
    const unread = notificationService.getUnreadNotifications().slice(0, 5);
    setNotifications(unread);
    setUnreadCount(notificationService.getUnreadCount());
  };

  const handleMarkAsRead = (id: string) => {
    notificationService.markAsRead(id);
    updateNotifications();
  };

  const handleViewAll = () => {
    setIsOpen(false);
    navigate("/dashboard/notifications");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={() => {
                      notificationService.markAllAsRead();
                      updateNotifications();
                    }}
                    className="text-xs text-yellow-600 hover:text-yellow-700"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No new notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-lg">{notification.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {notification.title}
                        </h4>
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-gray-400 text-xs mt-2">
                        {new Date(notification.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-gray-100">
            <button
              onClick={handleViewAll}
              className="w-full py-2 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-500 transition-colors"
            >
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;