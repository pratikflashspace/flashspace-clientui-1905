import { useState, useEffect, useRef } from 'react';
import chatService from '@/services/chat.service';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from "@/lib/utils";
import {
  Send, Speech, Volume2, Mic, Plus, MapPin, Building2, FileText, Briefcase, Users, Menu as MenuIcon,
  Phone, Mail, User, Sparkles, MoreVertical, MessageSquare, MessageCircle, Search, Heart, FolderKanban,
  Bell, Compass, PlusCircle, ArrowRight, ExternalLink, Home, Calendar, Megaphone,
  Settings, MoreHorizontal, X, ArrowLeft, Sun, Moon, History, ChevronDown, LayoutDashboard,
  LogOut, Lock, Check, Tag, Zap, // [UPDATED] added notification icons
  UserIcon, Trash2
} from 'lucide-react';
import { createPortal } from "react-dom"; // [NEW] Added createPortal
import { useNotifications, NotificationType } from "@/contexts/NotificationContext";
import { formatDistanceToNow } from 'date-fns';
import Splash3dButton from '@/components/ui/3d-splash-button';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import MapSection, { MapMarker } from '@/components/services/MapSection';
import ResizableMapLayout from '@/components/services/ResizableMapLayout';
import { getVirtualOfficesByCity } from '@/services/virtualOffice.service';
import { getCoworkingSpacesByCity } from '@/services/coworkingSpace.service';
import { cityCenters } from '@/components/Map/locationData.example';
import { LoginModal } from '@/components/auth/LoginModal'; // [NEW]
import { SignupModal } from '@/components/auth/SignupModal'; // [NEW]
import ContactModal from '@/components/ui/ContactModal'; // [NEW]
import { API_CONFIG } from '@/config/api.config'; // [NEW] Import API Config
import Header from "@/components/Header";

// [NEW] Custom Text Formatter to handle bold text, URLs, Images, and PDFs
const formatMessage = (text: string) => {
  if (!text) return null;

  // Normalize common HTML-like tags returned by AI backend into plain readable text.
  const normalizedText = text
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<details>\s*<summary>([\s\S]*?)<\/summary>\s*([\s\S]*?)<\/details>/gi, '\n$1\n$2\n')
    .replace(/<\/?summary>/gi, '')
    .replace(/<\/?details>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // URL regex pattern
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // Split by bold markers first
  const parts = normalizedText.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, index) => {
    // Handle Bold
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    // Handle URLs within text parts
    if (urlRegex.test(part)) {
      const subParts = part.split(urlRegex);
      return (
        <span key={index}>
          {subParts.map((subPart, subIndex) => {
            if (urlRegex.test(subPart)) {
              // Check if URL is an image
              const isImage = /\.(jpeg|jpg|gif|png|webp|bmp|svg)($|\?)/i.test(subPart) || subPart.includes('images.unsplash.com');

              // Check if URL is a PDF
              const isPdf = /\.pdf($|\?)/i.test(subPart);

              if (isImage) {
                return (
                  <div key={subIndex} className="block mt-3 mb-2">
                    <img
                      src={subPart}
                      alt="Attached content"
                      className="rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 max-w-full sm:max-w-[280px] hover:scale-[1.02] transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                );
              }

              if (isPdf) {
                return (
                  <a
                    key={subIndex}
                    href={subPart}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 my-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-md transition-all group no-underline max-w-sm"
                  >
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-red-500 dark:text-red-400" />
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <div className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate pr-2">Document.pdf</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Click to preview</div>
                    </div>
                  </a>
                );
              }

              // Default Link styling
              return (
                <a
                  key={subIndex}
                  href={subPart}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-500 break-all"
                >
                  {subPart}
                  <ExternalLink className="w-3 h-3" />
                </a>
              );
            }
            return subPart;
          })}
        </span>
      );
    }

    return <span key={index}>{part}</span>;
  });
};

// [NEW] Typewriter Effect Component
const TypewriterEffect = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  const speed = 5; // ms per char

  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const timer = setInterval(() => {
      // Handle the case where text might be empty or undefined gracefully
      if (!text) {
        clearInterval(timer);
        if (onComplete) onComplete();
        return;
      }

      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text]);

  return (
    <div className="text-[16px] leading-[1.8] tracking-[-0.01em] whitespace-pre-wrap break-words font-medium text-gray-800 font-sans">
      {formatMessage(displayedText)}
    </div>
  );
};

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

// ChatMessage now comes from ChatContext
import { useChat, ChatMessage } from "@/contexts/ChatContext";

// Backend chat endpoint (backend calls AI backend internally)
const BACKEND_CHAT_URL = "/api/chat/send";

interface SidebarMenuItem {
  label: string;
  icon: React.ElementType;
  onClick?: () => void;
}


// [NEW] Constants for the popup
const SIDEBAR_WIDTH_ICON = 80; // Your sidebar is 80px (w-20)
const UPDATES_WIDTH = 420;

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
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [activeFilter, setActiveFilter] = useState("All");

  if (!open) return null;

  const filters = ["All", "Unread", "Read", "Bookings", "Invoice", "KYC"];

  const getNotificationIcon = (type: string, metadata?: any) => {
    const metaType = metadata?.type;
    if (metaType === 'booking_confirmation') return Building2;
    if (metaType === 'invoice_generated') return FileText;
    if (metaType === 'partner' || metaType === 'business') return Users;
    switch (type) {
      case NotificationType.SUCCESS:
        return Building2;
      case NotificationType.MEETING_BOOKED:
        return Building2;
      case NotificationType.TICKET_UPDATE:
        return MessageCircle;
      case NotificationType.INFO:
        return Tag;
      case NotificationType.WARNING:
        return Zap;
      case NotificationType.ERROR:
        return X;
      default:
        return Bell;
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Unread") return !n.read;
    if (activeFilter === "Read") return n.read;
    if (activeFilter === "Bookings") return n.metadata?.type === 'booking_confirmation' || n.type === NotificationType.MEETING_BOOKED;
    if (activeFilter === "Invoice") return n.metadata?.type === 'invoice_generated';
    if (activeFilter === "KYC") return n.metadata?.type === 'partner' || n.metadata?.type === 'business';
    return true;
  });

  return createPortal(
    <div
      onClick={(e) => e.stopPropagation()}
      className={`fixed top-0 left-0 z-[13000] h-screen transition-transform ${open ? "translate-x-0" : "translate-x-[120%]"
        }`}
      style={{
        width: UPDATES_WIDTH,
        left: menuWidth,
        transitionDuration: '400ms',
        transitionTimingFunction: 'cubic-bezier(.7,.22,.26,.98)',
      }}
    >
      <div
        className="w-full h-full overflow-y-auto flex flex-col relative bg-[#F8F9FA] dark:bg-[#0a0a0a] border-l border-neutral-200 dark:border-white/10 shadow-2xl rounded-r-[22px] rounded-l-none text-black dark:text-white p-6 md:p-8"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#1F2E26] dark:text-white">Updates</h2>
            <p className="text-xs text-[#677E73] mt-0.5">{unreadCount} unread</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => markAllAsRead()}
              className="flex items-center gap-1.5 text-xs font-medium text-[#1F2E26] hover:text-[#35503F] transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              Read all
            </button>
            <button
              onClick={onCloseBoth}
              className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-[#1F2E26] dark:text-white" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${activeFilter === filter
                ? "bg-[#35503F] text-white shadow-sm"
                : "bg-white text-[#677E73] border border-slate-100 dark:border-white/10 dark:bg-transparent dark:hover:border-white/20 hover:border-slate-300"
                }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="flex-1 flex flex-col gap-3 min-h-0">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => {
              const Icon = getNotificationIcon(notif.type, notif.metadata);
              return (
                <div
                  key={notif._id}
                  onClick={() => !notif.read && markAsRead(notif._id)}
                  className={`group flex gap-4 p-4 rounded-2xl transition-all border border-transparent hover:border-slate-100 dark:hover:border-white/10 cursor-pointer ${!notif.read ? "bg-[#F1F3F5] dark:bg-white/5" : "bg-white dark:bg-transparent"
                    }`}
                >
                  {/* Icon Container */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center shadow-sm border border-slate-50 dark:border-white/5">
                    <Icon className="w-4 h-4 text-[#677E73]" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-sm font-bold text-[#1F2E26] dark:text-white leading-tight mb-1">
                        {notif.title}
                      </h3>
                      {!notif.read && (
                        <div className="w-2 h-2 rounded-full bg-[#35503F] mt-1.5 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[13px] text-[#677E73] dark:text-gray-400 leading-relaxed mb-2 line-clamp-2">
                      {notif.message}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-[11px] text-slate-400 dark:text-gray-500">
                        {notif.createdAt ? formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true }) : ''}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-4">
              <div className="w-16 h-16 bg-white dark:bg-white/5 rounded-full flex items-center justify-center mb-4 shadow-sm">
                <Bell className="w-8 h-8 text-slate-300 dark:text-gray-500" />
              </div>
              <h3 className="text-sm font-bold text-[#1F2E26] dark:text-white mb-1">No updates found</h3>
              <p className="text-xs text-[#677E73] dark:text-gray-400">
                {activeFilter === "All"
                  ? "You're all caught up! Check back later for new notifications."
                  : `No ${activeFilter.toLowerCase()} updates at the moment.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
// ------------------------------------------------


const StartChatting = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [message, setMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeChatId, setActiveChatId] = useState<string | null>(() => sessionStorage.getItem('flashspace_activeChatId'));
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // [NEW] User menu state
  const [showUpdates, setShowUpdates] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false); // [NEW] Contact form state
  const sidebarRef = useRef<HTMLDivElement>(null);


  const [contactForm, setContactForm] = useState<ContactForm>({
    name: '',
    phone: '',
    email: ''
  });

  // [NEW] Use Global Chat State
  const {
    chatMessages,
    setChatMessages,
    chatSessions,
    setChatSessions,
    startNewChat,
    deleteChatSession,
    isLoading,
    setIsLoading
  } = useChat();
  // Persist activeChatId to sessionStorage
  useEffect(() => {
    if (activeChatId) {
      sessionStorage.setItem('flashspace_activeChatId', activeChatId);
    } else {
      sessionStorage.removeItem('flashspace_activeChatId');
    }
  }, [activeChatId]);

  // Clear activeChatId on logout
  useEffect(() => {
    if (!isAuthenticated) {
      setActiveChatId(null);
    }
  }, [isAuthenticated]);

  // [NEW] Auto-save chat on unmount
  const chatMessagesRef = useRef(chatMessages);
  useEffect(() => {
    chatMessagesRef.current = chatMessages;
  }, [chatMessages]);

  const startNewChatRef = useRef(startNewChat);
  useEffect(() => {
    startNewChatRef.current = startNewChat;
  }, [startNewChat]);

  const activeChatIdRef = useRef(activeChatId);
  useEffect(() => {
    activeChatIdRef.current = activeChatId;
  }, [activeChatId]);

  useEffect(() => {
    // Handle SPA navigation (React unmount)
    return () => {
      if (chatMessagesRef.current.length > 0) {
        if (activeChatIdRef.current) {
          setChatSessions(prev => prev.map(s => {
            const sKey = s._id || s.id;
            if (sKey === activeChatIdRef.current) {
              const updated = { ...s, messages: chatMessagesRef.current };
              chatService.saveSession(updated).catch(err => console.error('[Chat] Failed to persist updated session', err));
              return updated;
            }
            return s;
          }));
        } else {
          // Unsaved new chat - fire and forget save on unmount
          const firstUserMsg = chatMessagesRef.current.find(m => m.role === 'user');
          const title = firstUserMsg
            ? firstUserMsg.content.slice(0, 50) + (firstUserMsg.content.length > 50 ? '…' : '')
            : 'Chat session';

          const sessionData = {
            id: Date.now().toString(),
            title,
            messages: chatMessagesRef.current,
            date: 'Today',
          };

          setChatSessions(prev => [sessionData, ...prev]);
          if (isAuthenticated) {
            chatService.saveSession(sessionData).catch(err => console.error('[Chat] Failed to persist new session on unmount', err));
          }
        }
      }
    };
  }, [isAuthenticated, setChatSessions]);

  // Auto-save to MongoDB whenever chatMessages change (debounced)
  useEffect(() => {
    // Only auto-save when there are at least 2 messages (user + assistant response)
    if (chatMessages.length < 2 || !isAuthenticated) return;

    const timer = setTimeout(() => {
      const firstUserMsg = chatMessages.find(m => m.role === 'user');
      const title = firstUserMsg
        ? firstUserMsg.content.slice(0, 50) + (firstUserMsg.content.length > 50 ? '…' : '')
        : 'Chat session';

      const sessionData = {
        id: activeChatId || Date.now().toString(),
        title,
        messages: chatMessages,
        date: 'Today',
      };

      chatService.saveSession(sessionData).then(res => {
        if (res.success && res.data && !activeChatId) {
          // New chat — set activeChatId to the MongoDB _id so future saves update instead of duplicate
          const newId = res.data._id || res.data.id;
          setActiveChatId(newId);
          // Also add to sidebar sessions
          setChatSessions(prev => {
            // Avoid duplicates
            if (prev.some(s => (s._id || s.id) === newId)) return prev;
            return [{ ...sessionData, _id: newId }, ...prev];
          });
        }
        console.log('[Chat] Auto-saved to MongoDB');
      }).catch(err => {
        console.error('[Chat] Auto-save failed', err);
      });
    }, 2000); // 2s debounce

    return () => clearTimeout(timer);
  }, [chatMessages, activeChatId, isAuthenticated]);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Unified New Chat Handler
  const handleNewChat = () => {
    if (chatMessages.length > 0) {
      if (!activeChatId) {
        // Unsaved chat - manually save it before clearing
        const firstUserMsg = chatMessages.find(m => m.role === 'user');
        const title = firstUserMsg
          ? firstUserMsg.content.slice(0, 50) + (firstUserMsg.content.length > 50 ? '…' : '')
          : 'Chat session';

        const tempId = Date.now().toString();
        const sessionData = {
          id: tempId,
          title,
          messages: chatMessages,
          date: 'Today',
        };

        // Optimistically add to sidebar
        setChatSessions(prev => [sessionData, ...prev]);

        if (isAuthenticated) {
          chatService.saveSession(sessionData).then(res => {
            if (res.success && res.data) {
              const newId = res.data._id || res.data.id;
              setChatSessions(prev => prev.map(s => s.id === tempId ? { ...sessionData, _id: newId } : s));
            }
          });
        }
      } else {
        // Existing chat - ensure latest messages are saved
        setChatSessions(prev => prev.map(s => {
          const sKey = s._id || s.id;
          if (sKey === activeChatId) {
            const updated = { ...s, messages: chatMessages };
            if (isAuthenticated) {
              chatService.saveSession(updated).catch(e => console.error(e));
            }
            return updated;
          }
          return s;
        }));
      }
    }

    startNewChat();
    setActiveChatId(null);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  // [NEW] Map Integration State
  const [showMap, setShowMap] = useState(false);
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([]);
  const [selectedCity, setSelectedCity] = useState("Bangalore");

  // Initialize mapCenter as object { lat, lng }
  const defaultCenter = cityCenters["Bangalore"] || [12.9716, 77.5946];
  const [mapCenter, setMapCenter] = useState({ lat: defaultCenter[0], lng: defaultCenter[1] });

  const [mapZoom, setMapZoom] = useState(11);
  const [isLoginOpen, setIsLoginOpen] = useState(false); // [NEW]
  const [isLimitPopupOpen, setIsLimitPopupOpen] = useState(false); // [NEW] Limit Reached Popup
  const [isSignupOpen, setIsSignupOpen] = useState(false); // [NEW]
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [mapTitle, setMapTitle] = useState('Popular Spaces');

  // Helper: Generate random coordinates if missing (reuse from services pages)
  const generateRandomCoordinates = (center: { lat: number; lng: number }, index: number) => {
    const seed = index + 1;
    const latOffset = ((seed * 17) % 50) / 1000 - 0.025;
    const lngOffset = ((seed * 23) % 50) / 1000 - 0.025;
    return {
      lat: center.lat + latOffset,
      lng: center.lng + lngOffset
    };
  };

  // Helper: Detect City and Service from text
  const detectIntents = (text: string) => {
    const textLower = text.toLowerCase();

    // Extended City Parsing with Aliases
    const cityMap: Record<string, { key: string; name: string; aliases: string[] }> = {
      ahmedabad: { key: 'ahmedabad', name: 'Ahmedabad', aliases: ['ahmedabad', 'amdavad'] },
      bangalore: { key: 'bangalore', name: 'Bangalore', aliases: ['bangalore', 'bengaluru', 'banglore'] },
      chennai: { key: 'chennai', name: 'Chennai', aliases: ['chennai', 'madras'] },
      delhi: { key: 'delhi', name: 'Delhi', aliases: ['delhi', 'new delhi', 'dilli', 'ncr'] },
      dharamshala: { key: 'dharamshala', name: 'Dharamshala', aliases: ['dharamshala', 'dharamsala'] },
      gurgaon: { key: 'gurgaon', name: 'Gurgaon', aliases: ['gurgaon', 'gurugram'] },
      hyderabad: { key: 'hyderabad', name: 'Hyderabad', aliases: ['hyderabad', 'hyd'] },
      jaipur: { key: 'jaipur', name: 'Jaipur', aliases: ['jaipur'] },
      jammu: { key: 'jammu', name: 'Jammu', aliases: ['jammu'] },
      noida: { key: 'delhi', name: 'Noida', aliases: ['noida'] }, // Fallback to Delhi for map center if needed
    };

    let foundCityKey: string | undefined;
    let foundCityName: string | undefined;

    // Search for city aliases in text
    for (const [_, data] of Object.entries(cityMap)) {
      if (data.aliases.some(alias => textLower.includes(alias))) {
        foundCityKey = data.key;
        foundCityName = data.name;
        break;
      }
    }

    // Check for service type
    const services = [
      { type: 'virtual', keys: ['virtual', 'address', 'mail', 'gst', 'registration'] },
      { type: 'coworking', keys: ['coworking', 'desk', 'office', 'space', 'workspace', 'seat', 'cabin'] },
    ];

    const foundService = services.find(s => s.keys.some(k => textLower.includes(k)));

    return {
      cityKey: foundCityKey, // e.g., 'delhi'
      cityName: foundCityName, // e.g., 'Delhi'
      serviceType: foundService?.type // 'virtual' | 'coworking'
    };
  };

  // Helper: Fetch and Update Map
  const updateMapForQuery = async (text: string) => {
    const { cityKey, cityName, serviceType } = detectIntents(text);

    if (cityKey && cityName && (serviceType || text.toLowerCase().includes('space'))) {
      const type = serviceType || 'coworking'; // Default to coworking if ambiguous but city present
      setIsMapLoading(true);
      setMapTitle(`${type === 'virtual' ? 'Virtual Offices' : 'Coworking Spaces'} in ${cityName}`);

      try {
        let markers: MapMarker[] = [];
        const center = (cityCenters as any)[cityKey] || cityCenters.delhi;
        setMapCenter(center);

        if (type === 'virtual') {
          const items = await getVirtualOfficesByCity(cityName); // Service expects capitalized name typically or handles it
          markers = items.map((item, index) => ({
            position: item.coordinates || generateRandomCoordinates(center, index),
            title: item.name,
            address: item.address,
            price: item.price,
            rating: item.rating,
            reviews: item.reviews,
            image: item.image,
            features: item.features,
          }));
        } else {
          const items = await getCoworkingSpacesByCity(cityName);
          markers = items.map((item, index) => ({
            position: item.coordinates || generateRandomCoordinates(center, index),
            title: item.name,
            address: item.address,
            price: item.price,
            rating: item.rating,
            reviews: item.reviews,
            image: item.image,
            features: item.features,
          }));
        }

        if (markers.length > 0) {
          setMapMarkers(markers);
          setShowMap(true);
        }
      } catch (error) {
        console.error("Failed to update map for query:", error);
      } finally {
        setIsMapLoading(false);
      }
    }
  };



  const sidebarMenuItems: SidebarMenuItem[] = [
    { label: 'Start Chatting', icon: MessageSquare, onClick: () => handleNavigation('/start-chatting') },
    { label: 'History', icon: History, onClick: () => setShowHistory(prev => !prev) }, // [NEW] History toggle
    { label: 'Get Workspace', icon: Building2, onClick: () => handleNavigation('/solutions/virtual-office') },
    { label: 'Business Setup', icon: Briefcase, onClick: () => handleNavigation('/solutions/business-setup') },
    { label: 'Your Bookings', icon: Calendar, onClick: () => handleNavigation('/bookings') },
    { label: 'Flash Tribe', icon: Users, onClick: () => handleNavigation('/community') },
    { label: 'Updates', icon: Bell, onClick: () => setShowUpdates(prev => !prev) }, // [NEW] Wire up the button
    { label: 'Settings', icon: Settings, onClick: () => handleNavigation('/settings') },
  ];

  // [NEW] Close popup function
  const closeBoth = () => {
    setShowUpdates(false);
    setShowHistory(false); // Close history as well
    setIsSidebarOpen(false); // Also close mobile sidebar if open
  };

  // [NEW] Handle history selection
  const handleHistorySelect = (chatId: string) => {
    // console.log("Selected chat:", chatId);
    setShowHistory(false); // Slide back inside instantly
    // Logic to load chat would go here
    if (chatId === 'new') {
      setChatMessages([]);
      // reset other state if needed
    }
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
  }, [showUpdates, isSidebarOpen]);




  // [NEW] Function to handle typing completion
  const handleTypingComplete = (id: string) => {
    setChatMessages(prev => prev.map(msg =>
      msg.id === id ? { ...msg, isTyping: false } : msg
    ));
  };

  // [NEW] Voice to Text State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // [NEW] Handle Voice Input
  const toggleVoiceInput = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support voice input. Please try Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setMessage((prev) => (prev ? prev + ' ' + transcript : transcript));
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  // [NEW] Speak Function
  const handleSpeak = (text: string) => {
    window.speechSynthesis.cancel();

    // Simple clean up of markdown for better speech
    const cleanText = text.replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // [UPDATED] Voice Selection for softer, more natural female voice
    const voices = window.speechSynthesis.getVoices();

    // Try to find a high-quality female voice
    const preferredVoice = voices.find(voice =>
      (voice.name.includes("Google") && voice.name.includes("US English")) || // Chrome specific
      (voice.name.includes("Microsoft Zira")) || // Windows specific
      (voice.name.includes("Neural") && voice.name.includes("Female")) || // Smart filters
      (voice.name.includes("Natural") && voice.name.includes("Female"))
    ) || voices.find(voice => voice.name.includes("Female")) || voices.find(v => v.lang.startsWith("en-"));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Tuning for softness
    utterance.pitch = 1.1; // Slightly higher for lighter tone
    utterance.rate = 0.95; // Slightly slower for composure

    window.speechSynthesis.speak(utterance);
  };

  // [NEW] Cleanup speech on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    // [NEW] Guest Chat Limit Check
    if (!isAuthenticated) {
      const currentCount = parseInt(localStorage.getItem('guest_chat_count') || '0');
      if (currentCount >= 3) {
        setIsLimitPopupOpen(true);
        // Optional: clear message to avoid confusion or keep it? Keeping it allows them to send after login
        return;
      }
      localStorage.setItem('guest_chat_count', (currentCount + 1).toString());
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date()
    };

    // Add user message to chat
    setChatMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const accessToken = localStorage.getItem('accessToken') || localStorage.getItem('token');
      const sessionId = getSessionId();

      // Call backend chat endpoint (backend calls AI backend internally)
      const response = await fetch(BACKEND_CHAT_URL, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          message: userMessage.content,
          query: userMessage.content,
          conversation_id: 'default',
          session_id: sessionId
        })
      });

      // [NEW] Trigger map update based on user message (optimistic update)
      updateMapForQuery(userMessage.content);

      if (!response.ok) {
        throw new Error('Failed to get response from chatbot');
      }

      const data = await response.json();

      // Backend returns reply directly from AI backend
      let aiResponseText = data.reply || data.message || 'I apologize, but I encountered an error. Please try again.';

      // Add AI response to chat
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponseText || 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
        isTyping: true // [NEW] Start typing effect
      };

      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message to backend:', error);

      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.',
        timestamp: new Date(),
        isTyping: true
      };

      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate or retrieve session ID for conversation tracking
  const getSessionId = () => {
    let sessionId = sessionStorage.getItem('chat_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('chat_session_id', sessionId);
    }
    return sessionId;
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Keep native wheel scrolling reliable inside chat panel when Lenis is enabled globally.
  useEffect(() => {
    const scrollContainer = chatContainerRef.current;
    if (!scrollContainer) return;

    scrollContainer.setAttribute('data-lenis-prevent', 'true');

    const preventLenisWheel = (event: WheelEvent) => {
      event.stopPropagation();
    };

    scrollContainer.addEventListener('wheel', preventLenisWheel, { passive: true });

    return () => {
      scrollContainer.removeEventListener('wheel', preventLenisWheel);
    };
  }, []);

  const handleContactSubmit = () => {
    // console.log('Contact form submitted:', contactForm);
    setContactForm({ name: '', phone: '', email: '' });
  };

  const handleQuickAction = (actionMessage: string) => {
    setMessage(actionMessage);
    // Auto-send the message
    setTimeout(() => {
      const event = new KeyboardEvent('keypress', { key: 'Enter' });
      handleSendMessage();
    }, 100);
  };

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] dark:text-gray-100 flex flex-col overflow-x-hidden font-grotesk">
      <Header openLogin={isLoginOpen} openSignup={isSignupOpen} />

      {showUpdates && (
        <div
          onClick={() => setShowUpdates(false)}
          className="fixed inset-0 z-[12000]"
          style={{ background: "transparent" }}
        />
      )}

      {/* [NEW] Render the Updates Popup */}
      <UpdatesPopup
        open={showUpdates}
        menuWidth={0}
        onCloseBoth={closeBoth}
      />


      {/* Backdrop Overlay (for mobile sidebar) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      {/* Mini Sidebar — visible when full sidebar is collapsed */}
      {!isSidebarOpen && (
        <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-[60px] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-[60] flex flex-col items-center pt-4 gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Open sidebar"
            style={{ color: '#677e73' }}
          >
            <MenuIcon className="w-5 h-5" />
          </button>
          <button
            onClick={handleNewChat}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="New chat"
            style={{ color: '#677e73' }}
          >
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Fixed Left Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-sm z-[60] flex flex-col overflow-hidden transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: '260px' }}
      >
        {/* New Chat + Collapse button row */}
        <div className="h-16 flex items-center justify-between px-4 flex-shrink-0">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            title="Collapse sidebar"
            style={{ color: '#677e73' }}
          >
            ☰
          </button>
        </div>

        {/* Main Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2 space-y-0.5">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
            style={{ color: '#677e73' }}
          >
            <MessageSquare className="w-4 h-4 flex-shrink-0" />
            New Chat
          </button>
          <button
            onClick={() => handleNavigation('/solutions/virtual-office')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
            style={{ color: '#677e73' }}
          >
            <Briefcase className="w-4 h-4 flex-shrink-0" />
            Workspaces
          </button>
          <button
            onClick={() => setShowUpdates(prev => !prev)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
            style={{ color: '#677e73' }}
          >
            <Bell className="w-4 h-4 flex-shrink-0" />
            Notifications
          </button>
          <button
            onClick={() => handleNavigation('/settings')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
            style={{ color: '#677e73' }}
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            Settings
          </button>

          {/* Recent Section */}
          <div className="pt-4 pb-1">
            <p className="text-[10px] font-semibold tracking-widest uppercase px-3 mb-1" style={{ color: '#677e73', opacity: 0.6 }}>RECENT</p>
            {chatSessions.length === 0 ? (
              <p className="px-3 py-2 text-xs italic" style={{ color: '#677e73', opacity: 0.5 }}>No past chats yet</p>
            ) : (
              chatSessions.map((session) => {
                const sessionKey = session._id || session.id;
                const isActive = activeChatId === sessionKey;
                return (
                  <div key={sessionKey} className={`relative group w-full flex items-center pr-1 rounded-lg transition-colors ${isActive ? 'bg-[#35503F]' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                    <button
                      onClick={() => {
                        // Before switching, save the current chat
                        if (chatMessages.length > 0) {
                          if (activeChatId) {
                            // Update existing session's messages locally AND in MongoDB
                            const updatedSession = chatSessions.find(s => (s._id || s.id) === activeChatId);
                            if (updatedSession) {
                              const updated = { ...updatedSession, messages: chatMessages };
                              chatService.saveSession(updated).catch(err => console.error('[Chat] Failed to persist', err));
                            }
                            setChatSessions(prev => prev.map(s => {
                              const sKey = s._id || s.id;
                              return sKey === activeChatId ? { ...s, messages: chatMessages } : s;
                            }));
                          } else {
                            // New unsaved chat — save as a new session
                            startNewChat(chatMessages);
                          }
                        }
                        setChatMessages(session.messages);
                        setActiveChatId(sessionKey);
                      }}
                      className={`flex-1 text-left px-3 py-2 text-sm min-w-0 font-${isActive ? 'semibold' : 'normal'}`}
                      style={{ color: isActive ? 'white' : '#677e73' }}
                      title={session.title}
                    >
                      <div className="truncate w-full">{session.title}</div>
                      <div className="text-[10px] mt-0.5 truncate" style={{ opacity: isActive ? 0.7 : 0.55 }}>{session.date}</div>
                    </button>

                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        const success = await deleteChatSession(sessionKey);
                        if (success && isActive) {
                          setChatMessages([]);
                          setActiveChatId(null);
                        }
                      }}
                      className={`p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ${isActive ? 'text-white hover:bg-white/20' : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-gray-600'
                        }`}
                      title="Delete chat"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </nav>

        {/* Bottom — Home */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-3">
          <button
            onClick={() => handleNavigation('/')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
            style={{ color: '#677e73' }}
          >
            <Home className="w-4 h-4 flex-shrink-0" />
            Home
          </button>
        </div>
      </div>

      {/* Main Content - Adjusted for wider sidebar */}
      <div className={`flex-1 pt-16 flex flex-col lg:flex-row shadow-2xl z-40 relative transition-all duration-300 ${isSidebarOpen ? 'ml-[260px]' : 'ml-[60px]'}`}>
        <div className="w-full h-[calc(100dvh-4rem)] bg-slate-50 dark:bg-[#0B1120] overflow-hidden flex flex-col">
          {/* Chat Interface - Full Width */}
          <div className="w-full h-full flex flex-col bg-white dark:bg-[#0B1120] relative">

            {/* Chat Content */}
            <div
              ref={chatContainerRef}
              className="chat-container custom-scrollbar flex-1 p-4 sm:p-6 overflow-y-auto relative z-10 scroll-smooth"
              style={{ height: '100%' }}
              data-lenis-prevent
              tabIndex={0}
              role="region"
              aria-label="Chat messages"
            >
              {chatMessages.length === 0 ? (
                // Clean Welcome State (matching screenshot)
                <div className="flex flex-col items-center justify-center h-full text-center max-w-3xl mx-auto px-6">
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                    How can we help your business?
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-12 max-w-md text-base leading-relaxed">
                    Ask about coworking spaces, virtual offices, compliance, or compare plans instantly.
                  </p>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full">
                    <button
                      onClick={() => handleQuickAction('Find coworking spaces in Delhi NCR region')}
                      className="text-left p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <div className="text-sm font-semibold text-gray-800 dark:text-white mb-1">Find coworking spaces</div>
                      <div className="text-xs text-gray-400">in Delhi NCR region</div>
                    </button>
                    <button
                      onClick={() => handleQuickAction('Help me with GST Registration complete registration process')}
                      className="text-left p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <div className="text-sm font-semibold text-gray-800 dark:text-white mb-1">GST Registration</div>
                      <div className="text-xs text-gray-400">Complete registration</div>
                    </button>
                    <button
                      onClick={() => handleQuickAction('Compare workspace plans and find the best deal')}
                      className="text-left p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <div className="text-sm font-semibold text-gray-800 dark:text-white mb-1">Compare plans</div>
                      <div className="text-xs text-gray-400">Find the best deal</div>
                    </button>
                    <button
                      onClick={() => handleQuickAction('Check business compliance requirements')}
                      className="text-left p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <div className="text-sm font-semibold text-gray-800 dark:text-white mb-1">Business compliance</div>
                      <div className="text-xs text-gray-400">Check requirements</div>
                    </button>
                  </div>
                </div>

              ) : (
                // Chat Messages
                <div className="space-y-6 max-w-5xl mx-auto pb-4 w-full">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-4 group ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {/* Avatar */}
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border ${msg.role === 'user'
                        ? 'bg-gradient-to-br from-[#35503F] to-[#3d6b4f] border-[#35503F] text-white'
                        : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-[#35503F]'
                        }`}>
                        {msg.role === 'user' ? <User className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                      </div>

                      {/* Message Bubble */}
                      <div
                        className={`max-w-[85%] sm:max-w-[85%] px-6 py-4 shadow-sm ${msg.role === 'user'
                          ? 'bg-gradient-to-br from-[#35503F] to-[#3d6b4f] text-white rounded-2xl rounded-tr-sm'
                          : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-2xl rounded-tl-sm'
                          }`}
                      >
                        {msg.role === 'assistant' && msg.isTyping ? (
                          <TypewriterEffect
                            text={msg.content}
                            onComplete={() => handleTypingComplete(msg.id)}
                          />
                        ) : (
                          <div className={`text-[16px] leading-[1.8] tracking-[-0.01em] whitespace-pre-wrap break-words font-medium font-sans ${msg.role === 'user' ? 'text-white' : 'text-gray-800 dark:text-gray-100'
                            }`}>
                            {formatMessage(msg.content)}
                          </div>
                        )}
                        <p className={`text-[10px] mt-2 font-medium tracking-wide opacity-80 ${msg.role === 'user' ? 'text-white' : 'text-gray-400'
                          }`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      {msg.role === 'assistant' && !msg.isTyping && (
                        <button
                          onClick={() => handleSpeak(msg.content)}
                          className="opacity-60 hover:opacity-100 transition-opacity duration-200 p-2 h-fit self-start mt-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-[#35503F]"
                          title="Read Aloud"
                          aria-label="Read message aloud"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Loading Indicator */}
                  {isLoading && (
                    <div className="flex gap-4">
                      <div className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[#35503F] shadow-sm flex-shrink-0">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-6 py-4 shadow-sm flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#35503F] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-2 h-2 bg-[#35503F] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-2 h-2 bg-[#35503F] rounded-full animate-bounce"></span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 sm:p-6 bg-transparent relative z-20">
              <div className="max-w-4xl mx-auto relative group">
                <div className="relative bg-white dark:bg-[#1E293B] shadow-lg rounded-[1.25rem] border border-gray-200 dark:border-white/5 flex items-center p-2 pr-2 gap-2 transition-all focus-within:border-gray-300 dark:focus-within:border-white/10">
                  <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors">
                    <Plus className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent border-none outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400 text-[16px] font-medium h-full py-2 min-w-0"
                  />
                  <button
                    onClick={toggleVoiceInput}
                    className={`p-3 rounded-xl transition-all ${isListening
                      ? 'text-red-500 bg-red-50 hover:bg-red-100 animate-pulse'
                      : 'text-gray-400 dark:text-gray-300 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    title={isListening ? "Stop listening" : "Start voice input"}
                  >
                    <Mic className={`w-5 h-5 ${isListening ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    className="p-3 bg-[#35503F] text-white rounded-xl shadow-sm hover:bg-[#2d4435] transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!message.trim() || isLoading}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-[10px] text-center text-gray-400 mt-3 font-medium">
                  Flashspace AI can make mistakes. Please verify important details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Limit Reached Popup */}
      {isLimitPopupOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setIsLimitPopupOpen(false)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800 text-center font-grotesk">
            <button
              onClick={() => setIsLimitPopupOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-[#35503F]">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Chat Limit Reached
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">
              You've reached the free chat limit. <br />
              Please login to continue chatting with our AI assistant.
            </p>
            <button
              onClick={() => {
                setIsLimitPopupOpen(false);
                setIsLoginOpen(true);
              }}
              className="w-full py-3 bg-black dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:opacity-90 transition-all transform active:scale-95 shadow-lg shadow-black/20 dark:shadow-white/10"
            >
              Log in to Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartChatting;
