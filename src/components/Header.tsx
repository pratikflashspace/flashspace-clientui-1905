import { ReactNode, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Building2, ChevronDown, LayoutDashboard, LogOut, Menu, Settings, Users, X, Phone, Briefcase, FileText, Wrench, Code, ChevronRight, PieChart, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { LoginModal } from "@/components/auth/LoginModal";
import { SignupModal } from "@/components/auth/SignupModal";
import { PartnerChoiceModal } from "@/components/auth/PartnerChoiceModal";
import { GetInTouchModal } from "@/components/modals/GetInTouchModal";
import { getUploadedFileUrl } from "@/utils/fileUrl";
import {
  getDefaultLoginUrl,
  getLoginRedirectUrl,
  isCheckoutReturnPath,
} from "@/utils/checkoutSession";
import { safeStorageGet, safeStorageSet } from "@/utils/browserStorage";

interface HeaderProps {
  forceWhiteBackground?: boolean;
  lightText?: boolean;
  loginBlack?: boolean;
  openLogin?: boolean;
  openSignup?: boolean;
}


const navData = [
  {
    label: "Solutions",
    isMegaMenu: true,
    sections: [
      {
        title: "Workspaces",
        items: [
          { label: "Virtual Office", href: "/services/virtual-office" },
          { label: "Coworking Spaces", href: "/services/coworking-space" }
        ]
      },
      {
        title: "Business Setup",
        items: [
          { label: "GST Registration", href: "/services/business-setup#gst-registration" },
          { label: "LLP Registration", href: "/services/business-setup#llp-compliance" },
          { label: "OPC Registration", href: "/services/business-setup#company-registration-llp-opc-pvt-ltd" },
          { label: "MSME Registration", href: "/services/business-setup#msme-udyam-registration" },
          { label: "Startup India Registration", href: "/services/business-setup#startup-india-registration" },
          { label: "FSSAI Registration", href: "/services/business-setup#fssai-registration" },
          { label: "Section 8 Registration", href: "/services/business-setup#section-8-registration" }
        ]
      },
      {
        title: "Filing & Taxation",
        items: [
          { label: "GST Filing", href: "/services/business-setup#gst-filing" },
          { label: "MCA Annual Compliance", href: "/services/business-setup#mca-annual-compliance" },
          { label: "LLP Annual Compliance", href: "/services/business-setup#llp-annual-compliance" },
          { label: "Accounting Services", href: "/services/business-setup#accounting-services" }
        ]
      },
      {
        title: "Add On",
        items: [
          { label: "One CRM", href: "/solutions/one-crm" },
          { label: "Website Development", href: "/solutions/website-development" }
        ]
      }
    ]
  },
  { label: "Packages", href: "/packages/basic" },
  { label: "Partner with us", href: "/partner" },
  {
    label: "More",
    isDropdown: true,
    items: [
      { label: "Calculator", href: "/calculators" },
      { label: "Careers", href: "/career" },
      // { label: "FlashSphere", href: "/blogs" }
    ]
  }
];



const MegaMenuDropdown = ({ sections, closeMenu }: { sections: any[], closeMenu?: () => void }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const getIcon = (title: string, isActive: boolean) => {
    const color = isActive ? "text-[#36503F]" : "text-gray-400";
    switch (title) {
      case "Workspaces": return <Building2 className={`w-5 h-5 ${color}`} />;
      case "Business Setup": return <Briefcase className={`w-5 h-5 ${color}`} />;
      case "Filing & Taxation": return <FileText className={`w-5 h-5 ${color}`} />;
      case "Add On": return <Wrench className={`w-5 h-5 ${color}`} />;
      case "Pricing Plans": return <PieChart className={`w-5 h-5 ${color}`} />;
      case "Company": return <Building2 className={`w-5 h-5 ${color}`} />;
      case "Resources": return <Calculator className={`w-5 h-5 ${color}`} />;
      default: return <ChevronRight className={`w-5 h-5 ${color}`} />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl border border-[#FEF8C5] flex overflow-hidden min-h-[400px]">
      {/* Left Sidebar Pane */}
      <div className="w-[35%] bg-[#FAF9F6] flex flex-col py-4 border-r border-[#FEF8C5]/50">
        {sections.map((section, idx) => {
          const isActive = activeIndex === idx;
          return (
              <div
                key={idx}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`flex items-center justify-between px-6 py-6 cursor-pointer transition-all duration-300 ${isActive ? 'bg-[#FEF8C5]/40 shadow-[0_4px_12px_rgba(54,80,63,0.05)] border-l-[3px] border-[#36503F]' : 'hover:bg-[#FEF8C5]/40 border-l-[3px] border-transparent'}`}
              >
              <div className="flex items-center gap-3">
                {getIcon(section.title, isActive)}
                <span className={`text-[15px] ${isActive ? 'text-[#36503F] font-bold' : 'text-gray-600 font-medium'}`}>
                  {section.title}
                </span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'text-[#36503F] translate-x-1' : 'text-gray-300'}`} />
            </div>
          );
        })}
      </div>

      {/* Right Content Pane */}
      <div className="w-[65%] bg-white p-8">
        <h3 className="text-lg font-bold text-[#36503F] mb-6 pb-4 border-b border-[#FEF8C5] inline-block min-w-[200px]">
          {sections[activeIndex]?.title}
        </h3>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
          {sections[activeIndex]?.items.map((sub: any, subIdx: number) => (
            <Link 
              key={subIdx} 
              to={sub.href} 
              onClick={closeMenu}
              className="text-[15px] text-gray-600 hover:text-[#36503F] hover:bg-[#FEF8C5]/40 hover:font-bold transition-all duration-200 block px-4 py-2.5 border-l-[3px] border-transparent hover:border-l-[#36503F]"
            >
              {sub.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
const Header = ({ openLogin = false, openSignup = false }: HeaderProps): ReactNode => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hideDropdowns, setHideDropdowns] = useState(false);
  const closeDesktopDropdowns = () => {
    setHideDropdowns(true);
    setTimeout(() => setHideDropdowns(false), 150);
  };
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(openLogin);
  const [isSignupOpen, setIsSignupOpen] = useState(openSignup);
  const [isPartnerChoiceOpen, setIsPartnerChoiceOpen] = useState(false);
  const [signupRole, setSignupRole] = useState<"user" | "partner" | "affiliate">("user");
  const [imgError, setImgError] = useState(false);
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
    if (isMenuOpen) {
      document.body.classList.add("mobile-menu-open");
    } else {
      document.body.classList.remove("mobile-menu-open");
    }
    return () => {
      document.body.classList.remove("mobile-menu-open");
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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
    setIsUserMenuOpen(false);
  }, [location.pathname, isAuthenticated]);

  useEffect(() => {
    setImgError(false);
  }, [user?.profilePicture]);

  useEffect(() => {
    setIsSignupOpen(openSignup);
  }, [openSignup]);

  const isModalOpenRef = useRef(isContactOpen);
  useEffect(() => {
    isModalOpenRef.current = isContactOpen;
  }, [isContactOpen]);

  useEffect(() => {
    // Rule 1: Show after 10 seconds on site (once per session)
    const hasFilled = safeStorageGet("local", "hasFilledGetInTouch");
    const hasShownInitial = safeStorageGet("session", "hasShownInitialGetInTouch");
    if (!hasShownInitial && !hasFilled) {
      let sessionStartTime = safeStorageGet("session", "sessionStartTime");
      if (!sessionStartTime) {
        sessionStartTime = Date.now().toString();
        safeStorageSet("session", "sessionStartTime", sessionStartTime);
      }

      const elapsed = Date.now() - parseInt(sessionStartTime);
      const remaining = Math.max(0, 10000 - elapsed);

      const timer = setTimeout(() => {
        const alreadyShown = safeStorageGet("session", "hasShownInitialGetInTouch");
        const hasFilledLatest = safeStorageGet("local", "hasFilledGetInTouch");
        if (!alreadyShown && !hasFilledLatest) {
          setIsContactOpen(true);
          safeStorageSet("session", "hasShownInitialGetInTouch", "true");
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
      const hasFilled = safeStorageGet("local", "hasFilledGetInTouch");
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
    const alreadyShown = safeStorageGet("session", sessionKey);
    const hasFilled = safeStorageGet("local", "hasFilledGetInTouch");
    if (alreadyShown || hasFilled) return;

    const timer = setTimeout(() => {
      const hasFilledLatest = safeStorageGet("local", "hasFilledGetInTouch");
      if (!isModalOpenRef.current && !hasFilledLatest) {
        setIsContactOpen(true);
        safeStorageSet("session", sessionKey, "true");
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

  const profilePictureUrl = user?.profilePicture
    ? getUploadedFileUrl(user.profilePicture)
    : "";

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[100] h-14 border-b border-transparent bg-[#FAFAF7] transition-[background-color,box-shadow,border-color,backdrop-filter] duration-500 ease-out md:h-16",
          scrolled && "border-[#36503F]/10 bg-[#FAFAF7]/70 shadow-[0_12px_36px_rgba(54,80,63,0.12)] backdrop-blur-2xl supports-[backdrop-filter]:bg-[#FAFAF7]/65"
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-0 transition-opacity duration-500",
            scrolled ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.58),rgba(255,255,255,0.24)_38%,rgba(254,248,197,0.18)_62%,rgba(54,80,63,0.08))]" />
          <div className="absolute -left-28 top-0 h-full w-28 -skew-x-12 bg-white/35 blur-md animate-[header-glass-sweep_3s_ease-in-out_infinite]" />
        </div>
        <div
          className={cn(
            "pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-center scale-x-0 bg-gradient-to-r from-transparent via-[#36503F]/35 to-transparent opacity-0 transition-all duration-500",
            scrolled && "scale-x-100 opacity-100"
          )}
        />
        <div className="fs-container relative z-10 flex h-full items-center justify-between">
          
          <div className="flex items-center gap-2 lg:gap-0">
            {/* Hamburger (Mobile only) */}
            <button
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
              className="group flex h-10 w-10 items-center justify-center lg:hidden transition-all active:scale-95 bg-transparent -ml-3"
            >
              <div className="flex flex-col items-start gap-[6px]">
                <span className="h-[2.5px] w-[24px] rounded-full bg-[#36503F] transition-all duration-300" />
                <span className="h-[2.5px] w-[18px] rounded-full bg-[#36503F] transition-all duration-300 group-hover:w-[24px]" />
                <span className="h-[2.5px] w-[12px] rounded-full bg-[#36503F] transition-all duration-300 group-hover:w-[24px]" />
              </div>
            </button>

            {/* Logo */}
            <Link
              to="/"
              aria-label="FlashSpace home"
              className="flex min-w-[100px] lg:min-w-[120px] items-center"
            >
              <img
                src="/Logo/Flashspace Logo.png"
                alt="FlashSpace"
                className="h-[22px] w-auto md:h-7"
              />
            </Link>
          </div>

          <nav className="hidden items-center gap-8 lg:flex h-full">
            {navData.map((item, idx) => (
              <div key={idx} className="relative group h-full flex items-center">
                {item.isMegaMenu || item.isDropdown ? (
                  <button className="flex items-center gap-1 text-sm font-medium text-[#36503F] transition-colors hover:text-[#1F2E26]">
                    {item.label}
                    <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                  </button>
                ) : (
                  <Link to={item.href || "#"} className="flex items-center text-sm font-medium text-[#36503F] transition-colors hover:text-[#1F2E26]">
                    {item.label}
                  </Link>
                )}

                {item.isMegaMenu && (
                  <div className={`absolute top-[100%] left-[-20px] pt-2 mt-0 w-[850px] max-w-[90vw] transition-all duration-300 z-50 ${hideDropdowns ? 'opacity-0 invisible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'}`}>
                    <MegaMenuDropdown sections={item.sections} closeMenu={closeDesktopDropdowns} />
                  </div>
                )}

                {item.isDropdown && (
                  <div className={`absolute top-[100%] left-0 pt-2 mt-0 w-48 transition-all duration-300 z-50 ${hideDropdowns ? 'opacity-0 invisible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'}`}>
                    <div className="bg-white rounded-xl shadow-lg border border-[#FEF8C5]/50 py-2 text-left flex flex-col">
                      {item.items?.map((sub, subIdx) => (
                        <Link 
                          key={subIdx} 
                          to={sub.href} 
                          onClick={closeDesktopDropdowns}
                          className="text-[15px] text-gray-600 hover:text-[#36503F] hover:bg-[#FEF8C5]/40 hover:font-bold transition-all duration-200 block px-5 py-2.5 border-l-[3px] border-transparent hover:border-l-[#36503F]"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a 
              href="tel:+919888687898" 
              className="flex items-center gap-1 md:gap-1.5 text-[12px] md:text-[13px] font-bold text-[#36503F] border border-[#228B22] md:border-[#36503F] rounded-full px-3 py-1.5 md:px-4 md:py-2 hover:bg-[#36503F]/5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              +91 98886 87898
            </a>

            <button
              onClick={() => setIsContactOpen(true)}
              className="hidden rounded-full bg-[#36503F] px-5 py-2 text-[13px] font-semibold text-[#FEF8C5] transition-transform hover:scale-[1.01] hover:bg-[#1F2E26] active:scale-[0.99] sm:inline-flex"
            >
              Get started
            </button>

            {isAuthenticated ? (
              <div ref={userMenuRef} className="relative hidden lg:block">
                <button
                  onClick={() => setIsUserMenuOpen((value) => !value)}
                  className="flex items-center rounded-full border border-[#36503F]/20 bg-[#36503F]/5 p-1 text-[#36503F]"
                >
                  <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-white text-sm font-bold text-[#36503F]">
                    {profilePictureUrl && !imgError ? (
                      <img
                        src={profilePictureUrl}
                        alt={user?.fullName || "User"}
                        className="h-full w-full object-cover"
                        onError={() => setImgError(true)}
                      />
                    ) : (
                      (user?.fullName?.charAt(0) || "U").toUpperCase()
                    )}
                  </span>
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
              <button onClick={() => navigate("/login")} className="hidden text-sm font-medium text-[#36503F] hover:text-[#1F2E26] lg:inline-flex">
                Sign in
              </button>
            )}
          </div>
        </div>
      </header>

      <div className={cn("fixed inset-0 z-[120] bg-black/30 transition-opacity lg:hidden", isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0")}>
        <aside className={cn("flex flex-col h-full w-[75vw] max-w-sm bg-[#36503F] px-6 py-5 transition-transform duration-200", isMenuOpen ? "translate-x-0" : "-translate-x-full")}>
          <div className="mb-8 flex items-center justify-between">
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
          
          {isAuthenticated && (
            <div className="mb-6 flex items-center gap-3 border-b border-[#FEF8C5]/20 pb-6">
              <Link to="/dashboard" onClick={closeDrawer} className="flex items-center gap-4 w-full">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-lg font-bold text-[#36503F]">
                  {profilePictureUrl && !imgError ? (
                    <img
                      src={profilePictureUrl}
                      alt={user?.fullName || "User"}
                      className="h-full w-full object-cover"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    (user?.fullName?.charAt(0) || "U").toUpperCase()
                  )}
                </span>
                <div className="flex flex-col overflow-hidden text-left">
                  <span className="truncate text-base font-semibold text-white">{user?.fullName}</span>
                  <span className="truncate text-[13px] text-[#FEF8C5]/80 hover:text-[#FEF8C5] transition-colors">View Dashboard</span>
                </div>
              </Link>
            </div>
          )}

          <nav className="flex flex-col gap-1 flex-1 overflow-y-auto pr-2 pb-4">
            {navData.map((item, idx) => (
              item.isMegaMenu ? (
                <details key={idx} className="group">
                  <summary className="flex items-center justify-between rounded-lg px-2 py-3 text-base font-medium text-white transition-colors hover:bg-white/5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                    {item.label}
                    <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="pl-4 pb-2 space-y-4">
                    {item.sections?.map((section, sIdx) => (
                      <div key={sIdx}>
                        <h4 className="text-[#FEF8C5] text-xs font-bold uppercase tracking-wider mb-2">{section.title}</h4>
                        <div className="space-y-2 pl-2 border-l border-white/10">
                          {section.items.map((sub, subIdx) => (
                            <Link key={subIdx} to={sub.href} onClick={closeDrawer} className="block text-sm text-white/70 hover:text-white py-1">
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              ) : item.isDropdown ? (
                <details key={idx} className="group">
                  <summary className="flex items-center justify-between rounded-lg px-2 py-3 text-base font-medium text-white transition-colors hover:bg-white/5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                    {item.label}
                    <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="pl-4 pb-2 space-y-2 border-l border-white/10 ml-2">
                    {item.items?.map((sub, subIdx) => (
                      <Link key={subIdx} to={sub.href} onClick={closeDrawer} className="block text-sm text-white/70 hover:text-white py-1.5 pl-2">
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </details>
              ) : (
                <Link key={idx} to={item.href || "#"} onClick={closeDrawer} className="block rounded-lg px-2 py-3 text-base font-medium text-white transition-colors hover:bg-white/5">
                  {item.label}
                </Link>
              )
            ))}
          </nav>
          
          <div className="mt-auto pt-6 flex flex-col gap-3">
            <button onClick={() => { closeDrawer(); setIsContactOpen(true); }} className="w-full rounded-full border border-[#FEF8C5]/70 bg-[#36503F] px-5 py-3 text-sm font-bold text-[#FEF8C5] transition-colors hover:bg-white/10">
              Get started
            </button>
            
            {!isAuthenticated ? (
              <button onClick={() => { closeDrawer(); navigate("/login"); }} className="w-full rounded-full bg-[#FEF8C5] px-5 py-3 text-sm font-bold text-[#36503F] transition-colors hover:bg-white">
                Sign in
              </button>
            ) : (
              <button onClick={async () => { closeDrawer(); await logout(); navigate("/"); }} className="flex w-full items-center justify-center gap-2 rounded-full border border-[#FEF8C5]/70 bg-[#36503F] px-5 py-3 text-sm font-bold text-red-400 transition-colors hover:bg-white/10">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            )}
          </div>
        </aside>
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => navigate("/")} onSignupClick={() => navigate("/signup")} onLoginSuccess={handleLoginSuccess} />
      <SignupModal isOpen={isSignupOpen} onClose={() => navigate("/")} initialRole={signupRole} onLoginClick={() => navigate("/login")} />
      <PartnerChoiceModal isOpen={isPartnerChoiceOpen} onClose={() => setIsPartnerChoiceOpen(false)} onSelect={openPartnerSignup} />
      <GetInTouchModal open={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
};

export default Header;
