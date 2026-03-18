import { memo, useState, useMemo } from "react";
import {
  MapPin,
  Star,
  Heart,
  Plus,
  ChevronLeft,
  ChevronRight,
  Phone,
} from "lucide-react";
import {
  VirtualOfficeItem,
  CoworkingSpaceItem,
  MeetingRoomItem,
} from "@/types/services";
import MeetingBookingModal from "@/components/ui/MeetingBookingModal";
import { getSafeImageUrl } from "@/utils/imageUrl";

// Union type that works with all service types
export type ListingItem = (
  | VirtualOfficeItem
  | CoworkingSpaceItem
  | MeetingRoomItem
  | {
    _id: string;
    name: string;
    address: string;
    area: string;
    price: string;
    originalPrice?: string;
    rating: number;
    reviews: number;
    image?: string;
    features: string[];
    popular?: boolean;
    availability?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  }
) & {
  images?: string[];
  avgRating?: number;
  totalReviews?: number;
  gstPlanPricePerYear?: number;
  mailingPlanPricePerYear?: number;
  brPlanPricePerYear?: number;
  finalGstPricePerYear?: number;
  finalMailingPricePerYear?: number;
  finalBrPricePerYear?: number;
  gstPlanPrice?: string;
  gstPlanPriceYearly?: string;
  mailingPlanPrice?: string;
  mailingPlanPriceYearly?: string;
  brPlanPrice?: string;
  brPlanPriceYearly?: string;
  priceYearly?: string;
};

interface ListingCardModernProps {
  item: ListingItem;
  index?: number;
  onClick?: () => void;
  onGetBestPrice?: (itemId: string) => void;
  onToggleFavorite?: (itemId: string) => void;
}

// Multiple images for carousel effect
const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
];

/**
 * Modern Listing Card Component - MindTrip Style
 * Features:
 * - Image carousel with dots
 * - Clean minimal design
 * - Heart icon for favorites
 * - Smooth hover effects
 */
const ListingCardModern = memo<ListingCardModernProps>(
  ({ item, index, onClick, onGetBestPrice, onToggleFavorite }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);

    // Priority: item.images (array) -> item.image (legacy string) -> placeholders
    const images = useMemo(() => {
      if (item.images && item.images.length > 0) {
        return item.images.map(img => getSafeImageUrl(img));
      }
      if (item.image) {
        return [getSafeImageUrl(item.image), ...PLACEHOLDER_IMAGES.slice(1)];
      }
      return PLACEHOLDER_IMAGES;
    }, [item.images, item.image]);

    const handlePrevImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentImageIndex((prev) =>
        prev === 0 ? images.length - 1 : prev - 1,
      );
    };

    const handleNextImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentImageIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1,
      );
    };

    const handleFavoriteClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsFavorite(!isFavorite);
      onToggleFavorite?.(item._id);
    };

    const handleCardClick = () => {
      onClick?.();
      onGetBestPrice?.(item._id);
    };

    const formatReviews = (reviews: number) => {
      if (!reviews) return "0";
      if (reviews >= 1000) {
        return `${(reviews / 1000).toFixed(1)}k`;
      }
      return reviews.toString();
    };

    // Helper to format currency
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(amount);
    };

    // Get rating and reviews — prefer whichever field is non-zero
    const displayRating = item.avgRating || item.rating || 0;
    const displayReviews = item.totalReviews || item.reviews || 0;

    return (
      <div
        className="group bg-card rounded-[20px] overflow-hidden border border-border hover:-translate-y-1.5 transition-all duration-200 ease-out shadow-sm hover:shadow-md h-full flex flex-col"
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {/* Image */}
          <img
            src={images[currentImageIndex]}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Navigation Arrows - Show on hover */}
          {isHovered && images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-4 h-4 text-gray-700" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-4 h-4 text-gray-700" />
              </button>
            </>
          )}

          {/* Top Right Actions - Heart & Plus */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <button
              onClick={handleFavoriteClick}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${isFavorite
                ? "bg-white text-red-500"
                : "bg-white/80 hover:bg-white text-gray-600 hover:text-red-500"
                }`}
            >
              <Heart
                className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`}
              />
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Popular Badge */}
          {item.popular && (
            <div className="absolute top-3 left-3 z-10">
              <span className="bg-[#FE8A00] text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 uppercase tracking-tight">
                <span className="animate-pulse">🔥</span> Popular
              </span>
            </div>
          )}

          {/* Availability Badge */}
          {!item.popular && (
            <div className="absolute top-3 left-3 z-10">
              <span className="bg-primary text-primary-foreground text-[10px] font-normal px-2.5 py-1 rounded-full shadow-sm">
                Available Now
              </span>
            </div>
          )}

          {/* Availability Badge */}
          {item.availability && (
            <div className="absolute bottom-3 left-3">
              <span className="bg-white/95 backdrop-blur-sm text-gray-700 text-xs px-2.5 py-1 rounded-full font-medium shadow-sm">
                {item.availability}
              </span>
            </div>
          )}

          {/* Carousel Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${index === currentImageIndex
                    ? "bg-white w-2.5"
                    : "bg-white/60 hover:bg-white/80"
                    }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {/* Title Row */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="text-base font-bold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-1">
              {item.name}
            </h4>
            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-3.5 h-3.5 text-[#EDB003] fill-[#EDB003]" />
              <span className="text-sm font-bold text-foreground">
                {displayRating}
              </span>
              <span className="text-muted-foreground text-[11px]">
                ({formatReviews(displayReviews)})
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="line-clamp-1">{item.address}</span>
          </div>

          {/* Features Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {item.features?.slice(0, 2).map((feature, idx) => (
              <span
                key={idx}
                className="text-[11px] text-muted-foreground border border-border rounded-full px-2.5 py-0.5"
              >
                {feature}
              </span>
            ))}
          </div>

          {/* Pricing Section */}
          <div className="space-y-2 mb-4">
            {/* Virtual Office Plans */}
            {(("finalGstPricePerYear" in item && item.finalGstPricePerYear) ||
              ("gstPlanPricePerYear" in item && item.gstPlanPricePerYear) ||
              ("gstPlanPrice" in item && item.gstPlanPrice)) && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">GST Plan</span>
                  <span className="font-bold text-foreground">
                    {"finalGstPricePerYear" in item && item.finalGstPricePerYear
                      ? formatCurrency(item.finalGstPricePerYear)
                      : "gstPlanPricePerYear" in item && item.gstPlanPricePerYear
                        ? formatCurrency(item.gstPlanPricePerYear)
                        : item.gstPlanPrice}
                    /yr
                  </span>
                </div>
              )}

            {(("finalMailingPricePerYear" in item &&
              item.finalMailingPricePerYear) ||
              ("mailingPlanPricePerYear" in item &&
                item.mailingPlanPricePerYear) ||
              ("mailingPlanPrice" in item && item.mailingPlanPrice)) && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Mailing Plan</span>
                  <span className="font-bold text-foreground">
                    {"finalMailingPricePerYear" in item &&
                      item.finalMailingPricePerYear
                      ? formatCurrency(item.finalMailingPricePerYear)
                      : "mailingPlanPricePerYear" in item &&
                        item.mailingPlanPricePerYear
                        ? formatCurrency(item.mailingPlanPricePerYear)
                        : item.mailingPlanPrice}
                    /yr
                  </span>
                </div>
              )}

            {(("finalBrPricePerYear" in item && item.finalBrPricePerYear) ||
              ("brPlanPricePerYear" in item && item.brPlanPricePerYear) ||
              ("brPlanPrice" in item && item.brPlanPrice)) && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Business Reg</span>
                  <span className="font-bold text-foreground">
                    {"finalBrPricePerYear" in item && item.finalBrPricePerYear ? (
                      formatCurrency(item.finalBrPricePerYear)
                    ) : "brPlanPricePerYear" in item &&
                      item.brPlanPricePerYear ? (
                      formatCurrency(item.brPlanPricePerYear)
                    ) : (
                      item.brPlanPrice
                    )}
                    /yr
                  </span>
                </div>
              )}

            {/* Default Starting from for Coworking/Meeting */}
            {!("gstPlanPricePerYear" in item) && !("gstPlanPrice" in item) && (
              <p className="text-sm text-muted-foreground">
                Starting from <span className="font-bold text-foreground">{item.price}</span>
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-auto">
            <button
              onClick={handleCardClick}
              className="flex-1 bg-primary text-primary-foreground text-sm font-normal py-2.5 rounded-xl hover:bg-primary/90 transition-all active:scale-[0.98]"
            >
              Get Best Price
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMeetingModalOpen(true);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 border border-border text-sm font-normal text-foreground py-2.5 rounded-xl hover:bg-muted/50 transition-all active:scale-[0.98]"
            >
              <Phone className="w-4 h-4" />
              Contact Sales
            </button>
          </div>
        </div>

        {/* Meeting Booking Modal */}
        <MeetingBookingModal
          isOpen={isMeetingModalOpen}
          onClose={() => setIsMeetingModalOpen(false)}
          item={item}
        />
      </div>
    );
  },
  (prevProps, nextProps) => {
    const prevRating =
      prevProps.item.avgRating !== undefined
        ? prevProps.item.avgRating
        : prevProps.item.rating;
    const nextRating =
      nextProps.item.avgRating !== undefined
        ? nextProps.item.avgRating
        : nextProps.item.rating;
    return (
      prevProps.item._id === nextProps.item._id && prevRating === nextRating
    );
  },
);

ListingCardModern.displayName = "ListingCardModern";

export default ListingCardModern;
