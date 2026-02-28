import { memo, useState } from "react";
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
    const images =
      item.images && item.images.length > 0
        ? item.images
        : item.image
          ? [item.image, ...PLACEHOLDER_IMAGES.slice(1)]
          : PLACEHOLDER_IMAGES;

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

    // Get rating and reviews from new (avgRating/totalReviews) or legacy (rating/reviews)
    const displayRating =
      "avgRating" in item ? item.avgRating : item.rating || 0;
    const displayReviews =
      "totalReviews" in item ? item.totalReviews : item.reviews || 0;

    return (
      <div
        className="group cursor-pointer"
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3">
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
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                isFavorite
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
            <div className="absolute top-3 left-3">
              <span className="bg-amber-500 text-white text-xs px-2.5 py-1 rounded-full font-medium shadow-lg">
                🔥 Popular
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
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                    index === currentImageIndex
                      ? "bg-white w-2.5"
                      : "bg-white/60 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-1">
          {/* Title Row */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 text-base leading-tight line-clamp-1 group-hover:text-primary transition-colors">
              {item.name}
            </h3>
            {/* Rating */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="w-4 h-4 text-gray-900 fill-current" />
              <span className="font-medium text-sm text-gray-900">
                {displayRating}
              </span>
              <span className="text-gray-500 text-sm">
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
            {item.features.slice(0, 2).map((feature, idx) => (
              <span
                key={idx}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md"
              >
                {feature}
              </span>
            ))}
          </div>

          {/* Pricing - All 3 Plans Vertical */}
          <div className="flex flex-col gap-1 mb-2">
            {/* GST Plan */}
            {(("finalGstPricePerYear" in item && item.finalGstPricePerYear) ||
              ("gstPlanPricePerYear" in item && item.gstPlanPricePerYear) ||
              ("gstPlanPrice" in item && item.gstPlanPrice)) && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">GST Plan</span>
                <div className="text-right">
                  {"finalGstPricePerYear" in item &&
                  item.finalGstPricePerYear ? (
                    <span className="text-sm font-semibold text-gray-900 block">
                      {formatCurrency(item.finalGstPricePerYear)}/yr
                    </span>
                  ) : "gstPlanPricePerYear" in item &&
                    item.gstPlanPricePerYear ? (
                    <span className="text-sm font-semibold text-gray-900 block">
                      {formatCurrency(item.gstPlanPricePerYear)}/yr
                    </span>
                  ) : (
                    <>
                      <span className="text-sm font-semibold text-gray-900 block">
                        {item.gstPlanPrice}
                      </span>
                      {item.gstPlanPriceYearly && (
                        <span className="text-xs text-gray-500 block">
                          ₹{item.gstPlanPriceYearly}/yr
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Mailing Plan */}
            {(("finalMailingPricePerYear" in item &&
              item.finalMailingPricePerYear) ||
              ("mailingPlanPricePerYear" in item &&
                item.mailingPlanPricePerYear) ||
              ("mailingPlanPrice" in item && item.mailingPlanPrice)) && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Mailing Plan</span>
                <div className="text-right">
                  {"finalMailingPricePerYear" in item &&
                  item.finalMailingPricePerYear ? (
                    <span className="text-sm font-semibold text-gray-900 block">
                      {formatCurrency(item.finalMailingPricePerYear)}/yr
                    </span>
                  ) : "mailingPlanPricePerYear" in item &&
                    item.mailingPlanPricePerYear ? (
                    <span className="text-sm font-semibold text-gray-900 block">
                      {formatCurrency(item.mailingPlanPricePerYear)}/yr
                    </span>
                  ) : (
                    <>
                      <span className="text-sm font-semibold text-gray-900 block">
                        {item.mailingPlanPrice}
                      </span>
                      {item.mailingPlanPriceYearly && (
                        <span className="text-xs text-gray-500 block">
                          ₹{item.mailingPlanPriceYearly}/yr
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Business Registration Plan */}
            {(("finalBrPricePerYear" in item && item.finalBrPricePerYear) ||
              ("brPlanPricePerYear" in item && item.brPlanPricePerYear) ||
              ("brPlanPrice" in item && item.brPlanPrice)) && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Business Reg</span>
                <div className="text-right">
                  {"finalBrPricePerYear" in item && item.finalBrPricePerYear ? (
                    <span className="text-sm font-semibold text-gray-900 block">
                      {formatCurrency(item.finalBrPricePerYear)}/yr
                    </span>
                  ) : "brPlanPricePerYear" in item &&
                    item.brPlanPricePerYear ? (
                    <span className="text-sm font-semibold text-gray-900 block">
                      {formatCurrency(item.brPlanPricePerYear)}/yr
                    </span>
                  ) : (
                    <>
                      <span className="text-sm font-semibold text-gray-900 block">
                        {item.brPlanPrice}
                      </span>
                      {item.brPlanPriceYearly && (
                        <span className="text-xs text-gray-500 block">
                          ₹{item.brPlanPriceYearly}/yr
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Default Price (for Coworking/Meeting Rooms) */}
            {!("gstPlanPricePerYear" in item) && !("gstPlanPrice" in item) && (
              <div className="text-right">
                <span className="text-lg font-bold text-gray-900 block">
                  {item.price}
                </span>
                {"priceYearly" in item && item.priceYearly && (
                  <span className="text-xs text-gray-500 block">
                    ₹{item.priceYearly}/yr
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Negotiable Tag */}
          <div className="mb-3">
            <span className="text-xs text-gray-500 italic">
              Price negotiable
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleCardClick}
              className="flex-1 py-3 bg-gray-900 hover:bg-[#EDB003] text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md hover:text-gray-900"
            >
              Get Best Price
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMeetingModalOpen(true);
              }}
              className="flex-1 py-3 bg-white border-2 border-gray-900 hover:bg-gray-900 text-gray-900 hover:text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md flex items-center justify-center gap-1.5"
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
