import { useEffect, useRef, useState } from "react";
import { Check, MailOpen, Trash2 } from "lucide-react";
import { useSpacePortalNotifications } from "@/contexts/SpacePortalNotificationsContext";

export default function Notifications() {
  const {
    notifications,
    markAllRead,
    markRead,
    markUnread,
    deleteNotification,
    restoreNotification,
    clearNotifications,
  } = useSpacePortalNotifications();
  const [undoItem, setUndoItem] = useState<{
    notification: (typeof notifications)[number];
    index: number;
  } | null>(null);
  const undoTimeoutRef = useRef<number | null>(null);

  const unreadCount = notifications.filter((item) => !item.read).length;

  useEffect(() => {
    if (!undoItem) {
      return;
    }

    if (undoTimeoutRef.current) {
      window.clearTimeout(undoTimeoutRef.current);
    }

    undoTimeoutRef.current = window.setTimeout(() => {
      setUndoItem(null);
    }, 5000);

    return () => {
      if (undoTimeoutRef.current) {
        window.clearTimeout(undoTimeoutRef.current);
      }
    };
  }, [undoItem]);

  const handleDelete = (id: string) => {
    const index = notifications.findIndex((item) => item.id === id);
    const notification = notifications[index];
    if (!notification) {
      return;
    }
    deleteNotification(id);
    setUndoItem({ notification, index });
  };

  const handleUndo = () => {
    if (!undoItem) {
      return;
    }
    restoreNotification(undoItem.notification, undoItem.index);
    setUndoItem(null);
  };

  return (
    <div className="flex-1">
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            {unreadCount} unread {unreadCount === 1 ? "notification" : "notifications"}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={markAllRead}
              disabled={notifications.length === 0 || unreadCount === 0}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Mark all as read
            </button>
            <button
              type="button"
              onClick={clearNotifications}
              disabled={notifications.length === 0}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear all
            </button>
          </div>
        </div>

        {undoItem ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <span>Notification deleted.</span>
            <button
              type="button"
              onClick={handleUndo}
              className="rounded-lg border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-900 hover:bg-amber-100"
            >
              Undo
            </button>
          </div>
        ) : null}

        {notifications.length === 0 ? (
          <p className="text-center text-slate-500">No notifications yet.</p>
        ) : (
          <ul className="mt-6 space-y-4">
            {notifications.map((item) => (
              <li
                key={item.id}
                className={`rounded-xl border border-slate-100 px-4 py-3 ${
                  item.read ? "bg-white" : "bg-emerald-50/50"
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900">
                        {item.title}
                      </p>
                      {!item.read ? (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                          Unread
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm text-slate-500">
                      {item.description}
                    </p>
                    {item.time ? (
                      <p className="mt-1 text-xs text-slate-400">
                        {item.time}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-2">
                    {item.read ? (
                      <button
                        type="button"
                        onClick={() => markUnread(item.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                      >
                        <MailOpen size={14} />
                        Mark unread
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => markRead(item.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                      >
                        <Check size={14} />
                        Mark read
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
