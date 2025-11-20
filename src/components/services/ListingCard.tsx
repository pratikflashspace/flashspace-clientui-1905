import { memo } from 'react';
import { MapPin, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VirtualOfficeItem, CoworkingSpaceItem } from '@/types/services';

// Union type that works with all service types
export type ListingItem = VirtualOfficeItem | CoworkingSpaceItem | {
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
};

interface ListingCardProps {
  item: ListingItem;
  onGetBestPrice?: (itemId: string) => void;
  onToggleFavorite?: (itemId: string) => void;
}

/**
 * Optimized Listing Card Component
 * - Memoized to prevent unnecessary re-renders
 * - Reusable for Virtual Office, Coworking Space, Event Space
 * - Optimized image loading with lazy loading
 * - Hover effects and smooth transitions
 */
const ListingCard = memo<ListingCardProps>(
  ({ item, onGetBestPrice, onToggleFavorite }) => {
    const imageSrc = item.image || 'https://shorturl.at/Fyr6o';

    const handleGetBestPrice = () => {
      if (onGetBestPrice) {
        onGetBestPrice(item._id);
      }
    };

    const handleToggleFavorite = () => {
      if (onToggleFavorite) {
        onToggleFavorite(item._id);
      } 
    };

    return (
      <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 rounded-lg overflow-hidden group">
        <div className="relative">
          {/* Image with lazy loading */}
          <img
            src={imageSrc}
            alt={item.name}
            className="w-full h-32 object-cover"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-1">
            {item.popular && (
              <span className="bg-[#EDB003] text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                🔥 Popular
              </span>
            )}
          </div>

          {/* Rating Badge */}
          <div className="absolute top-2 right-2 bg-green-600 text-white px-1.5 py-0.5 rounded flex items-center gap-1 text-[10px] font-medium">
            <Star className="w-2.5 h-2.5 fill-current" />
            {item.rating}
          </div>

          {/* Availability */}
          {item.availability && (
            <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-medium text-gray-700">
              {item.availability}
            </div>
          )}
        </div>

        <CardContent className="p-3">
          {/* Title and Favorite Button */}
          <div className="flex items-start justify-between mb-1.5">
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-gray-900 mb-0.5 group-hover:text-primary transition-colors line-clamp-1">
                {item.name}
              </h3>
              <div className="flex items-center gap-1 text-gray-600 text-xs mb-1">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="line-clamp-1">{item.address}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-red-500 h-6 w-6 p-0"
              onClick={handleToggleFavorite}
            >
              ♡
            </Button>
          </div>

          {/* Rating and Reviews */}
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="font-medium">{item.rating}</span>
              <span className="text-gray-500">({item.reviews})</span>
            </div>
          </div>

          {/* Price */}
          <div className="mb-2">
            <p className="text-[10px] text-gray-600 mb-1 font-medium">
              Pricing Plans:
            </p>
            <div className="space-y-1">
              {/* GST Plan */}
              {'gstPlanPrice' in item && (
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-gray-600">GST Plan:</span>
                  <span className="text-sm font-bold text-gray-900">
                    {item.gstPlanPrice}
                  </span>
                </div>
              )}
              {/* Mailing Plan */}
              {'mailingPlanPrice' in item && (
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-gray-600">Mailing Plan:</span>
                  <span className="text-sm font-bold text-gray-900">
                    {item.mailingPlanPrice}
                  </span>
                </div>
              )}
              {/* BR Plan */}
              {'brPlanPrice' in item && (
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-gray-600">BR Plan:</span>
                  <span className="text-sm font-bold text-gray-900">
                    {item.brPlanPrice}
                  </span>
                </div>
              )}
            </div>
            <p className="text-[9px] text-gray-500 mt-1">/ month (negotiable)</p>
          </div>

          {/* Features */}
          <div className="mb-2">
            <div className="flex flex-wrap gap-1">
              {item.features.slice(0, 2).map((feature, idx) => (
                <span
                  key={idx}
                  className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex gap-1.5">
            <Button
              className="flex-1 bg-primary hover:bg-primary/90 text-white text-xs h-8"
              onClick={handleGetBestPrice}
            >
              Get best price
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if the item ID or key properties change
    return (
      prevProps.item._id === nextProps.item._id &&
      prevProps.item.price === nextProps.item.price &&
      ('gstPlanPrice' in prevProps.item && 'gstPlanPrice' in nextProps.item && 
       prevProps.item.gstPlanPrice === nextProps.item.gstPlanPrice) &&
      prevProps.item.rating === nextProps.item.rating
    );
  }
);

ListingCard.displayName = 'ListingCard';

export default ListingCard;
