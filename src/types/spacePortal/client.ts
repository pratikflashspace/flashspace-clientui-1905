export type ClientStatus = "ACTIVE" | "EXPIRING_SOON" | "INACTIVE";
export type KycStatus = "VERIFIED" | "PENDING";

export type ClientPlan = string;

export type Client = {
  id: string; // bookingNumber
  bookingId?: string; // raw MongoDB _id of the booking (for ticket lookups)
  bookingNumber?: string;
  invoiceNumber?: string;
  userId: string;

  companyName: string;
  contactName: string;
  email?: string;
  phone?: string;

  plan: ClientPlan;

  space: string; // example: "Mumbai - BKC"
  spaceId?: string;
  workspace?: string;
  location?: string;
  city?: string;
  type?: string;

  startDate: string; // ISO date string (YYYY-MM-DD)
  endDate: string; // ISO date string (YYYY-MM-DD)

  status: ClientStatus;
  subscriptionStatus?: ClientStatus;
  subscriptionSubStatus?: string;
  rawSubscriptionSubStatus?: string;
  kycStatus: KycStatus;
  kycType?: string;

  dealValue?: number;
  createdAt?: string;
};
