import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  MapPin,
  Star,
  Wifi,
  Coffee,
  Printer,
  Shield,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Users,
  Clock,
  Presentation,
  Monitor,
  ShieldCheck,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getMeetingRoomById } from "@/services/meetingRoom.service";
import { MeetingRoomItem } from "@/types/services";
import { SpaceDetailSkeleton } from "@/components/ui/skeleton-loaders";
import ImageGalleryModal from "../ui/ImageGalleryModal";
import { useAuth } from "@/contexts/AuthContext";
import { createPaymentOrder, verifyPayment } from "@/services/payment.service";
import hotToast from "react-hot-toast";

// Default photos for spaces that don't have images
const DEFAULT_PHOTOS = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
];

const MeetingRoomSpaceComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [spaceDetails, setSpaceDetails] = useState<MeetingRoomItem | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Booking State
  const [hours, setHours] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize data
  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        // Use state if available (from navigation) to avoid API call and preserve images
        if (location.state && location.state.space) {
          setSpaceDetails(location.state.space);
        } else if (id) {
          // Fallback fetch
          const data = await getMeetingRoomById(id);
          if (data) {
            setSpaceDetails(data);
          } else {
            setError("Meeting Room not found");
          }
        }
      } catch (err) {
        setError("Failed to load details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, location.state]);

  const getTotalPrice = () => {
    if (!spaceDetails) return 0;
    return getHourlyRate() * hours;
  };

  const getHourlyRate = () => {
    if (!spaceDetails) return 0;

    // Priority 1: New numeric final price from backend
    if (spaceDetails.finalPricePerHour !== undefined) {
      return spaceDetails.finalPricePerHour;
    }

    if (spaceDetails.partnerPricePerHour !== undefined) {
      return spaceDetails.partnerPricePerHour;
    }

    // Priority 2: Legacy string parsing
    const match = spaceDetails.price.match(/[\d,]+/);
    return match ? parseInt(match[0].replace(/,/g, "")) : 0;
  };

  const getPhotos = () => {
    if (!spaceDetails) return DEFAULT_PHOTOS;
    // For mock, we often usually have just one image, so let's duplicate it or add placeholders
    // to fill the gallery grid
    const main = spaceDetails.image || DEFAULT_PHOTOS[0];
    return [
      main,
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
      "https://images.unsplash.com/photo-1517502884422-41e157d2ed22?w=800&q=80",
    ];
  };

  // Helper for amenities
  const getAmenityIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("wifi")) return <Wifi className="w-5 h-5" />;
    if (lower.includes("coffee") || lower.includes("tea"))
      return <Coffee className="w-5 h-5" />;
    if (lower.includes("projector"))
      return <Presentation className="w-5 h-5" />;
    if (lower.includes("conf") || lower.includes("video"))
      return <Monitor className="w-5 h-5" />;
    return <Clock className="w-5 h-5" />;
  };

  const handleBookNow = async () => {
    if (!user) {
      hotToast.error("Please login to book a meeting room");
      navigate(`/login?redirect=${location.pathname}`);
      return;
    }

    if (!spaceDetails) return;

    setIsProcessing(true);
    try {
      const totalPrice = getTotalPrice();

      // 1. Create Order
      const order = await createPaymentOrder({
        userId: user.id || (user as any)._id,
        userEmail: user.email,
        userName: user.fullName || "User",
        userPhone: (user as any).phoneNumber || "9876543210",
        spaceId: spaceDetails._id,
        spaceName: spaceDetails.name,
        planName: `${hours} Hour Meeting Room Booking`,
        planKey: "meeting_hourly",
        tenure: 1, // Dummy
        yearlyPrice: totalPrice, // Dummy
        totalAmount: totalPrice,
        discountPercent: 0,
        discountAmount: 0,
        paymentType: "meeting_room" as any,
      });

      // 2. Simulate Payment Success (as per request/reference)
      // For meeting rooms, we often use simulation or direct Razorpay.
      // If we want actual Razorpay, we'd call openRazorpayCheckout.
      // But based on the merged code, it seems simulation/test was intended for this component.
      await new Promise((r) => setTimeout(r, 1500));

      await verifyPayment({
        razorpay_order_id: order.orderId,
        razorpay_payment_id: `pay_test_${Date.now()}`,
        razorpay_signature: "test_signature_dev",
        devMode: true,
      });

      hotToast.success("Booking Successful! Credits Earned! 🎉");
      // navigate('/bookings'); // Optional: redirect to bookings
    } catch (error: any) {
      console.error(error);
      hotToast.error(error.message || "Booking failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="relative flex-grow pt-20">
          <SpaceDetailSkeleton />
        </main>
      </div>
    );
  }

  if (error || !spaceDetails) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="relative flex-grow pt-20 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 text-xl font-bold">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-4 py-2 bg-yellow-400 rounded"
            >
              Go Back
            </button>
          </div>
        </main>
      </div>
    );
  }

  const photos = getPhotos();
  const totalPrice = getTotalPrice();
  const creditsEarned = Math.floor(totalPrice * 0.5);

  return (
    <div className="flex flex-col min-h-screen font-poppins">
      <Header />
      <main className="flex-grow bg-white pt-20">
        <div className="max-w-7xl mx-auto px-4 py-10">
          {/* Header */}
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
                <h1 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">
                  {spaceDetails.name}
                </h1>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-black">
                      {spaceDetails.avgRating !== undefined
                        ? spaceDetails.avgRating
                        : spaceDetails.rating || 0}
                    </span>
                    <span className="text-gray-400">
                      (
                      {spaceDetails.totalReviews !== undefined
                        ? spaceDetails.totalReviews
                        : spaceDetails.reviews || 0}{" "}
                      reviews)
                    </span>
                  </div>

                  <span className="hidden sm:inline text-gray-300">•</span>

                  <div className="flex items-center gap-1.5 align-middle">
                    <MapPin className="w-4 h-4 flex-shrink-0 text-gray-500" />
                    <span>{spaceDetails.address}</span>
                  </div>

                  <span className="hidden sm:inline text-gray-300">•</span>

                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium">
                    {spaceDetails.type}
                  </span>
                </div>
              </div>

              {/* Back Button (Desktop) */}
              <button
                onClick={() => navigate(-1)}
                className="hidden md:flex items-center gap-2 hover:text-black transition whitespace-nowrap"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            </div>
          </div>

          {/* Photos */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px] mb-8 rounded-2xl overflow-hidden">
            <div className="md:col-span-2 h-full">
              <img
                src={photos[0]}
                className="w-full h-full object-cover hover:scale-[1.02] transition cursor-pointer"
                onClick={() => {
                  setGalleryInitialIndex(0);
                  setIsGalleryOpen(true);
                }}
              />
            </div>
            <div className="md:col-span-1 grid grid-rows-2 gap-2 h-full">
              <img
                src={photos[1]}
                className="w-full h-full object-cover hover:scale-[1.02] transition cursor-pointer"
                onClick={() => {
                  setGalleryInitialIndex(1);
                  setIsGalleryOpen(true);
                }}
              />
              <img
                src={photos[2]}
                className="w-full h-full object-cover hover:scale-[1.02] transition cursor-pointer"
                onClick={() => {
                  setGalleryInitialIndex(2);
                  setIsGalleryOpen(true);
                }}
              />
            </div>
            <div className="md:col-span-1 h-full relative">
              <img
                src={photos[3]}
                className="w-full h-full object-cover hover:scale-[1.02] transition cursor-pointer"
                onClick={() => {
                  setGalleryInitialIndex(3);
                  setIsGalleryOpen(true);
                }}
              />
              <button
                onClick={() => {
                  setGalleryInitialIndex(0);
                  setIsGalleryOpen(true);
                }}
                className="absolute bottom-4 right-4 bg-white px-3 py-2 rounded shadow text-sm font-semibold"
              >
                Show all photos
              </button>
            </div>
          </div>

          {/* Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left: Info */}
            <div className="lg:col-span-2">
              <div className="border-b pb-8 mb-8">
                <h2 className="text-xl font-bold mb-4">
                  About this meeting room
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {spaceDetails.name} provides a professional{" "}
                  {spaceDetails.type.toLowerCase()} environment in{" "}
                  {spaceDetails.area}, {spaceDetails.city}. Ideal for client
                  meetings, interviews, or team collaboration sessions.
                  {spaceDetails.availability && (
                    <span className="block mt-2 text-green-600 font-medium">
                      ✓ {spaceDetails.availability}
                    </span>
                  )}
                </p>
              </div>

              <div className="border-b pb-8 mb-8">
                <h2 className="text-xl font-bold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 gap-4">
                  {spaceDetails.features.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 text-gray-700"
                    >
                      {getAmenityIcon(f)}
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Location</h2>
                <div className="w-full h-64 bg-gray-100 rounded-xl overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(spaceDetails.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    allowFullScreen
                  ></iframe>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {spaceDetails.address}
                </p>
              </div>
            </div>

            {/* Right: Booking Card */}
            <div className="relative">
              <div className="sticky top-24 border rounded-xl shadow-lg p-6 bg-white">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <span className="text-2xl font-bold">₹{totalPrice}</span>
                    <span className="text-gray-500"> / session</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm bg-gray-100 px-2 py-1 rounded">
                    <span>
                      ⭐{" "}
                      {spaceDetails.avgRating !== undefined
                        ? spaceDetails.avgRating
                        : spaceDetails.rating || 0}
                    </span>
                  </div>
                </div>

                <div className="bg-amber-50 rounded-lg p-3 mb-6 text-center border border-amber-100">
                  <span className="text-gray-600 text-sm">Hourly Rate: </span>
                  <span className="font-bold text-amber-900">
                    ₹{getHourlyRate()} /hr
                  </span>
                </div>

                {/* Credit Reward Info */}
                <div className="bg-green-50 rounded-lg p-3 mb-6 text-center border border-green-100">
                  <span className="text-green-800 text-sm font-semibold">
                    ✨ You will earn {creditsEarned} Credits!
                  </span>
                </div>

                {/* Date Picker (Simplified) */}
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  Date
                </label>
                <div
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="border rounded-lg p-3 flex justify-between items-center cursor-pointer hover:bg-gray-50 mb-4"
                >
                  <span>{selectedDate.toLocaleDateString()}</span>
                  <Calendar className="w-4 h-4 text-gray-400" />
                </div>
                {showCalendar && (
                  <div className="absolute z-50 bg-white shadow-xl border p-2 rounded-lg w-64">
                    <p className="text-xs text-center mb-2 font-bold">
                      Select Date
                    </p>
                    <div className="grid grid-cols-7 gap-1">
                      {[...Array(30)].map((_, i) => {
                        const d = new Date();
                        d.setDate(d.getDate() + i);
                        const isSel =
                          d.toDateString() === selectedDate.toDateString();
                        return (
                          <button
                            key={i}
                            onClick={() => {
                              setSelectedDate(d);
                              setShowCalendar(false);
                            }}
                            className={`p-1 text-xs rounded ${isSel ? "bg-amber-400 font-bold" : "hover:bg-gray-100"}`}
                          >
                            {d.getDate()}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Hours Counter */}
                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                    Duration (Hours)
                  </label>
                  <div className="flex items-center border rounded-lg p-1">
                    <button
                      onClick={() => setHours(Math.max(1, hours - 1))}
                      className="w-10 h-10 hover:bg-gray-100 rounded flex items-center justify-center font-bold text-lg"
                    >
                      -
                    </button>
                    <div className="flex-1 text-center font-bold">
                      {hours} hr{hours > 1 ? "s" : ""}
                    </div>
                    <button
                      onClick={() => setHours(hours + 1)}
                      className="w-10 h-10 hover:bg-gray-100 rounded flex items-center justify-center font-bold text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleBookNow}
                  disabled={isProcessing}
                  className={`w-full font-bold py-3 rounded-lg transition-all duration-300 ${isProcessing ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-black text-white hover:bg-[#EDB003] hover:text-black"}`}
                >
                  {isProcessing
                    ? "Processing Payment..."
                    : `Pay ₹${totalPrice}`}
                </button>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                  <ShieldCheck className="w-3 h-3" /> Secure Payment via
                  Razorpay
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ImageGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={photos}
        initialIndex={galleryInitialIndex}
      />
    </div>
  );
};

export default MeetingRoomSpaceComponent;
