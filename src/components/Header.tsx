import { useState, useEffect, useRef, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import { PartnerChoiceModal } from "@/components/auth/PartnerChoiceModal";
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
    const [isPartnerChoiceOpen, setIsPartnerChoiceOpen] = useState(false);
    const [signupRole, setSignupRole] = useState<'user' | 'partner' | 'affiliate'>('user');

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
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        } else {
            navigate(href);
        }
        setIsMenuOpen(false);
    };

    const openPartnerSignup = (role: 'partner' | 'affiliate') => {
        setSignupRole(role);
        setIsPartnerChoiceOpen(false);
        setIsSignupOpen(true);
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
                                    onClick={() => setIsSolutionsOpen(false)}
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
                                        onMouseLeave={() => setIsSolutionsOpen(false)}>
                                        <div className="border border-gray-100 dark:border-white/10 rounded-lg p-4 bg-[#f8faf9] dark:bg-white/5">
                                            <div className="flex items-center gap-2 mb-1 cursor-pointer" onClick={() => { handleNavigation("/Solutions/on-demand"); setIsSolutionsOpen(false); }}>
                                                <Zap className="w-4 h-4 text-[#D96832]" />
                                                <h4 className="text-sm font-bold text-[#164e4e] hover:text-[#D96832] transition-colors dark:text-gray-100">On-Demand</h4>
                                            </div>
                                            <p className="text-xs text-[#164e4e]/70 dark:text-gray-400 mb-3">Book by the hour or day</p>
                                            {[
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
                                    onClick={() => setIsMoreOpen(false)}
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
                                        onMouseLeave={() => setIsMoreOpen(false)}>
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
                                                {(user?.role === 'partner' || user?.role === 'affiliate') && (
                                                    <button
                                                        onClick={() => {
                                                            navigate(user?.role === 'partner' ? "/spaceportal" : "/affiliate-portal");
                                                            setIsUserMenuOpen(false);
                                                        }}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-50 hover:text-amber-800 transition-colors duration-150"
                                                    >
                                                        <Building2 className="h-4 w-4" />
                                                        <span className="">{user?.role === 'partner' ? "Your Space Portal" : "Affiliate Portal"}</span>
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
                                <div className="flex items-center gap-3">
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

                                    <ModernFlairButton
                                        onClick={() => setIsPartnerChoiceOpen(true)}
                                        className="hidden lg:inline-flex group px-6 py-2.5 bg-[#EDB003] text-white text-sm font-bold rounded-full transition-all duration-300 hover:shadow-lg hover:bg-[#d99f03] border border-white/10 active:scale-95"
                                        flairColor="rgba(255, 255, 255, 0.2)"
                                    >
                                        <span className="flex items-center gap-2">
                                            <Building2 className="w-3.5 h-3.5" />
                                            Become a Partner
                                        </span>
                                    </ModernFlairButton>
                                </div>
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
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6" style={{ fontFamily: '"Inner Tight", system-ui, sans-serif' }}>
                    
                    {/* Background overlay */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsContactOpen(false)}
                    />

                    {/* Modal card */}
                    <div
                        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row z-10 max-h-[90vh] overflow-y-auto"
                    >
                        {/* Left Column - Contact Info */}
                        <div className="w-full md:w-[45%] p-4 md:p-6 flex flex-col gap-3 border-b md:border-b-0 md:border-r border-slate-100">
                            
                            {/* Support */}
                            <div className="bg-[#F1F3F5] rounded-xl p-4 border border-slate-200">
                                <h4 className="text-[#1F2E26] text-lg font-bold mb-1.5">Support</h4>
                                <p className="text-[#677E73] text-sm leading-relaxed mb-2">
                                    Need technical help or facing issues with our platform? Our support team is here 24×7.
                                </p>
                                <p className="text-[#1F2E26] text-sm">
                                    <span className="font-bold">Support Mail:</span> <a href="mailto:support@flashspace.co" className="text-[#35503F] underline underline-offset-2">support@flashspace.co</a>
                                </p>
                            </div>

                            {/* Sales */}
                            <div className="bg-[#F1F3F5] rounded-xl p-4 border border-slate-200">
                                <h4 className="text-[#1F2E26] text-lg font-bold mb-1.5">Sales</h4>
                                <p className="text-[#677E73] text-sm leading-relaxed mb-2">
                                    Want to explore FlashSpace solutions? Our sales experts will help you find the right plan.
                                </p>
                                <p className="text-[#1F2E26] text-sm mb-0.5">
                                    <span className="font-bold">Sales Mail:</span> <a href="mailto:sales@flashspace.co" className="text-[#35503F] underline underline-offset-2">sales@flashspace.co</a>
                                </p>
                                <p className="text-[#1F2E26] text-sm">
                                    <span className="font-bold">Contact:</span> <span className="text-[#1F2E26]">8100888777</span>
                                </p>
                            </div>

                            {/* Partnership */}
                            <div className="bg-[#F1F3F5] rounded-xl p-4 border border-slate-200">
                                <h4 className="text-[#1F2E26] text-lg font-bold mb-1.5">Partnership</h4>
                                <p className="text-[#677E73] text-sm leading-relaxed mb-2">
                                    Interested in collaborating or becoming a partner? Let's build future-ready solutions.
                                </p>
                                <p className="text-[#1F2E26] text-sm">
                                    <span className="font-bold">Partnership Mail:</span> <a href="mailto:partner@flashspace.co" className="text-[#35503F] underline underline-offset-2">partner@flashspace.co</a>
                                </p>
                            </div>

                        </div>

                        {/* Right Column - Form */}
                        <div className="w-full md:w-[55%] p-4 md:p-6 lg:p-8 relative bg-white flex flex-col justify-center">
                            
                            {/* Close button */}
                            <button
                                onClick={() => setIsContactOpen(false)}
                                className="absolute top-3 right-3 p-1.5 text-gray-500 hover:text-black transition-colors rounded-full hover:bg-gray-100 z-10"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <h3 className="text-2xl font-bold text-[#1F2E26] mb-5 text-center">
                                Get in <span className="text-[#35503F]">Touch</span>
                            </h3>

                            <form className="flex flex-col gap-3">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-[13px] font-bold text-[#1F2E26] mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        className="w-full rounded-xl border border-slate-200 bg-[#FCFCFC] text-[#1F2E26] placeholder:text-[#677E73] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#35503F]/20 focus:border-[#35503F] transition-all"
                                        placeholder="Your Name"
                                        type="text"
                                        name="name"
                                    />
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <label className="block text-[13px] font-bold text-[#1F2E26] mb-1">
                                        Phone Number
                                    </label>
                                    <input
                                        className="w-full rounded-xl border border-slate-200 bg-[#FCFCFC] text-[#1F2E26] placeholder:text-[#677E73] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#35503F]/20 focus:border-[#35503F] transition-all"
                                        placeholder="+91 9876543210"
                                        type="tel"
                                        name="phone"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-[13px] font-bold text-[#1F2E26] mb-1">
                                        Email
                                    </label>
                                    <input
                                        className="w-full rounded-xl border border-slate-200 bg-[#FCFCFC] text-[#1F2E26] placeholder:text-[#677E73] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#35503F]/20 focus:border-[#35503F] transition-all"
                                        placeholder="you@example.com"
                                        type="email"
                                        name="email"
                                    />
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block text-[13px] font-bold text-[#1F2E26] mb-1">
                                        Message
                                    </label>
                                    <textarea
                                        className="w-full rounded-xl border border-slate-200 bg-[#FCFCFC] text-[#1F2E26] placeholder:text-[#677E73] px-3 py-2.5 h-20 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#35503F]/20 focus:border-[#35503F] transition-all"
                                        placeholder="How can we help?"
                                        name="message"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full mt-2 rounded-xl bg-[#35503F] hover:bg-[#2A4032] text-[#FEF8C3] font-semibold text-sm py-3 transition-all shadow-sm"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* === Login Modal === */}
            <LoginModal isOpen={isLoginOpen} onClose={closeLogin} />

            {/* === Signup Modal === */}
            <SignupModal isOpen={isSignupOpen} onClose={closeSignup} initialRole={signupRole} />

            {/* === Partner Choice Modal === */}
            <PartnerChoiceModal
                isOpen={isPartnerChoiceOpen}
                onClose={() => setIsPartnerChoiceOpen(false)}
                onSelect={openPartnerSignup}
            />
        </>
    );
};


export default Header;
