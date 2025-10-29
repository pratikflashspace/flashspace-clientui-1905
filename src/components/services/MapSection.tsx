import { memo } from 'react';
import MapLibreMap from '@/components/Map/MapLibreMap';

export interface MapMarker {
  position: { lat: number; lng: number };
  title: string;
  address: string;
  price: string;
  rating: number;
  reviews: number;
  image?: string;
  features: string[];
}

interface MapSectionProps {
  center: { lat: number; lng: number };
  markers: MapMarker[];
  zoom?: number;
  height?: string;
}

/**
 * Optimized Map Section Component
 * - Uses React.memo to prevent unnecessary re-renders
 * - Memoizes markers array to prevent re-rendering when parent updates
 * - Provides consistent interface for different service types
 */
const MapSection = memo<MapSectionProps>(({
  center,
  markers,
  zoom = 11,
  height = "100%"
}) => {
  return (
    <div className="w-1/2 overflow-visible relative z-50">
      <MapLibreMap
        center={center}
        zoom={zoom}
        height={height}
        className="w-full h-full"
        markers={markers}
      />
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for better performance
  // Only re-render if center coordinates or number of markers change
  return (
    prevProps.center.lat === nextProps.center.lat &&
    prevProps.center.lng === nextProps.center.lng &&
    prevProps.markers.length === nextProps.markers.length &&
    prevProps.zoom === nextProps.zoom
  );
});

MapSection.displayName = 'MapSection';

export default MapSection;
