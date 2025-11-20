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
    <div className="w-full h-full relative" style={{ overflow: 'hidden', maxHeight: '100%' }}>
      <MapLibreMap
        center={center}
        zoom={zoom}
        height="100%"
        className="w-full h-full"
        markers={markers}
      />
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for better performance
  // Only re-render if center coordinates, markers data, or zoom change
  // Deep comparison for markers array to prevent unnecessary re-renders
  const centerUnchanged = 
    prevProps.center.lat === nextProps.center.lat &&
    prevProps.center.lng === nextProps.center.lng;
  
  const zoomUnchanged = prevProps.zoom === nextProps.zoom;
  
  const markersUnchanged = 
    prevProps.markers.length === nextProps.markers.length &&
    prevProps.markers.every((marker, idx) => {
      const nextMarker = nextProps.markers[idx];
      return (
        marker.position.lat === nextMarker.position.lat &&
        marker.position.lng === nextMarker.position.lng &&
        marker.title === nextMarker.title
      );
    });
  
  // Return true if nothing changed (prevents re-render)
  return centerUnchanged && zoomUnchanged && markersUnchanged;
});

MapSection.displayName = 'MapSection';

export default MapSection;
