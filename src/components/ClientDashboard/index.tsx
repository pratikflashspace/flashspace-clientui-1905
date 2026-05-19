import {
  LayoutDashboard,
  Calendar,
  CreditCard,
  ShieldCheck,
  User,
  Building2,
  ChevronRight,
  ChevronLeft,
  Bell,
  Mail,
  Users,
  FileText,
  CalendarCheck,
  MessageSquare,
  HelpCircle,
  Home,
  AlertCircle,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState, useMemo, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationProvider";
import ErrorBoundary from "@/components/ErrorBoundary";

import userDashboardService from "@/services/userDashboard.service";

// Remove this type definition if useAuth already provides the correct user type
// type User = {
//   name?: string;
//   email?: string;
//   // add other properties as needed
// };
import { useLocation, useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import MyBookings from "./MyBookings";
import Billing from "./Billing";
import KYCVerification from "./KYCVerification";
import Support from "./Support";
import Logout from "./Logout";
import Profile from "./Profile";
import Viewdetails from "./Viewdetails";
import Notifications from "./Notifications"; // Import the new Notifications component
import ChatSupport from "./ChatSupport"; // Import ChatSupport
import Documents from "./Documents";
import MailRecords from "./MailRecords";
import VisitRecords from "./VisitRecords";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, section: "main", path: "/dashboard" },
  { name: "My Bookings", icon: Calendar, section: "main", path: "/dashboard/my-bookings" },
  { name: "Mail Records", icon: Mail, section: "main", path: "/dashboard/mail-records" },
  { name: "Visit Records", icon: CalendarCheck, section: "main", path: "/dashboard/visit-records" },
  { name: "Payments", icon: CreditCard, section: "main", path: "/dashboard/payments" },
  { name: "Documents", icon: FileText, section: "main", path: "/dashboard/documents" },
  { name: "Ticket and Support", icon: MessageSquare, section: "main", path: "/dashboard/support" },
  { name: "Notifications", icon: Bell, section: "main", path: "/dashboard/notifications" },
  { name: "Help Center", icon: HelpCircle, section: "main", path: "/dashboard/help" },
  { name: "Profile & KYC", icon: User, section: "main", path: "/dashboard/profile" },
];

export default function ClientDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const [kycStatus, setKycStatus] = useState<string | null>(null);

  // Fetch KYC status for indicator
  useEffect(() => {
    async function fetchKycStatus() {
      try {
        const kycResponse = await userDashboardService.getKYC();
        if (kycResponse.success && kycResponse.data) {
          const kyc = Array.isArray(kycResponse.data) ? kycResponse.data[0] : kycResponse.data;
          setKycStatus(kyc?.overallStatus || null);
        }
      } catch (e) {
        setKycStatus(null);
      }
    }
    fetchKycStatus();
  }, []);
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

  // Memoize the main content to prevent re-renders on scroll
  const mainContent = useMemo(() => {
    switch (activeIndex) {
      case 0:
        return <Dashboard />;
      case 1:
        return <MyBookings />;
      case 2:
        return <MailRecords />;
      case 3:
        return <VisitRecords />;
      case 4: // Payments
        return <Billing />; // Using Billing component for Payments for now
      case 5:
        return <Documents />;
      case 6: // Chat Support
        return <ChatSupport />;
      case 7: // Notifications
        return <Notifications />;
      case 8: // Help Center
        return <Support />;
      case 9:
        return <Profile />;
      case 10:
        return <Logout />;
      case 100: // Special case for View Details
        return <Viewdetails />;
      default:
        return <Dashboard />;
    }
  }, [activeIndex]);

  const mainMenuItems = menuItems; // All menu items in single list now

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="flex h-screen overflow-hidden relative">
        {/* Mobile Sidebar Overlay Backdrop */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out shadow-sm",
            isSidebarCollapsed ? "w-[72px]" : "w-72",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          <div className={`flex flex-col h-full`}>
            {/* Logo */}
            <div
              className={cn(
                "flex flex-col items-start gap-1 cursor-pointer transition-all",
                isSidebarCollapsed ? "px-2 py-6 items-center" : "p-6 pb-8"
              )}
              onClick={() => navigate("/")}
              title="Back to Home"
            >
              <div className="flex items-center justify-between w-full">
                <img
                  src="https://cdn.prod.website-files.com/664330484432dcdd6519a8fd/665dd8e0007de68a44f3750b_Black%20and%20White%20Bold%20Typography%20Clothing%20Brand%20Logo%20(940%20x%20400%20px)%20(940%20x%20200%20px)%20(940%20x%20150%20px).png"
                  alt="FlashSpace Logo"
                  className={`w-auto object-contain ${isSidebarCollapsed ? "h-7" : "h-9"}`}
                />
                {!isSidebarCollapsed && (
                  <button
                    className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              {!isSidebarCollapsed && (
                <div className="mt-2 pl-3 space-y-0.5">
                  <p className="text-sm font-bold text-[#1F2E26] dark:text-white leading-none">Customer Portal</p>
                  <p className="text-[11px] text-[#677E73] dark:text-gray-400 font-medium leading-tight">Manage your workspace subscriptions</p>
                </div>
              )}
            </div>

            {/* Horizontal Separator Line */}
            <div className="border-b border-gray-100 w-full" />

          {/* Main Navigation */}
          <nav className="flex-1 overflow-y-auto scrollbar-hover-only py-4">
            <ul className={cn("space-y-1", isSidebarCollapsed ? "px-2" : "px-2")}>
              {mainMenuItems.map((item, idx) => {
                const isActive = activeIndex === idx;
                const showKycDot = item.name === "Profile & KYC" && kycStatus !== "approved";
                const showNotificationBadge =
                  item.name === "Notifications" && unreadCount > 0;

                return (
                  <li key={item.name}>
                    <button
                      onClick={() => handleNavigation(idx)}
                      title={isSidebarCollapsed ? item.name : undefined}
                      className={`relative w-full flex items-center gap-3 rounded-xl text-sm font-medium transition-all ${isSidebarCollapsed ? "justify-center px-2 py-3" : "px-4 py-2.5"
                        } ${isActive
                          ? "bg-[#35503F] text-[#FEF8C3] shadow-sm"
                          : "text-gray-600 hover:bg-gray-100 hover:text-black"
                        }`}
                    >
                      <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-[#FEF8C3]" : "text-gray-400"}`} />
                      {!isSidebarCollapsed && (
                        <span className="flex items-center gap-1">
                          {item.name}
                          {showNotificationBadge && (
                            <span
                              className={`ml-2 inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${isActive
                                ? "bg-[#FEF8C3] text-[#35503F]"
                                : "bg-[#35503F] text-[#FEF8C3]"
                                }`}
                            >
                              {unreadCount > 99 ? "99+" : unreadCount}
                            </span>
                          )}
                          {showKycDot && (
                            <span className="flex items-center ml-2 text-xs text-red-600 font-semibold" title="KYC Required">
                              <AlertCircle className="w-4 h-4 mr-1 text-red-500" />
                              <span className="text-red-600 font-bold">KYC</span>
                            </span>
                          )}
                        </span>
                      )}
                      {isSidebarCollapsed && showNotificationBadge && (
                        <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom Actions */}
          <div className={cn("mt-auto pt-4 border-t border-gray-100 space-y-2", isSidebarCollapsed ? "px-2 pb-4" : "px-4 pb-4")}>
            {/* Collapse Toggle (Desktop) */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className={cn(
                "hidden lg:flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-gray-400 hover:bg-gray-50 transition-colors",
                isSidebarCollapsed && "justify-center"
              )}
            >
              <ChevronLeft className={cn("w-5 h-5 transition-transform", isSidebarCollapsed && "rotate-180")} />
              {!isSidebarCollapsed && (
                <span className="font-medium text-xs uppercase tracking-wider">Collapse</span>
              )}
            </button>

            {!isSidebarCollapsed ? (
              <>
                {user?.role && ['super_admin', 'admin', 'sales', 'support', 'affiliate_manager', 'space_partner_manager'].includes(user.role) && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-50 border border-purple-100 rounded-xl text-sm font-semibold text-purple-700 hover:bg-purple-100 transition-all shadow-sm shadow-purple-900/5 group"
                  >
                    <ShieldCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Admin Portal</span>
                  </button>
                )}

                {user?.role === 'partner' && (
                  <button
                    onClick={() => navigate('/spaceportal')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-50 border border-orange-100 rounded-xl text-sm font-semibold text-orange-700 hover:bg-orange-100 transition-all shadow-sm shadow-orange-900/5 group"
                  >
                    <Building2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Partner Portal</span>
                  </button>
                )}

                {user?.role === 'affiliate' && (
                  <button
                    onClick={() => navigate('/affiliate-portal')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-cyan-50 border border-cyan-100 rounded-xl text-sm font-semibold text-cyan-700 hover:bg-cyan-100 transition-all shadow-sm shadow-cyan-900/5 group"
                  >
                    <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Affiliate Portal</span>
                  </button>
                )}

                <button
                  onClick={() => navigate('/')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                >
                  <Home className="w-4 h-4" />
                  <span>Back to Home</span>
                </button>
              </>
            ) : (
              /* Collapsed: show only Back to Home icon */
              <button
                onClick={() => navigate('/')}
                title="Back to Home"
                className="w-full flex items-center justify-center px-2 py-3 rounded-xl text-gray-500 hover:bg-gray-100 transition-all"
              >
                <Home className="w-5 h-5" />
              </button>
            )}
          </div>
          </div>
        </aside>


        {/* Main Content */}
        <main
          className={cn(
            "relative flex-1 min-w-0 h-full overflow-x-hidden overflow-y-auto touch-pan-y scroll-smooth flex flex-col transition-all duration-300",
            isSidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-72"
          )}
          data-lenis-prevent
        >
          {/* Mobile Top Bar (Only visible when sidebar needs toggle) */}
          <header className="lg:hidden h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 flex items-center justify-between px-4 shrink-0">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-0.5">
                <span className={cn(
                  "font-extrabold tracking-tight text-gray-900 transition-all uppercase",
                  isSidebarCollapsed ? "text-xl" : "text-2xl"
                )}>
                  {isSidebarCollapsed ? "F" : "FLASH"}
                </span>
                {!isSidebarCollapsed && (
                  <span className="text-xl font-extrabold tracking-tight text-primary italic lowercase">
                    space
                  </span>
                )}
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5 font-bold uppercase tracking-widest leading-none">
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
              {mainContent}
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}
