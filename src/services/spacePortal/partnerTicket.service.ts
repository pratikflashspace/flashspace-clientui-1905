import axiosInstance from '@/lib/axios';

// ============ TYPES ============
export interface PartnerTicketMessage {
    sender: 'user' | 'support' | 'admin' | 'partner' | 'affiliate';
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
        profilePicture?: string;
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
    assignee?: {
        _id: string;
        fullName: string;
        email: string;
        role: string;
    };
    createdAt: string;
    updatedAt: string;
    closedAt?: string;
    resolvedAt?: string;
    rating?: number;
    ratingRemarks?: string;
    feedbackSubmittedAt?: string;
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

     /** Fetch all tickets linked to a specific booking (used from Clients page chat panel). */
    async getTicketsForBooking(bookingId: string): Promise<PartnerTicketData[]> {
        const response = await axiosInstance.get<ApiResponse<PartnerTicketsResponse>>(
            '/api/tickets/partner/all',
            { params: { page: 1, limit: 100 } }
        );
        if (!response.data.success) return [];
        // Filter client-side for the specific booking
        return (response.data.data?.tickets ?? []).filter(
            (t) => t.bookingId?._id === bookingId || (t.bookingId as any) === bookingId
        );
    }

    async replyToTicket(ticketId: string, data: FormData | { message: string }): Promise<ApiResponse<PartnerTicketData>> {
        const response = await axiosInstance.post<ApiResponse<PartnerTicketData>>(`/api/tickets/partner/${ticketId}/reply`, 
            data
        );
        return response.data;
    }

    async closeTicket(ticketId: string): Promise<ApiResponse<PartnerTicketData>> {
        const response = await axiosInstance.post<ApiResponse<PartnerTicketData>>(`/api/tickets/partner/${ticketId}/close`);
        return response.data;
    }

    /**
     * Partner sends a message to a client by creating a ticket on their behalf.
     * The ticket appears in the client's "My Tickets" section.
     */
    async createTicketForClient(data: {
        clientUserId: string;
        bookingId: string;
        subject: string;
        message: string;
    }): Promise<ApiResponse<PartnerTicketData>> {
        const response = await axiosInstance.post<ApiResponse<PartnerTicketData>>(
            '/api/tickets/partner/message-client',
            data,
        );
        return response.data;
    }
}

export const partnerTicketService = new PartnerTicketService();
export default partnerTicketService;
