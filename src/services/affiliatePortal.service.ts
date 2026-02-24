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



export interface LeaderboardEntry {
    rank: number;
    affiliateId: string;
    name: string;
    initials: string;
    successfulBookings: number;
    totalCommission: number;
    isUser: boolean;
}

export interface LeaderboardResponse {
    leaderboard: LeaderboardEntry[];
    pagination: {
        page: number;
        limit: number;
        totalEntries: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
    currentUser: {
        rank: number | null;
        successfulBookings: number;
        totalCommission: number;
    } | null;
}

export interface MonthlyEarningPoint {
    month: string;
    earnings: number;
    clients: number;
}

export interface RevenueDashboardStats {
    totalEarnings: number;
    convertedClients: number;
    pendingPayout: number;
    totalLeads: number;
    commissionRate: number;
    monthlyEarnings: MonthlyEarningPoint[];
    leadsByStatus: {
        Hot: number;
        Warm: number;
        Cold: number;
        Converted: number;
    };
    momGrowth: number;
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



    async getLeaderboard(page = 1, limit = 10) {
        const response = await axiosInstance.get<ApiResponse<LeaderboardResponse>>(
            `${API_ENDPOINTS.AFFILIATE.LEADERBOARD}?page=${page}&limit=${limit}`,
        );
        return response.data;
    }



    async getRevenueDashboardStats() {
        const response = await axiosInstance.get<ApiResponse<RevenueDashboardStats>>(
            API_ENDPOINTS.AFFILIATE.DASHBOARD_STATS,
        );
        return response.data;
    }

    // Alias for backward compatibility
    async getDashboardStats() {
        return this.getRevenueDashboardStats();
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