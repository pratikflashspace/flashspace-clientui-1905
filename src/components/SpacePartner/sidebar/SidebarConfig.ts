import {
  LayoutDashboard,
  BarChart3,
  CalendarDays,
  FileText,
  Users,
  MessageSquareText,
  CreditCard,
  Ticket,
  Building2,
  Star,
  Mail,
  UserPlus,
  Settings,
  ShieldCheck,
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
    label: "Booking Calendar",
    path: "/spaceportal/booking-calendar",
    icon: CalendarDays,
  },
  {
    label: "Active Requests",
    path: "/spaceportal/active-requests",
    icon: FileText,
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
    label: "Client Enquiries",
    path: "/spaceportal/client-enquiries",
    icon: MessageSquareText,
  },
  {
    label: "Feedback & NPS",
    path: "/spaceportal/feedback-nps",
    icon: Star,
  },
  {
    label: "Tickets & Tasks",
    path: "/spaceportal/tasks",
    icon: Ticket,
  },
  {
    label: "Ticket System",
    path: "/spaceportal/tickets",
    icon: Ticket,
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
    icon: Settings,
  },
];
