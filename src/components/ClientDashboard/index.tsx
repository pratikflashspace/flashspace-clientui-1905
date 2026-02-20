import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  LayoutDashboard,
  Calendar,
  CreditCard,
  Headphones,
  LogOut,
  User,
  Building2,
  ChevronRight,
  Bell,
  Mail,
  Users,
  FileText,
} from "lucide-react";
import { useEffect, useState, useMemo, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";

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

import Support from "./Support";
import Logout from "./Logout";
import Profile from "./Profile";
import Viewdetails from "./Viewdetails";
import Notifications from "./Notifications"; // Import the new Notifications component

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    section: "main",
    path: "/dashboard",
  },
  {
    name: "My Bookings",
    icon: Calendar,
    section: "main",
    path: "/dashboard/my-bookings",
  },
  {
    name: "Notifications",
    icon: Bell,
    section: "main",
    path: "/dashboard/notifications",
  },
  {
    name: "Billing",
    icon: CreditCard,
    section: "main",
    path: "/dashboard/billing",
  },

  {
    name: "Mail Records",
    icon: Mail,
    section: "main",
    path: "/dashboard/mail-records",
  },
  {
    name: "Visit Records",
    icon: Users,
    section: "main",
    path: "/dashboard/visit-records",
  },
  {
    name: "Documents",
    icon: FileText,
    section: "main",
    path: "/dashboard/documents",
  },
  {
    name: "Support",
    icon: Headphones,
    section: "main",
    path: "/dashboard/support",
  },
  {
    name: "Profile",
    icon: User,
    section: "account",
    path: "/dashboard/profile",
  },
  {
    name: "Logout",
    icon: LogOut,
    section: "account",
    path: "/dashboard/logout",
  },
];

export default function ClientDashboard() {
  const [showFooter, setShowFooter] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
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
        return <Notifications />; // Notifications page
      case 3:
        return <Billing />;
      case 4:
        return (
          <div className="p-8 text-center text-gray-500">
            Mail Records - Coming Soon
          </div>
        );
      case 5:
        return (
          <div className="p-8 text-center text-gray-500">
            Visit Records - Coming Soon
          </div>
        );
      case 6:
        return (
          <div className="p-8 text-center text-gray-500">
            Documents - Coming Soon
          </div>
        );
      case 7:
        return <Support />;
      case 8:
        return <Profile />;
      case 9:
        return <Logout />;
      case 100: // Special case for View Details
        return <Viewdetails />;
      default:
        return <Dashboard />;
    }
  }, [activeIndex]);

  const mainMenuItems = menuItems.filter((item) => item.section === "main");
  const accountMenuItems = menuItems.filter(
    (item) => item.section === "account",
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="hidden lg:block w-72 min-h-[calc(100vh-64px)] bg-white border-r border-gray-200 p-6 sticky top-16">
          {/* User Info */}
          <div className="mb-8 p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-lg">
                {user?.fullName?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {user?.fullName || "User"}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {user?.email || "user@email.com"}
                </p>
              </div>
            </div>
          </div>

          {/* Main Navigation */}
          <nav>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
              Main Menu
            </p>
            <ul className="space-y-1">
              {mainMenuItems.map((item, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <li key={item.name}>
                    <button
                      onClick={() => handleNavigation(idx)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? "bg-yellow-400 text-black shadow-sm"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <item.icon
                        className={`w-5 h-5 ${isActive ? "text-black" : "text-gray-400"}`}
                      />
                      <span>{item.name}</span>
                      {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Account Section */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-8 mb-3 px-3">
              Account
            </p>
            <ul className="space-y-1">
              {accountMenuItems.map((item) => {
                const actualIndex = menuItems.findIndex(
                  (m) => m.name === item.name,
                );
                const isActive = activeIndex === actualIndex;
                const isLogout = item.name === "Logout";
                return (
                  <li key={item.name}>
                    <button
                      onClick={() => handleNavigation(actualIndex)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? isLogout
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-400 text-black shadow-sm"
                          : isLogout
                            ? "text-gray-600 hover:bg-red-50 hover:text-red-600"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <item.icon
                        className={`w-5 h-5 ${isActive ? (isLogout ? "text-red-600" : "text-black") : "text-gray-400"}`}
                      />
                      <span>{item.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Promo Card */}
          <div className="mt-8 p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl text-white">
            <Building2 className="w-8 h-8 text-yellow-400 mb-3" />
            <p className="font-semibold mb-1">Need a new space?</p>
            <p className="text-sm text-gray-300 mb-3">
              Explore our virtual office locations across India.
            </p>
            <a
              href="/spaces"
              className="inline-block px-4 py-2 bg-yellow-400 text-black rounded-lg text-sm font-medium hover:bg-yellow-300 transition-colors"
            >
              Browse Spaces
            </a>
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
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
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
                    return (
                      <li key={item.name}>
                        <button
                          onClick={() => handleNavigation(idx)}
                          className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl text-base font-medium ${
                            isActive
                              ? isLogout
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-400 text-black"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.name}</span>
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
        <main className="flex-1 min-h-[calc(100vh-64px)]">{mainContent}</main>
      </div>

      {showFooter && <Footer />}
    </div>
  );
}
