
import { useEffect, useRef, useState } from 'react';

interface SimpleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  width?: string;
  className?: string;
  markers?: Array<{
    position: { lat: number; lng: number };
    title?: string;
    info?: string;
  }>;
}

const SimpleGoogleMap: React.FC<SimpleMapProps> = ({
  center = { lat: 28.6139, lng: 77.2090 },
  zoom = 12,
  height = '400px',
  width = '100%',
  className = '',
  markers = [],
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  // Store both classic and advanced markers
  const markersRef = useRef<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef(false);

  // Airbnb-style minimalist map (JSON styles fallback when no mapId)
  const MAP_STYLES: google.maps.MapTypeStyle[] = [
    {
      featureType: 'all',
      elementType: 'geometry',
      stylers: [{ color: '#ebe3cd' }],
    },
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#ffffff' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry.fill',
      stylers: [{ color: '#c9c9c9' }],
    },
  ];

  // Helper to build a custom marker content element
  const createMarkerContent = (title?: string) => {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.width = '28px';
    container.style.height = '28px';
    container.style.borderRadius = '9999px';
    container.style.background = '#1d4ed8'; // blue-700
    container.style.boxShadow = '0 6px 14px rgba(29,78,216,0.35)';
    container.style.border = '2px solid white';
    container.style.color = 'white';
    container.style.fontSize = '14px';
    container.style.fontWeight = '600';
    container.style.transform = 'translateY(-2px)';
    container.title = title || '';

    const dot = document.createElement('div');
    dot.style.width = '6px';
    dot.style.height = '6px';
    dot.style.borderRadius = '9999px';
    dot.style.background = 'white';
    container.appendChild(dot);
    return container;
  };

  // Initialize map only once
  useEffect(() => {
    if (loadingRef.current || !mapRef.current || mapInstanceRef.current) return;
    
    loadingRef.current = true;
    
    const initializeMap = async () => {
      try {
        const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
        const mapId = (import.meta as any).env.VITE_GOOGLE_MAP_ID as string | undefined;
        if (!apiKey) {
          setError('Google Maps API key not found');
          return;
        }

        // Load Google Maps if not already loaded
        if (typeof google === 'undefined' || !google.maps) {
          const script = document.createElement('script');
          // Include marker library for AdvancedMarkerElement and weekly channel for latest features
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly&libraries=places,marker`;
          script.async = true;
          script.defer = true;
          
          await new Promise<void>((resolve, reject) => {
            script.onload = () => resolve();
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        // Create map
        if (mapRef.current && !mapInstanceRef.current) {
          const options: google.maps.MapOptions = {
            center,
            zoom,s
            mapTypeControl: true,
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: true,
          };
          // If a Cloud Map ID is provided, use vector map with that ID (required for Advanced Markers)
          if (mapId) {
            (options as any).mapId = mapId;
          } else {
            // Fallback to JSON styles when no Map ID configured
            options.styles = MAP_STYLES;
          }

          const map = new google.maps.Map(mapRef.current, options);
          
          mapInstanceRef.current = map;
          setIsLoaded(true);
        }
      } catch (err) {
        console.error('Failed to initialize map:', err);
        setError('Failed to load map');
      }
    };

    initializeMap();
  }, []); // Empty dependency array - initialize only once

  // Update map center and zoom when props change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.setCenter(center);
    map.setZoom(zoom);
  }, [center, zoom]);

  // Update markers when they change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((m: any) => {
      if (m && typeof m.setMap === 'function') {
        m.setMap(null);
      } else if (m && 'map' in m) {
        // AdvancedMarkerElement cleanup
        m.map = null;
      }
    });
    markersRef.current = [];

    // Add new markers
    const newMarkers = markers.map((markerData) => {
      // Prefer AdvancedMarkerElement if available AND map has a mapId (vector map)
      const AdvancedMarker = (google.maps as any).marker?.AdvancedMarkerElement;
      const hasMapId = !!(map as any).get('mapId') || !!((import.meta as any).env.VITE_GOOGLE_MAP_ID);
      if (AdvancedMarker && hasMapId) {
        const content = createMarkerContent(markerData.title);
        const advMarker = new AdvancedMarker({
          map,
          position: markerData.position,
          title: markerData.title,
          content,
        });
        if (markerData.info) {
          const infoWindow = new google.maps.InfoWindow({ content: markerData.info });
          // advanced markers use 'gmp-click'
          (advMarker as any).addListener('gmp-click', () => {
            infoWindow.open({ map, anchor: advMarker });
          });
        }
        return advMarker;
      } else {
        const marker = new google.maps.Marker({
          position: markerData.position,
          map: map,
          title: markerData.title,
        });
        if (markerData.info) {
          const infoWindow = new google.maps.InfoWindow({ content: markerData.info });
          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });
        }
        return marker;
      }
    });

    markersRef.current = newMarkers;
  }, [markers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      if (mapInstanceRef.current) {
        // Don't destroy the map instance as it can cause issues
        // Just clear references
        mapInstanceRef.current = null;
      }
    };
  }, []);

  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg ${className}`}
        style={{ height, width }}
      >
        <div className="text-center p-4">
          <p className="text-red-600 font-semibold mb-2">Map Error</p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ height, width }}>
      <div 
        ref={mapRef}
        className="w-full h-full rounded-lg overflow-hidden"
        style={{ minHeight: height }}
      />
      
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleGoogleMap;