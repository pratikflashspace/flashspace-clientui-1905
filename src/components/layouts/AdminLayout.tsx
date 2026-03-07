import React, { useState } from "react";
import { Outlet, Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Users,
  Building2,
  FileCheck,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  BookOpen,
  Briefcase,
  Shield,
  ChevronLeft,
  ChevronRight,
  Home,
  LineChart,
  Target,
  Ticket,
  Tag,
  Headphones,
  Trophy,
  Network,
  AlertTriangle,
} from "lucide-react";
import { adminService } from "@/services/admin.service";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingKycCount, setPendingKycCount] = useState(0);

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  React.useEffect(() => {
    const fetchPendingKyc = async () => {
      try {
        const response = await adminService.getPendingKYC();
        if (response.success && response.data) {
          const uniqueRequests = response.data.filter(
            (req: any, index: number, self: any[]) =>
              index === self.findIndex((r) => r._id === req._id),
          );
          const pendingCount = uniqueRequests.filter(
            (req: any) => req.overallStatus === "pending",
          ).length;
          setPendingKycCount(pendingCount);
        }
      } catch (error) {
        console.error("Failed to fetch pending KYC", error);
      }
    };

    if (user?.role && ["admin", "super_admin", "partner"].includes(user.role)) {
      fetchPendingKyc();
    }

    const handleKycUpdate = () => {
      if (
        user?.role &&
        ["admin", "super_admin", "partner"].includes(user.role)
      ) {
        fetchPendingKyc();
      }
    };

    window.addEventListener("kycUpdated", handleKycUpdate);
    return () => window.removeEventListener("kycUpdated", handleKycUpdate);
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const allNavItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/admin",
      roles: [
        "admin",
        "super_admin",
        "partner",
        "space_partner_manager",
        "sales",
        "support",
        "affiliate_manager",
      ],
    },
    {
      icon: LineChart,
      label: "Booking Analysis",
      path: "/admin/booking-analysis",
      roles: [
        "admin",
        "super_admin",
        "sales",
        "partner",
        "space_partner_manager",
      ],
    },
    {
      icon: Target,
      label: "Lead Management",
      path: "/admin/leads",
      roles: ["admin", "super_admin", "sales"],
    },
    {
      icon: Headphones,
      label: "Support Chats",
      path: "/admin/support",
      roles: ["admin", "super_admin", "support"],
    },
    {
      icon: Bell,
      label: "Notifications",
      path: "/admin/notifications",
      roles: [
        "admin",
        "super_admin",
        "sales",
        "support",
        "affiliate_manager",
        "space_partner_manager",
        "partner",
      ],
    },
    {
      icon: Trophy,
      label: "Leaderboard",
      path: "/admin/leaderboard",
      roles: ["admin", "super_admin", "sales", "support"],
    },
    {
      icon: Ticket,
      label: "Ticket System",
      path: "/admin/tickets",
      roles: ["admin", "super_admin", "support"],
    },
    {
      icon: BookOpen,
      label: "Learning Hub",
      path: "/admin/learning-hub",
      roles: ["admin", "super_admin", "sales", "support", "partner"],
    },
    {
      icon: Briefcase,
      label: "Clients",
      path: "/admin/clients",
      roles: ["admin", "super_admin", "sales", "support"],
    },
    {
      icon: Network,
      label: "Affiliate Management",
      path: "/admin/affiliates",
      roles: ["admin", "super_admin", "affiliate_manager"],
    },
    {
      icon: CreditCard,
      label: "Payment Invoices",
      path: "/admin/invoices",
      roles: ["admin", "super_admin", "sales", "partner"],
    },
    {
      icon: Tag,
      label: "Coupons & Vouchers",
      path: "/admin/coupons",
      roles: ["admin", "super_admin", "sales"],
    },
    {
      icon: Users,
      label: "User Management",
      path: "/admin/users",
      roles: ["admin", "super_admin"],
    },
    {
      icon: FileCheck,
      label: "KYC Verification",
      path: "/admin/kyc-requests",
      roles: ["admin", "super_admin", "partner"],
    },
    {
      icon: Building2,
      label: "Space Management",
      path: "/admin/spaces",
      roles: ["admin", "super_admin", "partner", "space_partner_manager"],
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/admin/settings",
      roles: [
        "admin",
        "super_admin",
        "partner",
        "space_partner_manager",
        "sales",
        "support",
        "affiliate_manager",
      ],
    },
  ];

  const navItems = allNavItems.filter(
    (item) => user?.role && item.roles.includes(user.role),
  );

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-50 flex items-center justify-between px-4">
        <Link to="/" className="flex items-baseline">
          <span className="text-xl font-extrabold tracking-tight text-foreground">flash</span>
          <span className="text-lg font-extrabold tracking-tight text-primary italic">space</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-full bg-background border-r border-border z-50 transition-all duration-300",
        collapsed ? "w-20" : "w-72",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-border">
            <Link to="/" className="flex items-baseline mb-4">
              <span className={cn(
                "font-extrabold tracking-tight text-foreground transition-all",
                collapsed ? "text-xl" : "text-2xl"
              )}>
                {collapsed ? "f" : "flash"}
              </span>
              {!collapsed && (
                <span className="text-xl font-extrabold tracking-tight text-primary italic">space</span>
              )}
            </Link>
            {!collapsed && (
              <div>
                <h2 className="font-bold text-foreground text-sm">FlashSpace Admin</h2>
                <p className="text-xs text-muted-foreground mt-1">Complete platform management</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-4">
            <nav className="px-3 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/admin"}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}

                  {item.label === "KYC Verification" && pendingKycCount > 0 && (
                    <span
                      className={cn(
                        "ml-auto flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 border border-red-200",
                        collapsed && "absolute right-2 top-2"
                      )}
                    >
                      {pendingKycCount}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </ScrollArea>

          {/* Collapse Toggle */}
          <div className="p-4 border-t border-border hidden lg:block">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-center"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  <span>Collapse</span>
                </>
              )}
            </Button>
          </div>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-border space-y-2">
            <Button
              variant="outline"
              size="sm"
              className={cn("w-full justify-start", collapsed && "justify-center px-2")}
              onClick={() => navigate("/dashboard")}
            >
              <LayoutDashboard className="w-4 h-4" />
              {!collapsed && <span className="ml-2">User Dashboard</span>}
            </Button>

            <Link to="/">
              <Button variant="ghost" size="sm" className={cn("w-full justify-start", collapsed && "justify-center px-2")}>
                <Home className="w-4 h-4" />
                {!collapsed && <span className="ml-2">Back to Home</span>}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              className={cn("w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50", collapsed && "justify-center px-2")}
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              {!collapsed && <span className="ml-2">Logout</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "transition-all duration-300 pt-16 lg:pt-0 min-h-screen flex flex-col",
        collapsed ? "lg:ml-20" : "lg:ml-72"
      )}>
        <div className="p-6 lg:p-8 flex-1">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
