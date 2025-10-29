import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { X, MessageCircle, Briefcase, FileText, Calendar, Users, Bell, Settings as SettingsIcon, MoreHorizontal } from "lucide-react";
import { smoothScrollTo } from "@/lib/lenis";

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SidebarMenu = ({ isOpen, onClose }: SidebarMenuProps) => {
  const navigate = useNavigate();
  const primaryTop = [
    { label: 'Start Chatting', href: '/start-chatting', icon: MessageCircle },
    { label: 'Get WorkSpace', href: '/services/coworking-space', icon: Briefcase },
    { label: 'Business Setup', href: '/Solutions/business-setup', icon: FileText },
  ];
  const middle = [
    { label: 'Your Bookings', href: '/bookings', icon: Calendar },
    { label: 'Flash Tribe', href: '/community', icon: Users },
  ];
  const footer = [
    { label: 'Updates', href: '/updates', icon: Bell },
    { label: 'Settings', href: '/settings', icon: SettingsIcon },
    { label: 'More', href: '#more', icon: MoreHorizontal },
  ];

  const handleNavigation = (href: string) => {
    if (href.startsWith('#')) {
      try {
        smoothScrollTo(href, { offset: -90 });
      } catch {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // Use React Router navigation for internal routes
      navigate(href);
    }
    onClose();
  };

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      document.addEventListener('keydown', esc);
      document.body.style.overflow = 'hidden';
      document.body.classList.add('fs-menu-open');
    } else {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('fs-menu-open');
    }
    return () => {
      document.removeEventListener('keydown', esc);
      document.body.style.overflow = 'unset';
      document.body.classList.remove('fs-menu-open');
    };
  }, [isOpen, onClose]);

  const content = (
    <div
      id="flashspace-fullmenu"
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-[9999] overflow-hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      />
  <div className={`relative z-10 w-72 h-full bg-white text-black border-r border-neutral-800 shadow-xl transform transition-transform duration-300 ease-out rounded-r-2xl overflow-hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ fontFamily: 'Geist' }}>
        <div className="flex items-center justify-between p-5 border-b border-neutral-800/70">
          <img
            src="/Logo/Flashspace Logo.png"
            alt="FlashSpace Logo"
            className="h-8 w-auto cursor-pointer select-none"
            onClick={() => handleNavigation('/')}
          />
          <button onClick={onClose} className="p-2 rounded-md hover:bg-black/10 active:scale-95 transition" aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto h-full pb-32 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
          <div className="p-5 space-y-8 text-sm tracking-wide">
            <nav className="space-y-2">
              {primaryTop.map(item => (
                <button key={item.label} onClick={() => handleNavigation(item.href)} className="group flex w-full items-center gap-3 text-left font-medium py-2 px-2 rounded hover:text-yellow-600 focus:outline-none hover:bg-black/5 transition-all duration-300" style={{ fontFamily: 'Geist' }}>
                  <item.icon className="w-5 h-5 text-gray-600 group-hover:text-yellow-600 transition-colors duration-300" />
                  <span className="transition-all duration-300 group-hover:scale-110 inline-block origin-left">{item.label}</span>
                </button>
              ))}
              <div className="h-px bg-neutral-700/70 my-3" />
              {middle.map(item => (
                <button key={item.label} onClick={() => handleNavigation(item.href)} className="group flex w-full items-center gap-3 text-left font-medium py-2 px-2 rounded hover:text-yellow-600 hover:bg-black/5 transition-all duration-300" style={{ fontFamily: 'Geist' }}>
                  <item.icon className="w-5 h-5 text-gray-600 group-hover:text-yellow-600 transition-colors duration-300" />
                  <span className="transition-all duration-300 group-hover:scale-110 inline-block origin-left">{item.label}</span>
                </button>
              ))}
              <div className="h-px bg-neutral-700/70 my-3" />
              {footer.map(item => (
                <button key={item.label} onClick={() => handleNavigation(item.href)} className="group flex w-full items-center gap-3 text-left py-2 px-2 text-[13px] font-medium text-black hover:text-yellow-600 rounded hover:bg-black/5 transition-all duration-300" style={{ fontFamily: 'Geist' }}>
                  <item.icon className="w-4 h-4 text-gray-600 group-hover:text-yellow-600 transition-colors duration-300" />
                  <span className="transition-all duration-300 group-hover:scale-110 inline-block origin-left">{item.label}</span>
                </button>
              ))}
            </nav>
            <div className="flex items-center justify-center py-4">
              <div className="w-20 h-20 rounded-full border-2 border-gray-300 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden bg-white flex items-center justify-center">
                <img
                  src="/Logo/FlashSpace Favicon.png"
                  alt="FlashSpace Favicon"
                  className="w-full h-full object-contain p-2"
                />
              </div>
            </div>
            <div className="space-y-3 pt-2">
              <button onClick={() => handleNavigation('#contact')} className="w-full rounded-md bg-yellow-400 text-black font-semibold py-2 text-sm hover:bg-yellow-300 active:scale-[0.98] transition" style={{ fontFamily: 'Poppins' }}>Get Consultation</button>
              <button onClick={() => handleNavigation('/login')} className="w-full rounded-md border border-neutral-600 text-black py-2 text-sm hover:bg-yellow-400 hover:text-white active:scale-[0.98] transition" style={{ fontFamily: 'Poppins' }}>Log in</button>
            </div>
          </div>
        </div>
      </div>
      <div className={`relative z-0 ml-72 h-full bg-[radial-gradient(circle_at_30%_20%,#1d1d1f,#0f0f10)] flex items-center justify-center transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-8'}`}>
        <div className="text-center text-neutral-400 px-8 max-w-md">
          <h3 className="text-3xl font-semibold mb-4 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">Everything in one place.</h3>
          <p className="text-sm leading-relaxed">Pick an action on the left. This panel can later host highlights, product updates, or a live preview. Totally swappable.</p>
        </div>
        <button onClick={onClose} className="absolute top-4 right-4 lg:hidden p-2 rounded-full bg-neutral-800 text-white shadow hover:shadow-lg border border-neutral-700 active:scale-95 transition" aria-label="Close menu">
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );

  if (typeof document !== 'undefined') return createPortal(content, document.body);
  return content;
};

export default SidebarMenu;