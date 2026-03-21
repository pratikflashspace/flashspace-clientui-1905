import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSafeImageUrl, isInvalidImageUrl } from "@/utils/imageUrl";
import MapLibreMap from "@/components/Map/MapLibreMap";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SpaceDetailSkeleton } from "@/components/ui/skeleton-loaders";
import {
  Star,
  MapPin,
  ArrowLeft,
  Wifi,
  Monitor,
  Coffee,
  Clock,
  Users,
  Car,
  Zap,
  Phone,
  ChevronLeft,
  ChevronRight,
  X,
  Presentation,
  Calendar,
  ShieldCheck,
  Printer,
} from "lucide-react";
import hotToast from "react-hot-toast";

// Services
import { getVirtualOfficeById } from "@/services/virtualOffice.service";
import { getCoworkingSpaceById } from "@/services/coworkingSpace.service";
import { getMeetingRoomById } from "@/services/meetingRoom.service";
import { getVirtualOfficePricing } from "@/utils/priceUtils";
import { createPaymentOrder, verifyPayment } from "@/services/payment.service";
import { useAuth } from "@/contexts/AuthContext";
import MeetingBookingModal from "@/components/ui/MeetingBookingModal";

type WorkspaceType = "virtual-office" | "coworking" | "on-demand";

interface WorkspaceDetailProps {
  type: WorkspaceType;
}

const DEFAULT_PHOTOS = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=400&q=80",
];

const WorkspaceDetail = ({ type }: WorkspaceDetailProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Booking UI State
  const [selectedPlan, setSelectedPlan] = useState<string>("gst");
  const [deskCount, setDeskCount] = useState(1);
  const [hours, setHours] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        let result;
        if (type === "virtual-office") result = await getVirtualOfficeById(id);
        else if (type === "coworking") result = await getCoworkingSpaceById(id);
        else result = await getMeetingRoomById(id);

        if (!result) throw new Error("Space not found");
        setData(result);
      } catch (err: any) {
        setError(err.message || "Failed to load details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, type]);

// Unified getters
const getPhotos = () => {
  if (!data) return [];
  
  const rawImages = [
    ...(data.images || []),
    data.image
  ].filter(Boolean) as string[];

  const cleanImages = rawImages
    .filter(img => !isInvalidImageUrl(img))
    .map((img: string) => getSafeImageUrl(img));

  return cleanImages;
};

  const getAmenityIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("wifi"))
      return <Wifi className="w-5 h-5 text-primary flex-shrink-0" />;
    if (
      lower.includes("coffee") ||
      lower.includes("tea") ||
      lower.includes("lounge") ||
      lower.includes("pantry")
    )
      return <Coffee className="w-5 h-5 text-primary flex-shrink-0" />;
    if (lower.includes("print"))
      return <Printer className="w-5 h-5 text-primary flex-shrink-0" />;
    if (lower.includes("projector"))
      return <Presentation className="w-5 h-5 text-primary flex-shrink-0" />;
    if (
      lower.includes("conf") ||
      lower.includes("video") ||
      lower.includes("meeting")
    )
      return <Monitor className="w-5 h-5 text-primary flex-shrink-0" />;
    if (lower.includes("24") || lower.includes("hour"))
      return <Clock className="w-5 h-5 text-primary flex-shrink-0" />;
    if (lower.includes("park"))
      return <Car className="w-5 h-5 text-primary flex-shrink-0" />;
    if (lower.includes("power") || lower.includes("backup"))
      return <Zap className="w-5 h-5 text-primary flex-shrink-0" />;
    if (lower.includes("desk") || lower.includes("cabin"))
      return <Users className="w-5 h-5 text-primary flex-shrink-0" />;
    return <Star className="w-5 h-5 text-primary flex-shrink-0" />;
  };

  const parseNumberFromPrice = (priceStr: string) => {
    if (!priceStr) return 0;
    const match = priceStr.toString().match(/[\d,]+/);
    return match ? parseInt(match[0].replace(/,/g, "")) : 0;
  };

  // Virtual Office Booking
  const renderVirtualOfficeBooking = () => {
    const pricing = getVirtualOfficePricing(data);
    const plansResult = pricing
      ? Object.entries(pricing).map(([key, plan]: [string, any]) => ({
          key,
          label: plan.name,
          yearPrice: `₹${plan.yearlyPrice}`,
          features: plan.features,
        }))
      : [];

    const currentPricing = pricing ? (pricing as any)[selectedPlan] : null;

    const handleBookNow = () => {
      if (!data || !pricing) return;
      if (data.availability?.toLowerCase() === "unavailable") return;
      navigate(
        `/booking/${data._id}/complete?plan=${selectedPlan}&type=virtual_office`,
      );
    };

    return (
      <div className="sticky top-28 border border-border rounded-[16px] p-6 bg-card shadow-md">
        <div className="mb-5">
          <span className="text-2xl font-bold text-foreground">
            {currentPricing ? `₹${currentPricing.yearlyPrice}` : "N/A"}
          </span>
          <span className="text-sm text-muted-foreground ml-1">/ year</span>
        </div>

        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
          Select Plan
        </p>

        <div className="space-y-2 mb-5">
          {plansResult.map((plan) => (
            <div
              key={plan.key}
              onClick={() => setSelectedPlan(plan.key)}
              className={`cursor-pointer rounded-[10px] border p-3.5 transition-all ${
                selectedPlan === plan.key
                  ? "border-foreground bg-background shadow-sm"
                  : "border-border/60 bg-background hover:border-foreground/30"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-foreground">
                  {plan.label}
                </span>
                <span className="text-sm font-bold text-foreground">
                  {plan.yearPrice}
                </span>
              </div>
              <ul className="space-y-0.5">
                {plan.features.map((f: string, i: number) => (
                  <li
                    key={i}
                    className="text-[12px] text-muted-foreground flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/50 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <button
          onClick={handleBookNow}
          className="w-full py-3.5 rounded-[10px] bg-primary text-primary-foreground font-medium text-base hover:bg-primary/85 active:bg-primary/75 transition-colors"
        >
          Book Now
        </button>
        <p className="text-center text-[12px] text-muted-foreground mt-2">
          You won't be charged yet
        </p>

        <button
          onClick={() => setIsMeetingModalOpen(true)}
          className="w-full mt-3 py-3 rounded-[10px] border border-border text-foreground text-sm font-medium flex items-center justify-center gap-2 hover:bg-muted/60 hover:border-border active:bg-muted transition-colors"
        >
          <Phone className="w-4 h-4" /> Contact Sales
        </button>
      </div>
    );
  };

  // Coworking Booking
  const renderCoworkingBooking = () => {
    const monthlyPrice = parseNumberFromPrice(data?.price || "0");
    const totalSelected = monthlyPrice * deskCount;

    const handleBookNow = () => {
      if (!data) return;
      if (data.availability?.toLowerCase() === "unavailable") return;
      const dateStr = selectedDate.toISOString();
      navigate(
        `/booking/${data._id}?desks=${deskCount}&date=${dateStr}&type=coworking&direct=true`,
      );
    };

    return (
      <div className="sticky top-28 border border-border rounded-[16px] p-6 bg-card shadow-md">
        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="text-3xl font-bold text-foreground">
              ₹{totalSelected}
            </span>
            <span className="text-muted-foreground text-sm ml-1">/ month</span>
            {deskCount > 1 && (
              <p className="text-xs text-muted-foreground mt-1">
                for {deskCount} desks
              </p>
            )}
          </div>
        </div>

        <div className="bg-muted/50 rounded-[10px] p-3 mb-6 text-center border border-border/50">
          <span className="text-xs text-muted-foreground">Starting at </span>
          <span className="font-bold text-sm text-foreground">
            ₹{monthlyPrice}
          </span>
          <span className="text-xs text-muted-foreground"> /desk/month</span>
        </div>

        <div className="border border-border/60 rounded-[10px] p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">
                Number of Desks
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeskCount(Math.max(1, deskCount - 1))}
                className="w-7 h-7 rounded-sm border border-border flex items-center justify-center hover:bg-muted/50"
              >
                -
              </button>
              <span className="font-bold text-sm text-foreground w-4 text-center">
                {deskCount}
              </span>
              <button
                onClick={() => setDeskCount(deskCount + 1)}
                className="w-7 h-7 rounded-sm border border-border flex items-center justify-center hover:bg-muted/50"
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
            className="border border-border/60 rounded-[10px] p-3.5 flex justify-between items-center cursor-pointer hover:bg-muted/30"
          >
            <div className="text-left">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Start Date
              </p>
              <p className="text-sm font-semibold text-foreground">
                {selectedDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </div>
          {showCalendar && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-card border border-border rounded-[10px] shadow-xl p-3 z-50">
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
                      className={`p-1.5 text-xs rounded-md ${isSel ? "bg-primary text-primary-foreground font-bold" : "hover:bg-muted text-foreground"}`}
                    >
                      {d.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleBookNow}
          className="w-full py-3.5 rounded-[10px] bg-primary text-primary-foreground font-medium text-base hover:bg-primary/90 transition-colors"
        >
          Book Now
        </button>
      </div>
    );
  };

  // On Demand Booking
  const renderOnDemandBooking = () => {
    const hourlyRate = parseNumberFromPrice(data?.price || "0");
    const totalPrice = hourlyRate * hours;
    const creditsEarned = Math.floor(totalPrice * 0.5);

    const handleBookNow = async () => {
      if (!user) {
        hotToast.error("Please login to book a meeting room");
        navigate(`/login?redirect=${location.pathname}`);
        return;
      }

      setIsProcessing(true);
      try {
        const order = await createPaymentOrder({
          userId: user.id || (user as any)._id,
          userEmail: user.email,
          userName: user.fullName || "User",
          userPhone: user.phoneNumber || "9876543210",
          spaceId: data._id,
          spaceName: data.name,
          planName: `${hours} Hour Meeting Room Booking`,
          planKey: "meeting_hourly",
          tenure: 1,
          yearlyPrice: totalPrice,
          totalAmount: totalPrice,
          discountPercent: 0,
          discountAmount: 0,
          paymentType: "meeting_room" as any,
        });

        await new Promise((r) => setTimeout(r, 1500));
        await verifyPayment({
          razorpay_order_id: order.orderId,
          razorpay_payment_id: `pay_test_${Date.now()}`,
          razorpay_signature: "test_signature_dev",
          devMode: true,
        });

        hotToast.success("Booking Successful! Credits Earned! 🎉");
      } catch (error: any) {
        hotToast.error(error.message || "Booking failed");
      } finally {
        setIsProcessing(false);
      }
    };

    return (
      <div className="sticky top-28 border border-border rounded-[16px] p-6 bg-card shadow-md">
        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="text-3xl font-bold text-foreground">
              ₹{totalPrice}
            </span>
            <span className="text-muted-foreground text-sm ml-1">
              / session
            </span>
          </div>
        </div>

        <div className="bg-primary/10 rounded-[10px] p-3 mb-4 text-center border border-primary/20">
          <span className="text-xs text-primary/80">Hourly Rate: </span>
          <span className="font-bold text-sm text-primary">
            ₹{hourlyRate} /hr
          </span>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-[10px] p-2.5 mb-6 text-center border border-green-200 dark:border-green-800/50">
          <span className="text-green-700 dark:text-green-400 text-xs font-semibold">
            ✨ Earn {creditsEarned} Credits!
          </span>
        </div>

        <div className="mb-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 border-b border-border/50 pb-1.5">
            Date & Duration
          </p>
          <div
            onClick={() => setShowCalendar(!showCalendar)}
            className="border border-border/60 rounded-[10px] p-3 flex justify-between items-center cursor-pointer hover:bg-muted/30 mb-3"
          >
            <span className="text-sm font-medium text-foreground">
              {selectedDate.toLocaleDateString()}
            </span>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </div>
          {showCalendar && (
            <div className="absolute z-50 bg-card shadow-xl border border-border p-3 rounded-[10px] w-full left-0">
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
                      className={`p-1 text-xs rounded ${isSel ? "bg-primary text-primary-foreground font-bold" : "hover:bg-muted text-foreground"}`}
                    >
                      {d.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between border border-border/60 rounded-[10px] p-2">
            <span className="text-xs font-semibold text-muted-foreground ml-2">
              HOURS
            </span>
            <div className="flex items-center">
              <button
                onClick={() => setHours(Math.max(1, hours - 1))}
                className="w-8 h-8 rounded hover:bg-muted/50 flex flex-col items-center justify-center text-foreground font-bold"
              >
                -
              </button>
              <div className="w-8 text-center text-sm font-bold text-foreground">
                {hours}
              </div>
              <button
                onClick={() => setHours(hours + 1)}
                className="w-8 h-8 rounded hover:bg-muted/50 flex flex-col items-center justify-center text-foreground font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleBookNow}
          disabled={isProcessing}
          className={`w-full font-bold py-3.5 rounded-[10px] transition-all duration-300 ${isProcessing ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
        >
          {isProcessing ? "Processing Payment..." : `Pay ₹${totalPrice}`}
        </button>
        <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck className="w-3.5 h-3.5" /> Secure Payment via Razorpay
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24">
          <SpaceDetailSkeleton />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Header />
        <div className="text-center pt-20">
          <p className="text-lg text-muted-foreground mb-4">
            {error || "Workspace not found."}
          </p>
          <button
            onClick={() => navigate("/get-workspaces")}
            className="px-4 py-2 rounded-[8px] bg-primary text-primary-foreground text-sm font-medium"
          >
            Back to Spaces
          </button>
        </div>
      </div>
    );
  }

  const photos = getPhotos();
  const address = data.address || data.area || "";
  const mapData = [
    {
      ...data,
      location: data.name,
      address: address,
      image: photos[0],
      lat: data.lat || 28.6139,
      lng: data.lng || 77.209,
    },
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />

      <div className="max-w-7xl mx-auto px-5 lg:px-10 pt-28 pb-16">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
              {data.name}
            </h1>
            <span className="bg-primary text-primary-foreground bg-[#2D3F33] px-3 py-1 rounded-full text-xs font-semibold">
              {type.replace("-", " ").toUpperCase()}
            </span>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mt-1"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        {/* Rating & Location */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-foreground">
              {data.rating || 4.5}
            </span>
            <span>({data.reviews || 0} reviews)</span>
          </div>
          <span className="text-border hidden sm:block">•</span>
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{address}</span>
          </div>
        </div>

        {/* Gallery */}
        {photos.length > 0 ? (
          <div className={`grid gap-2 mb-10 rounded-2xl overflow-hidden h-[420px] ${
            photos.length === 1 ? "grid-cols-1" :
            photos.length === 2 ? "grid-cols-2" :
            photos.length === 3 ? "grid-cols-3" : "grid-cols-4 grid-rows-2"
          }`}>
            {/* Main/First Image */}
            <div
              className={`${photos.length >= 4 ? "col-span-2 row-span-2" : "col-span-1 h-full"} cursor-pointer overflow-hidden relative group`}
              onClick={() => setLightboxIndex(0)}
            >
              <img
                src={photos[0]}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== "/hero-illustrated.jpg") {
                    target.src = "/hero-illustrated.jpg";
                  }
                }}
              />
            </div>

            {/* Additional Images (up to 3 more for grid of 4) */}
            {photos.length > 1 && photos.slice(1, 4).map((photo, index) => (
              <div
                key={index + 1}
                className={`cursor-pointer overflow-hidden group ${photos.length < 4 ? "h-full" : ""}`}
                onClick={() => setLightboxIndex(index + 1)}
              >
                <img
                  src={photo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== "/hero-illustrated.jpg") {
                      target.src = "/hero-illustrated.jpg";
                    }
                  }}
                />
              </div>
            ))}

            {/* View All Photos Overlay (Only if we have 5 or more) */}
            {photos.length >= 5 && (
              <div
                className="cursor-pointer overflow-hidden group relative"
                onClick={() => setLightboxIndex(0)}
              >
                <img
                  src={photos[4]}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-75"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center top-0 left-0 bg-black/40 hover:bg-black/20 transition-colors">
                  <span className="text-white font-medium">+{photos.length - 4} more photos</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-[420px] mb-10 rounded-2xl bg-muted flex items-center justify-center">
            <img 
              src="/hero-illustrated.jpg" 
              alt="Workspace Placeholder" 
              className="w-full h-full object-cover opacity-50"
            />
          </div>
        )}

        {/* Lightbox */}
        {lightboxIndex !== null && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(null);
              }}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(
                  (lightboxIndex - 1 + photos.length) % photos.length,
                );
              }}
              className="absolute left-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <img
              src={photos[lightboxIndex]}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((lightboxIndex + 1) % photos.length);
              }}
              className="absolute right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <div className="absolute bottom-6 text-white/70 text-sm font-medium">
              {lightboxIndex + 1} / {photos.length}
            </div>
          </div>
        )}

        {/* Content & Sidebar */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Info */}
          <div className="flex-1 min-w-0">
            <section className="mb-8">
              <h2 className="text-xl font-bold text-foreground mb-3">
                About this space
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {data.description ||
                  `${data.name} is a premium workspace located in ${data.area || data.city}. Perfect for startups, freelancers, and enterprises looking for a professional business address and workspace solutions.`}
              </p>
            </section>

            <div className="border-t border-border/50 mb-8" />

            <section className="mb-8">
              <h2 className="text-xl font-bold text-foreground mb-4">
                What this place offers
              </h2>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {(
                  data.features ||
                  data.amenities || ["High-Speed WiFi", "24/7 Access", "Coffee"]
                ).map((f: string, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-sm text-foreground"
                  >
                    {getAmenityIcon(f)}
                    <span className="font-medium">{f}</span>
                  </div>
                ))}
              </div>
            </section>

            <div className="border-t border-border/50 mb-8" />

            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">
                Where you'll be
              </h2>
              <div className="rounded-[12px] overflow-hidden border border-border/50 h-80 shadow-inner">
                <MapLibreMap
                  markers={mapData.map((ws) => ({
                    id: ws._id,
                    position: { lat: ws.lat, lng: ws.lng },
                    title: ws.name,
                    image: ws.image,
                    address: ws.address,
                    rating: ws.rating,
                    price: ws.price,
                  }))}
                  center={{ lat: data.lat || 28.6139, lng: data.lng || 77.209 }}
                  zoom={14}
                  height="100%"
                  mapStyle="retro"
                />
              </div>
              <p className="text-sm font-medium text-muted-foreground mt-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {address}
              </p>
            </section>
          </div>

          {/* Booking Sidebar */}
          <div className="w-full lg:w-[380px] flex-shrink-0">
            {type === "virtual-office" && renderVirtualOfficeBooking()}
            {type === "coworking" && renderCoworkingBooking()}
            {type === "on-demand" && renderOnDemandBooking()}
          </div>
        </div>
      </div>
      <MeetingBookingModal
        isOpen={isMeetingModalOpen}
        onClose={() => setIsMeetingModalOpen(false)}
        item={{
          ...data,
          _id: data._id || id,
          name: data.name,
          address: address,
          area: data.area || data.city || "",
          price: data.price || "N/A",
          rating: data.rating || data.avgRating || 0,
          reviews: data.reviews || data.totalReviews || 0,
          features: data.features || data.amenities || [],
        } as any}
      />
      <Footer />
    </div>
  );
};

export default WorkspaceDetail;
