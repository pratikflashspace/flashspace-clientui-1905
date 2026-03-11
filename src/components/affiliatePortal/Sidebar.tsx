import React, { useState, useEffect } from "react";
import {
    LayoutGrid,
    Users2,
    LineChart,
    Wallet,
    FileText,
    Target,
    FileOutput,
    Send,
    Trophy,
    MessageSquare,
    Home,
    Shield,
    Bell,
    ChevronLeft,
    ChevronRight,
    X,
    LayoutDashboard,
    AlertTriangle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import userDashboardService from "@/services/userDashboard.service";

interface SidebarProps {
    isMobileOpen: boolean;
    setIsMobileOpen: (isOpen: boolean) => void;
    isDesktopCollapsed: boolean;
    setIsDesktopCollapsed: (isCollapsed: boolean) => void;
    activePage: string;
    setActivePage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    isMobileOpen,
    setIsMobileOpen,
    isDesktopCollapsed,
    setIsDesktopCollapsed,
    activePage,
    setActivePage,
}) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [kycStatus, setKycStatus] = useState<string>("approved");

    useEffect(() => {
        const fetchMyKycStatus = async () => {
            try {
                const response = await userDashboardService.getKYC();
                if (response.success && response.data) {
                    let status = "not_started";
                    if (Array.isArray(response.data)) {
                        const indProfile = response.data.find(p => p.kycType === 'individual');
                        status = indProfile?.overallStatus || "not_started";
                    } else {
                        status = (response.data as any).overallStatus || "not_started";
                    }
                    setKycStatus(status);
                } else {
                    setKycStatus("not_started");
                }
            } catch (error) {
                setKycStatus("not_started");
            }
        };
        fetchMyKycStatus();
    }, []);

    const menuItems = [
        {
            name: "Dashboard",
            icon: LayoutGrid,
            path: "/affiliate-portal/affiliate-dashboard",
        },
        {
            name: "Booking Management", // Keeping this name from the reference image as requested by UI task
            icon: Users2,
            path: "/affiliate-portal/client-management",
        },
        {
            name: "Revenue Dashboard",
            icon: LineChart,
            path: "/affiliate-portal/revenue-dashboard",
        },
        {
            name: "Payouts",
            icon: Wallet,
            path: "/affiliate-portal/payouts",
        },
        {
            name: "Invoices",
            icon: FileText,
            path: "/affiliate-portal/affiliate-invoices",
        },
        {
            name: "Lead Management",
            icon: Target,
            path: "/affiliate-portal/lead-management",
        },
        {
            name: "Quotation Generator",
            icon: FileOutput,
            path: "/affiliate-portal/quotation-generator",
        },
        {
            name: "Marketing Tools",
            icon: Send,
            path: "/affiliate-portal/marketing-tools",
        },
        {
            name: "Leaderboard",
            icon: Trophy,
            path: "/affiliate-portal/leaderboard",
        },
        {
            name: "Support",
            icon: MessageSquare,
            path: "/affiliate-portal/support",
        },
        {
            name: "KYC Verification",
            icon: Shield,
            path: "/affiliate-portal/kyc",
        },
        {
            name: "Notifications",
            icon: Bell,
            path: "/affiliate-portal/notifications",
        },
    ];

    const sidebarClasses = `
    fixed top-0 left-0 z-50 h-screen bg-[#f8f8f8] shadow-xl border-r border-[#edede6] flex flex-col transition-all duration-300 ease-in-out
    w-72 
    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
    lg:relative lg:translate-x-0 lg:shadow-none lg:h-full overflow-hidden
    ${isDesktopCollapsed ? "lg:w-20" : "lg:w-72"}
  `;

    return (
        <>
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <aside className={sidebarClasses} data-lenis-prevent>
                {/* Header branding */}
                <div className={`flex flex-col shrink-0 transition-all duration-300 ${isDesktopCollapsed ? "p-4 items-center" : "w-[287px] h-[137px] p-[24px]"}`}>
                    <div className={`flex items-center w-full ${isDesktopCollapsed ? "justify-center" : "justify-between"}`}>
                        <div
                            className={`font-black tracking-tight transition-all duration-300 overflow-hidden whitespace-nowrap flex items-center ${isDesktopCollapsed ? "text-2xl" : "w-[239px] h-[32px] text-[32px] leading-none"}`}
                            style={{ fontFamily: "'Inter Tight', sans-serif" }}
                        >
                            {isDesktopCollapsed ? (
                                <span className="text-[#1a2d1d]">f</span>
                            ) : (
                                <>
                                    <span className="text-[#1a2d1d]">flash</span>
                                    <span className="text-[#334d3d] opacity-80">space</span>
                                </>
                            )}
                        </div>
                        <button
                            onClick={() => setIsMobileOpen(false)}
                            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className={`mt-[17px] overflow-hidden transition-all duration-300 flex flex-col gap-1 ${isDesktopCollapsed ? "h-0 opacity-0" : "h-auto opacity-100"}`}>
                        <h2 className="w-[239px] h-[20px] text-[14px] font-bold text-[#1a2d1d] whitespace-nowrap leading-none flex items-center">
                            Affiliate Portal
                        </h2>
                        <p className="w-[239px] h-[16px] text-[12px] text-[#64748b] whitespace-nowrap font-medium leading-none flex items-center">
                            Manage referrals and earnings
                        </p>
                    </div>
                </div>

                {/* Navigation Menu */}
                <div className="flex-1 min-h-0 overflow-y-scroll px-4 space-y-2 custom-scrollbar overflow-x-hidden" data-lenis-prevent>
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activePage === item.name;

                        return (
                            <button
                                key={item.name}
                                onClick={() => {
                                    setActivePage(item.name);
                                    setIsMobileOpen(false);
                                }}
                                title={isDesktopCollapsed ? item.name : ""}
                                className={`
                  flex items-center transition-all duration-300 rounded-lg group relative
                  ${isDesktopCollapsed ? "justify-center w-12 h-12 mx-auto" : "justify-start w-[263px] h-[40px] px-[12px] gap-4 mx-auto"}
                  ${isActive
                                        ? "bg-[#334d3d] text-[#FEF8C3] shadow-sm"
                                        : "text-[#677e73] hover:bg-gray-50 hover:text-[#1a2d1d]"
                                    }
                `}
                            >
                                <Icon
                                    size={isDesktopCollapsed ? 24 : 22}
                                    strokeWidth={isActive ? 2.5 : 2}
                                    className="shrink-0"
                                />
                                <span
                                    className={`text-[14px] font-semibold whitespace-nowrap transition-all duration-200 ${isDesktopCollapsed ? "w-0 opacity-0 overflow-hidden absolute" : "w-auto opacity-100 static"}`}
                                >
                                    {item.name}
                                </span>
                                {item.name === "KYC Verification" && ["pending", "not_started"].includes(kycStatus) && (
                                    <span
                                        className={`ml-auto flex items-center gap-1 text-xs font-bold text-red-500 transition-all duration-200 ${isDesktopCollapsed ? "absolute right-2 shadow-md bg-white p-0.5 rounded-full" : ""}`}
                                        title="KYC Required"
                                    >
                                        <AlertTriangle size={14} strokeWidth={2.5} />
                                        {!isDesktopCollapsed && "KYC"}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Footer and Bottom Actions */}
                <div className="p-6 border-t border-gray-100 space-y-4 bg-[#f8f9fa]/30 shrink-0">
                    <button
                        onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
                        className={`
              hidden lg:flex items-center transition-colors text-[#677e73] hover:text-[#1a2d1d] py-2 mx-auto
              ${isDesktopCollapsed ? "justify-center w-full" : "justify-center gap-3 w-[255px] h-[36px] px-[12px]"}
            `}
                    >
                        {isDesktopCollapsed ? (
                            <ChevronRight size={22} />
                        ) : (
                            <>
                                <ChevronLeft size={20} />
                                <span className="text-[15px] font-bold">Collapse</span>
                            </>
                        )}
                    </button>

                    {/* <button
                        onClick={() => navigate("/dashboard")}
                        className={`
              flex items-center rounded-2xl shadow-sm font-bold transition-all border border-gray-200 text-[#164e4e] bg-[#f8f9fa] hover:bg-white hover:shadow-md
              ${isDesktopCollapsed ? "justify-center w-full h-14" : "justify-center gap-3 w-full px-4 py-4 text-[15px]"}
            `}
                    >
                        <LayoutDashboard size={20} className="text-[#164e4e]" />
                        {!isDesktopCollapsed && (
                            <span className="whitespace-nowrap">User Dashboard</span>
                        )}
                    </button> */}

                    <button
                        onClick={() => navigate("/")}
                        className={`
              flex items-center rounded-lg shadow-sm font-bold transition-all border border-gray-200 text-[#677e73] bg-white hover:bg-gray-50 hover:shadow-md mx-auto
              ${isDesktopCollapsed ? "justify-center w-full h-14" : "justify-center gap-3 w-[255px] h-[36px] px-[12px] text-[14px]"}
            `}
                    >
                        <Home size={20} />
                        {!isDesktopCollapsed && (
                            <span className="whitespace-nowrap">Back to Home</span>
                        )}
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
