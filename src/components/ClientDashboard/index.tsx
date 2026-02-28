import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  LayoutDashboard,
  Calendar,
  CreditCard,
  ShieldCheck,
  Headphones, // Keep for fallback or remove if unused
  LogOut,
  User,
  Building2,
  ChevronRight,
  Bell,
  Mail,
  Users,
  FileText,
  CalendarCheck, // For Visit Records
  MessageSquare, // For Chat Support
  HelpCircle, // For Help Center
  Home, // For Back to Home
  AlertCircle,
} from "lucide-react";
import { useEffect, useState, useMemo, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect as useEffectReact, useState as useStateReact } from "react";

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
  { name: "Chat Support", icon: MessageSquare, section: "main", path: "/dashboard/support" },
  { name: "Notifications", icon: Bell, section: "main", path: "/dashboard/notifications" },
  { name: "Help Center", icon: HelpCircle, section: "main", path: "/dashboard/help" },
  { name: "Profile & KYC", icon: User, section: "account", path: "/dashboard/profile" },
  { name: "Logout", icon: LogOut, section: "account", path: "/dashboard/logout" },
];

export default function ClientDashboard() {
  const [showFooter, setShowFooter] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const [kycStatus, setKycStatus] = useStateReact<string | null>(null);

  // Fetch KYC status for indicator
  useEffectReact(() => {
    async function fetchKycStatus() {
      try {
        const res = await import("@/services/userDashboard.service");
        const kycResponse = await res.default.getKYC();
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
  const showFooterRef = useRef(false);

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
    function handleScroll() {
      const shouldShow = window.scrollY > 0;
      // Only update state if value actually changed
      if (showFooterRef.current !== shouldShow) {
        showFooterRef.current = shouldShow;
        setShowFooter(shouldShow);
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const mainMenuItems = menuItems.filter((item) => item.section === "main");
  const accountMenuItems = menuItems.filter((item) => item.section === "account");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="hidden lg:block w-72 min-h-[calc(100vh-64px)] bg-white border-r border-gray-200 p-6 sticky top-16">
          {/* User Info removed from here */}

          {/* Main Navigation */}
          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-1">
              {mainMenuItems.map((item, idx) => {
                const isActive = activeIndex === idx;
                const showKycDot = item.name === "Profile & KYC" && kycStatus !== "approved";
                return (
                  <li key={item.name}>
                    <button
                      onClick={() => handleNavigation(idx)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                          ? "bg-[#35503F] text-white shadow-sm"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-400"}`} />
                      <span className="flex items-center gap-1">
                        {item.name}
                        {showKycDot && (
                          <span className="flex items-center ml-2 text-xs text-red-600 font-semibold" title="KYC Required">
                            <AlertCircle className="w-4 h-4 mr-1 text-red-500" />
                            <span className="text-red-600 font-bold">KYC</span>
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Account Section */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-8 mb-3 px-3">Account</p>
            <ul className="space-y-1">
              {accountMenuItems.map((item) => {
                const actualIndex = menuItems.findIndex((m) => m.name === item.name);
                const isActive = activeIndex === actualIndex;
                const isLogout = item.name === "Logout";
                const showKycDot = item.name === "Profile & KYC" && kycStatus !== "approved";
                return (
                  <li key={item.name}>
                    <button
                      onClick={() => handleNavigation(actualIndex)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                          ? isLogout
                            ? "bg-red-100 text-red-700"
                            : "bg-[#35503F] text-white shadow-sm"
                          : isLogout
                            ? "text-gray-600 hover:bg-red-50 hover:text-red-600"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <item.icon className={`w-5 h-5 ${isActive ? (isLogout ? "text-red-600" : "text-white") : "text-gray-400"}`} />
                      <span className="flex items-center gap-1">
                        {item.name}
                        {showKycDot && (
                          <span className="flex items-center ml-2 text-xs text-red-600 font-semibold" title="KYC Required">
                            <AlertCircle className="w-4 h-4 mr-1 text-red-500" />
                            <span className="text-red-600 font-bold">KYC</span>
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Back to Home Button & Portal Links */}
          <div className="mt-auto pt-4 border-t border-gray-100 space-y-2">
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
          </div>
        </aside>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-yellow-400 rounded-full shadow-lg flex items-center justify-center"
        >
          <LayoutDashboard className="w-6 h-6 text-black" />
        </button>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
            <div
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>
              <nav>
                <ul className="space-y-2">
                  {menuItems.map((item, idx) => {
                    const isActive = activeIndex === idx;
                    const isLogout = item.name === "Logout";
                    const showKycDot = item.name === "Profile & KYC" && kycStatus !== "approved";
                    return (
                      <li key={item.name}>
                        <button
                          onClick={() => handleNavigation(idx)}
                          className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl text-base font-medium ${isActive
                              ? isLogout
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-400 text-black"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                          <span className="flex items-center gap-1">
                            {item.name}
                            {showKycDot && (
                              <span className="flex items-center ml-2 text-xs text-red-600 font-semibold" title="KYC Required">
                                <AlertCircle className="w-4 h-4 mr-1 text-red-500" />
                                <span className="text-red-600 font-bold">KYC</span>
                              </span>
                            )}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0 overflow-x-hidden min-h-[calc(100vh-64px)]">
          {mainContent}
        </main>
      </div>

      {showFooter && <Footer />}
    </div>
  );
}