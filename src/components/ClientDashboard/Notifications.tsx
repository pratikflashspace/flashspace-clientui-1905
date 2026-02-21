import React, { useState } from "react";
import { useNotifications, NotificationType, INotification } from "@/contexts/NotificationContext";
import {
  Bell,
  Search,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Check,
  Circle,
  Trash2,
  MailOpen,
  X,
} from "lucide-react";

// Helper to determine the aesthetic category tag
const getCategoryFromType = (type: NotificationType, title: string) => {
  const lowercaseTitle = title.toLowerCase();

  if (type === NotificationType.MEETING_BOOKED) return "Booking";
  if (type === NotificationType.TICKET_UPDATE) return "Support";
  if (type === NotificationType.INFO && lowercaseTitle.includes("visitor")) return "Visit";
  if (type === NotificationType.INFO && lowercaseTitle.includes("document")) return "Document";
  if (type === NotificationType.WARNING && lowercaseTitle.includes("payment")) return "Finance";

  if (lowercaseTitle.includes("payment") || lowercaseTitle.includes("invoice") || lowercaseTitle.includes("due")) return "Finance";
  if (lowercaseTitle.includes("visitor")) return "Visit";
  if (lowercaseTitle.includes("document") || lowercaseTitle.includes("kyc") || lowercaseTitle.includes("identity")) return "Document";
  if (lowercaseTitle.includes("booking") || lowercaseTitle.includes("desk") || lowercaseTitle.includes("room")) return "Booking";

  return "System";
};

// Helper to determine the "Sender" string
const getSenderFromType = (type: NotificationType, title: string, message: string) => {
  const lowercaseCombined = (title + " " + message).toLowerCase();

  if (lowercaseCombined.includes("hdfc")) return "HDFC Bank";
  if (lowercaseCombined.includes("icici")) return "ICICI Bank";
  if (lowercaseCombined.includes("invoice") || lowercaseCombined.includes("due") || lowercaseCombined.includes("renewal")) return "Billing";
  if (lowercaseCombined.includes("visitor")) return "Front Desk";
  if (lowercaseCombined.includes("bank") || lowercaseCombined.includes("payment")) return "Billing";
  if (lowercaseCombined.includes("booking") || lowercaseCombined.includes("document") || lowercaseCombined.includes("kyc")) return "System";

  return "System";
}

const Notifications: React.FC = () => {
  const { notifications, unreadCount, fetchNotifications, markAsRead, deleteNotification } = useNotifications();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'read'>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<INotification | null>(null);

  // Filter Logic
  const filteredNotifications = notifications.filter(n => {
    // Search query filter
    if (searchQuery) {
      const matchSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.message.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchSearch) return false;
    }
    // Dropdown filter
    if (filterType === 'unread' && n.read) return false;
    if (filterType === 'read' && !n.read) return false;

    return true;
  });

  const handleSimulateRefresh = () => {
    fetchNotifications();
  };

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  }

  const toggleAll = () => {
    if (selectedIds.size === filteredNotifications.length && filteredNotifications.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredNotifications.map(n => n._id)));
    }
  }

  const formatTimeStr = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    const isYesterday = new Date(now.setDate(now.getDate() - 1)).getDate() === date.getDate() && now.getMonth() === date.getMonth() && now.getFullYear() === date.getFullYear();

    if (isToday) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } else if (isYesterday) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] p-6 lg:p-10">
      <div className="max-w-[1200px] mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-[28px] font-bold font-[Poppins] text-[#1a2f24] tracking-tight hover:text-[#0d3b2e] transition-colors">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="px-3 py-1 bg-red-50 text-red-500 text-[13px] font-medium rounded-full border border-red-100/50">
                {unreadCount} new
              </span>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative pt-2 w-full max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 mt-1 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-5 py-2.5 bg-white border border-gray-100 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0d3b2e]/10 focus:border-[#0d3b2e] transition-all shadow-sm placeholder-gray-400"
          />
        </div>

        {/* List Container */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm mt-4">

          {/* Action Bar */}
          <div className="flex items-center justify-between py-1.5 px-3 border-b border-gray-100 bg-[#fcfcfc] rounded-t-xl">
            <div className="flex items-center gap-1 pl-1">
              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className={`p-1.5 rounded-full transition-colors flex items-center gap-2 ${showFilterDropdown || filterType !== 'all' ? 'text-[#0d3b2e] bg-[#0d3b2e]/10' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100/70'}`}
                  title="Filter"
                >
                  <Filter className="w-4 h-4" />
                </button>
                {showFilterDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowFilterDropdown(false)}></div>
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-20 py-2 overflow-hidden">
                      <button
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${filterType === 'all' ? 'font-medium text-[#0d3b2e]' : 'text-gray-600'}`}
                        onClick={() => { setFilterType('all'); setShowFilterDropdown(false); }}
                      >
                        All Notifications
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${filterType === 'unread' ? 'font-medium text-[#0d3b2e]' : 'text-gray-600'}`}
                        onClick={() => { setFilterType('unread'); setShowFilterDropdown(false); }}
                      >
                        Unread Only
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${filterType === 'read' ? 'font-medium text-[#0d3b2e]' : 'text-gray-600'}`}
                        onClick={() => { setFilterType('read'); setShowFilterDropdown(false); }}
                      >
                        Read Only
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-5 text-[13px] text-gray-400">
              <span className="hidden sm:inline-block font-medium">1 of {Math.max(1, Math.ceil(filteredNotifications.length / 10))}</span>
              <div className="flex items-center gap-1">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100/70 disabled:opacity-30 disabled:hover:bg-transparent transition-colors" disabled>
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100/70 disabled:opacity-30 disabled:hover:bg-transparent transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* List Items */}
          <div className="divide-y divide-gray-100">
            {filteredNotifications.length === 0 ? (
              <div className="p-16 text-center">
                <Bell className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-1">No notifications</h3>
                <p className="text-gray-400">You're all caught up.</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => {
                const isSelected = selectedIds.has(notification._id);
                const category = getCategoryFromType(notification.type, notification.title);
                const sender = getSenderFromType(notification.type, notification.title, notification.message);

                return (
                  <div
                    key={notification._id}
                    className={`group flex items-center justify-between py-2 px-3 hover:bg-gray-50/80 transition-colors cursor-pointer last:rounded-b-xl ${!notification.read ? 'bg-[#f0f9f4]' : 'bg-white'
                      }`}
                    onClick={() => {
                      if (!notification.read) {
                        markAsRead(notification._id);
                      }
                      setSelectedNotification(notification);
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 min-w-0 flex-1 pl-2">
                        <span className={`shrink-0 w-36 text-[14px] truncate ${!notification.read ? 'text-gray-900 font-bold' : 'text-gray-700 font-medium'
                          }`}>
                          {sender}
                        </span>

                        <div className="flex items-center gap-2 min-w-0 flex-1 text-[13.5px]">
                          <span className={`truncate ${!notification.read ? 'text-[#1a2f24] font-medium' : 'text-gray-500'}`}>
                            {notification.title} <span className="text-gray-400 font-normal">− {notification.message}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 sm:gap-4 shrink-0 ml-4">
                      <span className="hidden md:inline-flex px-2.5 py-0.5 bg-[#f4f4f4] text-gray-500 text-[11px] font-medium rounded-full tracking-wide">
                        {category}
                      </span>
                      <span className={`text-[12px] whitespace-nowrap text-right w-[70px] ${!notification.read ? 'text-[#1a2f24] font-medium' : 'text-gray-400'}`}>
                        {formatTimeStr(notification.createdAt)}
                      </span>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                        {/* Mark as Read Button */}
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification._id);
                            }}
                            className="p-1.5 text-gray-400 hover:text-[#0d3b2e] hover:bg-[#0d3b2e]/10 rounded-full transition-colors"
                            title="Mark as read"
                          >
                            <MailOpen className="w-4 h-4" />
                          </button>
                        )}

                        {/* Delete Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification._id);
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete notification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Full Notification Modal */}
      {selectedNotification && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all animate-in fade-in"
          onClick={() => setSelectedNotification(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-white border border-gray-200 text-gray-600 text-[12px] font-medium rounded-md tracking-wide shadow-sm">
                  {getCategoryFromType(selectedNotification.type, selectedNotification.title)}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {getSenderFromType(selectedNotification.type, selectedNotification.title, selectedNotification.message)}
                </span>
              </div>
              <button
                onClick={() => setSelectedNotification(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <h3 className="text-lg font-bold text-[#1a2f24] mb-2">{selectedNotification.title}</h3>
              <p className="text-[13px] text-gray-500 mb-6">{formatTimeStr(selectedNotification.createdAt)}</p>

              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                {selectedNotification.message}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;