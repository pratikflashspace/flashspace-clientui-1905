import { API } from "@/api";
import axios from "axios";
// import { SpaceProvider, SpaceProviderData } from "@/types/services";

/**
 * Create a new space provider
 * @param spaceProvider - Space provider data to create
 * @returns Created space provider data
 */
export const createSpaceProvider = async (spaceProvider: any) => {
  try {
    const response: any = await axios.post(
      `${API.domain}${API.endPoints.createSpaceProvider}`,
      spaceProvider
    );

    if (response.status === 200 && response.data.success) {
      return response.data.data;
    }

    if (response.data && !response.data.success) {
      throw new Error(response.data.message || "Failed to create space provider");
    }

    throw new Error("Failed to create space provider");
  } catch (error: any) {
    console.error("Error creating space provider:", error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to create space provider");
    }
  }
};

/**
 * Get all space providers
 * @returns Array of all space providers
 */
export const getAllSpaceProviders = async () => {
  try {
    const response: any = await axios.get(
      `${API.domain}${API.endPoints.getAllSpaceProviders}`
    );

    if (response.status === 200 && response.data.success) {
      return response.data.data;
    }

    if (response.data && !response.data.success) {
      throw new Error(response.data.message || "Failed to fetch space providers");
    }

    throw new Error("Failed to fetch space providers");
  } catch (error: any) {
    console.error("Error fetching space providers:", error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to fetch space providers");
    }
  }
};

/**
 * Get space provider by ID
 * @param id - Space provider ID
 * @returns Space provider data
 */
export const getSpaceProviderById = async (id: string) => {
  try {
    const response: any = await axios.get(
      `${API.domain}${API.endPoints.getSpaceProviderById}${id}`
    );

    if (response.status === 200 && response.data.success) {
      return response.data.data;
    }

    if (response.data && !response.data.success) {
      throw new Error(response.data.message || "Failed to fetch space provider");
    }

    throw new Error("Failed to fetch space provider");
  } catch (error: any) {
    console.error("Error fetching space provider:", error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to fetch space provider");
    }
  }
};

/**
 * Update space provider by ID
 * @param id - Space provider ID
 * @param spaceProvider - Updated space provider data
 * @returns Updated space provider data
 */
export const updateSpaceProvider = async (id: string, spaceProvider: any) => {
  try {
    const response: any = await axios.put(
      `${API.domain}${API.endPoints.updateSpaceProvider}${id}`,
      spaceProvider
    );

    if (response.status === 200 && response.data.success) {
      return response.data.data;
    }

    if (response.data && !response.data.success) {
      throw new Error(response.data.message || "Failed to update space provider");
    }

    throw new Error("Failed to update space provider");
  } catch (error: any) {
    console.error("Error updating space provider:", error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to update space provider");
    }
  }
};

/**
 * Delete space provider by ID
 * @param id - Space provider ID
 * @returns Success message
 */
export const deleteSpaceProvider = async (id: string) => {
  try {
    const response: any = await axios.delete(
      `${API.domain}${API.endPoints.deleteSpaceProvider}${id}`
    );

    if (response.status === 200 && response.data.success) {
      return response.data.message || "Space provider deleted successfully";
    }

    if (response.data && !response.data.success) {
      throw new Error(response.data.message || "Failed to delete space provider");
    }

    throw new Error("Failed to delete space provider");
  } catch (error: any) {
    console.error("Error deleting space provider:", error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to delete space provider");
    }
  }
};
