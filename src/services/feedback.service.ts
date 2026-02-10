import api from "@/lib/axios";



export interface Feedback {

    _id: string;

    company: string;

    rating: number;

    npsScore?: number;

    location: string;

    review: string;

    createdAt: string;

    updatedAt: string;

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



export const FeedbackService = {

    /**

     * Fetch all feedback reviews

     * GET /api/feedback/getAll

     */

    getAllReviews: async () => {

        try {

            const res = await api.get<ApiResponse<Feedback[]>>("/api/feedback/getAll");

            return res.data?.data || [];

        } catch (error) {

            console.error("Error fetching feedback reviews:", error);

            return [];

        }

    },



    /**

     * Fetch NPS statistics

     * GET /api/feedback/nps

     */

    getNpsStats: async () => {

        try {

            const res = await api.get<ApiResponse<NpsStats>>("/api/feedback/nps");

            return res.data?.data || null;

        } catch (error) {

            console.error("Error fetching NPS stats:", error);

            return null;

        }

    },



    /**

     * Fetch AI-generated business insight

     * GET /api/feedback/ai-insight

     */

    getAiInsight: async () => {

        try {

            const res = await api.get<ApiResponse<{ insight: string }>>(

                "/api/feedback/ai-insight"

            );

            return res.data?.data?.insight || "";

        } catch (error) {

            console.error("Error fetching AI insight:", error);

            return "";

        }

    },

};

