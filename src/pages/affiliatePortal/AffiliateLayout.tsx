import React, { useState, useRef, useEffect } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import {
    LayoutGrid,
    Users,
    LineChart,
    Wallet,
    FileText,
    Target,
    FileOutput,
    Send,
    Trophy,
    MessageSquare,
    Home,
    ChevronLeft,
    ChevronRight,
    X,
    Menu,
    Bell,
    ChevronDown,
    LogOut,
    User,
    Settings,
    Mail,
    Phone,
    ExternalLink,
} from "lucide-react";
import "./portal-animations.css";

const AffiliateLayout = () => {
    // --- State Management ---
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false); // For Topbar Profile Dropdown

    const location = useLocation();
    const navigate = useNavigate();
    const mainRef = useRef<HTMLElement>(null);

    // --- Logic: Active Page Title ---
    const getActivePageFromUrl = () => {
        const path = location.pathname;
        if (path.includes("affiliate-dashboard")) return "Dashboard";
        if (path.includes("booking-management")) return "Booking Management";
        if (path.includes("revenue-dashboard")) return "Revenue Dashboard";
        if (path.includes("payouts")) return "Payouts";
        if (path.includes("affiliate-invoices")) return "Invoices";
        if (path.includes("lead-management")) return "Lead Management";
        if (path.includes("quotation-generator")) return "Quotation Generator";
        if (path.includes("marketing-tools")) return "Marketing Tools";
        if (path.includes("leaderboard")) return "Leaderboard";
        if (path.includes("support")) return "Support";
        if (path.includes("profile")) return "Profile";
        if (path.includes("settings")) return "Account Settings";
        return "Dashboard";
    };

    const activePage = getActivePageFromUrl();

    // --- Logic: Navigation ---
    const handleNavigation = (pageName: string) => {
        const routeMap: Record<string, string> = {
            "Dashboard": "/affiliate-portal/affiliate-dashboard",
            "Booking Management": "/affiliate-portal/booking-management",
            "Revenue Dashboard": "/affiliate-portal/revenue-dashboard",
            "Payouts": "/affiliate-portal/payouts",
            "Invoices": "/affiliate-portal/affiliate-invoices",
            "Lead Management": "/affiliate-portal/lead-management",
            "Quotation Generator": "/affiliate-portal/quotation-generator",
            "Marketing Tools": "/affiliate-portal/marketing-tools",
            "Leaderboard": "/affiliate-portal/leaderboard",
            "Support": "/affiliate-portal/support",
        };
        navigate(routeMap[pageName] || "/affiliate-portal/dashboard");
        setIsMobileOpen(false); // Close mobile menu on navigate
    };

    // --- Logic: Scroll to Top ---
    const handleScrollToTop = () => {
        if (mainRef.current) {
            mainRef.current.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    };

    // --- Effect: Scroll to Top on Page Change ---
    useEffect(() => {
        if (mainRef.current) {
            mainRef.current.scrollTop = 0;
        }
    }, [location.pathname]);

    // --- Sidebar Menu Items ---
    const menuItems = [
        { name: "Dashboard", icon: LayoutGrid, path: "/affiliate-portal/affiliate-dashboard" },
        { name: "Booking Management", icon: Users, path: "/affiliate-portal/booking-management" },
        { name: "Revenue Dashboard", icon: LineChart, path: "/affiliate-portal/revenue-dashboard" },
        { name: "Payouts", icon: Wallet, path: "/affiliate-portal/payouts" },
        { name: "Invoices", icon: FileText, path: "/affiliate-portal/affiliate-invoices" },
        { name: "Lead Management", icon: Target, path: "/affiliate-portal/lead-management" },
        { name: "Quotation Generator", icon: FileOutput, path: "/affiliate-portal/quotation-generator" },
        { name: "Marketing Tools", icon: Send, path: "/affiliate-portal/marketing-tools" },
        { name: "Leaderboard", icon: Trophy, path: "/affiliate-portal/leaderboard" },
        { name: "Support", icon: MessageSquare, path: "/affiliate-portal/support" },
    ];

    const sidebarClasses = `
    fixed top-0 left-0 z-50 h-full max-h-screen bg-white shadow-xl border-r border-gray-100 flex flex-col transition-all duration-300 ease-in-out
    w-72 overflow-hidden
    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
    lg:static lg:translate-x-0 lg:shadow-none
    ${isDesktopCollapsed ? "lg:w-20" : "lg:w-72"}
  `;

    return (
        <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans">
            {/* --- INLINE SIDEBAR --- */}
            <>
                {isMobileOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                        onClick={() => setIsMobileOpen(false)}
                    />
                )}

                <aside className={sidebarClasses}>
                    {/* Sidebar Header */}
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
                                        <span className="text-slate-900">flash</span>
                                        <span className="text-[#5aa39c]">space</span>
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

                    {/* Sidebar Menu Items */}
                    <div
                        className="flex-1 overflow-y-auto px-3 space-y-2 custom-scrollbar overflow-x-hidden"
                        data-lenis-prevent
                    >
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activePage === item.name;

                            return (
                                <button
                                    key={item.name}
                                    onClick={() => handleNavigation(item.name)}
                                    title={isDesktopCollapsed ? item.name : ""}
                                    className={`
                  flex items-center transition-all duration-200 rounded-lg group relative
                  ${isDesktopCollapsed ? "justify-center w-full py-3 px-0" : "justify-start w-full px-4 py-3 gap-3"}
                  ${
                                        isActive
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
                                </button>
                            );
                        })}
                    </div>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-gray-100 space-y-2 bg-white">
                        <button
                            onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
                            className={`
              hidden lg:flex items-center transition-colors text-gray-600 hover:text-slate-900 py-2  hover:bg-[#e59e4e] rounded-lg
              ${isDesktopCollapsed ? "justify-center w-full" : "justify-center gap-2 w-full"}
            `}
                        >
                            {isDesktopCollapsed ? (
                                <ChevronRight size={20} />
                            ) : (
                                <>
                                    <ChevronLeft size={16} />
                                    <span className="text-sm font-medium">Collapse</span>
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => setIsMobileOpen(false)}
                            className="lg:hidden w-full flex items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:text-slate-900 py-2"
                        >
                            <ChevronLeft size={16} />
                            <span>Close Menu</span>
                        </button>

                        <button
                            className={`
              flex items-center rounded-xl shadow-sm font-semibold transition-colors bg-white border border-gray-200 text-slate-900 hover:bg-[#e59e4e] rounded-lg 
              ${isDesktopCollapsed ? "justify-center w-full p-3" : "justify-center gap-2 w-full px-4 py-3 text-sm"}
            `}
                        >
                            <Home size={18} />
                            {!isDesktopCollapsed && (
                                <span className="whitespace-nowrap ">Back to Home</span>
                            )}
                        </button>
                    </div>
                </aside>
            </>

            {/* --- MAIN LAYOUT AREA --- */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                
                {/* --- INLINE TOPBAR --- */}
                <header className="m-3 sm:m-4 lg:m-6 mb-0 bg-white border border-gray-100 shadow-sm rounded-2xl h-14 sm:h-16 lg:h-20 flex items-center justify-between px-3 sm:px-4 lg:px-8 shrink-0 z-40">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button
                            onClick={() => setIsMobileOpen(true)}
                            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <Menu size={24} />
                        </button>

                        {/* Dynamic Heading */}
                        <div className="flex flex-col">
                            <h1 className="text-base sm:text-lg lg:text-2xl font-extrabold text-slate-900">
                                {activePage.split(' ').slice(0, -1).join(' ')}
                                <span className={`text-[#5aa39c] italic  font-extrabold ${activePage.split(' ').length > 1 ? 'ml-1' : ''}`}>
                                    {activePage.split(' ').slice(-1)}
                                </span>
                            </h1>
                            <p className="text-xs text-gray-500 hidden sm:block">
                                Manage your {activePage.toLowerCase()} and performance
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2 lg:gap-5">
                        {/* Notifications */}
                        <button className="relative p-2.5 text-gray-500 hover:bg-gray-50 hover:text-[#5aa39c] rounded-xl transition-all border border-transparent hover:border-gray-100">
                            <Bell size={22} />
                            <span className="absolute top-2 right-2 bg-[#5aa39c] w-2.5 h-2.5 rounded-full border-2 border-white"></span>
                        </button>

                        {/* User Profile Dropdown */}
                        <div className="relative pl-1.5 sm:pl-2 lg:pl-5 border-l border-gray-100">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 sm:gap-3 group"
                            >
                                <div className="h-8 w-8 sm:h-10 sm:w-10 bg-[#5aa39c]/10 text-[#5aa39c] rounded-lg sm:rounded-xl flex items-center justify-center font-bold border border-[#5aa39c]/20 group-hover:bg-[#5aa39c] group-hover:text-white transition-all duration-300 text-xs sm:text-base">
                                    S
                                </div>
                                <div className="flex flex-col items-start hidden md:flex">
                                    <span className="text-sm font-bold text-slate-900 leading-tight">Space Admin</span>
                                    <span className="text-[11px] text-gray-500">admin@flashspace.co</span>
                                </div>
                                <ChevronDown
                                    size={16}
                                    className={`hidden md:block text-gray-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`}
                                />
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setIsProfileOpen(false)}
                                    ></div>
                                    <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 shadow-xl rounded-2xl py-2 z-20 animate-in fade-in zoom-in duration-200 origin-top-right">
                                        <div className="px-4 py-3 border-b border-gray-50 mb-1">
                                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Signed in as</p>
                                            <p className="text-sm font-semibold text-slate-900 truncate">admin@flashspace.co</p>
                                        </div>

                                        <button 
                                            onClick={() => {
                                                navigate("/affiliate-portal/profile");
                                                setIsProfileOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#5aa39c] transition-colors"
                                        >
                                            <User size={16} /> My Profile
                                        </button>
                                        <button 
                                            onClick={() => {
                                                navigate("/affiliate-portal/settings");
                                                setIsProfileOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#5aa39c] transition-colors"
                                        >
                                            <Settings size={16} /> Account Settings
                                        </button>

                                        <div className="h-px bg-gray-50 my-1"></div>

                                        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium">
                                            <LogOut size={16} /> Logout
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <main
                    ref={mainRef}
                    className="flex-1 overflow-y-auto flex flex-col"
                    data-lenis-prevent
                >
                    {/* Page Content Area */}
                    <div className="flex-1 px-4 lg:px-8 py-2 md:py-4">
                        <Outlet />
                    </div>

                    {/* --- INLINE FOOTER --- */}
                    <footer className="bg-white border border-gray-100 shadow-sm rounded-2xl mx-4 lg:mx-6 mb-6 p-6 lg:p-12 mt-auto">
                        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                            {/* Branding */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-1 font-bold text-2xl">
                                    <span className="text-slate-900">flash</span>
                                    <span className="text-[#5aa39c]">space</span>
                                </div>
                                <p className="text-gray-500 text-sm">Space Partner Portal</p>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium border border-emerald-100">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    All systems operational
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div>
                                <h4 className="font-bold text-slate-900 mb-4">Quick Links</h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>
                                        <Link to="/affiliate-portal/affiliate-dashboard" className="hover:text-[#5aa39c] transition-colors">
                                            Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/affiliate-portal/booking-management" className="hover:text-[#5aa39c] transition-colors">
                                            Booking Management
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/affiliate-portal/revenue-dashboard " className="hover:text-[#5aa39c] transition-colors">
                                            Revenue Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/affiliate-portal/payouts" className="hover:text-[#5aa39c] transition-colors">
                                            Payouts
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/affiliate-portal/affiliate-invoices" className="hover:text-[#5aa39c] transition-colors">
                                            Invoices
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/affiliate-portal/lead-management" className="hover:text-[#5aa39c] transition-colors">
                                            Leads Management
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/affiliate-portal/quotation-generator" className="hover:text-[#5aa39c] transition-colors">
                                            Quotation Generator
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/affiliate-portal/marketing-tools" className="hover:text-[#5aa39c] transition-colors">
                                            Marketing Tools
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/affiliate-portal/leader-board" className="hover:text-[#5aa39c] transition-colors">
                                            Leader Board
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/affiliate-portal/support" className="hover:text-[#5aa39c] transition-colors">
                                            Support
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Resources */}
                            <div>
                                <h4 className="font-bold text-slate-900 mb-4">Resources</h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="hover:text-[#5aa39c] cursor-pointer transition-colors">Notifications</li>
                                    <li className="hover:text-[#5aa39c] cursor-pointer transition-colors">Profile</li>
                                    <li
                                        onClick={handleScrollToTop}
                                        className="hover:text-[#5aa39c] cursor-pointer flex items-center gap-1 transition-colors"
                                    >
                                        Back to top <ExternalLink size={12} />
                                    </li>
                                </ul>
                            </div>

                            {/* Support */}
                            <div>
                                <h4 className="font-bold text-slate-900 mb-4">Support</h4>
                                <div className="space-y-3">
                                    <a href="mailto:support@flashspace.co" className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-[#5aa39c]/30 hover:bg-gray-50 transition-all group">
                                        <Mail size={18} className="text-gray-400 group-hover:text-[#5aa39c]" />
                                        <span className="text-sm text-gray-600">support@flashspace.co</span>
                                    </a>
                                    <a href="tel:+919999999999" className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-[#5aa39c]/30 hover:bg-gray-50 transition-all group">
                                        <Phone size={18} className="text-gray-400 group-hover:text-[#5aa39c]" />
                                        <span className="text-sm text-gray-600">+91 99999 99999</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
                            <p className="text-sm text-gray-400">
                                © 2026 <span className="font-semibold text-gray-600">flashspace</span>. All rights reserved.
                            </p>
                            <p className="text-[10px] font-medium text-gray-300 tracking-widest uppercase">
                                Space Partner Portal • v1.0
                            </p>
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
};

export default AffiliateLayout;