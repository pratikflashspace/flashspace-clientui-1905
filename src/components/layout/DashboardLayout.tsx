import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, Home, Menu, X } from "lucide-react";
import "@/pages/affiliatePortal/portal-animations.css"; // Ensure standard animations

const FLASHSPACE_LOGO_URL = "/Logo/Flashspace Logo.png";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  children?: { label: string; href: string }[];
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  portalName: string;
  portalDescription: string;
  navItems: NavItem[];
}

export const DashboardLayout = ({
  children,
  portalName,
  portalDescription,
  navItems,
}: DashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("admin-sidebar-collapsed");
    return saved === "true";
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("admin-sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    const scrollContainer = scrollAreaRef.current;
    const savedScrollPos = sessionStorage.getItem("admin-sidebar-scroll");
    if (savedScrollPos && scrollContainer) {
      scrollContainer.scrollTop = parseInt(savedScrollPos, 10);
    }

    const handleScroll = () => {
      if (scrollContainer) {
        sessionStorage.setItem("admin-sidebar-scroll", String(scrollContainer.scrollTop));
      }
    };

    scrollContainer?.addEventListener('scroll', handleScroll);
    return () => scrollContainer?.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const isActive = (href: string) => {
    if (href === "/admin" || href === "/admin/") {
      return location.pathname === "/admin" || location.pathname === "/admin/";
    }
    return location.pathname.startsWith(href);
  };

  const sidebarClasses = cn(
    "fixed top-0 left-0 z-50 h-screen bg-[#f8f8f8] shadow-xl border-r border-[#edede6] flex flex-col transition-all duration-300 ease-in-out",
    "w-72",
    mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
    "lg:relative lg:translate-x-0 lg:shadow-none lg:h-full overflow-hidden",
    collapsed ? "lg:w-20" : "lg:w-72"
  );

  return (
    <div className="flex h-screen bg-[#FAFAF7] overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }} data-lenis-prevent>
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar (Matching Affiliate Sidebar) */}
      <aside className={sidebarClasses} data-lenis-prevent>
        <div className={cn("flex flex-col shrink-0 transition-all duration-300", collapsed ? "p-4 items-center" : "w-[287px] h-[137px] p-[24px]")}>
          <div className={cn("flex items-center w-full", collapsed ? "justify-center" : "justify-between")}>
            <img
              src={FLASHSPACE_LOGO_URL}
              alt="FlashSpace Logo"
              onClick={() => navigate("/")}
              className={cn("w-auto object-contain transition-all duration-300 ml-[-12px] cursor-pointer", collapsed ? "h-7" : "h-9")}
            />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <X size={24} />
            </button>
          </div>

          <div className={cn("mt-[17px] overflow-hidden transition-all duration-300 flex flex-col gap-1", collapsed ? "h-0 opacity-0" : "h-auto opacity-100")}>
            <h2 className="w-[239px] h-[20px] text-[14px] font-bold text-[#1a2d1d] whitespace-nowrap leading-none flex items-center" style={{ fontFamily: "'Inter', sans-serif" }}>
              {portalName}
            </h2>
            <p className="w-[239px] h-[16px] text-[12px] text-[#64748b] whitespace-nowrap font-medium leading-none flex items-center">
              {portalDescription}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div
          ref={scrollAreaRef}
          className="flex-1 min-h-0 px-4 space-y-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          data-lenis-prevent
        >
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <div key={item.href} className="mb-2">
                <Link
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  title={collapsed ? item.label : ""}
                  className={cn(
                    "flex items-center transition-all duration-300 rounded-lg group relative",
                    collapsed ? "justify-center w-12 h-12 mx-auto" : "justify-start w-[263px] h-[40px] px-[12px] gap-4 mx-auto",
                    active
                      ? "bg-[#334d3d] text-[#FEF8C3] shadow-sm"
                      : "text-[#677e73] hover:bg-gray-50 hover:text-[#1a2d1d]"
                  )}
                >
                  <span className={cn("shrink-0", active ? "opacity-100" : "opacity-80 group-hover:opacity-100")}>
                    {item.icon}
                  </span>
                  <span
                    className={cn(
                      "text-[14px] font-semibold whitespace-nowrap transition-all duration-200",
                      collapsed ? "w-0 opacity-0 overflow-hidden absolute" : "w-auto opacity-100 static"
                    )}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {item.label}
                  </span>
                </Link>
                {!collapsed && item.children && (
                  <div className="ml-10 mt-1 flex flex-col gap-1 border-l-2 border-[#edede6] pl-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        to={child.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-sm transition-all duration-200",
                          isActive(child.href)
                            ? "bg-[#334d3d]/10 text-[#1a2d1d] font-bold"
                            : "text-[#677e73] hover:bg-gray-50 hover:text-[#1a2d1d] font-medium"
                        )}
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer and Bottom Actions */}
        <div className="p-6 border-t border-gray-100 space-y-4 bg-[#f8f9fa]/30 shrink-0">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "hidden lg:flex items-center transition-colors text-[#677e73] hover:text-[#1a2d1d] py-2 mx-auto",
              collapsed ? "justify-center w-full" : "justify-start gap-4 w-[263px] h-[40px] px-[12px]"
            )}
          >
            {collapsed ? (
              <ChevronRight size={22} />
            ) : (
              <>
                <ChevronLeft size={20} />
                <span className="text-[15px] font-bold" style={{ fontFamily: "'Inter', sans-serif" }}>Collapse</span>
              </>
            )}
          </button>
          <button
            onClick={() => navigate("/")}
            className={cn(
              "flex items-center rounded-lg shadow-sm font-bold transition-all border border-gray-200 text-[#677e73] bg-white hover:bg-gray-50 hover:shadow-md mx-auto",
              collapsed ? "justify-center w-full h-14" : "justify-start gap-4 w-[263px] h-[40px] px-[12px] text-[14px]"
            )}
          >
            <Home size={20} />
            {!collapsed && (
              <span className="whitespace-nowrap" style={{ fontFamily: "'Inter', sans-serif" }}>Back to Home</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden relative transition-all duration-300">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-[#edede6] h-16 flex items-center justify-between px-4 shrink-0 z-30 relative shadow-sm">
          <div className="flex items-center">
            <img src={FLASHSPACE_LOGO_URL} alt="FlashSpace Logo" className="h-8 w-auto" />
          </div>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="group relative flex flex-col items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 hover:bg-gray-100"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 min-h-0 overflow-y-auto relative custom-scrollbar p-4 md:p-6 lg:p-8 [&_*]:![font-family:'Inter',sans-serif]" data-lenis-prevent>
          {children}
        </main>
      </div>
    </div>
  );
};
