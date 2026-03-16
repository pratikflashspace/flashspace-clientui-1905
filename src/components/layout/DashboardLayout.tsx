import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, Home, Menu, X } from "lucide-react";

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
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-50 flex items-center justify-between px-4">
        <Link to="/" className="flex items-baseline">
          <span className="text-xl font-extrabold tracking-tight text-foreground">
            flash
          </span>
          <span className="text-lg font-extrabold tracking-tight text-primary italic">
            space
          </span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
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
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-background border-r border-border z-50 transition-all duration-300",
          collapsed ? "w-20" : "w-72",
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-border">
            <Link to="/" className="flex items-baseline mb-4">
              <span
                className={cn(
                  "font-extrabold tracking-tight text-foreground transition-all",
                  collapsed ? "text-xl" : "text-2xl",
                )}
              >
                {collapsed ? "f" : "flash"}
              </span>
              {!collapsed && (
                <span className="text-xl font-extrabold tracking-tight text-primary italic">
                  space
                </span>
              )}
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
<<<<<<< HEAD
          <ScrollArea className="flex-1 py-4">
=======
          <ScrollArea className="flex-1 py-4 min-h-0" data-lenis-prevent>
>>>>>>> d436093f5f9e5cb7da399ed4fac96c7f2cde8954
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

          {/* Back to Home */}
          <div className="p-4 border-t border-border">
            <Link to="/">
              <Button
                variant="outline"
                size="sm"
                className={cn("w-full", collapsed && "px-2")}
              >
                <Home className="w-4 h-4" />
                {!collapsed && <span className="ml-2">Back to Home</span>}
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "transition-all duration-300 pt-16 lg:pt-0",
          collapsed ? "lg:ml-20" : "lg:ml-72",
        )}
      >
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
};
