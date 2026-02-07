export type ClientStatus = "ACTIVE" | "EXPIRING_SOON" | "INACTIVE";
export type KycStatus = "VERIFIED" | "PENDING";

export type ClientPlan =
  | "Virtual Office Premium"
  | "Virtual Office Standard"
  | "Team Space"
  | "Hot Desk Monthly";

export type Client = {
  id: string;

  companyName: string;
  contactName: string;

  plan: ClientPlan;

  space: string; // example: "Mumbai - BKC"

  startDate: string; // ISO date string (YYYY-MM-DD)
  endDate: string;   // ISO date string (YYYY-MM-DD)

  status: ClientStatus;
  kycStatus: KycStatus;
};
