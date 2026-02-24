import axiosInstance from "./api.service";
import { CreateReviewPayload, Review } from "@/types/review";
import { ApiResponse } from "@/types/services";

class ReviewService {
  async createReview(
    payload: CreateReviewPayload,
  ): Promise<ApiResponse<Review>> {
    try {
      const response = await axiosInstance.post<ApiResponse<Review>>(
        "/reviews/add",
        payload,
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to submit review",
        error: error.message,
      };
    }
  }

  async getSpaceReviews(
    spaceId: string,
    params?: { page?: number; limit?: number },
  ): Promise<ApiResponse<{ reviews: Review[]; total: number }>> {
    try {
      const response = await axiosInstance.get<
        ApiResponse<{ reviews: Review[]; total: number }>
      >(`/reviews/space/${spaceId}`, { params });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch reviews",
        error: error.message,
      };
    }
  }

  async updateReview(
    reviewId: string,
    payload: Partial<CreateReviewPayload>,
  ): Promise<ApiResponse<Review>> {
    try {
      const response = await axiosInstance.patch<ApiResponse<Review>>(
        `/reviews/${reviewId}`,
        payload,
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update review",
        error: error.message,
      };
    }
  }

  async getUserReviewForSpace(
    spaceId: string,
  ): Promise<ApiResponse<Review | null>> {
    try {
      const response = await axiosInstance.get<ApiResponse<Review | null>>(
        `/reviews/my-review/${spaceId}`,
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch your review",
        error: error.message,
      };
    }
  }
}

export const reviewService = new ReviewService();
export default reviewService;
