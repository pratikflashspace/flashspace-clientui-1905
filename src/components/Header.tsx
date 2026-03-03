import { useState, useEffect, useRef, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ModernFlairButton from "@/components/ui/ModernFlairButton";
import {
    Menu,
    Phone,
    Building2,
    Users,
    Zap,
    FileText,
    ArrowRight,
    LayoutDashboard,
    LogOut,
    User as UserIcon,
    Settings,
    ChevronDown,
    X,
    Sun,
    Moon
} from "lucide-react";
import SidebarMenu from "@/components/SidebarMenu";
import { useAuth } from "@/contexts/AuthContext";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { LoginModal } from "@/components/auth/LoginModal";
import { SignupModal } from "@/components/auth/SignupModal";
import { PartnerChoiceModal } from "@/components/auth/PartnerChoiceModal";
import { NotificationBell } from "@/components/NotificationBell";
import { GetInTouchModal } from "@/components/modals/GetInTouchModal";

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
    const location = useLocation();
    const { isAuthenticated, user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Dropdowns
    const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
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

    const solutionsRef = useRef<HTMLDivElement>(null);
    const countryRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (solutionsRef.current && !solutionsRef.current.contains(event.target as Node)) {
                setIsSolutionsOpen(false);
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

    useEffect(() => {
        setIsLoginOpen(openLogin);
    }, [openLogin]);

    useEffect(() => {
        setIsSignupOpen(openSignup);
    }, [openSignup]);

    const handleNavigation = (href: string) => {
        if (href.startsWith("#")) {
            const element = document.querySelector(href);
            element?.scrollIntoView({ behavior: "smooth", block: "start" });
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
                    "fixed top-0 w-full z-[100] transition-all duration-300",
                    scrolled || forceWhiteBackground
                        ? "bg-white dark:bg-[#0a0a0a] border-b border-border dark:border-white/10 shadow-sm py-2"
                        : "bg-transparent py-4"
                )}
            >
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex items-center justify-between h-14 md:h-16">
                        {/* LEFT: Hamburger + Logo */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsMenuOpen(true)}
                                className="p-2 -ml-2 text-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded-lg"
                                aria-label="Open menu"
                            >
                                <Menu className="w-6 h-6 dark:text-white" />
                            </button>
                            <div
                                className="cursor-pointer"
                                onClick={() => handleNavigation("/")}
                            >
                                <img
                                    src="https://cdn.prod.website-files.com/664330484432dcdd6519a8fd/665dd8e0007de68a44f3750b_Black%20and%20White%20Bold%20Typography%20Clothing%20Brand%20Logo%20(940%20x%20400%20px)%20(940%20x%20200%20px)%20(940%20x%20150%20px).png"
                                    alt="FlashSpace Logo"
                                    className="h-8 md:h-10 w-auto dark:invert"
                                />
                            </div>
                        </div>

                        {/* CENTER: Navigation Links */}
                        <nav className="hidden lg:flex items-center gap-8">
                            {/* Get Workspace Dropdown */}
                            <div ref={solutionsRef} className="relative">
                                <button
                                    onMouseEnter={() => setIsSolutionsOpen(true)}
                                    className={cn(
                                        "flex items-center gap-1.5 text-sm font-bold transition-colors py-2",
                                        scrolled || forceWhiteBackground ? "text-[#164e4e] dark:text-white" : "text-[#164e4e] dark:text-white",
                                        "hover:text-[#D96832]"
                                    )}
                                >
                                    Get Workspace
                                    <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", isSolutionsOpen && "rotate-180")} />
                                </button>

                                <div
                                    className={cn(
                                        "absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[600px] bg-white dark:bg-[#0a0a0a] border border-border dark:border-white/10 rounded-2xl shadow-2xl p-6 z-50 transition-all duration-300",
                                        isSolutionsOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
                                    )}
                                    onMouseLeave={() => setIsSolutionsOpen(false)}
                                >
                                    <div className="grid grid-cols-2 gap-6">
                                        {/* On-Demand Section */}
                                        <div className="bg-[#f8faf9] dark:bg-white/5 rounded-xl p-5 border border-border/50">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Zap className="w-4 h-4 text-[#D96832]" />
                                                <h4 className="text-sm font-bold text-[#164e4e] dark:text-white">On-Demand</h4>
                                            </div>
                                            <p className="text-xs text-[#164e4e]/60 dark:text-gray-400 mb-4">Book by the hour or day</p>
                                            <div className="space-y-2">
                                                <button
                                                    onClick={() => handleNavigation("/Solutions/eventspace")}
                                                    className="w-full flex items-center justify-between text-sm px-4 py-3 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-all text-[#164e4e] dark:text-white"
                                                >
                                                    Event Space
                                                    <ArrowRight className="w-4 h-4 opacity-40" />
                                                </button>
                                                <button
                                                    onClick={() => handleNavigation("/Solutions/day-office")}
                                                    className="w-full flex items-center justify-between text-sm px-4 py-3 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-all text-[#164e4e] dark:text-white"
                                                >
                                                    Day Offices
                                                    <ArrowRight className="w-4 h-4 opacity-40" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Solutions List */}
                                        <div className="space-y-1">
                                            {[
                                                { icon: Building2, title: "Virtual Office", desc: "Business address & mail", href: "/Solutions/virtual-office" },
                                                { icon: Users, title: "Coworking Space", desc: "Flexible desk solutions", href: "/Solutions/coworking-space" },
                                                { icon: FileText, title: "Business Setup", desc: "GST & registration support", href: "/Solutions/business-setup" },
                                            ].map((item) => (
                                                <button
                                                    key={item.title}
                                                    onClick={() => handleNavigation(item.href)}
                                                    className="w-full text-left p-3 rounded-xl hover:bg-[#D96832]/5 group transition-colors"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <item.icon className="w-5 h-5 text-[#D96832] mt-0.5" />
                                                        <div>
                                                            <h5 className="text-sm font-bold text-[#164e4e] dark:text-white group-hover:text-[#D96832] transition-colors">{item.title}</h5>
                                                            <p className="text-xs text-[#164e4e]/60 dark:text-gray-400">{item.desc}</p>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => handleNavigation("/partner")}
                                className={cn(
                                    "text-sm font-bold transition-colors",
                                    scrolled || forceWhiteBackground ? "text-[#164e4e] dark:text-white" : "text-[#164e4e] dark:text-white",
                                    "hover:text-[#D96832]"
                                )}
                            >
                                Partner with Us
                            </button>
                            <button
                                onClick={() => handleNavigation("/about")}
                                className={cn(
                                    "text-sm font-bold transition-colors",
                                    scrolled || forceWhiteBackground ? "text-[#164e4e] dark:text-white" : "text-[#164e4e] dark:text-white",
                                    "hover:text-[#D96832]"
                                )}
                            >
                                About Us
                            </button>
                        </nav>

                        {/* RIGHT: Actions */}
                        <div className="flex items-center gap-3">
                            {/* Country Selector */}
                            <div ref={countryRef} className="hidden xl:block relative">
                                <button
                                    className="flex items-center px-3 py-2 rounded-full border border-gray-200 dark:border-white/10 text-[#164e4e] dark:text-white gap-2 bg-white dark:bg-black/50 hover:bg-white dark:hover:bg-white/10 transition-all"
                                    onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                                >
                                    <img src={selectedCountry.flag} alt={selectedCountry.code} className="h-5 w-5 rounded-full object-cover" />
                                    <span className="text-sm font-medium">{selectedCountry.code}</span>
                                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", countryDropdownOpen && "rotate-180")} />
                                </button>
                                {countryDropdownOpen && (
                                    <ul className="absolute right-0 top-full mt-2 bg-white dark:bg-[#0a0a0a] border border-border dark:border-white/10 rounded-xl shadow-2xl py-2 z-50 min-w-[120px]">
                                        {countries.map((country) => (
                                            <button
                                                key={country.code}
                                                className="flex items-center w-full px-4 py-2 hover:bg-black/5 dark:hover:bg-white/5 gap-3 text-sm text-[#164e4e] dark:text-gray-200 transition-colors"
                                                onClick={() => { setSelectedCountry(country); setCountryDropdownOpen(false); }}
                                            >
                                                <img src={country.flag} alt={country.code} className="h-4 w-4 rounded-full" />
                                                <span>{country.code}</span>
                                            </button>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Notification Bell */}
                            {isAuthenticated && (
                                <div className="hidden lg:block">
                                    <NotificationBell />
                                </div>
                            )}

                            {/* User Authentication */}
                            {isAuthenticated ? (
                                <div ref={userMenuRef} className="relative">
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center gap-2 group"
                                    >
                                        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#164e4e] text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:shadow-md transition-all">
                                            {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <ChevronDown className={cn("w-4 h-4 text-[#164e4e]/60 transition-transform", isUserMenuOpen && "rotate-180")} />
                                    </button>

                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-[#0a0a0a] border border-border dark:border-white/10 rounded-2xl shadow-2xl py-3 z-50 overflow-hidden">
                                            <div className="px-5 py-3 border-b border-border/50 dark:border-white/10 mb-2">
                                                <p className="text-sm font-bold text-[#164e4e] dark:text-white truncate">{user?.fullName}</p>
                                                <p className="text-xs text-[#164e4e]/60 dark:text-gray-400 truncate">{user?.email}</p>
                                            </div>
                                            <div className="px-2 space-y-1">
                                                <button onClick={() => { navigate("/dashboard"); setIsUserMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#164e4e] dark:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors">
                                                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                                                </button>
                                                <button onClick={() => { navigate("/settings"); setIsUserMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#164e4e] dark:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors">
                                                    <Settings className="w-4 h-4" /> Settings
                                                </button>
                                                <hr className="my-2 border-border/50 dark:border-white/10" />
                                                <button onClick={async () => { await logout(); setIsUserMenuOpen(false); navigate("/"); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                                    <LogOut className="w-4 h-4" /> Logout
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsLoginOpen(true)}
                                    className="hidden sm:inline-flex text-sm font-bold text-[#164e4e] dark:text-white hover:text-[#D96832] transition-colors"
                                >
                                    Sign In
                                </button>
                            )}

                            <ModernFlairButton
                                onClick={() => setIsContactOpen(true)}
                                className="inline-flex group px-4 md:px-6 py-2 md:py-2.5 bg-[#164e4e] text-white text-sm font-bold rounded-full transition-all duration-300 hover:bg-[#1c5d5d] shadow-md hover:shadow-lg active:scale-95 overflow-hidden"
                                flairColor="rgba(255, 255, 255, 0.1)"
                            >
                                <span className="relative flex items-center gap-2">
                                    Get in Touch
                                    <ArrowRight className="hidden md:inline-block w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                </span>
                            </ModernFlairButton>
                        </div>
                    </div>
                </div>

                <SidebarMenu
                    isOpen={isMenuOpen}
                    onClose={() => setIsMenuOpen(false)}
                    onOpenLogin={() => setIsLoginOpen(true)}
                />
            </header>

            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
            <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} initialRole={signupRole} />
            <PartnerChoiceModal isOpen={isPartnerChoiceOpen} onClose={() => setIsPartnerChoiceOpen(false)} onSelect={openPartnerSignup} />
            <GetInTouchModal open={isContactOpen} onClose={() => setIsContactOpen(false)} />
        </>
    );
};

export default Header;