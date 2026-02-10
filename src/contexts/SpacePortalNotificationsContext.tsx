import { createContext, useContext } from "react";
import type { SpacePortalNotification } from "@/types/spacePortal/notification";

type SpacePortalNotificationsContextValue = {
  notifications: SpacePortalNotification[];
  markAllRead: () => void;
  markRead: (id: string) => void;
  markUnread: (id: string) => void;
  deleteNotification: (id: string) => void;
  restoreNotification: (notification: SpacePortalNotification, index?: number) => void;
  clearNotifications: () => void;
  addNotification: (notification: SpacePortalNotification) => void;
};

const SpacePortalNotificationsContext =
  createContext<SpacePortalNotificationsContextValue | undefined>(undefined);

export const SpacePortalNotificationsProvider =
  SpacePortalNotificationsContext.Provider;

export const useSpacePortalNotifications = () => {
  const context = useContext(SpacePortalNotificationsContext);

  if (!context) {
    throw new Error(
      "useSpacePortalNotifications must be used within SpacePortalNotificationsProvider"
    );
  }

  return context;
};
