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


const toNumber = (value: any) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
};

const formatMonthPrice = (value: any) => {
  const amount = toNumber(value);
  return amount > 0 ? `₹${amount.toLocaleString()}/mo` : "";
};

/**
 * Get coworking spaces by city
 * @param city - City name
 * @returns Array of coworking spaces in that city
 */
export const getCoworkingSpacesByCity = async (
  city: string,
  page: number = 1,
  limit: number = 12,
  search?: string
): Promise<{ spaces: CoworkingSpaceItem[]; pagination?: any }> => {
  try {
    // console.log(`📍 Fetching coworking spaces for city: ${city}`);
    const response = await axiosInstance.get(
      `/coworkingSpace/getByCity/${city}`,
      { params: { page, limit, search } }
    );
    const data = response.data as ApiResponse<any>;

    if (response.status === 200 && data.success) {
      // Handle both flat array and paginated object responses
      const spaces = Array.isArray(data.data)
        ? data.data
        : data.data?.spaces || data.data?.offices || [];

      console.log(`✅ Successfully fetched ${spaces.length} coworking spaces`);

      // Map backend data to frontend expectations
      return {
        spaces: spaces.map((s: any) => {
          // Find the lowest monthly price in inventory
          const monthlyPrices =
            s.inventory
              ?.filter((i: any) => i.pricePerMonth)
              .map((i: any) => i.pricePerMonth) || [];

          const minPrice =
            monthlyPrices.length > 0 ? Math.min(...monthlyPrices) : 0;

          return {
            ...s,
            coordinates:
              s.coordinates ||
              (Array.isArray(s.location?.coordinates) &&
              s.location.coordinates.length === 2
                ? {
                    lat: s.location.coordinates[1],
                    lng: s.location.coordinates[0],
                  }
                : undefined),
            features: s.amenities || [],
            price:
              (minPrice ? `₹${minPrice.toLocaleString()}/mo` : "") ||
              s.price ||
              formatMonthPrice(s.finalPricePerMonth || s.partnerPricePerMonth) ||
              "Price on request",
            rating: toNumber(s.rating) || toNumber(s.avgRating),
            reviews: toNumber(s.reviews) || toNumber(s.totalReviews),
          };
        }),
        pagination: (response.data as any).pagination,
      };
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
export const getAllCoworkingSpaces = async (
  limit?: number,
): Promise<CoworkingSpaceItem[]> => {
  try {
    const response = await axiosInstance.get(
      `/coworkingSpace/getAll${limit ? `?limit=${limit}` : ""}`,
    );
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
          coordinates:
            s.coordinates ||
            (Array.isArray(s.location?.coordinates) &&
            s.location.coordinates.length === 2
              ? {
                  lat: s.location.coordinates[1],
                  lng: s.location.coordinates[0],
                }
              : undefined),
          features: s.amenities || [],
          price:
            (minPrice ? `₹${minPrice.toLocaleString()}/mo` : "") ||
            s.price ||
            formatMonthPrice(s.finalPricePerMonth || s.partnerPricePerMonth) ||
            "Price on request",
          rating: toNumber(s.rating) || toNumber(s.avgRating),
          reviews: toNumber(s.reviews) || toNumber(s.totalReviews),
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
        coordinates:
          (s as any).coordinates ||
          (Array.isArray((s as any).location?.coordinates) &&
          (s as any).location.coordinates.length === 2
            ? {
                lat: (s as any).location.coordinates[1],
                lng: (s as any).location.coordinates[0],
              }
            : undefined),
        features: (s as any).amenities || [],
        price:
          (minPrice ? `₹${minPrice.toLocaleString()}/mo` : "") ||
          (s as any).price ||
          formatMonthPrice(
            (s as any).finalPricePerMonth || (s as any).partnerPricePerMonth,
          ) ||
          "Price on request",
        rating: toNumber((s as any).rating) || toNumber((s as any).avgRating),
        reviews: toNumber((s as any).reviews) || toNumber((s as any).totalReviews),
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
