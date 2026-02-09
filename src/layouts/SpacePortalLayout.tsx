import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/components/SpacePartner/sidebar/Sidebar";
import Topbar from "@/components/SpacePartner/topbar/Topbar";
import Footer from "@/components/SpacePartner/footer/Footer";

export default function SpacePortalLayout() {
  const location = useLocation();

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

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Topbar */}
        <Topbar title={title} />

        {/* Page Content */}
        <main className="mt-6 flex-1">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
