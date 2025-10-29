import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// Add styles for popup to prevent it from being hidden
const popupStyles = `
  .office-popup {
    pointer-events: auto !important;
    z-index: 9999 !important;
  }
  
  .office-popup .maplibregl-popup-content {
    pointer-events: auto !important;
    border-radius: 12px;
    padding: 0 !important;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important;
  }
  
  .office-popup .maplibregl-popup-tip {
    border-top-color: white !important;
    border-bottom-color: white !important;
    z-index: 9999 !important;
  }
  
  .office-popup .maplibregl-popup-close-button {
    pointer-events: auto !important;
    cursor: pointer !important;
    z-index: 10000 !important;
  }
  
  .maplibregl-popup {
    z-index: 9999 !important;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = popupStyles;
  document.head.appendChild(styleElement);
}

export type MapStyle =
  | 'osm-bright'
  | 'dark'
  | 'light'
  | 'satellite'
  | 'streets'
  | 'outdoor'
  | 'toner';

interface MapLibreMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  width?: string;
  className?: string;
  markers?: Array<{
    position: { lat: number; lng: number };
    title?: string;
    info?: string;
    image?: string;
    price?: string;
    rating?: number;
    reviews?: number;
    address?: string;
    features?: string[];
  }>;
  mapStyle?: MapStyle;
  showStyleSelector?: boolean;
}

// MapLibre-compatible open source map styles
const MAP_STYLES: Record<MapStyle, { url: string; name: string; description: string }> = {
  'osm-bright': {
    url: 'https://tiles.openfreemap.org/styles/bright',
    name: 'Bright',
    description: 'Clean and colorful street map',
  },
  'streets': {
    url: 'https://tiles.openfreemap.org/styles/liberty',
    name: 'Streets',
    description: 'Detailed street map view',
  },
  'dark': {
    url: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
    name: 'Dark Mode',
    description: 'Dark theme for low-light viewing',
  },
  'light': {
    url: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
    name: 'Light',
    description: 'Minimal light theme',
  },
  'outdoor': {
    url: 'https://tiles.openfreemap.org/styles/positron',
    name: 'Outdoor',
    description: 'Terrain and outdoor features',
  },
  'satellite': {
    url: 'https://api.maptiler.com/maps/hybrid/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL',
    name: 'Satellite',
    description: 'Satellite imagery view',
  },
  'toner': {
    url: 'https://tiles.openfreemap.org/styles/positron',
    name: 'Monochrome',
    description: 'High contrast B&W',
  },
};

const MapLibreMap: React.FC<MapLibreMapProps> = ({
  center = { lat: 28.6139, lng: 77.2090 },
  zoom = 12,
  height = '400px',
  width = '100%',
  className = '',
  markers = [],
  mapStyle = 'toner',
  showStyleSelector = false,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const popupsRef = useRef<maplibregl.Popup[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentStyle, setCurrentStyle] = useState<MapStyle>(mapStyle);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const container = mapContainer.current;

    try {
      // Create map instance
      map.current = new maplibregl.Map({
        container: container,
        style: MAP_STYLES[currentStyle].url,
        center: [center.lng, center.lat],
        zoom: zoom,
        scrollZoom: true, // Enable scroll zoom when cursor is on map
        dragRotate: false, // Disable map rotation
        touchZoomRotate: true, // Keep pinch zoom on mobile
      });

      // Add navigation controls
      map.current.addControl(new maplibregl.NavigationControl(), 'bottom-right');

      // Add scale control
      map.current.addControl(new maplibregl.ScaleControl(), 'bottom-left');

      map.current.on('load', () => {
        setIsLoaded(true);
      });

      // Prevent page scroll when mouse is over map
      const preventScroll = (e: WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();
      };

      container.addEventListener('wheel', preventScroll, { passive: false });

      // Cleanup
      return () => {
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
        container.removeEventListener('wheel', preventScroll);
      };
    } catch (err) {
      console.error('Failed to initialize MapLibre map:', err);
    }
  }, []);

  // Update map style
  useEffect(() => {
    if (!map.current || !isLoaded) return;

    try {
      map.current.setStyle(MAP_STYLES[currentStyle].url);
    } catch (err) {
      console.error('Failed to change map style:', err);
    }
  }, [currentStyle, isLoaded]);

  // Update center and zoom
  useEffect(() => {
    if (!map.current || !isLoaded) return;

    map.current.flyTo({
      center: [center.lng, center.lat],
      zoom: zoom,
      essential: true,
    });
  }, [center, zoom, isLoaded]);

  // Update markers
  useEffect(() => {
    if (!map.current || !isLoaded) return;

    // Clear existing markers and popups
    markersRef.current.forEach(marker => marker.remove());
    popupsRef.current.forEach(popup => popup.remove());
    markersRef.current = [];
    popupsRef.current = [];

    // Add new markers
    markers.forEach((markerData) => {
      if (!map.current) return;

      // Create custom marker element - Google Maps style circular icons
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.innerHTML = `
        <div style="
          position: relative;
          cursor: pointer;
        " class="marker-container">
          <!-- Simple circular marker like Google Maps -->
          <div style="
            width: 36px;
            height: 36px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            border: 2px solid #f0f0f0;
            position: relative;
          ">
            <!-- Building/Office Icon -->
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#5f6368">
              <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
            </svg>
          </div>
          <!-- Bottom shadow -->
          <div style="
            position: absolute;
            bottom: -4px;
            left: 50%;
            transform: translateX(-50%);
            width: 24px;
            height: 6px;
            background: rgba(0,0,0,0.15);
            border-radius: 50%;
            filter: blur(3px);
          "></div>
        </div>
      `;

      // Create detailed popup card with image
      let popup: maplibregl.Popup | undefined;
      const popupHTML = `
        <div style="
          width: 320px;
          font-family: system-ui, -apple-system, sans-serif;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        ">
          <!-- Image Section -->
          <div style="
            position: relative;
            width: 100%;
            height: 180px;
            overflow: hidden;
          ">
            <img 
              src="${markerData.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop'}" 
              alt="${markerData.title || 'Office'}"
              style="
                width: 100%;
                height: 100%;
                object-fit: cover;
              "
            />
            ${markerData.rating ? `
              <div style="
                position: absolute;
                top: 12px;
                right: 12px;
                background: rgba(255,255,255,0.95);
                backdrop-filter: blur(8px);
                padding: 4px 10px;
                border-radius: 20px;
                display: flex;
                align-items: center;
                gap: 4px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              ">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#FBBC04">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
                <span style="
                  font-size: 13px;
                  font-weight: 600;
                  color: #202124;
                ">${markerData.rating}</span>
                ${markerData.reviews ? `
                  <span style="
                    font-size: 12px;
                    color: #5f6368;
                  ">(${markerData.reviews})</span>
                ` : ''}
              </div>
            ` : ''}
          </div>
          
          <!-- Content Section -->
          <div style="
            padding: 16px;
            background: white;
          ">
            <!-- Title -->
            <h3 style="
              margin: 0 0 8px 0;
              font-size: 16px;
              font-weight: 600;
              color: #202124;
              line-height: 1.4;
            ">${markerData.title || 'Virtual Office'}</h3>
            
            <!-- Address -->
            ${markerData.address ? `
              <div style="
                display: flex;
                align-items: start;
                gap: 6px;
                margin-bottom: 12px;
              ">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#5f6368" style="flex-shrink: 0; margin-top: 2px;">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span style="
                  font-size: 13px;
                  color: #5f6368;
                  line-height: 1.4;
                ">${markerData.address}</span>
              </div>
            ` : ''}
            
            <!-- Features -->
            ${markerData.features && markerData.features.length > 0 ? `
              <div style="
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                margin-bottom: 12px;
              ">
                ${markerData.features.slice(0, 3).map(feature => `
                  <span style="
                    font-size: 11px;
                    padding: 4px 10px;
                    background: #e8f0fe;
                    color: #1967d2;
                    border-radius: 12px;
                    font-weight: 500;
                  ">${feature}</span>
                `).join('')}
              </div>
            ` : ''}
            
            <!-- Price -->
            ${markerData.price ? `
              <div style="
                padding-top: 12px;
                border-top: 1px solid #e8eaed;
                display: flex;
                align-items: center;
                justify-content: space-between;
              ">
                <div>
                  <div style="
                    font-size: 10px;
                    color: #5f6368;
                    margin-bottom: 2px;
                  ">Starting from</div>
                  <div style="
                    font-size: 18px;
                    font-weight: 700;
                    color: #EDB003;
                  ">${markerData.price}</div>
                </div>
                <button style="
                  background: #1a73e8;
                  color: white;
                  border: none;
                  padding: 8px 16px;
                  border-radius: 6px;
                  font-size: 13px;
                  font-weight: 500;
                  cursor: pointer;
                  transition: background 0.2s;
                " onmouseover="this.style.background='#1557b0'" onmouseout="this.style.background='#1a73e8'">
                  View Details
                </button>
              </div>
            ` : ''}
          </div>
        </div>
      `;

      popup = new maplibregl.Popup({
        offset: 40,
        closeButton: true,
        closeOnClick: false,
        maxWidth: '320px',
        className: 'office-popup',
        focusAfterOpen: false,
      }).setHTML(popupHTML);

      popupsRef.current.push(popup);

      // Create marker (without automatic popup binding)
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([markerData.position.lng, markerData.position.lat])
        .addTo(map.current);

      let closeTimeout: NodeJS.Timeout;

      // Mouse enters marker - show popup
      el.addEventListener('mouseenter', () => {
        clearTimeout(closeTimeout);
        if (popup && map.current) {
          popup.setLngLat([markerData.position.lng, markerData.position.lat]);
          popup.addTo(map.current);

          // Wait a bit for popup to render, then add listeners
          setTimeout(() => {
            const popupEl = popup.getElement();
            if (popupEl) {
              // Make popup interactive
              popupEl.style.pointerEvents = 'auto';
              
              // Mouse enters popup - don't close
              popupEl.addEventListener('mouseenter', () => {
                clearTimeout(closeTimeout);
              });

              // Mouse leaves popup - delay closing to prevent accidental close
              popupEl.addEventListener('mouseleave', () => {
                closeTimeout = setTimeout(() => {
                  popup.remove();
                }, 200);
              });
            }
          }, 50);
        }
      });

      // Mouse leaves marker - delay closing (so user can move to popup)
      el.addEventListener('mouseleave', () => {
        closeTimeout = setTimeout(() => {
          popup?.remove();
        }, 200);
      });

      markersRef.current.push(marker);
    });
  }, [markers, isLoaded]);

  // Change map style
  const handleStyleChange = (style: MapStyle) => {
    setCurrentStyle(style);
  };

  return (
    <div className={`relative ${className}`} style={{ height, width }}>
      <div
        ref={mapContainer}
        className="w-full h-full rounded-lg overflow-hidden"
        style={{ minHeight: height }}
      />

      {/* Style Selector */}
      {showStyleSelector && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg border border-gray-300 overflow-hidden z-10">
          <div className="flex flex-col">
            {Object.entries(MAP_STYLES).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handleStyleChange(key as MapStyle)}
                className={`px-4 py-2.5 text-left transition-colors ${
                  currentStyle === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                title={value.description}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{value.name}</span>
                  <span className={`text-xs ${currentStyle === key ? 'text-blue-100' : 'text-gray-500'}`}>
                    {value.description}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
            <p className="text-gray-600 font-medium">Loading map...</p>
            <p className="text-gray-500 text-sm mt-1">Powered by MapLibre GL JS</p>
          </div>
        </div>
      )}

      {/* Attribution badge */}
      <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-md shadow-sm text-xs text-gray-600 font-medium z-10">
        🗺️ {MAP_STYLES[currentStyle].name}
      </div>
    </div>
  );
};

export default MapLibreMap;
