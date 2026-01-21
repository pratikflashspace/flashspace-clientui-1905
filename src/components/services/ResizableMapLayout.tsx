import { ReactNode, useState, useEffect, useCallback, useRef, memo } from 'react';
import { Map as MapIcon, X, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResizableMapLayoutProps {
  children: ReactNode; // Listing content
  mapContent: ReactNode; // Map content
  defaultListingWidth?: number; // Percentage (e.g., 50 for 50%)
  showFloatingButton?: boolean; // Control visibility of mobile floating button
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
  showFloatingButton = true,
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

  // Modal Handlers - Defined at top level to avoid conditional hook calls
  const handleOpenModal = useCallback(() => setShowMapModal(true), []);
  const handleCloseModal = useCallback(() => setShowMapModal(false), []);

  // Memoize calculated width to prevent unnecessary recalculations
  const mapWidth = 100 - listingWidth;

  return (
    <>
      {/* Desktop & Tablet Landscape - Split View with Resizable Panels */}
      <div className="hidden lg:flex w-full h-full overflow-hidden relative">
        {/* Listings Panel */}
        <div
          style={{
            width: `${listingWidth}%`,
            height: '100%',
            maxHeight: '100%',
            willChange: isDragging ? 'width' : 'auto'
          }}
          className={`overflow-y-auto flex-shrink-0 ${isDragging ? '' : 'transition-all duration-300 ease-out'}`}
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
            height: '100%',
            maxHeight: '100%',
            willChange: isDragging ? 'width' : 'auto'
          }}
          className={`relative flex-shrink-0 ${isDragging ? '' : 'transition-all duration-300 ease-out'}`}
        >
          <div className="w-full h-full overflow-hidden">
            {mapContent}
          </div>

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
        {/* Floating Mini Map Widget (Mobile) - Only show when modal is closed and enabled */}
        {!showMapModal && showFloatingButton && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleOpenModal();
            }}
            className="fixed bottom-4 right-4 z-[100] w-36 h-36 bg-gray-100 rounded-2xl shadow-2xl border-4 border-white overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 animate-in slide-in-from-bottom-10 fade-in select-none"
            role="button"
            aria-label="Expand Map"
          >
            {/* Transparent Interaction Blocker - Sits ON TOP of map to capture clicks */}
            <div className="absolute inset-0 z-20 bg-transparent" />

            {/* Map Preview */}
            <div className="w-full h-full opacity-90 relative z-0">
              {mapContent}
            </div>

            {/* Visual Overlay & Label */}
            <div className="absolute inset-0 z-30 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end items-center pb-3 pointer-events-none">
              <div className="bg-white/95 text-black text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-0.5">
                <Maximize2 className="w-3 h-3" />
                <span>Expand Map</span>
              </div>
            </div>
          </div>
        )}

        {/* Map Modal */}
        {showMapModal && (
          <div className="fixed inset-0 z-[9999] bg-white flex flex-col animate-in slide-in-from-bottom-5 fade-in duration-300">
            {/* Modal Header */}
            <div className="flex-none z-[10000] bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm h-[60px]">
              <h3 className="text-lg font-semibold text-gray-900">Map View</h3>
              <Button
                onClick={handleCloseModal}
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-gray-100 rounded-full h-auto"
                aria-label="Close map"
              >
                <X className="w-5 h-5 text-gray-600" />
              </Button>
            </div>

            {/* Map Content - Flex 1 to fill remaining space */}
            <div className="flex-1 relative w-full overflow-hidden bg-gray-50">
              {/* Ensure map content takes full height of this flex child */}
              <div className="absolute inset-0">
                {mapContent}
              </div>
            </div>

            {/* Close Button Footer */}
            <div className="flex-none z-[10000] p-4 bg-white border-t border-gray-100 h-[80px] flex items-center justify-center">
              <Button
                onClick={handleCloseModal}
                className="w-full bg-[#172A3A] text-white hover:bg-[#172A3A]/90 h-12 text-base font-semibold rounded-xl"
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
