import { memo } from "react";

/**
 * Modern Skeleton Card Loader - MindTrip Style
 */
export const SkeletonCard = memo(() => {
  return (
    <div className="bg-white rounded-[20px] border border-gray-100 overflow-hidden shadow-sm animate-pulse flex flex-col h-full">
      {/* Image Skeleton - Match ListingCardModern aspect */}
      <div className="relative aspect-[16/10] bg-gray-200">
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
      <div className="p-4 flex flex-col flex-1">
        {/* Title & Rating Row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="h-5 bg-gray-200 rounded w-2/3" />
          <div className="flex items-center gap-1 flex-shrink-0">
            <div className="w-4 h-4 bg-gray-200 rounded" />
            <div className="h-4 w-12 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Location */}
        <div className="h-4 bg-gray-100 rounded w-full mb-3" />

        {/* Features */}
        <div className="flex gap-2 mb-4">
          <div className="h-6 w-20 bg-gray-100 rounded-full" />
          <div className="h-6 w-24 bg-gray-100 rounded-full" />
        </div>

        {/* Price Section */}
        <div className="space-y-2 mb-4 mt-auto">
           <div className="flex justify-between">
              <div className="h-3 w-16 bg-gray-50 rounded" />
              <div className="h-3 w-20 bg-gray-100 rounded" />
           </div>
           <div className="flex justify-between">
              <div className="h-3 w-20 bg-gray-50 rounded" />
              <div className="h-3 w-16 bg-gray-100 rounded" />
           </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
           <div className="h-10 flex-1 bg-gray-200 rounded-xl" />
           <div className="h-10 flex-1 bg-gray-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
});

SkeletonCard.displayName = "SkeletonCard";

/**
 * Skeleton for List View Cards
 */
export const SkeletonListCard = memo(() => {
  return (
    <div className="flex gap-4 bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
      {/* Image Skeleton */}
      <div className="relative w-36 h-32 flex-shrink-0 rounded-xl bg-gray-200 overflow-hidden" />

      {/* Content Skeleton */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="h-5 bg-gray-200 rounded w-1/2" />
          <div className="flex gap-2">
             <div className="w-7 h-7 bg-gray-200 rounded-full" />
             <div className="w-7 h-7 bg-gray-200 rounded-full" />
             <div className="w-16 h-6 bg-gray-200 rounded-full" />
          </div>
        </div>

        <div className="flex gap-1.5">
           <div className="h-5 w-16 bg-gray-100 rounded-full" />
           <div className="h-5 w-20 bg-gray-100 rounded-full" />
        </div>

        <div className="h-px bg-gray-50 mt-1" />

        <div className="space-y-1">
           <div className="h-4 w-40 bg-gray-100 rounded" />
           <div className="h-4 w-32 bg-gray-100 rounded" />
        </div>

        <div className="flex gap-2 mt-1">
           <div className="h-9 w-28 bg-gray-200 rounded-lg" />
           <div className="h-9 w-32 bg-gray-100 rounded-lg" />
        </div>
      </div>
    </div>
  );
});

SkeletonListCard.displayName = "SkeletonListCard";

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
export const SkeletonCardGrid = memo<{ count?: number; view?: "grid" | "list" }>(
  ({ count = 6, view = "grid" }) => {
    return (
      <>
        {Array.from({ length: count }).map((_, index) =>
          view === "grid" ? (
            <SkeletonCard key={index} />
          ) : (
            <SkeletonListCard key={index} />
          ),
        )}
      </>
    );
  },
);

/**
 * Skeleton for Profile/User cards
 */
export const ProfileCardSkeleton = memo(() => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-pulse">
      <div className="flex justify-between items-start gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-3 w-32 bg-gray-100 rounded" />
          </div>
        </div>
        <div className="h-6 w-16 bg-gray-200 rounded-full" />
      </div>
      <div className="space-y-3 mb-6">
        <div className="h-3 w-full bg-gray-50 rounded" />
        <div className="h-3 w-5/6 bg-gray-50 rounded" />
        <div className="h-3 w-4/6 bg-gray-50 rounded" />
      </div>
      <div className="pt-4 border-t border-gray-100">
        <div className="h-10 w-full bg-gray-100 rounded-xl" />
      </div>
    </div>
  );
});

ProfileCardSkeleton.displayName = "ProfileCardSkeleton";

export const ProfileCardGridSkeleton = memo(({ count = 4 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <ProfileCardSkeleton key={i} />
      ))}
    </div>
  );
});

ProfileCardGridSkeleton.displayName = "ProfileCardGridSkeleton";

/**
 * Skeleton for Feature sections in Dashboard
 */
export const FeatureSectionSkeleton = memo(({ count = 3 }: { count?: number }) => {
  return (
    <div className="mb-8 animate-pulse">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gray-100" />
        <div className="space-y-2">
          <div className="h-5 w-40 bg-gray-200 rounded" />
          <div className="h-3 w-64 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-4 w-8 bg-gray-100 rounded-full" />
            </div>
            <div className="h-3 w-full bg-gray-50 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
});

FeatureSectionSkeleton.displayName = "FeatureSectionSkeleton";

/**
 * Skeleton for Chat interface
 */
export const ChatSkeleton = memo(() => {
  return (
    <div className="flex h-[600px] border border-gray-100 rounded-xl overflow-hidden animate-pulse">
      {/* Sidebar Skeleton */}
      <div className="w-1/4 border-r border-gray-100 flex flex-col bg-white">
        <div className="p-4 border-b border-gray-100">
          <div className="h-10 w-full bg-gray-100 rounded-lg" />
        </div>
        <div className="flex-1 p-4 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-20 bg-gray-200 rounded" />
                <div className="h-2 w-full bg-gray-50 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Chat Area Skeleton */}
      <div className="flex-1 flex flex-col bg-gray-50/30">
        <div className="p-4 border-b border-gray-100 bg-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-2 w-24 bg-gray-50 rounded" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-20 bg-gray-100 rounded-lg" />
            <div className="h-8 w-20 bg-gray-100 rounded-lg" />
          </div>
        </div>
        <div className="flex-1 p-8 space-y-6">
          <div className="flex justify-start">
            <div className="h-16 w-64 bg-white rounded-2xl rounded-tl-none border border-gray-100 shadow-sm" />
          </div>
          <div className="flex justify-end">
            <div className="h-12 w-48 bg-gray-200 rounded-2xl rounded-tr-none shadow-sm" />
          </div>
          <div className="flex justify-start">
            <div className="h-20 w-80 bg-white rounded-2xl rounded-tl-none border border-gray-100 shadow-sm" />
          </div>
        </div>
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="h-12 w-full bg-gray-50 rounded-xl" />
        </div>
      </div>
    </div>
  );
});

ChatSkeleton.displayName = "ChatSkeleton";

/**
 * Skeleton for KYC Request Page
 */
export const KYCRequestSkeleton = memo(() => {
  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm animate-pulse overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-200" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-3 w-48 bg-gray-100 rounded" />
            </div>
          </div>
          <div className="h-6 w-20 bg-gray-200 rounded-full" />
        </div>
        <div className="space-y-1">
          <div className="h-3 w-full bg-gray-100 rounded" />
          <div className="h-2 w-full bg-gray-200 rounded-full" />
        </div>
      </div>
      <div className="p-6 space-y-4 flex-grow">
        <div className="h-24 bg-blue-50/50 rounded-xl" />
        <div className="space-y-2">
          <div className="h-3 w-32 bg-gray-100 rounded mb-3" />
          <div className="h-12 bg-gray-50 rounded-lg" />
          <div className="h-12 bg-gray-50 rounded-lg" />
        </div>
      </div>
      <div className="p-6 pt-0 space-y-3">
        <div className="h-12 w-full bg-blue-100/50 rounded-xl" />
        <div className="h-3 w-32 bg-gray-100 rounded mx-auto" />
      </div>
    </div>
  );
});

KYCRequestSkeleton.displayName = "KYCRequestSkeleton";

export const KYCRequestGridSkeleton = memo(({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <KYCRequestSkeleton key={i} />
      ))}
    </div>
  );
});

KYCRequestGridSkeleton.displayName = "KYCRequestGridSkeleton";

SkeletonCardGrid.displayName = "SkeletonCardGrid";

/**
 * Skeleton for Table components
 */
export const TableSkeleton = memo(({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden animate-pulse">
      <div className="bg-gray-50/50 border-b border-gray-100 p-4 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded flex-1" />
        ))}
      </div>
      <div className="divide-y divide-gray-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex gap-4 items-center">
            {Array.from({ length: cols }).map((_, j) => (
              <div key={j} className="h-4 bg-gray-100 rounded flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
});

TableSkeleton.displayName = "TableSkeleton";

/**
 * Skeleton for Stats cards
 */
export const StatsSkeleton = memo(({ count = 4 }: { count?: number }) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <div className="h-8 w-16 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-24 bg-gray-100 rounded" />
        </div>
      ))}
    </div>
  );
});

StatsSkeleton.displayName = "StatsSkeleton";

/**
 * High-level Admin Page Skeleton
 */
interface AdminPageSkeletonProps {
  hideHeader?: boolean;
  hideStats?: boolean;
}

export const AdminPageSkeleton = memo(({ hideHeader = false, hideStats = false }: AdminPageSkeletonProps) => {
  return (
    <div className="space-y-8 animate-pulse">
      {!hideHeader && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="h-10 w-64 bg-gray-200 rounded" />
            <div className="h-4 w-96 bg-gray-100 rounded" />
          </div>
          <div className="w-full md:w-32 h-12 bg-gray-100 rounded-xl" />
        </div>
      )}

      {!hideStats && <StatsSkeleton count={3} />}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="w-full md:max-w-md h-12 bg-gray-50 rounded-xl" />
          <div className="w-full md:w-40 h-11 bg-gray-50 rounded-xl" />
        </div>
        <TableSkeleton rows={5} />
      </div>
    </div>
  );
});

AdminPageSkeleton.displayName = "AdminPageSkeleton";

export default SkeletonCard;

/**
 * Skeleton loader for Booking Page
 */
export const BookingPageSkeleton = memo(() => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      {/* Back Button Skeleton */}
      <div className="h-4 w-32 bg-gray-200 rounded mb-6" />

      {/* Title Check */}
      <div className="h-8 w-64 bg-gray-200 rounded mb-2" />
      <div className="h-4 w-48 bg-gray-200 rounded mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: Tenure Cards */}
        <div className="lg:col-span-2">
          <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
          
          {/* Tenure Option Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-xl bg-gray-200 p-5 flex flex-col justify-between">
                 <div>
                    <div className="h-6 w-16 bg-gray-300 rounded mb-3" />
                    <div className="h-8 w-24 bg-gray-300 rounded" />
                 </div>
                 <div className="h-4 w-32 bg-gray-300 rounded" />
              </div>
            ))}
          </div>

          {/* Plan Features */}
          <div className="mt-8 border border-gray-200 rounded-xl p-6 bg-white">
            <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded-full flex-shrink-0" />
                    <div className="h-4 w-full max-w-[200px] bg-gray-200 rounded" />
                  </div>
               ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Order Summary */}
        <div className="lg:col-span-1">
           <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="h-40 bg-gray-200" />
              <div className="p-5 space-y-4">
                 <div className="h-6 w-32 bg-gray-200 rounded" />
                 <div className="space-y-3">
                    <div className="flex justify-between">
                       <div className="h-4 w-12 bg-gray-200 rounded" />
                       <div className="h-4 w-20 bg-gray-200 rounded" />
                    </div>
                    <div className="flex justify-between">
                       <div className="h-4 w-12 bg-gray-200 rounded" />
                       <div className="h-4 w-16 bg-gray-200 rounded" />
                    </div>
                     <div className="flex justify-between">
                       <div className="h-4 w-16 bg-gray-200 rounded" />
                       <div className="h-4 w-12 bg-gray-200 rounded" />
                    </div>
                 </div>
                 <div className="border-t border-gray-100 pt-3">
                    <div className="flex justify-between">
                       <div className="h-5 w-24 bg-gray-200 rounded" />
                       <div className="h-6 w-24 bg-gray-200 rounded" />
                    </div>
                 </div>
                 <div className="h-12 w-full bg-gray-200 rounded mt-2" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
});

export const KYCDetailSkeleton = memo(() => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-100 rounded" />
          <div className="h-10 w-64 bg-gray-200 rounded" />
          <div className="h-4 w-96 bg-gray-100 rounded" />
        </div>
        <div className="flex flex-col items-end gap-2">
           <div className="h-6 w-24 bg-gray-200 rounded-full" />
           <div className="h-4 w-32 bg-gray-100 rounded" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 h-32" />
          <div className="bg-white rounded-2xl border border-gray-100 p-6 h-64" />
          <div className="bg-white rounded-2xl border border-gray-100 p-6 h-48" />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 h-[500px]" />
        </div>
      </div>
    </div>
  );
});

KYCDetailSkeleton.displayName = "KYCDetailSkeleton";

BookingPageSkeleton.displayName = "BookingPageSkeleton";
