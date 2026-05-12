import { useState, useRef, useEffect } from "react";
import { Bell, X, CheckCircle2, Mail, UserCircle2, Info, ExternalLink, Trash2 } from "lucide-react";
import { useSpacePortalNotifications } from "@/contexts/SpacePortalNotificationsContext";
import { Link } from "react-router-dom";

export function PartnerNotificationBell() {
  const { notifications, unreadCount, markRead, deleteNotification, navigateToNotification } = useSpacePortalNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const recentNotifications = notifications
    .filter(n => !n.archived)
    .slice(0, 5);

  const getIcon = (title: string, description: string) => {
    const text = `${title} ${description}`.toLowerCase();
    if (text.includes("payment") || text.includes("invoice")) return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    if (text.includes("mail") || text.includes("parcel")) return <Mail className="w-4 h-4 text-emerald-500" />;
    if (text.includes("visitor") || text.includes("visit")) return <UserCircle2 className="w-4 h-4 text-[#35503F]" />;
    return <Info className="w-4 h-4 text-[#35503F]" />;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-white border border-gray-100 shadow-sm hover:bg-gray-50 transition-all group"
      >
        <Bell className="w-5 h-5 text-gray-600 group-hover:text-[#35503F] transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-red-600 text-white text-[11px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-in zoom-in duration-300">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
            <h3 className="font-bold text-[#35503F]">Notifications</h3>
            <Link 
              to="/spaceportal/notifications" 
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-primary hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {recentNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No recent notifications</p>
              </div>
            ) : (
              recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => {
                    navigateToNotification?.(notification);
                    setIsOpen(false);
                  }}
                  className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer relative group ${!notification.read ? 'bg-primary/5' : ''}`}
                >
                  <div className="flex gap-3">
                    <div className="mt-1">
                      {getIcon(notification.title || "", notification.description || "")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{notification.title}</p>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{notification.description}</p>
                      <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">
                        {notification.createdAt ? new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {recentNotifications.length > 0 && (
            <Link
              to="/spaceportal/notifications"
              onClick={() => setIsOpen(false)}
              className="block p-3 text-center text-xs font-bold text-gray-500 hover:bg-gray-50 border-t border-gray-50 transition-colors"
            >
              See all notifications
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
