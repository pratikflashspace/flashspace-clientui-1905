import React, { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [pendingKycCount, setPendingKycCount] = useState(0);

  const isDashboardPage = location.pathname.startsWith("/admin");

  React.useEffect(() => {
    const fetchPendingKyc = async () => {
      try {
        const response = await adminService.getPendingKYC();
        if (response.success && response.data) {
          // Deduplicate by _id in case the backend returns duplicate joins
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
      label: "Sales Analytics",
      path: "/admin/sales-analytics",
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

  if (isDashboardPage) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex font-sans text-gray-900">
      {/* Sidebar - Desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-100 transition-all duration-300 ${
          isSidebarOpen ? "w-72" : "w-20"
        } hidden md:flex flex-col shadow-sm`}
      >
        {/* Sidebar Header */}
        <div className="h-auto py-8 px-6 flex flex-col items-start gap-1">
          <div className="flex items-center gap-2 text-xl font-bold tracking-tight text-teal-900 font-sans mb-2">
            {isSidebarOpen ? (
              <span className="text-2xl font-extrabold tracking-tighter text-teal-950">
                flashspace
              </span>
            ) : (
              <span className="text-2xl font-extrabold text-teal-600">f.</span>
            )}
          </div>
          {isSidebarOpen && (
            <>
              <h2 className="text-sm font-bold text-gray-900">
                FlashSpace Admin
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Complete platform management
              </p>
            </>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 min-h-0 w-full overflow-y-auto overscroll-y-contain [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300">
          <nav className="px-4 space-y-2 pb-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "bg-teal-600 text-white shadow-md shadow-teal-200"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium"
                  }`
                }
              >
                <item.icon
                  className={`w-5 h-5 flex-shrink-0 transition-colors ${
                    // Active styles handled by parent class
                    ""
                  }`}
                />
                {isSidebarOpen && (
                  <span className="whitespace-nowrap font-medium text-sm">
                    {item.label}
                  </span>
                )}

                {item.label === "KYC Verification" && pendingKycCount > 0 && (
                  <span
                    className={`ml-auto flex items-center gap-1 text-xs font-bold text-red-500 transition-all duration-200 ${!isSidebarOpen ? "absolute right-2 shadow-md bg-white p-0.5 rounded-full" : ""}`}
                    title={`${pendingKycCount} Pending KYC Requests`}
                  >
                    <AlertTriangle size={14} strokeWidth={2.5} />
                    {isSidebarOpen && "Request"}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 mt-auto border-t border-gray-100 space-y-2">
          <button
            onClick={() => navigate("/dashboard")}
            className={`flex items-center gap-3 px-4 py-2.5 w-full bg-teal-50 rounded-xl text-teal-700 hover:bg-teal-100 transition-colors ${!isSidebarOpen ? "justify-center" : ""}`}
          >
            <LayoutDashboard className="w-5 h-5 text-teal-600" />
            {isSidebarOpen && (
              <span className="font-semibold text-sm">User Dashboard</span>
            )}
          </button>

          <button
            onClick={() => navigate("/")}
            className={`flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-gray-500 hover:bg-gray-50 transition-colors ${!isSidebarOpen ? "justify-center" : ""}`}
          >
            <Home className="w-5 h-5" />
            {isSidebarOpen && (
              <span className="font-medium text-sm">Back to Home</span>
            )}
          </button>

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-gray-400 hover:bg-gray-50 transition-colors ${!isSidebarOpen ? "justify-center" : ""}`}
          >
            <ChevronLeft
              className={`w-5 h-5 transition-transform ${!isSidebarOpen ? "rotate-180" : ""}`}
            />
            {isSidebarOpen && (
              <span className="font-medium text-xs uppercase tracking-wider">
                Collapse
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-teal-900/20 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Sidebar Panel */}
          <aside className="fixed inset-y-0 left-0 w-72 bg-white text-gray-900 flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
            {/* Header */}
            <div className="py-8 px-6 flex flex-col items-start gap-1 border-b border-gray-100">
              <span className="text-2xl font-extrabold tracking-tighter text-teal-950">
                flashspace
              </span>
              <h2 className="text-sm font-bold text-gray-900 mt-2">
                FlashSpace Admin
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Complete platform management
              </p>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Links */}
            <div className="flex-1 min-h-0 w-full overflow-y-auto overscroll-y-contain [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300">
              <nav className="px-4 py-6 space-y-2 pb-8">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    end={item.path === "/admin"}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                        isActive
                          ? "bg-teal-600 text-white shadow-md shadow-teal-200"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium"
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium text-sm">{item.label}</span>
                    {item.label === "KYC Verification" &&
                      pendingKycCount > 0 && (
                        <span
                          className="ml-auto flex items-center gap-1 text-xs font-bold text-red-500"
                          title={`${pendingKycCount} Pending KYC Requests`}
                        >
                          <AlertTriangle size={14} strokeWidth={2.5} />
                          KYC
                        </span>
                      )}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Bottom */}
            <div className="p-4 border-t border-gray-100 space-y-2">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-3 px-4 py-3 w-full bg-teal-50 rounded-xl text-teal-700 hover:bg-teal-100 transition-colors"
              >
                <LayoutDashboard className="w-5 h-5 text-teal-600" />
                <span className="font-semibold text-sm">User Dashboard</span>
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <Home className="w-5 h-5" />
                <span className="font-medium text-sm">Back to Home</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium text-sm">Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isSidebarOpen ? "md:ml-72" : "md:ml-20"
        }`}
      >
        {isDashboardPage ? (
          /* Dashboard pages manage their own header + padding via DashboardLayout */
          <Outlet />
        ) : (
          <>
            {/* Topbar - Simplified to match clean style */}
            <header className="h-20 bg-transparent flex items-center justify-between px-8 md:px-12 pt-6">
              <div className="flex items-center gap-4">
                <button
                  className="md:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                  onClick={() => setIsMobileOpen(true)}
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>
              <div className="flex items-center gap-6" />
            </header>

            {/* Page Content */}
            <main className="flex-1 px-8 md:px-12 py-6">
              <div className="max-w-7xl mx-auto">
                <Outlet />
              </div>
            </main>
          </>
        )}
      </div>
    </div>
  );
}
