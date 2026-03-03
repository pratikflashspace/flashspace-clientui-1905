import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Wifi, Coffee, Printer, Monitor, Shield, Calendar, ChevronLeft, ChevronRight, ArrowLeft, Users, Clock } from 'lucide-react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCoworkingSpaceById } from '@/services/coworkingSpace.service';
import { CoworkingSpaceItem } from '@/types/services';
import { SpaceDetailSkeleton } from '@/components/ui/skeleton-loaders';
import ImageGalleryModal from '../ui/ImageGalleryModal';

// Default photos for spaces that don't have images
const DEFAULT_PHOTOS = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=400&q=80",
];

const CoworkingSpaceComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // State for API data
  const [spaceDetails, setSpaceDetails] = useState<CoworkingSpaceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  // UI State - Only monthly billing
  const [deskCount, setDeskCount] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0);

  // Fetch space details from API
  useEffect(() => {
    const fetchSpaceDetails = async () => {
      if (!id) return;

      setLoading(true);
      setError("");

      try {
        const data = await getCoworkingSpaceById(id);
        setSpaceDetails(data);
      } catch (err: any) {
        console.error("Error fetching coworking space details:", err);
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
    if (name.toLowerCase().includes("24") || name.toLowerCase().includes("hour")) return <Clock className="w-5 h-5" />;
    return <Monitor className="w-5 h-5" />; // Default
  };

  // Parse price from string
  const parsePrice = (priceStr: string) => {
    const match = priceStr?.match(/[\d,]+/);
    return match ? parseInt(match[0].replace(/,/g, '')) : 0;
  };

  // Get monthly price per desk
  const getMonthlyPrice = () => {
    if (!spaceDetails) return 0;
    return parsePrice(spaceDetails.price);
  };

  // Get total price based on desk count (monthly only)
  const getTotalPrice = () => {
    return getMonthlyPrice() * deskCount;
  };

  // Get photos - use API image or fallback to defaults
  const getPhotos = () => {
    if (!spaceDetails) return DEFAULT_PHOTOS;
    const mainImage = spaceDetails.image || DEFAULT_PHOTOS[0];
    return [mainImage, ...DEFAULT_PHOTOS.slice(1)];
  };

  const handleBookNow = () => {
    if (!spaceDetails) return;
    if (spaceDetails.availability?.toLowerCase() === 'unavailable') return;

    // Navigate to booking page with params
    // SpaceComponent sends ?plan=...
    // Here we send deskCount and date
    const dateStr = selectedDate.toISOString();
    navigate(`/booking/${spaceDetails._id}?desks=${deskCount}&date=${dateStr}&type=coworking&direct=true`);
  };

  // Loading State - Show Skeleton
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="relative flex-grow bg-white pt-20">
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
        <main className="relative flex-grow bg-white pt-20 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 text-xl mb-4">≡ƒÿò {error || "Space not found"}</p>
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

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Header at the top */}
      <Header />

      {/* 2. Main Content Area */}
      <main className="relative flex-grow bg-white pt-20">
        <div className="max-w-7xl mx-auto px-4 py-10 font-poppins text-gray-800">

          {/* --- HEADER SECTION --- */}
          <div className="mb-6 md:mb-8">
            {/* Back Button (Mobile) */}
            <button
              onClick={() => navigate(-1)}
              className="md:hidden flex items-center gap-2 text-sm text-gray-500 mb-4 hover:text-black transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Spaces
            </button>

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold font-geist leading-tight">{spaceDetails.name}</h1>
                  {spaceDetails.popular && (
                    <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">≡ƒöÑ Popular</span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-black">{spaceDetails.rating}</span>
                    <span className="text-gray-400">({spaceDetails.reviews} reviews)</span>
                  </div>

                  <span className="hidden sm:inline text-gray-300">ΓÇó</span>

                  <div className="flex items-center gap-1.5 align-middle">
                    <MapPin className="w-4 h-4 flex-shrink-0 text-gray-500" />
                    <span>{spaceDetails.address}</span>
                  </div>

                  {spaceDetails.type && (
                    <>
                      <span className="hidden sm:inline text-gray-300">ΓÇó</span>
                      <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
                        {spaceDetails.type}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Back Button (Desktop) */}
              <button
                onClick={() => navigate(-1)}
                className="hidden md:flex items-center gap-2 text-sm text-gray-500 hover:text-black transition whitespace-nowrap"
              >
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
                <h2 className="text-xl font-semibold mb-4 font-geist">About this coworking space</h2>
                <p className="text-gray-600 leading-relaxed">
                  {spaceDetails.name} is a modern coworking space located in {spaceDetails.area}, {spaceDetails.city}.
                  Perfect for freelancers, startups, and remote workers looking for a productive workspace with all essential amenities.
                  {spaceDetails.availability && (
                    <span className={`block mt-2 font-medium ${spaceDetails.availability === 'Unavailable' ? 'text-red-500' : 'text-green-600'
                      }`}>
                      {spaceDetails.availability === 'Unavailable' ? 'Γ£ò Unavailable' : `Γ£ô ${spaceDetails.availability}`}
                    </span>
                  )}
                </p>
              </div>

              <div className="border-b pb-8 mb-8">
                <h2 className="text-xl font-semibold mb-4 font-geist">What this place offers</h2>
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
                    style={{ border: 0 }}
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
              <div className="sticky top-24 border rounded-xl shadow-xl p-6 bg-white z-10">
                {/* Price Display */}
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <span className="text-3xl font-bold">Γé╣{getTotalPrice()}</span>
                    <span className="text-gray-500 text-lg"> / month</span>
                    {deskCount > 1 && (
                      <p className="text-sm text-gray-400">for {deskCount} desks</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <span>Γ¡É</span>
                    <span className="font-semibold">{spaceDetails.rating}</span>
                  </div>
                </div>

                {/* Per Desk Price Tag */}
                <div className="bg-gray-50 rounded-lg p-3 mb-6 text-center">
                  <span className="text-sm text-gray-600">Starting at </span>
                  <span className="font-bold text-lg">Γé╣{getMonthlyPrice()}</span>
                  <span className="text-sm text-gray-600"> /desk/month</span>
                </div>

                {/* Desk Counter */}
                <div className="border rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-gray-600" />
                      <span className="font-semibold">Number of Desks</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setDeskCount(Math.max(1, deskCount - 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-50"
                        disabled={deskCount <= 1}
                      >
                        -
                      </button>
                      <span className="font-bold text-lg w-8 text-center">{deskCount}</span>
                      <button
                        onClick={() => setDeskCount(deskCount + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Date Picker */}
                <div className="relative mb-6">
                  <div
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="border rounded-lg p-3 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition"
                  >
                    <div className="text-left">
                      <p className="text-xs font-bold uppercase text-gray-500">Start Date</p>
                      <p className="text-sm font-semibold">{selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <Calendar className="w-5 h-5 text-gray-500" />
                  </div>

                  {/* Calendar Dropdown */}
                  {showCalendar && (
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-56 bg-white border rounded-lg shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                      <div className="flex items-center justify-between mb-2">
                        <button
                          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                          className="p-0.5 hover:bg-gray-100 rounded-full transition"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <h3 className="font-bold text-xs">
                          {currentMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </h3>
                        <button
                          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                          className="p-0.5 hover:bg-gray-100 rounded-full transition"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Calendar Grid */}
                      {/* <div className="grid grid-cols-7 gap-0.5 mb-1">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                          <div key={day} className="text-center text-[10px] font-semibold text-gray-500 py-0.5">{day}</div>
                        ))}
                      </div> */}
                      <div className="grid grid-cols-7 gap-0.5">
                        {(() => {
                          const year = currentMonth.getFullYear();
                          const month = currentMonth.getMonth();
                          const firstDay = new Date(year, month, 1).getDay();
                          const daysInMonth = new Date(year, month + 1, 0).getDate();
                          const today = new Date();
                          const days = [];

                          for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className="aspect-square" />);
                          for (let day = 1; day <= daysInMonth; day++) {
                            const date = new Date(year, month, day);
                            const isSelected = selectedDate.toDateString() === date.toDateString();
                            const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                            days.push(
                              <button
                                key={day}
                                onClick={() => { if (!isPast) { setSelectedDate(date); setShowCalendar(false); } }}
                                disabled={isPast}
                                className={`aspect-square flex items-center justify-center text-[11px] rounded transition ${isSelected ? 'bg-[#FFD43B] text-black font-bold shadow-sm' :
                                  isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100 font-medium'
                                  }`}
                              >
                                {day}
                              </button>
                            );
                          }
                          return days;
                        })()}
                      </div>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="border-t pt-4 mb-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Γé╣{getMonthlyPrice()} ├ù {deskCount} desk{deskCount > 1 ? 's' : ''}</span>
                    <span>Γé╣{getTotalPrice()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t">
                    <span>Total</span>
                    <span>Γé╣{getTotalPrice()}/month</span>
                  </div>
                </div>

                <button
                  onClick={handleBookNow}
                  disabled={spaceDetails.availability?.toLowerCase() === 'unavailable'}
                  className={`w-full py-3 rounded-lg font-bold text-lg transition ${spaceDetails.availability?.toLowerCase() === 'unavailable'
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#FFD43B] hover:bg-[#eec635] text-black'
                    }`}
                >
                  {spaceDetails.availability?.toLowerCase() === 'unavailable' ? 'Unavailable' : 'Book Now'}
                </button>
                <p className="text-center text-xs text-gray-400 mt-4">You won't be charged yet</p>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* 3. Footer at the bottom */}
      <Footer />
      {/* Image Gallery Modal */}
      <ImageGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={photos}
        initialIndex={galleryInitialIndex}
      />
    </div>
  );
};

export default CoworkingSpaceComponent;
