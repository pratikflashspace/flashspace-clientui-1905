import { useState, useEffect, useMemo, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GetInTouchModal } from "@/components/modals/GetInTouchModal";
import {
  Search,
  Star,
  MapPin,
  List,
  LayoutGrid,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Bookmark,
  ShoppingCart,
  Phone,
  Flame,
  Map as MapIcon,
  CheckCircle,
  CheckCircle2,
  BadgeCheck,
  BadgePercent,
  Sparkles
} from "lucide-react";
import hotToast from "react-hot-toast";
import { SkeletonCardGrid } from "@/components/ui/skeleton-loaders";
import MapLibreMap from "@/components/Map/MapLibreMap";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import {
  createPaymentOrder,
  openRazorpayCheckout,
  reportPaymentFailure,
  simulatePayment,
  verifyPayment,
} from "@/services/payment.service";
import {
  clearCheckoutState,
  getLoginRedirectUrl,
  persistCheckoutState,
} from "@/utils/checkoutSession";
import {
  getVirtualOfficesByCity,
  getAvailableCities,
} from "@/services/virtualOffice.service";
import { getCoworkingSpacesByCity } from "@/services/coworkingSpace.service";
import { getMeetingRoomsByCity } from "@/services/meetingRoom.service";
import { validateCoupon } from "@/services/coupon.service";

import { ListingItem } from "@/components/services/ListingCardModern";
import { getSafeImageUrl, isInvalidImageUrl } from "@/utils/imageUrl";
import { getShortAddress } from "@/utils/address";

// Static placeholders for fallback/missing data
// import connaughtPlace1 from "@/assets/connaught-place-1.png";

type ViewMode = "list" | "grid";

// Make it match the shape they provided
interface UnifiedWorkspace {
  id: string;
  name: string;
  location: string;
  address: string;
  rating: number;
  reviews: number;
  tags: string[];
  plans: { label: string; price: string }[];
  image: string;
  images: string[];
  popular: boolean;
  available: boolean;
  negotiable: boolean;
  lat: number;
  lng: number;
  spaceId?: string;
  description?: string;
  features?: string[];
  timeline?: string;
}


const DEFAULT_WORKSPACE_IMAGE = "/hero-illustrated.jpg";
const PAGE_SIZE = 20;

const formatInr = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  nextPage?: number | null;
  prevPage?: number | null;
};

const isPubliclyVisibleWorkspace = (space: any) => {
  const approvalStatus = String(space?.approvalStatus ?? "").toLowerCase();
  const propertyStatus = String(space?.property?.status ?? "").toLowerCase();
  const isPublished =
    approvalStatus === "active" || propertyStatus === "active";
  const isExplicitlyPending = [
    "draft",
    "pending_kyc",
    "pending_admin",
    "rejected",
    "suspended",
  ].includes(approvalStatus) && propertyStatus !== "active";

  return (
    space?.isDeleted !== true &&
    space?.isActive !== false &&
    (isPublished || (!approvalStatus && !propertyStatus)) &&
    !isExplicitlyPending
  );
};

/** Custom city dropdown with always-visible clickable chevron arrows */
const CityDropdown = ({
  activeCity,
  cities,
  loading,
  onSelect,
  disabled,
}: {
  activeCity: string;
  cities: string[];
  loading: boolean;
  onSelect: (city: string) => void;
  disabled?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const scroll = (dir: "up" | "down") => {
    if (listRef.current) {
      listRef.current.scrollBy({ top: dir === "up" ? -120 : 120, behavior: "smooth" });
    }
  };

  return (
    <div className="sm:w-[160px] relative" ref={containerRef}>
      <button
        onClick={() => !disabled && setOpen(!open)}
        disabled={loading || disabled}
        className={`flex items-center gap-1.5 border border-border/60 rounded-xl h-10 text-sm font-medium px-4 w-full transition-all duration-200 bg-card text-foreground focus:outline-none focus:ring-[3px] focus:ring-[#36503F]/20 focus:border-[#36503F] ${open ? "ring-[3px] ring-[#36503F]/20 border-[#36503F]" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-border hover:shadow-sm"}`}
      >
        <MapPin className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
        <span className="flex-1 text-left truncate">{loading ? "Loading..." : activeCity}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-full bg-popover border border-border rounded-xl shadow-lg z-[9999] flex flex-col overflow-hidden">
          {/* Always-visible UP chevron */}
          <button
            type="button"
            onClick={() => scroll("up")}
            className="flex items-center justify-center py-1.5 border-b border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer shrink-0"
          >
            <ChevronUp className="h-4 w-4" />
          </button>

          {/* Scrollable city list */}
          <div ref={listRef} className="max-h-[200px] overflow-y-auto overscroll-contain">
            {cities.length > 0 ? (
              cities.map((city) => (
                <button
                  key={city}
                  onClick={() => { onSelect(city); setOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-[#FEF8CF] hover:text-[#1a2b21] ${city === activeCity ? "bg-[#FEF8CF]/60 font-medium text-primary" : "text-popover-foreground"
                    }`}
                >
                  {city}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-muted-foreground">No cities available</div>
            )}
          </div>

          {/* Always-visible DOWN chevron */}
          <button
            type="button"
            onClick={() => scroll("down")}
            className="flex items-center justify-center py-1.5 border-t border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer shrink-0"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

const DiscountBanner = ({ onClick }: { onClick: () => void }) => (
  <div className="w-full bg-[#F0F5F2] rounded-xl flex items-center justify-between p-4 sm:p-5 mt-4 mb-2 shadow-sm border border-[#E9EFEA]">
    <div className="flex items-center gap-3 sm:gap-4">
      <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-white border border-[#E9EFEA] shadow-[0_2px_10px_rgba(0,0,0,0.03)] shrink-0">
        <BadgePercent className="w-6 h-6 text-[#10B981]" />
      </div>
      <div className="flex flex-col">
        <h4 className="text-[15px] sm:text-[17px] font-bold text-[#1a2b21] mb-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>Looking for the Best Deal?</h4>
        <p className="text-[12px] sm:text-[14px] text-[#425e4c] font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>Connect with our experts to unlock exclusive pricing.</p>
      </div>
    </div>
    <button onClick={onClick} className="bg-[#36503F] text-[#FEF8C5] px-4 sm:px-6 py-2.5 rounded-[12px] text-[13px] sm:text-[14px] font-semibold hover:bg-[#2A4032] transition-colors whitespace-nowrap shadow-sm">
      Get Best Price
    </button>
  </div>
);

export const WorkspacesFAQ = ({ city, type }: { city: string, type: string }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const typeName = type === "virtual-office" ? "Virtual Office" : type === "coworking" ? "Coworking Space" : "Business Setup";

  const existingFaqs = [
    { question: `What is included in the ${typeName} amenities in ${city}?`, answer: `Our ${typeName.toLowerCase()} workspaces in ${city} typically include high-speed Wi-Fi, ergonomic furniture, access to meeting rooms, printing facilities, and complimentary tea/coffee.` },
    { question: `Can I book a workspace in ${city} for just a few hours?`, answer: `Yes, many of our partner locations in ${city} offer hourly, daily, and weekly passes depending on your requirement.` },
    { question: `Is parking available at the ${city} locations?`, answer: `Most locations in ${city} offer dedicated or shared parking spaces. Please check the specific workspace details for exact parking availability.` },
    { question: "How does the pricing and discount work?", answer: "You can lock in the best price directly through FlashSpace. For bulk bookings or long-term commitments, our experts can negotiate additional discounts." },
  ];

  const virtualOfficeFaqs = [
    { question: `What is a virtual office?`, answer: `A virtual office provides a business address, mail handling, and telephone answering services without physical office space. It allows businesses to establish a professional presence while working remotely.` },
    { question: `Are virtual offices legal in India?`, answer: `Yes, virtual offices are completely legal in India. They are widely used for company incorporation and GST registration as long as you have the required compliance documents such as NOC, Rent Agreement, and Utility Bills.` },
    { question: `How much does a virtual office cost in ${city}?`, answer: `Virtual office pricing in ${city} generally starts from ₹849 per month, depending on the location and specific services you require like GST registration or mailing handling.` },
    { question: `Can I use a virtual office for company registration in ${city}?`, answer: `Yes, you can use a virtual office for company registration in ${city}. We provide all the necessary documents including a No Objection Certificate (NOC) and electricity bill for Registrar of Companies (ROC) compliance.` },
    { question: `Can I use a virtual office for GST registration in ${city}?`, answer: `Absolutely. A virtual office is a fully compliant solution for GST registration in ${city}. We provide the required documentation such as a rent agreement and utility bills for GST approval.` },
    { question: `How does a virtual office differ from a traditional office in ${city}?`, answer: `Unlike a traditional office in ${city} which requires physical space, high rent, and maintenance costs, a virtual office provides you with a premium business address and compliance documents at a fraction of the cost, without the dedicated physical workspace.` },
    { question: `What documents do I require to buy a virtual office in ${city}?`, answer: `To purchase a virtual office in ${city}, you typically need to provide your PAN card, Aadhaar card, Certificate of Incorporation (if already registered), and passport-size photographs of the directors.` }
  ];

  const faqs = type === "virtual-office" ? [...virtualOfficeFaqs, ...existingFaqs] : existingFaqs;

  return (
    <div className="w-full bg-[#F4F7F5] border-t border-border/40 mt-12 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />
      <div className="fs-container max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#1a2b21] mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>Frequently Asked Questions about {typeName} in {city}</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-border/60 rounded-xl overflow-hidden bg-white shadow-sm transition-all">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none hover:bg-muted/30 transition-colors"
              >
                <span className="font-semibold text-[#1a2b21] text-[15px]">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`} />
              </button>
              <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? "max-h-40 pb-4 opacity-100" : "max-h-0 opacity-0"}`}>
                <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const WorkspaceCard = ({
  ws,
  view,
  type,
  onBusinessSetupBuy,
  zoomedCardId,
  onCardZoom,
}: {
  ws: UnifiedWorkspace;
  view: ViewMode;
  type: string;
  onBusinessSetupBuy?: (workspace: UnifiedWorkspace) => void;
  zoomedCardId?: string;
  onCardZoom?: (cardId: string) => void;
}) => {
  const { toast } = useToast();
  const [liked, setLiked] = useState(false);
  const [carted, setCarted] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  const navigate = useNavigate();
  const handleNavigate = () => {
    if (type === "virtual-office") navigate(`/space/${ws.id}`);
    else if (type === "coworking") navigate(`/coworking-space/${ws.id}`);
    else navigate(`/meeting-room/${ws.id}`);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !liked;
    setLiked(next);
    toast({
      title: next ? "Saved to your wishlist" : "Removed from wishlist",
      description: next
        ? `${ws.location} has been saved.`
        : `${ws.location} has been removed.`,
    });
  };

  const handleCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !carted;
    setCarted(next);
    toast({
      title: next ? "Added to cart" : "Removed from cart",
      description: next
        ? `${ws.location} has been added to your cart.`
        : `${ws.location} has been removed from your cart.`,
    });
  };

  const rawImages = ws.images && ws.images.length > 0 ? ws.images : [ws.image];
  const images = rawImages
    .filter((img) => !isInvalidImageUrl(img))
    .map((img) => getSafeImageUrl(img));

  if (images.length === 0) images.push(DEFAULT_WORKSPACE_IMAGE);

  const bookingItem: ListingItem = {
    _id: ws.id,
    name: ws.name,
    address: ws.address,
    area: ws.location || ws.address,
    price: ws.plans?.[0]?.price || "Price on request",
    rating: ws.rating,
    reviews: ws.reviews,
    features: ws.tags || [],
    image: ws.image,
    images: ws.images,
    popular: ws.popular,
    availability: ws.available ? "Available Now" : "Fully Booked",
    coordinates: { lat: ws.lat, lng: ws.lng },
  };

  console.log(`🏠 Rendering Card: ${ws.name}, WS OBJECT:`, JSON.stringify(ws, null, 2));

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIndex((i) => (i - 1 + images.length) % images.length);
  };
  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIndex((i) => (i + 1) % images.length);
  };

  if (type === "business-setup") {
    const cardSlug = ws.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const isZoomed = zoomedCardId === cardSlug;
    return (
      <div
        id={`bs-card-${cardSlug}`}
        onClick={() => onCardZoom?.(isZoomed ? "" : cardSlug)}
        style={{
          transform: isZoomed ? 'scale(1.08)' : 'scale(1)',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isZoomed ? '0 30px 60px rgba(0,0,0,0.25)' : undefined,
          zIndex: isZoomed ? 50 : undefined,
          position: isZoomed ? 'relative' as const : undefined,
        }}
        className={`group bg-[#F8FAF9] rounded-[24px] overflow-hidden border ${isZoomed ? 'border-[#36503F]' : 'border-[#E9EFEA]'} hover:-translate-y-1.5 transition-all duration-200 ease-out shadow-sm hover:shadow-md flex flex-col p-6 cursor-pointer h-full`}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="pr-2">
            <h3 className="font-semibold text-[14px] text-[#1a2b21] leading-snug tracking-tight">
              {ws.name}
            </h3>
            <p className="text-[13px] text-[#6B8F78] mt-2.5 min-h-[44px] leading-relaxed">
              {ws.description}
            </p>
          </div>
          {ws.popular && (
            <span className="flex items-center gap-1.5 text-[11px] font-medium px-3 py-1 rounded-full bg-[#F0F5F2] text-[#425e4c] flex-shrink-0">
              <span className="animate-pulse">🔥</span> Popular
            </span>
          )}
        </div>

        {/* Features */}
        <div className="flex flex-col gap-3 mb-4 mt-2">
          {ws.features?.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-3 text-[14px] text-[#6B8F78]">
              <span className="w-5 h-5 rounded-full bg-[#E5F3EB] flex items-center justify-center flex-shrink-0">
                <span className="w-2.5 h-2.5 bg-[#10B981] rounded-full"></span>
              </span>
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {/* Bottom / Pricing */}
        <div className="mt-auto border-t border-[#E9EFEA] pt-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] font-medium text-[#7A9D88]">Starting from</span>
              <span className="text-[20px] font-bold text-[#1a2b21]">{ws.plans[0]?.price}</span>
            </div>
            <div className="flex flex-col gap-0.5 text-right">
              <span className="text-[12px] font-medium text-[#7A9D88]">Timeline</span>
              <span className="text-[15px] font-semibold text-[#1a2b21]">{ws.timeline || "N/A"}</span>
            </div>
          </div>

          <div className="flex gap-3">
            {!(type === "business-setup" && ws.plans[0]?.price?.toLowerCase().includes("custom")) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBusinessSetupBuy?.(ws);
                }}
                className="flex-1 bg-[#36503F] text-[#FEF8C5] text-[14px] font-semibold py-3 px-4 rounded-[12px] hover:bg-[#2A4032] transition-colors flex items-center justify-center shadow-sm"
              >
                Buy Now
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = "tel:+919888687898";
              }}
              className="flex-1 flex items-center justify-center gap-2 border border-[#36503F] bg-transparent text-[#36503F] text-[14px] font-semibold py-3 px-2 rounded-[12px] hover:bg-[#36503F]/5 transition-colors"
            >
              <Phone className="w-4 h-4" />
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === "list") {
    return (
      <div
        onClick={type !== "business-setup" ? handleNavigate : undefined}
        className={`flex gap-6 sm:gap-8 group bg-card rounded-2xl border border-border/60 p-4 shadow-soft transition-all duration-200 ${type !== "business-setup" ? "cursor-pointer hover:shadow-soft-lg" : "cursor-default"}`}
      >
        {/* Image — fixed size, never shrinks */}
        <div className="relative w-1/3 h-36 sm:h-44 flex-shrink-0 rounded-xl overflow-hidden">
          <img
            src={images[imgIndex]}
            alt={ws.name}
            onError={(e) => {
              e.currentTarget.src = DEFAULT_WORKSPACE_IMAGE;
            }}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          {ws.popular && type !== "business-setup" && (
            <span className="absolute top-2 left-2 flex items-center gap-1 text-[10px] font-normal px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground shadow-sm">
              <Flame className="w-2.5 h-2.5" /> Popular
            </span>
          )}
          {type !== "business-setup" && (
            <span
              className={`absolute bottom-2 left-2 text-[10px] font-normal px-2 py-0.5 rounded-full backdrop-blur-sm text-white shadow-sm ${ws.available ? "bg-black/50" : "bg-black/60"}`}
            >
              {ws.available ? "Available Now" : "Fully Booked"}
            </span>
          )}
        </div>

        {/* Content — all stacked vertically */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          {/* Name + Rating + Actions */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-[15px] text-foreground leading-snug tracking-[1px] truncate px-1" style={{ fontFamily: "'Inter', sans-serif" }}>
              {ws.spaceId || ws.name}
              {ws.address && ` at ${getShortAddress(ws.address)}`}
            </h3>
            <div className="flex items-center gap-2 flex-shrink-0">

              <button
                onClick={handleSave}
                className="w-7 h-7 rounded-full bg-muted/60 flex items-center justify-center hover:bg-muted transition-all duration-200"
              >
                <Bookmark
                  className={`w-3.5 h-3.5 transition-all duration-200 ${liked ? "fill-primary text-primary scale-110" : "text-foreground/60"}`}
                />
              </button>
              <button
                onClick={handleCart}
                className="w-7 h-7 rounded-full bg-muted/60 flex items-center justify-center hover:bg-muted transition-all duration-200"
              >
                <ShoppingCart
                  className={`w-3.5 h-3.5 transition-all duration-200 ${carted ? "fill-primary text-primary scale-110" : "text-foreground/60"}`}
                />
              </button>
              {type !== "business-setup" && (
                <div className="flex items-center gap-1 bg-muted/60 rounded-full px-2 py-0.5">
                  <Star className="w-3 h-3 fill-gold text-gold" />
                  <span className="text-xs font-semibold text-foreground">
                    {ws.rating}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    ({ws.reviews})
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          {type !== "business-setup" && (
            <div className="flex flex-wrap gap-1.5">
              {ws.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] px-2.5 py-0.5 rounded-full border border-border/70 text-muted-foreground bg-muted/40"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-border/50 mt-1" />

          {/* Pricing */}
          <div className="space-y-1">
            {ws.plans.map((plan) => (
              <div key={plan.label} className="flex items-center justify-between gap-3">
                <span className="text-[11px] text-muted-foreground w-24 flex-shrink-0">
                  {plan.label}
                </span>
                <span className="text-xs font-normal text-foreground text-right">
                  {plan.price}
                </span>
              </div>
            ))}
          </div>

          {/* CTAs — always on their own row */}
          <div className="flex gap-3 mt-3 w-full">
            {type !== "business-setup" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigate();
                }}
                className="flex-1 py-2.5 px-4 text-xs font-bold rounded-[12px] bg-[#36503F] text-[#FEF8C5] hover:bg-[#1F2E26] transition-all duration-200 whitespace-nowrap text-center shadow-sm"
              >
                Get Best Price
              </button>
            )}
            {!(type === "business-setup" && ws.plans[0]?.price?.toLowerCase().includes("custom")) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (type === "business-setup") {
                    onBusinessSetupBuy?.(ws);
                  } else {
                    window.location.href = "tel:+919888687898";
                  }
                }}
                className={`flex-1 py-2.5 px-4 text-xs font-semibold rounded-[12px] border border-[#36503F] transition-all duration-200 flex items-center justify-center gap-1.5 whitespace-nowrap ${type === "business-setup"
                    ? "bg-[#36503F] text-[#FEF8C5] hover:bg-[#1F2E26] shadow-sm"
                    : "bg-transparent text-[#36503F] hover:bg-[#36503F]/5"
                  }`}
              >
                {type === "business-setup" ? <ShoppingCart className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />}
                {type === "business-setup" ? "Buy Now" : "Contact Sales"}
              </button>
            )}
            {type === "business-setup" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = "tel:+919888687898";
                }}
                className="flex-1 py-2.5 px-4 text-xs font-semibold rounded-[12px] border border-[#36503F] bg-white text-[#36503F] hover:bg-[#36503F]/10 transition-all duration-200 flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <Phone className="w-3.5 h-3.5" />
                Contact
              </button>
            )}
          </div>
        </div>

      </div>
    );
  }

  // Grid view
  return (
    <div
      onClick={type !== "business-setup" ? handleNavigate : undefined}
      className={`group bg-card rounded-2xl border border-border/60 shadow-soft transition-all duration-200 overflow-hidden flex flex-col ${type !== "business-setup" ? "cursor-pointer hover:shadow-soft-lg" : "cursor-default"}`}
    >
      {/* Image Section */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={images[imgIndex]}
          alt={ws.name}
          onError={(e) => {
            e.currentTarget.src = DEFAULT_WORKSPACE_IMAGE;
          }}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

        {/* Popular badge */}
        {ws.popular && type !== "business-setup" && (
          <span className="absolute top-3 left-3 flex items-center gap-1 text-[10px] font-normal px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground shadow-sm">
            <Flame className="w-2.5 h-2.5" /> Popular
          </span>
        )}

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            onClick={handleSave}
            className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white hover:scale-110 transition-all duration-200"
          >
            <Bookmark
              className={`w-3.5 h-3.5 transition-all duration-200 ${liked ? "fill-primary text-primary scale-110" : "text-foreground/60"}`}
            />
          </button>
          <button
            onClick={handleCart}
            className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white hover:scale-110 transition-all duration-200"
          >
            <ShoppingCart
              className={`w-3.5 h-3.5 transition-all duration-200 ${carted ? "fill-primary text-primary scale-110" : "text-foreground/60"}`}
            />
          </button>
        </div>

        {/* Availability + image nav arrows */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          {type !== "business-setup" ? (
            <span
              className={`text-[10px] font-normal px-3 py-1 rounded-full backdrop-blur-sm text-white shadow-sm ${ws.available ? "bg-black/50" : "bg-black/60"}`}
            >
              {ws.available ? "Available Now" : "Fully Booked"}
            </span>
          ) : <div />}
          {images.length > 1 && (
            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={prevImg}
                className="w-6 h-6 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-foreground/70" />
              </button>
              <button
                onClick={nextImg}
                className="w-6 h-6 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-all"
              >
                <ChevronRight className="w-3.5 h-3.5 text-foreground/70" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Name + Rating */}
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-[15px] text-foreground leading-snug tracking-[1px] truncate px-1" style={{ fontFamily: "'Inter', sans-serif" }}>
            {ws.spaceId || ws.name}
            {ws.address && ` at ${getShortAddress(ws.address)}`}
          </h3>
          {type !== "business-setup" && (
            <div className="flex items-center gap-1 flex-shrink-0 bg-muted/60 rounded-full px-2 py-0.5">
              <Star className="w-3 h-3 fill-gold text-gold" />
              <span className="text-xs font-semibold text-foreground">
                {ws.rating}
              </span>
              <span className="text-[11px] text-muted-foreground">
                ({ws.reviews})
              </span>
            </div>
          )}
        </div>

        {/* Tags */}
        {type !== "business-setup" && (
          <div className="flex flex-wrap gap-1.5 mt-2 min-h-[26px]">
            {ws.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] px-2.5 py-0.5 rounded-full border border-border/70 text-muted-foreground bg-muted/40 hover:bg-muted/80 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-border/60 mt-2 mb-2" />

        {/* Plan rows — grows to push CTA down */}
        <div className="space-y-2 flex-1">
          {ws.plans.map((plan) => (
            <div key={plan.label} className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">
                {plan.label}
              </span>
              <span className="text-[13px] font-normal text-foreground">
                {plan.price}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Buttons — always at bottom */}
        <div className="flex gap-2 mt-4">
          {type !== "business-setup" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNavigate();
              }}
              className="flex-1 py-2.5 px-2 text-[12px] font-bold rounded-[12px] bg-[#36503F] text-[#FEF8C5] hover:bg-[#1F2E26] transition-all duration-200 whitespace-nowrap text-center shadow-sm"
            >
              Get Best Price
            </button>
          )}
          {!(type === "business-setup" && ws.plans[0]?.price?.toLowerCase().includes("custom")) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (type === "business-setup") {
                  onBusinessSetupBuy?.(ws);
                } else {
                  window.location.href = "tel:+919888687898";
                }
              }}
              className={`flex-1 py-2.5 px-2 text-[12px] font-semibold rounded-[12px] border border-[#36503F] transition-all duration-200 flex items-center justify-center gap-1.5 whitespace-nowrap ${type === "business-setup"
                  ? "bg-[#36503F] text-[#FEF8C5] hover:bg-[#1F2E26] shadow-sm"
                  : "bg-transparent text-[#36503F] hover:bg-[#36503F]/5"
                }`}
            >
              {type === "business-setup" ? <ShoppingCart className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />}
              <span>{type === "business-setup" ? "Buy Now" : "Contact Sales"}</span>
            </button>
          )}
          {type === "business-setup" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = "tel:+919888687898";
              }}
              className="flex-1 py-2.5 px-3 text-xs font-semibold rounded-[12px] border border-[#36503F] bg-white text-[#36503F] hover:bg-[#36503F]/10 transition-all duration-200 flex items-center justify-center gap-1.5"
            >
              <Phone className="w-3 h-3" />
              <span>Contact</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
};

const GetWorkspaces = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const searchParams = new URLSearchParams(location.search);
  const initialCity = searchParams.get("city") || "Delhi";
  const checkoutReturnTo = `${location.pathname}${location.search}${location.hash}`;

  const getInitialType = () => {
    if (location.pathname.includes("coworking")) return "coworking";
    if (
      location.pathname.includes("business-setup") ||
      location.pathname.includes("businessSetup")
    )
      return "business-setup";
    return "virtual-office";
  };
  const [activeCity, setActiveCity] = useState(initialCity);
  const [workspaceType, setWorkspaceType] = useState(getInitialType());
  const [selectedBusinessSetup, setSelectedBusinessSetup] = useState<UnifiedWorkspace | null>(null);
  const [businessPaymentLoading, setBusinessPaymentLoading] = useState(false);
  const [businessTestPaymentLoading, setBusinessTestPaymentLoading] = useState(false);
  const [zoomedCardId, setZoomedCardId] = useState("");
  const [mapFullscreen, setMapFullscreen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [showExpandMapBtn, setShowExpandMapBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 550) {
        setShowExpandMapBtn(true);
      } else {
        setShowExpandMapBtn(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle hash-based zoom for business setup cards (from header navigation)
  useEffect(() => {
    if (workspaceType === "business-setup" && location.hash) {
      let hashId = location.hash.substring(1);
      if (hashId.startsWith('bs-card-')) {
        hashId = hashId.replace('bs-card-', '');
      }

      // Wait for cards to render then scroll and zoom
      const timer = setTimeout(() => {
        const el = document.getElementById(`bs-card-${hashId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setZoomedCardId(hashId);
        }
      }, 500); // reduced timeout slightly since ScrollToTop also does it
      return () => clearTimeout(timer);
    }
  }, [workspaceType, location.hash, location.key]);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const parseBusinessSetupPrice = (workspace: UnifiedWorkspace) => {
    const price = workspace.plans?.[0]?.price || "";
    const match = price.match(/[\d,]+/);
    return match ? Number(match[0].replace(/,/g, "")) : 0;
  };

  const redirectToMyBookings = () => {
    hotToast.success("Payment successful. Redirecting to My Bookings...");
    setTimeout(() => {
      navigate("/dashboard/my-bookings");
    }, 3000);
  };

  const buildBusinessSetupPaymentPayload = (
    workspace: UnifiedWorkspace,
    basePrice: number,
    totalAmount: number,
    discountAmount: number,
    couponCodeString?: string
  ) => ({
    userEmail: user!.email,
    userName: user!.fullName || user!.email,
    userPhone: (user as any).phoneNumber,
    spaceName: workspace.name,
    planName: workspace.name,
    planKey: `business_setup_${workspace.id}`,
    tenure: 0,
    yearlyPrice: basePrice,
    totalAmount,
    discountPercent: appliedCoupon?.discountType === 'percentage' ? appliedCoupon.discountValue : 0,
    discountAmount: discountAmount,
    couponCode: couponCodeString,
    paymentType: "business_setup" as const,
  });

  const handleBusinessSetupPayment = async () => {
    if (!selectedBusinessSetup) return;

    if (!isAuthenticated || !user) {
      hotToast.error("Please login to continue with your purchase");
      persistCheckoutState(
        {
          page: "business-setup",
          path: checkoutReturnTo,
          serviceId: selectedBusinessSetup.id,
          serviceName: selectedBusinessSetup.name,
        },
        checkoutReturnTo,
      );
      navigate(getLoginRedirectUrl(checkoutReturnTo), {
        state: { redirectTo: checkoutReturnTo },
      });
      return;
    }

    const basePrice = parseBusinessSetupPrice(selectedBusinessSetup);
    if (!basePrice) {
      hotToast.error("Package price is not available");
      return;
    }

    let couponDiscount = 0;
    if (appliedCoupon && basePrice > 0) {
      if (appliedCoupon.discountType === 'percentage') {
        couponDiscount = (basePrice * appliedCoupon.discountValue) / 100;
        if (appliedCoupon.maxDiscount && couponDiscount > appliedCoupon.maxDiscount) {
          couponDiscount = appliedCoupon.maxDiscount;
        }
      } else {
        couponDiscount = appliedCoupon.discountValue;
      }
      couponDiscount = Math.round(couponDiscount);
    }

    const taxableAmount = Math.max(basePrice - couponDiscount, 0);
    const gstAmount = Number((taxableAmount * 0.18).toFixed(2));
    const totalAmount = taxableAmount + gstAmount;
    setBusinessPaymentLoading(true);

    try {
      const order = await createPaymentOrder(
        buildBusinessSetupPaymentPayload(selectedBusinessSetup, basePrice, totalAmount, couponDiscount, appliedCoupon?.code),
      );

      if (order.devMode) {
        hotToast.loading("Simulating payment...", { id: "business-setup-payment" });
        await simulatePayment(order.orderId);
        hotToast.dismiss("business-setup-payment");
        clearCheckoutState();
        setSelectedBusinessSetup(null);
        redirectToMyBookings();
        return;
      }

      await openRazorpayCheckout({
        orderId: order.orderId,
        amount: order.amount,
        currency: order.currency,
        keyId: order.keyId,
        userEmail: user.email,
        userName: user.fullName || user.email,
        userPhone: (user as any).phoneNumber,
        spaceName: selectedBusinessSetup.name,
        planName: selectedBusinessSetup.name,
        onSuccess: async (response) => {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            clearCheckoutState();
            setSelectedBusinessSetup(null);
            redirectToMyBookings();
          } catch (error) {
            hotToast.error("Payment verification failed. Please contact support.");
          }
        },
        onFailure: (error) => {
          reportPaymentFailure(order.orderId, error.code, error.description);
          navigate(`/payment/failed?orderId=${order.orderId}`);
        },
        onDismiss: () => hotToast("Payment cancelled"),
      });
    } catch (error: any) {
      hotToast.error(error?.message || "Failed to start payment. Please try again.");
    } finally {
      setBusinessPaymentLoading(false);
    }
  };

  const handleBusinessSetupTestPayment = async () => {
    if (!selectedBusinessSetup) return;

    if (!isAuthenticated || !user) {
      hotToast.error("Please login to continue with your purchase");
      persistCheckoutState(
        {
          page: "business-setup",
          path: checkoutReturnTo,
          serviceId: selectedBusinessSetup.id,
          serviceName: selectedBusinessSetup.name,
        },
        checkoutReturnTo,
      );
      navigate(getLoginRedirectUrl(checkoutReturnTo), {
        state: { redirectTo: checkoutReturnTo },
      });
      return;
    }

    const basePrice = parseBusinessSetupPrice(selectedBusinessSetup);
    if (!basePrice) {
      hotToast.error("Package price is not available");
      return;
    }

    let couponDiscount = 0;
    if (appliedCoupon && basePrice > 0) {
      if (appliedCoupon.discountType === 'percentage') {
        couponDiscount = (basePrice * appliedCoupon.discountValue) / 100;
        if (appliedCoupon.maxDiscount && couponDiscount > appliedCoupon.maxDiscount) {
          couponDiscount = appliedCoupon.maxDiscount;
        }
      } else {
        couponDiscount = appliedCoupon.discountValue;
      }
      couponDiscount = Math.round(couponDiscount);
    }

    const taxableAmount = Math.max(basePrice - couponDiscount, 0);
    const gstAmount = Number((taxableAmount * 0.18).toFixed(2));
    const totalAmount = taxableAmount + gstAmount;
    setBusinessTestPaymentLoading(true);

    try {
      hotToast.loading("Creating test order...", { id: "business-setup-test-payment" });
      const order = await createPaymentOrder(
        buildBusinessSetupPaymentPayload(selectedBusinessSetup, basePrice, totalAmount, couponDiscount, appliedCoupon?.code),
      );
      hotToast.loading("Simulating payment success...", { id: "business-setup-test-payment" });
      await simulatePayment(order.orderId);
      hotToast.dismiss("business-setup-test-payment");
      clearCheckoutState();
      setSelectedBusinessSetup(null);
      redirectToMyBookings();
    } catch (error: any) {
      hotToast.dismiss("business-setup-test-payment");
      hotToast.error(error?.message || "Test payment failed.");
    } finally {
      setBusinessTestPaymentLoading(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    if (!isAuthenticated || !user) {
      hotToast.error('Please log in to apply a coupon.');
      return;
    }
    setCouponLoading(true);
    try {
      const result = await validateCoupon(couponCode.trim().toUpperCase(), selectedBusinessSetup?.name);
      if (result.success && result.data) {
        setAppliedCoupon(result.data);
        hotToast.success('Coupon applied successfully!');
      } else {
        setAppliedCoupon(null);
        hotToast.error(result.message || 'Invalid or expired coupon');
      }
    } catch (error: any) {
      setAppliedCoupon(null);
      hotToast.error(error.message || 'Failed to validate coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const city = params.get("city") || "Delhi";
    if (city !== activeCity) {
      setActiveCity(city);
    }
  }, [location.search]);

  // Sync workspaceType with URL changes (e.g., back/forward navigation)
  useEffect(() => {
    const currentType = getInitialType();
    if (workspaceType !== currentType) {
      setWorkspaceType(currentType);
    }
  }, [location.pathname]);

  // Reset pagination whenever type or city changes
  useEffect(() => {
    setPage(1);
  }, [workspaceType, activeCity]);

  const handleWorkspaceTypeChange = (value: string) => {
    setWorkspaceType(value);
    const params = new URLSearchParams(location.search);
    const currentCity = params.get("city") || activeCity;
    const slug = currentCity.toLowerCase().replace(/\s+/g, '-');

    if (value === "coworking")
      navigate(`/services/coworking-space/${slug}`, { replace: true });
    else if (value === "business-setup") navigate(`/services/business-setup`, { replace: true });
    else navigate(`/services/virtual-office/${slug}`, { replace: true });
  };

  const handleCityChange = (city: string) => {
    const params = new URLSearchParams(location.search);
    params.set("city", city);
    // Use replace to avoid cluttering history with filter changes
    navigate({ search: params.toString() }, { replace: true });
    // activeCity state will be updated by the useEffect listening to location.search
  };
  const [searchLocation, setSearchLocation] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const handleSearch = () => {
    setDebouncedSearch(searchLocation);
  };
  const [pricingFilter, setPricingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showMap, setShowMap] = useState(false);
  const [mapCollapsed, setMapCollapsed] = useState(false);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(true);

  const [workspaces, setWorkspaces] = useState<UnifiedWorkspace[]>([]);

  // Handle ?buy= query param to auto-open checkout
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const buyId = params.get("buy");
    if (buyId && workspaces.length > 0 && workspaceType === "business-setup") {
      const match = workspaces.find((ws) => ws.id === buyId);
      if (match && (!selectedBusinessSetup || selectedBusinessSetup.id !== match.id)) {
        setSelectedBusinessSetup(match);
      }
    }
  }, [location.search, workspaces, workspaceType]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);

  const goPrevPage = () => {
    if (pagination?.hasPrevPage) {
      setPage((p) => Math.max(1, p - 1));
    }
  };

  const goNextPage = () => {
    if (pagination?.hasNextPage) {
      setPage((p) => p + 1);
    }
  };

  // Fetch available cities once on mount
  useEffect(() => {
    getAvailableCities().then((cities) => {
      setAvailableCities(cities);
      setCitiesLoading(false);
    }).catch(() => {
      setCitiesLoading(false);
    });
  }, []);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      setLoading(true);
      try {
        let fetchedData: any[] = [];
        if (workspaceType === "business-setup") {
          const headings = [
            "GST Registration",
            "Company Registration (LLP/OPC/Pvt Ltd)",
            "MSME / Udyam Registration",
            "Startup India Registration",
            "FSSAI Registration",
            "GST Filing",
            "LLP Annual Compliance",
            "MCA Annual Compliance",
            "Section 8 Registration",
            "Accounting Services"
          ];
          const demoBusinessSetups = headings.map((heading, i) => {
            let imgPath = `/home${i + 1}.jpg`;
            let price = "4999";
            let description = "";
            let features: string[] = [];
            let timeline = "";

            if (heading === "GST Registration") {
              imgPath = "https://res.cloudinary.com/davqpypmw/image/upload/v1780035733/flashspace_homepage/ibfn2dufkh5ntzzhhxgs.png";
              price = "₹2999 only";
              description = "Get your GST number and start invoicing legally across India.";
              features = ["GSTIN Setup", "PAN & Aadhaar Verification", "Business Address Registration", "Digital Filing Support"];
              timeline = "1-2 days";
            }
            else if (heading.includes("Company Registration")) {
              imgPath = "https://res.cloudinary.com/davqpypmw/image/upload/v1780035723/flashspace_homepage/mk0jvwt95cmpjfbzalqt.png";
              price = "₹11999 only";
              description = "Register your private limited company with end-to-end legal setup.";
              features = ["Company Name Approval", "Incorporation Certificate", "PAN & TAN", "MOA & AOA Filing"];
              timeline = "10-15 days";
            }
            else if (heading.includes("MSME")) {
              imgPath = "https://res.cloudinary.com/davqpypmw/image/upload/v1780035728/flashspace_homepage/ypwhl8p6jtneugh3tqvr.png";
              price = "₹1499 only";
              description = "Unlock MSME benefits, subsidies, and government schemes.";
              features = ["Udyam Registration", "MSME Certificate", "Loan Benefits", "Priority Lending Support"];
              timeline = "1-2 days";
            }
            else if (heading === "Startup India Registration") {
              imgPath = "https://res.cloudinary.com/davqpypmw/image/upload/v1780035719/flashspace_homepage/b4zvehnaldeo6cwtw6qg.png";
              price = "₹1499 only";
              description = "Get DPIIT recognition and startup tax benefits.";
              features = ["DPIIT Recognition", "Tax Exemption Guidance", "Startup Certification", "Investor Ready Setup"];
              timeline = "5-7 days";
            }
            else if (heading === "FSSAI Registration") {
              imgPath = "https://res.cloudinary.com/davqpypmw/image/upload/v1780035714/flashspace_homepage/q69yqywzvahoviaaauch.png";
              price = "₹2999 only";
              description = "Food business license and compliance support for restaurants & brands.";
              features = ["Food License Support", "State/Central License", "Compliance Guidance", "Renewal Support"];
              timeline = "20-30 days";
            }
            else if (heading === "GST Filing") {
              imgPath = "https://res.cloudinary.com/davqpypmw/image/upload/v1780035733/flashspace_homepage/ibfn2dufkh5ntzzhhxgs.png";
              price = "Customized";
              description = "Monthly and annual GST return filing handled by experts.";
              features = ["GSTR-1 Filing", "GSTR-3B Filing", "Invoice Reconciliation", "Input Tax Credit"];
              timeline = "Monthly / Quarterly";
            }
            else if (heading === "LLP Annual Compliance") {
              imgPath = "https://res.cloudinary.com/davqpypmw/image/upload/v1780035723/flashspace_homepage/mk0jvwt95cmpjfbzalqt.png";
              price = "Customized";
              description = "Stay compliant with annual LLP filing and legal requirements.";
              features = ["Annual Filing", "Form 8 & 11", "ROC Compliance", "Partner Updates"];
              timeline = "Ongoing Annual Compliance";
            }
            else if (heading === "MCA Annual Compliance") {
              imgPath = "https://res.cloudinary.com/davqpypmw/image/upload/v1780035728/flashspace_homepage/ypwhl8p6jtneugh3tqvr.png";
              price = "Customized";
              description = "Complete MCA compliance and ROC filing support for companies.";
              features = ["ROC Filing", "Board Resolution Support", "Director KYC", "Annual Returns"];
              timeline = "Monthly / Annual";
            }
            else if (heading === "Section 8 Registration") {
              imgPath = "https://res.cloudinary.com/davqpypmw/image/upload/v1780035714/flashspace_homepage/q69yqywzvahoviaaauch.png";
              price = "₹14999 only";
              description = "Register your NGO or non-profit organization as a Section 8 company.";
              features = ["NGO Registration", "80G & 12A Support", "MOA & AOA Filing", "PAN & TAN"];
              timeline = "15-20 days";
            }
            else if (heading === "Accounting Services") {
              imgPath = "https://res.cloudinary.com/davqpypmw/image/upload/v1780035719/flashspace_homepage/b4zvehnaldeo6cwtw6qg.png";
              price = "Customized";
              description = "Professional accounting and bookkeeping services for your business.";
              features = ["Bookkeeping", "Financial Statements", "Payroll Processing", "Tax Advisory"];
              timeline = "Monthly / Ongoing";
            }

            return {
              id: `bs-${i + 1}`,
              name: heading,
              location: activeCity,
              address: "",
              description,
              features,
              timeline,
              rating: 4.8 + (i % 3) * 0.1,
              reviews: 120 + i * 15,
              tags: ["Compliance", "Registration"],
              plans: [{ label: "Starting at", price: price }],
              image: imgPath,
              images: [imgPath],
              popular: heading === "GST Registration",
              available: true,
              negotiable: true,
              lat: 28.6139,
              lng: 77.209,
              spaceId: `BS-2024-${i + 1}`
            };
          });
          setWorkspaces(demoBusinessSetups);
          setPagination(null);
        } else if (workspaceType === "virtual-office") {
          const { offices, pagination } = await getVirtualOfficesByCity(
            activeCity,
            page,
            PAGE_SIZE,
            debouncedSearch
          );
          setPagination(pagination || null);
          fetchedData = offices.filter(isPubliclyVisibleWorkspace);
          setWorkspaces(
            fetchedData.map((vo) => ({
              id: vo._id || "",
              name: vo.property?.name || vo.name || "Virtual Office",
              location: vo.property?.name || vo.name || vo.area || "City Center",
              address: vo.property?.address || vo.address || "",
              rating: Number(vo.rating ?? 0),
              reviews: Number(vo.reviews ?? 0),
              tags: vo.features?.length
                ? vo.features.slice(0, 3)
                : ["Virtual Office", "Premium Address"],
              plans: [
                ...(vo.gstPlanPrice
                  ? [{ label: "GST Plan", price: vo.gstPlanPrice }]
                  : []),
                ...(vo.mailingPlanPrice
                  ? [{ label: "Mailing Plan", price: vo.mailingPlanPrice }]
                  : []),
                ...(vo.brPlanPrice
                  ? [{ label: "Business Reg", price: vo.brPlanPrice }]
                  : []),
              ],
              image: vo.image || "/hero-illustrated.jpg",
              images:
                Array.isArray(vo.images) && vo.images.length > 0
                  ? vo.images
                  : vo.image
                    ? [vo.image]
                    : ["/hero-illustrated.jpg"],
              popular: vo.popular || false,
              available: vo.availability === "Available Now",
              negotiable: true,
              lat:
                vo.coordinates?.lat ?? vo.location?.coordinates?.[1] ?? 28.6139,
              lng:
                vo.coordinates?.lng ?? vo.location?.coordinates?.[0] ?? 77.209,
              spaceId: vo.spaceId || vo.property?.spaceId || "",
            })),
          );
        } else if (workspaceType === "coworking") {
          const { spaces, pagination } = await getCoworkingSpacesByCity(
            activeCity,
            page,
            PAGE_SIZE,
            debouncedSearch
          );
          setPagination(pagination || null);
          fetchedData = spaces.filter(isPubliclyVisibleWorkspace);
          setWorkspaces(
            fetchedData.map((cw) => ({
              id: cw._id || "",
              name: cw.property?.name || cw.name || "Coworking Space",
              location: cw.property?.name || cw.name || cw.area || "Workspace Hub",
              address: cw.property?.address || cw.address || "",
              rating: Number(cw.rating ?? 0),
              reviews: Number(cw.reviews ?? 0),
              tags: cw.features?.length
                ? cw.features.slice(0, 3)
                : ["High-Speed WiFi", "24/7 Access"],
              plans: [
                ...(cw.price ? [{ label: "Basic Plan", price: cw.price }] : []),
              ],
              image: cw.image || "/hero-illustrated.jpg",
              images:
                Array.isArray(cw.images) && cw.images.length > 0
                  ? cw.images
                  : cw.image
                    ? [cw.image]
                    : ["/hero-illustrated.jpg"],
              popular: cw.popular || false,
              available: true,
              negotiable: true,
              lat:
                cw.coordinates?.lat ?? cw.location?.coordinates?.[1] ?? 28.6139,
              lng:
                cw.coordinates?.lng ?? cw.location?.coordinates?.[0] ?? 77.209,
              spaceId: cw.spaceId || cw.property?.spaceId || "",
            })),
          );
        }
      } catch (error) {
        console.error("Error fetching workspaces:", error);
        setWorkspaces([]); // Fallback
        setPagination(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, [workspaceType, activeCity, page, debouncedSearch]);

  // Client-side filtering logic
  const filteredWorkspaces = useMemo(() => {
    return workspaces.filter((ws) => {
      // Location search filter
      const matchesSearch =
        !debouncedSearch ||
        ws.address.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        ws.location.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        ws.name.toLowerCase().includes(debouncedSearch.toLowerCase());

      // Price filter
      let matchesPrice = true;
      if (pricingFilter !== "all") {
        const rawPrice = ws.plans?.[0]?.price;
        const numericPrice = rawPrice
          ? Number(String(rawPrice).replace(/[^0-9.]/g, ""))
          : null;

        if (
          numericPrice !== null &&
          Number.isFinite(numericPrice) &&
          numericPrice > 0
        ) {
          if (pricingFilter === "low") matchesPrice = numericPrice < 5000;
          else if (pricingFilter === "mid")
            matchesPrice = numericPrice >= 5000 && numericPrice <= 15000;
          else if (pricingFilter === "high") matchesPrice = numericPrice > 15000;
        } else {
          matchesPrice = false;
        }
      }

      return matchesSearch && matchesPrice;
    });
  }, [workspaces, debouncedSearch, pricingFilter]);

  const sortedWorkspaces = useMemo(() => {
    const list = [...filteredWorkspaces];

    const extractNumericPrice = (value?: string) => {
      if (!value) return Number.POSITIVE_INFINITY;
      const numeric = Number(String(value).replace(/[^0-9.]/g, ""));
      return Number.isFinite(numeric) && numeric > 0
        ? numeric
        : Number.POSITIVE_INFINITY;
    };

    if (sortBy === "rating") {
      return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    if (sortBy === "price-low") {
      return list.sort(
        (a, b) =>
          extractNumericPrice(a.plans?.[0]?.price) -
          extractNumericPrice(b.plans?.[0]?.price),
      );
    }

    if (sortBy === "price-high") {
      return list.sort(
        (a, b) =>
          extractNumericPrice(b.plans?.[0]?.price) -
          extractNumericPrice(a.plans?.[0]?.price),
      );
    }

    return list.sort((a, b) => Number(b.popular) - Number(a.popular));
  }, [filteredWorkspaces, sortBy]);

  const mapCenter = useMemo(() => ({
    lat: sortedWorkspaces[0]?.lat || workspaces[0]?.lat || 28.6139,
    lng: sortedWorkspaces[0]?.lng || workspaces[0]?.lng || 77.209,
  }), [sortedWorkspaces, workspaces]);

  const mapMarkers = useMemo(() => sortedWorkspaces.map((ws) => {
    let link = `/space/${ws.id}`;
    if (workspaceType === "coworking") link = `/coworking-space/${ws.id}`;
    else if (workspaceType === "on-demand") link = `/meeting-room/${ws.id}`;

    return {
      id: ws.id,
      position: { lat: ws.lat, lng: ws.lng },
      title: ws.spaceId || ws.name,
      image: ws.images?.[0] || ws.image,
      price: ws.plans?.[0]?.price,
      rating: ws.rating,
      address: ws.address,
      link: link,
    };
  }), [sortedWorkspaces, workspaceType]);


  const totalResults = pagination?.total ?? sortedWorkspaces.length;
  const currentPage = pagination?.page ?? 1;
  const totalPages = pagination?.totalPages ?? 1;
  const selectedBusinessBaseAmount = selectedBusinessSetup
    ? parseBusinessSetupPrice(selectedBusinessSetup)
    : 0;

  // Coupon discount logic for render
  let renderCouponDiscount = 0;
  if (appliedCoupon && selectedBusinessBaseAmount > 0) {
    if (appliedCoupon.discountType === 'percentage') {
      renderCouponDiscount = (selectedBusinessBaseAmount * appliedCoupon.discountValue) / 100;
      if (appliedCoupon.maxDiscount && renderCouponDiscount > appliedCoupon.maxDiscount) {
        renderCouponDiscount = appliedCoupon.maxDiscount;
      }
    } else {
      renderCouponDiscount = appliedCoupon.discountValue;
    }
    renderCouponDiscount = Math.round(renderCouponDiscount);
  }

  const renderTaxableAmount = Math.max(selectedBusinessBaseAmount - renderCouponDiscount, 0);
  const selectedBusinessTaxAmount = Number((renderTaxableAmount * 0.18).toFixed(2));
  const selectedBusinessTotalAmount = renderTaxableAmount + selectedBusinessTaxAmount;

  const typeLabel: Record<string, string> = {
    "virtual-office": "Virtual Office",
    "coworking-space": "Coworking Space",
    "business-setup": "Business Setup",
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Full-width top section: Breadcrumb + Filters */}
      <div className="mt-20 bg-background border-b border-border/60">
        <div className="fs-container py-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
            <a href="/" className="hover:text-foreground transition-colors">
              Home
            </a>
            <ChevronRight className="w-3 h-3" />
            <span className="hover:text-foreground transition-colors cursor-pointer">
              {typeLabel[workspaceType] || "Workspace"}
            </span>
            {workspaceType !== "business-setup" && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="text-foreground font-medium">{activeCity}</span>
              </>
            )}
          </nav>

          {/* Filter bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 bg-muted/40 border border-border/60 rounded-2xl p-2.5 sm:p-3 relative z-[40]">
            {/* Product */}
            <div className="sm:w-[180px]">
              <Select
                value={workspaceType}
                onValueChange={handleWorkspaceTypeChange}
              >
                <SelectTrigger
                  className={`border shadow-none rounded-xl h-10 text-sm font-medium px-4 [&>svg]:ml-auto w-full transition-all duration-200 focus:outline-none focus:ring-[3px] focus:ring-[#36503F]/20 focus:border-[#36503F] focus:ring-offset-0 ${workspaceType !== "virtual-office"
                    ? "bg-muted/50 border-border text-foreground"
                    : "border-border/60 hover:border-border hover:shadow-sm"
                    }`}
                >
                  <SelectValue placeholder="Product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="focus:bg-[#FEF8CF] focus:text-[#1a2b21]" value="virtual-office">Virtual Office</SelectItem>
                  <SelectItem className="focus:bg-[#FEF8CF] focus:text-[#1a2b21]" value="coworking">Coworking Space</SelectItem>
                  <SelectItem className="focus:bg-[#FEF8CF] focus:text-[#1a2b21]" value="business-setup">Business Setup</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-8 bg-border/60 flex-shrink-0" />

            {/* City — custom dropdown with always-visible chevrons */}
            <CityDropdown
              activeCity={activeCity}
              cities={availableCities}
              loading={citiesLoading}
              onSelect={handleCityChange}
              disabled={workspaceType === "business-setup"}
            />

            {/* Search Location */}
            <div className="relative flex-1 min-w-[140px]">
              <div className="flex items-center bg-card border border-border/60 rounded-xl h-10 overflow-hidden transition-all duration-200 focus-within:ring-[3px] focus-within:ring-[#36503F]/20 focus-within:border-[#36503F]">
                <MapPin className="w-4 h-4 text-muted-foreground ml-3 flex-shrink-0" />
                <Input
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  className="border-0 shadow-none h-full text-sm font-medium text-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none bg-transparent px-3 placeholder:text-muted-foreground/40 min-w-0 flex-1"
                  placeholder="Search location..."
                />
                <button
                  onClick={handleSearch}
                  className="px-3 h-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted transition-colors border-l border-border/60"
                  title="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Pricing */}
            <div className="sm:w-[160px]">
              <Select value={pricingFilter} onValueChange={setPricingFilter} disabled={workspaceType === "business-setup"}>
                <SelectTrigger
                  className={`border shadow-none rounded-xl h-10 text-sm font-medium px-4 [&>svg]:ml-auto w-full transition-all duration-200 focus:outline-none focus:ring-[3px] focus:ring-[#36503F]/20 focus:border-[#36503F] focus:ring-offset-0 ${pricingFilter !== "all"
                    ? "bg-muted/50 border-border text-foreground"
                    : "border-border/60 text-foreground bg-card hover:border-border hover:shadow-sm"
                    }`}
                >
                  <SelectValue placeholder="Pricing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="focus:bg-[#FEF8CF] focus:text-[#1a2b21]" value="all">All Pricing</SelectItem>
                  <SelectItem className="focus:bg-[#FEF8CF] focus:text-[#1a2b21]" value="low">Under ₹5,000</SelectItem>
                  <SelectItem className="focus:bg-[#FEF8CF] focus:text-[#1a2b21]" value="mid">₹5,000 – ₹15,000</SelectItem>
                  <SelectItem className="focus:bg-[#FEF8CF] focus:text-[#1a2b21]" value="high">Above ₹15,000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort by */}
            <div className="sm:w-[180px]">
              <Select value={sortBy} onValueChange={setSortBy} disabled={workspaceType === "business-setup"}>
                <SelectTrigger
                  className={`border shadow-none rounded-xl h-10 text-sm font-medium px-4 [&>svg]:ml-auto w-full transition-all duration-200 focus:outline-none focus:ring-[3px] focus:ring-[#36503F]/20 focus:border-[#36503F] focus:ring-offset-0 ${sortBy !== "rating"
                    ? "bg-muted/50 border-border text-foreground"
                    : "border-border/60 text-foreground bg-card hover:border-border hover:shadow-sm"
                    }`}
                >
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="focus:bg-[#FEF8CF] focus:text-[#1a2b21]" value="rating">Highest Rated</SelectItem>
                  <SelectItem className="focus:bg-[#FEF8CF] focus:text-[#1a2b21]" value="popular">Most Popular</SelectItem>
                  <SelectItem className="focus:bg-[#FEF8CF] focus:text-[#1a2b21]" value="price-low">Price: Low to High</SelectItem>
                  <SelectItem className="focus:bg-[#FEF8CF] focus:text-[#1a2b21]" value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: split view — listings left, map right */}
      <div className="hidden lg:flex flex-1 relative fs-container">
        {/* Left: Listings */}
        <div
          className={`bg-muted/20 transition-all duration-300 ease-in-out relative ${workspaceType === "business-setup" ? "w-full" : "w-[65%] border-r border-border/40"}`}
        >
          <div className="py-5 pr-5 sm:pr-8">
            {/* Results text + view toggle */}
            {workspaceType !== "business-setup" && (
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-semibold text-foreground">
                    {sortedWorkspaces.length} of {totalResults} result(s)
                  </span>{" "}
                  for {(typeLabel[workspaceType] || "Workspace").toLowerCase()} in{" "}
                  <span className="font-medium text-foreground">
                    {activeCity}
                  </span>
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 bg-muted/60 rounded-full p-0.5">
                    <button
                      onClick={() => setViewMode("list")}
                      className={`flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 ${viewMode === "list"
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 ${viewMode === "grid"
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
            {loading ? (
              <div
                className={
                  workspaceType === "business-setup"
                    ? "grid gap-6 pb-8 pt-4 px-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : viewMode === "grid"
                      ? "grid gap-4 pb-8 grid-cols-1 min-[700px]:grid-cols-2"
                      : "flex flex-col gap-4 pb-8 max-w-5xl"
                }
              >
                <SkeletonCardGrid count={8} view={viewMode} />
              </div>
            ) : (
              <div
                className={
                  workspaceType === "business-setup"
                    ? "grid gap-6 pb-8 pt-4 px-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : viewMode === "grid"
                      ? "grid gap-4 pb-8 grid-cols-1 min-[700px]:grid-cols-2"
                      : "flex flex-col gap-4 pb-8 max-w-5xl"
                }
              >
                {sortedWorkspaces.length > 0 ? (
                  sortedWorkspaces.map((ws, index) => (
                    <div key={ws.id} className="contents">
                      {index === 4 && workspaceType !== "business-setup" && (
                        <div className="col-span-full py-4 my-2 flex flex-col items-center">
                          <h3 className="text-[17px] font-semibold text-gray-900 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                            5,000+ {workspaceType === "virtual-office" ? "Virtual Office" : "Coworking Space"} clients served
                          </h3>
                          <div className="flex justify-between items-center gap-x-2 gap-y-4 opacity-90 transition-all duration-300 border border-border/60 rounded-xl bg-white shadow-sm px-6 sm:px-10 py-5 w-full overflow-hidden">
                            <img src="/newLogo/plum%20logo.png" alt="Plum" className="h-8 sm:h-12 object-contain shrink-0" />
                            <img src="/newLogo/flipkart-logo-png_seeklogo-284422.png" alt="Flipkart" className="h-12 sm:h-16 object-contain shrink-0" />
                            <img src="https://cdni.trulymadly.com/tm-static-assets-production/web/logo.webp" alt="Truly Madly" className="h-5 sm:h-7 object-contain shrink-0" />
                            <img src="/Logo/StudyIQ.png" alt="Study IQ" className="h-8 sm:h-12 object-contain shrink-0" />
                            <img src="/newLogo/Adda247.png" alt="Adda247" className="h-8 sm:h-12 object-contain shrink-0" />
                            <img src="/newLogo/growthschool.png" alt="GrowthSchool" className="h-6 sm:h-9 object-contain shrink-0" />
                          </div>
                        </div>
                      )}
                      <WorkspaceCard
                        ws={ws}
                        view={workspaceType === "business-setup" ? "grid" : viewMode}
                        type={workspaceType}
                        onBusinessSetupBuy={setSelectedBusinessSetup}
                        zoomedCardId={zoomedCardId}
                        onCardZoom={setZoomedCardId}
                      />
                      {index === 5 && workspaceType !== "business-setup" && (
                        <ReviewsCarousel />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-16 text-center text-muted-foreground">
                    <p className="text-base font-medium">
                      No services found
                    </p>
                  </div>
                )}
              </div>
            )}
            <DiscountBanner onClick={() => setIsContactOpen(true)} />
          </div>
          <div className="flex items-center justify-center gap-1.5 border-t border-border/40 py-6 mt-2 bg-background">
            <button
              onClick={goPrevPage}
              disabled={!pagination?.hasPrevPage}
              className="px-4 py-2 rounded-lg border border-border bg-card text-foreground text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-all"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${currentPage === p
                    ? "bg-[#36503F] text-white"
                    : "text-foreground hover:bg-muted"
                  }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={goNextPage}
              disabled={!pagination?.hasNextPage}
              className="px-4 py-2 rounded-lg border border-border bg-card text-foreground text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-all"
            >
              Next
            </button>
          </div>
        </div>

        {/* Right: Map */}
        {workspaceType !== "business-setup" && (
          <>
            <div
              className="transition-all duration-300 ease-in-out relative hidden lg:block w-[35%] opacity-100"
            >
              <div className="sticky top-[88px] h-[calc(100vh-100px)] max-h-[800px] m-2 sm:m-4 flex flex-col gap-3">
                {/* Map Controls */}
                <div className="flex items-center gap-2 bg-white p-1.5 rounded-lg border border-border/50 shadow-sm shrink-0">
                  <button
                    onClick={() => setMapCollapsed(false)}
                    className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${!mapCollapsed ? 'bg-gray-100 text-gray-900 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    Show Map
                  </button>
                  <button
                    onClick={() => setMapCollapsed(true)}
                    className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${mapCollapsed ? 'bg-gray-100 text-gray-900 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    Hide Map
                  </button>
                  <button
                    onClick={() => setMapFullscreen(true)}
                    className="flex-1 text-xs font-medium py-1.5 rounded-md text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    Full Map
                  </button>
                </div>

                {/* Map Section */}
                <div className={`relative rounded-xl overflow-hidden shadow-sm border transition-all duration-300 ${mapCollapsed ? "h-0 opacity-0 min-h-0 border-transparent flex-none" : "flex-1 min-h-[300px] border-border/30"}`}>
                  <MapLibreMap
                    center={mapCenter}
                    markers={mapMarkers}
                    height="100%"
                    mapStyle="retro"
                  />
                </div>

                {/* Consultant Card */}
                <div className="bg-white rounded-xl p-4 border border-border shadow-[0_4px_20px_rgb(0,0,0,0.05)] flex flex-col overflow-y-auto custom-scrollbar shrink-0" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <div>
                    <h3 className="text-[16px] font-bold text-gray-900 mb-4 leading-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Get your Virtual Office in {activeCity} with Premjeet
                    </h3>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        <img src="/to_cloudinary/premjeet.png" alt="Premjeet" className="w-full h-full object-cover object-top" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-[15px] leading-tight mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>Premjeet</h4>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <p className="text-gray-500 text-[13px]">+91 98886 87898</p>
                          <a href="tel:+919888687898" className="inline-flex items-center justify-center bg-[#36503F] text-white px-3 py-1 rounded-sm text-[11px] font-bold hover:bg-[#2c4133] transition-colors shadow-sm">
                            Contact Premjeet
                          </a>
                        </div>
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-[11px] font-bold text-gray-700">
                          <BadgeCheck className="w-3.5 h-3.5 text-[#36503F]" /> FlashSpace Consultant
                        </div>
                      </div>
                    </div>

                    <div className="mb-2">
                      <h5 className="font-bold text-gray-900 text-[13px] mb-2">Premjeet will help you with:</h5>
                      <div className="grid grid-cols-2 gap-y-2 gap-x-2">
                        {["Compare Workspaces", "Expert Price Negotiation", "Seamless GST Setup", "Tailored Documentation"].map(item => (
                          <div key={item} className="flex items-start gap-1.5 text-[11px] sm:text-[12px] text-gray-700 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#36503F] shrink-0 mt-0.5" />
                            <span className="leading-tight">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </>
        )}
      </div>

      {/* Mobile: full-width listings + expandable map */}
      <div className="lg:hidden flex-1 relative fs-container pb-24">
        <div className="py-3">
          {loading ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 min-[500px]:grid-cols-2 gap-4 pb-8"
                  : "flex flex-col gap-3 pb-8"
              }
            >
              <SkeletonCardGrid count={4} view={viewMode} />
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 min-[500px]:grid-cols-2 gap-4 pb-8"
                  : "flex flex-col gap-3 pb-8"
              }
            >
              {sortedWorkspaces.length > 0 ? (
                sortedWorkspaces.map((ws, index) => (
                  <div key={ws.id} className="contents">
                    {index === 4 && workspaceType !== "business-setup" && (
                      <div className="col-span-full py-4 my-2 flex flex-col items-center">
                        <h3 className="text-[15px] font-semibold text-gray-900 mb-4 text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                          5,000+ {workspaceType === "virtual-office" ? "Virtual Office" : "Coworking Space"} clients served
                        </h3>
                        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-8 opacity-90 border border-border/60 rounded-xl bg-white shadow-sm px-4 py-8 w-full">
                          <div className="w-[28%] flex justify-center">
                            <img src="/newLogo/plum%20logo.png" alt="Plum" className="h-8 object-contain" />
                          </div>
                          <div className="w-[28%] flex justify-center">
                            <img src="/newLogo/flipkart-logo-png_seeklogo-284422.png" alt="Flipkart" className="h-12 object-contain" />
                          </div>
                          <div className="w-[28%] flex justify-center">
                            <img src="https://cdni.trulymadly.com/tm-static-assets-production/web/logo.webp" alt="Truly Madly" className="h-6 object-contain" />
                          </div>
                          <div className="w-[40%] flex justify-center">
                            <img src="/Logo/StudyIQ.png" alt="Study IQ" className="h-10 object-contain" />
                          </div>
                          <div className="w-[40%] flex justify-center">
                            <img src="/newLogo/Adda247.png" alt="Adda247" className="h-10 object-contain" />
                          </div>
                        </div>
                      </div>
                    )}
                    <WorkspaceCard
                      ws={ws}
                      view={viewMode}
                      type={workspaceType}
                      onBusinessSetupBuy={setSelectedBusinessSetup}
                    />
                    {index === 5 && workspaceType !== "business-setup" && (
                      <ReviewsCarousel />
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-2 py-16 text-center text-muted-foreground">
                  <p className="text-base font-medium">
                    No spaces found in "{activeCity}"
                  </p>
                  <p className="text-sm mt-1">
                    Try searching a different city.
                  </p>
                </div>
              )}
            </div>
          )}
          <div className="flex items-center justify-center gap-1.5 border-t border-border/40 py-6 pb-10 bg-background">
            <button
              onClick={goPrevPage}
              disabled={!pagination?.hasPrevPage}
              className="px-4 py-2 rounded-lg border border-border bg-card text-foreground text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-all"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors hidden sm:flex ${currentPage === p
                    ? "bg-[#36503F] text-white"
                    : "text-foreground hover:bg-muted"
                  }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={goNextPage}
              disabled={!pagination?.hasNextPage}
              className="px-4 py-2 rounded-lg border border-border bg-card text-foreground text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-all"
            >
              Next
            </button>
          </div>
        </div>

        {/* Expand Map floating button and Map View */}
        {workspaceType !== "business-setup" && (
          <>
            <style>
              {`
                @media (max-width: 1024px) {
                  chat-widget {
                    bottom: 75px !important;
                  }
                }
              `}
            </style>
            {!showMap && (
              <button
                onClick={() => setShowMap(true)}
                className="fixed bottom-[80px] left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.3)] font-semibold text-sm transition-transform active:scale-95 border border-gray-700"
              >
                <MapIcon className="w-4 h-4" />
                Show Map
              </button>
            )}

            {showMap && (
              <div className="fixed inset-0 z-30 mt-16 bg-background">
                <button
                  onClick={() => setShowMap(false)}
                  className="absolute top-3 left-3 z-40 flex items-center gap-1 px-3 py-2 rounded-full bg-card border border-border shadow-md text-xs font-medium text-foreground"
                >
                  <ChevronRight className="w-3.5 h-3.5 rotate-180" /> Back to list
                </button>
                <MapLibreMap
                  center={mapCenter}
                  markers={mapMarkers}
                  height="100%"
                  mapStyle="retro"
                />
              </div>
            )}
          </>
        )}

        {/* Mobile Fixed Bottom Action Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 p-3 flex items-center justify-between gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <button
            onClick={() => setIsContactOpen(true)}
            className="flex-1 bg-[#36503F] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#2c4133] transition-colors shadow-sm"
          >
            <Phone className="w-4.5 h-4.5" />
            Request Callback
          </button>
        </div>
      </div>

      <Dialog
        open={!!selectedBusinessSetup}
        onOpenChange={(open) => !open && setSelectedBusinessSetup(null)}
      >
        <DialogContent className="max-w-md rounded-2xl border border-[#D4E0D0] p-0 overflow-hidden bg-white shadow-2xl">
          {selectedBusinessSetup && (
            <>
              <DialogHeader className="sr-only">
                <DialogTitle>Order Summary</DialogTitle>
                <DialogDescription>
                  Business setup order summary and payment
                </DialogDescription>
              </DialogHeader>

              <div className="p-6">
                <div className="mb-6 flex items-center gap-3">
                  <span className="text-2xl font-semibold text-[#EDB003]">
                    &#8377;
                  </span>
                  <div>
                    <h2 className="text-xl font-bold text-gray-950">
                      Order Summary
                    </h2>
                    <p className="mt-1 text-sm font-medium text-[#6B9679]">
                      {selectedBusinessSetup.name}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-base">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-medium text-[#6B9679]">Plan</span>
                    <span className="text-right font-semibold text-gray-950">
                      {selectedBusinessSetup.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="font-medium text-[#6B9679]">Package</span>
                    <span className="font-semibold text-gray-950">
                      {formatInr(selectedBusinessBaseAmount)}
                    </span>
                  </div>

                  {renderCouponDiscount > 0 && (
                    <div className="flex items-center justify-between gap-4 text-green-600">
                      <span className="font-medium flex items-center gap-2">
                        Discount <span className="text-xs bg-green-100 px-2 py-0.5 rounded uppercase">{appliedCoupon.code}</span>
                      </span>
                      <span className="font-semibold">
                        -{formatInr(renderCouponDiscount)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-4">
                    <span className="font-medium text-[#6B9679]">Tax (18%)</span>
                    <span className="font-semibold text-gray-950">
                      {formatInr(selectedBusinessTaxAmount)}
                    </span>
                  </div>
                </div>

                <div className="my-6 h-px bg-[#D4E0D0]" />

                {/* Coupon Section */}
                <div className="mb-5">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-3">
                      <div className="flex items-center gap-2">
                        <Bookmark className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="text-sm font-semibold text-green-700">'{appliedCoupon.code}' applied</p>
                          <p className="text-xs text-green-600 font-medium">You saved {formatInr(renderCouponDiscount)}!</p>
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-sm font-semibold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 relative">
                      <div className="relative flex-1">
                        <Bookmark className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Enter coupon code"
                          className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-[#D4E0D0] rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#36503F]/20 uppercase"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                          disabled={couponLoading}
                        />
                      </div>
                      <button
                        onClick={handleApplyCoupon}
                        disabled={!couponCode.trim() || couponLoading}
                        className="px-5 py-2.5 bg-[#36503F] text-[#FEF8C5] text-sm font-bold rounded-xl hover:bg-[#1F2E26] disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[80px]"
                      >
                        {couponLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Apply'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="mb-5">
                  <p className="text-sm font-semibold uppercase tracking-wide text-[#6B9679]">
                    Total Amount
                  </p>
                  <p className="mt-1 text-4xl font-extrabold tracking-tight text-gray-950">
                    {formatInr(selectedBusinessTotalAmount)}
                  </p>
                </div>

                <button
                  onClick={handleBusinessSetupPayment}
                  disabled={businessPaymentLoading || businessTestPaymentLoading}
                  className="w-full min-h-14 rounded-xl bg-[#36503F] px-5 text-base font-bold text-[#FEF8C5] hover:bg-[#1F2E26] disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center"
                >
                  {businessPaymentLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Proceed to Payment"
                  )}
                </button>

                {import.meta.env.DEV && (
                  <button
                    onClick={handleBusinessSetupTestPayment}
                    disabled={businessPaymentLoading || businessTestPaymentLoading}
                    className="mt-4 w-full min-h-12 rounded-xl bg-[#36503F] px-5 text-sm font-bold text-[#FEF8C5] hover:bg-[#1F2E26] disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center"
                  >
                    {businessTestPaymentLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      "Test Payment (Dev Only)"
                    )}
                  </button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={mapFullscreen} onOpenChange={setMapFullscreen}>
        <DialogContent className="max-w-[95vw] w-full h-[95vh] p-0 overflow-hidden flex flex-col rounded-2xl">
          <DialogHeader className="p-4 border-b sr-only">
            <DialogTitle>Full Screen Map</DialogTitle>
            <DialogDescription>View all workspaces on the map.</DialogDescription>
          </DialogHeader>
          <div className="flex-1 w-full h-full relative">
            <MapLibreMap
              center={mapCenter}
              markers={mapMarkers}
              height="100%"
              mapStyle="retro"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer / Contact Modal */}
      <GetInTouchModal open={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
};

const REVIEWS_DATA = [
  {
    text: "Nice space and well mannered staff,really happy 😊",
    author: "Vijay",
    avatar: "V",
    color: "bg-orange-600",
  },
  {
    text: "Co-operative guys...go for them if u need a virtual office.",
    author: "asadullah jahangir",
    avatar: "A",
    color: "bg-blue-500",
  },
  {
    text: "I strongly recommend Virtual Office in delhi for your workspace requirements.",
    author: "Manoj Gusain",
    avatar: "M",
    color: "bg-purple-600",
  },
  {
    text: "It felt smooth and professional from start to finish.",
    author: "Ashutosh Mishra",
    avatar: "A",
    color: "bg-blue-600",
  }
];

const ReviewsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % REVIEWS_DATA.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextReview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % REVIEWS_DATA.length);
  };

  const review = REVIEWS_DATA[currentIndex];

  return (
    <div className="col-span-full my-4 bg-white rounded-lg border border-border shadow-sm p-6 relative overflow-hidden transition-all duration-300">
      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <div className="flex gap-4 items-start">
        {review.image ? (
          <img src={review.image} alt={review.author} className="w-10 h-10 rounded-full object-cover shrink-0 mt-1" />
        ) : (
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 mt-1 ${review.color}`}>
            {review.avatar}
          </div>
        )}
        <div>
          <p className="text-gray-800 font-medium text-[16px] mb-2 leading-snug" style={{ fontFamily: "'Inter', sans-serif" }}>
            "{review.text}"
          </p>
          {review.author !== review.avatar && (
            <p className="text-gray-500 text-[13px]">
              -{review.author}
            </p>
          )}
        </div>
      </div>
      <div className="absolute bottom-5 right-5 flex items-center gap-1.5">
        {REVIEWS_DATA.map((_, idx) => (
          <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-gray-600 scale-125' : 'bg-gray-300'}`}></div>
        ))}
        <button onClick={nextReview} className="ml-2 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors border border-gray-200">
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default GetWorkspaces;

