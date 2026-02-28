import api from "@/lib/axios";
import axiosInstance from "./api.service";
import { CreateReviewPayload, Review } from "@/types/review";
import { ApiResponse } from "@/types/services";

// Keeping the HEAD Review interface if it's different, but aliasing to avoid conflict if needed
// Actually, let's use the one from @/types/review as it's likely more standard
export interface ReviewLegacy {
  _id: string;
  company: string; // Map to user fullName in backend
  rating: number;
  npsScore?: number;
  location: string; // Map to property area/city in backend
  review: string; // Map to comment in backend
  createdAt: string;
}

export interface NpsStats {
  nps: number;
  totalResponses: number;
  promoters: number;
  passives: number;
  detractors: number;
}

interface AdminApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error: any;
}

class ReviewService {
  /**
   * Fetch all reviews for space partner portal (Admin/Partner)
   * GET /api/reviews/getAll
   */
  async getAllReviews(): Promise<any[]> {
    try {
      const res = await api.get<AdminApiResponse<any[]>>("/api/reviews/getAll");
      return res.data?.data || [];
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
  }

  /**
   * Fetch NPS statistics (Admin/Partner)
   * GET /api/reviews/nps
   */
  async getNpsStats(): Promise<NpsStats | null> {
    try {
      const res = await api.get<AdminApiResponse<NpsStats>>("/api/reviews/nps");
      return res.data?.data || null;
    } catch (error) {
      console.error("Error fetching NPS stats:", error);
      return null;
    }
  }

  /**
   * Fetch AI-generated business insight (Admin/Partner)
   * GET /api/reviews/ai-insight
   */
  async getAiInsight(): Promise<string> {
    try {
      const res = await api.get<AdminApiResponse<{ insight: string }>>(
        "/api/reviews/ai-insight",
      );
      return res.data?.data?.insight || "";
    } catch (error) {
      console.error("Error fetching AI insight:", error);
      return "";
    }
  }

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
export const ReviewServiceLegacy = {
  getAllReviews: () => reviewService.getAllReviews(),
  getNpsStats: () => reviewService.getNpsStats(),
  getAiInsight: () => reviewService.getAiInsight(),
};

export default reviewService;
