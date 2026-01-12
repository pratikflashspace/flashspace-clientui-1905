import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/config/api.config';

// ============ TYPES ============

export interface DashboardData {
  activeServices: number;
  pendingInvoices: number;
  nextBookingDate: string | null;
  kycStatus: string;
  recentActivity: Array<{
    type: string;
    message: string;
    date: string;
  }>;
  usageBreakdown: {
    virtualOffice: number;
    coworkingSpace: number;
  };
  monthlyBookings: Array<{
    month: string;
    count: number;
  }>;
}

export interface SpaceSnapshot {
  _id?: string;
  name?: string;
  address?: string;
  city?: string;
  area?: string;
  image?: string;
  coordinates?: { lat: number; lng: number };
}

export interface Booking {
  _id: string;
  bookingNumber: string;
  type: 'virtual_office' | 'coworking_space';
  status: 'pending_payment' | 'pending_kyc' | 'active' | 'expired' | 'cancelled';
  spaceId: string;
  spaceSnapshot?: SpaceSnapshot;
  plan: {
    name: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    tenure: number;
    tenureUnit?: string;
  };
  timeline?: Array<{
    status: string;
    date: string;
    note?: string;
    by?: string;
  }>;
  documents?: Array<{
    name: string;
    type: string;
    url?: string;
    generatedAt?: string;
  }>;
  startDate?: string;
  endDate?: string;
  daysRemaining?: number;
  autoRenew?: boolean;
  features?: string[];
  createdAt: string;
}

export interface KYCData {
  overallStatus: 'not_started' | 'pending' | 'approved' | 'rejected' | 'resubmit';
  progress: number;
  personalInfo?: {
    fullName?: string;
    email?: string;
    phone?: string;
    verified?: boolean;
    status?: any;
    dateOfBirth?: string;
    aadhaarLast4?: string;
    panNumber?: string;
  };
  businessInfo?: {
    companyName?: string;
    companyType?: string;
    gstNumber?: string;
    panNumber?: string;
    cinNumber?: string;
    registeredAddress?: string;
    industry?: string;
    verified?: boolean;
  };
  documents?: Array<{
    type: string;
    name: string;
    fileUrl?: string;
    status: 'pending' | 'approved' | 'rejected';
    rejectionReason?: string;
    uploadedAt?: string;
    verifiedAt?: string;
  }>;
}

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  bookingNumber?: string;
  description: string;
  subtotal: number;
  taxRate?: number;
  taxAmount?: number;
  total: number;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  dueDate?: string;
  paidAt?: string;
  createdAt: string;
}

export interface InvoicesResponse {
  summary: {
    totalPaid: number;
    totalPending: number;
    totalInvoices: number;
  };
  invoices: Invoice[];
}

export interface SupportTicket {
  _id: string;
  ticketNumber: string;
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';
  messages?: Array<{
    sender: 'user' | 'support';
    senderName: string;
    message: string;
    createdAt: string;
  }>;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: {
    total: number;
    page: number;
    pages: number;
  };
}

// ============ SERVICE CLASS ============

class UserDashboardService {
  // ========== DASHBOARD ==========

  async getDashboard(): Promise<ApiResponse<DashboardData>> {
    try {
      const response = await axiosInstance.get<ApiResponse<DashboardData>>(API_ENDPOINTS.USER.DASHBOARD);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch dashboard',
      };
    }
  }

  // ========== BOOKINGS ==========

  async getBookings(params?: {
    type?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Booking[]>> {
    try {
      const response = await axiosInstance.get<ApiResponse<Booking[]>>(API_ENDPOINTS.USER.BOOKINGS, { params });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch bookings',
      };
    }
  }

  async getBookingById(id: string): Promise<ApiResponse<Booking>> {
    try {
      const response = await axiosInstance.get<ApiResponse<Booking>>(API_ENDPOINTS.USER.BOOKING_BY_ID(id));
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch booking',
      };
    }
  }

  async toggleAutoRenew(id: string, autoRenew: boolean): Promise<ApiResponse<void>> {
    try {
      const response = await axiosInstance.patch<ApiResponse<void>>(API_ENDPOINTS.USER.BOOKING_AUTO_RENEW(id), { autoRenew });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update auto-renewal',
      };
    }
  }

  // ========== KYC ==========

  async getKYC(): Promise<ApiResponse<KYCData>> {
    try {
      const response = await axiosInstance.get<ApiResponse<KYCData>>(API_ENDPOINTS.USER.KYC);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch KYC status',
      };
    }
  }

  async updateBusinessInfo(data: {
    companyName?: string;
    companyType?: string;
    gstNumber?: string;
    panNumber?: string;
    cinNumber?: string;
    registeredAddress?: string;
    industry?: string;
  }): Promise<ApiResponse<KYCData>> {
    try {
      const response = await axiosInstance.put<ApiResponse<KYCData>>(API_ENDPOINTS.USER.KYC_BUSINESS_INFO, data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update business info',
      };
    }
  }

  async uploadKYCDocument(
    docType: string,
    file: File
  ): Promise<ApiResponse<{ type: string; status: string; uploadedAt: string }>> {
    try {
      const formData = new FormData();
      formData.append('documentType', docType);
      formData.append('file', file);

      const response = await axiosInstance.post<ApiResponse<{ type: string; status: string; uploadedAt: string }>>(
        API_ENDPOINTS.USER.KYC_UPLOAD,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to upload document',
      };
    }
  }

  // ========== INVOICES ==========

  async getInvoices(params?: {
    status?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<InvoicesResponse>> {
    try {
      const response = await axiosInstance.get<ApiResponse<InvoicesResponse>>(API_ENDPOINTS.USER.INVOICES, { params });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch invoices',
      };
    }
  }

  async getInvoiceById(id: string): Promise<ApiResponse<Invoice>> {
    try {
      const response = await axiosInstance.get<ApiResponse<Invoice>>(API_ENDPOINTS.USER.INVOICE_BY_ID(id));
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch invoice',
      };
    }
  }

  // ========== SUPPORT TICKETS ==========

  async getTickets(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<SupportTicket[]>> {
    try {
      const response = await axiosInstance.get<ApiResponse<SupportTicket[]>>(API_ENDPOINTS.USER.TICKETS, { params });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch tickets',
      };
    }
  }

  async createTicket(data: {
    subject: string;
    category: string;
    priority?: string;
    description: string;
    bookingId?: string;
  }): Promise<ApiResponse<{ _id: string; ticketNumber: string; status: string }>> {
    try {
      const response = await axiosInstance.post<ApiResponse<{ _id: string; ticketNumber: string; status: string }>>(API_ENDPOINTS.USER.TICKETS, data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create ticket',
      };
    }
  }

  async getTicketById(id: string): Promise<ApiResponse<SupportTicket>> {
    try {
      const response = await axiosInstance.get<ApiResponse<SupportTicket>>(API_ENDPOINTS.USER.TICKET_BY_ID(id));
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch ticket',
      };
    }
  }

  async replyToTicket(id: string, message: string): Promise<ApiResponse<void>> {
    try {
      const response = await axiosInstance.post<ApiResponse<void>>(API_ENDPOINTS.USER.TICKET_REPLY(id), { message });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send reply',
      };
    }
  }
}

export const userDashboardService = new UserDashboardService();
export default userDashboardService;
