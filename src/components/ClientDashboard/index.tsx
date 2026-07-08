import {
  LayoutDashboard,
  Calendar,
  CreditCard,
  ShieldCheck,
  Building2,
  ChevronRight,
  ChevronLeft,
  Mail,
  Users,
  FileText,
  CalendarCheck,
  MessageSquare,
  HelpCircle,
  Home,
  Menu,
  X,
  Loader2,
  Key,
} from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useEffect, useState, useMemo, Suspense } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";

import { useLocation, useNavigate } from "react-router-dom";

// Lazy load all page components to prevent iOS WebKit from exceeding
// the call stack during synchronous module evaluation.
const Dashboard = React.lazy(() => import("./Dashboard"));
const MyBookings = React.lazy(() => import("./MyBookings"));
const Billing = React.lazy(() => import("./Billing"));
const Support = React.lazy(() => import("./Support"));
const Logout = React.lazy(() => import("./Logout"));
const Profile = React.lazy(() => import("./Profile"));
const Viewdetails = React.lazy(() => import("./Viewdetails"));
const Notifications = React.lazy(() => import("./Notifications"));
const ChatSupport = React.lazy(() => import("./ChatSupport"));
const Documents = React.lazy(() => import("./Documents"));
const MailRecords = React.lazy(() => import("./MailRecords"));
const VisitRecords = React.lazy(() => import("./VisitRecords"));
const ApiKeys = React.lazy(() => import("./ApiKeys"));

const LazyFallback = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <Loader2 className="w-8 h-8 text-[#35503F] animate-spin" />
  </div>
);

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, section: "main", path: "/dashboard" },
  { name: "My Bookings", icon: Calendar, section: "main", path: "/dashboard/my-bookings" },
  { name: "Mail Records", icon: Mail, section: "main", path: "/dashboard/mail-records" },
  { name: "Visit Records", icon: CalendarCheck, section: "main", path: "/dashboard/visit-records" },
  { name: "Payments", icon: CreditCard, section: "main", path: "/dashboard/payments" },
  { name: "Documents", icon: FileText, section: "main", path: "/dashboard/documents" },
  { name: "Ticket and Support", icon: MessageSquare, section: "main", path: "/dashboard/support" },
  { name: "Help Center", icon: HelpCircle, section: "main", path: "/dashboard/help" },
  { name: "API Keys", icon: Key, section: "main", path: "/dashboard/mcp-keys" },
];

export default function ClientDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active index based on current URL path
  const activeIndex = useMemo(() => {
    const path = location.pathname;
    const index = menuItems.findIndex((item) => item.path === path);
    // Handle /dashboard/viewdetails separately
    if (path === "/dashboard/viewdetails") return 100;
    return index >= 0 ? index : 0;
  }, [location.pathname]);

  const handleNavigation = (index: number) => {
    const item = menuItems[index];
    if (item?.path) {
      navigate(item.path);
    }
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const openDrawer = () => setIsProfileDrawerOpen(true);
    window.addEventListener("client-profile-drawer:open", openDrawer);
    return () => window.removeEventListener("client-profile-drawer:open", openDrawer);
  }, []);

  // Memoize the main content to prevent re-renders on scroll
  const mainContent = useMemo(() => {
    switch (location.pathname) {
      case "/dashboard":
        return <Dashboard />;
      case "/dashboard/my-bookings":
        return <MyBookings />;
      case "/dashboard/mail-records":
        return <MailRecords />;
      case "/dashboard/visit-records":
        return <VisitRecords />;
      case "/dashboard/payments":
        return <Billing />; // Using Billing component for Payments for now
      case "/dashboard/documents":
        return <Documents />;
      case "/dashboard/support":
        return <ChatSupport />;
      case "/dashboard/notifications":
        return <Notifications />;
      case "/dashboard/help":
        return <Support />;
      case "/dashboard/mcp-keys":
        return <ApiKeys />;
      case "/dashboard/profile":
        return <Profile />;
      case "/dashboard/logout":
        return <Logout />;
      case "/dashboard/viewdetails":
        return <Viewdetails />;
      default:
        return <Dashboard />;
    }
  }, [location.pathname]);

  const mainMenuItems = menuItems; // All menu items in single list now

  return (
    <div className="client-dashboard-portal min-h-screen bg-gray-50">

      <div className="flex h-screen overflow-hidden relative">
        {/* Mobile Sidebar Overlay Backdrop */}
        {isMobileMenuOpen && (
          <div
            className="xl:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
                <aside
                  className={cn(
            "fixed top-0 left-0 z-50 h-[100dvh] bg-[#f8f8f8] shadow-xl border-r border-[#edede6] flex flex-col transition-all duration-300 ease-in-out",
            "w-72",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
            "xl:relative xl:translate-x-0 xl:shadow-none xl:h-full overflow-hidden",
            isSidebarCollapsed ? "xl:w-20" : "xl:w-72"
          )}
          data-lenis-prevent
        >
          {/* Header branding */}
          <div className={`flex flex-col shrink-0 transition-all duration-300 ${isSidebarCollapsed ? "p-4 items-center" : "w-[287px] h-[128px] px-[24px] pt-[22px] pb-[20px]"}`}>
              <div className={`flex items-center w-full ${isSidebarCollapsed ? "justify-center" : "justify-between"}`}>
                  <img
                      src="https://cdn.prod.website-files.com/664330484432dcdd6519a8fd/665dd8e0007de68a44f3750b_Black%20and%20White%20Bold%20Typography%20Clothing%20Brand%20Logo%20(940%20x%20400%20px)%20(940%20x%20200%20px)%20(940%20x%20150%20px).png"
                      alt="FlashSpace Logo"
                      onClick={() => navigate("/")}
                      className={`w-auto object-contain transition-all duration-300 ml-[-12px] cursor-pointer ${isSidebarCollapsed ? "h-7" : "h-9"}`}
                  />
                  <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="xl:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                      <X size={24} />
                  </button>
              </div>

              <div className={`mt-3 overflow-hidden transition-all duration-300 flex flex-col gap-1 ${isSidebarCollapsed ? "h-0 opacity-0" : "h-auto opacity-100"}`}>
                  <h2 className="w-[239px] h-[20px] text-[14px] font-bold text-[#1a2d1d] whitespace-nowrap leading-none flex items-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Customer Portal
                  </h2>
                  <p className="w-[239px] h-[16px] text-[12px] text-[#64748b] whitespace-nowrap font-medium leading-none flex items-center">
                      Manage your workspace subscriptions
                  </p>
              </div>
          </div>

          {/* Navigation Menu */}
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-4 space-y-1.5 pb-2" data-lenis-prevent>
              {mainMenuItems.map((item, idx) => {
                  const isActive = activeIndex === idx;

                  return (
                      <button
                          key={item.name}
                          onClick={() => handleNavigation(idx)}
                          title={isSidebarCollapsed ? item.name : ""}
                          className={`
            flex items-center transition-all duration-300 rounded-lg group relative
            ${isSidebarCollapsed ? "justify-center w-12 h-12 mx-auto" : "justify-start w-[263px] h-[40px] px-[12px] gap-4 mx-auto"}
            ${isActive
                                  ? "bg-[#334d3d] text-[#FEF8C3] shadow-sm"
                                  : "text-[#677e73] hover:bg-gray-50 hover:text-[#1a2d1d]"
                              }
          `}
                      >
                          <item.icon
                              size={isSidebarCollapsed ? 24 : 22}
                              strokeWidth={isActive ? 2.5 : 2}
                              className="shrink-0"
                          />
                          <span
                              className={`text-[14px] font-semibold whitespace-nowrap transition-all duration-200 ${isSidebarCollapsed ? "w-0 opacity-0 overflow-hidden absolute" : "w-auto opacity-100 static"}`}
                          >
                              {item.name}
                          </span>
                      </button>
                  );
              })}
          </div>

          {/* Footer and Bottom Actions */}
          <div className="px-5 py-3 pb-8 xl:pb-3 border-t border-gray-100 space-y-2 bg-[#f8f9fa]/30 shrink-0">
              <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className={`
        hidden xl:flex items-center transition-colors text-[#677e73] hover:text-[#1a2d1d] py-1 mx-auto
        ${isSidebarCollapsed ? "justify-center w-full" : "justify-start gap-4 w-[263px] h-9 px-[12px]"}
      `}
              >
                  {isSidebarCollapsed ? (
                      <ChevronRight size={22} />
                  ) : (
                      <>
                          <ChevronLeft size={20} />
                          <span className="text-[15px] font-bold">Collapse</span>
                      </>
                  )}
              </button>

        {user?.role && ['super_admin', 'admin', 'sales', 'support', 'affiliate_manager', 'space_partner_manager'].includes(user.role) && (
          <button
            onClick={() => navigate('/admin')}
            className={`
              flex items-center rounded-lg shadow-sm font-bold transition-all border border-gray-200 text-purple-700 bg-white hover:bg-gray-50 hover:shadow-md mx-auto
              ${isSidebarCollapsed ? "justify-center w-full h-14" : "justify-start gap-4 w-[263px] h-[40px] px-[12px] text-[14px]"}
            `}
            title={isSidebarCollapsed ? "Admin Portal" : ""}
          >
            <ShieldCheck size={20} className="shrink-0" />
            {!isSidebarCollapsed && <span className="whitespace-nowrap">Admin Portal</span>}
          </button>
        )}

        {user?.role === 'partner' && (
          <button
            onClick={() => navigate('/spaceportal')}
            className={`
              flex items-center rounded-lg shadow-sm font-bold transition-all border border-gray-200 text-orange-700 bg-white hover:bg-gray-50 hover:shadow-md mx-auto
              ${isSidebarCollapsed ? "justify-center w-full h-14" : "justify-start gap-4 w-[263px] h-[40px] px-[12px] text-[14px]"}
            `}
            title={isSidebarCollapsed ? "Partner Portal" : ""}
          >
            <Building2 size={20} className="shrink-0" />
            {!isSidebarCollapsed && <span className="whitespace-nowrap">Partner Portal</span>}
          </button>
        )}

        {user?.role === 'affiliate' && (
          <button
            onClick={() => navigate('/affiliate-portal')}
            className={`
              flex items-center rounded-lg shadow-sm font-bold transition-all border border-gray-200 text-cyan-700 bg-white hover:bg-gray-50 hover:shadow-md mx-auto
              ${isSidebarCollapsed ? "justify-center w-full h-14" : "justify-start gap-4 w-[263px] h-[40px] px-[12px] text-[14px]"}
            `}
            title={isSidebarCollapsed ? "Affiliate Portal" : ""}
          >
            <Users size={20} className="shrink-0" />
            {!isSidebarCollapsed && <span className="whitespace-nowrap">Affiliate Portal</span>}
          </button>
        )}

              <button
                  onClick={() => navigate("/")}
                  className={`
        flex items-center rounded-lg shadow-sm font-bold transition-all border border-gray-200 text-[#677e73] bg-white hover:bg-gray-50 hover:shadow-md mx-auto
        ${isSidebarCollapsed ? "justify-center w-full h-14" : "justify-start gap-4 w-[263px] h-[40px] px-[12px] text-[14px]"}
      `}
              >
                  <Home size={20} className="shrink-0" />
                  {!isSidebarCollapsed && (
                      <span className="whitespace-nowrap">Back to Home</span>
                  )}
              </button>
          </div>
        </aside>


        {/* Main Content */}
        <main
          className={cn(
            "relative flex-1 min-w-0 h-full overflow-x-hidden overflow-y-auto touch-pan-y scroll-smooth flex flex-col transition-all duration-300"
          )}
          data-lenis-prevent
        >
          {/* Mobile Top Bar (Only visible when sidebar needs toggle) */}
          <header className="xl:hidden h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 flex items-center justify-between px-4 shrink-0">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-0.5 ml-[-6px]">
                <img
                    src="https://cdn.prod.website-files.com/664330484432dcdd6519a8fd/665dd8e0007de68a44f3750b_Black%20and%20White%20Bold%20Typography%20Clothing%20Brand%20Logo%20(940%20x%20400%20px)%20(940%20x%20200%20px)%20(940%20x%20150%20px).png"
                    alt="FlashSpace Logo"
                    className="h-8 w-auto object-contain cursor-pointer"
                    onClick={() => navigate("/")}
                />
              </div>
              <p className="ml-2 text-[10px] text-gray-400 mt-0.5 font-bold uppercase tracking-widest leading-none">
                {menuItems[activeIndex]?.name || "Dashboard"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </header>

          <div className="flex-1 p-0">
            <ErrorBoundary>
              <Suspense fallback={<LazyFallback />}>
                {mainContent}
              </Suspense>
            </ErrorBoundary>
          </div>
        </main>

        {isProfileDrawerOpen && (
          <div className="fixed inset-0 z-[70]">
            <button
              type="button"
              className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
              onClick={() => setIsProfileDrawerOpen(false)}
              aria-label="Close profile drawer"
            />
            <aside className="absolute inset-y-0 right-0 w-full md:w-[72vw] max-w-[920px] overflow-hidden bg-gray-50 shadow-2xl animate-in slide-in-from-right duration-300">
              <div className="absolute inset-x-0 top-0 z-20 flex h-[130px] items-start justify-between bg-[#36503F] px-7 py-8 shadow-sm">
                <div>
                  <h2 style={{ fontFamily: "'Inter', sans-serif" }} className="text-3xl font-extrabold tracking-tight text-white">
                    Profile & <span className="italic text-[#FEF8C3]">KYC</span>
                  </h2>
                  <p className="mt-2 text-base font-semibold text-[#FEF8C3]/85">
                    Manage your identity verification and profile details.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsProfileDrawerOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Close profile drawer"
                >
                  <X className="h-7 w-7" />
                </button>
              </div>
              <div className="h-full overflow-y-auto pt-[130px]">
                <Suspense fallback={<LazyFallback />}>
                  <Profile isCompact drawerMode />
                </Suspense>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
