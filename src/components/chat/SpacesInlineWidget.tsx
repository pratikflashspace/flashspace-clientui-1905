import React from 'react';
import { ArrowRight, MapPin, ShoppingCart, Briefcase, CheckCircle2, Sparkles, PhoneCall, LifeBuoy } from 'lucide-react';
import { getSafeImageUrl } from '@/utils/imageUrl';
import { useNavigate } from 'react-router-dom';

interface SpacesInlineWidgetProps {
  spaces: any[];
  onSpaceClick: (space: any) => void;
}

const SpacesInlineWidget: React.FC<SpacesInlineWidgetProps> = ({ spaces, onSpaceClick }) => {
  const navigate = useNavigate();

  if (!spaces || spaces.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 w-full font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>
      {spaces.map((space, index) => {
        const originalTitle = space.title || space.name;
        const firstImage = space.images?.[0] || space.originalData?.images?.[0] || space.image;
        const image = getSafeImageUrl(firstImage, "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80");
        const spaceIdStr = space.spaceId || space.originalData?.spaceId || space.id || space.originalData?.id || '';
        const address = space.address || "Delhi";
        const price = space.price || "Price on request";
        const serviceType = space.serviceType || "Virtual Office";
        const isBusinessSetup = space.serviceType === 'Business Setup' || space.serviceType === 'Business Setup Packages' || originalTitle.toLowerCase().includes('registration');
        
        const displayTitle = (!isBusinessSetup && spaceIdStr) ? spaceIdStr : originalTitle;

        if (space.originalData?.isSalesTeam) {
          return (
            <div 
              key={index}
              onClick={() => window.location.href = 'tel:9888687898'}
              className="flex flex-col bg-[#FEF8CF] dark:bg-[#1a1a1a] rounded-xl border border-[#35503F] dark:border-yellow-400/30 shadow-sm hover:shadow-md hover:border-[#35503F] dark:hover:border-yellow-400 transition-all p-3 gap-3 cursor-pointer"
            >
              {/* Image Section */}
              <div className="w-full h-32 shrink-0 relative">
                <img 
                  src={image} 
                  alt="Premjeet" 
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              {/* Content Section */}
              <div className="flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs font-bold text-[#35503F]">
                    {serviceType}
                  </div>
                </div>
                
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5">
                  Having any query? Premjeet gets you!
                </h3>
                
                <div className="flex items-start gap-1 text-gray-500 dark:text-gray-400 text-xs mb-3">
                  <PhoneCall className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#35503F] dark:text-yellow-400" />
                  <span className="line-clamp-2">Call directly: +91 98886 87898</span>
                </div>

                <div className="mt-auto border-t border-gray-100 dark:border-white/5 pt-3 flex items-center justify-between">
                  <div>
                    <div className="text-base font-bold text-[#35503F] dark:text-white tracking-tight">{price || 'Best Price Guaranteed'}</div>
                  </div>

                  <button 
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#35503F] dark:border-yellow-400 bg-white dark:bg-transparent text-[#35503F] dark:text-yellow-400 hover:bg-[#35503F] hover:text-white dark:hover:bg-yellow-400 dark:hover:text-black transition-colors text-xs font-semibold"
                  >
                    Contact Premjeet
                    <PhoneCall className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        }

        if (space.originalData?.isSupportTeam) {
          return (
            <div 
              key={index}
              className="col-span-1 md:col-span-2 relative overflow-hidden bg-[#eff5f1] dark:bg-[#1a1a1a] rounded-2xl p-5 sm:p-6 shadow-sm border border-[#35503F]/20 dark:border-white/10"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="p-4 bg-[#35503F] dark:bg-yellow-400 rounded-full shrink-0 shadow-md flex items-center justify-center">
                  <LifeBuoy className="w-8 h-8 text-white dark:text-black" />
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-[#35503F] dark:text-white font-extrabold text-xl md:text-2xl tracking-tight mb-2">
                    Need Help? We've got you covered.
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-[15px] leading-relaxed mb-4">
                    For booking related issues, please go to your dashboard and navigate to <strong>My Bookings</strong> to raise a ticket directly. Alternatively, you can create a general request from the <strong>Tickets</strong> tab.
                    <br />
                    <span className="block mt-2 font-medium">Or speak to us directly: <strong className="text-[#35503F] dark:text-yellow-400">+91 98886 87898</strong></span>
                  </p>
                  
                  <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center sm:justify-start">
                    <button 
                      onClick={() => window.location.href = 'tel:9888687898'}
                      className="bg-[#FEF8CF] text-[#35503F] border border-[#35503F]/20 px-6 py-2.5 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <PhoneCall className="w-4 h-4" />
                      Call Support
                    </button>
                    <button 
                      onClick={() => navigate('/dashboard/my-bookings')}
                      className="bg-[#35503F] text-white dark:bg-[#2a3f31] dark:text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      Go to My Bookings
                    </button>
                    <button 
                      onClick={() => navigate('/dashboard/support')}
                      className="bg-white text-[#35503F] dark:bg-[#252525] dark:text-white border border-[#35503F]/20 dark:border-white/20 px-6 py-2.5 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      Open Tickets Tab
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        if (isBusinessSetup) {
          return (
            <div 
              key={index}
              onClick={() => navigate('/services/business-setup')}
              className="group relative overflow-hidden bg-white dark:bg-[#121212] rounded-xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-4 cursor-pointer"
            >
              {/* Decorative background blob */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#35503F]/10 to-transparent dark:from-yellow-400/10 rounded-bl-full -z-0 transition-transform duration-500 group-hover:scale-125" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-[#35503F]/10 dark:bg-yellow-400/10 rounded-lg text-[#35503F] dark:text-yellow-400">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#35503F] dark:text-yellow-400">
                      {serviceType}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10 px-2 py-1 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    <span>Popular</span>
                  </div>
                </div>
                
                <h3 className="text-base sm:text-lg font-extrabold text-gray-900 dark:text-white mb-1.5 leading-snug">
                  {displayTitle}
                </h3>
                
                <div className="flex flex-col gap-1 mb-4 mt-1">
                  <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-[#35503F] dark:text-yellow-400 shrink-0" />
                    <span className="line-clamp-2 leading-relaxed">{address}</span>
                  </div>
                </div>

                <div className="mt-auto border-t border-gray-100 dark:border-white/5 pt-3.5 flex items-center justify-between">
                  <div>
                    <div className="text-[9px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 mb-0.5">Starting At</div>
                    <div className="text-xl font-black text-[#35503F] dark:text-white tracking-tight">{price}</div>
                  </div>

                  <button 
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#35503F] text-white dark:bg-yellow-400 dark:text-black hover:scale-105 hover:shadow-md transition-all duration-200 text-xs font-bold"
                  >
                    Get Started
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div 
            key={index}
            onClick={() => {
              const sId = space.originalData?._id || space.originalData?.id || space.id || spaceIdStr;
              const isVirtual = (serviceType || '').toLowerCase().includes('virtual');
              navigate(isVirtual ? `/space/${sId}` : `/coworking-space/${sId}`);
            }}
            className="flex flex-col bg-white dark:bg-[#1a1a1a] rounded-xl border border-[#35503F] dark:border-yellow-400/30 shadow-sm hover:shadow-md hover:border-[#35503F] dark:hover:border-yellow-400 transition-all p-3 gap-3 cursor-pointer"
          >
            {/* Image Section */}
            <div className="w-full h-32 shrink-0 relative">
              <img 
                src={image} 
                alt={originalTitle} 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* Content Section */}
            <div className="flex flex-col flex-grow">
              <div className="flex items-center justify-between mb-1">
                <div className="text-xs font-bold text-[#35503F]">
                  Option {index + 1}: {serviceType}
                </div>
              </div>
              
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5">
                {displayTitle}
              </h3>
              
              <div className="flex items-start gap-1 text-gray-500 dark:text-gray-400 text-xs mb-3">
                <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#35503F] dark:text-yellow-400" />
                <span className="line-clamp-2">{address}</span>
              </div>

              <div className="mt-auto border-t border-gray-100 dark:border-white/5 pt-3 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400">Starting From</div>
                  <div className="text-base font-bold text-gray-900 dark:text-white">{price}</div>
                </div>

                <button 
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#35503F] dark:border-yellow-400 bg-white dark:bg-transparent text-[#35503F] dark:text-yellow-400 hover:bg-[#35503F] hover:text-white dark:hover:bg-yellow-400 dark:hover:text-black transition-colors text-xs font-semibold"
                >
                  {isBusinessSetup ? 'Buy Now' : 'View Details'}
                  {isBusinessSetup ? <ShoppingCart className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SpacesInlineWidget;
