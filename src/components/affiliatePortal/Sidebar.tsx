import React from "react";
import {
    LayoutGrid,
    Users,
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
    AlertTriangle,
  LayoutDashboard
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
    isMobileOpen: boolean;
    setIsMobileOpen: (isOpen: boolean) => void;
    isDesktopCollapsed: boolean;
    setIsDesktopCollapsed: (isCollapsed: boolean) => void;
    // New Props to control active page from parent
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
    const menuItems = [
        {
            name: "Dashboard",
            icon: LayoutGrid,
            section: "main",
            path: "/affiliate-portal/affiliate-dashboard",
        },
        {
            name: "Client Management",
            icon: Users2,
            section: "main",
            path: "/affiliate-portal/client-management",
        },
        {
            name: "Revenue Dashboard",
            icon: LineChart,
            section: "main",
            path: "/affiliate-portal/revenue-dashboard",
        },
        {
            name: "Payouts",
            icon: Wallet,
            section: "main",
            path: "/affiliate-portal/payouts",
        },
        {
            name: "Invoices",
            icon: FileText,
            section: "main",
            path: "/affiliate-portal/affiliate-invoices",
        },
        {
            name: "Lead Management",
            icon: Target,
            section: "main",
            path: "/affiliate-portal/lead-management",
        },
        {
            name: "Quotation Generator",
            icon: FileOutput,
            section: "main",
            path: "/affiliate-portal/quotation-generator",
        },
        {
            name: "Marketing Tools",
            icon: Send,
            section: "main",
            path: "/affiliate-portal/marketing-tools",
        },
        {
            name: "Leaderboard",
            icon: Trophy,
            section: "main",
            path: "/affiliate-portal/leaderboard",
        },
        {
            name: "Support",
            icon: MessageSquare,
            section: "main",
            path: "/affiliate-portal/support",
        },
        {
            name: "KYC Verification",
            icon: Shield,
            section: "main",
            path: "/affiliate-portal/kyc",
        },
        {
            name: "Notifications",
            icon: Bell,
            section: "main",
            path: "/affiliate-portal/notifications",
        },
    ];

    const sidebarClasses = `
    fixed top-0 left-0 z-50 h-screen bg-white shadow-xl border-r border-gray-100 flex flex-col transition-all duration-300 ease-in-out
    w-72 
    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
    lg:static lg:translate-x-0 lg:shadow-none
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

            <aside className={sidebarClasses}>
                {/* Header */}
                <div
                    className={`flex flex-col transition-all duration-300 ${isDesktopCollapsed ? "p-4 items-center justify-center" : "p-6 pb-2"}`}
                >
                    <div
                        className={`flex items-center w-full ${isDesktopCollapsed ? "justify-center" : "justify-between"}`}
                    >
                        <div
                            className={`font-bold tracking-tight transition-all duration-300 overflow-hidden whitespace-nowrap ${isDesktopCollapsed ? "text-3xl" : "text-2xl"}`}
                        >
                            {isDesktopCollapsed ? (
                                <span className="text-slate-900">f</span>
                            ) : (
                                <>
                                    <span className="text-slate-900">
                                        flash
                                    </span>
                                    <span className="text-[#5aa39c]">
                                        space
                                    </span>
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

                    <div
                        className={`mt-1 overflow-hidden transition-all duration-300 ${isDesktopCollapsed ? "h-0 opacity-0" : "h-auto opacity-100 mb-6"}`}
                    >
                        <h2 className="text-lg font-bold text-slate-900 whitespace-nowrap">
                            Affiliate Portal
                        </h2>
                        <p className="text-sm text-gray-500 whitespace-nowrap">
                            Manage referrals and earnings
                        </p>
                    </div>
                </div>

                {/* Menu Items */}
                <div className="flex-1 overflow-y-auto px-3 space-y-2 custom-scrollbar overflow-x-hidden">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activePage === item.name; // Use Prop here

                        return (
                            <button
                                key={item.name}
                                onClick={() => {
                                    setActivePage(item.name); // Set Parent State
                                    setIsMobileOpen(false); // Close mobile menu on click
                                }}
                                title={isDesktopCollapsed ? item.name : ""}
                                className={`
                  flex items-center transition-all duration-200 rounded-lg group relative
                  ${isDesktopCollapsed ? "justify-center w-full py-3 px-0" : "justify-start w-full px-4 py-3 gap-3"}
                  ${isActive
                                        ? "bg-[#5aa39c] text-white shadow-sm"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-slate-900"
                                    }
                `}
                            >
                                <Icon
                                    size={isDesktopCollapsed ? 24 : 20}
                                    strokeWidth={isActive ? 2.5 : 2}
                                    className="shrink-0"
                                />
                                <span
                                    className={`whitespace-nowrap transition-all duration-200 ${isDesktopCollapsed ? "w-0 opacity-0 overflow-hidden absolute" : "w-auto opacity-100 static"}`}
                                >
                                    {item.name}
                                </span>
                                {item.name === "KYC Verification" && user && !user.kycVerified && (
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

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 space-y-2 bg-white">
                    <button
                        onClick={() =>
                            setIsDesktopCollapsed(!isDesktopCollapsed)
                        }
                        className={`
              hidden lg:flex items-center transition-colors text-gray-600 hover:text-slate-900 py-2
              ${isDesktopCollapsed ? "justify-center w-full" : "justify-center gap-2 w-full"}
            `}
                    >
                        {isDesktopCollapsed ? (
                            <ChevronRight size={20} />
                        ) : (
                            <>
                                <ChevronLeft size={16} />
                                <span className="text-sm font-medium">
                                    Collapse
                                </span>
                            </>
                        )}
                    </button>

                    <button
                        onClick={() => navigate('/dashboard')}
                        className={`
              flex items-center rounded-xl shadow-sm font-semibold transition-colors bg-teal-50 border border-teal-100 text-teal-700 hover:bg-teal-100
              ${isDesktopCollapsed ? "justify-center w-full p-3" : "justify-center gap-2 w-full px-4 py-3 text-sm"}
            `}
                    >
                        <LayoutDashboard size={18} className="text-teal-600" />
                        {!isDesktopCollapsed && (
                            <span className="whitespace-nowrap">
                                User Dashboard
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className={`
              flex items-center rounded-xl shadow-sm font-semibold transition-colors bg-white border border-gray-200 text-slate-900 hover:bg-gray-50
              ${isDesktopCollapsed ? "justify-center w-full p-3" : "justify-center gap-2 w-full px-4 py-3 text-sm"}
            `}
                    >
                        <Home size={18} />
                        {!isDesktopCollapsed && (
                            <span className="whitespace-nowrap">
                                Back to Home
                            </span>
                        )}
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
