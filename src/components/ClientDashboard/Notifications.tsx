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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [typeFilter, setTypeFilter] = useState<'all' | Notification['type']>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread'>('all');
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState(notificationService.getPreferences());

  useEffect(() => {
    loadNotifications();
  }, [typeFilter, statusFilter]);

  const loadNotifications = () => {
    let loadedNotifications: Notification[];

    // First apply type filter
    if (typeFilter === 'all') {
      loadedNotifications = notificationService.getAllNotifications();
    } else {
      loadedNotifications = notificationService.getNotificationsByType(typeFilter);
    }

    // Then apply status filter
    if (statusFilter === 'unread') {
      loadedNotifications = loadedNotifications.filter(n => !n.isRead);
    }

    // Clone array to ensure React triggers re-render after mutations
    setNotifications([...loadedNotifications]);
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

  const getCategoryLabel = (type: Notification['type']) => {
    switch (type) {
      case 'payment': return 'Finance';
      case 'mail': return 'Mail';
      case 'visit': return 'Visit';
      case 'booking': return 'Booking';
      case 'document': return 'Document';
      case 'support': return 'Support';
      default: return 'System';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays === 0) {
      return date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const unreadCount = notificationService.getUnreadCount();

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold  text-gray-900">
              <span className="text-[#35503F]">Notifications</span>
              {unreadCount > 0 && (
                <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {unreadCount} new
                </span>
              )}
            </h1>
          </div>
        </div>
        {/* Filters & Actions + List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 w-full">
          {/* Header/Filter Bar */}
          <div className="py-2.5 px-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50 w-full">
            <div className="flex items-center gap-4 w-full sm:w-auto flex-1">
              <div className="relative group z-20">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-[#FAF6D3] hover:text-[#35503F] hover:border-[#F2EEB3] transition-colors focus:outline-none focus:ring-2 focus:ring-[#35503F]/20">
                  <Filter className="w-4 h-4" />
                  <span>
                    {typeFilter === 'all' && statusFilter === 'all' ? 'All Notifications' :
                      `${statusFilter === 'unread' ? 'Unread ' : ''}${typeFilter === 'all' ? 'Notifications' : typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1)}`}
                  </span>
                </button>
                <div className="absolute left-0 top-full w-48 mt-[1px] pt-1 hidden group-hover:block transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-200">
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                    <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</p>
                    {['all', 'unread'].map((fp) => (
                      <button
                        key={fp}
                        onClick={() => setStatusFilter(fp as any)}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors capitalize ${statusFilter === fp
                          ? "bg-[#FAF6D3]/50 text-[#35503F] font-semibold"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                      >
                        {fp === 'all' ? 'All' : 'Unread Only'}
                      </button>
                    ))}

                    <div className="h-px bg-gray-100 my-1 mx-2"></div>
                    <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</p>

                    {['all', 'payment', 'mail', 'visit', 'booking', 'document'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setTypeFilter(type as any)}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors capitalize ${typeFilter === type
                          ? "bg-[#FAF6D3]/50 text-[#35503F] font-semibold"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                      >
                        {type === 'all' ? 'Any Category' : type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <Button
                onClick={handleClearAll}
                variant="outline"
                className="flex-1 md:flex-none flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          {notifications.length === 0 ? (
            <div className="p-12 text-center bg-white">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No notifications</h3>
              <p className="text-gray-500 mb-6">
                {typeFilter !== 'all' || statusFilter !== 'all'
                  ? "We couldn't find any notifications matching your filters."
                  : "You're all caught up! There are no new notifications right now."}
              </p>
              {(typeFilter !== 'all' || statusFilter !== 'all') && (
                <Button
                  onClick={handleSimulateNotification}
                  className="bg-[#35503F] hover:bg-[#35503F]/90 text-white"
                >
                  Simulate a Notification
                </Button>
              )}
            </div>
          ) : (
            <div className="bg-white">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`group border-b last:border-0 hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-[#35503F]/5' : ''}`}
                >
                  <div className="px-4 py-2 flex flex-col sm:flex-row items-center sm:justify-between gap-4 w-full cursor-pointer">
                    {/* Left Content */}
                    <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0 w-full">
                      {/* Read Status Indicator */}
                      <div className="flex-shrink-0 mt-1 sm:mt-0">
                        <div className={`w-2.5 h-2.5 rounded-full border border-gray-300 ${!notification.isRead ? 'bg-[#35503F] border-[#35503F]' : 'bg-transparent'}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <span className="font-semibold text-gray-900 flex-shrink-0">
                          {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                        </span>
                        <span className="text-gray-600 truncate hidden sm:inline">
                          –
                        </span>
                        <span className="text-gray-600 truncate flex-1 leading-snug">
                          {notification.title} – {notification.message}
                        </span>
                        <span className={`flex-shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 mt-1 sm:mt-0 w-fit`}>
                          {getCategoryLabel(notification.type)}
                        </span>
                      </div>
                    </div>

                    {/* Right Content (Time & Actions) */}
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 flex-shrink-0">
                      {/* Time */}
                      <span className="text-sm text-gray-400 whitespace-nowrap">
                        {formatTime(notification.timestamp)}
                      </span>

                      {/* Actions Container */}
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity min-w-[60px] justify-end">
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-2 text-gray-400 hover:text-[#35503F] rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                          title="Delete notification"
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
        </div>

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
                        className={`w-12 h-6 rounded-full transition-colors relative ${value ? 'bg-[#35503F]' : 'bg-gray-300'
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
                    className="flex-1 bg-[#35503F] text-white hover:bg-[#35503F]/90"
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