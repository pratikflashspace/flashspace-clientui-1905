import {
  LayoutDashboard,
  Calendar,
  CreditCard,
  ShieldCheck,
  Building2,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
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
const Subscriptions = React.lazy(() => import("./Subscriptions"));
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
const GSTFiling = React.lazy(() => import("./GSTFiling"));
const GSTRegistration = React.lazy(() => import("./GSTRegistration"));

const LazyFallback = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <Loader2 className="w-8 h-8 text-[#35503F] animate-spin" />
  </div>
);

type MenuItem = {
  name: string;
  icon: any;
  section: string;
  path?: string;
  children?: { name: string; path: string; icon: any }[];
};

const menuItems: MenuItem[] = [
  { name: "Dashboard", icon: LayoutDashboard, section: "main", path: "/dashboard" },
  { name: "My Bookings", icon: Calendar, section: "main", path: "/dashboard/my-bookings" },
  { 
    name: "Virtual Office", 
    icon: Building2, 
    section: "main", 
    children: [
      { name: "Subscriptions", path: "/dashboard/subscriptions", icon: Calendar },
      { name: "Mail Records", path: "/dashboard/mail-records", icon: Mail },
      { name: "Visit Records", path: "/dashboard/visit-records", icon: CalendarCheck }
    ]
  },
  {
    name: "Business Setup",
    icon: ShieldCheck,
    section: "main",
    children: [
      { name: "GST Registration", path: "/dashboard/gst-registration", icon: FileText },
      { name: "GST Filing", path: "/dashboard/gst-filing", icon: FileText }
    ]
  },
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
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isItemActive = (item: MenuItem) => {
    if (item.path && location.pathname === item.path) return true;
    if (item.children && item.children.some(child => location.pathname === child.path)) return true;
    return false;
  };

  useEffect(() => {
    menuItems.forEach(item => {
      if (item.children && item.children.some(child => child.path === location.pathname)) {
        setExpandedMenus(prev => ({ ...prev, [item.name]: true }));
      }
    });
  }, [location.pathname]);

  const handleNavigation = (item: MenuItem) => {
    if (item.children) {
      if (isSidebarCollapsed) setIsSidebarCollapsed(false);
      setExpandedMenus(prev => ({ ...prev, [item.name]: !prev[item.name] }));
    } else if (item.path) {
      navigate(item.path);
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    const openDrawer = () => setIsProfileDrawerOpen(true);
    window.addEventListener("client-profile-drawer:open", openDrawer);
    return () => window.removeEventListener("client-profile-drawer:open", openDrawer);
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('openProfile') === 'true') {
      setIsProfileDrawerOpen(true);
      // Clean URL after opening
      setTimeout(() => {
        searchParams.delete('openProfile');
        // Keep tab if exists so Profile can read it
        navigate({ search: searchParams.toString() }, { replace: true });
      }, 100);
    }
  }, [location.search, navigate]);

  // Memoize the main content to prevent re-renders on scroll
  const mainContent = useMemo(() => {
    switch (location.pathname) {
      case "/dashboard":
        return <Dashboard />;
      case "/dashboard/my-bookings":
        return <MyBookings />;
      case "/dashboard/subscriptions":
        return <Subscriptions />; 
      case "/dashboard/mail-records":
        return <MailRecords />;
      case "/dashboard/visit-records":
        return <VisitRecords />;
      case "/dashboard/gst-registration":
        return <GSTRegistration />;
      case "/dashboard/gst-filing":
        return <GSTFiling />;
      case "/dashboard/payments":
        return <Billing />; 
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
              {menuItems.map((item) => {
                  const isActive = isItemActive(item);
                  const isExpanded = expandedMenus[item.name];

                  return (
                      <div key={item.name} className="flex flex-col">
                          <button
                              onClick={() => handleNavigation(item)}
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
                                  className={`flex-1 text-left text-[14px] font-semibold whitespace-nowrap transition-all duration-200 ${isSidebarCollapsed ? "w-0 opacity-0 overflow-hidden absolute" : "w-auto opacity-100 static"}`}
                              >
                                  {item.name}
                              </span>
                              {!isSidebarCollapsed && item.children && (
                                  <ChevronDown 
                                      size={16} 
                                      className={`transition-transform duration-200 ${isExpanded ? "-rotate-180" : ""}`} 
                                  />
                              )}
                          </button>
                          
                          {/* Dropdown Children */}
                          {!isSidebarCollapsed && item.children && isExpanded && (
                              <div className="mt-1 ml-10 space-y-1">
                                  {item.children.map(child => {
                                      const isChildActive = location.pathname === child.path;
                                      return (
                                          <button
                                              key={child.name}
                                              onClick={() => {
                                                  navigate(child.path);
                                                  setIsMobileMenuOpen(false);
                                              }}
                                              className={`
                                                  w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-colors
                                                  ${isChildActive 
                                                      ? "text-[#1a2d1d] bg-[#FEF8CF] shadow-sm" 
                                                      : "text-[#677e73] bg-transparent hover:text-[#1a2d1d] hover:bg-[#FEF8CF]/50"}
                                              `}
                                          >
                                              <child.icon size={16} className="shrink-0" />
                                              <span>{child.name}</span>
                                          </button>
                                      );
                                  })}
                              </div>
                          )}
                      </div>
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

        <button
          onClick={() => navigate('/')}
          className={`
            flex items-center rounded-lg shadow-sm font-bold transition-all border border-gray-200 text-[#35503F] bg-white hover:bg-gray-50 hover:shadow-md mx-auto mb-2
            ${isSidebarCollapsed ? "justify-center w-full h-14" : "justify-start gap-4 w-[263px] h-[40px] px-[12px] text-[14px]"}
          `}
          title={isSidebarCollapsed ? "Back to Home" : ""}
        >
          <Home size={20} className="shrink-0" />
          {!isSidebarCollapsed && <span className="whitespace-nowrap">Back to Home</span>}
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
            onClick={() => navigate('/affiliate')}
            className={`
              flex items-center rounded-lg shadow-sm font-bold transition-all border border-gray-200 text-blue-700 bg-white hover:bg-gray-50 hover:shadow-md mx-auto
              ${isSidebarCollapsed ? "justify-center w-full h-14" : "justify-start gap-4 w-[263px] h-[40px] px-[12px] text-[14px]"}
            `}
            title={isSidebarCollapsed ? "Affiliate Portal" : ""}
          >
            <Users size={20} className="shrink-0" />
            {!isSidebarCollapsed && <span className="whitespace-nowrap">Affiliate Portal</span>}
          </button>
        )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-[100dvh] min-w-0 bg-[#f8f8f8] relative overflow-hidden">
          {/* Mobile Header */}
          <div className="xl:hidden shrink-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-30 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu size={24} />
              </button>
              <h1 className="font-bold text-gray-900 text-lg">
                FlashSpace
              </h1>
            </div>
            {/* Minimal Mobile Header Actions */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => navigate('/dashboard/notifications')}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {/* Optional notification dot */}
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <button 
                onClick={() => setIsProfileDrawerOpen(true)}
                className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-semibold text-sm"
              >
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </button>
            </div>
          </div>

          {/* Scrollable content container */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth" id="main-scroll-container">
            <Suspense fallback={<LazyFallback />}>
              <ErrorBoundary>
                {mainContent}
              </ErrorBoundary>
            </Suspense>
          </div>
        </main>

        {/* Profile Drawer */}
        <div 
          className={cn(
            "fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-all duration-300",
            isProfileDrawerOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
          )}
          onClick={() => setIsProfileDrawerOpen(false)}
        >
          <div 
            className={cn(
              "absolute top-0 right-0 h-[100dvh] w-full max-w-[900px] bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col",
              isProfileDrawerOpen ? "translate-x-0" : "translate-x-full"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col px-6 py-5 shrink-0 bg-[#36503F] relative">
              <button 
                onClick={() => setIsProfileDrawerOpen(false)}
                className="absolute top-5 right-5 p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} strokeWidth={2} />
              </button>
              <h2 className="text-2xl font-bold text-white mb-1">
                Profile & <span className="italic font-extrabold">KYC</span>
              </h2>
              <p className="text-[#FEF8C3] text-[15px] font-medium">
                Manage your identity verification and profile details.
              </p>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-hide bg-gray-50/50 pb-8 relative">
              <Suspense fallback={<LazyFallback />}>
                 <Profile drawerMode={true} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
