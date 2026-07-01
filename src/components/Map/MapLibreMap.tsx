import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    background: transparent !important;
    border-radius: 0 !important;
    padding: 0 !important;
    box-shadow: none !important;
  }
  
  .office-popup .maplibregl-popup-tip {
    border-top-color: white !important;
    border-bottom-color: white !important;
    z-index: 9999 !important;
  }
  
  .office-popup .maplibregl-popup-close-button {
    display: none !important;
  }
  
  .maplibregl-popup {
    z-index: 9999 !important;
  }
  
  /* Marker animations */
  .custom-marker {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  
  .custom-marker:hover {
    z-index: 1000 !important;
    transform: scale(1.05);
  }
  
  .marker-icon {
    transition: all 0.2s ease !important;
  }
  
  /* Marker entrance animation */
  @keyframes markerDrop {
    0% {
      transform: translateY(-50px);
      opacity: 0;
    }
    60% {
      transform: translateY(5px);
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .marker-container {
    animation: markerDrop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = popupStyles;
  document.head.appendChild(styleElement);
}

export type MapStyle =
  | 'vibrant'
  | 'colorful'
  | 'dark'
  | 'light'
  | 'satellite'
  | 'streets'
  | 'outdoor'
  | 'neon'
  | 'retro'
  | 'candy';

export interface MapMarker {
  id?: string;
  position: { lat: number; lng: number };
  title?: string;
  info?: string;
  image?: string;
  price?: string;
  rating?: number;
  reviews?: number;
  address?: string;
  features?: string[];
  link?: string;
}

interface MapLibreMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  width?: string;
  className?: string;
  markers?: MapMarker[];
  mapStyle?: MapStyle;
  showStyleSelector?: boolean;
  bounds?: {
    sw: { lat: number; lng: number };
    ne: { lat: number; lng: number };
  };
  focusMarkers?: Array<{
    position: { lat: number; lng: number };
  }>;
  visible?: boolean;
}

// MapLibre-compatible open source map styles - Colorful & Vibrant
const MAP_STYLES: Record<MapStyle, { url: string; name: string; description: string; emoji: string }> = {
  'vibrant': {
    url: 'https://tiles.openfreemap.org/styles/liberty',
    name: '🎨 Vibrant',
    description: 'Colorful and detailed',
    emoji: '🎨'
  },
  'colorful': {
    url: 'https://tiles.openfreemap.org/styles/liberty',
    name: ' Vibrant',
    description: 'Rich colors with blue rivers',
    emoji: '🌈'
  },
  'streets': {
    url: 'https://demotiles.maplibre.org/style.json',
    name: '🗺️ Classic Streets',
    description: 'Detailed street map view',
    emoji: '🗺️'
  },
  'dark': {
    url: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
    name: '🌙 Dark Mode',
    description: 'Sleek dark theme',
    emoji: '🌙'
  },
  'light': {
    url: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
    name: '☀️ Light & Minimal',
    description: 'Clean muted style like MindTrip',
    emoji: '☀️'
  },
  'outdoor': {
    url: 'https://tiles.openfreemap.org/styles/bright',
    name: '🏔️ Outdoor',
    description: 'Bright with terrain features',
    emoji: '🏔️'
  },
  'satellite': {
    url: 'https://tiles.openfreemap.org/styles/bright',
    name: '🛰️ Satellite',
    description: 'High-detail aerial view',
    emoji: '🛰️'
  },
  'neon': {
    url: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
    name: '⚡ Neon City',
    description: 'Futuristic neon style',
    emoji: '⚡'
  },
  'retro': {
    url: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
    name: '🎮 Retro',
    description: 'Vintage map style',
    emoji: '🎮'
  },
  'candy': {
    url: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
    name: '🍭 Candy',
    description: 'Sweet pastel colors',
    emoji: '🍭'
  },
};

const MapLibreMap: React.FC<MapLibreMapProps> = ({
  center = { lat: 28.6139, lng: 77.2090 },
  zoom = 12,
  height = '400px',
  width = '100%',
  className = '',
  markers = [],
  mapStyle = 'retro',
  showStyleSelector = false,
  bounds,
  focusMarkers = [],
  visible = true,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const navigate = useNavigate();
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const popupsRef = useRef<maplibregl.Popup[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentStyle, setCurrentStyle] = useState<MapStyle>(mapStyle);

  // ─── Helper: resize then fitBounds with delay ──────────────────────────────
  // Production mein container height settle hone ka time deta hai before fitBounds
  const safeFitBounds = (
    fitBoundsFn: () => void,
    delay = 200
  ) => {
    // Immediate resize attempt
    map.current?.resize();

    // Delayed resize + fitBounds — guarantees layout is settled in prod
    setTimeout(() => {
      if (!map.current) return;
      map.current.resize();
      fitBoundsFn();
    }, delay);
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const container = mapContainer.current;

    try {
      // Validate center coordinates
      const validLng = center && typeof center.lng === 'number' && !isNaN(center.lng) ? center.lng : 77.2090;
      const validLat = center && typeof center.lat === 'number' && !isNaN(center.lat) ? center.lat : 28.6139;

      // Create map instance
      map.current = new maplibregl.Map({
        container: container,
        style: MAP_STYLES[currentStyle].url,
        center: [validLng, validLat],
        zoom: zoom,
        minZoom: 4, // Never show whole world
        maxZoom: 20,
        scrollZoom: true,
        dragRotate: false,
        touchZoomRotate: true,
        attributionControl: false,
      });

      // Add navigation controls
      map.current.addControl(new maplibregl.NavigationControl(), 'bottom-right');

      // Add scale control
      map.current.addControl(new maplibregl.ScaleControl(), 'bottom-left');

      map.current.on('load', () => {
        setIsLoaded(true);
        // Trigger resize to ensure map renders correctly
        if (map.current) {
          setTimeout(() => {
            map.current?.resize();
          }, 100);
        }
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

  // Resize map when container size changes - debounced for performance
  useEffect(() => {
    if (!map.current || !isLoaded) return;

    let resizeTimeout: NodeJS.Timeout;

    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (map.current) {
          map.current.resize();
        }
      }, 100);
    });

    if (mapContainer.current) {
      resizeObserver.observe(mapContainer.current);
    }

    return () => {
      clearTimeout(resizeTimeout);
      resizeObserver.disconnect();
    };
  }, [isLoaded]);

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

    const validLng = center && typeof center.lng === 'number' && !isNaN(center.lng) ? center.lng : 77.2090;
    const validLat = center && typeof center.lat === 'number' && !isNaN(center.lat) ? center.lat : 28.6139;

    map.current.flyTo({
      center: [validLng, validLat],
      zoom: zoom,
      essential: true,
    });
  }, [center, zoom, isLoaded]);

  // Trigger resize when visibility changes (Crucial for fixed/transitioning containers)
  useEffect(() => {
    if (!map.current || !isLoaded || !visible) return;

    const timer = setTimeout(() => {
      if (map.current) {
        map.current.resize();
        console.log('[MAP] Triggered visibility-based resize');
      }
    }, 300);

    const secondTimer = setTimeout(() => {
      if (map.current) {
        map.current.resize();
      }
    }, 600);

    return () => {
      clearTimeout(timer);
      clearTimeout(secondTimer);
    };
  }, [visible, isLoaded]);

  // Update markers
  useEffect(() => {
    if (!map.current || !isLoaded) return;

    // Clear existing markers and popups
    markersRef.current.forEach(marker => marker.remove());
    popupsRef.current.forEach(popup => popup.remove());
    markersRef.current = [];
    popupsRef.current = [];

    // Add new markers
    markers.forEach((markerData, index) => {
      if (!map.current) return;

      const mLat = markerData.position?.lat;
      const mLng = markerData.position?.lng;
      if (typeof mLat !== 'number' || isNaN(mLat) || typeof mLng !== 'number' || isNaN(mLng)) {
        return;
      }

      const el = document.createElement('div');
      el.className = 'custom-marker';

      const primary = '#35503F';

      el.innerHTML = `
        <div class="marker-container" style="
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 4px 14px rgba(0,0,0,0.22);
          border: 1px solid rgba(0,0,0,0.1);
          cursor: pointer;
        ">
          <span class="marker-icon" style="
            width: 32px;
            height: 32px;
            border-radius: 999px;
            background: ${primary}10;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: ${primary};
          ">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </span>
        </div>
      `;

      let popup: maplibregl.Popup | undefined;
      const popupHTML = `
        <div style="
          width: 220px;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          border-radius: 16px;
          overflow: hidden;
          background: white;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        ">
          <div style="position: relative; width: 100%; height: 120px;">
            <img 
              src="${markerData.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop'}" 
              alt="${markerData.title || 'Office'}"
              style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s;"
              onerror="this.src='https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80'; this.onerror=null;"
            />
            <div style="position: absolute; top: 8px; right: 8px; display: flex; gap: 6px;">
               <div style="
                 width: 24px; height: 24px;
                 background: rgba(255,255,255,0.9);
                 backdrop-filter: blur(4px);
                 border-radius: 50%;
                 display: flex; align-items: center; justify-content: center;
                 cursor: pointer;
                 box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                 transition: transform 0.2s;
               " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                   <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                 </svg>
               </div>
               <div style="
                 width: 24px; height: 24px;
                 background: rgba(255,255,255,0.9);
                 backdrop-filter: blur(4px);
                 border-radius: 50%;
                 display: flex; align-items: center; justify-content: center;
                 cursor: pointer;
                 box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                 transition: transform 0.2s;
               " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                   <line x1="12" y1="5" x2="12" y2="19"></line>
                   <line x1="5" y1="12" x2="19" y2="12"></line>
                 </svg>
               </div>
            </div>
            ${markerData.rating ? `
              <div style="
                position: absolute; bottom: 8px; left: 8px;
                background: rgba(255,255,255,0.95);
                padding: 2px 6px; border-radius: 10px;
                display: flex; align-items: center; gap: 2px;
                font-size: 10px; font-weight: 600;
                box-shadow: 0 2px 6px rgba(0,0,0,0.15);
              ">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="#F1B922" stroke="#F1B922" stroke-width="1">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                ${markerData.rating}
              </div>
            ` : ''}
          </div>
          <div style="padding: 12px;">
            <h3 style="margin: 0 0 4px 0; font-size: 13px; font-weight: 700; color: #1a1a1a; line-height: 1.2;">
              ${markerData.title || 'Space'}
            </h3>
            ${markerData.address ? `
              <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 10px; color: #666; font-size: 11px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink: 0">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 170px;">
                  ${markerData.address}
                </span>
              </div>
            ` : ''}
            <div style="
              display: flex; align-items: center; justify-content: space-between;
              padding-top: 10px; border-top: 1px solid #f0f0f0;
            ">
              <div>
                <span style="font-size: 9px; color: #888; display: block;">Starting from</span>
                <span style="font-size: 13px; font-weight: 700; color: #1a1a1a;">
                  ${markerData.price ? markerData.price.replace(/\/month.*/, '') : 'Ask for Price'}
                </span>
              </div>
              <button class="view-details-btn" style="
                background: #35503F; color: white; border: none;
                padding: 8px 16px; border-radius: 10px;
                font-size: 12px; font-weight: 500; cursor: pointer;
                transition: opacity 0.2s;
              " onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
                View
              </button>
            </div>
          </div>
        </div>
      `;

      popup = new maplibregl.Popup({
        offset: {
          'top': [0, 14],
          'bottom': [0, -14],
          'right': [-40, 0],
          'left': [40, 0],
          'top-left': [0, 0],
          'top-right': [0, 0],
          'bottom-left': [0, 0],
          'bottom-right': [0, 0]
        } as any,
        closeButton: true,
        closeOnClick: false,
        maxWidth: '320px',
        className: 'office-popup',
        focusAfterOpen: false,
      }).setHTML(popupHTML);

      popupsRef.current.push(popup);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([markerData.position.lng, markerData.position.lat])
        .addTo(map.current);

      let closeTimeout: NodeJS.Timeout;

      const markerIcon = el.querySelector('.marker-icon') as HTMLElement;

      el.addEventListener('mouseenter', () => {
        clearTimeout(closeTimeout);

        if (markerIcon) {
          markerIcon.style.transform = 'scale(1.15)';
          markerIcon.style.boxShadow = '0 5px 12px rgba(0,0,0,0.4)';
        }

        if (popup && map.current) {
          popup.setLngLat([markerData.position.lng, markerData.position.lat]);
          popup.addTo(map.current);

          setTimeout(() => {
            const popupEl = popup.getElement();
            if (popupEl) {
              popupEl.style.pointerEvents = 'auto';

              const viewDetailsBtn = popupEl.querySelector('.view-details-btn');
              if (viewDetailsBtn) {
                viewDetailsBtn.addEventListener('click', (e) => {
                  e.stopPropagation();
                  navigate(markerData.link || `/space/${markerData.id}`);
                });
              }

              popupEl.addEventListener('mouseenter', () => {
                clearTimeout(closeTimeout);
              });

              popupEl.addEventListener('mouseleave', () => {
                closeTimeout = setTimeout(() => {
                  popup.remove();
                }, 200);
              });
            }
          }, 50);
        }
      });

      el.addEventListener('mouseleave', () => {
        if (markerIcon) {
          markerIcon.style.transform = 'scale(1)';
          markerIcon.style.boxShadow = '0 3px 8px rgba(0,0,0,0.3)';
        }

        closeTimeout = setTimeout(() => {
          popup?.remove();
        }, 200);
      });

      markersRef.current.push(marker);
    });

    // ─── FIT BOUNDS (Production-safe) ────────────────────────────────────────
    // resize() pehle call karo, phir 200ms baad actual fitBounds
    // Yeh ensure karta hai ki production mein container height 0 na ho
    if (map.current && isLoaded) {
      if (bounds) {
        safeFitBounds(() => {
          map.current!.fitBounds(
            [
              [bounds.sw?.lng ?? 77.2090, bounds.sw?.lat ?? 28.6139], 
              [bounds.ne?.lng ?? 77.2090, bounds.ne?.lat ?? 28.6139]
            ],
            { padding: { top: 70, bottom: 50, left: 50, right: 50 }, maxZoom: 16.5, duration: 1200 }
          );
        });
      } else if (focusMarkers.length > 0) {
        const focusBounds = new maplibregl.LngLatBounds();
        focusMarkers.forEach(m => {
          if (m?.position?.lng != null && m?.position?.lat != null && !isNaN(m.position.lng) && !isNaN(m.position.lat)) {
            focusBounds.extend([m.position.lng, m.position.lat]);
          }
        });

        safeFitBounds(() => {
          map.current!.fitBounds(focusBounds, {
            padding: { top: 70, bottom: 50, left: 50, right: 50 },
            maxZoom: 16.5,
            duration: 1200
          });
        });
      } else if (markers.length > 0 && markers.length < 50 && !bounds) {
        const markerBounds = new maplibregl.LngLatBounds();
        markers.forEach(m => {
          if (m?.position?.lng != null && m?.position?.lat != null && !isNaN(m.position.lng) && !isNaN(m.position.lat)) {
            markerBounds.extend([m.position.lng, m.position.lat]);
          }
        });

        safeFitBounds(() => {
          map.current!.fitBounds(markerBounds, {
            padding: { top: 70, bottom: 50, left: 50, right: 50 },
            maxZoom: 16.5,
            duration: 1200
          });

          // If the markers are so far apart that we zoomed out to see full India (zoom < 5),
          // focus back on the center point instead.
          const currentZoom = map.current?.getZoom() || 0;
          if (currentZoom < 6) {
            const validLng = center && typeof center.lng === 'number' && !isNaN(center.lng) ? center.lng : 77.2090;
            const validLat = center && typeof center.lat === 'number' && !isNaN(center.lat) ? center.lat : 28.6139;
            map.current?.flyTo({ center: [validLng, validLat], zoom: 11, duration: 1000 });
          }
        });
      }
    }
  }, [markers, bounds, focusMarkers, isLoaded]);

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
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-10 max-w-xs">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <span>🎨</span>
              <span>Map Themes</span>
            </h3>
          </div>
          <div className="flex flex-col max-h-96 overflow-y-auto">
            {Object.entries(MAP_STYLES).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handleStyleChange(key as MapStyle)}
                className={`px-4 py-3 text-left transition-all duration-200 border-b border-gray-100 last:border-b-0 ${currentStyle === key
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-inner'
                    : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50'
                  }`}
                title={value.description}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{value.emoji}</span>
                  <div className="flex-1">
                    <div className={`text-sm font-semibold ${currentStyle === key ? 'text-white' : 'text-gray-900'}`}>
                      {value.name}
                    </div>
                    <div className={`text-xs mt-0.5 ${currentStyle === key ? 'text-white/90' : 'text-gray-500'}`}>
                      {value.description}
                    </div>
                  </div>
                  {currentStyle === key && (
                    <span className="text-white text-lg">✓</span>
                  )}
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

    </div>
  );
};

export default MapLibreMap;