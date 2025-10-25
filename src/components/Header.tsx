import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { smoothScrollTo } from "@/lib/lenis";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Splash3dButton from "@/components/ui/3d-splash-button";
import { X, Phone, Building2, Users, Zap, FileText, UserCheck, ArrowRight } from "lucide-react";
import { CiMenuFries } from "react-icons/ci";
// Use alias import to avoid case-sensitive path confusion across environments
import SidebarMenu from "@/components/SidebarMenu";
import Index from "@/pages/Index";
import Splash3dButtonDemo from "./ui/3d-splash-button/demo";
// import FileUploadButton from "./FileUploadButton";
// Using uploaded FlashSpace logo
// Menu and social items for accessibility and SEO
const menuItems = [
  { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
  { label: 'About', ariaLabel: 'Learn about us', link: '/about' },
  { label: 'Services', ariaLabel: 'View our services', link: '/services' },
  { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' }
];

const socialItems = [
  { label: 'Twitter', link: 'https://twitter.com' },
  { label: 'GitHub', link: 'https://github.com' },
  { label: 'LinkedIn', link: 'https://linkedin.com' }
];

interface HeaderProps {
  forceWhiteBackground?: boolean;
}

const Header = ({ forceWhiteBackground = false }: HeaderProps) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    { label: "All Solutions", href: "#solutions", hasDropdown: true },
    { label: "Partner with Us", href: "/partner" },
    {
      label: "More",
      href: "#more",
      hasDropdown: true,
      subItems: [
        { label: "Blog", link: "/blog" },
        { label: "Career", link: "/career" },
        { label: "About Us", link: "/aboutus" }
      ]
    },
  ];

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // NEW: state + ref for More dropdown
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Detect scroll to toggle header background
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      setScrolled(y > 10);
    };
    onScroll(); // initialize state
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown(s) when clicking outside (handles both dropdowns)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsDropdownOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(target)) {
        setIsMoreOpen(false);
      }
    };

    if (isDropdownOpen || isMoreOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, isMoreOpen]);

  const handleNavigation = (href: string) => {
    if (href.startsWith('#')) {
      try {
        smoothScrollTo(href, { offset: -90 });
      } catch {
        // fallback native smooth if Lenis unavailable
        const element = document.querySelector(href);
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // Use React Router navigation for internal routes
      navigate(href);
    }
    setIsMenuOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-[100] transition-all duration-300 text-md  ",
        scrolled || forceWhiteBackground
          ? "bg-white/95 supports-[backdrop-filter]:bg-white/65 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent backdrop-blur-sm"
      )}
      style={{ fontFamily: 'Poppins' }}
    >
      <div className="w-full px-4 py-3">
        <div className="flex items-center">
          {/* Menu Button - Extreme Left */}
          <button
            className="p-2 rounded-md hover:bg-black/5 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-black/20 flex-shrink-0 -ml-2"
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            aria-controls="flashspace-fullmenu"
            onClick={() => setIsMenuOpen(true)}
          >
            <CiMenuFries className="h-6 w-6 text-black" />
          </button>

          {/* Logo */}
          <div className="text-xl font-bold tracking-tight cursor-pointer w-60 flex-shrink-0 ml-2" onClick={() => handleNavigation("/")} >
            <span className="text-black transition-colors duration-300">
              <img 
                src="https://cdn.prod.website-files.com/664330484432dcdd6519a8fd/665dd8e0007de68a44f3750b_Black%20and%20White%20Bold%20Typography%20Clothing%20Brand%20Logo%20(940%20x%20400%20px)%20(940%20x%20200%20px)%20(940%20x%20150%20px).png" 
                alt="FlashSpace Logo"
                className="h-8 w-auto" 
              />
            </span>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-center space-x-8 mx-8 flex-1">
            {/* All Solutions Dropdown */}
            <div
              ref={dropdownRef}
              className="relative"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsDropdownOpen(false);
              }}
            >
              <button
                className="text-md font-semibold font-content flex items-center gap-1 cursor-pointer transition-colors duration-300 text-black hover:text-primary"
                onClick={() => setIsDropdownOpen((open) => !open)}
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsDropdownOpen((open) => !open);
                  }
                }}
              >
                All Solutions
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                  <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              <div
                className={`absolute left-1/2 top-full w-[600px] bg-white border border-border rounded-lg shadow-lg z-50 mt-2 transition-all duration-300 ${isDropdownOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-2'}`}
                style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.08)', transform: 'translateX(-50%)' }}
              >
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Left: On-Demand sub-features */}
                    <div className="border border-border/50 rounded-lg p-4 bg-white/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="w-4 h-4 text-primary" />
                        <h4 className="text-sm font-semibold">On-Demand</h4>
                      </div>
                      <p className="text-xs text-foreground/60 mb-3">Book by the hour or day</p>
                      <div className="flex flex-col">
                        {[
                          { label: 'Meeting Rooms', type: 'meeting-room' },
                          { label: 'Training Rooms', type: 'training-room' },
                          { label: 'Phone Booths', type: 'phone-booth' },
                          { label: 'Day Offices', type: 'day-office' },
                        ].map((item) => (
                          <button
                            key={item.type}
                            className="flex items-center justify-between text-left text-sm px-3 py-2 rounded-md hover:bg-accent/10 transition-colors"
                            onClick={() => { handleNavigation(`/Solutions/on-demand?type=${item.type}`); setIsDropdownOpen(false); }}
                          >
                            <span className="text-foreground/80">{item.label}</span>
                            <ArrowRight className="w-4 h-4 text-foreground/40" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Right: Three main solution cards */}
                    <div className="grid grid-cols-1 gap-3">
                      {[ 
                        {
                          icon: Building2,
                          title: 'Virtual Office',
                          desc: 'Business address, mail handling, call forwarding',
                          href: '/Solutions/virtual-office',
                        },
                        {
                          icon: Users,
                          title: 'Coworking Space',
                          desc: 'Flexible desks, private cabins, team suites',
                          href: '/Solutions/coworking-space',
                        },
                        {
                          icon: FileText,
                          title: 'Business Setup',
                          desc: 'Company registration, GST, compliance',
                          href: '/Solutions/business-setup',
                        },
                      ].map(({ icon: Icon, title, desc, href }) => (
                        <div
                          key={title}
                          className="group flex items-start gap-3 p-4 rounded-lg border border-border/60 hover:bg-accent/10 hover:border-border cursor-pointer transition-colors"
                          onClick={() => { handleNavigation(href); setIsDropdownOpen(false); }}
                        >
                          <Icon className="w-5 h-5 text-primary mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h5 className="text-sm font-semibold group-hover:text-primary">{title}</h5>
                              <ArrowRight className="w-4 h-4 text-foreground/40 group-hover:text-primary" />
                            </div>
                            <p className="text-xs text-foreground/60 mt-1">{desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom CTAs */}
                  <div className="mt-4">
                    <button
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent/90 text-black rounded-lg transition-colors font-medium text-sm"
                      onClick={() => { handleNavigation('#contact'); setIsDropdownOpen(false); }}
                    >
                      <UserCheck className="w-4 h-4" />
                      Get Consultation
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Other nav items */}
            <button
              onClick={() => handleNavigation("/partner")}
              className="text-md font-medium font-content transition-colors duration-300 text-black hover:text-primary"
            >
              Partner with Us
            </button>

            {/* More dropdown (NEW) */}
            <div
              ref={moreRef}
              className="relative"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsMoreOpen(false);
              }}
            >
              <button
                onClick={() => setIsMoreOpen((o) => !o)}
                aria-haspopup="true"
                aria-expanded={isMoreOpen}
                className="text-md font-medium font-content transition-colors duration-300 text-black hover:text-primary flex items-center gap-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsMoreOpen((o) => !o);
                  }
                }}
              >
                More
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className={`transition-transform duration-300 ${isMoreOpen ? 'rotate-180' : ''}`}>
                  <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* More Dropdown content */}
              <div className={`absolute right-0 top-full mt-2 w-44 bg-white border border-border rounded-md shadow-lg z-40 transition-all duration-200 ${isMoreOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-1'}`}>
                <div className="py-1">
                  {[
                    { label: "Blog", link: "/blog" },
                    { label: "Career", link: "/career" },
                    { label: "About Us", link: "/aboutus" }
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => { handleNavigation(opt.link); setIsMoreOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* Right: Language, CTA Buttons */}
          <div className="flex items-center space-x-4 ml-auto">
            {/* Language Selector */}
            <div className="hidden lg:flex items-center px-3 py-1.5 rounded-md border transition-colors duration-300 border-gray-300 text-black">
              <span className="text-sm font-md">IND</span>
            </div>

            {/* Get in Touch Button */}
            <Splash3dButton
              onClick={() => handleNavigation("#contact")}
              className="hidden lg:inline-flex relative px-6 py-2.5 text-base rounded-lg font-bold bg-black text-white border border-black shadow-[0_2px_8px_0_rgba(0,0,0,0.10)] hover:shadow-[0_4px_16px_0_rgba(0,0,0,0.13)] active:translate-y-1 transition-all duration-150 before:content-[''] before:absolute before:inset-0 before:rounded-lg before:pointer-events-none"
            >
              Get in Touch
            </Splash3dButton>
            <Button
              onClick={() => handleNavigation("/login")}
              variant="outline"
              className="hidden lg:inline-flex px-4 py-2 text-sm rounded-md transition-all duration-300 border-gray-300 text-black hover:bg-gray-50"
              style={{ fontFamily: 'Poppins'  }}
            >
              Log in
            </Button>
          </div>
        </div>

        {/* Full Page Menu Overlay */}
        <SidebarMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </div>
    </header>
  );
};

export default Header;
