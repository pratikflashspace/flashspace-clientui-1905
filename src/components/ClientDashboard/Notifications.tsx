commit c4a7964f4898566440fb1e447f354bbac93f94c3
Author: komal <komalmishra2008@gmail.com>
Date:   Fri Feb 20 23:03:32 2026 +0530

    fix(notifications): allow unread filter to work alongside category filters

diff --git a/src/components/ClientDashboard/Notifications.tsx b/src/components/ClientDashboard/Notifications.tsx
index 3354f17..b864956 100644
--- a/src/components/ClientDashboard/Notifications.tsx
+++ b/src/components/ClientDashboard/Notifications.tsx
@@ -22,14 +22,21 @@ import { Button } from "@/components/ui/button";
 const Notifications: React.FC = () => {
   const navigate = useNavigate();
   const { notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications } = useNotifications();
-  const [filter, setFilter] = useState<'all' | 'unread' | NotificationType>('all');
+  const [filter, setFilter] = useState<{ status: 'all' | 'unread'; type: 'all' | NotificationType }>({
+    status: 'all',
+    type: 'all'
+  });
   const [showPreferences, setShowPreferences] = useState(false);
 
   // Filter Logic
   const filteredNotifications = notifications.filter(n => {
-    if (filter === 'all') return true;
-    if (filter === 'unread') return !n.read;
-    return n.type === filter;
+    // 1. Apply status filter
+    if (filter.status === 'unread' && n.read) return false;
+
+    // 2. Apply type filter
+    if (filter.type !== 'all' && n.type !== filter.type) return false;
+
+    return true;
   });
 
   const handleSimulateNotification = () => {
@@ -135,8 +142,8 @@ const Notifications: React.FC = () => {
           <div className="flex flex-col md:flex-row gap-4 justify-between">
             <div className="flex flex-wrap gap-2">
               <button
-                onClick={() => setFilter('all')}
-                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all'
+                onClick={() => setFilter({ status: 'all', type: 'all' })}
+                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter.status === 'all' && filter.type === 'all'
                   ? 'bg-yellow-400 text-black'
                   : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                   }`}
@@ -144,20 +151,23 @@ const Notifications: React.FC = () => {
                 All
               </button>
               <button
-                onClick={() => setFilter('unread')}
-                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'unread'
+                onClick={() => setFilter(prev => ({ ...prev, status: prev.status === 'unread' ? 'all' : 'unread' }))}
+                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter.status === 'unread'
                   ? 'bg-yellow-400 text-black'
                   : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                   }`}
               >
-                Unread
+                Unread Only
               </button>
+
+              <div className="w-px h-8 bg-gray-200 mx-2 self-center hidden sm:block"></div>
+
               {/* Filter by Type */}
               {[NotificationType.MEETING_BOOKED, NotificationType.TICKET_UPDATE].map((type) => (
                 <button
                   key={type}
-                  onClick={() => setFilter(type)}
-                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${filter === type
+                  onClick={() => setFilter(prev => ({ ...prev, type: prev.type === type ? 'all' : type }))}
+                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${filter.type === type
                     ? 'bg-yellow-400 text-black'
                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                     }`}
@@ -187,7 +197,7 @@ const Notifications: React.FC = () => {
             <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
             <h3 className="text-xl font-semibold text-gray-700 mb-2">No notifications</h3>
             <p className="text-gray-500 mb-6">
-              {filter !== 'all' ? 'Try changing your filters' : "You're all caught up!"}
+              {(filter.status !== 'all' || filter.type !== 'all') ? 'Try changing your filters' : "You're all caught up!"}
             </p>
           </div>
         ) : (
