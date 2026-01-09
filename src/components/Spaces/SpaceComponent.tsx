import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Wifi, Coffee, Printer, Monitor, Shield, ArrowLeft } from 'lucide-react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getVirtualOfficeById } from '@/services/virtualOffice.service';
import { VirtualOfficeItem } from '@/types/services';
import { getVirtualOfficePricing } from '@/utils/priceUtils';
import { SpaceDetailSkeleton } from '@/components/ui/skeleton-loaders';
import ImageGalleryModal from '../ui/ImageGalleryModal';

// Default photos for spaces that don't have images
const DEFAULT_PHOTOS = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=400&q=80",
];

const SpaceComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State for API data
  const [spaceDetails, setSpaceDetails] = useState<VirtualOfficeItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  
  // UI State
  const [selectedPlan, setSelectedPlan] = useState('gst');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0);

  // Fetch space details from API 
  useEffect(() => {
    const fetchSpaceDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      setError("");
      
      try {
        const data = await getVirtualOfficeById(id);
        setSpaceDetails(data);
      } catch (err: any) {
        console.error("Error fetching space details:", err);
        setError(err.message || "Failed to load space details");
      } finally {
        setLoading(false);
      }
    };

    fetchSpaceDetails();
  }, [id]);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Helper to map text amenities to Icons
  const getAmenityIcon = (name: string) => {
    if (name.toLowerCase().includes("wifi")) return <Wifi className="w-5 h-5" />;
    if (name.toLowerCase().includes("coffee") || name.toLowerCase().includes("lounge")) return <Coffee className="w-5 h-5" />;
    if (name.toLowerCase().includes("print")) return <Printer className="w-5 h-5" />;
    if (name.toLowerCase().includes("security") || name.toLowerCase().includes("guard")) return <Shield className="w-5 h-5" />;
    return <Monitor className="w-5 h-5" />; // Default
  };

  // Generate pricing from API data
  const pricing = getVirtualOfficePricing(spaceDetails);

  // Get price based on selected plan
  const getPrice = (planKey?: string) => {
    if (!pricing) return 0;
    const key = planKey || selectedPlan;
    // @ts-ignore
    const plan = pricing[key as keyof typeof pricing];
    if (!plan) return 0;
    return plan.yearlyPrice;
  };

  // Check if pricing is simple (single price) or complex (multiple plans)
  const isSimplePricing = (pricingData: any) => {
    return typeof pricingData === 'number' || typeof pricingData === 'string';
  };

  // Get photos - use API image or fallback to defaults
  const getPhotos = () => {
    if (!spaceDetails) return DEFAULT_PHOTOS;
    const mainImage = spaceDetails.image || DEFAULT_PHOTOS[0];
    return [mainImage, ...DEFAULT_PHOTOS.slice(1)];
  };

  const handleBookNow = () => {
    if (!spaceDetails || !pricing) return;
    navigate(`/booking/${spaceDetails._id}?plan=${selectedPlan}`);
  };

  // Loading State - Show Skeleton
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow bg-white pt-20">
          <SpaceDetailSkeleton />
        </main>
        <Footer />
      </div>
    );
  }

  // Error State
  if (error || !spaceDetails) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow bg-white pt-20 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 text-xl mb-4">😕 {error || "Space not found"}</p>
            <button 
              onClick={() => navigate(-1)} 
              className="px-6 py-2 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-500 transition"
            >
              Go Back
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const photos = getPhotos();

  return (      <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-white dark:bg-[#0a0a0a] pt-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-10 font-poppins text-gray-800 dark:text-gray-100">

          {/* --- HEADER SECTION --- */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 font-geist text-black dark:text-white">{spaceDetails.name}</h1>
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-black dark:text-white">{spaceDetails.rating}</span>
                  <span className="underline">({spaceDetails.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{spaceDetails.address}</span>
                </div>
              </div>
              <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition">
                <ArrowLeft className="w-4 h-4" />
                Back to Spaces
              </button>
            </div>
          </div>

          {/* --- PHOTO GRID --- */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px] mb-8 rounded-2xl overflow-hidden">
            <div className="md:col-span-2 h-full">
              <img 
                src={photos[0]} 
                alt="Main Space" 
                className="w-full h-full object-cover hover:opacity-95 hover:scale-[1.02] transition-all duration-300 cursor-pointer" 
                onClick={() => { setGalleryInitialIndex(0); setIsGalleryOpen(true); }}
              />
            </div>
            <div className="md:col-span-1 grid grid-rows-2 gap-2 h-full">
              <img 
                src={photos[1]} 
                alt="Detail 1" 
                className="w-full h-full object-cover hover:opacity-95 hover:scale-[1.02] transition-all duration-300 cursor-pointer" 
                onClick={() => { setGalleryInitialIndex(1); setIsGalleryOpen(true); }}
              />
              <img 
                src={photos[2]} 
                alt="Detail 2" 
                className="w-full h-full object-cover hover:opacity-95 hover:scale-[1.02] transition-all duration-300 cursor-pointer" 
                onClick={() => { setGalleryInitialIndex(2); setIsGalleryOpen(true); }}
              />
            </div>
            <div className="md:col-span-1 h-full relative">
              <img 
                src={photos[3]} 
                alt="Detail 3" 
                className="w-full h-full object-cover hover:opacity-95 hover:scale-[1.02] transition-all duration-300 cursor-pointer" 
                onClick={() => { setGalleryInitialIndex(3); setIsGalleryOpen(true); }}
              />
              <button 
                onClick={() => { setGalleryInitialIndex(0); setIsGalleryOpen(true); }}
                className="absolute bottom-4 right-4 bg-white hover:bg-gray-100 px-4 py-2 rounded-lg shadow-md text-sm font-semibold transition-colors"
              >
                Show all photos
              </button>
            </div>
          </div>

          {/* --- MAIN CONTENT LAYOUT --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* LEFT COLUMN: Info */}
            <div className="lg:col-span-2">
              <div className="border-b pb-8 mb-8">
                <h2 className="text-xl font-semibold mb-4 font-geist">About this space</h2>
                <p className="text-gray-600 leading-relaxed">
                  {spaceDetails.name} is a premium workspace located in {spaceDetails.area}, {spaceDetails.city}. 
                  Perfect for startups, freelancers, and enterprises looking for a professional business address and workspace solutions.
                </p>
              </div>

              <div className="border-b dark:border-white/10 pb-8 mb-8">
                <h2 className="text-xl font-semibold mb-4 font-geist text-black dark:text-white">What this place offers</h2>
                <div className="grid grid-cols-2 gap-4">
                  {(spaceDetails.features || []).map((item, index) => (
                    <div key={index} className="flex items-center gap-3 text-gray-700">
                      {getAmenityIcon(item)}
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 font-geist">Where you'll be</h2>
                <div className="w-full h-64 bg-gray-200 rounded-xl overflow-hidden relative">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    style={{border:0}}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(spaceDetails.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    allowFullScreen
                    title="Space Location"
                  ></iframe>
                </div>
                <p className="mt-2 text-sm text-gray-500">{spaceDetails.address}</p>
              </div>
            </div>

            {/* RIGHT COLUMN: Sticky Booking Card */}
            <div className="relative">
              <div className="sticky top-24 border dark:border-white/10 rounded-xl shadow-xl dark:shadow-none p-6 bg-white dark:bg-[#1f1f1f] z-10 transition-colors duration-300">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <span className="text-2xl font-bold text-black dark:text-white">₹{getPrice()}</span>
                    <span className="text-gray-500 dark:text-gray-400"> / year</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm dark:text-gray-300">
                    <span>⭐</span>
                    <span className="font-semibold">{spaceDetails.rating}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <label className="block text-xs font-semibold text-gray-500 uppercase">Select Plan</label>
                  {pricing && Object.entries(pricing).map(([key, plan]) => (
                    <div 
                      key={key}
                      onClick={() => setSelectedPlan(key)}
                      className={`border rounded-lg p-3 cursor-pointer transition ${selectedPlan === key ? 'border-black ring-1 ring-black bg-gray-50' : 'hover:border-gray-400'}`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{plan.name}</span>
                        <span className="font-bold">₹{plan.yearlyPrice}/year</span>
                      </div>
                      <ul className="mt-2 text-xs text-gray-500 list-disc pl-4">
                        {plan.features.map((f, i) => <li key={i}>{f}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={handleBookNow}
                  className="w-full bg-[#FFD43B] hover:bg-[#eec635] text-black py-3 rounded-lg font-bold text-lg transition"
                >
                  Book Now
                </button>
                <p className="text-center text-xs text-gray-400 mt-4">You won't be charged yet</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ImageGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={spaceDetails?.photos || getPhotos()}
        initialIndex={galleryInitialIndex}
      />
    </div>
  );
};

export default SpaceComponent;