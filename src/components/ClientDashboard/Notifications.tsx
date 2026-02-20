import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications, NotificationType, INotification } from "@/contexts/NotificationContext";
import {
  Bell,
  Check,
  Trash2,
  Settings,
  X,
  Mail,
  CreditCard,
  Users,
  FileText,
  Building2,
  AlertCircle,
  MessageSquare,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications } = useNotifications();
  const [filter, setFilter] = useState<{ status: 'all' | 'unread'; type: 'all' | NotificationType }>({
    status: 'all',
    type: 'all'
  });
  const [showPreferences, setShowPreferences] = useState(false);

  // Filter Logic
  const filteredNotifications = notifications.filter(n => {
    // 1. Apply status filter
    if (filter.status === 'unread' && n.read) return false;

    // 2. Apply type filter
    if (filter.type !== 'all' && n.type !== filter.type) return false;

    return true;
  });

  const handleSimulateNotification = () => {
    // Re-fetch to simulate generic refresh
    fetchNotifications();
  };

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.MEETING_BOOKED: return <Building2 className="w-4 h-4" />;
      case NotificationType.TICKET_UPDATE: return <MessageSquare className="w-4 h-4" />;
      case NotificationType.SUCCESS: return <Check className="w-4 h-4" />;
      case NotificationType.WARNING: return <AlertCircle className="w-4 h-4" />;
      case NotificationType.ERROR: return <X className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.MEETING_BOOKED: return 'bg-yellow-100 text-yellow-700';
      case NotificationType.TICKET_UPDATE: return 'bg-pink-100 text-pink-700';
      case NotificationType.SUCCESS: return 'bg-green-100 text-green-700';
      case NotificationType.WARNING: return 'bg-orange-100 text-orange-700';
      case NotificationType.ERROR: return 'bg-red-100 text-red-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-[Poppins] text-gray-900">
              <span className="text-yellow-500">Notifications</span>
            </h1>
            <p className="text-gray-500 mt-1">Stay updated with all your workspace activities</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleSimulateNotification}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            {/* Preferences removed for now as backend doesn't support them yet */}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
            <p className="text-sm text-gray-500">Total Notifications</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-2xl font-bold text-yellow-600">{unreadCount}</p>
            <p className="text-sm text-gray-500">Unread</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-2xl font-bold text-green-600">
              {notifications.filter(n => n.type === NotificationType.SUCCESS).length}
            </p>
            <p className="text-sm text-gray-500">Success Alerts</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-2xl font-bold text-blue-600">
              {notifications.filter(n => n.type === NotificationType.INFO).length}
            </p>
            <p className="text-sm text-gray-500">Updates</p>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter({ status: 'all', type: 'all' })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter.status === 'all' && filter.type === 'all'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter(prev => ({ ...prev, status: prev.status === 'unread' ? 'all' : 'unread' }))}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter.status === 'unread'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                Unread Only
              </button>

              <div className="w-px h-8 bg-gray-200 mx-2 self-center hidden sm:block"></div>

              {/* Filter by Type */}
              {[NotificationType.MEETING_BOOKED, NotificationType.TICKET_UPDATE].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(prev => ({ ...prev, type: prev.type === type ? 'all' : type }))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${filter.type === type
                    ? 'bg-yellow-400 text-black'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {getTypeIcon(type)}
                  {type.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => markAllAsRead()}
                variant="outline"
                className="flex items-center gap-2"
                disabled={unreadCount === 0}
              >
                <Check className="w-4 h-4" />
                Mark All as Read
              </Button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No notifications</h3>
            <p className="text-gray-500 mb-6">
              {(filter.status !== 'all' || filter.type !== 'all') ? 'Try changing your filters' : "You're all caught up!"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`bg-white rounded-xl shadow-sm border ${notification.read ? 'border-gray-100' : 'border-yellow-300 border-l-4 border-l-yellow-400'
                  } overflow-hidden hover:shadow-md transition-shadow`}
              >
                <div className="p-5">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    {/* Left Content */}
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(notification.type)}`}>
                          <span className="text-lg">{getTypeIcon(notification.type)}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                            {!notification.read && (
                              <span className="px-2 py-1 bg-yellow-400 text-black text-xs rounded-full font-medium">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mb-3">{notification.message}</p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span>{formatTime(notification.createdAt)}</span>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${getTypeColor(notification.type)}`}>
                              {getTypeIcon(notification.type)}
                              {notification.type.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex gap-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification._id)}
                          className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;