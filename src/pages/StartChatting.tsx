import { useState, useEffect, useRef } from 'react';
import { getLenis } from '@/lib/lenis.ts';
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
import MapSection, { MapMarker } from '@/components/services/MapSection';
import ResizableMapLayout from '@/components/services/ResizableMapLayout';
import { getVirtualOfficesByCity } from '@/services/virtualOffice.service';
import { getCoworkingSpacesByCity } from '@/services/coworkingSpace.service';
import { cityCenters } from '@/components/Map/locationData.example';
import { LoginModal } from '@/components/auth/LoginModal'; // [NEW]
import { SignupModal } from '@/components/auth/SignupModal'; // [NEW]

// [NEW] Custom Text Formatter to handle bold text
const formatMessage = (text: string) => {
  if (!text) return null;
  // Split by bold markers
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
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
    <div className="text-[16px] leading-[1.8] tracking-[-0.01em] whitespace-pre-wrap font-medium text-gray-800 font-sans">
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

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

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
              onClick={() => setIsLoginOpen(true)}
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
        className={`fixed top-0 left-0 h-screen w-20 bg-white border-r border-gray-200 shadow-sm z-[60] flex flex-col overflow-hidden lg:translate-x-0 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
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
        <div className="border-t border-gray-100 p-4 flex-shrink-0 space-y-3">
          {/* Profile Button */}
          <button
            onClick={() => handleNavigation('/about')}
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
      <div className="flex-1 lg:ml-20 pt-16 flex flex-col lg:flex-row shadow-2xl z-40 relative">
        <div className="w-full h-[calc(100vh-4rem)] bg-white overflow-hidden">
          <ResizableMapLayout
            defaultListingWidth={65}
            mapContent={
              /* Right Panel - Sidebar - Scrollable Vertically */
              <div
                className={`w-full h-full bg-gray-50 flex flex-col relative transition-all duration-300 ${showMap ? 'overflow-hidden' : 'overflow-y-auto overflow-x-hidden p-6 scrollbar-yellow'
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
                    className="w-full h-full relative flex flex-col bg-white"
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
                        className="bg-white/90 backdrop-blur-md text-gray-800 px-3 py-2 rounded-lg shadow-sm hover:shadow-md border border-gray-200 text-sm font-medium flex items-center gap-2 transition-all"
                      >
                        <ArrowRight className="w-4 h-4 rotate-180" />
                        <span>Back</span>
                      </button>
                      <div className="bg-white/90 backdrop-blur-md px-3 py-2 rounded-lg shadow-sm border border-gray-200 text-sm font-semibold text-gray-900">
                        {mapTitle}
                      </div>
                    </div>
                    <div className="flex-1 w-full h-full">
                      {isMapLoading ? (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50">
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
                )}
              </div>
            }
          >
            {/* Left Panel - Chat Interface - 60-65% - Scrollable Chat Area */}
            <div className="w-full h-full flex flex-col bg-[#EDB003]/5 relative border-r border-gray-200/50">

              {/* Background Pattern */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.2]" style={{
                backgroundImage: `radial-gradient(#EDB003 1px, transparent 1px)`,
                backgroundSize: '24px 24px'
              }}></div>

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
                  <div className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto">
                    <div className="relative mb-8 group">
                      <div className="absolte inset-0 bg-[#EDB003]/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                      <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/10 border border-white/50 backdrop-blur-sm relative z-10 rotate-3 group-hover:rotate-6 transition-transform duration-300">
                        <Building2 className="w-10 h-10 text-[#EDB003]" />
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                      How can we help your business?
                    </h2>
                    <p className="text-gray-500 mb-10 max-w-md text-base leading-relaxed">
                      Ask about coworking spaces, virtual offices, compliance, or compare plans instantly.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full px-4">
                      {/* Suggestions buttons */}
                      <button
                        onClick={() => handleQuickAction('Find coworking spaces in Delhi NCR region')}
                        className="text-left p-4 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-lg hover:shadow-yellow-500/5 border border-gray-100 hover:border-[#EDB003]/30 rounded-2xl transition-all duration-300 group"
                      >
                        <div className="text-sm font-bold text-gray-800 group-hover:text-[#EDB003] transition-colors mb-1">Find coworking spaces</div>
                        <div className="text-xs text-gray-500 font-medium">in Delhi NCR region</div>
                      </button>
                      <button
                        onClick={() => handleQuickAction('Help me with GST Registration complete registration process')}
                        className="text-left p-4 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-lg hover:shadow-yellow-500/5 border border-gray-100 hover:border-[#EDB003]/30 rounded-2xl transition-all duration-300 group"
                      >
                        <div className="text-sm font-bold text-gray-800 group-hover:text-[#EDB003] transition-colors mb-1">GST Registration</div>
                        <div className="text-xs text-gray-500 font-medium">Complete registration</div>
                      </button>
                      <button
                        onClick={() => handleQuickAction('Compare workspace plans and find the best deal')}
                        className="text-left p-4 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-lg hover:shadow-yellow-500/5 border border-gray-100 hover:border-[#EDB003]/30 rounded-2xl transition-all duration-300 group"
                      >
                        <div className="text-sm font-bold text-gray-800 group-hover:text-[#EDB003] transition-colors mb-1">Compare plans</div>
                        <div className="text-xs text-gray-500 font-medium">Find the best deal</div>
                      </button>
                      <button
                        onClick={() => handleQuickAction('Check business compliance requirements')}
                        className="text-left p-4 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-lg hover:shadow-yellow-500/5 border border-gray-100 hover:border-[#EDB003]/30 rounded-2xl transition-all duration-300 group"
                      >
                        <div className="text-sm font-bold text-gray-800 group-hover:text-[#EDB003] transition-colors mb-1">Business compliance</div>
                        <div className="text-xs text-gray-500 font-medium">Check requirements</div>
                      </button>
                    </div>
                  </div>
                ) : (
                  // Chat Messages
                  <div className="space-y-6 max-w-5xl mx-auto pb-4 w-full">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        {/* Avatar */}
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border ${msg.role === 'user'
                          ? 'bg-gradient-to-br from-[#EDB003] to-[#F59E0B] border-[#EDB003] text-white'
                          : 'bg-white border-gray-100 text-[#EDB003]'
                          }`}>
                          {msg.role === 'user' ? <User className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                        </div>

                        {/* Message Bubble */}
                        <div
                          className={`max-w-[85%] sm:max-w-[85%] px-6 py-4 shadow-sm ${msg.role === 'user'
                            ? 'bg-gradient-to-br from-[#EDB003] to-[#f59e0b] text-white rounded-2xl rounded-tr-sm'
                            : 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm'
                            }`}
                        >
                          {msg.role === 'assistant' && msg.isTyping ? (
                            <TypewriterEffect
                              text={msg.content}
                              onComplete={() => handleTypingComplete(msg.id)}
                            />
                          ) : (
                            <div className={`text-[16px] leading-[1.8] tracking-[-0.01em] whitespace-pre-wrap font-medium font-sans ${msg.role === 'user' ? 'text-white' : 'text-gray-800'
                              }`}>
                              {formatMessage(msg.content)}
                            </div>
                          )}
                          <p className={`text-[10px] mt-2 font-medium tracking-wide opacity-80 ${msg.role === 'user' ? 'text-white' : 'text-gray-400'
                            }`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
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
              <div className="p-4 sm:p-6 bg-gradient-to-t from-white via-white to-white/0 pt-20 relative z-20">
                <div className="max-w-5xl mx-auto relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#EDB003]/20 to-orange-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="relative bg-white shadow-xl shadow-gray-200/50 rounded-2xl border border-gray-100 flex items-center p-2 pr-2 gap-2 transition-all group-focus-within:border-[#EDB003]/50 group-focus-within:shadow-[#EDB003]/10">
                    <button className="p-3 text-gray-400 hover:text-[#EDB003] hover:bg-yellow-50 rounded-xl transition-colors">
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
                      className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 text-[16px] font-medium h-full py-2 min-w-0"
                    />
                    <button
                      onClick={toggleVoiceInput}
                      className={`p-3 rounded-xl transition-all hidden sm:block ${isListening
                        ? 'text-red-500 bg-red-50 hover:bg-red-100 animate-pulse'
                        : 'text-gray-400 hover:text-[#EDB003] hover:bg-yellow-50'
                        }`}
                      title={isListening ? "Stop listening" : "Start voice input"}
                    >
                      <Mic className={`w-5 h-5 ${isListening ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={handleSendMessage}
                      className="p-3 bg-[#EDB003] hover:bg-[#d99f03] text-white rounded-xl shadow-md shadow-yellow-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
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
      {/* Auth Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSignupClick={() => {
          setIsLoginOpen(false);
          setIsSignupOpen(true);
        }}
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