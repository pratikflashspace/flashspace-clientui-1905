import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Wifi, Coffee, Printer, Monitor, Shield, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getVirtualOfficeById } from '@/services/virtualOffice.service';
import { getReviewsBySpaceId, Review } from '@/services/review.service';
import { VirtualOfficeItem } from '@/types/services';
import { getVirtualOfficePricing } from '@/utils/priceUtils';
import { SpaceDetailSkeleton } from '@/components/ui/skeleton-loaders';
import ImageGalleryModal from '../ui/ImageGalleryModal';
import { LeadCollectionModal } from '@/components/booking/LeadCollectionModal';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user } = useAuth();
  // State for API data
  const [spaceDetails, setSpaceDetails] = useState<VirtualOfficeItem | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  // UI State
  const [selectedPlan, setSelectedPlan] = useState('gst');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [pendingBookingAction, setPendingBookingAction] = useState<(() => void) | null>(null);

  // Handlers for Mobile Carousel
  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev + 1) % getPhotos().length);
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev - 1 + getPhotos().length) % getPhotos().length);
  };

  // Fetch space detai    ls from API 
  useEffect(() => {
    const fetchSpaceDetails = async () => {
      if (!id) return;

      setLoading(true);
      setError("");

      try {
        const [data, reviewsData] = await Promise.all([
          getVirtualOfficeById(id),
          getReviewsBySpaceId(id).catch(() => [] as Review[])
        ]);
        setSpaceDetails(data);
        setReviews(reviewsData);
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

    const gallery = Array.isArray(spaceDetails.images) ? spaceDetails.images : [];
    const mainImage = spaceDetails.image || gallery[0];

    // Keep main image first, then rest of gallery without duplicates
    const ordered = [
      ...(mainImage ? [mainImage] : []),
      ...gallery.filter((img) => img && img !== mainImage),
    ];

    return ordered.length ? ordered : DEFAULT_PHOTOS;
  };

  const handleBookNow = () => {
    if (!spaceDetails || !pricing) return;
    if (spaceDetails.availability?.toLowerCase() === 'unavailable') return;

    const executeBooking = () => {
      navigate(`/booking/${spaceDetails._id}?plan=${selectedPlan}`);
    };

    setPendingBookingAction(() => executeBooking);
    setShowLeadModal(true);
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
  // Ensure the desktop grid always has 4 images; pad with defaults if needed
  const photosForGrid = (photos.length >= 4)
    ? photos
    : [...photos, ...DEFAULT_PHOTOS].slice(0, 4);

  return (<div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow bg-white dark:bg-[#0a0a0a] pt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-10 font-poppins text-gray-800 dark:text-gray-100">

        {/* --- HEADER SECTION --- */}
        <div className="mb-6 md:mb-8">
          {/* Back Button (Mobile) */}
          <button
            onClick={() => navigate(-1)}
            className="md:hidden flex items-center gap-2 text-sm text-gray-500 mb-4 hover:text-black dark:text-gray-400 dark:hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Spaces
          </button>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold mb-3 font-geist text-black dark:text-white leading-tight">
                {spaceDetails.name}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
                {/* Rating */}
                <div className="flex items-center gap-1 bg-gray-50 dark:bg-white/5 px-2 py-1 rounded-md">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-black dark:text-white">{spaceDetails.rating}</span>
                  <span className="text-gray-400 dark:text-gray-500">({spaceDetails.reviews} reviews)</span>
                </div>

                {/* Separator dot - hidden on small mobile if needed, but useful */}
                <span className="hidden sm:inline text-gray-300">•</span>

                {/* Address */}
                <div className="flex items-start sm:items-center gap-1.5 max-w-xl">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 sm:mt-0 text-gray-500" />
                  <span className="leading-snug">{spaceDetails.address}</span>
                </div>
              </div>
            </div>

            {/* Back Button (Desktop) */}
            <button
              onClick={() => navigate(-1)}
              className="hidden md:flex items-center gap-2 text-sm text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Spaces
            </button>
          </div>
        </div>

        {/* --- PHOTO GRID --- */}
        {/* --- PHOTO GALLERY --- */}

        {/* Mobile: Simple Carousel */}
        <div className="md:hidden relative h-[300px] mb-8 rounded-2xl overflow-hidden group">
          <img
            src={photos[currentPhotoIndex]}
            alt={`Space View ${currentPhotoIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out cursor-pointer"
            onClick={() => { setGalleryInitialIndex(currentPhotoIndex); setIsGalleryOpen(true); }}
          />

          {/* Controls */}
          <button
            onClick={prevPhoto}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md backdrop-blur-sm transition-all active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 text-gray-800" />
          </button>

          <button
            onClick={nextPhoto}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md backdrop-blur-sm transition-all active:scale-95"
          >
            <ChevronRight className="w-5 h-5 text-gray-800" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
            {photos.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentPhotoIndex ? 'bg-white w-4' : 'bg-white/50'
                  }`}
              />
            ))}
          </div>

          {/* View All Badge */}
          <button
            onClick={() => { setGalleryInitialIndex(0); setIsGalleryOpen(true); }}
            className="absolute top-4 right-4 bg-black/50 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm font-medium hover:bg-black/70 transition"
          >
            1/{photos.length}
          </button>
        </div>

        {/* Desktop: Grid Layout */}
        <div className="hidden md:grid grid-cols-4 gap-2 h-[400px] mb-8 rounded-2xl overflow-hidden">
          <div className="col-span-2 h-full">
            <img
              src={photosForGrid[0]}
              alt="Main Space"
              className="w-full h-full object-cover hover:opacity-95 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
              onClick={() => { setGalleryInitialIndex(0); setIsGalleryOpen(true); }}
            />
          </div>
          <div className="col-span-1 grid grid-rows-2 gap-2 h-full">
            <img
              src={photosForGrid[1]}
              alt="Detail 1"
              className="w-full h-full object-cover hover:opacity-95 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
              onClick={() => { setGalleryInitialIndex(1); setIsGalleryOpen(true); }}
            />
            <img
              src={photosForGrid[2]}
              alt="Detail 2"
              className="w-full h-full object-cover hover:opacity-95 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
              onClick={() => { setGalleryInitialIndex(2); setIsGalleryOpen(true); }}
            />
          </div>
          <div className="col-span-1 h-full relative">
            <img
              src={photosForGrid[3]}
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
            <div className="border-b dark:border-white/10 pb-8 mb-8">
              <h2 className="text-xl font-semibold mb-4 font-geist text-black dark:text-white">About this space</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {spaceDetails.name} is a premium workspace located in {spaceDetails.area}, {spaceDetails.city}.
                Perfect for startups, freelancers, and enterprises looking for a professional business address and workspace solutions.
              </p>
            </div>

            <div className="border-b dark:border-white/10 pb-8 mb-8">
              <h2 className="text-xl font-semibold mb-4 font-geist text-black dark:text-white">What this place offers</h2>
              <div className="grid grid-cols-2 gap-4">
                {(spaceDetails.features || []).map((item, index) => (
                  <div key={index} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    {getAmenityIcon(item)}
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 font-geist text-black dark:text-white">Where you'll be</h2>
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

            {/* Reviews Section */}
            {reviews.length > 0 && (
              <div className="mb-8 border-t dark:border-white/10 pt-8">
                <div className="flex items-center gap-2 mb-6">
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  <h2 className="text-xl font-semibold font-geist text-black dark:text-white">
                    {spaceDetails.rating} · {reviews.length} reviews
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reviews.map((review) => (
                    <div key={review._id} className="bg-gray-50 dark:bg-white/5 rounded-xl p-5 border border-gray-100 dark:border-white/10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center font-bold text-gray-600 dark:text-gray-300">
                          {review.user?.fullName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-gray-100 leading-none mb-1">
                            {review.user?.fullName || 'Anonymous'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600'}`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                    className={`border dark:border-gray-700 rounded-lg p-3 cursor-pointer transition ${selectedPlan === key ? 'border-black dark:border-white ring-1 ring-black dark:ring-white bg-gray-50 dark:bg-white/10' : 'hover:border-gray-400 dark:hover:border-gray-500'}`}
                  >
                    <div className="flex justify-between items-center text-black dark:text-white">
                      <span className="font-semibold">{plan.name}</span>
                      <span className="font-bold">₹{plan.yearlyPrice}/year</span>
                    </div>
                    <ul className="mt-2 text-xs text-gray-500 dark:text-gray-400 list-disc pl-4">
                      {plan.features.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                  </div>
                ))}
              </div>

              <button
                onClick={handleBookNow}
                disabled={spaceDetails.availability?.toLowerCase() === 'unavailable'}
                className={`w-full py-3 rounded-lg font-bold text-lg transition ${spaceDetails.availability?.toLowerCase() === 'unavailable'
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#36503F] hover:bg-[#1F2E26] text-[#FEF8C5]'
                  }`}
              >
                {spaceDetails.availability?.toLowerCase() === 'unavailable' ? 'Unavailable' : 'Book Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
    <Footer />
    <ImageGalleryModal
      isOpen={isGalleryOpen}
      onClose={() => setIsGalleryOpen(false)}
      images={getPhotos()}
      initialIndex={galleryInitialIndex}
    />
    <LeadCollectionModal
      isOpen={showLeadModal}
      onClose={() => setShowLeadModal(false)}
      onSuccess={() => {
        setShowLeadModal(false);
        if (pendingBookingAction) {
          pendingBookingAction();
        }
      }}
      spaceId={spaceDetails._id}
      spaceName={spaceDetails.name || "Selected Space"}
    />
  </div>
  );
};

export default SpaceComponent;
