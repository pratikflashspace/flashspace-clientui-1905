import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Ticket,
  BookOpen,
  Trophy,
  Target,
  Headphones,
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
    label: "Support Chats",
    href: "/admin/support",
    icon: <Headphones className="w-5 h-5" />,
  },
  {
    label: "Learning Hub",
    href: "/admin/learning-hub",
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    label: "Leaderboard",
    href: "/admin/leaderboard",
    icon: <Trophy className="w-5 h-5" />,
  },
  {
    label: "Revenue Dashboard",
    href: "/admin/revenue",
    icon: <Wallet className="w-5 h-5" />,
  },
  {
    label: "Invoices",
    href: "/admin/invoices",
    icon: <Receipt className="w-5 h-5" />,
  },
  {
    label: "Partner Invoices",
    href: "/admin/partner-invoices",
    icon: <Receipt className="w-5 h-5" />,
  },
  {
    label: "Receivable/Payable",
    href: "/admin/finance",
    icon: <Calculator className="w-5 h-5" />,
  },
  {
    label: "Balance Sheet",
    href: "/admin/balance",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    label: "Notifications",
    href: "/admin/notifications",
    icon: <Bell className="w-5 h-5" />,
  },
  {
    label: "Affiliate Management",
    href: "/admin/affiliates",
    icon: <Network className="w-5 h-5" />,
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
];
