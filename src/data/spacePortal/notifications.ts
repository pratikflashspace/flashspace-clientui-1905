import type { SpacePortalNotification } from "@/types/spacePortal/notification";

export const SPACE_PORTAL_NOTIFICATIONS: SpacePortalNotification[] = [
  {
    id: "notif-1",
    title: "New booking request",
    description: "A client requested Cabin 4 in Koramangala.",
    time: "2h ago",
    read: false,
    isNew: true,
    href: "/spaceportal/booking-calendar",
  },
  {
    id: "notif-2",
    title: "Invoice payment received",
    description: "Payment of INR 18,000 received for invoice INV-2031.",
    time: "Yesterday",
    read: true,
    isNew: false,
    href: "/spaceportal/invoices-payments",
  },
  {
    id: "notif-3",
    title: "New client enquiry",
    description: "A new enquiry arrived for a Team Space plan.",
    time: "3h ago",
    read: false,
    isNew: true,
    href: "/spaceportal/client-enquiries",
  },
];
