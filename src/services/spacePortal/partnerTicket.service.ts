import axiosInstance from '@/lib/axios';

// ============ TYPES ============
export interface PartnerTicketMessage {
    sender: 'user' | 'support' | 'admin' | 'partner';
    message: string;
    attachments?: string[];
    createdAt: string;
}

export interface PartnerTicketData {
    _id: string;
    id: string;
    ticketNumber: string;
    subject: string;
    description: string;
    category: string;
    priority: string;
    status: string;
    messages: PartnerTicketMessage[];
    user: {
        _id: string;
        fullName: string;
        email: string;
        phoneNumber?: string;
    };
    bookingId?: {
        _id: string;
        bookingNumber: string;
        type: string;
        spaceSnapshot?: {
            name?: string;
            address?: string;
            city?: string;
        };
    };
    createdAt: string;
    updatedAt: string;
    closedAt?: string;
}

export interface PartnerTicketsResponse {
    tickets: PartnerTicketData[];
    total: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

// ============ SERVICE ============
class PartnerTicketService {
    async getPartnerTickets(page: number = 1, limit: number = 20): Promise<ApiResponse<PartnerTicketsResponse>> {
        const response = await axiosInstance.get<ApiResponse<PartnerTicketsResponse>>('/api/tickets/partner/all', {
            params: { page, limit }
        });
        return response.data;
    }

    async replyToTicket(ticketId: string, message: string): Promise<ApiResponse<PartnerTicketData>> {
        const response = await axiosInstance.post<ApiResponse<PartnerTicketData>>(`/api/tickets/partner/${ticketId}/reply`, {
            message
        });
        return response.data;
    }

    async closeTicket(ticketId: string): Promise<ApiResponse<PartnerTicketData>> {
        const response = await axiosInstance.post<ApiResponse<PartnerTicketData>>(`/api/tickets/partner/${ticketId}/close`);
        return response.data;
    }
}

export const partnerTicketService = new PartnerTicketService();
export default partnerTicketService;
