import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import notificationService from "@/services/notification.service";
import { Notification } from "@/services/notificationData";
import {
  Bell,
  Check,
  Trash2,
  Settings,
  Filter,
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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | Notification['type']>('all');
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState(notificationService.getPreferences());

  useEffect(() => {
    loadNotifications();
  }, [filter]);

  const loadNotifications = () => {
    let loadedNotifications;
    if (filter === 'all') {
      loadedNotifications = notificationService.getAllNotifications();
    } else if (filter === 'unread') {
      loadedNotifications = notificationService.getUnreadNotifications();
    } else {
      loadedNotifications = notificationService.getNotificationsByType(filter);
    }
    setNotifications(loadedNotifications);
  };

  const handleMarkAsRead = (id: string) => {
    notificationService.markAsRead(id);
    loadNotifications();
  };

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead();
    loadNotifications();
  };

  const handleDeleteNotification = (id: string) => {
    notificationService.deleteNotification(id);
    loadNotifications();
  };

  const handleClearAll = () => {
    notificationService.clearAllNotifications();
    setNotifications([]);
  };

  const handlePreferenceChange = (key: keyof typeof preferences) => {
    const newPreferences = {
      ...preferences,
      [key]: !preferences[key]
    };
    notificationService.updatePreferences(newPreferences);
    setPreferences(newPreferences);
  };

  const handleSimulateNotification = () => {
    notificationService.simulateNewNotification();
    loadNotifications();
  };

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'payment': return <CreditCard className="w-4 h-4" />;
      case 'mail': return <Mail className="w-4 h-4" />;
      case 'visit': return <Users className="w-4 h-4" />;
      case 'booking': return <Building2 className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      case 'support': return <MessageSquare className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'payment': return 'bg-green-100 text-green-700';
      case 'mail': return 'bg-blue-100 text-blue-700';
      case 'visit': return 'bg-purple-100 text-purple-700';
      case 'booking': return 'bg-yellow-100 text-yellow-700';
      case 'document': return 'bg-indigo-100 text-indigo-700';
      case 'support': return 'bg-pink-100 text-pink-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low': return 'bg-gray-100 text-gray-700 border-gray-300';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatTime = (date: Date) => {
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

  const unreadCount = notificationService.getUnreadCount();

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
              Simulate New
            </Button>
            <Button
              onClick={() => setShowPreferences(!showPreferences)}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              <Settings className="w-4 h-4" />
              Preferences
            </Button>
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
              {notifications.filter(n => n.type === 'payment').length}
            </p>
            <p className="text-sm text-gray-500">Payment Alerts</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-2xl font-bold text-blue-600">
              {notifications.filter(n => n.type === 'mail' || n.type === 'visit').length}
            </p>
            <p className="text-sm text-gray-500">Office Updates</p>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all'
                    ? 'bg-yellow-400 text-black'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'unread'
                    ? 'bg-yellow-400 text-black'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                Unread
              </button>
              {['payment', 'mail', 'visit', 'booking', 'document'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type as Notification['type'])}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${filter === type
                      ? 'bg-yellow-400 text-black'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {getTypeIcon(type as Notification['type'])}
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleMarkAllAsRead}
                variant="outline"
                className="flex items-center gap-2"
                disabled={unreadCount === 0}
              >
                <Check className="w-4 h-4" />
                Mark All as Read
              </Button>
              <Button
                onClick={handleClearAll}
                variant="outline"
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </Button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No notifications</h3>
            <p className="text-gray-500 mb-6">
              {filter !== 'all' ? 'Try changing your filters' : "You're all caught up!"}
            </p>
            <Button
              onClick={handleSimulateNotification}
              className="bg-yellow-400 hover:bg-yellow-500 text-black"
            >
              Simulate a Notification
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-xl shadow-sm border ${notification.isRead ? 'border-gray-100' : 'border-yellow-300 border-l-4 border-l-yellow-400'
                  } overflow-hidden hover:shadow-md transition-shadow`}
              >
                <div className="p-5">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    {/* Left Content */}
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(notification.type)}`}>
                          <span className="text-lg">{notification.icon}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(notification.priority)}`}>
                              {notification.priority}
                            </span>
                            {!notification.isRead && (
                              <span className="px-2 py-1 bg-yellow-400 text-black text-xs rounded-full font-medium">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mb-3">{notification.message}</p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span>{formatTime(notification.timestamp)}</span>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${getTypeColor(notification.type)}`}>
                              {getTypeIcon(notification.type)}
                              {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex gap-2">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      {notification.actionUrl && (
                        <button
                          onClick={() => navigate(notification.actionUrl!)}
                          className="px-4 py-2 bg-yellow-400 text-black rounded-lg text-sm font-medium hover:bg-yellow-500 transition-colors"
                        >
                          View
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Preferences Modal */}
        {showPreferences && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Notification Preferences</h2>
                  <button
                    onClick={() => setShowPreferences(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {Object.entries(preferences).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          {key.split(/(?=[A-Z])/).join(' ')}
                        </p>
                        <p className="text-sm text-gray-500">
                          {key.includes('email') && 'Receive updates via email'}
                          {key.includes('payment') && 'Get notified about payments'}
                          {key.includes('mail') && 'Updates about mail/parcels'}
                          {key.includes('visit') && 'Notify when visitors arrive'}
                          {key.includes('marketing') && 'Offers and promotions'}
                          {key.includes('push') && 'Push notifications on this device'}
                        </p>
                      </div>
                      <button
                        onClick={() => handlePreferenceChange(key as keyof typeof preferences)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${value ? 'bg-yellow-400' : 'bg-gray-300'
                          }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${value ? 'translate-x-7' : 'translate-x-1'
                            }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={() => setShowPreferences(false)}
                    className="flex-1 border border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setPreferences(notificationService.getPreferences());
                      setShowPreferences(false);
                    }}
                    className="flex-1 bg-yellow-400 text-black hover:bg-yellow-500"
                  >
                    Save Preferences
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;