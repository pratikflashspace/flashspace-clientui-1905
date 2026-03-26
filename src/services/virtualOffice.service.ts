import axiosInstance from "@/lib/axios";
import { VirtualOfficeItem } from "@/types/services";

/**
 * Virtual Office Service
 * Handles all API calls related to virtual offices
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

const formatYearPrice = (value: any) => {
  const amount = toNumber(value);
  return amount > 0 ? `₹${amount.toLocaleString()}/yr` : "";
};

type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  nextPage?: number | null;
  prevPage?: number | null;
};

/**
 * Get virtual offices by city
 * Supports pagination via page + limit
 */
export const getVirtualOfficesByCity = async (
  city: string,
  page: number = 1,
  limit: number = 12,
): Promise<{ offices: VirtualOfficeItem[]; pagination?: PaginationMeta }> => {
  try {
    const response = await axiosInstance.get(
      `/virtualOffice/getByCity/${city}`,
      { params: { page, limit } },
    );
    const data = response.data as ApiResponse<any>;

    if ([200, 201].includes(response.status) && data.success) {
      // Backend returns either an array directly or a paginated object { offices: [], total: 0, ... }
      const offices = Array.isArray(data.data)
        ? data.data
        : (data.data as any).offices;
      const pagination = (response.data as any).pagination as
        | PaginationMeta
        | undefined;

      const mapped = offices.map((o: any) => ({
        ...o,
        coordinates:
          o.coordinates ||
          (Array.isArray(o.location?.coordinates) &&
          o.location.coordinates.length === 2
            ? {
                lat: o.location.coordinates[1],
                lng: o.location.coordinates[0],
              }
            : undefined),
        features: o.features || [],
        gstPlanPrice:
          o.gstPlanPrice ||
          formatYearPrice(o.gstPlanPricePerYear || o.finalGstPricePerYear),
        mailingPlanPrice:
          o.mailingPlanPrice ||
          formatYearPrice(
            o.mailingPlanPricePerYear || o.finalMailingPricePerYear,
          ),
        brPlanPrice:
          o.brPlanPrice ||
          formatYearPrice(o.brPlanPricePerYear || o.finalBrPricePerYear),
        rating: toNumber(o.rating) || toNumber(o.avgRating),
        reviews: toNumber(o.reviews) || toNumber(o.totalReviews),
      }));

      return { offices: mapped, pagination };
    }

    throw new Error(data.message || "Failed to fetch virtual offices");
  } catch (error: any) {
    console.error("❌ Error fetching virtual offices:", {
      error: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

/**
 * Get all virtual offices (optionally paginated by backend defaults)
 */
export const getAllVirtualOffices = async (): Promise<{
  offices: VirtualOfficeItem[];
  pagination?: PaginationMeta;
}> => {
  try {
    const response = await axiosInstance.get("/virtualOffice/getAll");
    const data = response.data as ApiResponse<any>;

    if ([200, 201].includes(response.status) && data.success) {
      const offices = Array.isArray(data.data)
        ? data.data
        : data.data?.offices || [];
      const pagination = (response.data as any).pagination as
        | PaginationMeta
        | undefined;

      const mapped = offices.map((o: any) => ({
        ...o,
        coordinates:
          o.coordinates ||
          (Array.isArray(o.location?.coordinates) &&
          o.location.coordinates.length === 2
            ? {
                lat: o.location.coordinates[1],
                lng: o.location.coordinates[0],
              }
            : undefined),
        features: o.features || [],
        gstPlanPrice:
          o.gstPlanPrice ||
          formatYearPrice(o.gstPlanPricePerYear || o.finalGstPricePerYear),
        mailingPlanPrice:
          o.mailingPlanPrice ||
          formatYearPrice(
            o.mailingPlanPricePerYear || o.finalMailingPricePerYear,
          ),
        brPlanPrice:
          o.brPlanPrice ||
          formatYearPrice(o.brPlanPricePerYear || o.finalBrPricePerYear),
        rating: toNumber(o.rating) || toNumber(o.avgRating),
        reviews: toNumber(o.reviews) || toNumber(o.totalReviews),
      }));

      return { offices: mapped, pagination };
    }

    throw new Error(data.message || "Failed to fetch virtual offices");
  } catch (error: any) {
    console.error("Error fetching virtual offices:", error);
    throw error;
  }
};

/**
 * Get virtual office by ID
 */
export const getVirtualOfficeById = async (
  id: string,
): Promise<VirtualOfficeItem> => {
  try {
    const response = await axiosInstance.get(`/virtualOffice/getById/${id}`);
    const data = response.data as ApiResponse<VirtualOfficeItem>;

    if ([200, 201].includes(response.status) && data.success) {
      return data.data;
    }

    throw new Error(data.message || "Failed to fetch virtual office");
  } catch (error: any) {
    console.error("Error fetching virtual office:", error);
    throw error;
  }
};

/**
 * Create a new virtual office
 */
export const createVirtualOffice = async (
  data: Partial<VirtualOfficeItem>,
): Promise<VirtualOfficeItem> => {
  try {
    const response = await axiosInstance.post("/virtualOffice/create", data);
    const responseData = response.data as ApiResponse<VirtualOfficeItem>;

    if ([200, 201].includes(response.status) && responseData.success) {
      return responseData.data;
    }

    throw new Error(responseData.message || "Failed to create virtual office");
  } catch (error: any) {
    console.error("Error creating virtual office:", error);
    throw error;
  }
};

/**
 * Update a virtual office
 */
export const updateVirtualOffice = async (
  id: string,
  data: Partial<VirtualOfficeItem>,
): Promise<VirtualOfficeItem> => {
  try {
    const response = await axiosInstance.put(
      `/virtualOffice/update/${id}`,
      data,
    );
    const responseData = response.data as ApiResponse<VirtualOfficeItem>;

    if ([200, 201].includes(response.status) && responseData.success) {
      return responseData.data;
    }

    throw new Error(responseData.message || "Failed to update virtual office");
  } catch (error: any) {
    console.error("Error updating virtual office:", error);
    throw error;
  }
};

/**
 * Delete a virtual office
 */
export const deleteVirtualOffice = async (id: string): Promise<boolean> => {
  try {
    const response = await axiosInstance.delete(`/virtualOffice/delete/${id}`);
    const responseData = response.data as ApiResponse<any>;

    if ([200, 201].includes(response.status) && responseData.success) {
      return true;
    }

    throw new Error(responseData.message || "Failed to delete virtual office");
  } catch (error: any) {
    console.error("Error deleting virtual office:", error);
    throw error;
  }
};

/**
 * Get all cities that have at least one active workspace.
 * Derived client-side by fetching all three workspace types and extracting unique city values.
 */
export const getAvailableCities = async (): Promise<string[]> => {
  try {
    const [voRes, cwRes, mrRes] = await Promise.allSettled([
      axiosInstance.get<ApiResponse<any>>("/virtualOffice/getAll"),
      axiosInstance.get<ApiResponse<any>>("/coworkingSpace/getAll"),
      axiosInstance.get<ApiResponse<any>>("/meetingRoom/getAll"),
    ]);

    const extractItems = (result: PromiseSettledResult<any>): any[] => {
      if (result.status !== "fulfilled") return [];
      const data = result.value.data;
      if (!data?.success) return [];
      const raw = data.data;
      if (Array.isArray(raw)) return raw;
      return raw?.offices || raw?.spaces || raw?.rooms || [];
    };

    const allItems = [
      ...extractItems(voRes),
      ...extractItems(cwRes),
      ...extractItems(mrRes),
    ];

    const cities = new Set<string>();
    for (const item of allItems) {
      const city = item?.city || item?.area;
      if (city && typeof city === "string" && city.trim().length > 1) {
        cities.add(city.trim());
      }
    }

    return Array.from(cities).sort();
  } catch (error: any) {
    console.error("Error fetching available cities:", error);
    return [];
  }
};
