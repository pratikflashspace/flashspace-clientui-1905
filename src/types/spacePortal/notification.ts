export type SpacePortalNotification = {
  _id?: string; // MongoDB _id — used for API calls (mark-read, delete)
  id: string;
  title: string;
  description?: string;
  time?: string;
  read?: boolean;
  href?: string;
  isNew?: boolean;
  createdAt?: string;
};
