import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, Home, Menu, X } from "lucide-react";

const FLASHSPACE_LOGO_URL =
  "https://cdn.prod.website-files.com/664330484432dcdd6519a8fd/665dd8e0007de68a44f3750b_Black%20and%20White%20Bold%20Typography%20Clothing%20Brand%20Logo%20(940%20x%20400%20px)%20(940%20x%20200%20px)%20(940%20x%20150%20px).png";

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
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Persist collapsed state
  useEffect(() => {
    localStorage.setItem("admin-sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  // Persist scroll position across navigation
  useEffect(() => {
    const scrollContainer = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    
    // Restore scroll position
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
  }, [location.pathname]); // Update on each route change to ensure restoration after component remount

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Sidebar Overlay (keeping as overlay but removing fixed height dependencies) */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-background border-r border-border z-50 transition-all duration-300 shadow-sm",
          collapsed ? "w-20" : "w-72",
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-border">
            <Link
              to="/"
              className={cn("flex items-center mb-4", collapsed && "justify-center")}
              aria-label="FlashSpace home"
            >
              <img
                src={FLASHSPACE_LOGO_URL}
                alt="FlashSpace Logo"
                className={cn(
                  "w-auto object-contain transition-all dark:invert",
                  collapsed ? "h-7 max-w-10" : "h-9 max-w-[170px]",
                )}
              />
            </Link>
            {!collapsed && (
              <div>
                <h2 className="font-bold text-foreground text-sm">
                  {portalName}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  {portalDescription}
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <ScrollArea
            ref={scrollAreaRef}
            className="flex-1 min-h-0 py-4"
            scrollbarClassName="text-[#35503F]/75 hover:text-[#35503F]"
            data-lenis-prevent
          >
            <nav className="px-3 space-y-1">
              {navItems.map((item) => (
                <div key={item.href}>
                  <Link
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {item.icon}
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                  {!collapsed && item.children && (
                    <div className="ml-9 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "block px-3 py-2 rounded-lg text-sm transition-colors",
                            isActive(child.href)
                              ? "text-primary font-medium"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </ScrollArea>

          {/* Sidebar Header for Mobile only when open */}
          <div className="lg:hidden p-4 border-b flex justify-end">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Collapse Toggle (Desktop) */}
          <div className="p-4 border-t border-border hidden lg:block">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className={cn("w-full flex items-center gap-3 justify-start text-muted-foreground hover:bg-muted hover:text-foreground", collapsed && "justify-center")}
            >
              <ChevronLeft className={cn("w-5 h-5 transition-transform duration-300", collapsed && "rotate-180")} />
              {!collapsed && <span className="font-semibold text-xs uppercase tracking-wider">Collapse</span>}
            </Button>
          </div>

          {/* Back to Home */}
          <div className="p-4 border-t border-border">
            <Link to="/">
              <Button
                variant="outline"
                size="sm"
                className={cn("w-full flex items-center justify-start gap-3", collapsed && "justify-center px-2")}
              >
                <Home className="w-4 h-4" />
                {!collapsed && <span className="font-medium text-xs uppercase tracking-wider">Home</span>}
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main
        className={cn(
          "transition-all duration-300 min-h-screen flex flex-col",
          collapsed ? "lg:ml-20" : "lg:ml-72",
        )}
      >
        {/* Mobile Top Bar (Only visible when sidebar needs toggle) */}
        <header className="lg:hidden h-16 bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-30 flex items-center justify-between px-4 shrink-0">
          <div className="flex flex-col">
            <img
              src={FLASHSPACE_LOGO_URL}
              alt="FlashSpace Logo"
              className="h-8 w-auto max-w-[150px] object-contain dark:invert"
            />
            <p className="text-[10px] text-muted-foreground mt-0.5 font-bold uppercase tracking-widest leading-none">
              {portalName}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
};
