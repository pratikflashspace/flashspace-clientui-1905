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
        if (path.includes("client-management")) return "Client Management";
        if (path.includes("booking-management")) return "Booking Management";
        if (path.includes("revenue-dashboard")) return "Revenue Dashboard";
        if (path.includes("payouts")) return "Payouts";
        if (path.includes("revenue-dashboard")) return "Revenue Dashboard";
        if (path.includes("payouts")) return "Payouts";
        if (path.includes("affiliate-invoices")) return "Invoices";
        if (path.includes("lead-management")) return "Lead Management";
        if (path.includes("quotation-generator")) return "Quotation Generator";
        if (path.includes("coupons")) return "Coupons and Vouchers";
        if (path.includes("marketing-tools")) return "Marketing Tools";
        if (path.includes("leaderboard")) return "Leaderboard";
        if (path.includes("support")) return "Support";
        if (path.includes("kyc")) return "Profile and KYC";
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
            case "Client Management":
                navigate("/affiliate-portal/client-management");
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
            case "Coupons and Vouchers":
                navigate("/affiliate-portal/coupons");
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
            case "Profile and KYC":
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
        <div className="flex h-screen bg-[#FAFAF7] overflow-hidden font-sans" data-lenis-prevent>
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
            <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden relative transition-all duration-300">
                {/* --- Header (Mobile/Tablet/Laptop Only) --- */}
                <header className="xl:hidden bg-white border-b border-[#edede6] h-16 flex items-center justify-between px-4 shrink-0 z-30 relative shadow-sm">
                    <div className="flex items-center">
                        <img src="/Logo/Flashspace Logo.png" alt="FlashSpace Logo" className="h-8 w-auto" />
                    </div>
                    <button
                        onClick={() => setIsMobileOpen(true)}
                        className="group relative flex flex-col items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 hover:bg-gray-100"
                    >
                        <Menu className="w-6 h-6 text-gray-700" />
                    </button>
                </header>

                {/* --- Main Content Area --- */}
                <main id="affiliate-main-content" className="flex-1 min-h-0 overflow-y-auto relative custom-scrollbar" data-lenis-prevent>
                    {/* <Outlet /> renders the child route (e.g., Dashboard.tsx) here */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AffiliateLayout;
