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
import {
    getDefaultLoginUrl,
    getLoginRedirectUrl,
    isCheckoutReturnPath,
} from "@/utils/checkoutSession";

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
    const currentRoute = `${location.pathname}${location.search}${location.hash}`;
    const loginRedirectTo = (() => {
        const params = new URLSearchParams(location.search);
        const requested = params.get("redirectTo") || params.get("redirect");
        if (isCheckoutReturnPath(requested)) return requested;
        if (
            location.pathname !== "/login" &&
            location.pathname !== "/signup" &&
            isCheckoutReturnPath(currentRoute)
        ) {
            return currentRoute;
        }
        return "/";
    })();
    const loginUrl = isCheckoutReturnPath(currentRoute)
        ? getLoginRedirectUrl(currentRoute)
        : getDefaultLoginUrl();

    const handleLoginSuccess = () => {
        setIsLoginOpen(false);
        navigate(loginRedirectTo, { replace: location.pathname === "/login" });
    };

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

    const isModalOpenRef = useRef(isContactOpen);
    useEffect(() => {
        isModalOpenRef.current = isContactOpen;
    }, [isContactOpen]);

    useEffect(() => {
        // Rule 1: Show after 10 seconds on site (once per session)
        const hasFilled = localStorage.getItem("hasFilledGetInTouch");
        const hasShownInitial = sessionStorage.getItem("hasShownInitialGetInTouch");
        if (!hasShownInitial && !hasFilled) {
            let sessionStartTime = sessionStorage.getItem("sessionStartTime");
            if (!sessionStartTime) {
                sessionStartTime = Date.now().toString();
                sessionStorage.setItem("sessionStartTime", sessionStartTime);
            }

            const elapsed = Date.now() - parseInt(sessionStartTime);
            const remaining = Math.max(0, 10000 - elapsed);

            const timer = setTimeout(() => {
                const alreadyShown = sessionStorage.getItem("hasShownInitialGetInTouch");
                const hasFilledLatest = localStorage.getItem("hasFilledGetInTouch");
                if (!alreadyShown && !hasFilledLatest) {
                    setIsContactOpen(true);
                    sessionStorage.setItem("hasShownInitialGetInTouch", "true");
                }
            }, remaining);

            // Cleanup Rule 1 timer on unmount
            return () => clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        const handleOpenContact = () => setIsContactOpen(true);
        window.addEventListener('open-contact-modal', handleOpenContact);
        return () => window.removeEventListener('open-contact-modal', handleOpenContact);
    }, []);

    useEffect(() => {
        // Rule 2: Show every time the user is inactive for 60 seconds
        let inactivityTimer: NodeJS.Timeout;

        const showInactivityModal = () => {
            const hasFilled = localStorage.getItem("hasFilledGetInTouch");
            if (!isModalOpenRef.current && !hasFilled) {
                setIsContactOpen(true);
            }
        };

        const resetInactivityTimer = () => {
            if (inactivityTimer) clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(showInactivityModal, 60000); // 60 seconds of inactivity
        };

        const activityEvents = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];

        // Initial timer start
        resetInactivityTimer();

        // Set up listeners for activity
        activityEvents.forEach(event => {
            window.addEventListener(event, resetInactivityTimer);
        });

        return () => {
            if (inactivityTimer) clearTimeout(inactivityTimer);
            activityEvents.forEach(event => {
                window.removeEventListener(event, resetInactivityTimer);
            });
        };
    }, []);



    useEffect(() => {
        // Rule 4: Show after 10 seconds on space detail pages (once per space)
        const isSpaceDetail = location.pathname.startsWith("/space/") ||
            location.pathname.startsWith("/coworking-space/") ||
            location.pathname.startsWith("/meeting-room/");

        if (!isSpaceDetail) return;

        const spaceId = location.pathname.split("/").pop();
        if (!spaceId) return;

        const sessionKey = `hasShownSpacePopup_${spaceId}`;
        const alreadyShown = sessionStorage.getItem(sessionKey);
        const hasFilled = localStorage.getItem("hasFilledGetInTouch");
        if (alreadyShown || hasFilled) return;

        const timer = setTimeout(() => {
            const hasFilledLatest = localStorage.getItem("hasFilledGetInTouch");
            if (!isModalOpenRef.current && !hasFilledLatest) {
                setIsContactOpen(true);
                sessionStorage.setItem(sessionKey, "true");
            }
        }, 10000); // 10 seconds

        return () => clearTimeout(timer);
    }, [location.pathname]);

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
                    "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 bg-white dark:bg-[#0a0a0a] border-b border-border dark:border-white/10 shadow-sm py-1"
                )}
                style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 500 }}
            >
                <div className="w-full px-3 md:px-10">
                    <div className="flex items-center justify-between h-16 md:h-16">
                        {/* LEFT: Hamburger + Logo */}
                        <div className="flex items-center gap-2 md:gap-4">
                            <button
                                onClick={() => setIsMenuOpen(true)}
                                className="p-1.5 md:p-2 -ml-1 md:-ml-2 text-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded-lg"
                                aria-label="Open menu"
                            >
                                <Menu className="w-5 h-5 md:w-6 md:h-6 dark:text-white" />
                            </button>
                            <div
                                className="cursor-pointer flex items-center"
                                onClick={() => handleNavigation("/")}
                            >
                                <img
                                    src="https://cdn.prod.website-files.com/664330484432dcdd6519a8fd/665dd8e0007de68a44f3750b_Black%20and%20White%20Bold%20Typography%20Clothing%20Brand%20Logo%20(940%20x%20400%20px)%20(940%20x%20200%20px)%20(940%20x%20150%20px).png"
                                    alt="FlashSpace Logo"
                                    className="h-6 md:h-9 w-auto dark:invert"
                                />
                            </div>
                        </div>

                        {/* CENTER: Navigation Links */}
                        <nav className="hidden lg:flex items-center gap-8">
                            {/* Solutions Dropdown */}
                            <div ref={solutionsRef} className="relative">
                                <button
                                    onMouseEnter={() => setIsSolutionsOpen(true)}
                                    className={cn(
                                        "flex items-center gap-1.5 text-sm font-medium transition-all duration-300 py-2 px-4 rounded-xl hover:bg-black/10 dark:hover:bg-white/5 hover:shadow-[0_8px_30px_rgba(51,77,61,0.12)]",
                                        scrolled || forceWhiteBackground ? "text-[#164e4e] dark:text-white" : "text-[#164e4e] dark:text-white",
                                        "hover:text-[#2D3F33] dark:hover:text-[#FDE68A]"
                                    )}
                                >
                                    Solutions
                                    <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", isSolutionsOpen && "rotate-180")} />
                                </button>

                                <div
                                    className={cn(
                                        "absolute left-0 top-full mt-2 w-56 bg-white dark:bg-[#0a0a0a] border border-[#2D3F33]/15 dark:border-white/10 rounded-2xl shadow-2xl py-2 z-50 transition-all duration-300",
                                        isSolutionsOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
                                    )}
                                    onMouseLeave={() => setIsSolutionsOpen(false)}
                                >
                                    {[
                                        { title: "Virtual Office", href: "/solutions/virtual-office" },
                                        { title: "Coworking Space", href: "/solutions/coworking-space" },
                                        { title: "Business Setup", href: "/solutions/business-setup" },
                                    ].map((item) => (
                                        <button
                                            key={item.title}
                                            onClick={() => handleNavigation(item.href)}
                                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-[#164e4e] dark:text-white hover:bg-[#2D3F33]/5 dark:hover:bg-white/5 transition-colors"
                                        >
                                            {item.title}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Workspaces */}
                            <button
                                onClick={() => handleNavigation("/services/virtual-office")}
                                className={cn(
                                    "text-sm font-medium transition-all duration-300 py-2 px-4 rounded-xl hover:bg-black/10 dark:hover:bg-white/5 hover:shadow-[0_8px_30px_rgba(51,77,61,0.12)]",
                                    scrolled || forceWhiteBackground ? "text-[#164e4e] dark:text-white" : "text-[#164e4e] dark:text-white"
                                )}
                            >
                                Workspaces
                            </button>

                            {/* Partner with Us */}
                            <button
                                onClick={() => handleNavigation("/partner")}
                                className={cn(
                                    "text-sm font-medium transition-all duration-300 py-2 px-4 rounded-xl hover:bg-black/10 dark:hover:bg-white/5 hover:shadow-[0_8px_30px_rgba(51,77,61,0.12)]",
                                    scrolled || forceWhiteBackground ? "text-[#164e4e] dark:text-white" : "text-[#164e4e] dark:text-white"
                                )}
                            >
                                Partner with Us
                            </button>
                        </nav>

                        {/* RIGHT: Actions */}
                        <div className="flex items-center gap-2 md:gap-3">
                            <div
                                onClick={() => setIsContactOpen(true)}
                                className="inline-flex group px-4 sm:px-6 py-2 sm:py-2.5 bg-[#2D3F33] text-[#FDE68A] cursor-pointer hover:scale-95 text-xs sm:text-sm font-medium rounded-xl sm:rounded-2xl transition-all duration-300 hover:bg-[#344C3D] shadow-md hover:shadow-lg active:scale-95 overflow-hidden border-none"
                            >
                                <span className="relative">
                                    Get in Touch
                                </span>
                            </div>

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
                                    onClick={() => navigate(loginUrl)}
                                    className="hidden sm:inline-flex text-sm font-medium text-[#4B5E6B] dark:text-white hover:opacity-80 transition-all"
                                >
                                    Sign in
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <SidebarMenu
                    isOpen={isMenuOpen}
                    onClose={() => setIsMenuOpen(false)}
                    onOpenLogin={() => navigate(loginUrl)}
                    onOpenContact={() => setIsContactOpen(true)}
                />
            </header>

            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => navigate('/')}
                onSignupClick={() => {
                    navigate('/signup');
                }}
                onLoginSuccess={handleLoginSuccess}
            />
            <SignupModal
                isOpen={isSignupOpen}
                onClose={() => navigate('/')}
                initialRole={signupRole}
                onLoginClick={() => {
                    navigate('/login');
                }}
            />
            <PartnerChoiceModal isOpen={isPartnerChoiceOpen} onClose={() => setIsPartnerChoiceOpen(false)} onSelect={openPartnerSignup} />
            <GetInTouchModal open={isContactOpen} onClose={() => setIsContactOpen(false)} />
        </>
    );
};

export default Header;
