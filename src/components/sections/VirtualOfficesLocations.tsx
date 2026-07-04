import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { GetInTouchModal } from "@/components/modals/GetInTouchModal";

const locations = [
  {
    id: 'delhi',
    title: 'Virtual Office Address in Delhi for GST Registration',
    price: '1025', // 12300 / 12
    image: 'https://res.cloudinary.com/dawsxvwsw/image/upload/v1774452043/img16_qd2kvq.jpg',
  },
  {
    id: 'noida',
    title: 'Virtual Office Address in Noida for GST Registration',
    price: '1000', // 12000 / 12
    image: 'https://res.cloudinary.com/dawsxvwsw/image/upload/v1774463335/img28_bjrbpa.jpg',
  },
  {
    id: 'gurgaon',
    title: 'Virtual Office Address in Gurgaon for GST Registration',
    price: '1158', // 13900 / 12
    image: 'https://res.cloudinary.com/dawsxvwsw/image/upload/v1774453438/img34_oe3qek.jpg',
  },
  {
    id: 'mumbai',
    title: 'Virtual Office Address in Mumbai for GST Registration',
    price: '1500', // 18000 / 12
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'bangalore',
    title: 'Virtual Office Address in Bangalore for GST Registration',
    price: '1117', // 13400 / 12
    image: '/newLogo/banglore.jpg',
  },
  {
    id: 'kolkata',
    title: 'Virtual Office Address in Kolkata for GST Registration',
    price: '1000', // 12000 / 12
    image: 'https://res.cloudinary.com/dawsxvwsw/image/upload/v1774462238/img42_tpqfz2.jpg',
  },
  {
    id: 'ahmedabad',
    title: 'Virtual Office Address in Ahmedabad for GST Registration',
    price: '749',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
  }
];

export const VirtualOfficesLocations = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350; // card width + gap
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      // Delay check to allow smooth scroll to finish, but also bind to onScroll
      setTimeout(checkScroll, 300);
    }
  };

  const scrollToForm = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setIsModalOpen(true);
  };

  return (
    <section className="py-16 lg:py-24 bg-white border-b border-[#D4E0D0] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1F1F1F] tracking-tight text-center">
            Get Your Virtual Office <span className="text-[#36503F]">Pan India</span>
          </h2>
        </div>

        <div className="relative group">
          {/* Left Arrow */}
          <button 
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-[40%] -translate-y-1/2 -translate-x-4 sm:-translate-x-6 z-10 p-2 sm:p-3 rounded-full border border-gray-200 bg-white transition-all shadow-xl flex items-center justify-center ${canScrollLeft ? 'text-gray-600 hover:border-[#36503F] hover:bg-[#36503F] hover:text-white opacity-0 group-hover:opacity-100 cursor-pointer' : 'opacity-0 pointer-events-none'}`}
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Right Arrow */}
          <button 
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`absolute right-0 top-[40%] -translate-y-1/2 translate-x-4 sm:translate-x-6 z-10 p-2 sm:p-3 rounded-full border border-gray-200 bg-white transition-all shadow-xl flex items-center justify-center ${canScrollRight ? 'text-gray-600 hover:border-[#36503F] hover:bg-[#36503F] hover:text-white opacity-0 group-hover:opacity-100 cursor-pointer' : 'opacity-0 pointer-events-none'}`}
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div 
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 pt-4 -mx-4 px-4 sm:mx-0 sm:px-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
          {locations.map((loc, i) => (
            <motion.div 
              key={loc.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              onClick={scrollToForm}
              className="snap-start shrink-0 w-[280px] sm:w-[340px] bg-white rounded-3xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] hover:-translate-y-1 hover:scale-[1.02] cursor-pointer transition-all duration-300 flex flex-col overflow-hidden group/card"
            >
              <div className="h-[220px] w-full overflow-hidden">
                <img 
                  src={loc.image} 
                  alt={loc.title} 
                  className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
              <div className="p-6 flex flex-col flex-1 transform transition-transform duration-500 group-hover/card:-translate-y-2">
                <h3 className="font-normal text-gray-900 text-[17px] leading-snug mb-6 flex-1">
                  {loc.title}
                </h3>
                
                <div className="mb-6 flex items-center gap-1.5 flex-wrap">
                  <span className="text-gray-500 text-[15px]">Starting from</span>
                  <span className="text-gray-900 font-semibold text-lg">₹ {loc.price}/-</span>
                  <span className="text-gray-500 text-[15px]">per Month</span>
                </div>
                
                <div>
                  <button 
                    onClick={scrollToForm}
                    className="py-2.5 px-6 bg-[#36503F] text-white text-[15px] font-medium rounded-[10px] inline-flex items-center gap-2 hover:bg-[#2A4031] transition-colors shadow-sm"
                  >
                    Get in Touch &rarr;
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          </div>
        </div>
      </div>
      <GetInTouchModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};
