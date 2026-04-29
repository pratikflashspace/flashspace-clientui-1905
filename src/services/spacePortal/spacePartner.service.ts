import axiosInstance from "@/lib/axios";
import { handleApiError } from "@/services/api.service";
import { API_ENDPOINTS } from "@/config/api.config";

export interface SpacePartnerTeamMember {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  status: "active" | "inactive";
  loginPassword?: string | null;
  createdAt?: string;
}

export interface CreateSpacePartnerTeamMemberPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  password?: string;
}

export interface CreateSpacePartnerTeamMemberResponse {
  member: SpacePartnerTeamMember;
  generatedPassword: string;
}

const TEAM_MEMBER_BASE_PATHS = [
  "/api/user/partner/team-members",
  "/api/spacePartner/team-members",
];

const requestTeamMemberApi = async <T>(
  request: (basePath: string) => Promise<T>,
) => {
  let lastNotFoundError: any = null;

  for (const basePath of TEAM_MEMBER_BASE_PATHS) {
    try {
      return await request(basePath);
    } catch (error: any) {
      if (error?.response?.status === 404) {
        lastNotFoundError = error;
        continue;
      }
      throw error;
    }
  }

  if (lastNotFoundError) {
    throw lastNotFoundError;
  }

  throw new Error("Team member API endpoints are unavailable");
};

/**
 * Fetch all team members created by the current partner account.
 */
export const fetchPartnerTeamMembers = async () => {
  try {
    const response: any = await requestTeamMemberApi((basePath) =>
      axiosInstance.get(basePath),
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Create a team member for the current partner and get generated password.
 */
export const createPartnerTeamMember = async (
  payload: CreateSpacePartnerTeamMemberPayload,
) => {
  try {
    const response: any = await requestTeamMemberApi((basePath) =>
      axiosInstance.post(basePath, payload),
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Remove (soft-delete) a team member.
 */
export const deletePartnerTeamMember = async (memberId: string) => {
  try {
    const response: any = await requestTeamMemberApi((basePath) =>
      axiosInstance.delete(`${basePath}/${memberId}`),
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Fetch all coworking spaces for the logged-in partner.
 * Uses cookies for authentication.
 */
export const fetchPartnerSpaces = async (token?: string) => {
  try {
    const response: any = await axiosInstance.get(
      "/api/coworkingSpace/partner/spaces",
    );
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Fetch all virtual offices for the logged-in partner.
 */
export const fetchPartnerVirtualOffices = async () => {
  try {
    const response: any = await axiosInstance.get(
      "/api/virtualOffice/partner/spaces",
    );
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Fetch bookings for a specific coworking space.
 * Uses cookies for authentication.
 */
export const fetchSpaceBookings = async (
  token: string | null,
  spaceId: string,
  month?: number, // 1-12
  year?: number,
) => {
  try {
    let url = `/api/user/partner/space/${spaceId}/bookings?year=${year || new Date().getFullYear()}`;
    if (month) {
      url += `&month=${month}`;
    }
    const response: any = await axiosInstance.get(url);
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Fetch scheduled calls for Meeting Scheduler.
 */
export const fetchScheduledCalls = async (
  startDate: string,
  endDate: string,
) => {
  try {
    const response: any = await axiosInstance.get(
      `/api/meetings/calls?startDate=${startDate}&endDate=${endDate}`,
    );
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Fetch overview stats and clients for the Space Portal dashboard.
 */
export const fetchPartnerDashboard = async () => {
  try {
    const response = await axiosInstance.get("/api/user/partner/dashboard");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Fetch all types of spaces for the logged-in partner.
 */
export const fetchAllPartnerSpaces = async () => {
  try {
    const response: any = await axiosInstance.get("/api/user/partner/spaces");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Fetch active requests for the Space Portal dashboard.
 */
export const fetchPartnerActiveRequests = async () => {
  try {
    const response = await axiosInstance.get(
      "/api/user/partner/active-requests",
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchPartnerBookingRequests = async () => {
  try {
    const response = await axiosInstance.get("/api/user/partner/booking-requests");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const reviewPartnerBookingKycDocument = async (
  bookingId: string,
  payload: {
    profileModel: "kyc" | "business" | "partner";
    profileId: string;
    documentType?: string;
    documentId?: string;
    action: "approve" | "reject";
    rejectionReason?: string;
  },
) => {
  try {
    const response = await axiosInstance.post(
      `/api/user/partner/booking-requests/${bookingId}/kyc-documents/review`,
      payload,
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const uploadPartnerBookingDocument = async (
  bookingId: string,
  documentType: string,
  file: File,
  name?: string,
) => {
  try {
    const formData = new FormData();
    formData.append("documentType", documentType);
    formData.append("name", name || file.name);
    formData.append("file", file);
    const response = await axiosInstance.post(
      `/api/user/partner/booking-requests/${bookingId}/documents`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const reviewPartnerBookingDocument = async (
  bookingId: string,
  payload: {
    documentType: string;
    action: "approve" | "reject";
    rejectionReason?: string;
  },
) => {
  try {
    const response = await axiosInstance.post(
      `/api/user/partner/booking-requests/${bookingId}/documents/review`,
      payload,
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Fetch analytics data for the Space Portal dashboard.
 */
export const fetchBookingAnalytics = async () => {
  try {
    const response = await axiosInstance.get("/api/user/partner/analytics");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Fetch analytics data for a specific property.
 */
export const fetchPropertyAnalytics = async (propertyId: string) => {
  try {
    const response = await axiosInstance.get(
      `/api/user/partner/property/${propertyId}/analytics`,
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * --- documented API methods ---
 */

// --- 1. Space Partner Module ---

/**
 * Create a new space for the partner.
 */
export const createSpace = async (data: any) => {
  try {
    const response: any = await axiosInstance.post(
      "/api/spacePartner/spaces",
      data,
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get all spaces for the authenticated partner (Docs version).
 */
export const fetchPartnerSpacesDocs = async () => {
  try {
    const response: any = await axiosInstance.get("/api/spacePartner/spaces");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get space details by ID.
 */
export const fetchSpaceById = async (id: string) => {
  try {
    const response: any = await axiosInstance.get(
      `/api/spacePartner/spaces/${id}`,
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Update space details.
 */
export const updateSpace = async (id: string, data: any) => {
  try {
    const response: any = await axiosInstance.put(
      `/api/spacePartner/spaces/${id}`,
      data,
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Delete a space.
 */
export const deleteSpace = async (id: string) => {
  try {
    const response: any = await axiosInstance.delete(
      `/api/spacePartner/spaces/${id}`,
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Create a partner invoice.
 */
export const createInvoice = async (data: any) => {
  try {
    const response: any = await axiosInstance.post(
      "/api/spacePartner/invoices",
      data,
    );
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get all invoices for the partner.
 */
export const fetchInvoices = async () => {
  try {
    const response: any = await axiosInstance.get("/api/spacePartner/invoices");
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Record a payment.
 */
export const createPayment = async (data: any) => {
  try {
    const response: any = await axiosInstance.post(
      "/api/spacePartner/payments",
      data,
    );
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get all payments for the partner.
 */
export const fetchPayments = async () => {
  try {
    const response: any = await axiosInstance.get("/api/spacePartner/payments");
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// --- 2. Coworking Space Module ---

/**
 * Create a coworking space.
 */
export const createCoworkingSpace = async (data: any) => {
  try {
    const response: any = await axiosInstance.post(
      "/api/coworkingSpace/create",
      data,
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get all coworking spaces (Public).
 */
export const fetchAllCoworkingSpacesPublic = async (params?: {
  deleted?: boolean;
  property?: string;
}) => {
  try {
    const response: any = await axiosInstance.get(
      "/api/coworkingSpace/getAll",
      {
        params,
      },
    );
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get coworking spaces in a specific city.
 */
export const fetchCoworkingSpacesByCity = async (city: string) => {
  try {
    const response: any = await axiosInstance.get(
      `/api/coworkingSpace/getByCity/${city}`,
    );
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get details of a specific coworking space.
 */
export const fetchCoworkingSpaceById = async (id: string) => {
  try {
    const response: any = await axiosInstance.get(
      `/api/coworkingSpace/getById/${id}`,
    );
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Update a coworking space.
 */
export const updateCoworkingSpace = async (id: string, data: any) => {
  try {
    const response: any = await axiosInstance.put(
      `/api/coworkingSpace/update/${id}`,
      data,
    );
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Delete a coworking space.
 */
export const deleteCoworkingSpace = async (id: string) => {
  try {
    const response: any = await axiosInstance.delete(
      `/api/coworkingSpace/delete/${id}`,
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// --- 3. Meeting Room Module ---

/**
 * Get all meeting rooms.
 */
export const fetchAllMeetingRooms = async (params?: {
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  property?: string;
}) => {
  try {
    const response: any = await axiosInstance.get("/api/meetingRoom/getAll", {
      params,
    });
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get meeting room by ID.
 */
export const fetchMeetingRoomById = async (id: string) => {
  try {
    const response: any = await axiosInstance.get(
      `/api/meetingRoom/getById/${id}`,
    );
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get meeting rooms by city.
 */
export const fetchMeetingRoomsByCity = async (city: string) => {
  try {
    const response: any = await axiosInstance.get(
      `/api/meetingRoom/getByCity/${city}`,
    );
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Create a meeting room.
 */
export const createMeetingRoom = async (data: any) => {
  try {
    const response: any = await axiosInstance.post(
      "/api/meetingRoom/create",
      data,
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Update meeting room.
 */
export const updateMeetingRoom = async (id: string, data: any) => {
  try {
    const response: any = await axiosInstance.put(
      `/api/meetingRoom/update/${id}`,
      data,
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Delete meeting room.
 */
export const deleteMeetingRoom = async (id: string) => {
  try {
    const response: any = await axiosInstance.delete(
      `/api/meetingRoom/delete/${id}`,
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get partner-specific meeting rooms.
 */
export const fetchPartnerMeetingRooms = async () => {
  try {
    const response: any = await axiosInstance.get(
      "/api/meetingRoom/partner/my-rooms",
    );
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// --- 4. Virtual Office Module ---

/**
 * Get all virtual offices (Public).
 */
export const fetchAllVirtualOfficesPublic = async (params?: {
  deleted?: boolean;
  property?: string;
}) => {
  try {
    const response: any = await axiosInstance.get("/api/virtualOffice/getAll", {
      params,
    });
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get virtual offices by city.
 */
export const fetchVirtualOfficesByCity = async (city: string) => {
  try {
    const response: any = await axiosInstance.get(
      `/api/virtualOffice/getByCity/${city}`,
    );
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get virtual office details.
 */
export const fetchVirtualOfficeById = async (id: string) => {
  try {
    const response: any = await axiosInstance.get(
      `/api/virtualOffice/getById/${id}`,
    );
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Create a virtual office.
 */
export const createVirtualOffice = async (data: any) => {
  try {
    const response: any = await axiosInstance.post(
      "/api/virtualOffice/create",
      data,
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Update a virtual office.
 */
export const updateVirtualOffice = async (id: string, data: any) => {
  try {
    const response: any = await axiosInstance.put(
      `/api/virtualOffice/update/${id}`,
      data,
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Delete/Restore a virtual office.
 */
export const deleteVirtualOffice = async (id: string, restore = false) => {
  try {
    const response: any = await axiosInstance.delete(
      `/api/virtualOffice/delete/${id}${restore ? "?restore=true" : ""}`,
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
/**
 * --- 5. KYC & Profile Module ---
 */

/**
 * Fetch the authenticated partner's KYC record.
 */
export const fetchMyKyc = async () => {
  try {
    const response = await axiosInstance.get("/api/spacePartner/kyc");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Update KYC personal information.
 */
export const updateKycPersonal = async (data: any) => {
  try {
    const response = await axiosInstance.put("/api/spacePartner/kyc", data);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Update KYC business information.
 */
export const updateKycBusiness = async (data: any) => {
  try {
    const response = await axiosInstance.put("/api/spacePartner/kyc/business-info", data);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Update KYC bank information.
 */
export const updateKycBank = async (data: any) => {
  try {
    const response = await axiosInstance.put("/api/spacePartner/kyc/bank-info", data);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Upload a KYC document.
 */
export const uploadKycDoc = async (documentType: string, file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", documentType);
    const response = await axiosInstance.post("/api/spacePartner/kyc/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Submit KYC for overall review.
 */
export const submitKycForReview = async () => {
  try {
    const response = await axiosInstance.post("/api/spacePartner/kyc/submit");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Upload a document for a specific booking (Partner only)
 */
export const uploadBookingDocument = async (
  bookingId: string,
  documentType: string,
  file: File,
) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", documentType);
    const response = await axiosInstance.post(
      API_ENDPOINTS.USER.PARTNER_UPLOAD_BOOKING_DOCUMENT(bookingId),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
