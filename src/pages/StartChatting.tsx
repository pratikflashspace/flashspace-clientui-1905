import { useState, useEffect, useRef } from 'react';
import chatService from '@/services/chat.service';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from "@/lib/utils";
import {
  Send, Speech, Volume2, Mic, Plus, MapPin, Building2, FileText, Briefcase, Users, Menu as MenuIcon,
  Phone, Mail, User, Sparkles, MoreVertical, MessageSquare, MessageCircle, Search, Heart, FolderKanban,
  Bell, Compass, PlusCircle, ArrowRight, ExternalLink, Home, Calendar, Megaphone,
  Settings, MoreHorizontal, X, ArrowLeft, Sun, Moon, History, ChevronDown, LayoutDashboard,
  LogOut, Lock, Check, Tag, Zap, Map, ChevronRight, ChevronLeft, PanelLeftClose, Shield, Key, // [UPDATED] added Map and ChevronRight
  UserIcon, Trash2
} from 'lucide-react';
import { createPortal } from "react-dom"; // [NEW] Added createPortal
import { useNotifications } from "@/contexts/NotificationProvider";
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
import { getVirtualOfficesByCity, getAvailableCities, getAllVirtualOffices } from '@/services/virtualOffice.service';
import { getCoworkingSpacesByCity, getAllCoworkingSpaces } from '@/services/coworkingSpace.service';
import { getSearchMetadata } from '@/services/property.service';
import { cityCenters } from '@/components/Map/locationData.example';
import { LoginModal } from '@/components/auth/LoginModal'; // [NEW]
import { SignupModal } from '@/components/auth/SignupModal'; // [NEW]
import ContactModal from '@/components/ui/ContactModal'; // [NEW]
import { API_CONFIG } from '@/config/api.config'; // [NEW] Import API Config
import Header from "@/components/Header";
import { useLocationMetadata } from '@/hooks/useLocationMetadata';
import SpacesInlineWidget from '@/components/chat/SpacesInlineWidget';
import businessSetupData from '@/data/business_setup_data.json';
import SpaceDetailsModal from '@/components/chat/SpaceDetailsModal';
import { SpaceDetailsSidebar } from '@/components/Map/SpaceDetailsSidebar';

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
  const speed = 15; // ms per char to simulate GPT streaming
  
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const timer = setInterval(() => {
      // Handle the case where text might be empty or undefined gracefully
      if (!text) {
        clearInterval(timer);
        if (onCompleteRef.current) onCompleteRef.current();
        return;
      }

      if (i < text.length) {
        const charToAppend = text.charAt(i);
        setDisplayedText((prev) => prev + charToAppend);
        i++;
      } else {
        clearInterval(timer);
        if (onCompleteRef.current) onCompleteRef.current();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text]); // Removed onComplete to prevent restart loops

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
const GUEST_CHAT_URL = "/api/chat/guest";
    
interface SidebarMenuItem {
  label: string;
  icon: React.ElementType;
  onClick?: () => void;
}


// [NEW] Constants for the popup
const SIDEBAR_WIDTH_ICON = 80; // Your sidebar is 80px (w-20)
const UPDATES_WIDTH = 420;
const HEADER_OFFSET = '0px'; // Restored to 0px to close the gap

// [NEW] Copied the UpdatesPopup component from your other file
// ------------------------------------------------
// UpdatesPopup component
// ------------------------------------------------
const UpdatesPopup = ({
  open,
  menuWidth,
  onCloseBoth,
  scrollRef
}: {
  open: boolean;
  menuWidth: number;
  onCloseBoth: () => void;
  scrollRef?: React.RefObject<HTMLDivElement>;
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
        ref={scrollRef}
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
  useEffect(() => {
    document.title = "Flash AI - FlashSpace";
  }, []);
  const { resolveCoordinates } = useLocationMetadata();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [message, setMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [activeChatId, setActiveChatId] = useState<string | null>(() => sessionStorage.getItem('flashspace_activeChatId'));
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // [NEW] User menu state
  const [showUpdates, setShowUpdates] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false); // [NEW] Contact form state
  const [selectedSpace, setSelectedSpace] = useState<any>(null);
  const [isSpaceDetailsOpen, setIsSpaceDetailsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const sidebarScrollRef = useRef<HTMLElement>(null);
  const updatesScrollRef = useRef<HTMLDivElement>(null);


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
    deleteChatSession,
    isLoading,
    setIsLoading,
    startNewChat,
  } = useChat();

  // [NEW] Track the city actively searched by the user to prevent AI focus stealing
  const lastTargetCity = useRef<string | null>(null);
  // Persist activeChatId to sessionStorage
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const metadata = await getSearchMetadata();
        if (Array.isArray(metadata)) {
          // Legacy/Stale Backend Fallback
          setAvailableCities(metadata);
          setSearchMetadata({
            cities: metadata,
            areas: [],
            propertyNames: []
          });
        } else {
          // New Metadata Response
          // [FIX] Extract only strings if the server returns city objects
          const cityNames = (metadata.cities || []).map((c: any) => typeof c === 'string' ? c : c.name);
          setAvailableCities(cityNames);
          setSearchMetadata(metadata);
        }
      } catch (error) {
        console.error("Failed to fetch search metadata:", error);
      }
    };
    fetchCities();
  }, []);

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

  const chatSessionsRef = useRef(chatSessions);
  useEffect(() => {
    chatSessionsRef.current = chatSessions;
  }, [chatSessions]);

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
      
      const currentSession = chatSessionsRef.current.find(s => (s._id || s.id) === activeChatId);
      let title = currentSession?.title;

      if (!title || title === 'Chat session') {
        title = firstUserMsg
          ? firstUserMsg.content.slice(0, 50) + (firstUserMsg.content.length > 50 ? '…' : '')
          : 'Chat session';
      }

      const sessionData = {
        id: activeChatId || Date.now().toString(),
        title,
        messages: chatMessages,
        date: 'Today',
      };

      chatService.saveSession(sessionData).then(res => {
        if (res.success && res.data) {
          // New chat — set activeChatId to the MongoDB _id so future saves update instead of duplicate
          const newId = res.data._id || res.data.id;
          if (!activeChatId || activeChatId !== newId) {
            setActiveChatId(newId);
            // Also add to sidebar sessions
            setChatSessions(prev => {
              // Remove the temporary session or replace it
              const filtered = prev.filter(s => (s._id || s.id) !== activeChatId);
              return [{ ...sessionData, _id: newId, id: newId }, ...filtered];
            });
          }
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
  const [mapWidth, setMapWidth] = useState(() => Math.min(window.innerWidth * 0.42, 600));
  const [isResizing, setIsResizing] = useState(false);
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([]);
  const [allMapMarkers, setAllMapMarkers] = useState<MapMarker[]>([]);
  const [selectedCity, setSelectedCity] = useState("Bangalore");

  // Initialize mapCenter as object { lat, lng }
  const defaultCenter = cityCenters["bangalore"] || { lat: 12.9716, lng: 77.5946 };
  const [mapCenter, setMapCenter] = useState({ lat: defaultCenter.lat, lng: defaultCenter.lng });

  const [mapZoom, setMapZoom] = useState(11);
  const [isLoginOpen, setIsLoginOpen] = useState(false); // [NEW]
  const [isLimitPopupOpen, setIsLimitPopupOpen] = useState(false); // [NEW] Limit Reached Popup
  const [isSignupOpen, setIsSignupOpen] = useState(false); // [NEW]
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [availableCities, setAvailableCities] = useState<string[]>(["Delhi", "Bangalore"]);
  const [searchMetadata, setSearchMetadata] = useState<{
    cities: string[];
    areas: { name: string; city: string | undefined }[];
    propertyNames: { name: string; city: string; area: string; coordinates: { lat: number; lng: number } | undefined }[];
  }>({ cities: [], areas: [], propertyNames: [] });
  const [mapTitle, setMapTitle] = useState('Popular Spaces');
  const [hasLoadedGlobalMarkers, setHasLoadedGlobalMarkers] = useState(false);

  // Constant list of major Indian hubs for robust offline detection
  const MAJOR_HUBS = ["Delhi", "Bangalore", "Gurgaon", "Noida", "Mumbai", "Pune", "Hyderabad", "Chennai", "Kolkata"];

  // [PHASE 9] Fetch all markers on mount for persistent global visibility
  useEffect(() => {
    const fetchGlobalMarkers = async () => {
      if (hasLoadedGlobalMarkers) return;
      try {
        const [voResData, cwResData] = await Promise.all([
          getAllVirtualOffices(),
          getAllCoworkingSpaces()
        ]);

        // voResData is { offices: [...], pagination: ... }
        // cwResData is [...]
        const voRes = (voResData as any).offices || (Array.isArray(voResData) ? voResData : []);
        const cwRes = Array.isArray(cwResData) ? cwResData : (cwResData as any).spaces || [];

        const voMarkers = voRes.map(item => ({
          position: item.coordinates || { lat: 0, lng: 0 },
          title: item.name,
          address: item.address,
          image: item.image,
          price: item.gstPlanPrice,
          rating: item.rating,
          reviews: item.reviews,
          features: item.features || []
        }));

        const cwMarkers = cwRes.map(item => ({
          position: item.coordinates || { lat: 0, lng: 0 },
          title: item.name,
          address: item.address,
          image: item.image,
          price: item.price,
          rating: item.rating,
          reviews: item.reviews,
          features: item.features || []
        }));

        const all = [...voMarkers, ...cwMarkers].filter(m => m.position.lat !== 0);
        setAllMapMarkers(all);
        setHasLoadedGlobalMarkers(true);
        console.log(`[MAP] Loaded ${all.length} global markers.`);
      } catch (err) {
        console.error("Failed to load global markers:", err);
      }
    };

    fetchGlobalMarkers();
  }, [hasLoadedGlobalMarkers]);

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

  // Helper: Detect City, Area, or Property from text
  const detectIntents = (text: string) => {
    const textLower = text.toLowerCase();

    let foundCityName: string | undefined;
    let foundAreaName: string | undefined;
    let foundProperty: typeof searchMetadata.propertyNames[0] | undefined;

    // 0. URGENT OVERRIDE: Prioritize major cities with high-robustness detection
    if (textLower.includes('delhi') || textLower.includes('ncr') || textLower.includes('dilli')) {
      foundCityName = 'Delhi';
    } else if (textLower.includes('bangalore') || textLower.includes('bengaluru') || textLower.includes('blore')) {
      foundCityName = 'Bangalore';
    }

    // 1. Check for specific property match (if city not locked by override)
    if (!foundCityName) {
      for (const prop of searchMetadata.propertyNames) {
        if (textLower.includes(prop.name.toLowerCase())) {
          foundProperty = prop;
          foundCityName = prop.city;
          foundAreaName = prop.area;
          break;
        }
      }
    }

    // 2. Check for area match (even if city found, to refine search)
    if (!foundProperty) {
      for (const area of searchMetadata.areas) {
        if (textLower.includes(area.name.toLowerCase())) {
          foundAreaName = area.name;
          foundCityName = area.city; // This will override the generic city with the exact city for the area
          break;
        }
      }
    }

    // 3. Check for city match in metadata (if still not found)
    if (!foundCityName) {
      const allCities = [...new Set([...availableCities, ...MAJOR_HUBS])];
      for (const city of allCities) {
        // [FIX] Defensive check to prevent crash if 'city' is somehow an object
        if (typeof city === 'string' && textLower.includes(city.toLowerCase())) {
          foundCityName = city;
          break;
        }
      }
    }

    // Normalize Gurgaon specifically
    if (foundCityName?.toLowerCase() === 'gurugram') {
      foundCityName = 'Gurgaon';
    }

    // Check for service type
    const services = [
      { type: 'virtual', keys: ['virtual', 'address', 'mail', 'gst', 'registration'] },
      { type: 'business_setup', keys: ['business setup', 'company registration', 'incorporation'] },
      { type: 'coworking', keys: ['coworking', 'desk', 'office', 'space', 'workspace', 'seat', 'cabin', 'on-demand', 'on demand', 'hot desk', 'hot-desk', 'meeting room', 'conference'] },
    ];

    const foundService = services.find(s => s.keys.some(k => textLower.includes(k)));

    return {
      cityName: foundCityName,
      areaName: foundAreaName,
      property: foundProperty,
      serviceType: foundService?.type // 'virtual' | 'coworking'
    };
  };

  // Helper: Fetch and Update Map
  const updateMapForQuery = async (text: string, isAIResponse: boolean = false, forcedServiceType?: 'virtual' | 'coworking' | 'business_setup' | string, forcedCityName?: string, aiMessageContent?: string) => {
    const { cityName: detectedCityName, areaName, property, serviceType: detectedServiceType } = detectIntents(text);
    const serviceType = forcedServiceType || detectedServiceType;
    const cityName = forcedCityName || detectedCityName;

    if (cityName) {
      if (!isAIResponse) {
        lastTargetCity.current = cityName;
      }
      const type = serviceType || 'coworking';
      setIsMapLoading(true);

      let displayTitle = '';
      if (property && !isAIResponse) {
        displayTitle = property.name;
      } else if (areaName && !isAIResponse) {
        displayTitle = `${type === 'virtual' ? 'Virtual Offices' : type === 'business_setup' ? 'Business Setup Packages' : 'Coworking Spaces'} in ${areaName}`;
      } else {
        displayTitle = `${type === 'virtual' ? 'Virtual Offices' : type === 'business_setup' ? 'Business Setup Packages' : 'Coworking Spaces'} in ${cityName}`;
      }
      setMapTitle(displayTitle);

      try {
        let markers: MapMarker[] = [];
        // [PHASE 10] Robust Center Resolution: Try resolveCoordinates, then cityCenters map (case-insensitive), then fallback
        const lowerCity = cityName.toLowerCase();
        const cityCenter = (cityCenters as any)[lowerCity] || 
                           (cityCenters as any)[lowerCity === 'gurugram' ? 'gurgaon' : lowerCity] ||
                           cityCenters.delhi;

        const center = resolveCoordinates(cityName) || (property?.coordinates) || cityCenter;
        setMapCenter(center);
        // setShowMap(true); // [MOVE] We now wait for results to avoid showing empty map

        // [PHASE 3] Unified Fetching: Fetch both if not specified, or just requested type
        // For business_setup, skip API calls entirely — use local JSON data
        let results: any[] = [];

        if (serviceType === 'business_setup') {
          // Business setup uses local JSON data, NOT API calls
          try {
            const packages = (businessSetupData.servicesByCity && businessSetupData.servicesByCity[lowerCity]) || businessSetupData.features;
            packages.forEach((pkg: any) => {
              results.push({
                position: generateRandomCoordinates(center, 0.01),
                title: pkg.name || pkg.title,
                address: pkg.description || `${cityName} (Business Setup)`,
                image: 'https://images.unsplash.com/photo-1664575602276-acd073f104c1?w=800&q=80',
                price: pkg.price,
                rating: 5.0,
                reviews: 150,
                features: pkg.features || [],
                serviceType: 'Business Setup',
                originalData: pkg
              });
            });
          } catch(e) {
            console.error("Failed to load business setup data", e);
          }
        } else if (cityName === 'SALES_TEAM') {
          // Special case for Sales Team / Negotiation requests
          results = [{
            position: center,
            title: 'Talk to Premjeet',
            address: 'Head of Sales & Deals',
            image: '/to_cloudinary/premjeet.png',
            price: 'Best Price Guaranteed',
            rating: 5.0,
            reviews: 500,
            features: ['Custom Discounts', 'Immediate Response', 'Premium Support'],
            serviceType: 'Sales Team',
            originalData: { id: 'SALES_TEAM', isSalesTeam: true }
          }];
        } else {
          // Normal workspace flow — fetch from API
          if (cityName === 'PAN_INDIA' && (serviceType === 'virtual' || serviceType === 'coworking')) {
            const citiesToFetch = ['Delhi', 'Gurgaon', 'Noida', 'Bangalore', 'Ahmedabad', 'Chennai'];
            
            const fetchFn = serviceType === 'virtual' ? getVirtualOfficesByCity : getCoworkingSpacesByCity;
            const promises = citiesToFetch.map(c => fetchFn(c).catch(() => (serviceType === 'virtual' ? { offices: [] } : { spaces: [] })));
            const responses = await Promise.all(promises);
            
            const cityData: Record<string, any[]> = {};
            citiesToFetch.forEach((c, idx) => {
              const res = responses[idx] as any;
              const dataArray = serviceType === 'virtual' ? res.offices : res.spaces;
              cityData[c] = dataArray || (Array.isArray(res) ? res : []);
            });

            const panIndiaResults: any[] = [];
            
            // Delhi: 2 (FSDL01 and FSDL03 if possible, else first 2)
            const delhiSpaces = cityData['Delhi'] || [];
            let fsdl01 = delhiSpaces.find((s: any) => s.spaceId === 'FSDL01' || (s.id && s.id.includes('FSDL01')));
            let fsdl03 = delhiSpaces.find((s: any) => s.spaceId === 'FSDL03' || (s.id && s.id.includes('FSDL03')));
            
            if (fsdl01) panIndiaResults.push(fsdl01);
            if (fsdl03) panIndiaResults.push(fsdl03);
            
            // Fill up Delhi to 2 if missing
            for (const s of delhiSpaces) {
              if (panIndiaResults.length >= 2) break;
              if (s !== fsdl01 && s !== fsdl03) panIndiaResults.push(s);
            }

            // Gurgaon: 2
            const gurgaonSpaces = cityData['Gurgaon'] || [];
            panIndiaResults.push(...gurgaonSpaces.slice(0, 2));

            // Noida: 1
            const noidaSpaces = cityData['Noida'] || [];
            panIndiaResults.push(...noidaSpaces.slice(0, 1));

            // Bangalore: 1
            const blrSpaces = cityData['Bangalore'] || [];
            panIndiaResults.push(...blrSpaces.slice(0, 1));

            // Ahmedabad: 1
            const ahmedabadSpaces = cityData['Ahmedabad'] || [];
            panIndiaResults.push(...ahmedabadSpaces.slice(0, 1));

            // Chennai: 1 (FSCHN01)
            const chennaiSpaces = cityData['Chennai'] || [];
            let fschn01 = chennaiSpaces.find((s: any) => s.spaceId === 'FSCHN01' || (s.id && s.id.includes('FSCHN01')));
            if (fschn01) panIndiaResults.push(fschn01);
            else if (chennaiSpaces.length > 0) panIndiaResults.push(chennaiSpaces[0]);

            results = panIndiaResults.map((item: any) => ({
              position: item.coordinates || generateRandomCoordinates(center, 0),
              title: item.name,
              address: item.address,
              image: item.image,
              price: serviceType === 'virtual' ? item.gstPlanPrice : (item.price || item.monthlyPrice || item.startingPrice),
              rating: item.rating || 5.0,
              reviews: item.reviews || 10,
              features: item.features || [],
              serviceType: serviceType === 'virtual' ? 'Virtual Office' : 'Coworking Space',
              originalData: item
            }));

          } else {
            const fetchVirtual = !serviceType || serviceType === 'virtual';
            const fetchCoworking = !serviceType || serviceType === 'coworking';

            const [virtualRes, coworkingRes] = await Promise.all([
              fetchVirtual ? getVirtualOfficesByCity(cityName).catch(() => ({ offices: [] })) : Promise.resolve({ offices: [] }),
              fetchCoworking ? getCoworkingSpacesByCity(cityName).catch(() => ({ spaces: [] })) : Promise.resolve({ spaces: [] })
            ]);

            // Virtual office service returns { offices: [...], pagination: ... }
            const virtualData = (virtualRes as any).offices || (Array.isArray(virtualRes) ? virtualRes : []);
            const virtualMarkers = virtualData.map((item: any) => ({
              position: item.coordinates || generateRandomCoordinates(center, 0),
              title: item.name,
              address: item.address,
              image: item.image,
              price: item.gstPlanPrice,
              rating: item.rating,
              reviews: item.reviews,
              features: item.features || [],
              serviceType: 'Virtual Office',
              originalData: item
            }));

            // Coworking service returns array Directly
            const coworkingData = Array.isArray(coworkingRes) ? coworkingRes : (coworkingRes as any).spaces || [];
            let coworkingMarkers = coworkingData.map((item: any) => ({
              position: item.coordinates || generateRandomCoordinates(center, 0),
              title: item.name,
              address: item.address,
              image: item.image,
              price: item.price,
              rating: item.rating,
              reviews: item.reviews,
              features: item.features || [],
              serviceType: 'Coworking Space',
              originalData: item
            }));

            results = [...virtualMarkers, ...coworkingMarkers];
          }

          // [SMART CARD FILTER]
          // The absolute source of truth is the AI's text response.
          // We want the cards to perfectly mirror whatever the AI just told the user.
          
          let aiMatchedResults: any[] = [];
          
          if (aiMessageContent) {
            const lowerAIContent = aiMessageContent.toLowerCase();
            const isSpaceMentioned = (space: any): boolean => {
              // 1. Prioritize Space ID matching (since AI is forbidden from using real names)
              const spaceId = space.originalData?.spaceId || space.originalData?.id || space.id;
              if (spaceId && lowerAIContent.includes(spaceId.toLowerCase())) {
                return true;
              }
              
              // 2. Fallback to name matching
              const spaceName = space.title || space.originalData?.name;
              if (!spaceName) return false;
              const lowerName = spaceName.toLowerCase().trim();
              if (lowerAIContent.includes(lowerName)) return true;
              const words = lowerName.split(/\s+/).filter(w => w.length >= 3 && !['the', 'and', 'for', 'space', 'office', 'coworking'].includes(w));
              if (words.length > 0) {
                const matchedWords = words.filter(w => lowerAIContent.includes(w));
                if (matchedWords.length >= Math.max(1, Math.ceil(words.length * 0.6))) return true;
              }
              return false;
            };
            
            aiMatchedResults = results.filter(r => isSpaceMentioned(r));
          }

          if (aiMatchedResults.length > 0) {
            results = aiMatchedResults;
          } else if (areaName) {
            const lowerArea = areaName.toLowerCase();
            const areaFiltered = results.filter(r => 
              r.address?.toLowerCase().includes(lowerArea) || 
              r.title?.toLowerCase().includes(lowerArea) ||
              r.originalData?.area?.toLowerCase().includes(lowerArea)
            );
            if (areaFiltered.length > 0) {
              results = areaFiltered;
            }
          }
        }

        // [NEW] Prioritize 'Stirring Minds' to always show at the top
        results.sort((a, b) => {
          const titleA = a.title || '';
          const titleB = b.title || '';
          const aIsStirring = titleA.toLowerCase().includes('stirring minds');
          const bIsStirring = titleB.toLowerCase().includes('stirring minds');
          if (aIsStirring && !bIsStirring) return -1;
          if (!aIsStirring && bIsStirring) return 1;
          return 0;
        });

        // [PHASE 9] Jitter only the results to avoid global mess
        const jitteredResults = results.map((m, idx) => {
          const angle = (idx * 137.5) * (Math.PI / 180);
          const r = 0.0003 + (Math.random() * 0.0002);
          return {
            ...m,
            position: {
              lat: m.position.lat + Math.cos(angle) * r,
              lng: m.position.lng + Math.sin(angle) * r
            }
          };
        });

        // [PHASE 11] Smart Center & Results Update
        if (jitteredResults.length > 0) {
          setMapMarkers(jitteredResults);
          const firstResult = jitteredResults[0].position;
          setMapCenter(firstResult);
          // User explicitly requested to NEVER auto-open the map.
          // It should only open when they manually click "Show Map".
          return jitteredResults;
        } else {
          console.log(`[MAP] No listings found for ${cityName} in local DB. Keeping map closed.`);
          return [];
        }
      } catch (error) {
        console.error("Failed to update map for query:", error);
        return [];
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
    { label: 'API Keys', icon: Key, onClick: () => handleNavigation('/settings') },
    { label: 'Settings', icon: Settings, onClick: () => handleNavigation('/settings') },
  ];

  // [NEW] Close popup function
  const closeBoth = () => {
    setShowUpdates(false);
    setShowHistory(false); // Close history as well
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false); // Only close mobile sidebar if open
    }
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
  // Handle Sidebar and Map Sync
  useEffect(() => {
    if (showMap) {
      // setIsSidebarOpen(false); // Removed auto-collapse
      // [NEW] Force a global resize event after transition to ensure map layout is correct
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 500);
    }
  }, [showMap]);

  // Handle Resize Logic
  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const stopResizing = () => {
    setIsResizing(false);
  };

  const resize = (e: MouseEvent) => {
    if (isResizing) {
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth > 300 && newWidth < window.innerWidth * 0.7) {
        setMapWidth(newWidth);
      }
    }
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

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

  // [NEW] Async Title Generator
  const generateChatTitleAsync = async (messageText: string, chatId: string) => {
    try {
      const accessToken = localStorage.getItem('accessToken') || localStorage.getItem('token');
      const targetUrl = isAuthenticated ? BACKEND_CHAT_URL : GUEST_CHAT_URL;
      
      const prompt = `Summarize this text in 2 to 4 words for a chat title. Do not include quotes or any extra text. Text: "${messageText}"`;
      
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-flashspace-csrf': 'true',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          message: prompt,
          query: prompt,
          conversation_id: 'default',
          session_id: getSessionId() + '_title_gen'
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiTitle = (data.reply || data.message || '').replace(/["'*]/g, '').trim();
        if (aiTitle && aiTitle.length < 50) {
           setChatSessions(prev => prev.map(s => (s.id === chatId || s._id === chatId) ? { ...s, title: aiTitle } : s));
        }
      }
    } catch (e) {
      console.error('Failed to generate AI title', e);
    }
  };

  const handleSendMessage = async (text?: string) => {
    const messageContent = text || message;
    if (!messageContent.trim() || isLoading) return;

    // [NEW] Guest Chat Limit Check
    if (!isAuthenticated) {
      const currentCount = parseInt(localStorage.getItem('guest_chat_count') || '0');
      if (currentCount >= 6) {
        setIsLimitPopupOpen(true);
        // Optional: clear message to avoid confusion or keep it? Keeping it allows them to send after login
        return;
      }
      localStorage.setItem('guest_chat_count', (currentCount + 1).toString());
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent.trim(),
      timestamp: new Date()
    };

    // [NEW] Eagerly create an optimistic session if it's a new chat
    if (!activeChatId) {
      const tempId = Date.now().toString();
      setActiveChatId(tempId);
      const title = messageContent.trim().slice(0, 50) + (messageContent.length > 50 ? '…' : '');
      const newSession = {
        id: tempId,
        title,
        messages: [...chatMessages, userMessage],
        date: 'Today',
      };
      setChatSessions(prev => [newSession, ...prev]);
      
      // Async generate a smart title
      generateChatTitleAsync(messageContent.trim(), tempId);
    }

    // Add user message to chat
    setChatMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const accessToken = localStorage.getItem('accessToken') || localStorage.getItem('token');
      const sessionId = getSessionId();

      const targetUrl = isAuthenticated ? BACKEND_CHAT_URL : GUEST_CHAT_URL;

      // Call backend chat endpoint (backend calls AI backend internally)
      const response = await fetch(targetUrl, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'x-flashspace-csrf': 'true',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          message: userMessage.content,
          query: userMessage.content,
          conversation_id: 'default',
          session_id: sessionId
        })
      });

      // [NEW] Detect user intent once to share with AI update
      const { serviceType: userServiceType } = detectIntents(userMessage.content);

      // (Optimistic map update removed to prevent unwanted spaces on general queries)

      if (!response.ok) {
        throw new Error('Failed to get response from chatbot');
      }

      const data = await response.json();

      // Backend returns reply directly from AI backend
      let aiResponseText = data.reply || data.message || 'I apologize, but I encountered an error. Please try again.';

      // Parse AI response for [SHOW_CARDS: city, type]
      let fetchedSpaces = undefined;
      const showCardsMatch = aiResponseText.match(/\[SHOW_CARDS:\s*([^,\]]+)(?:,\s*([^\]]+))?\]/i);

      if (showCardsMatch) {
        const aiCity = showCardsMatch[1].trim();
        const aiServiceType = showCardsMatch[2]?.trim() || userServiceType || 'coworking';
        aiResponseText = aiResponseText.replace(showCardsMatch[0], '').trim();
        fetchedSpaces = await updateMapForQuery(userMessage.content, true, aiServiceType as any, aiCity, aiResponseText);
      }

      // Add AI response to chat
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponseText || 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
        isTyping: true, // [NEW] Start typing effect
        spacesData: fetchedSpaces && fetchedSpaces.length > 0 ? fetchedSpaces : undefined
      };

      setChatMessages(prev => [...prev, assistantMessage]);
      // setShowMap(true); // User requested not to auto-open map
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

  // [NEW] Handle message from landing page
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query) {
      // Clear the search params and keep current path
      navigate(location.pathname, { replace: true });
      // Send the message
      handleSendMessage(query);
    }
  }, [location.search, location.pathname, navigate, handleSendMessage]);

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

  // Keep native wheel scrolling reliable inside scrollable panels when Lenis is enabled globally.
  useEffect(() => {
    const containers = [
      chatContainerRef.current,
      sidebarScrollRef.current,
      updatesScrollRef.current
    ];

    const preventLenisWheel = (event: WheelEvent) => {
      event.stopPropagation();
    };

    containers.forEach(container => {
      if (container) {
        container.setAttribute('data-lenis-prevent', 'true');
        container.addEventListener('wheel', preventLenisWheel, { passive: true });
      }
    });

    return () => {
      containers.forEach(container => {
        if (container) {
          container.removeEventListener('wheel', preventLenisWheel);
        }
      });
    };
  }, [showUpdates]); // Re-run when updates popup might be mounted

  const handleContactSubmit = () => {
    // console.log('Contact form submitted:', contactForm);
    setContactForm({ name: '', phone: '', email: '' });
  };

  const handleQuickAction = (actionMessage: string) => {
    setMessage(actionMessage);
    // Auto-send the message
    setTimeout(() => {
      handleSendMessage(actionMessage);
    }, 100);
  };

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0B1120] dark:text-gray-100 flex flex-col overflow-x-hidden font-grotesk">


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
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mini Sidebar — visible when full sidebar is collapsed - Hidden on mobile */}
      {!isSidebarOpen && (
        <div
          className="hidden sm:flex fixed left-0 w-[80px] bg-[#f8f8f8] border-r border-gray-200 dark:border-gray-800 z-[60] flex-col items-center pt-4 gap-3 transition-all"
          style={{
            top: HEADER_OFFSET,
            height: `calc(100vh - ${HEADER_OFFSET})`,
          }}
        >
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            title="Expand sidebar"
            style={{ color: '#677e73' }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={handleNewChat}
            className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            title="New chat"
            style={{ color: '#677e73' }}
          >
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>
      )}

      <div
        ref={sidebarRef}
        className={`fixed left-0 bg-[#f8f8f8] border-r border-gray-200 dark:border-gray-800 z-[110] lg:z-10 flex flex-col overflow-hidden transform transition-all duration-300 ease-in-out w-[288px] ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{
          top: HEADER_OFFSET,
          height: `calc(100vh - ${HEADER_OFFSET})`,
          fontFamily: "'Inter', sans-serif"
        }}
      >
        <div className="flex items-center justify-between px-3 py-4 border-b border-gray-200 dark:border-gray-800 lg:hidden">
          <Link to="/" aria-label="FlashSpace home" className="flex items-center min-w-[120px]">
            <img src="/Logo/Flashspace Logo.png" alt="FlashSpace" className="h-[24px] w-auto" />
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-gray-500"
            aria-label="Close sidebar"
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
        </div>

        {/* Logo - Matching Admin Dashboard */}
        <div className="hidden lg:flex flex-col shrink-0 transition-all duration-300 border-b border-gray-200 dark:border-gray-800 w-full px-3 py-4 justify-center">
          <div className="flex items-center w-full justify-between">
            <img
              src="/Logo/Flashspace Logo.png"
              alt="FlashSpace Logo"
              onClick={() => navigate("/")}
              className={`w-auto object-contain transition-all duration-300 ml-[-4px] cursor-pointer ${!isSidebarOpen ? "h-6" : "h-7"}`}
            />
          </div>
        </div>
        {/* Main Nav - SCROLLABLE CONTENT */}
        <nav
          ref={sidebarScrollRef}
          className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4"
        >
          {/* Action Buttons */}
          <div className="flex flex-col space-y-1.5 pb-4">
            <button
              onClick={handleNewChat}
              className={`flex items-center justify-start w-full h-[40px] px-3 gap-3 transition-all duration-300 rounded-lg group ${!activeChatId ? 'bg-[#35503F] text-[#FEF8CF] hover:bg-[#35503F]/90' : 'text-[#677e73] hover:bg-gray-200 hover:text-[#1a2d1d] dark:hover:text-white dark:hover:bg-gray-700'}`}
            >
              <MessageSquare size={18} strokeWidth={2} className="shrink-0" />
              <span className="text-[14px] font-semibold whitespace-nowrap">New Chat</span>
            </button>
            <button
              onClick={() => handleNavigation('/solutions/virtual-office')}
              className="flex items-center justify-start w-full h-[40px] px-3 gap-3 transition-all duration-300 rounded-lg group text-[#677e73] hover:bg-gray-200 hover:text-[#1a2d1d] dark:hover:text-white dark:hover:bg-gray-700"
            >
              <Briefcase size={18} strokeWidth={2} className="shrink-0" />
              <span className="text-[14px] font-semibold whitespace-nowrap">Workspaces</span>
            </button>
          </div>

          {/* Recent Section */}
          <div className="pt-2">
            <p className="text-[14px] font-semibold tracking-widest px-2 mb-2 text-[#1a2d1d] opacity-50 font-sans">Recents</p>
            {chatSessions.length === 0 ? (
              <p className="px-3 py-2 text-xs italic" style={{ color: '#677e73', opacity: 0.5 }}>No past chats yet</p>
            ) : (
              chatSessions.map((session) => {
                const sessionKey = session._id || session.id;
                const isActive = activeChatId === sessionKey;
                return (
                  <div key={sessionKey} className={`relative group w-full h-[40px] flex items-center pr-2 mb-1 border-b border-gray-300 dark:border-gray-600 transition-colors ${isActive ? 'bg-[#35503F] rounded-lg border-transparent' : 'rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
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
                            // New unsaved chat – save as a new session
                            startNewChat(chatMessages);
                          }
                        }
                        setChatMessages(session.messages);
                        setActiveChatId(sessionKey);
                      }}
                      className={`flex-1 h-full flex items-center text-left px-3 text-[14px] min-w-0 font-${isActive ? 'semibold' : 'medium'}`}
                      style={{ color: isActive ? '#FEF8CF' : '#677e73' }}
                      title={session.title}
                    >
                      <div className="truncate w-full first-letter:uppercase">{session.title}</div>
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
        <div className="border-t border-gray-200 dark:border-gray-700 p-3 space-y-1">
          <button
            onClick={() => handleNavigation('/')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-left"
            style={{ color: '#677e73' }}
          >
            <Home className="w-4 h-4 flex-shrink-0" />
            Home
          </button>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-left"
            style={{ color: '#677e73' }}
          >
            <ChevronLeft className="w-4 h-4 flex-shrink-0" />
            Collapse Sidebar
          </button>
        </div>
      </div>

      {/* Main Content - Adjusted for wider sidebar */}
      <div
        className={`flex-1 pt-0 flex flex-row z-40 relative transition-all duration-300 ${isSidebarOpen ? "lg:ml-[288px]" : "lg:ml-[80px]"} ml-0`}
        style={{
          marginRight: showMap && window.innerWidth >= 1024 ? `${mapWidth}px` : '0px',
        }}
      >
        <div className="flex-1 h-[100dvh] bg-[#FAF9F6] dark:bg-[#0B1120] overflow-hidden flex flex-col min-w-0 transition-all duration-500">
          {/* Chat Interface */}
          <div className="w-full h-full flex flex-col bg-transparent relative">

            {/* Chat Header with Map Toggle */}
            <div className="flex items-center justify-between lg:justify-end px-4 pt-2 lg:pt-3 pb-1 flex-shrink-0 gap-2">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-gray-500"
                title="Open sidebar"
              >
                <MenuIcon className="w-5 h-5" />
              </button>

              <button
                onClick={() => setShowMap((prev) => !prev)}
                className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold transition-all duration-200 border shadow-sm ${showMap
                  ? "bg-[#35503F] text-white border-[#35503F] shadow-[#35503F]/20"
                  : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-[#35503F] hover:text-[#35503F]"
                  }`}
                title={showMap ? "Hide map" : "Show map"}
              >
                <Map className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>{showMap ? "Hide Map" : "Show Map"}</span>
                {!showMap && mapMarkers.length > 0 && (
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#35503F] animate-pulse ml-0.5" />
                )}
                <ChevronRight
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform duration-200 ${showMap ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            {/* Chat Content */}
            <div
              ref={chatContainerRef}
              className="chat-container custom-scrollbar flex-1 min-h-0 p-4 sm:p-6 overflow-y-auto relative z-10 scroll-smooth"
              style={{ height: '100%' }}
              data-lenis-prevent
              tabIndex={0}
              role="region"
              aria-label="Chat messages"
            >
              {chatMessages.length === 0 ? (
                // Clean Welcome State (matching screenshot)
                <div className="flex flex-col items-center justify-center h-full text-center max-w-4xl mx-auto px-4 sm:px-6">
                  <h2 className="text-[32px] sm:text-[40px] font-bold text-[#1a2d1d] dark:text-white mb-2 tracking-tight font-sans">
                    How can we help your business?
                  </h2>
                  <p className="text-[16px] text-[#677e73] dark:text-gray-400 mb-10 max-w-lg leading-relaxed font-medium font-sans">
                    Ask about coworking spaces, virtual offices, compliance, or
                    compare plans instantly.
                  </p>

                  <div className="w-full max-w-3xl mt-8 mb-4">
                    {/* Embedded Input Bar for Empty State */}
                    <form 
                      onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} 
                      className="relative bg-white dark:bg-[#1E293B] shadow-lg rounded-full border border-[#edede6] dark:border-white/5 flex items-center p-1.5 sm:p-2 pr-1.5 sm:pr-2 gap-2 transition-all focus-within:border-[#35503F] focus-within:shadow-[0_0_15px_rgba(53,80,63,0.3)] dark:focus-within:border-[#35503F] dark:focus-within:shadow-[0_0_15px_rgba(53,80,63,0.5)]"
                    >
                      <button type="button" className="p-1.5 sm:p-2 text-[#677e73] hover:text-[#1a2d1d] hover:bg-gray-50 dark:hover:bg-white/5 rounded-full transition-colors cursor-default">
                        <Search className="w-5 h-5 sm:w-5 sm:h-5" strokeWidth={1.5} />
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
                        disabled={isLoading}
                        placeholder="Type your question..."
                        className="flex-1 bg-transparent !border-0 focus:ring-0 focus:border-transparent !outline-none text-[#1a2d1d] dark:text-gray-100 placeholder-[#677e73] text-[15px] sm:text-[16px] font-normal font-sans h-full py-2 min-w-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ outline: 'none', boxShadow: 'none', border: 'none', borderColor: 'transparent' }}
                      />
                      <button
                        onClick={toggleVoiceInput}
                        className={`p-1.5 sm:p-2 rounded-full transition-all ${isListening
                          ? "text-red-500 bg-red-50 hover:bg-red-100 animate-pulse"
                          : "text-[#677e73] dark:text-gray-300 hover:text-[#1a2d1d] hover:bg-gray-50 dark:hover:bg-gray-800"
                          }`}
                        title={isListening ? "Stop listening" : "Start voice input"}
                      >
                        <Mic
                          className={`w-5 h-5 sm:w-6 sm:h-6 ${isListening ? "fill-current" : ""}`}
                          strokeWidth={1.5}
                        />
                      </button>
                      {message.trim() && (
                        <button
                          type="submit"
                          className="p-2 sm:p-2.5 bg-[#FEF8CF] text-[#1a2d1d] rounded-full shadow-sm hover:bg-[#f6eca1] transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center"
                          disabled={isLoading}
                        >
                          <Send className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
                        </button>
                      )}
                    </form>
                  </div>

                  <div className="w-full max-w-3xl mt-4">
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <button
                        onClick={() => handleQuickAction('Find professional virtual office spaces')}
                        className="px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-[14px] font-medium font-sans text-[#1a2d1d] dark:text-gray-200 transition-all shadow-sm hover:border-[#35503F] hover:shadow-[0_0_15px_rgba(53,80,63,0.2)] hover:text-[#35503F] dark:hover:border-[#35503F] dark:hover:shadow-[0_0_15px_rgba(53,80,63,0.4)]"
                      >
                        Virtual Office
                      </button>
                      
                      <button
                        onClick={() => handleQuickAction('Explore flexible coworking options')}
                        className="px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-[14px] font-medium font-sans text-[#1a2d1d] dark:text-gray-200 transition-all shadow-sm hover:border-[#35503F] hover:shadow-[0_0_15px_rgba(53,80,63,0.2)] hover:text-[#35503F] dark:hover:border-[#35503F] dark:hover:shadow-[0_0_15px_rgba(53,80,63,0.4)]"
                      >
                        Coworking Spaces
                      </button>

                      <button
                        onClick={() => handleQuickAction('Get help with company registration & setup')}
                        className="px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-[14px] font-medium font-sans text-[#1a2d1d] dark:text-gray-200 transition-all shadow-sm hover:border-[#35503F] hover:shadow-[0_0_15px_rgba(53,80,63,0.2)] hover:text-[#35503F] dark:hover:border-[#35503F] dark:hover:shadow-[0_0_15px_rgba(53,80,63,0.4)]"
                      >
                        Business Setup
                      </button>
                    </div>
                  </div>
                </div>

              ) : (
                // Chat Messages
                <div className="space-y-6 max-w-4xl mx-auto pb-32 w-full">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-4 group w-full ${msg.role === 'user' ? 'flex-row-reverse items-center' : 'flex-row items-start'}`}
                    >
                      {/* Avatar removed as per user request */}

                      <div className={`flex flex-col gap-3 w-full max-w-[90%] sm:max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        {/* Message Bubble */}
                        <div
                          className={`px-4 sm:px-5 shadow-sm w-fit ${msg.role === "user"
                            ? "bg-gradient-to-br from-[#35503F] to-[#3d6b4f] text-white rounded-[24px] py-1.5 sm:py-2"
                            : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-[24px] py-3 sm:py-4"
                            }`}
                        >
                          {msg.role === 'assistant' && msg.isTyping ? (
                            <TypewriterEffect
                              text={msg.content}
                              onComplete={() => handleTypingComplete(msg.id)}
                            />
                          ) : (
                            <div className={`text-[16px] tracking-[-0.01em] whitespace-pre-wrap break-words font-medium font-sans ${msg.role === 'user' ? 'text-white leading-[1.5]' : 'text-gray-800 dark:text-gray-100 leading-[1.8]'
                              }`}>
                              {formatMessage(msg.content)}
                            </div>
                          )}
                        </div>

                        {msg.role === 'assistant' && !msg.isTyping && msg.spacesData && msg.spacesData.length > 0 && (
                          <div className="w-full mt-1">
                            <SpacesInlineWidget 
                              spaces={msg.spacesData} 
                              onSpaceClick={(space) => {
                                setSelectedSpace(space);
                                setIsSpaceDetailsOpen(true);
                              }}
                            />
                          </div>
                        )}
                      </div>

                      {msg.role === 'assistant' && !msg.isTyping && (
                        <button
                          onClick={() => handleSpeak(msg.content)}
                          className="opacity-60 hover:opacity-100 transition-opacity duration-200 p-2 h-fit self-start mt-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-[#35503F] shrink-0"
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
                      {/* Avatar removed as per user request */}
                      <div className="flex items-center gap-3 p-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 bg-[#35503F]/80 rounded-full animate-wave" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-2.5 h-2.5 bg-[#35503F]/80 rounded-full animate-wave" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-2.5 h-2.5 bg-[#35503F]/80 rounded-full animate-wave" style={{ animationDelay: '300ms' }}></span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

             {/* Chat Input */}
            {chatMessages.length > 0 && (
              <div className="p-3 sm:p-4 lg:p-6 bg-transparent relative z-20">
                <div className="max-w-4xl mx-auto relative group">
                  <form 
                    onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                    className="relative bg-white dark:bg-[#1E293B] shadow-lg rounded-2xl sm:rounded-full border border-[#edede6] dark:border-white/5 flex items-center p-1.5 sm:p-2 pr-1.5 sm:pr-2 gap-2 transition-all focus-within:border-[#35503F] focus-within:shadow-[0_0_15px_rgba(53,80,63,0.3)] dark:focus-within:border-[#35503F] dark:focus-within:shadow-[0_0_15px_rgba(53,80,63,0.5)]"
                  >
                  <button type="button" className="p-1.5 sm:p-2 text-[#677e73] hover:text-[#1a2d1d] hover:bg-gray-50 dark:hover:bg-white/5 rounded-full transition-colors cursor-default">
                    <Search className="w-5 h-5 sm:w-5 sm:h-5" strokeWidth={1.5} />
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
                    disabled={isLoading}
                    placeholder="Type your question..."
                    className="flex-1 bg-transparent !border-0 focus:ring-0 focus:border-transparent !outline-none text-[#1a2d1d] dark:text-gray-100 placeholder-[#677e73] text-[15px] sm:text-[16px] font-normal font-sans h-full py-2 min-w-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ outline: 'none', boxShadow: 'none', border: 'none', borderColor: 'transparent' }}
                  />
                  <button
                    onClick={toggleVoiceInput}
                    className={`p-1.5 sm:p-2 rounded-full transition-all ${isListening
                      ? "text-red-500 bg-red-50 hover:bg-red-100 animate-pulse"
                      : "text-[#677e73] dark:text-gray-300 hover:text-[#1a2d1d] hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    title={isListening ? "Stop listening" : "Start voice input"}
                  >
                    <Mic
                      className={`w-5 h-5 sm:w-6 sm:h-6 ${isListening ? "fill-current" : ""}`}
                      strokeWidth={1.5}
                    />
                  </button>
                  {message.trim() && (
                    <button
                      type="submit"
                      className="p-2 sm:p-2.5 bg-[#FEF8CF] text-[#1a2d1d] rounded-full shadow-sm hover:bg-[#f6eca1] transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center"
                      disabled={isLoading}
                    >
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
                    </button>
                  )}
                </form>
              </div>
            </div>
            )}

            {/* Always visible Disclaimer at bottom */}
            <div className="pb-3 pt-2 left-0 w-full z-10 pointer-events-none flex-shrink-0">
              <p className="text-[10px] sm:text-[11px] text-center text-[#677e73] font-medium flex items-center justify-center gap-1.5 opacity-80">
                <Shield className="w-3.5 h-3.5" />
                Flashspace AI can make mistakes. Please verify important details.
              </p>
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div
          className={`flex-shrink-0 bg-white dark:bg-[#0d1728] border-l border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden transition-all duration-300 ease-in-out fixed right-0 bottom-0 z-[120] ${
            showMap 
              ? "opacity-100" 
              : "w-0 opacity-0 pointer-events-none"
          }`}
          style={{
            top: HEADER_OFFSET,
            height: `calc(100vh - ${HEADER_OFFSET})`,
            width: showMap ? (window.innerWidth < 1024 ? '100%' : `${mapWidth}px`) : '0px',
          }}
        >
          {showMap && (
            <>
              {/* Resize Handle */}
              <div
                onMouseDown={startResizing}
                className="absolute left-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-[#35503F]/20 z-[100] transition-colors group hidden lg:block"
                title="Drag to resize"
              >
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-10 bg-gray-300 dark:bg-gray-600 rounded-full group-hover:bg-[#35503F] transition-colors" />
              </div>

              {/* Map Panel Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex-shrink-0 bg-white dark:bg-[#0d1728]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#35503F]/10 flex items-center justify-center">
                    <Map className="w-4 h-4 text-[#35503F]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{mapTitle}</h3>
                    {mapMarkers.length > 0 && (
                      <p className="text-[10px] text-gray-400">{mapMarkers.length} location{mapMarkers.length !== 1 ? 's' : ''} found</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setShowMap(false)}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  title="Close map"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Map Body - uses absolute positioning to guarantee height */}
              <div className="flex-1 relative min-h-0">
                {isMapLoading && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 dark:bg-black/50 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-2 border-[#35503F] border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs text-gray-500 font-medium">Loading locations...</p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0">
                  <MapSection
                    center={mapCenter}
                    markers={mapMarkers.length > 0 ? mapMarkers : allMapMarkers}
                    focusMarkers={mapMarkers}
                    zoom={mapZoom}
                    height="100%"
                    visible={showMap}
                  />
                </div>
              </div>
            </>
          )}
        </div>
        
        <SpaceDetailsModal
          space={selectedSpace}
          isOpen={isSpaceDetailsOpen}
          onClose={() => setIsSpaceDetailsOpen(false)}
          onScheduleVisit={() => handleNavigation('/services/virtual-office')}
        />
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

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onSwitchToSignup={() => {
          setIsLoginOpen(false);
          // If there is a SignupModal we can open it, but for now just navigate if needed
          navigate('/login');
        }}
      />
    </div>
  );
};

export default StartChatting;
