import { ReactNode, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, ChevronDown, LayoutDashboard, LogOut, Menu, Settings, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
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

const navItems = [
  { label: "Solutions", href: "/solutions/virtual-office", hasDropdown: true },
  { label: "Workspaces", href: "/services/virtual-office" },
  { label: "Business Setup", href: "/solutions/business-setup" },
  { label: "Partners", href: "/partner" },
];

const solutionItems = [
  { label: "Virtual Space", href: "/solutions/virtual-office", icon: Building2 },
  { label: "Coworking Space", href: "/solutions/coworking-space", icon: Users },
];

const Header = ({ openLogin = false, openSignup = false }: HeaderProps): ReactNode => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(openLogin);
  const [isSignupOpen, setIsSignupOpen] = useState(openSignup);
  const [isPartnerChoiceOpen, setIsPartnerChoiceOpen] = useState(false);
  const [signupRole, setSignupRole] = useState<"user" | "partner" | "affiliate">("user");
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

  const closeDrawer = () => setIsMenuOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
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
          "fixed inset-x-0 top-0 z-[100] h-14 border-b border-transparent bg-[#FAFAF7] transition-all duration-300 md:h-16",
          scrolled && "border-white/15 bg-[#FAFAF7]/90 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-xl supports-[backdrop-filter]:bg-[#FAFAF7]/95"
        )}
      >
        <div className="fs-container flex h-full items-center justify-between">
          <Link
            to="/"
            aria-label="FlashSpace home"
            className="flex min-w-[120px] items-center"
          >
            <img
              src="/Logo/Flashspace Logo.png"
              alt="FlashSpace"
              className="h-[22px] w-auto md:h-7"
            />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) =>
              item.hasDropdown ? (
<<<<<<< HEAD
                <div
                  key={item.label}
                  ref={solutionsRef}
                  className="relative"
                  onMouseEnter={() => setIsSolutionsOpen(true)}
                  onMouseLeave={() => setIsSolutionsOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => setIsSolutionsOpen((value) => !value)}
                    className="flex items-center gap-1 text-sm font-medium text-white/75 transition-colors hover:text-white"
                  >
                    {item.label}
                    <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isSolutionsOpen && "rotate-180")} />
                  </button>

                  <div className={cn(
                    "absolute left-1/2 top-full w-56 -translate-x-1/2 pt-4 transition-all duration-200",
                    isSolutionsOpen ? "visible opacity-100" : "invisible opacity-0"
                  )}>
=======
                <div key={item.label} className="group relative">
                  <Link
                    to={item.href}
                    className="flex items-center gap-1 text-sm font-medium text-white/75 transition-colors hover:text-white"
                  >
                    {item.label}
                    <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                  </Link>

                  <div className="invisible absolute left-1/2 top-full w-56 -translate-x-1/2 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
>>>>>>> dbe510a (new Ui)
                    <div className="rounded-xl border border-white/15 bg-[#36503F]/95 p-2 shadow-[0_14px_34px_rgba(0,0,0,0.22)] backdrop-blur-xl">
                      {solutionItems.map((solution) => (
                        <Link
                          key={solution.label}
                          to={solution.href}
<<<<<<< HEAD
                          onClick={() => setIsSolutionsOpen(false)}
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          <solution.icon className="h-4 w-4 text-[#FEF8C5]" />
=======
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          <solution.icon className="h-4 w-4 text-[#FEF865]" />
>>>>>>> dbe510a (new Ui)
                          {solution.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-sm font-medium text-white/75 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsContactOpen(true)}
              className="hidden rounded-full bg-[#FEF8C5] px-5 py-2 text-[13px] font-bold text-[#36503F] transition-transform hover:scale-[1.01] active:scale-[0.99] sm:inline-flex"
            >
              Get started
            </button>

            {isAuthenticated ? (
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setIsUserMenuOpen((value) => !value)}
                  className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 p-1 pr-2 text-white"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-[#36503F]">
                    {user?.fullName?.charAt(0).toUpperCase() || "U"}
                  </span>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", isUserMenuOpen && "rotate-180")} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-64 rounded-xl border border-[#D4E0D0] bg-white p-2 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
                    <div className="border-b border-[#D4E0D0] px-3 py-3">
                      <p className="truncate text-sm font-semibold text-[#1A1A1A]">{user?.fullName}</p>
                      <p className="truncate text-xs text-[#6B8F78]">{user?.email}</p>
                    </div>
                    <button onClick={() => navigate("/dashboard")} className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[#1A1A1A] hover:bg-[#F0F4EE]">
                      <LayoutDashboard className="h-4 w-4 text-[#36503F]" /> Dashboard
                    </button>
                    <button onClick={() => navigate("/settings")} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[#1A1A1A] hover:bg-[#F0F4EE]">
                      <Settings className="h-4 w-4 text-[#36503F]" /> Settings
                    </button>
                    <button onClick={async () => { await logout(); navigate("/"); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[#DC2626] hover:bg-red-50">
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => navigate("/login")} className="hidden text-sm font-medium text-white/75 hover:text-white sm:inline-flex">
                Sign in
              </button>
            )}

            <button
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center rounded-full text-white lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className={cn("fixed inset-0 z-[120] bg-black/30 transition-opacity lg:hidden", isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0")}>
        <aside className={cn("h-full w-[82vw] max-w-sm bg-[#36503F] px-6 py-5 transition-transform duration-200", isMenuOpen ? "translate-x-0" : "-translate-x-full")}>
          <div className="mb-10 flex items-center justify-between">
            <Link to="/" onClick={closeDrawer} className="text-[18px] font-extrabold tracking-[-0.03em] text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <img
                src="/Logo/Flashspace Logo.png"
                alt="FlashSpace"
                className="h-[22px] w-auto brightness-0 invert"
              />
            </Link>
            <button onClick={closeDrawer} aria-label="Close menu" className="text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item, index) => (
              item.hasDropdown ? (
                <div key={item.label} className="rounded-lg px-2 py-3">
<<<<<<< HEAD
                  <p className="mb-3 text-base font-medium text-[#FEF8C5]">{item.label}</p>
=======
                  <p className="mb-3 text-base font-medium text-[#FEF865]">{item.label}</p>
>>>>>>> dbe510a (new Ui)
                  <div className="space-y-1">
                    {solutionItems.map((solution) => (
                      <Link
                        key={solution.label}
                        to={solution.href}
                        onClick={closeDrawer}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-white/85 hover:bg-white/10 hover:text-white"
                      >
<<<<<<< HEAD
                        <solution.icon className="h-4 w-4 text-[#FEF8C5]" />
=======
                        <solution.icon className="h-4 w-4 text-[#FEF865]" />
>>>>>>> dbe510a (new Ui)
                        {solution.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={closeDrawer}
<<<<<<< HEAD
                  className={cn("rounded-lg px-2 py-3 text-base font-medium text-white", index === 0 && "text-[#FEF8C5]")}
=======
                  className={cn("rounded-lg px-2 py-3 text-base font-medium text-white", index === 0 && "text-[#FEF865]")}
>>>>>>> dbe510a (new Ui)
                >
                  {item.label}
                </Link>
              )
            ))}
          </nav>
          <button onClick={() => { closeDrawer(); setIsContactOpen(true); }} className="mt-8 w-full rounded-full bg-[#FEF8C5] px-5 py-3 text-sm font-bold text-[#36503F]">
            Get started
          </button>
        </aside>
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => navigate("/")} onSignupClick={() => navigate("/signup")} />
      <SignupModal isOpen={isSignupOpen} onClose={() => navigate("/")} initialRole={signupRole} onLoginClick={() => navigate("/login")} />
      <PartnerChoiceModal isOpen={isPartnerChoiceOpen} onClose={() => setIsPartnerChoiceOpen(false)} onSelect={openPartnerSignup} />
      <GetInTouchModal open={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
};

export default Header;
