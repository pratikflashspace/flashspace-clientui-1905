import { useEffect, useMemo, useRef, useState } from "react";
import { Check, MailOpen, Trash2 } from "lucide-react";
import { useSpacePortalNotifications } from "@/contexts/SpacePortalNotificationsContext";
import type { SpacePortalNotification } from "@/types/spacePortal/notification";

/**
 * Notifications Page
 *
 * Features:
 * - Show list of notifications
 * - Mark read/unread
 * - Mark all read
 * - Clear all
 * - Delete single notification with undo option (5 seconds)
 *
 * Backend-ready:
 * - Later notifications will be fetched from API and actions will call backend.
 */
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

  /**
   * Undo state stores deleted notification + original index.
   * So we can restore it back to same position.
   */
  const [undoItem, setUndoItem] = useState<{
    notification: (typeof notifications)[number];
    index: number;
  } | null>(null);

  /**
   * Timeout ref for undo auto-clear after 5 seconds.
   */
  const undoTimeoutRef = useRef<number | null>(null);

  /**
   * Count unread notifications (memoized for better performance)
   */
  const unreadCount = useMemo(() => {
    return notifications.filter((item) => !item.read).length;
  }, [notifications]);

  /**
   * When undoItem changes, start a timer.
   * After 5 seconds, undo option disappears.
   */
  useEffect(() => {
    // Clear old timeout always
    if (undoTimeoutRef.current) {
      window.clearTimeout(undoTimeoutRef.current);
      undoTimeoutRef.current = null;
    }

    // If no undo item, nothing to do
    if (!undoItem) return;

    undoTimeoutRef.current = window.setTimeout(() => {
      setUndoItem(null);
    }, 5000);

    return () => {
      if (undoTimeoutRef.current) {
        window.clearTimeout(undoTimeoutRef.current);
        undoTimeoutRef.current = null;
      }
    };
  }, [undoItem]);

  /**
   * Delete a notification and store it for undo.
   */
  const handleDelete = (id: string) => {
    const index = notifications.findIndex((item) => item.id === id);
    const notification = notifications[index];

    if (!notification) return;

    deleteNotification(id);
    setUndoItem({ notification, index });
  };

  /**
   * Restore deleted notification (undo delete)
   */
  const handleUndo = () => {
    if (!undoItem) return;

    restoreNotification(undoItem.notification, undoItem.index);
    setUndoItem(null);
  };

  return (
    <div className="flex-1">
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            {unreadCount} unread{" "}
            {unreadCount === 1 ? "notification" : "notifications"}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <ActionButton
              onClick={markAllRead}
              disabled={notifications.length === 0 || unreadCount === 0}
            >
              Mark all as read
            </ActionButton>

            <ActionButton
              onClick={clearNotifications}
              disabled={notifications.length === 0}
            >
              Clear all
            </ActionButton>
          </div>
        </div>

        {/* Undo Banner */}
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

        {/* Empty State */}
        {notifications.length === 0 ? (
          <p className="mt-6 text-center text-slate-500">
            No notifications yet.
          </p>
        ) : (
          <ul className="mt-6 space-y-4">
            {notifications.map((item) => (
              <NotificationItem
                key={item.id}
                item={item}
                onMarkRead={() => markRead(item.id)}
                onMarkUnread={() => markUnread(item.id)}
                onDelete={() => handleDelete(item.id)}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/**
 * Single Notification UI Block
 * Extracted to avoid repeating code inside map().
 */
function NotificationItem({
  item,
  onMarkRead,
  onMarkUnread,
  onDelete,
}: {
  item: SpacePortalNotification;
  onMarkRead: () => void;
  onMarkUnread: () => void;
  onDelete: () => void;
}) {
  const isRead = item.read ?? false;
  const description = item.description?.trim();

  return (
    <li
      className={`rounded-xl border border-slate-100 px-4 py-3 ${
        isRead ? "bg-white" : "bg-emerald-50/50"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Left side (text) */}
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-slate-900">{item.title}</p>

            {!isRead ? (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                Unread
              </span>
            ) : null}
          </div>

          {description ? (
            <p className="text-sm text-slate-500">{description}</p>
          ) : null}

          {item.time ? (
            <p className="mt-1 text-xs text-slate-400">{item.time}</p>
          ) : null}
        </div>

        {/* Right side (actions) */}
        <div className="flex items-center gap-2">
          {isRead ? (
            <ActionButton onClick={onMarkUnread}>
              <MailOpen size={14} />
              Mark unread
            </ActionButton>
          ) : (
            <ActionButton onClick={onMarkRead}>
              <Check size={14} />
              Mark read
            </ActionButton>
          )}

          <ActionButton
            onClick={onDelete}
            className="hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={14} />
            Delete
          </ActionButton>
        </div>
      </div>
    </li>
  );
}

/**
 * Reusable button component for notification actions.
 * Keeps UI consistent and removes duplicate Tailwind classes.
 */
function ActionButton({
  children,
  onClick,
  disabled,
  className = "",
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}
