import axiosInstance from "@/lib/axios";
import { SpaceUserKycResponse, ApiResponse } from "./spacePartnerKyc.service";

export type KycDecisionStatus = "pending" | "approved" | "rejected";
export type SpaceUserKycDocumentType =
  | "aadhaar_image"
  | "pan_image"
  | "video_kyc"
  | "company_registration"
  | "gst_certificate"
  | "bank_details_proof"
  | "address_proof";

export const reviewSpaceUserKycDocument = async (
  userId: string,
  documentType: SpaceUserKycDocumentType,
  status: KycDecisionStatus,
  rejectMessage?: string,
): Promise<SpaceUserKycResponse> => {
  const response = await axiosInstance.put<ApiResponse<SpaceUserKycResponse>>(
    "/api/admin/spacePartner/kyc/document/review",
    { userId, documentType, status, rejectMessage },
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
  const response = await axiosInstance.put<ApiResponse<SpaceUserKycResponse>>(
    "/api/admin/spacePartner/kyc/overall/review",
    { userId, status, rejectMessage },
  );
  if (response.status === 200 && response.data.success) {
    return response.data.data;
  }
  throw new Error(response.data?.message || "Failed to review overall KYC");
};
