import { useEffect, useState, useCallback } from "react";
import reviewService from "@/services/review.service";
import NpsCard from "./NpsCard";
import AverageRatingCard from "./AverageRatingCard";
import NpsBreakdownCard from "./NpsBreakdownCard";
import ReviewList from "./ReviewList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type Review = {
  _id: string;
  company: string;
  rating: number;
  npsScore?: number;
  location: string;
  spaceName?: string;
  spaceType?: string;
  review: string;
  createdAt?: string;
};

const FeedbackNPSLayout = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [npsData, setNpsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Pagination & Filters state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [spaceTypeFilter, setSpaceTypeFilter] = useState<string>("all");
  const limit = 5; // Show 5 reviews per page

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Build API params
      const params: any = { page, limit };
      if (ratingFilter !== "all") params.rating = Number(ratingFilter);
      if (spaceTypeFilter !== "all") params.spaceType = spaceTypeFilter;

      const [reviewsData, npsStats] = await Promise.all([
        reviewService.getPartnerReviews(params),
        page === 1 && ratingFilter === "all" && spaceTypeFilter === "all"
          ? reviewService.getPartnerNpsStats()
          : Promise.resolve(npsData), // Only fetch NPS stats once or when filters are reset
      ]);

      setReviews(reviewsData.reviews || []);
      setTotalPages(reviewsData.pagination?.pages || 1);

      // Update NPS data only if newly fetched
      if (npsStats && npsStats !== npsData) {
        setNpsData(npsStats);
      }
    } catch (error) {
      console.error("Failed to load partner feedback data:", error);
    } finally {
      setLoading(false);
    }
  }, [page, ratingFilter, spaceTypeFilter]);

  // Initial load and filter changes
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reset page when filters change
  const handleFilterChange = (setter: any, value: string) => {
    setter(value);
    setPage(1);
  };

  const totalReviews = npsData?.totalReviews ?? 0;
  const avgRating = npsData?.avgRating ?? 0;

  return (
    <div className="px-6 py-2 md:py-4 bg-[#FAFAF8] min-h-screen">
      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <NpsCard data={npsData} />
        <AverageRatingCard reviews={[]} overrideAvg={avgRating} />

        <div className="bg-white rounded-xl p-6 shadow">
          <p className="text-sm text-gray-500">Total Reviews</p>
          <h2 className="text-4xl font-bold mt-2">{totalReviews}</h2>
          <p className="text-emerald-600 text-sm mt-1">
            ⭐ Avg rating: {avgRating > 0 ? avgRating.toFixed(1) : "N/A"}
          </p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="w-full sm:w-48">
          <Select
            value={ratingFilter}
            onValueChange={(val) => handleFilterChange(setRatingFilter, val)}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Filter by Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-48">
          <Select
            value={spaceTypeFilter}
            onValueChange={(val) => handleFilterChange(setSpaceTypeFilter, val)}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Filter by Space Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Every Space Type</SelectItem>
              <SelectItem value="CoworkingSpace">Coworking Space</SelectItem>
              <SelectItem value="VirtualOffice">Virtual Office</SelectItem>
              <SelectItem value="MeetingRoom">Meeting Room</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* CONTENT */}
      {loading && reviews.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center text-gray-500 shadow">
          <p>Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center text-gray-500 shadow">
          <p className="text-lg font-medium mb-1">No reviews found</p>
          <p className="text-sm">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: REVIEW LIST & PAGINATION */}
          <div className="lg:col-span-2 space-y-4">
            <ReviewList reviews={reviews} />

            {/* PAGINATION CONTROLS */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow mt-4">
                <Button
                  variant="outline"
                  disabled={page === 1 || loading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <div className="text-sm text-gray-600">
                  Page <span className="font-medium text-black">{page}</span> of{" "}
                  {totalPages}
                </div>
                <Button
                  variant="outline"
                  disabled={page === totalPages || loading}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            )}
          </div>

          {/* RIGHT: BREAKDOWNS */}
          <div className="space-y-6">
            <NpsBreakdownCard data={npsData} />
            <div className="bg-white rounded-xl p-5 shadow">
              <h3 className="font-semibold mb-3 text-sm text-gray-700">
                Filters Applied
              </h3>
              <p className="text-sm text-gray-600">
                Showing newest reviews first.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackNPSLayout;
