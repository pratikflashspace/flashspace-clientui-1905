import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Ticket,
  BookOpen,
  Trophy,
  Target,
  Calculator,
  FileText,
  Wallet,
  Receipt,
  Bell,
  Network,
  Tag,
  UserCheck,
  Building2,
  Settings,
  ShieldCheck,
  Handshake,
  Briefcase,
  Activity,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: "Booking Management",
    href: "/admin/sales-analytics",
    icon: <Briefcase className="w-5 h-5" />,
  },
  {
    label: "Track Progress",
    href: "/admin/track-progress",
    icon: <Activity className="w-5 h-5" />,
  },
  {
    label: "Lead Management",
    href: "/admin/leads",
    icon: <Target className="w-5 h-5" />,
  },
  {
    label: "Client Management",
    href: "/admin/clients",
    icon: <Users className="w-5 h-5" />,
  },
  {
    label: "Ticket System",
    href: "/admin/tickets",
    icon: <Ticket className="w-5 h-5" />,
  },
  {
    label: "Partners",
    href: "/admin/partners",
    icon: <Handshake className="w-5 h-5" />,
  },
  {
    label: "Affiliate Management",
    href: "/admin/affiliates",
    icon: <Network className="w-5 h-5" />,
  },
  {
    label: "Payment & Invoices",
    href: "/admin/invoices",
    icon: <Receipt className="w-5 h-5" />,
  },

  {
    label: "Notifications",
    href: "/admin/notifications",
    icon: <Bell className="w-5 h-5" />,
  },
  {
    label: "Coupons & Vouchers",
    href: "/admin/coupons",
    icon: <Tag className="w-5 h-5" />,
  },
  {
    label: "User Management",
    href: "/admin/users",
    icon: <UserCheck className="w-5 h-5" />,
  },
  {
    label: "KYC Verification",
    href: "/admin/kyc-requests",
    icon: <ShieldCheck className="w-5 h-5" />,
  },
  {
    label: "GST Management",
    href: "/admin/gst-management",
    icon: <ShieldCheck className="w-5 h-5" />,
  },
  {
    label: "Space Management",
    href: "/admin/spaces",
    icon: <Building2 className="w-5 h-5" />,
  },
  {
    label: "Document Management",
    href: "/admin/documents",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: <Settings className="w-5 h-5" />,
  },
  {
    label: "AI Integrations",
    href: "/admin/ai-integrations",
    icon: <Network className="w-5 h-5" />,
  },
  {
    label: "Post Blog",
    href: "/admin/post-blog",
    icon: <FileText className="w-5 h-5" />,
  },
];
