import { memo } from 'react';
import MapLibreMap, { MapMarker, MapStyle } from '../Map/MapLibreMap';
export type { MapMarker, MapStyle };

export interface MapSectionProps {
  center: { lat: number; lng: number };
  markers: MapMarker[];
  zoom?: number;
  height?: string;
  mapStyle?: MapStyle;
  showStyleSelector?: boolean;
  focusMarkers?: Array<{
    position: { lat: number; lng: number };
  }>;
  visible?: boolean;
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
  height = "100%",
  mapStyle,
  showStyleSelector,
  focusMarkers,
  visible = true,
}) => {
  return (
    <div className="w-full h-full relative" style={{ overflow: 'hidden', maxHeight: '100%' }}>
      <MapLibreMap
        center={center}
        zoom={zoom}
        height="100%"
        className="w-full h-full"
        markers={markers}
        mapStyle={mapStyle}
        showStyleSelector={showStyleSelector}
        focusMarkers={focusMarkers}
        visible={visible}
      />
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for better performance
  // Only re-render if center coordinates, markers data, or zoom change
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

  const focusMarkersUnchanged =
    (prevProps.focusMarkers?.length || 0) === (nextProps.focusMarkers?.length || 0);

  const visibleUnchanged = prevProps.visible === nextProps.visible;

  // Return true if nothing changed (prevents re-render)
  return centerUnchanged && zoomUnchanged && markersUnchanged && focusMarkersUnchanged && visibleUnchanged;
});

MapSection.displayName = 'MapSection';

export default MapSection;
