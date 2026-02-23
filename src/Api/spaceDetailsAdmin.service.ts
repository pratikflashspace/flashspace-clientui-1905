import axios from "axios";
import { API } from "@/api";

export type SpaceDetailsResponse = {
  _id: string;
  userKyc: string;
  spaceName: string;
  sampleAgreementUrl: string;
  ownerOfPremisesName: string;
  propertyTaxReceiptUrl: string;
  status?: string;
  createdAt?: string;
};

export const getAllSpaceDetails = async (): Promise<SpaceDetailsResponse[]> => {
  try {
    const response = await axios.get(`${API.domain}/api/spacePartner/space-details`, {
      withCredentials: true,
    });
    if (response.status === 200 && response.data.success) {
      return response.data.data ?? [];
    }
    throw new Error(response.data?.message || "Failed to fetch space details");
  } catch (error: unknown) {
    console.error("Error fetching all space details:", error);
    throw error;
  }
};

export const reviewSpaceDetails = async (
  id: string,
  status: string,
  rejectReason?: string
): Promise<void> => {
  try {
    await axios.put(
      `${API.domain}/api/spacePartner/space-details/${id}/review`,
      { status, rejectReason },
      { withCredentials: true }
    );
  } catch (error: unknown) {
    console.error("Error reviewing space details:", error);
    throw error;
  }
};
