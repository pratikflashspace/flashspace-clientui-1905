import React from 'react';
import { ArrowRight, MapPin, ShoppingCart, Briefcase, CheckCircle2, Sparkles, PhoneCall } from 'lucide-react';
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
              className="col-span-1 md:col-span-2 bg-[#fbfdfa] dark:bg-[#121212] rounded-2xl border border-[#e5ebe7] dark:border-white/10 p-5 shadow-sm"
            >
              <h3 className="text-[#1a2b21] dark:text-white font-bold text-lg md:text-xl mb-4">
                Get the best workspace deal with {space.title.replace('Talk to ', '')}
              </h3>
              
              <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center mb-5">
                <div className="flex gap-4 items-center flex-1">
                  <img 
                    src={image} 
                    alt={space.title} 
                    className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <h4 className="text-[#1a2b21] dark:text-white font-bold text-lg">{space.title.replace('Talk to ', '')}</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-1.5">+91 81008 88777</p>
                    <div className="flex items-center gap-1.5 bg-[#eff5f1] dark:bg-[#35503F]/30 text-[#2d4739] dark:text-yellow-400 px-2.5 py-1 rounded-full w-fit">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="text-[10px] md:text-xs font-semibold">FlashSpace Consultant</span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => window.location.href = 'tel:8100888777'}
                  className="w-full sm:w-auto bg-[#35503F] text-white dark:bg-yellow-400 dark:text-black px-6 py-2.5 rounded-lg font-bold text-sm hover:scale-[1.02] transition-transform shadow-md shrink-0 flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  Contact {space.title.replace('Talk to ', '')}
                </button>
              </div>

              <div className="pt-4 border-t border-[#e5ebe7] dark:border-white/10">
                <p className="text-[#1a2b21] dark:text-white font-bold text-sm mb-3">
                  {space.title.replace('Talk to ', '')} will help you with:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-4">
                  {[
                    "Compare Workspaces", 
                    "Expert Price Negotiation", 
                    "Seamless GST Setup", 
                    "Tailored Documentation"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-[#35503F] dark:text-yellow-400 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
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
