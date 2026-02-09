import { useState, useEffect, useRef } from 'react';
import { getLenis } from '@/lib/lenis.ts';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from "@/lib/utils";
import {
  Send, Speech, Volume2, Mic, Plus, MapPin, Building2, FileText, Briefcase, Users, Menu as MenuIcon,
  Phone, Mail, User, Sparkles, MoreVertical, MessageSquare, Search, Heart, FolderKanban,
  Bell, Compass, PlusCircle, ArrowRight, ExternalLink, Home, Calendar, Megaphone,
  Settings, MoreHorizontal, X, ArrowLeft, Sun, Moon, History, ChevronDown, LayoutDashboard,
  LogOut, Lock, // [NEW] Added icons
  UserIcon
} from 'lucide-react';
import { createPortal } from "react-dom"; // [NEW] Added createPortal
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
import { API_CONFIG } from '@/config/api.config'; // [NEW] Import API Config

// [NEW] Custom Text Formatter to handle bold text, URLs, Images, and PDFs
const formatMessage = (text: string) => {
  if (!text) return null;

  // URL regex pattern
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // Split by bold markers first
  const parts = text.split(/(\*\*.*?\*\*)/g);

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

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean; // [NEW] Flag to trigger typing effect
}

// n8n Webhook Configuration
const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://your-n8n-instance.com/webhook/chatbot';

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
        className="bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 rounded-r-[22px] shadow-[0_8px_32px_rgba(0,0,0,0.15)] p-7 w-full h-full overflow-y-auto flex flex-col relative"
      >
        {/* Header */}
        <div className="flex justify-between items-center gap-3">
          <h2 className="text-2xl font-bold mb-[18px] text-gray-900 dark:text-white mt-2.5 tracking-wide">
            Update & <span className="text-[#FFCC00]">Notification</span>
          </h2>
          <button
            onClick={onCloseBoth}
            aria-label="Close updates"
            className="bg-transparent border-none cursor-pointer p-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-[18px] h-[18px]" />
          </button>
        </div>

        {/* Updates Content */}
        <div className="flex flex-col gap-[1.3rem]">
          <div className="bg-[#f6f7ff] dark:bg-indigo-950/30 rounded-[14px] p-[18px]">
            <strong className="text-gray-900 dark:text-gray-100">Site Launched!</strong>
            <p className="m-[10px_0_0_0] text-[#506] dark:text-indigo-300">
              We have deployed the first AI-enabled business workspace platform. 🎉
            </p>
          </div>

          <div className="bg-[#f0fff6] dark:bg-green-950/30 rounded-[14px] p-[18px]">
            <strong className="text-gray-900 dark:text-gray-100">New Feature: Flash Tribe</strong>
            <p className="m-[10px_0_0_0] text-[#265] dark:text-emerald-300">
              Now connect with fellow workspace members and grow your professional network.
            </p>
          </div>

          <div className="bg-[#fff8f0] dark:bg-orange-950/30 rounded-[14px] p-[18px]">
            <strong className="text-gray-900 dark:text-gray-100">Maintenance Notice</strong>
            <p className="m-[10px_0_0_0] text-[#a64] dark:text-orange-300">
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
const ChatHistorySidebar = ({
  open,
  width,
  onClose,
  onSelectChat
}: {
  open: boolean;
  width: number;
  onClose: () => void;
  onSelectChat: (chatId: string) => void;
}) => {
  // Mock Data for History
  const historyData = [
    { id: '1', title: 'Start a Startup in Bangalore', date: 'Today' },
    { id: '2', title: 'Coworking in Indiranagar', date: 'Yesterday' },
    { id: '3', title: 'Virtual Office Registration', date: 'Last Week' },
    { id: '4', title: 'Meeting Room Requirements', date: 'Last Week' },
  ];

  return createPortal(
    <div
      className={`fixed top-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col`}
      style={{
        left: width, // 80px from left
        width: '320px', // Fixed width for history
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        // Opacity transition for smoother effect
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
      }}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-500" />
          History
        </h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {historyData.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className="group p-3 mb-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
          >
            <div className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
              {chat.title}
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {chat.date}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <Button
          variant="outline"
          className="w-full justify-start text-gray-600 dark:text-gray-300"
          onClick={() => {
            onSelectChat('new');
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>
    </div>,
    document.body
  );
};

// ------------------------------------------------
// End of UpdatesPopup & ChatHistorySidebar
// ------------------------------------------------

const StartChatting = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [message, setMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // [NEW] User menu state
  const [showUpdates, setShowUpdates] = useState(false); // [NEW] State for the popup
  const [showHistory, setShowHistory] = useState(false); // [NEW] State for history sidebar
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [contactForm, setContactForm] = useState<ContactForm>({
    name: '',
    phone: '',
    email: ''
  });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

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
    { label: 'History', icon: History, onClick: () => setShowHistory(prev => !prev) }, // [NEW] History toggle
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
    setShowHistory(false); // Close history as well
    setIsSidebarOpen(false); // Also close mobile sidebar if open
  };

  // [NEW] Handle history selection
  const handleHistorySelect = (chatId: string) => {
    console.log("Selected chat:", chatId);
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
    if (showUpdates || showHistory) {
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
  }, [showUpdates, showHistory, isSidebarOpen]); // [NEW] Added isSidebarOpen as dependency

  // Pause Lenis globally while this page is mounted to keep native wheel behavior snappy
  useEffect(() => {
    let lenis: any;
    try {
      // prefer existing instance if present
      // @ts-ignore
      lenis = (window as any).__lenis ?? getLenis();
      lenis?.stop?.();
    } catch {
      // ignore if lenis not available
    }
    return () => {
      try {
        lenis?.start?.();
      } catch {
        // ignore
      }
    };
  }, []);

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
      // Call n8n webhook
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          // response: userMessage.content,
          sessionId: getSessionId(),
          timestamp: userMessage.timestamp.toISOString()
        })
      });

      // [NEW] Trigger map update based on user message (optimistic update)
      updateMapForQuery(userMessage.content);

      if (!response.ok) {
        throw new Error('Failed to get response from chatbot');
      }

      const data = await response.json();
      console.log('n8n response:', data); // Debug log

      // Try multiple possible response formats from n8n
      let aiResponseText = '';

      if (Array.isArray(data)) {
        // If response is an array, get first item
        const firstItem = data[0];
        aiResponseText = firstItem?.output || firstItem?.response || firstItem?.text || firstItem?.message || JSON.stringify(firstItem);
      } else if (typeof data === 'object') {
        // Try different possible field names
        aiResponseText = data.Response || data.output || data.response || data.text || data.message || data.result || data.answer || JSON.stringify(data);
      } else {
        aiResponseText = String(data);
      }

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
      console.error('Error sending message to n8n:', error);

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

  const handleContactSubmit = () => {
    console.log('Contact form submitted:', contactForm);
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
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-50 lg:left-20">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
            {/* Mobile Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="lg:hidden p-2 text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            {/* Main Text Logo */}
            <img
              src="https://cdn.prod.website-files.com/664330484432dcdd6519a8fd/665dd8e0007de68a44f3750b_Black%20and%20White%20Bold%20Typography%20Clothing%20Brand%20Logo%20(940%20x%20400%20px)%20(940%20x%20200%20px)%20(940%20x%20150%20px).png"
              alt="FlashSpace Logo"
              className="h-7 w-auto cursor-pointer dark:invert"
              onClick={() => handleNavigation('/')}
            />
          </div>
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors mr-2"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* IND Button */}
            <div className="hidden sm:flex items-center px-3 py-1.5 rounded-md border transition-colors duration-300 border-gray-300 dark:border-gray-700 text-black dark:text-white">
              <span className="text-sm font-md">IND</span>
            </div>

            {/* Get in Touch Button */}
            <Splash3dButton
              onClick={() => handleNavigation('/get-in-touch')}
              className="hidden sm:inline-flex relative px-6 py-2.5 text-base rounded-lg font-bold bg-black dark:bg-gray-800 text-white dark:text-white border border-black dark:border-gray-700 shadow-[0_2px_8px_0_rgba(0,0,0,0.10)] hover:shadow-[0_4px_16px_0_rgba(0,0,0,0.13)] active:translate-y-1 transition-all duration-150 before:content-[''] before:absolute before:inset-0 before:rounded-lg before:pointer-events-none"
            >
              Get in Touch
            </Splash3dButton>

            {/* Log in Button or User Profile */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 border border-gray-200 dark:border-gray-700 bg-yellow-50 dark:bg-yellow-500/10"
                >
                  {/* User Avatar */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                    {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  {/* User Name */}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[120px] truncate hidden sm:block">
                    {user?.fullName || 'User'}
                  </span>
                  {/* Dropdown Icon */}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-200",
                      isUserMenuOpen && "rotate-180"
                    )}
                  />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {user?.fullName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
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
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        <span className="font-medium">Dashboard</span>
                      </button>

                      <button
                        onClick={() => {
                          handleNavigation("/dashboard/profile");
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150"
                      >
                        <UserIcon className="h-4 w-4" />
                        <span className="font-medium">My Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          handleNavigation("/settings");
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150"
                      >
                        <Settings className="h-4 w-4" />
                        <span className="font-medium">Settings</span>
                      </button>
                    </div>

                    {/* Logout Section */}
                    <div className="border-t border-gray-100 dark:border-gray-800 pt-1">
                      <button
                        onClick={async () => {
                          await logout();
                          setIsUserMenuOpen(false);
                          handleNavigation("/");
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
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
                onClick={() => setIsLoginOpen(true)}
                variant="outline"
                className="hidden sm:inline-flex px-4 py-2 text-sm rounded-md transition-all duration-300 border-gray-300 dark:border-gray-700 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                style={{ fontFamily: 'Poppins' }}
              >
                Log in
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* [NEW] Transparent Overlay for Updates/History Popup */}
      {/* This sits below the popup (z-9999) but above the page content */}
      {(showUpdates || showHistory) && (
        <div
          onClick={closeBoth}
          className="fixed inset-0 z-[45]"
          style={{ background: "transparent" }}
        />
      )}

      {/* [NEW] Render the Updates Popup */}
      <UpdatesPopup
        open={showUpdates}
        menuWidth={SIDEBAR_WIDTH_ICON}
        onCloseBoth={closeBoth}
      />

      {/* [NEW] Render Chat History Sidebar */}
      <ChatHistorySidebar
        open={showHistory}
        width={SIDEBAR_WIDTH_ICON}
        onClose={() => setShowHistory(false)}
        onSelectChat={handleHistorySelect}
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
        className={`fixed top-0 left-0 h-screen w-20 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-sm z-[60] flex flex-col overflow-hidden lg:translate-x-0 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
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
                    className="w-full flex items-center justify-center px-4 py-3 text-gray-700 dark:text-gray-200 rounded-lg transition-all duration-200 group"
                    title={item.label}
                  >
                    <Icon className="w-6 h-6 text-gray-700 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white group-hover:fill-[#EDB003] group-hover:scale-125 transition-all duration-200" strokeWidth={2} />
                  </button>
                </li>
              );
            })}

            {/* [CHANGE] Added Popover for 'More' button */}
            <li>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className="w-full flex items-center justify-center px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-200 group"
                    title="More"
                  >
                    <MoreHorizontal className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white group-hover:fill-[#EDB003] group-hover:scale-125 transition-all duration-200" strokeWidth={2} />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-48" side="right" align="start" sideOffset={10}>
                  <div className="flex flex-col space-y-1 p-1">
                    <button
                      onClick={() => handleNavigation('/about')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      About Us
                    </button>
                    <button
                      onClick={() => handleNavigation('/career')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      Career
                    </button>
                    <button
                      onClick={() => handleNavigation('/blog')}
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
        <div className="border-t border-gray-100 dark:border-gray-800 p-4 flex-shrink-0 space-y-3">
          {/* Profile Button */}
          <button
            onClick={() => handleNavigation('/about')}
            className="w-full flex items-center justify-center py-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
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
      <div className="flex-1 lg:ml-20 pt-16 flex flex-col lg:flex-row shadow-2xl z-40 relative">
        <div className="w-full h-[calc(100dvh-4rem)] bg-slate-50 dark:bg-[#0B1120] overflow-hidden flex flex-col">
          <ResizableMapLayout
            defaultListingWidth={65}
            showFloatingButton={showMap}
            mapContent={
              /* Right Panel - Sidebar - Scrollable Vertically */
              <div
                className={`w-full h-full bg-white dark:bg-[#0F172A] flex flex-col relative transition-all duration-300 ${showMap ? 'overflow-hidden' : 'overflow-y-auto overflow-x-hidden p-6 scrollbar-yellow'
                  }`}
                style={{
                  WebkitOverflowScrolling: 'touch',
                  overscrollBehavior: 'contain',
                  touchAction: 'pan-y'
                }}
                data-lenis-prevent
                data-lenis-prevent-wheel
                data-lenis-prevent-touch
              >
                {showMap ? (
                  // Full Height Map View (Mindtrip Style)
                  <div
                    className="w-full h-full relative flex flex-col bg-white dark:bg-gray-900"
                    style={{
                      animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) both'
                    }}
                  >
                    <style>{`
                      @keyframes slideInRight {
                        0% { opacity: 0; transform: translateX(50px); }
                        100% { opacity: 1; transform: translateX(0); }
                      }
                    `}</style>
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                      <button
                        onClick={() => setShowMap(false)}
                        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md text-gray-800 dark:text-gray-100 px-3 py-2 rounded-lg shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 text-sm font-medium flex items-center gap-2 transition-all"
                      >
                        <ArrowRight className="w-4 h-4 rotate-180" />
                        <span>Back</span>
                      </button>
                      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md px-3 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {mapTitle}
                      </div>
                    </div>
                    <div className="flex-1 w-full h-full">
                      {isMapLoading ? (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#EDB003]"></div>
                        </div>
                      ) : (
                        <MapSection
                          center={mapCenter}
                          markers={mapMarkers}
                          zoom={11}
                          height="100%"
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 max-w-xl mx-auto min-h-full">
                    {/* Popular Spaces Section */}
                    <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-5 shadow-lg border border-slate-100 dark:border-white/5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#EDB003]" />
                          <h3 className="text-base font-bold text-gray-900 dark:text-white" >Popular Spaces in {selectedCity}</h3>
                        </div>
                        <button className="text-xs font-medium text-[#EDB003] hover:text-[#d69f03] flex items-center gap-1 transition-colors">
                          View Map
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {popularSpaces.map((space, index) => (
                          <div
                            key={index}
                            className="bg-white dark:bg-[#0F172A] border border-slate-100 dark:border-slate-800 hover:border-[#EFAD1A]/50 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 group hover:shadow-xl hover:shadow-[#EFAD1A]/5 hover:-translate-y-1"
                          >
                            <div className="h-32 relative overflow-hidden">
                              {space.image && (
                                <img
                                  src={space.image}
                                  alt={space.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                                />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                              <div className="absolute top-2 right-2">
                                <span className="inline-block text-[10px] px-2.5 py-1 bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-full font-bold tracking-wide">
                                  {space.type}
                                </span>
                              </div>
                            </div>
                            <div className="p-4 relative">
                              <div className="absolute -top-3 right-3 w-8 h-8 rounded-full bg-[#EFAD1A] flex items-center justify-center text-white shadow-lg scale-0 group-hover:scale-100 transition-transform duration-300">
                                <ArrowRight className="w-4 h-4 -rotate-45" />
                              </div>
                              <div className="text-sm font-bold text-slate-900 dark:text-white mb-1 line-clamp-1 group-hover:text-[#EFAD1A] transition-colors">{space.name}</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 flex items-center gap-1.5">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                {space.location}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Get Started Section - Premium Card */}
                    <div className="relative overflow-hidden rounded-2xl p-6 group">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#EFAD1A] to-[#F59E0B] opacity-10 dark:opacity-20 group-hover:opacity-15 transition-opacity"></div>
                      <div className="absolute inset-0 border border-[#EFAD1A]/20 rounded-2xl"></div>

                      {/* Decorative blobs */}
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#EFAD1A]/20 rounded-full blur-2xl"></div>
                      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#EFAD1A]/10 rounded-full blur-2xl"></div>

                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-grotesk">Find Your Perfect <br /> Workspace</h3>
                          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#0F172A] shadow-lg flex items-center justify-center text-[#EFAD1A] rotate-3 group-hover:rotate-12 transition-transform duration-300">
                            <Sparkles className="w-6 h-6" />
                          </div>
                        </div>

                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed font-medium">
                          Take our AI-powered quiz to discover workspaces tailored to your specific needs in seconds.
                        </p>

                        <button className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 group/btn">
                          Take Workspace Quiz
                          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>

                    {/* Get Inspired Section */}
                    <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-5 shadow-lg border border-slate-100 dark:border-white/5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-gray-900 dark:text-white" >Get Inspired</h3>
                        <button className="text-xs font-medium text-[#EDB003] hover:text-[#d69f03] transition-colors">
                          See all
                        </button>
                      </div>
                      <div className="space-y-4">
                        {inspirationCards.map((card, index) => (
                          <div
                            key={index}
                            className="flex gap-4 p-4 bg-white dark:bg-[#0F172A] hover:bg-slate-50 dark:hover:bg-[#1E293B] rounded-2xl cursor-pointer transition-all duration-300 group border border-slate-100 dark:border-slate-800 hover:border-[#EFAD1A]/30 hover:shadow-md"
                          >
                            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 relative">
                              <img
                                src={card.image}
                                alt={card.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5 line-clamp-1 group-hover:text-[#EFAD1A] transition-colors font-grotesk" >
                                {card.title}
                              </h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium" >
                                {card.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            }
          >
            {/* Left Panel - Chat Interface - 60-65% - Scrollable Chat Area */}
            <div className="w-full h-full flex flex-col bg-slate-50 dark:bg-[#0B1120] relative border-r border-slate-200 dark:border-slate-800">

              {/* Chat Content */}
              <div
                ref={chatContainerRef}
                className="flex-1 p-4 sm:p-6 overflow-y-auto relative z-10 scroll-smooth"
                style={{
                  height: '100%'
                }}
                tabIndex={0}
                role="region"
                aria-label="Chat messages"
                data-lenis-prevent
                data-lenis-prevent-wheel
                data-lenis-prevent-touch
              >
                {chatMessages.length === 0 ? (
                  // Empty State
                  <div className="flex flex-col items-center justify-center h-full text-center max-w-3xl mx-auto">
                    <div className="relative mb-8 group">
                      <div className="absolute inset-0 bg-[#EFAD1A]/30 rounded-full blur-3xl group-hover:blur-3xl transition-all duration-500 opacity-50"></div>
                      <div className="w-24 h-24 bg-white dark:bg-[#1E293B] rounded-[2rem] flex items-center justify-center shadow-2xl border border-white/50 dark:border-white/10 relative z-10 group-hover:-translate-y-2 transition-transform duration-500">
                        <Building2 className="w-10 h-10 text-[#EFAD1A]" />
                      </div>
                    </div>

                    <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight font-grotesk">
                      How can we help your business?
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-12 max-w-lg text-lg leading-relaxed font-normal">
                      Ask about coworking spaces, virtual offices, compliance, or compare plans instantly.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full px-4">
                      {/* Suggestions buttons */}
                      <button
                        onClick={() => handleQuickAction('Find coworking spaces in Delhi NCR region')}
                        className="text-left p-6 bg-white/60 dark:bg-[#1E293B]/60 backdrop-blur-xl hover:bg-white dark:hover:bg-[#1E293B] shadow-sm hover:shadow-xl hover:shadow-[#EFAD1A]/10 border border-slate-200 dark:border-white/5 hover:border-[#EFAD1A]/50 rounded-[1.5rem] transition-all duration-300 group"
                      >
                        <div className="text-base font-bold text-slate-800 dark:text-white group-hover:text-[#EFAD1A] transition-colors mb-1 font-grotesk">Find coworking spaces</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 font-medium group-hover:text-slate-600 dark:group-hover:text-slate-300">in Delhi NCR region</div>
                      </button>
                      <button
                        onClick={() => handleQuickAction('Help me with GST Registration complete registration process')}
                        className="text-left p-6 bg-white/60 dark:bg-[#1E293B]/60 backdrop-blur-xl hover:bg-white dark:hover:bg-[#1E293B] shadow-sm hover:shadow-xl hover:shadow-[#EFAD1A]/10 border border-slate-200 dark:border-white/5 hover:border-[#EFAD1A]/50 rounded-[1.5rem] transition-all duration-300 group"
                      >
                        <div className="text-base font-bold text-slate-800 dark:text-white group-hover:text-[#EFAD1A] transition-colors mb-1 font-grotesk">GST Registration</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 font-medium group-hover:text-slate-600 dark:group-hover:text-slate-300">Complete registration</div>
                      </button>
                      <button
                        onClick={() => handleQuickAction('Compare workspace plans and find the best deal')}
                        className="text-left p-6 bg-white/60 dark:bg-[#1E293B]/60 backdrop-blur-xl hover:bg-white dark:hover:bg-[#1E293B] shadow-sm hover:shadow-xl hover:shadow-[#EFAD1A]/10 border border-slate-200 dark:border-white/5 hover:border-[#EFAD1A]/50 rounded-[1.5rem] transition-all duration-300 group"
                      >
                        <div className="text-base font-bold text-slate-800 dark:text-white group-hover:text-[#EFAD1A] transition-colors mb-1 font-grotesk">Compare plans</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 font-medium group-hover:text-slate-600 dark:group-hover:text-slate-300">Find the best deal</div>
                      </button>
                      <button
                        onClick={() => handleQuickAction('Check business compliance requirements')}
                        className="text-left p-6 bg-white/60 dark:bg-[#1E293B]/60 backdrop-blur-xl hover:bg-white dark:hover:bg-[#1E293B] shadow-sm hover:shadow-xl hover:shadow-[#EFAD1A]/10 border border-slate-200 dark:border-white/5 hover:border-[#EFAD1A]/50 rounded-[1.5rem] transition-all duration-300 group"
                      >
                        <div className="text-base font-bold text-slate-800 dark:text-white group-hover:text-[#EFAD1A] transition-colors mb-1 font-grotesk">Business compliance</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 font-medium group-hover:text-slate-600 dark:group-hover:text-slate-300">Check requirements</div>
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
                          ? 'bg-gradient-to-br from-[#EDB003] to-[#F59E0B] border-[#EDB003] text-white'
                          : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-[#EDB003]'
                          }`}>
                          {msg.role === 'user' ? <User className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                        </div>

                        {/* Message Bubble */}
                        <div
                          className={`max-w-[85%] sm:max-w-[85%] px-6 py-4 shadow-sm ${msg.role === 'user'
                            ? 'bg-gradient-to-br from-[#EDB003] to-[#f59e0b] text-white rounded-2xl rounded-tr-sm'
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
                            className="opacity-60 hover:opacity-100 transition-opacity duration-200 p-2 h-fit self-start mt-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-[#EDB003]"
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
                        <div className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[#EDB003] shadow-sm flex-shrink-0">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-6 py-4 shadow-sm flex items-center gap-2">
                          <span className="w-2 h-2 bg-[#EDB003] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                          <span className="w-2 h-2 bg-[#EDB003] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                          <span className="w-2 h-2 bg-[#EDB003] rounded-full animate-bounce"></span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Chat Input Floating Card */}
              <div className="p-4 sm:p-6 bg-transparent pt-20 relative z-20">
                <div className="max-w-4xl mx-auto relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#EFAD1A]/20 to-amber-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="relative bg-white dark:bg-[#1E293B] shadow-2xl shadow-slate-200/50 dark:shadow-black/50 rounded-[1.25rem] border border-slate-100 dark:border-white/5 flex items-center p-2 pr-2 gap-2 transition-all group-focus-within:border-[#EFAD1A]/50">
                    <button className="p-3 text-slate-400 dark:text-slate-400 hover:text-[#EFAD1A] hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors">
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
                        : 'text-gray-400 dark:text-gray-300 hover:text-[#EDB003] hover:bg-yellow-50 dark:hover:bg-gray-800'
                        }`}
                      title={isListening ? "Stop listening" : "Start voice input"}
                    >
                      <Mic className={`w-5 h-5 ${isListening ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={handleSendMessage}
                      className="p-3 bg-black dark:bg-white text-white dark:text-black rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
                      disabled={!message.trim() || isLoading}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-[10px] text-center text-gray-400 mt-3 font-medium">
                    FlashSpace AI can make mistakes. Please verify important details.
                  </p>
                </div>
              </div>
            </div>
          </ResizableMapLayout>
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
            <div className="w-16 h-16 bg-yellow-50 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-[#EDB003]">
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
      {/* Auth Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSignupClick={() => {
          setIsLoginOpen(false);
          setIsSignupOpen(true);
        }}
        onLoginSuccess={() => setIsLoginOpen(false)}
      />
      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onLoginClick={() => {
          setIsSignupOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </div>
  );
};

export default StartChatting;