export type ClientStatus = "ACTIVE" | "EXPIRING_SOON" | "INACTIVE";
export type KycStatus = "VERIFIED" | "PENDING";

export type ClientPlan = string;

export type Client = {
  id: string;
  userId: string;

  companyName: string;
  contactName: string;

  plan: ClientPlan;

  space: string; // example: "Mumbai - BKC"

  startDate: string; // ISO date string (YYYY-MM-DD)
  endDate: string; // ISO date string (YYYY-MM-DD)

  status: ClientStatus;
  kycStatus: KycStatus;
};
