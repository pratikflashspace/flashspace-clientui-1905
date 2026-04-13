import { useEffect } from "react";

interface MapSyncHandlerProps {
  onRowClick: (providerName: string) => void;
  onMarkerClick: (providerName: string) => void;
  activeProvider?: string;
}

/**
 * MapSyncHandler: A logic component that manages the synchronization 
 * between the comparison table and the map markers.
 */
export default function MapSyncHandler({ onRowClick, onMarkerClick, activeProvider }: MapSyncHandlerProps) {
  // Listen for custom events if the map component emits them
  useEffect(() => {
    const handleMapMarkerClick = (e: any) => {
      if (e.detail?.provider) {
        onMarkerClick(e.detail.provider);
      }
    };

    window.addEventListener("map-marker-click", handleMapMarkerClick);
    return () => window.removeEventListener("map-marker-click", handleMapMarkerClick);
  }, [onMarkerClick]);

  return null; // Logic-only component
}
