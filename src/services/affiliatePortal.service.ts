import axiosInstance from "@/lib/axios";

import { API_ENDPOINTS } from "@/config/api.config";
import { SupportTicket } from "@/types/services";



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
    revenueByProduct: {
        label: string;
        value: number;
        percentage: number;
    }[];
}

export interface AffiliateInvoice {
    _id: string;
    invoiceNumber: string;
    date: string;
    client: string;
    clientAddress: string[];
    clientGstin: string;
    amount: number;
    commission: number;
    status: "paid" | "pending" | "overdue" | "cancelled";
    items: {
        desc: string;
        qty: number;
        rate: number;
        total: number;
    }[];
}

export interface AffiliateInvoicesResponse {
    invoices: AffiliateInvoice[];
    summary: {
        totalEarnings: number;
        totalClients: number;
    };
}

export interface AffiliateBookingDto {
    id: string;
    bookingNumber: string;
    client: {
        id?: string;
        name: string;
        email: string;
        phone: string;
    };
    company?: string;
    plan: string;
    space: string;
    city: string;
    area: string;
    duration: string;
    amount: number;
    commission: number;
    status: string;
    partnerKycStatus?: string;
    partnerReviewStatus?: string;
    couponCode: string;
    startDate?: string;
    endDate?: string;
    createdAt?: string;
}

export interface AffiliateBookingsResponse {
    bookings: AffiliateBookingDto[];
    stats: {
        totalBookings: number;
        activeBookings: number;
        pendingBookings: number;
        renewalDue: number;
        totalCommission: number;
    };
}

interface AffiliateClientBookingDto {
    bookingId: string;
    bookingNumber: string;
    user: {
        id?: string;
        fullName: string;
        email: string;
        phone: string;
    };
    space: string;
    city: string;
    plan: string;
    tenure: string;
    amount: number;
    commissionAmount: number;
    couponCode: string;
    status: string;
    startDate?: string;
    endDate?: string;
    createdAt?: string;
}

interface AffiliateClientsResponse {
    clients: AffiliateClientBookingDto[];
    stats?: {
        totalClients: number;
        totalCommission: number;
        activeBookings: number;
        successfulBookings: number;
    };
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
        const response = await axiosInstance.get<ApiResponse<SupportTicket[]>>(
            "/api/tickets/my-tickets",
        );
        return response.data;
    }

    async createSupportTicket(data: {
        subject: string;
        category: string;
        priority?: 'low' | 'medium' | 'high';
        description: string;
    }): Promise<ApiResponse<any>> {
        try {
            const response = await axiosInstance.post<ApiResponse<any>>(
                "/api/tickets",
                data
            );
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Failed to create ticket"
            };
        }
    }

    async getSupportTicketById(id: string): Promise<ApiResponse<any>> {
        try {
            const response = await axiosInstance.get<ApiResponse<any>>(
                `/api/tickets/${id}`
            );
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Failed to fetch ticket"
            };
        }
    }

    async replyToSupportTicket(id: string, data: FormData | { message: string }): Promise<ApiResponse<any>> {
        try {
            const response = await axiosInstance.post<ApiResponse<any>>(
                `/api/tickets/${id}/reply`,
                data,
                data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined
            );
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Failed to send reply"
            };
        }
    }

    async getLeaderboard(page = 1, limit = 10) {
        const response = await axiosInstance.get<ApiResponse<LeaderboardResponse>>(
            `${API_ENDPOINTS.AFFILIATE.LEADERBOARD}?page=${page}&limit=${limit}`,
        );
        return response.data;
    }

    async getBookings() {
        const response = await axiosInstance.get<ApiResponse<AffiliateClientsResponse>>(
            API_ENDPOINTS.AFFILIATE.CLIENTS,
        );
        const payload = response.data;
        const clients = payload.data?.clients || [];

        return {
            ...payload,
            data: {
                bookings: clients.map((client) => ({
                    id: client.bookingId,
                    bookingNumber: client.bookingNumber,
                    client: {
                        id: client.user.id,
                        name: client.user.fullName,
                        email: client.user.email,
                        phone: client.user.phone,
                    },
                    company: client.user.fullName,
                    plan: client.plan,
                    space: client.space,
                    city: client.city,
                    area: "",
                    duration: client.tenure,
                    amount: client.amount,
                    commission: client.commissionAmount,
                    status: client.status,
                    couponCode: client.couponCode,
                    startDate: client.startDate,
                    endDate: client.endDate,
                    createdAt: client.createdAt,
                })),
                stats: {
                    totalBookings: clients.length,
                    activeBookings: clients.filter((client) => client.status === "active").length,
                    pendingBookings: clients.filter((client) =>
                        ["pending_payment", "pending_kyc"].includes(client.status),
                    ).length,
                    renewalDue: 0,
                    totalCommission: payload.data?.stats?.totalCommission || 0,
                },
            },
        } satisfies ApiResponse<AffiliateBookingsResponse>;
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

    async getAvailableSpaces(city: string, type: string) {
        const response = await axiosInstance.get<ApiResponse<any[]>>(
            API_ENDPOINTS.AFFILIATE.AVAILABLE_SPACES,
            { params: { city, type } }
        );
        return response.data;
    }

    async getInvoices() {
        const response = await axiosInstance.get<ApiResponse<AffiliateInvoicesResponse>>(
            API_ENDPOINTS.AFFILIATE.INVOICES
        );
        return response.data;
    }

    async getInvoiceById(id: string) {
        const response = await axiosInstance.get<ApiResponse<AffiliateInvoice>>(
            API_ENDPOINTS.AFFILIATE.INVOICE_BY_ID(id)
        );
        return response.data;
    }

}



export const affiliatePortalService = new AffiliatePortalService();
