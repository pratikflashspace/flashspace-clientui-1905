import axiosInstance from "./api.service";
import { Property, ApiResponse } from "@/types/services";

/**
 * Property Service
 * Handles all API calls related to standalone property management
 */

export const createProperty = async (
  data: Partial<Property>,
): Promise<Property> => {
  try {
    const response = await axiosInstance.post("/property/create", data);
    const responseData = response.data as ApiResponse<Property>;

    if (response.status === 201 && responseData.success && responseData.data) {
      return responseData.data;
    }

    throw new Error(responseData.message || "Failed to create property");
  } catch (error: any) {
    console.error("Error creating property:", error);
    throw error;
  }
};

export const updateProperty = async (
  id: string,
  data: Partial<Property>,
): Promise<Property> => {
  try {
    const response = await axiosInstance.put(`/property/update/${id}`, data);
    const responseData = response.data as ApiResponse<Property>;

    if (response.status === 200 && responseData.success && responseData.data) {
      return responseData.data;
    }

    throw new Error(responseData.message || "Failed to update property");
  } catch (error: any) {
    console.error("Error updating property:", error);
    throw error;
  }
};

export const getPropertyById = async (id: string): Promise<Property> => {
  try {
    const response = await axiosInstance.get(`/property/${id}`);
    const responseData = response.data as ApiResponse<Property>;

    if (response.status === 200 && responseData.success && responseData.data) {
      return responseData.data;
    }

    throw new Error(responseData.message || "Failed to fetch property");
  } catch (error: any) {
    console.error("Error fetching property:", error);
    throw error;
  }
};

export const getPropertySpaces = async (
  id: string,
  type?: string,
): Promise<any> => {
  try {
    const url = type
      ? `/property/${id}/spaces?type=${type}`
      : `/property/${id}/spaces`;
    const response = await axiosInstance.get(url);
    const responseData = response.data as ApiResponse<any>;

    if (response.status === 200 && responseData.success && responseData.data) {
      return responseData.data;
    }

    throw new Error(responseData.message || "Failed to fetch property spaces");
  } catch (error: any) {
    console.error("Error fetching property spaces:", error);
    throw error;
  }
};

export const getPartnerProperties = async (): Promise<Property[]> => {
  try {
    const response = await axiosInstance.get("/property/partner/all");
    const responseData = response.data as ApiResponse<Property[]>;

    if (response.status === 200 && responseData.success && responseData.data) {
      return responseData.data;
    }

    throw new Error(
      responseData.message || "Failed to fetch partner properties",
    );
  } catch (error: any) {
    console.error("Error fetching partner properties:", error);
    throw error;
  }
};

export const getPropertyBookingsForPartner = async (
  propertyId: string,
): Promise<any[]> => {
  try {
    const response = await axiosInstance.get(
      `/user/partner/property/${propertyId}/bookings`,
    );
    const responseData = response.data as ApiResponse<any[]>;

    if (response.status === 200 && responseData.success && responseData.data) {
      return responseData.data;
    }

    throw new Error(
      responseData.message || "Failed to fetch property bookings",
    );
  } catch (error: any) {
    console.error("Error fetching property bookings:", error);
    throw error;
  }
};

export const deleteProperty = async (id: string): Promise<boolean> => {
  try {
    const response = await axiosInstance.delete(`/property/delete/${id}`);
    const responseData = response.data as ApiResponse<any>;

    if (response.status === 200 && responseData.success) {
      return true;
    }

    throw new Error(responseData.message || "Failed to delete property");
  } catch (error: any) {
    console.error("Error deleting property:", error);
    throw error;
  }
};

const propertyService = {
  createProperty,
  updateProperty,
  getPropertyById,
  getPropertySpaces,
  getParameterProperties: getPartnerProperties,
  getPropertyBookingsForPartner,
  deleteProperty,
};

export default propertyService;
