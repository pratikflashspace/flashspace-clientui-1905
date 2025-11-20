import { ReactNode, useState, useEffect, useCallback, useRef, memo } from 'react';
import { Map as MapIcon, X, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResizableMapLayoutProps {
  children: ReactNode; // Listing content
  mapContent: ReactNode; // Map content
  defaultListingWidth?: number; // Percentage (e.g., 50 for 50%)
}

/**
 * Optimized Resizable Map Layout Component
 * Provides a split-view layout with resizable panels for listings and map
 * - Desktop: Split view with draggable divider
 * - Mobile/Tablet: Floating map button with full-screen modal
 * - Expand/Collapse functionality
 * - Performance optimized with memo, useCallback, and RAF throttling
 */
const ResizableMapLayout = memo<ResizableMapLayoutProps>(({
  children,
  mapContent,
  defaultListingWidth = 50,
}) => {
  const [listingWidth, setListingWidth] = useState(defaultListingWidth);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const rafRef = useRef<number>();
  const lastWidthRef = useRef<number>(defaultListingWidth);

  // Handle mouse drag to resize with RAF throttling for performance
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Cancel any pending animation frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      // Use RAF to throttle updates to monitor refresh rate
      rafRef.current = requestAnimationFrame(() => {
        const windowWidth = window.innerWidth;
        const newListingWidth = (e.clientX / windowWidth) * 100;

        // Constrain between 20% and 80%
        if (newListingWidth >= 20 && newListingWidth <= 80) {
          // Only update if change is significant (> 0.5%)
          if (Math.abs(newListingWidth - lastWidthRef.current) > 0.5) {
            lastWidthRef.current = newListingWidth;
            setListingWidth(newListingWidth);
          }
        }
      });
    };

    const handleMouseUp = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  // Toggle map expansion - memoized to prevent re-creation
  const toggleMapExpansion = useCallback(() => {
    if (isMapExpanded) {
      const width = defaultListingWidth;
      setListingWidth(width);
      lastWidthRef.current = width;
      setIsMapExpanded(false);
    } else {
      lastWidthRef.current = 20;
      setListingWidth(20); // Compress listings to 20%
      setIsMapExpanded(true);
    }
  }, [isMapExpanded, defaultListingWidth]);

  // Reset to default - memoized to prevent re-creation
  const resetLayout = useCallback(() => {
    const width = defaultListingWidth;
    setListingWidth(width);
    lastWidthRef.current = width;
    setIsMapExpanded(false);
  }, [defaultListingWidth]);

  // Memoize calculated width to prevent unnecessary recalculations
  const mapWidth = 100 - listingWidth;

  return (
    <>
      {/* Desktop & Tablet Landscape - Split View with Resizable Panels */}
      <div className="hidden lg:flex flex-1 overflow-hidden relative">
        {/* Listings Panel */}
        <div
          style={{ 
            width: `${listingWidth}%`,
            willChange: isDragging ? 'width' : 'auto'
          }}
          className={`overflow-y-auto ${isDragging ? '' : 'transition-all duration-300 ease-out'}`}
        >
          {children}
        </div>

        {/* Draggable Divider */}
        <div
          onMouseDown={handleMouseDown}
          className="w-1 bg-gray-200 hover:bg-primary hover:w-1.5 cursor-col-resize flex-shrink-0 transition-all duration-200 relative group z-50"
        >
          {/* Drag Handle Indicator */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-primary text-white rounded-full p-1.5 shadow-lg">
              <div className="flex gap-0.5">
                <div className="w-0.5 h-4 bg-white rounded"></div>
                <div className="w-0.5 h-4 bg-white rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Panel */}
        <div
          style={{ 
            width: `${mapWidth}%`,
            willChange: isDragging ? 'width' : 'auto'
          }}
          className={`relative overflow-hidden ${isDragging ? '' : 'transition-all duration-300 ease-out'}`}
        >
          {mapContent}

          {/* Map Control Buttons */}
          <div className="absolute top-4 right-4 z-[100] flex flex-col gap-2">
            {/* Expand/Compress Button */}
            <Button
              onClick={toggleMapExpansion}
              size="sm"
              className="bg-white text-gray-700 hover:bg-gray-100 shadow-lg border border-gray-200 h-9 w-9 p-0"
              title={isMapExpanded ? 'Compress Map' : 'Expand Map'}
            >
              {isMapExpanded ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>

            {/* Reset Layout Button */}
            {listingWidth !== defaultListingWidth && (
              <Button
                onClick={resetLayout}
                size="sm"
                className="bg-white text-gray-700 hover:bg-gray-100 shadow-lg border border-gray-200 h-9 w-9 p-0"
                title="Reset Layout"
              >
                <ChevronLeft className="w-4 h-4" />
                <ChevronRight className="w-4 h-4 -ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Portrait - Listings with Floating Map Button */}
      <div className="lg:hidden flex-1 overflow-y-auto">
        {children}

        {/* Floating Map Button */}
        <Button
          onClick={useCallback(() => setShowMapModal(true), [])}
          className="fixed bottom-6 right-6 z-50 bg-[#172A3A] text-white rounded-full p-4 shadow-2xl hover:bg-[#172A3A]/90 transition-all duration-300 flex items-center gap-2 font-medium"
        >
          <MapIcon className="w-5 h-5" />
          <span className="text-sm">View Map</span>
        </Button>

        {/* Map Modal */}
        {showMapModal && (
          <div className="fixed inset-0 z-[9999] bg-white overflow-hidden">
            {/* Modal Header */}
            <div className="absolute top-0 left-0 right-0 z-[10000] bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Map View</h3>
              <Button
                onClick={useCallback(() => setShowMapModal(false), [])}
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-gray-100 rounded-full h-auto"
                aria-label="Close map"
              >
                <X className="w-5 h-5 text-gray-600" />
              </Button>
            </div>

            {/* Map Content */}
            <div className="w-full h-full pt-[60px] pb-[80px]">
              {mapContent}
            </div>

            {/* Close Button at Bottom */}
            <div className="absolute bottom-0 left-0 right-0 z-[10000] p-4 bg-gradient-to-t from-white via-white to-transparent pointer-events-none">
              <Button
                onClick={useCallback(() => setShowMapModal(false), [])}
                className="w-full bg-[#172A3A] text-white hover:bg-[#172A3A]/90 pointer-events-auto"
              >
                Close Map
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
});

ResizableMapLayout.displayName = 'ResizableMapLayout';

export default ResizableMapLayout;
