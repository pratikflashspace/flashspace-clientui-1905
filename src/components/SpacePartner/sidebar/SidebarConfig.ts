import {
  LayoutDashboard,
  BarChart3,
  CalendarDays,
  ClipboardCheck,
  Users,
  MessageSquareText,
  CreditCard,
  Ticket,
  Building2,
  Star,
  Mail,
  UserPlus,
  User,
  ShieldCheck,
  Activity,
  Bell,
} from "lucide-react";

export const sidebarConfig = [
  {
    label: "Dashboard",
    path: "/spaceportal/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "KYC Compliance",
    path: "/spaceportal/kyc-verification",
    icon: ShieldCheck,
  },
  {
    label: "Track Progress",
    path: "/spaceportal/track-progress",
    icon: Activity,
  },
  {
    label: "Booking Analytics",
    path: "/spaceportal/booking-analytics",
    icon: BarChart3,
  },
  {
    label: "My Spaces",
    path: "/spaceportal/space-management",
    icon: Building2,
  },

  {
    label: "Booking Requests",
    path: "/spaceportal/booking-requests",
    icon: ClipboardCheck,
  },
  {
    label: "Clients",
    path: "/spaceportal/clients",
    icon: Users,
  },
  {
    label: "Invoices & Payments",
    path: "/spaceportal/invoices-payments",
    icon: CreditCard,
  },
  {
    label: "Tickets",
    path: "/spaceportal/tickets",
    icon: MessageSquareText,
  },
  {
    label: "Notifications",
    path: "/spaceportal/notifications",
    icon: Bell,
  },
  {
    label: "Feedback & NPS",
    path: "/spaceportal/feedback-nps",
    icon: Star,
  },
  {
    label: "Mail & Visits",
    path: "/spaceportal/mail-visits",
    icon: Mail,
  },
  {
    label: "Team Members",
    path: "/spaceportal/team-management",
    icon: UserPlus,
  },
  {
    label: "Profile",
    path: "/spaceportal/profile",
    icon: User,
  },
];
