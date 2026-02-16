import { useState, useEffect, useRef, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { smoothScrollTo } from "@/lib/lenis";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ModernFlairButton from "@/components/ui/ModernFlairButton";
import { Phone, Building2, Users, Zap, FileText, ArrowRight, LayoutDashboard, LogOut, User as UserIcon, Settings, ChevronDown, X, Sun, Moon } from "lucide-react";
import { CiMenuFries } from "react-icons/ci";
import SidebarMenu from "@/components/SidebarMenu";
import { useAuth } from "@/contexts/AuthContext";
import { useDarkMode } from "@/contexts/DarkModeContext";
import GetInTouch from "@/pages/GetInTouch";
import { LoginModal } from "@/components/auth/LoginModal";
import { SignupModal } from "@/components/auth/SignupModal";
import { NotificationBell } from "@/components/NotificationBell";

// ✅ Country Data
const countries = [
    { code: "IND", name: "India", flag: "https://flagdownload.com/wp-content/uploads/Flag_of_India_Flat_Round-128x128.png" },
    { code: "USA", name: "United States", flag: "https://flagdownload.com/wp-content/uploads/Flag_of_United_States_Flat_Round-128x128.png" },
    { code: "UK", name: "United Kingdom", flag: "https://flagdownload.com/wp-content/uploads/Flag_of_United_Kingdom_Flat_Round-128x128.png" },
    { code: "UAE", name: "United Arab Emirates", flag: "https://flagdownload.com/wp-content/uploads/Flag_of_United_Arab_Emirates_Flat_Round-128x128.png" },
    { code: "CAN", name: "Canada", flag: "https://flagdownload.com/wp-content/uploads/Flag_of_Canada_Flat_Round-128x128.png" },
    { code: "AUS", name: "Australia", flag: "https://flagdownload.com/wp-content/uploads/Flag_of_Australia_Flat_Round-128x128.png" },
    { code: "GER", name: "Germany", flag: "https://flagdownload.com/wp-content/uploads/Flag_of_Germany_Flat_Round-128x128.png" },
    { code: "FRA", name: "France", flag: "https://flagdownload.com/wp-content/uploads/Flag_of_France_Flat_Round-128x128.png" },
    { code: "JPN", name: "Japan", flag: "https://flagdownload.com/wp-content/uploads/Flag_of_Japan_Flat_Round-128x128.png" },
    { code: "SGP", name: "Singapore", flag: "https://flagdownload.com/wp-content/uploads/Flag_of_Singapore_Flat_Round-128x128.png" },
];

const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
    { label: 'About', ariaLabel: 'Learn about us', link: '/about' },
    { label: 'Services', ariaLabel: 'View our services', link: '/services' },
    { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' }
];

interface HeaderProps {
    forceWhiteBackground?: boolean;
    lightText?: boolean;
    loginBlack?: boolean;
    openLogin?: boolean;
    openSignup?: boolean;
}

const Header = ({ forceWhiteBackground = false, lightText = false, loginBlack = false, openLogin = false, openSignup = false }: HeaderProps): ReactNode => {
    const { darkMode, toggleDarkMode } = useDarkMode();
    const navigate = useNavigate();
    const location = useLocation(); // Add checks for current route
    const { isAuthenticated, user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Dropdowns
    const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    // Country drill dropdown
    const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(countries[0]);

    // Popup contact form
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(openLogin);
    const [isSignupOpen, setIsSignupOpen] = useState(openSignup);

    // Ref helpers for closing modals with redirection
    const closeLogin = () => {
        setIsLoginOpen(false);
        if (location.pathname === '/login') {
            navigate('/');
        }
    };

    const closeSignup = () => {
        setIsSignupOpen(false);
        if (location.pathname === '/signup') {
            navigate('/');
        }
    };


    // Sync props to state
    useEffect(() => {
        setIsLoginOpen(openLogin);
    }, [openLogin]);

    useEffect(() => {
        setIsSignupOpen(openSignup);
    }, [openSignup]);

    const solutionsRef = useRef<HTMLDivElement>(null);
    const moreRef = useRef<HTMLDivElement>(null);
    const countryRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (solutionsRef.current && !solutionsRef.current.contains(event.target as Node)) {
                setIsSolutionsOpen(false);
            }
            if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
                setIsMoreOpen(false);
            }
            if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
                setCountryDropdownOpen(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleNavigation = (href: string) => {
        if (href.startsWith("#")) {
            try {
                smoothScrollTo(href, { offset: -90 });
            } catch {
                const element = document.querySelector(href);
                element?.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        } else {
            navigate(href);
        }
        setIsMenuOpen(false);
    };

    return (
        <>
            <header
                className={cn(
                    "fixed top-0 w-full z-[100] transition-all duration-300 text-md",
                    scrolled || forceWhiteBackground
                        ? "bg-white dark:bg-[#0a0a0a] border-b border-border dark:border-white/10 shadow-sm"
                        : "bg-transparent"
                )}
            >
                <div className="w-full px-4 py-3">
                    <div className="flex items-center">
                        {/* Menu Button */}
                        <button
                            className="p-2 rounded-md hover:bg-black/5 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-black/20 flex-shrink-0 -ml-2"
                            aria-label="Open menu"
                            aria-expanded={isMenuOpen}
                            aria-controls="flashspace-fullmenu"
                            onClick={() => setIsMenuOpen(true)}
                        >
                            <CiMenuFries className="h-6 w-6 text-black dark:text-white" />
                        </button>

                        {/* Logo */}
                        <div
                            className="text-xl font-bold tracking-tight cursor-pointer w-60 flex-shrink-0 ml-2"
                            onClick={() => handleNavigation("/")}
                        >
                            <img
                                src="https://cdn.prod.website-files.com/664330484432dcdd6519a8fd/665dd8e0007de68a44f3750b_Black%20and%20White%20Bold%20Typography%20Clothing%20Brand%20Logo%20(940%20x%20400%20px)%20(940%20x%20200%20px)%20(940%20x%20150%20px).png"
                                alt="FlashSpace Logo"
                                className="h-8 w-auto dark:invert"
                            />
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center justify-center space-x-8 mx-8 flex-1">
                            {/* === Get Workspaces Dropdown === */}
                            <div ref={solutionsRef} className="relative">
                                <button
                                    className={`group flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-[#164e4e] hover:text-[#D96832] transition-all duration-300 hover:bg-[#164e4e]/5 dark:hover:bg-blue-900/30 rounded-lg ${(scrolled || forceWhiteBackground) ? "dark:text-gray-300 dark:hover:text-white" : "dark:text-gray-100 dark:hover:text-white"}`}
                                    onMouseEnter={() => setIsSolutionsOpen(true)}
                                    onClick={()=>setIsSolutionsOpen(false)}
                                >
                                    <span className="relative">
                                        Get Workspaces
                                    </span>
                                    <ChevronDown
                                        className={`w-4 h-4 text-[#164e4e]/70 transition-transform duration-300 group-hover:text-[#D96832] ${isSolutionsOpen ? "rotate-180" : ""}`}
                                    />
                                </button>

                                {/* Dropdown Menu */}
                                <div
                                    className={`absolute left-1/2 top-full w-[600px] bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/10 rounded-lg shadow-xl z-50 mt-2 transition-all duration-300 ${isSolutionsOpen
                                        ? "opacity-100 pointer-events-auto translate-y-0"
                                        : "opacity-0 pointer-events-none -translate-y-2"
                                        }`}
                                    style={{
                                        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                                        transform: "translateX(-50%)",
                                    }}
                                >
                                    <div className="p-4 grid grid-cols-2 gap-4"
                                    onMouseLeave={()=>setIsSolutionsOpen(false)}>
                                        <div className="border border-gray-100 dark:border-white/10 rounded-lg p-4 bg-[#f8faf9] dark:bg-white/5">
                                            <div className="flex items-center gap-2 mb-1 cursor-pointer" onClick={() => { handleNavigation("/Solutions/on-demand"); setIsSolutionsOpen(false); }}>
                                                <Zap className="w-4 h-4 text-[#D96832]" />
                                                <h4 className="text-sm font-bold text-[#164e4e] hover:text-[#D96832] transition-colors dark:text-gray-100">On-Demand</h4>
                                            </div>
                                            <p className="text-xs text-[#164e4e]/70 dark:text-gray-400 mb-3">Book by the hour or day</p>
                                            {[
                                                { label: "Meeting Rooms", type: "meeting-room", href: "/Solutions/meetingsroom" },
                                                { label: "Event Space", type: "training-room", href: "/Solutions/eventspace" },
                                                { label: "Day Offices", type: "day-office", href: "/Solutions/day-office" },
                                            ].map((item) => (
                                                <button
                                                    key={item.type}
                                                    className="flex items-center justify-between text-left text-sm px-3 py-2 rounded-md hover:bg-white dark:hover:bg-gray-800 text-[#164e4e] dark:text-gray-200 transition-colors shadow-sm mb-2"
                                                    onClick={() => {
                                                        handleNavigation(item.href);
                                                        setIsSolutionsOpen(false);
                                                    }}
                                                >
                                                    {item.label}
                                                    <ArrowRight className="w-4 h-4 text-[#164e4e]/40" />
                                                </button>
                                            ))}
                                        </div>

                                        <div className="grid gap-3">
                                            {[
                                                {
                                                    icon: Building2,
                                                    title: "Virtual Office",
                                                    desc: "Business address, mail handling, call forwarding",
                                                    href: "/Solutions/virtual-office",
                                                },
                                                {
                                                    icon: Users,
                                                    title: "Coworking Space",
                                                    desc: "Flexible desks, private cabins, team suites",
                                                    href: "/Solutions/coworking-space",
                                                },
                                                {
                                                    icon: FileText,
                                                    title: "Business Setup",
                                                    desc: "Company registration, GST, compliance",
                                                    href: "/Solutions/business-setup",
                                                },
                                            ].map(({ icon: Icon, title, desc, href }) => (
                                                <div
                                                    key={title}
                                                    className="flex items-start gap-3 p-4 rounded-lg border border-transparent hover:border-gray-100 hover:shadow-md hover:bg-white dark:hover:bg-gray-800 cursor-pointer transition-all"
                                                    onClick={() => {
                                                        handleNavigation(href);
                                                        setIsSolutionsOpen(false);
                                                    }}
                                                >
                                                    <Icon className="w-5 h-5 text-[#D96832] mt-0.5" />
                                                    <div>
                                                        <h5 className="text-sm font-bold text-[#164e4e] dark:text-gray-100">{title}</h5>
                                                        <p className="text-xs text-[#164e4e]/70 dark:text-gray-400 mt-1">{desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Partner with Us */}
                            <button
                                onClick={() => handleNavigation("/partner")}
                                className={`group relative px-3 py-2 text-sm font-bold text-[#164e4e] hover:text-[#D96832] transition-all duration-300 hover:bg-[#164e4e]/5 dark:hover:bg-blue-900/30 rounded-lg ${(scrolled || forceWhiteBackground) ? "dark:text-gray-300 dark:hover:text-white" : "dark:text-gray-100 dark:hover:text-white"}`}
                            >
                                <span className="relative">
                                    Partner with Us
                                </span>
                            </button>

                            {/* === More Dropdown === */}
                            <div ref={moreRef} className="relative">
                                <button
                                    className={`group flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-[#164e4e] hover:text-[#D96832] transition-all duration-300 hover:bg-[#164e4e]/5 dark:hover:bg-blue-900/30 rounded-lg ${(scrolled || forceWhiteBackground) ? "dark:text-gray-300 dark:hover:text-white" : "dark:text-gray-100 dark:hover:text-white"}`}
                                    onMouseEnter={() => setIsMoreOpen(true)}
                                    onClick={()=>setIsMoreOpen(false)}
                                >
                                    <span className="relative">
                                        More
                                    </span>
                                    <ChevronDown
                                        className={`w-4 h-4 text-[#164e4e]/70 transition-transform duration-300 group-hover:text-[#D96832] ${isMoreOpen ? "rotate-180" : ""}`}
                                    />
                                </button>

                                {isMoreOpen && (
                                    <ul className="absolute bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/10 rounded-md shadow-lg mt-2 w-40 py-2 z-50"
                                    onMouseLeave={()=>setIsMoreOpen(false)}>
                                        {[
                                            { label: "About Us", href: "/about" },
                                            { label: "Career", href: "/career" },
                                            { label: "Blog", href: "/blog" },
                                        ].map((item) => (
                                            <li key={item.label}>
                                                <button
                                                    className="w-full text-left px-4 py-2 text-sm font-medium text-[#164e4e] hover:bg-gray-50 hover:text-[#D96832] dark:hover:bg-gray-800 dark:text-gray-200 transition-colors"
                                                    onClick={() => {
                                                        handleNavigation(item.href);
                                                        setIsMoreOpen(false);
                                                    }}
                                                >
                                                    {item.label}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </nav>

                        {/* Right Buttons */}
                        <div className="flex items-center space-x-4 ml-auto">
                            {/* ===== Country Dropdown Button (flag + code only, no bold) ===== */}
                            <div ref={countryRef} className="hidden lg:block relative">
                                <button
                                    className="flex items-center px-3 py-2 rounded-full border border-gray-200 dark:border-white/10 text-[#164e4e] dark:text-white gap-2 focus:outline-none bg-white dark:bg-black/50 hover:bg-white dark:hover:bg-white/10 hover:shadow-sm transition-all duration-300"
                                    onClick={() => setCountryDropdownOpen((prev) => !prev)}
                                    aria-haspopup="listbox"
                                    aria-expanded={countryDropdownOpen}
                                >
                                    <img src={selectedCountry.flag} alt={selectedCountry.code} className="h-5 w-5 rounded-full object-cover ring-1 ring-gray-100" />
                                    <span className="text-sm font-medium">{selectedCountry.code}</span>
                                    <ChevronDown
                                        className={`w-3.5 h-3.5 text-[#164e4e]/70 transition-transform duration-300 ${countryDropdownOpen ? "rotate-180" : ""}`}
                                    />
                                </button>
                                {countryDropdownOpen && (
                                    <ul
                                        className="absolute left-0 top-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 min-w-[110px] py-1"
                                        role="listbox"
                                    >
                                        {countries.map((country) => (
                                            <li key={country.code}>
                                                <button
                                                    className={`flex items-center w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 gap-2 text-sm text-[#164e4e] dark:text-gray-200 transition-colors`}
                                                    onClick={() => {
                                                        setSelectedCountry(country);
                                                        setCountryDropdownOpen(false);
                                                    }}
                                                    role="option"
                                                    aria-selected={selectedCountry.code === country.code}
                                                >
                                                    <img src={country.flag} alt={country.code} className="h-5 w-5 rounded-full" />
                                                    <span>{country.code}</span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            {/* ===== End Country Dropdown Button ===== */}

                            {/* Dark Mode Toggle */}
                            <button
                                onClick={toggleDarkMode}
                                className="hidden lg:flex items-center justify-center p-2 rounded-full border border-gray-200 dark:border-white/10 text-[#164e4e] dark:text-gray-300 bg-white dark:bg-black/50 hover:bg-white dark:hover:bg-white/10 hover:shadow-sm transition-all duration-300"
                                aria-label="Toggle Dark Mode"
                            >
                                {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
                            </button>



                            <ModernFlairButton
                                onClick={() => setIsContactOpen(true)}
                                className="hidden lg:inline-flex group px-6 py-2.5 bg-[#D96832] text-white text-sm font-bold rounded-full transition-all duration-300 hover:shadow-lg hover:bg-[#c25626] border border-white/10 active:scale-95 overflow-hidden"
                                flairColor="rgba(255, 255, 255, 0.2)"
                            >
                                <span className="relative flex items-center gap-2">
                                    Get in Touch
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                </span>
                            </ModernFlairButton>

                            {/* Notification Bell */}
                            {isAuthenticated && (
                                <div className="hidden lg:block">
                                    <NotificationBell />
                                </div>
                            )}

                            {/* User Authentication - Profile Dropdown or Login */}
                            {isAuthenticated ? (
                                <div ref={userMenuRef} className="relative hidden lg:block">
                                    <button
                                        onClick={() => setIsUserMenuOpen((prev) => !prev)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 border border-gray-200 bg-white"
                                    >
                                        {/* User Avatar */}
                                        <div className="w-8 h-8 rounded-full bg-[#164e4e] flex items-center justify-center text-white font-semibold text-sm shadow-md">
                                            {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        {/* User Name */}
                                        <span className="text-sm font-medium text-[#164e4e] max-w-[120px] truncate">
                                            {user?.fullName || 'User'}
                                        </span>
                                        {/* Dropdown Icon */}
                                        <ChevronDown
                                            className={cn(
                                                "h-4 w-4 text-[#164e4e]/70 transition-transform duration-200",
                                                isUserMenuOpen && "rotate-180"
                                            )}
                                        />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                            {/* User Info Header */}
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="text-sm font-semibold text-gray-900 truncate">
                                                    {user?.fullName}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {user?.email}
                                                </p>
                                                <div className="mt-1.5 flex flex-wrap gap-1">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${user?.role === 'partner' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                                                        {user?.role}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Menu Items */}
                                            <div className="py-1">
                                                {/* Admin Dashboard Button */}
                                                {user?.role === 'admin' && (
                                                    <button
                                                        onClick={() => {
                                                            navigate("/admin");
                                                            setIsUserMenuOpen(false);
                                                        }}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-purple-700 hover:bg-purple-50 hover:text-purple-800 transition-colors duration-150"
                                                    >
                                                        <LayoutDashboard className="h-4 w-4" />
                                                        <span className="">Admin Dashboard</span>
                                                    </button>
                                                )}

                                                {/* Partner Portal Button */}
                                                {user?.role === 'partner' && (
                                                    <button
                                                        onClick={() => {
                                                            navigate("/spaceportal");
                                                            setIsUserMenuOpen(false);
                                                        }}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-50 hover:text-amber-800 transition-colors duration-150"
                                                    >
                                                        <Building2 className="h-4 w-4" />
                                                        <span className="">Your Space Portal</span>
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => {
                                                        handleNavigation("/dashboard");
                                                        setIsUserMenuOpen(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                                                >
                                                    <LayoutDashboard className="h-4 w-4" />
                                                    <span className="font-medium">Dashboard</span>
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        handleNavigation("/dashboard/profile");
                                                        setIsUserMenuOpen(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                                                >
                                                    <UserIcon className="h-4 w-4" />
                                                    <span className="font-medium">My Profile</span>
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        handleNavigation("/settings");
                                                        setIsUserMenuOpen(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                                                >
                                                    <Settings className="h-4 w-4" />
                                                    <span className="font-medium">Settings</span>
                                                </button>
                                            </div>

                                            {/* Logout Section */}
                                            <div className="border-t border-gray-100 pt-1">
                                                <button
                                                    onClick={async () => {
                                                        await logout();
                                                        setIsUserMenuOpen(false);
                                                        handleNavigation("/");
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                                                >
                                                    <LogOut className="h-4 w-4" />
                                                    <span className="font-medium">Logout</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <ModernFlairButton
                                    onClick={() => navigate('/login')}
                                    className="hidden lg:inline-flex group px-6 py-2.5 bg-white text-[#164e4e] text-sm font-bold rounded-full border border-[#164e4e]/20 transition-all duration-300 hover:bg-[#164e4e] hover:text-white hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
                                    flairColor="rgba(255, 255, 255, 0.1)"
                                >
                                    <span className="flex items-center gap-2">
                                        <UserIcon className="w-3.5 h-3.5" />
                                        Log in
                                    </span>
                                </ModernFlairButton>
                            )}
                        </div>
                    </div>

                    {/* SidebarMenu */}
                    <SidebarMenu
                        isOpen={isMenuOpen}
                        onClose={() => setIsMenuOpen(false)}
                        onOpenLogin={() => navigate('/login')}
                    />
                </div>
            </header>

            {/* === Contact Popup === */}
            {isContactOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all">
                    {/* ... (existing contact popup content) ... */}
                    <div className="flex flex-col md:flex-row gap-10 w-[95%] max-w-5xl items-start justify-center">
                        {/* ====== LEFT SIDE CARDS ====== */}
                        <div className="flex flex-col gap-5 w-full md:w-[45%]">
                            {/* Card 1 - Support */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 hover:shadow-xl transition">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    Support
                                </h3>
                                <p className="text-sm text-gray-600 mt-2">
                                    Need technical help or facing issues with our platform? Our support team is here 24×7 to assist you with queries and troubleshooting.
                                </p>
                                <p className="text-sm text-gray-600 mt-2">
                                    <strong>Support Mail:</strong>&nbsp;
                                    <a href="mailto:support@flashspace.co" className="text-blue-600 hover:underline">
                                        support@flashspace.co
                                    </a>
                                </p>
                            </div>
                            {/* Card 2 - Sales */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 hover:shadow-xl transition">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    Sales
                                </h3>
                                <p className="text-sm text-gray-600 mt-2">
                                    Want to explore FlashSpace solutions for your business? Our sales experts will help you find the right plan and growth strategy.
                                </p>
                                <p className="text-sm text-gray-600 mt-2">
                                    <strong>Sales Mail:</strong>&nbsp;
                                    <a href="mailto:sales@flashspace.co" className="text-blue-600 hover:underline">
                                        sales@flashspace.co
                                    </a>
                                </p>
                                <p className="text-sm text-gray-600">
                                    <strong>Contact:</strong> 8100888777
                                </p>
                            </div>
                            {/* Card 3 - Partnership */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 hover:shadow-xl transition">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    Partnership
                                </h3>
                                <p className="text-sm text-gray-600 mt-2">
                                    Interested in collaborating or becoming a FlashSpace partner? Let’s innovate together and build future-ready digital solutions.
                                </p>
                                <p className="text-sm text-gray-600 mt-2">
                                    <strong>Partnership Mail:</strong>&nbsp;
                                    <a href="mailto:partner@flashspace.co " className="text-blue-600 hover:underline">
                                        partner@flashspace.co
                                    </a>
                                </p>
                            </div>
                        </div>
                        {/* ====== RIGHT SIDE FORM ====== */}
                        <div className="bg-white rounded-2xl shadow-2xl w-full md:w-[45%] p-8 relative animate-fade-in">
                            <button
                                onClick={() => setIsContactOpen(false)}
                                className="absolute top-3 right-3 p-2 text-gray-500 hover:text-black transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <h2 className="text-xl font-bold mb-4 text-center">
                                <span className="text-black">Get in </span>
                                <span className="text-yellow-500">Touch</span>
                            </h2>
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="Your Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Phone Number </label>
                                    <input
                                        type="tel"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="+91 9876543210"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="you@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Message</label>
                                    <textarea
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="How can we help?"
                                        rows={4}
                                    ></textarea>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-yellow-500 text-black py-2 rounded-md font-semibold hover:bg-yellow-400 transition"
                                >
                                    Send Message
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* === Login Modal === */}
            <LoginModal isOpen={isLoginOpen} onClose={closeLogin} />

            {/* === Signup Modal === */}
            <SignupModal isOpen={isSignupOpen} onClose={closeSignup} />
        </>
    );
};


export default Header;
