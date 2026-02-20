import axiosInstance, { handleApiError } from "@/services/api.service";

/**
 * Fetch all coworking spaces for the logged-in partner.
 * Uses cookies for authentication.
 */
export const fetchPartnerSpaces = async (token?: string) => {
  try {
    const response = await axiosInstance.get("/coworkingSpace/partner/spaces");
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
    const response = await axiosInstance.get("/virtualOffice/partner/spaces");
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
    const response = await axiosInstance.get(url);
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
    const response = await axiosInstance.get(
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
    const response = await axiosInstance.get("/user/partner/spaces");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
