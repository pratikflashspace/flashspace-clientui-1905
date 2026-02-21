import axiosInstance from "@/lib/axios";

import { API_ENDPOINTS } from "@/config/api.config";



interface ApiResponse<T> {

    success: boolean;

    message?: string;

    data?: T;

}



export interface AffiliateLeadDto {

    id: string;

    name: string;

    phone: string;

    company?: string;

    interest?: string;

    status: "Hot" | "Warm" | "Cold" | "Converted";

    lastContact?: string;

}



export interface QuotationDto {

    quotationId: string;

    clientDetails: {

        name: string;

        email: string;

        phone: string;

        companyName?: string;

    };

    spaceRequirements: {

        spaceType: string;

        city: string;

        location: string;

        numberOfSeats: number;

        duration: string;

        startDate: string;

    };

    price: number;

    status: "Draft" | "Sent" | "Viewed" | "Accepted" | "Rejected";

    createdAt: string;

}



export interface QuotationStatsDto {

    totalSent: number;

    viewRate: number;

    accepted: number;

    conversion: number;

}



export interface SupportTicketDto {

    ticketId: string;

    subject: string;

    status: "open" | "in progress" | "resolved";

    priority: "low" | "medium" | "high";

    createdAt: string;

}



export interface LeaderboardDto {

    affiliateId: string;

    name: string;

    location: string;

    referrals: number;

    earnings: number;

    conversion: number;

    initials: string;

    isUser: boolean;

}



class AffiliatePortalService {

    async getLeads() {

        const response = await axiosInstance.get<ApiResponse<AffiliateLeadDto[]>>(

            API_ENDPOINTS.AFFILIATE.LEADS,

        );

        return response.data;

    }



    async getRecentQuotations() {

        const response = await axiosInstance.get<ApiResponse<QuotationDto[]>>(

            API_ENDPOINTS.AFFILIATE.QUOTATIONS_RECENT,

        );

        return response.data;

    }



    async getQuotations() {

        const response = await axiosInstance.get<ApiResponse<QuotationDto[]>>(

            API_ENDPOINTS.AFFILIATE.QUOTATIONS,

        );

        return response.data;

    }



    async createQuotation(data: any) {

        const response = await axiosInstance.post<ApiResponse<QuotationDto>>(

            API_ENDPOINTS.AFFILIATE.QUOTATIONS,
            data

        );

        return response.data;

    }



    async getQuotationStats() {

        const response = await axiosInstance.get<ApiResponse<QuotationStatsDto>>(

            API_ENDPOINTS.AFFILIATE.QUOTATIONS_STATS,

        );

        return response.data;

    }



    async getSupportTickets() {

        const response = await axiosInstance.get<ApiResponse<SupportTicketDto[]>>(

            API_ENDPOINTS.AFFILIATE.SUPPORT_TICKETS,

        );

        return response.data;

    }



    async getLeaderboard() {

        const response = await axiosInstance.get<ApiResponse<LeaderboardDto[]>>(

            API_ENDPOINTS.AFFILIATE.LEADERBOARD,

        );

        return response.data;

    }



    async getDashboardStats() {

        const response = await axiosInstance.get<ApiResponse<any>>(

            API_ENDPOINTS.AFFILIATE.DASHBOARD_STATS,

        );

        return response.data;

    }



    async getAIInsights() {

        const response = await axiosInstance.get<ApiResponse<any>>(

            API_ENDPOINTS.AFFILIATE.DASHBOARD_INSIGHTS,

        );

        return response.data;

    }

    async generateCoupon() {
        const response = await axiosInstance.post<ApiResponse<any>>(
            API_ENDPOINTS.AFFILIATE.COUPON_GENERATE
        );
        return response.data;
    }

    async getMyCoupon() {
        const response = await axiosInstance.get<ApiResponse<any>>(
            API_ENDPOINTS.AFFILIATE.MY_COUPON
        );
        return response.data;
    }

}



export const affiliatePortalService = new AffiliatePortalService();