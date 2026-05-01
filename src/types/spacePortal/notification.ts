export type SpacePortalNotification = {
  _id?: string; // MongoDB _id — used for API calls (mark-read, delete)
  id: string;
  title: string;
  description?: string;
  time?: string;
  read?: boolean;
  archived?: boolean;
  href?: string;
  metadata?: Record<string, unknown>;
  isNew?: boolean;
  createdAt?: string;
};
