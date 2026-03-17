export type ClientStatus = "ACTIVE" | "EXPIRING_SOON" | "INACTIVE";
export type KycStatus = "VERIFIED" | "PENDING";

export type ClientPlan = string;

export type Client = {
  id: string; // bookingNumber
  bookingId?: string; // raw MongoDB _id of the booking (for ticket lookups)
  userId: string;

  companyName: string;
  contactName: string;
  email?: string;
  phone?: string;

  plan: ClientPlan;

  space: string; // example: "Mumbai - BKC"

  startDate: string; // ISO date string (YYYY-MM-DD)
  endDate: string; // ISO date string (YYYY-MM-DD)

  status: ClientStatus;
  kycStatus: KycStatus;

  dealValue?: number;
  createdAt?: string;
};
