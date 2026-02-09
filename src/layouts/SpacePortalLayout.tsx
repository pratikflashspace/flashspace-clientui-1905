import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/components/SpacePartner/sidebar/Sidebar";
import Topbar from "@/components/SpacePartner/topbar/Topbar";
import Footer from "@/components/SpacePartner/footer/Footer";

export default function SpacePortalLayout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Simple title mapping based on route
  // Later you can make this dynamic from route config.
  const pageTitleMap: Record<string, string> = {
    "/spaceportal/dashboard": "Dashboard",
    "/spaceportal/booking-analytics": "Booking Analytics",
    "/spaceportal/booking-calendar": "Booking Calendar",
    "/spaceportal/clients": "Clients",
    "/spaceportal/client-enquiries": "Client Enquiries",
    "/spaceportal/invoices-payments": "Invoices & Payments",
    "/spaceportal/tickets": "Ticket System",
    "/spaceportal/space-management": "Space Management",
  };

  const title = pageTitleMap[location.pathname] || "Space Portal";

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40 transition-opacity lg:hidden ${
          isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isSidebarOpen}
      >
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setIsSidebarOpen(false)}
          className="absolute inset-0 bg-black/40"
        />
        <div
          className={`absolute inset-y-0 left-0 w-72 transform bg-white shadow-2xl transition-transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <div className="px-3 pt-3 sm:px-5 sm:pt-5 lg:px-8">
          <Topbar title={title} onMenuClick={() => setIsSidebarOpen(true)} />
        </div>

        {/* Page Content */}
        <main className="mt-4 flex-1 px-3 pb-6 sm:mt-6 sm:px-5 lg:px-8">
          <Outlet />
        </main>

        {/* Footer */}
        <div className="px-3 pb-4 sm:px-5 sm:pb-6 lg:px-8">
          <Footer />
        </div>
      </div>
    </div>
  );
}
