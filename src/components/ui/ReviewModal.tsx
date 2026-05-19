import React, { useState } from "react";
import { X, Star, Loader2 } from "lucide-react";
import { Booking } from "@/types/services";
import { reviewService } from "@/services/review.service";
import { toast } from "react-hot-toast";

import { Review } from "@/types/review";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  existingReview?: Review | null;
  onSuccess?: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  booking,
  existingReview,
  onSuccess,
}) => {
  const [rating, setRating] = useState<number>(existingReview?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!existingReview;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
        const response = await reviewService.updateReview(existingReview._id, {
          rating,
          comment: comment.trim(),
        });

        if (response.success) {
          toast.success("Review updated successfully!");
          onSuccess?.();
          onClose();
        } else {
          toast.error(response.message || "Failed to update review");
        }
      } else {
        let spaceModel = "CoworkingSpace";
        const normalizedType = String(booking.type || "").toLowerCase();
        if (normalizedType === "virtual_office" || normalizedType === "virtualoffice") {
          spaceModel = "VirtualOffice";
        } else if (normalizedType === "meeting_room" || normalizedType === "meetingroom") {
          spaceModel = "MeetingRoom";
        }

        const response = await reviewService.createReview({
          spaceId: booking.spaceId,
          spaceModel: spaceModel as any,
          rating,
          comment: comment.trim(),
        });

        if (response.success) {
          toast.success("Review submitted successfully!");
          onSuccess?.();
          onClose();
        } else {
          toast.error(response.message || "Failed to submit review");
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[250] p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#35503F]">
              {isEditing ? "Edit Review" : "Rate & Review"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {booking.spaceSnapshot?.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Rating Stars */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-sm font-medium text-gray-700">
              {isEditing
                ? "How would you like to update your experience?"
                : "How was your experience?"}
            </span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      (hoveredRating || rating) >= star
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs text-gray-400">
              {rating > 0 ? `${rating} out of 5 stars` : "Click to rate"}
            </span>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              placeholder="Tell us about the space, amenities, and service..."
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35503F]/20 focus:border-[#35503F] text-sm resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || rating === 0 || !comment.trim()}
              className="flex-1 bg-[#35503F] text-white py-3 rounded-xl font-medium hover:bg-[#35503F]/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isEditing ? "Updating..." : "Submitting..."}
                </>
              ) : isEditing ? (
                "Update Review"
              ) : (
                "Submit Review"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
