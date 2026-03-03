import axiosInstance from "./api.service";
import { MeetingRoomItem, ApiResponse } from "@/types/services";

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
      };
    }
    return undefined;
  } catch (error) {
    console.error("Error fetching meeting room by id:", error);
    return undefined;
  }
};
