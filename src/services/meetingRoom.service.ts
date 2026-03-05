import axiosInstance from "./api.service";
import { MeetingRoomItem, ApiResponse } from "@/types/services";

/**
 * Get meeting rooms by city
 * @param city - City name
 * @returns Array of meeting rooms in that city
 */
export const getMeetingRoomsByCity = async (
  city: string,
): Promise<MeetingRoomItem[]> => {
  try {
    const response = await axiosInstance.get(`/meetingRoom/getByCity/${city}`);
    const data = response.data as ApiResponse<any>;

    if (response.status === 200 && data.success) {
      const rooms = Array.isArray(data.data)
        ? data.data
        : data.data?.rooms || [];

      return rooms.map((r: any) => ({
        ...r,
        features: r.amenities || [],
        price: r.pricePerHour
          ? `₹${r.pricePerHour.toLocaleString()}/hr`
          : "Price on request",
        image: r.images?.[0] || "",
        rating: r.avgRating || 0,
        reviews: r.totalReviews || 0,
      }));
    }

    throw new Error(data.message || "Failed to fetch meeting rooms");
  } catch (error) {
    console.error("Error fetching meeting rooms:", error);
    return [];
  }
};

/**
 * Get all meeting rooms
 * @returns Array of all meeting rooms
 */
export const getAllMeetingRooms = async (): Promise<MeetingRoomItem[]> => {
  try {
    const response = await axiosInstance.get("/meetingRoom/getAll");
    const data = response.data as ApiResponse<any>;

    if (response.status === 200 && data.success) {
      const rooms = Array.isArray(data.data)
        ? data.data
        : data.data?.rooms || [];

      return rooms.map((r: any) => ({
        ...r,
        features: r.amenities || [],
        price: r.pricePerHour
          ? `₹${r.pricePerHour.toLocaleString()}/hr`
          : "Price on request",
        image: r.images?.[0] || "",
        rating: r.avgRating || 0,
        reviews: r.totalReviews || 0,
      }));
    }

    throw new Error(data.message || "Failed to fetch meeting rooms");
  } catch (error) {
    console.error("Error fetching all meeting rooms:", error);
    return [];
  }
};

/**
 * Get meeting room by ID
 * @param id - Meeting room ID
 * @returns Meeting room details
 */
export const getMeetingRoomById = async (
  id: string,
): Promise<MeetingRoomItem | undefined> => {
  try {
    const response = await axiosInstance.get(`/meetingRoom/getById/${id}`);
    const data = response.data as ApiResponse<MeetingRoomItem>;

    if (response.status === 200 && data.success && data.data) {
      const r = data.data;
      return {
        ...r,
        features: r.features || (r as any).amenities || [],
        price:
          r.price ||
          ((r as any).pricePerHour
            ? `₹${(r as any).pricePerHour.toLocaleString()}/hr`
            : ""),
        image: r.image || (r as any).images?.[0] || "",
        rating: r.rating || (r as any).avgRating || 0,
        reviews: r.reviews || (r as any).totalReviews || 0,
      };
    }
    return undefined;
  } catch (error) {
    console.error("Error fetching meeting room by id:", error);
    return undefined;
  }
};

/**
 * Create a new meeting room
 * @param data - Meeting room data
 * @returns Created meeting room
 */
export const createMeetingRoom = async (
  data: Partial<MeetingRoomItem>,
): Promise<MeetingRoomItem> => {
  try {
    const response = await axiosInstance.post("/meetingRoom/create", data);
    const responseData = response.data as ApiResponse<MeetingRoomItem>;

    if ([200, 201].includes(response.status) && responseData.success) {
      return responseData.data;
    }

    throw new Error(responseData.message || "Failed to create meeting room");
  } catch (error: any) {
    console.error("Error creating meeting room:", error);
    throw error;
  }
};

/**
 * Update a meeting room
 * @param id - Meeting room ID
 * @param data - Updated meeting room data
 * @returns Updated meeting room
 */
export const updateMeetingRoom = async (
  id: string,
  data: Partial<MeetingRoomItem>,
): Promise<MeetingRoomItem> => {
  try {
    const response = await axiosInstance.put(`/meetingRoom/update/${id}`, data);
    const responseData = response.data as ApiResponse<MeetingRoomItem>;

    if ([200, 201].includes(response.status) && responseData.success) {
      return responseData.data;
    }

    throw new Error(responseData.message || "Failed to update meeting room");
  } catch (error: any) {
    console.error("Error updating meeting room:", error);
    throw error;
  }
};

/**
 * Bulk save mapping rooms
 * @param propertyId - Property ID
 * @param rooms - Array of meeting rooms
 * @returns Saved meeting rooms
 */
export const bulkSaveMeetingRooms = async (
  propertyId: string,
  rooms: Partial<MeetingRoomItem>[],
): Promise<MeetingRoomItem[]> => {
  try {
    const response = await axiosInstance.post("/meetingRoom/bulk-save", {
      propertyId,
      rooms,
    });
    const responseData = response.data as ApiResponse<MeetingRoomItem[]>;

    if ([200, 201].includes(response.status) && responseData.success) {
      return responseData.data || [];
    }

    throw new Error(
      responseData.message || "Failed to bulk save meeting rooms",
    );
  } catch (error: any) {
    console.error("Error bulk saving meeting rooms:", error);
    throw error;
  }
};
