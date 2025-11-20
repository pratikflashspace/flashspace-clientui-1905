# Resizable Map Layout Component

## Overview
The `ResizableMapLayout` component provides a comprehensive solution for displaying listings alongside an interactive map with responsive behavior and resizable panels.

## Features

### 🖥️ Desktop View (≥1024px)
- **Split-view layout** with resizable panels
- **Draggable divider** to adjust listing/map width ratio
- **Expand/Compress controls** to maximize map or listings
- **Hover indicators** on the divider for better UX
- **Constraints**: Width can be adjusted between 20% and 80%

### 📱 Mobile & Tablet View (<1024px)
- **Full-width listings** view
- **Floating "View Map" button** in bottom-right corner
- **Full-screen map modal** with smooth transitions
- **Header with close button**
- **Bottom close button** with gradient overlay

## Usage

```tsx
import ResizableMapLayout from '@/components/services/ResizableMapLayout';
import MapSection from '@/components/services/MapSection';

<ResizableMapLayout
  defaultListingWidth={50} // 50% for listings, 50% for map
  mapContent={
    <MapSection
      center={mapCenter}
      markers={mapMarkers}
      zoom={11}
      height="100%"
    />
  }
>
  {/* Your listings content here */}
  <div className="listings-content">
    {/* Listing cards, filters, etc. */}
  </div>
</ResizableMapLayout>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | Required | Listing content (left panel) |
| `mapContent` | `ReactNode` | Required | Map component (right panel) |
| `defaultListingWidth` | `number` | `50` | Initial width percentage for listings |

## Controls

### Desktop Controls
1. **Drag Divider**: Click and drag the vertical divider between panels
2. **Expand/Compress Button**: Top-right of map panel
   - Maximize icon (⛶): Expands map to 80% width
   - Minimize icon (⊡): Returns to default split
3. **Reset Button**: Appears when layout is adjusted, restores default 50/50 split

### Mobile Controls
1. **View Map Button**: Floating button opens full-screen map modal
2. **Close Buttons**: Header X button or bottom "Close Map" button

## Implementation Examples

### Coworking Space
```tsx
// pages/services/CoworkingSpace.tsx
<ResizableMapLayout
  defaultListingWidth={50}
  mapContent={
    <MapSection
      key="coworking-map"
      center={resolvedCenter}
      markers={mapMarkers}
      zoom={11}
      height="100%"
    />
  }
>
  <div ref={scrollContainerRef} className="w-full h-full overflow-y-auto">
    {/* Listings content */}
  </div>
</ResizableMapLayout>
```

### Virtual Office
```tsx
// pages/services/VirtualOffice.tsx
<ResizableMapLayout
  defaultListingWidth={50}
  mapContent={
    <MapSection
      key="virtual-office-map"
      center={resolvedCenter}
      markers={mapMarkers}
      zoom={11}
      height="100%"
    />
  }
>
  <div ref={scrollContainerRef} className="w-full h-full overflow-y-auto">
    {/* Listings content */}
  </div>
</ResizableMapLayout>
```

## Technical Details

### State Management
- `listingWidth`: Current width percentage of listings panel
- `isMapExpanded`: Whether map is in expanded state
- `showMapModal`: Mobile modal visibility
- `isDragging`: Active drag state for divider

### Responsive Breakpoints
- **Desktop**: `lg:` (≥1024px) - Split view with resizable panels
- **Mobile/Tablet**: `<lg` (<1024px) - Stacked view with modal map

### Z-Index Hierarchy
- Modal overlay: `z-[9999]`
- Modal header/footer: `z-[10000]`
- Floating button: `z-50`
- Divider controls: `z-[100]`
- Draggable divider: `z-50`

### Animations
- Panel transitions: `300ms ease-out`
- Divider hover: `200ms`
- Modal appearance: Instant overlay, smooth content transition

## Styling Guidelines

### Parent Container
```tsx
<div className="flex flex-1 overflow-hidden mt-16 md:mt-20">
  <ResizableMapLayout>
    {/* ... */}
  </ResizableMapLayout>
</div>
```

### Listing Content
- Use `w-full h-full overflow-y-auto` for scrollable content
- Add `data-lenis-prevent` to disable smooth scroll on listing container
- Apply responsive padding: `px-4 sm:px-6 py-4 sm:py-6`

## Browser Support
- Modern browsers with CSS Grid and Flexbox support
- Mouse events for desktop dragging
- Touch events for mobile interactions
- ResizeObserver API for map resizing

## Performance Considerations
- Map uses `key` prop to force re-initialization in modal
- ResizeObserver ensures map renders correctly when container size changes
- Drag events use `preventDefault()` and cursor styling for smooth UX
- Constrained width range (20%-80%) prevents extreme layouts

## Accessibility
- Semantic button elements for all controls
- `aria-label` on close buttons
- Keyboard-friendly (buttons are focusable)
- Clear visual indicators for interactive elements

## Future Enhancements
- [ ] Remember user's preferred layout (localStorage)
- [ ] Keyboard shortcuts for expand/collapse
- [ ] Animation options (slide/fade)
- [ ] Custom breakpoint configuration
- [ ] Snap-to positions (25%, 33%, 50%, 66%, 75%)
