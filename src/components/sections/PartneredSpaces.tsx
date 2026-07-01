import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { getVirtualOfficesByCity } from '@/services/virtualOffice.service';
import { VirtualOfficeItem } from '@/types/services';

const panIndiaCities = [
  {
    id: 1,
    title: "Ahmedabad",
    price: "749",
    image: "/to_cloudinary/sardar-patel-statue-2.webp",
  },
  {
    id: 2,
    title: "Bangalore",
    price: "1117",
    image: "/to_cloudinary/bangalore_city_1782458444683.png",
  },
  {
    id: 3,
    title: "Chennai",
    price: "1000",
    image: "/to_cloudinary/chennai_city_1782458457106.png",
  },
  {
    id: 4,
    title: "Delhi",
    price: "1025",
    image: "/to_cloudinary/delhi_city_1782458486025.png",
  },
  {
    id: 5,
    title: "Mumbai",
    price: "1500",
    image: "/to_cloudinary/mumbai_city_1782458467763.png",
  },
  {
    id: 6,
    title: "Pune",
    price: "1000",
    image: "/to_cloudinary/pune_city_1782458497049.png",
  }
];

export const PartneredSpaces = () => {
  const [activeTab, setActiveTab] = useState<'delhi' | 'panIndia'>('delhi');
  const sliderRef = useRef<HTMLDivElement>(null);
  const [delhiSpaces, setDelhiSpaces] = useState<VirtualOfficeItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    setTimeout(checkScroll, 100);
  }, [activeTab]);

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  useEffect(() => {
    const fetchDelhiSpaces = async () => {
      try {
        setLoading(true);
        // Fetch up to 4 virtual offices in Delhi from DB
        const res = await getVirtualOfficesByCity('Delhi', 1, 4);
        if (res && res.offices) {
          setDelhiSpaces(res.offices);
        }
      } catch (error) {
        console.error("Failed to fetch Delhi spaces:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDelhiSpaces();
  }, []);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -320, behavior: 'smooth' });
      setTimeout(checkScroll, 300);
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 320, behavior: 'smooth' });
      setTimeout(checkScroll, 300);
    }
  };

  // Helper to format price for display (convert from yearly to monthly estimate if needed)
  const getMonthlyPrice = (space: VirtualOfficeItem) => {
    if (space.finalGstPricePerYear) return Math.round(space.finalGstPricePerYear / 12).toLocaleString();
    if (space.gstPlanPricePerYear) return Math.round(space.gstPlanPricePerYear / 12).toLocaleString();
    if (space.price) return space.price;
    if (space.gstPlanPrice) return space.gstPlanPrice;
    return "999";
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden border-b border-[#D4E0D0]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[32px] font-bold text-gray-900 mb-4 tracking-tight leading-tight"
          >
            Choose from 100+ partnered spaces from 20+ cities
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 text-base sm:text-lg max-w-3xl"
          >
            Select a Virtual Office that best represents your business from our pan-India partner spaces.
          </motion.p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 mb-10 border border-gray-200 w-max rounded-lg overflow-hidden bg-white">
          <button
            onClick={() => setActiveTab('delhi')}
            className={`px-6 py-3 text-sm font-semibold transition-all ${
              activeTab === 'delhi' 
                ? 'text-[#36503F] border-b-2 border-[#36503F] bg-gray-50' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-b-2 border-transparent'
            }`}
          >
            Popular in Delhi
          </button>
          <button
            onClick={() => setActiveTab('panIndia')}
            className={`px-6 py-3 text-sm font-semibold transition-all ${
              activeTab === 'panIndia' 
                ? 'text-[#36503F] border-b-2 border-[#36503F] bg-gray-50' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-b-2 border-transparent'
            }`}
          >
            Pan-India Options
          </button>
        </div>

        {/* Content Area */}
        {activeTab === 'delhi' ? (
          loading ? (
            <div className="flex gap-6 overflow-hidden pb-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-100 rounded-xl h-80 w-[280px] sm:w-[300px] shrink-0 animate-pulse border border-gray-200"></div>
              ))}
            </div>
          ) : delhiSpaces.length > 0 ? (
            <div className="relative group/slider flex items-center">
              {/* Slider Controls */}
              <button 
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                className={`absolute -left-5 z-20 bg-white border border-gray-200 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm -translate-x-2 group-hover/slider:translate-x-0 ${canScrollLeft ? 'text-gray-600 hover:text-gray-900 hover:shadow-md opacity-0 group-hover/slider:opacity-100 cursor-pointer' : 'opacity-0 pointer-events-none'}`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button 
                onClick={scrollRight}
                disabled={!canScrollRight}
                className={`absolute -right-5 z-20 bg-white border border-gray-200 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm translate-x-2 group-hover/slider:translate-x-0 ${canScrollRight ? 'text-gray-600 hover:text-gray-900 hover:shadow-md opacity-0 group-hover/slider:opacity-100 cursor-pointer' : 'opacity-0 pointer-events-none'}`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div 
                ref={sliderRef}
                onScroll={checkScroll}
                className="flex items-stretch gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar pb-4 -mb-4 px-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {delhiSpaces.map((space, index) => (
                  <motion.div
                    key={space._id || index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    onClick={() => window.location.href = `/space/${space._id}`}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-[0_10px_30px_rgba(54,80,63,0.2)] cursor-pointer transition-all group shrink-0 w-[280px] sm:w-[300px] snap-start flex flex-col"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={space.images?.[0] || "/stirring-minds.png"} 
                        alt={space.name || "Virtual Office"} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-2 truncate">
                        {space.spaceId || space.name}
                        {(() => {
                          const mockAreas: Record<string, string> = {
                            'FSDL01': 'Asaf Ali Road',
                            'FSDL02': 'Okhla Phase 2',
                            'FSDL03': 'Saket',
                            'FSDL06': 'Connaught Place',
                          };
                          const area = space.spaceId && mockAreas[space.spaceId] 
                            ? mockAreas[space.spaceId] 
                            : (space.area || (space.address ? space.address.split(',')[0].trim() : ''));
                          return area && area.toLowerCase() !== 'delhi' ? `, ${area}` : '';
                        })()}
                      </h3>
                      
                      <div className="flex items-start gap-1.5 text-gray-500 text-xs mb-4">
                        <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{space.location?.address || "Delhi, India"}</span>
                      </div>

                      <div className="mt-auto mb-4">
                        <p className="text-gray-500 text-xs mb-1">Quoted price (negotiable)</p>
                        <p className="text-gray-900 font-bold text-lg">
                          ₹{getMonthlyPrice(space)} <span className="text-xs text-gray-500 font-normal">/month</span>
                        </p>
                      </div>

                      <div 
                        className="text-[#36503F] text-sm font-bold flex items-center gap-1.5 group-hover:gap-2 transition-all group-hover:underline"
                      >
                        Explore {space.spaceId || space.name?.split(' - ')[0] || "Location"} <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">No spaces found in Delhi at the moment.</div>
          )
        ) : (
          <div className="relative group/slider flex items-center">
            {/* Slider Controls */}
            <button 
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              className={`absolute -left-5 z-20 bg-white border border-gray-200 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm -translate-x-2 group-hover/slider:translate-x-0 ${canScrollLeft ? 'text-gray-600 hover:text-gray-900 hover:shadow-md opacity-0 group-hover/slider:opacity-100 cursor-pointer' : 'opacity-0 pointer-events-none'}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button 
              onClick={scrollRight}
              disabled={!canScrollRight}
              className={`absolute -right-5 z-20 bg-white border border-gray-200 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm translate-x-2 group-hover/slider:translate-x-0 ${canScrollRight ? 'text-gray-600 hover:text-gray-900 hover:shadow-md opacity-0 group-hover/slider:opacity-100 cursor-pointer' : 'opacity-0 pointer-events-none'}`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Slider Container */}
            <div 
              ref={sliderRef}
              onScroll={checkScroll}
              className="flex items-stretch gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar pb-4 -mb-4 px-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {panIndiaCities.map((city, index) => (
                <motion.div
                  key={city.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  onClick={() => window.location.href = `/services/virtual-office?city=${city.title}`}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-[0_10px_30px_rgba(54,80,63,0.2)] cursor-pointer transition-all group shrink-0 w-[280px] sm:w-[300px] snap-start flex flex-col"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img 
                      src={city.image} 
                      alt={city.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-gray-900 text-xl mb-4">
                      {city.title}
                    </h3>
                    
                    <div className="mt-auto mb-4">
                      <p className="text-gray-500 text-sm mb-0.5">Starting at <span className="font-bold text-gray-900">₹{city.price}</span> /month</p>
                    </div>

                    <div 
                      className="text-[#36503F] text-sm font-bold flex items-center gap-1.5 group-hover:gap-2 transition-all group-hover:underline"
                    >
                      Explore locations in {city.title} <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
