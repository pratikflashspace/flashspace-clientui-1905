import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/types/services";
import {
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
  openTickets: number;
  recentActivity: Array<{
    id: string;
    type: string;
    message: string;
    time: string;
  }>;
}

export type AdminSpaceType =
  | "virtual-office"
  | "coworking-space"
  | "meeting-room";

export interface SpaceItem {
  _id: string;
  name: string;
  type: AdminSpaceType;
  spaceType?: string;
  city: string;
  area: string;
  price: string;
  isActive?: boolean;
  isDeleted?: boolean;
  partner?: string | { _id?: string; id?: string; fullName?: string; email?: string };
  partnerId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserData {
  _id: string;
  id?: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role:
  | "user"
  | "super_admin"
  | "admin"
  | "affiliate_manager"
  | "space_partner_manager"
  | "support"
  | "partner"
  | "space_manager"
  | "sales"
  | "affiliate";
  status: "active" | "inactive" | "pending";
  isEmailVerified?: boolean;
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

export interface AdminClientListItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  bookingCount: number;
  activeBookings: number;
  totalRevenue: number;
  firstBookingDate: string | null;
  lastBookingDate: string | null;
  statusLabel: "Active" | "At Risk" | "Churned";
  initials: string;
}

export interface AdminClientListResponse {
  clients: AdminClientListItem[];
  stats: {
    total: number;
    active: number;
    atRisk: number;
    churned: number;
  };
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

export interface AdminClientBookingItem {
  id: string;
  bookingNumber: string;
  type: string;
  status: "pending_payment" | "pending_kyc" | "active" | "expired" | "cancelled";
  planName: string;
  planTenure: string | null;
  amount: number;
  spaceName: string;
  spaceCity: string | null;
  startDate: string | null;
  endDate: string | null;
  createdAt: string | null;
}

export interface AdminClientDetailResponse {
  client: {
    id: string;
    name: string;
    email: string;
    phone: string;
    totalBookings: number;
    activeBookings: number;
    totalRevenue: number;
    firstBookingDate: string | null;
    lastBookingDate: string | null;
    statusLabel: "Active" | "At Risk" | "Churned";
  };
  bookings: AdminClientBookingItem[];
}

export interface KYCData {
  _id: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
  };
  partnerInfo?: {
    fullName?: string;
    email?: string;
    phone?: string;
    panNumber?: string;
    aadhaarNumber?: string;
    verified?: boolean;
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
    address?: string;
    city?: string;
    area?: string;
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
  bookingId?: {
    _id: string;
    bookingNumber: string;
    spaceSnapshot: {
      name: string;
      city: string;
    };
    type: string;
    status: string;
  };
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  messages: Array<{
    sender: "user" | "support" | "admin" | "partner" | "affiliate";
    message: string;
    createdAt: string;
  }>;
  unreadCount?: number;
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
    deleted?: boolean;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ users: UserData[]; stats: any; pagination: any }>> {
    const response = await axiosInstance.get<
      ApiResponse<{ users: UserData[]; stats: any; pagination: any }>
    >("/api/admin/users", { params });
    return response.data;
  }

  async getPartnerUsers(): Promise<ApiResponse<{ partners: UserData[] }>> {
    const response = await axiosInstance.get<
      ApiResponse<{ partners: UserData[] }>
    >("/api/admin/partners");
    return response.data;
  }

  async getStaffMembers(): Promise<ApiResponse<UserData[]>> {
    // Roles that are considered staff/internal and can be assigned tickets
    const staffRoles = [
      "super_admin",
      "admin",
      "support",
      "sales",
      "affiliate_manager",
      "space_partner_manager",
      "partner",
      "space_manager",
      "affiliate"
    ];

    const response = await axiosInstance.get<ApiResponse<{ users: UserData[] }>>(
      "/api/admin/users",
      {
        params: {
          role: staffRoles.join(","),
          limit: 100, // Reasonable limit for staff
          status: "active"
        }
      }
    );

    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data.users
    };
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

  private normalizeAdminSpace(space: any): SpaceItem | null {
    const rawType = space.spaceType || space.type;
    const normalizedType = String(rawType || "").replace(/_/g, "-");
    const type: AdminSpaceType | null =
      normalizedType === "virtual-office"
        ? "virtual-office"
        : normalizedType === "coworking" || normalizedType === "coworking-space"
          ? "coworking-space"
          : normalizedType === "meeting-room"
            ? "meeting-room"
            : null;

    if (!type) return null;

    const property =
      space.property && typeof space.property === "object"
        ? space.property
        : undefined;

    return {
      ...space,
      type,
      name: space.name || space.propertyName || property?.name || "",
      city: space.city || space.propertyCity || property?.city || "",
      area: space.area || property?.area || "",
      price:
        space.price ||
        space.finalPricePerYear ||
        space.finalPricePerMonth ||
        space.finalPricePerHour ||
        space.finalPricePerDay ||
        "",
      propertyId:
        space.propertyId ||
        property?._id ||
        (typeof space.property === "string" ? space.property : undefined),
      partner: space.partner || property?.partner,
    } as SpaceItem;
  }

  async getAllSpaces(deleted: boolean = false): Promise<ApiResponse<SpaceItem[]>> {
    try {
      const adminResponse = await axiosInstance.get<
        ApiResponse<{ spaces: any[]; pagination: any }>
      >("/api/admin/spaces", {
        params: {
          deleted,
          limit: 500,
        },
      });

      if (adminResponse.data.success) {
        const spaces = (adminResponse.data.data?.spaces || [])
          .map((space) => this.normalizeAdminSpace(space))
          .filter((space): space is SpaceItem => Boolean(space));

        return {
          success: true,
          message: adminResponse.data.message || "Spaces fetched successfully",
          data: spaces,
        };
      }
    } catch (adminError) {
      console.warn("Admin spaces endpoint failed, using public fallback", adminError);
    }

    try {
      const [voRes, coRes, meetingRes] = await Promise.all([
        axiosInstance.get<ApiResponse<SpaceItem[]>>(
          `/api/virtualOffice/getAll?deleted=${deleted}`,
        ),
        axiosInstance.get<ApiResponse<SpaceItem[]>>(
          `/api/coworkingSpace/getAll?deleted=${deleted}`,
        ),
        axiosInstance.get<ApiResponse<SpaceItem[]>>(
          `/api/meetingRoom/getAll?deleted=${deleted}`,
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
      const meetingSpaces = (meetingRes.data.data || []).map(
        (s: SpaceItem) => ({
          ...s,
          type: "meeting-room" as const,
        }),
      );

      return {
        success: true,
        message: "Spaces fetched successfully",
        data: [...voSpaces, ...coSpaces, ...meetingSpaces],
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
    type: AdminSpaceType,
    restore: boolean = false,
  ): Promise<ApiResponse<void>> {
    const endpointByType: Record<AdminSpaceType, string> = {
      "virtual-office": `/api/virtualOffice/delete/${id}?restore=${restore}`,
      "coworking-space": `/api/coworkingSpace/delete/${id}?restore=${restore}`,
      "meeting-room": `/api/meetingRoom/delete/${id}?restore=${restore}`,
    };

    const response = await axiosInstance.delete<ApiResponse<void>>(
      endpointByType[type],
    );
    return response.data;
  }

  async updateSpace(
    id: string,
    type: AdminSpaceType,
    data: Partial<SpaceItem>,
  ): Promise<ApiResponse<SpaceItem>> {
    const endpointByType: Record<AdminSpaceType, string> = {
      "virtual-office": `/api/virtualOffice/update/${id}`,
      "coworking-space": `/api/coworkingSpace/update/${id}`,
      "meeting-room": `/api/meetingRoom/update/${id}`,
    };

    const response = await axiosInstance.put<ApiResponse<SpaceItem>>(
      endpointByType[type],
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
    } catch (error: any) {
      if (error.response?.status === 403) {
        return { success: false, message: "You don't have access to perform this action." };
      }
      const errorMessage =
        error.response?.data?.message || (error instanceof Error ? error.message : "Failed to create user");
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
    } catch (error: any) {
      if (error.response?.status === 403) {
        return { success: false, message: "You don't have access to perform this action." };
      }
      const errorMessage =
        error.response?.data?.message || (error instanceof Error ? error.message : "Failed to update user");
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
    } catch (error: any) {
      if (error.response?.status === 403) {
        return { success: false, message: "You don't have access to perform this action." };
      }
      const errorMessage =
        error.response?.data?.message || (error instanceof Error ? error.message : "Failed to update user");
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
  async getClients(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: "all" | "active" | "at_risk" | "churned";
  }): Promise<ApiResponse<AdminClientListResponse>> {
    const response = await axiosInstance.get<ApiResponse<AdminClientListResponse>>(
      "/api/admin/clients",
      { params },
    );
    return response.data;
  }

  async getClientDetails(clientId: string): Promise<ApiResponse<AdminClientDetailResponse>> {
    const response = await axiosInstance.get<ApiResponse<AdminClientDetailResponse>>(
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

  async getAllInvoices(params?: {
    page?: number;
    limit?: number;
    type?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
  }): Promise<ApiResponse<{ invoices: any[]; pagination: any }>> {
    const response = await axiosInstance.get<
      ApiResponse<{ invoices: any[]; pagination: any }>
    >("/api/admin/invoices", { params });
    return response.data;
  }

  async getLeaderboard(): Promise<
    ApiResponse<{
      sales: Array<{
        _id: string;
        fullName: string;
        email: string;
        role: string;
        rank: number;
      }>;
      support: Array<{
        _id: string;
        fullName: string;
        email: string;
        role: string;
        rank: number;
        totalTickets: number;
        resolvedTickets: number;
        resolution: string;
        resolutionRate: number;
      }>;
    }>
  > {
    const response = await axiosInstance.get("/api/admin/leaderboard");
    return response.data;
  }

  async getRevenueDashboard(): Promise<
    ApiResponse<{
      metrics: {
        totalRevenue: number;
        mtdRevenue: number;
        ytdRevenue: number;
        avgRevenuePerClient: number;
      };
      revenueByCity: Array<{
        city: string;
        revenue: number;
        percentage: number;
      }>;
      revenueByCategory: Array<{
        category: string;
        revenue: number;
        percentage: number;
      }>;
    }>
  > {
    const response = await axiosInstance.get("/api/admin/revenue/dashboard");
    return response.data;
  }

  async getFinanceSummary(): Promise<
    ApiResponse<{
      metrics: {
        totalReceivable: number;
        overdueReceivable: number;
        totalPayable: number;
        dueThisWeek: number;
      };
      receivables: Array<{
        _id: string;
        client: string;
        email: string;
        amount: number;
        bookingNumber: string;
        type: string;
        dueDate: string;
        ageDays: number;
        status: "current" | "upcoming" | "overdue";
      }>;
      payables: Array<{
        partner: string;
        city: string;
        amount: number;
        totalRevenue: number;
        bookingCount: number;
        dueDate: string;
        ageDays: number;
        status: "scheduled" | "pending" | "overdue";
      }>;
    }>
  > {
    const response = await axiosInstance.get("/api/admin/finance/summary");
    return response.data;
  }

  async getBalanceSheet(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<
    ApiResponse<{
      overallSummary: Array<{
        label: string;
        amount: number;
        type: "credit" | "debit" | "profit";
      }>;
      monthlyBreakdown: Array<{
        month: string;
        revenue: number;
        expenses: number;
        profit: number;
      }>;
      cityBreakdown: Array<{
        city: string;
        revenue: number;
        expenses: number;
        profit: number;
        margin: string;
      }>;
    }>
  > {
    const response = await axiosInstance.get(
      "/api/admin/finance/balance-sheet",
      { params },
    );
    return response.data;
  }

  async createTicket(data: {
    subject: string;
    category: string;
    description: string;
    priority?: string;
  }): Promise<ApiResponse<any>> {
    const response = await axiosInstance.post<ApiResponse<any>>(
      "/api/tickets",
      data,
    );
    return response.data;
  }
}

export const adminService = new AdminService();
