import axiosInstance from "./api.service";
import { CoworkingSpaceItem } from "@/types/services";

/**
 * Coworking Space Service
 * Handles all API calls related to coworking spaces
 */

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Get coworking spaces by city
 * @param city - City name
 * @returns Array of coworking spaces in that city
 */
export const getCoworkingSpacesByCity = async (
  city: string,
): Promise<CoworkingSpaceItem[]> => {
  try {
    // console.log(`📍 Fetching coworking spaces for city: ${city}`);
    const response = await axiosInstance.get(
      `/coworkingSpace/getByCity/${city}`,
    );
    const data = response.data as ApiResponse<any>;

    if (response.status === 200 && data.success) {
      // Handle both flat array and paginated object responses
      const spaces = Array.isArray(data.data)
        ? data.data
        : data.data?.spaces || data.data?.offices || [];

      console.log(`✅ Successfully fetched ${spaces.length} coworking spaces`);

      // Map backend data to frontend expectations
      return spaces.map((s: any) => {
        // Find the lowest monthly price in inventory
        const monthlyPrices =
          s.inventory
            ?.filter((i: any) => i.pricePerMonth)
            .map((i: any) => i.pricePerMonth) || [];

        const minPrice =
          monthlyPrices.length > 0 ? Math.min(...monthlyPrices) : 0;

        return {
          ...s,
          features: s.amenities || [],
          price: minPrice
            ? `₹${minPrice.toLocaleString()}/mo`
            : "Price on request",
          image: s.images?.[0] || "",
          rating: s.avgRating || 0,
          reviews: s.totalReviews || 0,
        };
      });
    }

    throw new Error(data.message || "Failed to fetch coworking spaces");
  } catch (error: any) {
    console.error("❌ Error fetching coworking spaces:", {
      error: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

/**
 * Get all coworking spaces
 * @returns Array of all coworking spaces
 */
export const getAllCoworkingSpaces = async (): Promise<
  CoworkingSpaceItem[]
> => {
  try {
    const response = await axiosInstance.get("/coworkingSpace/getAll");
    const data = response.data as ApiResponse<any>;

    if (response.status === 200 && data.success) {
      // Handle both flat array and paginated object responses
      const spaces = Array.isArray(data.data)
        ? data.data
        : data.data?.spaces || data.data?.offices || [];

      return spaces.map((s: any) => {
        const monthlyPrices =
          s.inventory
            ?.filter((i: any) => i.pricePerMonth)
            .map((i: any) => i.pricePerMonth) || [];

        const minPrice =
          monthlyPrices.length > 0 ? Math.min(...monthlyPrices) : 0;

        return {
          ...s,
          features: s.amenities || [],
          price: minPrice
            ? `₹${minPrice.toLocaleString()}/mo`
            : "Price on request",
          image: s.images?.[0] || "",
          rating: s.avgRating || 0,
          reviews: s.totalReviews || 0,
        };
      });
    }

    throw new Error(data.message || "Failed to fetch coworking spaces");
  } catch (error: any) {
    console.error("Error fetching coworking spaces:", error);
    throw error;
  }
};

/**
 * Get coworking space by ID
 * @param id - Coworking space ID
 * @returns Coworking space details
 */
export const getCoworkingSpaceById = async (
  id: string,
): Promise<CoworkingSpaceItem> => {
  try {
    const response = await axiosInstance.get(`/coworkingSpace/getById/${id}`);
    const data = response.data as ApiResponse<CoworkingSpaceItem>;

    if (response.status === 200 && data.success) {
      const s = data.data;
      const monthlyPrices =
        (s as any).inventory
          ?.filter((i: any) => i.pricePerMonth)
          .map((i: any) => i.pricePerMonth) || [];

      const minPrice =
        monthlyPrices.length > 0 ? Math.min(...monthlyPrices) : 0;

      return {
        ...s,
        features: (s as any).amenities || [],
        price: minPrice
          ? `₹${minPrice.toLocaleString()}/mo`
          : "Price on request",
        image: (s as any).images?.[0] || "",
        rating: (s as any).avgRating || 0,
        reviews: (s as any).totalReviews || 0,
      };
    }

    throw new Error(data.message || "Failed to fetch coworking space");
  } catch (error: any) {
    console.error("Error fetching coworking space:", error);
    throw error;
  }
};

/**
 * Create a new coworking space
 * @param data - Coworking space data
 * @returns Created coworking space
 */
export const createCoworkingSpace = async (
  data: Partial<CoworkingSpaceItem>,
): Promise<CoworkingSpaceItem> => {
  try {
    const response = await axiosInstance.post("/coworkingSpace/create", data);
    const responseData = response.data as ApiResponse<CoworkingSpaceItem>;

    if ([200, 201].includes(response.status) && responseData.success) {
      return responseData.data;
    }

    throw new Error(responseData.message || "Failed to create coworking space");
  } catch (error: any) {
    console.error("Error creating coworking space:", error);
    throw error;
  }
};

/**
 * Update a coworking space
 * @param id - Coworking space ID
 * @param data - Updated coworking space data
 * @returns Updated coworking space
 */
export const updateCoworkingSpace = async (
  id: string,
  data: Partial<CoworkingSpaceItem>,
): Promise<CoworkingSpaceItem> => {
  try {
    const response = await axiosInstance.put(
      `/coworkingSpace/update/${id}`,
      data,
    );
    const responseData = response.data as ApiResponse<CoworkingSpaceItem>;

    if ([200, 201].includes(response.status) && responseData.success) {
      return responseData.data;
    }

    throw new Error(responseData.message || "Failed to update coworking space");
  } catch (error: any) {
    console.error("Error updating coworking space:", error);
    throw error;
  }
};

/**
 * Delete a coworking space
 * @param id - Coworking space ID
 * @returns Deletion status
 */
export const deleteCoworkingSpace = async (id: string): Promise<boolean> => {
  try {
    const response = await axiosInstance.delete(`/coworkingSpace/delete/${id}`);
    const responseData = response.data as ApiResponse<any>;

    if ([200, 201].includes(response.status) && responseData.success) {
      return true;
    }

    throw new Error(responseData.message || "Failed to delete coworking space");
  } catch (error: any) {
    console.error("Error deleting coworking space:", error);
    throw error;
  }
};
