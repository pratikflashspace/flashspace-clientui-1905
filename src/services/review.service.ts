import api from "@/lib/axios";

export interface Review {
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

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error: any;
}

export const ReviewService = {
  /**
   * Fetch all reviews for space partner portal
   * GET /api/reviews/getAll
   */
  getAllReviews: async () => {
    try {
      const res = await api.get<ApiResponse<Review[]>>("/api/reviews/getAll");
      return res.data?.data || [];
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
  },

  /**
   * Fetch NPS statistics
   * GET /api/reviews/nps
   */
  getNpsStats: async () => {
    try {
      const res = await api.get<ApiResponse<NpsStats>>("/api/reviews/nps");
      return res.data?.data || null;
    } catch (error) {
      console.error("Error fetching NPS stats:", error);
      return null;
    }
  },

  /**
   * Fetch AI-generated business insight
   * GET /api/reviews/ai-insight
   */
  getAiInsight: async () => {
    try {
      const res = await api.get<ApiResponse<{ insight: string }>>(
        "/api/reviews/ai-insight",
      );
      return res.data?.data?.insight || "";
    } catch (error) {
      console.error("Error fetching AI insight:", error);
      return "";
    }
  },
};
