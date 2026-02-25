import axiosInstance, { handleApiError } from "@/services/api.service";

/**
 * Fetch all coworking spaces for the logged-in partner.
 * Uses cookies for authentication.
 */
export const fetchPartnerSpaces = async (token?: string) => {
  try {
    const response: any = await axiosInstance.get(
      "/coworkingSpace/partner/spaces",
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
      "/virtualOffice/partner/spaces",
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
    let url = `/user/partner/space/${spaceId}/bookings?year=${year || new Date().getFullYear()}`;
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
      `/meetings/calls?startDate=${startDate}&endDate=${endDate}`,
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
    const response = await axiosInstance.get("/user/partner/dashboard");
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
    const response: any = await axiosInstance.get("/user/partner/spaces");
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
    const response = await axiosInstance.get("/user/partner/active-requests");
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
      "/spacePartner/spaces",
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
    const response: any = await axiosInstance.get("/spacePartner/spaces");
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
    const response: any = await axiosInstance.get(`/spacePartner/spaces/${id}`);
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
      `/spacePartner/spaces/${id}`,
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
      `/spacePartner/spaces/${id}`,
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
      "/spacePartner/invoices",
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
    const response: any = await axiosInstance.get("/spacePartner/invoices");
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
      "/spacePartner/payments",
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
    const response: any = await axiosInstance.get("/spacePartner/payments");
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
      "/coworkingSpace/create",
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
    const response: any = await axiosInstance.get("/coworkingSpace/getAll", {
      params,
    });
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
      `/coworkingSpace/getByCity/${city}`,
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
      `/coworkingSpace/getById/${id}`,
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
      `/coworkingSpace/update/${id}`,
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
      `/coworkingSpace/delete/${id}`,
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
    const response: any = await axiosInstance.get("/meetingRoom/getAll", {
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
    const response: any = await axiosInstance.get(`/meetingRoom/getById/${id}`);
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
      `/meetingRoom/getByCity/${city}`,
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
    const response: any = await axiosInstance.post("/meetingRoom/create", data);
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
      `/meetingRoom/update/${id}`,
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
      `/meetingRoom/delete/${id}`,
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
      "/meetingRoom/partner/my-rooms",
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
    const response: any = await axiosInstance.get("/virtualOffice/getAll", {
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
      `/virtualOffice/getByCity/${city}`,
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
      `/virtualOffice/getById/${id}`,
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
      "/virtualOffice/create",
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
      `/virtualOffice/update/${id}`,
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
      `/virtualOffice/delete/${id}${restore ? "?restore=true" : ""}`,
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
