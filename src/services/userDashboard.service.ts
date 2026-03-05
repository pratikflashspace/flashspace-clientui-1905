import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api.config";
import {
  ApiResponse,
  DashboardData,
  Booking,
  KYCData,
  InvoicesResponse,
  Invoice,
  SupportTicket,
  CreditsResponse,
  UploadKYCDocumentResponse,
  CreateTicketResponse,
  RewardRedeemData,
  LinkBookingResponse,
  BookingType,
  BookingStatus,
  TicketPriority,
  TicketStatus,
  InvoiceStatus,
  KYCType,
  KYCDocument,
  PersonalInfo,
  BusinessInfo,
  MailRecord,
  VisitRecord,
} from "@/types/services";

export type { KYCData, DashboardData };

// ============ SERVICE CLASS ============

class UserDashboardService {
  // ========== DASHBOARD ==========

  async getDashboard(): Promise<ApiResponse<DashboardData>> {
    try {
      const response = await axiosInstance.get<ApiResponse<DashboardData>>(
        API_ENDPOINTS.USER.DASHBOARD,
      );
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch dashboard";
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  // ========== MAIL & VISITS ==========

  async getUserMails(): Promise<ApiResponse<MailRecord[]>> {
    try {
      const response = await axiosInstance.get<ApiResponse<MailRecord[]>>(
        API_ENDPOINTS.USER.MAIL,
      );
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch mails";
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  async getUserVisits(): Promise<ApiResponse<VisitRecord[]>> {
    try {
      const response = await axiosInstance.get<ApiResponse<VisitRecord[]>>(
        API_ENDPOINTS.USER.VISIT,
      );
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch visits";
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  // ========== BOOKINGS ==========

  async getBookings(params?: {
    type?: BookingType;
    status?: BookingStatus;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Booking[]>> {
    try {
      const response = await axiosInstance.get<ApiResponse<Booking[]>>(
        API_ENDPOINTS.USER.BOOKINGS,
        {
          params: {
            limit: 100,
            ...params
          }
        },
      );
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch bookings";
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  async getBookingById(id: string): Promise<ApiResponse<Booking>> {
    try {
      const response = await axiosInstance.get<ApiResponse<Booking>>(
        API_ENDPOINTS.USER.BOOKING_BY_ID(id),
      );
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch booking";
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  async toggleAutoRenew(
    id: string,
    autoRenew: boolean,
  ): Promise<ApiResponse<void>> {
    try {
      const response = await axiosInstance.patch<ApiResponse<void>>(
        API_ENDPOINTS.USER.BOOKING_AUTO_RENEW(id),
        { autoRenew },
      );
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update auto-renewal";
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  // ========== KYC ==========

  async getKYC(profileId?: string): Promise<ApiResponse<KYCData | KYCData[]>> {
    try {
      const params = profileId ? { profileId } : {};
      const response = await axiosInstance.get<
        ApiResponse<KYCData | KYCData[]>
      >(API_ENDPOINTS.USER.KYC, { params });
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch KYC data";
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  async updateBusinessInfo(data: {
    profileId?: string;
    profileName?: string;
    kycType?: KYCType;
    companyName?: string;
    companyType?: string;
    gstNumber?: string;
    panNumber?: string;
    cinNumber?: string;
    registeredAddress?: string;
    industry?: string;
    partners?: string[];
    personalPhone?: string;
    personalDob?: string;
    personalAadhaar?: string;
    personalPan?: string;
    personalFullName?: string;
    personalEmail?: string;
  }): Promise<ApiResponse<KYCData>> {
    try {
      const response = await axiosInstance.put<ApiResponse<KYCData>>(
        API_ENDPOINTS.USER.KYC_BUSINESS_INFO,
        data,
      );
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update business info";
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  async uploadKYCDocument(
    documentType: string,
    file: File,
    profileId: string,
  ): Promise<ApiResponse<UploadKYCDocumentResponse>> {
    try {
      const formData = new FormData();
      formData.append("documentType", documentType);
      formData.append("profileId", profileId);
      formData.append("file", file);

      const response = await axiosInstance.post<
        ApiResponse<UploadKYCDocumentResponse>
      >(API_ENDPOINTS.USER.KYC_UPLOAD, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to upload document";
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  async deleteKYCDocument(
    documentType: string,
    profileId: string,
  ): Promise<ApiResponse<void>> {
    try {
      const response = await axiosInstance.delete<ApiResponse<void>>(
        API_ENDPOINTS.USER.KYC_UPLOAD,
        {
          params: {
            documentType,
            profileId,
          },
        },
      );
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete document";
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  // Submit KYC for review
  async submitKYC(profileId: string): Promise<ApiResponse<KYCData>> {
    try {
      const response = await axiosInstance.post<ApiResponse<KYCData>>(
        API_ENDPOINTS.USER.KYC_SUBMIT,
        { profileId },
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to submit KYC for review",
      };
    }
  }

  // Link booking to profile
  async linkBookingToProfile(
    bookingId: string,
    profileId: string,
  ): Promise<ApiResponse<LinkBookingResponse>> {
    try {
      const response = await axiosInstance.post<
        ApiResponse<LinkBookingResponse>
      >(`/api/user/bookings/${bookingId}/link-profile`, { profileId });
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to link booking";
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  // ========== INVOICES ==========

  async getInvoices(params?: {
    status?: InvoiceStatus;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<InvoicesResponse>> {
    try {
      const response = await axiosInstance.get<ApiResponse<InvoicesResponse>>(
        API_ENDPOINTS.USER.INVOICES,
        { params },
      );
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch invoices";
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  async getInvoiceById(id: string): Promise<ApiResponse<Invoice>> {
    try {
      const response = await axiosInstance.get<ApiResponse<Invoice>>(
        API_ENDPOINTS.USER.INVOICE_BY_ID(id),
      );
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch invoice";
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  // ========== SUPPORT TICKETS ==========

  async getTickets(params?: {
    status?: TicketStatus;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<SupportTicket[]>> {
    try {
      const response = await axiosInstance.get<ApiResponse<SupportTicket[]>>(
        "/api/tickets/my-tickets",
        { params },
      );
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch tickets";
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  async createTicket(data: {
    subject: string;
    category: string;
    priority?: TicketPriority;
    description: string;
    bookingId?: string;
  }): Promise<ApiResponse<CreateTicketResponse>> {
    try {
      const response = await axiosInstance.post<
        ApiResponse<CreateTicketResponse>
      >("/api/tickets", data);
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create ticket";
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  async getTicketById(id: string): Promise<ApiResponse<SupportTicket>> {
    try {
      const response = await axiosInstance.get<ApiResponse<SupportTicket>>(
        `/api/tickets/${id}`,
      );
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch ticket";
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  async replyToTicket(
    id: string,
    message: string,
  ): Promise<ApiResponse<SupportTicket>> {
    try {
      const response = await axiosInstance.post<ApiResponse<SupportTicket>>(
        `/api/tickets/${id}/reply`,
        { message },
      );
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send reply";
      return {
        success: false,
        message: errorMessage,
      };
    }
  }



  // ========== CREDITS ==========

  async getCredits(): Promise<ApiResponse<CreditsResponse>> {
    try {
      const response = await axiosInstance.get<ApiResponse<CreditsResponse>>(
        API_ENDPOINTS.USER.CREDITS,
      );
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch credits";
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  async redeemReward(
    data: RewardRedeemData,
  ): Promise<
    ApiResponse<{ rewardId: string; amount: number; status: string }>
  > {
    try {
      const response = await axiosInstance.post<
        ApiResponse<{ rewardId: string; amount: number; status: string }>
      >(API_ENDPOINTS.USER.REDEEM_REWARD, data);
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to redeem reward";
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  // ========== PARTNER KYC ==========

  async addPartner(data: any): Promise<ApiResponse<any>> {
    try {
      const response = await axiosInstance.post<ApiResponse<any>>(
        "/api/user/kyc/partner",
        data,
      );
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add partner";
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  async getPartners(profileId: string): Promise<ApiResponse<any[]>> {
    try {
      const response = await axiosInstance.get<ApiResponse<any[]>>(
        `/api/user/kyc/partner/${profileId}`,
      );
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch partners";
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  async getPartnerDetails(partnerId: string): Promise<ApiResponse<any>> {
    try {
      const response = await axiosInstance.get<ApiResponse<any>>(
        `/api/user/kyc/partner-details/${partnerId}`,
      );
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch partner details";
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  async removePartner(partnerId: string): Promise<ApiResponse<void>> {
    try {
      const response = await axiosInstance.delete<ApiResponse<void>>(
        `/api/user/kyc/partner/${partnerId}`,
      );
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to remove partner";
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  async getPartnerClients(): Promise<ApiResponse<any[]>> {
    try {
      const response = await axiosInstance.get<ApiResponse<any[]>>(
        API_ENDPOINTS.USER.PARTNER_CLIENTS,
      );
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch clients";
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  async getPartnerClientDetails(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await axiosInstance.get<ApiResponse<any>>(
        API_ENDPOINTS.USER.PARTNER_CLIENT_DETAILS(id),
      );
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch client details";
      return {
        success: false,
        message: errorMessage,
      };
    }
  }
}

export const userDashboardService = new UserDashboardService();
export default userDashboardService;
