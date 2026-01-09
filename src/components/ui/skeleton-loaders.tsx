import { memo } from "react";

/**
 * Modern Skeleton Card Loader - MindTrip Style
 */
export const SkeletonCard = memo(() => {
  return (
    <div className="animate-pulse">
      {/* Image Skeleton - Rounded like MindTrip */}
      <div className="relative aspect-[4/3] bg-gray-200 rounded-2xl mb-3">
        {/* Top right action buttons */}
        <div className="absolute top-3 right-3 flex gap-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full" />
          <div className="w-8 h-8 bg-gray-300 rounded-full" />
        </div>
        {/* Popular badge placeholder */}
        <div className="absolute top-3 left-3 w-20 h-6 bg-gray-300 rounded-full" />
        {/* Carousel dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          <div className="w-2 h-1.5 bg-gray-300 rounded-full" />
          <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
          <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
          <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="px-1">
        {/* Title & Rating Row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="h-5 bg-gray-200 rounded w-2/3" />
          <div className="flex items-center gap-1 flex-shrink-0">
            <div className="w-4 h-4 bg-gray-200 rounded" />
            <div className="h-4 w-12 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Location */}
        <div className="h-4 bg-gray-200 rounded w-full mb-3" />

        {/* Features */}
        <div className="flex gap-2 mb-3">
          <div className="h-6 w-20 bg-gray-200 rounded-md" />
          <div className="h-6 w-24 bg-gray-200 rounded-md" />
        </div>

        {/* Price */}
        <div className="h-6 w-28 bg-gray-200 rounded" />
      </div>
    </div>
  );
});

SkeletonCard.displayName = "SkeletonCard";

/**
 * Skeleton loader for SpaceComponent detail page
 */
export const SpaceDetailSkeleton = memo(() => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-3" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-4 w-20 bg-gray-200 rounded" />
            <div className="h-4 w-48 bg-gray-200 rounded" />
          </div>
          <div className="h-4 w-24 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Photo Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px] mb-8 rounded-2xl overflow-hidden">
        <div className="md:col-span-2 h-full bg-gray-200" />
        <div className="md:col-span-1 grid grid-rows-2 gap-2 h-full">
          <div className="bg-gray-200" />
          <div className="bg-gray-200" />
        </div>
        <div className="md:col-span-1 h-full bg-gray-200" />
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column */}
        <div className="lg:col-span-2">
          {/* About Section */}
          <div className="border-b pb-8 mb-8">
            <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-4/6" />
            </div>
          </div>

          {/* Amenities Section */}
          <div className="border-b pb-8 mb-8">
            <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-gray-200 rounded" />
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Map Section */}
          <div className="mb-8">
            <div className="h-6 w-36 bg-gray-200 rounded mb-4" />
            <div className="w-full h-64 bg-gray-200 rounded-xl" />
            <div className="h-4 w-64 bg-gray-200 rounded mt-2" />
          </div>
        </div>

        {/* Right Column - Booking Card */}
        <div className="relative">
          <div className="sticky top-24 border rounded-xl shadow-xl p-6 bg-white">
            {/* Price */}
            <div className="flex justify-between items-end mb-6">
              <div className="h-8 w-32 bg-gray-200 rounded" />
              <div className="h-4 w-12 bg-gray-200 rounded" />
            </div>

            {/* Toggle */}
            <div className="h-12 bg-gray-200 rounded-full mb-6" />

            {/* Plans */}
            <div className="space-y-3 mb-6">
              <div className="h-4 w-20 bg-gray-200 rounded" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg p-3">
                  <div className="flex justify-between mb-2">
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                  </div>
                  <div className="space-y-1">
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>

            {/* Date Picker */}
            <div className="h-14 bg-gray-200 rounded-lg mb-6" />

            {/* Button */}
            <div className="h-12 bg-gray-200 rounded-lg" />
            <div className="h-4 w-32 bg-gray-200 rounded mx-auto mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
});

SpaceDetailSkeleton.displayName = "SpaceDetailSkeleton";

/**
 * Grid of skeleton cards for listing pages
 */
export const SkeletonCardGrid = memo<{ count?: number }>(({ count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </>
  );
});

SkeletonCardGrid.displayName = "SkeletonCardGrid";

export default SkeletonCard;
