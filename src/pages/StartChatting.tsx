import { useState } from 'react';
import { Send, Mic, Plus, MapPin, Building2, FileText, Briefcase, Users, Menu, Phone, Mail, User } from 'lucide-react';

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
}

interface ContactForm {
  name: string;
  phone: string;
  email: string;
}

const StartChatting = () => {
  const [message, setMessage] = useState('');
  const [contactForm, setContactForm] = useState<ContactForm>({
    name: '',
    phone: '',
    email: ''
  });

  const popularSpaces: PopularSpace[] = [
    { name: 'BKC Premium Hub', location: 'Bandra Kurla Complex', type: 'Premium' },
    { name: 'Connaught Place', location: 'CP, New Delhi', type: 'Heritage' },
    { name: 'Electronic City', location: 'Bangalore', type: 'Tech Hub' },
    { name: 'Koramangala', location: 'Bangalore', type: 'Startup' },
    { name: 'Gurgaon Central', location: 'Gurugram', type: 'Corporate' },
    { name: 'Lower Parel', location: 'Mumbai', type: 'Business' }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-b-2 border-yellow-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-yellow-100 rounded-lg transition-colors lg:hidden">
              <Menu className="w-6 h-6 text-gray-900" />
            </button>
            <img
              src="https://cdn.prod.website-files.com/664330484432dcdd6519a8fd/665dd8e0007de68a44f3750b_Black%20and%20White%20Bold%20Typography%20Clothing%20Brand%20Logo%20(940%20x%20400%20px)%20(940%20x%20200%20px)%20(940%20x%20150%20px).png"
              alt="FlashSpace Logo"
              className="h-8 w-auto"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="hidden sm:block px-4 py-2 text-sm font-semibold text-gray-900 hover:text-yellow-600 transition-colors">
              Explore
            </button>
            <button className="px-5 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-full text-sm font-bold hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-md">
              Sign In
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 mt-16 sm:mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 min-h-[calc(100vh-7rem)]">

          {/* Left Panel - Chat Interface (3 columns) */}
          <div className="lg:col-span-3 flex flex-col bg-white rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-yellow-200 overflow-hidden">
            {/* Chat Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b-2 border-yellow-100 bg-gradient-to-r from-yellow-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">FS</span>
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900" style={{ fontFamily: 'Josefin Sans' }}>New Chat</h1>
              </div>
              <Menu className="w-5 h-5 text-gray-700" />
            </div>

            {/* Chat Content - Empty State */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 text-center bg-gradient-to-b from-white via-yellow-50/30 to-white relative overflow-hidden">
              {/* Animated Background Elements */}
              <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-200/20 rounded-full blur-3xl animate-pulse-slow"></div>
              <div className="absolute bottom-10 left-10 w-40 h-40 bg-yellow-300/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

              <div className="relative mb-6 sm:mb-8">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-xl animate-bounce" style={{ animationDuration: '3s' }}>
                  <Building2 className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Josefin Sans' }}>
                Need WorkSpace / Business Setup?
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mb-6 sm:mb-8 max-w-lg leading-relaxed px-4">
                Hey! I'm here to assist you with end-to-end workspace and compliance requirements
              </p>

              {/* Large Prompt Suggestions */}
              <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <button className="p-4 bg-white border-2 border-yellow-200 rounded-2xl text-left hover:border-yellow-400 hover:shadow-xl transition-all group hover:scale-105">
                  <div className="text-sm font-semibold text-gray-900 group-hover:text-yellow-600">Find coworking spaces</div>
                  <div className="text-xs text-gray-500 mt-1">in Delhi NCR region</div>
                </button>
                <button className="p-4 bg-yellow-50 border-2 border-yellow-300 rounded-2xl text-left hover:border-yellow-500 hover:shadow-xl transition-all group hover:scale-105">
                  <div className="text-sm font-semibold text-gray-900 group-hover:text-yellow-700">GST Registration</div>
                  <div className="text-xs text-gray-500 mt-1">Complete registration process</div>
                </button>
                <button className="p-4 bg-yellow-50 border-2 border-yellow-300 rounded-2xl text-left hover:border-yellow-500 hover:shadow-xl transition-all group hover:scale-105">
                  <div className="text-sm font-semibold text-gray-900 group-hover:text-yellow-700">Compare workspace plans</div>
                  <div className="text-xs text-gray-500 mt-1">Find the best deal</div>
                </button>
                <button className="p-4 bg-white border-2 border-yellow-200 rounded-2xl text-left hover:border-yellow-400 hover:shadow-xl transition-all group hover:scale-105">
                  <div className="text-sm font-semibold text-gray-900 group-hover:text-yellow-600">Business compliance</div>
                  <div className="text-xs text-gray-500 mt-1">Check requirements</div>
                </button>
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-4 sm:p-6 border-t-2 border-yellow-100 bg-white">
              <div className="relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask anything..."
                  className="w-full px-12 sm:px-16 py-3 sm:py-4 bg-white border-2 border-yellow-300 rounded-full outline-none text-gray-900 placeholder-gray-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <button className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 p-2 hover:bg-yellow-100 rounded-full transition-colors">
                  <Plus className="w-5 h-5 text-gray-600" />
                </button>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                  <button className="hidden sm:block p-2 hover:bg-yellow-100 rounded-full transition-colors">
                    <Mic className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    className="p-2 sm:p-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 rounded-full transition-all shadow-md"
                  >
                    <Send className="w-4 h-4 text-gray-900" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-400 text-center mt-3">
                FlashSpace can make mistakes. Check important info.
              </p>
            </div>
          </div>

          {/* Right Panel - Bento Grid (2 columns) */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5 overflow-y-auto max-h-[calc(100vh-7rem)] pr-2 scrollbar-thin scrollbar-thumb-yellow-300 scrollbar-track-yellow-50">

            {/* Popular Spaces Section */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border-2 border-yellow-200 hover:border-yellow-400 transition-all">
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <h3 className="text-base sm:text-lg font-bold text-gray-900" style={{ fontFamily: 'Josefin Sans' }}>Popular Spaces in Delhi</h3>
                <div className="flex items-center gap-1.5 text-yellow-600 cursor-pointer hover:text-yellow-700">
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs font-semibold hidden sm:inline">View Map</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {popularSpaces.map((space, index) => (
                  <div
                    key={index}
                    className={`relative border-2 ${index % 2 === 0 ? 'border-yellow-300 bg-yellow-50' : 'border-yellow-200 bg-white'} rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:border-yellow-500 cursor-pointer transition-all hover:shadow-xl hover:scale-105 group overflow-hidden`}
                  >
                    <div className="absolute -top-10 -right-10 w-20 h-20 bg-yellow-200/20 rounded-full blur-2xl group-hover:bg-yellow-300/30 transition-colors"></div>
                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                      <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 group-hover:text-yellow-600 transition-colors" />
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-gray-900 mb-1 sm:mb-1.5 pr-6 sm:pr-8">{space.name}</div>
                    <div className="text-xs text-gray-600 mb-2">{space.location}</div>
                    <div className="inline-block px-2 sm:px-2.5 py-0.5 sm:py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs font-semibold">
                      {space.type}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance Services */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border-2 border-yellow-200 hover:border-yellow-400 transition-all">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-5" style={{ fontFamily: 'Josefin Sans' }}>Compliance Needs For You</h3>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {complianceServices.map((service, index) => (
                  <div
                    key={index}
                    className={`${index % 2 === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' : 'bg-white'} border-2 ${index % 2 === 0 ? 'border-yellow-500' : 'border-yellow-300'} rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:scale-105 cursor-pointer transition-all hover:shadow-xl group`}
                  >
                    <div className={`text-xs sm:text-sm font-bold ${index % 2 === 0 ? 'text-gray-900' : 'text-gray-900 group-hover:text-yellow-700'} text-center transition-colors`}>
                      {service}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Get in Touch */}
            <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border-2 border-yellow-500 relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

              <div className="relative">
                <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-5 text-gray-900" style={{ fontFamily: 'Josefin Sans' }}>Get in Touch with a Consultant!</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 sm:p-4 bg-white/90 backdrop-blur-sm border-2 border-yellow-300 rounded-xl sm:rounded-2xl shadow-md">
                    <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-yellow-600" />
                    </div>
                    <span className="text-xs sm:text-sm text-gray-800 font-semibold">Connect with our experts</span>
                  </div>

                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 bg-white border-2 border-yellow-300 rounded-xl sm:rounded-2xl text-sm text-gray-900 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/50 placeholder-gray-400 transition-all shadow-md"
                    />
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 bg-white border-2 border-yellow-300 rounded-xl sm:rounded-2xl text-sm text-gray-900 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/50 placeholder-gray-400 transition-all shadow-md"
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 bg-white border-2 border-yellow-300 rounded-xl sm:rounded-2xl text-sm text-gray-900 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/50 placeholder-gray-400 transition-all shadow-md"
                    />
                  </div>

                  <button
                    onClick={handleContactSubmit}
                    className="w-full bg-gray-900 text-white py-3 rounded-xl sm:rounded-2xl text-sm font-bold hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                  >
                    Submit Request
                  </button>
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
