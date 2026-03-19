import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom"; // Import Router hooks
import Sidebar from "@/components/affiliatePortal/Sidebar";
import { Menu } from "lucide-react";

const AffiliatePortalDashboard = () => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

    // Router hooks
    const navigate = useNavigate();
    const location = useLocation();

    // Helper: Determine active sidebar item based on current URL
    const getActivePageFromUrl = () => {
        const path = location.pathname;
        if (path.includes("booking-management")) return "Booking Management";
        if (path.includes("revenue-dashboard")) return "Revenue Dashboard";
        if (path.includes("payouts")) return "Payouts";
        if (path.includes("invoices")) return "Invoices";
        if (path.includes("lead-management")) return "Lead Management";
        if (path.includes("quotation-generator")) return "Quotation Generator";
        if (path.includes("marketing-tools")) return "Marketing Tools";
        if (path.includes("leaderboard")) return "Leaderboard";
        if (path.includes("support")) return "Support";
        return "Dashboard"; // Default
    };

    const activePage = getActivePageFromUrl();

    // Helper: Handle Navigation when Sidebar items are clicked
    const handleNavigation = (pageName: string) => {
        switch (pageName) {
            case "Dashboard":
                navigate("/affiliate-portal/dashboard");
                break;
            case "Booking Management":
                navigate("/affiliate-portal/booking-management");
                break;
            case "Revenue Dashboard":
                navigate("/affiliate-portal/revenue-dashboard");
                break;
            case "Payouts":
                navigate("/affiliate-portal/payouts");
                break;
            case "Invoices":
                navigate("/affiliate-portal/invoices");
                break;
            case "Lead Management":
                navigate("/affiliate-portal/lead-management");
                break;
            case "Quotation Generator":
                navigate("/affiliate-portal/quotation-generator");
                break;
            case "Marketing Tools":
                navigate("/affiliate-portal/marketing-tools");
                break;
            case "Leaderboard":
                navigate("/affiliate-portal/leaderboard");
                break;
            case "Support":
                navigate("/affiliate-portal/support");
                break;
            default:
                navigate("/affiliate-portal/dashboard");
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            {/* 1. Sidebar */}
            <Sidebar
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
                isDesktopCollapsed={isDesktopCollapsed}
                setIsDesktopCollapsed={setIsDesktopCollapsed}
                activePage={activePage} // Pass calculated active page
                setActivePage={handleNavigation} // Pass navigation handler
            />

            {/* 2. Main Content Wrapper */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative transition-all duration-300">
                {/* --- Header (Mobile Only) --- */}
                <header className="lg:hidden bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 shrink-0 z-30 relative">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <span className="text-slate-900">flash</span>
                        <span className="text-[#5aa39c]">space</span>
                    </div>
<button
                        onClick={() => setIsMobileOpen(true)}
                        className="group relative flex flex-col items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 hover:bg-[#FEF8C3] hover:shadow-sm"
                    >
                        <div className="flex flex-col gap-1 items-center justify-center">
                            <span className="w-5 h-0.5 bg-gray-600 rounded-full transition-all group-hover:bg-[#2D3F33] group-hover:w-6"></span>
                            <span className="w-6 h-0.5 bg-gray-600 rounded-full transition-all group-hover:bg-[#2D3F33] group-hover:w-4"></span>
                            <span className="w-5 h-0.5 bg-gray-600 rounded-full transition-all group-hover:bg-[#2D3F33] group-hover:w-6"></span>
                        </div>
                    </button>
                </header>

                {/* --- Main Content Area --- */}
                <main className="flex-1 overflow-auto relative">
                    {/* <Outlet /> renders the child route (e.g., Dashboard.tsx) here */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AffiliatePortalDashboard;
