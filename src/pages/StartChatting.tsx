import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send, Mic, Plus, MapPin, Building2, FileText, Briefcase, Users, Menu as MenuIcon,
  Phone, Mail, User, Sparkles, MoreVertical, MessageSquare, Search, Heart, FolderKanban,
  Bell, Compass, PlusCircle, ArrowRight, ExternalLink, Home, Calendar, Megaphone,
  Settings, MoreHorizontal, X // [NEW] Added X icon
} from 'lucide-react';
import { createPortal } from "react-dom"; // [NEW] Added createPortal
import Splash3dButton from '@/components/ui/3d-splash-button';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// TypeScript Interfaces
interface QuickAction {
  title: string;
  subtitle: string;
  bg: string;
  icon: React.ElementType;
  color: string;
}

interface PopularSpace {
  name: string;
  location: string;
  type: string;
  image?: string;
}

interface ContactForm {
  name: string;
  phone: string;
  email: string;
}

interface SidebarMenuItem {
  label: string;
  icon: React.ElementType;
  onClick?: () => void;
}


// [NEW] Constants for the popup
const SIDEBAR_WIDTH_ICON = 80; // Your sidebar is 80px (w-20)
const UPDATES_WIDTH = 520;

// [NEW] Copied the UpdatesPopup component from your other file
// ------------------------------------------------
// UpdatesPopup component
// ------------------------------------------------
const UpdatesPopup = ({
  open,
  menuWidth,
  onCloseBoth
}: {
  open: boolean;
  menuWidth: number;
  onCloseBoth: () => void;
}) => {
  // [MODIFIED] Removed "if (!open) return null" to allow animation

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: menuWidth, // This will be 80px
        width: UPDATES_WIDTH,
        height: "100vh",
        // [MODIFIED] Lower Z-index than sidebar (Sidebar is z-[60])
        zIndex: 50, 
        // [MODIFIED] Slide logic: 0 is visible, -100% hides it to the left (under sidebar)
        transform: open ? "translateX(0)" : "translateX(-100%)",
        // [MODIFIED] Add opacity for smoother fade
        opacity: open ? 1 : 0,
        // [MODIFIED] Pointer events ensures you can't click it when hidden
        pointerEvents: open ? "auto" : "none",
        transition: "transform 0.4s cubic-bezier(.25,.8,.25,1), opacity 0.3s ease-in-out",
        // [MODIFIED] Shadow to give depth when sliding out
        boxShadow: "10px 0 30px rgba(0,0,0,0.1)" 
      }}
    >
      <div
        style={{
          background: "#fff",
          borderTopLeftRadius: "0px",
          borderBottomLeftRadius: "0px",
          borderTopRightRadius: "22px",
          borderBottomRightRadius: "22px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          padding: "28px 32px 32px 32px",
          width: "100%",
          height: "100%",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          position: "relative"
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: 18,
              color: "#222",
              marginTop: 10,
              letterSpacing: "0.5px"
            }}
          >
            Update & <span style={{ color: "#FFCC00" }}>Notification</span>
          </h2>
          <button
            onClick={onCloseBoth}
            aria-label="Close updates"
            style={{ background: "transparent", border: "none", cursor: "pointer", padding: 8 }}
          >
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Updates Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.3rem" }}>
          <div style={{ background: "#f6f7ff", borderRadius: "14px", padding: "18px" }}>
            <strong>Site Launched!</strong>
            <p style={{ margin: "10px 0 0 0", color: "#506" }}>
              We have deployed the first AI-enabled business workspace platform. 🎉
            </p>
          </div>

          <div style={{ background: "#f0fff6", borderRadius: "14px", padding: "18px" }}>
            <strong>New Feature: Flash Tribe</strong>
            <p style={{ margin: "10px 0 0 0", color: "#265" }}>
              Now connect with fellow workspace members and grow your professional network.
            </p>
          </div>

          <div style={{ background: "#fff8f0", borderRadius: "14px", padding: "18px" }}>
            <strong>Maintenance Notice</strong>
            <p style={{ margin: "10px 0 0 0", color: "#a64" }}>
              There’s scheduled maintenance on Nov 3rd, 2AM to 3AM IST.
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
// ------------------------------------------------
// End of UpdatesPopup
// ------------------------------------------------


const StartChatting = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showUpdates, setShowUpdates] = useState(false); // [NEW] State for the popup
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [contactForm, setContactForm] = useState<ContactForm>({
    name: '',
    phone: '',
    email: ''
  });

  const [selectedCity] = useState('Delhi');

  const popularSpaces: PopularSpace[] = [
    { name: 'Connaught Place Hub', location: 'CP, New Delhi', type: 'Premium', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80&fit=crop&crop=entropy&auto=format' },
    { name: 'Nehru Place Tech', location: 'Nehru Place, Delhi', type: 'Startup', image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&q=80&fit=crop&crop=entropy&auto=format' },
    { name: 'Saket Business', location: 'Saket, New Delhi', type: 'Premium', image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&q=80&fit=crop&crop=entropy&auto=format' },
    { name: 'Dwarka Workspace', location: 'Dwarka, Delhi', type: 'Startup', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80&fit=crop&crop=entropy&auto=format' }
  ];

  const inspirationCards = [
    {
      title: 'Ultimate Workspace Guide',
      description: 'Everything you need to know about choosing the perfect workspace',
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&q=80&fit=crop'
    },
    {
      title: 'Startup Success Stories',
      description: 'How Indian startups scaled with the right workspace solutions',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80&fit=crop'
    },
    {
      title: 'Workspace Trends 2025',
      description: 'Latest trends shaping the future of flexible workspaces',
      image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&q=80&fit=crop'
    }
  ];

  const complianceServices: string[] = [
    'GST Registration',
    'Company Formation',
    'FSSAI License',
    'Trade License',
    'Professional Tax',
    'Labour License'
  ];


  const sidebarMenuItems: SidebarMenuItem[] = [
    { label: 'Start Chatting', icon: MessageSquare, onClick: () => handleNavigation('/start-chatting') },
    { label: 'Get Workspace', icon: Building2, onClick: () => handleNavigation('/solutions/on-demand') },
    { label: 'Business Setup', icon: Briefcase, onClick: () => handleNavigation('/solutions/business-setup') },
    { label: 'Your Bookings', icon: Calendar, onClick: () => handleNavigation('/bookings') },
    { label: 'Flash Tribe', icon: Users, onClick: () => handleNavigation('/community') },
    { label: 'Updates', icon: Bell, onClick: () => setShowUpdates(prev => !prev) }, // [NEW] Wire up the button
    { label: 'Settings', icon: Settings, onClick: () => console.log('Settings clicked') },
  ];

  // [NEW] Close popup function
  const closeBoth = () => {
    setShowUpdates(false);
    setIsSidebarOpen(false); // Also close mobile sidebar if open
  };

  // [NEW] Handle Escape key and body scroll
  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeBoth();
    };
    // Only block body scroll if the popup is open
    if (showUpdates) {
      document.addEventListener("keydown", esc);
      document.body.style.overflow = "hidden";
    } else {
      // Only unset if the mobile menu isn't also open
      if (!isSidebarOpen) {
        document.body.style.overflow = "unset";
      }
    }
    return () => {
      document.removeEventListener("keydown", esc);
      // Always clean up to unset, the other effect for isSidebarOpen will handle it
      document.body.style.overflow = "unset";
    };
  }, [showUpdates, isSidebarOpen]); // [NEW] Added isSidebarOpen as dependency

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleContactSubmit = () => {
    console.log('Contact form submitted:', contactForm);
    setContactForm({ name: '', phone: '', email: '' });
  };

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden" style={{ fontFamily: 'Geist, Poppins, sans-serif' }}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 lg:left-20">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Main Text Logo */}
            <img
              src="https://cdn.prod.website-files.com/664330484432dcdd6519a8fd/665dd8e0007de68a44f3750b_Black%20and%20White%20Bold%20Typography%20Clothing%20Brand%20Logo%20(940%20x%20400%20px)%20(940%20x%20200%20px)%20(940%20x%20150%20px).png"
              alt="FlashSpace Logo"
              className="h-7 w-auto cursor-pointer"
              onClick={() => handleNavigation('/')}
            />
          </div>
          <div className="flex items-center gap-3">
            {/* IND Button */}
            <div className="hidden sm:flex items-center px-3 py-1.5 rounded-md border transition-colors duration-300 border-gray-300 text-black">
              <span className="text-sm font-md">IND</span>
            </div>

            {/* Get in Touch Button */}
            <Splash3dButton
              onClick={() => handleNavigation('/get-in-touch')}
              className="hidden sm:inline-flex relative px-6 py-2.5 text-base rounded-lg font-bold bg-black text-white border border-black shadow-[0_2px_8px_0_rgba(0,0,0,0.10)] hover:shadow-[0_4px_16px_0_rgba(0,0,0,0.13)] active:translate-y-1 transition-all duration-150 before:content-[''] before:absolute before:inset-0 before:rounded-lg before:pointer-events-none"
            >
              Get in Touch
            </Splash3dButton>

            {/* Log in Button */}
            <Button
              onClick={() => handleNavigation('/login')}
              variant="outline"
              className="hidden sm:inline-flex px-4 py-2 text-sm rounded-md transition-all duration-300 border-gray-300 text-black hover:bg-gray-50"
              style={{ fontFamily: 'Poppins' }}
            >
              Log in
            </Button>
          </div>
        </div>
      </header>

      {/* [NEW] Transparent Overlay for Updates Popup */}
      {/* This sits below the popup (z-9999) but above the page content */}
      {showUpdates && (
        <div
          onClick={closeBoth}
          className="fixed inset-0 z-[45]"
          style={{ background: "transparent" }}
        />
      )}

      {/* [NEW] Render the Updates Popup */}
      <UpdatesPopup
        open={showUpdates}
        menuWidth={SIDEBAR_WIDTH_ICON} // [NEW] Pass the 80px width
        onCloseBoth={closeBoth}
      />

      {/* Backdrop Overlay (for mobile sidebar) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Fixed Left Sidebar - Always Visible on Desktop */}
      {/* [MODIFIED] Increased z-index to z-[60] so it sits ON TOP of the Updates Popup (z-50) */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-screen w-20 bg-white border-r border-gray-200 shadow-sm z-[60] flex flex-col overflow-hidden lg:translate-x-0 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ fontFamily: 'Geist, Poppins, sans-serif' }}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-center flex-shrink-0">
          <img
            src="https://res.cloudinary.com/diwna43hl/image/upload/v1759650866/FlashSpace_Favicon_sv6yhh.png"
            alt="FlashSpace Icon"
            className="h-10 w-10"
          />
        </div>

        {/* Sidebar Menu Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          <ul className="space-y-1">
            {/* [NEW] Note: The onClick for 'Updates' is now handled by the array definition above */}
            {sidebarMenuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={index}>
                  <button
                    onClick={() => {
                      item.onClick?.();

                      // [NEW] Only close mobile sidebar if it's *not* the updates button
                      if (item.label !== 'Updates' && window.innerWidth < 1024) {
                        setIsSidebarOpen(false);
                      }
                    }}
                    className="w-full flex items-center justify-center px-4 py-3 text-gray-700 rounded-lg transition-all duration-200 group"
                    title={item.label}
                  >
                    <Icon className="w-6 h-6 text-gray-700 group-hover:text-black group-hover:fill-[#EDB003] group-hover:scale-125 transition-all duration-200" strokeWidth={2} />
                  </button>
                </li>
              );
            })}

            {/* [CHANGE] Added Popover for 'More' button */}
            <li>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className="w-full flex items-center justify-center px-4 py-3 text-gray-700 rounded-lg transition-all duration-200 group"
                    title="More"
                  >
                    <MoreHorizontal className="w-6 h-6 text-gray-700 group-hover:text-black group-hover:fill-[#EDB003] group-hover:scale-125 transition-all duration-200" strokeWidth={2} />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-48" side="right" align="start" sideOffset={10}>
                  <div className="flex flex-col space-y-1 p-1">
                    <button
                      onClick={() => handleNavigation('/AboutUs')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      About Us
                    </button>
                    <button
                      onClick={() => handleNavigation('/Career')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      Career
                    </button>
                    <button
                      onClick={() => handleNavigation('/Blog')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      Blog
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </li>
          </ul>
        </nav>

        {/* Bottom Section - Profile & Footer */}
        <div className="border-t border-gray-100 p-4 flex-shrink-0 space-y-3">
          {/* Profile Button */}
          <button
            onClick={() => handleNavigation('/solutions/aboutus')}

            className="w-full flex items-center justify-center py-3 hover:bg-gray-50 rounded-lg transition-all duration-200"
            title="Profile"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#EDB003] to-[#f5c242] flex items-center justify-center text-white font-semibold">
              <User className="w-5 h-5" />
            </div>
          </button>

          {/* Footer */}
          <p className="text-[10px] text-gray-400 text-center">
            © 2025
          </p>
        </div>
      </div>

      {/* Main Content - Adjusted for sidebar */}
      <div className="flex-1 lg:ml-20 pt-16 flex flex-col lg:flex-row">
        <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-4rem)]">

          {/* Left Panel - Chat Interface - 60-65% - Fixed/Static (No Scroll) */}
          <div className="w-full lg:w-[60%] xl:w-[65%] h-full flex flex-col bg-white border-r border-gray-200 overflow-hidden">

            {/* Chat Content - Empty State */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-[#EDB003] rounded-xl flex items-center justify-center shadow-sm">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-3" >
                Need WorkSpace / Business Setup?
              </h2>
              <p className="text-gray-600 text-sm mb-6 max-w-lg leading-relaxed" >
                Hey! I'm here to assist you with end-to-end workspace and compliance requirements. Let's get started!
              </p>

              {/* Large Prompt Suggestions */}
              <div className="w-full max-w-2xl grid grid-cols-2 gap-3 mb-6">
                <button className="p-4 bg-gray-50 border border-gray-200 hover:border-[#EDB003] hover:bg-[#EDB003] hover:text-white rounded-lg text-left transition-all group">
                  <div className="text-sm font-semibold text-gray-900 group-hover:text-white" >Find coworking spaces</div>
                  <div className="text-xs text-gray-500 group-hover:text-white/90 mt-1" >in Delhi NCR region</div>
                </button>
                <button className="p-4 bg-gray-50 border border-gray-200 hover:border-[#EDB003] hover:bg-[#EDB003] hover:text-white rounded-lg text-left transition-all group">
                  <div className="text-sm font-semibold text-gray-900 group-hover:text-white" >GST Registration</div>
                  <div className="text-xs text-gray-500 group-hover:text-white/90 mt-1" >Complete registration process</div>
                </button>
                <button className="p-4 bg-gray-50 border border-gray-200 hover:border-[#EDB003] hover:bg-[#EDB003] hover:text-white rounded-lg text-left transition-all group">
                  <div className="text-sm font-semibold text-gray-900 group-hover:text-white" >Compare workspace plans</div>
                  <div className="text-xs text-gray-500 group-hover:text-white/90 mt-1" >Find the best deal</div>
                </button>
                <button className="p-4 bg-gray-50 border border-gray-200 hover:border-[#EDB003] hover:bg-[#EDB003] hover:text-white rounded-lg text-left transition-all group">
                  <div className="text-sm font-semibold text-gray-900 group-hover:text-white" >Business compliance</div>
                  <div className="text-xs text-gray-500 group-hover:text-white/90 mt-1" >Check requirements</div>
                </button>
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask anything..."
                  className="w-full px-14 py-4 bg-gray-50 border border-gray-300 rounded-xl outline-none text-gray-900 placeholder-gray-400 focus:border-[#EDB003] focus:bg-white transition-all"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <button className="absolute left-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-200 rounded-lg transition-colors">
                  <Plus className="w-5 h-5 text-gray-500" />
                </button>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                    <Mic className="w-5 h-5 text-gray-500" />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    className="p-2.5 bg-[#EDB003] hover:bg-[#d99f03] rounded-lg transition-all"
                  >
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-400 text-center mt-3">
                FlashSpace can make mistakes. Check important info.
              </p>
            </div>
          </div>

          {/* Right Panel - Sidebar - 35-40% - Scrollable Vertically */}
          <div
            className="w-full lg:w-[40%] xl:w-[35%] h-full bg-gray-50 overflow-y-auto overflow-x-hidden p-6 scroll-smooth scrollbar-yellow"
            style={{
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
              touchAction: 'pan-y'
            }}
          >
            <div className="space-y-6 max-w-xl mx-auto min-h-full">

              {/* Popular Spaces Section */}
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#EDB003]" />
                    <h3 className="text-base font-bold text-gray-900" >Popular Spaces in {selectedCity}</h3>
                  </div>
                  <button className="text-xs font-medium text-[#EDB003] hover:text-[#d69f03] flex items-center gap-1 transition-colors">
                    View Map
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {popularSpaces.map((space, index) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 hover:border-[#EDB003] rounded-xl overflow-hidden cursor-pointer transition-all group hover:shadow-md hover:scale-[1.02] duration-200"
                    >
                      <div className="h-32 relative overflow-hidden bg-gray-100">
                        {space.image && (
                          <img
                            src={space.image}
                            alt={space.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                        <div className="absolute top-2 right-2">
                          <span className="inline-block text-[10px] px-2 py-1 bg-white/90 backdrop-blur-sm text-gray-900 rounded-md font-semibold">
                            {space.type}
                          </span>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="text-sm font-bold text-gray-900 mb-1 line-clamp-1" >{space.name}</div>
                        <div className="text-xs text-gray-600 line-clamp-1 flex items-center gap-1" >
                          <MapPin className="w-3 h-3 text-gray-400" />
                          {space.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Get Started Section */}
              <div className="bg-gradient-to-br from-[#FFF9E6] to-[#FFFAED] rounded-2xl p-5 shadow-sm border border-[#FFD43B]/20">
                <h3 className="text-base font-bold text-gray-900 mb-4" >Get Started</h3>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#EDB003]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-[#EDB003]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-1" >Find Your Perfect Workspace</h4>
                      <p className="text-xs text-gray-600 leading-relaxed" >
                        Take our quick quiz to discover workspaces tailored to your needs.
                      </p>
                    </div>
                  </div>
                  <button className="w-full bg-[#EDB003] hover:bg-[#d69f03] text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 group">
                    Take Workspace Quiz
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Get Inspired Section */}
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-gray-900" >Get Inspired</h3>
                  <button className="text-xs font-medium text-[#EDB003] hover:text-[#d69f03] transition-colors">
                    See all
                  </button>
                </div>
                <div className="space-y-3">
                  {inspirationCards.map((card, index) => (
                    <div
                      key={index}
                      className="flex gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl cursor-pointer transition-all group border border-transparent hover:border-gray-200"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                        <img
                          src={card.image}
                          alt={card.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-[#EDB003] transition-colors" >
                          {card.title}
                        </h4>
                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed" >
                          {card.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartChatting;