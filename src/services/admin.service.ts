import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/types/services";
import {
  Client,
  ClientActivity,
  ClientOrder,
  ClientQuery,
  ClientNote,
} from "@/types/client.types";

export interface AdminDashboardStats {
  totalUsers: number;
  totalBookings: number;
  activeListings: number;
  totalRevenue: number;
  recentActivity: Array<{
    id: string;
    type: string;
    message: string;
    time: string;
  }>;
}

export interface SpaceItem {
  _id: string;
  name: string;
  type: "virtual-office" | "coworking-space";
  city: string;
  area: string;
  price: string;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserData {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: "user" | "admin" | "support";
  status: "active" | "inactive" | "pending";
  createdAt: string;
  updatedAt: string;
}

export interface BookingData {
  _id: string;
  bookingNumber: string;
  userId: string;
  spaceId: string;
  user?: {
    fullName: string;
    email: string;
  };
  spaceSnapshot?: {
    name?: string;
    city?: string;
    address?: string;
  };
  type: "virtual_office" | "coworking_space";
  status:
    | "pending_payment"
    | "pending_kyc"
    | "active"
    | "expired"
    | "cancelled";
  plan: {
    name: string;
    price: number;
    tenure: number;
    tenureUnit?: string;
  };
  createdAt: string;
  amount?: number; // Added for SalesAnalytics compatibility
}

export interface KYCData {
  _id: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
  };
  profileName?: string;
  kycType?: "individual" | "business";
  isPartner?: boolean;
  personalInfo?: {
    fullName?: string;
    email?: string;
    phone?: string;
    panNumber?: string;
    aadhaarNumber?: string;
    dateOfBirth?: string;
  };
  businessInfo?: {
    companyName?: string;
    companyType?: string;
    gstNumber?: string;
    panNumber?: string;
    cinNumber?: string;
    registeredAddress?: string;
    partners?: string[];
  };
  overallStatus:
    | "not_started"
    | "pending"
    | "approved"
    | "rejected"
    | "resubmit";
  documents: Array<{
    type: string;
    name: string;
    fileUrl?: string;
    status: string;
    uploadedAt: string;
  }>;
  progress?: number;
  createdAt: string;
  partnerCount?: number;
}

export interface PartnerKYCData {
  _id: string;
  partnerProfileId?: string;
  partnerInfo: {
    fullName: string;
    email: string;
    phone: string;
    panNumber: string;
    aadhaarNumber: string;
    verified: boolean;
  };
  overallStatus: "pending" | "approved" | "rejected" | string;
  progress?: number;
  isDeleted?: boolean;
  documents?: Array<{
    _id?: string;
    type: string;
    name?: string;
    fileUrl?: string;
    status?: string;
    uploadedAt?: string;
    verifiedAt?: string;
  }>;
  createdAt: string;
  updatedAt?: string;
}

// Admin ticket types for TicketSystem
export interface AdminTicketData {
  _id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
  };
  category: string;
  priority: "low" | "medium" | "high";
  status: "open" | "in_progress" | "escalated" | "resolved" | "closed";
  assignee?: {
    _id: string;
    fullName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  messages: Array<{
    sender: "user" | "support" | "admin";
    message: string;
    createdAt: string;
  }>;
}

export interface TicketStats {
  open: number;
  in_progress: number;
  escalated: number;
  resolved: number;
  closed: number;
  avgResolution?: string;
  resolvedThisMonth: number;
  totalTickets: number;
}

export interface AllTicketsResponse {
  tickets: AdminTicketData[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

class AdminService {
  async getDashboardStats(): Promise<ApiResponse<AdminDashboardStats>> {
    const response = await axiosInstance.get<ApiResponse<AdminDashboardStats>>(
      "/api/admin/dashboard",
    );
    return response.data;
  }

  async getAllUsers(params?: {
    search?: string;
    role?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ users: UserData[]; pagination: any }>> {
    const response = await axiosInstance.get<
      ApiResponse<{ users: UserData[]; pagination: any }>
    >("/api/admin/users", { params });
    return response.data;
  }

  async getPendingKYC(
    includeApproved: boolean = false,
  ): Promise<ApiResponse<KYCData[]>> {
    const response = await axiosInstance.get<ApiResponse<KYCData[]>>(
      "/api/admin/kyc/pending",
      {
        params: includeApproved ? { includeApproved: true } : undefined,
      },
    );
    return response.data;
  }

  async getKYCById(kycId: string): Promise<ApiResponse<KYCData>> {
    const response = await axiosInstance.get<ApiResponse<KYCData>>(
      `/api/admin/kyc/${kycId}`,
    );
    return response.data;
  }

  async reviewKYC(
    kycId: string,
    action: "approve" | "reject",
    rejectionReason?: string,
  ): Promise<ApiResponse<void>> {
    const response = await axiosInstance.put<ApiResponse<void>>(
      `/api/admin/kyc/${kycId}/review`,
      {
        action,
        rejectionReason,
      },
    );
    return response.data;
  }

  async getPartnersByUser(userId: string): Promise<ApiResponse<any[]>> {
    const response = await axiosInstance.get<ApiResponse<any[]>>(
      `/api/admin/kyc/user/${userId}/partners`,
    );
    return response.data;
  }

  async updatePartnerStatus(
    partnerId: string,
    action: "approve" | "reject",
    rejectionReason?: string,
  ): Promise<ApiResponse<void>> {
    const response = await axiosInstance.put<ApiResponse<void>>(
      `/api/admin/kyc/partner/${partnerId}/status`,
      {
        action,
        rejectionReason,
      },
    );
    return response.data;
  }

  async getKYCDetails(id: string): Promise<ApiResponse<KYCData>> {
    const response = await axiosInstance.get<ApiResponse<KYCData>>(
      `/api/admin/kyc/${id}`,
    );
    return response.data;
  }

  async getPartnerDetails(id: string): Promise<ApiResponse<KYCData>> {
    const response = await axiosInstance.get<ApiResponse<KYCData>>(
      `/api/admin/kyc/partner/${id}`,
    );
    return response.data;
  }

  async reviewKYCDocument(
    kycId: string,
    docId: string,
    action: "approve" | "reject",
    rejectionReason?: string,
  ): Promise<ApiResponse<KYCData>> {
    const response = await axiosInstance.put<ApiResponse<KYCData>>(
      `/api/admin/kyc/${kycId}/document/${docId}/review`,
      {
        action,
        rejectionReason,
      },
    );
    return response.data;
  }

  async getAllPartnerKYC(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    userId?: string;
  }): Promise<ApiResponse<{ partners: any[]; pagination: any }>> {
    const response = await axiosInstance.get<
      ApiResponse<{ partners: any[]; pagination: any }>
    >("/api/admin/kyc-requests", { params });
    return response.data;
  }

  async getAllSpaces(
    deleted: boolean = false,
  ): Promise<ApiResponse<SpaceItem[]>> {
    try {
      const [voRes, coRes] = await Promise.all([
        axiosInstance.get<ApiResponse<SpaceItem[]>>(
          `/api/virtualOffice/getAll?deleted=${deleted}`,
        ),
        axiosInstance.get<ApiResponse<SpaceItem[]>>(
          `/api/coworkingSpace/getAll?deleted=${deleted}`,
        ),
      ]);

      const voSpaces = (voRes.data.data || []).map((s: SpaceItem) => ({
        ...s,
        type: "virtual-office" as const,
      }));
      const coSpaces = (coRes.data.data || []).map((s: SpaceItem) => ({
        ...s,
        type: "coworking-space" as const,
      }));

      return {
        success: true,
        message: "Spaces fetched successfully",
        data: [...voSpaces, ...coSpaces],
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch spaces";
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  async deleteSpace(
    id: string,
    type: "virtual-office" | "coworking-space",
    restore: boolean = false,
  ): Promise<ApiResponse<void>> {
    const endpoint =
      type === "virtual-office"
        ? `/api/virtualOffice/delete/${id}?restore=${restore}`
        : `/api/coworkingSpace/delete/${id}?restore=${restore}`;

    const response = await axiosInstance.delete<ApiResponse<void>>(endpoint);
    return response.data;
  }

  async updateSpace(
    id: string,
    type: "virtual-office" | "coworking-space",
    data: Partial<SpaceItem>,
  ): Promise<ApiResponse<SpaceItem>> {
    const endpoint =
      type === "virtual-office"
        ? `/api/virtualOffice/update/${id}`
        : `/api/coworkingSpace/update/${id}`;

    const response = await axiosInstance.put<ApiResponse<SpaceItem>>(
      endpoint,
      data,
    );
    return response.data;
  }

  async createUser(
    userData: Partial<UserData>,
  ): Promise<ApiResponse<UserData>> {
    try {
      const response = await axiosInstance.post<ApiResponse<UserData>>(
        "/api/admin/users",
        userData,
      );
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create user";
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  async deleteUser(
    id: string,
    restore: boolean = false,
  ): Promise<ApiResponse<void>> {
    try {
      const response = await axiosInstance.delete<ApiResponse<void>>(
        `/api/admin/users/${id}?restore=${restore}`,
      );
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update user";
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  async updateUser(
    id: string,
    data: Partial<UserData>,
  ): Promise<ApiResponse<UserData>> {
    try {
      const response = await axiosInstance.put<ApiResponse<UserData>>(
        `/api/admin/users/${id}`,
        data,
      );
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update user";
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  async getAllBookings(params?: {
    status?: string;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ bookings: BookingData[]; pagination: any }>> {
    const response = await axiosInstance.get<
      ApiResponse<{ bookings: BookingData[]; pagination: any }>
    >("/api/admin/bookings", { params });
    return response.data;
  }

  async createSpace(
    type: "virtual-office" | "coworking-space",
    data: Partial<SpaceItem>,
  ): Promise<ApiResponse<SpaceItem>> {
    const endpoint =
      type === "virtual-office"
        ? "/api/virtualOffice/create"
        : "/api/coworkingSpace/create";

    const response = await axiosInstance.post<ApiResponse<SpaceItem>>(
      endpoint,
      data,
    );
    return response.data;
  }

  // Ticket System Methods - CORRECTED ENDPOINTS
  async getAllTickets(params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
    priority?: string;
    category?: string;
    assignee?: string;
  }): Promise<ApiResponse<AllTicketsResponse>> {
    const response = await axiosInstance.get<ApiResponse<AllTicketsResponse>>(
      "/api/tickets/admin/all",
      { params },
    );
    return response.data;
  }

  async getTicketStats(): Promise<ApiResponse<TicketStats>> {
    try {
      const response = await axiosInstance.get<ApiResponse<any>>(
        "/api/tickets/admin/stats",
      );

      if (response.data.success && response.data.data) {
        // Transform backend response to frontend format
        const backendData = response.data.data;
        const statusCounts = backendData.statusCounts || [];

        // Convert statusCounts array to object
        const statsMap: any = {};
        statusCounts.forEach((item: any) => {
          statsMap[item._id] = item.count;
        });

        return {
          success: true,
          message: "Ticket stats retrieved",
          data: {
            open: statsMap.open || 0,
            in_progress: statsMap.in_progress || 0,
            escalated: statsMap.escalated || 0,
            resolved: statsMap.resolved || 0,
            closed: statsMap.closed || 0,
            avgResolution: "4.2 hrs",
            resolvedThisMonth: backendData.resolvedThisMonth?.[0]?.count || 0,
            totalTickets: backendData.totalTickets?.[0]?.count || 0,
          },
        };
      }

      return {
        success: false,
        message: "Failed to fetch ticket stats",
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch ticket stats";
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  async assignTicket(
    ticketId: string,
    assigneeId: string,
  ): Promise<ApiResponse<AdminTicketData>> {
    const response = await axiosInstance.post<ApiResponse<AdminTicketData>>(
      `/api/tickets/admin/${ticketId}/assign`,
      {
        assigneeId,
      },
    );
    return response.data;
  }

  async getPartnerKYCList(params?: {
    userId?: string;
    profileId?: string;
  }): Promise<ApiResponse<PartnerKYCData[]>> {
    const response = await axiosInstance.get<ApiResponse<PartnerKYCData[]>>(
      "/api/admin/kyc/partners",
      { params },
    );
    return response.data;
  }

  async getPartnerKYCById(id: string): Promise<ApiResponse<PartnerKYCData>> {
    const response = await axiosInstance.get<ApiResponse<PartnerKYCData>>(
      `/api/admin/kyc/partners/${id}`,
    );
    return response.data;
  }

  async resolveTicket(ticketId: string): Promise<ApiResponse<AdminTicketData>> {
    const response = await axiosInstance.post<ApiResponse<AdminTicketData>>(
      `/api/tickets/admin/${ticketId}/resolve`,
    );
    return response.data;
  }

  async escalateTicket(
    ticketId: string,
  ): Promise<ApiResponse<AdminTicketData>> {
    const response = await axiosInstance.post<ApiResponse<AdminTicketData>>(
      `/api/tickets/admin/${ticketId}/escalate`,
    );
    return response.data;
  }

  async closeTicket(ticketId: string): Promise<ApiResponse<AdminTicketData>> {
    const response = await axiosInstance.post<ApiResponse<AdminTicketData>>(
      `/api/tickets/admin/${ticketId}/close`,
    );
    return response.data;
  }

  async replyToTicket(
    ticketId: string,
    message: string,
    attachments?: string[],
  ): Promise<ApiResponse<AdminTicketData>> {
    const response = await axiosInstance.post<ApiResponse<AdminTicketData>>(
      `/api/tickets/admin/${ticketId}/reply`,
      {
        message,
        attachments,
      },
    );
    return response.data;
  }

  // Client Management
  async getClients(params?: any): Promise<ApiResponse<Client[]>> {
    const response = await axiosInstance.get<ApiResponse<Client[]>>(
      "/api/admin/clients",
      { params },
    );
    return response.data;
  }

  async getClientDetails(clientId: string): Promise<ApiResponse<Client>> {
    const response = await axiosInstance.get<ApiResponse<Client>>(
      `/api/admin/clients/${clientId}`,
    );
    return response.data;
  }

  async getClientActivity(
    clientId: string,
  ): Promise<ApiResponse<ClientActivity[]>> {
    const response = await axiosInstance.get<ApiResponse<ClientActivity[]>>(
      `/api/admin/clients/${clientId}/activity`,
    );
    return response.data;
  }

  async getClientOrders(clientId: string): Promise<ApiResponse<ClientOrder[]>> {
    const response = await axiosInstance.get<ApiResponse<ClientOrder[]>>(
      `/api/admin/clients/${clientId}/orders`,
    );
    return response.data;
  }

  async getClientQueries(
    clientId: string,
  ): Promise<ApiResponse<ClientQuery[]>> {
    const response = await axiosInstance.get<ApiResponse<ClientQuery[]>>(
      `/api/admin/clients/${clientId}/queries`,
    );
    return response.data;
  }

  async getClientNotes(clientId: string): Promise<ApiResponse<ClientNote[]>> {
    const response = await axiosInstance.get<ApiResponse<ClientNote[]>>(
      `/api/admin/clients/${clientId}/notes`,
    );
    return response.data;
  }

  async addClientNote(
    clientId: string,
    note: { content: string },
  ): Promise<ApiResponse<ClientNote>> {
    const response = await axiosInstance.post<ApiResponse<ClientNote>>(
      `/api/admin/clients/${clientId}/notes`,
      note,
    );
    return response.data;
  }

  // Business Info
  async getBusinessInfoByUser(userId: string): Promise<ApiResponse<any>> {
    const response = await axiosInstance.get<ApiResponse<any>>(
      `/api/admin/kyc/user/${userId}/business-info`,
    );
    return response.data;
  }

  async updateBusinessInfoStatus(
    id: string,
    action: "approve" | "reject",
    rejectionReason?: string,
  ): Promise<ApiResponse<any>> {
    const response = await axiosInstance.put<ApiResponse<any>>(
      `/api/admin/kyc/business-info/${id}/status`,
      {
        action,
        rejectionReason,
      },
    );
    return response.data;
  }

  async getBusinessInfoById(id: string): Promise<ApiResponse<any>> {
    const response = await axiosInstance.get<ApiResponse<any>>(
      `/api/admin/kyc/business-info/${id}`,
    );
    return response.data;
  }
}

export const adminService = new AdminService();
