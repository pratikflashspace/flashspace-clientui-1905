import axios from "axios";
import { API } from "@/api";
import { SpaceUserKycResponse, ApiResponse } from "./spacePartnerKyc.service";

export type KycDecisionStatus = "pending" | "approved" | "rejected";
export type SpaceUserKycDocumentType =
  | "aadhaar_image"
  | "pan_image"
  | "video_kyc";

export const reviewSpaceUserKycDocument = async (
  userId: string,
  documentType: SpaceUserKycDocumentType,
  status: KycDecisionStatus,
  rejectMessage?: string,
): Promise<SpaceUserKycResponse> => {
  const response = await axios.put<ApiResponse<SpaceUserKycResponse>>(
    `${API.domain}/api/admin/spacePartner/kyc/document/review`,
    { userId, documentType, status, rejectMessage },
    { withCredentials: true },
  );
  if (response.status === 200 && response.data.success) {
    return response.data.data;
  }
  throw new Error(response.data?.message || "Failed to review document");
};

export const reviewSpaceUserKycOverall = async (
  userId: string,
  status: KycDecisionStatus,
  rejectMessage?: string,
): Promise<SpaceUserKycResponse> => {
  const response = await axios.put<ApiResponse<SpaceUserKycResponse>>(
    `${API.domain}/api/admin/spacePartner/kyc/overall/review`,
    { userId, status, rejectMessage },
    { withCredentials: true },
  );
  if (response.status === 200 && response.data.success) {
    return response.data.data;
  }
  throw new Error(response.data?.message || "Failed to review overall KYC");
};
