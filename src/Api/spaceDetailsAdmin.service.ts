import axios from "axios";
import { API } from "@/api";

export type SpaceDetailsResponse = {
  _id: string;
  userKyc: any;
  spaceName: string;
  sampleAgreementUrl: string;
  ownerOfPremisesName: string;
  ownerOfPremisesEmail: string;
  ownerOfPremisesPhone: string;
  companyType: string;
  cinNumber: string;
  gstNumber: string;
  registeredAddress: string;
  propertyTaxReceiptUrl: string;
  status?: string;
  overallStatus?: string;
  createdAt?: string;
};

export const getAllSpaceDetails = async (): Promise<SpaceDetailsResponse[]> => {
  try {
    const response = await axios.get(
      `${API.domain}/api/spacePartner/space-details`,
      {
        withCredentials: true,
      },
    );
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
  rejectReason?: string,
): Promise<void> => {
  try {
    await axios.put(
      `${API.domain}/api/spacePartner/space-details/${id}/review`,
      { status, rejectReason },
      { withCredentials: true },
    );
  } catch (error: unknown) {
    console.error("Error reviewing space details:", error);
    throw error;
  }
};

export type PropertyData = {
  _id: string;
  name: string;
  address: string;
  city: string;
  area: string;
  features: string[];
  status: string;
  kycStatus: string;
  isActive: boolean;
  voPending?: boolean;
  coworkingPending?: boolean;
  meetingPending?: boolean;
};

export const getPartnerPropertiesData = async (
  kycId: string,
): Promise<PropertyData[]> => {
  try {
    const response = await axios.get(
      `${API.domain}/api/admin/spacePartner/kyc/${kycId}/properties`,
      {
        withCredentials: true,
      },
    );
    if (response.status === 200 && response.data.success) {
      return response.data.data;
    }
    throw new Error(
      response.data?.message || "Failed to fetch partner properties",
    );
  } catch (error: unknown) {
    console.error("Error fetching partner properties data:", error);
    throw error;
  }
};
export const getPartnerPropertiesByUserId = async (
  userId: string,
): Promise<PropertyData[]> => {
  try {
    const response = await axios.get(
      `${API.domain}/api/admin/spacePartner/user/${userId}/properties`,
      {
        withCredentials: true,
      },
    );
    if (response.status === 200 && response.data.success) {
      return response.data.data;
    }
    throw new Error(
      response.data?.message || "Failed to fetch partner properties",
    );
  } catch (error: unknown) {
    console.error("Error fetching partner properties data by userId:", error);
    throw error;
  }
};
