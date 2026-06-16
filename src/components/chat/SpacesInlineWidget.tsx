import React from 'react';
import { ArrowRight, MapPin, ShoppingCart } from 'lucide-react';
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
    <div className="flex flex-col gap-4 mt-4 w-full max-w-[500px]">
      {spaces.map((space, index) => {
        const title = space.title || space.name;
        const image = getSafeImageUrl(space.image, "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80");
        const address = space.address || "Delhi";
        const price = space.price || "Price on request";
        const serviceType = space.serviceType || "Virtual Office";
        const isBusinessSetup = space.serviceType === 'Business Setup' || space.serviceType === 'Business Setup Packages' || title.toLowerCase().includes('registration');

        return (
          <div 
            key={index}
            className="flex flex-col sm:flex-row bg-white dark:bg-[#1a1a1a] rounded-2xl border border-[#35503F] dark:border-yellow-400/30 shadow-sm hover:shadow-md hover:border-[#35503F] dark:hover:border-yellow-400 transition-all p-4 gap-4"
          >
            {/* Image Section - Hidden for Business Setup */}
            {!isBusinessSetup && (
              <div className="sm:w-36 h-36 sm:h-auto shrink-0 relative">
                <img 
                  src={image} 
                  alt={title} 
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            )}

            {/* Content Section */}
            <div className="flex flex-col flex-grow">
              <div className="text-sm font-bold text-[#35503F] mb-1">
                Option {index + 1}: {serviceType}
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {title}
              </h3>
              
              <div className="flex items-start gap-1 text-gray-500 dark:text-gray-400 text-sm mb-4">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-[#35503F] dark:text-yellow-400" />
                <span>{address}</span>
              </div>

              <div className="mt-auto border-t border-gray-100 dark:border-white/5 pt-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Starting From</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{price}</div>
                </div>

                <button 
                  onClick={() => {
                    if (isBusinessSetup) {
                      navigate('/services/business-setup');
                    } else {
                      onSpaceClick(space);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#35503F] dark:border-yellow-400 bg-white dark:bg-transparent text-[#35503F] dark:text-yellow-400 hover:bg-[#35503F] hover:text-white dark:hover:bg-yellow-400 dark:hover:text-black transition-colors text-sm font-semibold"
                >
                  {isBusinessSetup ? 'Buy Now' : 'View Details'}
                  {isBusinessSetup ? <ShoppingCart className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
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
