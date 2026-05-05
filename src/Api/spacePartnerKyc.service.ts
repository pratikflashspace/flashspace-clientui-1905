import axios, { isAxiosError } from "axios";
import { API } from "@/api";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
}

export type UpsertSpaceUserKycBusinessInfoPayload = {
  companyName?: string;
  companyType?: string;
  industry?: string;
  gstNumber?: string;
  cinRegistrationNumber?: string;
  registeredAddress?: string;
  companyPartners?: string[];
};

export const upsertSpaceUserKycBusinessInfo = async (
  payload: UpsertSpaceUserKycBusinessInfoPayload,
): Promise<SpaceUserKycResponse> => {
  try {
    const response = await axios.put<ApiResponse<SpaceUserKycResponse>>(
      `${API.domain}/api/spacePartner/kyc/business-info`,
      payload,
      { withCredentials: true },
    );

    if (response.status === 200 && response.data.success) {
      return response.data.data as SpaceUserKycResponse;
    }

    throw new Error(
      response.data?.message || "Failed to save KYC business information",
    );
  } catch (error: unknown) {
    console.error("Error saving space user KYC business info:", error);

    const message = isAxiosError(error)
      ? error.response?.data?.message ||
        error.message ||
        "Failed to save KYC business information"
      : error instanceof Error
        ? error.message
        : "Failed to save KYC business information";

    throw new Error(message);
  }
};
// Admin: Get all space partner KYC requests
export const getAllSpacePartnerKyc = async (): Promise<
  SpaceUserKycResponse[]
> => {
  try {
    const response = await axios.get<ApiResponse<SpaceUserKycResponse[]>>(
      `${API.domain}/api/admin/spacePartner/kyc`,
      {
        withCredentials: true,
      },
    );
    if (response.status === 200 && response.data.success) {
      return response.data.data ?? [];
    }
    throw new Error(
      response.data?.message || "Failed to fetch space partner KYC requests",
    );
  } catch (error: unknown) {
    console.error("Error fetching all space partner KYC requests:", error);
    throw error;
  }
};

export type SpaceUserKycResponse = {
  _id?: string;
  id?: string;
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  profilePicture?: string;
  dateOfBirth: string;
  aadhaarNumber: string;
  panNumber: string;
  aadhaarImageUrl?: string;
  panImageUrl?: string;
  videoKycUrl?: string;
  aadhaarImageStatus?: "pending" | "approved" | "rejected";
  panImageStatus?: "pending" | "approved" | "rejected";
  videoKycStatus?: "pending" | "approved" | "rejected";
  aadhaarImageRejectMessage?: string;
  panImageRejectMessage?: string;
  videoKycRejectMessage?: string;
  overallStatus?: "pending" | "approved" | "rejected" | "resubmit";
  kycStatus?: "pending" | "approved" | "rejected" | "resubmit";
  overallRejectMessage?: string;
  // Business info fields
  companyName?: string;
  companyType?: string;
  industry?: string;
  gstNumber?: string;
  cinRegistrationNumber?: string;
  registeredAddress?: string;
  companyPartners?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export const getMySpaceUserKyc =
  async (): Promise<SpaceUserKycResponse | null> => {
    try {
      const response = await axios.get<ApiResponse<SpaceUserKycResponse>>(
        `${API.domain}/api/spacePartner/kyc`,
        {
          withCredentials: true,
        },
      );

      if (response.status === 200 && response.data.success) {
        const userId = response.data.data?.userId;
        if (userId) {
          localStorage.setItem("spaceUserId", userId);
        }

        return response.data.data ?? null;
      }

      throw new Error(response.data?.message || "Failed to fetch KYC details");
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      console.error("Error fetching space user KYC:", error);

      const message = isAxiosError(error)
        ? error.response?.data?.message ||
          error.message ||
          "Failed to fetch KYC details"
        : error instanceof Error
          ? error.message
          : "Failed to fetch KYC details";

      throw new Error(message);
    }
  };

export const submitSpaceUserKyc = async (): Promise<SpaceUserKycResponse> => {
  try {
    const response = await axios.post<ApiResponse<SpaceUserKycResponse>>(
      `${API.domain}/api/spacePartner/kyc/submit`,
      {},
      { withCredentials: true },
    );

    if (response.status === 200 && response.data.success) {
      return response.data.data as SpaceUserKycResponse;
    }

    throw new Error(response.data?.message || "Failed to submit KYC");
  } catch (error: unknown) {
    console.error("Error submitting space user KYC:", error);

    const message = isAxiosError(error)
      ? error.response?.data?.message || error.message || "Failed to submit KYC"
      : error instanceof Error
        ? error.message
        : "Failed to submit KYC";

    throw new Error(message);
  }
};

export type UpsertSpaceUserKycPayload = {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string; // ISO date string (YYYY-MM-DD)
  aadhaarNumber: string;
  panNumber: string;
};

export const upsertSpaceUserKyc = async (
  payload: UpsertSpaceUserKycPayload,
): Promise<SpaceUserKycResponse> => {
  try {
    const response = await axios.put<ApiResponse<SpaceUserKycResponse>>(
      `${API.domain}/api/spacePartner/kyc`,
      payload,
      { withCredentials: true },
    );

    if (response.status === 200 && response.data.success) {
      return response.data.data as SpaceUserKycResponse;
    }

    throw new Error(response.data?.message || "Failed to save KYC information");
  } catch (error: unknown) {
    console.error("Error saving space user KYC:", error);

    const message = isAxiosError(error)
      ? error.response?.data?.message ||
        error.message ||
        "Failed to save KYC information"
      : error instanceof Error
        ? error.message
        : "Failed to save KYC information";

    throw new Error(message);
  }
};

export type SpaceUserKycDocumentType =
  | "aadhaar_image"
  | "pan_image"
  | "video_kyc";

export const uploadSpaceUserKycFile = async (
  documentType: SpaceUserKycDocumentType,
  file: File,
): Promise<SpaceUserKycResponse> => {
  try {
    const formData = new FormData();
    formData.append("documentType", documentType);
    formData.append("file", file);

    const response = await axios.post<ApiResponse<SpaceUserKycResponse>>(
      `${API.domain}/api/spacePartner/kyc/upload`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (response.status === 201 && response.data.success) {
      return response.data.data as SpaceUserKycResponse;
    }

    throw new Error(response.data?.message || "Failed to upload KYC document");
  } catch (error: unknown) {
    console.error("Error uploading space user KYC document:", error);

    const message = isAxiosError(error)
      ? error.response?.data?.message ||
        error.message ||
        "Failed to upload KYC document"
      : error instanceof Error
        ? error.message
        : "Failed to upload KYC document";

    throw new Error(message);
  }
};
