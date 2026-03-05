import { useState, useEffect, useRef, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
// import ModernFlairButton from "@/components/ui/ModernFlairButton";
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
import { GetInTouchModal } from "@/components/modals/GetInTouchModal";

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

    // Popup contact form
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(openLogin);
    const [isSignupOpen, setIsSignupOpen] = useState(openSignup);
    const [isPartnerChoiceOpen, setIsPartnerChoiceOpen] = useState(false);
    const [signupRole, setSignupRole] = useState<'user' | 'partner' | 'affiliate'>('user');

    const solutionsRef = useRef<HTMLDivElement>(null);
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
                    "fixed top-0 w-full z-[100] transition-all duration-300 bg-white dark:bg-[#0a0a0a] border-b border-border dark:border-white/10 shadow-sm py-2"
                )}
                style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 500 }}
            >
                <div className="w-full px-4 md:px-10">
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
                                    className="h-5 md:h-8 w-auto dark:invert"
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
                                        "flex items-center gap-1.5 text-sm font-medium transition-all duration-300 py-2 px-4 rounded-xl hover:bg-black/10 dark:hover:bg-white/5 hover:shadow-[0_8px_30px_rgba(51,77,61,0.12)]",
                                        scrolled || forceWhiteBackground ? "text-[#164e4e] dark:text-white" : "text-[#164e4e] dark:text-white"
                                    )}
                                >
                                    Get Workspace
                                    <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", isSolutionsOpen && "rotate-180")} />
                                </button>

                                <div
                                    className={cn(
                                        "absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[600px] bg-white dark:bg-[#0a0a0a] border border-[#2D3F33]/15 dark:border-white/10 rounded-2xl shadow-2xl p-6 z-50 transition-all duration-300",
                                        isSolutionsOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
                                    )}
                                    onMouseLeave={() => setIsSolutionsOpen(false)}
                                >
                                    <div className="grid grid-cols-2 gap-6">
                                        {/* On-Demand Section */}
                                        <div className="bg-[#2D3F33]/5 dark:bg-white/5 rounded-xl p-5 border border-[#2D3F33]/15 dark:border-white/10">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Zap className="w-4 h-4 text-[#2D3F33] dark:text-[#FDE68A]" />
                                                <h4 className="text-sm font-medium text-[#164e4e] dark:text-white">On-Demand</h4>
                                            </div>
                                            <p className="text-xs text-[#164e4e]/60 dark:text-gray-400 mb-4">Book by the hour or day</p>
                                            <div className="space-y-2">
                                                <button
                                                    onClick={() => handleNavigation("/solutions/day-passes")}
                                                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium bg-white dark:bg-white/10 border border-[#2D3F33]/10 dark:border-white/10 text-[#164e4e] dark:text-white hover:bg-[#2D3F33]/10 dark:hover:bg-white/15 transition-colors"
                                                >
                                                    Day Passes
                                                </button>
                                                <button
                                                    onClick={() => handleNavigation("/solutions/meeting-rooms")}
                                                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium bg-white dark:bg-white/10 border border-[#2D3F33]/10 dark:border-white/10 text-[#164e4e] dark:text-white hover:bg-[#2D3F33]/10 dark:hover:bg-white/15 transition-colors"
                                                >
                                                    Meeting Rooms
                                                </button>
                                            </div>
                                        </div>

                                        {/* Solutions List */}
                                        <div className="space-y-1">
                                            {[
                                                { icon: Building2, title: "Virtual Office", desc: "Business address & mail", href: "/solutions/virtual-office" },
                                                { icon: Users, title: "Coworking Space", desc: "Flexible desk solutions", href: "/solutions/coworking-space" },
                                                { icon: FileText, title: "Business Setup", desc: "GST & registration support", href: "/solutions/business-setup" },
                                            ].map((item) => (
                                                <button
                                                    key={item.title}
                                                    onClick={() => handleNavigation(item.href)}
                                                    className="w-full text-left p-3 rounded-xl hover:bg-[#2D3F33]/5 dark:hover:bg-white/5 group transition-colors"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <item.icon className="w-5 h-5 text-[#2D3F33] dark:text-[#FDE68A] mt-0.5" />
                                                        <div>
                                                            <h5 className="text-sm font-medium text-[#164e4e] dark:text-white group-hover:text-[#2D3F33] dark:group-hover:text-[#FDE68A] transition-colors">{item.title}</h5>
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
                                    "text-sm font-medium transition-all duration-300 py-2 px-4 rounded-xl hover:bg-black/10 dark:hover:bg-white/5 hover:shadow-[0_8px_30px_rgba(51,77,61,0.12)]",
                                    scrolled || forceWhiteBackground ? "text-[#164e4e] dark:text-white" : "text-[#164e4e] dark:text-white"
                                )}
                            >
                                Partner with Us
                            </button>
                            <button
                                onClick={() => handleNavigation("/about")}
                                className={cn(
                                    "text-sm font-medium transition-all duration-300 py-2 px-4 rounded-xl hover:bg-black/10 dark:hover:bg-white/5 hover:shadow-[0_8px_30px_rgba(51,77,61,0.12)]",
                                    scrolled || forceWhiteBackground ? "text-[#164e4e] dark:text-white" : "text-[#164e4e] dark:text-white"
                                )}
                            >
                                About Us
                            </button>
                        </nav>

                        {/* RIGHT: Actions */}
                        <div className="flex items-center gap-3">
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
                                                <p className="text-sm font-medium text-[#164e4e] dark:text-white truncate">{user?.fullName}</p>
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
                                    className="hidden sm:inline-flex text-sm font-medium text-[#4B5E6B] dark:text-white hover:opacity-80 transition-all mr-2"
                                >
                                    Sign in
                                </button>
                            )}

                            <div
                                onClick={() => setIsContactOpen(true)}
                                className="inline-flex group px-6 py-2.5 bg-[#2D3F33] text-[#FDE68A] cursor-pointer hover:scale-95 text-sm font-medium rounded-2xl transition-all duration-300 hover:bg-[#344C3D] shadow-md hover:shadow-lg active:scale-95 overflow-hidden border-none"

                            >
                                <span className="relative">
                                    Get in Touch
                                </span>
                            </div>
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
