import { useEffect, useRef, useState } from 'react';

interface GoogleMapProps {
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
  onMapLoad?: (map: google.maps.Map) => void;
}

// Global variable to track if Google Maps API is loaded
let isGoogleMapsLoaded = false;
let isGoogleMapsLoading = false;

const loadGoogleMapsScript = (apiKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (isGoogleMapsLoaded) {
      resolve();
      return;
    }

    if (isGoogleMapsLoading) {
      // Wait for the current loading to complete
      const checkLoaded = () => {
        if (isGoogleMapsLoaded) {
          resolve();
        } else {
          setTimeout(checkLoaded, 100);
        }
      };
      checkLoaded();
      return;
    }

    isGoogleMapsLoading = true;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      isGoogleMapsLoaded = true;
      isGoogleMapsLoading = false;
      resolve();
    };
    
    script.onerror = () => {
      isGoogleMapsLoading = false;
      reject(new Error('Failed to load Google Maps script'));
    };
    
    document.head.appendChild(script);
  });
};

const GoogleMap: React.FC<GoogleMapProps> = ({
  center = { lat: 28.6139, lng: 77.2090 }, // Default to Delhi
  zoom = 12,
  height = '400px',
  width = '100%',
  className = '',
  markers = [],
  onMapLoad,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initMap = async () => {
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
      
      if (!apiKey) {
        setError('Google Maps API key not found. Please check your environment variables.');
        setLoading(false);
        return;
      }

      // Wait for the ref to be available
      if (!mapRef.current) {
        setTimeout(() => initMap(), 100);
        return;
      }

      try {
        // Load Google Maps API
        await loadGoogleMapsScript(apiKey);

        // Double check the ref is still available after async operation
        if (!mapRef.current) {
          setError('Map container was removed during initialization');
          setLoading(false);
          return;
        }

        const mapInstance = new google.maps.Map(mapRef.current, {
          center,
          zoom,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'on' }],
            },
          ],
        });

        setMap(mapInstance);
        setLoading(false);
        
        // Call onMapLoad callback if provided
        if (onMapLoad) {
          onMapLoad(mapInstance);
        }
      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError('Failed to load Google Maps. Please try again.');
        setLoading(false);
      }
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(initMap, 50);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []); // Remove dependencies to prevent re-initialization

  // Separate effect for updating markers when they change
  useEffect(() => {
    if (map && markers.length > 0) {
      // Clear existing markers (you might want to store marker references)
      // Add new markers
      markers.forEach((markerData) => {
        const marker = new google.maps.Marker({
          position: markerData.position,
          map: map,
          title: markerData.title,
        });

        // Add info window if info is provided
        if (markerData.info) {
          const infoWindow = new google.maps.InfoWindow({
            content: markerData.info,
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });
        }
      });
    }
  }, [map, markers]);

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

  if (loading) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg ${className}`}
        style={{ height, width }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className={`rounded-lg overflow-hidden ${className}`}
      style={{ height, width }}
    />
  );
};

export default GoogleMap;