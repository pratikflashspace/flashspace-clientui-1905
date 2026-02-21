import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom"; // Import Router hooks
import Sidebar from "@/components/affiliatePortal/Sidebar";
import { Menu } from "lucide-react";
import "./portal-animations.css";

const AffiliateLayout = () => {
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
        if (path.includes("revenue-dashboard")) return "Revenue Dashboard";
        if (path.includes("payouts")) return "Payouts";
        if (path.includes("affiliate-invoices")) return "Invoices";
        if (path.includes("lead-management")) return "Lead Management";
        if (path.includes("quotation-generator")) return "Quotation Generator";
        if (path.includes("marketing-tools")) return "Marketing Tools";
        if (path.includes("leaderboard")) return "Leaderboard";
        if (path.includes("support")) return "Support";
        if (path.includes("kyc")) return "KYC Verification";
        if (path.includes("notifications")) return "Notifications";
        return "Dashboard"; // Default
    };

    const activePage = getActivePageFromUrl();

    // Helper: Handle Navigation when Sidebar items are clicked
    const handleNavigation = (pageName: string) => {
        switch (pageName) {
            case "Dashboard":
                navigate("/affiliate-portal/affiliate-dashboard");
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
                navigate("/affiliate-portal/affiliate-invoices");
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
            case "KYC Verification":
                navigate("/affiliate-portal/kyc");
                break;
            case "Notifications":
                navigate("/affiliate-portal/notifications");
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
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                </header>

                {/* --- Main Content Area --- */}
                <main id="affiliate-main-content" className="flex-1 overflow-auto relative" data-lenis-prevent>
                    {/* <Outlet /> renders the child route (e.g., Dashboard.tsx) here */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AffiliateLayout;
