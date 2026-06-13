import React from 'react';
import { X, MapPin } from 'lucide-react';
import { getSafeImageUrl } from '@/utils/imageUrl';

interface SpaceDetailsModalProps {
  space: any;
  isOpen: boolean;
  onClose: () => void;
  onScheduleVisit: () => void;
}

const SpaceDetailsModal: React.FC<SpaceDetailsModalProps> = ({ space, isOpen, onClose, onScheduleVisit }) => {
  if (!isOpen || !space) return null;

  const originalData = space.originalData || {};
  const images = originalData.images && originalData.images.length > 0 ? originalData.images : [
    space.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=400&q=80",
  ];
  
  const mainImage = getSafeImageUrl(images[0]);
  const subImage1 = getSafeImageUrl(images[1] || images[0]);
  const subImage2 = getSafeImageUrl(images[2] || images[0]);

  const title = space.title || space.name;
  const address = space.address;
  const features = space.features || [];

  const timings = originalData.timings || "Monday to Saturday: 9:00 AM - 7:00 PM";
  const timingsSubtext = originalData.timingsSubtext || "Closed on Sundays";
  const connectivity = originalData.connectivity || "Excellent public transport connectivity nearby";
  const nearestStation = originalData.nearestStation || originalData.metroStation;
  const connectivitySubtext = nearestStation ? `${nearestStation} Metro Station nearby` : "Easily accessible via Metro and Road";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col relative z-10 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-100 dark:border-white/10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Space Details</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-6 flex flex-col md:flex-row gap-8">
          
          {/* Images Section (Left) */}
          <div className="w-full md:w-5/12 flex flex-col gap-3">
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
              <img src={mainImage} alt={title} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-2 gap-3 h-32 sm:h-40">
              <div className="rounded-2xl overflow-hidden bg-gray-100">
                <img src={subImage1} alt="Detail 1" className="w-full h-full object-cover" />
              </div>
              <div className="rounded-2xl overflow-hidden bg-gray-100">
                <img src={subImage2} alt="Detail 2" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Details Section (Right) */}
          <div className="w-full md:w-7/12 flex flex-col">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{address}</p>

            <div className="space-y-6">
              
              {/* Timings */}
              <div className="border-b border-gray-100 dark:border-white/10 pb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Timings</h3>
                <p className="text-gray-700 dark:text-gray-300">{timings}</p>
                <p className="text-[#35503F] dark:text-yellow-400 mt-1 font-medium">{timingsSubtext}</p>
              </div>

              {/* Connectivity */}
              <div className="border-b border-gray-100 dark:border-white/10 pb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Connectivity</h3>
                <p className="text-gray-700 dark:text-gray-300">{connectivity}</p>
                <p className="text-[#35503F] dark:text-yellow-400 mt-1 font-medium">{connectivitySubtext}</p>
              </div>

              {/* Pricing Boxes */}
              <div className="border-b border-gray-100 dark:border-white/10 pb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Pricing</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {space.serviceType === 'Coworking Space' ? (
                    <>
                      <div className="border border-gray-200 dark:border-white/20 rounded-xl p-3 flex flex-col justify-center items-center text-center hover:border-[#35503F] dark:hover:border-yellow-400 transition-colors">
                        <span className="text-[#35503F] dark:text-yellow-400 font-bold mb-1 text-sm">Dedicated Desk</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Starting from: {originalData.dedicatedDeskPrice || space.price || "Contact Us"}</span>
                      </div>
                      <div className="border border-gray-200 dark:border-white/20 rounded-xl p-3 flex flex-col justify-center items-center text-center hover:border-[#35503F] dark:hover:border-yellow-400 transition-colors">
                        <span className="text-[#35503F] dark:text-yellow-400 font-bold mb-1 text-sm">Hot Desk</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Starting from: {originalData.hotDeskPrice || space.price || "Contact Us"}</span>
                      </div>
                      <div className="border border-gray-200 dark:border-white/20 rounded-xl p-3 flex flex-col justify-center items-center text-center hover:border-[#35503F] dark:hover:border-yellow-400 transition-colors">
                        <span className="text-[#35503F] dark:text-yellow-400 font-bold mb-1 text-sm">Private Cabin</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Starting from: {originalData.privateCabinPrice || space.price || "Contact Us"}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="border border-gray-200 dark:border-white/20 rounded-xl p-3 flex flex-col justify-center items-center text-center hover:border-[#35503F] dark:hover:border-yellow-400 transition-colors">
                        <span className="text-[#35503F] dark:text-yellow-400 font-bold mb-1 text-sm">Business Registration</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Starting from: {originalData.brPlanPriceYearly || space.price || "₹11000"}/Year</span>
                      </div>
                      <div className="border border-gray-200 dark:border-white/20 rounded-xl p-3 flex flex-col justify-center items-center text-center hover:border-[#35503F] dark:hover:border-yellow-400 transition-colors">
                        <span className="text-[#35503F] dark:text-yellow-400 font-bold mb-1 text-sm">Gst Registration</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Starting from: {originalData.gstPlanPriceYearly || space.price || "₹11000"}/Year</span>
                      </div>
                      <div className="border border-gray-200 dark:border-white/20 rounded-xl p-3 flex flex-col justify-center items-center text-center hover:border-[#35503F] dark:hover:border-yellow-400 transition-colors">
                        <span className="text-[#35503F] dark:text-yellow-400 font-bold mb-1 text-sm">Mailing Address</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Starting from: {originalData.mailingPlanPriceYearly || space.price || "₹11000"}/Year</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Amenities */}
              <div className="pb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {features.map((feature: string, idx: number) => (
                    <div 
                      key={idx}
                      className="px-4 py-2 rounded-full border border-gray-200 dark:border-white/20 text-sm text-gray-800 dark:text-gray-200 font-medium"
                    >
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Call to action */}
              <div className="pt-4 pb-6 mb-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <h3 className="font-bold text-gray-900 dark:text-white">Ready to schedule a visit or need more details?</h3>
                  <button 
                    onClick={() => {
                      if (originalData && originalData._id) {
                         window.location.href = `/space/${originalData._id}`;
                      } else {
                         onScheduleVisit();
                      }
                    }}
                    className="w-full sm:w-auto whitespace-nowrap bg-[#35503F] dark:bg-yellow-400 text-white dark:text-black font-bold py-3 px-8 rounded-xl shadow-lg shadow-[#35503F]/20 dark:shadow-yellow-400/20 hover:-translate-y-0.5 transition-transform"
                  >
                    Book Space
                  </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceDetailsModal;
