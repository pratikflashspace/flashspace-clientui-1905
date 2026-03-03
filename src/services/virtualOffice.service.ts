import axiosInstance from "./api.service";
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

/**
 * Get virtual offices by city
 * @param city - City name
 * @returns Array of virtual offices in that city
 */
export const getVirtualOfficesByCity = async (
  city: string,
): Promise<VirtualOfficeItem[]> => {
  try {
    console.log(`📍 Fetching virtual offices for city: ${city}`);
    const response = await axiosInstance.get(
      `/virtualOffice/getByCity/${city}`,
    );
    const data = response.data as ApiResponse<any>;

    if (response.status === 200 && data.success) {
      // Handle both flat array and paginated object responses
      const offices = Array.isArray(data.data)
        ? data.data
        : data.data?.offices || [];

      console.log(`✅ Successfully fetched ${offices.length} virtual offices`);

      // Map backend data to frontend expectations
      return offices.map((o: any) => ({
        ...o,
        features: o.features || [],
        gstPlanPrice: o.gstPlanPricePerYear
          ? `₹${o.gstPlanPricePerYear.toLocaleString()}/yr`
          : "",
        mailingPlanPrice: o.mailingPlanPricePerYear
          ? `₹${o.mailingPlanPricePerYear.toLocaleString()}/yr`
          : "",
        brPlanPrice: o.brPlanPricePerYear
          ? `₹${o.brPlanPricePerYear.toLocaleString()}/yr`
          : "",
        image: o.images?.[0] || "",
        rating: o.avgRating || 0,
        reviews: o.totalReviews || 0,
      }));
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
 * Get all virtual offices
 * @returns Array of all virtual offices
 */
export const getAllVirtualOffices = async (): Promise<VirtualOfficeItem[]> => {
  try {
    const response = await axiosInstance.get("/virtualOffice/getAll");
    const data = response.data as ApiResponse<any>;

    if (response.status === 200 && data.success) {
      // Handle both flat array and paginated object responses
      const offices = Array.isArray(data.data)
        ? data.data
        : data.data?.offices || [];

      return offices.map((o: any) => ({
        ...o,
        features: o.features || [],
        gstPlanPrice: o.gstPlanPricePerYear
          ? `₹${o.gstPlanPricePerYear.toLocaleString()}/yr`
          : "",
        mailingPlanPrice: o.mailingPlanPricePerYear
          ? `₹${o.mailingPlanPricePerYear.toLocaleString()}/yr`
          : "",
        brPlanPrice: o.brPlanPricePerYear
          ? `₹${o.brPlanPricePerYear.toLocaleString()}/yr`
          : "",
        image: o.images?.[0] || "",
        rating: o.avgRating || 0,
        reviews: o.totalReviews || 0,
      }));
    }

    throw new Error(data.message || "Failed to fetch virtual offices");
  } catch (error: any) {
    console.error("Error fetching virtual offices:", error);
    throw error;
  }
};

/**
 * Get virtual office by ID
 * @param id - Virtual office ID
 * @returns Virtual office details
 */
export const getVirtualOfficeById = async (
  id: string,
): Promise<VirtualOfficeItem> => {
  try {
    const response = await axiosInstance.get(`/virtualOffice/getById/${id}`);
    const data = response.data as ApiResponse<VirtualOfficeItem>;

    if (response.status === 200 && data.success) {
      const o = data.data;
      return {
        ...o,
        features: o.features || [],
        gstPlanPrice: (o as any).gstPlanPricePerYear
          ? `₹${(o as any).gstPlanPricePerYear.toLocaleString()}/yr`
          : "",
        mailingPlanPrice: (o as any).mailingPlanPricePerYear
          ? `₹${(o as any).mailingPlanPricePerYear.toLocaleString()}/yr`
          : "",
        brPlanPrice: (o as any).brPlanPricePerYear
          ? `₹${(o as any).brPlanPricePerYear.toLocaleString()}/yr`
          : "",
        image: o.image || (o as any).images?.[0] || "",
        rating: o.rating || (o as any).avgRating || 0,
        reviews: o.reviews || (o as any).totalReviews || 0,
      };
    }

    throw new Error(data.message || "Failed to fetch virtual office");
  } catch (error: any) {
    console.error("Error fetching virtual office:", error);
    throw error;
  }
};

/**
 * Create a new virtual office
 * @param data - Virtual office data
 * @returns Created virtual office
 */
export const createVirtualOffice = async (
  data: Partial<VirtualOfficeItem>,
): Promise<VirtualOfficeItem> => {
  try {
    const response = await axiosInstance.post("/virtualOffice/create", data);
    const responseData = response.data as ApiResponse<VirtualOfficeItem>;

    if (response.status === 200 && responseData.success) {
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
 * @param id - Virtual office ID
 * @param data - Updated virtual office data
 * @returns Updated virtual office
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

    if (response.status === 200 && responseData.success) {
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
 * @param id - Virtual office ID
 * @returns Deletion status
 */
export const deleteVirtualOffice = async (id: string): Promise<boolean> => {
  try {
    const response = await axiosInstance.delete(`/virtualOffice/delete/${id}`);
    const responseData = response.data as ApiResponse<any>;

    if (response.status === 200 && responseData.success) {
      return true;
    }

    throw new Error(responseData.message || "Failed to delete virtual office");
  } catch (error: any) {
    console.error("Error deleting virtual office:", error);
    throw error;
  }
};
