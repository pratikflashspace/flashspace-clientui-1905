import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { smoothScrollTo } from "@/lib/lenis";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Splash3dButton from "@/components/ui/3d-splash-button";
import { Phone, Building2, Users, Zap, FileText, ArrowRight, LayoutDashboard, LogOut, User as UserIcon, Settings, ChevronDown } from "lucide-react";
import { CiMenuFries } from "react-icons/ci";
import SidebarMenu from "@/components/SidebarMenu";
import { useAuth } from "@/contexts/AuthContext";
import GetInTouch from "@/pages/GetInTouch";

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
}

const Header = ({ forceWhiteBackground = false, lightText = false, loginBlack = false }: HeaderProps) => {
  const navigate = useNavigate();
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
            ? "bg-white/95 supports-[backdrop-filter]:bg-white/65 backdrop-blur-md border-b border-border shadow-sm"
            : "bg-transparent backdrop-blur-sm"
        )}
        style={{ fontFamily: "Poppins" }}
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
              <CiMenuFries className="h-6 w-6 text-black" />
            </button>

            {/* Logo */}
            <div
              className="text-xl font-bold tracking-tight cursor-pointer w-60 flex-shrink-0 ml-2"
              onClick={() => handleNavigation("/")}
            >
              <img
                src="https://cdn.prod.website-files.com/664330484432dcdd6519a8fd/665dd8e0007de68a44f3750b_Black%20and%20White%20Bold%20Typography%20Clothing%20Brand%20Logo%20(940%20x%20400%20px)%20(940%20x%20200%20px)%20(940%20x%20150%20px).png"
                alt="FlashSpace Logo"
                className="h-8 w-auto"
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center justify-center space-x-8 mx-8 flex-1">
              {/* === All Solutions Dropdown === */}
              <div ref={solutionsRef} className="relative">
                <button
                  className="text-md font-semibold flex items-center gap-1 cursor-pointer transition-colors text-black hover:text-primary"
                  onClick={() => setIsSolutionsOpen((prev) => !prev)}
                >
                  All Solutions
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="none"
                    className={`transition-transform duration-300 ${isSolutionsOpen ? "rotate-180" : ""}`}
                  >
                    <path
                      d="M6 8L10 12L14 8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <div
                  className={`absolute left-1/2 top-full w-[600px] bg-white border border-border rounded-lg shadow-lg z-50 mt-2 transition-all duration-300 ${
                    isSolutionsOpen
                      ? "opacity-100 pointer-events-auto translate-y-0"
                      : "opacity-0 pointer-events-none -translate-y-2"
                  }`}
                  style={{
                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                    transform: "translateX(-50%)",
                  }}
                >
                  <div className="p-4 grid grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4 bg-white/50">
                      <div className="flex items-center gap-2 mb-1 cursor-pointer" onClick={() => { handleNavigation("/Solutions/on-demand"); setIsSolutionsOpen(false); }}>
                        <Zap className="w-4 h-4 text-primary" />
                        <h4 className="text-sm font-semibold hover:text-primary transition-colors">On-Demand</h4>
                      </div>
                      <p className="text-xs text-gray-500 mb-3">Book by the hour or day</p>
                      {[
                        { label: "Meeting Rooms", type: "meeting-room", href: "/Solutions/meetingsroom" },
                        { label: "Event Space", type: "training-room", href: "/Solutions/eventspace" },
                        { label: "Day Offices", type: "day-office", href: "/Solutions/day-office" },
                      ].map((item) => (
                        <button
                          key={item.type}
                          className="flex items-center justify-between text-left text-sm px-3 py-2 rounded-md hover:bg-gray-100"
                          onClick={() => {
                            handleNavigation(item.href);
                            setIsSolutionsOpen(false);
                          }}
                        >
                          {item.label}
                          <ArrowRight className="w-4 h-4 text-gray-400" />
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
                          className="flex items-start gap-3 p-4 rounded-lg border hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
                            handleNavigation(href);
                            setIsSolutionsOpen(false);
                          }}
                        >
                          <Icon className="w-5 h-5 text-primary mt-0.5" />
                          <div>
                            <h5 className="text-sm font-semibold">{title}</h5>
                            <p className="text-xs text-gray-500 mt-1">{desc}</p>
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
                className="text-md font-medium transition-colors text-black hover:text-primary"
              >
                Partner with Us
              </button>

              {/* === More Dropdown === */}
              <div ref={moreRef} className="relative">
                <button
                  className="text-md font-medium flex items-center gap-1 cursor-pointer transition-colors text-black hover:text-primary"
                  onClick={() => setIsMoreOpen((prev) => !prev)}
                >
                  More
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="none"
                    className={`transition-transform duration-300 ${isMoreOpen ? "rotate-180" : ""}`}
                  >
                    <path
                      d="M6 8L10 12L14 8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {isMoreOpen && (
                  <ul className="absolute bg-white border border-border rounded-md shadow-lg mt-2 w-40 py-2 z-50">
                    {[
                      { label: "About Us", href: "/about" },
                      { label: "Career", href: "/career" },
                      { label: "Blog", href: "/blog" },
                    ].map((item) => (
                      <li key={item.label}>
                        <button
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
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
                  className="flex items-center px-3 py-1.5 rounded-md border border-gray-300 text-black gap-2 focus:outline-none bg-white"
                  onClick={() => setCountryDropdownOpen((prev) => !prev)}
                  aria-haspopup="listbox"
                  aria-expanded={countryDropdownOpen}
                >
                  <img src={selectedCountry.flag} alt={selectedCountry.code} className="h-5 w-5 rounded-full" />
                  <span className="text-sm">{selectedCountry.code}</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 20 20"
                    fill="none"
                    className={`ml-2 transition-transform duration-300 ${countryDropdownOpen ? "rotate-180" : ""}`}
                  >
                    <path
                      d="M6 8L10 12L14 8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {countryDropdownOpen && (
                  <ul
                    className="absolute left-0 top-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 min-w-[110px] py-1"
                    role="listbox"
                  >
                    {countries.map((country) => (
                      <li key={country.code}>
                        <button
                          className={`flex items-center w-full px-3 py-2 text-left hover:bg-gray-100 gap-2 text-sm`}
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

              <Splash3dButton
                onClick={() => setIsContactOpen(true)} // opens popup
                className="hidden lg:inline-flex relative px-6 py-2.5 text-base rounded-lg font-bold bg-black text-white border border-black hover:shadow-md transition-all"
              >
                Get in Touch
              </Splash3dButton>

              {/* User Authentication - Profile Dropdown or Login */}
              {isAuthenticated ? (
                <div ref={userMenuRef} className="relative hidden lg:block">
                  <button
                    onClick={() => setIsUserMenuOpen((prev) => !prev)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 border border-gray-200 bg-yellow-50"
                  >
                    {/* User Avatar */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                      {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    {/* User Name */}
                    <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                      {user?.fullName || 'User'}
                    </span>
                    {/* Dropdown Icon */}
                    <ChevronDown 
                      className={cn(
                        "h-4 w-4 text-gray-500 transition-transform duration-200",
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
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
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
                <Button
                  onClick={() => handleNavigation("/login")}
                  variant="outline"
                  className="hidden lg:inline-flex px-4 py-2 text-sm rounded-md border-gray-300 text-black hover:bg-gray-50"
                >
                  Log in
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar Menu */}
          <SidebarMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </div>
      </header>

      {/* === Contact Popup === */}
      <GetInTouch isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
};

export default Header;
