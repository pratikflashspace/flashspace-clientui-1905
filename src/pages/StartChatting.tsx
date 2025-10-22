import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Mic, Plus, MapPin, Building2, FileText, Briefcase, Users, Menu as MenuIcon, Phone, Mail, User, Sparkles } from 'lucide-react';
import Splash3dButton from '@/components/ui/3d-splash-button';
import { Button } from '@/components/ui/button';

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

const StartChatting = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [contactForm, setContactForm] = useState<ContactForm>({
    name: '',
    phone: '',
    email: ''
  });

  const popularSpaces: PopularSpace[] = [
    { name: 'Connaught Place Hub', location: 'CP, New Delhi', type: 'Heritage', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80&fit=crop&crop=entropy&auto=format' },
    { name: 'Nehru Place Tech', location: 'Nehru Place, Delhi', type: 'Tech Hub', image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&q=80&fit=crop&crop=entropy&auto=format' },
    { name: 'Saket Business', location: 'Saket, New Delhi', type: 'Corporate', image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&q=80&fit=crop&crop=entropy&auto=format' },
    { name: 'Dwarka Workspace', location: 'Dwarka, Delhi', type: 'Premium', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80&fit=crop&crop=entropy&auto=format' }
  ];

  const complianceServices: string[] = [
    'GST Registration',
    'Company Formation',
    'FSSAI License',
    'Trade License',
    'Professional Tax',
    'Labour License'
  ];

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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Menu Icon */}
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MenuIcon className="w-5 h-5 text-gray-700" />
            </button>
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

      <div className="flex-1 pt-16 flex">
        <div className="flex w-full h-[calc(100vh-4rem)]">

          {/* Left Panel - Chat Interface - 60% */}
          <div className="w-[60%] flex flex-col bg-white border-r border-gray-200">
            {/* Chat Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <img
                  src="https://res.cloudinary.com/diwna43hl/image/upload/v1759650866/FlashSpace_Favicon_sv6yhh.png"
                  alt="FlashSpace"
                  className="w-10 h-10"
                />
                <h1 className="text-base font-bold text-gray-900">New Chat</h1>
              </div>
              <Sparkles className="w-5 h-5 text-[#EDB003]" />
            </div>

            {/* Chat Content - Empty State */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-[#EDB003] rounded-xl flex items-center justify-center shadow-sm">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Need WorkSpace / Business Setup?
              </h2>
              <p className="text-gray-600 text-sm mb-6 max-w-lg leading-relaxed">
                Hey! I'm here to assist you with end-to-end workspace and compliance requirements. Let's get started!
              </p>

              {/* Large Prompt Suggestions */}
              <div className="w-full max-w-2xl grid grid-cols-2 gap-3 mb-6">
                <button className="p-4 bg-gray-50 border border-gray-200 hover:border-[#EDB003] hover:bg-[#EDB003] hover:text-white rounded-lg text-left transition-all group">
                  <div className="text-sm font-semibold text-gray-900 group-hover:text-white">Find coworking spaces</div>
                  <div className="text-xs text-gray-500 group-hover:text-white/90 mt-1">in Delhi NCR region</div>
                </button>
                <button className="p-4 bg-gray-50 border border-gray-200 hover:border-[#EDB003] hover:bg-[#EDB003] hover:text-white rounded-lg text-left transition-all group">
                  <div className="text-sm font-semibold text-gray-900 group-hover:text-white">GST Registration</div>
                  <div className="text-xs text-gray-500 group-hover:text-white/90 mt-1">Complete registration process</div>
                </button>
                <button className="p-4 bg-gray-50 border border-gray-200 hover:border-[#EDB003] hover:bg-[#EDB003] hover:text-white rounded-lg text-left transition-all group">
                  <div className="text-sm font-semibold text-gray-900 group-hover:text-white">Compare workspace plans</div>
                  <div className="text-xs text-gray-500 group-hover:text-white/90 mt-1">Find the best deal</div>
                </button>
                <button className="p-4 bg-gray-50 border border-gray-200 hover:border-[#EDB003] hover:bg-[#EDB003] hover:text-white rounded-lg text-left transition-all group">
                  <div className="text-sm font-semibold text-gray-900 group-hover:text-white">Business compliance</div>
                  <div className="text-xs text-gray-500 group-hover:text-white/90 mt-1">Check requirements</div>
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

          {/* Right Panel - Sidebar - 40% */}
          <div className="w-[40%] bg-gray-50 overflow-y-auto p-4 flex flex-col justify-center">
            <div className="space-y-4">
              {/* Popular Spaces Section */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-gray-900">Popular Spaces in Delhi</h3>
                  <MapPin className="w-5 h-5 text-[#EDB003]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {popularSpaces.map((space, index) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 hover:border-[#EDB003] rounded-lg overflow-hidden cursor-pointer transition-all group hover:shadow-lg"
                    >
                      <div className="h-28 relative overflow-hidden bg-gray-100">
                        {space.image && (
                          <img
                            src={space.image}
                            alt={space.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-2 left-2 right-2">
                          <div className="text-xs font-bold text-white drop-shadow-lg line-clamp-1">{space.name}</div>
                        </div>
                      </div>
                      <div className="p-2">
                        <div className="text-[10px] text-gray-600 line-clamp-1 flex items-center gap-1 mb-1.5">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          {space.location}
                        </div>
                        <span className="inline-block text-[9px] px-2 py-0.5 bg-[#EDB003]/10 text-[#EDB003] rounded font-medium">
                          {space.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compliance Services */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 mb-3">Compliance Needs For You</h3>
                <div className="grid grid-cols-3 gap-2.5">
                  {complianceServices.map((service, index) => (
                    <div
                      key={index}
                      className="p-3 text-center bg-gray-50 hover:bg-[#EDB003] hover:text-white border border-gray-200 hover:border-[#EDB003] rounded-lg cursor-pointer transition-all group"
                    >
                      <div className="mb-1.5">
                        <FileText className="w-5 h-5 mx-auto text-[#EDB003] group-hover:text-white transition-colors" />
                      </div>
                      <div className="text-[10px] font-semibold leading-tight">
                        {service}
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
